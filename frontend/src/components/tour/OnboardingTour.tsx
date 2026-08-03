import { useState, useEffect, useRef, createContext, useContext, ReactNode, useCallback } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useReducedMotion } from '../a11y/Accessibility';

// ── Tour Context ──────────────────────────────────────────

interface TourStep {
  target: string;       // CSS selector for the element to highlight
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  spotlight?: boolean;  // Dim rest of page
}

interface TourState {
  active: boolean;
  currentStep: number;
  steps: TourStep[];
}

interface TourContextValue {
  startTour: (steps: TourStep[]) => void;
  endTour: () => void;
  isActive: boolean;
  currentStep: number;
}

const TourContext = createContext<TourContextValue>({
  startTour: () => {}, endTour: () => {}, isActive: false, currentStep: 0,
});

export function useTour() { return useContext(TourContext); }

// ── Tour Provider ─────────────────────────────────────────

export function TourProvider({ children }: { children: ReactNode }) {
  const [tour, setTour] = useState<TourState>({ active: false, currentStep: 0, steps: [] });

  const startTour = useCallback((steps: TourStep[]) => {
    setTour({ active: true, currentStep: 0, steps });
  }, []);

  const endTour = useCallback(() => {
    setTour({ active: false, currentStep: 0, steps: [] });
  }, []);

  const nextStep = () => {
    setTour(t => t.currentStep < t.steps.length - 1 ? { ...t, currentStep: t.currentStep + 1 } : t);
  };
  const prevStep = () => {
    setTour(t => t.currentStep > 0 ? { ...t, currentStep: t.currentStep - 1 } : t);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!tour.active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') nextStep();
      else if (e.key === 'ArrowLeft') prevStep();
      else if (e.key === 'Escape') endTour();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tour.active, tour.steps.length]);

  return (
    <TourContext.Provider value={{ startTour, endTour, isActive: tour.active, currentStep: tour.currentStep }}>
      {children}
      {tour.active && tour.steps.length > 0 && (
        <TourOverlay
          step={tour.steps[tour.currentStep]}
          stepIndex={tour.currentStep}
          totalSteps={tour.steps.length}
          onNext={nextStep}
          onPrev={prevStep}
          onEnd={endTour}
        />
      )}
    </TourContext.Provider>
  );
}

// ── Tour Overlay Component ────────────────────────────────

