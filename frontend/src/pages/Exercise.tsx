import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lightbulb, Trophy, CheckCircle, ThumbsUp, BookOpen, Award, HelpCircle, Search, Sprout, ThumbsDown, Bike, Loader2, LogIn, ArrowRight, ArrowLeft, Star, Target, ListChecks, Clock, MessageCircle, Eye } from 'lucide-react';
import { apiFetch, useAuth } from '../context/AuthContext';
import SpreadsheetHandsontable from '../components/spreadsheet/SpreadsheetHandsontable';
import { BadgeModal, XPFlying, ExcelSpinner } from '../components/animations/Celebrations';
import { announce } from '../components/a11y/Accessibility';
import { useTour, EXERCISE_TOUR } from '../components/tour/OnboardingTour';
import Comments from '../components/community/Comments';
import KeyboardHelp from '../components/help/KeyboardHelp';
import { useDailyGoal } from '../context/DailyGoalContext';

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
  const [exerciseTab, setExerciseTab] = useState<'instructions' | 'theory' | 'community'>('instructions');
  const [attemptCount, setAttemptCount] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [cellFeedback, setCellFeedback] = useState<{ row: number; col: number; expected: any; got: any }[]>([]);
  const [focusMode, setFocusMode] = useState(false);
  const { startTour } = useTour();
  const { increment: incrementGoal } = useDailyGoal();
  const scoreRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLElement>(null);
  const [gridHeight, setGridHeight] = useState(320);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const [nextExercise, setNextExercise] = useState<{ id: string; title: string; estimated_minutes?: number } | null>(null);

  // Focus Mode — hide navbar/footer
  useEffect(() => {
    if (focusMode) document.body.classList.add('focus-mode');
    else document.body.classList.remove('focus-mode');
    return () => document.body.classList.remove('focus-mode');
  }, [focusMode]);

  // Measure left panel height and sync to spreadsheet grid
  useEffect(() => {
    const panel = leftPanelRef.current;
    if (!panel) return;
    const ro = new ResizeObserver(() => {
      // Subtract ribbon + formulaBar + statusBar + margins (~210px total)
      const h = panel.getBoundingClientRect().height - 210;
      if (h > 200) setGridHeight(Math.round(h));
    });
    ro.observe(panel);
    return () => ro.disconnect();
  }, []);

  // Cleanup timers on unmount to prevent setState on unmounted component
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      abortRef.current?.abort();
    };
  }, []);

  // Prevent accidental navigation away from exercise with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (exercise && !exercise.progress?.completed && spreadsheetData.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [exercise, spreadsheetData]);

  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
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
    const controller = new AbortController();
    abortRef.current = controller;
    const signal = controller.signal;

    apiFetch(`/exercises/${id}`, { signal })
      .then((data) => {
        if (signal.aborted) return;
        setExercise(data);
        if (data.progress?.completed && data.progress?.submitted_data) {
          setSpreadsheetData(data.template_data.data);
          setScore(data.progress.score);
        } else {
          setSpreadsheetData(data.template_data.data);
        }
        // Fetch next exercise in course sequence
        apiFetch(`/courses/${data.course_id}`, { signal })
          .then((course: { exercises: { id: string; title: string; estimated_minutes?: number }[] }) => {
            if (signal.aborted) return;
            const currentIdx = course.exercises.findIndex((e: { id: string }) => e.id === id);
            if (currentIdx >= 0 && currentIdx < course.exercises.length - 1) {
              setNextExercise(course.exercises[currentIdx + 1]);
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
        body: JSON.stringify({ data: submitData }),
      });
      setScore(result.score);
      setAttemptCount(c => c + 1);

      // Partial credit tracking
      if (result.details) {
        const taskColCount = exercise.template_data.taskCols?.length || 1;
        const total = result.details.length + (result.score === 100 ? 0 : Math.round((100 - result.score) / 100 * taskColCount * (exercise.template_data.data?.length || 1)));
        setTotalCells(result.details.length + Math.round(result.score / 100 * result.details.length / Math.max(1, (100 - result.score) / 100)));
      }
      // Approximate correct cells from score
      if (result.score != null) {
        const estimated = Math.round(result.score / 100 * 5); // rough estimate
        setCorrectCells(estimated);
        setTotalCells(5);
      }

      // Generate cell-level feedback
      if (result.score < 100 && result.details) {
        setCellFeedback(result.details || []);
        announce(`Ergebnis: ${result.score} Prozent. ${result.details.length} Fehler gefunden.`, 'assertive');
        // Growth-oriented hint based on common mistakes
        if (result.score < 30) {
          setFeedbackHint(<><Lightbulb size={14} style={{marginRight:4}} />Tipp: Überprüfe die verwendete Funktion. Brauchst du vielleicht SUMME statt MITTELWERT?</>);
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
      } catch { setXpGained(50); }
      // Track daily goal progress
      incrementGoal();
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
  const scoreClass = score === null ? '' : score >= 80 ? 'score-success' : score >= 50 ? 'score-partial' : 'score-fail';

  const scoreIcon = score === null ? null :
    score >= 80 ? <CheckCircle size={20} style={{marginRight:4}} /> : score >= 50 ? <ThumbsUp size={20} style={{marginRight:4}} /> : <BookOpen size={20} style={{marginRight:4}} />;

  const scoreMessage = score === null ? '' :
    score >= 80 ? 'Kompetenz nachgewiesen' :
    score >= 50 ? 'Gute Fortschritte — weiter üben' :
    'Grundlagen vertiefen';

  return (
    <div className="exercise-page">
      <Link to={`/courses/${exercise.course_id}`} className="btn btn-outline btn-sm"
        aria-label={`Zurück zum Kurs`}>
        <ArrowLeft size={14} style={{marginRight:6}} /> Zurück zum Kurs
      </Link>

      <h1 className="mb-3">
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

      {/* Guest banner */}
      {!user && (
        <div className="guest-banner mb-3">
          <span><Eye size={14} style={{marginRight:4, verticalAlign:'middle'}} /><strong>Gastmodus:</strong> Sie können die Übung ansehen, aber nicht speichern.</span>
          <Link to="/login" className="btn btn-sm btn-primary">Anmelden</Link>
        </div>
      )}

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
          {/* Description */}
          <p className="exercise-description">
            {exercise.description}
          </p>

          {/* ── TABS ── */}
          <div className="exercise-tabs">
            {[
              { key: 'instructions' as const, icon: <ListChecks size={16} />, label: 'Anleitung' },
              { key: 'theory' as const, icon: <BookOpen size={16} />, label: 'Theorie' },
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

              {/* Formula hint */}
              {mode === 'practice' && template.formulaHint && hintLevel === 0 && score === null && (
                <div className="hint-box">
                  <Lightbulb size={14} style={{marginRight:4, color: 'var(--accent)'}} />
                  <strong>Tipp:</strong> {template.formulaHint}
                </div>
              )}

              {/* Progressive Hints */}
              {mode === 'practice' && hintLevel > 0 && (
                <div className="mt-3">
                  {hints.slice(0, hintLevel).map((hint, i) => (
                    <div key={i} className={`hint-box-tip ${i === 3 ? 'border-left-tertiary' : 'border-left-primary'}`}>
                      <strong>{i < 3 ? <><Lightbulb size={12} style={{marginRight:4}} />Tipp {i + 1}:</> : <><Award size={12} style={{marginRight:4}} />Lösung:</>}</strong>{' '}
                      {i === 3 ? (
                        <span>
                          <button className="btn btn-sm btn-outline" style={{ marginLeft: 8 }}
                            onClick={() => setShowSolution(!showSolution)}>
                            {showSolution ? 'Ausblenden' : 'Anzeigen'}
                          </button>
                          {showSolution && (
                            <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                              {exercise.template_data?.formulaHint}
                            </pre>
                          )}
                        </span>
                      ) : hint}
                    </div>
                  ))}
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
                  {mode === 'practice' && (
                    <button className="btn btn-sm btn-outline mt-1"
                      onClick={() => setHintLevel((h) => Math.min(h + 1, 1))}>
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
                  {exercise.template_data.theory}
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
              <button className="btn btn-outline btn-sm" onClick={() => startTour(EXERCISE_TOUR)}
                aria-label="Hilfe-Tour starten" title="Hilfe-Tour"
                style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                <HelpCircle size={14} style={{marginRight:4}} />Hilfe
              </button>
            </div>
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
            <SpreadsheetHandsontable
              headers={template.headers}
              data={spreadsheetData}
              onChange={setSpreadsheetData}
              taskCols={template.taskCols}
              gridHeight={gridHeight}
              errorCells={cellFeedback.length > 0 ? cellFeedback.map(fb => ({
                row: fb.row,
                col: fb.col,
                expected: String(fb.expected),
                got: fb.got != null ? String(fb.got) : null,
              })) : undefined}
            />
          </div>
        </section>
      </div>
      <KeyboardHelp />
    </div>
  );
}
