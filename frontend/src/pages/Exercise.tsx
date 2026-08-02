import { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lightbulb, Trophy, CheckCircle, ThumbsUp, BookOpen, Award, HelpCircle, Search, Sprout, ThumbsDown, Bike, Loader2, LogIn, ArrowRight, ArrowLeft, Star, Target, ListChecks, Clock, MessageCircle, Eye } from 'lucide-react';
import { apiFetch, useAuth } from '../context/AuthContext';
import { BadgeModal, XPFlying, ExcelSpinner } from '../components/animations/Celebrations';
import { announce } from '../components/a11y/Accessibility';
import QuizExercise from '../components/quiz/QuizExercise';
import { useTour, EXERCISE_TOUR } from '../components/tour/OnboardingTour';
import Comments from '../components/community/Comments';
import KeyboardHelp from '../components/help/KeyboardHelp';

// Lazy-load heavy spreadsheet component (Handsontable + HyperFormula ~4.5MB)
const SpreadsheetHandsontable = lazy(() => import('../components/spreadsheet/SpreadsheetHandsontable'));
import type { CellFormats } from '../components/spreadsheet/types';
import { useDailyGoal } from '../context/DailyGoalContext';
import { useExerciseTimer } from '../hooks/useAnalytics';

interface TemplateData {
  cols: number;
  rows: number;
  headers: string[];
  data: (string | number | null)[][];
  taskCols: number[];
  formulaHint?: string;
  hint1?: string;
  hint2?: string;
  hint3?: string;
  estimated_minutes?: number;
  learningObjectives?: string[];
  theory?: string;
  theoryTitle?: string;
  /** Multi-sheet exercises: pre-populated sheets */
  sheets?: { name: string; headers: string[]; data: (string | number | null)[][] }[];
}

interface ExerciseData {
  id: string;
  course_id: string;
  title: string;
  description: string;
  instructions: string;
  template_data: TemplateData;
  progress: { completed: number; score: number } | null;
}

