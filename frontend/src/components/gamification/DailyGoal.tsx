import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';

const STORAGE_KEY = 'excel-lenz_daily_goal';

interface DailyGoal {
  target: number;
  date: string;
  completed: number;
}

export function getTodaysGoal(): DailyGoal | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const goal: DailyGoal = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];
    if (goal.date !== today) return null;
    return goal;
  } catch { return null; }
}

export function setTodaysGoal(target: number) {
  const today = new Date().toISOString().split('T')[0];
  const goal: DailyGoal = { target, date: today, completed: 0 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goal));
}

export function incrementGoalProgress() {
  const goal = getTodaysGoal();
  if (!goal) return;
  goal.completed += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goal));
}

export function DailyGoalWidget() {
  const [goal, setGoal] = useState<DailyGoal | null>(null);
  const [setting, setSetting] = useState(false);
  const [inputVal, setInputVal] = useState('3');

  useEffect(() => {
    setGoal(getTodaysGoal());
  }, []);

  const handleSet = () => {
    const n = parseInt(inputVal) || 3;
    setTodaysGoal(Math.max(1, Math.min(20, n)));
    setGoal(getTodaysGoal());
    setSetting(false);
  };

  if (setting) {
    return (
      <div className="card" style={{ padding: '12px 16px', marginBottom: 16 }}>
        <p style={{ fontSize: '0.85rem', marginBottom: 8 }}><Target size={14} style={{marginRight:4}} />Wie viele Übungen möchtest du heute schaffen?</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="number" min={1} max={20} value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            style={{ width: 60, padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border)' }}
            onKeyDown={e => e.key === 'Enter' && handleSet()}
          />
          <button className="btn btn-primary btn-sm" onClick={handleSet}>Setzen</button>
          <button className="btn btn-sm" onClick={() => setSetting(false)}
            style={{ background: 'transparent', color: 'var(--text-muted)' }}>Abbrechen</button>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <button className="btn btn-sm btn-outline" onClick={() => setSetting(true)}
        style={{ marginBottom: 16, fontSize: '0.8rem' }}>
        <Target size={14} style={{marginRight:4}} />Tagesziel setzen
      </button>
    );
  }

  const pct = Math.min(100, Math.round((goal.completed / goal.target) * 100));
  const done = goal.completed >= goal.target;

  return (
    <div className="card" style={{ padding: '10px 16px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem' }}>
          <Target size={14} style={{marginRight:4}} />Tagesziel: {goal.completed}/{goal.target} Übungen
          {done && <span style={{ marginLeft: 6 }}>✅</span>}
        </span>
        <button onClick={() => setSetting(true)} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: '0.75rem', color: 'var(--text-muted)',
        }}>✏️</button>
      </div>
      <div style={{
        marginTop: 6, height: 6, borderRadius: 3,
        background: 'var(--border-light)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 3,
          background: done ? 'var(--success)' : 'var(--primary)',
          transition: 'width 0.4s ease',
        }}/>
      </div>
    </div>
  );
}
