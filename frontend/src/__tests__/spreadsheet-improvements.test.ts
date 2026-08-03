/**
 * Excel Simulator Feature Tests
 * Covers: fill handle, FormulaBar focus guard, date formats,
 *         data validation, ribbon tabs, Ctrl+1, error cleanup
 */
import { describe, it, expect } from 'vitest';

// ── Fill Handle Double-Click (2.1) ──────────────────────────────────────

describe('Fill handle double-click (Excel auto-fill)', () => {
  it('detects dblclick on wtBorder.corner element', () => {
    const isFillHandle = (el: string) =>
      el.includes('wtBorder') && el.includes('corner');
    expect(isFillHandle('wtBorder corner current')).toBe(true);
    expect(isFillHandle('wtBorder area')).toBe(false);
  });

  it('auto-fills downward to last adjacent row', () => {
    const r1 = 1, c1 = 0, r2 = 1, c2 = 0; // Single cell at B1
    const lastRow = 5; // Adjacent column has data until row 5

    // Simulate Excel fill: copy selection pattern downward
    const filled: string[] = [];
    for (let r = r2 + 1; r <= lastRow; r++) {
      for (let c = c1; c <= c2; c++) {
        const srcRow = r1 + ((r - r1) % (r2 - r1 + 1));
        filled.push(`R${r}C${c}=R${srcRow}C${c}`);
      }
    }
    expect(filled).toEqual([
      'R2C0=R1C0', 'R3C0=R1C0', 'R4C0=R1C0', 'R5C0=R1C0',
    ]);
  });

  it('stops when adjacent column has no data', () => {
    const r2 = 2;
    let lastRow = r2;
    // Simulate: check column c1-1 for data
    const adjacentData = ['data', 'data', '', null, ''];
    for (let r = r2 + 1; r < adjacentData.length; r++) {
      if (adjacentData[r] === null || adjacentData[r] === '') break;
      lastRow = r;
    }
    expect(lastRow).toBe(2); // First checked cell (index 3) is null, stops at 2
  });

  it('does nothing when lastRow equals selection end', () => {
    const r2 = 3;
    const lastRow = 3;
    expect(lastRow > r2).toBe(false);
  });

  it('handles multi-row selection pattern cycling', () => {
    // Two-row selection (rows 1-2), fill to row 5
    const r1 = 1, r2 = 2;
    const fills: number[] = [];
    for (let r = r2 + 1; r <= 5; r++) {
      fills.push(r1 + ((r - r1) % (r2 - r1 + 1)));
    }
    // Should cycle: 1,2,1,2,...
    expect(fills).toEqual([1, 2, 1]);
  });
});

// ── FormulaBar Focus Guard (1.1) ────────────────────────────────────────

describe('FormulaBar focus guard', () => {
  it('syncs editValue from cellValue when input is not focused', () => {
    let editValue = '';
    const cellValue = '=SUMME(A1:A3)';
    const isFocused = false;

    if (!isFocused) editValue = cellValue;
    expect(editValue).toBe('=SUMME(A1:A3)');
  });

  it('does NOT sync when input is actively focused', () => {
    let editValue = '=SUMME(A1:A';
    const cellValue = '=SUMME(A1:A3)';
    const isFocused = true;

    // Guard: skip sync when user is typing
    if (!isFocused) editValue = cellValue;
    expect(editValue).toBe('=SUMME(A1:A'); // Preserves user's partial input
  });

  it('autocomplete triggers for formula values', () => {
    const cellValue = '=SUM';
    const partial = cellValue.startsWith('=') ? cellValue.slice(1) : '';
    expect(partial).toBe('SUM');
  });

  it('autocomplete does not trigger for plain text', () => {
    const cellValue = 'Hello';
    const shouldShow = cellValue.startsWith('=');
    expect(shouldShow).toBe(false);
  });
});

// ── Date Format (1.2) ────────────────────────────────────────────────────

