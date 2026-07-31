// ── SpreadsheetHandsontable: Handsontable + Excel Ribbon ───────────────────
// Uses native HyperFormula plugin with German language support

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { HyperFormula } from 'hyperformula';
import deDE from 'hyperformula/i18n/languages/deDE';

// Register German language pack
HyperFormula.registerLanguage('deDE', deDE);

// Register plugins
import { registerPlugin, ColumnSorting, Filters, Search, AutoColumnSize } from 'handsontable/plugins';
registerPlugin(ColumnSorting);
registerPlugin(Filters);
registerPlugin(Search);
registerPlugin(AutoColumnSize);

import ExcelRibbon from './ExcelRibbon';
import FormulaBar from './FormulaBar';
import StatusBar from './StatusBar';
import ContextMenu from './ContextMenu';
import ChartDialog from './ChartDialog';
import DataValidationDialog from './DataValidationDialog';
import PivotTableDialog from './PivotTableDialog';
import type { CellPosition, CellRange, CellFormat, CellFormats, StatusBarInfo, ContextMenuAction, ContextMenuState } from './types';
import { positionToRef, colToLetter, refToRange } from './types';

// HyperFormula instance — created per component mount via useRef
function createHF(): HyperFormula {
  const hf = HyperFormula.buildEmpty({ licenseKey: 'gpl-v3', language: 'deDE' });
  hf.addSheet('Sheet1');
  return hf;
}

interface SpreadsheetHandsontableProps {
  headers: string[];
  data: (string | number | null)[][];
  onChange: (data: (string | number | null)[][]) => void;
  taskCols: number[];
  readOnly?: boolean;
  cellFormats?: CellFormats;
  onCellFormatsChange?: (formats: CellFormats) => void;
  gridHeight?: number;
  /** Cells with errors: highlight with soft red */
  errorCells?: { row: number; col: number; expected: string | number; got: string | number | null }[];
  /** Practice mode: evaluate cells on each change */
  mode?: 'exam' | 'practice';
  solution?: { evaluatedData: (string | number | null)[][] };
}

