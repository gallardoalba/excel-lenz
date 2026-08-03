#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

is_port_free() {
  python3 - "$1" <<'PY'
import socket
import sys

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
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

cleanup_previous() {
  pkill -f 'tsx src/server.ts' 2>/dev/null || true
  pkill -f 'vite --host 127.0.0.1' 2>/dev/null || true
  pkill -f 'vite$' 2>/dev/null || true
}

cleanup_previous
FRONTEND_PORT="$(choose_port)"

echo "Starting backend on http://127.0.0.1:3001"
(cd backend && JWT_SECRET=dev-secret-key-not-for-production npx tsx src/server.ts) &
BACKEND_PID=$!

echo "Starting frontend on http://127.0.0.1:${FRONTEND_PORT}"
(cd frontend && npx vite --host 127.0.0.1 --port "$FRONTEND_PORT") &
FRONTEND_PID=$!

echo "Open http://127.0.0.1:${FRONTEND_PORT}"

wait -n "$BACKEND_PID" "$FRONTEND_PID"
status=$?
if [[ $status -ne 0 ]]; then
  cleanup
  exit "$status"
fi
