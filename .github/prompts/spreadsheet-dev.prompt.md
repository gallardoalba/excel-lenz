---
description: Prompt template for spreadsheet feature development tasks in the Excel-lenz project.
---

You are working on the Excel-lenz Excel learning platform. The current spreadsheet is powered by **FortuneSheet** (Canvas-based, `@fortune-sheet/react` v1.0.4) with **HyperFormula 3.3** as the formula engine and a custom **FormulaAdapter** that translates German/Spanish function names to English.

## Current State

The FortuneSheet integration is working with these features:

| Feature | Status | Notes |
|---------|--------|-------|
| Data display | ✅ | Green headers, task columns highlighted |
| Excel ribbon | ✅ | FortuneSheet's native toolbar |
| Formula bar | ✅ | Cell reference + formula input + fx |
| Cell editing | ✅ | Double-click to edit, Enter to confirm |
| Task column locking | ✅ | `beforeUpdateCell` hook |
| Formula evaluation | ✅ | `afterUpdateCell` → HyperFormula |
| Cell reference resolution | ✅ | `B2:D2` → individual values |
| Data sync (onChange) | ✅ | `handleChange` → `fromFortuneSheet` |
| Fresh-read on submit | ✅ | `workbookRef.getAllSheets()` |
| German localization | ✅ | `lang="de"` |

## Task Template

When implementing a new feature, consider these aspects:

### Data Flow
```
User edits cell → FortuneSheet afterUpdateCell → FormulaAdapter.evaluate → setCellValue(result)
User clicks Submit → workbookRef.getAllSheets() → fromFortuneSheet → POST /api/exercises/:id/submit
Parent state changes → useMemo(toFortuneSheet) → FortuneSheet re-renders
```

### File Checklist
- [ ] `SpreadsheetFortune.tsx` — Component changes
- [ ] `FormulaAdapter.ts` — Formula engine changes
- [ ] `dataConverter.ts` — Format conversion changes
- [ ] `Exercise.tsx` — Page integration changes
- [ ] `index.css` — Styling changes

### Guard Checklist
- [ ] No Temporal Dead Zone errors (useMemo before useEffect)
- [ ] `isInternalChange` ref prevents onChange loops
- [ ] `beforeUpdateCell` returns false for locked cells
- [ ] `signal.aborted` check before setState
- [ ] Cleanup functions in all useEffects
- [ ] FortuneSheet props array size constant between renders

### Common Patterns

**Adding a hook**:
```typescript
const hooks = useMemo(() => ({
  hookName: (params) => {
    // Access latest refs via refs, not closures
    const data = dataRef.current;
    // ... implementation
  }
}), []); // Empty deps — use refs for latest values
```

**Reading cell data**:
```typescript
const sheets = workbookRef.current?.getAllSheets();
const cellValue = sheets?.[0]?.data?.[row]?.[col]?.v;
```

**Setting cell data**:
```typescript
workbookRef.current?.setCellValue(row, col, newValue);
// OR for formatted cells:
workbookRef.current?.setCellFormat(row, col, 'bg', '#e8f5e9');
```

**Preventing infinite loops**:
```typescript
const isInternalChange = useRef(false);
const handleChange = (sheets) => {
  if (isInternalChange.current) { isInternalChange.current = false; return; }
  isInternalChange.current = true;
  onChange(converted);
};
```
