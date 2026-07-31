import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { apiFetch } from '../context/AuthContext';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Senden. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-container">
        <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: 20 }} />
        <h1>E-Mail gesendet</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          Falls ein Konto mit dieser E-Mail existiert, haben wir einen Link zum Zurücksetzen des Passworts gesendet.
        </p>
        <Link to="/login" className="btn btn-primary">
          <ArrowLeft size={14} style={{marginRight:4}} /> Zurück zur Anmeldung
        </Link>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h1><Mail size={28} style={{marginRight:8, verticalAlign:'middle'}} />Passwort vergessen</h1>
      <p className="subtitle">Geben Sie Ihre E-Mail-Adresse ein, um einen Reset-Link zu erhalten.</p>

      {error && (
        <div className="card" style={{ borderColor: 'var(--danger)', marginBottom: 20, background: 'var(--danger-light)' }}>
          <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Wird gesendet...' : 'Link senden'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)' }}>
        <Link to="/login"><ArrowLeft size={14} style={{marginRight:4}} />Zurück zur Anmeldung</Link>
      </p>
    </div>
  );
}
