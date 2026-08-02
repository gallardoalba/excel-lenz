# Excel-lenz — Deployment Guide

## Schnellstart (Lokal)

```bash
# Backend
cd backend && npm install && npx tsx src/db/seed.ts && npx tsx src/server.ts

# Frontend (separates Terminal)
cd frontend && npm install && npx vite
```

→ Backend: http://localhost:3001 | Frontend: http://localhost:5173

## Produktion mit Docker

```bash
# .env anlegen
cp .env.example .env
# JWT_SECRET in .env ändern!

# Build & Start
docker compose up -d --build

# Logs
docker compose logs -f api

# Neustart
docker compose restart

# Stoppen
docker compose down
```

→ http://localhost (Port 80)

## Manuelles Deployment

### Backend

```bash
cd backend
npm ci --only=production
npx tsc                          # TypeScript → JavaScript
NODE_ENV=production node dist/server.js
```

### Frontend

```bash
cd frontend
npm ci
npm run build                    # → dist/
# Statische Dateien über Nginx/nginx servieren
```

## Nginx-Konfiguration

Die `nginx.conf` im Root-Verzeichnis ist eine vollständige Reverse-Proxy-Konfiguration:
- API-Rate-Limiting (30 req/s, Login 5 req/min)
- Gzip-Kompression
- Security-Headers (X-Frame-Options, X-XSS-Protection, etc.)
- SPA-Fallback (`try_files $uri /index.html`)
- Static-Asset-Caching (30 Tage)

## Umgebungsvariablen

| Variable | Default | Beschreibung |
|----------|---------|-------------|
| `PORT` | 3001 | API-Port |
| `NODE_ENV` | production | Umgebung |
| `DB_TYPE` | sqlite | sqlite oder postgres |
| `DATABASE_URL` | — | PostgreSQL Connection String |
| `JWT_SECRET` | — | **Muss gesetzt werden!** |
| `CORS_ORIGIN` | * | Erlaubte Origins |

## PostgreSQL-Migration

1. PostgreSQL-Server bereitstellen
2. `DB_TYPE=postgres` setzen
3. `DATABASE_URL=postgresql://user:pass@host:5432/excel-lenz` setzen
4. Tabellen werden automatisch via `initDb()` erstellt
5. `npm run db:seed` ausführen

## Monitoring (Empfehlungen)

- **Error Tracking**: Sentry (`@sentry/node`)
- **Metrics**: Prometheus + Grafana
- **Uptime**: UptimeRobot (kostenlos)
- **Logs**: `docker compose logs` oder ELK-Stack

## Skalierung

- **Horizontal**: Mehrere API-Instanzen hinter Load Balancer
- **Database**: PostgreSQL mit Read-Replicas
- **Caching**: Redis für Sessions + API-Responses
- **CDN**: Cloudflare für statische Assets
