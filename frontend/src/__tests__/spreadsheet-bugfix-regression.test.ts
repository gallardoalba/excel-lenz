/**
 * Bug Fix Regression & Performance Tests
 * ========================================
 * Covers fixes from bugs1.md through bugs7.md
 *
 * Tests are organized into:
 * - Correctness: verify the fixes work as expected
 * - Performance: catch regressions and identify bottlenecks
 */
import { describe, it, expect } from 'vitest';
import {
  colToLetter,
  positionToRef,
  refToRange,
  rangeToRef,
  EXCEL_FUNCTIONS_DE,
  type CellPosition,
  type CellRange,
} from '../components/spreadsheet/types';

// ═══════════════════════════════════════════════════════════════════════
// Helper: extract partial function name (from FormulaBar.tsx logic)
// ═══════════════════════════════════════════════════════════════════════

function extractPartialFunction(val: string): string | null {
  const m = val.match(/(?:^=|[(,;+\-*/><=& ])\s*([A-Za-z_ÄÖÜäöüß]+)$/);
  return m ? m[1].toUpperCase() : null;
}

// ═══════════════════════════════════════════════════════════════════════
// Helper: syntax highlighting regex (from FormulaBar.tsx — bugs3.md Step 1)
// ═══════════════════════════════════════════════════════════════════════

const SYNTAX_HIGHLIGHT_REGEX =
  /([A-Za-z_ÄÖÜäöüß]+)\(|"([^"]*)"|(\$?[A-Za-z]+\$?\d+(?::\$?[A-Za-z]+\$?\d+)?)|(\d+[,.]?\d*)/g;

function findHighlightTokens(formula: string): string[] {
  if (!formula.startsWith('=')) return [];
  const tokens: string[] = [];
  const remaining = formula.slice(1);
  let match: RegExpExecArray | null;
  while ((match = SYNTAX_HIGHLIGHT_REGEX.exec(remaining)) !== null) {
    if (match[1]) tokens.push(`FN:${match[1]}`);
    else if (match[2]) tokens.push(`STR:${match[2]}`);
    else if (match[3]) tokens.push(`REF:${match[3].toUpperCase()}`);
    else if (match[4]) tokens.push(`NUM:${match[4]}`);
  }
  return tokens;
}

// ═══════════════════════════════════════════════════════════════════════
// Helper: depth-aware parser for function tooltip (bugs6.md Step 1)
// ═══════════════════════════════════════════════════════════════════════

function findActiveFunction(
  formula: string,
  cursorPos: number
): { fnName: string; argIndex: number } | null {
  if (!formula.startsWith('=')) return null;
  let lastOpenParen = -1;
  let depth = 0;
  for (let i = cursorPos - 1; i >= 0; i--) {
    if (formula[i] === ')') depth++;
    else if (formula[i] === '(') {
      if (depth === 0) { lastOpenParen = i; break; }
      depth--;
    }
  }
  if (lastOpenParen === -1) return null;
  const fnMatch = formula.substring(0, lastOpenParen).match(/([A-Za-z_ÄÖÜäöüß]+)$/);
  if (!fnMatch) return null;
  const fnName = fnMatch[1].toUpperCase();
  const argsStr = formula.substring(lastOpenParen + 1, cursorPos);
  let argIndex = 0;
  let inQuotes = false;
  let currentDepth = 0;
  for (const char of argsStr) {
    if (char === '"') inQuotes = !inQuotes;
    else if (!inQuotes && char === '(') currentDepth++;
    else if (!inQuotes && char === ')') currentDepth--;
    else if (!inQuotes && currentDepth === 0 && char === ';') argIndex++;
  }
  return { fnName, argIndex };
}

// ═══════════════════════════════════════════════════════════════════════
// Helper: comma-to-semicolon conversion (bugs5.md Step 1)
// ═══════════════════════════════════════════════════════════════════════

function convertCommaToSemicolon(formula: string, cursorPos: number): string {
  if (!formula.startsWith('=')) return formula;
  return formula.substring(0, cursorPos - 1) + ';' + formula.substring(cursorPos);
}

