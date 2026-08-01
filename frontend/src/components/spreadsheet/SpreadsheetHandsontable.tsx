// ── SpreadsheetHandsontable: Handsontable + Excel Ribbon ───────────────────
// Uses native HyperFormula plugin with German language support

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import 'handsontable/styles/ht-theme-horizon.css';
import 'handsontable/styles/ht-icons-main.css';
import 'handsontable/styles/ht-icons-horizon.css';
import { HyperFormula } from 'hyperformula';
import deDE from 'hyperformula/i18n/languages/deDE';
import { useTheme } from '../../context/ThemeContext';
import ExcelJS from 'exceljs';

// Register German language pack (guard against HMR double-registration)
try {
  HyperFormula.registerLanguage('deDE', deDE);
} catch {
  // Already registered via HMR
}

// Register plugins — v18 auto-registers; these imports are for type references only
import { ColumnSorting, Filters, Search, AutoColumnSize } from 'handsontable/plugins';
import { textRenderer } from 'handsontable/renderers';

import ExcelRibbon from './ExcelRibbon';
import FormulaBar from './FormulaBar';
import StatusBar from './StatusBar';
import ContextMenu from './ContextMenu';
import ChartDialog from './ChartDialog';
import DataValidationDialog from './DataValidationDialog';
import PivotTableDialog from './PivotTableDialog';
import type { CellPosition, CellRange, CellFormat, CellFormats, StatusBarInfo, ContextMenuAction, ContextMenuState } from './types';
import { positionToRef, colToLetter, refToRange, rangeToRef } from './types';

