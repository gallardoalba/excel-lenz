import { Link } from 'react-router-dom';

export default function Developer() {
  return (
    <>
      <section className="section" style={{ paddingTop: '80px' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>Cristóbal Gallardo Alba</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: '4px 0 16px' }}>
              Biologe &amp; Bioinformatiker — Freiburg, Deutschland
            </p>
            <a href="https://github.com/gallardoalba" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
              github.com/gallardoalba
            </a>
          </div>

          {/* ── Summary ── */}
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '36px' }}>
            Biologe mit Master in Biotechnologie und umfassender Erfahrung in Bioinformatik,
            Softwareentwicklung und Lehre. Schöpfer des Open-Source-Projekts Excel-lenz —
            eine interaktive Lernplattform für Excel. Freundlich, anpassungsfähig und mit
            großer Lernbereitschaft.
          </p>

          {/* ── Two-column layout ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '40px' }}>

            {/* ── Main column ── */}
            <div>

              {/* Berufserfahrung */}
              <CVSection title="Berufserfahrung">
                <CVEntry
                  dates="2020 – 2024"
                  role="Bioinformatiker"
                  org="Albert-Ludwigs-Universität, Freiburg"
                  desc="Technische Unterstützung für Forscher. Entwicklung von Galaxy-Tools und Arbeitsabläufen. Lehre in Masterstudiengängen."
                />
                <CVEntry
                  dates="2017 – 2020"
                  role="Lehrer für Naturwissenschaften"
                  org="Studienzentrum Teatinos, Spanien"
                  desc="Biologie, Mathematik, Chemie und Physik für den Sekundarunterricht. Vorbereitung auf Hochschulaufnahmeprüfungen."
                />
                <CVEntry
                  dates="2014 – 2016"
                  role="Wissenschaftlicher Mitarbeiter"
                  org="ProCel Labor, Málaga, Spanien"
                  desc="Bioinformatische Analyse von Genen, die an der Zellproliferation beteiligt sind. Tools: Python und R."
                />
                <CVEntry
                  dates="2026"
                  role="TSENAT — R/Bioconductor Paket"
                  org="bioconductor.org/packages/TSENAT"
                  desc="R-Paket zur Quantifizierung und Modellierung der Komplexität der Isoform-Nutzung in RNAseq-Daten. Open-Source, veröffentlicht auf Bioconductor."
                />
              </CVSection>

              {/* Ausbildung */}
              <CVSection title="Ausbildung">
                <CVEntry
                  dates="2016 – 2017"
                  role="MSc Erziehungswissenschaften"
                  org="Universität Málaga, Spanien"
                  desc="Dissertation: Das Curriculum aus der kritischen Theorie. Notendurchschnitt: 1,9."
                />
                <CVEntry
                  dates="2012 – 2013"
                  role="MSc Fortgeschrittene Biotechnologie"
                  org="Universität Málaga, Spanien"
                  desc="Dissertation: Studie über den Brassinosteroid-Rezeptor TTL1. Notendurchschnitt: 1,7."
                />
                <CVEntry
                  dates="2007 – 2012"
                  role="BSc Biologische Wissenschaften"
                  org="Universität Málaga, Spanien"
                  desc="Spezialisierung in Molekularbiologie und Biochemie. Notendurchschnitt: 1,4."
                />
              </CVSection>

              {/* Publikationen */}
              <CVSection title="Publikationen">
                <CVEntry
                  dates="2024"
                  desc="Scalable, accessible and reproducible reference genome assembly and evaluation in Galaxy. <em>Nature Biotechnology</em>, 1–4."
                />
                <CVEntry
                  dates="2022"
                  desc="Gfastats: conversion, evaluation and manipulation of genome sequences using assembly graphs. <em>Bioinformatics</em>, 38(17), 4214–4216."
                />
                <CVEntry
                  dates="2021"
                  desc="Fostering accessible online education using Galaxy as an e-learning platform. <em>PLoS Computational Biology</em>, 17(5), e1008923."
                />
                <CVEntry
                  dates="2021"
                  desc="A constructivist-based proposal for bioinformatics teaching practices during lockdown. <em>PLoS Computational Biology</em>, 17(5), e1008922."
                />
              </CVSection>

            </div>

            {/* ── Sidebar ── */}
            <div>
              {/* Kompetenzen */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600,
                }}>Kompetenzen</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Python', 'R', 'Molekularbiologie', 'Mathematik', 'Bioinformatik', 'Galaxy', 'Linux', 'Git', 'Lernfähigkeit', 'Teamarbeit', 'Flexibilität', 'Liebe zum Detail'].map(s =>
                    <span key={s} style={{
                      background: 'var(--bg-alt)', padding: '4px 10px', borderRadius: 'var(--radius-pill)',
                      fontSize: '0.8rem', color: 'var(--text-secondary)',
                    }}>{s}</span>
                  )}
                </div>
              </div>

              {/* Sprachen */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600,
                }}>Sprachen</h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  <div>Spanisch — Muttersprache</div>
                  <div>Deutsch — B2 (telc)</div>
                  <div>Englisch — Fließend</div>
                </div>
              </div>

              {/* Zertifikate */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600,
                }}>Zertifikate</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  <li>Linux-Systemverwalter — Linux Foundation (2018)</li>
                  <li>Bioinformatik-Methoden — Uni Toronto (2015)</li>
                  <li>Einführung in die Informatik — MIT (2014)</li>
                </ul>
              </div>

              {/* Auszeichnungen */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600,
                }}>Auszeichnungen</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  <li>BSc Honors — Biologische Wissenschaften (2012)</li>
                  <li>Fellowship — BSPP (2011)</li>
                </ul>
              </div>

              {/* Referenz */}
              <div>
                <h3 style={{
                  fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600,
                }}>Referenz</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Tina Laskovski<br />
                  <span style={{ color: 'var(--text-muted)' }}>Marktmanager bei REWE Group</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Möchten Sie Excel-lenz ausprobieren?</h2>
        <p>Starten Sie noch heute mit unseren offenen Übungen.</p>
        <Link to="/courses" className="btn btn-white btn-lg">
          Jetzt starten
        </Link>
      </section>
    </>
  );
}

// ── CV Sub-components ──

function CVSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{
        fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em',
        color: 'var(--text-muted)', marginBottom: '16px', fontWeight: 600,
        borderBottom: '1px solid var(--border)', paddingBottom: '8px',
      }}>{title}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {children}
      </div>
    </div>
  );
}

function CVEntry({ dates, role, org, desc, muted }: {
  dates?: string; role?: string; org?: string; desc?: string; muted?: boolean;
}) {
  return (
    <div style={{ opacity: muted ? 0.55 : 1, fontSize: '0.9rem' }}>
      {dates && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>{dates}</span>}
      {role && (
        <div style={{ fontWeight: 600, color: 'var(--text)', marginTop: dates ? 2 : 0 }}>
          {role}
        </div>
      )}
      {org && <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{org}</div>}
      {desc && <div style={{ color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: desc }} />}
    </div>
  );
}
