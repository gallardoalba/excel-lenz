import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, Clock, BookOpen, ChevronRight, Play, Target, BookMarked, GraduationCap, Trophy, BarChart3, Zap, Brain, Sprout, FileText } from 'lucide-react';
import { apiFetch, useAuth } from '../context/AuthContext';
import FunctionMap from '../components/visualizations/FunctionMap';
import { ExcelSpinner } from '../components/animations/Celebrations';
import { COURSE_ICONS, COURSE_THEME, DIFFICULTY_LABELS, translateCourse } from '../data/course-config';
import { usePageView } from '../hooks/useAnalytics';

interface ExerciseItem {
  id: string; title: string; description: string; order_index: number;
  user_score?: number | null; completed?: number;
  estimated_minutes?: number; prerequisites?: string[];
  learningObjectives?: string[];
  theoryTitle?: string | null;
  theory?: string | null;
  moduleId?: string; moduleSection?: string; moduleTitle?: string; sectionTitle?: string;
}

interface ModuleSection {
  id: string; title: string; exercises: ExerciseItem[];
}

interface CourseModule {
  id: string; title: string; description?: string; sections: ModuleSection[];
}

interface CourseDetail {
  id: string; title: string; description: string; difficulty: string; exercises: ExerciseItem[];
  modules?: CourseModule[];
  user_progress?: { completed: number; total: number };
}

/** A flat section representation built from modules or fallback exercises */
interface SectionCard {
  id: string;
  title: string;
  description: string;
  moduleDescription?: string;
  moduleTitle: string;
  exerciseCount: number;
  completedCount: number;
  estimatedMinutes: number;
  exercises: ExerciseItem[];
}

function buildSections(course: CourseDetail): SectionCard[] {
  if (course.modules && course.modules.length > 0) {
    return course.modules.map((mod) => {
      // Flatten all exercises from all sections within this module
      const allExercises: ExerciseItem[] = [];
      for (const sec of mod.sections) {
        allExercises.push(...sec.exercises);
      }
      const completedCount = allExercises.filter(e => e.completed).length;
      const totalMin = allExercises.reduce((sum, e) => sum + (e.estimated_minutes || 0), 0);
      // Get the first section's title as subtitle, or use module title
      const firstSectionTitle = mod.sections[0]?.title || '';
      return {
        id: mod.id,
        title: mod.title,
        description: firstSectionTitle
          ? `${mod.sections.length} Themen · ${allExercises.length} praktische Übungen`
          : `${allExercises.length} praktische Übungen zu ${mod.title.toLowerCase()}.`,
        moduleDescription: mod.description || '',
        moduleTitle: mod.title,
        exerciseCount: allExercises.length,
        completedCount,
        estimatedMinutes: totalMin,
        exercises: allExercises,
      };
    });
  }

  // Fallback: group flat exercises into virtual sections (max 5 per section)
  const cards: SectionCard[] = [];
  const chunkSize = 5;
  for (let i = 0; i < course.exercises.length; i += chunkSize) {
    const chunk = course.exercises.slice(i, i + chunkSize);
    const completedCount = chunk.filter(e => e.completed).length;
    const totalMin = chunk.reduce((sum, e) => sum + (e.estimated_minutes || 0), 0);
    cards.push({
      id: `section-${i}`,
      title: i === 0 ? 'Abschnitt 1' : `Abschnitt ${Math.floor(i / chunkSize) + 1}`,
      description: `${chunk.length} Übungen zu ${course.title}.`,
      moduleTitle: course.title,
      exerciseCount: chunk.length,
      completedCount,
      estimatedMinutes: totalMin,
      exercises: chunk,
    });
  }
  return cards;
}

/** Compute aggregate course statistics */
function computeCourseStats(exercises: ExerciseItem[]) {
  const totalMin = exercises.reduce((sum, e) => sum + (e.estimated_minutes || 0), 0);
  const totalExercises = exercises.length;
  const completedCount = exercises.filter(e => e.completed).length;
  const uniqueModules = new Set(exercises.map(e => e.moduleId).filter(Boolean)).size;
  // Collect unique learning objectives across all exercises
  const allObjectives = new Set<string>();
  for (const ex of exercises) {
    for (const obj of (ex.learningObjectives || [])) {
      allObjectives.add(obj);
    }
  }
  return { totalMin, totalExercises, completedCount, uniqueModules, learningObjectives: [...allObjectives] };
}

