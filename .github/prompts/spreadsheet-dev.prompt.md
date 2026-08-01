---
description: Prompt template for spreadsheet feature development tasks in the Excel-lenz project.
---

You are working on the Excel-lenz Excel learning platform. The current spreadsheet is powered by **Handsontable 18** with **HyperFormula 3.3** as the formula engine, using the `deDE` locale for German function name translation.

## Current State

The Handsontable v18 integration is working with these features:

| Feature | Status | Notes |
|---------|--------|-------|
| Data display | ✅ | Headers editable (row 0), task columns highlighted |
| Excel ribbon | ✅ | `ExcelRibbon.tsx` — 3 tabs (Start, Formeln, Daten) |
| Formula bar | ✅ | `FormulaBar.tsx` — cell reference + formula input + fx |
| Cell editing | ✅ | Double-click to edit, Enter to confirm |
| Formula evaluation | ✅ | HyperFormula with deDE locale |
| Export (XLSX) | ✅ | `exportFile` plugin with ExcelJS engine |
| Save button | ✅ | Quick-access "Speichern" → export XLSX |
| Data sync (onChange) | ✅ | `afterChange` → strip header → React state |
| Sort (ribbon) | ✅ | `getPlugin('columnSorting').sort()` |
| Column header sort | ❌ | Disabled — HF.setRowOrder incompatibility |
| Filter | ✅ | `getPlugin('filters').filter()` |
| German localization | ✅ | HyperFormula deDE locale |
| Fill handle | ✅ | `fillHandle: !readOnly` |

## Task Template

When implementing a new feature, consider these aspects:

### Data Flow
```
Template JSON → [headers, ...data] → Handsontable Grid (row 0 = headers)
    ↓ afterChange (skips row 0)
onChange → source data (stripped header) → React State
    ↓ Speichern/XLSX ribbon button
exportFile plugin → ExcelJS engine → .xlsx download
```

### File Checklist
- [ ] `SpreadsheetHandsontable.tsx` — Component changes (~1570 lines)
- [ ] `ExcelRibbon.tsx` — Ribbon changes
- [ ] `FormulaBar.tsx` — Formula bar changes
- [ ] `Exercise.tsx` — Page integration changes
- [ ] `index.css` — Styling changes

### Guard Checklist
- [ ] No Temporal Dead Zone errors (useMemo before useEffect)
- [ ] `isUpdatingRef` prevents `afterChange` infinite loops
- [ ] `columnSorting: false` — must NOT be re-enabled (crashes HF)
- [ ] ReadOnly mode disables `allowInsertRow`, `allowRemoveCol`, etc.
- [ ] `signal.aborted` check before setState (React 19 StrictMode)
- [ ] Cleanup functions in all useEffects
- [ ] Header row (index 0) stripped in `afterChange` before syncing

### Common Patterns

**Preventing afterChange loops**:
```typescript
const isUpdatingRef = useRef(false);
// In afterChange handler:
if (isUpdatingRef.current) return;
isUpdatingRef.current = true;
// ... modify data ...
isUpdatingRef.current = false;
```

**AutoSum formula generation (v18 fixed)**:
```typescript
// Upward scan: end row is row + 1 (not row — was Bug #7 in v14)
const formula = `=SUMME(${colLetter}${upStart + 1}:${colLetter}${row + 1})`;
```

**Export (Speichern button)**:
```typescript
const plugin = hot.getPlugin('exportFile');
plugin.downloadFileAsync('xlsx', { filename: 'excel-lenz-uebung' })
  .catch(() => plugin.downloadFile('csv', { filename: '...', columnHeaders: true }));
```

**Ribbon sort (bypasses header sort crash)**:
```typescript
const cs = hot.getPlugin('columnSorting');
cs.sort({ column: selectedRange.startCol, sortOrder: 'asc' });
```