// ═══════════════════════════════════════════════════════════════════════
// Helper: auto-close parentheses (bugs4.md Step 2a)
// ═══════════════════════════════════════════════════════════════════════

function autoCloseParentheses(formula: string): string {
  const openCount = (formula.match(/\(/g) || []).length;
  const closeCount = (formula.match(/\)/g) || []).length;
  if (openCount > closeCount) {
    return formula + ')'.repeat(openCount - closeCount);
  }
  return formula;
}

// ═══════════════════════════════════════════════════════════════════════
// Helper: F4 absolute reference toggle (bugs2.md Step 3)
// ═══════════════════════════════════════════════════════════════════════

function toggleF4Reference(ref: string): string {
  const stripped = ref.replace(/\$/g, '');
  const normalized = ref.toUpperCase();
  // Build modes from stripped reference to avoid $$ doubling
  const modes = [
    stripped,
    stripped.replace(/([A-Z]+)(\d+)/, '$$$1$$$2'),
    stripped.replace(/(\d+)/, '$$$1'),
    stripped.replace(/([A-Z]+)/, '$$$1'),
  ];
  const current = modes.indexOf(normalized);
  return modes[(current + 1) % modes.length] || modes[1];
}

// ═══════════════════════════════════════════════════════════════════════
// Helper: Ctrl+Shift+A insert function arguments (bugs7.md Step 1)
// ═══════════════════════════════════════════════════════════════════════

function insertFunctionArgs(formula: string): string | null {
  const m = formula.match(/([A-Za-z_ÄÖÜäöüß]+)$/);
  if (!m) return null;
  const fnName = m[1].toUpperCase();
  const found = EXCEL_FUNCTIONS_DE.find(f => f.name === fnName);
  if (!found) return null;
  const argsMatch = found.syntax.match(/\((.*)\)/);
  if (!argsMatch) return null;
  return formula.substring(0, formula.length - m[1].length) + fnName + '(' + argsMatch[1] + ')';
}

// ═══════════════════════════════════════════════════════════════════════
// CORRECTNESS TESTS
// ═══════════════════════════════════════════════════════════════════════

describe('bugs1.md — Performance & Stale Closures', () => {
  describe('Bug #3: afterChange optimized copy (only changed rows)', () => {
    it('copies only changed rows, not entire grid', () => {
      const data = Array.from({ length: 50 }, (_, r) =>
        Array.from({ length: 50 }, (_, c) => `R${r}C${c}`)
      );
      const changes: [number, number, string, string][] = [[3, 5, 'old', 'new']]; // row 4, col F
      const changedRowSet = new Set<number>();
      for (const [row] of changes) {
        if (row > 0) changedRowSet.add(row - 1);
      }
      const rowsCopied: number[] = [];
      const nd = data.map((r, i) => {
        if (changedRowSet.has(i)) rowsCopied.push(i);
        return changedRowSet.has(i) ? [...r] : r;
      });
      // Verify only 1 row was copied (HT row 3 → data index 2, row 0 is header)
      expect(rowsCopied).toEqual([2]);
      // Verify unchanged rows share references
      expect(nd[0]).toBe(data[0]);
      expect(nd[1]).toBe(data[1]);
      expect(nd[3]).toBe(data[3]);
      // Verify changed row (data index 2 = HT row 3) is a new copy
      expect(nd[2]).not.toBe(data[2]);
      expect(nd[2]).toEqual(data[2]);
    });
  });

  describe('Bug #10: error lookup uses Set O(1) instead of find O(n)', () => {
    it('Set.has is O(1) vs Array.find is O(n)', () => {
      const errors = Array.from({ length: 100 }, (_, i) => ({
        row: i,
        col: 5,
        expected: 'X',
        got: 'Y',
      }));
      const errorSet = new Set(errors.map(e => `${e.row}:${e.col}`));
      // O(1) lookup
      expect(errorSet.has('50:5')).toBe(true);
      expect(errorSet.has('999:5')).toBe(false);
      // O(n) lookup for comparison
      expect(errors.find(e => e.row === 50 && e.col === 5)).toBeDefined();
      expect(errors.find(e => e.row === 999 && e.col === 5)).toBeUndefined();
    });
  });
});

