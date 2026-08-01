# Contributing to Excel-lenz

Danke für dein Interesse, zu Excel-lenz beizutragen! 🎓

## Wie du helfen kannst

- 🐛 **Bugs melden**: Öffne ein Issue mit Schritten zur Reproduktion
- 💡 **Features vorschlagen**: Beschreibe den Use Case und warum er wichtig ist
- 📝 **Dokumentation verbessern**: Tippfehler, unklare Stellen, fehlende Beispiele
- 🧪 **Tests schreiben**: Neue Tests für bestehende oder neue Funktionalität
- 🔧 **Code beitragen**: Siehe Workflow unten

## Development Workflow

```bash
# 1. Fork + Clone
git clone https://github.com/DEIN_USER/excellenz.git
cd excellenz

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..

# 3. Create branch
git checkout -b feature/mein-feature

# 4. Run tests before committing
cd backend && npm test
```

## Pull Request Prozess

1. **Branch**: `feature/xxx` oder `fix/xxx` von `main`
2. **Tests**: Alle bestehenden Tests müssen grün sein. Neue Features brauchen Tests.
3. **TypeScript**: `tsc --noEmit` muss ohne Fehler durchlaufen (backend + frontend)
4. **Commit Messages**: Konventionell — `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
5. **PR Description**: Was, Warum, Wie getestet

## Code Style

- **TypeScript strict mode** — kein `any` ohne guten Grund
- **React**: Functional components + hooks, `useMemo`/`useCallback` wo sinnvoll
- **Backend**: Express Router pro Domain, SQLite mit WAL mode, prepared statements
- **CSS**: Custom properties aus `index.css`, kein inline-CSS außer für dynamische Werte
- **Testing**: Jest + supertest, `:memory:` DB für Tests

## Projektstruktur

```
backend/src/
├── routes/        # Express Router pro Domain
├── db/            # SQLite + Seed + Exercise JSON
├── middleware/     # Auth, etc.
├── utils/         # Logger, Validation, SM-2
└── __tests__/     # Jest Test Suites

frontend/src/
├── pages/         # Eine Page pro Route
├── components/    # Wiederverwendbare Komponenten
├── context/       # React Context Provider
├── hooks/         # Custom Hooks
└── data/          # Statische Daten (JSON, Config)
```

## Fragen?

Öffne ein Issue oder diskutiere in der Community.
