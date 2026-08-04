import { useState, FormEvent, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  // Focus error message for screen readers
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/student');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1><LogIn size={28} style={{marginRight:8, verticalAlign:'middle'}} />Anmelden</h1>
      <p className="subtitle">Melden Sie sich an, um weiterzulernen</p>

      {error && (
        <div className="card" ref={errorRef} tabIndex={-1} style={{ borderColor: 'var(--danger)', marginBottom: 20, background: 'var(--danger-light)', outline: 'none' }}>
          <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}><AlertTriangle size={14} style={{marginRight:4, verticalAlign:'middle'}} />{error}</p>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-Mail</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ihre@email.de"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Anmeldung...' : 'Anmelden'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)' }}>
        <Link to="/forgot-password" style={{ display: 'block', marginBottom: 8 }}>Passwort vergessen?</Link>
        {/* Noch kein Konto? <Link to="/register">Hier registrieren</Link> */}
      </p>
    </div>
  );
}
