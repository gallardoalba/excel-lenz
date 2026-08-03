import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Play, BookOpen, BarChart3, TrendingUp, GraduationCap, User, Clock, Award, Star, RefreshCw } from 'lucide-react';
import { useAuth, apiFetch } from '../context/AuthContext';
import { useTour, HOME_TOUR } from '../components/tour/OnboardingTour';
import homeContent from '../data/home-content.json';

const ICON_MAP: Record<string, React.ReactNode> = {
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

  useEffect(() => {
    if (user) {
      apiFetch('/exercises/user/last-exercise').then(setLastExercise).catch(() => {});
    }
    // Fetch first course ID dynamically for "Als Gast testen" button
    apiFetch('/courses').then((courses: { id: string }[]) => {
      if (courses?.length) setGuestCourseId(courses[0].id);
    }).catch(() => {});
  }, [user]);

  return (
    <>
      {/* HERO */}
      <section className="hero" style={{ padding: '120px 24px 80px' }}>
        <div className="hero-inner" style={{ maxWidth: '900px' }}>
          <span className="hero-badge">
            Interaktives Lerninstitut für Excel
          </span>
          <h1 style={{ marginTop: '24px' }}>
            Excel lernen, das wirklich{' '}
            <span style={{ color: 'var(--accent)' }}>passt.</span>
          </h1>
          <p style={{ fontSize: '1.3rem', maxWidth: '680px', margin: '24px auto 0', color: 'var(--text-secondary)' }}>
            Unsere interaktiven Excel-Übungen passen sich Ihrem Niveau, Ihrem Tempo und Ihren Zielen an.
          </p>
          <div className="hero-actions" style={{ marginTop: '40px' }}>
            <Link to="/courses" className="btn btn-primary btn-lg">
              Kurse entdecken
            </Link>
            {guestCourseId ? (
              <Link to={`/courses/${guestCourseId}`} className="btn btn-outline btn-lg">
                Als Gast testen
              </Link>
            ) : (
              <Link to="/courses" className="btn btn-outline btn-lg">
                Kurse entdecken
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
              Passgenaue Excel-Kurse für jeden Bedarf – vom Einsteiger bis zum Profi.
            </p>
          </div>
          <div className="card-grid-3">
            {homeContent.services.map((svc, i) => (
              <div className="card" key={i}>
                <div className="card-icon">{ICON_MAP[svc.icon]}</div>
                <h3>{svc.title}</h3>
                <p>{svc.description}</p>
                <Link to={svc.link} className="btn btn-primary btn-sm mt-3">
                  {svc.linkText}
                </Link>
              </div>
            ))}
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


      {/* BOTTOM CTA */}
      <section className="cta-section">
        <h2>Bereit für Ihren Excel-Vorsprung?</h2>
        <p>Starten Sie noch heute mit unseren offenen Übungen und entdecken Sie, wie einfach Excel lernen sein kann.</p>
        <Link to="/register" className="btn btn-white btn-lg">
          Jetzt starten
        </Link>
      </section>
    </>
  );
}
