import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Trophy, Play, BookOpen, BarChart3, TrendingUp, GraduationCap, Zap, User, Clock, Award, Star, RefreshCw, HelpCircle } from 'lucide-react';
import { useAuth, apiFetch } from '../context/AuthContext';
import { useTour, HOME_TOUR } from '../components/tour/OnboardingTour';
import homeContent from '../data/home-content.json';

const ICON_MAP: Record<string, React.ReactNode> = {
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

  useEffect(() => {
    if (user) {
      apiFetch('/exercises/user/last-exercise').then(setLastExercise).catch(() => {});
    }
  }, [user]);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-badge"><Trophy size={14} style={{marginRight:4}} />Interaktives Lerninstitut für Excel</span>
          <h1>
            Excel lernen, das wirklich{' '}
            <span className="highlight gradient-text">passt.</span>
          </h1>
          <p>Weil Bildung nur dann wirkt, wenn sie praxisnah ist. Unsere interaktiven Excel-Übungen passen sich Ihrem Niveau, Ihrem Tempo und Ihren Zielen an – für Studium, Beruf und persönliche Weiterentwicklung.</p>
          <div className="hero-actions">
            <Link to="/courses" className="btn btn-primary btn-lg">
              Kurse entdecken
            </Link>
            <Link to="/courses/d2f44dd9-e1df-4ea3-aa41-84ed501362b1" className="btn btn-outline btn-lg">
              Als Gast testen
            </Link>
          </div>

          {/* Continue where you left off */}
          {lastExercise && (
            <div className="continue-learning">
              <Link to={`/exercises/${lastExercise.id}`} className="continue-learning-card">
                <span className="continue-icon"><Play size={20} /></span>
                <div>
                  <div className="continue-label">Weitermachen</div>
                  <div className="continue-title">{lastExercise.title}</div>
                  <div className="continue-course"><BookOpen size={12} style={{marginRight:3}} />{lastExercise.course_title}</div>
                </div>
              </Link>
            </div>
          )}
          <div className="hero-illustration">
            <div className="hero-card">
              <div className="hero-card-icon hc-green"><BarChart3 size={20} /></div>
              <span>Excel-Übungen live im Browser</span>
            </div>
            <div className="hero-card">
              <div className="hero-card-icon hc-amber"><GraduationCap size={20} /></div>
              <span>Mit Zertifikat</span>
            </div>
            <div className="hero-card">
              <div className="hero-card-icon hc-green"><Zap size={20} /></div>
              <span>Sofortiges Feedback</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS BAR */}
      <section className="stats-bar">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Jahre Bildungserfahrung</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">200+</div>
            <div className="stat-label">Interaktive Übungen</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">15.000+</div>
            <div className="stat-label">Zufriedene Lernende</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Weiterempfehlungsrate</div>
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
