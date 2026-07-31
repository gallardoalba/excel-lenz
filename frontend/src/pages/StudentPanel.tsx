import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Play, Trophy, Target, TrendingUp, RefreshCw, Clock, ArrowRight, GraduationCap, AlertTriangle } from 'lucide-react';
import { apiFetch, useAuth } from '../context/AuthContext';
import { ExcelSpinner } from '../components/animations/Celebrations';
import { COURSE_ICONS, COURSE_THEME, DIFFICULTY_LABELS } from '../data/course-config';

interface Course {
  id: string; title: string; description: string; difficulty: string; exercise_count: number;
}

interface Gamification {
  xp: { total_xp: number; level: number; streak_days: number };
  badges: { id: string; name: string; description: string; icon: string; earned_at: string }[];
  totalCompleted: number;
}

interface ReviewCard {
  exercise_id: string; exercise_title: string; course_title: string; course_id?: string;
  interval: number; repetitions: number; last_score: number;
}

interface ProgressItem {
  exercise_id: string; course_id: string; score: number; completed: number;
}

export default function StudentPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [gami, setGami] = useState<Gamification | null>(null);
  const [reviews, setReviews] = useState<ReviewCard[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      apiFetch('/courses').catch(() => []),
      apiFetch('/gamification/stats').catch(() => null),
      apiFetch('/adaptive/review-due').catch(() => ({ dueCards: [] })),
      apiFetch('/exercises/user/progress').catch(() => []),
    ]).then(([c, g, r, p]) => {
      setCourses(c);
      setGami(g);
      setReviews((r as any).dueCards || []);
      setProgress(p);
    }).catch(() => {
      setError('Daten konnten nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung.');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <ExcelSpinner text="Dashboard wird geladen..." />;

  if (error) {
    return (
      <div className="student-panel">
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', borderColor: 'var(--danger)' }}>
          <AlertTriangle size={48} style={{ color: 'var(--danger)', marginBottom: 16 }} />
          <h2 style={{ marginBottom: 8 }}>Ladefehler</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>{error}</p>
          <button className="btn btn-primary" onClick={loadData}>Erneut versuchen</button>
        </div>
      </div>
    );
  }

  const progressMap = useMemo(() => {
    const map = new Map<string, number>();
    progress.filter(p => p.completed).forEach(p => {
      map.set(p.course_id, (map.get(p.course_id) || 0) + 1);
    });
    return map;
  }, [progress]);

  const visibleCourses = courses;

  const xp = gami?.xp;
  const recentBadges = gami?.badges?.slice(0, 3) || [];
  const completedCount = gami?.totalCompleted || progress.filter(p => p.completed).length;

  return (
    <div className="student-panel">
      {/* ── WELCOME HERO ── */}
      <section className="student-hero">
        <div className="student-hero-content">
          <div className="student-hero-avatar">
            <GraduationCap size={36} />
          </div>
          <div>
            <h1 className="student-hero-title">Willkommen, {user?.name}</h1>
            <p className="student-hero-subtitle">
              Setzen Sie Ihr Excel-Training fort — praxisorientiert und mit direktem Feedback.
            </p>
          </div>
        </div>
        {/* ── QUICK STATS ── */}
        {xp && (
          <div className="student-quick-stats">
            <div className="student-stat">
              <Trophy size={18} />
              <div>
                <span className="student-stat-value">{xp.total_xp}</span>
                <span className="student-stat-label">XP</span>
              </div>
            </div>
            <div className="student-stat">
              <TrendingUp size={18} />
              <div>
                <span className="student-stat-value">Stufe {xp.level}</span>
                <span className="student-stat-label">Level</span>
              </div>
            </div>
            <div className="student-stat">
              <Target size={18} />
              <div>
                <span className="student-stat-value">{xp.streak_days}</span>
                <span className="student-stat-label">Tage Streak</span>
              </div>
            </div>
            <div className="student-stat">
              <BookOpen size={18} />
              <div>
                <span className="student-stat-value">{completedCount}</span>
                <span className="student-stat-label">Abgeschlossen</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── ROW: COURSES + REVIEWS ── */}
      <div className="student-grid">
        {/* ── MEINE KURSE ── */}
        <section className="student-courses">
          <h2 className="student-section-title">
            <BookOpen size={20} /> Meine Kurse
          </h2>
          <div className="student-course-list">
            {visibleCourses.map(course => {
              const theme = COURSE_THEME[course.title] || { accent: '#1a5276', bg: '#e8f0fe' };
              const completed = progressMap.get(course.id) || 0;
              const pct = course.exercise_count > 0 ? Math.round((completed / course.exercise_count) * 100) : 0;

              return (
                <Link to={`/courses/${course.id}`} key={course.id} className="student-course-card">
                  <div className="student-course-icon" style={{ background: theme.bg, color: theme.accent }}>
                    {COURSE_ICONS[course.title] || <BookOpen size={22} />}
                  </div>
                  <div className="student-course-info">
                    <h3>{course.title}</h3>
                    <span className="student-course-meta">
                      {DIFFICULTY_LABELS[course.difficulty] || course.difficulty} · {course.exercise_count} Übungen
                    </span>
                    <div className="student-course-progress-bar">
                      <div className="student-course-progress-fill" style={{ width: `${pct}%`, background: theme.accent }} />
                    </div>
                    <span className="student-course-progress-label">
                      {completed}/{course.exercise_count} abgeschlossen
                    </span>
                  </div>
                  <ArrowRight size={18} className="student-course-arrow" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── REVIEW + BADGES ── */}
        <aside className="student-sidebar">
          {/* Wiederholen */}
          <section className="student-reviews">
            <h2 className="student-section-title">
              <RefreshCw size={18} /> Zur Wiederholung
            </h2>
            {reviews.length === 0 ? (
              <p className="student-empty">Keine fälligen Wiederholungen — gut gemacht!</p>
            ) : (
              <div className="student-review-list">
                {reviews.slice(0, 4).map((r, i) => (
                  <button
                    key={i}
                    className="student-review-item"
                    onClick={() => navigate(`/exercises/${r.exercise_id}`)}
                  >
                    <div className="student-review-main">
                      <span className="student-review-title">{r.exercise_title}</span>
                      <span className="student-review-course">{r.course_title}</span>
                    </div>
                    <div className="student-review-meta">
                      <span className="student-review-score" style={{ color: r.last_score >= 80 ? 'var(--success)' : r.last_score >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                        {r.last_score}%
                      </span>
                      <Play size={14} />
                    </div>
                  </button>
                ))}
              </div>
            )}
            {reviews.length > 4 && (
              <Link to="/dashboard" className="student-see-all">
                Alle {reviews.length} anzeigen →
              </Link>
            )}
          </section>

          {/* Zuletzt verdiente Badges */}
          <section className="student-badges">
            <h2 className="student-section-title">
              <Trophy size={18} /> Letzte Erfolge
            </h2>
            {recentBadges.length === 0 ? (
              <p className="student-empty">Schließen Sie Übungen ab, um Abzeichen zu verdienen.</p>
            ) : (
              <div className="student-badge-list">
                {recentBadges.map((b, i) => (
                  <div key={i} className="student-badge-item">
                    <span className="student-badge-icon">{b.icon}</span>
                    <div>
                      <span className="student-badge-name">{b.name}</span>
                      <span className="student-badge-date">
                        {new Date(b.earned_at).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Link zum vollständigen Dashboard */}
          <Link to="/dashboard" className="student-dashboard-link">
            <Clock size={16} /> Vollständige Statistiken
          </Link>
        </aside>
      </div>
    </div>
  );
}
