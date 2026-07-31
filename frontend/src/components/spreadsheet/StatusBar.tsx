// ── StatusBar: Excel-like bottom status bar ────────────────────────────────
// Displays mode indicator, selection aggregates, and zoom controls.

import { useState } from 'react';
import type { StatusBarInfo } from './types';

interface StatusBarProps {
  info: StatusBarInfo;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onZoomChange?: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
  sheets?: { id: number; name: string }[];
  activeSheetId?: number;
  onSwitchSheet?: (id: number) => void;
  onAddSheet?: () => void;
}

export default function StatusBar({
  info,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onZoomChange,
  minZoom = 50,
  maxZoom = 200,
  sheets,
  activeSheetId,
  onSwitchSheet,
  onAddSheet,
}: StatusBarProps) {
  const [showAggregates, setShowAggregates] = useState(true);

  const modeLabel = info.mode === 'ready' ? 'Bereit'
    : info.mode === 'edit' ? 'Bearbeiten'
    : 'Eingabe';

  const hasSelection = info.selectionCount !== undefined && info.selectionCount > 0;

  return (
    <div className="excel-statusbar">
      {/* Sheet tabs */}
      <div className="statusbar-sheets">
        {(sheets || [{ id: 0, name: 'Tabelle1' }]).map(s => (
          <button
            key={s.id}
            className={`sheet-tab${s.id === (activeSheetId ?? 0) ? ' active' : ''}`}
            onClick={() => onSwitchSheet?.(s.id)}
          >{s.name}</button>
        ))}
        <button className="sheet-tab-add" title="Neue Tabelle" onClick={() => onAddSheet?.()}>+</button>
      </div>

      {/* Left: Mode indicator */}
      <div className="statusbar-mode">
        <span className={`statusbar-mode-dot mode-${info.mode}`} />
        <span>{modeLabel}</span>
      </div>

      {/* Center: Selection aggregates */}
      <div className="statusbar-aggregates">
        {hasSelection && showAggregates && (
          <>
            {info.selectionAvg !== undefined && (
              <span className="statusbar-agg" title="Mittelwert">
                MITTELWERT: {formatNum(info.selectionAvg)}
              </span>
            )}
            {info.selectionCount !== undefined && (
              <span className="statusbar-agg" title="Anzahl">
                ANZAHL: {info.selectionCount}
              </span>
            )}
            {info.selectionSum !== undefined && (
              <span className="statusbar-agg" title="Summe">
                SUMME: {formatNum(info.selectionSum)}
              </span>
            )}
            {info.selectionMin !== undefined && (
              <span className="statusbar-agg" title="Minimum">
                MIN: {formatNum(info.selectionMin)}
              </span>
            )}
            {info.selectionMax !== undefined && (
              <span className="statusbar-agg" title="Maximum">
                MAX: {formatNum(info.selectionMax)}
              </span>
            )}
          </>
        )}
      </div>

      {/* Right: Zoom controls */}
      <div className="statusbar-zoom">
        <button
          className="statusbar-zoom-btn"
          onClick={onZoomOut}
          disabled={info.zoom <= minZoom}
          title="Verkleinern"
        >
          −
        </button>
        <div className="statusbar-zoom-slider-container">
          <input
            type="range"
            className="statusbar-zoom-slider"
            min={minZoom}
            max={maxZoom}
            value={info.zoom}
            onChange={(e) => onZoomChange?.(parseInt(e.target.value))}
          />
        </div>
        <button
          className="statusbar-zoom-btn"
          onClick={onZoomIn}
          disabled={info.zoom >= maxZoom}
          title="Vergrößern"
        >
          +
        </button>
        <button
          className="statusbar-zoom-reset"
          onClick={onZoomReset}
          title="Zoom zurücksetzen"
        >
          {info.zoom}%
        </button>
      </div>
    </div>
  );
}

function formatNum(n: number): string {
  if (!isFinite(n)) return '0';
  return n.toLocaleString('de-DE', { minimumFractionDigits: Number.isInteger(n) ? 0 : 1, maximumFractionDigits: 2 });
}
