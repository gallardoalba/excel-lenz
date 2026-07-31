---
description: "Expert agent for Excel spreadsheet simulation development. Handles FortuneSheet Canvas rendering, HyperFormula formula engine, data conversion, cell editing, toolbar/ribbon, and spreadsheet components. Use when working on SpreadsheetFortune.tsx, FormulaAdapter.ts, dataConverter.ts, or any FortuneSheet/HyperFormula code."
tools: read_file, replace_string_in_file, multi_replace_string_in_file, get_errors, grep_search, file_search, run_in_terminal, open_browser_page, screenshot_page, navigate_page, read_page, click_element, run_playwright_code
user-invocable: true
---

# Spreadsheet Agent — Excel-lenz Project

## FortuneSheet v1.0.4 API

### Component Props
```
<Workbook ref data onChange hooks showToolbar showFormulaBar showSheetTabs allowEdit lang defaultColWidth defaultRowHeight forceCalculation />
```

### WorkbookInstance (via ref)
- `getAllSheets()`, `getCellValue(r,c)`, `setCellValue(r,c,v)`, `setCellFormat(r,c,attr,v)`
- `getSelection()`, `setSelection(range)`, `autoFillCell(copy,apply,dir)`, `freeze(type,range)`

### Cell Format
```
{ v, ct:{ fa, t:'g'|'n'|'b'|'d' }, bg, bl:0|1, it:0|1, fs, fc, ht:0|1|2, vt:0|1|2, lo:0|1, tb:0|1 }
```

### Hooks
```typescript
{
  beforeUpdateCell: (row, col, value) => boolean,  // return false to block
  afterUpdateCell: (row, col, oldValue, newValue) => void,
  afterSelectionChange: (sheetId, selection) => void,
  beforeRenderCell/afterRenderCell, beforeCellMouseDown/afterCellMouseDown,
  beforeRenderColumnHeaderCell/afterRenderColumnHeaderCell,
  beforeRenderRowHeaderCell/afterRenderRowHeaderCell
}
```

## FormulaAdapter
- `evaluate(formula, row, col, data?)` — translates DE/ES→EN, resolves refs, uses HyperFormula
- `syncData(data)` — loads flat array into HF
- `resolveReferences(formula, data)` — B2:D2 → individual values
- NAME_MAP: WENN→IF, SUMME→SUM, MITTELWERT→AVERAGE, 20+ translations

## Data Flow
```
Edit cell → afterUpdateCell → FormulaAdapter.evaluate → setCellValue(result)
Submit → workbookRef.getAllSheets() → fromFortuneSheet → POST /submit
State change → useMemo(toFortuneSheet) → FortuneSheet re-renders
```

## Key Patterns
- Use refs (dataRef, taskColsRef) not closures in hooks (empty deps `[]`)
- `isInternalChange` ref prevents onChange loops
- `beforeUpdateCell` returns false for locked cells (row===0 header, non-taskCols)
- Always check `signal.aborted` before setState in fetch effects
- Define useMemo/useRef BEFORE useEffect that references them (Temporal Dead Zone)

## Files
- `SpreadsheetFortune.tsx` — FortuneSheet wrapper
- `FormulaAdapter.ts` — HyperFormula bridge
- `dataConverter.ts` — toFortuneSheet/fromFortuneSheet
- `Exercise.tsx` — USE_FORTUNESHEET flag
