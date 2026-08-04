#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

# ── Colors ──────────────────────────────────────────────────
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ── Banner ──────────────────────────────────────────────────
echo -e "${CYAN}${BOLD}"
echo "  ╔══════════════════════════════════════════╗"
echo "  ║           Excel-lenz  ·  Deploy          ║"
echo "  ╚══════════════════════════════════════════╝"
echo -e "${NC}"

START_TIME=$(date +%s)
STEP=0
OK=0
FAIL=0

step() { STEP=$((STEP + 1)); echo -e "\n${BOLD}── Paso ${STEP}: $1${NC}"; }

ok() {
  OK=$((OK + 1))
  echo -e "    ${GREEN}OK${NC}  $1"
}

fail() {
  FAIL=$((FAIL + 1))
  echo -e "    ${RED}FAIL${NC} $1" >&2
}

# ── Step 1: Git Pull ────────────────────────────────────────
step "Actualizar código fuente"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT_BEFORE=$(git rev-parse --short HEAD)

echo -e "   Rama  : ${YELLOW}${BRANCH}${NC}"
echo -e "   Commit: ${YELLOW}${COMMIT_BEFORE}${NC}"

if GIT_OUTPUT=$(git pull --ff-only 2>&1); then
  COMMIT_AFTER=$(git rev-parse --short HEAD)
  if [ "$COMMIT_BEFORE" != "$COMMIT_AFTER" ]; then
    ok "Pull exitoso  (${COMMIT_BEFORE} → ${COMMIT_AFTER})"
  else
    ok "Ya actualizado (${COMMIT_AFTER})"
  fi
else
  echo "$GIT_OUTPUT" | tail -5
  fail "Error en git pull"
  exit 1
fi

# ── Step 2: Frontend Build ──────────────────────────────────
step "Construir frontend"

cd frontend

NPM_OUTPUT=$(npm ci 2>&1) && NPM_OK=true || NPM_OK=false
echo "$NPM_OUTPUT" | grep -iE "error|warn|added|up to date|audited" || true
if $NPM_OK; then
  ok "Dependencias instaladas"
else
  echo "$NPM_OUTPUT" | tail -10
  fail "Error en npm ci"
  exit 1
fi

# Capture build output, show warnings/errors, and fail on actual errors
BUILD_OUTPUT=$(npm run build 2>&1) && BUILD_OK=true || BUILD_OK=false

# Always show warnings (like chunk size)
echo "$BUILD_OUTPUT" | grep -E "WARNING|Warning|warning|error|Error|✓ built|✗" || true

if $BUILD_OK; then
  ok "Build completado"
else
  echo "$BUILD_OUTPUT" | tail -20
  fail "Error en el build"
  exit 1
fi

cd ..

# ── Step 3: Docker Compose ──────────────────────────────────
step "Desplegar contenedores Docker"

DOCKER_OUTPUT=$(docker compose up --detach --build 2>&1) && DOCKER_OK=true || DOCKER_OK=false

# Show only warnings/errors from Docker build
echo "$DOCKER_OUTPUT" | grep -iE "warn|error|fail|done|started|created" || true

if $DOCKER_OK; then
  ok "Contenedores iniciados"
else
  echo "$DOCKER_OUTPUT" | tail -20
  fail "Error al iniciar contenedores"
  exit 1
fi

# ── Step 4: Health Check ────────────────────────────────────
step "Verificar estado"

# Wait up to 30s for both services to be healthy
for i in $(seq 1 15); do
  UNHEALTHY=$(docker compose ps --format json 2>/dev/null | grep -v '"Health":"healthy"' | wc -l)
  if [ "$UNHEALTHY" -eq 0 ]; then
    break
  fi
  sleep 2
done

if docker compose ps --format "table {{.Name}}\t{{.Status}}" 2>/dev/null; then
  ok "Estado de servicios"
else
  fail "No se pudo obtener estado"
fi

# ── Cleanup ─────────────────────────────────────────────────
echo ""
if docker image prune -f 2>/dev/null | grep -q "deleted"; then
  echo -e "   ${YELLOW}Imagenes antiguas eliminadas${NC}"
fi

# ── Summary ─────────────────────────────────────────────────
ELAPSED=$(($(date +%s) - START_TIME))
echo ""
echo -e "${BOLD}══════════════════════════════════════════════${NC}"
echo -e "   ${GREEN}Deploy finalizado${NC} en ${YELLOW}${ELAPSED}s${NC}"
echo -e "   Pasos: ${GREEN}${OK} OK${NC} / ${RED}${FAIL} errores${NC}"
echo -e "   ${CYAN}https://excel-lenz.com${NC}"
echo -e "${BOLD}══════════════════════════════════════════════${NC}"