function TourOverlay({ step, stepIndex, totalSteps, onNext, onPrev, onEnd }: {
  step: TourStep; stepIndex: number; totalSteps: number;
  onNext: () => void; onPrev: () => void; onEnd: () => void;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = document.querySelector(step.target);
    if (el) {
      const r = el.getBoundingClientRect();
      setRect(r);
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [step.target]);

  // Position tooltip relative to target
  const tooltipStyle: React.CSSProperties = { position: 'fixed', zIndex: 10000 };
  if (rect) {
    const pad = 16;
    switch (step.position) {
      case 'bottom':
        tooltipStyle.top = rect.bottom + pad;
        tooltipStyle.left = Math.max(16, rect.left + rect.width / 2 - 180);
        break;
      case 'top':
        tooltipStyle.bottom = window.innerHeight - rect.top + pad;
        tooltipStyle.left = Math.max(16, rect.left + rect.width / 2 - 180);
        break;
      case 'right':
        tooltipStyle.left = rect.right + pad;
        tooltipStyle.top = Math.max(16, rect.top + rect.height / 2 - 80);
        break;
      case 'left':
        tooltipStyle.right = window.innerWidth - rect.left + pad;
        tooltipStyle.top = Math.max(16, rect.top + rect.height / 2 - 80);
        break;
    }
  } else {
    // Fallback: center
    tooltipStyle.top = '30%'; tooltipStyle.left = '50%'; tooltipStyle.transform = 'translate(-50%, -50%)';
  }

  return (
    <>
      {/* Spotlight backdrop */}
      {step.spotlight !== false && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.5)', transition: 'background 0.3s',
        }} onClick={onEnd} />
      )}

      {/* Highlight ring around target */}
      {rect && step.spotlight !== false && (
        <div style={{
          position: 'fixed', zIndex: 9999,
          top: rect.top - 4, left: rect.left - 4,
          width: rect.width + 8, height: rect.height + 8,
          borderRadius: 8,
          boxShadow: '0 0 0 4px var(--accent, #ff8f00), 0 0 0 9999px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }} />
      )}

      {/* Tooltip */}
      <div ref={tooltipRef} className="tour-tooltip"
        style={{
          ...tooltipStyle,
          animation: reducedMotion ? 'none' : 'slideUp 0.25s ease',
        }}
        role="dialog" aria-label={`Tour Schritt ${stepIndex + 1}`} aria-modal="true">
        {/* Step counter */}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
          Schritt {stepIndex + 1} von {totalSteps}
        </div>

        <h3 style={{ marginBottom: 8, fontSize: '1.1rem', color: 'var(--text)' }}>
          {step.title}
        </h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 20 }}>
          {step.content}
        </p>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, justifyContent: 'center' }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === stepIndex ? 'var(--primary)' : i < stepIndex ? 'var(--primary-light)' : '#e0e0e0',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <div>
            {stepIndex > 0 && (
              <button className="btn btn-outline btn-sm" onClick={onPrev} aria-label="Vorheriger Schritt">
                ← Zurück
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm" onClick={onEnd}
              style={{ background: 'transparent', color: 'var(--text-muted)' }}>
              Überspringen
            </button>
            <button className="btn btn-primary btn-sm" onClick={onNext} aria-label={stepIndex < totalSteps - 1 ? 'Nächster Schritt' : 'Abschließen'}>
              {stepIndex < totalSteps - 1 ? <span>Weiter <ArrowRight size={14} style={{verticalAlign:'middle'}} /></span> : <span><CheckCircle size={14} style={{marginRight:4}} />Los geht's!</span>}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

// ── Pre-built Tours ───────────────────────────────────────

export const HOME_TOUR: TourStep[] = [
  {
    target: '.navbar-brand',
    title: 'Willkommen bei Excel-lenz!',
    content: 'Excel-lenz ist dein interaktiver Excel-Lernportal. Lerne Excel-Formeln, Datenanalyse und mehr — direkt im Browser mit echter Tabellenkalkulation.',
    position: 'bottom',
  },
  {
    target: '.navbar-links a[href="/courses"]',
    title: 'Kurse entdecken',
    content: 'Hier findest du alle verfügbaren Kurse — von Excel-Grundlagen bis zu fortgeschrittener Datenanalyse mit echten Übungen.',
    position: 'bottom',
  },
  {
    target: '.hero-section button, a[href="/register"]',
    title: 'Loslegen',
    content: 'Erstelle ein Konto und beginne sofort mit deiner ersten Übung. Dein Fortschritt wird automatisch gespeichert.',
    position: 'bottom',
  },
];

export const EXERCISE_TOUR: TourStep[] = [
  {
    target: '.instructions-panel',
    title: 'Aufgabenstellung',
    content: 'Lies die Anweisungen sorgfältig. Hier siehst du auch Lernziele und kannst bei Bedarf Tipps einblenden.',
    position: 'right',
  },
  {
    target: '.formula-input',
    title: 'Formeln eingeben',
    content: 'Gib Formeln mit = ein (z.B. =SUMME(A1:A10)). Die Formelleiste bietet Autovervollständigung und Syntax-Highlighting.',
    position: 'bottom',
  },
  {
    target: '.spreadsheet-container',
    title: 'Dein Arbeitsblatt',
    content: 'Grüne Spalten sind Bearbeitungsbereiche. Klicke auf eine Zelle und gib deine Lösung ein. Mit Tab/Enter navigierst du weiter.',
    position: 'top',
  },
  {
    target: '.btn-success',
    title: 'Lösung prüfen',
    content: 'Klicke hier, um deine Lösung zu überprüfen. Bei Fehlern erhältst du detailliertes Feedback und kannst es erneut versuchen.',
    position: 'left',
  },
];

export const DASHBOARD_TOUR: TourStep[] = [
  {
    target: '.stat-card',
    title: 'Deine Statistiken',
    content: 'Verfolgen Sie Ihren Fortschritt: Kompetenzpunkte, Niveau, Konstanz-Tage und abgeschlossene Übungen auf einen Blick.',
    position: 'bottom',
  },
  {
    target: 'a[href="/courses"]',
    title: 'Weiterlernen',
    content: 'Kehre zu den Kursen zurück, um neue Übungen zu entdecken oder frühere zu wiederholen.',
    position: 'bottom',
  },
];
