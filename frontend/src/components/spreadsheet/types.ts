// Types for the Excel-like Spreadsheet Simulator

export interface CellPosition {
  row: number;
  col: number;
}

export interface CellRange {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export interface HighlightedRange {
  cells: CellPosition[];
  color: string; // CSS color for the highlight border
}

export type ExcelErrorType =
  | '#DIV/0!'
  | '#NAME?'
  | '#VALUE!'
  | '#REF!'
  | '#NULL!'
  | '#NUM!'
  | '#N/A';

export interface CalculatedValue {
  value: number | string | boolean | null;
  type: 'number' | 'text' | 'boolean' | 'error' | 'empty';
  errorType?: ExcelErrorType;
  rawFormula?: string;
}

export interface SpreadsheetTemplate {
  cols: number;
  rows: number;
  headers: string[];
  data: (string | number | null)[][];
  taskCols: number[];
  formulaHint?: string;
}

// ── Cell Formatting (mirrors FortuneSheet cell properties) ──────────────

export interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  bgColor?: string;
  hAlign?: 'left' | 'center' | 'right';
  vAlign?: 'top' | 'middle' | 'bottom';
  textWrap?: boolean;
  numberFormat?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
}

// ── Format key → CellFormat map. Key is "R{row}C{col}" ──────────────────

export type CellFormats = Record<string, CellFormat>;

// ── Ribbon tab definitions ─────────────────────────────────────────────

export type RibbonTabId = 'start' | 'insert' | 'pageLayout' | 'formulas' | 'data' | 'review' | 'view';

export interface RibbonGroup {
  id: string;
  label: string;
  items: RibbonItem[];
}

export type RibbonItem =
  | { type: 'button'; id: string; icon: string; label: string; onClick: string; active?: boolean; disabled?: boolean; tooltip?: string }
  | { type: 'dropdown'; id: string; icon?: string; label: string; options: { value: string; label: string }[]; value: string; onChange: string; width?: number }
  | { type: 'colorPicker'; id: string; icon: string; label: string; value: string; onChange: string }
  | { type: 'splitButton'; id: string; icon: string; label: string; onClick: string; options: { value: string; label: string; onClick: string }[] }
  | { type: 'toggle'; id: string; icon: string; label: string; active: boolean; onClick: string; tooltip?: string }
  | { type: 'separator' }
  | { type: 'zoom'; id: string };

// ── Status bar state ───────────────────────────────────────────────────

export interface StatusBarInfo {
  mode: 'ready' | 'edit' | 'enter';
  selectionCount?: number;
  selectionSum?: number;
  selectionAvg?: number;
  selectionMin?: number;
  selectionMax?: number;
  zoom: number;
}

// ── Context menu ───────────────────────────────────────────────────────

export type ContextMenuAction =
  | 'cut' | 'copy' | 'paste' | 'pasteValues' | 'pasteFormulas' | 'pasteFormats' | 'pasteTranspose'
  | 'insertCells' | 'insertRow' | 'insertColumn'
  | 'deleteCells' | 'deleteRow' | 'deleteColumn'
  | 'clearContents' | 'clearFormats' | 'clearAll'
  | 'formatCells' | 'mergeCells' | 'unmergeCells' | 'formatAsTable'
  | 'conditionalFormatting' | 'autoFitColumn' | 'hideColumn' | 'unhideColumn'
  | 'sortAsc' | 'sortDesc' | 'filterByValue' | 'quickAnalysis';

export interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  cellRange: CellRange | null;
  isHeader?: boolean;
}

