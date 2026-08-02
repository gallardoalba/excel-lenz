// ── SparklineDialog: Insert Mini-Charts in Cells ────────────────────────
// Excel-style dialog for creating sparklines (line, column, winloss).

import { useState, useRef, useEffect } from 'react';
import { TrendingUp, BarChart3, Minus, X } from 'lucide-react';
import type { SparklineType } from './Sparkline';

interface SparklineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (sparkline: {
    type: SparklineType;
    dataRange: string;
    targetCell: string;
    color?: string;
    negativeColor?: string;
    highPoint?: boolean;
    lowPoint?: boolean;
  }) => void;
  /** Current selected range in the sheet, pre-filled */
  selectedRange?: string;
}

const SPARKLINE_TYPES: { type: SparklineType; label: string; icon: React.ReactNode }[] = [
  { type: 'line', label: 'Linie', icon: <TrendingUp size={20} /> },
  { type: 'column', label: 'Spalte', icon: <BarChart3 size={20} /> },
  { type: 'winloss', label: 'Gewinn/Verlust', icon: <Minus size={20} /> },
];

const COLORS = ['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47', '#264478', '#9B59B6'];

export default function SparklineDialog({ isOpen, onClose, onInsert, selectedRange = '' }: SparklineDialogProps) {
  const [type, setType] = useState<SparklineType>('line');
  const [dataRange, setDataRange] = useState(selectedRange);
  const [targetCell, setTargetCell] = useState('');
  const [color, setColor] = useState('#4472C4');
  const [negativeColor, setNegativeColor] = useState('#FF4444');
  const [highPoint, setHighPoint] = useState(false);
  const [lowPoint, setLowPoint] = useState(false);
  const dataRangeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDataRange(selectedRange);
      setTargetCell('');
      setTimeout(() => dataRangeRef.current?.focus(), 100);
    }
  }, [isOpen, selectedRange]);

  if (!isOpen) return null;

  const handleInsert = () => {
    if (!dataRange.trim() || !targetCell.trim()) return;
    onInsert({
      type,
      dataRange: dataRange.trim().toUpperCase(),
      targetCell: targetCell.trim().toUpperCase(),
      color: type !== 'winloss' ? color : undefined,
      negativeColor: type === 'winloss' ? negativeColor : undefined,
      highPoint: highPoint || undefined,
      lowPoint: lowPoint || undefined,
    });
    onClose();
  };

  const isValid = dataRange.trim() && targetCell.trim() &&
    /^[A-Z]+\d+:[A-Z]+\d+$/i.test(dataRange.trim()) &&
    /^[A-Z]+\d+$/i.test(targetCell.trim());

  return (
    <div className="excel-dialog-overlay" onClick={onClose}>
      <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="excel-dialog-titlebar">
          <span>Sparkline einfügen</span>
          <button className="excel-dialog-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ padding: 16 }}>
          {/* Type selector */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Typ</label>
            <div className="sparkline-type-selector" style={{ display: 'flex', gap: 8 }}>
              {SPARKLINE_TYPES.map(st => (
                <button
                  key={st.type}
                  className={`btn btn-sm ${type === st.type ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setType(st.type)}
                  title={st.label}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}
                >
                  {st.icon}
                  <span style={{ fontSize: '0.75rem' }}>{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="spark-data-range" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Datenbereich</label>
            <input
              id="spark-data-range"
              ref={dataRangeRef}
              type="text"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.9rem' }}
              placeholder="z.B. B2:B9"
              value={dataRange}
              onChange={e => setDataRange(e.target.value)}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>Zellbereich mit den Quelldaten (eine Spalte)</span>
          </div>

          {/* Target cell */}
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="spark-target" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Zielzelle</label>
            <input
              id="spark-target"
              type="text"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.9rem' }}
              placeholder="z.B. B10"
              value={targetCell}
              onChange={e => setTargetCell(e.target.value)}
            />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>Zelle, in der das Minigramm erscheinen soll</span>
          </div>

          {/* Color picker */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Farbe</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`color-swatch ${color === c ? 'active' : ''}`}
                  style={{
                    width: 24, height: 24, borderRadius: 4, border: color === c ? '3px solid var(--primary)' : '2px solid transparent',
                    background: c, cursor: 'pointer',
                  }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          {/* Markers */}
          {type === 'line' || type === 'column' ? (
            <div style={{ marginBottom: 12, display: 'flex', gap: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={highPoint} onChange={e => setHighPoint(e.target.checked)} />
                Höchstwert markieren
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={lowPoint} onChange={e => setLowPoint(e.target.checked)} />
                Tiefstwert markieren
              </label>
            </div>
          ) : null}

          {/* Negative color for winloss */}
          {type === 'winloss' ? (
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Farbe für negative Werte</label>
              <div style={{ display: 'flex', gap: 4 }}>
                {['#FF4444', '#FF8C00', '#A5A5A5'].map(c => (
                  <button
                    key={c}
                    className={`color-swatch ${negativeColor === c ? 'active' : ''}`}
                    style={{
                      width: 24, height: 24, borderRadius: 4,
                      border: negativeColor === c ? '3px solid var(--primary)' : '2px solid transparent',
                      background: c, cursor: 'pointer',
                    }}
                    onClick={() => setNegativeColor(c)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <button className="btn btn-outline" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary" onClick={handleInsert} disabled={!isValid}>
            Einfügen
          </button>
        </div>
      </div>
    </div>
  );
}
