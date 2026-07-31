import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, BookOpen, BarChart3, ClipboardList, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationCenter } from '../gamification/Notifications';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  dailyGoal: { target: number; completed: number } | null;
}

export default function MobileDrawer({ open, onClose, dailyGoal }: MobileDrawerProps) {
  const { user, logout } = useAuth();
  const { dark, toggle: toggleDark } = useTheme();

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const initials = user?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <>
      <div className="mobile-drawer-backdrop" onClick={onClose} />
      <aside className="mobile-drawer" role="dialog" aria-label="Mobiles Menü">
        {/* Header */}
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-user">
            {user ? (
              <>
                <div className="avatar-lg">{initials}</div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </>
            ) : (
              <div className="user-name" style={{ padding: '8px 0' }}>Excel-lenz</div>
            )}
          </div>
          <button className="mobile-drawer-close" onClick={onClose} aria-label="Menü schließen">
            <X size={22} />
          </button>
        </div>

        {/* Daily Goal */}
        {dailyGoal && (
          <div className="mobile-drawer-progress">
            <span className="text-label" style={{ fontSize: '0.7rem' }}>Tägliches Ziel</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="navbar-progress-bar" style={{ flex: 1 }}>
                <div
                  className="navbar-progress-fill"
                  style={{ width: `${Math.min(100, (dailyGoal.completed / dailyGoal.target) * 100)}%` }}
                />
              </div>
              <span className="text-sm">{dailyGoal.completed}/{dailyGoal.target}</span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="mobile-drawer-nav">
          <NavLink
            to="/courses"
            className={({ isActive }) => `mobile-drawer-link${isActive ? ' active' : ''}`}
            onClick={onClose}
          >
            <BookOpen size={18} /> Kurse
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `mobile-drawer-link${isActive ? ' active' : ''}`}
                onClick={onClose}
              >
                <BarChart3 size={18} /> Mein Fortschritt
              </NavLink>
              {user.role === 'teacher' && (
                <NavLink
                  to="/teacher"
                  className={({ isActive }) => `mobile-drawer-link${isActive ? ' active' : ''}`}
                  onClick={onClose}
                >
                  <ClipboardList size={18} /> Lehrer-Panel
                </NavLink>
              )}
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `mobile-drawer-link${isActive ? ' active' : ''}`}
              onClick={onClose}
            >
              <LogOut size={18} /> Anmelden
            </NavLink>
          )}
        </nav>

        <div className="mobile-drawer-divider" />

        {/* Actions */}
        <div className="mobile-drawer-actions">
          <button className="mobile-drawer-link" onClick={() => { toggleDark(); }}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {dark ? 'Heller Modus' : 'Dunkler Modus'}
          </button>
          <div className="mobile-drawer-link" style={{ justifyContent: 'flex-start', padding: '10px 12px' }}>
            <NotificationCenter />
          </div>
          {user && (
            <button className="mobile-drawer-link mobile-drawer-link-danger" onClick={() => { onClose(); logout(); }}>
              <LogOut size={18} /> Abmelden
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
