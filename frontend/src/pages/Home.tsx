import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Play, BookOpen, BarChart3, TrendingUp, GraduationCap, User, Clock, Award, Star, RefreshCw, Trophy, ChevronDown, Code2 } from 'lucide-react';
import { useAuth, apiFetch } from '../context/AuthContext';
import { useTour, HOME_TOUR } from '../components/tour/OnboardingTour';
import homeContent from '../data/home-content.json';

const ICON_MAP: Record<string, React.ReactNode> = {
  Code2: <Code2 size={24} />,
  BookOpen: <BookOpen size={24} />,
  Trophy: <Trophy size={24} />,
  User: <User size={24} />,
  Clock: <Clock size={24} />,
  Award: <Award size={24} />,
  Star: <Star size={24} />,
  RefreshCw: <RefreshCw size={24} />,
  BarChart3: <BarChart3 size={28} />,
  TrendingUp: <TrendingUp size={28} />,
  GraduationCap: <GraduationCap size={28} />,
};

export default function Home() {
  const { user } = useAuth();
  const { startTour } = useTour();
  const [lastExercise, setLastExercise] = useState<{ id: string; title: string; course_title: string } | null>(null);
  const [guestCourseId, setGuestCourseId] = useState<string | null>(null);
  const [guestExerciseId, setGuestExerciseId] = useState<string | null>(null);
  const [courses, setCourses] = useState<{ id: string }[]>([]);

  useEffect(() => {
    if (user) {
      apiFetch('/exercises/user/last-exercise').then(setLastExercise).catch(() => {});
    }
    apiFetch('/courses').then((list: { id: string; first_exercise_id?: string | null }[]) => {
      if (list?.length) {
        setGuestCourseId(list[0].id);
        setGuestExerciseId(list[0].first_exercise_id || null);
        setCourses(list);
      }
    }).catch(() => {});
  }, [user]);

  return (
    <>
      {/* HERO */}
      <section className="hero" style={{ padding: '140px 24px 100px', minHeight: '75vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <div className="hero-inner" style={{ maxWidth: '900px' }}>
          <h1 className="hero-brand" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>
            Excel-lenz
          </h1>
          <p style={{ fontSize: '1.4rem', maxWidth: '780px', margin: '16px auto 0', color: 'var(--text-secondary)' }}>
            Excel lernen, das wirklich passt — interaktive Übungen und verständliche Theorie, abgestimmt auf Ihr Niveau und Ihre Ziele.
          </p>
          <div className="hero-actions" style={{ marginTop: '40px' }}>
            <Link to="/courses" className="btn btn-primary btn-lg">
              Kurse entdecken
            </Link>
            {guestExerciseId ? (
              <Link to={`/exercises/${guestExerciseId}`} className="btn btn-outline btn-lg">
                Als Gast testen
              </Link>
            ) : (
              <Link to="/courses" className="btn btn-outline btn-lg">
                Als Gast testen
              </Link>
            )}
          </div>

          {/* Continue where you left off */}
          {lastExercise && (
            <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
              <Link to={`/exercises/${lastExercise.id}`} className="continue-learning-card" style={{ boxShadow: 'var(--shadow-sm)', border: 'none' }}>
                <span className="continue-icon"><Play size={20} /></span>
                <div>
                  <div className="continue-label">Weitermachen</div>
                  <div className="continue-title">{lastExercise.title}</div>
                  <div className="continue-course"><BookOpen size={12} style={{marginRight:3}} />{lastExercise.course_title}</div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="text-center mb-4">
            <h2>Unsere Lernlösungen</h2>
            <p className="text-muted mt-2 max-w-560">
              Passgenaue Excel-Kurse für jeden Bedarf, vom Einsteiger bis zum Profi.
            </p>
          </div>
          <div className="card-grid-3">
            {homeContent.services.map((svc, i) => {
              let link = svc.link;
              if (i < 2 && courses[i]) link = `/courses/${courses[i].id}`;
              return (
              <div className="card" key={i}>
                <div className="card-icon">{ICON_MAP[svc.icon]}</div>
                <h3>{svc.title}</h3>
                <p>{svc.description}</p>
                <Link to={link} className="btn btn-primary btn-sm mt-3">
                  {svc.linkText}
                </Link>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="section">
        <div className="section-inner">
          <div className="text-center mb-4">
            <h2>Was uns unterscheidet</h2>
            <p className="text-muted mt-2 max-w-560">
              Excel-lenz steht für innovative, praxisnahe Excel-Bildung mit modernster Technologie.
            </p>
          </div>
          <div className="usp-grid">
            {homeContent.usps.map((usp, i) => (
              <div className="usp-card" key={i}>
                <div className={`usp-icon ${i % 2 === 1 ? 'amber' : 'green'}`}>
                  {ICON_MAP[usp.icon]}
                </div>
                <div className="usp-content">
                  <h4>{usp.title}</h4>
                  <p>{usp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIDAKTISCHES KONZEPT */}
      <section className="section section-alt">
        <div className="section-inner">
          <div className="text-center mb-4">
            <h2>Systematisch und strukturiert lernen</h2>
            <p className="text-muted mt-2 max-w-560">
              Ein strukturierter Lehrplan, der Sie Schritt für Schritt durch alle Excel-Funktionen führt.
            </p>
          </div>
          <div className="card-grid-3">
            <div className="card">
              <h3>Strukturierter Lehrplan</h3>
              <p>4 Kurse, 154 Übungen: systematisch vom Anfänger zum Excel-Experten. Jede Übung vermittelt eine klar definierte Kompetenz.</p>
              <Link to="/courses" className="btn btn-primary btn-sm mt-3">Lehrplan ansehen</Link>
            </div>
            <div className="card">
              <h3>Didaktische Methodik</h3>
              <p>Interaktive Spreadsheet-Übungen mit Sofort-Feedback statt passiver Videos. Learning-by-doing mit realen Excel-Funktionen.</p>
              <Link to="/courses" className="btn btn-primary btn-sm mt-3">Kurse entdecken</Link>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="cta-section">
        <h2>Bereit für Ihren Excel-Vorsprung?</h2>
        <p>Starten Sie noch heute mit unseren offenen Übungen und entdecken Sie, wie einfach Excel lernen sein kann.</p>
        <Link to="/courses" className="btn btn-white btn-lg">
          Jetzt starten
        </Link>
      </section>
    </>
  );
}
