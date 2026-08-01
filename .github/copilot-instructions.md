# Copilot Instructions for Excel-lenz Project

## Project Overview

**Excel-lenz** is an interactive Excel learning portal built with:
- **Frontend**: React 19 + TypeScript 7 + Vite 6 + Handsontable 18 (Excel-like spreadsheet)
- **Backend**: Express + TypeScript + better-sqlite3 + JWT auth
- **Architecture**: Monorepo with `frontend/` (port 5173) and `backend/` (port 3001)

The platform provides 154 interactive Excel exercises across 4 courses (Beginner→Expert) with German localization.

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Spreadsheet | Handsontable + HyperFormula | Excel-like grid with DE formula support via HyperFormula `deDE` locale |
| Formula Engine | HyperFormula 3.3 | DE function names translated via `hyperformula/i18n/languages/deDE` |
| Frontend | React 19 + TypeScript 7 + Vite 6 | Port 5173, proxies /api to backend |
| Backend | Express 4.21 + TypeScript + tsx | Port 3001, JWT auth, SQLite |
| Database | better-sqlite3 11.x + WAL mode | `backend/data/excel-lenz.db` |
| Exercises | JSON files | `backend/src/db/exercises/course1-4.json` |
| Styling | CSS custom properties | Premium minimalist design system (Apple/Tesla-inspired) |
| i18n | None (DE-only) | Content authored in German; HyperFormula handles DE function names |

## Key Files

```
frontend/src/
├── components/spreadsheet/
│   ├── SpreadsheetHandsontable.tsx  ← Main spreadsheet component (Handsontable + HyperFormula)
│   ├── ExcelRibbon.tsx             ← Custom Excel ribbon toolbar
│   ├── FormulaBar.tsx              ← Custom formula bar
│   ├── StatusBar.tsx               ← Excel-style status bar
│   ├── ContextMenu.tsx             ← Right-click context menu
│   ├── ChartDialog.tsx             ← Chart insertion dialog
│   ├── ConditionalFormatDialog.tsx ← Conditional formatting dialog
│   ├── DataValidationDialog.tsx    ← Data validation dialog
│   ├── PivotTableDialog.tsx        ← Pivot table dialog
│   └── types.ts                    ← Cell position utilities
├── pages/
│   ├── Exercise.tsx                ← Main exercise page (uses SpreadsheetHandsontable)
│   ├── Courses.tsx                 ← Course listing
│   └── CourseDetail.tsx            ← Course detail with exercise list
├── context/AuthContext.tsx          ← Auth + apiFetch helper
└── index.css                       ← Global styles (premium Apple/Tesla design system)

backend/src/
├── server.ts                       ← Express entry point
├── db/
│   ├── database.ts                 ← SQLite connection (WAL mode)
│   ├── seed.ts                     ← DB seeder (imports JSON exercises)
│   └── exercises/                  ← Exercise JSON files (4 courses, 154 exercises)
└── routes/
    ├── exercises.ts                ← Exercise API (GET/:id, POST/:id/submit, scoring)
    ├── courses.ts                  ← Course listing API
    └── auth.ts                     ← JWT auth routes
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

### Handsontable
- Use `@handsontable/react` `HotTable` component with HyperFormula integration
- Data format: 2D array `(string|null|number)[][]`
- HyperFormula registered with DE locale: `import deDE from 'hyperformula/i18n/languages/deDE'`
- `afterChange` hook for cell updates, `afterOnCellMouseDown` for context menus
- Configuration: `licenseKey='non-commercial-and-evaluation'`, `height='auto'`, `stretchH='all'`

### Formula Handling
- HyperFormula with `deDE` locale translates German function names automatically (e.g., `WENN` → `IF`, `SUMME` → `SUM`)
- Formula evaluation happens inside HyperFormula; no manual translation needed
- Exercise `formulaHint` fields use German function names matching what users type
- Error display: `#DIV/0!`, `#WERT!`, `#BEZUG!`, `#NAME?`

### CSS
- Use CSS custom properties: `var(--primary)`, `var(--text-secondary)`, etc.
- Premium minimalist design (Apple/Tesla-inspired): no borders on cards, soft shadows, Inter font
- Dark mode via `body.dark` class selector
- Frosted glass: `backdrop-filter: blur() saturate()`, `rgba()` backgrounds on modals/command palette
- Handsontable needs explicit container height; spreadsheet wrapper uses `overflow: hidden` with `border-radius`

### Backend
- Express routes use `authMiddleware` (required) or `optionalAuth` (guest)
- SQLite with WAL mode for concurrent reads
- Exercise data stored as JSON in `template_data` column
- Scoring: numeric tolerance < 0.01, string exact match, only on `taskCols`

## Common Pitfalls

1. **Temporal Dead Zone**: `const` variables cannot be accessed before declaration in the component body. Always define `useMemo`/`useState`/`useRef` before `useEffect` hooks that reference them.

2. **Handsontable `afterChange` loops**: Setting cell values in `afterChange` can trigger recursive updates. Always use a guard flag (`isUpdatingRef`) to prevent infinite loops.

3. **AbortController in StrictMode**: React StrictMode double-mounts effects. Always add cleanup in useEffect that aborts the controller, and check `signal.aborted` before `setState`.

4. **HyperFormula sheet names**: HF uses 0-based `sheetId`. Always call `hf.addSheet('Sheet1')` and use the returned ID.

5. **DE formula names**: HyperFormula with `deDE` locale handles translation. Do NOT manually translate `WENN` → `IF` in formulas — let HyperFormula do it.

6. **Exercise `taskCols` are 0-based**: `taskCols: [6,7,8,9]` refers to columns G,H,I,J (index 0 = column A). Ensure these indices are within the `data` array bounds.

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
