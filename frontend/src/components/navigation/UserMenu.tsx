import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, ClipboardList, LogOut, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = user?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  if (!user) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="avatar-btn"
        onClick={() => setOpen(!open)}
        aria-label="Benutzermenü öffnen"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {initials}
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <div className="dropdown-header">
            <div className="avatar-lg">{initials}</div>
            <div>
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>

          <div className="dropdown-divider" />

          <NavLink
            to="/dashboard"
            className={({ isActive }) => `dropdown-item${isActive ? ' active' : ''}`}
            onClick={() => setOpen(false)}
            role="menuitem"
          >
            <BarChart3 size={16} />
            <span>Mein Fortschritt</span>
            <ChevronRight size={14} className="dropdown-item-arrow" />
          </NavLink>

          {user.role === 'teacher' && (
            <NavLink
              to="/teacher"
              className={({ isActive }) => `dropdown-item${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <ClipboardList size={16} />
              <span>Lehrer-Panel</span>
              <ChevronRight size={14} className="dropdown-item-arrow" />
            </NavLink>
          )}

          <div className="dropdown-divider" />

          <button
            className="dropdown-item dropdown-item-danger"
            onClick={() => { setOpen(false); logout(); }}
            role="menuitem"
          >
            <LogOut size={16} />
            <span>Abmelden</span>
          </button>
        </div>
      )}
    </div>
  );
}
