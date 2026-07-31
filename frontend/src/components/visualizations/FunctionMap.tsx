import React from 'react';
import { Map, CheckCircle2, Lock } from 'lucide-react';

interface FunctionNode {
  name: string;
  x: number; y: number;
  dependsOn: string[];
}

const MAP: FunctionNode[] = [
  { name: 'SUMME', x: 50, y: 80, dependsOn: [] },
  { name: 'MITTELWERT', x: 180, y: 30, dependsOn: ['SUMME'] },
  { name: 'MIN/MAX', x: 180, y: 130, dependsOn: [] },
  { name: 'ZÄHLENWENN', x: 310, y: 30, dependsOn: ['SUMME'] },
  { name: 'WENN', x: 310, y: 80, dependsOn: [] },
  { name: 'UND/ODER', x: 310, y: 130, dependsOn: ['WENN'] },
  { name: 'SVERWEIS', x: 440, y: 55, dependsOn: ['WENN'] },
  { name: 'WENNFEHLER', x: 440, y: 105, dependsOn: ['SVERWEIS'] },
  { name: 'INDEX/VGL', x: 570, y: 55, dependsOn: ['SVERWEIS'] },
  { name: 'WENNS', x: 570, y: 105, dependsOn: ['WENN'] },
  { name: 'RANG', x: 440, y: 155, dependsOn: [] },
  { name: 'KORREL', x: 310, y: 180, dependsOn: ['MITTELWERT'] },
  { name: 'RUNDEN', x: 180, y: 185, dependsOn: [] },
  { name: 'TEILERGEBNIS', x: 570, y: 155, dependsOn: ['SUMME'] },
];

interface Props {
  masteredSkills: string[];
  inProgress: string[];
}

export default function FunctionMap({ masteredSkills, inProgress }: Props) {
  const w = 660, h = 230;

  const getStatus = (name: string): 'mastered' | 'progress' | 'locked' => {
    if (masteredSkills.includes(name)) return 'mastered';
    if (inProgress.includes(name)) return 'progress';
    return 'locked';
  };

  const colors: Record<string, { fill: string; stroke: string; text: string }> = {
    mastered: { fill: '#e8f5e9', stroke: '#2e7d32', text: '#1b5e20' },
    progress: { fill: '#fff3e0', stroke: '#e65100', text: '#e65100' },
    locked: { fill: '#f5f5f5', stroke: '#bdbdbd', text: '#9e9e9e' },
  };

  return (
    <div className="card" style={{ padding: '16px', marginBottom: 20, overflow: 'hidden' }}>
      <h4 style={{ marginBottom: 4 }}><Map size={16} style={{marginRight:4, verticalAlign:'middle'}} />Funktions-Landkarte</h4>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
        So bauen Excel-Funktionen aufeinander auf. Meistere die grünen, um blaue freizuschalten.
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', maxHeight: 240 }}>
        {/* Connection lines */}
        {MAP.map(node =>
          node.dependsOn.map(dep => {
            const from = MAP.find(n => n.name === dep);
            if (!from) return null;
            return (
              <line key={`${dep}-${node.name}`}
                x1={from.x + 45} y1={from.y + 14}
                x2={node.x + 5} y2={node.y + 14}
                stroke="#ccc" strokeWidth={1.5} strokeDasharray="4,2"
              />
            );
          })
        )}
        {/* Nodes */}
        {MAP.map(node => {
          const status = getStatus(node.name);
          const c = colors[status];
          return (
            <g key={node.name}>
              <rect x={node.x} y={node.y} width={110} height={28} rx={6}
                fill={c.fill} stroke={c.stroke} strokeWidth={1.5}
              />
              <text x={node.x + 45} y={node.y + 18}
                textAnchor="middle" fontSize={10} fontWeight={600}
                fill={c.text} fontFamily="monospace"
              >
                {node.name}
              </text>
              {status === 'mastered' && (
                <foreignObject x={node.x + 80} y={node.y + 6} width={16} height={16}>
                  <CheckCircle2 size={14} color="#2e7d32" />
                </foreignObject>
              )}
              {status === 'locked' && (
                <foreignObject x={node.x + 80} y={node.y + 6} width={16} height={16}>
                  <Lock size={14} color="#9e9e9e" />
                </foreignObject>
              )}
            </g>
          );
        })}
        {/* Legend */}
        <g transform={`translate(10, ${h - 16})`}>
          <rect x={0} y={0} width={12} height={12} rx={2} fill={colors.mastered.fill} stroke={colors.mastered.stroke} strokeWidth={1}/>
          <text x={16} y={10} fontSize={9} fill="#666">Gemeistert</text>
          <rect x={90} y={0} width={12} height={12} rx={2} fill={colors.progress.fill} stroke={colors.progress.stroke} strokeWidth={1}/>
          <text x={106} y={10} fontSize={9} fill="#666">In Arbeit</text>
          <rect x={170} y={0} width={12} height={12} rx={2} fill={colors.locked.fill} stroke={colors.locked.stroke} strokeWidth={1}/>
          <text x={186} y={10} fontSize={9} fill="#666">Gesperrt</text>
        </g>
      </svg>
    </div>
  );
}
