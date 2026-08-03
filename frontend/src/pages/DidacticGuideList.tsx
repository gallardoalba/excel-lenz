import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

const GUIDES = [
  {
    type: 'anfaenger',
    title: 'Excel für Anfänger',
    description:
      'Didaktischer Leitfaden für den Präsenz-Einzelkurs. 8 Sitzungen à 90 Minuten, strukturiert nach dem europäischen DigComp 2.2-Rahmen. Von der Excel-Oberfläche bis zu Tabellen und Diagrammen.',
    sessions: 8,
    duration: '12 Stunden',
    level: 'Anfänger',
  },
  {
    type: 'fortgeschrittene',
    title: 'Excel für Fortgeschrittene',
    description:
      'Didaktischer Leitfaden für professionelle Anwender. 8 Sitzungen à 90 Minuten. Erweiterte Funktionen, Pivot-Tabellen, Datenanalyse, Makros und VBA.',
    sessions: 8,
    duration: '12 Stunden',
    level: 'Fortgeschritten',
  },
];

export default function DidacticGuideList() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 32px 80px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em' }}>
        Didaktische Leitfäden
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 40, maxWidth: 720 }}>
        Vollständige Unterrichtsplanungen für Excel-Präsenzkurse. Jeder Leitfaden enthält
        Lernziele, Methodik, Sitzungsabläufe und Kompetenzrahmen.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {GUIDES.map((guide) => (
          <Link
            key={guide.type}
            to={`/didaktik/${guide.type}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 24,
              padding: 32,
              background: 'var(--surface)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 6px' }}>{guide.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 12px', lineHeight: 1.6 }}>
                {guide.description}
              </p>
              <div style={{ display: 'flex', gap: 20, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>{guide.sessions} Sitzungen</span>
                <span>{guide.duration}</span>
                <span>{guide.level}</span>
              </div>
            </div>
            <ArrowRight size={20} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 4 }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
