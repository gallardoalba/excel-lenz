import { Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { BarChart3, ClipboardList, Sun, Moon, Search, Play, Menu, Target } from 'lucide-react';
import { useAuth, apiFetch } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useDailyGoal } from './context/DailyGoalContext';
import { SkipNav, LiveRegion } from './components/a11y/Accessibility';
import { TourProvider } from './components/tour/OnboardingTour';
import { NotificationCenter } from './components/gamification/Notifications';
import { getTodaysGoal } from './components/gamification/DailyGoal';
import UserMenu from './components/navigation/UserMenu';
import CommandPalette from './components/navigation/CommandPalette';
import Breadcrumbs from './components/navigation/Breadcrumbs';
import MobileDrawer from './components/navigation/MobileDrawer';
import ErrorBoundary from './components/ErrorBoundary';
import { ExcelSpinner } from './components/animations/Celebrations';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Exercise = lazy(() => import('./pages/Exercise'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const StudentPanel = lazy(() => import('./pages/StudentPanel'));
const TeacherPanel = lazy(() => import('./pages/TeacherPanel'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  const { user, loading, logout } = useAuth();
  const { dark, toggle: toggleDark } = useTheme();
  const { goal: dailyGoal, setGoal: setDailyGoal } = useDailyGoal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastExercise, setLastExercise] = useState<{ id: string; title: string } | null>(null);

  // Load daily goal from localStorage on user change
  useEffect(() => {
    if (user) {
      setDailyGoal(getTodaysGoal());
    } else {
      setDailyGoal(null);
    }
  }, [user]);

  // Load last exercise for "Weitermachen"
  useEffect(() => {
    if (user) {
      apiFetch('/exercises/user/last-exercise')
        .then(setLastExercise)
        .catch(() => setLastExercise(null));
    } else {
      setLastExercise(null);
    }
  }, [user]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ExcelSpinner text="Wird geladen..." />
      </div>
    );
  }

  return (
    <TourProvider>
    <div className="app-layout">
      <SkipNav />
      <LiveRegion />
      <nav className="navbar" role="navigation" aria-label="Hauptnavigation">
        <Link to="/" className="navbar-brand">
          <BarChart3 size={22} /> Excel-lenz
        </Link>

        <div className="navbar-links">
          <NavLink to="/courses" end>Kurse</NavLink>
          {user ? (
            <>
              <NavLink to="/student">Mein Lernpanel</NavLink>
              <NavLink to="/dashboard">Statistiken</NavLink>
              {user.role === 'teacher' && (
                <NavLink to="/teacher"><ClipboardList size={16} style={{marginRight:4}} />Lehrer-Panel</NavLink>
              )}
            </>
          ) : (
            <NavLink to="/login">Anmelden</NavLink>
          )}
        </div>

        <div className="navbar-actions">
          {/* Daily Goal Progress */}
          {dailyGoal && (
            <div className="navbar-progress" title={`Tägliches Ziel: ${dailyGoal.completed}/${dailyGoal.target}`}>
              <Target size={14} />
              <div className="navbar-progress-bar" role="progressbar"
                   aria-valuenow={dailyGoal.completed}
                   aria-valuemin={0}
                   aria-valuemax={dailyGoal.target}
                   aria-label="Tägliches Lernziel">
                <div
                  className="navbar-progress-fill"
                  style={{ width: `${Math.min(100, (dailyGoal.completed / dailyGoal.target) * 100)}%` }}
                />
              </div>
              <span className="navbar-progress-label">{dailyGoal.completed}/{dailyGoal.target}</span>
            </div>
          )}

          {/* Continue last exercise */}
          {lastExercise && (
            <Link
              to={`/exercises/${lastExercise.id}`}
              className="navbar-continue-btn"
              title={`Weitermachen: ${lastExercise.title}`}
            >
              <Play size={13} />
              <span className="navbar-continue-label">Weiter</span>
            </Link>
          )}

          {/* Search */}
          <button
            className="navbar-search-btn"
            onClick={() => {
              // Dispatch ⌘K keyboard event to open CommandPalette
              const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true });
              window.dispatchEvent(event);
            }}
            title="Suche (⌘K)"
            aria-label="Suche öffnen"
          >
            <Search size={16} />
            <kbd className="navbar-search-kbd">⌘K</kbd>
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleDark}
            className="navbar-icon-btn"
            title={dark ? 'Heller Modus' : 'Dunkler Modus'}
            aria-label={dark ? 'Heller Modus' : 'Dunkler Modus'}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications */}
          <NotificationCenter />

          {/* User Avatar Menu */}
          <UserMenu />

          {/* Hamburger (mobile) */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Menü öffnen"
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <main className="main-content" id="main-content" role="main">
        <ErrorBoundary>
        <Suspense fallback={<div style={{padding:80,textAlign:'center',minHeight:'calc(100vh - 200px)'}}><ExcelSpinner text="Wird geladen..." /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/student" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/student" /> : <Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/exercises/:id" element={<Exercise />} />
          <Route path="/student" element={user ? <StudentPanel /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/teacher" element={user?.role === 'teacher' ? <TeacherPanel /> : <Navigate to="/dashboard" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand"><BarChart3 size={20} style={{marginRight:6, verticalAlign:'middle'}} />Excel-lenz</div>
            <p className="footer-desc">Interaktives Excel-Lernportal für Praxis, Feedback und individuelle Lernpfade.</p>
          </div>
          <div>
            <h4>Kurse</h4>
            <ul>
              <li><Link to="/courses">Excel-Grundlagen</Link></li>
              <li><Link to="/courses">Fortgeschrittene Techniken</Link></li>
              <li><Link to="/courses">Individuelle Lernpfade</Link></li>
            </ul>
          </div>
          <div>
            <h4>Unternehmen</h4>
            <ul>
              <li><Link to="/">Über uns</Link></li>
              <li><Link to="/">Dozenten</Link></li>
              <li><Link to="/">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <h4>Rechtliches</h4>
            <ul>
              <li><Link to="/impressum">Impressum</Link></li>
              <li><Link to="/datenschutz">Datenschutz</Link></li>
              <li><Link to="/agb">AGB</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Excel-lenz. Alle Rechte vorbehalten.
        </div>
      </footer>

      {/* Command Palette (global search overlay) */}
      <CommandPalette />

      {/* Mobile Drawer */}
      <MobileDrawer open={mobileOpen} onClose={closeMobile} dailyGoal={dailyGoal} />
    </div>
    </TourProvider>
  );
}
