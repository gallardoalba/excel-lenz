---
description: "Expert agent for Excel spreadsheet simulation development. Handles Handsontable 18 grid rendering, HyperFormula formula engine, data conversion, cell editing, toolbar/ribbon, and spreadsheet components. Use when working on SpreadsheetHandsontable.tsx, ExcelRibbon.tsx, FormulaBar.tsx, or any Handsontable/HyperFormula code."
tools: read_file, replace_string_in_file, multi_replace_string_in_file, get_errors, grep_search, file_search, run_in_terminal, open_browser_page, screenshot_page, navigate_page, read_page, click_element, run_playwright_code
user-invocable: true
---

# Spreadsheet Agent — Excel-lenz Project

## Handsontable v18 API

### Component Config
```typescript
const hot = new Handsontable(containerRef.current, {
  data: 2D array, colHeaders: true, rowHeaders: true,
  formulas: { engine: hfRef.current }, licenseKey: 'non-commercial-and-evaluation',
  columnSorting: false, // Disabled — HF.setRowOrder incompatibility
  filters: true, search: true,
  manualColumnResize: true, manualRowResize: true, mergeCells: true,
  fillHandle: !readOnly, readOnly,
  allowInsertRow/Column/RemoveRow/Column: !readOnly,
  contextMenu: false, // Custom ContextMenu component used instead
  exportFile: { engines: { xlsx: ExcelJS } },
  minRows: 50, minCols: 50, stretchH: 'all', undo: true,
});
```

### Plugin API
- `hot.getPlugin('exportFile')` → `downloadFileAsync('xlsx', opts)` (v18)
- `hot.getPlugin('columnSorting')` → `sort({ column, sortOrder })` (ribbon only)
- `hot.getPlugin('filters')` → `filter()`
- `hot.alter('insert_row'|'remove_row'|'insert_col'|'remove_col', index, amount)`
- `hot.undo()` / `hot.redo()` / `hot.getDataAtCell(r,c)` / `hot.setDataAtCell(r,c,v)`

### HyperFormula v3.3 (deDE)
- `HyperFormula.registerLanguage('deDE', deDE)` — imports from `hyperformula/i18n/languages/deDE`
- `HyperFormula.buildEmpty({ language: 'deDE', licenseKey: 'gpl-v3' })`
- `hf.addSheet('Sheet1')`, `hf.setSheetContent(sheetId, cells)`, `hf.getCellValue(address)`
- Errors: `#DIV/0!`, `#WERT!`, `#BEZUG!`, `#NAME?` (German names via deDE locale)

## Data Flow
```
Template JSON → [headers, ...data] → Handsontable Grid
    ↓ afterChange (skips row 0)
onChange → source data (stripped header row) → React State
    ↓ Submit button
POST /api/exercises/:id/submit → Score → UI feedback
    ↓ Speichern/XLSX ribbon button
exportFile.downloadFileAsync('xlsx') → ExcelJS engine → file download
```

## Key Patterns
- `isUpdatingRef` guard prevents `afterChange` infinite loops
- `hfRef` passed as formulas engine (useRef, not useState — survives StrictMode)
- `afterChange` strips header row (index 0) before syncing to source data
- AutoSum: `colToLetter(col) + rowIndex` — v18 fix: end row uses `row + 1` (not `row`)
- Always check `signal.aborted` before setState in fetch effects (React 19 StrictMode)
- Define `useMemo`/`useRef` BEFORE `useEffect` that references them (Temporal Dead Zone)
- `readOnly` prop toggles `allowInsert/Remove*` config options

## Files
- `SpreadsheetHandsontable.tsx` — Main grid component (~1570 lines), Handsontable + HF
- `ExcelRibbon.tsx` — 3-tab ribbon (Start, Formeln, Daten) with export, sort, filter
- `FormulaBar.tsx` — Name box + formula input with DE autocomplete
- `StatusBar.tsx` — Mode indicator, aggregates, zoom slider
- `ContextMenu.tsx` — Right-click context menu
- `types.ts` — `colToLetter`, `positionToRef`, `refToRange` utilities
- `Exercise.tsx` — Parent page, passes data/onChange/readOnly to SpreadsheetHandsontable

