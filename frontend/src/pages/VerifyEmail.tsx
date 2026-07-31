import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { apiFetch } from '../context/AuthContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMsg('Kein Token vorhanden.');
      return;
    }
    apiFetch('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
      .then(() => setStatus('success'))
      .catch((err: Error) => {
        setStatus('error');
        setErrorMsg(err.message);
      });
  }, [token]);

  return (
    <div className="auth-container">
      {status === 'loading' && (
        <>
          <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: 20 }} />
          <h1>E-Mail wird bestätigt...</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Bitte einen Moment Geduld.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle size={48} style={{ color: 'var(--success)', marginBottom: 20 }} />
          <h1>E-Mail bestätigt!</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Sie können jetzt alle Funktionen nutzen.
          </p>
          <Link to="/student" className="btn btn-primary">Zum Lernpanel</Link>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertTriangle size={48} style={{ color: 'var(--danger)', marginBottom: 20 }} />
          <h1>Bestätigung fehlgeschlagen</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            {errorMsg || 'Der Link ist ungültig oder abgelaufen. Bitte registrieren Sie sich erneut.'}
          </p>
          <Link to="/register" className="btn btn-primary">Erneut registrieren</Link>
        </>
      )}
    </div>
  );
}