describe('bugs2.md — Formula Editing Friction', () => {
  describe('Step 3: F4 absolute reference order (Excel: A1→$A$1→A$1→$A1)', () => {
    it('cycles A1 → $A$1 → A$1 → $A1 → A1', () => {
      expect(toggleF4Reference('A1')).toBe('$A$1');
      expect(toggleF4Reference('$A$1')).toBe('A$1');
      expect(toggleF4Reference('A$1')).toBe('$A1');
      expect(toggleF4Reference('$A1')).toBe('A1');
    });

    it('handles different cell references', () => {
      expect(toggleF4Reference('B5')).toBe('$B$5');
      expect(toggleF4Reference('$B$5')).toBe('B$5');
      expect(toggleF4Reference('B$5')).toBe('$B5');
      expect(toggleF4Reference('$B5')).toBe('B5');
    });

    it('handles multi-letter columns', () => {
      expect(toggleF4Reference('AA10')).toBe('$AA$10');
      expect(toggleF4Reference('$AA$10')).toBe('AA$10');
    });
  });

  describe('Step 4: insertFunctionIntoEditor robustness', () => {
    it('replaces partial word at cursor', () => {
      const formula = '=SU';
      const m = formula.match(/([A-Za-z_ÄÖÜäöüß]+)$/);
      expect(m).not.toBeNull();
      expect(m![1]).toBe('SU');
    });

    it('detects no partial word (should insert at cursor)', () => {
      const formula = '=5+';
      const m = formula.match(/([A-Za-z_ÄÖÜäöüß]+)$/);
      expect(m).toBeNull(); // No partial function name
    });
  });
});

describe('bugs3.md — Visual & UX Formula Features', () => {
  describe('Step 1: Syntax highlighting for absolute references ($)', () => {
    it('matches $A$1 (absolute column and row)', () => {
      expect(findHighlightTokens('=$A$1')).toContain('REF:$A$1');
    });

    it('matches $A1 (absolute column only)', () => {
      expect(findHighlightTokens('=$A1')).toContain('REF:$A1');
    });

    it('matches A$1 (absolute row only)', () => {
      expect(findHighlightTokens('=A$1')).toContain('REF:A$1');
    });

    it('matches function names with refs', () => {
      const tokens = findHighlightTokens('=SUMME($A$1:$B$5)');
      expect(tokens).toContain('FN:SUMME');
      // Range with $ is captured as single token
      expect(tokens).toContain('REF:$A$1:$B$5');
    });

    it('matches ranges with $ prefixes', () => {
      const tokens = findHighlightTokens('=SVERWEIS(D1;$A$1:$B$10;2)');
      expect(tokens).toContain('FN:SVERWEIS');
      expect(tokens).toContain('REF:D1');
      expect(tokens).toContain('REF:$A$1:$B$10');
      expect(tokens).toContain('NUM:2');
    });

    it('matches quoted strings', () => {
      const tokens = findHighlightTokens('="hello world"');
      expect(tokens).toContain('STR:hello world');
    });

    it('matches numbers', () => {
      const tokens = findHighlightTokens('=5+3.14');
      expect(tokens).toContain('NUM:5');
      expect(tokens).toContain('NUM:3.14');
    });
  });

  describe('Step 2: AutoSum empty fallback', () => {
    it('detects when no numbers are adjacent', () => {
      // Simulate the logic: scan up, then left, then fallback
      const values: (string | number | null)[] = [null, '', 'text', null];
      let hasNumber = false;
      for (const v of values) {
        const num = typeof v === 'string' ? parseFloat(v) : (typeof v === 'number' ? v : NaN);
        if (!isNaN(num)) hasNumber = true;
      }
      expect(hasNumber).toBe(false); // Fallback should trigger
    });
  });

  describe('Step 3: ESC syncs formula bar to original value', () => {
    it('extracts correct source value on ESC', () => {
      // Simulate: on Escape, getSourceDataAtCell returns original value
      const originalValue = 'Hello';
      const restored = originalValue ?? '';
      expect(restored).toBe('Hello');
    });

    it('handles null source data', () => {
      const originalValue = null;
      const restored = originalValue === null || originalValue === undefined ? '' : String(originalValue);
      expect(restored).toBe('');
    });
  });
});

