import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

const LEHRPLAENE = [
  {
    type: 'anfaenger',
    title: 'Excel für Anfänger',
    description:
      'Vollständiger Lehrplan mit 13 Modulen — von der Excel-Oberfläche bis zu Makros und VBA. '
      + 'Mit verständlicher Theorie und 49 praktischen Übungen, konzipiert für den Einzel-Präsenzunterricht '
      + 'nach dem europäischen DigComp 2.2-Rahmen.',
    modules: 13,
    exercises: 49,
    duration: '~12 Stunden',
    level: 'Anfänger',
  },
  {
    type: 'fortgeschrittene',
    title: 'Excel für Fortgeschrittene',
    description:
      'Lehrplan für professionelle Anwender mit 10 Modulen — erweiterte Formate, komplexe Funktionen, '
      + 'Datenbanken, Pivot-Tabellen, Solver, Dashboards, Makros und VBA-Programmierung. '
      + 'Konzipiert für Controller, Analysten und Power-User.',
    modules: 10,
    exercises: 41,
    duration: '~12 Stunden',
    level: 'Fortgeschrittene',
  },
];

export default function LehrplanList() {
  useEffect(() => { document.title = 'Lehrplane — Excel-lenz'; }, []);
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '56px 32px 80px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em' }}>
        Lehrpläne
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 40, maxWidth: 750 }}>
        Strukturierte Lehrpläne für den Excel-Präsenzunterricht. Jeder Lehrplan kombiniert
        verständliche Theorie mit praktischen Übungen — entwickelt von Cristóbal Gallardo
        für den Einzelunterricht in Freiburg im Breisgau.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {LEHRPLAENE.map((lp) => (
          <Link
            key={lp.type}
            to={`/lehrplan/${lp.type}`}
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
              <BookOpen size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 6px' }}>{lp.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 12px', lineHeight: 1.6 }}>
                {lp.description}
              </p>
              <div style={{ display: 'flex', gap: 20, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>{lp.modules} Module</span>
                <span>{lp.exercises} Übungen</span>
                <span>{lp.duration}</span>
                <span>{lp.level}</span>
              </div>
            </div>
            <ArrowRight size={20} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 4 }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