// HyperFormula instance — created per component mount via useRef
function createHF(): HyperFormula {
  const hf = HyperFormula.buildEmpty({
    licenseKey: 'gpl-v3',
    language: 'deDE',
    // German locale: semicolon argument separator, comma decimal separator
    functionArgSeparator: ';',
    decimalSeparator: ',',
    // useColumnIndex: true breaks VLOOKUP — column index must be relative to range (Excel behavior)
    maxPendingLazyTransformations: 100,
  });
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
  const taskColsRef = useRef(taskCols);
  const isInternalChange = useRef(false);
  const dataIdRef = useRef<number>(0);
  // Excel-like range selection refs: track formula editing to insert range references
  const isAppendingRangeRef = useRef(false);
  const isRestoringEditorRef = useRef(false);
  const originalEditCellRef = useRef<{ row: number; col: number } | null>(null);
  const formulaBeforeSelectionRef = useRef<string>('');
  const cursorStartRef = useRef<number>(0);
  const cursorEndRef = useRef<number>(0);
  // Bug fix: suppress afterChange during range-selection to prevent #ERROR!
  // When user clicks a cell while editing a formula, Handsontable closes the
  // editor and commits the incomplete formula (e.g. "=SUMME(") → #ERROR!.
  // This flag blocks that commit; the real formula is rebuilt in afterSelectionEnd.
  const isRangeSelecting = useRef(false);
  const { dark } = useTheme();
  dataRef.current = data;
  headersRef.current = headers;
  taskColsRef.current = taskCols;

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
  // Bug #10 fix: Set for O(1) error cell lookup instead of Array.find
  const errorCellsSetRef = useRef<Set<string>>(new Set());
  useEffect(() => { cellFormatsRef.current = cellFormats; }, [cellFormats]);
  useEffect(() => { condRulesRef.current = condRules; }, [condRules]);
  // Merge prop errors with internal practice mode errors
  const mergedErrors = useMemo(() => [...(errorCells || []), ...internalErrors], [errorCells, internalErrors]);
  useEffect(() => { errorCellsRef.current = mergedErrors; }, [mergedErrors]);
  useEffect(() => { errorCellsSetRef.current = new Set(mergedErrors.map(e => `${e.row}:${e.col}`)); }, [mergedErrors]);

  // Shared helper: insert function name at cursor without destroying surrounding formula
  const insertFunctionIntoEditor = useCallback((fnName: string) => {
    const hot = hotRef.current;
    if (!hot || !activeCellRef.current) return;
    const ac = activeCellRef.current;
    const activeEditor = hot.getActiveEditor() as any;

    if (activeEditor && activeEditor.isOpened()) {
      const textarea = activeEditor.TEXTAREA;
      const cursorPos = textarea.selectionStart ?? 0;
      const currentVal = textarea.value ?? '';
      // Try to replace a partial word before cursor; otherwise insert at cursor
      const regex = /([A-Za-z_ÄÖÜäöüß]+)$/;
      const match = currentVal.substring(0, cursorPos).match(regex);
      let newVal: string, newPos: number;
      if (match) {
        const wordStart = cursorPos - match[1].length;
        newVal = currentVal.substring(0, wordStart) + fnName + '(' + currentVal.substring(cursorPos);
        newPos = wordStart + fnName.length + 1;
      } else {
        newVal = currentVal.substring(0, cursorPos) + fnName + '(' + currentVal.substring(cursorPos);
        newPos = cursorPos + fnName.length + 1;
      }
      activeEditor.setValue(newVal);
      textarea.focus();
      textarea.selectionStart = newPos;
      textarea.selectionEnd = newPos;
      setFormulaBarValue(newVal);
      formulaValueRef.current = newVal;
    } else {
      // Editor not open — start editing with the function
      const currentVal = hot.getDataAtCell(ac.row, ac.col);
      if (typeof currentVal === 'string' && currentVal.startsWith('=')) {
        // Append to existing formula
        const formula = currentVal + fnName + '(';
        isInternalChange.current = true;
        hot.setDataAtCell(ac.row, ac.col, formula);
        requestAnimationFrame(() => {
          isInternalChange.current = false;
          hot.selectCell(ac.row, ac.col);
          const editor = hot.getActiveEditor() as any;
          if (editor) {
            editor.beginEditing(formula);
            const ta = editor.TEXTAREA;
            const pos = formula.length;
            ta.focus();
            ta.selectionStart = pos;
            ta.selectionEnd = pos;
          }
        });
      } else {
        // Start new formula
        isInternalChange.current = true;
        const formula = `=${fnName}(`;
        hot.setDataAtCell(ac.row, ac.col, formula);
        requestAnimationFrame(() => {
          isInternalChange.current = false;
          hot.selectCell(ac.row, ac.col);
          const editor = hot.getActiveEditor() as any;
          if (editor) {
            editor.beginEditing(formula);
            const ta = editor.TEXTAREA;
            const pos = formula.length;
            ta.focus();
            ta.selectionStart = pos;
            ta.selectionEnd = pos;
          }
        });
      }
    }
  }, []);

  // Refs to avoid keyboard listener re-renders
  // In-cell autocomplete
  const [cellAutocomplete, setCellAutocomplete] = useState<{ visible: boolean; x: number; y: number; items: { name: string; syntax: string }[]; index: number }>({ visible: false, x: 0, y: 0, items: [], index: 0 });
  // Step 1: Excel function ScreenTip (with HTML for argument highlighting)
  const [funcTooltip, setFuncTooltip] = useState<{ html: string; x: number; y: number } | null>(null);
  // Format Painter state
  const [formatPainterSrc, setFormatPainterSrc] = useState<CellFormat | null>(null);
  const formatPainterSrcRef = useRef<CellFormat | null>(null);
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
  // Format Cells dialog (Ctrl+1)
  const [showFormatCellsDialog, setShowFormatCellsDialog] = useState(false);
  // Pivot table
  const [showPivotDialog, setShowPivotDialog] = useState(false);
  const [pivotData, setPivotData] = useState<Record<string, string | number>[]>([]);
  // Format application — with undo support via format history stack
  const formatHistoryRef = useRef<CellFormats[]>([]);
  const formatHistoryPosRef = useRef(-1);
  // Bug #2 fix: RAF ref for throttled formula bar updates
  const formulaRafRef = useRef<number | null>(null);
  // Bug #11 fix: timer ref for debounced practice mode cell checks
  const practiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyFormatsWithUndo = useCallback((newFormats: CellFormats) => {
    const hot = hotRef.current;
    // Push current state onto format undo stack (truncate any redo entries)
    const oldFormats = { ...cellFormatsRef.current };
    const pos = formatHistoryPosRef.current;
    formatHistoryRef.current = [...formatHistoryRef.current.slice(0, pos + 1), oldFormats];
    formatHistoryPosRef.current = pos + 1;
    setCellFormats(newFormats);
    cellFormatsRef.current = newFormats;
    onCellFormatsChange?.(newFormats);
    setCanUndo(true);
    setCanRedo(false);
    if (hot && !hot.isDestroyed) hot.render();
  }, [onCellFormatsChange]);

  // Undo/Redo — native Handsontable plugin + format history stack
  const handleUndo = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const undoRedo = hot.getPlugin('undoRedo') as any;
    const hadDataUndo = undoRedo?.isUndoAvailable?.() ?? false;
    if (hadDataUndo) {
      undoRedo.undo();
      // Update button states from HT — format may still be available
      setCanUndo(true);
      setCanRedo(undoRedo?.isRedoAvailable?.() ?? false);
    } else {
      // Only undo format if no data was available to undo (one action at a time)
      const pos = formatHistoryPosRef.current;
      if (pos >= 0) {
        const prevFormats = formatHistoryRef.current[pos];
        formatHistoryPosRef.current = pos - 1;
        setCellFormats(prevFormats);
        cellFormatsRef.current = prevFormats;
        onCellFormatsChange?.(prevFormats);
        setCanUndo(formatHistoryPosRef.current >= 0);
        setCanRedo(true);
      }
    }
    hot.render();
  }, [onCellFormatsChange]);

  const handleRedo = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const undoRedo = hot.getPlugin('undoRedo') as any;
    const hadDataRedo = undoRedo?.isRedoAvailable?.() ?? false;
    if (hadDataRedo) {
      undoRedo.redo();
      setCanRedo(undoRedo?.isRedoAvailable?.() ?? false);
      setCanUndo(true);
    } else {
      // Only redo format if no data was available to redo (one action at a time)
      const pos = formatHistoryPosRef.current;
      const nextPos = pos + 1;
      if (nextPos < formatHistoryRef.current.length) {
        const nextFormats = formatHistoryRef.current[nextPos];
        formatHistoryPosRef.current = nextPos;
        setCellFormats(nextFormats);
        cellFormatsRef.current = nextFormats;
        onCellFormatsChange?.(nextFormats);
        setCanRedo(nextPos + 1 < formatHistoryRef.current.length);
        setCanUndo(true);
      }
    }
    hot.render();
  }, [onCellFormatsChange]);

  // XLSX Export (Handsontable v18 — uses downloadFileAsync with ExcelJS engine)
  const handleExportXlsx = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    try {
      const plugin = hot.getPlugin('exportFile') as any;
      if (plugin?.downloadFileAsync) {
        plugin.downloadFileAsync('xlsx', { filename: 'excel-lenz-uebung' }).catch(() => {
          // Fallback: CSV export if XLSX engine fails
          plugin.downloadFile('csv', { filename: 'excel-lenz-uebung', columnHeaders: true });
        });
      } else if (plugin?.downloadFile) {
        plugin.downloadFile('csv', { filename: 'excel-lenz-uebung', columnHeaders: true });
      }
    } catch {
      // Plugin not available
    }
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

  // Border application via native customBorders plugin (Excel-like: no DOM conflicts)
  const applyBorder = useCallback((side: 'top' | 'bottom' | 'left' | 'right', color?: string) => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed || !selectedRange) return;
    const borderConfig = { width: 1, color: color || '#000000' };
    const ranges = [{
      start: { row: selectedRange.startRow, col: selectedRange.startCol },
      end: { row: selectedRange.endRow, col: selectedRange.endCol },
    }];
    const customBordersPlugin = hot.getPlugin('customBorders') as any;
    if (customBordersPlugin?.setBorders) {
      customBordersPlugin.setBorders(ranges, { [side]: borderConfig });
      // Also update React format state so borders survive sheet switches
      const newFormats = { ...cellFormats };
      const borderKey = `border${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof CellFormat;
      for (let r = selectedRange.startRow; r <= selectedRange.endRow; r++) {
        for (let c = selectedRange.startCol; c <= selectedRange.endCol; c++) {
          const key = `R${r}C${c}`;
          newFormats[key] = { ...newFormats[key], [borderKey]: `1px solid ${color || '#000000'}` };
        }
      }
      // Update state without pushing to format undo (customBorders has its own undo)
      setCellFormats(newFormats);
      cellFormatsRef.current = newFormats;
      onCellFormatsChange?.(newFormats);
    }
    hot.render();
  }, [selectedRange, cellFormats, onCellFormatsChange]);

  // Zoom — use native rowHeights + font-size instead of CSS zoom (which breaks mouse coords)
  const handleZoomIn = useCallback(() => setZoom(z => Math.min(z + 10, 200)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(z - 10, 50)), []);
  const handleZoomReset = useCallback(() => setZoom(100), []);

  // Apply zoom via HT rowHeights + CSS font-size var (avoids CSS zoom coordinate bugs)
  useEffect(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const baseRowHeight = 23;
    const baseFontSize = 13;
    const newRowHeight = Math.round(baseRowHeight * (zoom / 100));
    const newFontSize = Math.round(baseFontSize * (zoom / 100));
    hot.updateSettings({ rowHeights: newRowHeight });
    document.documentElement.style.setProperty('--ht-font-size', `${newFontSize}px`);
    // Recalculate column widths to match new font size
    const autoColPlugin = hot.getPlugin('autoColumnSize') as any;
    if (autoColPlugin?.isEnabled?.()) {
      autoColPlugin.recalculateAllWidths();
    }
    hot.render();
  }, [zoom]);

  // Insert/Delete row handlers
  const handleInsertRow = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const row = selectedRangeRef.current?.startRow ?? activeCellRef.current?.row ?? 0;
    hot.alter('insert_row', row);
    // Bug #9 fix: afterCreateRow hook already syncs data — no duplicate onChange needed
  }, []);

  const handleDeleteRow = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const row = selectedRangeRef.current?.startRow ?? activeCellRef.current?.row ?? 1;
    hot.alter('remove_row', row);
    // Bug #9 fix: afterRemoveRow hook already syncs data — no duplicate onChange needed
  }, []);

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

  // Merge handler — uses native isMerged API (more reliable than cellMeta.merged)
  const handleMerge = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed || !selectedRange) return;
    const { startRow, startCol, endRow, endCol } = selectedRange;
    if (startRow === endRow && startCol === endCol) return;
    const mc = hot.getPlugin('mergeCells') as any;
    if (mc) {
      if (mc.isMerged?.(startRow, startCol)) {
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
    const newRules = [...condRules, { col, operator: cfOperator, value, color: cfColor }];
    setCondRules(newRules);
    condRulesRef.current = newRules; // Immediate sync for renderer
    setShowCFDialog(false);
    hotRef.current?.render();
  }, [selectedRange, cfOperator, cfValue, cfColor, condRules]);

  // Sort/Filter ribbon handlers — use native columnSorting plugin (HF-compatible)
  const handleSort = useCallback((dir: 'asc' | 'desc') => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed || !selectedRange) return;
    const plugin = hot.getPlugin('columnSorting') as any;
    if (plugin) {
      plugin.sort({ column: selectedRange.startCol, sortOrder: dir });
    }
  }, [selectedRange]);

  const handleFilter = useCallback(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const filtersPlugin = hot.getPlugin('filters') as any;
    if (filtersPlugin) {
      if (filtersPlugin.isEnabled?.()) {
        filtersPlugin.clearConditions();
        filtersPlugin.filter();
        hot.updateSettings({ dropdownMenu: false } as any);
      } else {
        hot.updateSettings({ dropdownMenu: true } as any);
      }
    }
  }, []);

  // Format Painter handler — first click activates, next cell selection applies
  const handleFormatPainter = useCallback(() => {
    if (formatPainterSrc) {
      setFormatPainterSrc(null);
      formatPainterSrcRef.current = null;
    } else {
      if (activeCell) {
        const fmt = cellFormatsRef.current[`R${activeCell.row}C${activeCell.col}`] || {};
        setFormatPainterSrc(fmt);
        formatPainterSrcRef.current = fmt;
      }
    }
  }, [formatPainterSrc, activeCell]);

  // Apply Format Painter via afterSelection (Excel behavior: apply on next click)
  // The useEffect has been removed — painter now applies in the HT afterSelection hook

  // Multi-sheet handlers
  const handleAddSheet = useCallback(() => {
    const newId = sheets.length > 0 ? Math.max(...sheets.map(s => s.id)) + 1 : 0;
    const newName = `Tabelle${newId + 1}`;
    // Save current data — use getSourceData for consistency with handleSwitchSheet (BUG 6)
    const hot = hotRef.current;
    if (hot && !hot.isDestroyed) {
      allDataRef.current[activeSheetId] = (hot.getSourceData() as (string | number | null)[][]);
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
    const hf = hfRef.current;
    if (!hot || hot.isDestroyed || !hf || sheetId === activeSheetId) return;
    // Save current data and formats
    allDataRef.current[activeSheetId] = (hot.getSourceData() as (string | number | null)[][]);
    allFormatsRef.current[activeSheetId] = { ...cellFormatsRef.current };
    // Load new sheet data
    const newData = allDataRef.current[sheetId] || [];
    const targetData = [headersRef.current.map(h => h), ...newData.map(row => row.map(cell => (cell === null ? '' : cell)))];
    hot.loadData(targetData);
    // Load sheet formats
    const newFormats = allFormatsRef.current[sheetId] || {};
    setCellFormats(newFormats);
    cellFormatsRef.current = newFormats;
    // Switch HyperFormula active sheet natively
    const sheetName = sheets.find(s => s.id === sheetId)?.name || `Tabelle${sheetId + 1}`;
    const hfSheetId = hf.getSheetId(sheetName);
    if (hfSheetId !== undefined) {
      try { hf.setSheetContent(hfSheetId, targetData as any); } catch { /* ignore */ }
    }
    // HT formulas plugin handles sheet switching via sheetName setting
    hot.updateSettings({ formulas: { engine: hf as any, sheetName } });
    hf.rebuildAndRecalculate();
    setActiveSheetId(sheetId);
    // Clear format undo history for new sheet context
    formatHistoryRef.current = [];
    formatHistoryPosRef.current = -1;
    hot.render();
  }, [activeSheetId, sheets]);

  // Freeze handler
  const handleFreeze = useCallback((type: 'row' | 'column' | 'both' | 'none') => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    switch (type) {
      case 'row': hot.updateSettings({ fixedRowsTop: 1, fixedColumnsLeft: 0 }); break;
      case 'column': hot.updateSettings({ fixedRowsTop: 0, fixedColumnsLeft: 1 }); break;
      case 'both': hot.updateSettings({ fixedRowsTop: (activeCell?.row ?? 0), fixedColumnsLeft: (activeCell?.col ?? 0) }); break;
      default: hot.updateSettings({ fixedRowsTop: 0, fixedColumnsLeft: 0 }); break;
    }
  }, [activeCell]);

  // Practice mode: check a single cell against solution
  const checkCellPractice = useCallback((row: number, col: number) => {
    if (!solution || mode !== 'practice') return;
    const hot = hotRef.current;
    if (!hot) return;
    // HT's formula plugin already recalculates dependents — no need for full rebuild
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
      case 'insertCells': if (sr) { hot.alter('insert_row', sr.startRow); } break;
      case 'insertRow': hot.alter('insert_row', sr?.startRow ?? 0); break;
      case 'insertColumn': 
        if (sr) { const amount = sr.endCol - sr.startCol + 1; hot.alter('insert_col', sr.startCol, amount); }
        break;
      case 'deleteCells': if (sr) { const amount = sr.endRow - sr.startRow + 1; hot.alter('remove_row', sr.startRow, amount); } break;
      case 'deleteRow': if (sr) { const amount = sr.endRow - sr.startRow + 1; hot.alter('remove_row', sr.startRow, amount); } break;
      case 'deleteColumn': if (sr) { const amount = sr.endCol - sr.startCol + 1; hot.alter('remove_col', sr.startCol, amount); } break;

      // Clear
      case 'clearContents': if (sr) { hot.emptySelectedCells(); } break;
      case 'clearFormats': if (sr) { const n = { ...cellFormatsRef.current }; for (let r = sr.startRow; r <= sr.endRow; r++) for (let c = sr.startCol; c <= sr.endCol; c++) { delete n[`R${r}C${c}`]; hot.removeCellMeta(r, c, 'borders'); } applyFormatsWithUndo(n); setCondRules(prev => prev.filter(rule => rule.col < sr.startCol || rule.col > sr.endCol)); const cbp = hot.getPlugin('customBorders') as any; if (cbp?.clearBorders) { cbp.clearBorders([{ start: { row: sr.startRow, col: sr.startCol }, end: { row: sr.endRow, col: sr.endCol } }]); } hot.render(); } break;
      case 'clearAll': if (sr) { hot.emptySelectedCells(); setCellFormats((prev: CellFormats) => { const n = { ...prev }; for (let r = sr.startRow; r <= sr.endRow; r++) for (let c = sr.startCol; c <= sr.endCol; c++) delete n[`R${r}C${c}`]; return n; }); hot.render(); } break;

      // Format
      case 'formatCells': break;
      case 'mergeCells': if (sr && (sr.startRow !== sr.endRow || sr.startCol !== sr.endCol)) { const mc2 = hot.getPlugin('mergeCells') as any; if (mc2) { mc2.isMerged?.(sr.startRow, sr.startCol) ? mc2.unmerge(sr.startRow, sr.startCol, sr.endRow, sr.endCol) : mc2.merge(sr.startRow, sr.startCol, sr.endRow, sr.endCol); hot.render(); } } break;
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

      // Sort & Filter — use data sort (HF-safe workaround)
      case 'sortAsc': if (sr) { handleSort('asc'); } break;
      case 'sortDesc': if (sr) { handleSort('desc'); } break;
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

  // Refs to avoid keyboard listener re-renders (Bug #6 fix: use refs not stale closures)
  const activeFormatRef = useRef(activeFormat);
  useEffect(() => { activeFormatRef.current = activeFormat; }, [activeFormat]);
  const applyFormatRef = useRef(applyFormat);
  useEffect(() => { applyFormatRef.current = applyFormat; }, [applyFormat]);
  const selectedRangeRef = useRef(selectedRange);
  useEffect(() => { selectedRangeRef.current = selectedRange; }, [selectedRange]);
  const activeCellRef = useRef(activeCell);
  useEffect(() => { activeCellRef.current = activeCell; }, [activeCell]);
  const cellAutocompleteRef = useRef(cellAutocomplete);
  useEffect(() => { cellAutocompleteRef.current = cellAutocomplete; }, [cellAutocomplete]);
  const insertFnRef = useRef(insertFunctionIntoEditor);
  useEffect(() => { insertFnRef.current = insertFunctionIntoEditor; }, [insertFunctionIntoEditor]);

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
      hiddenColumns: true,
      autoColumnSize: true,
      mergeCells: true,
      customBorders: true,
      fillHandle: !readOnly,
      rowHeights: 23,
      autoRowSize: false,
      // columnSorting re-enabled: HT v18 native sort works with HyperFormula
      columnSorting: true,
      filters: true,
      dropdownMenu: true,
      search: true,
      autoWrapRow: false,
      autoWrapCol: false,
      stretchH: 'last',
      readOnly,
      selectionMode: 'multiple',
      enterBeginsEditing: false,
      enterMoves: { row: 1, col: 0 },
      tabMoves: { row: 0, col: 1 },
      allowInsertRow: !readOnly,
      allowInsertColumn: !readOnly,
      allowRemoveRow: !readOnly,
      allowRemoveColumn: !readOnly,
      textEllipsis: true,
      exportFile: {
        engines: { xlsx: ExcelJS },
      },

      beforePaste(data: unknown[][], _coords: unknown[]) {
        if (pasteModeRef.current === 'values') {
          // Bug #8 fix: resolve formulas via HyperFormula engine instead of
          // reading empty destination cells
          const hfPaste = hfRef.current;
          for (let r = 0; r < data.length; r++) {
            for (let c = 0; c < data[r].length; c++) {
              const cellData = data[r][c];
              if (typeof cellData === 'string' && cellData.startsWith('=')) {
                try {
                  if (hfPaste) {
                    const result = hfPaste.calculateFormula(cellData.substring(1), 0);
                    data[r][c] = result ?? '';
                  } else {
                    data[r][c] = cellData;
                  }
                } catch {
                  data[r][c] = cellData;
                }
              } else if (typeof cellData === 'number') {
                data[r][c] = cellData;
              } else {
                data[r][c] = String(cellData ?? '');
              }
            }
          }
          pasteModeRef.current = 'normal';
          return true;
        }
        if (pasteModeRef.current === 'formats') {
          const hot = hotRef.current;
          // Read selection directly from HT (more reliable than React state)
          const sel = hot?.getSelected();
          if (hot && clipboardFormatsRef.current && sel && sel.length > 0) {
            const [r1, c1, r2, c2] = sel[0];
            const startRow = Math.min(r1, r2);
            const endRow = Math.max(r1, r2);
            const startCol = Math.min(c1, c2);
            const endCol = Math.max(c1, c2);
            const newFormats = { ...cellFormatsRef.current };
            for (let r = startRow; r <= endRow; r++) {
              for (let c = startCol; c <= endCol; c++) {
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

      // Protect header row from deletion/insertion
      beforeCreateRow(row: number, _amount: number) { return row > 0; },
      beforeRemoveRow(row: number, _amount: number) { return row > 0; },

      cells(row: number, col: number) {
        const cellMeta: Record<string, unknown> = {};
        // Protect header row from editing (Excel-like: headers are read-only)
        if (row === 0) {
          cellMeta.readOnly = true;
        }
        // Bug #7 fix: use refs for taskCols and headers to avoid stale closure
        const isTask = taskColsRef.current.includes(col) && col < headersRef.current.length;
        // Read from REFS (not state) to avoid stale closure
        const fmt = cellFormatsRef.current[`R${row}C${col}`];
        const rules = condRulesRef.current;
        if (!fmt?.numberFormat) {
          cellMeta.type = 'text';
          cellMeta.numericFormat = undefined;
        } else if (fmt?.numberFormat === 'DD.MM.YYYY') {
          cellMeta.type = 'date';
          cellMeta.dateFormat = 'DD.MM.YYYY';
          cellMeta.correctFormat = true;
        } else if (fmt?.numberFormat === '0%') { cellMeta.type = 'numeric'; cellMeta.numericFormat = { pattern: '0%' }; }
        else if (fmt?.numberFormat === '#,##0.00 €') { cellMeta.type = 'numeric'; cellMeta.numericFormat = { pattern: '#,##0.00 €', culture: 'de-DE' }; }
        else if (fmt?.numberFormat === '#,##0.00') { cellMeta.type = 'numeric'; cellMeta.numericFormat = { pattern: '#,##0.00' }; }
        // Data validation — skip header row (row 0)
        if (row > 0) {
        const rule = validationRulesRef.current.find(r => r.col === col);
        if (rule) {
          if (rule.type === 'number') {
            cellMeta.validator = (value: any, callback: (valid: boolean) => void) => {
              if (value === '' || value === null || value === undefined) return callback(true);
              const num = parseFloat(value);
              const valid = !isNaN(num) && (rule.min === undefined || num >= rule.min) && (rule.max === undefined || num <= rule.max);
              callback(valid);
            };
            cellMeta.allowInvalid = true; // Allow input but show visual feedback
          } else if (rule.type === 'list' && rule.list) {
            cellMeta.type = 'autocomplete';
            cellMeta.source = rule.list.split(/[;,]/).map((s: string) => s.trim());
            cellMeta.allowEmpty = true;
            cellMeta.strict = false;
            cellMeta.allowInvalid = true;
          }
        }
        }
        // Renderer
        cellMeta.renderer = (instance: any, td: HTMLTableCellElement, _r: number, _c: number, _p: any, v: any, _cp: any) => {
          textRenderer(instance, td, _r, _c, _p, v, _cp);
          // Safe class cleanup: only remove our format classes, never destroy HT internals
          td.className = td.className.replace(/\bht(Bold|Italic|Underline|Align(Left|Center|Right|Top|Middle|Bottom)|Wrap)\b/g, '').trim();
          // Clean up stale error classes and indicators
          td.classList.remove('has-excel-error');
          const existingTriangle = td.querySelector('.excel-error-triangle');
          if (existingTriangle) existingTriangle.remove();
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
          if (classes.length) td.className += ' ' + classes.join(' ');
          // Reset ONLY our format styles — never touch HT internal height/box-sizing
          td.style.fontSize = fmt?.fontSize ? `${fmt.fontSize}px` : '';
          td.style.fontFamily = fmt?.fontFamily || '';
          td.style.color = fmt?.fontColor || '';
          td.style.background = fmt?.bgColor || '';
          td.style.borderTop = fmt?.borderTop || '';
          td.style.borderRight = fmt?.borderRight || '';
          td.style.borderBottom = fmt?.borderBottom || '';
          td.style.borderLeft = fmt?.borderLeft || '';
          // Conditional formatting rules — read from REF
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
          }
          // Error cells — Bug #10 fix: use Set for O(1) lookup instead of find
          const errorKey = `${_r}:${_c}`;
          if (errorCellsSetRef.current.has(errorKey)) {
            const currentErrors = errorCellsRef.current;
            const hasError = currentErrors?.find(ec => ec.row === _r && ec.col === _c);
            if (hasError) {
              td.style.background = '#fff0f0';
              td.style.borderLeft = '2px solid #c62828';
              td.title = `Fehler: Erwartet wird "${hasError.expected}"`;
              td.classList.add('has-excel-error');
              if (!td.querySelector('.excel-error-triangle')) {
                td.style.position = 'relative';
                const triangle = document.createElement('div');
                triangle.className = 'excel-error-triangle';
                td.appendChild(triangle);
              }
            }
          }
          // Formula error values — simple # prefix check (fast, no Set instantiation per cell)
          if (typeof v === 'string' && v.startsWith('#')) {
            td.style.color = '#c62828';
            td.style.fontWeight = '700';
            td.style.textAlign = 'center';
            const errorMessages: Record<string, string> = {
              '#DIV/0!': 'Fehler: Division durch Null.',
              '#NAME?': 'Fehler: Unbekannter Name.',
              '#WERT!': 'Fehler: Falscher Datentyp.',
              '#BEZUG!': 'Fehler: Ungültiger Bezug.',
              '#NV!': 'Fehler: Wert nicht verfügbar.',
              '#ZAHL!': 'Fehler: Ungültige Zahl.',
              '#NULL!': 'Fehler: Schnittmenge leer.',
              '#ZIRKELBEZUG!': 'Fehler: Zirkelbezug.',
              '#CYCLE!': 'Fehler: Zirkelbezug.',
            };
            td.title = errorMessages[v] || `Formelfehler: ${v}`;
          }
        };
        return cellMeta;
      },

      afterBeginEditing() {
        setStatusInfo(prev => ({ ...prev, mode: 'enter' as const }));
      },

      // Excel-like range selection: detect when user clicks another cell while editing a formula
      beforeOnCellMouseDown(e: MouseEvent, coords: { row: number | null; col: number | null }, _TD: HTMLTableCellElement, _controller: any) {
        const hot = hotRef.current;
        if (!hot || hot.isDestroyed) return;
        const activeEditor = hot.getActiveEditor() as any;
        if (activeEditor && activeEditor.isOpened()) {
          const val: string = activeEditor.getValue?.() || '';
          if (typeof val === 'string' && val.startsWith('=')) {
            const textarea = activeEditor.TEXTAREA;
            const selectionStart: number = textarea.selectionStart ?? 0;
            const selectionEnd: number = textarea.selectionEnd ?? selectionStart;
            const textBeforeCursor = val.substring(0, selectionStart);
            // Check if cursor is at a position where a range is expected
            const isRangeExpected = /[({,;+\-*/>=<&=\s]$/.test(textBeforeCursor)
              || textBeforeCursor === '='
              || (selectionStart !== selectionEnd);
            if (isRangeExpected) {
              isAppendingRangeRef.current = true;
              isRangeSelecting.current = true;
              originalEditCellRef.current = { row: activeEditor.row, col: activeEditor.col };
              formulaBeforeSelectionRef.current = val;
              cursorStartRef.current = selectionStart;
              cursorEndRef.current = selectionEnd;
              // Safety timeout in case mouseup doesn't trigger afterSelectionEnd
              setTimeout(() => {
                isAppendingRangeRef.current = false;
                isRangeSelecting.current = false;
              }, 2000);
            }
          }
        }
      },

      beforeChange(_changes: any, _source: string) {
        // Native undo handles state — no manual snapshot needed
      },

      afterSelection(_r: number, _c: number, _r2: number, _c2: number) {
        // Bug #1 fix: update refs only during drag (no state → no re-render)
        // State updates deferred to afterSelectionEnd
        activeCellRef.current = { row: _r, col: _c };
        selectedRangeRef.current = {
          startRow: Math.min(_r, _r2),
          startCol: Math.min(_c, _c2),
          endRow: Math.max(_r, _r2),
          endCol: Math.max(_c, _c2),
        };

        // Update formula bar (lightweight — no state change for drag-selections)
        const h = hotRef.current;
        if (h && !h.isDestroyed) {
          const activeEditor = h.getActiveEditor() as any;
          if (activeEditor && activeEditor.isOpened()) {
            const editorVal = activeEditor.getValue?.();
            setFormulaBarValue(editorVal ?? '');
          } else if (_r !== _r2 || _c !== _c2) {
            setFormulaBarValue('');
          } else {
            const sourceVal = h.getSourceDataAtCell(_r, _c);
            setFormulaBarValue(sourceVal === null || sourceVal === undefined ? '' : String(sourceVal));
          }
        }
        // Merge cells info
        const mc = hotRef.current?.getPlugin('mergeCells');
        if (mc) {
          const mergedParent = (mc as any).mergedCellsCollection?.get(_r, _c);
          setIsMerged(!!mergedParent);
        }
      },

      // Format Painter + Status Bar aggregation (moved here for performance)
      afterSelectionEnd(_r: number, _c: number, _r2: number, _c2: number) {
        // Step 2: clear function tooltip when selection ends
        setFuncTooltip(null);

        const hot = hotRef.current;
        if (!hot || hot.isDestroyed) return;

        // ── Excel-like range selection in formulas ──────────────────────────
        // Prevent re-trigger when we programmatically select the original cell
        if (isRestoringEditorRef.current) {
          isRestoringEditorRef.current = false;
          return;
        }

        if (isAppendingRangeRef.current) {
          const original = originalEditCellRef.current;
          const formula = formulaBeforeSelectionRef.current;
          const selStart = cursorStartRef.current;
          const selEnd = cursorEndRef.current;

          // If user clicked the same cell they were editing, let normal behavior handle it.
          // Don't clear isAppendingRangeRef yet — the next afterSelectionEnd (for the
          // actually-clicked cell) will need it.
          if (original && original.row === _r && original.col === _c && _r === _r2 && _c === _c2) {
            // Fall through to normal afterSelectionEnd (no flag clearing)
          } else {
            isAppendingRangeRef.current = false;
            // Calculate the range reference (e.g. "A1:B5" or "A1")
            const rangeStr = rangeToRef({
              startRow: Math.min(_r, _r2),
              startCol: Math.min(_c, _c2),
              endRow: Math.max(_r, _r2),
              endCol: Math.max(_c, _c2),
            });

            // Insert range into formula (replacing any selected text)
            const newFormula = formula.substring(0, selStart) + rangeStr + formula.substring(selEnd);

            // Update formula bar immediately
            setFormulaBarValue(newFormula);
            formulaValueRef.current = newFormula;
            
            // Re-select original cell and reopen editor (deferred to avoid recursion issues)
            const origRow = original ? original.row : _r;
            const origCol = original ? original.col : _c;
            setTimeout(() => {
              const h = hotRef.current;
              if (!h || h.isDestroyed) return;
              isRestoringEditorRef.current = true;
              h.selectCell(origRow, origCol, origRow, origCol);
              const editor = h.getActiveEditor() as any;
              if (editor) {
                editor.beginEditing(newFormula);
                const textarea = editor.TEXTAREA;
                const newCursorPos = selStart + rangeStr.length;
                textarea.focus();
                textarea.selectionStart = newCursorPos;
                textarea.selectionEnd = newCursorPos;
              }
              // Set formula bar AFTER selectCell/beginEditing to overwrite any source-data read
              setFormulaBarValue(newFormula);
              formulaValueRef.current = newFormula;
            }, 0);
            return; // Skip normal afterSelectionEnd (no state/aggregate updates)
          }
        }
        // ── End Excel-like range selection ──────────────────────────────────

        // Bug #1 fix: update React state only once at end of drag
        setActiveCell({ row: _r, col: _c });
        setSelectedRange({
          startRow: Math.min(_r, _r2),
          startCol: Math.min(_c, _c2),
          endRow: Math.max(_r, _r2),
          endCol: Math.max(_c, _c2),
        });
        // Format Painter — apply on mouse release
        const painterSrc = formatPainterSrcRef.current;
        if (painterSrc) {
          const r1 = Math.min(_r, _r2), r2 = Math.max(_r, _r2);
          const c1 = Math.min(_c, _c2), c2 = Math.max(_c, _c2);
          const newFormats = { ...cellFormatsRef.current };
          for (let r = r1; r <= r2; r++) {
            for (let c = c1; c <= c2; c++) {
              newFormats[`R${r}C${c}`] = { ...newFormats[`R${r}C${c}`], ...painterSrc };
            }
          }
          setCellFormats(newFormats);
          onCellFormatsChange?.(newFormats);
          setFormatPainterSrc(null);
          formatPainterSrcRef.current = null;
          hotRef.current?.render();
        }
        // Status bar aggregates — only on mouse release (not every pixel of drag)
        const startR = Math.min(_r, _r2);
        const endR = Math.max(_r, _r2);
        const startC = Math.min(_c, _c2);
        const endC = Math.max(_c, _c2);
        const totalCells = (endR - startR + 1) * (endC - startC + 1);
        if (totalCells > 1 && totalCells <= 10000) {
          const selectedData = hotRef.current?.getData(startR, startC, endR, endC);
          const nums: number[] = [];
          let nonEmptyCount = 0;
          if (selectedData) {
            for (let r = 0; r < selectedData.length; r++) {
              for (let c = 0; c < selectedData[r].length; c++) {
                const actualRow = startR + r;
              // Skip header row (row 0) for status bar aggregations
              if (actualRow === 0) continue;
              const val = selectedData[r][c];
                if (val !== null && val !== '' && val !== undefined) {
                  nonEmptyCount++;
                  const num = typeof val === 'string' ? parseFloat(val as string) : (typeof val === 'number' ? val : NaN);
                  if (!isNaN(num)) nums.push(num);
                }
              }
            }
          }
          // Excel: "Anzahl" = non-empty cells, "Summe"/"Mittelwert" = numeric only
          if (nonEmptyCount > 0) {
            const sum = nums.reduce((a, b) => a + b, 0);
            setStatusInfo({
              mode: 'ready', zoom,
              selectionCount: nonEmptyCount,
              selectionSum: nums.length > 0 ? sum : undefined,
              selectionAvg: nums.length > 0 ? sum / nums.length : undefined,
            });
          } else {
            setStatusInfo({ mode: 'ready', zoom });
          }
        } else {
          setStatusInfo({ mode: 'ready', zoom });
        }
      },

      afterDeselect() {
        setFuncTooltip(null); // Step 2: clear tooltip
        setStatusInfo(prev => ({ ...prev, mode: 'ready' as const }));
      },

      afterDocumentKeyDown(e: KeyboardEvent) {
        const hot = hotRef.current;
        if (!hot || hot.isDestroyed) return;
        const activeEditor = hot.getActiveEditor() as any;

        // Step 3 fix: sync formula bar on Escape (restore original cell value)
        if (e.key === 'Escape') {
          const ac = activeCellRef.current;
          if (ac) {
            const raw = hot.getSourceDataAtCell(ac.row, ac.col);
            const restoredVal = raw === null || raw === undefined ? '' : String(raw);
            setFormulaBarValue(restoredVal);
            formulaValueRef.current = restoredVal;
            isFormulaEditingRef.current = false;
          }
        }

        if (!activeEditor || !activeEditor.isOpened()) {
          if (cellAutocompleteRef.current.visible) setCellAutocomplete(prev => ({ ...prev, visible: false }));
          return;
        }
        // Use the editor API instead of reading TEXTAREA directly (avoids DOM coupling)
        const val: string = activeEditor.getValue?.() || '';

        // Step 1: Excel DE behavior — auto-convert ',' to ';' in formulas
        if (e.key === ',' && val.startsWith('=')) {
          const textarea = activeEditor.TEXTAREA;
          const cursorPos = textarea.selectionStart ?? 0;
          const newVal = val.substring(0, cursorPos - 1) + ';' + val.substring(cursorPos);
          activeEditor.setValue(newVal);
          textarea.focus();
          textarea.selectionStart = cursorPos;
          textarea.selectionEnd = cursorPos;
          setFormulaBarValue(newVal);
          formulaValueRef.current = newVal;
          e.preventDefault();
        }

        // Bug #2 fix: throttle formula bar updates via requestAnimationFrame
        if (typeof val === 'string' && val !== formulaValueRef.current) {
          formulaValueRef.current = val;
          if (formulaRafRef.current) cancelAnimationFrame(formulaRafRef.current);
          formulaRafRef.current = requestAnimationFrame(() => {
            setFormulaBarValue(formulaValueRef.current);
          });
        }

        if (typeof val === 'string' && val.startsWith('=')) {
          // Step 2a: Auto-close parentheses on Enter (Excel behavior)
          if (e.key === 'Enter' && !e.shiftKey) {
            const openCount = (val.match(/\(/g) || []).length;
            const closeCount = (val.match(/\)/g) || []).length;
            if (openCount > closeCount) {
              const newVal = val + ')'.repeat(openCount - closeCount);
              activeEditor.setValue(newVal);
              setFormulaBarValue(newVal);
              formulaValueRef.current = newVal;
            }
          }

          // Step 1: Advanced function ScreenTip — depth-aware parser for nested
          // functions with argument highlighting (Excel behavior)
          const cursorPos = activeEditor.TEXTAREA.selectionStart ?? 0;
          let lastOpenParen = -1;
          let parenDepth = 0;
          for (let i = cursorPos - 1; i >= 0; i--) {
            if (val[i] === ')') parenDepth++;
            else if (val[i] === '(') {
              if (parenDepth === 0) { lastOpenParen = i; break; }
              parenDepth--;
            }
          }

          if (lastOpenParen !== -1) {
            const fnMatch = val.substring(0, lastOpenParen).match(/([A-Za-z_ÄÖÜäöüß]+)$/);
            if (fnMatch) {
              const fnName = fnMatch[1].toUpperCase();
              const found = DE_FUNCTIONS.find(f => f.name === fnName);
              if (found) {
                const td = hot.getCell(activeEditor.row, activeEditor.col, true);
                if (td) {
                  const rect = td.getBoundingClientRect();
                  // Count current argument index by counting ';' at depth 0
                  const argsStr = val.substring(lastOpenParen + 1, cursorPos);
                  let argIndex = 0;
                  let inQuotes = false;
                  let currentDepth = 0;
                  for (const char of argsStr) {
                    if (char === '"') inQuotes = !inQuotes;
                    else if (!inQuotes && char === '(') currentDepth++;
                    else if (!inQuotes && char === ')') currentDepth--;
                    else if (!inQuotes && currentDepth === 0 && char === ';') argIndex++;
                  }
                  // Highlight the current argument in bold green
                  let syntaxHtml = found.syntax;
                  const syntaxParts = found.syntax.split(';');
                  if (argIndex < syntaxParts.length) {
                    syntaxParts[argIndex] = `<b style="color:#217346;">${syntaxParts[argIndex]}</b>`;
                    syntaxHtml = syntaxParts.join(';');
                  } else {
                    syntaxParts[syntaxParts.length - 1] = `<b style="color:#217346;">${syntaxParts[syntaxParts.length - 1]}</b>`;
                    syntaxHtml = syntaxParts.join(';');
                  }
                  setFuncTooltip({ html: syntaxHtml, x: rect.left, y: rect.top - 28 });
                }
              } else {
                setFuncTooltip(null);
              }
            } else {
              setFuncTooltip(null);
            }
          } else {
            setFuncTooltip(null);
          }

          // Extract the last function-name fragment (after =, (, ,, +, -, etc.)
          const m = val.match(/(?:^=|[(,;+\-*/><=& ])\s*([A-Za-z_ÄÖÜäöüß]+)$/);
          const partial = m ? m[1].toUpperCase() : null;
          if (partial && partial.length >= 1) {
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
          setFuncTooltip(null); // Step 2b: hide tooltip when not a formula
        }
      },

      afterChange(changes: any, source: string) {
        // Step 3: clear function ScreenTip when editing finishes
        if (source !== 'loadData') setFuncTooltip(null);

        // Bug fix: suppress incomplete formula commits during range-selection.
        // When user clicks away while editing a formula (e.g. "=SUMME("),
        // Handsontable closes the editor and saves the partial formula → #ERROR!.
        // The real formula is rebuilt in afterSelectionEnd, so skip this commit.
        if (isRangeSelecting.current) {
          isRangeSelecting.current = false;
          return;
        }

        if (!changes || source === 'loadData' || isInternalChange.current) {
          // Clear format history on full data reload (sheet switch, etc.)
          if (source === 'loadData') {
            formatHistoryRef.current = [];
            formatHistoryPosRef.current = -1;
          }
          return;
        }
        const h2 = hotRef.current;
        if (h2 && !h2.isDestroyed) {
          const undoRedo = h2.getPlugin('undoRedo') as any;
          setCanUndo(undoRedo?.isUndoAvailable?.() ?? false);
          setCanRedo(undoRedo?.isRedoAvailable?.() ?? false);
        }
        // Bug #3 fix: only copy changed rows, not entire grid
        const changedRowSet = new Set<number>();
        for (const [row] of changes) {
          if (row > 0) changedRowSet.add(row - 1);
        }
        const nd = dataRef.current.map((r, i) => changedRowSet.has(i) ? [...r] : r);
        for (const [row, col, _old, newVal] of changes) {
          if (row === 0) continue;
          if (nd[row - 1]) nd[row - 1][col] = newVal;
          if (mode === 'practice') {
            // Bug #11 fix: cancel previous practice check timer before setting new one
            if (practiceTimerRef.current) clearTimeout(practiceTimerRef.current);
            const pr = row, pc = col;
            practiceTimerRef.current = setTimeout(() => checkCellPractice(pr, pc), 300);
          }
        }
        isInternalChange.current = true;
        onChange(nd);
        requestAnimationFrame(() => { isInternalChange.current = false; });
        const lastChange = changes[changes.length - 1];
        if (lastChange) {
          setFormulaBarValue(lastChange[3] ?? '');
        }
        // Hide autocomplete on confirm — afterDocumentKeyDown handles live suggestions
        setCellAutocomplete(prev => ({ ...prev, visible: false }));
      },

      // Autofill: copy cell metadata natively so HT's undo/redo can track it
      afterAutofill(_fillData: unknown[][], sourceRange: { from: { row: number | null; col: number | null }; to: { row: number | null; col: number | null } }, targetRange: { from: { row: number | null; col: number | null }; to: { row: number | null; col: number | null } }) {
        const hot = hotRef.current;
        if (!hot) return;
        const srcFromRow = sourceRange.from.row ?? 0;
        const srcFromCol = sourceRange.from.col ?? 0;
        const srcToRow = sourceRange.to.row ?? srcFromRow;
        const srcToCol = sourceRange.to.col ?? srcFromCol;
        const tgtFromRow = targetRange.from.row ?? 0;
        const tgtFromCol = targetRange.from.col ?? 0;
        const tgtToRow = targetRange.to.row ?? 0;
        const tgtToCol = targetRange.to.col ?? 0;
        const srcRows = srcToRow - srcFromRow + 1;
        const srcCols = srcToCol - srcFromCol + 1;
        // Copy native cell metadata from source to target (HT handles undo natively)
        for (let r = 0; r <= tgtToRow - tgtFromRow; r++) {
          for (let c = 0; c <= tgtToCol - tgtFromCol; c++) {
            const srcRow = srcFromRow + (r % srcRows);
            const srcCol = srcFromCol + (c % srcCols);
            const srcMeta = hot.getCellMeta(srcRow, srcCol) as any;
            if (srcMeta?.customFormat) {
              hot.setCellMeta(tgtFromRow + r, tgtFromCol + c, 'customFormat', { ...srcMeta.customFormat });
            }
          }
        }
        // Also sync React format state for downstream consumers (sheet switch, export)
        const newFormats = { ...cellFormatsRef.current };
        for (let r = 0; r <= tgtToRow - tgtFromRow; r++) {
          for (let c = 0; c <= tgtToCol - tgtFromCol; c++) {
            const srcRow = srcFromRow + (r % srcRows);
            const srcCol = srcFromCol + (c % srcCols);
            const srcKey = `R${srcRow}C${srcCol}`;
            const srcFmt = cellFormatsRef.current[srcKey];
            if (srcFmt) {
              newFormats[`R${tgtFromRow + r}C${tgtFromCol + c}`] = { ...srcFmt };
            }
          }
        }
        setCellFormats(newFormats);
        onCellFormatsChange?.(newFormats);
        // Bug #5 fix: HyperFormula auto-recalculates dependents via afterChange;
        // manual rebuildAndRecalculate is unnecessary and very expensive
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
        // BUG 8: Sync data with parent after row insertion
        setTimeout(() => {
          const physicalData = hotRef.current?.getSourceData() as any[][];
          if (physicalData) {
            onChange(physicalData.slice(1).map((r: any[]) => [...r]));
          }
        }, 0);
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
        // BUG 8: Sync data with parent after row deletion
        setTimeout(() => {
          const physicalData = hotRef.current?.getSourceData() as any[][];
          if (physicalData) {
            onChange(physicalData.slice(1).map((r: any[]) => [...r]));
          }
        }, 0);
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
        // Sync headers and data with parent after column insertion
        setTimeout(() => {
          const physicalData = hotRef.current?.getSourceData() as any[][];
          if (physicalData) {
            // Update headers ref and source data row 0
            const newHeaders = [...headersRef.current];
            for (let i = 0; i < amount; i++) {
              newHeaders.splice(col + i, 0, '');
            }
            headersRef.current = newHeaders;
            physicalData[0] = newHeaders;
            onChange(physicalData.slice(1).map((r: any[]) => [...r]));
          }
        }, 0);
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
        // Sync headers and data with parent after column deletion
        setTimeout(() => {
          const physicalData = hotRef.current?.getSourceData() as any[][];
          if (physicalData) {
            const newHeaders = headersRef.current.filter((_, i) => i < col || i >= col + amount);
            headersRef.current = newHeaders;
            physicalData[0] = newHeaders;
            onChange(physicalData.slice(1).map((r: any[]) => [...r]));
          }
        }, 0);
      },
    });

    hotRef.current = hot;
    (window as any).__hotInstance = hot;
    // Expose range-selection refs for E2E tests
    (window as any).__testRangeRefs = {
      isAppendingRangeRef,
      isRangeSelecting,
      originalEditCellRef,
      formulaBeforeSelectionRef,
      cursorStartRef,
      cursorEndRef,
      isRestoringEditorRef,
    };

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

  // Sync dark mode theme with Handsontable v18 Theme API
  useEffect(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    hot.updateSettings({ themeName: dark ? 'ht-theme-horizon' : 'ht-theme-main' } as any);
  }, [dark]);

  // Step 2: real-time sync formula bar typing into Handsontable cell
  useEffect(() => {
    if (isFormulaEditingRef.current) {
      const hot = hotRef.current;
      if (hot && !hot.isDestroyed) {
        const activeEditor = hot.getActiveEditor() as any;
        if (activeEditor && activeEditor.isOpened()) {
          if (activeEditor.getValue() !== formulaBarValue) {
            activeEditor.setValue(formulaBarValue);
          }
        }
      }
    }
  }, [formulaBarValue]);

  // Sync data changes to Handsontable — compare source data to avoid reload on user edits
  useEffect(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const currentSource = hot.getSourceData();
    const targetData = [headers.map(h => h), ...data.map(row => row.map(cell => (cell === null ? '' : cell)))];
    if (currentSource.length !== targetData.length || JSON.stringify(currentSource[0]) !== JSON.stringify(targetData[0])) {
      hot.loadData(targetData);
    }
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
      // Bug #6 fix: use refs for applyFormat and activeFormat to avoid stale closures
      else if (ctrl && e.key === 'b') { e.preventDefault(); applyFormatRef.current({ bold: !activeFormatRef.current.bold }); }
      else if (ctrl && e.key === 'i') { e.preventDefault(); applyFormatRef.current({ italic: !activeFormatRef.current.italic }); }
      else if (ctrl && e.key === 'u') { e.preventDefault(); applyFormatRef.current({ underline: !activeFormatRef.current.underline }); }
      // Ctrl+Shift+1: Apply number format (keep as shortcut)
      else if (ctrl && e.shiftKey && e.code === 'Digit1') { e.preventDefault(); applyFormatRef.current({ numberFormat: '#,##0.00' }); }
      else if (ctrl && e.shiftKey && e.code === 'Digit5') { e.preventDefault(); applyFormatRef.current({ numberFormat: '0%' }); }
      else if (ctrl && e.shiftKey && e.code === 'Digit4') { e.preventDefault(); applyFormatRef.current({ numberFormat: '#,##0.00 €' }); }
      // Ctrl+Shift+L: Toggle filters
      else if (ctrl && e.shiftKey && e.code === 'KeyL') { e.preventDefault(); const hot = hotRef.current; if (hot) { const f = hot.getPlugin('filters'); if (f) f.filter(); } }
      // Ctrl+Space: Select entire column (use ref to avoid stale activeCell)
      else if (ctrl && !e.shiftKey && e.key === ' ') { e.preventDefault(); const hot = hotRef.current; const ac = activeCellRef.current; if (hot && ac) hot.selectColumns(ac.col); }
      // Shift+Space: Select entire row
      else if (!ctrl && e.shiftKey && e.key === ' ') { e.preventDefault(); const hot = hotRef.current; const ac = activeCellRef.current; if (hot && ac) hot.selectRows(ac.row); }
      // Ctrl+1: Open Format Cells dialog (BUG 11: ensure shift not pressed)
      else if (ctrl && !e.shiftKey && e.key === '1') { e.preventDefault(); setShowFormatCellsDialog(true); }
      // Ctrl+D: Fill down — use source formulas so references adjust relatively
      else if (ctrl && e.key === 'd') {
        e.preventDefault();
        const hot = hotRef.current;
        const sr = selectedRangeRef.current;
        if (hot && sr && sr.startRow > 0 && sr.endRow > sr.startRow) {
          const sourceFormulas = [];
          for (let c = sr.startCol; c <= sr.endCol; c++) {
            sourceFormulas.push(hot.getSourceDataAtCell(sr.startRow, c));
          }
          const fillData = [];
          for (let i = sr.startRow + 1; i <= sr.endRow; i++) {
            fillData.push([...sourceFormulas]);
          }
          hot.populateFromArray(sr.startRow + 1, sr.startCol, fillData);
        }
      }
      // Ctrl+R: Fill right — use source formulas so references adjust relatively
      else if (ctrl && e.key === 'r') {
        e.preventDefault();
        const hot = hotRef.current;
        const sr = selectedRangeRef.current;
        if (hot && sr && sr.endCol > sr.startCol) {
          const sourceFormulas = [];
          for (let r = sr.startRow; r <= sr.endRow; r++) {
            sourceFormulas.push([hot.getSourceDataAtCell(r, sr.startCol)]);
          }
          const targetData = sourceFormulas.map(row => {
            const filled = [];
            for (let c = sr.startCol + 1; c <= sr.endCol; c++) {
              filled.push(row[0]);
            }
            return filled;
          });
          hot.populateFromArray(sr.startRow, sr.startCol + 1, targetData);
        }
      }
      // Alt+= : AutoSum — scan up, then left (skip on header row)
      else if (e.altKey && e.key === '=') {
        e.preventDefault();
        const hot = hotRef.current;
        const ac = activeCellRef.current;
        if (hot && ac) {
          const col = ac.col;
          const row = ac.row;
          const colLetter = colToLetter(col);
          // Scan upward for contiguous numbers — use evaluated values from HOT
          let upStart: number | null = null;
          for (let r = row - 1; r >= 0; r--) {
            const val = hot.getDataAtCell(r, col) as string | number | null;
            if (typeof val !== 'number' && isNaN(parseFloat(val as string))) break;
            upStart = r;
          }
          if (upStart !== null) {
            hot.setDataAtCell(row, col, `=SUMME(${colLetter}${upStart + 1}:${colLetter}${row + 1})`);
          } else {
            // Scan left
            let leftStart: number | null = null;
            for (let c = col - 1; c >= 0; c--) {
              const val = hot.getDataAtCell(row, c) as string | number | null;
              if (typeof val !== 'number' && isNaN(parseFloat(val as string))) break;
              leftStart = c;
            }
            if (leftStart !== null) {
              const leftLetter = colToLetter(leftStart);
              hot.setDataAtCell(row, col, `=SUMME(${leftLetter}${row + 1}:${colLetter}${row + 1})`);
            }
          }
        }
      }
      // Alt+Enter: insert line break at cursor position (native editor, stays in editing mode)
      else if (e.altKey && e.key === 'Enter') {
        e.preventDefault();
        const hot = hotRef.current;
        const ac = activeCellRef.current;
        if (hot && ac) {
          const activeEditor = hot.getActiveEditor() as any;
          if (activeEditor && activeEditor.isOpened()) {
            const textarea = activeEditor.TEXTAREA;
            const start = textarea.selectionStart ?? 0;
            const end = textarea.selectionEnd ?? start;
            const newVal = textarea.value.substring(0, start) + '\n' + textarea.value.substring(end);
            activeEditor.setValue(newVal);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
            // Activate text wrap via native cell metadata
            hot.setCellMeta(ac.row, ac.col, 'customFormat', {
              ...(hot.getCellMeta(ac.row, ac.col) as any)?.customFormat || {},
              textWrap: true,
            });
            // Sync React format state
            const key = `R${ac.row}C${ac.col}`;
            const newFormats = { ...cellFormatsRef.current };
            newFormats[key] = { ...newFormats[key], textWrap: true };
            setCellFormats(newFormats);
            onCellFormatsChange?.(newFormats);
            hot.render();
          }
        }
      }
      // Ctrl+Shift+A: Insert function arguments (Excel behavior)
      else if (ctrl && e.shiftKey && e.key === 'a') {
        e.preventDefault();
        const hot = hotRef.current;
        const ac = activeCellRef.current;
        if (hot && ac) {
          const activeEditor = hot.getActiveEditor() as any;
          if (activeEditor && activeEditor.isOpened()) {
            const val: string = activeEditor.getValue?.() || '';
            const m = val.match(/([A-Za-z_ÄÖÜäöüß]+)$/);
            if (m) {
              const fnName = m[1].toUpperCase();
              const found = DE_FUNCTIONS.find(f => f.name === fnName);
              if (found) {
                const argsMatch = found.syntax.match(/\((.*)\)/);
                if (argsMatch) {
                  const args = argsMatch[1];
                  const newVal = val.substring(0, val.length - m[1].length) + fnName + '(' + args + ')';
                  activeEditor.setValue(newVal);
                  const ta = activeEditor.TEXTAREA;
                  ta.focus();
                  ta.selectionStart = newVal.length;
                  ta.selectionEnd = newVal.length;
                  setFormulaBarValue(newVal);
                  formulaValueRef.current = newVal;
                }
              }
            }
          }
        }
      }
      // F2: Handsontable handles natively — no custom override needed
      // Inline autocomplete keyboard navigation (use ref to avoid stale state)
      const cac = cellAutocompleteRef.current;
      if (cac.visible) {
        if (e.key === 'ArrowDown') { e.preventDefault(); setCellAutocomplete(prev => ({ ...prev, index: Math.min(prev.index + 1, prev.items.length - 1) })); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); setCellAutocomplete(prev => ({ ...prev, index: Math.max(prev.index - 1, 0) })); return; }
        if (e.key === 'Tab' || e.key === 'Enter') {
          e.preventDefault();
          e.stopImmediatePropagation(); // Step 3: prevent Handsontable from moving cell
          const selected = cac.items[cac.index];
          const acRef = activeCellRef.current;
          if (selected && acRef) {
            insertFnRef.current(selected.name);
          }
          setCellAutocomplete(prev => ({ ...prev, visible: false }));
          return;
        }
        if (e.key === 'Escape') { e.preventDefault(); setCellAutocomplete(prev => ({ ...prev, visible: false })); return; }
        // Step 2 fix: ArrowLeft/ArrowRight dismiss autocomplete and let cursor move naturally (Excel behavior)
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          setCellAutocomplete(prev => ({ ...prev, visible: false }));
          // Don't preventDefault — let Handsontable move the cursor natively
        }
      }
      // F4: toggle absolute references — cursor-position-aware
      else if (e.key === 'F4') {
        e.preventDefault();
        const hot = hotRef.current;
        const ac = activeCellRef.current;
        if (hot && ac) {
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
              targetRef = targetRef.toUpperCase();
              // Step 3 fix: correct Excel F4 order — A1 → $A$1 → A$1 → $A1
              const stripped = targetRef.replace(/\$/g, '');
              const modes = [
                stripped,
                stripped.replace(/([A-Z]+)(\d+)/, '$$$1$$$2'),
                stripped.replace(/(\d+)/, '$$$1'),
                stripped.replace(/([A-Z]+)/, '$$$1'),
              ];
              const currentMode = modes.indexOf(targetRef);
              const nextMode = modes[(currentMode + 1) % modes.length] || modes[1];
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
    // Use native editor API when available — preserves HyperFormula sync and undo/redo
    const editor = hot.getActiveEditor() as any;
    if (editor && editor.isOpened()) {
      editor.setValue(val);
      editor.finishEditing(); // Native: triggers HyperFormula, undo/redo, and afterChange
    } else {
      // Fallback: direct setDataAtCell when editor is not open
      isInternalChange.current = true;
      hot.setDataAtCell(activeCell.row, activeCell.col, val);
      requestAnimationFrame(() => { isInternalChange.current = false; });
    }
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
    setValidationRules(prev => {
      const newRules = [...prev.filter(r => r.col !== rule.col), rule];
      validationRulesRef.current = newRules; // Immediate sync
      hotRef.current?.render();
      return newRules;
    });
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
  const handleAutoSum = useCallback((type?: 'sum' | 'avg' | 'count' | 'max' | 'min') => {
    const fnMap: Record<string, string> = { sum: 'SUMME', avg: 'MITTELWERT', count: 'ANZAHL', max: 'MAX', min: 'MIN' };
    const fnName = type ? fnMap[type] || 'SUMME' : 'SUMME';
    const hot = hotRef.current;
    const ac = activeCellRef.current;
    if (!hot || hot.isDestroyed || !ac || ac.row <= 0) return;
    (hfRef.current as any)?.evaluate?.();
    const col = ac.col;
    const row = ac.row;
    const colLetter = colToLetter(col);
    let upStart: number | null = null;
    for (let r = row - 1; r >= 0; r--) {
      const val = hot.getDataAtCell(r, col) as string | number | null;
      if (typeof val !== 'number' && isNaN(parseFloat(val as string))) break;
      upStart = r;
    }
    if (upStart !== null) {
      hot.setDataAtCell(row, col, `=${fnName}(${colLetter}${upStart + 1}:${colLetter}${row + 1})`);
    } else {
      let leftStart: number | null = null;
      for (let c = col - 1; c >= 0; c--) {
        const val = hot.getDataAtCell(row, c) as string | number | null;
        if (typeof val !== 'number' && isNaN(parseFloat(val as string))) break;
        leftStart = c;
      }
      if (leftStart !== null) {
        const leftLetter = colToLetter(leftStart);
        hot.setDataAtCell(row, col, `=${fnName}(${leftLetter}${row + 1}:${colLetter}${row + 1})`);
      } else {
        // Step 2 fix: Excel behavior — no adjacent numbers → insert empty function, open editor
        isInternalChange.current = true;
        const formula = `=${fnName}()`;
        hot.setDataAtCell(row, col, formula);
        requestAnimationFrame(() => {
          isInternalChange.current = false;
          hot.selectCell(row, col);
          const editor = hot.getActiveEditor() as any;
          if (editor) {
            editor.beginEditing(formula);
            const ta = editor.TEXTAREA;
            const pos = formula.length - 1; // cursor inside the parentheses
            ta.focus();
            ta.selectionStart = pos;
            ta.selectionEnd = pos;
          }
        });
      }
    }
  }, []);

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
          onExport={handleExportXlsx}
          onSave={handleExportXlsx}
        />
      )}
      {!readOnly && (
        <FormulaBar
          activeCell={activeCell}
          cellValue={formulaBarValue}
          onChange={(v) => { setFormulaBarValue(v); isFormulaEditingRef.current = true; }}
          onConfirm={() => { handleFormulaConfirm(); isFormulaEditingRef.current = false; }}
          onCancel={() => {
            isFormulaEditingRef.current = false;
            if (activeCell) {
              const hot = hotRef.current;
              const raw = activeCell.row === 0 ? headers[activeCell.col] : dataRef.current[activeCell.row - 1]?.[activeCell.col];
              setFormulaBarValue(raw === null || raw === undefined ? '' : String(raw));
            }
          }}
          onNavigateToRef={handleNavigateToRef}
          onStartEditing={() => {
            const hot = hotRef.current;
            const ac = activeCellRef.current;
            if (hot && ac) {
              const editor = hot.getActiveEditor() as any;
              if (!editor || !editor.isOpened()) {
                hot.selectCell(ac.row, ac.col);
                const raw = hot.getSourceDataAtCell(ac.row, ac.col);
                const editorInstance = hot.getActiveEditor() as any;
                editorInstance?.beginEditing(raw === null || raw === undefined ? '' : String(raw));
              }
            }
          }}
        />
      )}
      <div
        className={`spreadsheet-fortune-grid ${formatPainterSrc ? 'is-format-painter-active' : ''}`}
        style={{ height: externalGridHeight || 360 }}
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
                insertFunctionIntoEditor(fn.name);
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
      {/* Step 4: Function ScreenTip — floating syntax hint with argument highlight */}
      {funcTooltip && (
        <div style={{
          position: 'fixed', zIndex: 601, left: funcTooltip.x, top: funcTooltip.y,
          background: '#fff', border: '1px solid #c0c0c0', borderRadius: 4,
          padding: '4px 10px', fontFamily: "'Segoe UI', system-ui, sans-serif",
          fontSize: '0.78rem', color: '#333', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }} dangerouslySetInnerHTML={{ __html: funcTooltip.html }} />
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
      {/* Format Cells Dialog (Ctrl+1) */}
      {showFormatCellsDialog && (
        <div className="excel-dialog-overlay" onClick={() => setShowFormatCellsDialog(false)}>
          <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ minWidth: 320, maxWidth: 400 }}>
            <div className="excel-dialog-header">
              <span>Zellen formatieren</span>
              <button onClick={() => setShowFormatCellsDialog(false)}>✗</button>
            </div>
            <div className="excel-dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 16px' }}>
              {[
                { label: 'Standard', fmt: {} },
                { label: 'Zahl (#,##0.00)', fmt: { numberFormat: '#,##0.00' } },
                { label: 'Währung (#,##0.00 €)', fmt: { numberFormat: '#,##0.00 €' } },
                { label: 'Prozent (0%)', fmt: { numberFormat: '0%' } },
                { label: 'Datum (DD.MM.YYYY)', fmt: { numberFormat: 'DD.MM.YYYY' } },
                { label: 'Text', fmt: { numberFormat: '@' } },
              ].map(item => (
                <button key={item.label} className="ribbon-dropdown-item" style={{ textAlign: 'left', padding: '8px 12px' }}
                  onClick={() => { applyFormat(item.fmt); setShowFormatCellsDialog(false); }}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
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