export default function Exercise() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState<(string | number | null)[][]>([]);
  const [cellFormats, setCellFormats] = useState<CellFormats>({});
  const [xpGained, setXpGained] = useState<number | null>(null);
  const [showSuccessCheck, setShowSuccessCheck] = useState(false);
  const [showXpFly, setShowXpFly] = useState(false);
  const [newBadge, setNewBadge] = useState<{ icon: string; name: string; description: string } | null>(null);
  const [previousBadgeCount, setPreviousBadgeCount] = useState(0);
  const [correctCells, setCorrectCells] = useState(0);
  const [totalCells, setTotalCells] = useState(0);
  const [feedbackHint, setFeedbackHint] = useState<React.ReactNode>('');
  const [showReflection, setShowReflection] = useState(false);
  const [mode, setMode] = useState<'practice' | 'exam'>('practice');
  const [exerciseTab, setExerciseTab] = useState<'instructions' | 'theory' | 'community'>('theory');
  const [attemptCount, setAttemptCount] = useState(0);
  const [hintLevel, setHintLevel] = useState(1); // Show first hint by default
  const [showSolution, setShowSolution] = useState(false);
  const [cellFeedback, setCellFeedback] = useState<{ row: number; col: number; expected: any; got: any }[]>([]);
  // Bug #16 fix: memoize errorCells prop to avoid new array ref on every parent render
  const errorCellsProp = useMemo(
    () => cellFeedback.length > 0
      ? cellFeedback.map(fb => ({
          row: fb.row,
          col: fb.col,
          expected: String(fb.expected),
          got: fb.got != null ? String(fb.got) : null,
        }))
      : undefined,
    [cellFeedback]
  );
  const [focusMode, setFocusMode] = useState(false);
  const { startTour } = useTour();
  const { increment: incrementGoal } = useDailyGoal();
  const scoreRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLElement>(null);
  const [gridHeight, setGridHeight] = useState(320);
  // Bug #13 fix: throttle resize handler via requestAnimationFrame
  useEffect(() => {
    let rafId: number | null = null;
    const update = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setGridHeight(Math.max(280, window.innerHeight - 520));
      });
    };
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const [nextExercise, setNextExercise] = useState<{ id: string; title: string; estimated_minutes?: number } | null>(null);
  const [prevExercise, setPrevExercise] = useState<{ id: string; title: string } | null>(null);
  const { trackSubmit } = useExerciseTimer(id || '');

  // Focus Mode — hide navbar/footer
  useEffect(() => {
    if (focusMode) document.body.classList.add('focus-mode');
    else document.body.classList.remove('focus-mode');
    return () => document.body.classList.remove('focus-mode');
  }, [focusMode]);

  // gridHeight is set directly via useState above

  // Cleanup timers on unmount to prevent setState on unmounted component
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      abortRef.current?.abort();
    };
  }, []);

  // Prevent accidental navigation only if user has modified data (dirty check)
  // Bug #11.1 fix: use isDirtyRef instead of JSON.stringify for beforeunload
  const isDirtyRef = useRef(false);
  const originalDataRef = useRef<string>('');
  useEffect(() => {
    if (exercise && !originalDataRef.current) {
      originalDataRef.current = JSON.stringify(exercise.template_data.data);
    }
  }, [exercise]);

  // Bug #11.1: isDirtyRef replaces spreadsheetDataRef for beforeunload check
  // (avoids JSON.stringify on large grids blocking the main thread on tab close)
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (exercise && !exercise.progress?.completed && isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [exercise]);

  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      // Auto-remove from tracking array once executed to prevent memory leak
      timersRef.current = timersRef.current.filter(t => t !== id);
      fn();
    }, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  // Progressive hints (4 levels)
  const hints = [
    exercise?.template_data?.hint1 || exercise?.template_data?.formulaHint || 'Denken Sie an die passende Excel-Funktion.',
    exercise?.template_data?.hint2 || 'Überprüfen Sie den Zellbereich — welche Zellen müssen einbezogen werden?',
    exercise?.template_data?.hint3 || 'Die Lösung ähnelt: =FUNKTION(Bereich)',
    'Vollständige Lösung anzeigen',
  ];

  useEffect(() => {
    // Bug fix: reset loading state + exercise-specific state when id changes
    // to prevent stale data from previous exercise bleeding through
    setLoading(true);
    setScore(null);
    setCellFeedback([]);
    setShowSolution(false);
    setHintLevel(1);
    setAttemptCount(0);
    setShowSuccessCheck(false);
    setShowXpFly(false);
    setNewBadge(null);
    setShowReflection(false);
    isDirtyRef.current = false;
    originalDataRef.current = '';

    const controller = new AbortController();
    abortRef.current = controller;
    const signal = controller.signal;

    apiFetch(`/exercises/${id}`, { signal })
      .then((data) => {
        if (signal.aborted) return;
        setExercise(data);
        if (data.progress?.completed && data.progress?.submitted_data) {
          try {
            const saved = JSON.parse(data.progress.submitted_data);
            setSpreadsheetData(saved);
          } catch {
            setSpreadsheetData(JSON.parse(JSON.stringify(data.template_data.data)));
          }
          setScore(data.progress.score);
        } else {
          // Bug #28 fix: deep clone template data to prevent reference sharing
          setSpreadsheetData(JSON.parse(JSON.stringify(data.template_data.data)));
          // Bug #25 fix: reset attemptCount on new exercise load
          setAttemptCount(0);
        }
        // Fetch next exercise in course sequence
        apiFetch(`/courses/${data.course_id}`, { signal })
          .then((course: { exercises: { id: string; title: string; estimated_minutes?: number }[] }) => {
            if (signal.aborted) return;
            const currentIdx = course.exercises.findIndex((e: { id: string }) => e.id === id);
            if (currentIdx >= 0) {
              if (currentIdx < course.exercises.length - 1) {
                setNextExercise(course.exercises[currentIdx + 1]);
              }
              if (currentIdx > 0) {
                setPrevExercise(course.exercises[currentIdx - 1]);
              }
            }
          })
          .catch(() => { /* course fetch failure is non-critical */ });
      })
      .catch((err) => {
        if (!signal.aborted) console.error(err);
      })
      .finally(() => {
        if (!signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  const handleSubmit = async () => {
    if (!exercise) return;
    setSubmitting(true);
    try {
      const submitData = spreadsheetData;
      const result = await apiFetch(`/exercises/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ data: submitData, formats: cellFormats }),
      });
      setScore(result.score);
      setAttemptCount(c => c + 1);
      trackSubmit(result.score);

      // Use exact cell counts from backend
      if (result.correctCells !== undefined && result.totalCells !== undefined) {
        setCorrectCells(result.correctCells);
        setTotalCells(result.totalCells);
      }

      // Generate cell-level feedback
      if (result.score < 100 && result.details) {
        setCellFeedback(result.details || []);
        announce(`Ergebnis: ${result.score} Prozent. ${result.details.length} Fehler gefunden.`, 'assertive');
        // Growth-oriented hint based on score tier — generic strategy advice
        if (result.score < 30) {
          setFeedbackHint(<><Lightbulb size={14} style={{marginRight:4}} />Tipp: Überprüfe die verwendete Funktion — ist es die richtige für diese Aufgabe? Ein Blick in die Theorie hilft!</>);
        } else if (result.score < 70) {
          setFeedbackHint(<><Lightbulb size={14} style={{marginRight:4}} />Fast geschafft! Überprüfe die Zellbezüge — hast du den richtigen Bereich ausgewählt?</>);
        } else {
          setFeedbackHint(<><Lightbulb size={14} style={{marginRight:4}} />So knapp! Nur noch kleine Fehler — achte auf absolute vs. relative Bezüge ($).</>);
        }
      } else if (result.score === 100) {
        setFeedbackHint('');
        setShowReflection(true);
      }

      // Increment hint level on wrong answer (only in practice mode)
      if (result.score < 100 && mode === 'practice') {
        setHintLevel((h) => Math.min(h + 1, 4));
      }

      // Fetch updated gamification stats — use xpGained from backend if available
      try {
        const gami = await apiFetch('/gamification/stats');
        const gained = result.xpGained || 50;
        setXpGained(gained);
        setShowXpFly(true);
        safeTimeout(() => setShowXpFly(false), 2000);

        // Only show badge if a new one was earned
        if (gami?.badges?.length && gami.badges.length > previousBadgeCount) {
          const lastBadge = gami.badges[gami.badges.length - 1];
          setNewBadge({ icon: lastBadge.icon, name: lastBadge.name, description: lastBadge.description });
          setPreviousBadgeCount(gami.badges.length);
        }

        if (result.score >= 100) {
          setShowSuccessCheck(true);
          announce('Perfekt! 100 Prozent erreicht!', 'assertive');
          safeTimeout(() => setShowSuccessCheck(false), 3000);
        }
      } catch {
        // Bug #11.2 fix: still award XP even if gamification endpoint fails
        setXpGained(result.xpGained || 50);
        setShowXpFly(true);
        safeTimeout(() => setShowXpFly(false), 2000);
        if (result.score >= 100) {
          setShowSuccessCheck(true);
          safeTimeout(() => setShowSuccessCheck(false), 3000);
        }
      }
      // Track daily goal progress — only count meaningful attempts
      if (result.score > 0) {
        incrementGoal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ExcelSpinner text="Übung wird geladen..." />;
  if (!exercise) return (
    <div className="empty-state" style={{ padding: '80px 24px' }}>
      <h2>Übung nicht gefunden</h2>
      <p style={{ marginBottom: 20 }}>Die angeforderte Übung existiert nicht oder wurde entfernt.</p>
      <Link to="/courses" className="btn btn-primary">Zur Kursübersicht</Link>
    </div>
  );

  const template = exercise.template_data;

  // ── Quiz exercise type: no spreadsheet, just Q&A ──────────────────────
  if (template.type === 'quiz' && template.questions) {
    const handleQuizSubmit = async (answers: number[][]) => {
      setSubmitting(true);
      try {
        const result = await apiFetch(`/exercises/${id}/submit`, {
          method: 'POST',
          body: JSON.stringify({ type: 'quiz', answers }),
        });
        setScore(result.score);
        setAttemptCount(c => c + 1);
        trackSubmit(result.score);
        try {
          const gami = await apiFetch('/gamification/stats');
          setXpGained(result.xpGained || 50);
          setShowXpFly(true);
          safeTimeout(() => setShowXpFly(false), 2000);
        } catch { setXpGained(result.xpGained || 50); setShowXpFly(true); }
        if (result.score > 0) incrementGoal();
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="exercise-page">
        <div className="flex items-center gap-sm" style={{ marginBottom: 12 }}>
          <Link to="/courses" className="btn btn-outline btn-sm" aria-label="Zurück zu den Kursen">
            <ArrowLeft size={14} style={{marginRight:6}} /> Zurück zu den Kursen
          </Link>
          {/* Prev/Next navigation */}
          <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
            {prevExercise && (
              <Link to={`/exercises/${prevExercise.id}`} className="btn btn-outline btn-sm"
                style={{ padding: '6px 10px' }} title={`Vorherige: ${prevExercise.title}`}>
                <ArrowLeft size={14} />
              </Link>
            )}
            {nextExercise && (
              <Link to={`/exercises/${nextExercise.id}`} className="btn btn-outline btn-sm"
                style={{ padding: '6px 10px' }} title={`Nächste: ${nextExercise.title}`}>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link> › <Link to="/courses" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Kurse</Link> › Übung
          </span>
        </div>
        <h1 style={{ marginBottom: 6 }}>{exercise.title}</h1>
        <p className="exercise-description" style={{ marginBottom: 14, fontSize: '1.05rem' }}>{exercise.description}</p>
        <QuizExercise
          questions={template.questions}
          onSubmit={handleQuizSubmit}
          submitting={submitting}
          score={score}
        />
        <XPFlying xp={xpGained || 0} sourceRef={scoreRef} trigger={showXpFly} />
        <BadgeModal show={!!newBadge} badge={newBadge} onClose={() => setNewBadge(null)} />
      </div>
    );
  }

  const scoreClass = score === null ? '' : score >= 80 ? 'score-success' : score >= 50 ? 'score-partial' : 'score-fail';

  const scoreIcon = score === null ? null :
    score >= 80 ? <CheckCircle size={20} style={{marginRight:4}} /> : score >= 50 ? <ThumbsUp size={20} style={{marginRight:4}} /> : <BookOpen size={20} style={{marginRight:4}} />;

  const scoreMessage = score === null ? '' :
    score >= 80 ? 'Kompetenz nachgewiesen' :
    score >= 50 ? 'Gute Fortschritte — weiter üben' :
    'Grundlagen vertiefen';

  return (
    <div className="exercise-page">
      <div className="flex items-center gap-sm" style={{ marginBottom: 12 }}>
        <Link to="/courses" className="btn btn-outline btn-sm" aria-label="Zurück zu den Kursen">
          <ArrowLeft size={14} style={{marginRight:6}} /> Zurück zu den Kursen
        </Link>
        {/* Prev/Next navigation */}
        <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
          {prevExercise && (
            <Link to={`/exercises/${prevExercise.id}`} className="btn btn-outline btn-sm"
              style={{ padding: '6px 10px' }} title={`Vorherige: ${prevExercise.title}`}>
              <ArrowLeft size={14} />
            </Link>
          )}
          {nextExercise && (
            <Link to={`/exercises/${nextExercise.id}`} className="btn btn-outline btn-sm"
              style={{ padding: '6px 10px' }} title={`Nächste: ${nextExercise.title}`}>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 4px' }}>›</span>
          <Link to="/courses" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Kurse</Link>
          <span style={{ margin: '0 4px' }}>›</span>
          <span style={{ color: 'var(--text)' }}>Übung</span>
        </span>
      </div>

      <h1 style={{ marginBottom: 6 }}>
        {exercise.title}
        <button
          onClick={() => setFocusMode(!focusMode)}
          className="btn btn-sm ml-sm"
          style={{ fontSize: '0.75rem', padding: '4px 10px', verticalAlign: 'middle' }}
          title={focusMode ? 'Fokus-Modus verlassen' : 'Fokus-Modus: blendet Navigation aus'}
        >
          {focusMode ? 'Fokus aus' : 'Fokus'}
        </button>
      </h1>

      <p className="exercise-description" style={{ marginBottom: 14, marginTop: 0, fontSize: '1.05rem' }}>
        {exercise.description}
      </p>

      <div className="flex items-center gap-md mb-3 flex-wrap">
        {exercise.template_data?.estimated_minutes && (
          <span className="exercise-meta-tag"><Clock size={14} style={{marginRight:4}} />~{exercise.template_data.estimated_minutes} Min</span>
        )}
        <span className="kb-hint" title="Drücken Sie ? für Tastenkürzel">
          <kbd>?</kbd> Tastenkürzel
        </span>
      </div>

      <div className="exercise-layout">
        <section className="instructions-panel" ref={leftPanelRef} aria-label="Aufgabenstellung und Hinweise">

          {/* ── TABS ── */}
          <div className="exercise-tabs">
            {[
              { key: 'theory' as const, icon: <BookOpen size={16} />, label: 'Theorie' },
              { key: 'instructions' as const, icon: <ListChecks size={16} />, label: 'Anleitung' },
              { key: 'community' as const, icon: <MessageCircle size={16} />, label: 'Community' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setExerciseTab(tab.key)}
                className={`exercise-tab ${exerciseTab === tab.key ? 'active' : ''}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="instructions-scroll">

          {/* ── TAB: INSTRUCTIONS ── */}
          {exerciseTab === 'instructions' && (
            <>
              {/* Guided Steps — parse instructions into numbered steps */}
              {(() => {
                const steps = exercise.instructions
                  .split(/\n+/)
                  .filter((s: string) => s.trim().length > 0);
                if (steps.length <= 1) {
                  return (
                    <div className="theory-box" style={{ marginBottom: 16 }}>
                      {exercise.instructions}
                    </div>
                  );
                }
                const completedCount = score !== null ? (score >= 80 ? steps.length : Math.floor(steps.length * (score / 100))) : 0;
                return (
                  <div className="mb-3">
                    {steps.map((step: string, i: number) => (
                      <div key={i} className={`exercise-step ${i < completedCount ? 'completed' : ''}`}>
                        <span className={`exercise-step-num ${i < completedCount ? 'done' : ''}`}>
                          {i < completedCount ? '✓' : i + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                    {score !== null && completedCount < steps.length && (
                      <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
                        {completedCount}/{steps.length} Schritte erfüllt — weiter üben!
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Initial Tipp — always visible */}
              {mode === 'practice' && score === null && (template.formulaHint || hints[0]) && (
                <div className="hint-box">
                  <Lightbulb size={14} style={{marginRight:4, color: 'var(--accent)'}} />
                  <strong>Tipp:</strong> {template.formulaHint || hints[0]}
                </div>
              )}

              {/* Progressive Hints */}
              {mode === 'practice' && hintLevel > 1 && (
                <div className="mt-3">
                  {hints.slice(1, Math.min(hintLevel, hints.length)).map((hint, i) => (
                    <div key={i} className="hint-box-tip border-left-primary">
                      <strong><Lightbulb size={12} style={{marginRight:4}} />Tipp {i + 2}:</strong> {hint}
                    </div>
                  ))}
                  {/* Lösung section */}
                  {hintLevel > hints.length && (
                    <div className="hint-box-tip border-left-tertiary">
                      <strong><Award size={12} style={{marginRight:4}} />Lösung:</strong>{' '}
                      {template.formulaHint ? (
                        <span>
                          <button className="btn btn-sm btn-outline" style={{ marginLeft: 8 }}
                            onClick={() => setShowSolution(!showSolution)}>
                            {showSolution ? 'Ausblenden' : 'Anzeigen'}
                          </button>
                          {showSolution && (
                            <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                              {template.formulaHint}
                            </pre>
                          )}
                        </span>
                      ) : hints[hints.length - 1]}
                    </div>
                  )}
                  {hintLevel > 0 && score !== null && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
                      War dieser Hinweis hilfreich?{' '}
                      <button className="btn btn-sm" style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'var(--success-light)', color: 'var(--success)', border: 'none' }}
                        onClick={() => announce('Danke für dein Feedback!', 'polite')}><ThumbsUp size={11} /> Ja</button>
                      {' '}
                      <button className="btn btn-sm" style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'var(--danger-light)', color: 'var(--danger)', border: 'none' }}
                        onClick={() => announce('Danke! Wir verbessern die Hinweise.', 'polite')}><ThumbsDown size={11} /> Nein</button>
                    </p>
                  )}
                </div>
              )}

              {/* Tipp button — more hints */}
              {mode === 'practice' && hintLevel < hints.length + 1 && hintLevel >= 1 && score === null && hints.length > 1 && (
                <button className="btn btn-sm btn-outline mt-2"
                  onClick={() => setHintLevel((h) => Math.min(h + 1, hints.length + 1))}>
                  <Lightbulb size={14} style={{marginRight:4}} />{hintLevel >= hints.length ? 'Lösung anzeigen' : 'Weitere Tipps'}
                </button>
              )}

              {/* Cell-level Feedback */}
              {cellFeedback.length > 0 && score !== null && score < 100 && (
                <div className="mt-3" role="alert" aria-live="polite">
                  {attemptCount === 1 && (
                    <p className="feedback-growth">
                      <Sprout size={14} style={{marginRight:4}} />
                      <strong>Lernfortschritt:</strong> Die markierten Zellen zeigen Ihnen, wo Sie Ihre Formel noch verfeinern können.
                    </p>
                  )}
                  <h4 className="text-sm mb-1">
                    <Search size={14} style={{marginRight:4, color: 'var(--danger)'}} />Fehler gefunden:
                  </h4>
                  {cellFeedback.map((fb, i) => (
                    <div key={i} className="error-feedback-box">
                      <strong>Zelle {String.fromCharCode(65 + fb.col)}{fb.row + 1}:</strong>{' '}
                      Erwartet: <code>{fb.expected}</code> — Erhalten: <code>{fb.got ?? 'leer'}</code>
                    </div>
                  ))}
                  {mode === 'practice' && hintLevel < 4 && (
                    <button className="btn btn-sm btn-outline mt-1"
                      onClick={() => setHintLevel((h) => Math.min(h + 1, 4))}>
                      <Lightbulb size={14} style={{marginRight:4}} />Tipp anzeigen
                    </button>
                  )}
                </div>
              )}

              {/* Score display */}
              {score !== null && (
                <div className="score-display" ref={scoreRef} role="status" aria-live="polite">
                  <div className={`score-circle ${scoreClass}`}>{score}%</div>
                  <p className="text-secondary text-base">
                    {scoreIcon} {scoreMessage}
                  </p>
                  {totalCells > 0 && (
                    <p className="text-sm" style={{ color: 'var(--text-muted)', marginTop: 2 }}>
                      {correctCells}/{totalCells} Zellen korrekt
                    </p>
                  )}
                  {xpGained !== null && (
                    <p className="text-primary font-semibold text-sm mt-1">
                      <Trophy size={14} style={{marginRight:4}} />+{xpGained} KP
                    </p>
                  )}
                  {score >= 50 && nextExercise && (
                    <div className="next-exercise-card">
                      <p className="text-2xs" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                        <ArrowRight size={12} style={{marginRight:4}} />Nächste Übung: {nextExercise.title}
                      </p>
                      <Link to={`/exercises/${nextExercise.id}`} className="btn btn-primary btn-sm">Weiter →</Link>
                    </div>
                  )}
                  {showReflection && (
                    <div className="reflection-box">
                      <p className="font-semibold text-sm mb-1">
                        <Star size={14} style={{marginRight:4}} />Was hast du gelernt?
                      </p>
                      <p className="text-sm text-secondary mb-1">
                        {exercise.template_data?.learningObjectives?.[0] || 'Du hast eine neue Excel-Funktion gemeistert!'}
                      </p>
                      <button className="btn btn-sm btn-outline" onClick={() => setShowReflection(false)}>
                        <CheckCircle size={14} style={{marginRight:4}} />Verstanden — weiter!
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── TAB: THEORY ── */}
          {exerciseTab === 'theory' && (
            <>
              {exercise.template_data?.learningObjectives && (
                <div className="learning-objectives">
                  <h4>
                    <Target size={14} style={{marginRight:6, verticalAlign:'middle'}} />Lernziele
                  </h4>
                  <ul>
                    {(exercise.template_data.learningObjectives as string[]).map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {exercise.template_data?.theory ? (
                <div className="theory-box">
                  <h4 style={{ fontSize: '0.9rem', margin: '0 0 10px 0', color: 'var(--primary)' }}>
                    <BookOpen size={14} style={{marginRight:6, verticalAlign:'middle'}} />
                    {exercise.template_data.theoryTitle || 'Konzept verstehen'}
                  </h4>
                  <div dangerouslySetInnerHTML={{
                    __html: exercise.template_data.theory
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                  }} />
                </div>
              ) : (
                <p className="empty-state">
                  Keine Theorie für diese Übung verfügbar.
                </p>
              )}
            </>
          )}

          {/* ── TAB: COMMUNITY ── */}
          {exerciseTab === 'community' && (
            <Comments exerciseId={exercise.id} />
          )}

          {/* ── STICKY BOTTOM BAR ── */}
          </div>{/* closes instructions-scroll */}
          <div className="exercise-sticky-bar">
            {/* Mode toggle switch */}
            <div className="mode-toggle">
              <span className={mode === 'practice' ? 'font-semibold text-primary' : ''}>
                <Bike size={14} style={{marginRight:4, verticalAlign:'middle'}} />Üben
              </span>
              <button
                onClick={() => setMode(mode === 'practice' ? 'exam' : 'practice')}
                className="mode-toggle-switch"
                style={{ background: mode === 'exam' ? 'var(--primary)' : 'var(--border)' }}
                aria-label={mode === 'practice' ? 'Zum Prüfungsmodus wechseln' : 'Zum Übungsmodus wechseln'}
              >
                <span className="mode-toggle-knob" style={{ left: mode === 'exam' ? 22 : 2 }} />
              </button>
              <span className={mode === 'exam' ? 'font-semibold text-primary' : ''}>
                <Trophy size={14} style={{marginRight:4, verticalAlign:'middle'}} />Prüfung
              </span>
            </div>
            {/* Submit */}
            <div className="flex gap-sm">
              {user ? (
                <button
                  className="btn btn-success"
                  style={{ flex: 1 }}
                  onClick={handleSubmit}
                  disabled={submitting || (mode === 'exam' && attemptCount >= 1)}
                  aria-label={submitting ? 'Wird überprüft...' : 'Lösung überprüfen'}
                  aria-busy={submitting}
                >
                  {submitting ? <><Loader2 size={14} style={{marginRight:4}} />Wird korrigiert...</> : <><CheckCircle size={14} style={{marginRight:4}} />Übung abgeben</>}
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none' }}>
                  <LogIn size={14} style={{marginRight:4}} />Anmelden zum Speichern
                </Link>
              )}
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => startTour(EXERCISE_TOUR)}
              aria-label="Hilfe-Tour starten" title="Hilfe-Tour"
              style={{ fontSize: '0.82rem', fontWeight: 600, width: '100%' }}>
              <HelpCircle size={14} style={{marginRight:4}} />Hilfe
            </button>
          </div>

          {/* Success Checkmark (replaces confetti) */}
          {showSuccessCheck && (
            <div className="success-checkmark-overlay">
              <div className="success-checkmark">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle className="check-circle" cx="40" cy="40" r="35" />
                  <polyline className="check-path" points="25,42 36,53 55,28" />
                </svg>
                <p>Perfekt gelöst!</p>
              </div>
            </div>
          )}
          <XPFlying xp={xpGained || 0} sourceRef={scoreRef} trigger={showXpFly} />
          <BadgeModal show={!!newBadge} badge={newBadge} onClose={() => setNewBadge(null)} />
        </section>

        <section aria-label="Excel-Arbeitsblatt" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="spreadsheet-container" style={{ flex: 1 }}>
            <Suspense fallback={<ExcelSpinner text="Tabelle wird geladen..." />}>
            <SpreadsheetHandsontable
              key={id}
              headers={template.headers}
              data={spreadsheetData}
              onChange={(newData) => {
                isDirtyRef.current = true;
                setSpreadsheetData(newData);
              }}
              externalFormats={cellFormats}
              onCellFormatsChange={(fmts) => setCellFormats(fmts)}
              taskCols={template.taskCols}
              gridHeight={gridHeight}
              errorCells={errorCellsProp}
              initialSheets={template.sheets}
            />
            </Suspense>
          </div>
        </section>
      </div>
      <KeyboardHelp />
    </div>
  );
}
