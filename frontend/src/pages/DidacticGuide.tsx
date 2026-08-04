import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { ExcelSpinner } from '../components/animations/Celebrations';

const GUIDE_META: Record<string, { title: string; pdf: string }> = {
  anfaenger: {
    title: 'Didaktischer Leitfaden: Excel für Anfänger',
    pdf: '/downloads/Didaktischer_Leitfaden_Excel_Anfaenger.pdf',
  },
  fortgeschrittene: {
    title: 'Didaktischer Leitfaden: Excel für Fortgeschrittene',
    pdf: '/downloads/Didaktischer_Leitfaden_Excel_Fortgeschrittene.pdf',
  },
};

export default function DidacticGuide() {
  const { type } = useParams<{ type: string }>();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const meta = GUIDE_META[type || ''] || { title: 'Didaktischer Leitfaden', pdf: '#' };

  useEffect(() => { document.title = `${meta.title} — Excel-lenz`; }, [meta.title]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/didaktik-${type}.html`)
      .then(res => {
        if (!res.ok) throw new Error('Nicht gefunden');
        return res.text();
      })
      .then(html => {
        // Extract body content (strip <html>, <head>, etc.)
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1] : html;
        setContent(bodyContent);
      })
      .catch(() => setError('Der didaktische Leitfaden konnte nicht geladen werden.'))
      .finally(() => setLoading(false));
  }, [type]);

  if (loading) return <ExcelSpinner text="Didaktischer Leitfaden wird geladen..." />;

  if (error) return (
    <div className="empty-state" style={{ padding: '80px 24px' }}>
      <h2>Ladefehler</h2>
      <p style={{ marginBottom: 20, color: 'var(--text-secondary)' }}>{error}</p>
      <Link to="/courses" className="btn btn-primary">Zurück zur Kursübersicht</Link>
    </div>
  );

  return (
    <div className="didactic-guide-page">
      {/* ── Header bar ── */}
      <div className="didactic-guide-header">
        <div className="didactic-guide-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <FileText size={24} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: 'var(--text)' }}>{meta.title}</h1>
          </div>
          <a
            href={meta.pdf}
            download
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <ExternalLink size={14} />
            PDF herunterladen
          </a>
        </div>
      </div>

      {/* ── Content ── */}
      <div
        className="didactic-guide-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
