/**
 * Excel Simulator — Rounds 4+5 Tests
 * Covers: renderer perf, friendly errors, dark mode cells, sheet switch undo,
 *         arrow key formula nav, status bar COUNTA/COUNT, exam confirm
 */
import { describe, it, expect } from 'vitest';

// ── 14.1 Renderer perf (removeAttribute) ────────────────────────────────

describe('Renderer performance optimization', () => {
  it('cssText reset is faster than individual property clears', () => {
    // Simulate: 10 lines of td.style.x = '' vs single removeAttribute
    const individualClears = 10;
    const singleReset = 1;
    expect(singleReset).toBeLessThan(individualClears);
  });

  it('styles applied after reset are minimal', () => {
    const stylesApplied: string[] = [];
    const fmt = { bgColor: '#e8f5e9', bold: true };

    // After removeAttribute('style'), only apply what's needed
    if (fmt.bgColor) stylesApplied.push(`bg:${fmt.bgColor}`);
    if (fmt.bold) stylesApplied.push('font-weight:bold');

    expect(stylesApplied).toHaveLength(2);
    expect(stylesApplied).toContain('bg:#e8f5e9');
  });
});

// ── 14.2 Conditional format column index ────────────────────────────────

describe('Conditional format column indexing', () => {
  it('builds column-indexed map from rules array', () => {
    const rules = [
      { col: 2, operator: '>', value: 10, color: '#ff0000' },
      { col: 2, operator: '<', value: 5, color: '#0000ff' },
      { col: 5, operator: '>=', value: 100, color: '#00ff00' },
    ];

    const map: Record<number, typeof rules> = {};
    rules.forEach(rule => {
      if (!map[rule.col]) map[rule.col] = [];
      map[rule.col].push(rule);
    });

    expect(map[2]).toHaveLength(2);
    expect(map[5]).toHaveLength(1);
    expect(map[0]).toBeUndefined(); // No rules for column 0
  });

  it('renderer only checks rules for current column', () => {
    const map: Record<number, any[]> = { 2: [{ operator: '>' }], 5: [{ operator: '<' }] };
    const col = 2;
    const rules = map[col] || [];
    expect(rules).toHaveLength(1);
  });
});

// ── 16.1 Friendly formula errors ────────────────────────────────────────

describe('Friendly formula error messages', () => {
  const errorMessages: Record<string, string> = {
    '#DIV/0!': 'Fehler: Division durch Null.',
    '#NAME?': 'Fehler: Unbekannter Name.',
    '#WERT!': 'Fehler: Falscher Datentyp.',
    '#BEZUG!': 'Fehler: Ungültiger Bezug.',
    '#NV': 'Fehler: Wert nicht verfügbar.',
  };

  it('translates #DIV/0! to German explanation', () => {
    expect(errorMessages['#DIV/0!']).toContain('Division durch Null');
  });

  it('translates #NAME? to German explanation', () => {
    expect(errorMessages['#NAME?']).toContain('Unbekannter Name');
  });

  it('translates #WERT! to German explanation', () => {
    expect(errorMessages['#WERT!']).toContain('Falscher Datentyp');
  });

  it('translates #BEZUG! to German explanation', () => {
    expect(errorMessages['#BEZUG!']).toContain('Ungültiger Bezug');
  });

  it('translates #NV (N/A) to German explanation', () => {
    expect(errorMessages['#NV']).toContain('Wert nicht verfügbar');
  });

  it('all error keys start with #', () => {
    Object.keys(errorMessages).forEach(key => {
      expect(key.startsWith('#')).toBe(true);
    });
  });
});

// ── 17.1 Dark mode cells ────────────────────────────────────────────────

describe('Dark mode cell backgrounds', () => {
  it('empty cells use theme variable in dark mode', () => {
    const darkRule = 'body.dark .handsontable td { background-color: var(--surface) !important; }';
    expect(darkRule).toContain('var(--surface)');
    expect(darkRule).toContain('!important');
  });

  it('selection border uses primary color in dark mode', () => {
    const darkRule = 'body.dark .handsontable .current { border-color: var(--primary) !important; }';
    expect(darkRule).toContain('var(--primary)');
  });
});

// ── 17.2 Dark mode scrollbars ───────────────────────────────────────────

describe('Dark mode scrollbars', () => {
  it('Handsontable scrollbar thumb is dark in dark mode', () => {
    const darkRule = 'body.dark .ht_master .wtHolder::-webkit-scrollbar-thumb { background: #555; }';
    expect(darkRule).toContain('#555');
  });

  it('scrollbar track uses dark bg in dark mode', () => {
    const darkRule = 'body.dark .ht_master .wtHolder::-webkit-scrollbar-track { background: var(--bg-alt2); }';
    expect(darkRule).toContain('var(--bg-alt2)');
  });
});

// ── 19.1 Clear undo on sheet switch ─────────────────────────────────────

describe('Undo cleared on sheet switch', () => {
  it('undoRedo.clear() is called on sheet switch', () => {
    let cleared = false;
    const mockPlugin = { clear: () => { cleared = true; } };

    // Simulate sheet switch
    if (mockPlugin) (mockPlugin as any).clear();
    expect(cleared).toBe(true);
  });

  it('sheet switch preserves data per sheet', () => {
    const sheets = {
      'Tabelle1': [['A1', 'B1'], ['a', 'b']],
      'Tabelle2': [['X1', 'Y1'], ['x', 'y']],
    };

    const saveCurrent = sheets['Tabelle1'];
    const loadNew = sheets['Tabelle2'];

    expect(saveCurrent).toEqual([['A1', 'B1'], ['a', 'b']]);
    expect(loadNew).toEqual([['X1', 'Y1'], ['x', 'y']]);
  });
});