// Supported Excel functions for autocomplete
export const EXCEL_FUNCTIONS_DE = [
  { name: 'SUMME', syntax: 'SUMME(Zahl1; [Zahl2]; ...)', category: 'Mathematik' },
  { name: 'SUMMEWENN', syntax: 'SUMMEWENN(Bereich; Kriterium; [Summe_Bereich])', category: 'Mathematik' },
  { name: 'MITTELWERT', syntax: 'MITTELWERT(Zahl1; [Zahl2]; ...)', category: 'Statistik' },
  { name: 'ANZAHL', syntax: 'ANZAHL(Wert1; [Wert2]; ...)', category: 'Statistik' },
  { name: 'ZÄHLENWENN', syntax: 'ZÄHLENWENN(Bereich; Kriterium)', category: 'Statistik' },
  { name: 'MIN', syntax: 'MIN(Zahl1; [Zahl2]; ...)', category: 'Statistik' },
  { name: 'MAX', syntax: 'MAX(Zahl1; [Zahl2]; ...)', category: 'Statistik' },
  { name: 'MEDIAN', syntax: 'MEDIAN(Zahl1; [Zahl2]; ...)', category: 'Statistik' },
  { name: 'WENN', syntax: 'WENN(Prüfung; Dann_Wert; [Sonst_Wert])', category: 'Logik' },
  { name: 'UND', syntax: 'UND(Wahrheitswert1; [Wahrheitswert2]; ...)', category: 'Logik' },
  { name: 'ODER', syntax: 'ODER(Wahrheitswert1; [Wahrheitswert2]; ...)', category: 'Logik' },
  { name: 'WENNFEHLER', syntax: 'WENNFEHLER(Wert; Wert_falls_Fehler)', category: 'Logik' },
  { name: 'SVERWEIS', syntax: 'SVERWEIS(Suchkriterium; Matrix; Spaltenindex; [Bereich_Verweis])', category: 'Verweis' },
  { name: 'XVERWEIS', syntax: 'XVERWEIS(Suchkriterium; Suchmatrix; Rückgabematrix; [Standardwert])', category: 'Verweis' },
  { name: 'RUNDEN', syntax: 'RUNDEN(Zahl; Anzahl_Stellen)', category: 'Mathematik' },
  { name: 'HEUTE', syntax: 'HEUTE()', category: 'Datum' },
  { name: 'JETZT', syntax: 'JETZT()', category: 'Datum' },
  { name: 'PRODUKT', syntax: 'PRODUKT(Zahl1; [Zahl2]; ...)', category: 'Mathematik' },
  { name: 'ABS', syntax: 'ABS(Zahl)', category: 'Mathematik' },
  { name: 'WURZEL', syntax: 'WURZEL(Zahl)', category: 'Mathematik' },
];

export { EXCEL_FUNCTIONS_DE as EXCEL_FUNCTIONS };

// Column index to letter (0 -> A, 1 -> B, ..., 25 -> Z, 26 -> AA)
export function colToLetter(col: number): string {
  let result = '';
  let c = col;
  while (c >= 0) {
    result = String.fromCharCode((c % 26) + 65) + result;
    c = Math.floor(c / 26) - 1;
  }
  return result;
}

// Cell reference to position (A1 -> {row:0, col:0})
export function refToPosition(ref: string): CellPosition | null {
  const match = ref.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  let col = 0;
  for (const ch of match[1]) {
    col = col * 26 + (ch.charCodeAt(0) - 64);
  }
  return { row: parseInt(match[2]) - 1, col: col - 1 };
}

// Position to cell reference ({row:0, col:0} -> A1)
export function positionToRef(pos: CellPosition): string {
  return `${colToLetter(pos.col)}${pos.row + 1}`;
}

// Cell range to reference (A1:B5)
export function rangeToRef(range: CellRange): string {
  const start = positionToRef({ row: range.startRow, col: range.startCol });
  const end = positionToRef({ row: range.endRow, col: range.endCol });
  return start === end ? start : `${start}:${end}`;
}

// Reference string to range
// "A1:B5" → {startRow:0, startCol:0, endRow:4, endCol:1}
// "C3" → {startRow:2, startCol:2, endRow:2, endCol:2}
export function refToRange(ref: string): CellRange | null {
  if (ref.includes(':')) {
    const [s, e] = ref.split(':');
    const start = refToPosition(s);
    const end = refToPosition(e);
    if (!start || !end) return null;
    return {
      startRow: Math.min(start.row, end.row),
      startCol: Math.min(start.col, end.col),
      endRow: Math.max(start.row, end.row),
      endCol: Math.max(start.col, end.col),
    };
  }
  const pos = refToPosition(ref);
  if (!pos) return null;
  return { startRow: pos.row, startCol: pos.col, endRow: pos.row, endCol: pos.col };
}
