import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, BarChart3, Eye, UserPlus, GraduationCap, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { apiFetch, useAuth } from '../context/AuthContext';
import { Skeleton } from '../hooks/useAutosave';

interface Student {
  id: string; name: string; email: string;
  exercises_attempted: number; avg_score: number; exercises_completed: number;
}
interface Course {
  id: string; title: string; description: string; difficulty: string; exercise_count: number; student_count?: number; modules_count?: number;
}

export default function TeacherPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'students' | 'courses' | 'analytics'>('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDetail, setStudentDetail] = useState<any[] | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<{
    exerciseStats: { title: string; course: string; avgScore: number; failRate: number }[];
    totalStudents: number;
  } | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Student | null>(null);
  const [nsName, setNsName] = useState('');
  const [nsEmail, setNsEmail] = useState('');
  const [nsPassword, setNsPassword] = useState('');
  const [nsMsg, setNsMsg] = useState('');

  useEffect(() => {
    if (user?.role !== 'teacher') { navigate('/dashboard'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [s, c] = await Promise.all([
      apiFetch('/teacher/students').then((r: any) => r?.data || []).catch(() => []),
      apiFetch('/courses').catch(() => []),
    ]);
    setStudents(s); setCourses(c); setLoading(false);
  };

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const aResp = await apiFetch('/teacher/analytics').catch(() => ({ data: [] }));
      const sResp = await apiFetch('/teacher/students').catch(() => ({ data: [], total: 0 }));
      const data = aResp?.data || [];
      const exerciseStats = data.map((ex: any) => ({
        title: ex.title, course: ex.course_title,
        avgScore: ex.avg_score || 0,
        failRate: ex.fail_rate || 0,
      }));
      setAnalytics({ exerciseStats, totalStudents: sResp?.total || sResp?.data?.length || 0 });
    } catch { /* ignore */ }
    setAnalyticsLoading(false);
  };

  const addStudent = async () => {
    if (!nsName || !nsEmail || !nsPassword) { setNsMsg('Bitte alle Felder ausfüllen'); return; }
    try {
      await apiFetch('/teacher/students', {
        method: 'POST',
        body: JSON.stringify({ name: nsName, email: nsEmail, password: nsPassword }),
      });
      setNsName(''); setNsEmail(''); setNsPassword('');
      setNsMsg('Schüler erfolgreich registriert!');
      loadData();
      setTimeout(() => { setNsMsg(''); setShowAddStudent(false); }, 2000);
    } catch { setNsMsg('Fehler: Email existiert möglicherweise bereits'); }
  };

  const viewStudentDetail = async (student: Student) => {
    setSelectedStudent(student);
    setStudentDetail(null);
    try {
      const data = await apiFetch(`/teacher/students/${student.id}`);
      if (data?.progress) setStudentDetail(data.progress);
    } catch { setStudentDetail([]); }
  };

  const kpis = useMemo(() => ({
    total: students.length,
    avgScore: students.length > 0 ? Math.round(students.reduce((s, st) => s + (st.avg_score || 0), 0) / students.length) : 0,
    active: students.filter(s => s.exercises_attempted > 0).length,
    completed: students.reduce((s, st) => s + st.exercises_completed, 0),
  }), [students]);

  if (loading) return <Skeleton lines={5} />;

  return (
    <div className="teacher-header" style={{ maxWidth: 1500, margin: '0 auto', padding: '24px 32px 0' }}>
      <h1><GraduationCap size={28} style={{marginRight:8, verticalAlign:'middle'}} />Lehrer-Panel</h1>
      <p>Schüleraktivität überblicken und neue Schüler registrieren</p>

      <div className="teacher-layout" style={{ marginTop: 24 }}>
        <nav className="teacher-sidebar" aria-label="Lehrer-Navigation">
          {([
            { key: 'students' as const, icon: <Users size={16} />, label: 'Schüler' },
            { key: 'courses' as const, icon: <BookOpen size={16} />, label: 'Kurse' },
            { key: 'analytics' as const, icon: <BarChart3 size={16} />, label: 'Analyse' },
          ]).map(({ key, icon, label }) => (
            <button key={key} className={`teacher-sidebar-btn ${tab === key ? 'active' : ''}`}
              onClick={() => { setTab(key); if (key === 'analytics') loadAnalytics(); }}>
              {icon} {label}
            </button>
          ))}
        </nav>

        <div className="teacher-content">

      {tab === 'students' && (
        <div>
          <div className="students-tab-header">
            <h3 style={{ margin: 0 }}><Users size={20} style={{marginRight:8, verticalAlign:'middle'}} />Schüler ({students.length})</h3>
            <button className="btn btn-primary btn-sm desktop-only" onClick={() => setShowAddStudent(true)}>
              <UserPlus size={14} style={{marginRight:4}} />Neuer Schüler
            </button>
          </div>
          <div className="teacher-table-wrap">
            <table className="data-table">
              <thead><tr>
                <th>Name</th><th>Email</th><th style={{textAlign:'center'}}>Versuche</th><th>Score</th><th style={{textAlign:'center'}}>Abgeschlossen</th><th></th>
              </tr></thead>
              <tbody>
                {students.map(s => {
                  const initials = s.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
                  const sc = (s.avg_score||0)>=80?'var(--success)':(s.avg_score||0)>=50?'var(--warning)':'var(--danger)';
                  return (<tr key={s.id}>
                    <td><div style={{display:'flex',alignItems:'center',gap:10}}><span style={{width:32,height:32,borderRadius:'50%',background:'var(--primary-lighter)',color:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.75rem',flexShrink:0}}>{initials}</span><span style={{fontWeight:600}}>{s.name}</span></div></td>
                    <td style={{color:'var(--text-secondary)',fontSize:'0.85rem',whiteSpace:'nowrap'}}>{s.email}</td>
                    <td style={{textAlign:'center'}}>{s.exercises_attempted}</td>
                    <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="progress-bar" style={{flex:1,maxWidth:60}}><div className="progress-bar-fill" style={{width:`${s.avg_score||0}%`,background:sc}}/></div><span style={{fontSize:'0.8rem',fontWeight:600,color:sc}}>{s.avg_score||0}%</span></div></td>
                    <td style={{textAlign:'center'}}>{s.exercises_completed}</td>
                    <td style={{textAlign:'right',paddingRight:16}}>
                      <div style={{display:'inline-flex',gap:4,justifyContent:'flex-end'}}>
                        <button className="btn btn-outline btn-sm" onClick={()=>viewStudentDetail(s)} style={{fontSize:'0.75rem',padding:'3px 8px'}}><Eye size={13} style={{marginRight:4}}/>Details</button>
                        <button className="btn btn-outline btn-sm" onClick={()=>setShowDeleteConfirm(s)} style={{fontSize:'0.75rem',padding:'3px 8px',color:'var(--danger)',borderColor:'var(--danger)'}} title="Schüler löschen"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>);
                })}
                {students.length===0 && <tr><td colSpan={6} style={{padding:32,textAlign:'center',color:'var(--text-muted)'}}>Keine Schüler registriert</td></tr>}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary btn-sm mobile-only" onClick={() => setShowAddStudent(true)} style={{marginTop:12,width:'100%'}}>
            <UserPlus size={14} style={{marginRight:4}} />Neuer Schüler
          </button>
        </div>
      )}

      {tab === 'courses' && (
        <div>
          <h3 style={{ marginBottom: 16 }}><BookOpen size={20} style={{marginRight:8,verticalAlign:'middle'}}/>Kurse ({courses.length})</h3>
          <div className="teacher-kpis" style={{marginBottom:20}}>
            <div className="teacher-kpi">
              <span className="teacher-kpi-label">Schüler</span>
              <span className="teacher-kpi-value">{kpis.total}</span>
            </div>
            <div className="teacher-kpi">
              <span className="teacher-kpi-label">Aktiv</span>
              <span className="teacher-kpi-value">{kpis.active}</span>
            </div>
            <div className="teacher-kpi">
              <span className="teacher-kpi-label">⌀ Score</span>
              <span className="teacher-kpi-value">{kpis.avgScore}%</span>
            </div>
            <div className="teacher-kpi">
              <span className="teacher-kpi-label">Abgeschlossen</span>
              <span className="teacher-kpi-value">{kpis.completed}</span>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {courses.map(c => (
              <div key={c.id} className="teacher-course-card">
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                  <strong style={{fontSize:'1.05rem'}}>{c.title}</strong>
                  <span className={`badge badge-${c.difficulty}`}>{c.difficulty==='beginner'?'Anfänger':c.difficulty==='intermediate'?'Fortgeschritten':'Experte'}</span>
                </div>
                <div className="text-muted" style={{fontSize:'0.85rem',marginBottom:8}}>{c.description}</div>
                <div style={{display:'flex',gap:20,fontSize:'0.82rem',color:'var(--text-secondary)'}}>
                  <span><strong>{c.exercise_count}</strong> Übungen</span>
                  <span><strong>{c.student_count ?? 0}</strong> aktive Schüler</span>
                  {(c.modules_count ?? 0) > 0 && <span><strong>{c.modules_count}</strong> Module</span>}
                </div>
              </div>
            ))}
            {courses.length===0 && <p style={{color:'var(--text-muted)',textAlign:'center',padding:24}}>Keine Kurse vorhanden</p>}
          </div>
        </div>
      )}

      {tab === 'analytics' && (
        <div>
          <h3 style={{marginBottom:12}}><BarChart3 size={20} style={{marginRight:8,verticalAlign:'middle'}}/>Klassen-Analyse</h3>
          {analyticsLoading ? <p style={{color:'var(--text-muted)',textAlign:'center',padding:24}}>Lade Analyse...</p>
          : analytics ? (<>
            <p style={{color:'var(--text-secondary)',fontSize:'0.9rem',marginBottom:16}}>{analytics.totalStudents} Schüler · {analytics.exerciseStats.length} Übungen mit Daten</p>
            {analytics.exerciseStats.filter(e=>e.failRate>=50).length>0 && (
              <div className="card" style={{marginBottom:16,padding:'12px 16px',borderLeft:'3px solid var(--danger)'}}>
                <strong style={{color:'var(--danger)'}}>Achtung:</strong> {analytics.exerciseStats.filter(e=>e.failRate>=50).length} Übungen haben eine hohe Fehlerquote.
              </div>
            )}
          </>) : <p style={{color:'var(--text-muted)',textAlign:'center',padding:24}}>Keine Analysedaten verfügbar</p>}
          {analytics && (() => {
            const grouped = new Map<string, typeof analytics.exerciseStats>();
            for (const ex of analytics.exerciseStats) {
              const list = grouped.get(ex.course) || [];
              list.push(ex);
              grouped.set(ex.course, list);
            }
            return [...grouped.entries()].map(([course, exercises]) => {
              const isOpen = expandedCourses.has(course);
              const failCount = exercises.filter(e => e.failRate >= 50).length;
              return (
                <div key={course} className="teacher-analytics-panel">
                  <button onClick={() => {
                    const next = new Set(expandedCourses);
                    isOpen ? next.delete(course) : next.add(course);
                    setExpandedCourses(next);
                  }} className="teacher-analytics-toggle">
                    {isOpen ? <ChevronDown size={16} style={{color:'var(--text-muted)'}}/> : <ChevronRight size={16} style={{color:'var(--text-muted)'}}/>}
                    {course}
                    <span className="teacher-analytics-meta" style={{marginLeft:8}}>{exercises.length} Übungen</span>
                    {failCount > 0 && <span className="teacher-analytics-badge">{failCount} kritisch</span>}
                  </button>
                  {isOpen && (
                    <table className="data-table" style={{marginBottom:0}}>
                      <thead><tr>{['Übung','Score','Quote'].map(h=><th key={h}>{h}</th>)}</tr></thead>
                      <tbody>{exercises.map((ex,i)=>(
                        <tr key={i}>
                          <td style={{fontWeight:500,fontSize:'0.88rem'}}>{ex.title}</td>
                          <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="progress-bar" style={{flex:1,maxWidth:80}}><div className="progress-bar-fill" style={{width:`${Math.round(ex.avgScore)}%`,background:ex.avgScore>=80?'var(--success)':ex.avgScore>=50?'var(--warning)':'var(--danger)'}}/></div><span style={{fontSize:'0.82rem',fontWeight:600}}>{Math.round(ex.avgScore)}%</span></div></td>
                          <td><span style={{padding:'2px 10px',borderRadius:12,fontSize:'0.78rem',fontWeight:600,background:ex.failRate>=50?'var(--danger-light)':'var(--success-light)',color:ex.failRate>=50?'var(--danger)':'var(--success)'}}>{ex.failRate>=50?'Hoch':'Niedrig'}</span></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              );
            });
          })()}
        </div>
      )}

        </div>
      </div>

      {selectedStudent && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={()=>setSelectedStudent(null)}>
          <div className="card" style={{maxWidth:600,width:'90%',maxHeight:'80vh',overflow:'auto',padding:24}} onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between mb-3"><h3>{selectedStudent.name}</h3><button className="btn btn-outline btn-sm" onClick={()=>setSelectedStudent(null)}>✕</button></div>
            <p className="text-muted mb-3">Email: {selectedStudent.email} | {selectedStudent.avg_score}% | {selectedStudent.exercises_completed} abgeschlossen</p>
            <h4 className="text-md mb-2">Übungen:</h4>
            {studentDetail===null ? <p>Wird geladen...</p> : studentDetail.length===0 ? <p className="text-muted">Noch keine Übungen absolviert.</p> : (
              <div className="flex-col gap-sm">{studentDetail.map((p:any)=>(
                <div key={p.id} className="card" style={{padding:'8px 12px',fontSize:'0.85rem'}}>
                  <div className="flex justify-between"><span>{p.exercise_title||p.title}</span><span style={{fontWeight:600,color:p.score>=80?'var(--success)':p.score>=50?'var(--warning)':'var(--danger)'}}>{p.score}%</span></div>
                  <div className="text-muted text-xs">{p.course_title}</div>
                </div>
              ))}</div>
            )}
          </div>
        </div>
      )}

      {/* STUDENT REGISTRATION MODAL */}
      {showAddStudent && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={() => { setShowAddStudent(false); setNsMsg(''); }}>
          <div className="card" style={{maxWidth:440,width:'90%',padding:24}} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-3">
              <h3 style={{margin:0}}>Schüler registrieren</h3>
              <button className="btn btn-outline btn-sm" onClick={() => { setShowAddStudent(false); setNsMsg(''); }}>✕</button>
            </div>
            {nsMsg && <p style={{ color: nsMsg.includes('Fehler') ? 'var(--danger)' : 'var(--success)', marginBottom: 16, fontSize: '0.85rem' }}>{nsMsg}</p>}
            <div className="form-group"><label>Name</label><input className="form-input" value={nsName} onChange={e => setNsName(e.target.value)} placeholder="Max Mustermann" autoFocus /></div>
            <div className="form-group"><label>Email</label><input className="form-input" type="email" value={nsEmail} onChange={e => setNsEmail(e.target.value)} placeholder="max@example.com" /></div>
            <div className="form-group"><label>Passwort</label><input className="form-input" type="password" value={nsPassword} onChange={e => setNsPassword(e.target.value)} placeholder="Mindestens 8 Zeichen" /></div>
            <div className="flex gap-sm" style={{marginTop:8}}>
              <button className="btn btn-primary" onClick={addStudent} style={{flex:1}}>Registrieren</button>
              <button className="btn btn-outline" onClick={() => { setShowAddStudent(false); setNsMsg(''); }}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={() => setShowDeleteConfirm(null)}>
          <div className="card" style={{maxWidth:400,width:'90%',padding:24}} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-3">
              <h3 style={{margin:0}}>Schüler löschen</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowDeleteConfirm(null)}>✕</button>
            </div>
            <p style={{color:'var(--text-secondary)',marginBottom:20,lineHeight:1.5}}>
              Möchten Sie den Schüler <strong>{showDeleteConfirm.name}</strong> ({showDeleteConfirm.email}) wirklich löschen? Alle zugehörigen Lernfortschritte werden unwiderruflich entfernt.
            </p>
            <div className="flex gap-sm">
              <button className="btn btn-danger" onClick={async () => {
                const s = showDeleteConfirm;
                setShowDeleteConfirm(null);
                try {
                  await apiFetch(`/teacher/students/${s.id}`, { method: 'DELETE' });
                  setStudents(prev => prev.filter(st => st.id !== s.id));
                } catch { /* silently fail */ }
              }} style={{flex:1}}>Löschen</button>
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
