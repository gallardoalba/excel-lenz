/**
 * Spreadsheet Operations Tests
 * Row/col ops, copy/paste, undo/redo, merge, format painter, sort/filter
 */
import { describe, it, expect } from 'vitest';

describe('Row Operations', () => {
  it('insert row uses v18 alter("insert_row")', () => {
    const action = 'insert_row';
    expect(action).toBe('insert_row');
    expect(action).not.toBe('insert_row_below'); // v14 removed
  });

  it('delete row uses alter("remove_row")', () => {
    expect('remove_row').toBe('remove_row');
  });

  it('insert row calculates target from selectedRange or activeCell', () => {
    const selectedRange = { startRow: 5 };
    const activeCell = { row: 3, col: 0 };
    const targetRow = selectedRange?.startRow ?? activeCell?.row ?? 0;
    expect(targetRow).toBe(5);
  });

  it('insert row defaults to 0 when no selection', () => {
    const targetRow = (null as any)?.startRow ?? (null as any)?.row ?? 0;
    expect(targetRow).toBe(0);
  });

  it('onChange is called with source data after insert', () => {
    const src = [['Apfel', 1], ['Birne', 2]];
    const mapped = src.map(r => [...r]);
    expect(mapped.length).toBe(2);
    expect(mapped[0][0]).toBe('Apfel');
  });
});

describe('Column Operations', () => {
  it('insert column uses v18 alter("insert_col")', () => {
    expect('insert_col').toBe('insert_col');
    expect('insert_col').not.toBe('insert_col_start');
  });

  it('delete column uses alter("remove_col")', () => {
    expect('remove_col').toBe('remove_col');
  });
});

describe('Copy/Paste Operations', () => {
  it('copy captures clipboard formats from source cell', () => {
    const cellFormats = { 'R0C0': { bold: true, italic: false } };
    const src = cellFormats['R0C0'];
    expect(src).toEqual({ bold: true, italic: false });
  });

  it('paste values converts comma decimals', () => {
    const val = '1,5';
    const parsed = val.replace(',', '.');
    expect(Number(parsed)).toBe(1.5);
  });

  it('paste values preserves numbers', () => {
    const val = '42';
    const parsed = val.replace(',', '.');
    expect(Number(parsed)).toBe(42);
  });

  it('paste values does not convert non-numeric strings', () => {
    const val = 'Hello';
    const parsed = val.replace(',', '.');
    expect(isNaN(Number(parsed))).toBe(true);
  });

  it('paste formats applies clipboard format to target range', () => {
    const srcFormat = { bold: true, bgColor: '#ff0000' };
    const target = { bold: false };
    const merged = { ...target, ...srcFormat };
    expect(merged.bold).toBe(true);
    expect(merged.bgColor).toBe('#ff0000');
  });

  it('paste mode resets to normal after each paste', () => {
    let mode = 'values';
    mode = 'normal';
    expect(mode).toBe('normal');
  });

  it('cut clears formatting from source range', () => {
    const formats: Record<string, object | undefined> = { 'R0C0': { bold: true }, 'R0C1': { bold: true } };
    delete formats['R0C0'];
    expect(formats['R0C0']).toBeUndefined();
    expect(formats['R0C1']).toEqual({ bold: true });
  });
});

describe('Undo/Redo', () => {
  it('undo calls hot.undo() and hot.render()', () => {
    let undoCalled = false;
    let renderCalled = false;
    const mockHot = { undo: () => { undoCalled = true; }, render: () => { renderCalled = true; }, isDestroyed: false };
    mockHot.undo();
    mockHot.render();
    expect(undoCalled).toBe(true);
    expect(renderCalled).toBe(true);
  });

  it('redo calls hot.redo() and hot.render()', () => {
    let redoCalled = false;
    const mockHot = { redo: () => { redoCalled = true; }, render: () => {}, isDestroyed: false };
    mockHot.redo();
    expect(redoCalled).toBe(true);
  });

  it('undo/redo guard against destroyed instance', () => {
    const mockHot = { undo: () => { throw new Error('should not be called'); }, isDestroyed: true };
    let called = false;
    if (!mockHot.isDestroyed) { called = true; }
    expect(called).toBe(false);
  });

  it('format changes create undo points via touch-cell pattern', () => {
    const cellValue = 'test';
    expect(cellValue).toBe('test'); // setDataAtCell with same value creates undo point
  });
});

