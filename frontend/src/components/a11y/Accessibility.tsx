import { useEffect, useRef } from 'react';

// ── Screen Reader Live Region ─────────────────────────────

let announceCallback: ((msg: string, mode?: 'polite'|'assertive') => void) | null = null;

/** Announce a message to screen readers globally */
export function announce(msg: string, mode: 'polite' | 'assertive' = 'polite') {
  if (announceCallback) announceCallback(msg, mode);
}

export function LiveRegion() {
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    announceCallback = (msg, mode) => {
      const el = mode === 'assertive' ? assertiveRef.current : politeRef.current;
      if (el) {
        el.textContent = ''; // Clear first to retrigger
        requestAnimationFrame(() => { el.textContent = msg; });
      }
    };
    return () => { announceCallback = null; };
  }, []);

  return (
    <>
      <div ref={politeRef} role="status" aria-live="polite" aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}
      />
      <div ref={assertiveRef} role="alert" aria-live="assertive" aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}
      />
    </>
  );
}

// ── Skip Navigation Link ──────────────────────────────────

export function SkipNav() {
  return (
    <a href="#main-content" className="skip-nav"
      style={{
        position: 'absolute', top: -100, left: 8, zIndex: 9999,
        padding: '8px 16px', background: 'var(--primary)', color: '#fff',
        borderRadius: '0 0 4px 4px', fontWeight: 600, fontSize: '0.9rem',
        textDecoration: 'none', transition: 'top 0.2s',
      }}
      onFocus={e => { (e.target as HTMLElement).style.top = '0'; }}
      onBlur={e => { (e.target as HTMLElement).style.top = '-100px'; }}
    >
      Zum Hauptinhalt springen
    </a>
  );
}

// ── Focus Trap for Modals ─────────────────────────────────

export function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active || !containerRef.current) return;
    const el = containerRef.current;
    const focusable = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const nodes = el.querySelectorAll(focusable);
      const first = nodes[0] as HTMLElement;
      const last = nodes[nodes.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first?.focus();
      }
    };

    // Focus first element
    const firstEl = el.querySelector(focusable) as HTMLElement;
    firstEl?.focus();

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [active, containerRef]);
}

// ── Reduced Motion / Prefers-reduced-motion ───────────────

export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
