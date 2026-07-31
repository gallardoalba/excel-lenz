import { useEffect, useRef, useState } from 'react';
import { Award, Trophy } from 'lucide-react';
import { useReducedMotion } from '../a11y/Accessibility';
import confetti from 'canvas-confetti';

// Confetti Celebration — corporate palette, respects reduced motion
export function ConfettiCelebration({ trigger }: { trigger: boolean }) {
  const fired = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (trigger && !fired.current && !reducedMotion) {
      fired.current = true;

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.6 },
        colors: ['#1B4332', '#2C5282', '#C5A065', '#4A5568'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { x: 0.9, y: 0.6 },
          colors: ['#1B4332', '#2C5282', '#C5A065', '#4A5568'],
        });
      }, 200);

      setTimeout(() => { fired.current = false; }, 3000);
    }
  }, [trigger, reducedMotion]);

  return null;
}

// Badge Earned Modal — respects reduced motion
export function BadgeModal({
  show, badge, onClose,
}: {
  show: boolean;
  badge: { icon: string; name: string; description: string } | null;
  onClose: () => void;
}) {
  const reducedMotion = useReducedMotion();
  if (!show || !badge) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)',
      animation: reducedMotion ? 'none' : 'fadeIn 0.3s ease',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '40px 48px',
        textAlign: 'center', maxWidth: 360, boxShadow: 'var(--shadow-lg)',
        animation: reducedMotion ? 'none' : 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        border: '1px solid var(--border)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>
          {badge.icon}
        </div>
        <h2 style={{ color: 'var(--primary)', marginBottom: 4 }}>
          <Award size={20} style={{marginRight:6, verticalAlign:'middle'}} />Neues Abzeichen
        </h2>
        <h3 style={{ marginBottom: 8 }}>{badge.name}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{badge.description}</p>
        <button className="btn btn-primary" onClick={onClose}>
          Weiter
        </button>
      </div>

      {!reducedMotion && <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>}
    </div>
  );
}

// XP Flying Animation — respects reduced motion
export function XPFlying({
  xp, sourceRef, trigger,
}: {
  xp: number;
  sourceRef: React.RefObject<HTMLElement | null>;
  trigger: boolean;
}) {
  const [flying, setFlying] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!trigger || !sourceRef.current) return;
    const rect = sourceRef.current.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2 - 30, y: rect.top });
    setFlying(true);
    const timer = setTimeout(() => setFlying(false), 1500);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (!flying || reducedMotion) return null;

  return (
    <div style={{
      position: 'fixed', zIndex: 999, left: pos.x, top: pos.y,
      fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)',
      pointerEvents: 'none', animation: 'xpFly 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
    }}>
      <Trophy size={16} style={{marginRight:4, verticalAlign:'middle'}} />+{xp} KP
      <style>{`
        @keyframes xpFly {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-60px) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Excel-Themed Loading Spinner
export function ExcelSpinner({ text = 'Wird geladen...' }: { text?: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: 60, gap: 20,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 20px)', gap: 4 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} style={{
            width: 20, height: 20, borderRadius: 3,
            background: 'var(--primary)',
            animation: `cellFill 1.5s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
            opacity: 0.2,
          }} />
        ))}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{text}</p>
      <style>{`
        @keyframes cellFill {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); background: var(--accent); }
        }
      `}</style>
    </div>
  );
}
