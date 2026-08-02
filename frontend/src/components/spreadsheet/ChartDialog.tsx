// ── ChartDialog: SVG bar/line/combo chart with trendlines ─────────────────
// Renders charts from selected Handsontable data without external deps.
// Supports: bar, line, combo (bar+line), trendlines (linear + R²).

import { useMemo, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ChartDialogProps {
  visible: boolean;
  chartType: 'bar' | 'line' | 'combo';
  data: Record<string, string | number>[];
  onClose: () => void;
  /** Which series to render as bars (rest as lines). Required for combo. */
  barSeries?: string[];
  /** Show trendline for a specific series key */
  trendlineSeries?: string;
  /** Show secondary Y-axis for a specific series */
  secondaryAxisSeries?: string;
}

// Excel color palette for chart series
const CHART_COLORS = ['#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47'];

// Linear regression: returns { slope, intercept, rSquared }
function linearRegression(xs: number[], ys: number[]): { slope: number; intercept: number; rSquared: number } | null {
  const n = xs.length;
  if (n < 2) return null;
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((total, x, i) => total + x * ys[i], 0);
  const sumX2 = xs.reduce((total, x) => total + x * x, 0);
  const sumY2 = ys.reduce((total, y) => total + y * y, 0);

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return null;
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // R² calculation
  const yMean = sumY / n;
  const ssRes = ys.reduce((total, y, i) => total + (y - (slope * xs[i] + intercept)) ** 2, 0);
  const ssTot = ys.reduce((total, y) => total + (y - yMean) ** 2, 0);
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared };
}

