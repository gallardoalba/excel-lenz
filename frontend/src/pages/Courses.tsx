import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { apiFetch, useAuth } from '../context/AuthContext';
import { ExcelSpinner } from '../components/animations/Celebrations';
import { COURSE_ICONS, COURSE_THEME, DIFFICULTY_LABELS, translateCourse } from '../data/course-config';

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  exercise_count: number;
}

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/courses')
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ExcelSpinner text="Kurse werden geladen..." />;

  // Temporarily hide certain courses
  const visibleCourses = courses.filter(c =>
    c.title !== 'Datenanalyse & Statistik' && c.title !== 'Datenbank & Business Intelligence'
  );

  return (
    <div>
      {/* ── HERO HEADER ── */}
      <section className="courses-hero">
        <h1>
          <BookOpen size={28} style={{marginRight:10, verticalAlign:'middle'}} />
          Verfügbare Kurse
        </h1>
        <p className="courses-hero-desc">
          Entdecken Sie unsere interaktiven Kurse mit praktischen Excel-Übungen
        </p>
        <p className="courses-hero-meta">
          {visibleCourses.length} Kurse · {visibleCourses.reduce((s, c) => s + c.exercise_count, 0)} Übungen
        </p>
      </section>

      {/* ── COURSE GRID ── */}
      <div className="courses-grid-container">
        {visibleCourses.length === 0 ? (
          <div className="card text-center p-4 mt-4">
            <p className="text-secondary">Noch keine Kurse verfügbar. Schauen Sie bald wieder vorbei!</p>
          </div>
        ) : (
          <div className="course-grid">
            {visibleCourses.map((course) => {
              const theme = COURSE_THEME[course.title] || { accent: '#666', bg: '#f5f5f5' };
              const tc = translateCourse(course);
              const isFree = course.title === 'Excel für Anfänger';

              return (
                <Link to={`/courses/${course.id}`} key={course.id} className="course-card">
                  <article>
                    <div className="course-card-header">
                      <span className="course-card-icon">
                        {COURSE_ICONS[course.title] || <BookOpen size={24} />}
                      </span>
                      <div className="course-card-badges">
                        <span className="badge" style={{ background: theme.bg, color: theme.accent }}>
                          {DIFFICULTY_LABELS[course.difficulty] || course.difficulty}
                        </span>
                        {isFree && (
                          <span className="badge badge-success">Kostenlos</span>
                        )}
                      </div>
                    </div>

                    <h3>{tc.title}</h3>
                    <p className="course-card-desc">{tc.description}</p>

                    <div className="course-card-footer">
                      <span className="course-card-count">
                        <BookOpen size={13} /> {course.exercise_count} Übungen
                      </span>
                      <span className="course-card-cta">Starten →</span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