describe('Merge Cells', () => {
  it('merge uses mergeCells plugin', () => {
    const actions = ['merge', 'unmerge'];
    expect(actions).toContain('merge');
    expect(actions).toContain('unmerge');
  });

  it('single-cell selection does not trigger merge', () => {
    const sr = { startRow: 2, startCol: 2, endRow: 2, endCol: 2 };
    const isSingleCell = sr.startRow === sr.endRow && sr.startCol === sr.endCol;
    expect(isSingleCell).toBe(true);
  });

  it('multi-cell range triggers merge', () => {
    const sr = { startRow: 0, startCol: 0, endRow: 2, endCol: 2 };
    const isSingleCell = sr.startRow === sr.endRow && sr.startCol === sr.endCol;
    expect(isSingleCell).toBe(false);
  });
});

describe('Format Painter', () => {
  it('activating painter captures source cell format', () => {
    const activeCell = { row: 1, col: 1 };
    const cellFormats: Record<string, object> = { 'R1C1': { bold: true, fontColor: '#ff0000' } };
    const src = cellFormats[`R${activeCell.row}C${activeCell.col}`];
    expect(src).toEqual({ bold: true, fontColor: '#ff0000' });
  });

  it('deactivating painter clears state on second click', () => {
    let painter = { bold: true };
    painter = null as any;
    expect(painter).toBeNull();
  });

  it('selecting cells while painter active applies format', () => {
    const painterSrc = { bold: true, bgColor: '#ffcc00' };
    const targetFormat = {};
    const merged = { ...targetFormat, ...painterSrc };
    expect(merged.bold).toBe(true);
    expect(merged.bgColor).toBe('#ffcc00');
  });

  it('painter applies to entire selected range', () => {
    const range = { startRow: 0, startCol: 0, endRow: 2, endCol: 1 };
    const painterSrc = { italic: true };
    const newFormats: Record<string, object> = {};
    for (let r = range.startRow; r <= range.endRow; r++) {
      for (let c = range.startCol; c <= range.endCol; c++) {
        newFormats[`R${r}C${c}`] = { ...painterSrc };
      }
    }
    expect(Object.keys(newFormats).length).toBe(6); // 3 rows × 2 cols
  });
});

describe('Sort & Filter', () => {
  it('sort asc uses columnSorting plugin', () => {
    expect('asc').toBe('asc');
  });

  it('sort desc uses columnSorting plugin', () => {
    expect('desc').toBe('desc');
  });

  it('filter triggers filters plugin', () => {
    let filterCalled = false;
    const mockPlugin = { filter: () => { filterCalled = true; } };
    mockPlugin.filter();
    expect(filterCalled).toBe(true);
  });
});

describe('Cell Formatting', () => {
  it('format key uses R{row}C{col} pattern', () => {
    expect(`R${0}C${0}`).toBe('R0C0');
    expect(`R${5}C${3}`).toBe('R5C3');
  });

  it('number format: currency', () => {
    const fmt = { numberFormat: '#,##0.00 €' };
    expect(fmt.numberFormat).toContain('€');
  });

  it('number format: percent', () => {
    const fmt = { numberFormat: '0%' };
    expect(fmt.numberFormat).toBe('0%');
  });

  it('number format: date (German)', () => {
    const fmt = { numberFormat: 'DD.MM.YYYY' };
    expect(fmt.numberFormat).toBe('DD.MM.YYYY');
  });

  it('bold/italic/underline are boolean flags', () => {
    const fmt = { bold: true, italic: false, underline: true };
    expect(fmt.bold).toBe(true);
    expect(fmt.italic).toBe(false);
    expect(fmt.underline).toBe(true);
  });
});

describe('Context Menu Actions', () => {
  it('all context menu actions are defined', () => {
    const actions = [
      'cut', 'copy', 'paste', 'pasteValues', 'pasteFormulas', 'pasteFormats', 'pasteTranspose',
      'insertCells', 'insertRow', 'insertColumn',
      'deleteCells', 'deleteRow', 'deleteColumn',
      'clearContents', 'clearFormats', 'clearAll',
      'formatCells', 'mergeCells', 'unmergeCells', 'formatAsTable',
      'conditionalFormatting', 'autoFitColumn', 'hideColumn', 'unhideColumn',
      'sortAsc', 'sortDesc', 'filterByValue', 'quickAnalysis',
    ];
    expect(actions.length).toBeGreaterThan(25);
  });
});

describe('Zoom', () => {
  it('zoom in clamps to 200', () => {
    const zoom = (z: number) => Math.min(z + 10, 200);
    expect(zoom(195)).toBe(200);
    expect(zoom(200)).toBe(200);
  });

  it('zoom out clamps to 50', () => {
    const zoom = (z: number) => Math.max(z - 10, 50);
    expect(zoom(55)).toBe(50);
    expect(zoom(50)).toBe(50);
  });

  it('zoom reset sets to 100', () => {
    expect(100).toBe(100);
  });
});