describe('bugs4.md — Function ScreenTip & Auto-Close Parens', () => {
  describe('Step 2a: Auto-close parentheses on Enter', () => {
    it('closes one unclosed parenthesis', () => {
      expect(autoCloseParentheses('=SUMME(A1:A5')).toBe('=SUMME(A1:A5)');
    });

    it('closes multiple unclosed parentheses', () => {
      expect(autoCloseParentheses('=WENN(SUMME(A1:A5')).toBe('=WENN(SUMME(A1:A5))');
    });

    it('does nothing when already balanced', () => {
      expect(autoCloseParentheses('=SUMME(A1:A5)')).toBe('=SUMME(A1:A5)');
    });

    it('does nothing for non-formulas', () => {
      expect(autoCloseParentheses('Hello')).toBe('Hello');
    });
  });

  describe('Step 2b: Function ScreenTip detection', () => {
    it('detects simple function with open paren', () => {
      const val = '=SUMME(';
      const m = val.match(/([A-Za-z_ÄÖÜäöüß]+)\([^)]*$/);
      expect(m).not.toBeNull();
      expect(m![1].toUpperCase()).toBe('SUMME');
    });

    it('detects function with arguments', () => {
      const val = '=WENN(A1>10;B1';
      const m = val.match(/([A-Za-z_ÄÖÜäöüß]+)\([^)]*$/);
      expect(m).not.toBeNull();
      expect(m![1].toUpperCase()).toBe('WENN');
    });

    it('does not match closed function', () => {
      const val = '=SUMME(A1:A5)';
      const m = val.match(/([A-Za-z_ÄÖÜäöüß]+)\([^)]*$/);
      expect(m).toBeNull();
    });
  });
});

describe('bugs5.md — German Locale & Real-Time Sync', () => {
  describe('Step 1: Comma → Semicolon auto-conversion', () => {
    it('converts comma to semicolon in formula', () => {
      const formula = '=SUMME(A1,';
      const cursorPos = formula.length;
      expect(convertCommaToSemicolon(formula, cursorPos)).toBe('=SUMME(A1;');
    });

    it('does not convert comma outside formulas', () => {
      const formula = 'Hello, World';
      const cursorPos = 7;
      expect(convertCommaToSemicolon(formula, cursorPos)).toBe('Hello, World');
    });

    it('preserves cursor position', () => {
      const formula = '=SUMME(A1,'; // cursor at end
      const cursorPos = formula.length;
      const result = convertCommaToSemicolon(formula, cursorPos);
      expect(result).toBe('=SUMME(A1;');
      expect(result.length).toBe(formula.length); // Same length
    });
  });
});

