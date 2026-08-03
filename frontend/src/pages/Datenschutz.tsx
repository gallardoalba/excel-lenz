import { useEffect } from 'react';

export default function Datenschutz() {
  useEffect(() => { document.title = 'Datenschutz – Excel-lenz'; }, []);
  return (
    <div className="section" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="section-inner legal-content" style={{ maxWidth: '720px' }}>
        <h1>Datenschutzerklärung</h1>
        <p className="legal-date">Stand: August 2026</p>

        <h2>1. Verantwortlicher</h2>
        <p>
          Cristóbal Gallardo Alba<br />
          E-Mail: kontakt@excel-lenz.com
        </p>

        <h2>2. Erhebung und Speicherung personenbezogener Daten</h2>
        <p>
          Bei der Nutzung unserer Plattform erheben wir folgende Daten:
        </p>
        <ul>
          <li>Benutzername und E-Mail-Adresse (bei Registrierung)</li>
          <li>Lernfortschritt und Übungsergebnisse</li>
          <li>Technische Daten: IP-Adresse, Browsertyp, Zugriffszeitpunkt (Server-Logs)</li>
        </ul>

        <h2>3. Zweck der Datenverarbeitung</h2>
        <p>
          Die Daten werden ausschließlich für folgende Zwecke verwendet:
        </p>
        <ul>
          <li>Bereitstellung der Lernplattform und personalisierter Übungen</li>
          <li>Speicherung des Lernfortschritts</li>
          <li>Technische Sicherheit und Fehleranalyse</li>
        </ul>

        <h2>4. Cookies</h2>
        <p>
          Wir verwenden ausschließlich technisch notwendige Cookies:
        </p>
        <ul>
          <li><strong>auth_token</strong>: Sitzungs-Cookie für die Anmeldung (JWT)</li>
          <li><strong>theme</strong>: Speichert Ihre Dark/Light-Mode-Einstellung</li>
        </ul>
        <p>Diese Cookies sind für den Betrieb der Plattform erforderlich und benötigen keine Einwilligung (§ 25 Abs. 2 TTDSG).</p>

        <h2>5. Weitergabe an Dritte</h2>
        <p>
          Ihre Daten werden nicht an Dritte weitergegeben, es sei denn, dies ist gesetzlich
          vorgeschrieben oder zur Durchsetzung unserer Rechte erforderlich.
        </p>

        <h2>6. Speicherdauer</h2>
        <p>
          Personenbezogene Daten werden gelöscht, sobald der Zweck der Speicherung entfällt.
          Server-Logs werden nach 30 Tagen automatisch gelöscht.
        </p>

        <h2>7. Ihre Rechte</h2>
        <p>Sie haben folgende Rechte:</p>
        <ul>
          <li>Auskunft über gespeicherte Daten (Art. 15 DSGVO)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
          <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
        </ul>
        <p>Kontaktieren Sie uns unter kontakt@excel-lenz.com. Beschwerderecht bei der Aufsichtsbehörde bleibt unberührt.</p>
      </div>
    </div>
  );
}
