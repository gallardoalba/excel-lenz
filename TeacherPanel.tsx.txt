import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Plus, FileText, Edit, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { apiFetch, useAuth } from '../context/AuthContext';
import { Skeleton } from '../hooks/useAutosave';

interface Student {
  id: string; name: string; email: string;
  exercises_attempted: number; avg_score: number; exercises_completed: number;
}

interface Course {
  id: string; title: string; description: string; difficulty: string; exercise_count: number;
}

export default function TeacherPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'students' | 'courses' | 'analytics' | 'groups' | 'new-course' | 'new-exercise' | 'edit-exercise'>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editExId, setEditExId] = useState('');
  const [analytics, setAnalytics] = useState<{
    exerciseStats: { title: string; course: string; attempts: number; avgScore: number; failRate: number }[];
    totalStudents: number;
  } | null>(null);
  // Cohorts/Groups — localStorage persistence
  const [groups, setGroups] = useState<{ name: string; studentIds: string[] }[]>(() => {
    try { return JSON.parse(localStorage.getItem('excel-lenz_groups') || '[]'); } catch { return []; }
  });
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // New course form
  const [ncTitle, setNcTitle] = useState('');
  const [ncDesc, setNcDesc] = useState('');
  const [ncDiff, setNcDiff] = useState('beginner');

  // New exercise form
  const [neCourseId, setNeCourseId] = useState('');
  const [neTitle, setNeTitle] = useState('');
  const [neDesc, setNeDesc] = useState('');
  const [neInstructions, setNeInstructions] = useState('');
  const [neCols, setNeCols] = useState(3);
  const [neRows, setNeRows] = useState(5);
  const [neHeaders, setNeHeaders] = useState('');
  const [neTaskCols, setNeTaskCols] = useState('');
  const [neHint, setNeHint] = useState('');
  const [neMsg, setNeMsg] = useState('');

  useEffect(() => {
    if (user?.role !== 'teacher') { navigate('/dashboard'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [s, c] = await Promise.all([
      apiFetch('/teacher/students').catch(() => []),
      apiFetch('/courses').catch(() => []),
    ]);
    setStudents(s); setCourses(c); setLoading(false);
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Build analytics from student + course data
      const [s, c] = await Promise.all([
        apiFetch('/teacher/students').catch(() => []),
        apiFetch('/courses').catch(() => []),
      ]);
      // Fetch all exercises for all courses
      const allExercises: any[] = [];
      for (const course of c) {
        const detail = await apiFetch(`/courses/${course.id}`).catch(() => null);
        if (detail?.exercises) {
          for (const ex of detail.exercises) {
            allExercises.push({ ...ex, courseTitle: course.title });
          }
        }
      }
      // Calculate stats per exercise
      const exerciseStats = allExercises
        .filter((ex: any) => (ex.user_score != null || ex.completed))
        .map((ex: any) => ({
          title: ex.title,
          course: ex.courseTitle,
          attempts: ex.completed ? 1 : 0,
          avgScore: ex.user_score || 0,
          failRate: (ex.user_score || 0) < 50 ? 100 : 0,
        }));
      setAnalytics({
        exerciseStats: exerciseStats.slice(0, 20),
        totalStudents: s.length,
      });
    } catch { /* ignore */ }
    setLoading(false);
  };

  const createCourse = async () => {
    await apiFetch('/teacher/courses', { method: 'POST', body: JSON.stringify({ title: ncTitle, description: ncDesc, difficulty: ncDiff }) });
    setNcTitle(''); setNcDesc(''); setTab('courses');
    loadData();
  };

  const createExercise = async () => {
    if (!neCourseId || !neTitle || !neHeaders) { setNeMsg('Bitte alle Pflichtfelder ausfüllen'); return; }
    const headers = neHeaders.split(',').map(h => h.trim());
    const taskCols = neTaskCols.split(',').map(c => parseInt(c.trim())).filter(n => !isNaN(n));
    const emptyData = Array.from({ length: neRows }, () => Array(neCols).fill(null));
    const emptySolution = Array.from({ length: neRows }, () => Array(neCols).fill(null));

    const template = { cols: neCols, rows: neRows, headers, data: emptyData, taskCols, formulaHint: neHint || undefined };
    const solution = { data: emptySolution };

    await apiFetch('/teacher/exercises', {
      method: 'POST',
      body: JSON.stringify({
        course_id: neCourseId, title: neTitle, description: neDesc,
        template_data: template, solution_data: solution,
        instructions: neInstructions,
      }),
    });

    setNeTitle(''); setNeDesc(''); setNeInstructions(''); setNeHeaders(''); setNeTaskCols(''); setNeHint('');
    setNeMsg('Übung erstellt!');
    loadData();
    setTimeout(() => setNeMsg(''), 3000);
  };

  const editExercise = async (exId: string) => {
    // Fetch exercise data and switch to edit tab
    const ex = await apiFetch(`/exercises/${exId}`).catch(() => null);
    if (!ex) return;
    setEditExId(exId);
    setNeCourseId(ex.course_id || '');
    setNeTitle(ex.title || '');
    setNeDesc(ex.description || '');
    setNeInstructions(ex.instructions || '');
    const tpl = ex.template_data || {};
    setNeCols(tpl.cols || 3);
    setNeRows(tpl.rows || 5);
    setNeHeaders((tpl.headers || []).join(', '));
    setNeTaskCols((tpl.taskCols || []).join(', '));
    setNeHint(tpl.formulaHint || '');
    setTab('edit-exercise');
  };

  const saveExercise = async () => {
    if (!editExId) return;
    const headers = neHeaders.split(',').map(h => h.trim());
    const taskCols = neTaskCols.split(',').map(c => parseInt(c.trim())).filter(n => !isNaN(n));
    await apiFetch(`/teacher/exercises/${editExId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: neTitle, description: neDesc, instructions: neInstructions,
        template_data: { cols: neCols, rows: neRows, headers, taskCols, formulaHint: neHint || undefined },
        course_id: neCourseId,
      }),
    });
    setNeMsg('Übung aktualisiert!');
    setEditExId('');
    setTab('courses');
    loadData();
    setTimeout(() => setNeMsg(''), 3000);
  };
  const deleteCourse = async (id: string) => {
    if (!confirm('Kurs wirklich löschen?')) return;
    await apiFetch(`/teacher/courses/${id}`, { method: 'DELETE' });
    loadData();
  };

  if (loading) return <Skeleton lines={5} />;

  return (
    <div>
      <h1 style={{ marginBottom: 4 }}><FileText size={28} style={{marginRight:8, verticalAlign:'middle'}} />Lehrer-Panel</h1>
      <p className="text-muted mb-3">Kurse & Übungen verwalten, Schüler überblicken</p>

      <div className="teacher-layout">
        {/* ── SIDEBAR ── */}
        <nav className="teacher-sidebar" aria-label="Lehrer-Navigation">
          {([
            { key: 'students', icon: <Users size={16} />, label: 'Schüler' },
            { key: 'courses', icon: <BookOpen size={16} />, label: 'Kurse' },
            { key: 'analytics', icon: <BarChart3 size={16} />, label: 'Analyse' },
            { key: 'groups', icon: <Users size={16} />, label: 'Gruppen' },
            { key: 'new-course', icon: <Plus size={16} />, label: 'Neuer Kurs' },
            { key: 'new-exercise', icon: <FileText size={16} />, label: 'Neue Übung' },
          ] as const).map(({ key, icon, label }) => (
            <button
              key={key}
              className={`teacher-sidebar-btn ${tab === key ? 'active' : ''}`}
              onClick={() => { setTab(key); if (key === 'analytics') loadAnalytics(); }}
            >
              {icon} {label}
            </button>
          ))}
          {tab === 'edit-exercise' && (
            <button className="teacher-sidebar-btn active">
              <Edit size={16} /> Übung bearbeiten
            </button>
          )}
        </nav>

        {/* ── CONTENT ── */}
        <div className="teacher-content">

      {/* ANALYTICS TAB */}
      {tab === 'analytics' && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}><BarChart3 size={20} style={{marginRight:8, verticalAlign:'middle'}} />Klassen-Analyse</h3>
          {analytics ? (
            <>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
                {analytics.totalStudents} Schüler · {analytics.exerciseStats.length} Übungen mit Daten
              </p>
              {analytics.exerciseStats.filter(e => e.failRate >= 50).length > 0 && (
                <div style={{
                  padding: '12px 16px', marginBottom: 20,
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--danger)',
                }}>
                  <strong style={{ color: 'var(--danger)' }}>Achtung:</strong>{' '}
                  {analytics.exerciseStats.filter(e => e.failRate >= 50).length} Übungen haben eine hohe Fehlerquote.
                  Diese Themen sollten im Präsenzunterricht wiederholt werden.
                </div>
              )}
              <table className="data-table">
                <thead>
                  <tr>
                    {['Übung', 'Kurs', '⌀ Score', 'Quote'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analytics.exerciseStats.map((ex, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500, fontSize: '0.88rem' }}>{ex.title}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{ex.course}</td>
                      <td style={{ padding: '8px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar" style={{ flex: 1, maxWidth: 80 }}>
                            <div className="progress-bar-fill" style={{
                              width: `${Math.round(ex.avgScore)}%`,
                              background: ex.avgScore >= 80 ? 'var(--success)' : ex.avgScore >= 50 ? 'var(--warning)' : 'var(--danger)',
                            }} />
                          </div>
                          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{Math.round(ex.avgScore)}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '8px 14px' }}>
                        <span style={{
                          padding: '2px 10px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 600,
                          background: ex.failRate >= 50 ? 'var(--danger-light)' : 'var(--success-light)',
                          color: ex.failRate >= 50 ? 'var(--danger)' : 'var(--success)',
                        }}>
                          {ex.failRate >= 50 ? 'Hoch' : 'Niedrig'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>Lade Analyse...</p>
          )}
        </div>
      )}

      {/* GROUPS TAB */}
      {tab === 'groups' && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}><Users size={20} style={{marginRight:8, verticalAlign:'middle'}} />Gruppen-Verwaltung</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 20 }}>
            Erstellen Sie Gruppen für Ihre Präsenzklassen und weisen Sie Schüler zu.
          </p>

          {/* Create group */}
          <div className="flex gap-sm" style={{ marginBottom: 20 }}>
            <input
              className="form-input"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Gruppenname (z.B. Klasse Dienstag)"
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary btn-sm" onClick={() => {
              if (!newGroupName.trim()) return;
              const updated = [...groups, { name: newGroupName.trim(), studentIds: [] }];
              setGroups(updated);
              localStorage.setItem('excel-lenz_groups', JSON.stringify(updated));
              setNewGroupName('');
            }}>Gruppe erstellen</button>
          </div>

          {/* Group list */}
          {groups.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 16 }}>Noch keine Gruppen erstellt.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {groups.map((g, idx) => {
                const groupStudents = students.filter(s => g.studentIds.includes(s.id));
                const avgScore = groupStudents.length > 0
                  ? Math.round(groupStudents.reduce((sum, s) => sum + s.avg_score, 0) / groupStudents.length)
                  : 0;
                const isSelected = selectedGroup === g.name;
                return (
                  <div key={idx} className="card" style={{ padding: '12px 16px' }}>
                    <div className="flex justify-between" style={{ marginBottom: isSelected ? 12 : 0 }}>
                      <div>
                        <strong>{g.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 12 }}>
                          {groupStudents.length} Schüler · ⌀ {avgScore}%
                        </span>
                      </div>
                      <div className="flex gap-sm">
                        <button className="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                          onClick={() => setSelectedGroup(isSelected ? null : g.name)}>
                          {isSelected ? 'Schließen' : 'Verwalten'}
                        </button>
                        <button className="btn btn-danger btn-sm" style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                          onClick={() => {
                            const updated = groups.filter((_, i) => i !== idx);
                            setGroups(updated);
                            localStorage.setItem('excel-lenz_groups', JSON.stringify(updated));
                          }}>Löschen</button>
                      </div>
                    </div>

                    {isSelected && (
                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10 }}>
                          Schüler zuweisen (klicken zum Hinzufügen/Entfernen):
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {students.map(s => {
                            const isIn = g.studentIds.includes(s.id);
                            return (
                              <button key={s.id}
                                onClick={() => {
                                  const updated = [...groups];
                                  if (isIn) {
                                    updated[idx].studentIds = updated[idx].studentIds.filter(id => id !== s.id);
                                  } else {
                                    updated[idx].studentIds = [...updated[idx].studentIds, s.id];
                                  }
                                  setGroups(updated);
                                  localStorage.setItem('excel-lenz_groups', JSON.stringify(updated));
                                }}
                                style={{
                                  padding: '4px 12px', borderRadius: 20, border: '1px solid var(--border)',
                                  background: isIn ? 'var(--primary-light)' : 'var(--surface)',
                                  color: isIn ? 'var(--primary)' : 'var(--text-secondary)',
                                  cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit',
                                  fontWeight: isIn ? 600 : 400,
                                }}
                              >
                                {isIn ? '✓ ' : ''}{s.name}
                              </button>
                            );
                          })}
                        </div>
                        {/* Group progress summary */}
                        {groupStudents.length > 0 && (
                          <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)' }}>
                            <strong style={{ fontSize: '0.85rem' }}>Gruppen-Fortschritt</strong>
                            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {groupStudents.map(s => (
                                <div key={s.id} className="flex justify-between" style={{ fontSize: '0.82rem' }}>
                                  <span>{s.name}</span>
                                  <div className="flex items-center gap-sm">
                                    <div className="progress-bar" style={{ width: 80 }}>
                                      <div className="progress-bar-fill" style={{ width: `${s.avg_score || 0}%` }} />
                                    </div>
                                    <span style={{ fontWeight: 600, minWidth: 32, textAlign: 'right' }}>{s.avg_score || 0}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STUDENTS TAB */}
      {tab === 'students' && (
        <div className="card" style={{ overflow: 'auto', padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                {['Name', 'Email', 'Versuche', 'Score', 'Abgeschlossen'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const initials = s.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                const scoreColor = (s.avg_score || 0) >= 80 ? 'var(--success)' : (s.avg_score || 0) >= 50 ? 'var(--warning)' : 'var(--danger)';
                return (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--primary-lighter)', color: 'var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
                      }}>{initials}</span>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.email}</td>
                  <td>{s.exercises_attempted}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ flex: 1, maxWidth: 80 }}>
                        <div className="progress-bar-fill" style={{ width: `${s.avg_score || 0}%`, background: scoreColor }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: scoreColor }}>
                        {s.avg_score || 0}%
                      </span>
                    </div>
                  </td>
                  <td>{s.exercises_completed}</td>
                </tr>
                );
              })}
              {students.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Keine Schüler registriert</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* COURSES TAB */}
      {tab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {courses.map((c) => (
            <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{c.title}</strong>
                <span className={`badge badge-${c.difficulty}`} style={{ marginLeft: 10 }}>
                  {c.difficulty === 'beginner' ? 'Anfänger' : c.difficulty === 'intermediate' ? 'Fortgeschritten' : 'Experte'}
                </span>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}><FileText size={12} style={{marginRight:4}} />{c.exercise_count} Übungen</div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => deleteCourse(c.id)}>Löschen</button>
            </div>
          ))}
        </div>
      )}

      {/* NEW COURSE */}
      {tab === 'new-course' && (
        <div className="card" style={{ maxWidth: 500 }}>
          <div className="form-group"><label>Kurstitel *</label>
            <input className="form-input" value={ncTitle} onChange={e => setNcTitle(e.target.value)} placeholder="z.B. Excel für Fortgeschrittene" />
          </div>
          <div className="form-group"><label>Beschreibung *</label>
            <textarea className="form-input" value={ncDesc} onChange={e => setNcDesc(e.target.value)} rows={3} placeholder="Kurzbeschreibung..." />
          </div>
          <div className="form-group"><label>Schwierigkeit</label>
            <select className="form-input" value={ncDiff} onChange={e => setNcDiff(e.target.value)}>
              <option value="beginner">Anfänger</option>
              <option value="intermediate">Fortgeschritten</option>
              <option value="advanced">Experte</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={createCourse}>Kurs erstellen</button>
        </div>
      )}

      {/* NEW EXERCISE */}
      {tab === 'new-exercise' && (
        <div className="card" style={{ maxWidth: 600 }}>
          {neMsg && <p style={{ color: 'var(--success)', marginBottom: 16 }}>{neMsg}</p>}
          <div className="form-group"><label>Kurs *</label>
            <select className="form-input" value={neCourseId} onChange={e => setNeCourseId(e.target.value)}>
              <option value="">— Kurs wählen —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Übungstitel *</label>
            <input className="form-input" value={neTitle} onChange={e => setNeTitle(e.target.value)} placeholder="z.B. Pivot-Tabellen erstellen" />
          </div>
          <div className="form-group"><label>Beschreibung</label>
            <input className="form-input" value={neDesc} onChange={e => setNeDesc(e.target.value)} placeholder="Kurzbeschreibung der Übung" />
          </div>
          <div className="form-group"><label>Anleitung</label>
            <textarea className="form-input" value={neInstructions} onChange={e => setNeInstructions(e.target.value)} rows={3} placeholder="Schritt-für-Schritt Anleitung..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group"><label>Spaltenanzahl</label>
              <input className="form-input" type="number" value={neCols} onChange={e => setNeCols(parseInt(e.target.value) || 1)} min={1} max={10} />
            </div>
            <div className="form-group"><label>Zeilenanzahl</label>
              <input className="form-input" type="number" value={neRows} onChange={e => setNeRows(parseInt(e.target.value) || 1)} min={1} max={50} />
            </div>
          </div>
          <div className="form-group"><label>Spaltenüberschriften * (Komma-getrennt)</label>
            <input className="form-input" value={neHeaders} onChange={e => setNeHeaders(e.target.value)} placeholder="Name, Wert, Ergebnis" />
          </div>
          <div className="form-group"><label>Aufgaben-Spalten (0-basiert, Komma-getrennt)</label>
            <input className="form-input" value={neTaskCols} onChange={e => setNeTaskCols(e.target.value)} placeholder="2" />
          </div>
          <div className="form-group"><label>Formel-Hinweis</label>
            <input className="form-input" value={neHint} onChange={e => setNeHint(e.target.value)} placeholder="z.B. =SUMME(B2:D2)" />
          </div>
          <button className="btn btn-primary" onClick={createExercise}>Übung erstellen</button>
        </div>
      )}
      {/* EDIT EXERCISE */}
      {tab === 'edit-exercise' && (
        <div className="card" style={{ maxWidth: 600 }}>
          {neMsg && <p style={{ color: 'var(--success)', marginBottom: 16 }}>{neMsg}</p>}
          <h3 className="mb-2"><Edit size={16} style={{marginRight:6, verticalAlign:'middle'}} />Übung bearbeiten</h3>
          <div className="form-group"><label>Kurs</label>
            <select className="form-input" value={neCourseId} onChange={e => setNeCourseId(e.target.value)}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Übungstitel</label>
            <input className="form-input" value={neTitle} onChange={e => setNeTitle(e.target.value)} />
          </div>
          <div className="form-group"><label>Beschreibung</label>
            <input className="form-input" value={neDesc} onChange={e => setNeDesc(e.target.value)} />
          </div>
          <div className="form-group"><label>Anleitung</label>
            <textarea className="form-input" value={neInstructions} onChange={e => setNeInstructions(e.target.value)} rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group"><label>Spalten</label>
              <input className="form-input" type="number" value={neCols} onChange={e => setNeCols(parseInt(e.target.value) || 1)} />
            </div>
            <div className="form-group"><label>Zeilen</label>
              <input className="form-input" type="number" value={neRows} onChange={e => setNeRows(parseInt(e.target.value) || 1)} />
            </div>
          </div>
          <div className="form-group"><label>Spaltenüberschriften</label>
            <input className="form-input" value={neHeaders} onChange={e => setNeHeaders(e.target.value)} />
          </div>
          <div className="form-group"><label>Aufgaben-Spalten</label>
            <input className="form-input" value={neTaskCols} onChange={e => setNeTaskCols(e.target.value)} />
          </div>
          <div className="form-group"><label>Formel-Hinweis</label>
            <input className="form-input" value={neHint} onChange={e => setNeHint(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={saveExercise}><FileText size={14} style={{marginRight:4}} />Speichern</button>
            <button className="btn btn-outline" onClick={() => { setTab('courses'); setEditExId(''); }}>Abbrechen</button>
          </div>
        </div>
      )}
        </div>{/* teacher-content */}
      </div>{/* teacher-layout */}
    </div>
  );
}
