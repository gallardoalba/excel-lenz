import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = (): { score: number; label: string; color: string } => {
    const p = password;
    if (!p) return { score: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    if (score <= 1) return { score, label: 'Schwach', color: 'var(--danger)' };
    if (score === 2) return { score, label: 'Mittel', color: 'var(--warning)' };
    return { score, label: 'Stark', color: 'var(--success)' };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    setError('');

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/student');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength();

  return (
    <div className="auth-container">
      <h1><UserPlus size={28} style={{marginRight:8, verticalAlign:'middle'}} />Konto erstellen</h1>
      <p className="subtitle">Werden Sie Teil von Excel-lenz und lernen Sie Excel</p>

      {error && (
        <div className="card" style={{ borderColor: 'var(--danger)', marginBottom: 20, background: 'var(--danger-light)' }}>
          <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}><AlertTriangle size={14} style={{marginRight:4, verticalAlign:'middle'}} />{error}</p>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Vollständiger Name</label>
            <input id="name" type="text" className="form-input" value={name}
              onChange={(e) => setName(e.target.value)} placeholder="Ihr Name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input id="email" type="email" className="form-input" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="ihre@email.de" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input id="password" type="password" className="form-input" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 8 Zeichen" required minLength={8} />
            {strength.label && (
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="progress-bar" style={{ flex: 1, maxWidth: 120 }}>
                  <div className="progress-bar-fill" style={{
                    width: `${(strength.score / 3) * 100}%`,
                    background: strength.color,
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 600 }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Passwort bestätigen</label>
            <input id="confirmPassword" type="password" className="form-input"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Passwort wiederholen" required minLength={6} />
            {confirmPassword && password === confirmPassword && (
              <p style={{ fontSize: '0.78rem', color: 'var(--success)', marginTop: 4 }}>
                <CheckCircle size={12} style={{marginRight:3, verticalAlign:'middle'}} />Passwörter stimmen überein
              </p>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Konto wird erstellt...' : 'Konto erstellen'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)' }}>
        Bereits registriert? <Link to="/login">Hier anmelden</Link>
      </p>
    </div>
  );
}
