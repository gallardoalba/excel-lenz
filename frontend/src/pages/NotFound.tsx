import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  useEffect(() => { document.title = 'Seite nicht gefunden — Excel-lenz'; }, []);
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <FileQuestion size={64} style={{ color: 'var(--text-muted)', marginBottom: 24 }} />
      <h1 style={{ marginBottom: 12 }}>Seite nicht gefunden</h1>
      <p className="text-muted max-w-560" style={{ marginBottom: 24 }}>
        Die angeforderte Seite existiert nicht. Möglicherweise wurde sie verschoben oder der Link ist veraltet.
      </p>
      <div className="flex gap-sm" style={{ justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">Zur Startseite</Link>
        <Link to="/courses" className="btn btn-outline">Zu den Kursen</Link>
      </div>
    </div>
  );
}
