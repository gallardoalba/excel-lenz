// ── ExcelRibbon: Modern Excel 365-style ribbon ──────────────────────────────
// Custom React ribbon replacing Handsontable's built-in toolbar
// that looks and behaves like real Excel.

import { useState, useCallback, useEffect, useRef } from 'react';
import type { RibbonTabId, CellFormat } from './types';

interface ExcelRibbonProps {
  activeFormat: CellFormat;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onFormatChange: (format: Partial<CellFormat>) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFreeze?: (type: 'row' | 'column' | 'both' | 'none') => void;
  onConditionalFormat?: () => void;
  onAutoSum?: (type?: 'sum' | 'avg' | 'count' | 'max' | 'min' | 'fx') => void;
  onInsertChart?: (type: 'bar' | 'line') => void;
  onDataValidation?: () => void;
  onPivotTable?: () => void;
  onExport?: () => void;
  // Exam mode
  examTimeString?: string;
  isExamUrgent?: boolean;
  onMerge?: () => void;
  onInsertRow?: () => void;
  onDeleteRow?: () => void;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  onSave?: () => void;
  onSort?: (dir: 'asc' | 'desc') => void;
  onFilter?: () => void;
  onFormatPainter?: () => void;
  isFormatPainterActive?: boolean;
  isMergeActive?: boolean;
  selectedRange?: { startRow: number; startCol: number; endRow: number; endCol: number } | null;
}

type TabDef = { id: RibbonTabId; label: string };

const TABS: TabDef[] = [
  { id: 'start', label: 'Start' },
  { id: 'insert', label: 'Einfügen' },
  { id: 'pageLayout', label: 'Seitenlayout' },
  { id: 'formulas', label: 'Formeln' },
  { id: 'data', label: 'Daten' },
  { id: 'review', label: 'Überprüfen' },
  { id: 'view', label: 'Ansicht' },
];

const FONTS = ['Calibri', 'Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia'];
const FONT_SIZES = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '36', '48', '72'];

const COLORS = [
  '#000000', '#ffffff', '#ff0000', '#ff6600', '#ffff00', '#00ff00',
  '#00ffff', '#0000ff', '#ff00ff', '#800000', '#008000', '#000080',
  '#808000', '#800080', '#008080', '#c0c0c0', '#808080', '#999999',
  '#ffcc00', '#cc3366', '#339966', '#003366', '#996633', '#663399',
];

const NUMBER_FORMATS: { label: string; value: string }[] = [
  { label: 'Standard', value: 'General' },
  { label: 'Zahl', value: '#,##0.00' },
  { label: 'Währung', value: '#,##0.00 €' },
  { label: 'Prozent', value: '0%' },
  { label: 'Datum', value: 'DD.MM.YYYY' },
  { label: 'Text', value: '@' },
];

