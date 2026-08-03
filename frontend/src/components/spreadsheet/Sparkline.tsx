// ── Sparkline: Inline Mini-Charts in Cells ──────────────────────────────
// Renders Excel-like sparklines (line, column, winloss) as SVG in cells.
// Used for M6.1 exercises in the advanced course.

import { useMemo } from 'react';

export type SparklineType = 'line' | 'column' | 'winloss';

export interface SparklineDef {
  /** Cell address like "B10" where the sparkline is rendered */
  cell: string;
  /** Sparkline type */
  type: SparklineType;
  /** Range of data like "B2:B9" */
  range: string;
  /** Optional color */
  color?: string;
  /** Optional negative color (winloss) */
  negativeColor?: string;
  /** Optional marker for high point */
  highPoint?: boolean;
  /** Optional marker for low point */
  lowPoint?: boolean;
}

interface SparklineProps {
  data: number[];
  width: number;
  height: number;
  type: SparklineType;
  color?: string;
  negativeColor?: string;
  highPoint?: boolean;
  lowPoint?: boolean;
}

/** SVG line sparkline */
function LineSparkline({ data, width, height, color = '#4472C4', highPoint, lowPoint }: SparklineProps) {
  const nums = data.filter(n => !isNaN(n));
  if (nums.length < 2) return <svg width={width} height={height} />;

  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const range = max - min || 1;
  const padding = 2;

  const points = nums.map((v, i) => {
    const x = padding + (i / (nums.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((v - min) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  const lastX = padding + ((nums.length - 1) / (nums.length - 1)) * (width - 2 * padding);
  const lastY = height - padding - ((nums[nums.length - 1] - min) / range) * (height - 2 * padding);

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {highPoint && (
        <circle
          cx={padding + (nums.indexOf(max) / (nums.length - 1)) * (width - 2 * padding)}
          cy={height - padding - ((max - min) / range) * (height - 2 * padding)}
          r={2.5}
          fill={color}
          stroke="white"
          strokeWidth={0.5}
        />
      )}
      {lowPoint && (
        <circle
          cx={padding + (nums.indexOf(min) / (nums.length - 1)) * (width - 2 * padding)}
          cy={height - padding - ((min - min) / range) * (height - 2 * padding)}
          r={2.5}
          fill={color}
          stroke="white"
          strokeWidth={0.5}
        />
      )}
      {/* Last point marker */}
      <circle cx={lastX} cy={lastY} r={2} fill={color} />
    </svg>
  );
}

/** SVG column sparkline */
function ColumnSparkline({ data, width, height, color = '#4472C4', highPoint, lowPoint }: SparklineProps) {
  const nums = data.filter(n => !isNaN(n));
  if (nums.length === 0) return <svg width={width} height={height} />;

  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const range = max - min || 1;
  const barWidth = Math.max(1, (width - 4) / nums.length - 2);

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {nums.map((v, i) => {
        const barH = Math.max(1, ((v - min) / range) * (height - 4));
        const x = 2 + i * ((width - 4) / nums.length) + ((width - 4) / nums.length - barWidth) / 2;
        const y = height - 2 - barH;
        const isHigh = highPoint && v === max;
        const isLow = lowPoint && v === min;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barH}
            fill={isHigh ? '#FF8C00' : isLow ? '#FF4444' : color}
            rx={0.5}
          />
        );
      })}
    </svg>
  );
}

/** SVG win/loss sparkline (positive=up, negative=down, zero=flat) */
function WinlossSparkline({ data, width, height, color = '#4472C4', negativeColor = '#FF4444' }: SparklineProps) {
  const nums = data.filter(n => !isNaN(n));
  if (nums.length === 0) return <svg width={width} height={height} />;

  const midY = height / 2;
  const segWidth = Math.max(2, (width - 4) / nums.length);

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {nums.map((v, i) => {
        const x = 2 + i * segWidth + segWidth / 2;
        const h = Math.abs(v) > 0 ? 4 : 0;
        const y = v >= 0 ? midY - h : midY + 0.5;
        return (
          <rect
            key={i}
            x={x - 2}
            y={y}
            width={4}
            height={h || 1}
            fill={v > 0 ? color : v < 0 ? negativeColor : '#999'}
          />
        );
      })}
    </svg>
  );
}

/** Main sparkline component — picks the right sub-renderer */
export default function Sparkline({ data, width = 100, height = 20, type, color, negativeColor, highPoint, lowPoint }: SparklineProps) {
  if (!data || data.length === 0) {
    return <div style={{ width, height, display: 'inline-block' }} />;
  }

  switch (type) {
    case 'line':
      return <LineSparkline type="line" data={data} width={width} height={height} color={color} highPoint={highPoint} lowPoint={lowPoint} />;
    case 'column':
      return <ColumnSparkline type="column" data={data} width={width} height={height} color={color} highPoint={highPoint} lowPoint={lowPoint} />;
    case 'winloss':
      return <WinlossSparkline type="winloss" data={data} width={width} height={height} color={color} negativeColor={negativeColor} />;
    default:
      return <LineSparkline type="line" data={data} width={width} height={height} color={color} highPoint={highPoint} lowPoint={lowPoint} />;
  }
}

/** Parse Excel-style range like "B2:B9" into row indices (0-based) from a 2D data array */
export function parseSparklineRange(range: string, headers: string[]): number[] {
  const match = range.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i);
  if (!match) return [];

  const colStart = colLetterToIndex(match[1]);
  const rowStart = parseInt(match[2], 10) - 1; // 1-based → 0-based
  const colEnd = colLetterToIndex(match[3]);
  const rowEnd = parseInt(match[4], 10) - 1;

  if (colStart !== colEnd) return []; // Single column only
  if (rowStart > rowEnd) return [];

  const indices: number[] = [];
  for (let r = rowStart; r <= rowEnd; r++) {
    indices.push(r);
  }
  return indices;
}

export function colLetterToIndex(letters: string): number {
  let idx = 0;
  for (let i = 0; i < letters.length; i++) {
    idx = idx * 26 + (letters.toUpperCase().charCodeAt(i) - 64);
  }
  return idx - 1; // 0-based
}

/** Resolve a sparkline definition to actual data values */
export function resolveSparklineData(
  def: SparklineDef,
  data: (string | number | null)[][],
  headers: string[],
): number[] {
  // data is the raw data array (rows only, NO header row).
  // Excel row 1 = header, row 2 = data[0], row N = data[N-2].
  const match = def.range.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/i);
  if (!match) return [];

  const col = colLetterToIndex(match[1]);
  // Excel row → data index: subtract 2 (1 for header, 1 for 0-based)
  const rowStart = parseInt(match[2], 10) - 2;
  const rowEnd = parseInt(match[4], 10) - 2;

  const result: number[] = [];
  for (let r = rowStart; r <= rowEnd; r++) {
    const val = data[r]?.[col];
    if (val !== null && val !== undefined && val !== '') {
      result.push(Number(val));
    } else {
      result.push(NaN);
    }
  }
  return result;
}