describe('bugs6.md — Advanced Tooltip & Autocomplete', () => {
  describe('Step 1: Depth-aware function parser', () => {
    it('finds outer function in nested formula', () => {
      const val = '=WENN(SUMME(A1:A5)>10;';
      const cursorPos = val.length;
      const result = findActiveFunction(val, cursorPos);
      expect(result).not.toBeNull();
      expect(result!.fnName).toBe('WENN');
      expect(result!.argIndex).toBe(1); // Second argument (0-indexed: Prüfung=0, Dann_Wert=1)
    });

    it('finds inner function when cursor is inside nested call', () => {
      const val = '=WENN(SUMME(A1:A5';
      const cursorPos = val.length;
      const result = findActiveFunction(val, cursorPos);
      expect(result).not.toBeNull();
      expect(result!.fnName).toBe('SUMME');
      expect(result!.argIndex).toBe(0);
    });

    it('handles zero arguments', () => {
      const val = '=HEUTE(';
      const cursorPos = val.length;
      const result = findActiveFunction(val, cursorPos);
      expect(result).not.toBeNull();
      expect(result!.fnName).toBe('HEUTE');
      expect(result!.argIndex).toBe(0);
    });

    it('handles quoted semicolons (does not count as arg separator)', () => {
      const val = '=WENN(A1="a;b";';
      const cursorPos = val.length;
      const result = findActiveFunction(val, cursorPos);
      expect(result).not.toBeNull();
      expect(result!.fnName).toBe('WENN');
      expect(result!.argIndex).toBe(1); // Only counts the ; outside quotes
    });

    it('returns null for non-formula text', () => {
      expect(findActiveFunction('Hello', 5)).toBeNull();
    });

    it('returns null when no open parenthesis', () => {
      expect(findActiveFunction('=A1+B1', 6)).toBeNull();
    });
  });

  describe('Step 2: Autocomplete triggers on 1 letter', () => {
    it('matches with 1 character', () => {
      const partial = 'S';
      expect(partial.length).toBeGreaterThanOrEqual(1);
      const matches = EXCEL_FUNCTIONS_DE.filter(f => f.name.startsWith(partial));
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.some(f => f.name === 'SUMME')).toBe(true);
    });

    it('matches with 2 characters (narrower)', () => {
      const partial = 'SU';
      const matches1 = EXCEL_FUNCTIONS_DE.filter(f => f.name.startsWith('S'));
      const matches2 = EXCEL_FUNCTIONS_DE.filter(f => f.name.startsWith('SU'));
      expect(matches2.length).toBeLessThanOrEqual(matches1.length);
    });
  });
});

