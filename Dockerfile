# ═══════════════════════════════════════════════════════════
# Excel-lenz — Multi-stage Docker Build
# ═══════════════════════════════════════════════════════════

# ── Stage 1: Frontend Build ─────────────────────────────
FROM node:25-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Backend Build ──────────────────────────────
FROM node:25-alpine AS backend-build
RUN apk add --no-cache python3 make g++
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npx tsc
# Remove devDependencies for production to reduce attack surface
RUN npm prune --omit=dev

# ── Stage 3: Production ─────────────────────────────────
FROM node:25-alpine
WORKDIR /app

# sqlite CLI for analytics/debugging
RUN apk add --no-cache sqlite

RUN addgroup -g 1001 -S excel-lenz && \
    adduser -S excel-lenz -u 1001 -G excel-lenz

COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/package*.json ./
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=frontend-build /app/frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/app/data/excel-lenz.db

RUN mkdir -p /app/data && chown -R excel-lenz:excel-lenz /app
USER excel-lenz
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/server.js"]
