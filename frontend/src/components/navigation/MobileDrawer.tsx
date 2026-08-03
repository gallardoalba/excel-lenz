import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, BookOpen, BarChart3, ClipboardList, Sun, Moon, LogOut, Search } from 'lucide-react';
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
          <button
            className="mobile-drawer-link"
            onClick={() => {
              onClose();
              // Dispatch ⌘K to open CommandPalette
              setTimeout(() => {
                const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true });
                window.dispatchEvent(event);
              }, 200);
            }}
          >
            <Search size={18} /> Suche
          </button>
          <button className="mobile-drawer-link" onClick={() => { toggleDark(); }}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {dark ? 'Heller Modus' : 'Dunkler Modus'}
          </button>
          <a
            href="https://github.com/gallardoalba/excel-lenz"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-drawer-link"
            onClick={onClose}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
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
