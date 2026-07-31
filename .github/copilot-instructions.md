# Copilot Instructions for Excel-lenz Project

## Project Overview

**Excel-lenz** is an interactive Excel learning portal built with:
- **Frontend**: React 18 + TypeScript + Vite + FortuneSheet (Canvas-based spreadsheet)
- **Backend**: Express + TypeScript + better-sqlite3 + JWT auth
- **Architecture**: Monorepo with `frontend/` (port 5173) and `backend/` (port 3001)

The platform provides 167 interactive Excel exercises across 4 courses (Beginner→Expert) with German and Spanish localization.

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Spreadsheet | FortuneSheet 1.0.4 (`@fortune-sheet/react`) | Canvas-based, Excel-like. Drop-in replacement for Handsontable. |
| Formula Engine | HyperFormula 3.3 | Primary formula engine with DE/ES→EN translation |
| Frontend | React 18.3 + TypeScript 5.6 + Vite 6 | Port 5173, proxies /api to backend |
| Backend | Express 4.21 + TypeScript + tsx | Port 3001, JWT auth, SQLite |
| Database | better-sqlite3 11.x + WAL mode | `backend/data/excel-lenz.db` |
| Exercises | JSON files | `backend/src/db/exercises/course1-4.json` |
| Styling | CSS custom properties + dot-grid bg | Triadic color scheme (green/amber/blue), glass-morphism |
| i18n | react-i18next | DE/ES language support |

## Key Files

```
frontend/src/
├── components/spreadsheet/
│   ├── SpreadsheetFortune.tsx  ← FortuneSheet wrapper (current)
│   ├── Spreadsheet.tsx         ← Handsontable (legacy, USE_FORTUNESHEET=false to enable)
│   ├── FormulaAdapter.ts       ← HyperFormula bridge with DE/ES translation
│   ├── dataConverter.ts        ← Bidirectional format conversion
│   ├── Toolbar.tsx             ← Custom Excel ribbon (legacy, not used with FortuneSheet)
│   ├── FormulaBar.tsx          ← Custom formula bar (legacy)
│   └── types.ts                ← Cell position utilities
├── pages/
│   ├── Exercise.tsx            ← Main exercise page (USE_FORTUNESHEET=true)
│   ├── Courses.tsx             ← Course listing
│   └── CourseDetail.tsx        ← Course detail with exercise list
├── context/AuthContext.tsx      ← Auth + apiFetch helper
└── index.css                   ← Global styles

backend/src/
├── server.ts                   ← Express entry point
├── db/
│   ├── database.ts             ← SQLite connection (WAL mode)
│   ├── seed.ts                 ← DB seeder (imports JSON exercises)
│   └── exercises/              ← Exercise JSON files
└── routes/
    ├── exercises.ts            ← Exercise API (GET/:id, POST/:id/submit)
    ├── courses.ts              ← Course listing API
    └── auth.ts                 ← JWT auth routes
```

## Coding Conventions

### TypeScript
- Strict mode enabled
- Use `interface` for object types, `type` for unions/intersections
- Avoid `any` — use proper types or `unknown` with guards
- Export types from dedicated files when shared across components

### React
- Functional components with hooks
- Use `useRef` for mutable values that survive renders (not `useState` for refs)
- Use `useMemo` for expensive computations, `useCallback` for stable callbacks
- Always provide cleanup functions in `useEffect` returns
- **CRITICAL**: Never reference `const` variables before their declaration (Temporal Dead Zone)

### FortuneSheet
- Use `Workbook` component from `@fortune-sheet/react`
- Data format: `Sheet[]` with `{ name, data: (Cell|null)[][] }`
- Cell format: `{ v: value, ct: { fa: format, t: 'g'|'n'|'b'|'d' }, bg, bl, it, lo, ... }`
- Hooks: `beforeUpdateCell`, `afterUpdateCell`, `beforeRenderCell`, `afterRenderCell`
- API via ref: `workbookRef.current.getAllSheets()`, `.getCellValue()`, `.setCellValue()`
- Props: `showToolbar`, `showFormulaBar`, `showSheetTabs`, `allowEdit`, `lang`

### FormulaAdapter
- Translates DE/ES function names to EN before HyperFormula evaluation
- `evaluate(formula, row, col, data?)` — pass data array for cell reference resolution
- `resolveReferences(formula, data)` — expands `B2:D2` → individual cell values
- `syncData(data)` — loads flat array into HyperFormula for reference resolution
- Error display: `#DIV/0!`, `#VALUE!`, `#REF!`, `#NAME?`
- Keep English function names in HyperFormula: `IF` not `WENN`

### CSS
- Use CSS custom properties: `var(--primary)`, `var(--text-secondary)`, etc.
- Dot-grid background via `background-image: radial-gradient(...)`
- Dark mode via `[data-theme="dark"]` selector
- Glass-morphism: `backdrop-filter: blur()`, `rgba()` backgrounds
- FortuneSheet needs explicit container height (`min-height: 400px`)

### Backend
- Express routes use `authMiddleware` (required) or `optionalAuth` (guest)
- SQLite with WAL mode for concurrent reads
- Exercise data stored as JSON in `template_data` column
- Scoring: numeric tolerance < 0.01, string exact match, only on `taskCols`

## Common Pitfalls

1. **Temporal Dead Zone**: `const` variables cannot be accessed before declaration in the component body. Always define `useMemo`/`useState`/`useRef` before `useEffect` hooks that reference them.

2. **FortuneSheet `useMemo` deps**: The props array size must remain constant between renders. Adding/removing props (like `lang`) causes warnings.

3. **AbortController in StrictMode**: React StrictMode double-mounts effects. Always add cleanup in useEffect that aborts the controller, and check `signal.aborted` before `setState`.

4. **FortuneSheet data immutability**: FortuneSheet mutates its internal data. Always create new arrays when converting back: `fromFortuneSheet()` must return fresh data.

5. **Formula evaluation timing**: Formulas are evaluated in `afterUpdateCell` hook. The result is set via `workbookRef.current.setCellValue()`. This may trigger another `afterUpdateCell` — use a guard to prevent loops.

6. **HyperFormula sheet names**: HF uses 0-based `sheetId`. Always call `hf.addSheet('Sheet1')` and use the returned ID.

## When Editing Files

- Use `replace_string_in_file` with 3-5 lines of context before and after
- Never use `sed`, `awk`, or terminal text replacement for code files
- Use `multi_replace_string_in_file` for batch edits
- Check for errors with `get_errors` after each edit
- Prefer reading large chunks over many small reads

## Testing

- Backend: `curl` commands to test API endpoints
- Frontend: Browser-based testing via `open_browser_page` → `screenshot_page`
- Exercise data: `backend/src/db/exercises/course*.json`
- Feature flag: `USE_FORTUNESHEET` in `Exercise.tsx` toggles between FortuneSheet and Handsontable