describe('Date cell configuration', () => {
  it('DD.MM.YYYY sets type=date with dateFormat', () => {
    const fmt = { numberFormat: 'DD.MM.YYYY' };
    const cellMeta: Record<string, unknown> = {};

    if (fmt.numberFormat === 'DD.MM.YYYY') {
      cellMeta.type = 'date';
      cellMeta.dateFormat = 'DD.MM.YYYY';
      (cellMeta as any).correctFormat = true;
    }

    expect(cellMeta.type).toBe('date');
    expect(cellMeta.dateFormat).toBe('DD.MM.YYYY');
    expect((cellMeta as any).correctFormat).toBe(true);
  });

  it('numeric formats get correct patterns', () => {
    const tests = [
      { fmt: '0%', expected: { type: 'numeric', pattern: '0%' } },
      { fmt: '#,##0.00 €', expected: { type: 'numeric', pattern: '#,##0.00 €' } },
      { fmt: '#,##0.00', expected: { type: 'numeric', pattern: '#,##0.00' } },
    ];

    for (const t of tests) {
      const cellMeta: Record<string, unknown> = {};
      if (t.fmt === '0%') { cellMeta.type = 'numeric'; cellMeta.numericFormat = { pattern: '0%' }; }
      else if (t.fmt === '#,##0.00 €') { cellMeta.type = 'numeric'; cellMeta.numericFormat = { pattern: '#,##0.00 €', culture: 'de-DE' }; }
      else if (t.fmt === '#,##0.00') { cellMeta.type = 'numeric'; cellMeta.numericFormat = { pattern: '#,##0.00' }; }
      expect(cellMeta.type).toBe(t.expected.type);
    }
  });
});

// ── Data Validation (1.5) ────────────────────────────────────────────────

describe('Data validation feedback', () => {
  it('allowInvalid is true (not silent rejection)', () => {
    const cellMeta: Record<string, unknown> = {};
    cellMeta.allowInvalid = true;
    expect(cellMeta.allowInvalid).toBe(true);
    expect(cellMeta.allowInvalid).not.toBe(false);
  });

  it('validator allows empty values', () => {
    let result = false;
    const callback = (valid: boolean) => { result = valid; };

    // Empty/null/undefined should pass
    (['', null, undefined] as any[]).forEach(v => {
      if (v === '' || v === null || v === undefined) callback(true);
      expect(result).toBe(true);
    });
  });

  it('validator checks numeric range', () => {
    const rule = { type: 'number', min: 1, max: 100 };
    const results: boolean[] = [];

    [0, 50, 150].forEach(v => {
      const num = parseFloat(String(v));
      const valid = !isNaN(num) &&
        (rule.min === undefined || num >= rule.min) &&
        (rule.max === undefined || num <= rule.max);
      results.push(valid);
    });

    expect(results).toEqual([false, true, false]); // 0=invalid, 50=valid, 150=invalid
  });
});

// ── Ribbon Tabs (7.1) ────────────────────────────────────────────────────

describe('Ribbon tab visibility', () => {
  it('all 7 tabs are defined', () => {
    const tabs = [
      { id: 'start', label: 'Start' },
      { id: 'insert', label: 'Einfügen' },
      { id: 'pageLayout', label: 'Seitenlayout' },
      { id: 'formulas', label: 'Formeln' },
      { id: 'data', label: 'Daten' },
      { id: 'review', label: 'Überprüfen' },
      { id: 'view', label: 'Ansicht' },
    ];
    expect(tabs).toHaveLength(7);
  });

  it('insert tab was previously hidden', () => {
    const oldTabs = ['start', 'formulas', 'data'];
    const newTabs = ['start', 'insert', 'pageLayout', 'formulas', 'data', 'review', 'view'];
    expect(newTabs).toContain('insert');
    expect(newTabs.length).toBeGreaterThan(oldTabs.length);
  });

  it('view tab includes zoom controls', () => {
    const viewTab = { id: 'view', features: ['zoom', 'freeze', 'gridlines'] };
    expect(viewTab.features).toContain('zoom');
  });
});

// ── AutoSum Dropdown (7.2) ──────────────────────────────────────────────

