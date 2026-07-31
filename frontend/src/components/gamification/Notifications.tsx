import { useState, useEffect, ReactNode } from 'react';
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
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);

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
  const unread = notifs.length;

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} className="notif-bell-btn" aria-label={`Benachrichtigungen (${unread})`}>
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
                  onClick={() => { if (n.link) { window.location.href = n.link; setOpen(false); } }}
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
