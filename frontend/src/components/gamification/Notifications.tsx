import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Bell } from 'lucide-react';
import { apiFetch, useAuth } from '../../context/AuthContext';

interface Notification {
  id: string;
  type: 'review' | 'streak' | 'level' | 'badge' | 'reminder';
  message: ReactNode;
  link?: string;
  time: string;
}

export function NotificationCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('notif-dismissed') || '[]')); } catch { return new Set(); }
  });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiFetch('/adaptive/review-due').catch(() => ({ dueCards: [] })),
      apiFetch('/gamification/stats').catch(() => null),
    ]).then(([reviews, gami]) => {
      const items: Notification[] = [];

      if (reviews.dueCards?.length) {
        items.push({ id: 'review', type: 'review', message: `${reviews.dueCards.length} Übung${reviews.dueCards.length > 1 ? 'en' : ''} zur Wiederholung`, link: '/dashboard', time: 'Jetzt' });
      }

      if (gami?.xp?.streak_days >= 3) {
        items.push({ id: 'streak', type: 'streak', message: <><Zap size={14} style={{marginRight:4}} />{gami.xp.streak_days}-Tage-Konstanz! Weiter so!</>, time: 'Heute' });
      }

      if (gami?.xp?.level >= 3) {
        items.push({ id: 'level', type: 'level', message: `Level ${gami.xp.level} erreicht!`, time: 'Kürzlich' });
      }

      if (!reviews.dueCards?.length && gami?.xp?.streak_days < 3) {
        items.push({ id: 'reminder', type: 'reminder', message: 'Tägliches Üben (auch nur 5 Min) verbessert deinen Lernfortschritt!', link: '/courses', time: 'Tipp' });
      }

      setNotifs(items);
    });
  }, [user]);

  if (!user) return null;
  const unread = notifs.filter(n => !dismissed.has(n.id)).length;

  const handleOpen = () => {
    if (!open && unread > 0) {
      // Mark all current notifications as read
      const ids = new Set(notifs.map(n => n.id));
      setDismissed(ids);
      localStorage.setItem('notif-dismissed', JSON.stringify([...ids]));
    }
    setOpen(!open);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleOpen} className="notif-bell-btn" aria-label={`Benachrichtigungen (${unread})`}>
        <Bell size={16} />
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 499 }} onClick={() => setOpen(false)} />
          <div className="notif-dropdown">
            {notifs.length === 0 ? (
              <div className="notif-empty">Keine neuen Benachrichtigungen</div>
            ) : (
              notifs.map(n => (
                <div key={n.id} className="notif-item"
                  onClick={() => { if (n.link) { navigate(n.link); setOpen(false); } }}
                  style={{ cursor: n.link ? 'pointer' : 'default' }}
                >
                  <span style={{ fontSize: '0.85rem' }}>{n.message}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 8, whiteSpace: 'nowrap' }}>{n.time}</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