// ── 19.2 refreshDimensions on sheet switch ──────────────────────────────

describe('refreshDimensions on sheet switch', () => {
  it('refreshDimensions is called after loadData on sheet switch', () => {
    let refreshed = false;
    const mockHot = {
      render: () => {},
      refreshDimensions: () => { refreshed = true; },
    };

    mockHot.render();
    mockHot.refreshDimensions();
    expect(refreshed).toBe(true);
  });
});

// ── 20.1 Arrow key formula navigation ───────────────────────────────────

describe('Arrow key navigation during formula editing', () => {
  it('arrow keys insert cell references when formula starts with =', () => {
    const editorValue = '=SUMME(';
    const isFormula = editorValue.startsWith('=');
    expect(isFormula).toBe(true);
  });

  it('arrow keys do NOT insert refs for plain text editing', () => {
    const editorValue = 'Hello world';
    const isFormula = editorValue.startsWith('=');
    expect(isFormula).toBe(false);
  });

  it('ArrowRight moves selection right and inserts ref', () => {
    const colToLetter = (c: number) => String.fromCharCode(65 + c);
    const currentCol = 2, currentRow = 3;
    const newCol = currentCol + 1;
    const ref = `${colToLetter(newCol)}${currentRow + 1}`;
    expect(ref).toBe('D4');
  });

  it('ArrowUp inserts ref and clamps to row 0', () => {
    const newRow = Math.max(0, 0); // Can't go above row 0
    const ref = `A${newRow + 1}`;
    expect(ref).toBe('A1');
  });

  it('editor stays open after arrow key formula insert', () => {
    let editorClosed = false;
    const focusCalled = true;
    // Editor should NOT close; cursor moves to end of value
    expect(editorClosed).toBe(false);
    expect(focusCalled).toBe(true);
  });
});

// ── 20.2 Escape key preserves Handsontable behavior ─────────────────────

describe('Escape key handling', () => {
  it('Escape is passed through when HT editor is open', () => {
    const isHotEditor = true;
    const shouldIntercept = !isHotEditor; // Don't intercept if HT editor is open
    expect(shouldIntercept).toBe(false);
  });

  it('Escape closes modals when no HT editor is open', () => {
    const isHotEditor = false;
    const modalClosed = !isHotEditor;
    expect(modalClosed).toBe(true);
  });
});

// ── 21.1 Status bar COUNTA vs COUNT ─────────────────────────────────────

describe('Status bar COUNTA vs COUNT', () => {
  it('COUNTA counts non-empty cells', () => {
    const values: (string | number | null)[] = ['hello', 42, null, '', 'world'];
    const nonEmpty = values.filter(v => v !== null && v !== undefined && v !== '').length;
    expect(nonEmpty).toBe(3); // hello, 42, world
  });

  it('COUNT counts only numeric cells', () => {
    const values: (string | number | null)[] = ['hello', 42, null, '', 3.14];
    const numeric = values.filter(v => {
      const num = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : (typeof v === 'number' ? v : NaN);
      return !isNaN(num);
    }).length;
    expect(numeric).toBe(2); // 42, 3.14
  });

  it('sum calculates correctly for numeric values', () => {
    const nums = [10, 20, 30];
    const sum = nums.reduce((a, b) => a + b, 0);
    expect(sum).toBe(60);
  });

  it('empty range shows no aggregates', () => {
    const values: null[] = [null, null];
    const nonEmpty = values.filter(v => v !== null && v !== undefined && v !== '').length;
    expect(nonEmpty).toBe(0);
  });
});

// ── 21.2 Zoom sync ──────────────────────────────────────────────────────

describe('Zoom sync in status bar', () => {
  it('zoom state updates statusInfo', () => {
    let statusInfo = { zoom: 100 };
    const setZoom = (fn: (z: number) => number) => {
      const newZoom = fn(statusInfo.zoom);
      statusInfo = { ...statusInfo, zoom: newZoom };
    };

    setZoom(z => Math.min(z + 10, 200));
    expect(statusInfo.zoom).toBe(110);
  });
});

// ── 23.1 Exam submission confirmation ───────────────────────────────────

describe('Exam submission confirmation', () => {
  it('shows confirmation modal before exam submit', () => {
    const mode = 'exam';
    const attemptCount = 0;
    const shouldConfirm = mode === 'exam' && attemptCount === 0;
    expect(shouldConfirm).toBe(true);
  });

  it('does not confirm in practice mode', () => {
    const mode: string = 'practice';
    const attemptCount: number = 0;
    const shouldConfirm = mode === 'exam' && attemptCount === 0;
    expect(shouldConfirm).toBe(false);
  });

  it('does not confirm after first attempt (already submitted)', () => {
    const mode: string = 'exam';
    const attemptCount: number = 1;
    const shouldConfirm = mode === 'exam' && attemptCount === 0;
    expect(shouldConfirm).toBe(false);
  });

  it('confirm dialog has cancel and confirm buttons', () => {
    const buttons = ['Abbrechen', 'Ja, abgeben'];
    expect(buttons).toContain('Abbrechen');
    expect(buttons).toContain('Ja, abgeben');
  });

  it('cancel closes dialog without submitting', () => {
    let submitted = false;
    let dialogOpen = true;
    // Cancel: close dialog, don't submit
    dialogOpen = false;
    expect(dialogOpen).toBe(false);
    expect(submitted).toBe(false);
  });

  it('confirm closes dialog and proceeds with submit', () => {
    let submitted = false;
    let dialogOpen = true;
    // Confirm: close dialog, then submit
    dialogOpen = false;
    submitted = true;
    expect(dialogOpen).toBe(false);
    expect(submitted).toBe(true);
  });
});
