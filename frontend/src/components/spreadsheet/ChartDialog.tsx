// ── ChartDialog: Simple SVG bar/line chart overlay ──────────────────────
// Renders a basic chart from selected Handsontable data without external deps

import { useMemo, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ChartDialogProps {
  visible: boolean;
  chartType: 'bar' | 'line';
  data: Record<string, string | number>[];
  onClose: () => void;
}

// Excel color palette for chart series
const CHART_COLORS = ['#4472c4', '#ed7d31', '#a5a5a5', '#ffc000', '#5b9bd5', '#70ad47'];

export default function ChartDialog({ visible, chartType, data, onClose }: ChartDialogProps) {
  const keys = data.length > 0 ? Object.keys(data[0]) : [];
  const labelKey = keys[0] || '';
  const seriesKeys = keys.slice(1);

  // Bug #32 fix: restore focus to previously active element when dialog closes
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
    const values = seriesKeys.map(k => data.map(d => Number(d[k]) || 0));
    const allValues = values.flat();
    const maxVal = Math.max(...allValues, 1);
    const minVal = Math.min(0, ...allValues);
    const range = maxVal - minVal || 1;

    const W = 560;
    const H = 280;
    const pad = { top: 20, right: 20, bottom: 40, left: 50 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;
    const barGap = 2;
    // Bug #20.1 fix: group bars by data point, center each group
    const groupWidth = plotW / (data.length || 1);
    const seriesCount = seriesKeys.length || 1;
    const barW = Math.max(3, (groupWidth - barGap * (seriesCount + 1)) / seriesCount);

    // Y-axis ticks
    const yTicks = 5;
    const yStep = range / yTicks;

    return (
      <svg width={W} height={H} style={{ fontFamily: 'Calibri, Arial, sans-serif', fontSize: 11 }}>
        {/* Y-axis gridlines and labels */}
        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const val = minVal + yStep * i;
          const y = pad.top + plotH - ((val - minVal) / range) * plotH;
          return (
            <g key={i}>
              <line x1={pad.left} y1={y} x2={pad.left + plotW} y2={y} stroke="#e0e0e0" strokeWidth={0.5} />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" fill="#666">{Math.round(val)}</text>
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
            {String(d[labelKey]).slice(0, 12)}
          </text>
        ))}

        {/* Bars or Lines */}
        {chartType === 'bar' ? (
          seriesKeys.map((key, si) =>
            data.map((d, di) => {
              const val = Number(d[key]) || 0;
              const barH = Math.max(1, (Math.abs(val) / range) * plotH);
              // Bug #20.1: center bars within data-point groups
              const x = pad.left + di * groupWidth + barGap + si * (barW + barGap);
              const y = val >= 0 ? pad.top + plotH - ((val - minVal) / range) * plotH : pad.top + plotH - ((-minVal) / range) * plotH;
              return <rect key={`${si}-${di}`} x={x} y={y} width={barW} height={barH} fill={CHART_COLORS[si % CHART_COLORS.length]} rx={1} />;
            })
          )
        ) : (
          seriesKeys.map((key, si) => {
            const color = CHART_COLORS[si % CHART_COLORS.length];
            const points = data.map((d, di) => {
              const val = Number(d[key]) || 0;
              const x = pad.left + (plotW / (data.length - 1 || 1)) * di;
              const y = pad.top + plotH - ((val - minVal) / range) * plotH;
              return `${x},${y}`;
            }).join(' ');
            return (
              <g key={si}>
                <polyline points={points} fill="none" stroke={color} strokeWidth={2} />
                {data.map((d, di) => {
                  const val = Number(d[key]) || 0;
                  return <circle key={di} cx={pad.left + (plotW / (data.length - 1 || 1)) * di} cy={pad.top + plotH - ((val - minVal) / range) * plotH} r={3} fill={color} />;
                })}
              </g>
            );
          })
        )}

        {/* Legend */}
        {seriesKeys.map((key, i) => (
          <g key={i} transform={`translate(${pad.left + i * 120}, ${H - 20})`}>
            <rect width={12} height={12} fill={CHART_COLORS[i % CHART_COLORS.length]} rx={2} />
            <text x={16} y={10} fill="#333" fontSize={10}>{key}</text>
          </g>
        ))}
      </svg>
    );
  }, [data, chartType, labelKey, seriesKeys]);

  if (!visible || data.length === 0) return null;

  return (
    <div className="excel-dialog-overlay" onClick={onClose}>
      <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 620, background: 'var(--surface, #fff)', borderRadius: 'var(--radius, 8px)', boxShadow: '0 8px 30px rgba(0,0,0,0.18)' }}>
        <div className="excel-dialog-titlebar">
          <span>{chartType === 'bar' ? 'Balkendiagramm' : 'Liniendiagramm'}</span>
          <button className="excel-dialog-close" onClick={onClose} aria-label="Schließen"><X size={18} /></button>
        </div>
        <div style={{ padding: 16 }}>
          {chart}
        </div>
      </div>
    </div>
  );
}