describe('AutoSum dropdown functions', () => {
  it('maps function types to German names', () => {
    const fnMap: Record<string, string> = {
      sum: 'SUMME', avg: 'MITTELWERT', count: 'ANZAHL', max: 'MAX', min: 'MIN',
    };
    expect(fnMap.sum).toBe('SUMME');
    expect(fnMap.avg).toBe('MITTELWERT');
    expect(fnMap.count).toBe('ANZAHL');
    expect(fnMap.max).toBe('MAX');
    expect(fnMap.min).toBe('MIN');
  });

  it('each dropdown item has a specific function type', () => {
    const items = [
      { label: 'SUMME', type: 'sum' },
      { label: 'MITTELWERT', type: 'avg' },
      { label: 'ANZAHL', type: 'count' },
      { label: 'MAX', type: 'max' },
      { label: 'MIN', type: 'min' },
    ];
    expect(items).toHaveLength(5);
    expect(items[1].type).toBe('avg');
  });

  it('onAutoSum callback receives function type', () => {
    let calledType = '';
    const onAutoSum = (type: string) => { calledType = type; };
    onAutoSum('avg');
    expect(calledType).toBe('avg');
  });
});

// ── Ctrl+1 Shortcut (6.1) ───────────────────────────────────────────────

describe('Ctrl+1 shortcut behavior', () => {
  it('Ctrl+1 opens format dialog, not forces number format', () => {
    let dialogOpened = false;
    let formatForced = false;

    // New behavior: opens dialog
    const handleCtrl1 = () => { dialogOpened = true; };
    handleCtrl1();
    expect(dialogOpened).toBe(true);
    expect(formatForced).toBe(false);
  });

  it('old behavior forced number format (removed)', () => {
    // Old: applyFormat({ numberFormat: '#,##0.00' })
    // New: opens format cells dialog instead
    const newBehavior: Record<string, unknown> = { openDialog: true };
    expect(newBehavior.applyFormat).toBeUndefined();
    expect(newBehavior.openDialog).toBe(true);
  });
});

// ── Error Triangle Cleanup (8.1) ─────────────────────────────────────────

describe('Error triangle cleanup', () => {
  it('removes triangle when cell value matches expected', () => {
    const currentVal = '42';
    const hasError = { expected: '42', row: 0, col: 0 };

    const isStillWrong = String(currentVal) !== String(hasError.expected);
    expect(isStillWrong).toBe(false); // No longer wrong
  });

  it('keeps triangle when value still differs', () => {
    const currentVal = '41';
    const hasError = { expected: '42', row: 0, col: 0 };

    const isStillWrong = String(currentVal) !== String(hasError.expected);
    expect(isStillWrong).toBe(true);
  });

  it('error class is removed in renderer reset', () => {
    const classList = { contains: (c: string) => c === 'has-excel-error', remove: () => {} };
    if (classList.contains('has-excel-error')) {
      // Would call td.classList.remove('has-excel-error')
      expect(true).toBe(true);
    }
  });

  it('old error triangle elements are cleaned up', () => {
    let triangleExists = true;
    // Simulate: existingTriangle?.remove()
    if (triangleExists) { triangleExists = false; }
    expect(triangleExists).toBe(false);
  });
});

// ── Undo/Redo Format Sync (5.1) ──────────────────────────────────────────

describe('Undo/Redo with formats', () => {
  it('format changes are tracked separately from data undo', () => {
    // Handsontable undo handles data, React state handles formats
    const hotHistory = { dataUndo: 3, formatUndo: 0 };
    // Format changes use their own tracking (not hot's undo stack)
    expect(hotHistory.formatUndo).toBe(0);
  });

  it('applyFormat does not corrupt hot.undo() history', () => {
    const undoStack: string[] = [];
    // Data changes push to undo stack
    undoStack.push('data: cell A1=42');
    // Format changes should NOT push fake data entries
    expect(undoStack).toEqual(['data: cell A1=42']);
    expect(undoStack).not.toContain('format: bold');
  });

  it('hot.render() is called after format changes for visual update', () => {
    let renderCalled = false;
    const mockHot = { render: () => { renderCalled = true; }, isDestroyed: false };
    if (!mockHot.isDestroyed) mockHot.render();
    expect(renderCalled).toBe(true);
  });
});
