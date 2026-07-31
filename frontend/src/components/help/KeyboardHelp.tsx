import { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { key: 'Tab', desc: 'Nächste Zelle' },
  { key: 'Shift+Tab', desc: 'Vorherige Zelle' },
  { key: 'Enter', desc: 'Nächste Zeile' },
  { key: 'F2', desc: 'Zelle bearbeiten' },
  { key: '=', desc: 'Formel starten' },
  { key: 'Ctrl+Z', desc: 'Rückgängig' },
  { key: 'Ctrl+Y', desc: 'Wiederherstellen' },
  { key: 'Ctrl+Pfeil', desc: 'Zum Rand springen' },
  { key: 'Delete', desc: 'Zelle löschen' },
  { key: 'Esc', desc: 'Formel abbrechen' },
  { key: '?', desc: 'Diese Hilfe' },
];

export default function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '?') { e.preventDefault(); setOpen(prev => !prev); }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  if (!open) return null;

  return (
    <div className="kb-help-overlay" onClick={() => setOpen(false)}>
      <div className="kb-help-modal" onClick={e => e.stopPropagation()} role="dialog" aria-label="Tastenkürzel">
        <h2>
          <span><Keyboard size={18} style={{marginRight:6, verticalAlign:'middle'}} />Tastenkürzel</span>
          <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            aria-label="Schließen"><X size={18} /></button>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SHORTCUTS.map(s => (
            <div key={s.key} className="flex items-center justify-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.desc}</span>
              <kbd>{s.key}</kbd>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 14, textAlign: 'center' }}>
          Drücke <kbd>?</kbd> zum Schließen
        </p>
      </div>
    </div>
  );
}
