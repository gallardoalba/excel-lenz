import React, { useEffect, useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';
import { apiFetch } from '../../context/AuthContext';

// ── Score Progress Line Chart (Inline SVG) ─────────────────

interface ScorePoint { date: string; score: number; exercise: string; }

export function ScoreProgressChart() {
  const [points, setPoints] = useState<ScorePoint[]>([]);

  useEffect(() => {
    apiFetch('/exercises/user/progress').then((data: any[]) => {
      setPoints(data.map((p: any) => ({
        date: p.completed_at?.split('T')[0] || '',
        score: p.score || 0,
        exercise: p.exercise_title || '',
      })).filter((p: ScorePoint) => p.date));
    }).catch(() => {});
  }, []);

  if (points.length < 2) return null;

  const w = 600, h = 200, pad = { l: 40, r: 20, t: 15, b: 30 };
  const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;

  const minScore = Math.max(0, Math.min(...points.map(p => p.score)) - 10);
  const maxScore = Math.min(100, Math.max(...points.map(p => p.score)) + 10);
  const yRange = maxScore - minScore || 1;

  const xStep = pw / Math.max(1, points.length - 1);

  const pathD = points.map((p, i) => {
    const x = pad.l + i * xStep;
    const y = pad.t + ph - ((p.score - minScore) / yRange) * ph;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  // Y-axis labels
  const yTicks = [0, 25, 50, 75, 100].filter(v => v >= minScore && v <= maxScore);

  return (
    <div className="card" style={{ padding: '16px', overflow: 'hidden' }}>
      <h4 style={{ marginBottom: 8 }}><TrendingUp size={16} style={{marginRight:4, verticalAlign:'middle'}} />Score-Verlauf</h4>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', maxHeight: 220 }}>
        {/* Grid lines */}
        {yTicks.map(t => {
          const y = pad.t + ph - ((t - minScore) / yRange) * ph;
          return (
            <g key={t}>
              <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#e5e7eb" strokeWidth={0.5}/>
              <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize={11} fill="#6b7280">{t}%</text>
            </g>
          );
        })}
        {/* Line */}
        <path d={pathD} fill="none" stroke="var(--primary, #6366f1)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
        {/* Area fill */}
        <path d={`${pathD} L${pad.l + (points.length - 1) * xStep},${pad.t + ph} L${pad.l},${pad.t + ph} Z`}
          fill="url(#scoreGrad)" opacity={0.15}/>
        {/* Dots */}
        {points.map((p, i) => {
          const x = pad.l + i * xStep;
          const y = pad.t + ph - ((p.score - minScore) / yRange) * ph;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={4} fill="white" stroke="var(--primary, #6366f1)" strokeWidth={2}/>
              <title>{p.date}: {p.exercise} — {Math.round(p.score)}%</title>
            </g>
          );
        })}
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary, #6366f1)"/>
            <stop offset="100%" stopColor="var(--primary, #6366f1)" stopOpacity={0}/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ── Streak Calendar (GitHub-style contribution grid) ──────

interface DayCell { date: string; count: number; level: 0|1|2|3|4; }

export function StreakCalendar() {
  const [cells, setCells] = useState<DayCell[]>([]);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    apiFetch('/exercises/user/progress').then((data: any[]) => {
      // Group by date
      const dayMap: Record<string, number> = {};
      data.forEach((p: any) => {
        const d = p.completed_at?.split('T')[0];
        if (d) dayMap[d] = (dayMap[d] || 0) + 1;
      });

      // Build 84-day grid (12 weeks)
      const today = new Date();
      const grid: DayCell[] = [];
      for (let i = 83; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split('T')[0];
        const count = dayMap[ds] || 0;
        grid.push({ date: ds, count, level: count >= 5 ? 4 : count >= 3 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0 as 0|1|2|3|4 });
      }

      // Calculate current streak
      let streak = 0;
      for (let i = grid.length - 1; i >= 0; i--) {
        if (grid[i].count > 0) streak++;
        else break;
      }
      setMaxStreak(streak);
      setCells(grid);
    }).catch(() => {});
  }, []);

  if (cells.length === 0) return null;

  const levelColors = ['#F1F5F9', '#C8DCD0', '#A0C4B0', '#78AC90', '#1B4332'];
  const months = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];

  // Group into 7 rows (days of week) × 12 columns (weeks)
  const weeks: DayCell[][] = [];
  for (let i = 0; i < cells.length; i++) {
    const wi = Math.floor(i / 7);
    if (!weeks[wi]) weeks[wi] = [];
    weeks[wi].push(cells[i]);
  }

  // Find month boundaries for labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  cells.forEach((c, i) => {
    const m = new Date(c.date + 'T00:00:00').getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ label: months[m], col: Math.floor(i / 7) });
      lastMonth = m;
    }
  });

  return (
    <div className="card" style={{ padding: '16px', overflow: 'hidden' }}>
      <h4 style={{ marginBottom: 4 }}><Calendar size={16} style={{marginRight:4, verticalAlign:'middle'}} />Aktivität ({maxStreak} Tage Konstanz)</h4>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
        Letzte 12 Wochen
      </div>
      <svg viewBox="0 0 700 130" style={{ width: '100%', height: 'auto', maxHeight: 130 }}>
        {/* Month labels */}
        {monthLabels.map((ml, i) => (
          <text key={i} x={ml.col * 14 + 5} y={10} fontSize={10} fill="#9ca3af">{ml.label}</text>
        ))}
        {/* Day labels */}
        {['Mo','','Mi','','Fr','','So'].map((d, i) => (
          <text key={i} x={0} y={22 + i * 14 + 5} fontSize={9} fill="#9ca3af">
            {i % 2 === 0 ? d : ''}
          </text>
        ))}
        {/* Cells */}
        {cells.map((c, i) => {
          const col = Math.floor(i / 7);
          const row = i % 7;
          return (
            <rect key={i} x={col * 14 + 22} y={row * 14 + 16} width={12} height={12} rx={2}
              fill={levelColors[c.level]}
              style={{ cursor: 'pointer' }}
            >
              <title>{c.date}: {c.count} Übung{c.count !== 1 ? 'en' : ''}</title>
            </rect>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 8, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
        Weniger
        {levelColors.map((lc, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: lc }}/>
        ))}
        Mehr
      </div>
    </div>
  );
}
