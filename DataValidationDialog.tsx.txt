// ── DataValidationDialog: Add validation rules to columns ─────────────────
// Supports numeric range (min/max) and dropdown list validation

import { useState } from 'react';
import { X } from 'lucide-react';

interface ValidationRule {
  col: number;
  type: 'number' | 'list';
  min?: number;
  max?: number;
  list?: string;
  errorMessage: string;
}

interface DataValidationDialogProps {
  visible: boolean;
  headers: string[];
  onApply: (rule: ValidationRule) => void;
  onClose: () => void;
}

export default function DataValidationDialog({ visible, headers, onApply, onClose }: DataValidationDialogProps) {
  const [col, setCol] = useState(0);
  const [type, setType] = useState<'number' | 'list'>('number');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [list, setList] = useState('');
  const [errorMsg, setErrorMsg] = useState('Ungültiger Wert');

  if (!visible) return null;

  const handleApply = () => {
    onApply({
      col,
      type,
      min: min ? parseFloat(min) : undefined,
      max: max ? parseFloat(max) : undefined,
      list: type === 'list' ? list : undefined,
      errorMessage: errorMsg || 'Ungültiger Wert',
    });
    onClose();
  };

  return (
    <div className="excel-dialog-overlay" onClick={onClose}>
      <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 380, background: 'var(--surface, #fff)', borderRadius: 'var(--radius, 8px)', boxShadow: '0 8px 30px rgba(0,0,0,0.18)' }}>
        <div className="excel-dialog-titlebar">
          <span>Datenüberprüfung</span>
          <button className="excel-dialog-close" onClick={onClose} aria-label="Schließen"><X size={18} /></button>
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Column selector */}
          <label style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            Spalte:
            <select value={col} onChange={e => setCol(parseInt(e.target.value))}
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border, #ccc)', fontSize: '0.85rem' }}>
              {headers.map((h, i) => <option key={i} value={i}>{h || `Spalte ${i + 1}`}</option>)}
            </select>
          </label>

          {/* Validation type */}
          <label style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            Typ:
            <select value={type} onChange={e => setType(e.target.value as 'number' | 'list')}
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border, #ccc)', fontSize: '0.85rem' }}>
              <option value="number">Ganze Zahl / Dezimalzahl</option>
              <option value="list">Liste (Dropdown)</option>
            </select>
          </label>

          {/* Number validation */}
          {type === 'number' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <label style={{ fontSize: '0.85rem', flex: 1 }}>
                Minimum:
                <input type="number" value={min} onChange={e => setMin(e.target.value)}
                  style={{ width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border, #ccc)', fontSize: '0.85rem' }} />
              </label>
              <label style={{ fontSize: '0.85rem', flex: 1 }}>
                Maximum:
                <input type="number" value={max} onChange={e => setMax(e.target.value)}
                  style={{ width: '100%', padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border, #ccc)', fontSize: '0.85rem' }} />
              </label>
            </div>
          )}

          {/* List validation */}
          {type === 'list' && (
            <label style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
              Werte (getrennt mit Komma):
              <input type="text" value={list} onChange={e => setList(e.target.value)} placeholder="z.B.: Ja, Nein, Vielleicht"
                style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border, #ccc)', fontSize: '0.85rem' }} />
            </label>
          )}

          {/* Error message */}
          <label style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
            Fehlermeldung:
            <input type="text" value={errorMsg} onChange={e => setErrorMsg(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border, #ccc)', fontSize: '0.85rem' }} />
          </label>

          {/* Apply button */}
          <button onClick={handleApply}
            style={{
              marginTop: 4, padding: '8px 20px', background: 'var(--tertiary, #2563eb)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-sm, 6px)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
            }}>
            Übernehmen
          </button>
        </div>
      </div>
    </div>
  );
}
