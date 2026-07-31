import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Trophy, Target, Award, TrendingUp, RefreshCw, BookOpen, Star, FileText, Crosshair, CheckCircle, Calendar, CalendarCheck, CalendarDays } from 'lucide-react';
import { apiFetch, useAuth } from '../context/AuthContext';
import { Skeleton } from '../hooks/useAutosave';
import { ExcelSpinner } from '../components/animations/Celebrations';
import { ScoreProgressChart, StreakCalendar } from '../components/visualizations/Charts';
import { DailyGoalWidget } from '../components/gamification/DailyGoal';

const BADGE_ICONS: Record<string, React.ReactNode> = {
  Award: <Award size={22} />,
  FileText: <FileText size={22} />,
  Trophy: <Trophy size={22} />,
  Calendar: <Calendar size={22} />,
  CalendarCheck: <CalendarCheck size={22} />,
  CalendarDays: <CalendarDays size={22} />,
  Star: <Star size={22} />,
  CheckCircle: <CheckCircle size={22} />,
};

function levelTitle(level: number): string {
  if (level >= 20) return 'Meister-Analyst';
  if (level >= 15) return 'Senior Analyst';
  if (level >= 10) return 'Analyst';
  if (level >= 7) return 'Junior Analyst';
  if (level >= 4) return 'Fortgeschritten';
  return 'Einsteiger';
}

function levelColor(level: number): string {
  if (level >= 15) return '#C5A065';
  if (level >= 7) return 'var(--primary)';
  return 'var(--text-secondary)';
}

