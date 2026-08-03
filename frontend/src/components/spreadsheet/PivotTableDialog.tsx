// ── PivotTableDialog: Interactive pivot table overlay ────────────────────
// Uses react-pivottable for drag-and-drop pivot table creation

import { useState, useEffect, useRef } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import { X } from 'lucide-react';

interface PivotTableDialogProps {
  visible: boolean;
  rawData: Record<string, string | number>[];
  onClose: () => void;
}

export default function PivotTableDialog({ visible, rawData, onClose }: PivotTableDialogProps) {
  const [pivotState, setPivotState] = useState<any>({});

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

  if (!visible) return null;

  return (
    <div className="excel-dialog-overlay" onClick={onClose}>
      <div className="excel-dialog" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: 960, maxHeight: '85vh', background: 'var(--surface, #fff)', borderRadius: 'var(--radius, 8px)', boxShadow: '0 8px 30px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column' }}>
        <div className="excel-dialog-titlebar">
          <span>PivotTable</span>
          <button className="excel-dialog-close" onClick={onClose} aria-label="Schließen"><X size={18} /></button>
        </div>
        <div style={{ flex: 1, padding: 12, overflow: 'auto' }}>
          {rawData.length > 0 ? (
            <PivotTableUI
              data={rawData}
              onChange={(s: any) => setPivotState(s)}
              {...pivotState}
              unusedOrientationCutoff={80}
            />
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted, #999)' }}>
              Keine Daten verfügbar. Bitte wählen Sie einen Bereich aus und öffnen Sie die PivotTable erneut.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
