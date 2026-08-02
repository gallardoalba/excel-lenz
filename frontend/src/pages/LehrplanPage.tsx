import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, ChevronDown } from 'lucide-react';
import { ExcelSpinner } from '../components/animations/Celebrations';

const LEHRPLAN_META: Record<string, { title: string }> = {
  anfaenger: { title: 'Lehrplan: Excel für Anfänger' },
};

interface ModuleSection {
  id: string;
  title: string;
  html: string;
}

const MODULE_DESCRIPTIONS: Record<string, string> = {
  'modul-1-einführung-in-excel-und-die-arbeitsumgebung': 'Oberfläche, Navigation, Dateiformate und erste Schritte.',
  'modul-2-dateneingabe-und--bearbeitung': 'Datentypen, AutoAusfüllen, Kopieren und Einfügen.',
  'modul-3-format-und-zellstil': 'Schriftarten, Zahlenformate, Layout und bedingte Formatierung.',
  'modul-4-formeln-und-grundfunktionen': 'SUMME, WENN, Zellbezüge und statistische Funktionen.',
  'modul-5-datenbereinigung-und-validierung': 'Dropdown-Listen, Duplikate, Text in Spalten, Datenimport.',
  'modul-6-tabellen-und-filter': 'Sortieren, Filtern, Excel-Tabellen und Teilergebnisse.',
  'modul-7-erweiterte-funktionen': 'SVERWEIS, INDEX+VERGLEICH, SUMMEWENN, Text- und Datumsfunktionen.',
  'modul-8-diagramme-und-visualisierung': 'Säulen-, Linien-, Kreisdiagramme, Sparklines und Dashboards.',
  'modul-9-pivot-tabellen': 'PivotTables erstellen, anpassen, Slicer und PivotCharts.',
  'modul-10-analyse-und-finanzfunktionen': 'Zielwertsuche, Szenario-Manager, RMZ, ZW, NBW.',
  'modul-11-druck-und-zusammenarbeit': 'Seitenlayout, Druckbereiche, Kopfzeilen, PDF-Export.',
  'modul-12-schutz-und-sicherheit': 'Blattschutz, Tastenkombinationen, Dokumentinspektion.',
  'modul-13-automatisierung-mit-makros': 'Makrorekorder, VBA-Editor, erste Programmierung.',
};

function parseModules(html: string): ModuleSection[] {
  const sections: ModuleSection[] = [];
  // Find all <h2> tags with id starting with "modul-"
  const h2Regex = /<h2\s+id="(modul-[^"]*)"[^>]*>([\s\S]*?)<\/h2>/g;
  const matches = [...html.matchAll(h2Regex)];

  for (let i = 0; i < matches.length; i++) {
    const id = matches[i][1];
    const titleText = matches[i][2].replace(/<[^>]+>/g, '').trim();
    // Get content: from this h2's end to the next h2's start (or end of html)
    const startIdx = matches[i].index! + matches[i][0].length;
    const endIdx = i + 1 < matches.length
      ? matches[i + 1].index!
      : html.length;
    const content = html.slice(startIdx, endIdx);
    sections.push({ id, title: titleText, html: content });
  }
  return sections;
}

export default function LehrplanPage() {
  const { type } = useParams<{ type: string }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const meta = LEHRPLAN_META[type || ''] || { title: 'Lehrplan' };

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/lehrplan-${type}.html`)
      .then(res => {
        if (!res.ok) throw new Error('Nicht gefunden');
        return res.text();
      })
      .then(html => {
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        setContent(bodyMatch ? bodyMatch[1] : html);
      })
      .catch(() => setError('Der Lehrplan konnte nicht geladen werden.'))
      .finally(() => setLoading(false));
  }, [type]);

  const modules = useMemo(() => parseModules(content), [content]);

  if (loading) return <ExcelSpinner text="Lehrplan wird geladen..." />;

  if (error) return (
    <div className="empty-state" style={{ padding: '80px 24px' }}>
      <h2>Ladefehler</h2>
      <p style={{ marginBottom: 20, color: 'var(--text-secondary)' }}>{error}</p>
      <Link to="/courses" className="btn btn-primary">Zurück zur Kursübersicht</Link>
    </div>
  );

  return (
    <div className="didactic-guide-page">
      <div className="didactic-guide-header">
        <div className="didactic-guide-header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BookOpen size={24} style={{ color: 'var(--primary)' }} />
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: 'var(--text)' }}>
              {meta.title}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href="/downloads/Lehrplan_Excel_Anfaenger.pdf"
              download
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              📄 Lehrplan (PDF)
            </a>
            <a
              href="/downloads/Excel-lenz_Kursmaterialien.zip"
              download
              className="btn btn-accent btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              📦 Alle Materialien (ZIP)
            </a>
          </div>
        </div>
      </div>

      <div className="didactic-guide-content">
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 32, marginTop: -8 }}>
          Dieser Lehrplan bietet eine vollständige Einführung in Microsoft Excel für Erwachsene
          ohne Vorkenntnisse. Er kombiniert verständliche Theorie mit praktischen Übungen
          und wurde speziell für den Einzel-Präsenzunterricht konzipiert.
          Wählen Sie ein Modul aus, um die Inhalte und Übungen anzuzeigen.
        </p>

        {modules.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 40 }}>
            Keine Module gefunden.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {modules.map((mod) => {
              const isOpen = expanded === mod.id;
              return (
                <div
                  key={mod.id}
                  style={{
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    background: 'var(--surface)',
                  }}
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : mod.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      background: isOpen ? 'var(--bg-alt)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: isOpen ? 'var(--primary)' : 'var(--text)',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div>
                      <span style={{ display: 'block' }}>{mod.title}</span>
                      {!isOpen && MODULE_DESCRIPTIONS[mod.id] && (
                        <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: 2 }}>
                          {MODULE_DESCRIPTIONS[mod.id]}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      size={18}
                      style={{
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: 'var(--text-muted)',
                        flexShrink: 0,
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px' }}>
                      <div dangerouslySetInnerHTML={{ __html: mod.html.replace(/^<h2[^>]*>.*?<\/h2>/, '') }} />
                      <button
                        onClick={() => setExpanded(null)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          marginTop: 20,
                          padding: '8px 16px',
                          background: 'var(--bg-alt)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)',
                          transition: 'background 0.15s, color 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--primary)';
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.borderColor = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--bg-alt)';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                          e.currentTarget.style.borderColor = 'var(--border-light)';
                        }}
                      >
                        <ChevronDown
                          size={16}
                          style={{ transform: 'rotate(180deg)' }}
                        />
                        Ausblenden
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
