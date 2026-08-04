#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "⬇️  Pulling latest changes..."
git pull

echo ""
echo "📦 Building frontend..."
cd frontend
npm ci --silent
npm run build
cd ..

echo ""
echo "🐳 Rebuilding & restarting Docker containers..."
docker compose up -d --build

echo ""
echo "✅ Deploy complete!"
docker compose ps