export default function ExcelRibbon({
  activeFormat,
  canUndo,
  canRedo,
  zoom,
  onFormatChange,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFreeze,
  onConditionalFormat,
  onAutoSum,
  onInsertChart,
  onDataValidation,
  onPivotTable,
  onExport,
  examTimeString,
  isExamUrgent,
  onMerge,
  onInsertRow,
  onDeleteRow,
  onCopy,
  onCut,
  onPaste,
  onSave,
  onSort,
  onFilter,
  onFormatPainter,
  isFormatPainterActive,
  isMergeActive,
  selectedRange,
}: ExcelRibbonProps) {
  const [activeTab, setActiveTab] = useState<RibbonTabId>('start');
  const [showFontColor, setShowFontColor] = useState(false);
  const [showFillColor, setShowFillColor] = useState(false);
  const [showFontList, setShowFontList] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showNumberFormat, setShowNumberFormat] = useState(false);
  const [showBorderMenu, setShowBorderMenu] = useState(false);
  const [showAutoSum, setShowAutoSum] = useState(false);
  const [showCondFormatMenu, setShowCondFormatMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ribbonRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside the ribbon
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ribbonRef.current && !ribbonRef.current.contains(e.target as Node)) {
        setShowFontColor(false);
        setShowFillColor(false);
        setShowFontList(false);
        setShowFontSize(false);
        setShowNumberFormat(false);
        setShowBorderMenu(false);
        setShowAutoSum(false);
        setShowCondFormatMenu(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleBold = useCallback(() => onFormatChange({ bold: !activeFormat.bold }), [activeFormat.bold, onFormatChange]);
  const toggleItalic = useCallback(() => onFormatChange({ italic: !activeFormat.italic }), [activeFormat.italic, onFormatChange]);
  const toggleUnderline = useCallback(() => onFormatChange({ underline: !activeFormat.underline }), [activeFormat.underline, onFormatChange]);
  const setAlign = useCallback((h: CellFormat['hAlign']) => onFormatChange({ hAlign: h }), [onFormatChange]);

  // Open a specific dropdown menu (closes all others to prevent overlap)
  const openMenu = (menu: 'fontColor' | 'fillColor' | 'fontList' | 'fontSize' | 'numberFormat' | 'border' | 'autoSum' | 'condFormat') => {
    setShowFontColor(menu === 'fontColor');
    setShowFillColor(menu === 'fillColor');
    setShowFontList(menu === 'fontList');
    setShowFontSize(menu === 'fontSize');
    setShowNumberFormat(menu === 'numberFormat');
    setShowBorderMenu(menu === 'border');
    setShowAutoSum(menu === 'autoSum');
    setShowCondFormatMenu(menu === 'condFormat');
  };

  return (
    <div className="excel-ribbon" ref={ribbonRef}>
      {/* ═══════════ GREEN TITLE BAR ═══════════ */}
      <div className="ribbon-titlebar">
        {/* Quick Access Toolbar */}
        <div className="ribbon-qat">
          <button className="qat-btn" title="Exportieren" aria-label="Exportieren" onClick={() => onSave?.()}><DownloadIcon /></button>
          <button className="qat-btn" onClick={onUndo} disabled={!canUndo} title="Rückgängig (Strg+Z)" aria-label="Rückgängig"><UndoIcon /></button>
          <button className="qat-btn" onClick={onRedo} disabled={!canRedo} title="Wiederholen (Strg+Y)" aria-label="Wiederholen"><RedoIcon /></button>
        </div>

        {/* Tabs — visible on desktop */}
        <div className="ribbon-tabs ribbon-tabs-desktop">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`ribbon-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                if (isCollapsed) setIsCollapsed(false); // Bug #21.2: expand on single click
              }}
              onDoubleClick={() => setIsCollapsed(c => !c)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile hamburger menu */}
        <button
          className="ribbon-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Menü schliessen' : 'Menü öffnen'}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className="ribbon-titlebar-right">
          {examTimeString && (
            <div className={`exam-timer ${isExamUrgent ? 'exam-timer--urgent' : ''}`}>
              ⏱ {examTimeString}
            </div>
          )}
          <span className="ribbon-app-title">Excel-lenz</span>
        </div>
      </div>

      {/* Mobile tab dropdown */}
      {mobileMenuOpen && (
        <div className="ribbon-mobile-menu">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`ribbon-mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ═══════════ RIBBON CONTENT ═══════════ */}
      {!isCollapsed && (
      <div className="ribbon-content">
        {activeTab === 'start' && (
          <div className="ribbon-groups">
            {/* ── Clipboard ── */}
            <RibbonGroupBox label="Zwischenablage">
              <div className="ribbon-group-row">
                <RibbonBtn icon={<PasteIcon />} label="Einfügen" w={52} onClick={() => onPaste?.()} />
                <RibbonBtn icon={<CutIcon />} label="Ausschneiden" w={52} onClick={() => onCut?.()} />
                <RibbonBtn icon={<CopyIcon />} label="Kopieren" w={48} onClick={() => onCopy?.()} />
                <RibbonBtn icon={<FormatPainterIcon />} label="Format übertragen" w={52} onClick={() => onFormatPainter?.()} active={isFormatPainterActive} />
              </div>
            </RibbonGroupBox>

            <RibbonSeparator />

            {/* ── Font ── */}
            <RibbonGroupBox label="Schriftart">
              <div className="ribbon-group-row">
                {/* Font family dropdown */}
                <div className="ribbon-dropdown-wrap" style={{ width: 110 }}>
                  <button className="ribbon-dropdown-btn" onClick={() => openMenu('fontList')}>
                    <span>{activeFormat.fontFamily || 'Calibri'}</span>
                    <span className="ribbon-chevron">▼</span>
                  </button>
                  {showFontList && (
                    <div className="ribbon-dropdown-menu font-list-menu">
                      {FONTS.map(f => (
                        <button key={f} className="ribbon-dropdown-item" style={{ fontFamily: f }}
                          onClick={() => { onFormatChange({ fontFamily: f }); setShowFontList(false); }}>
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Font size dropdown */}
                <div className="ribbon-dropdown-wrap" style={{ width: 52 }}>
                  <button className="ribbon-dropdown-btn" onClick={() => openMenu('fontSize')}>
                    <span>{activeFormat.fontSize || 11}</span>
                    <span className="ribbon-chevron">▼</span>
                  </button>
                  {showFontSize && (
                    <div className="ribbon-dropdown-menu font-size-menu">
                      {FONT_SIZES.map(s => (
                        <button key={s} className="ribbon-dropdown-item"
                          onClick={() => { onFormatChange({ fontSize: parseInt(s) }); setShowFontSize(false); }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ribbon-font-inc">
                  <button onClick={() => onFormatChange({ fontSize: Math.max(1, (activeFormat.fontSize || 11) - 1) })} title="Schriftgrad verkleinern"><FontDecIcon /></button>
                  <button onClick={() => onFormatChange({ fontSize: Math.min(409, (activeFormat.fontSize || 11) + 1) })} title="Schriftgrad vergrößern"><FontIncIcon /></button>
                </div>
              </div>
              <div className="ribbon-group-row" style={{ marginTop: 4 }}>
                <ToggleBtn icon={<BoldIcon />} active={!!activeFormat.bold} onClick={toggleBold} title="Fett (Strg+B)" />
                <ToggleBtn icon={<ItalicIcon />} active={!!activeFormat.italic} onClick={toggleItalic} title="Kursiv (Strg+I)" />
                <ToggleBtn icon={<UnderlineIcon />} active={!!activeFormat.underline} onClick={toggleUnderline} title="Unterstrichen (Strg+U)" />
                <div className="ribbon-color-wrap">
                  <ToggleBtn icon={<BorderIcon />} active={!!activeFormat.borderBottom} onClick={() => openMenu('border')} title="Rahmen" />
                  {showBorderMenu && (
                    <div className="ribbon-dropdown-menu" style={{ minWidth: 140 }}>
                      <button className="ribbon-dropdown-item" onClick={() => { onFormatChange({ borderTop: undefined, borderRight: undefined, borderBottom: undefined, borderLeft: undefined }); setShowBorderMenu(false); }}>Kein Rahmen</button>
                      <button className="ribbon-dropdown-item" onClick={() => { onFormatChange({ borderBottom: '1px solid #333' }); setShowBorderMenu(false); }}>▁ Unterer Rahmen</button>
                      <button className="ribbon-dropdown-item" onClick={() => { onFormatChange({ borderTop: '1px solid #333' }); setShowBorderMenu(false); }}>▔ Oberer Rahmen</button>
                      <button className="ribbon-dropdown-item" onClick={() => { onFormatChange({ borderLeft: '1px solid #333' }); setShowBorderMenu(false); }}>▏ Linker Rahmen</button>
                      <button className="ribbon-dropdown-item" onClick={() => { onFormatChange({ borderRight: '1px solid #333' }); setShowBorderMenu(false); }}>▕ Rechter Rahmen</button>
                      <button className="ribbon-dropdown-item" onClick={() => { onFormatChange({ borderTop: '1px solid #333', borderRight: '1px solid #333', borderBottom: '1px solid #333', borderLeft: '1px solid #333' }); setShowBorderMenu(false); }}>▣ Alle Rahmen</button>
                    </div>
                  )}
                </div>
                <div className="ribbon-mini-sep" />
                {/* Font Color */}
                <div className="ribbon-color-wrap">
                  <SplitColorBtn
                    icon="A"
                    color={activeFormat.fontColor || '#000000'}
                    onClick={() => openMenu('fontColor')}
                    title="Schriftfarbe"
                  />
                  {showFontColor && (
                    <ColorGrid colors={COLORS} currentColor={activeFormat.fontColor} onPick={c => { onFormatChange({ fontColor: c }); setShowFontColor(false); }}
                      onNone={() => { onFormatChange({ fontColor: undefined }); setShowFontColor(false); }} />
                  )}
                </div>
                {/* Fill Color */}
                <div className="ribbon-color-wrap">
                  <SplitColorBtn
                    icon={<FillIcon />}
                    color={activeFormat.bgColor || '#ffffff'}
                    onClick={() => openMenu('fillColor')}
                    title="Füllfarbe"
                  />
                  {showFillColor && (
                    <ColorGrid colors={COLORS} currentColor={activeFormat.bgColor} onPick={c => { onFormatChange({ bgColor: c }); setShowFillColor(false); }}
                      onNone={() => { onFormatChange({ bgColor: undefined }); setShowFillColor(false); }} />
                  )}
                </div>
              </div>
            </RibbonGroupBox>

            <RibbonSeparator />

            {/* ── Alignment ── */}
            <RibbonGroupBox label="Ausrichtung">
              <div className="ribbon-group-row">
                <ToggleBtn icon={<AlignLeftIcon />} active={activeFormat.hAlign === 'left'} onClick={() => setAlign('left')} title="Linksbündig" />
                <ToggleBtn icon={<AlignCenterIcon />} active={activeFormat.hAlign === 'center'} onClick={() => setAlign('center')} title="Zentriert" />
                <ToggleBtn icon={<AlignRightIcon />} active={activeFormat.hAlign === 'right'} onClick={() => setAlign('right')} title="Rechtsbündig" />
                <ToggleBtn icon="⊤" active={activeFormat.vAlign === 'top'} onClick={() => onFormatChange({ vAlign: 'top' })} title="Oben" />
                <ToggleBtn icon="⊟" active={activeFormat.vAlign === 'middle' || !activeFormat.vAlign} onClick={() => onFormatChange({ vAlign: 'middle' })} title="Mittig" />
                <ToggleBtn icon="⊥" active={activeFormat.vAlign === 'bottom'} onClick={() => onFormatChange({ vAlign: 'bottom' })} title="Unten" />
              </div>
              <div className="ribbon-group-row" style={{ marginTop: 4 }}>
                <ToggleBtn icon={<MergeIcon />} active={isMergeActive || false} onClick={() => onMerge?.()} title="Verbinden und zentrieren" />
                <ToggleBtn icon={<WrapIcon />} active={!!activeFormat.textWrap} onClick={() => onFormatChange({ textWrap: !activeFormat.textWrap })} title="Zeilenumbruch" />
              </div>
            </RibbonGroupBox>

            <RibbonSeparator />

            {/* ── Number ── */}
            <RibbonGroupBox label="Zahl">
              <div className="ribbon-dropdown-wrap" style={{ width: 95 }}>
                <button className="ribbon-dropdown-btn" onClick={() => openMenu('numberFormat')}>
                  <span>{NUMBER_FORMATS.find(f => f.value === (activeFormat.numberFormat || 'General'))?.label || 'Standard'}</span>
                  <span className="ribbon-chevron">▼</span>
                </button>
                {showNumberFormat && (
                  <div className="ribbon-dropdown-menu" style={{ width: 100 }}>
                    {NUMBER_FORMATS.map(f => (
                      <button key={f.value} className="ribbon-dropdown-item"
                        onClick={() => { onFormatChange({ numberFormat: f.value }); setShowNumberFormat(false); }}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="ribbon-group-row" style={{ marginTop: 4 }}>
                <SmallBtn icon="%" onClick={() => onFormatChange({ numberFormat: '0%' })} title="Prozent" />
                <SmallBtn icon="₀₀₀" onClick={() => onFormatChange({ numberFormat: '#,##0.00' })} title="Tausendertrennzeichen" />
                <SmallBtn icon=".0+" onClick={() => {
                  let f = activeFormat.numberFormat || '';
                  if (!f || f === 'General' || f === '@') f = '0';
                  // Bug #3.2 fix: handle percentage formats (0% → 0.0%, not 0%.0)
                  if (f === '0%') onFormatChange({ numberFormat: '0.0%' });
                  else if (f.endsWith('%')) onFormatChange({ numberFormat: f.replace(/%$/, '0%') });
                  else if (!f.includes('.')) onFormatChange({ numberFormat: f + '.0' });
                  else onFormatChange({ numberFormat: f + '0' });
                }} title="Dezimalstelle hinzufügen" />
                <SmallBtn icon=".0−" onClick={() => {
                  let f = activeFormat.numberFormat || '0.00';
                  if (f === 'General' || !f.includes('.')) return;
                  // Bug #3.2 fix: handle percentage formats (0.0% → 0%)
                  if (f.endsWith('%')) {
                    const pctPart = f.slice(0, -1);
                    let newPct = pctPart.slice(0, -1);
                    if (newPct.endsWith('.')) newPct = newPct.slice(0, -1);
                    onFormatChange({ numberFormat: newPct + '%' });
                    return;
                  }
                  // Bug #23 fix: handle currency/number with suffixes (€, $, spaces)
                  // Remove last digit/char that is part of the decimal pattern
                  const match = f.match(/^(.+?)(\s*[€$]?\s*)$/);
                  if (match) {
                    let numPart = match[1];
                    const suffix = match[2];
                    let newNum = numPart.slice(0, -1);
                    if (newNum.endsWith('.')) newNum = newNum.slice(0, -1);
                    onFormatChange({ numberFormat: (newNum + suffix) || '0' });
                  } else {
                    let newF = f.slice(0, -1);
                    if (newF.endsWith('.')) newF = newF.slice(0, -1);
                    onFormatChange({ numberFormat: newF || '0' });
                  }
                }} title="Dezimalstelle löschen" />
              </div>
            </RibbonGroupBox>

            <RibbonSeparator />

            {/* ── Bearbeiten ── */}
            <RibbonGroupBox label="Bearbeiten">
              <div className="ribbon-group-row">
                <div className="ribbon-color-wrap">
                  <div className="ribbon-split-btn-group">
                    <button className="ribbon-split-btn-main" title="AutoSumme" onClick={() => onAutoSum?.()}><SumIcon /></button>
                    <button className="ribbon-split-btn-arrow" title="Weitere Funktionen" onClick={() => openMenu('autoSum')}>▾</button>
                  </div>
                  {showAutoSum && (
                    <div className="ribbon-dropdown-menu" style={{ minWidth: 130 }}>
                      <button className="ribbon-dropdown-item" onClick={() => { onAutoSum?.(); setShowAutoSum(false); }}>SUMME</button>
                      <button className="ribbon-dropdown-item" onClick={() => { onAutoSum?.('avg'); setShowAutoSum(false); }}>MITTELWERT</button>
                      <button className="ribbon-dropdown-item" onClick={() => { onAutoSum?.('count'); setShowAutoSum(false); }}>ANZAHL</button>
                      <button className="ribbon-dropdown-item" onClick={() => { onAutoSum?.('max'); setShowAutoSum(false); }}>MAX</button>
                      <button className="ribbon-dropdown-item" onClick={() => { onAutoSum?.('min'); setShowAutoSum(false); }}>MIN</button>
                    </div>
                  )}
                </div>
                <RibbonBtn icon={<CondFormatIcon />} label="Bedingt" w={40} h={28} onClick={() => onConditionalFormat?.()} />
                <RibbonBtn icon={<UndoIcon />} label="↩" w={28} h={28} onClick={onUndo} />
                <RibbonBtn icon={<RedoIcon />} label="↪" w={28} h={28} onClick={onRedo} />
              </div>
            </RibbonGroupBox>
          </div>
        )}

        {/* ── Insert Tab ── */}
        {activeTab === 'insert' && (
          <div className="ribbon-groups">
            <RibbonGroupBox label="Tabellen">
              <RibbonBtn icon={<TableIcon />} label="Tabelle" w={64} disabled title="Tabellenformatierung nicht verfügbar" />
            </RibbonGroupBox>
            <RibbonSeparator />
            <RibbonGroupBox label="Diagramme">
              <div className="ribbon-group-row">
                <RibbonBtn icon={<ChartIcon />} label="Empfohlen" w={48} h={48} onClick={() => onInsertChart?.('bar')} />
                <RibbonBtn icon={<LineIcon />} label="Linie" w={48} h={48} onClick={() => onInsertChart?.('line')} />
                <RibbonBtn icon={<BarIcon />} label="Balken" w={48} h={48} onClick={() => onInsertChart?.('bar')} />
              </div>
            </RibbonGroupBox>
          </div>
        )}

        {/* ── Page Layout Tab ── */}
        {activeTab === 'pageLayout' && (
          <div className="ribbon-groups">
            <RibbonGroupBox label="Themen">
              <RibbonBtn icon={<ThemeIcon />} label="Themen" w={60} disabled title="Nicht verfügbar" />
            </RibbonGroupBox>
            <RibbonSeparator />
            <RibbonGroupBox label="Seite einrichten">
              <div className="ribbon-group-row">
                <RibbonBtn icon={<MarginsIcon />} label="Seitenränder" w={56} disabled title="Nicht verfügbar" />
                <RibbonBtn icon={<OrientationIcon />} label="Ausrichtung" w={52} disabled title="Nicht verfügbar" />
                <RibbonBtn icon={<SizeIcon />} label="Größe" w={48} disabled title="Nicht verfügbar" />
              </div>
            </RibbonGroupBox>
            <RibbonSeparator />
            <RibbonGroupBox label="An Format anpassen">
              <RibbonBtn icon={<ScaleIcon />} label="Skalierung" w={56} disabled title="Nicht verfügbar" />
            </RibbonGroupBox>
            <RibbonSeparator />
            <RibbonGroupBox label="Blattoptionen">
              <div className="ribbon-group-row">
              <RibbonBtn icon={<GridlinesIcon />} label="Gitternetzlinien" w={64} disabled title="Nicht verfügbar" />
              <RibbonBtn icon={<HeadingsIcon />} label="Überschriften" w={52} disabled title="Nicht verfügbar" />
              </div>
            </RibbonGroupBox>
          </div>
        )}

        {/* ── Formulas Tab ── */}
        {activeTab === 'formulas' && (
          <div className="ribbon-groups">
            <RibbonGroupBox label="Funktionsbibliothek">
              <div className="ribbon-group-row">
                <RibbonBtn icon={<FxIcon />} label="Funktion einfügen" w={64} onClick={() => { onAutoSum?.('fx'); }} />
                <RibbonBtn icon={<SumIcon />} label="AutoSumme ▾" w={60} onClick={() => onAutoSum?.()} />
              </div>
            </RibbonGroupBox>
          </div>
        )}

        {/* ── Data Tab ── */}
        {activeTab === 'data' && (
          <div className="ribbon-groups">
            <RibbonGroupBox label="Sortieren und Filtern">
              <div className="ribbon-group-row">
                <RibbonBtn icon={<SortIcon />} label="A-Z ↑" w={48} onClick={() => onSort?.('asc')} />
                <RibbonBtn icon={<SortDescIcon />} label="Z-A ↓" w={48} onClick={() => onSort?.('desc')} />
                <RibbonBtn icon={<FilterIcon />} label="Filtern" w={48} onClick={() => onFilter?.()} />
              </div>
            </RibbonGroupBox>
            <RibbonSeparator />
            <RibbonGroupBox label="Datentools">
              <div className="ribbon-group-row">
                <RibbonBtn icon={<CheckIcon />} label="Datenüberprüfung" w={64} h={28} onClick={() => onDataValidation?.()} />
                <RibbonBtn icon={<PivotIcon />} label="PivotTable" w={52} h={28} onClick={() => onPivotTable?.()} />
              </div>
            </RibbonGroupBox>
            <RibbonSeparator />
            <RibbonGroupBox label="Export">
              <div className="ribbon-group-row">
                <RibbonBtn icon={<DownloadIcon />} label="XLSX" w={52} h={28} onClick={() => onExport?.()} />
              </div>
            </RibbonGroupBox>
            <RibbonSeparator />
            <RibbonGroupBox label="Zeilen/Spalten">
              <div className="ribbon-group-row">
                <RibbonBtn icon={<InsertIcon />} label="Zeile einfügen" w={56} h={28} onClick={onInsertRow} />
                <RibbonBtn icon={<DeleteIcon />} label="Zeile löschen" w={52} h={28} onClick={onDeleteRow} />
              </div>
            </RibbonGroupBox>
          </div>
        )}

        {/* ── Review Tab ── */}
        {activeTab === 'review' && (
          <div className="ribbon-groups">
            <RibbonGroupBox label="Dokumentprüfung">
              <RibbonBtn icon={<SpellCheckIcon />} label="Rechtschreibung" w={62} disabled title="Nicht verfügbar" />
            </RibbonGroupBox>
            <RibbonSeparator />
            <RibbonGroupBox label="Kommentare">
              <div className="ribbon-group-row">
              <RibbonBtn icon={<CommentIcon />} label="Neuer Kommentar" w={64} disabled title="Nicht verfügbar" />
              <RibbonBtn icon={<DeleteCommentIcon />} label="Löschen" w={52} disabled title="Nicht verfügbar" />
              </div>
            </RibbonGroupBox>
            <RibbonSeparator />
            <RibbonGroupBox label="Schützen">
              <div className="ribbon-group-row">
              <RibbonBtn icon={<ProtectIcon />} label="Blatt schützen" w={56} disabled title="Nicht verfügbar" />
              <RibbonBtn icon={<LockIcon />} label="Arbeitsmappe schützen" w={64} disabled title="Nicht verfügbar" />
              </div>
            </RibbonGroupBox>
          </div>
        )}

        {/* ── View Tab ── */}
        {activeTab === 'view' && (
          <div className="ribbon-groups">
            <RibbonGroupBox label="Arbeitsmappenansicht">
              <div className="ribbon-group-row">
                <RibbonBtn icon={<NormalIcon />} label="Normal" w={48} h={48} active title="Aktuelle Ansicht" />
                <RibbonBtn icon={<PageLayoutIcon />} label="Seitenlayout" w={52} h={48} disabled title="Nicht verfügbar" />
              </div>
            </RibbonGroupBox>
            <RibbonSeparator />
            <RibbonGroupBox label="Fenster einfrieren">
              <div className="ribbon-group-row">
                <RibbonBtn icon={<FreezeIcon />} label="Keine" w={48} h={28} onClick={() => onFreeze?.('none')} />
                <RibbonBtn icon={<FreezeRowIcon />} label="Oberste Zeile" w={56} h={28} onClick={() => onFreeze?.('row')} />
                <RibbonBtn icon={<FreezeColIcon />} label="Erste Spalte" w={56} h={28} onClick={() => onFreeze?.('column')} />
                <RibbonBtn icon={<FreezeBothIcon />} label="Beides" w={48} h={28} onClick={() => onFreeze?.('both')} />
              </div>
            </RibbonGroupBox>
            <RibbonSeparator />
            <RibbonGroupBox label="Zoom">
              <div className="ribbon-group-row">
                <RibbonBtn icon={<ZoomOutIcon />} label="Verkleinern" onClick={onZoomOut} />
                <RibbonBtn icon={<ZoomPercentIcon />} label={`${zoom}%`} w={56} />
                <RibbonBtn icon={<ZoomInIcon />} label="Vergrößern" onClick={onZoomIn} />
              </div>
            </RibbonGroupBox>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

// ── SVG Icons ──────────────────────────────────────────────────────────

function SaveIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4.414a1 1 0 0 0-.293-.707L12.293 1.293A1 1 0 0 0 11.586 1H2zm0 1h3v3H2V2zm4 0h5.586L14 4.414V14H2V6h12v1H6v6h8V8H4v6H2V2zm0 6h3v3H6V8z"/></svg>; }
function UndoIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5 3H2v3h1V4.6A6 6 0 1 1 2 10h1a5 5 0 1 0 2-7.07V3z"/></svg>; }
function RedoIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M11 3h3v3h-1V4.6A6 6 0 1 0 14 10h-1a5 5 0 1 1-2-7.07V3z"/></svg>; }
function BoldIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1h5.5A2.5 2.5 0 0 1 11 3.5 2.5 2.5 0 0 1 8.5 6H4V1H3zm4 5a2.5 2.5 0 0 1 0 5H4V6h3zM4 3v2h4a.5.5 0 0 0 0-1H4zm0 5v2h3a.5.5 0 0 0 0-1H4z"/></svg>; }
function ItalicIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 1h6v1h-2l-3 12h2v1h-6v-1h2l3-12h-2V1z"/></svg>; }
function UnderlineIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4 1v6.5a3.5 3.5 0 0 0 7 0V1h1v6.5a4.5 4.5 0 0 1-9 0V1h1zM2 14h11v1H2v-1z"/></svg>; }
function BorderIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="4" y="4" width="8" height="8" rx="0.3" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5,1.5"/></svg>; }
function FillIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l2 2H3l2-2h3zM3 4h7l-3.5 6L3 4zm3 4l2.5 4 2-3.5L8 11 6 8z"/></svg>; }
function FontColorIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1L5 9h2l.5-1.5h3L11 9h2L10 1H8zm.3 5.5l1-3 1 3H8.3zM2 13h10v1H2v-1z"/></svg>; }
function FormatPainterIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 1a1.5 1.5 0 1 0 0 3H14v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V4H8.5A1.5 1.5 0 0 0 7 5.5V8h5v5.5a1.5 1.5 0 0 1-3 0V9H2v4.5A1.5 1.5 0 0 1 .5 15v-9A2.5 2.5 0 0 1 3 3.5V3a2 2 0 0 1 2-2h6V.5a.5.5 0 0 1 .5-.5h2z"/></svg>; }

function MergeIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="5" height="4" rx="0.5"/><rect x="9" y="3" width="5" height="4" rx="0.5"/><rect x="2" y="9" width="12" height="4" rx="0.5"/></svg>; }
function WrapIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12v2H2V3zm0 4h8v1H2V7zm10 2H2v1h10v1.5l2.5-2L12 8v1z"/></svg>; }
function PasteIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M3.5 2a1.5 1.5 0 1 0 0 3h1v1H3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1.5V5h1a1.5 1.5 0 1 0 0-3h-9zM11 5v1H5V5h6zM3 7h10v6H3V7z"/></svg>; }
function CutIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="4" r="1.5"/><circle cx="3" cy="12" r="1.5"/><path d="M5 4.5 14 11M5 11.5 14 5"/></svg>; }
function CopyIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="1" width="10" height="13" rx="1"/><path d="M2 3v11a1 1 0 0 0 1 1h9M1 5v9a1 1 0 0 0 1 1h7"/></svg>; }
function CondFormatIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="7" height="10" rx="0.5"/><rect x="10" y="6" width="5" height="7" rx="0.5"/><rect x="10" y="3" width="5" height="2" rx="0.5"/></svg>; }
function AlignLeftIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h8v1H2V3zm0 4h12v1H2V7zm0 4h6v1H2v-1zm0 4h10v1H2v-1z"/></svg>; }
function AlignCenterIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 3h8v1H4V3zM2 7h12v1H2V7zm3 4h6v1H5v-1zm1 4h10v1H6v-1z"/></svg>; }
function AlignRightIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 3h8v1H6V3zM2 7h12v1H2V7zm4 4h10v1H6v-1zm0 4h6v1H6v-1z"/></svg>; }
function InsertIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v12M2 8h12"/></svg>; }
function DeleteIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 8h12"/></svg>; }

// Font size inc/dec
function FontIncIcon() { return <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M3 10h2l1-3h4l1 3h2L9 2H7L3 10zm2.8-4L7 4l1.2 2H5.8zM8 12v1H2v-1h6z"/></svg>; }
function FontDecIcon() { return <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M3 10h2l1-3h4l1 3h2L9 2H7L3 10zm2.8-4L7 4l1.2 2H5.8zM3 12v1h10v-1H3z"/></svg>; }

// Insert tab icons
function TableIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5h14M1 9h14M5 1v14M9 1v14"/></svg>; }
function ChartIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="9" width="3" height="5" rx="0.5"/><rect x="6" y="5" width="3" height="9" rx="0.5"/><rect x="11" y="2" width="3" height="12" rx="0.5"/></svg>; }
function LineIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><polyline points="1,11 5,6 8,9 11,3 14,5"/><circle cx="1" cy="11" r="1"/><circle cx="5" cy="6" r="1"/><circle cx="8" cy="9" r="1"/><circle cx="11" cy="3" r="1"/><circle cx="14" cy="5" r="1"/></svg>; }
function BarIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="7" width="3" height="8" rx="0.4"/><rect x="5.5" y="3" width="3" height="12" rx="0.4"/><rect x="10" y="5" width="3" height="10" rx="0.4"/></svg>; }

// Formulas tab icons
function FxIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><text x="2" y="13" fontFamily="serif" fontStyle="italic" fontWeight="700" fontSize="12">fx</text></svg>; }
function SumIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><text x="1" y="14" fontFamily="serif" fontSize="14" fontWeight="700">Σ</text></svg>; }
function SortDescIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4 5h2v1H4zm0 3h4v1H4zm0 3h3v1H4zm7-4V1l3 3h-2v4h-1z"/></svg>; }
function CheckIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="10" rx="1"/><path d="M5 8l2 2 4-4"/></svg>; }
function PivotIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="0.5"/><rect x="9" y="1" width="6" height="6" rx="0.5"/><rect x="1" y="9" width="6" height="6" rx="0.5"/><rect x="9" y="9" width="6" height="6" rx="0.5"/></svg>; }

// Data tab icons
function SortIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5 2v10l-2.5-2.5L2 10l4 4 4-4-.5-.5L7 12V2H5zm3 12v1h6v-1H8z"/></svg>; }
function FilterIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2h14l-5 6v4l-4 2v-6L1 2z" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>; }

// View tab icons
function NormalIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="11" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M1 3h14"/></svg>; }
function PageLayoutIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="10" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5h10M1 9h10"/></svg>; }
function FreezeIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="14" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>; }
function FreezeRowIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="3" fill="currentColor" opacity="0.3"/><rect x="1" y="4" width="14" height="11" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>; }
function FreezeColIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="3" height="14" fill="currentColor" opacity="0.3"/><rect x="4" y="1" width="11" height="14" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>; }
function FreezeBothIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="3" height="3" fill="currentColor" opacity="0.4"/><rect x="4" y="1" width="11" height="3" fill="currentColor" opacity="0.2"/><rect x="1" y="4" width="3" height="11" fill="currentColor" opacity="0.2"/><rect x="4" y="4" width="11" height="11" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>; }
function ZoomOutIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="7" cy="7" r="5"/><path d="M11 11l4 4M4 7h6"/></svg>; }
function ZoomInIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="7" cy="7" r="5"/><path d="M11 11l4 4M7 4v6M4 7h6"/></svg>; }
function ZoomPercentIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="7" cy="7" r="5"/><path d="M11 11l4 4"/></svg>; }
function DownloadIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1v10M4 8l4 4 4-4M2 13h12v2H2v-2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>; }

// Page Layout & Review tab icons
function ThemeIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M8 2v12"/></svg>; }
function MarginsIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="14" rx="0.6" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="2.5" y="2.5" width="11" height="11" rx="0.3" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1,1"/></svg>; }
function OrientationIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="1" width="12" height="10" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M4 12l2-1 2 1 2-1 2 1"/></svg>; }
function SizeIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="12" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="3" width="10" height="10" rx="0.3" fill="none" stroke="currentColor" strokeWidth="0.8"/></svg>; }
function ScaleIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><text x="1" y="13" fontFamily="sans-serif" fontSize="13" fontWeight="700">%</text></svg>; }
function GridlinesIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="14" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1"/><path d="M1 5h14M1 9h14M5 1v14M9 1v14"/></svg>; }
function HeadingsIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="3" height="14" fill="currentColor" opacity="0.25"/><rect x="1" y="1" width="14" height="3" fill="currentColor" opacity="0.25"/><rect x="4" y="4" width="11" height="11" rx="0.4" fill="none" stroke="currentColor" strokeWidth="1"/></svg>; }
function SpellCheckIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><text x="1" y="13" fontFamily="serif" fontSize="11" fontStyle="italic">abc</text><path d="M3 14l3-13h1l3 13h-1.2l-.8-3.5H5l-.8 3.5H3z"/></svg>; }
function CommentIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="2" width="10" height="8" rx="1"/><path d="M5 11h4l3 3v-3a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1"/></svg>; }
function DeleteCommentIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M2 3h12v8a1 1 0 0 1-1 1H5l-3 3V4a1 1 0 0 1 1-1z"/><path d="M5 7l4 4M9 7l-4 4"/></svg>; }
function ProtectIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="12" rx="0.8" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7h6M8 7v4"/></svg>; }
function LockIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="7" width="10" height="8" rx="0.8"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/><circle cx="8" cy="11" r="1"/></svg>; }

