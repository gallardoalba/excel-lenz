import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

/** Generic server error page shown for unhandled errors */
export default function ServerError() {
  useEffect(() => { document.title = 'Serverfehler — Excel-lenz'; }, []);
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <AlertTriangle size={64} style={{ color: 'var(--warning)', marginBottom: 24 }} />
      <h1 style={{ marginBottom: 12 }}>Serverfehler</h1>
      <p className="text-muted" style={{ maxWidth: 560, margin: '0 auto 24px' }}>
        Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.
      </p>
      <div className="flex gap-sm" style={{ justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Seite neu laden
        </button>
        <Link to="/" className="btn btn-outline">Zur Startseite</Link>
        <Link to="/courses" className="btn btn-outline">Zu den Kursen</Link>
      </div>
    </div>
  );
}