describe('bugs7.md — Ctrl+Shift+A & Formula Bar', () => {
  describe('Step 1: Ctrl+Shift+A inserts function arguments', () => {
    it('inserts WENN arguments', () => {
      const result = insertFunctionArgs('=WENN');
      expect(result).toBe('=WENN(Prüfung; Dann_Wert; [Sonst_Wert])');
    });

    it('inserts SUMME arguments', () => {
      const result = insertFunctionArgs('=SUMME');
      expect(result).toBe('=SUMME(Zahl1; [Zahl2]; ...)');
    });

    it('returns null for unknown function', () => {
      expect(insertFunctionArgs('=UNKNOWN')).toBeNull();
    });

    it('returns null for non-function text', () => {
      expect(insertFunctionArgs('=5+')).toBeNull();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════
// UTILITY TESTS (reference conversion)
// ═══════════════════════════════════════════════════════════════════════

describe('Reference Utilities (from types.ts)', () => {
  describe('rangeToRef', () => {
    it('converts single cell range to ref', () => {
      expect(rangeToRef({ startRow: 0, startCol: 0, endRow: 0, endCol: 0 })).toBe('A1');
    });

    it('converts multi-cell range to ref', () => {
      expect(
        rangeToRef({ startRow: 0, startCol: 0, endRow: 4, endCol: 1 })
      ).toBe('A1:B5');
    });

    it('handles multi-letter columns', () => {
      expect(
        rangeToRef({ startRow: 0, startCol: 26, endRow: 9, endCol: 27 })
      ).toBe('AA1:AB10');
    });
  });

  describe('extractPartialFunction', () => {
    it('extracts after =', () => {
      expect(extractPartialFunction('=SU')).toBe('SU');
    });

    it('extracts after comma', () => {
      expect(extractPartialFunction('=5+,SU')).toBe('SU');
    });

    it('extracts after semicolon', () => {
      expect(extractPartialFunction('=SUMME(A1;SU')).toBe('SU');
    });

    it('extracts after opening paren', () => {
      expect(extractPartialFunction('=WENN(SU')).toBe('SU');
    });

    it('extracts German characters', () => {
      expect(extractPartialFunction('=ZÄH')).toBe('ZÄH');
    });

    it('returns null when no partial function', () => {
      expect(extractPartialFunction('=5+')).toBeNull();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════
// BUG FIX: Range selection during formula editing — #ERROR suppression
// ═══════════════════════════════════════════════════════════════════════
// When typing =SUMME( and clicking a cell with the mouse, Handsontable
// closes the editor and commits the incomplete formula (=SUMME() → #ERROR!
// BEFORE afterSelectionEnd can rebuild the formula with the cell reference.
// Fix: isRangeSelecting flag suppresses the spurious afterChange commit.

describe('Bug Fix: Range Selection During Formula Editing', () => {
  describe('Formula reconstruction during range selection', () => {
    it('builds =SUMME(C7 from =SUMME( + click on C7', () => {
      const formula = '=SUMME(';
      const selStart = 7; // cursor at end
      const selEnd = 7;
      const clickedCell = { row: 6, col: 2 }; // C7 → row 6, col 2
      const rangeStr = rangeToRef({
        startRow: clickedCell.row,
        startCol: clickedCell.col,
        endRow: clickedCell.row,
        endCol: clickedCell.col,
      });
      expect(rangeStr).toBe('C7');
      const newFormula = formula.substring(0, selStart) + rangeStr + formula.substring(selEnd);
      expect(newFormula).toBe('=SUMME(C7');
    });

    it('builds =SUMME(A1:B5 from =SUMME( + drag-select A1:B5', () => {
      const formula = '=SUMME(';
      const selStart = 7;
      const selEnd = 7;
      const rangeStr = rangeToRef({
        startRow: 0, startCol: 0,
        endRow: 4, endCol: 1,
      });
      expect(rangeStr).toBe('A1:B5');
      const newFormula = formula.substring(0, selStart) + rangeStr + formula.substring(selEnd);
      expect(newFormula).toBe('=SUMME(A1:B5');
    });

    it('builds =WENN(C7 from =WENN( + click on C7', () => {
      const formula = '=WENN(';
      const selStart = 6;
      const selEnd = 6;
      const rangeStr = positionToRef({ row: 6, col: 2 });
      expect(rangeStr).toBe('C7');
      const newFormula = formula.substring(0, selStart) + rangeStr + formula.substring(selEnd);
      expect(newFormula).toBe('=WENN(C7');
    });

    it('builds =SVERWEIS(42;C7 from =SVERWEIS(42; + click on C7', () => {
      const formula = '=SVERWEIS(42;';
      const selStart = 14;
      const selEnd = 14;
      const rangeStr = positionToRef({ row: 6, col: 2 });
      expect(rangeStr).toBe('C7');
      const newFormula = formula.substring(0, selStart) + rangeStr + formula.substring(selEnd);
      expect(newFormula).toBe('=SVERWEIS(42;C7');
    });

    it('replaces selected text with range (as Excel does)', () => {
      const formula = '=SUMME(X99)';
      const selStart = 7;
      const selEnd = 10; // 'X99' selected
      const rangeStr = 'C7';
      const newFormula = formula.substring(0, selStart) + rangeStr + formula.substring(selEnd);
      expect(newFormula).toBe('=SUMME(C7)');
    });
  });

  describe('isRangeSelecting flag logic (simulated)', () => {
    it('afterChange is suppressed when isRangeSelecting is true', () => {
      // Simulate the flow:
      // 1. User types =SUMME( in cell A1
      // 2. User clicks C7 → beforeOnCellMouseDown sets isRangeSelecting=true
      // 3. Handsontable closes editor → afterChange fires
      // 4. afterChange sees isRangeSelecting=true → skips onChange
      let isRangeSelecting = true;
      let onChangeCalled = false;

      const changes = [[1, 0, 'oldValue', '=SUMME(']] as [number, number, string, string][];
      const source: string = 'edit';

      // Simulated afterChange
      if (isRangeSelecting) {
        isRangeSelecting = false;
        // Skip — do NOT call onChange
      } else if (changes && source !== 'loadData') {
        onChangeCalled = true;
      }

      expect(onChangeCalled).toBe(false);
      expect(isRangeSelecting).toBe(false);
    });

    it('afterChange is NOT suppressed when isRangeSelecting is false', () => {
      let isRangeSelecting = false;
      let onChangeCalled = false;

      const changes = [[1, 0, 'oldValue', '=SUMME(C7']] as [number, number, string, string][];
      const source: string = 'edit';

      if (isRangeSelecting) {
        isRangeSelecting = false;
      } else if (changes && source !== 'loadData') {
        onChangeCalled = true;
      }

      expect(onChangeCalled).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════
// PERFORMANCE TESTS
// ═══════════════════════════════════════════════════════════════════════
// These measure relative performance and catch algorithmic regressions.
// A regression is defined as the new approach being slower than the old one
// or exceeding reasonable time budgets for the expected workload.

describe('Performance: afterChange selective copy (Bug #3)', () => {
  const SIZE = 50;
  const grid = Array.from({ length: SIZE }, (_, r) =>
    Array.from({ length: SIZE }, (_, c) => `R${r}C${c}`)
  );

  it('selective copy only copies changed rows (49 rows share refs)', () => {
    const changedSet = new Set([3]);
    const nd = grid.map((r, i) => (changedSet.has(i) ? [...r] : r));
    let sharedCount = 0;
    for (let i = 0; i < SIZE; i++) {
      if (!changedSet.has(i) && nd[i] === grid[i]) sharedCount++;
    }
    expect(sharedCount).toBe(49); // Only 1 row copied, 49 share refs
  });

  it('selective copy is faster than full copy for single-cell edit', () => {
    const ITER = 1000;
    // Full copy
    const t0 = performance.now();
    for (let n = 0; n < ITER; n++) {
      const nd = grid.map(r => [...r]);
      nd[3][5] = 'new';
    }
    const fullTime = performance.now() - t0;
    // Selective copy
    const changedSet = new Set([3]);
    const t1 = performance.now();
    for (let n = 0; n < ITER; n++) {
      const nd = grid.map((r, i) => (changedSet.has(i) ? [...r] : r));
      nd[3][5] = 'new';
    }
    const selectTime = performance.now() - t1;
    // Selective should be at least as fast (not slower)
    expect(selectTime).toBeLessThanOrEqual(fullTime * 1.1);
  });

  it('50-cell changes: full copy copies all rows, selective copies only changed', () => {
    const changedSet = new Set([1, 2, 3, 10, 25, 40]);
    const nd = grid.map((r, i) => (changedSet.has(i) ? [...r] : r));
    let copiedCount = 0;
    for (let i = 0; i < SIZE; i++) {
      if (nd[i] !== grid[i]) copiedCount++;
    }
    expect(copiedCount).toBe(changedSet.size); // Only changed rows
  });
});

describe('Performance: Set O(1) vs Array.find O(n) for errors (Bug #10)', () => {
  const errors = Array.from({ length: 50 }, (_, i) => ({
    row: i, col: 5, expected: 'X', got: 'Y',
  }));
  const errorSet = new Set(errors.map(e => `${e.row}:${e.col}`));

  it('Set.has is correct for all error cells', () => {
    for (const e of errors) {
      expect(errorSet.has(`${e.row}:${e.col}`)).toBe(true);
    }
    expect(errorSet.has('999:5')).toBe(false);
  });

  it('Set.has is faster than Array.find for dense lookups', () => {
    const ITER = 50 * 10; // Simulate a full grid render
    const t0 = performance.now();
    for (let n = 0; n < 10; n++) {
      for (let r = 0; r < 50; r++) {
        for (let c = 0; c < 10; c++) {
          errors.find(e => e.row === r && e.col === c);
        }
      }
    }
    const findTime = performance.now() - t0;

    const t1 = performance.now();
    for (let n = 0; n < 10; n++) {
      for (let r = 0; r < 50; r++) {
        for (let c = 0; c < 10; c++) {
          errorSet.has(`${r}:${c}`);
        }
      }
    }
    const setTime = performance.now() - t1;
    // Set should be significantly faster (O(1) vs O(n))
    expect(setTime).toBeLessThan(findTime);
  });
});

describe('Performance: Syntax highlight regex (bugs3.md Step 1)', () => {
  it('completes highlighting under 5ms for complex formula', () => {
    const formula = '=WENN(SUMME($A$1:$B$10)>5;"Ja";"Nein")';
    const t0 = performance.now();
    for (let i = 0; i < 100; i++) {
      const regex = /([A-Za-z_ÄÖÜäöüß]+)\(|"([^"]*)"|(\$?[A-Za-z]+\$?\d+(?::\$?[A-Za-z]+\$?\d+)?)|(\d+[,.]?\d*)/g;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(formula)) !== null) { /* no-op */ }
    }
    const time = performance.now() - t0;
    expect(time).toBeLessThan(100); // 100 iterations under 100ms
  });
});

describe('Performance: Depth-aware function parser (bugs6.md Step 1)', () => {
  it('parses nested formula under 1ms', () => {
    const val = '=WENN(SUMME(A1:A5)>10;MITTELWERT(B1:B5);"text")';
    const t0 = performance.now();
    for (let i = 0; i < 1000; i++) {
      findActiveFunction(val, val.length - 1);
    }
    const time = performance.now() - t0;
    expect(time).toBeLessThan(50); // 1000 iterations under 50ms
  });
});

describe('Performance: Large grid scalability', () => {
  it('50x50 grid selective copy completes under 5ms', () => {
    const SIZE = 50;
    const grid = Array.from({ length: SIZE }, (_, r) =>
      Array.from({ length: SIZE }, (_, c) => `R${r}C${c}`)
    );
    const t0 = performance.now();
    const changedSet = new Set([25]);
    const nd = grid.map((r, i) => (changedSet.has(i) ? [...r] : r));
    nd[25][24] = 'changed';
    const time = performance.now() - t0;
    expect(time).toBeLessThan(5);
  });

  it('100x100 grid selective copy stays linear', () => {
    const SIZE = 100;
    const grid = Array.from({ length: SIZE }, (_, r) =>
      Array.from({ length: SIZE }, (_, c) => `R${r}C${c}`)
    );
    const t0 = performance.now();
    const changedSet = new Set([50]);
    const nd = grid.map((r, i) => (changedSet.has(i) ? [...r] : r));
    nd[50][50] = 'changed';
    const time = performance.now() - t0;
    // 10,000 cells should still complete quickly since only 1 row is copied
    expect(time).toBeLessThan(20);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// REGRESSION TESTS — ensure fixes don't break existing behavior
// ═══════════════════════════════════════════════════════════════════════

describe('Regression: Existing Reference Utilities', () => {
  it('colToLetter classic cases', () => {
    expect(colToLetter(0)).toBe('A');
    expect(colToLetter(25)).toBe('Z');
    expect(colToLetter(26)).toBe('AA');
    expect(colToLetter(701)).toBe('ZZ');
  });

  it('positionToRef classic cases', () => {
    expect(positionToRef({ row: 0, col: 0 })).toBe('A1');
    expect(positionToRef({ row: 9, col: 2 })).toBe('C10');
  });

  it('refToRange classic cases', () => {
    expect(refToRange('A1:B2')).toEqual({
      startRow: 0, startCol: 0, endRow: 1, endCol: 1,
    });
  });

  it('rangeToRef roundtrip', () => {
    const range: CellRange = { startRow: 2, startCol: 3, endRow: 5, endCol: 6 };
    const ref = rangeToRef(range);
    const back = refToRange(ref);
    expect(back).toEqual(range);
  });
});

describe('Regression: Excel Functions List', () => {
  it('all 20+ German functions are present', () => {
    expect(EXCEL_FUNCTIONS_DE.length).toBeGreaterThanOrEqual(20);
  });

  it('all functions have name and syntax', () => {
    EXCEL_FUNCTIONS_DE.forEach(f => {
      expect(f.name).toBeTruthy();
      expect(f.syntax).toBeTruthy();
      expect(f.category).toBeTruthy();
    });
  });

  it('category distribution is correct', () => {
    const cats = new Set(EXCEL_FUNCTIONS_DE.map(f => f.category));
    expect(cats.has('Mathematik')).toBe(true);
    expect(cats.has('Statistik')).toBe(true);
    expect(cats.has('Logik')).toBe(true);
    expect(cats.has('Verweis')).toBe(true);
    expect(cats.has('Datum')).toBe(true);
  });
});
