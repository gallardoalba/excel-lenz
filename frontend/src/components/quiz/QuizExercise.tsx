// ── QuizExercise: True/False, Single & Multiple Choice ──────────────────────
// Premium minimalist design matching the Excel-lenz Apple/Tesla aesthetic.
// Horizontal question nav strip + clean cards with subtle feedback.
import { useState, useCallback, useRef, useEffect } from 'react';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number[];
  type: 'tf' | 'single' | 'multiple';
  explanation?: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  onSubmit: (answers: number[][]) => void;
  submitting?: boolean;
  score?: number | null;
}

export default function QuizExercise({ questions, onSubmit, submitting, score }: QuizProps) {
  const [answers, setAnswers] = useState<number[][]>(questions.map(() => []));
  const [submitted, setSubmitted] = useState(false);
  const [showExplanations, setShowExplanations] = useState<boolean[]>(questions.map(() => false));
  const [activeQ, setActiveQ] = useState(0);
  const navStripRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active nav dot into view
  useEffect(() => {
    const el = navStripRef.current?.children[activeQ] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeQ]);

  const toggleAnswer = useCallback((qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => {
      const next = prev.map((a, i) => i === qIdx ? [...a] : a);
      const qType = questions[qIdx].type;
      if (qType === 'single' || qType === 'tf') {
        next[qIdx] = [optIdx];
      } else {
        const pos = next[qIdx].indexOf(optIdx);
        if (pos >= 0) next[qIdx].splice(pos, 1);
        else next[qIdx].push(optIdx);
      }
      return next;
    });
  }, [submitted, questions]);

  const handleSubmit = () => {
    setSubmitted(true);
    setShowExplanations(questions.map(() => true));
    onSubmit(answers);
  };

  const isCorrect = (qIdx: number): boolean => {
    const q = questions[qIdx];
    const a = answers[qIdx];
    if (a.length !== q.correct.length) return false;
    return a.every(x => q.correct.includes(x)) && q.correct.every(x => a.includes(x));
  };

  const correctCount = questions.filter((_, i) => isCorrect(i)).length;
  const pct = Math.round((correctCount / questions.length) * 100);

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '8px 0' }}>
      {/* ── Horizontal Question Nav Strip ── */}
      <div className="quiz-nav-strip" ref={navStripRef} style={{ marginBottom: 4 }}>
        {questions.map((_, qIdx) => {
          const ok = submitted && isCorrect(qIdx);
          const answered = submitted && answers[qIdx].length > 0;
          const ko = submitted && !isCorrect(qIdx) && answered;
          const missed = submitted && !isCorrect(qIdx) && !answered;
          return (
            <button
              key={qIdx}
              className={`quiz-nav-dot${activeQ === qIdx ? ' active' : ''}${ok ? ' correct' : ''}${ko ? ' wrong' : ''}${missed ? ' missed' : ''}`}
              onClick={() => setActiveQ(qIdx)}
              aria-label={`Frage ${qIdx + 1}${ok ? ' (richtig)' : ko ? ' (falsch)' : missed ? ' (nicht beantwortet)' : ''}`}
            >
              {qIdx + 1}
            </button>
          );
        })}
      </div>

      {/* ── Active Question Card ── */}
      {(() => {
        const q = questions[activeQ];
        const correct = submitted && isCorrect(activeQ);
        const answeredWrong = submitted && !isCorrect(activeQ) && answers[activeQ].length > 0;
        const missed = submitted && !isCorrect(activeQ) && answers[activeQ].length === 0;

        return (
          <div className={`quiz-card${correct ? ' correct' : ''}${answeredWrong ? ' wrong' : ''}${missed ? ' wrong' : ''}`}>
            {/* Header */}
            <div className="quiz-card-header">
              <div style={{ flex: 1 }}>
                <p className="quiz-question-text">{q.question}</p>
                <span className="quiz-type-badge">
                  {q.type === 'tf' ? 'Wahr / Falsch' : q.type === 'single' ? 'Einzelauswahl' : 'Mehrfachauswahl'}
                </span>
              </div>
              {/* Status icon after submit */}
              {correct && <CheckCircle size={20} style={{ color: '#2E7D32', flexShrink: 0, marginTop: 2 }} />}
              {answeredWrong && <XCircle size={20} style={{ color: '#D32F2F', flexShrink: 0, marginTop: 2 }} />}
              {missed && <span style={{ fontSize: '0.75rem', color: '#D32F2F', flexShrink: 0, marginTop: 2, fontWeight: 500 }}>—</span>}
            </div>

            {/* Options */}
            <div className="quiz-options">
              {q.options.map((opt, oIdx) => {
                const selected = answers[activeQ]?.includes(oIdx);
                const isCorrectOpt = q.correct.includes(oIdx);

                let cls = 'quiz-option';
                if (selected && !submitted) cls += ' selected';
                if (submitted) {
                  if (isCorrectOpt) cls += ' opt-correct';
                  else if (selected) cls += ' opt-wrong';
                  else cls += ' opt-dimmed';
                }

                return (
                  <button
                    key={oIdx}
                    className={cls}
                    onClick={() => toggleAnswer(activeQ, oIdx)}
                    disabled={submitted}
                  >
                    <span className={`quiz-opt-indicator${q.type === 'multiple' ? ' multi' : ''}`}>
                      {submitted && isCorrectOpt && <CheckCircle size={14} style={{ color: '#2E7D32' }} />}
                      {submitted && !isCorrectOpt && selected && <XCircle size={14} style={{ color: '#D32F2F' }} />}
                      {!submitted && selected && (
                        <span style={{ color: '#fff', fontSize: '0.6rem', fontWeight: 700 }}>✓</span>
                      )}
                    </span>
                    <span style={{ flex: 1 }}>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanations[activeQ] && q.explanation && (
              <div className={`quiz-explanation${correct ? ' correct' : ' wrong'}`}>
                <Lightbulb size={15} style={{ flexShrink: 0, marginTop: 1, color: correct ? '#2E7D32' : 'var(--text-muted)' }} />
                <span>{q.explanation}</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Question nav arrows (prev/next) under card ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
        <button
          onClick={() => setActiveQ(Math.max(0, activeQ - 1))}
          disabled={activeQ === 0}
          style={{
            background: 'transparent', border: 'none', cursor: activeQ === 0 ? 'default' : 'pointer',
            color: activeQ === 0 ? 'var(--bg-alt2)' : 'var(--text-secondary)',
            padding: '6px 14px', borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 0.15s',
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>←</span> Zurück
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', alignSelf: 'center' }}>
          {activeQ + 1} / {questions.length}
        </span>
        <button
          onClick={() => setActiveQ(Math.min(questions.length - 1, activeQ + 1))}
          disabled={activeQ === questions.length - 1}
          style={{
            background: 'transparent', border: 'none', cursor: activeQ === questions.length - 1 ? 'default' : 'pointer',
            color: activeQ === questions.length - 1 ? 'var(--bg-alt2)' : 'var(--text-secondary)',
            padding: '6px 14px', borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 0.15s',
          }}
        >
          Weiter <span style={{ fontSize: '0.9rem' }}>→</span>
        </button>
      </div>

      {/* ── Submit / Results ── */}
      <div style={{ textAlign: 'center' }}>
        {!submitted ? (
          <button
            className="quiz-submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Wird ausgewertet…' : 'Antworten überprüfen'}
          </button>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            marginTop: 8,
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--primary)',
              letterSpacing: '-0.3px',
            }}>
              {correctCount}
              <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '1.1rem' }}> / {questions.length}</span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              richtig beantwortet
            </span>
            <div style={{
              width: 120, height: 3, borderRadius: 2,
              background: 'var(--bg-alt2)', marginTop: 6, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 2,
                background: 'var(--primary)',
                width: `${pct}%`,
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
