#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

# ── Colors ──────────────────────────────────────────────────
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
DIM='\033[2m'
NC='\033[0m'

# ── Banner ──────────────────────────────────────────────────
clear
echo -e "${CYAN}${BOLD}"
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║          Excel-lenz  ·  Dev Server           ║"
echo "  ╚══════════════════════════════════════════════╝"
echo -e "${NC}"

START_TIME=$(date +%s)
STEP=0
OK=0
FAIL=0
WARN=0

# ── Helpers ─────────────────────────────────────────────────
step() { STEP=$((STEP + 1)); echo -e "\n${BOLD}── Paso ${STEP}: $1${NC}"; }
ok()   { OK=$((OK + 1));   echo -e "    ${GREEN}OK${NC}   $1"; }
warn() { WARN=$((WARN + 1)); echo -e "    ${YELLOW}WARN${NC}  $1"; }
fail() { FAIL=$((FAIL + 1)); echo -e "    ${RED}FAIL${NC}  $1"; }

# ── Config ──────────────────────────────────────────────────
BACKEND_PORT=3001
BACKEND_URL="http://127.0.0.1:${BACKEND_PORT}"
JWT_SECRET="${JWT_SECRET:-dev-secret-key-not-for-production}"
BACKEND_PID=""
FRONTEND_PID=""

is_port_free() {
  python3 - "$1" <<'PY'
import socket, sys
port = int(sys.argv[1])
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind(("127.0.0.1", port))
    except OSError:
        sys.exit(1)
    sys.exit(0)
PY
}

choose_port() {
  for port in 5173 5174 5175 5176; do
    if is_port_free "$port"; then
      echo "$port"
      return 0
    fi
  done
  echo "5173"
}

cleanup() {
  echo -e "\n${DIM}Shutting down...${NC}"
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
    wait "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

# ── Paso 1: Cleanup ─────────────────────────────────────────
step "Limpiar instancias previas"

killed=0
for proc in 'tsx.*src/server' 'vite.*host 127'; do
  if pkill -f "$proc" 2>/dev/null; then
    killed=1
  fi
done

if [[ $killed -eq 1 ]]; then
  ok "Procesos anteriores terminados"
  sleep 1
else
  ok "Sin procesos residuales"
fi

# ── Paso 2: Ports ───────────────────────────────────────────
step "Verificar puertos"

FRONTEND_PORT="$(choose_port)"

if is_port_free "$BACKEND_PORT"; then
  ok "Backend  :${BACKEND_PORT}  libre"
else
  warn "Backend  :${BACKEND_PORT}  en uso — se intentara reutilizar"
fi
ok "Frontend :${FRONTEND_PORT}  seleccionado"

# ── Paso 3: Backend ─────────────────────────────────────────
step "Iniciar backend"

cd backend
JWT_SECRET="$JWT_SECRET" npx tsx src/server.ts &
BACKEND_PID=$!
cd ..

for i in {1..30}; do
  if curl -s "${BACKEND_URL}/api/health" > /dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

if kill -0 "$BACKEND_PID" 2>/dev/null; then
  ok "Backend  → ${BACKEND_URL}"
else
  fail "Backend no pudo iniciar"
  exit 1
fi

# ── Paso 4: Frontend ────────────────────────────────────────
step "Iniciar frontend"

cd frontend
npx vite --host 127.0.0.1 --port "$FRONTEND_PORT" &
FRONTEND_PID=$!
cd ..

sleep 2
if kill -0 "$FRONTEND_PID" 2>/dev/null; then
  ok "Frontend → http://127.0.0.1:${FRONTEND_PORT}"
else
  fail "Frontend no pudo iniciar"
  exit 1
fi

# ── Summary ─────────────────────────────────────────────────
ELAPSED=$(($(date +%s) - START_TIME))
echo ""
echo -e "${BOLD}══════════════════════════════════════════════${NC}"
echo -e "   ${GREEN}Dev server listo${NC}  (${YELLOW}${ELAPSED}s${NC})"
echo -e "   ${CYAN}http://127.0.0.1:${FRONTEND_PORT}${NC}"
echo -e "   ${DIM}Ctrl+C para detener${NC}"
echo -e "${BOLD}══════════════════════════════════════════════${NC}"
echo ""

wait -n "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true

