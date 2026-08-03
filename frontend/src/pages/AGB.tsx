import { useEffect } from 'react';

export default function AGB() {
  useEffect(() => { document.title = 'AGB – Excel-lenz'; }, []);
  return (
    <div className="section" style={{ paddingTop: '120px', minHeight: '80vh' }}>
      <div className="section-inner legal-content" style={{ maxWidth: '720px' }}>
        <h1>Allgemeine Geschäftsbedingungen</h1>
        <p className="legal-date">Stand: August 2026</p>

        <h2>1. Geltungsbereich</h2>
        <p>
          Diese AGB gelten für die Nutzung der Online-Lernplattform Excel-lenz,
          betrieben von Cristóbal Gallardo Alba (nachfolgend „Anbieter").
        </p>

        <h2>2. Leistungsbeschreibung</h2>
        <p>
          Excel-lenz bietet interaktive Excel-Übungen und Lerninhalte. Der Anbieter
          stellt die Plattform nach bestem Bemühen zur Verfügung, übernimmt jedoch
          keine Gewähr für ununterbrochene Verfügbarkeit.
        </p>

        <h2>3. Registrierung und Nutzerkonto</h2>
        <ul>
          <li>Die Registrierung erfordert eine gültige E-Mail-Adresse und einen Benutzernamen.</li>
          <li>Der Nutzer ist für die Geheimhaltung seiner Zugangsdaten verantwortlich.</li>
          <li>Ein Anspruch auf Registrierung besteht nicht.</li>
        </ul>

        <h2>4. Nutzungsrechte</h2>
        <p>
          Die auf der Plattform bereitgestellten Inhalte dürfen ausschließlich für den
          persönlichen Lerngebrauch genutzt werden. Jede Vervielfältigung oder öffentliche
          Zugänglichmachung bedarf der vorherigen schriftlichen Zustimmung des Anbieters.
        </p>

        <h2>5. Haftung</h2>
        <p>
          Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Für leichte
          Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten.
          Die Haftung ist in diesem Fall auf den vorhersehbaren, vertragstypischen Schaden begrenzt.
        </p>

        <h2>6. Kündigung</h2>
        <p>
          Der Nutzer kann sein Konto jederzeit durch eine E-Mail an kontakt@excel-lenz.com
          löschen lassen. Der Anbieter behält sich das Recht vor, Konten bei Verstoß gegen
          diese AGB zu sperren oder zu löschen.
        </p>

        <h2>7. Änderungen der AGB</h2>
        <p>
          Der Anbieter behält sich das Recht vor, diese AGB zu ändern. Änderungen werden
          dem Nutzer per E-Mail mitgeteilt. Widerspricht der Nutzer nicht innerhalb von
          14 Tagen, gelten die geänderten AGB als akzeptiert.
        </p>

        <h2>8. Schlussbestimmungen</h2>
        <p>
          Es gilt deutsches Recht. Sollten einzelne Bestimmungen unwirksam sein, bleibt
          die Wirksamkeit der übrigen Bestimmungen unberührt.
        </p>
      </div>
    </div>
  );
}