export default function SpreadsheetHandsontable({
  headers,
  data,
  onChange,
  taskCols,
  readOnly = false,
  cellFormats: externalFormats,
  onCellFormatsChange,
  gridHeight: externalGridHeight,
  errorCells,
  mode = 'exam',
  solution,
}: SpreadsheetHandsontableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hotRef = useRef<Handsontable | null>(null);
  const hfRef = useRef<HyperFormula | null>(null);
  const dataRef = useRef(data);
  const headersRef = useRef(headers);
  const isInternalChange = useRef(false);
  const dataIdRef = useRef<number>(0);
  dataRef.current = data;
  headersRef.current = headers;

  // State
  const [activeCell, setActiveCell] = useState<CellPosition | null>(null);
  const [selectedRange, setSelectedRange] = useState<CellRange | null>(null);
  const [cellFormats, setCellFormats] = useState<CellFormats>(externalFormats || {});
  const [formulaBarValue, setFormulaBarValue] = useState('');
  const [statusInfo, setStatusInfo] = useState<StatusBarInfo>({ mode: 'ready', zoom: 100 });
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, cellRange: null });
  const [zoom, setZoom] = useState(100);
  // Native undo state for ribbon buttons
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  // Conditional formatting rules
  const [condRules, setCondRules] = useState<{ col: number; operator: string; value: number; color: string }[]>([]);
  // Internal error cells state (merged with prop errorCells)
  const [internalErrors, setInternalErrors] = useState<{ row: number; col: number; expected: string; got: string }[]>([]);
  // Refs to keep cellFormats and condRules accessible in the HOT renderer (fixes stale closure)
  const cellFormatsRef = useRef(cellFormats);
  const condRulesRef = useRef(condRules);
  const errorCellsRef = useRef(errorCells);
  useEffect(() => { cellFormatsRef.current = cellFormats; }, [cellFormats]);
  useEffect(() => { condRulesRef.current = condRules; }, [condRules]);
  // Merge prop errors with internal practice mode errors
  const mergedErrors = useMemo(() => [...(errorCells || []), ...internalErrors], [errorCells, internalErrors]);
  useEffect(() => { errorCellsRef.current = mergedErrors; }, [mergedErrors]);

  // Refs to avoid keyboard listener re-renders
  // In-cell autocomplete
  const [cellAutocomplete, setCellAutocomplete] = useState<{ visible: boolean; x: number; y: number; items: { name: string; syntax: string }[]; index: number }>({ visible: false, x: 0, y: 0, items: [], index: 0 });
  // Format Painter state
  const [formatPainterSrc, setFormatPainterSrc] = useState<CellFormat | null>(null);
  // Merge state for ribbon button
  const [isMerged, setIsMerged] = useState(false);
  // Chart dialog state
  const [showChartDialog, setShowChartDialog] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [chartData, setChartData] = useState<Record<string, string | number>[]>([]);
  // Data validation
  const [validationRules, setValidationRules] = useState<{ col: number; type: string; min?: number; max?: number; list?: string; errorMessage: string }[]>([]);
  const validationRulesRef = useRef(validationRules);
  useEffect(() => { validationRulesRef.current = validationRules; }, [validationRules]);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  // Pivot table
  const [showPivotDialog, setShowPivotDialog] = useState(false);
  const [pivotData, setPivotData] = useState<Record<string, string | number>[]>([]);
  // Format application — syncs with Handsontable's native undo by touching the active cell
  const applyFormatsWithUndo = useCallback((newFormats: CellFormats) => {
    const hot = hotRef.current;
    setCellFormats(newFormats);
    cellFormatsRef.current = newFormats; // sync ref immediately for renderer
    onCellFormatsChange?.(newFormats);
    // Touch the active cell to create an undo point in Handsontable's history
    if (hot && !hot.isDestroyed && activeCell) {
      const currentVal = hot.getDataAtCell(activeCell.row, activeCell.col);
      hot.setDataAtCell(activeCell.row, activeCell.col, currentVal, 'formatChange');
    }
    if (hot && !hot.isDestroyed) hot.render();
  }, [activeCell, onCellFormatsChange]);

  // Undo/Redo — native Handsontable plugin (synced with format changes via applyFormatsWithUndo)
  const handleUndo = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    hot.undo();
    hot.render();
  }, []);

  const handleRedo = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    hot.redo();
    hot.render();
  }, []);

  // Multi-sheet state
  const [sheets, setSheets] = useState<{ id: number; name: string }[]>([{ id: 0, name: 'Tabelle1' }]);
  const [activeSheetId, setActiveSheetId] = useState(0);
  const allDataRef = useRef<Record<number, (string | number | null)[][]>>({ 0: data });
  const allFormatsRef = useRef<Record<number, CellFormats>>({ 0: {} });

  // German function list for autocomplete
  const DE_FUNCTIONS: { name: string; syntax: string }[] = [
    { name: 'SUMME', syntax: 'SUMME(Zahl1; [Zahl2]; ...)' },
    { name: 'SUMMEWENN', syntax: 'SUMMEWENN(Bereich; Kriterium; [Summe_Bereich])' },
    { name: 'MITTELWERT', syntax: 'MITTELWERT(Zahl1; [Zahl2]; ...)' },
    { name: 'ANZAHL', syntax: 'ANZAHL(Wert1; [Wert2]; ...)' },
    { name: 'ANZAHL2', syntax: 'ANZAHL2(Wert1; [Wert2]; ...)' },
    { name: 'ZÄHLENWENN', syntax: 'ZÄHLENWENN(Bereich; Kriterium)' },
    { name: 'MIN', syntax: 'MIN(Zahl1; [Zahl2]; ...)' },
    { name: 'MAX', syntax: 'MAX(Zahl1; [Zahl2]; ...)' },
    { name: 'MEDIAN', syntax: 'MEDIAN(Zahl1; [Zahl2]; ...)' },
    { name: 'WENN', syntax: 'WENN(Prüfung; Dann_Wert; [Sonst_Wert])' },
    { name: 'UND', syntax: 'UND(Wahrheitswert1; [Wahrheitswert2]; ...)' },
    { name: 'ODER', syntax: 'ODER(Wahrheitswert1; [Wahrheitswert2]; ...)' },
    { name: 'WENNFEHLER', syntax: 'WENNFEHLER(Wert; Wert_falls_Fehler)' },
    { name: 'SVERWEIS', syntax: 'SVERWEIS(Suchkriterium; Matrix; Spaltenindex; [Bereich_Verweis])' },
    { name: 'XVERWEIS', syntax: 'XVERWEIS(Suchkriterium; Suchmatrix; Rückgabematrix; [Standardwert])' },
    { name: 'RUNDEN', syntax: 'RUNDEN(Zahl; Anzahl_Stellen)' },
    { name: 'HEUTE', syntax: 'HEUTE()' },
    { name: 'JETZT', syntax: 'JETZT()' },
    { name: 'PRODUKT', syntax: 'PRODUKT(Zahl1; [Zahl2]; ...)' },
    { name: 'ABS', syntax: 'ABS(Zahl)' },
    { name: 'WURZEL', syntax: 'WURZEL(Zahl)' },
    { name: 'STABW', syntax: 'STABW(Zahl1; [Zahl2]; ...)' },
  ];

  // Sync external formats
  useEffect(() => {
    if (externalFormats) setCellFormats(externalFormats);
  }, [externalFormats]);

  // Active format for ribbon
  const activeFormat = useMemo((): CellFormat => {
    if (!activeCell) return {};
    return cellFormats[`R${activeCell.row}C${activeCell.col}`] || {};
  }, [activeCell, cellFormats]);

  // Apply format to selected cells
  const applyFormat = useCallback((format: Partial<CellFormat>) => {
    if (!selectedRange) return;
    const newFormats = { ...cellFormats };
    for (let r = selectedRange.startRow; r <= selectedRange.endRow; r++) {
      for (let c = selectedRange.startCol; c <= selectedRange.endCol; c++) {
        const key = `R${r}C${c}`;
        newFormats[key] = { ...newFormats[key], ...format };
      }
    }
    applyFormatsWithUndo(newFormats);
  }, [selectedRange, cellFormats, applyFormatsWithUndo]);

  // Zoom
  const handleZoomIn = useCallback(() => setZoom(z => Math.min(z + 10, 200)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(z - 10, 50)), []);
  const handleZoomReset = useCallback(() => setZoom(100), []);

  // Insert/Delete row handlers
  const handleInsertRow = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const row = selectedRange?.startRow ?? activeCell?.row ?? 0;
    hot.alter('insert_row_below', row);
    setTimeout(() => {
      const physicalData = hot.getSourceData() as (string | number | null)[][];
      onChange(physicalData.slice(1).map(r => [...r]));
    }, 0);
  }, [selectedRange, activeCell, onChange]);

  const handleDeleteRow = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const row = selectedRange?.startRow ?? activeCell?.row ?? 0;
    hot.alter('remove_row', row);
    setTimeout(() => {
      const physicalData = hot.getSourceData() as (string | number | null)[][];
      onChange(physicalData.slice(1).map(r => [...r]));
    }, 0);
  }, [selectedRange, activeCell, onChange]);

  // Clipboard handlers
  const handleCopy = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed || !selectedRange) return;
    hot.getPlugin('copyPaste').copy();
    clipboardFormatsRef.current = cellFormatsRef.current[`R${selectedRange.startRow}C${selectedRange.startCol}`] || null;
  }, [selectedRange]);

  const handleCut = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const sel = hot.getSelected();
    if (sel?.length) {
      hot.getPlugin('copyPaste').cut();
      if (selectedRange) {
        const newFormats = { ...cellFormatsRef.current };
        for (let r = selectedRange.startRow; r <= selectedRange.endRow; r++) {
          for (let c = selectedRange.startCol; c <= selectedRange.endCol; c++) {
            delete newFormats[`R${r}C${c}`];
          }
        }
        applyFormatsWithUndo(newFormats);
      }
    }
  }, [selectedRange, applyFormatsWithUndo]);

  const handlePaste = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    hot.getPlugin('copyPaste').paste();
  }, []);

  // Merge handler
  const handleMerge = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed || !selectedRange) return;
    const { startRow, startCol, endRow, endCol } = selectedRange;
    if (startRow === endRow && startCol === endCol) return;
    const mc = hot.getPlugin('mergeCells');
    if (mc) {
      // Check if the top-left cell is already merged
      const cellMeta = hot.getCellMeta(startRow, startCol) as any;
      if (cellMeta.merged) {
        mc.unmerge(startRow, startCol, endRow, endCol);
      } else {
        mc.merge(startRow, startCol, endRow, endCol);
      }
    }
    hot.render();
  }, [selectedRange]);

  // Conditional formatting handler — uses a simple dialog instead of prompt()
  const [showCFDialog, setShowCFDialog] = useState(false);
  const [cfOperator, setCfOperator] = useState('>');
  const [cfValue, setCfValue] = useState('0');
  const [cfColor, setCfColor] = useState('#ffcccc');

  const handleConditionalFormat = useCallback(() => {
    if (!selectedRange) return;
    setShowCFDialog(true);
  }, [selectedRange]);

  const applyCFRule = useCallback(() => {
    const col = selectedRange?.startCol ?? 0;
    const value = parseFloat(cfValue);
    if (isNaN(value)) return;
    setCondRules(prev => [...prev, { col, operator: cfOperator, value, color: cfColor }]);
    setShowCFDialog(false);
  }, [selectedRange, cfOperator, cfValue, cfColor]);

  // Sort/Filter ribbon handlers
  const handleSort = useCallback((dir: 'asc' | 'desc') => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed || !selectedRange) return;
    const cs = hot.getPlugin('columnSorting');
    if (cs) cs.sort({ column: selectedRange.startCol, sortOrder: dir });
  }, [selectedRange]);

  const handleFilter = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const f = hot.getPlugin('filters');
    if (f) f.filter();
  }, []);

  // Format Painter handler — first click activates, next cell selection applies
  const handleFormatPainter = useCallback(() => {
    if (formatPainterSrc) {
      // Second click: deactivate painter
      setFormatPainterSrc(null);
    } else {
      // First click: activate painter, copy format from active cell
      if (activeCell) {
        setFormatPainterSrc(cellFormatsRef.current[`R${activeCell.row}C${activeCell.col}`] || {});
      }
    }
  }, [formatPainterSrc, activeCell]);

  // Apply Format Painter when user selects a cell while painter is active
  useEffect(() => {
    if (!formatPainterSrc || !selectedRange) return;
    const newFormats = { ...cellFormatsRef.current };
    for (let r = selectedRange.startRow; r <= selectedRange.endRow; r++) {
      for (let c = selectedRange.startCol; c <= selectedRange.endCol; c++) {
        newFormats[`R${r}C${c}`] = { ...newFormats[`R${r}C${c}`], ...formatPainterSrc };
      }
    }
    setCellFormats(newFormats);
    onCellFormatsChange?.(newFormats);
    setFormatPainterSrc(null);
    const hot = hotRef.current;
    if (hot && !hot.isDestroyed) hot.render();
  }, [selectedRange, formatPainterSrc, onCellFormatsChange]);

  // Multi-sheet handlers
  const handleAddSheet = useCallback(() => {
    const newId = sheets.length > 0 ? Math.max(...sheets.map(s => s.id)) + 1 : 0;
    const newName = `Tabelle${newId + 1}`;
    // Save current data
    const hot = hotRef.current;
    if (hot && !hot.isDestroyed) {
      allDataRef.current[activeSheetId] = (hot.getData() as (string | number | null)[][]);
    }
    // Add sheet to HF
    const hf = hfRef.current;
    if (hf) {
      const sheetNames = hf.getSheetNames();
      if (!sheetNames.includes(newName)) {
        hf.addSheet(newName);
      }
    }
    allDataRef.current[newId] = [];
    setSheets(prev => [...prev, { id: newId, name: newName }]);
    setActiveSheetId(newId);
  }, [sheets, activeSheetId]);

  const handleSwitchSheet = useCallback((sheetId: number) => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed || sheetId === activeSheetId) return;
    // Save current data and formats
    allDataRef.current[activeSheetId] = (hot.getSourceData() as (string | number | null)[][]).slice(1);
    allFormatsRef.current[activeSheetId] = { ...cellFormatsRef.current };
    // Load new sheet data
    const newData = allDataRef.current[sheetId] || [];
    hot.loadData([headersRef.current.map(h => h), ...newData.map(row => row.map(cell => (cell === null ? '' : cell)))]);
    // Load sheet formats
    const newFormats = allFormatsRef.current[sheetId] || {};
    setCellFormats(newFormats);
    cellFormatsRef.current = newFormats;
    // Update HyperFormula sheet context
    const sheetName = sheets.find(s => s.id === sheetId)?.name || `Tabelle${sheetId + 1}`;
    hot.updateSettings({ formulas: { engine: hfRef.current as any, sheetName } });
    // Force recalculation in the new sheet
    hfRef.current?.rebuildAndRecalculate();
    setActiveSheetId(sheetId);
    hot.render();
  }, [activeSheetId, sheets]);

  // Freeze handler
  const handleFreeze = useCallback((type: 'row' | 'column' | 'both' | 'none') => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    switch (type) {
      case 'row': hot.updateSettings({ fixedRowsTop: (activeCell?.row ?? 0) + 1, fixedColumnsLeft: 0 }); break;
      case 'column': hot.updateSettings({ fixedRowsTop: 0, fixedColumnsLeft: (activeCell?.col ?? 0) + 1 }); break;
      case 'both': hot.updateSettings({ fixedRowsTop: (activeCell?.row ?? 0) + 1, fixedColumnsLeft: (activeCell?.col ?? 0) + 1 }); break;
      default: hot.updateSettings({ fixedRowsTop: 0, fixedColumnsLeft: 0 }); break;
    }
  }, [activeCell]);

  // Practice mode: check a single cell against solution
  const checkCellPractice = useCallback((row: number, col: number) => {
    if (!solution || mode !== 'practice') return;
    const hot = hotRef.current;
    if (!hot) return;
    (hfRef.current as any)?.evaluate?.();
    const got = hot.getDataAtCell(row, col);
    const expected = solution.evaluatedData[row]?.[col];
    if (expected === null || expected === undefined || expected === '') return;
    const numExpected = parseFloat(String(expected));
    const numGot = parseFloat(String(got));
    const isCorrect = !isNaN(numExpected)
      ? Math.abs(numGot - numExpected) < 0.01
      : String(got).trim() === String(expected).trim();

    setInternalErrors((prev: { row: number; col: number; expected: string; got: string }[]) => {
      const filtered = prev.filter(e => !(e.row === row && e.col === col));
      if (!isCorrect) {
        return [...filtered, { row, col, expected: String(expected), got: String(got ?? '') }];
      }
      return filtered;
    });
  }, [solution, mode]);

  // Paste Special mode
  const pasteModeRef = useRef<'normal' | 'values' | 'formats'>('normal');
  // Clipboard formats ref — stores format of copied cell for "Paste Formats"
  const clipboardFormatsRef = useRef<CellFormat | null>(null);

  // Context menu — full implementation
  const handleContextMenuAction = useCallback((action: ContextMenuAction) => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const sr = selectedRange;
    const cp = hot.getPlugin('copyPaste');
    const mc = hot.getPlugin('mergeCells');

    switch (action) {
      // Clipboard
      case 'cut': cp?.cut(); break;
      case 'copy': cp?.copy(); break;
      case 'paste': pasteModeRef.current = 'normal'; cp?.paste(); break;
      case 'pasteValues': pasteModeRef.current = 'values'; cp?.paste(); break;
      case 'pasteFormulas': pasteModeRef.current = 'normal'; cp?.paste(); break;
      case 'pasteFormats': pasteModeRef.current = 'formats'; cp?.paste(); break;
      case 'pasteTranspose': { if (sr) { navigator.clipboard.readText().then(text => { const rows = text.split('\n').filter(Boolean).map((r: string) => r.split('\t')); const transposed = rows[0]?.map((_: any, i: number) => rows.map(r => r[i] || '')) || []; hot.populateFromArray(sr.startRow, sr.startCol, transposed); }); } break; }

      // Insert/Delete
      case 'insertCells': if (sr) { hot.alter('insert_row_below', sr.startRow); } break;
      case 'insertRow': hot.alter('insert_row_below', sr?.startRow ?? 0); break;
      case 'insertColumn': 
        if (sr) { const amount = sr.endCol - sr.startCol + 1; hot.alter('insert_col_start', sr.startCol, amount); }
        break;
      case 'deleteCells': if (sr) { hot.alter('remove_row', sr.startRow, sr.endRow); } break;
      case 'deleteRow': if (sr) { const amount = sr.endRow - sr.startRow + 1; hot.alter('remove_row', sr.startRow, amount); } break;
      case 'deleteColumn': if (sr) { const amount = sr.endCol - sr.startCol + 1; hot.alter('remove_col', sr.startCol, amount); } break;

      // Clear
      case 'clearContents': if (sr) { const emptyData = Array(sr.endRow - sr.startRow + 1).fill(null).map(() => Array(sr.endCol - sr.startCol + 1).fill('')); hot.populateFromArray(sr.startRow, sr.startCol, emptyData); } break;
      case 'clearFormats': if (sr) { const n = { ...cellFormatsRef.current }; for (let r = sr.startRow; r <= sr.endRow; r++) for (let c = sr.startCol; c <= sr.endCol; c++) delete n[`R${r}C${c}`]; applyFormatsWithUndo(n); setCondRules(prev => prev.filter(rule => rule.col < sr.startCol || rule.col > sr.endCol)); hot.render(); } break;
      case 'clearAll': if (sr) { const emptyData = Array(sr.endRow - sr.startRow + 1).fill(null).map(() => Array(sr.endCol - sr.startCol + 1).fill('')); hot.populateFromArray(sr.startRow, sr.startCol, emptyData); setCellFormats((prev: CellFormats) => { const n = { ...prev }; for (let r = sr.startRow; r <= sr.endRow; r++) for (let c = sr.startCol; c <= sr.endCol; c++) delete n[`R${r}C${c}`]; return n; }); hot.render(); } break;

      // Format
      case 'formatCells': break;
      case 'mergeCells': if (sr && (sr.startRow !== sr.endRow || sr.startCol !== sr.endCol)) { const cellMeta = hot.getCellMeta(sr.startRow, sr.startCol) as any; cellMeta.merged ? mc?.unmerge(sr.startRow, sr.startCol, sr.endRow, sr.endCol) : mc?.merge(sr.startRow, sr.startCol, sr.endRow, sr.endCol); hot.render(); } break;
      case 'unmergeCells': if (sr) { mc?.unmerge(sr.startRow, sr.startCol, Math.max(sr.startRow, hot.countRows() - 1), Math.max(sr.startCol, hot.countCols() - 1)); hot.render(); } break;
      case 'conditionalFormatting': break;
      case 'autoFitColumn': if (sr) { 
        const plugin = hot.getPlugin('autoColumnSize'); 
        if (plugin) { 
          for (let c = sr.startCol; c <= sr.endCol; c++) {
            (plugin as any).recalculateWidth?.(c);
            const newWidth = plugin.getColumnWidth(c);
            const resizePlugin = hot.getPlugin('manualColumnResize');
            if (newWidth && resizePlugin && typeof (resizePlugin as any).setManualSize === 'function') {
              (resizePlugin as any).setManualSize(c, Math.min(newWidth, 300));
            }
          }
        }
      } break;
      case 'hideColumn': if (sr) {
        const hiddenPlugin = hot.getPlugin('hiddenColumns');
        let currentlyHidden: number[] = [];
        if (hiddenPlugin && Array.isArray((hiddenPlugin as any).hiddenColumns)) {
          currentlyHidden = (hiddenPlugin as any).hiddenColumns;
        }
        for (let c = sr.startCol; c <= sr.endCol; c++) {
          if (!currentlyHidden.includes(c)) currentlyHidden.push(c);
        }
        hot.updateSettings({ hiddenColumns: { columns: currentlyHidden } });
      } break;
      case 'unhideColumn': if (sr) {
        const hiddenPlugin = hot.getPlugin('hiddenColumns');
        if (hiddenPlugin) {
          for (let c = sr.startCol; c <= sr.endCol; c++) {
            (hiddenPlugin as any).showColumn?.(c);
          }
          hot.render();
        }
      } break;

      // Sort & Filter
      case 'sortAsc': if (sr) { const cs = hot.getPlugin('columnSorting'); if (cs) cs.sort({ column: sr.startCol, sortOrder: 'asc' }); } break;
      case 'sortDesc': if (sr) { const cs = hot.getPlugin('columnSorting'); if (cs) cs.sort({ column: sr.startCol, sortOrder: 'desc' }); } break;
      case 'filterByValue': if (sr) { const f = hot.getPlugin('filters'); if (f) { f.addCondition(sr.startCol, 'by_value', [String(hot.getDataAtCell(sr.startRow, sr.startCol) ?? '')]); f.filter(); } } break;
      case 'quickAnalysis': break; // Visual indicator only
      case 'formatAsTable': {
        // Apply alternating row colors to the selected range
        if (sr) {
          const colors = ['#ffffff', '#e2efda']; // Excel green alternating
          const newFormats = { ...cellFormats };
          for (let r = sr.startRow; r <= sr.endRow; r++) {
            for (let c = sr.startCol; c <= sr.endCol; c++) {
              const rowIdx = r - sr.startRow;
              const key = `R${r}C${c}`;
              newFormats[key] = { ...newFormats[key], bgColor: rowIdx === 0 ? '#217346' : colors[rowIdx % 2], fontColor: rowIdx === 0 ? '#ffffff' : undefined, bold: rowIdx === 0 };
            }
          }
          applyFormatsWithUndo(newFormats);
          // Enable filters on the range
          const f = hot.getPlugin('filters');
          if (f) f.filter();
        }
        break;
      }

      default: break;
    }
  }, [selectedRange]);

  // Refs to avoid keyboard listener re-renders
  const activeFormatRef = useRef(activeFormat);
  useEffect(() => { activeFormatRef.current = activeFormat; }, [activeFormat]);
  const applyFormatRef = useRef(applyFormat);
  useEffect(() => { applyFormatRef.current = applyFormat; }, [applyFormat]);

  // Refs for formula editing — must be declared BEFORE the HOT init useEffect
  const formulaValueRef = useRef(formulaBarValue);
  formulaValueRef.current = formulaBarValue;
  const isFormulaEditingRef = useRef(false);

  // Init Handsontable
  useEffect(() => {
    if (!containerRef.current) return;
    // Properly destroy existing instance before re-initializing
    if (hotRef.current && !hotRef.current.isDestroyed) {
      hotRef.current.destroy();
    }
    containerRef.current.innerHTML = '';

    // Create HyperFormula instance per component (prevents cross-instance leaks)
    if (!hfRef.current) {
      hfRef.current = createHF();
      hfRef.current.renameSheet(0, 'Tabelle1');
    }

    const hot = new Handsontable(containerRef.current, {
      data: [headers.map(h => h), ...data.map(row => row.map(cell => (cell === null ? '' : cell)))],
      colHeaders: true,
      rowHeaders: true,
      height: externalGridHeight || 360,
      minRows: 50,
      minCols: 50,
      undo: true,
      licenseKey: 'non-commercial-and-evaluation',
      formulas: {
        engine: hfRef.current as any,
      },
      contextMenu: false as any,
      manualColumnResize: true,
      manualRowResize: true,
      mergeCells: true,
      fillHandle: !readOnly,
      columnSorting: true,
      filters: true,
      search: true,
      autoWrapRow: true,
      autoWrapCol: true,
      stretchH: 'all',
      readOnly,
      enterBeginsEditing: true,
      allowInsertRow: !readOnly,
      allowInsertColumn: !readOnly,
      allowRemoveRow: !readOnly,
      allowRemoveColumn: !readOnly,

      beforePaste(data: any[][], _coords: any[]) {
        if (pasteModeRef.current === 'values') {
          for (let r = 0; r < data.length; r++) {
            for (let c = 0; c < data[r].length; c++) {
              const val = data[r][c];
              if (typeof val === 'string' && val.trim() !== '') {
                const parsed = val.replace(',', '.');
                if (!isNaN(Number(parsed))) data[r][c] = Number(parsed);
              }
            }
          }
          pasteModeRef.current = 'normal';
          return true;
        }
        if (pasteModeRef.current === 'formats') {
          const hot = hotRef.current;
          if (hot && clipboardFormatsRef.current && selectedRange) {
            const newFormats = { ...cellFormatsRef.current };
            for (let r = selectedRange.startRow; r <= selectedRange.endRow; r++) {
              for (let c = selectedRange.startCol; c <= selectedRange.endCol; c++) {
                newFormats[`R${r}C${c}`] = { ...newFormats[`R${r}C${c}`], ...clipboardFormatsRef.current };
              }
            }
            setCellFormats(newFormats);
            onCellFormatsChange?.(newFormats);
            hot.render();
          }
          pasteModeRef.current = 'normal';
          return false;
        }
        return true;
      },

      cells(row: number, col: number) {
        const cellMeta: Record<string, any> = {};
        const isTask = taskCols.includes(col) && col < headers.length;
        // Block editing of header row (row 0)
        if (row === 0) {
          cellMeta.readOnly = true;
        }
        // Read from REFS (not state) to avoid stale closure
        const fmt = cellFormatsRef.current[`R${row}C${col}`];
        const rules = condRulesRef.current;
        if (!fmt?.numberFormat) {
          cellMeta.type = 'text';
          cellMeta.numericFormat = undefined;
        } else if (fmt?.numberFormat === 'DD.MM.YYYY') cellMeta.type = 'date';
        else if (fmt?.numberFormat === '0%') { cellMeta.type = 'numeric'; cellMeta.numericFormat = { pattern: '0%' }; }
        else if (fmt?.numberFormat === '#,##0.00 €') { cellMeta.type = 'numeric'; cellMeta.numericFormat = { pattern: '#,##0.00 €', culture: 'de-DE' }; }
        else if (fmt?.numberFormat === '#,##0.00') { cellMeta.type = 'numeric'; cellMeta.numericFormat = { pattern: '#,##0.00' }; }
        // Data validation
        const rule = validationRulesRef.current.find(r => r.col === col);
        if (rule && row > 0) {
          if (rule.type === 'number') {
            cellMeta.validator = (value: any, callback: (valid: boolean) => void) => {
              if (value === '' || value === null || value === undefined) return callback(true);
              const num = parseFloat(value);
              const valid = !isNaN(num) && (rule.min === undefined || num >= rule.min) && (rule.max === undefined || num <= rule.max);
              callback(valid);
            };
            cellMeta.allowInvalid = false;
          } else if (rule.type === 'list' && rule.list) {
            cellMeta.type = 'dropdown';
            cellMeta.source = rule.list.split(',').map(s => s.trim());
          }
        }
        // Renderer
        cellMeta.renderer = (instance: any, td: HTMLTableCellElement, _r: number, _c: number, _p: any, v: any, _cp: any) => {
          Handsontable.renderers.TextRenderer(instance, td, _r, _c, _p, v, _cp);
          // Reset inline styles to prevent ghost formats from previous exercises
          td.style.background = '';
          td.style.color = '';
          td.style.fontWeight = '';
          td.style.fontStyle = '';
          td.style.textDecoration = '';
          td.style.fontSize = '';
          td.style.fontFamily = '';
          td.style.borderTop = '';
          td.style.borderRight = '';
          td.style.borderBottom = '';
          td.style.borderLeft = '';
          const isActive = activeCell && activeCell.row === _r && activeCell.col === _c;
          // Read from REF inside renderer callback to avoid stale closure
          const key = `R${_r}C${_c}`;
          const fmt = cellFormatsRef.current[key];
          const rulesRenderer = condRulesRef.current;
          const classes: string[] = [];
          if (fmt?.bold) classes.push('htBold');
          if (fmt?.italic) classes.push('htItalic');
          if (fmt?.underline) classes.push('htUnderline');
          if (fmt?.hAlign === 'left') classes.push('htAlignLeft');
          if (fmt?.hAlign === 'center') classes.push('htAlignCenter');
          if (fmt?.hAlign === 'right') classes.push('htAlignRight');
          if (fmt?.vAlign === 'top') classes.push('htAlignTop');
          if (fmt?.vAlign === 'middle') classes.push('htAlignMiddle');
          if (fmt?.vAlign === 'bottom') classes.push('htAlignBottom');
          if (fmt?.textWrap) classes.push('htWrap');
          if (classes.length) td.className = (td.className || '') + ' ' + classes.join(' ');
          // Inline styles only for dynamic values (colors, fonts, sizes)
          if (fmt?.fontSize) td.style.fontSize = `${fmt.fontSize}px`;
          if (fmt?.fontFamily) td.style.fontFamily = fmt.fontFamily;
          if (fmt?.fontColor) td.style.color = fmt.fontColor;
          if (fmt?.bgColor) td.style.background = fmt.bgColor;
          // Borders
          if (fmt?.borderTop) td.style.borderTop = fmt.borderTop;
          if (fmt?.borderRight) td.style.borderRight = fmt.borderRight;
          if (fmt?.borderBottom) td.style.borderBottom = fmt.borderBottom;
          if (fmt?.borderLeft) td.style.borderLeft = fmt.borderLeft;
          // Header row (row 0) styling — bold + gray like Excel column headers
          if (_r === 0) {
            td.style.fontWeight = '600';
            td.style.background = isActive ? '#d6e6da' : '#f3f2f1';
            td.style.color = '#444';
            if (isActive) { td.style.outline = '2px solid #217346'; td.style.outlineOffset = '-2px'; td.style.zIndex = '2'; }
            return;
          }
          // Conditional formatting rules (skip header row) — read from REF
          for (const rule of rulesRenderer) {
            if (rule.col === _c) {
              const num = typeof v === 'string' ? parseFloat(v) : (typeof v === 'number' ? v : NaN);
              if (!isNaN(num)) {
                const match = rule.operator === '>' ? num > rule.value :
                  rule.operator === '<' ? num < rule.value :
                  rule.operator === '>=' ? num >= rule.value :
                  rule.operator === '<=' ? num <= rule.value : num === rule.value;
                if (match) { td.style.background = rule.color; break; }
              }
            }
          }
          // Task column styling
          if (isTask) {
            td.style.background = isActive ? '#c8e6c9' : (fmt?.bgColor || '#e8f5e9');
            if (!fmt?.bold) td.style.fontWeight = '600';
          } else if (isActive) {
            td.style.background = fmt?.bgColor || '#e3f2fd';
            td.style.outline = '2px solid #217346';
            td.style.outlineOffset = '-2px';
            td.style.zIndex = '2';
          }
          // Error cells — read from REF to avoid stale closure
          const currentErrors = errorCellsRef.current;
          if (currentErrors && currentErrors.length > 0) {
            const hasError = currentErrors.find(ec => ec.row === _r && ec.col === _c);
            if (hasError) {
              td.style.background = '#fff0f0';
              td.style.borderLeft = '2px solid #c62828';
              td.title = `Fehler: Erwartet wird "${hasError.expected}"`;
              // Green error triangle indicator
              if (!td.querySelector('.excel-error-triangle')) {
                td.style.position = 'relative';
                const triangle = document.createElement('div');
                triangle.className = 'excel-error-triangle';
                td.appendChild(triangle);
              }
            } else {
              const existingTriangle = td.querySelector('.excel-error-triangle');
              if (existingTriangle) existingTriangle.remove();
            }
          }
          // Formula error values in red
          if (typeof v === 'string' && v.startsWith('#') && v.length < 10) {
            td.style.color = '#c62828';
            td.style.fontWeight = '700';
            td.style.textAlign = 'center';
            td.title = `Fehler: ${v}`;
          }
        };
        return cellMeta;
      },

      afterBeginEditing() {
        setStatusInfo(prev => ({ ...prev, mode: 'enter' as const }));
      },

      beforeChange(_changes: any, _source: string) {
        // Native undo handles state — no manual snapshot needed
      },

      afterSelection(_r: number, _c: number, _r2: number, _c2: number) {
        setActiveCell({ row: _r, col: _c });
        setSelectedRange({
          startRow: Math.min(_r, _r2),
          startCol: Math.min(_c, _c2),
          endRow: Math.max(_r, _r2),
          endCol: Math.max(_c, _c2),
        });

        const h = hotRef.current;
        if (!h || h.isDestroyed) return;
        const activeEditor = h.getActiveEditor() as any;
        if (activeEditor && activeEditor.isOpened() &&
            typeof activeEditor.TEXTAREA?.value === 'string' &&
            activeEditor.TEXTAREA.value.startsWith('=')) {
          const rangeRef = (_r !== _r2 || _c !== _c2)
            ? `${colToLetter(Math.min(_c, _c2))}${Math.min(_r, _r2) + 1}:${colToLetter(Math.max(_c, _c2))}${Math.max(_r, _r2) + 1}`
            : `${colToLetter(_c)}${_r + 1}`;
          // Write directly into the editor
          activeEditor.setValue(activeEditor.TEXTAREA.value + rangeRef);
          activeEditor.TEXTAREA?.focus();
          if (activeEditor.TEXTAREA) {
            activeEditor.TEXTAREA.selectionStart = activeEditor.TEXTAREA.value.length;
            activeEditor.TEXTAREA.selectionEnd = activeEditor.TEXTAREA.value.length;
          }
        } else {
          // Normal behaviour — show cell value in formula bar (clear on multi-cell)
          if (_r !== _r2 || _c !== _c2) {
            setFormulaBarValue('');
          } else {
            const raw = _r === 0 ? headers[_c] : dataRef.current[_r - 1]?.[_c];
            const cellVal = raw === null || raw === undefined ? '' : String(raw);
            setFormulaBarValue(cellVal);
          }
        }
        // Update status bar aggregates
        const mc = hotRef.current?.getPlugin('mergeCells');
        if (mc) {
          const mergedParent = (mc as any).mergedCellsCollection?.get(_r, _c);
          setIsMerged(!!mergedParent);
        }
        const nums: number[] = [];
        const maxCells = 10000;
        let cellCount = 0;
        for (let r = Math.min(_r, _r2); r <= Math.max(_r, _r2) && cellCount < maxCells; r++)
          for (let c = Math.min(_c, _c2); c <= Math.max(_c, _c2) && cellCount < maxCells; c++) {
            cellCount++;
            const val = hotRef.current?.getDataAtCell(r, c);
            const num = typeof val === 'string' ? parseFloat(val) : (typeof val === 'number' ? val : NaN);
            if (!isNaN(num)) nums.push(num);
          }
        if (cellCount === maxCells) {
          setStatusInfo({ mode: 'ready', zoom, selectionCount: cellCount });
        } else if (nums.length > 0) {
          const sum = nums.reduce((a, b) => a + b, 0);
          const totalCells = (Math.max(_r, _r2) - Math.min(_r, _r2) + 1) * (Math.max(_c, _c2) - Math.min(_c, _c2) + 1);
          setStatusInfo({
            mode: 'ready', zoom,
            selectionCount: totalCells,
            selectionSum: sum,
            selectionAvg: sum / nums.length,
            selectionMin: Math.min(...nums),
            selectionMax: Math.max(...nums),
          });
        } else {
          setStatusInfo({ mode: 'ready', zoom });
        }
      },

      afterDeselect() {
        setStatusInfo(prev => ({ ...prev, mode: 'ready' as const }));
      },

      afterDocumentKeyDown(e: KeyboardEvent) {
        const hot = hotRef.current;
        if (!hot || hot.isDestroyed) return;
        const activeEditor = hot.getActiveEditor() as any;
        if (!activeEditor || !activeEditor.isOpened()) {
          if (cellAutocomplete.visible) setCellAutocomplete(prev => ({ ...prev, visible: false }));
          return;
        }
        const val: string = activeEditor.TEXTAREA?.value || '';

        // Update formula bar in real-time while typing
        if (typeof val === 'string' && val !== formulaValueRef.current) {
          setFormulaBarValue(val);
        }

        if (typeof val === 'string' && val.startsWith('=')) {
          // Extract the last function-name fragment (after =, (, ,, +, -, etc.)
          const m = val.match(/(?:^=|[(,;+\-*/><=& ])\s*([A-Za-z_ÄÖÜäöüß]+)$/);
          const partial = m ? m[1].toUpperCase() : null;
          if (partial && partial.length >= 2) {
            const matches = DE_FUNCTIONS.filter(f => f.name.startsWith(partial));
            if (matches.length > 0) {
              const td = hot.getCell(activeEditor.row, activeEditor.col, true);
              if (td) {
                const rect = td.getBoundingClientRect();
                setCellAutocomplete({ visible: true, x: rect.left, y: rect.bottom + 2, items: matches, index: 0 });
              }
            } else {
              setCellAutocomplete(prev => ({ ...prev, visible: false }));
            }
          } else {
            setCellAutocomplete(prev => ({ ...prev, visible: false }));
          }
        } else {
          setCellAutocomplete(prev => ({ ...prev, visible: false }));
        }
      },

      afterChange(changes: any, source: string) {
        if (!changes || source === 'loadData' || isInternalChange.current) return;
        const h2 = hotRef.current;
        if (h2 && !h2.isDestroyed) {
          setCanUndo(h2.isUndoAvailable());
          setCanRedo(h2.isRedoAvailable());
        }
        const nd = dataRef.current.map(r => [...r]);
        for (const [row, col, _old, newVal] of changes) {
          if (row === 0) continue;
          if (nd[row - 1]) nd[row - 1][col] = newVal;
          // Practice mode: check cell immediately
          if (mode === 'practice') checkCellPractice(row, col);
        }
        isInternalChange.current = true;
        onChange(nd);
        const lastChange = changes[changes.length - 1];
        if (lastChange) {
          const newVal = lastChange[3];
          setFormulaBarValue(newVal ?? '');
        }
        // Hide autocomplete on confirm — afterDocumentKeyDown handles live suggestions
        setCellAutocomplete(prev => ({ ...prev, visible: false }));
      },

      // Copy formats when auto-filling
      afterAutofill(start: any, end: any, _data: any) {
        // Handsontable passes coordinates as arrays: [startRow, startCol, endRow, endCol]
        const [startRow, startCol, endRowSrc, endColSrc] = start;
        const [endRow, endCol] = end;
        if (startRow == null || startCol == null) return;
        // Read from ref to avoid stale closure
        const currentFormats = cellFormatsRef.current;
        const newFormats = { ...currentFormats };
        for (let r = startRow; r <= (endRowSrc ?? startRow); r++) {
          for (let c = startCol; c <= (endColSrc ?? startCol); c++) {
            const srcKey = `R${r}C${c}`;
            const srcFmt = currentFormats[srcKey];
            if (!srcFmt) continue;
            const dr = endRow + (r - startRow);
            const dc = endCol + (c - startCol);
            newFormats[`R${dr}C${dc}`] = { ...srcFmt };
          }
        }
        setCellFormats(newFormats);
        onCellFormatsChange?.(newFormats);
        hotRef.current?.render();
      },

      // Sync cell formats when rows are inserted/removed (use amount for multi-row ops)
      afterCreateRow(row: number, amount: number) {
        setCellFormats((prev: CellFormats) => {
          const next: CellFormats = {};
          for (const [key, fmt] of Object.entries(prev)) {
            const m = key.match(/^R(\d+)C(\d+)$/);
            if (m) {
              const r = parseInt(m[1]);
              const c = parseInt(m[2]);
              next[`R${r >= row ? r + amount : r}C${c}`] = fmt;
            }
          }
          return next;
        });
        // Adjust frozen panes
        const h = hotRef.current;
        if (h && !h.isDestroyed) {
          const settings = h.getSettings();
          if (settings.fixedRowsTop && row < settings.fixedRowsTop) {
            h.updateSettings({ fixedRowsTop: settings.fixedRowsTop + amount });
          }
        }
      },
      afterRemoveRow(row: number, amount: number) {
        setCellFormats((prev: CellFormats) => {
          const next: CellFormats = {};
          for (const [key, fmt] of Object.entries(prev)) {
            const m = key.match(/^R(\d+)C(\d+)$/);
            if (m) {
              const r = parseInt(m[1]);
              const c = parseInt(m[2]);
              if (r >= row && r < row + amount) continue;
              next[`R${r > row ? r - amount : r}C${c}`] = fmt;
            }
          }
          return next;
        });
      },
      afterCreateCol(col: number, amount: number) {
        setCellFormats((prev: CellFormats) => {
          const next: CellFormats = {};
          for (const [key, fmt] of Object.entries(prev)) {
            const m = key.match(/^R(\d+)C(\d+)$/);
            if (m) {
              const r = parseInt(m[1]);
              const c = parseInt(m[2]);
              next[`R${r}C${c >= col ? c + amount : c}`] = fmt;
            }
          }
          return next;
        });
        // Adjust frozen panes
        const hc = hotRef.current;
        if (hc && !hc.isDestroyed) {
          const settings = hc.getSettings();
          if (settings.fixedColumnsLeft && col < settings.fixedColumnsLeft) {
            hc.updateSettings({ fixedColumnsLeft: settings.fixedColumnsLeft + amount });
          }
        }
      },
      afterRemoveCol(col: number, amount: number) {
        setCellFormats((prev: CellFormats) => {
          const next: CellFormats = {};
          for (const [key, fmt] of Object.entries(prev)) {
            const m = key.match(/^R(\d+)C(\d+)$/);
            if (m) {
              const r = parseInt(m[1]);
              const c = parseInt(m[2]);
              if (c >= col && c < col + amount) continue;
              next[`R${r}C${c > col ? c - amount : c}`] = fmt;
            }
          }
          return next;
        });
      },
    });

    hotRef.current = hot;

    // Context menu handler — supports cell and column header right-click
    const root = hot.rootElement;
    const onContextMenu = (e: MouseEvent) => {
      if (readOnly) return;
      e.preventDefault();
      const target = e.target as HTMLElement;
      const isColHeader = target.closest('th') && !target.closest('tbody');
      if (isColHeader) {
        // Column header context menu
        const th = target.closest('th');
        const colIdx = th ? parseInt((th as any).getAttribute?.('aria-colindex') || '0') - 1 : 0;
        setContextMenu({
          visible: true, x: e.clientX, y: e.clientY,
          cellRange: { startRow: 0, startCol: Math.max(0, colIdx), endRow: 0, endCol: Math.max(0, colIdx) },
          isHeader: true,
        } as any);
        return;
      }
      const sel = hot.getSelected();
      if (sel?.length) {
        const [r1, c1, r2, c2] = sel[0];
        setContextMenu({
          visible: true, x: e.clientX, y: e.clientY,
          cellRange: {
            startRow: Math.min(r1, r2 ?? r1),
            startCol: Math.min(c1, c2 ?? c1),
            endRow: Math.max(r1, r2 ?? r1),
            endCol: Math.max(c1, c2 ?? c1),
          },
          isHeader: false,
        } as any);
      }
    };
    root.addEventListener('contextmenu', onContextMenu);

    return () => {
      root.removeEventListener('contextmenu', onContextMenu);
      if (!hot.isDestroyed) hot.destroy();
      hfRef.current?.destroy();
      hfRef.current = null;
    };
  }, []); // Only init once

  // Sync data changes to Handsontable — ONLY for external changes (new exercise, reset)
  // User edits go through afterChange → onChange directly; skip loadData for those
  useEffect(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    // Skip if this was triggered by our own afterChange calling onChange
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    // External data change — reload the grid (including headers as row 0)
    hot.loadData([headers.map(h => h), ...data.map(row => row.map(cell => (cell === null ? '' : cell)))]);
    requestAnimationFrame(() => { isInternalChange.current = false; });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Sync external gridHeight changes after init
  useEffect(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed || !externalGridHeight) return;
    if (Math.abs((hot as any).rootElement?.offsetHeight - externalGridHeight) > 10) {
      hot.updateSettings({ height: externalGridHeight });
    }
  }, [externalGridHeight]);

  // Sync formula adapter
  useEffect(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    // HyperFormula is synced natively via formulas plugin
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isHotEditor = target.classList.contains('handsontableInput');
      // Allow format shortcuts while editing in Handsontable's textarea
      if ((target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) && !isHotEditor) return;

      // Update status bar to 'edit' mode when typing in cell
      if (isHotEditor && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setStatusInfo(prev => ({ ...prev, mode: 'edit' as const }));
      }
      if (readOnly && (e.key === 'Delete' || e.key === 'Backspace')) {
        e.preventDefault();
        return;
      }
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'z') { e.preventDefault(); handleUndo(); }
      else if (ctrl && e.key === 'y') { e.preventDefault(); handleRedo(); }
      else if (ctrl && e.key === 'b') { e.preventDefault(); applyFormat({ bold: !activeFormat.bold }); }
      else if (ctrl && e.key === 'i') { e.preventDefault(); applyFormat({ italic: !activeFormat.italic }); }
      else if (ctrl && e.key === 'u') { e.preventDefault(); applyFormat({ underline: !activeFormat.underline }); }
      else if (ctrl && e.shiftKey && e.code === 'Digit1') { e.preventDefault(); applyFormat({ numberFormat: '#,##0.00' }); }
      else if (ctrl && e.shiftKey && e.code === 'Digit5') { e.preventDefault(); applyFormat({ numberFormat: '0%' }); }
      else if (ctrl && e.shiftKey && e.code === 'Digit4') { e.preventDefault(); applyFormat({ numberFormat: '#,##0.00 €' }); }
      // Ctrl+Shift+L: Toggle filters
      else if (ctrl && e.shiftKey && e.code === 'KeyL') { e.preventDefault(); const hot = hotRef.current; if (hot) { const f = hot.getPlugin('filters'); if (f) f.filter(); } }
      // Ctrl+Space: Select entire column
      else if (ctrl && !e.shiftKey && e.key === ' ') { e.preventDefault(); const hot = hotRef.current; if (hot && activeCell) hot.selectColumns(activeCell.col); }
      // Shift+Space: Select entire row
      else if (!ctrl && e.shiftKey && e.key === ' ') { e.preventDefault(); const hot = hotRef.current; if (hot && activeCell) hot.selectRows(activeCell.row); }
      // Ctrl+1: Format Cells — apply default number format
      else if (ctrl && e.key === '1') { e.preventDefault(); applyFormat({ numberFormat: '#,##0.00' }); }
      // Ctrl+D: Fill down (skip if selection includes header row)
      else if (ctrl && e.key === 'd') {
        e.preventDefault();
        const hot = hotRef.current;
        if (hot && selectedRange && selectedRange.startRow > 0 && selectedRange.endRow > selectedRange.startRow) {
          for (let c = selectedRange.startCol; c <= selectedRange.endCol; c++) {
            const src = hot.getDataAtCell(selectedRange.startRow, c);
            for (let r = selectedRange.startRow + 1; r <= selectedRange.endRow; r++) {
              hot.setDataAtCell(r, c, src);
            }
          }
        }
      }
      // Ctrl+R: Fill right (skip if selection includes header row)
      else if (ctrl && e.key === 'r') {
        e.preventDefault();
        const hot = hotRef.current;
        if (hot && selectedRange && selectedRange.startRow > 0 && selectedRange.endCol > selectedRange.startCol) {
          for (let r = selectedRange.startRow; r <= selectedRange.endRow; r++) {
            const src = hot.getDataAtCell(r, selectedRange.startCol);
            for (let c = selectedRange.startCol + 1; c <= selectedRange.endCol; c++) {
              hot.setDataAtCell(r, c, src);
            }
          }
        }
      }
      // Alt+= : AutoSum — scan up, then left (skip on header row)
      else if (e.altKey && e.key === '=') {
        e.preventDefault();
        const hot = hotRef.current;
        if (hot && activeCell && activeCell.row > 0) {
          const col = activeCell.col;
          const row = activeCell.row;
          const colLetter = colToLetter(col);
          // Scan upward for contiguous numbers — use evaluated values from HOT
          let upStart: number | null = null;
          for (let r = row - 1; r >= 0; r--) {
            const val = hot.getDataAtCell(r, col);
            if (typeof val !== 'number' && isNaN(parseFloat(val))) break;
            upStart = r;
          }
          if (upStart !== null) {
            hot.setDataAtCell(row, col, `=SUMME(${colLetter}${upStart + 1}:${colLetter}${row})`);
          } else {
            // Scan left
            let leftStart: number | null = null;
            for (let c = col - 1; c >= 0; c--) {
              const val = hot.getDataAtCell(row, c);
              if (typeof val !== 'number' && isNaN(parseFloat(val))) break;
              leftStart = c;
            }
            if (leftStart !== null) {
              const leftLetter = colToLetter(leftStart);
              hot.setDataAtCell(row, col, `=SUMME(${leftLetter}${row + 1}:${colLetter}${row + 1})`);
            }
          }
        }
      }
      // Alt+Enter: line break in cell
      else if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        const hot = hotRef.current;
        if (hot && activeCell) {
          const current = String(hot.getDataAtCell(activeCell.row, activeCell.col) ?? '');
          isInternalChange.current = true;
          hot.setDataAtCell(activeCell.row, activeCell.col, current + '\n');
          requestAnimationFrame(() => { isInternalChange.current = false; });
        }
      }
      // F2: enter edit mode at end of cell content
      else if (e.key === 'F2') {
        e.preventDefault();
        const hot = hotRef.current;
        if (hot && activeCell) {
          hot.selectCell(activeCell.row, activeCell.col);
          setTimeout(() => {
            const editor = hot.getActiveEditor();
            if (editor) {
              editor.beginEditing();
              // Move cursor to end
              const input = (editor as any).TEXTAREA || (editor as any).textarea;
              if (input) {
                input.selectionStart = input.value.length;
                input.selectionEnd = input.value.length;
              }
            }
          }, 50);
        }
      }
      else if (e.key === 'F4') {
        e.preventDefault();
        const val = formulaBarValue;
        if (val && val.includes('=')) {
          // ... F4 logic ...
        }
      }
      // Inline autocomplete keyboard navigation
      if (cellAutocomplete.visible) {
        if (e.key === 'ArrowDown') { e.preventDefault(); setCellAutocomplete(prev => ({ ...prev, index: Math.min(prev.index + 1, prev.items.length - 1) })); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); setCellAutocomplete(prev => ({ ...prev, index: Math.max(prev.index - 1, 0) })); return; }
        if (e.key === 'Tab' || e.key === 'Enter') {
          e.preventDefault();
          const selected = cellAutocomplete.items[cellAutocomplete.index];
          if (selected && activeCell) {
            const hot = hotRef.current;
            if (hot) {
              const formula = `=${selected.name}(`;
              const activeEditor = hot.getActiveEditor() as any;
              if (activeEditor && activeEditor.isOpened()) {
                // Write directly into the active editor — keep it open for range selection
                activeEditor.setValue(formula);
                e.stopPropagation();
              } else {
                isInternalChange.current = true;
                hot.setDataAtCell(activeCell.row, activeCell.col, formula);
                requestAnimationFrame(() => { isInternalChange.current = false; });
              }
            }
          }
          setCellAutocomplete(prev => ({ ...prev, visible: false }));
          return;
        }
        if (e.key === 'Escape') { e.preventDefault(); setCellAutocomplete(prev => ({ ...prev, visible: false })); return; }
      }
      // F4: toggle absolute references — cursor-position-aware
      else if (e.key === 'F4') {
        e.preventDefault();
        const hot = hotRef.current;
        if (hot && activeCell) {
          const activeEditor = hot.getActiveEditor() as any;
          if (activeEditor && activeEditor.isOpened()) {
            const textarea = activeEditor.TEXTAREA;
            let val: string = textarea.value;
            let cursorPos: number = textarea.selectionStart;
            // Find the reference closest to cursor position
            const regex = /(\$?[A-Z]+\$?\d+)/g;
            let match;
            let targetRef: string | null = null;
            let refStart = -1;
            let refEnd = -1;
            while ((match = regex.exec(val)) !== null) {
              if (cursorPos >= match.index && cursorPos <= match.index + match[0].length) {
                targetRef = match[0];
                refStart = match.index;
                refEnd = match.index + match[0].length;
                break;
              }
            }
            if (targetRef) {
              const modes = [
                targetRef.replace(/\$/g, ''),
                '$' + targetRef.replace(/\$/g, '').replace(/([A-Z]+)(\d+)/, '$$$1$$$2'),
                targetRef.replace(/\$/g, '').replace(/([A-Z]+)/, '$$$1'),
                targetRef.replace(/\$/g, '').replace(/(\d+)/, '$$$1'),
              ];
              const currentMode = modes.indexOf(targetRef);
              const nextMode = modes[(currentMode + 1) % modes.length] || modes[0];
              const newVal = val.slice(0, refStart) + nextMode + val.slice(refEnd);
              activeEditor.setValue(newVal);
              textarea.focus();
              textarea.selectionStart = refStart;
              textarea.selectionEnd = refStart + nextMode.length;
            }
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]); // Stable — activeFormat via ref

  // Name Box navigation
  const handleNavigateToRef = useCallback((ref: string) => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const range = refToRange(ref.toUpperCase());
    if (range) {
      hot.selectCell(range.startRow, range.startCol, range.endRow, range.endCol);
      hot.scrollViewportTo(range.startRow, range.startCol, false, true);
    }
  }, []);
  const handleFormulaConfirm = useCallback(() => {
    const hot = hotRef.current;
    const val = formulaValueRef.current;
    if (!hot || hot.isDestroyed || !activeCell) return;
    isInternalChange.current = true;
    hot.setDataAtCell(activeCell.row, activeCell.col, val);
    requestAnimationFrame(() => { isInternalChange.current = false; });
  }, [activeCell]);

  // Chart insertion handler
  const handleInsertChart = useCallback((type: 'bar' | 'line') => {
    const hot = hotRef.current;
    if (!hot || !selectedRange) return;
    const sr = selectedRange;
    const rawData = hot.getData(sr.startRow, sr.startCol, sr.endRow, sr.endCol);
    if (rawData.length < 2) return;
    const headers = rawData[0].map((h: any) => String(h));
    const parsedData = rawData.slice(1).map((row: any) => {
      const obj: Record<string, string | number> = {};
      headers.forEach((h: string, i: number) => {
        const val = row[i];
        obj[h] = typeof val === 'string' && !isNaN(parseFloat(val)) ? parseFloat(val) : (val ?? '');
      });
      return obj;
    });
    setChartData(parsedData);
    setChartType(type);
    setShowChartDialog(true);
  }, [selectedRange]);

  // Data validation handler
  const handleAddValidation = useCallback((rule: { col: number; type: string; min?: number; max?: number; list?: string; errorMessage: string }) => {
    setValidationRules(prev => [...prev.filter(r => r.col !== rule.col), rule]);
  }, []);

  // Pivot table handler
  const handleOpenPivot = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || !selectedRange) return;
    const sr = selectedRange;
    const rawData = hot.getData(sr.startRow, sr.startCol, sr.endRow, sr.endCol);
    if (rawData.length < 2) return;
    const headers = rawData[0].map((h: any) => String(h));
    const parsed = rawData.slice(1).map((row: any) => {
      const obj: Record<string, string | number> = {};
      headers.forEach((h: string, i: number) => {
        const val = row[i];
        obj[h] = typeof val === 'string' && !isNaN(parseFloat(val)) ? parseFloat(val) : (val ?? '');
      });
      return obj;
    });
    setPivotData(parsed);
    setShowPivotDialog(true);
  }, [selectedRange]);

  // AutoSum handler — extracted from keyboard shortcut for ribbon button use
  const handleAutoSum = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed || !activeCell || activeCell.row <= 0) return;
    // Force HyperFormula to evaluate pending cells
    (hfRef.current as any)?.evaluate?.();
    const col = activeCell.col;
    const row = activeCell.row;
    const colLetter = colToLetter(col);
    let upStart: number | null = null;
    for (let r = row - 1; r >= 0; r--) {
      const val = hot.getDataAtCell(r, col);
      if (typeof val !== 'number' && isNaN(parseFloat(val))) break;
      upStart = r;
    }
    if (upStart !== null) {
      hot.setDataAtCell(row, col, `=SUMME(${colLetter}${upStart + 1}:${colLetter}${row})`);
    } else {
      let leftStart: number | null = null;
      for (let c = col - 1; c >= 0; c--) {
        const val = hot.getDataAtCell(row, c);
        if (typeof val !== 'number' && isNaN(parseFloat(val))) break;
        leftStart = c;
      }
      if (leftStart !== null) {
        const leftLetter = colToLetter(leftStart);
        hot.setDataAtCell(row, col, `=SUMME(${leftLetter}${row + 1}:${colLetter}${row + 1})`);
      }
    }
  }, [activeCell]);

  return (
    <div className="spreadsheet-fortune-wrapper">
      {!readOnly && (
        <ExcelRibbon
          activeFormat={activeFormat}
          canUndo={canUndo}
          canRedo={canRedo}
          zoom={zoom}
          onFormatChange={applyFormat}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onInsertRow={handleInsertRow}
          onDeleteRow={handleDeleteRow}
          onCopy={handleCopy}
          onCut={handleCut}
          onPaste={handlePaste}
          onMerge={handleMerge}
          isMergeActive={isMerged}
          onFreeze={handleFreeze}
          onConditionalFormat={handleConditionalFormat}
          onAutoSum={handleAutoSum}
          onInsertChart={handleInsertChart}
          onDataValidation={() => setShowValidationDialog(true)}
          onPivotTable={handleOpenPivot}
          onSort={handleSort}
          onFilter={handleFilter}
          onFormatPainter={handleFormatPainter}
          isFormatPainterActive={!!formatPainterSrc}
          selectedRange={selectedRange}
        />
      )}
      {!readOnly && (
        <FormulaBar
          activeCell={activeCell}
          cellValue={formulaBarValue}
          onChange={(v) => { setFormulaBarValue(v); isFormulaEditingRef.current = true; }}
          onConfirm={() => { handleFormulaConfirm(); isFormulaEditingRef.current = false; }}
          onCancel={() => { isFormulaEditingRef.current = false; }}
          onNavigateToRef={handleNavigateToRef}
        />
      )}
      <div
        className={`spreadsheet-fortune-grid ${formatPainterSrc ? 'is-format-painter-active' : ''}`}
        style={{ zoom: zoom / 100, height: externalGridHeight || 360 }}
        ref={containerRef}
      />
      <StatusBar
        info={statusInfo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onZoomChange={setZoom}
        sheets={sheets}
        activeSheetId={activeSheetId}
        onSwitchSheet={handleSwitchSheet}
        onAddSheet={handleAddSheet}
      />
      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        cellRange={contextMenu.cellRange}
        isHeader={(contextMenu as any).isHeader}
        onAction={handleContextMenuAction}
        onClose={() => setContextMenu((prev: ContextMenuState) => ({ ...prev, visible: false }))}
      />
      {/* In-cell autocomplete dropdown */}
      {cellAutocomplete.visible && (
        <div style={{
          position: 'fixed', zIndex: 600, left: cellAutocomplete.x, top: cellAutocomplete.y,
          background: '#fff', border: '1px solid #c0c0c0', borderRadius: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', minWidth: 200, maxHeight: 200, overflow: 'auto',
          fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: '0.78rem',
        }}>
          {cellAutocomplete.items.map((fn, i) => (
            <div
              key={fn.name}
              onMouseDown={e => {
                e.preventDefault();
                const hot = hotRef.current;
                if (hot && activeCell) {
                  isInternalChange.current = true;
                  hot.setDataAtCell(activeCell.row, activeCell.col, `=${fn.name}(`);
                  requestAnimationFrame(() => { isInternalChange.current = false; });
                }
                setCellAutocomplete(prev => ({ ...prev, visible: false }));
              }}
              style={{
                padding: '4px 10px', cursor: 'pointer',
                background: i === cellAutocomplete.index ? '#e8edf2' : 'transparent',
                display: 'flex', justifyContent: 'space-between',
              }}
            >
              <strong>{fn.name}</strong>
              <span style={{ color: '#888', fontSize: '0.7rem', marginLeft: 12 }}>{fn.syntax}</span>
            </div>
          ))}
        </div>
      )}
      {/* Conditional Formatting Dialog */}
      {showCFDialog && (
        <div className="excel-dialog-overlay" onClick={() => setShowCFDialog(false)}>
          <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 320 }}>
            <div className="excel-dialog-header">
              <span>Bedingte Formatierung</span>
              <button onClick={() => setShowCFDialog(false)}>✗</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <label style={{ fontSize: '0.8rem' }}>Bedingung:
                <select value={cfOperator} onChange={e => setCfOperator(e.target.value)} style={{ marginLeft: 8, padding: '3px 6px' }}>
                  <option value=">">Größer als (&gt;)</option>
                  <option value="<">Kleiner als (&lt;)</option>
                  <option value=">=">Größer oder gleich</option>
                  <option value="<=">Kleiner oder gleich</option>
                  <option value="=">Gleich</option>
                </select>
              </label>
              <label style={{ fontSize: '0.8rem' }}>Wert:
                <input type="number" value={cfValue} onChange={e => setCfValue(e.target.value)} style={{ marginLeft: 8, width: 60, padding: '3px 6px' }} />
              </label>
              <label style={{ fontSize: '0.8rem' }}>Farbe:
                <input type="color" value={cfColor} onChange={e => setCfColor(e.target.value)} style={{ marginLeft: 8, width: 40 }} />
              </label>
              <button onClick={applyCFRule} style={{ marginTop: 8, padding: '6px', background: '#217346', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                Anwenden
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Chart Dialog */}
      <ChartDialog
        visible={showChartDialog}
        chartType={chartType}
        data={chartData}
        onClose={() => setShowChartDialog(false)}
      />
      {/* Data Validation Dialog */}
      <DataValidationDialog
        visible={showValidationDialog}
        headers={headers}
        onApply={handleAddValidation}
        onClose={() => setShowValidationDialog(false)}
      />
      {/* Pivot Table Dialog */}
      <PivotTableDialog
        visible={showPivotDialog}
        rawData={pivotData}
        onClose={() => setShowPivotDialog(false)}
      />
    </div>
  );
}