interface ProgressItem {
  exercise_id: string; exercise_title: string; course_id: string;
  course_title: string; score: number; completed: number; completed_at: string | null;
}
interface Gamification {
  xp: { total_xp: number; level: number; streak_days: number };
  badges: { id: string; name: string; description: string; icon: string; earned_at: string }[];
  totalCompleted: number;
}
interface Leader {
  name: string; total_xp: number; level: number; streak_days: number;
}
interface ReviewCard {
  exercise_id: string; exercise_title: string; course_title: string;
  interval: number; repetitions: number; last_score: number;
}
interface SkillInfo {
  name: string; level: number; score: number; completed: number; total: number; difficulty: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [gami, setGami] = useState<Gamification | null>(null);
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [skills, setSkills] = useState<SkillInfo[]>([]);
  const [weakest, setWeakest] = useState<SkillInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/exercises/user/progress').catch(() => []),
      apiFetch('/gamification/stats').catch(() => null),
      apiFetch('/adaptive/review-due').catch(() => ({ dueCards: [] })),
      apiFetch('/adaptive/skills').catch(() => ({ skills: [], weakest: null })),
    ]).then(([p, g, r, s]) => {
      setProgress(p); setGami(g);
      setReviews(r.dueCards || []); setSkills(s.skills || []);
      setWeakest(s.weakest || null);
    }).finally(() => setLoading(false));
  }, []);

  const completedCount = progress.filter((p) => p.completed).length;
  const avgScore = progress.length > 0
    ? Math.round(progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length)
    : 0;

  const locale = 'de-DE';

  if (loading) return <Skeleton lines={4} />;

  return (
    <div>
      <h1 style={{ marginBottom: 8 }}><BarChart3 size={28} style={{marginRight:8, verticalAlign:'middle'}} />Mein Fortschritt</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Willkommen, {user?.name}. Hier sehen Sie Ihren Lernfortschritt.
      </p>

      {/* ── ROW 1: KPIs ── */}
      {gami && (
        <>
        <DailyGoalWidget />
        <div className="stats-cards">
          <div className="card stat-card">
            <div className="stat-value">{gami.xp.total_xp}</div>
            <div className="stat-label"><Trophy size={14} style={{marginRight:4}} />KP</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', color: levelColor(gami.xp.level) }}>
              {levelTitle(gami.xp.level)}
            </div>
            <div className="stat-label"><Award size={14} style={{marginRight:4}} />Niveau {gami.xp.level}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{gami.xp.streak_days}</div>
            <div className="stat-label"><TrendingUp size={14} style={{marginRight:4}} />Konstanz</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label"><CheckCircle size={14} style={{marginRight:4}} />Abgeschlossen</div>
          </div>
        </div>
        </>
      )}

      {/* ── ROW 2: Weitermachen (Review + Badges) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: reviews.length > 0 ? '1.5fr 1fr' : '1fr', gap: 24, marginBottom: 32 }}>
        {reviews.length > 0 && (
          <div>
            <h3 className="text-md mb-3">
              <RefreshCw size={18} style={{marginRight:6, verticalAlign:'middle'}} />Weitermachen
            </h3>
            <div className="flex-col gap-sm">
              {reviews.slice(0, 3).map((r) => (
                <Link key={r.exercise_id} to={`/exercises/${r.exercise_id}`} className="card border-left-warning" style={{
                  padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  textDecoration: 'none', color: 'inherit',
                }}>
                  <div>
                    <strong className="text-base">{r.exercise_title}</strong>
                    <div className="text-xs text-secondary mt-1">
                      <BookOpen size={11} style={{marginRight:3}} />{r.course_title}
                      {r.repetitions > 0 && ` · ${r.repetitions}. Wiederholung`}
                    </div>
                  </div>
                  <span className="btn btn-accent btn-sm">Üben →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {gami && gami.badges.length > 0 && (
          <div>
            <h3 className="text-md mb-3">
              <Award size={18} style={{marginRight:6, verticalAlign:'middle'}} />Zertifizierungen
            </h3>
            <div className="flex gap-md flex-wrap">
              {gami.badges.map((b) => (
                <div key={b.id} className="card text-center" style={{ padding: '12px 16px', minWidth: 80 }} title={b.description}>
                  <div style={{ color: 'var(--tertiary)' }}>{BADGE_ICONS[b.icon] || <Award size={22} />}</div>
                  <div className="text-xs font-semibold mt-1">{b.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── ROW 3: Skill Analysis ── */}
      {skills.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ marginBottom: 12, fontSize: '1.05rem' }}>
            <BarChart3 size={18} style={{marginRight:6, verticalAlign:'middle'}} />Skill-Übersicht
          </h3>
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {skills.map((s) => (
                <div key={s.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.name}</span>
                    <span style={{ fontSize: '0.75rem', color: s.score >= 80 ? 'var(--success)' : s.score >= 50 ? 'var(--warning)' : 'var(--danger)', fontWeight: 600 }}>
                      {Math.round(s.score)}%
                    </span>
                  </div>
                  <div className="progress-bar" style={{ height: 5 }}>
                    <div className="progress-bar-fill" style={{ width: `${Math.round(s.score)}%` }} />
                  </div>
                  <div style={{ marginTop: 4, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {s.completed}/{s.total} Übungen · Niveau {s.level}/5
                  </div>
                </div>
              ))}
            </div>
            {weakest && weakest.score < 80 && (
              <div style={{
                marginTop: 14, padding: '10px 14px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--warning)', fontSize: '0.84rem',
              }}>
                <strong><Crosshair size={14} style={{marginRight:4}} />Fokus-Empfehlung:</strong> Arbeite an <em>{weakest.name}</em> ({Math.round(weakest.score)}%) — hier gibt es noch Potenzial!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ROW 4: Verlauf ── */}
      <div style={{ marginBottom: 32 }}>
        <div>
          <h3 style={{ marginBottom: 12 }}><FileText size={20} style={{marginRight:6, verticalAlign:'middle'}} />Verlauf</h3>
          {progress.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Sie haben noch keine Übungen abgeschlossen.</p>
              <Link to="/courses" className="btn btn-primary">Zu den Kursen</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {progress.slice(0, 6).map((p) => (
                <div key={p.exercise_id} className="card" style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.85rem' }}>{p.exercise_title}</strong>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}><BookOpen size={11} style={{marginRight:3}} />{p.course_title}</div>
                    </div>
                    <span style={{
                      padding: '3px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.8rem',
                      background: (p.score || 0) >= 80 ? 'var(--success-light)' : (p.score || 0) >= 50 ? 'var(--warning-light)' : 'var(--danger-light)',
                      color: (p.score || 0) >= 80 ? 'var(--success)' : (p.score || 0) >= 50 ? 'var(--warning)' : 'var(--danger)',
                    }}>{p.score || 0}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Score Progress Chart */}
      <ScoreProgressChart />

      {/* Streak Calendar */}
      <StreakCalendar />
    </div>
  );
}
