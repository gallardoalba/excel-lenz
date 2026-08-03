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
import Sparkline, { resolveSparklineData, colLetterToIndex as sparkColToIdx } from './Sparkline';
import type { SparklineDef } from './Sparkline';
import SparklineDialog from './SparklineDialog';
import GoalSeekDialog from './GoalSeekDialog';
import type { CellPosition, CellRange, CellFormat, CellFormats, StatusBarInfo, ContextMenuAction, ContextMenuState } from './types';
import { positionToRef, colToLetter, refToRange, rangeToRef, EXCEL_FUNCTIONS_DE } from './types';

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
    // Bug #31 fix: prevent circular reference infinite loops (runtime-only, not in HF type defs)
    maxIterations: 100,
  } as any);
  hf.addSheet('Sheet1');
  return hf;
}

// Build SVG string for a sparkline (used in afterRender DOM injection)
function buildSparklineSvg(def: SparklineDef, data: number[]): string {
  const w = 100, h = 20, pad = 2;
  const nums = data.filter(n => !isNaN(n));
  if (nums.length === 0) return '';

  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const range = max - min || 1;

  switch (def.type) {
    case 'line': {
      if (nums.length < 2) return '';
      const points = nums.map((v, i) => {
        const x = pad + (i / (nums.length - 1)) * (w - 2 * pad);
        const y = h - pad - ((v - min) / range) * (h - 2 * pad);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      const lastX = pad + ((nums.length - 1) / (nums.length - 1)) * (w - 2 * pad);
      const lastY = h - pad - ((nums[nums.length - 1] - min) / range) * (h - 2 * pad);
      let svg = `<svg width="${w}" height="${h}" style="display:block"><polyline points="${points}" fill="none" stroke="${def.color || '#4472C4'}" stroke-width="1.5" stroke-linejoin="round"/>`;
      if (def.highPoint) {
        const hi = nums.indexOf(max);
        const hx = pad + (hi / (nums.length - 1)) * (w - 2 * pad);
        const hy = h - pad - ((max - min) / range) * (h - 2 * pad);
        svg += `<circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="2.5" fill="${def.color || '#4472C4'}" stroke="white" stroke-width="0.5"/>`;
      }
      if (def.lowPoint) {
        const li = nums.indexOf(min);
        const lx = pad + (li / (nums.length - 1)) * (w - 2 * pad);
        const ly = h - pad;
        svg += `<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="2.5" fill="${def.color || '#4472C4'}" stroke="white" stroke-width="0.5"/>`;
      }
      svg += `<circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="2" fill="${def.color || '#4472C4'}"/></svg>`;
      return svg;
    }
    case 'column': {
      const barW = Math.max(1, (w - 4) / nums.length - 2);
      let svg = `<svg width="${w}" height="${h}" style="display:block">`;
      for (let i = 0; i < nums.length; i++) {
        const barH = Math.max(1, ((nums[i] - min) / range) * (h - 4));
        const x = 2 + i * ((w - 4) / nums.length) + ((w - 4) / nums.length - barW) / 2;
        const y = h - 2 - barH;
        const fill = (def.highPoint && nums[i] === max) ? '#FF8C00' : (def.lowPoint && nums[i] === min) ? '#FF4444' : (def.color || '#4472C4');
        svg += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" fill="${fill}" rx="0.5"/>`;
      }
      svg += '</svg>';
      return svg;
    }
    case 'winloss': {
      const midY = h / 2;
      const segW = Math.max(2, (w - 4) / nums.length);
      let svg = `<svg width="${w}" height="${h}" style="display:block">`;
      for (let i = 0; i < nums.length; i++) {
        const x = 2 + i * segW + segW / 2;
        const barH = Math.abs(nums[i]) > 0 ? 4 : 0;
        const y = nums[i] >= 0 ? midY - barH : midY + 0.5;
        const fill = nums[i] > 0 ? (def.color || '#4472C4') : nums[i] < 0 ? (def.negativeColor || '#FF4444') : '#999';
        svg += `<rect x="${(x - 2).toFixed(1)}" y="${y.toFixed(1)}" width="4" height="${barH || 1}" fill="${fill}"/>`;
      }
      svg += '</svg>';
      return svg;
    }
    default:
      return '';
  }
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
  /** Pre-populated sheets for multi-sheet exercises */
  initialSheets?: { name: string; headers: string[]; data: (string | number | null)[][] }[];
  /** Sparkline definitions for mini-chart exercises */
  sparklines?: SparklineDef[];
  onSparklinesChange?: (sparklines: SparklineDef[]) => void;
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
  initialSheets,
  sparklines: externalSparklines,
  onSparklinesChange,
}: SpreadsheetHandsontableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hotRef = useRef<Handsontable | null>(null);
  const hfRef = useRef<HyperFormula | null>(null);
  const dataRef = useRef(data);
  const headersRef = useRef(headers);
  const taskColsRef = useRef(taskCols);
  const internalChangeDepth = useRef(0); // Counter-based guard: prevents afterChange loops
  const lastLoadedDataRef = useRef<string>(''); // Bug #16: signature-based data reload guard
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
  // Tracks whether the range insertion was triggered from the Formula Bar
  // (vs the in-cell editor), so afterSelectionEnd can focus the right element.
  const isFormulaBarRangeSource = useRef(false);
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
  const zoomRef = useRef(zoom); // Bug #16: fix stale closure in afterSelectionEnd
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
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
  // Bug #16 fix: single gated effect instead of two effects that fire on every parent render
  useEffect(() => {
    const next = new Set(mergedErrors.map(e => `${e.row}:${e.col}`));
    // Only update if content actually changed
    if (next.size !== errorCellsSetRef.current.size ||
        [...next].some(k => !errorCellsSetRef.current.has(k))) {
      errorCellsSetRef.current = next;
      errorCellsRef.current = mergedErrors;
    }
  }, [mergedErrors]);

  // Refs to avoid keyboard listener re-renders
  // Step 1: Excel function ScreenTip (with HTML for argument highlighting)
  const [funcTooltip, setFuncTooltip] = useState<{ html: string; x: number; y: number } | null>(null);
  // Format Painter state
  const [formatPainterSrc, setFormatPainterSrc] = useState<CellFormat | null>(null);
  const formatPainterSrcRef = useRef<CellFormat | null>(null);
  // Merge state for ribbon button
  const [isMerged, setIsMerged] = useState(false);
  // Chart dialog state
  const [showChartDialog, setShowChartDialog] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'combo'>('bar');
  const [chartData, setChartData] = useState<Record<string, string | number>[]>([]);
  const [chartBarSeries, setChartBarSeries] = useState<string[] | undefined>(undefined);
  const [chartTrendlineSeries, setChartTrendlineSeries] = useState<string | undefined>(undefined);
  // Data validation
  const [validationRules, setValidationRules] = useState<{ col: number; type: string; min?: number; max?: number; list?: string; errorMessage: string }[]>([]);
  const validationRulesRef = useRef(validationRules);
  useEffect(() => { validationRulesRef.current = validationRules; }, [validationRules]);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  // Sparklines
  const [sparklines, setSparklines] = useState<SparklineDef[]>(externalSparklines || []);
  const sparklinesRef = useRef(sparklines);
  useEffect(() => { sparklinesRef.current = sparklines; }, [sparklines]);
  // Sync external sparklines when prop changes (e.g., new exercise loaded)
  useEffect(() => {
    if (externalSparklines) {
      setSparklines(externalSparklines);
    }
  }, [externalSparklines]);
  const [showSparklineDialog, setShowSparklineDialog] = useState(false);
  // Goal Seek
  const [showGoalSeekDialog, setShowGoalSeekDialog] = useState(false);
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
  // Bug #2.1 fix: refs for safety timeouts so they can be cleared on unmount
  const rangeSafetyTimer1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rangeSafetyTimer2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        const merged = { ...newFormats[key], ...format };
        // Bug #24 fix: strip undefined keys to prevent state bloat
        for (const k of Object.keys(merged)) {
          if (merged[k as keyof CellFormat] === undefined) delete merged[k as keyof CellFormat];
        }
        newFormats[key] = merged;
      }
    }
    applyFormatsWithUndo(newFormats);
  }, [selectedRange, cellFormats, applyFormatsWithUndo]);

  // Border application via native customBorders plugin (Excel-like: no DOM conflicts)
  const applyBorder = useCallback((side: 'top' | 'bottom' | 'left' | 'right', color?: string) => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed || !selectedRange) return;
    const borderConfig = { width: 1, color: color || '#000000' };
    // Bug #18.2 fix: if selection is a merged cell, apply border to the merged block
    const mc = hot.getPlugin('mergeCells') as any;
    let targetRange = selectedRange;
    if (mc) {
      const merged = mc.mergedCellsCollection?.get(selectedRange.startRow, selectedRange.startCol);
      if (merged) {
        targetRange = {
          startRow: merged.row,
          startCol: merged.col,
          endRow: merged.row + merged.rowspan - 1,
          endCol: merged.col + merged.colspan - 1,
        };
      }
    }
    const ranges = [{
      start: { row: targetRange.startRow, col: targetRange.startCol },
      end: { row: targetRange.endRow, col: targetRange.endCol },
    }];
    const customBordersPlugin = hot.getPlugin('customBorders') as any;
    if (customBordersPlugin?.setBorders) {
      customBordersPlugin.setBorders(ranges, { [side]: borderConfig });
      // Also update React format state so borders survive sheet switches
      const newFormats = { ...cellFormats };
      const borderKey = `border${side.charAt(0).toUpperCase() + side.slice(1)}` as keyof CellFormat;
      for (let r = targetRange.startRow; r <= targetRange.endRow; r++) {
        for (let c = targetRange.startCol; c <= targetRange.endCol; c++) {
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
        // Bug #4 fix: Merge & Center should automatically center text (Excel behavior)
        const newFormats = { ...cellFormatsRef.current };
        for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
            const key = `R${r}C${c}`;
            newFormats[key] = { ...newFormats[key], hAlign: 'center' };
          }
        }
        setCellFormats(newFormats);
        cellFormatsRef.current = newFormats;
        onCellFormatsChange?.(newFormats);
      }
      // Bug #5.1 fix: push to format undo stack so Ctrl+Z restores merge state
      applyFormatsWithUndo(cellFormatsRef.current);
    }
    hot.render();
  }, [selectedRange, applyFormatsWithUndo]);

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
      const srcData = hot.getSourceData() as (string | number | null)[][];
      allDataRef.current[activeSheetId] = srcData.slice(1); // Skip header row
    }
    // Add sheet to HF with empty data
    const hf = hfRef.current;
    const numCols = Math.max(headersRef.current.length, 30);
    const numRows = 30;
    if (hf) {
      const sheetNames = hf.getSheetNames();
      if (!sheetNames.includes(newName)) {
        hf.addSheet(newName);
        const newHfId = hf.getSheetId(newName);
        // Empty data: generic headers + empty rows
        const emptyData = [Array(numCols).fill(''), ...Array(numRows).fill(null).map(() => Array(numCols).fill(''))];
        if (newHfId !== undefined) {
          try { hf.setSheetContent(newHfId, emptyData as any); } catch { /* ignore */ }
        }
      }
    }
    // Store empty data for the new sheet (no header row, just empty rows)
    allDataRef.current[newId] = Array(numRows).fill(null).map(() => Array(numCols).fill(''));
    setSheets(prev => [...prev, { id: newId, name: newName }]);
    setActiveSheetId(newId);
    // Load empty data into HOT
    if (hot && !hot.isDestroyed) {
      const emptyTarget = [Array(numCols).fill(''), ...allDataRef.current[newId]];
      internalChangeDepth.current++;
      hot.loadData(emptyTarget);
      setTimeout(() => { if (internalChangeDepth.current > 0) internalChangeDepth.current--; }, 100);
    }
  }, [sheets, activeSheetId]);

  const handleSwitchSheet = useCallback((sheetId: number) => {
    const hot = hotRef.current;
    const hf = hfRef.current;
    if (!hot || hot.isDestroyed || !hf || sheetId === activeSheetId) return;
    // Save current data and formats
    allDataRef.current[activeSheetId] = (hot.getSourceData() as (string | number | null)[][]).slice(1); // Skip header row
    allFormatsRef.current[activeSheetId] = { ...cellFormatsRef.current };
    // Bug #9.2 fix: sync ALL sheets' data to HyperFormula so cross-sheet
    // references (e.g. =Tabelle2!A1) resolve correctly after switching.
    // Without this, only the target sheet is synced and other sheets' data
    // becomes stale in HF, causing #REF! errors.
    for (const s of sheets) {
      const hfId = hf.getSheetId(s.name);
      if (hfId === undefined) continue;
      const sheetData = (s.id === activeSheetId)
        ? (allDataRef.current[activeSheetId] || [])
        : (allDataRef.current[s.id] || []);
      const hfData = [headersRef.current.map(h => h), ...sheetData.map(row => row.map(cell => (cell === null ? '' : cell)))];
      try { hf.setSheetContent(hfId, hfData as any); } catch { /* ignore */ }
    }
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
      case 'pasteTranspose': { if (sr) { const hot = hotRef.current; if (!hot) break; // Bug #5 fix: use getSourceData() to preserve formulas instead of getData() which returns evaluated values
        const data = hot.getSourceData(sr.startRow, sr.startCol, sr.endRow, sr.endCol); const rows = (data as string[][]).map(r => r.map(c => String(c ?? ''))); const transposed = rows[0]?.map((_: string, i: number) => rows.map(r => r[i] || '')) || []; hot.populateFromArray(sr.startRow, sr.startCol, transposed); } break; }

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
              // Bug #7 fix: remove arbitrary 300px cap; Excel AutoFit has no limit
              (resizePlugin as any).setManualSize(c, newWidth);
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
      // Bug #8 fix: Hide/Unhide Rows (Excel parity with columns)
      case 'hideRow': if (sr) {
        const hiddenPlugin = hot.getPlugin('hiddenRows');
        let currentlyHidden: number[] = [];
        if (hiddenPlugin && Array.isArray((hiddenPlugin as any).hiddenRows)) {
          currentlyHidden = (hiddenPlugin as any).hiddenRows;
        }
        for (let r = sr.startRow; r <= sr.endRow; r++) {
          if (!currentlyHidden.includes(r)) currentlyHidden.push(r);
        }
        hot.updateSettings({ hiddenRows: { rows: currentlyHidden } });
      } break;
      case 'unhideRow': if (sr) {
        const hiddenPlugin = hot.getPlugin('hiddenRows');
        if (hiddenPlugin) {
          for (let r = sr.startRow; r <= sr.endRow; r++) {
            (hiddenPlugin as any).showRow?.(r);
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


  // Refs for formula editing — must be declared BEFORE the HOT init useEffect
  const formulaValueRef = useRef(formulaBarValue);
  formulaValueRef.current = formulaBarValue;
  const isFormulaEditingRef = useRef(false);
  const isSyncingFormulaRef = useRef(false); // Prevent re-entry in formula sync

  // Init Handsontable
  useEffect(() => {
    if (!containerRef.current) return;
    // Properly destroy existing instance before re-initializing
    if (hotRef.current && !hotRef.current.isDestroyed) {
      hotRef.current.destroy();
    }
    containerRef.current.innerHTML = '';

    // ── Memory optimization: dynamic grid sizing ──────────────────────
    // Instead of hardcoded 50×50 (2,500 cells), size to actual data + buffer.
    // This dramatically reduces DOM nodes and HyperFormula memory.
    const dataRows = data.length;
    const dataCols = headers.length;
    const dynamicMinRows = Math.max(dataRows + 10, 30);
    const dynamicMinCols = Math.max(dataCols + 3, 30);

    // Create HyperFormula instance per component (prevents cross-instance leaks)
    if (!hfRef.current) {
      hfRef.current = createHF();
      hfRef.current.renameSheet(0, 'Tabelle1');
    }

    // Initialize multi-sheet data if provided (additional sheets beyond the main one)
    if (initialSheets && initialSheets.length > 0) {
      const hf = hfRef.current;
      // Main sheet is already created as Sheet1, renamed to Tabelle1
      // Store main sheet data in allDataRef[0]
      allDataRef.current = { 0: data.map(row => [...row]) };
      const newSheets: { id: number; name: string }[] = [{ id: 0, name: 'Tabelle1' }];
      for (let i = 0; i < initialSheets.length; i++) {
        const sheet = initialSheets[i];
        const sheetId = i + 1;
        hf.addSheet(sheet.name);
        const hfId = hf.getSheetId(sheet.name);
        newSheets.push({ id: sheetId, name: sheet.name });
        allDataRef.current[sheetId] = sheet.data.map(row => [...row]);
        allFormatsRef.current[sheetId] = {};
        // Initialize HF sheet content
        const hfData = [sheet.headers.map(h => h), ...sheet.data.map(row => row.map(cell => (cell === null ? '' : cell)))];
        if (hfId !== undefined) {
          try { hf.setSheetContent(hfId, hfData as any); } catch { /* ignore */ }
        }
      }
      setSheets(newSheets);
      // allDataRef[0] already set from props data
    }

    // ── 3D Reference Expansion ──────────────────────────────────────────
    const expand3DRefs = (formula: string): string => {
      const hf = hfRef.current;
      if (!hf) return formula;
      const allSheets = hf.getSheetNames();
      const re = /([A-Za-z0-9_ÄÖÜäöüß]+):([A-Za-z0-9_ÄÖÜäöüß]+)!(\$?[A-Z]+\$?\d+(?::\$?[A-Z]+\$?\d+)?)/g;
      return formula.replace(re, (_match: string, first: string, last: string, cellRef: string) => {
        const firstIdx = allSheets.indexOf(first);
        const lastIdx = allSheets.indexOf(last);
        if (firstIdx === -1 || lastIdx === -1 || firstIdx > lastIdx) return _match;
        const sheetsInRange = allSheets.slice(firstIdx, lastIdx + 1);
        return sheetsInRange.map(s => `${s}!${cellRef}`).join(';');
      });
    };

    const hot = new Handsontable(containerRef.current, {
      data: [headers.map(h => h), ...data.map(row => row.map(cell => (cell === null ? '' : cell)))],
      colHeaders: true,
      rowHeaders: true,
      height: externalGridHeight || 360,
      minRows: dynamicMinRows,
      minCols: dynamicMinCols,
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
      // Excel-like series autofill: return custom data for months/weekdays/numbers
      beforeAutofill(_start: unknown, _sourceRange: unknown, _targetRange: unknown, _direction: unknown) {
        const hot = hotRef.current;
        if (!hot) return;
        const sr = _sourceRange as { from: { row: number; col: number }; to: { row: number; col: number } };
        const tr = _targetRange as { from: { row: number; col: number }; to: { row: number; col: number } };
        const srcFromRow = sr.from.row;
        const srcFromCol = sr.from.col;
        const srcToRow = sr.to.row;
        const srcToCol = sr.to.col;
        const srcRows = srcToRow - srcFromRow + 1;
        const srcCols = srcToCol - srcFromCol + 1;

        // Only handle single-column vertical fills with 2+ source cells
        if (srcCols !== 1 || srcRows < 2) return;

        // Read source values from HOT
        const srcValues: string[] = [];
        for (let r = srcFromRow; r <= srcToRow; r++) {
          const v = hot.getDataAtCell(r, srcFromCol);
          srcValues.push(v != null ? String(v).trim() : '');
        }

        const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
        const MONTHS_SHORT = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
        const WEEKDAYS = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
        const WEEKDAYS_SHORT = ['Mo','Di','Mi','Do','Fr','Sa','So'];

        let extendFn: ((idx: number) => string | number) | null = null;
        for (const list of [MONTHS, MONTHS_SHORT, WEEKDAYS, WEEKDAYS_SHORT]) {
          const idx0 = list.indexOf(srcValues[0]);
          if (idx0 >= 0) {
            let ok = true;
            for (let i = 1; i < srcValues.length; i++) {
              if (list[(idx0 + i) % list.length] !== srcValues[i]) { ok = false; break; }
            }
            if (ok) { extendFn = (i) => list[(idx0 + i) % list.length]; break; }
          }
        }
        if (!extendFn) {
          const n0 = Number(srcValues[0]);
          const n1 = Number(srcValues[1]);
          if (!isNaN(n0) && !isNaN(n1) && n0 !== n1) {
            const step = n1 - n0;
            let ok = true;
            for (let i = 2; i < srcValues.length; i++) {
              if (Number(srcValues[i]) !== n0 + step * i) { ok = false; break; }
            }
            if (ok) extendFn = (i) => n0 + step * i;
          }
        }

        if (!extendFn) return; // Let HT handle normal copy

        // Build custom fill data
        const tgtRows = tr.to.row - tr.from.row + 1;
        const tgtCols = tr.to.col - tr.from.col + 1;
        const fillData: unknown[][] = [];
        for (let r = 0; r < tgtRows; r++) {
          const row: unknown[] = [];
          for (let c = 0; c < tgtCols; c++) {
            const idx = srcRows + r;
            row.push(extendFn(idx));
          }
          fillData.push(row);
        }
        return fillData;
      },
      autoRowSize: false,
      // columnSorting re-enabled: HT v18 native sort works with HyperFormula
      columnSorting: true,
      filters: true,
      dropdownMenu: true,
      // Bug #13.2: search plugin disabled (no search UI in the app)
      // search: true,
      autoWrapRow: false,
      autoWrapCol: false,
      stretchH: 'last',
      readOnly,
      selectionMode: 'multiple',
      // Keep selection visible when clicking ribbon buttons / format dialogs
      outsideClickDeselects: false,
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

      // Sparkline rendering: inject SVG mini-charts into cells after each render
      afterRender() {
        const sparkDefs = sparklinesRef.current;
        if (!sparkDefs || sparkDefs.length === 0) return;
        const hot = hotRef.current;
        if (!hot || hot.isDestroyed) return;

        for (const def of sparkDefs) {
          const match = def.cell.match(/^([A-Z]+)(\d+)$/i);
          if (!match) continue;
          const col = sparkColToIdx(match[1]);
          const excelRow = parseInt(match[2], 10);
          // HOT visual row: row 0 = header row, row 1 = first data row, ...
          // Excel row 1 → HOT visual row 0 (header), Excel row 2 → HOT visual row 1, ...
          const visualRow = excelRow - 1;
          const visualCol = col;
          const td = hot.getCell(visualRow, visualCol);
          if (!td) continue;

          const resolvedData = resolveSparklineData(def, dataRef.current, headersRef.current);
          if (resolvedData.length === 0) continue;

          // Clear existing sparkline content
          const existingSvg = td.querySelector('.sparkline-svg');
          if (existingSvg) existingSvg.remove();

          // Build SVG string and inject
          const svgStr = buildSparklineSvg(def, resolvedData);
          if (!svgStr) continue;

          const wrapper = document.createElement('span');
          wrapper.className = 'sparkline-svg';
          wrapper.style.display = 'flex';
          wrapper.style.alignItems = 'center';
          wrapper.style.justifyContent = 'center';
          wrapper.style.width = '100%';
          wrapper.style.height = '100%';
          wrapper.innerHTML = svgStr;

          // Replace the text content with the sparkline SVG
          // Keep the original data value in a data attribute
          const sourceVal = hot.getSourceDataAtCell(visualRow - 1 < 0 ? 0 : visualRow - 1, visualCol);
          // Actually use the visual indices directly since HOT getCell uses visual positions
          td.innerHTML = '';
          td.appendChild(wrapper);
        }
      },

      beforePaste(data: unknown[][], _coords: unknown[]) {
        if (pasteModeRef.current === 'values') {
          // Bug #8 fix: resolve formulas via HyperFormula engine instead of
          // reading empty destination cells
          const hfPaste = hfRef.current;
          // Bug #3.1 fix: use active sheet name instead of hardcoded sheet 0
          const activeSheetName = sheets.find(s => s.id === activeSheetId)?.name || 'Tabelle1';
          const activeHfSheetId = hfPaste?.getSheetId(activeSheetName) ?? 0;
          for (let r = 0; r < data.length; r++) {
            for (let c = 0; c < data[r].length; c++) {
              const cellData = data[r][c];
              if (typeof cellData === 'string' && cellData.startsWith('=')) {
                try {
                  if (hfPaste) {
                    const result = hfPaste.calculateFormula(cellData.substring(1), activeHfSheetId);
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
        // Header row is protected via beforeChange (not readOnly) to avoid grey styling
        // Bug #7 fix: use refs for taskCols and headers to avoid stale closure
        const isTask = taskColsRef.current.includes(col) && col < headersRef.current.length;
        // Read from REFS (not state) to avoid stale closure
        const fmt = cellFormatsRef.current[`R${row}C${col}`];
        const rules = condRulesRef.current;
        // Bug #1 fix: always keep cells as 'text' type so non-numeric values (e.g. "N/A", "Pending")
        // are accepted even in formatted cells. Excel formats are purely visual — they only apply
        // to numbers, text bypasses the format. Number rendering is handled in the renderer below.
        cellMeta.type = 'text';
        if (fmt?.numberFormat && fmt.numberFormat !== '@') {
          // Store format in meta for the renderer to use
          (cellMeta as any)._excelFormat = fmt.numberFormat;
        }
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
          // ── Excel-default alignment: numbers right, text left, booleans center ──
          // Only applied when no explicit user format overrides it (checked after format styles below)
          let defaultHAlign: string | null = null;
          if (_r > 0) { // Skip header row
            if (typeof v === 'number' && isFinite(v)) {
              defaultHAlign = 'right';
            } else if (typeof v === 'boolean') {
              defaultHAlign = 'center';
            } else {
              defaultHAlign = 'left';
            }
          }
          // Header row styling: subtle blue-grey instead of readOnly grey
          if (_r === 0) {
            td.style.background = '#e8edf2';
            td.style.fontWeight = '600';
            td.style.fontSize = '0.85rem';
            td.style.color = '#444';
            td.style.borderBottom = '2px solid #c0c8d0';
          }
          // Bug #1 fix: apply Excel number formatting in renderer (visual only, text bypasses format)
          const meta = instance.getCellMeta(_r, _c);
          const excelFmt: string | undefined = (meta as any)._excelFormat;
          if (excelFmt && typeof v === 'number' && isFinite(v)) {
            let formatted: string;
            if (excelFmt === 'DD.MM.YYYY') {
              // Convert Excel serial date to DD.MM.YYYY
              const jsDate = new Date((v - 25569) * 86400 * 1000);
              const dd = String(jsDate.getDate()).padStart(2, '0');
              const mm = String(jsDate.getMonth() + 1).padStart(2, '0');
              const yyyy = jsDate.getFullYear();
              formatted = `${dd}.${mm}.${yyyy}`;
            } else if (excelFmt === '0%') {
              formatted = new Intl.NumberFormat('de-DE', { style: 'percent', minimumFractionDigits: 0 }).format(v);
            } else if (excelFmt === '#,##0.00 €') {
              formatted = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(v);
            } else if (excelFmt === '#,##0.00') {
              formatted = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
            } else {
              formatted = String(v);
            }
            td.textContent = formatted;
          }
          // Safe class cleanup: only remove user-set format classes, preserve
          // Handsontable's built-in htLeft/htRight/htCenter (default alignment)
          td.className = td.className.replace(/\bht(Bold|Italic|Underline|Align(Left|Center|Right|Top|Middle|Bottom)|Wrap)\b/g, '').trim();
          // Clean up stale error classes and indicators
          td.classList.remove('has-excel-error');
          // Bug #6.1: error triangle now rendered via CSS ::after — no DOM cleanup needed
          const isActive = activeCellRef.current && activeCellRef.current.row === _r && activeCellRef.current.col === _c;
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
              let num: number;
              if (typeof v === 'string') {
                // Bug #12.1 fix: only apply numeric rules to pure numbers, not mixed text
                const trimmed = v.trim();
                num = (trimmed !== '' && !isNaN(Number(trimmed))) ? Number(trimmed) : NaN;
              } else if (typeof v === 'number') {
                num = v;
              } else {
                num = NaN;
              }
              if (!isNaN(num)) {
                const match = rule.operator === '>' ? num > rule.value :
                  rule.operator === '<' ? num < rule.value :
                  rule.operator === '>=' ? num >= rule.value :
                  rule.operator === '<=' ? num <= rule.value : num === rule.value;
                if (match) { td.style.background = rule.color; break; }
              }
            }
          }
          // Apply Excel-default alignment (only if no explicit user format set)
          if (defaultHAlign && !fmt?.hAlign) {
            td.style.textAlign = defaultHAlign;
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
              // Bug #6.1 fix: use CSS class instead of DOM element creation in renderer
              td.classList.add('has-excel-error');
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
        // When editing a cell that shows an error (#ERROR!, #DIV/0!, etc.),
        // restore the original formula from source data so the user can fix it.
        const hot = hotRef.current;
        if (hot && !hot.isDestroyed) {
          const sel = hot.getSelected();
          if (sel && sel.length > 0) {
            const row = sel[0][0];
            const col = sel[0][1];
            const displayed = hot.getDataAtCell(row, col);
            const source = hot.getSourceDataAtCell(row, col);
            if (typeof displayed === 'string' && /^#/.test(displayed) &&
                typeof source === 'string' && source.startsWith('=')) {
              const editor = hot.getActiveEditor() as any;
              if (editor) {
                editor.setValue(source);
              }
            }
          }
        }
      },

      // Excel-like range selection: detect when user clicks another cell while editing a formula
      beforeOnCellMouseDown(e: MouseEvent, coords: { row: number | null; col: number | null }, _TD: HTMLTableCellElement, _controller: any) {
        const hot = hotRef.current;
        if (!hot || hot.isDestroyed) return;

        // Path A: In-cell editor is open — insert range reference immediately
        const activeEditor = hot.getActiveEditor() as any;
        if (activeEditor && activeEditor.isOpened()) {
          const val: string = activeEditor.getValue?.() || '';
          if (typeof val === 'string' && val.startsWith('=')) {
            const textarea = activeEditor.TEXTAREA;
            const selectionStart: number = textarea?.selectionStart ?? 0;
            const selectionEnd: number = textarea?.selectionEnd ?? selectionStart;
            const textBeforeCursor = val.substring(0, selectionStart);
            // Check if cursor is at a position where a range is expected
            const isRangeExpected = /[({,;+\-*/>=<&=\s]$/.test(textBeforeCursor)
              || textBeforeCursor === '='
              || (selectionStart !== selectionEnd);
            if (isRangeExpected && coords.row !== null && coords.col !== null) {
              // Store original formula and cursor position (before any range is inserted).
              // afterSelectionEnd will build the final formula using the actual selection range.
              const origRow = activeEditor.row;
              const origCol = activeEditor.col;

              // Insert single-cell reference for immediate visual feedback
              const singleCellRef = positionToRef({ row: coords.row, col: coords.col });
              const previewFormula = val.substring(0, selectionStart) + singleCellRef + val.substring(selectionEnd);
              activeEditor.setValue(previewFormula);
              if (textarea) {
                const cursorPos = selectionStart + singleCellRef.length;
                textarea.selectionStart = cursorPos;
                textarea.selectionEnd = cursorPos;
                // Auto-expand editor to show formula, capped to avoid overflow
                const spreadsheetWrap = document.querySelector('.spreadsheet-container') as HTMLElement;
                if (spreadsheetWrap) {
                  const wrapRect = spreadsheetWrap.getBoundingClientRect();
                  const edRect = textarea.getBoundingClientRect();
                  const maxWidth = Math.max(150, wrapRect.right - edRect.left - 12);
                  textarea.style.maxWidth = maxWidth + 'px';
                  textarea.style.width = 'auto';
                }
              }
              setFormulaBarValue(previewFormula);
              formulaValueRef.current = previewFormula;

              // Set flags for the original cancel+rebuild flow (handles drag-to-range).
              // Note: we don't setDataAtCell here because HyperFormula would evaluate
              // the incomplete formula and show #ERROR! during drag. The cell will briefly
              // revert to its pre-edit value during drag, then afterSelectionEnd sets the
              // correct formula (with or without range).
              isAppendingRangeRef.current = true;
              isRangeSelecting.current = true;
              isFormulaBarRangeSource.current = false;
              originalEditCellRef.current = { row: origRow, col: origCol };
              formulaBeforeSelectionRef.current = val; // Original formula BEFORE click
              cursorStartRef.current = selectionStart;
              cursorEndRef.current = selectionEnd;
              // Safety timeout
              if (rangeSafetyTimer1Ref.current) clearTimeout(rangeSafetyTimer1Ref.current);
              rangeSafetyTimer1Ref.current = setTimeout(() => {
                isAppendingRangeRef.current = false;
                isRangeSelecting.current = false;
              }, 2000);

              // DON'T stop propagation — let drag-selection work for ranges
              return;
            }
          }
        }

        // Path B: Formula Bar is being edited — NO in-cell editor, but user is typing a formula.
        // Intercept cell clicks to insert range references into the formula bar.
        if (!isAppendingRangeRef.current && isFormulaEditingRef.current) {
          const fbValue = formulaValueRef.current;
          if (fbValue.startsWith('=')) {
            // Read cursor position from Formula Bar textarea in the DOM
            const fbInput = document.querySelector('.formulabar-input') as HTMLTextAreaElement | null;
            const selStart = fbInput?.selectionStart ?? fbValue.length;
            const selEnd = fbInput?.selectionEnd ?? selStart;
            const textBeforeCursor = fbValue.substring(0, selStart);
            const isRangeExpected = /[({,;+\-*/>=<&=\s]$/.test(textBeforeCursor)
              || textBeforeCursor === '='
              || (selStart !== selEnd);
            if (isRangeExpected) {
              isAppendingRangeRef.current = true;
              isRangeSelecting.current = true;
              isFormulaBarRangeSource.current = true;
              originalEditCellRef.current = activeCellRef.current
                ? { row: activeCellRef.current.row, col: activeCellRef.current.col }
                : null;
              formulaBeforeSelectionRef.current = fbValue;
              cursorStartRef.current = selStart;
              cursorEndRef.current = selEnd;
              // Safety timeout in case mouseup doesn't trigger afterSelectionEnd
              if (rangeSafetyTimer2Ref.current) clearTimeout(rangeSafetyTimer2Ref.current);
              rangeSafetyTimer2Ref.current = setTimeout(() => {
                isAppendingRangeRef.current = false;
                isRangeSelecting.current = false;
                internalChangeDepth.current = 0;
              }, 2000);
            }
          }
        }
      },

      beforeChange(changes: any, source: string) {
        // Bug #1.1 fix: Cancel the incomplete formula commit explicitly.
        if (isRangeSelecting.current || isAppendingRangeRef.current) {
          return false;
        }
        if (changes && source !== 'loadData' && source !== 'internalUpdate') {
          for (let i = 0; i < changes.length; i++) {
            const [, , oldVal, newVal] = changes[i];
            if (typeof newVal === 'string' && newVal.startsWith('=')) {
              let formula = newVal;
              // Auto-close unmatched parentheses
              let open = 0;
              for (const ch of formula) {
                if (ch === '(') open++;
                else if (ch === ')') open--;
              }
              if (open > 0) {
                formula = formula + ')'.repeat(open);
              }
              // Expand 3D references: Sheet1:SheetN!Range → Sheet1!Range;Sheet2!Range;...
              formula = expand3DRefs(formula);
              if (formula !== changes[i][3]) {
                changes[i][3] = formula;
              }
            }
          }
        }
      },

      afterSelection(_r: number, _c: number, _r2: number, _c2: number) {
        // Bug #3 fix: update refs only during drag (no React state → no re-render)
        // State updates (formulaBar, isMerged) deferred to afterSelectionEnd
        activeCellRef.current = { row: _r, col: _c };
        selectedRangeRef.current = {
          startRow: Math.min(_r, _r2),
          startCol: Math.min(_c, _c2),
          endRow: Math.max(_r, _r2),
          endCol: Math.max(_c, _c2),
        };
        // Instantly re-render so active-cell highlight moves without delay
        hot.render();
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
            isRangeSelecting.current = false;
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
            
            // After inserting the range, restore focus to the editing source.
            const origRow = original ? original.row : _r;
            const origCol = original ? original.col : _c;
            const wasFormulaBarEdit = isFormulaBarRangeSource.current;
            isFormulaBarRangeSource.current = false;
            if (wasFormulaBarEdit) {
              // Formula Bar was the editing source: focus it and place cursor after the inserted range.
              const fbInput = document.querySelector('.formulabar-input') as HTMLTextAreaElement | null;
              if (fbInput) {
                const newCursorPos = selStart + rangeStr.length;
                fbInput.focus();
                fbInput.selectionStart = newCursorPos;
                fbInput.selectionEnd = newCursorPos;
              }
            } else {
              // In-cell editor was the source: re-select original cell, set formula, reopen editor.
              const h = hotRef.current;
              if (h && !h.isDestroyed) {
                isRestoringEditorRef.current = true;
                // Set cell value first so it's never left white/empty
                h.setDataAtCell(origRow, origCol, newFormula, 'internalUpdate');
                h.selectCell(origRow, origCol, origRow, origCol);
                // Reopen editor so user can continue editing
                const editor = h.getActiveEditor() as any;
                if (editor) {
                  editor.beginEditing(newFormula);
                  const textarea = editor.TEXTAREA;
                  const newCursorPos = selStart + rangeStr.length;
                  if (textarea) {
                    textarea.focus();
                    textarea.selectionStart = newCursorPos;
                    textarea.selectionEnd = newCursorPos;
                    // Auto-expand editor to show formula, capped to avoid overflow
                    const spreadsheetWrap2 = document.querySelector('.spreadsheet-container') as HTMLElement;
                    if (spreadsheetWrap2) {
                      const wr = spreadsheetWrap2.getBoundingClientRect();
                      const er = textarea.getBoundingClientRect();
                      const mw = Math.max(150, wr.right - er.left - 12);
                      textarea.style.maxWidth = mw + 'px';
                      textarea.style.width = 'auto';
                    }
                  }
                }
              }
            }
            // Set formula bar to reflect the new formula
            setFormulaBarValue(newFormula);
            formulaValueRef.current = newFormula;
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
        // Bug #3 fix: formula bar + merge info moved from afterSelection to here (only on mouse release)
        if (!isAppendingRangeRef.current) {
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
        }
        const mc = hotRef.current?.getPlugin('mergeCells');
        if (mc) {
          const mergedParent = (mc as any).mergedCellsCollection?.get(_r, _c);
          setIsMerged(!!mergedParent);
        }
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
              mode: 'ready', zoom: zoomRef.current,
              selectionCount: nonEmptyCount,
              selectionSum: nums.length > 0 ? sum : undefined,
              selectionAvg: nums.length > 0 ? sum / nums.length : undefined,
            });
          } else {
            setStatusInfo({ mode: 'ready', zoom: zoomRef.current });
          }
        } else {
          setStatusInfo({ mode: 'ready', zoom: zoomRef.current });
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
          return;
        }
        // Use the editor API instead of reading TEXTAREA directly (avoids DOM coupling)
        const val: string = activeEditor.getValue?.() || '';

        // Step 1: Excel DE behavior — auto-convert ',' to ';' in formulas
        if (e.key === ',' && val.startsWith('=')) {
          const textarea = activeEditor.TEXTAREA;
          const cursorPos = textarea.selectionStart ?? 0;
          // Bug #18.1 fix: only convert comma outside of quoted strings
          const textBefore = val.substring(0, cursorPos);
          const quoteCount = (textBefore.match(/"/g) || []).length;
          if (quoteCount % 2 === 0) {
            const newVal = val.substring(0, cursorPos - 1) + ';' + val.substring(cursorPos);
            activeEditor.setValue(newVal);
            textarea.focus();
            textarea.selectionStart = cursorPos;
            textarea.selectionEnd = cursorPos;
            setFormulaBarValue(newVal);
            formulaValueRef.current = newVal;
          }
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
              const found = EXCEL_FUNCTIONS_DE.find(f => f.name === fnName);
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

        } else {
          setFuncTooltip(null); // Step 2b: hide tooltip when not a formula
        }
      },

      afterChange(changes: any, source: string) {
        // Step 3: clear function ScreenTip when editing finishes
        if (source !== 'loadData') setFuncTooltip(null);

        // Bug #1.1 fix: beforeChange now returns false to cancel the commit,
        // so afterChange should never fire with isRangeSelecting=true.
        // Keep as safety net in case of unexpected event ordering.
        if (isRangeSelecting.current) {
          isRangeSelecting.current = false;
          return;
        }

        // Bug #1.2 fix: also skip changes from programmatic setDataAtCell calls
        // Bug #16 fix: also skip 'auto' (HyperFormula recalculation), 'dateFix',
        // 'contextmenuCopyPaste', 'skipTheme' and other internal sources
        const SKIP_SOURCES = ['loadData', 'internalUpdate', 'auto',
          'dateFix', 'contextmenuCopyPaste', 'skipTheme'];
        if (!changes || SKIP_SOURCES.includes(source) || internalChangeDepth.current > 0) {
          // Clear format history on full data reload (sheet switch, etc.)
          if (source === 'loadData') {
            formatHistoryRef.current = [];
            formatHistoryPosRef.current = -1;
          }
          return;
        }

        // Bug #16 fix: skip if no actual value changed (pure recalculation with same result)
        const hasRealChange = changes.some(([,, oldVal, newVal]: any[]) => oldVal !== newVal);
        if (!hasRealChange) return;
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
        internalChangeDepth.current++;
        onChange(nd);
        // Bug fix: force HyperFormula recalculation when new values contain formulas.
        // Without this, programmatic setDataAtCell with formula strings may not trigger
        // HF evaluation through the Handsontable pipeline.
        const hasFormula = changes.some(([, , , newVal]: any[]) =>
          typeof newVal === 'string' && newVal.startsWith('=')
        );
        if (hasFormula) {
          const hf = hfRef.current;
          if (hf) {
            try { hf.rebuildAndRecalculate(); } catch { /* ignore */ }
          }
        }
        // Defer reset to protect against async React re-render cycle
        setTimeout(() => {
          if (internalChangeDepth.current > 0) internalChangeDepth.current--;
        }, 100);
        const lastChange = changes[changes.length - 1];
        if (lastChange && !isSyncingFormulaRef.current) {
          setFormulaBarValue(lastChange[3] ?? '');
        }

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

        // Copy native cell metadata (existing logic)
        const srcRows = srcToRow - srcFromRow + 1;
        const srcCols = srcToCol - srcFromCol + 1;
        for (let r = 0; r <= tgtToRow - tgtFromRow; r++) {
          for (let c = 0; c <= tgtToCol - tgtFromCol; c++) {
            const srcRow = srcFromRow + (r % srcRows);
            const srcCol = srcFromCol + (c % srcCols);
            const srcMeta = hot.getCellMeta(srcRow, srcCol) as any;
            if (srcMeta?.customFormat) {
              hot.setCellMeta(tgtFromRow + r, tgtFromCol + c, 'customFormat', { ...srcMeta.customFormat });
            }
            // Bug #29 fix: also copy data validation metadata on autofill
            if (srcMeta?.validator) {
              hot.setCellMeta(tgtFromRow + r, tgtFromCol + c, 'validator', srcMeta.validator);
            }
            if (srcMeta?.source) {
              hot.setCellMeta(tgtFromRow + r, tgtFromCol + c, 'source', srcMeta.source);
            }
            if (srcMeta?.type) {
              hot.setCellMeta(tgtFromRow + r, tgtFromCol + c, 'type', srcMeta.type);
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
        if (internalChangeDepth.current > 0) return; // Block during internal operations
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
        if (internalChangeDepth.current > 0) return; // Block during internal operations
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
        if (internalChangeDepth.current > 0) return; // Block during internal operations
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
        // Bug #5.2 fix: shift condRules and validationRules when columns are inserted
        setCondRules(prev => prev.map(rule => ({
          ...rule,
          col: rule.col >= col ? rule.col + amount : rule.col
        })));
        setValidationRules(prev => prev.map(rule => ({
          ...rule,
          col: rule.col >= col ? rule.col + amount : rule.col
        })));
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
        if (internalChangeDepth.current > 0) return; // Block during internal operations
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
        // Bug #5.2 fix: shift condRules and validationRules when columns are removed
        setCondRules(prev => prev
          .filter(rule => !(rule.col >= col && rule.col < col + amount))
          .map(rule => ({
            ...rule,
            col: rule.col > col ? rule.col - amount : rule.col
          }))
        );
        setValidationRules(prev => prev
          .filter(rule => !(rule.col >= col && rule.col < col + amount))
          .map(rule => ({
            ...rule,
            col: rule.col > col ? rule.col - amount : rule.col
          }))
        );
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
      // Bug #2.1 fix: clear all timers to prevent setState on unmounted component
      if (practiceTimerRef.current) clearTimeout(practiceTimerRef.current);
      if (formulaRafRef.current) cancelAnimationFrame(formulaRafRef.current);
      if (rangeSafetyTimer1Ref.current) clearTimeout(rangeSafetyTimer1Ref.current);
      if (rangeSafetyTimer2Ref.current) clearTimeout(rangeSafetyTimer2Ref.current);
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
    if (!isFormulaEditingRef.current || isSyncingFormulaRef.current) return;
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    const activeEditor = hot.getActiveEditor() as any;
    if (!activeEditor || !activeEditor.isOpened()) return;
    if (activeEditor.getValue() === formulaBarValue) return;
    isSyncingFormulaRef.current = true;
    const ta = activeEditor.TEXTAREA;
    const selStart = ta?.selectionStart ?? formulaBarValue.length;
    const selEnd = ta?.selectionEnd ?? selStart;
    activeEditor.setValue(formulaBarValue);
    if (ta) {
      const clampedStart = Math.min(selStart, formulaBarValue.length);
      const clampedEnd = Math.min(selEnd, formulaBarValue.length);
      ta.selectionStart = clampedStart;
      ta.selectionEnd = clampedEnd;
    }
    isSyncingFormulaRef.current = false;
  }, [formulaBarValue]);

  // Bug #16 fix: use signature-based comparison to detect true parent-driven data changes,
  // avoiding false reloads caused by HyperFormula recalculation or afterChange divergences
  // Sync data changes to Handsontable — compare source data to avoid reload on user edits
  useEffect(() => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;
    // Bug #33 fix: normalize all rows to the same column count before loadData.
    // Handsontable's loadData silently truncates values when rows have different
    // lengths (e.g., headers=3 cols but user edited column E making a row 5 cols).
    // Padding all rows to uniform width prevents data loss.
    const headerRow = headers.map(h => h);
    const dataRows = data.map(row => Array.from(row, cell => (cell === null || cell === undefined ? '' : cell)));
    const maxCols = Math.max(headerRow.length, ...dataRows.map(r => r.length));
    const padRow = (row: any[]) => {
      if (row.length >= maxCols) return row;
      return [...row, ...Array(maxCols - row.length).fill('')];
    };
    const targetData = [padRow(headerRow), ...dataRows.map(padRow)];
    const signature = JSON.stringify(targetData);
    // Only reload if the data signature truly changed vs. what we last loaded
    if (signature !== lastLoadedDataRef.current) {
      lastLoadedDataRef.current = signature;
      internalChangeDepth.current++;
      hot.loadData(targetData);
      setTimeout(() => {
        if (internalChangeDepth.current > 0) internalChangeDepth.current--;
      }, 100);
    } else {
      console.log('[SS] ✅ signature MATCHED, skipping reload');
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
      // Bug #7.1 fix: Ctrl+Shift+L toggles filter dropdown arrows (not just empty filter)
      else if (ctrl && e.shiftKey && e.code === 'KeyL') { e.preventDefault(); handleFilter(); }
      // Ctrl+Space: Select entire column (use ref to avoid stale activeCell)
      else if (ctrl && !e.shiftKey && e.key === ' ') { e.preventDefault(); const hot = hotRef.current; const ac = activeCellRef.current; if (hot && ac) hot.selectColumns(ac.col); }
      // Shift+Space: Select entire row
      else if (!ctrl && e.shiftKey && e.key === ' ') { e.preventDefault(); const hot = hotRef.current; const ac = activeCellRef.current; if (hot && ac) hot.selectRows(ac.row); }
      // Ctrl+1: Open Format Cells dialog (BUG 11: ensure shift not pressed)
      else if (ctrl && !e.shiftKey && e.key === '1') { e.preventDefault(); setShowFormatCellsDialog(true); }
      // Ctrl+D: Fill down — use Copy/Paste plugin so HyperFormula adjusts relative references
      else if (ctrl && e.key === 'd') {
        e.preventDefault();
        e.stopImmediatePropagation(); // Bug #16.1: prevent browser bookmark shortcut
        const hot = hotRef.current;
        const sr = selectedRangeRef.current;
        if (hot && sr && sr.startRow > 0 && sr.endRow > sr.startRow) {
          // Bug #2 fix: use native Copy/Paste instead of populateFromArray
          // so HyperFormula adjusts relative references (e.g. =A1 → =A2)
          hot.selectCell(sr.startRow, sr.startCol, sr.startRow, sr.endCol);
          (hot.getPlugin('copyPaste') as any).copy();
          hot.selectCell(sr.startRow + 1, sr.startCol, sr.endRow, sr.endCol);
          (hot.getPlugin('copyPaste') as any).paste();
        }
      }
      // Ctrl+R: Fill right — use Copy/Paste plugin so HyperFormula adjusts relative references
      else if (ctrl && e.key === 'r') {
        e.preventDefault();
        e.stopImmediatePropagation(); // Bug #16.1: prevent browser reload shortcut
        const hot = hotRef.current;
        const sr = selectedRangeRef.current;
        if (hot && sr && sr.endCol > sr.startCol) {
          // Bug #2 fix: use native Copy/Paste instead of populateFromArray
          // so HyperFormula adjusts relative references (e.g. =A1 → =B1)
          hot.selectCell(sr.startRow, sr.startCol, sr.endRow, sr.startCol);
          (hot.getPlugin('copyPaste') as any).copy();
          hot.selectCell(sr.startRow, sr.startCol + 1, sr.endRow, sr.endCol);
          (hot.getPlugin('copyPaste') as any).paste();
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
              const found = EXCEL_FUNCTIONS_DE.find(f => f.name === fnName);
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
      // F4: toggle absolute references — cursor-position-aware
      if (e.key === 'F4') {
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
      internalChangeDepth.current++;
      hot.setDataAtCell(activeCell.row, activeCell.col, val);
      setTimeout(() => {
        if (internalChangeDepth.current > 0) internalChangeDepth.current--;
      }, 100);
    }
  }, [activeCell]);

  // Chart insertion handler
  const handleInsertChart = useCallback((type: 'bar' | 'line' | 'combo', trendlineKey?: string) => {
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
    // For combo: first numeric column = bars, rest = lines
    if (type === 'combo' && headers.length > 2) {
      setChartBarSeries([headers[1]]);
      if (trendlineKey) setChartTrendlineSeries(trendlineKey);
    } else if (trendlineKey) {
      setChartTrendlineSeries(trendlineKey);
      setChartBarSeries(undefined);
    } else {
      setChartBarSeries(undefined);
      setChartTrendlineSeries(undefined);
    }
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

  // Sparkline handler
  const handleInsertSparkline = useCallback((def: {
    type: SparklineDef['type'];
    dataRange: string;
    targetCell: string;
    color?: string;
    negativeColor?: string;
    highPoint?: boolean;
    lowPoint?: boolean;
  }) => {
    const newSparkline: SparklineDef = {
      cell: def.targetCell,
      type: def.type,
      range: def.dataRange,
      color: def.color,
      negativeColor: def.negativeColor,
      highPoint: def.highPoint,
      lowPoint: def.lowPoint,
    };
    setSparklines(prev => {
      const updated = [...prev.filter(s => s.cell !== def.targetCell), newSparkline];
      if (onSparklinesChange) onSparklinesChange(updated);
      return updated;
    });
    hotRef.current?.render();
  }, [onSparklinesChange]);

  // Goal Seek: evaluate a formula with a trial variable value using HyperFormula
  const handleGoalSeekEvaluate = useCallback((formulaCell: string, variableCell: string, trialValue: number): number => {
    const hf = hfRef.current;
    const hot = hotRef.current;
    if (!hf || !hot || hot.isDestroyed) return NaN;

    try {
      const activeSheetId = 0; // Use sheet 0 for now

      // Parse cell references
      const fcMatch = formulaCell.match(/^([A-Z]+)(\d+)$/i);
      const vcMatch = variableCell.match(/^([A-Z]+)(\d+)$/i);
      if (!fcMatch || !vcMatch) return NaN;

      const fcCol = sparkColToIdx(fcMatch[1]);
      const fcRow = parseInt(fcMatch[2], 10) - 1;
      const vcCol = sparkColToIdx(vcMatch[1]);
      const vcRow = parseInt(vcMatch[2], 10) - 1;

      // Get the formula from the formula cell
      const formula = hot.getSourceDataAtCell(fcRow, fcCol);
      if (typeof formula !== 'string' || !formula.startsWith('=')) return NaN;

      // Temporarily set the variable cell value in HF
      const vcRef = positionToRef({ row: vcRow, col: vcCol });
      const fcRef = positionToRef({ row: fcRow, col: fcCol });

      // Set the trial value
      hf.setCellContents({ sheet: activeSheetId, row: vcRow, col: vcCol }, [[trialValue]]);

      // Evaluate the formula cell
      const result = hf.getCellValue({ sheet: activeSheetId, row: fcRow, col: fcCol });

      // Restore original value from source data (dataRef excludes headers, so offset by 1)
      const originalVal = dataRef.current[vcRow - 1]?.[vcCol];
      hf.setCellContents({ sheet: activeSheetId, row: vcRow, col: vcCol }, [[originalVal ?? null]]);

      if (typeof result === 'number' && isFinite(result)) {
        return result;
      }
      return NaN;
    } catch {
      return NaN;
    }
  }, []);

  // Goal Seek: apply result to variable cell
  const handleGoalSeekResult = useCallback((variableCell: string, result: number) => {
    const hot = hotRef.current;
    if (!hot || hot.isDestroyed) return;

    const vcMatch = variableCell.match(/^([A-Z]+)(\d+)$/i);
    if (!vcMatch) return;
    const vcCol = sparkColToIdx(vcMatch[1]);
    const vcRow = parseInt(vcMatch[2], 10) - 1;

    hot.setDataAtCell(vcRow, vcCol, result, 'internalUpdate');
  }, []);

  // AutoSum handler — extracted from keyboard shortcut for ribbon button use
  const handleAutoSum = useCallback((type?: 'sum' | 'avg' | 'count' | 'max' | 'min' | 'fx') => {
    // Bug #19.3 fix: 'fx' starts formula editing mode instead of inserting SUMME
    if (type === 'fx') {
      const hot = hotRef.current;
      const ac = activeCellRef.current;
      if (!hot || hot.isDestroyed || !ac) return;
      hot.selectCell(ac.row, ac.col);
      const editor = hot.getActiveEditor() as any;
      if (editor) {
        editor.beginEditing('=');
        const ta = editor.TEXTAREA;
        if (ta) { ta.focus(); ta.selectionStart = 1; ta.selectionEnd = 1; }
      }
      return;
    }
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
      // Bug #3.3 fix: Excel SUM skips text/empty, continues scanning upward;
      // only stops on truly blank cells (null/undefined) in a contiguous block
      if (val === null || val === undefined || val === '') {
        if (upStart !== null) break; // gap after data → stop
        continue; // leading empty → keep scanning
      }
      if (typeof val !== 'number' && isNaN(parseFloat(val as string))) {
        if (upStart !== null) break; // text after data → stop
        continue; // leading text → skip, keep scanning
      }
      upStart = r;
    }
    if (upStart !== null) {
      hot.setDataAtCell(row, col, `=${fnName}(${colLetter}${upStart + 1}:${colLetter}${row + 1})`);
    } else {
      let leftStart: number | null = null;
      for (let c = col - 1; c >= 0; c--) {
        const val = hot.getDataAtCell(row, c) as string | number | null;
        // Bug #3.3 fix: same contiguous-block logic as vertical scan
        if (val === null || val === undefined || val === '') {
          if (leftStart !== null) break;
          continue;
        }
        if (typeof val !== 'number' && isNaN(parseFloat(val as string))) {
          if (leftStart !== null) break;
          continue;
        }
        leftStart = c;
      }
      if (leftStart !== null) {
        const leftLetter = colToLetter(leftStart);
        hot.setDataAtCell(row, col, `=${fnName}(${leftLetter}${row + 1}:${colLetter}${row + 1})`);
      } else {
        // Step 2 fix: Excel behavior — no adjacent numbers → insert empty function, open editor
        const formula = `=${fnName}()`;
        // Bug #1.2 fix: use source param instead of internalChangeDepth + RAF
        hot.setDataAtCell(row, col, formula, 'internalUpdate');
        requestAnimationFrame(() => {
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
          onInsertTable={() => handleContextMenuAction('formatAsTable')}
          onDataValidation={() => setShowValidationDialog(true)}
          onPivotTable={handleOpenPivot}
          onSparkline={() => setShowSparklineDialog(true)}
          onGoalSeek={() => setShowGoalSeekDialog(true)}
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
          selectedRange={selectedRange}
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
      {/* Step 4: Function ScreenTip — floating syntax hint with argument highlight
      {funcTooltip && (
        <div style={{
          position: 'fixed', zIndex: 601, left: funcTooltip.x, top: funcTooltip.y,
          background: '#fff', border: '1px solid #c0c0c0', borderRadius: 4,
          padding: '4px 10px', fontFamily: "'Segoe UI', system-ui, sans-serif",
          fontSize: '0.78rem', color: '#333', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }} dangerouslySetInnerHTML={{ __html: funcTooltip.html }} />
      )}
      */}
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
        barSeries={chartBarSeries}
        trendlineSeries={chartTrendlineSeries}
        onClose={() => setShowChartDialog(false)}
      />
      {/* Sparkline Dialog */}
      <SparklineDialog
        isOpen={showSparklineDialog}
        selectedRange={selectedRange ? rangeToRef(selectedRange) : ''}
        onClose={() => setShowSparklineDialog(false)}
        onInsert={handleInsertSparkline}
      />
      {/* Goal Seek Dialog */}
      <GoalSeekDialog
        isOpen={showGoalSeekDialog}
        evaluate={handleGoalSeekEvaluate}
        onResult={handleGoalSeekResult}
        onClose={() => setShowGoalSeekDialog(false)}
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
