// ── GoalSeekDialog: What-If Analysis Tool ──────────────────────────────
// Excel-style Goal Seek: find input value that yields desired output.
// Uses binary search with HyperFormula for evaluation.

import { useState, useRef, useEffect } from 'react';
import { Target, X } from 'lucide-react';

interface GoalSeekDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** Callback to evaluate a formula. Returns the numeric result or NaN. */
  evaluate: (formulaCell: string, variableCell: string, variableValue: number) => number;
  /** Callback when goal seek finds a solution */
  onResult: (variableCell: string, result: number) => void;
}

export default function GoalSeekDialog({ isOpen, onClose, evaluate, onResult }: GoalSeekDialogProps) {
  const [setCell, setSetCell] = useState('');
  const [toValue, setToValue] = useState('');
  const [byChangingCell, setByChangingCell] = useState('');
  const [status, setStatus] = useState<'idle' | 'searching' | 'found' | 'error'>('idle');
  const [result, setResult] = useState<number | null>(null);
  const [iterations, setIterations] = useState(0);
  const setCellRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSetCell('');
      setToValue('');
      setByChangingCell('');
      setStatus('idle');
      setResult(null);
      setIterations(0);
      setTimeout(() => setCellRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const isValid = setCell.trim() && toValue.trim() && byChangingCell.trim() &&
    /^[A-Z]+\d+$/i.test(setCell.trim()) &&
    /^[A-Z]+\d+$/i.test(byChangingCell.trim()) &&
    !isNaN(Number(toValue));

  // Goal Seek: binary search algorithm
  const handleSeek = () => {
    if (!isValid) return;
    setStatus('searching');
    setResult(null);
    setIterations(0);

    const target = Number(toValue);
    const formulaCell = setCell.trim().toUpperCase();
    const varCell = byChangingCell.trim().toUpperCase();

    // Run Goal Seek in a microtask to allow UI update
    setTimeout(() => {
      try {
        const solution = goalSeekBinary(
          formulaCell, varCell, target, evaluate, 0.0001, 100
        );
        if (solution !== null && isFinite(solution.value)) {
          setResult(solution.value);
          setIterations(solution.iterations || 0);
          setStatus('found');
          onResult(varCell, solution.value);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }, 50);
  };

  if (!isOpen) return null;

  return (
    <div className="excel-dialog-overlay" onClick={onClose}>
      <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="excel-dialog-titlebar">
          <span><Target size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />Zielwertsuche</span>
          <button className="excel-dialog-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label htmlFor="gs-set-cell" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Zielzelle</label>
              <input
                id="gs-set-cell"
                ref={setCellRef}
                type="text"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.9rem' }}
                placeholder="z.B. D10"
                value={setCell}
                onChange={e => setSetCell(e.target.value)}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>Zelle, die den Zielwert enthalten soll (muss eine Formel enthalten)</span>
            </div>

            <div>
              <label htmlFor="gs-to-value" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Zielwert</label>
              <input
                id="gs-to-value"
                type="text"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.9rem' }}
                placeholder="z.B. 450000"
                value={toValue}
                onChange={e => setToValue(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="gs-by-changing" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Veränderbare Zelle</label>
              <input
                id="gs-by-changing"
                type="text"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.9rem' }}
                placeholder="z.B. B5"
                value={byChangingCell}
                onChange={e => setByChangingCell(e.target.value)}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>Zelle, deren Wert geändert werden soll</span>
            </div>

            {/* Status display */}
            {status === 'searching' && (
              <div className="goal-seek-status" style={{ padding: '8px 0', color: 'var(--primary)', fontSize: '0.85rem' }}>
                Suche nach Lösung...
              </div>
            )}
            {status === 'found' && result !== null && (
              <div className="goal-seek-status" style={{ padding: '8px 0', color: '#2e7d32', fontSize: '0.85rem' }}>
                ✅ Lösung gefunden: <strong>{Number(result).toFixed(4)}</strong>
                <br />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Zielwert: {Number(toValue).toFixed(2)} • {iterations > 0 ? `${iterations} Iterationen` : ''}
                </span>
              </div>
            )}
            {status === 'error' && (
              <div className="goal-seek-status" style={{ padding: '8px 0', color: '#c62828', fontSize: '0.85rem' }}>
                ❌ Keine Lösung gefunden. Überprüfen Sie die Eingaben.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-outline" onClick={onClose}>Abbrechen</button>
              <button className="btn btn-primary" onClick={handleSeek} disabled={!isValid || status === 'searching'}>
                {status === 'searching' ? 'Suche...' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Goal Seek Algorithm (Binary Search) ─────────────────────────────────

interface GoalSeekResult {
  value: number;
  iterations: number;
}

function goalSeekBinary(
  formulaCell: string,
  variableCell: string,
  target: number,
  evaluate: (formulaCell: string, variableCell: string, varValue: number) => number,
  tolerance: number = 0.0001,
  maxIterations: number = 100,
): GoalSeekResult | null {
  // Strategy: Start with a broad search range, then binary search to narrow down

  // Phase 1: Find bounds where the function crosses the target
  let low = -1000000;
  let high = 1000000;
  let fLow = evaluate(formulaCell, variableCell, low);
  let fHigh = evaluate(formulaCell, variableCell, high);

  // If both are on the same side, try expanding
  let expandAttempts = 0;
  while ((fLow - target) * (fHigh - target) > 0 && expandAttempts < 20) {
    low *= 10;
    high *= 10;
    fLow = evaluate(formulaCell, variableCell, low);
    fHigh = evaluate(formulaCell, variableCell, high);
    expandAttempts++;
  }

  // If still no crossing, try starting from 0
  if ((fLow - target) * (fHigh - target) > 0) {
    low = 0;
    high = 1;
    fLow = evaluate(formulaCell, variableCell, low);
    fHigh = evaluate(formulaCell, variableCell, high);

    // Expand from 0
    let expandSteps = 0;
    while ((fLow - target) * (fHigh - target) > 0 && expandSteps < 30) {
      if (Math.abs(fLow - target) < Math.abs(fHigh - target)) {
        low = low - (high - low);
        fLow = evaluate(formulaCell, variableCell, low);
      } else {
        high = high + (high - low);
        fHigh = evaluate(formulaCell, variableCell, high);
      }
      expandSteps++;
    }

    if ((fLow - target) * (fHigh - target) > 0) {
      return null; // Cannot find bounds
    }
  }

  // Ensure low has f(low) <= target and high has f(high) >= target
  if (fLow > fHigh) {
    [low, high] = [high, low];
    [fLow, fHigh] = [fHigh, fLow];
  }

  // Phase 2: Binary search
  let iterations = 0;
  for (iterations = 0; iterations < maxIterations; iterations++) {
    const mid = (low + high) / 2;
    const fMid = evaluate(formulaCell, variableCell, mid);

    if (Math.abs(fMid - target) < tolerance) {
      return { value: mid, iterations };
    }

    if ((fLow - target) * (fMid - target) <= 0) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }

    if (Math.abs(high - low) < 1e-10) {
      return { value: (low + high) / 2, iterations };
    }
  }

  return { value: (low + high) / 2, iterations };
}