export default function ChartDialog({ visible, chartType, data, onClose, barSeries, trendlineSeries, secondaryAxisSeries }: ChartDialogProps) {
  const keys = data.length > 0 ? Object.keys(data[0]) : [];
  const labelKey = keys[0] || '';
  const seriesKeys = keys.slice(1);

  const previousFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (visible) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [visible]);

  const chart = useMemo(() => {
    if (!visible || data.length === 0) return null;

    const isCombo = chartType === 'combo';
    const barKeys = isCombo && barSeries ? barSeries.filter(k => seriesKeys.includes(k)) : [];
    const lineKeys = isCombo ? seriesKeys.filter(k => !barKeys.includes(k)) : [];

    // For combo, compute separate ranges for primary (bars) and secondary (lines)
    let primaryKeys: string[] = seriesKeys;
    let secondaryKeys: string[] = [];
    if (isCombo) {
      primaryKeys = barKeys.length > 0 ? barKeys : seriesKeys;
      secondaryKeys = lineKeys;
    }
    if (secondaryAxisSeries && seriesKeys.includes(secondaryAxisSeries)) {
      primaryKeys = seriesKeys.filter(k => k !== secondaryAxisSeries);
      secondaryKeys = [secondaryAxisSeries];
    }

    const primaryValues = primaryKeys.map(k => data.map(d => Number(d[k]) || 0)).flat();
    const secondaryValues = secondaryKeys.map(k => data.map(d => Number(d[k]) || 0)).flat();
    const allPrimary = primaryValues.length > 0 ? primaryValues : [0, 1];
    const allSecondary = secondaryValues.length > 0 ? secondaryValues : allPrimary;

    const maxPrimary = Math.max(...allPrimary, 1);
    const minPrimary = Math.min(0, ...allPrimary);
    const rangePrimary = maxPrimary - minPrimary || 1;
    const maxSecondary = Math.max(...allSecondary, 1);
    const minSecondary = Math.min(0, ...allSecondary);
    const rangeSecondary = maxSecondary - minSecondary || 1;

    const hasSecondary = secondaryKeys.length > 0;

    const W = 620;
    const H = 310;
    const pad = { top: 20, right: hasSecondary ? 50 : 20, bottom: 40, left: 55 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;

    // For combo, bars use primary range, lines use their own range
    const primaryRange = rangePrimary;
    const primaryMin = minPrimary;

    // Trendline data (computed inline — cannot use useMemo inside useMemo)
    let trendlineData: { slope: number; intercept: number; rSquared: number } | null = null;
    if (trendlineSeries && seriesKeys.includes(trendlineSeries)) {
      const ys = data.map(d => Number(d[trendlineSeries]) || 0);
      const xs = data.map((_, i) => i + 1);
      trendlineData = linearRegression(xs, ys);
    }

    // Y-axis ticks
    const yTicks = 5;

    return (
      <svg width={W} height={H} style={{ fontFamily: 'Calibri, Arial, sans-serif', fontSize: 11 }}>
        {/* Primary Y-axis gridlines and labels */}
        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const val = primaryMin + (primaryRange / yTicks) * i;
          const y = pad.top + plotH - ((val - primaryMin) / primaryRange) * plotH;
          return (
            <g key={`py${i}`}>
              <line x1={pad.left} y1={y} x2={pad.left + plotW} y2={y} stroke="#e0e0e0" strokeWidth={0.5} />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" fill="#555">{Math.round(val).toLocaleString('de-DE')}</text>
            </g>
          );
        })}

        {/* Secondary Y-axis (right side) */}
        {hasSecondary && Array.from({ length: yTicks + 1 }, (_, i) => {
          const val = minSecondary + (rangeSecondary / yTicks) * i;
          const y = pad.top + plotH - ((val - minSecondary) / rangeSecondary) * plotH;
          return (
            <g key={`sy${i}`}>
              <text x={pad.left + plotW + 6} y={y + 4} textAnchor="start" fill="#ed7d31" fontSize={9}>
                {Math.round(val).toLocaleString('de-DE')}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={pad.left + (plotW / data.length) * (i + 0.5)}
            y={H - 8}
            textAnchor="middle"
            fill="#666"
            fontSize={10}
          >
            {String(d[labelKey]).slice(0, 14)}
          </text>
        ))}

        {/* Render primary series as bars */}
        {(chartType === 'bar' || (isCombo && primaryKeys.length > 0)) && primaryKeys.map((key, si) => {
          const groupWidth = plotW / (data.length || 1);
          const barCount = primaryKeys.length || 1;
          const barGap = 2;
          const barW = Math.max(3, (groupWidth - barGap * (barCount + 1)) / barCount);
          const color = CHART_COLORS[seriesKeys.indexOf(key) % CHART_COLORS.length];

          return data.map((d, di) => {
            const val = Number(d[key]) || 0;
            const barH = Math.max(1, (Math.abs(val - primaryMin) / primaryRange) * plotH);
            const x = pad.left + di * groupWidth + barGap + si * (barW + barGap);
            const y = val >= 0 ? pad.top + plotH - ((val - primaryMin) / primaryRange) * plotH : pad.top + plotH - ((-primaryMin) / primaryRange) * plotH;
            return <rect key={`${si}-${di}`} x={x} y={y} width={barW} height={barH} fill={color} rx={1} />;
          });
        })}

        {/* Render line series */}
        {(chartType === 'line' || isCombo) && (isCombo ? lineKeys : seriesKeys).map((key, si) => {
          const range = secondaryKeys.includes(key) ? rangeSecondary : rangePrimary;
          const min = secondaryKeys.includes(key) ? minSecondary : primaryMin;
          const color = CHART_COLORS[seriesKeys.indexOf(key) % CHART_COLORS.length];
          const points = data.map((d, di) => {
            const val = Number(d[key]) || 0;
            const x = pad.left + (plotW / (data.length - 1 || 1)) * di;
            const y = pad.top + plotH - ((val - min) / range) * plotH;
            return `${x},${y}`;
          }).join(' ');

          return (
            <g key={`line-${si}`}>
              <polyline points={points} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" />
              {data.map((d, di) => {
                const val = Number(d[key]) || 0;
                const x = pad.left + (plotW / (data.length - 1 || 1)) * di;
                const y = pad.top + plotH - ((val - min) / range) * plotH;
                return <circle key={di} cx={x} cy={y} r={4} fill={color} stroke="white" strokeWidth={1.5} />;
              })}
            </g>
          );
        })}

        {/* Trendline (linear) */}
        {trendlineData && (() => {
          const { slope, intercept, rSquared } = trendlineData;
          const seriesKey = trendlineSeries || seriesKeys[0];
          const range = secondaryKeys.includes(seriesKey) ? rangeSecondary : rangePrimary;
          const min = secondaryKeys.includes(seriesKey) ? primaryMin : primaryMin;
          const x1 = 1;
          const xN = data.length;
          const y1 = slope * x1 + intercept;
          const yN = slope * xN + intercept;
          const sx1 = pad.left;
          const sy1 = pad.top + plotH - ((y1 - min) / range) * plotH;
          const sxN = pad.left + plotW;
          const syN = pad.top + plotH - ((yN - min) / range) * plotH;

          return (
            <g>
              <line x1={sx1} y1={sy1} x2={sxN} y2={syN} stroke="#c62828" strokeWidth={1.5} strokeDasharray="6,3" />
              <text
                x={pad.left + plotW - 10}
                y={pad.top + 10}
                textAnchor="end"
                fill="#c62828"
                fontSize={9}
                fontWeight="600"
              >
                R² = {rSquared.toFixed(3)}
              </text>
              <text
                x={pad.left + plotW - 10}
                y={pad.top + 22}
                textAnchor="end"
                fill="#c62828"
                fontSize={9}
              >
                y = {slope.toFixed(2)}x + {intercept.toFixed(1)}
              </text>
            </g>
          );
        })()}

        {/* Legend */}
        {seriesKeys.map((key, i) => (
          <g key={`leg-${i}`} transform={`translate(${pad.left + i * 130}, ${H - 20})`}>
            <rect width={12} height={12} fill={CHART_COLORS[i % CHART_COLORS.length]} rx={2} />
            <text x={16} y={10} fill="#333" fontSize={10}>{key}</text>
          </g>
        ))}

        {/* Secondary axis label */}
        {hasSecondary && (
          <text x={pad.left + plotW + 40} y={pad.top} textAnchor="middle" fill="#ed7d31" fontSize={9} fontWeight="600">
            {secondaryKeys[0]}
          </text>
        )}
      </svg>
    );
  }, [data, chartType, labelKey, seriesKeys, barSeries, trendlineSeries, secondaryAxisSeries]);

  if (!visible || data.length === 0) return null;

  const titleMap: Record<string, string> = {
    bar: 'Balkendiagramm',
    line: 'Liniendiagramm',
    combo: 'Kombidiagramm (Säulen + Linie)',
  };

  return (
    <div className="excel-dialog-overlay" onClick={onClose}>
      <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 680, background: 'var(--surface, #fff)', borderRadius: 'var(--radius, 8px)', boxShadow: '0 8px 30px rgba(0,0,0,0.18)' }}>
        <div className="excel-dialog-titlebar">
          <span>{titleMap[chartType] || 'Diagramm'}</span>
          <button className="excel-dialog-close" onClick={onClose} aria-label="Schließen"><X size={18} /></button>
        </div>
        <div style={{ padding: 16 }}>
          {chart}
        </div>
      </div>
    </div>
  );
}
