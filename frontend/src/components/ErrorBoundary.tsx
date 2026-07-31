import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <AlertTriangle size={64} style={{ color: 'var(--warning)', marginBottom: 24 }} />
          <h1 style={{ marginBottom: 12 }}>Etwas ist schiefgelaufen</h1>
          <p className="text-muted max-w-560" style={{ marginBottom: 24 }}>
            Ein unerwarteter Fehler ist aufgetreten. Bitte laden Sie die Seite neu oder kehren Sie zur Startseite zurück.
          </p>
          <div className="flex gap-sm" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Seite neu laden
            </button>
            <Link to="/" className="btn btn-outline">Zur Startseite</Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