/** Find the first incomplete exercise for the CTA */
function findNextExercise(exercises: ExerciseItem[]): ExerciseItem | null {
  for (const ex of exercises) {
    if (!ex.completed || (ex.user_score || 0) < 80) return ex;
  }
  return null;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  usePageView(`course/${id}`);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [masteryMap, setMasteryMap] = useState<Record<string, boolean>>({});
  const [unlockedMap, setUnlockedMap] = useState<Record<string, boolean>>({});
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setSelectedSection(null);
    setError(null);
    apiFetch(`/courses/${id}`)
      .then(c => {
        setCourse(c);
        if (!user) return;
        const exercises = c.exercises || [];
        const checks = exercises.map((ex: ExerciseItem) => {
          if (!ex.prerequisites?.length) return Promise.resolve({ id: ex.id, unlocked: true });
          return apiFetch(`/exercises/${ex.id}/mastery`)
            .then((m: { unlocked: boolean }) => ({ id: ex.id, unlocked: m.unlocked }))
            .catch(() => ({ id: ex.id, unlocked: false }));
        });
        Promise.all(checks).then(results => {
          const unlocked: Record<string, boolean> = {};
          results.forEach(r => { unlocked[r.id] = r.unlocked; });
          setUnlockedMap(unlocked);
        });
      })
      .catch(err => { console.error(err); setError('Der Kurs konnte nicht geladen werden. Bitte versuchen Sie es später erneut.'); })
      .finally(() => {
        setLoading(false);
        // Re-scroll to top after content renders (prevents mid-page jumps from layout shifts)
        window.scrollTo(0, 0);
      });
  }, [id, user]);

  // ── Derived data (must be before any conditional return — Rules of Hooks) ──
  const stats = useMemo(() => {
    if (!course) return { totalMin: 0, totalExercises: 0, completedCount: 0, uniqueModules: 0, learningObjectives: [] as string[] };
    return computeCourseStats(course.exercises);
  }, [course]);
  const nextEx = useMemo(() => {
    if (!course) return null;
    return findNextExercise(course.exercises);
  }, [course]);

  // Map course difficulty to didactic guide assets
  const didacticGuide = useMemo(() => {
    if (!course) return null;
    const map: Record<string, { html: string; pdf: string; label: string }> = {
      beginner: {
        html: '/didaktik/anfaenger',
        pdf: '/downloads/Didaktischer_Leitfaden_Excel_Anfaenger.pdf',
        label: 'Didaktischer Leitfaden: Excel für Anfänger',
      },
      advanced: {
        html: '/didaktik/fortgeschrittene',
        pdf: '/downloads/Didaktischer_Leitfaden_Excel_Fortgeschrittene.pdf',
        label: 'Didaktischer Leitfaden: Excel für Fortgeschrittene',
      },
    };
    return map[course.difficulty] || null;
  }, [course]);

  // Lehrplan URL mapping by difficulty
  const lehrplanUrl = useMemo(() => {
    if (!course) return null;
    const map: Record<string, string> = {
      beginner: '/lehrplan/anfaenger',
      intermediate: '/lehrplan/fortgeschrittene',
      advanced: '/lehrplan/fortgeschrittene',
      expert: '/lehrplan/fortgeschrittene',
    };
    return map[course.difficulty] || null;
  }, [course]);

  if (loading) return <ExcelSpinner text="Kurse werden geladen..." />;
  if (error) return (
    <div className="empty-state" style={{ padding: '80px 24px' }}>
      <h2>Ladefehler</h2>
      <p style={{ marginBottom: 20, color: 'var(--text-secondary)' }}>{error}</p>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>Erneut versuchen</button>
    </div>
  );
  if (!course) return (
    <div className="empty-state" style={{ padding: '80px 24px' }}>
      <h2>Kurs nicht gefunden</h2>
      <p style={{ marginBottom: 20 }}>Der angeforderte Kurs existiert nicht oder wurde entfernt.</p>
      <Link to="/courses" className="btn btn-primary">Zur Kursübersicht</Link>
    </div>
  );

  const tr = translateCourse(course);
  const courseTitle = tr.title;
  const courseDesc = tr.description;
  const theme = COURSE_THEME[course.title] || { gradient: 'linear-gradient(170deg, #f5f5f5, #eee)', accent: '#666', bg: '#f5f5f5' };
  const pct = course.user_progress?.total ? Math.round(course.user_progress.completed / course.user_progress.total * 100) : 0;
  const sections = buildSections(course);
  const activeSection = selectedSection ? sections.find(s => s.id === selectedSection) : null;
  const isOpen = true; // All courses accessible

  return (
    <div className="course-detail-page">
      {/* ── HERO V2 ── */}
      <section className="course-hero-v2" style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="course-hero-inner">
        {activeSection ? (
          /* ── Section header (compact) ── */
          <div className="section-header">
            <h1>{activeSection.title}</h1>
            <p className="text-muted">{activeSection.description}</p>
            {activeSection.exerciseCount > 0 && (
              <div style={{ marginTop: 16, maxWidth: 400 }}>
                <div className="progress-label">
                  <span>Abschnitt-Fortschritt</span>
                  <span style={{ fontWeight: 700, color: theme.accent }}>
                    {activeSection.completedCount}/{activeSection.exerciseCount} · {Math.round(activeSection.completedCount / activeSection.exerciseCount * 100)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${Math.round(activeSection.completedCount / activeSection.exerciseCount * 100)}%`, background: theme.accent }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Full hero dashboard ── */
          <div className="hero-dashboard">
            <div className="hero-dashboard-icon">
              {COURSE_ICONS[course.title] || <BookOpen size={36} />}
            </div>
            <div className="hero-dashboard-body">
              <div className="hero-dashboard-badges">
                <span className="badge" style={{ background: theme.bg, color: theme.accent, fontWeight: 600 }}>
                  {DIFFICULTY_LABELS[course.difficulty] || course.difficulty}
                </span>
                {isOpen && <span className="badge badge-success">Geöffnet</span>}
              </div>
              <h1 className="hero-dashboard-title">{courseTitle}</h1>
              <p className="hero-dashboard-desc">{courseDesc}</p>

              {/* Stats Row */}
              <div className="hero-stats-row">
                <div className="hero-stat">
                  <BookMarked size={18} />
                  <div>
                    <span className="hero-stat-value">{stats.totalExercises}</span>
                    <span className="hero-stat-label">Übungen</span>
                  </div>
                </div>
                <div className="hero-stat">
                  <Target size={18} />
                  <div>
                    <span className="hero-stat-value">{stats.uniqueModules || sections.length}</span>
                    <span className="hero-stat-label">Module</span>
                  </div>
                </div>
                <div className="hero-stat">
                  <Clock size={18} />
                  <div>
                    <span className="hero-stat-value">~{stats.totalMin}</span>
                    <span className="hero-stat-label">Minuten</span>
                  </div>
                </div>
              </div>

              {/* Progress + CTA */}
              {course.user_progress && course.user_progress.total > 0 ? (
                <div className="hero-progress-cta">
                  <div className="hero-progress-wrap">
                    <div className="progress-label">
                      <span>Gesamtfortschritt</span>
                      <span className="progress-label-pct">{course.user_progress.completed}/{course.user_progress.total} · {pct}%</span>
                    </div>
                    <div className="progress-bar progress-bar-lg">
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: theme.accent }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    {nextEx && pct < 100 && (
                      <button
                        className="btn btn-accent hero-cta-btn"
                        onClick={() => navigate(`/exercises/${nextEx.id}`)}
                      >
                        <Play size={16} /> Weiter mit: {nextEx.title}
                      </button>
                    )}
                    {pct >= 100 && (
                      <div className="hero-complete-badge">
                        <Trophy size={20} /> Alle Übungen abgeschlossen!
                      </div>
                    )}
                    {didacticGuide && (
                      <button
                        className="btn btn-accent hero-cta-btn btn-dark-accent"
                        onClick={() => window.open(didacticGuide.html, '_blank')}
                      >
                        <FileText size={16} />
                        Didaktisches Programm
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                  {nextEx && (
                    <button
                      className="btn btn-accent btn-lg hero-cta-btn"
                      onClick={() => navigate(`/exercises/${nextEx.id}`)}
                    >
                      <Play size={18} /> Jetzt starten
                    </button>
                  )}
                  {didacticGuide && (
                    <button
                      className="btn btn-accent btn-lg hero-cta-btn btn-dark-accent"
                      onClick={() => window.open(didacticGuide.html, '_blank')}
                    >
                      <FileText size={18} />
                      Didaktisches Programm
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </section>

      {/* ── COURSE BODY (2-col layout in overview) ── */}
      <div className={`course-body ${activeSection ? 'course-body--single' : ''}`}>
        {/* Main column */}
        <div className="course-main">
          {/* ── LEHRPLAN ── */}
          {!activeSection && lehrplanUrl && (
            <>
              <h2 className="course-section-title">
                <BookOpen size={22} style={{marginRight:8, verticalAlign:'middle'}} />
                Lehrplan
              </h2>
              <div
                className="module-card"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: 28, cursor: 'pointer' }}
                onClick={() => navigate(lehrplanUrl)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(lehrplanUrl); }}
              >
              <div className="module-card-header">
                <div className="module-card-info">
                  <h3 className="module-card-title">Vollständiger Lehrplan mit Theorie und Übungen</h3>
                  <p className="module-card-desc">
                    13 Module mit verständlicher Theorie und 49 praktischen Excel-Übungen —
                    von den Grundlagen bis zu Makros und VBA.
                  </p>
                  <div className="module-card-meta">
                    <span><BookOpen size={12} /> 13 Module</span>
                    <span><Clock size={12} /> ~12 Stunden</span>
                    <span>49 Übungen</span>
                  </div>
                </div>
                <ChevronRight size={20} className="module-card-chevron" />
              </div>
            </div>
            </>
          )}

          {/* ── SECTION OVERVIEW — Module cards ── */}
          {!activeSection && sections.length > 0 && (
            <>
              <h2 className="course-section-title">
                <BookOpen size={22} style={{marginRight:8, verticalAlign:'middle'}} />
                Interaktive Übungen
              </h2>

              <div className="module-cards">
                {sections.map((section) => {
                  const sectionPct = section.exerciseCount > 0
                    ? Math.round(section.completedCount / section.exerciseCount * 100)
                    : 0;
                  const isComplete = sectionPct >= 100;
                  // Find first incomplete exercise in this module for "Weiter" button
                  const nextInModule = isComplete ? null : section.exercises.find(e => !e.completed || (e.user_score || 0) < 80);

                  return (
                    <div
                      key={section.id}
                      className={`module-card ${isComplete ? 'module-card--done' : ''}`}
                      data-module-id={section.id}
                    >
                      <div className="module-card-header" onClick={() => setSelectedSection(section.id)}>
                        <div className="module-card-info">
                          <h3 className="module-card-title">{section.title}</h3>
                          {section.moduleDescription && (
                            <p className="module-card-desc">{section.moduleDescription}</p>
                          )}
                          <div className="module-card-meta">
                            <span><BookOpen size={12} /> {section.exerciseCount} Übungen</span>
                            {section.estimatedMinutes > 0 && (
                              <span><Clock size={12} /> ~{section.estimatedMinutes} Min</span>
                            )}
                            {section.completedCount > 0 && (
                              <span><CheckCircle size={12} /> {section.completedCount}/{section.exerciseCount}</span>
                            )}
                          </div>
                          {/* Progress bar */}
                          <div className="progress-bar module-card-progress">
                            <div className="progress-bar-fill" style={{
                              width: `${sectionPct}%`,
                              background: isComplete ? 'var(--success)' : theme.accent,
                            }} />
                          </div>
                        </div>
                        <div className="module-card-actions">
                          {isComplete ? (
                            <span className="module-card-status module-card-status--done">
                              <CheckCircle size={18} /> Abgeschlossen
                            </span>
                          ) : (
                            <span className="module-card-status module-card-status--pending">
                              {sectionPct > 0 ? `${sectionPct}%` : ''}
                            </span>
                          )}
                          <ChevronRight size={20} className="module-card-chevron" />
                        </div>
                      </div>
                      {/* Quick action: continue to next exercise in this module */}
                      {nextInModule && section.completedCount > 0 && (
                        <div className="module-card-footer">
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={(e) => { e.stopPropagation(); navigate(`/exercises/${nextInModule.id}`); }}
                          >
                            <Play size={12} /> Weiter: {nextInModule.title}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── EXERCISE LIST (when section selected) ── */}
          {activeSection && (
            <div className="exercise-list-container">
              {activeSection.exercises.map((ex) => {
                const isUnlocked = user ? (unlockedMap[ex.id] !== false) : true;
                const isMastered = !!(ex.completed && (ex.user_score || 0) >= 80);
                const exScore = ex.user_score || 0;

                return (
                  <div
                    key={ex.id}
                    className={`exercise-row ${!isUnlocked && user ? 'locked' : ''} ${isMastered ? 'mastered' : ''}`}
                    onClick={() => { if (isUnlocked || !user) navigate(`/exercises/${ex.id}`); }}
                  >
                    <span className="exercise-num">
                      {ex.order_index.toString().padStart(2, '0')}
                    </span>
                    <div className="exercise-meta">
                      <h4>
                        {!isUnlocked && user && <Lock size={12} style={{marginRight:4, color:'var(--text-muted)'}} />}
                        {ex.title}
                        {isMastered && <CheckCircle size={14} style={{marginLeft:6, color:'var(--success)'}} />}
                      </h4>
                      <p>
                        {ex.description}
                        {ex.estimated_minutes && isUnlocked && (
                          <span className="inline-tag ml-sm"><Clock size={10} style={{marginRight:3}} />{ex.estimated_minutes} Min</span>
                        )}
                      </p>
                    </div>
                    {ex.completed && ex.user_score != null && (
                      <span className={`score-badge ${exScore >= 80 ? 'score-high' : exScore >= 50 ? 'score-mid' : 'score-low'}`}>
                        {exScore}%
                      </span>
                    )}
                    <ChevronRight size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </div>
                );
              })}
              {activeSection.exercises.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 40 }}>
                  Keine Übungen in diesem Abschnitt.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── SIDEBAR (overview only) ── */}
        {!activeSection && (
          <aside className="course-sidebar">
            {/* Table of Contents */}
            <div className="sidebar-card">
              <h4 className="sidebar-card-title">
                <BookMarked size={16} /> Inhaltsverzeichnis
              </h4>
              <nav className="sidebar-toc">
                {sections.map((section) => {
                  const sectionPct = section.exerciseCount > 0
                    ? Math.round(section.completedCount / section.exerciseCount * 100)
                    : 0;
                  const isComplete = sectionPct >= 100;
                  return (
                    <button
                      key={section.id}
                      className={`sidebar-toc-item ${isComplete ? 'sidebar-toc-item--done' : ''}`}
                      onClick={() => {
                        setSelectedSection(section.id);
                        const el = document.querySelector(`[data-module-id="${section.id}"]`);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      <span className={`sidebar-toc-dot ${isComplete ? 'dot--done' : sectionPct > 0 ? 'dot--progress' : ''}`} />
                      <span className="sidebar-toc-label">{section.title}</span>
                      <span className="sidebar-toc-count">{section.completedCount}/{section.exerciseCount}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Learning Objectives */}
            {stats.learningObjectives.length > 0 && (
              <div className="sidebar-card">
                <h4 className="sidebar-card-title">
                  <Target size={16} /> Lernziele
                </h4>
                <ul className="sidebar-objectives">
                  {stats.learningObjectives.slice(0, 8).map((obj, i) => (
                    <li key={i} className="sidebar-objective-item">
                      <span className="sidebar-objective-bullet" />
                      {obj}
                    </li>
                  ))}
                  {stats.learningObjectives.length > 8 && (
                    <li className="sidebar-objective-more">
                      +{stats.learningObjectives.length - 8} weitere
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Course Info */}
            <div className="sidebar-card">
              <h4 className="sidebar-card-title">
                <GraduationCap size={16} /> Kursinfo
              </h4>
              <div className="sidebar-info-list">
                <div className="sidebar-info-item">
                  <span className="sidebar-info-label">Niveau</span>
                  <span className="sidebar-info-value">{DIFFICULTY_LABELS[course.difficulty] || course.difficulty}</span>
                </div>
                <div className="sidebar-info-item">
                  <span className="sidebar-info-label">Dauer</span>
                  <span className="sidebar-info-value">~{stats.totalMin} Min</span>
                </div>
                <div className="sidebar-info-item">
                  <span className="sidebar-info-label">Übungen</span>
                  <span className="sidebar-info-value">{stats.totalExercises}</span>
                </div>
                <div className="sidebar-info-item">
                  <span className="sidebar-info-label">Module</span>
                  <span className="sidebar-info-value">{stats.uniqueModules || sections.length}</span>
                </div>
                <div className="sidebar-info-item">
                  <span className="sidebar-info-label">Zugang</span>
                  <span className="sidebar-info-value">{isOpen ? 'Offen' : 'Geschlossen'}</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ── Function Map (overview only) ── */}
      {!activeSection && user && (
        <div className="course-function-map">
          <FunctionMap
            masteredSkills={Object.keys(masteryMap)}
            inProgress={course.exercises.filter(e => (e.user_score || 0) > 0 && (e.user_score || 0) < 80 && !masteryMap[e.title.split(':')[0]]).map(e => e.title.split(':')[0])}
          />
        </div>
      )}
    </div>
  );
}
