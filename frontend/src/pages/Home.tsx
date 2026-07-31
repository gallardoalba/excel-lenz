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

  useEffect(() => {
    if (user) {
      apiFetch('/exercises/user/last-exercise').then(setLastExercise).catch(() => {});
    }
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
            <Link to="/courses/d2f44dd9-e1df-4ea3-aa41-84ed501362b1" className="btn btn-outline btn-lg">
              Als Gast testen
            </Link>
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

      {/* STATISTICS — Light section, big numbers, no dark box */}
      <section className="section" style={{ padding: '80px 24px', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="stats-grid" style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
          <div className="stat-item" style={{ padding: '8px' }}>
            <div style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', fontWeight: '800', color: 'var(--text)', lineHeight: '1.1' }}>10+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Jahre Bildungserfahrung</div>
          </div>
          <div className="stat-item" style={{ padding: '8px' }}>
            <div style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', fontWeight: '800', color: 'var(--text)', lineHeight: '1.1' }}>200+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Interaktive Übungen</div>
          </div>
          <div className="stat-item" style={{ padding: '8px' }}>
            <div style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', fontWeight: '800', color: 'var(--text)', lineHeight: '1.1' }}>15.000+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Zufriedene Lernende</div>
          </div>
          <div className="stat-item" style={{ padding: '8px' }}>
            <div style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', fontWeight: '800', color: 'var(--text)', lineHeight: '1.1' }}>98%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Weiterempfehlungsrate</div>
          </div>
        </div>
      </section>

      {/* CLIENT LOGOS */}
      <section className="section section-alt">
        <div className="section-inner">
          <p className="text-label text-center mb-md">Vertrauen von führenden Institutionen</p>
          <div className="client-logos-grid">
            {homeContent.clients.map((name) => (
              <span key={name} className="client-logo-item">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section">
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
      <section className="section section-alt">
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

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="section-inner">
          <div className="text-center mb-4">
            <h2>Erfahrung, die begeistert</h2>
            <p className="text-muted mt-2 max-w-560">
              Was unsere Lernenden über Excel-lenz sagen.
            </p>
          </div>
          <div className="testimonial-grid">
            {homeContent.testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <p className="testimonial-text">{t.text}</p>
                <p className="testimonial-author">{t.author}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="cta-section">
        <h2>Bereit für Ihren Excel-Vorsprung?</h2>
        <p>Starten Sie noch heute mit unseren kostenlosen Übungen und entdecken Sie, wie einfach Excel lernen sein kann.</p>
        <Link to="/register" className="btn btn-white btn-lg">
          Jetzt kostenlos starten
        </Link>
      </section>
    </>
  );
}
