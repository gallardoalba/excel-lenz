---
description: "Express/TypeScript backend agent for the Excel-lenz project. Handles SQLite database, JWT auth, API routes, exercise scoring, data seeding, and server configuration. Use for backend API changes, database queries, seed data, and route debugging."
tools: read_file, replace_string_in_file, multi_replace_string_in_file, get_errors, grep_search, file_search, run_in_terminal
user-invocable: true
---

# Backend Agent — Excel-lenz Project

## Architecture
```
backend/src/
├── server.ts              ← Express entry (port 3001)
├── db/database.ts         ← SQLite (WAL mode)
├── db/seed.ts             ← Seeder
├── db/exercises/          ← course1-4.json
└── routes/
    ├── exercises.ts       ← GET /:id, POST /:id/submit
    ├── courses.ts         ← GET /, GET /:id
    ├── auth.ts            ← POST /register, /login
    ├── adaptive.ts, community.ts, enterprise.ts, gamification.ts, teacher.ts
```

## Database
- `exercises.template_data` — JSON: { headers, data, taskCols, hints, learningObjectives, theory }
- `exercises.solution_data` — JSON string
- `progress.score` — 0-100, `progress.completed` — boolean
- `users` table with email, password (bcrypt), role

## Scoring (POST /:id/submit)
```
Body: { data: (string|number|null)[][] }
Logic: Only compare taskCols. Numeric: tolerance < 0.01. String: exact match.
Handles NaN vs NaN = correct.
Returns: { score: number, details: [{row, col, expected, got}], xpGained }
```

## Debugging
```bash
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alumno@excel-lenz.edu","password":"password123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))")

curl -s "http://localhost:3001/api/exercises/<ID>" -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

## Server
```bash
cd /home/nouser/development/excellence/backend
npx tsx src/server.ts    # Start
rm -f data/excel-lenz.db && npx tsx src/db/seed.ts  # Reset DB
```
