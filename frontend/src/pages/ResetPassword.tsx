import { useState, FormEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { apiFetch } from '../context/AuthContext';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Link ungültig oder abgelaufen.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: 20 }} />
        <h1>Passwort aktualisiert</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Ihr Passwort wurde erfolgreich zurückgesetzt. Sie werden zur Anmeldung weitergeleitet...
        </p>
        <Link to="/login" className="btn btn-primary">Jetzt anmelden</Link>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h1><Lock size={28} style={{marginRight:8, verticalAlign:'middle'}} />Neues Passwort</h1>
      <p className="subtitle">Wählen Sie ein neues sicheres Passwort.</p>

      {error && (
        <div className="card" style={{ borderColor: 'var(--danger)', marginBottom: 20, background: 'var(--danger-light)' }}>
          <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>
            <AlertTriangle size={14} style={{marginRight:4, verticalAlign:'middle'}} />{error}
          </p>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Neues Passwort</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 8 Zeichen"
              required
              minLength={8}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Passwort bestätigen</label>
            <input
              id="confirmPassword"
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Passwort wiederholen"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Wird gespeichert...' : 'Passwort speichern'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)' }}>
        <Link to="/login"><ArrowLeft size={14} style={{marginRight:4}} />Zurück zur Anmeldung</Link>
      </p>
    </div>
  );
}
