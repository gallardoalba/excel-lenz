import { useEffect } from 'react';

export default function Impressum() {
  useEffect(() => { document.title = 'Impressum – Excel-lenz'; }, []);
  return (
    <div className="section" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="section-inner legal-content" style={{ maxWidth: '720px' }}>
        <h1>Impressum</h1>
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          Cristóbal Gallardo Alba<br />
          [Straße, Hausnummer]<br />
          [PLZ, Stadt]<br />
          Deutschland
        </p>
        <h2>Kontakt</h2>
        <p>
          E-Mail: kontakt@excel-lenz.com
        </p>
        <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p>
          Cristóbal Gallardo Alba<br />
          (Anschrift wie oben)
        </p>
        <h2>Streitschlichtung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </div>
    </div>
  );
}