// ── Sub-components ────────────────────────────────────────────────────────

function RibbonGroupBox({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="ribbon-group">
      <div className="ribbon-group-content">{children}</div>
      <div className="ribbon-group-label">{label}</div>
    </div>
  );
}

function RibbonSeparator() {
  return <div className="ribbon-sep" />;
}

function RibbonBtn({ icon, label, w, h, onClick, title, active, disabled }: {
  icon: React.ReactNode; label: string; w?: number; h?: number; onClick?: () => void; title?: string; active?: boolean; disabled?: boolean;
}) {
  return (
    <button
      className={`ribbon-btn ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      style={{ minWidth: w || 38, height: h || 44 }}
      onClick={disabled ? undefined : onClick}
      title={disabled ? title || 'Nicht verfügbar' : title}
      disabled={disabled}
    >
      <span className="ribbon-btn-icon">{icon}</span>
      <span className="ribbon-btn-label">{label}</span>
    </button>
  );
}

function ToggleBtn({ icon, active, onClick, title }: {
  icon: React.ReactNode; active: boolean; onClick: () => void; title?: string;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      className={`ribbon-toggle-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={title}
    >
      {icon}
    </button>
  );
}

function SmallBtn({ icon, onClick, title }: { icon: React.ReactNode; onClick?: () => void; title?: string }) {
  return (
    <button className="ribbon-small-btn" onClick={onClick} title={title}>
      {icon}
    </button>
  );
}

function SplitColorBtn({ icon, color, onClick, title }: {
  icon: React.ReactNode; color: string; onClick: () => void; title?: string;
}) {
  return (
    <button className="ribbon-toggle-btn" onClick={onClick} title={title} style={{ position: 'relative' }}>
      <span>{icon}</span>
      <span className="color-indicator" style={{ background: color }} />
    </button>
  );
}

function ColorGrid({ colors, currentColor, onPick, onNone }: {
  colors: string[]; currentColor?: string; onPick: (c: string) => void; onNone: () => void;
}) {
  return (
    <div className="ribbon-color-grid">
      <div className="color-grid-colors">
        {colors.map(c => (
          <button key={c} className="color-swatch"
            style={{
              background: c,
              // Bug #20.2 fix: show indicator for currently active color
              boxShadow: c === currentColor ? '0 0 0 2px #217346 inset, 0 0 0 3px #fff' : '0 0 0 1px rgba(0,0,0,0.1)',
            }}
            onClick={() => onPick(c)} title={c} />
        ))}
      </div>
      <button className="color-grid-none" onClick={onNone}>Keine Farbe</button>
    </div>
  );
}
