---
header-includes:
  - \usepackage{xcolor}
  - \definecolor{excelblue}{HTML}{1565C0}
  - \definecolor{excelgray}{HTML}{4D4D4D}
pdftitle: "Didaktischer Leitfaden: Excel für Fortgeschrittene — für professionelle Anwender"
author: "Cristóbal Gallardo"
date: "August 2026"
location: "Freiburg im Breisgau"
lang: de
colorlinks: true
linkcolor: blue
urlcolor: blue
fontsize: 11pt
documentclass: article
geometry: margin=2.5cm
---

\thispagestyle{empty}
\begin{center}
{\Huge\bfseries\sffamily\color{excelblue}Didaktischer Leitfaden\par}
\vspace{0.3em}
{\Large\sffamily Excel für Fortgeschrittene — für professionelle Anwender\par}
\vspace{1.5em}
{\large\sffamily Individueller Präsenzkurs für Erwachsene — 8 Sitzungen\par}
\vspace{2.5em}
{\normalsize\sffamily\color{excelgray}
\textbf{Autor:} Cristóbal Gallardo\par
\vspace{0.2em}
\textbf{Datum:} August 2026\par
\vspace{0.2em}
\textbf{Ort:} Freiburg im Breisgau\par
\vspace{0.2em}
\textbf{Dauer:} 12 Stunden (8 Sitzungen $\times$ 90 Minuten)\par
\vspace{0.2em}
\textbf{Format:} Einzelpräsenzunterricht mit praktischer Arbeit in Microsoft Excel\par
\vspace{0.2em}
\textbf{Ergänzende Ressource:} Webplattform Excel-lenz\par
}
\end{center}
\vfill
\newpage

\tableofcontents
\newpage

## 1. Präsentation und Grundlagen

### 1.1. Teilnehmerprofil

Dieser Kurs richtet sich an Fachleute, die bereits über operative Excel-Kenntnisse verfügen und ein fortgeschrittenes Niveau erreichen möchten, das ihnen ermöglicht, Aufgaben zu automatisieren, komplexe Szenarien zu modellieren und aus großen Datenmengen Erkenntnisse zu gewinnen. Das typische Profil umfasst:

- Daten-, Finanz-, Marketing- und Betriebsanalysten
- Mittleres Management und Führungskräfte, die Berichte und Dashboards erstellen
- Berater und Wirtschaftsprüfer, die intensiv mit Tabellenkalkulationen arbeiten
- Fachleute, die bereits SVERWEIS, SUMMEWENN und einfache Pivot-Tabellen verwenden und das nächste Produktivitätsniveau anstreben

### 1.2. Pädagogische Grundlagen

Das didaktische Design basiert auf denselben andragogischen Prinzipien wie der Einsteigerkurs, angepasst an das fortgeschrittene Niveau:

| Andragogisches Prinzip | Umsetzung im Fortgeschrittenenkurs |
|------------------------|-----------------------------------|
| **Lernbedürfnis** | Jede Sitzung ist mit einem realen beruflichen Problem verknüpft: Wie reduziere ich diese monatliche Aufgabe von 2 Stunden auf 2 Minuten? |
| **Selbstverständnis des Erwachsenen** | Die teilnehmende Person bringt seine Excel-Erfahrung ein; die Lehrkraft diagnostiziert spezifische Lücken und baut auf der vorhandenen Basis auf |
| **Vorerfahrung** | Ausgangspunkt sind die realen Arbeitsabläufe der teilnehmenden Person, wobei Ineffizienzen identifiziert und fortgeschrittene Lösungen vorgeschlagen werden |
| **Lernorientierung** | Fokus auf die Lösung komplexer Probleme: Finanzmodelle, Automatisierung, Management-Dashboards |
| **Intrinsische Motivation** | Die teilnehmende Person erlebt einen unmittelbaren qualitativen Sprung in ihrer beruflichen Produktivität |

### 1.3. Rolle der ergänzenden Webplattform

Die Plattform Excel-lenz dient als **Vertiefungsressource zwischen den Sitzungen**:

- **Vorbereitung**: Theorie nachlesen und sich mit neuen Funktionen vor der Präsenzsitzung vertraut machen
- **Selbstständiges Üben**: Übungen mit automatischer Zelle-für-Zelle-Korrektur zur Festigung komplexer Verfahren
- **Progressives Scaffolding**: Vierstufiges Hinweissystem zur Lösung von Übungen ohne Abhängigkeit vom Dozenten

Das bedeutungsvolle Lernen findet in der **Präsenzpraxis mit dem echten Excel** statt, wo die Lehrkraft fortgeschrittene Techniken vorführt, komplexe Formeln in Echtzeit debuggt und das Tempo an die individuelle Lernkurve anpasst.


## 2. Kursziele

Am Ende des Kurses hat die teilnehmende Person folgende fortgeschrittene Fähigkeiten entwickelt:

| Code | Operationales Ziel |
|------|-------------------|
| OBJ-01 | Komplexe benutzerdefinierte Formate entwerfen, formelbasierte bedingte Formatierung anwenden und Datenüberprüfung mit erweiterten Kriterien konfigurieren |
| OBJ-02 | Mehrdimensionale Suchfunktionen beherrschen (XVERWEIS, INDEX+VERGLEICH), dynamische Bereichsbezüge (BEREICH.VERSCHIEBEN), Bedingungsfunktionen (SUMMEWENNS), Finanzfunktionen (NBW, IKV, RMZ, ZW) und dynamische Matrixformeln (Dynamic Arrays) |
| OBJ-03 | Definierte Namen, 3D-Bezüge, Verknüpfungen zwischen Arbeitsmappen und erweiterte Datenkonsolidierung verwalten |
| OBJ-04 | Spezialfilter mit komplexen Kriterien, Datenbankfunktionen (DBSUMME, DBAUSZUG) und mehrstufige Teilergebnisse anwenden |
| OBJ-05 | Erweiterte Pivot-Tabellen mit Gruppierungen, Datenschnitten, berechneten Feldern und interaktiven Pivot-Charts erstellen |
| OBJ-06 | Was-wäre-wenn-Analyse-Werkzeuge nutzen (Zielwertsuche, Szenarien, Datentabellen, Solver) und Formelüberwachungswerkzeuge anwenden |
| OBJ-07 | Kombinierte Diagramme, Management-Dashboards mit KPIs erstellen und professionelle Visualisierungstechniken anwenden |
| OBJ-08 | Makros aufzeichnen, bearbeiten und ausführen, um wiederkehrende Aufgaben zu automatisieren, und die Grundlagen von VBA verstehen |


## 3. Entwickelte Kompetenzen

### 3.1. Fortgeschrittene digitale Kompetenz

Der Kurs vertieft den **DigComp 2.2-Rahmen** (Vuorikari et al., 2022) auf mittlerem bis fortgeschrittenem Niveau:

| DigComp 2.2-Bereich | Entwicklung im Kurs |
|---------------------|-------------------|
| Informationen und Datenkompetenz | Spezialfilter, Datenbankfunktionen, Extraktion eindeutiger Datensätze, Konsolidierung aus mehreren Quellen |
| Erstellung digitaler Inhalte | Professionelle Dashboards, kombinierte Diagramme, benutzerdefinierte Formate, Vorlagen |
| Sicherheit | Erweiterter Blatt- und Arbeitsmappenschutz, Ausblenden von Formeln, Makrosicherheit, DSGVO-konformer Umgang mit sensiblen Daten, Metadatenbereinigung |
| Problemlösung | Modellierung mit Solver, Was-wäre-wenn-Analyse, Automatisierung komplexer Aufgaben mit Makros |

### 3.2. Computational Thinking und Modellierung

- **Fortgeschrittene Abstraktion**: Erstellung von Finanz- und Betriebsmodellen mit mehreren voneinander abhängigen Variablen
- **Automatisierung**: Identifikation wiederkehrender Aufgaben, die durch Makros automatisiert werden können
- **Systematische Fehlerbehebung**: Einsatz von Formelüberwachungswerkzeugen zur Diagnose von Folgefehlern

### 3.3. Übergreifende berufliche Kompetenzen

| Kompetenz | Entwicklung im Kurs |
|-----------|-------------------|
| Datengestützte Entscheidungsfindung | Szenarioanalyse, Sensitivitätstabellen, Zielwertsuche |
| Effizienz und Produktivität | Automatisierung mit Makros, erweiterte Tastenkombinationen, Best Practices der Modellierung |
| Management-Kommunikation | Erstellung professioneller Dashboards für die Präsentation vor der Geschäftsleitung |
| Kritisches Denken | Formelüberwachung, Modellvalidierung, Fehlererkennung |


## 4. Inhalte und Struktur

### 4.1. Organisation der Inhalte

Der Kurs verdichtet die zehn Module des Fortgeschrittenenprogramms auf acht Sitzungen:

| Sitzung | Integrierte Module | Hauptinhalt |
|---------|-------------------|-------------|
| 1 | M1 | Benutzerdefinierte Formate, erweiterte bedingte Formatierung, Überprüfung und Schutz |
| 2 | M2 | Erweiterte Funktionen: mehrdimensionale Suche, Bedingungsfunktionen, Finanzfunktionen, Matrixformeln |
| 3 | M3 + M4 | 3D-Bezüge, definierte Namen, Datenbankfunktionen, Spezialfilter |
| 4 | M5 | Erweiterte Pivot-Tabellen: Gruppierung, Datenschnitte, berechnete Felder, Pivot-Charts |
| 5 | M6 | Sparklines, Trendlinien, Was-wäre-wenn-Analyse, Solver, Formelüberwachung |
| 6 | M7 | Erweiterte Diagramme, Dashboards, professionelle Visualisierung |
| 7 | M8 | Makros: Aufzeichnung, Ausführung, grundlegende VBA-Bearbeitung |
| 8 | M9 + M10 | Angewandtes VBA, Zusammenarbeit, Vorlagen und Produktivität |

### 4.2. Zeitplan

| Termin | Sitzung | Hauptinhalt | Schwerpunkt |
|-------|---------|-------------|-------------|
| 1 | Sitzung 1 | Erweiterte Formate, bedingte Formatierung, Überprüfung und Schutz | Theorie-Praxis |
| 2 | Sitzung 2 | Erweiterte Funktionen und komplexe Formeln | Theorie-Praxis |
| 3 | Sitzung 3 | Bezüge, Namen, Datenbanken und Spezialfilter | Praxis |
| 4 | Sitzung 4 | Erweiterte Pivot-Tabellen | Theorie-Praxis |
| 5 | Sitzung 5 | Datenanalyse, Szenarien und Solver | Theorie-Praxis |
| 6 | Sitzung 6 | Erweiterte Diagramme und Dashboards | Praxis |
| 7 | Sitzung 7 | Automatisierung mit Makros (Einführung) | Theorie-Praxis |
| 8 | Sitzung 8 | Angewandtes VBA, Zusammenarbeit und Produktivität | Theorie-Praxis |


## 5. Didaktische Methodik

### 5.1. Struktur einer Standardsitzung (90 Minuten)

| Phase | Dauer | Aktivität |
|-------|-------|-----------|
| Rückblick | 5 Min | Klärung von Fragen aus der vorherigen Sitzung und Besprechung der selbstständigen Übung |
| Demonstration | 20 Min | Vorführung fortgeschrittener Techniken: Die Lehrkraft erstellt live und spricht dabei seinen Denkprozess aus. Die teilnehmende Person reproduziert gleichzeitig auf ihrem Gerät |
| Geführte Übung | 45 Min | Übungen mit zunehmender Komplexität. Die Lehrkraft beobachtet, diagnostiziert Fehler und gibt unmittelbares Feedback |
| Festigung | 15 Min | Integrationsübung, die mehrere Techniken kombiniert. Die teilnehmende Person arbeitet eigenständig; die Lehrkraft greift nur ein, wenn es unbedingt nötig ist |
| Abschluss | 5 Min | Zusammenfassung des Gelernten, Vorschau auf die nächste Sitzung und Empfehlung von Übungen auf der Plattform |

### 5.2. Methodische Grundsätze

1. **Eingangsdiagnose**: Jede Sitzung beginnt mit einer informellen Bewertung des tatsächlichen Niveaus der teilnehmenden Person im jeweiligen Thema
2. **Problembasiertes Lernen**: Die Übungen bilden authentische berufliche Situationen nach
3. **Kognitive Modellierung**: Die Lehrkraft macht seinen Denkprozess beim Erstellen komplexer Formeln und Modelle sichtbar
4. **Gezieltes Üben**: Übungen, die darauf ausgelegt sind, die festgestellten spezifischen Schwachstellen zu überwinden
5. **Fortschreitende Automatisierung**: Vom manuellen Verständnis zur Automatisierung mit Makros


## 6. Materialien und didaktische Ressourcen

### 6.1. Hauptressourcen

- **Microsoft Excel** (Microsoft 365 (oder Excel 2024/LTSC))
- **Beamer oder zweiter Bildschirm** zur gleichzeitigen Anzeige
- **Excel-Übungsdateien** mit für jede Sitzung vorbereiteten Datensätzen

### 6.2. Ergänzende Webplattform Excel-lenz

| Funktionalität | Beschreibung |
|----------------|--------------|
| 25 interaktive Fortgeschrittenen-Übungen (ergänzend zu den 39 Präsenzübungen) | Excel-Simulator mit nach Modulen geordneten Übungen auf fortgeschrittenem Niveau |
| Automatische Korrektur | Sofortiges Zelle-für-Zelle-Feedback |
| Progressives Hinweissystem | Vier Stufen von allgemeiner Orientierung bis zur vollständigen Lösung |
| Fortschrittsübersicht | Visualisierung des individuellen Fortschritts |


## 7. Fortschrittsverfolgung

Da es sich um eine nicht regulierte Einzelfortbildung handelt, wird ein Modell der **kontinuierlichen qualitativen Verfolgung** eingesetzt:

- **Direkte Beobachtung**: Die Lehrkraft bewertet die Flüssigkeit, Genauigkeit und Selbstständigkeit der teilnehmenden Person in jeder Sitzung
- **Üben zwischen den Sitzungen**: Die Webplattform zeichnet die abgeschlossenen Übungen auf
- **Sofortiges Feedback**: Korrektur im Moment mit ausführlicher Erklärung der Fehlerursache
- **Teilnahmebescheinigung**: Wird am Ende des Kurses auf Basis von Anwesenheit und aktiver Teilnahme ausgestellt


## 8. Ausgestaltung der Sitzungen

### Sitzung 1: Erweiterte Formate, bedingte Formatierung und Datenüberprüfung

**Integriertes Modul**: M1 (Erweiterte Formate und Datenüberprüfung)  
**Dauer**: 90 Minuten  
**Schwerpunkt**: Theorie-Praxis

#### Sitzungsziele

- Benutzerdefinierte Zahlenformate mit Formatcodes entwerfen (0, #, ?, %, @)
- Formelbasierte Regeln für bedingte Formatierung erstellen, um Zeilen, Daten und Unterschiede hervorzuheben
- Erweiterte Datenüberprüfung mit Listen, Einschränkungen und benutzerdefinierten Formeln konfigurieren
- Gezielten Schutz von Zellen, Blättern und der Arbeitsmappenstruktur einrichten

#### Inhalte

| Konzeptuell | Prozedural | Einstellungsbezogen |
|----------|-----------|-----------|
| Formatcodes: positiv;negativ;null;text | Benutzerdefinierte Formate mit Text, Farben und Bedingungen erstellen | Sorgfalt bei der professionellen Darstellung von Daten |
| Bedingte Formatierung mit Formeln | Komplexe Regeln entwerfen (=$F5="TX", =UND(B4>HEUTE();...)) | Aufmerksamkeit für die Logik der Bedingungen |
| Arten der erweiterten Überprüfung | Eingabemeldungen und benutzerdefinierte Fehlermeldungen konfigurieren | Verantwortung für die Datenintegrität |
| Granularer Zell- und Blattschutz | Formelzellen sperren und Bearbeitung in Eingabezellen zulassen | Wertschätzung der Informationssicherheit |

#### Sitzungsablauf

| Phase | Zeit | Aktivität |
|-------|------|-----------|
| Rückblick | 5 Min | Gespräch: Welche Art von Berichten erstellt die teilnehmende Person? Welche Formatierungs- oder Überprüfungsprobleme sind aufgetreten? |
| Demonstration | 20 Min | Erstellung eines benutzerdefinierten Zahlenformats mit 4 Abschnitten. Anwendung formelbasierter bedingter Formatierung zur Hervorhebung ganzer Zeilen. Konfiguration der Überprüfung mit Liste und numerischer Einschränkung |
| Geführte Übung | 45 Min | Die teilnehmende Person erstellt ein Mitarbeiterregister mit: Datenüberprüfung (Abteilungsliste, Altersspanne), bedingter Formatierung zur Hervorhebung von Ausreißern und Schutz von Formelzellen |
| Festigung | 15 Min | Eigenständige Übung: Entwurf eines Rechnungsformats mit benutzerdefinierten Formaten und Überprüfung |
| Abschluss | 5 Min | Zusammenfassung. Übung auf der Plattform: Modul 1 |


### Sitzung 2: Erweiterte Funktionen und komplexe Formeln

**Integriertes Modul**: M2 (Erweiterte Funktionen)  
**Dauer**: 90 Minuten  
**Schwerpunkt**: Theorie-Praxis

#### Sitzungsziele

- Zweidimensionale Suchen mit INDEX + VERGLEICH und dynamische Bezüge mit BEREICH.VERSCHIEBEN durchführen
- Verschachtelte logische Funktionen mit WENN, UND, ODER und WENNFEHLER implementieren
- SUMMEWENNS und ZÄHLENWENNS mit mehreren Kriterien anwenden
- Wichtige Finanzfunktionen nutzen: NBW, IKV, RMZ, ZW
- Matrixformeln (Dynamic Arrays in M365) erstellen

#### Inhalte

| Konzeptuell | Prozedural | Einstellungsbezogen |
|----------|-----------|-----------|
| Mehrdimensionale Suche und dynamische Bezüge | Zweidimensionales INDEX+VERGLEICH und BEREICH.VERSCHIEBEN mit SUMME erstellen | Wertschätzung der Flexibilität gegenüber SVERWEIS |
| Verschachtelung logischer Funktionen | WENN, UND, ODER und WENNFEHLER in realen Kontexten verketten | Geduld bei syntaktischer Komplexität |
| Mehrfache Bedingungsberechnung | SUMMEWENNS mit 3+ Kriterien entwerfen | Sorgfalt bei der Spezifikation von Bedingungen |
| Zeitwert des Geldes | NBW, IKV, RMZ für Finanzentscheidungen berechnen | Interesse an beruflicher Anwendung |
| Matrixformeln | Matrixformeln (Dynamic Arrays in M365) erstellen und debuggen | Neugier auf fortgeschrittene Techniken |

#### Sitzungsablauf

| Phase | Zeit | Aktivität |
|-------|------|-----------|
| Rückblick | 5 Min | Kurze Wiederholung von SVERWEIS und SUMMEWENN als Aktivierung des Vorwissens |
| Demonstration | 20 Min | Dialogische Erstellung eines Gehaltsabrechnungsmodells: INDEX+VERGLEICH zur Suche nach Mitarbeiterdaten, verschachteltes WENN für Gehaltskategorien, SUMMEWENNS für Abteilungssummen |
| Geführte Übung | 45 Min | Investitionsanalysemodell: NBW und IKV zur Projektbewertung, RMZ zur Berechnung von Darlehensraten, Matrixformel für Bedingungssumme |
| Festigung | 15 Min | Integrationsübung mit echten Finanzdaten |
| Abschluss | 5 Min | Zusammenfassung. Übung auf der Plattform: Modul 2 |


### Sitzung 3: 3D-Bezüge, Datenbanken und Spezialfilter

**Integrierte Module**: M3 (Bezüge und Namen) + M4 (Datenbanken)  
**Dauer**: 90 Minuten  
**Schwerpunkt**: Praxis

#### Sitzungsziele

- Definierte Namen für Bereiche, Formeln und Konstanten erstellen und verwalten
- 3D-Bezüge zur Konsolidierung von Daten zwischen Blättern erstellen
- Spezialfilter mit Kriterienbereich anwenden (UND-, ODER-Operatoren)
- Datenbankfunktionen nutzen: DBSUMME, DBMITTELWERT, DBAUSZUG
- Automatische mehrstufige Teilergebnisse berechnen

#### Inhalte

| Konzeptuell | Prozedural | Einstellungsbezogen |
|----------|-----------|-----------|
| Definierte Namen als Best Practice | Namen aus dem Namensfeld und dem Namens-Manager erstellen | Wertschätzung für Klarheit und Wartbarkeit |
| 3D-Bezüge zur Konsolidierung | =SUMME('Tabelle1:Tabelle5'!B2) erstellen | Wertschätzung der Effizienz bei der Konsolidierung |
| Spezialfilterkriterien | Kriterienbereiche mit UND (gleiche Zeile) und ODER (verschiedene Zeilen) entwerfen | Sorgfalt bei der Spezifikation von Bedingungen |
| Datenbankfunktionen | DBSUMME, DBMITTELWERT, DBAUSZUG erstellen | Neugier auf spezialisierte Werkzeuge |

#### Sitzungsablauf

| Phase | Zeit | Aktivität |
|-------|------|-----------|
| Rückblick | 5 Min | Kurze Wiederholung absoluter und relativer Bezüge |
| Demonstration | 20 Min | Erstellung einer Arbeitsmappe mit Quartalsdaten auf getrennten Blättern, Definition von Namen für Schlüsselbereiche und jährliche Konsolidierung mittels 3D-Bezügen. Vorführung des Spezialfilters mit mehreren Kriterien |
| Geführte Übung | 45 Min | Die teilnehmende Person erstellt eine Abteilungsbudget-Arbeitsmappe mit 3D-Konsolidierung, wendet Spezialfilter zur Extraktion bestimmter Datensätze an und nutzt DBSUMME für bedingte Abfragen |
| Festigung | 15 Min | Eigenständige Übung mit Mitarbeiterdatenbank: mehrstufige Sortierung, Teilergebnisse nach Abteilung, Spezialfilter mit berechneten Kriterien |
| Abschluss | 5 Min | Zusammenfassung. Übung auf der Plattform: Module 3 und 4 |


### Sitzung 4: Erweiterte Pivot-Tabellen

**Integriertes Modul**: M5 (Pivot-Tabellen und Pivot-Charts)  
**Dauer**: 90 Minuten  
**Schwerpunkt**: Theorie-Praxis

#### Sitzungsziele

- Komplexe Pivot-Tabellen mit mehreren Feldern und benutzerdefinierten Zusammenfassungsfunktionen erstellen
- Daten nach Datum (Monat, Quartal, Jahr) und numerischen Bereichen gruppieren
- Datenschnitte und Zeitleisten für interaktive visuelle Filterung einfügen
- Berechnete Felder und berechnete Elemente erstellen
- Verknüpfte Pivot-Charts entwerfen und erweiterte Präsentationsformate anwenden

#### Inhalte

| Konzeptuell | Prozedural | Einstellungsbezogen |
|----------|-----------|-----------|
| Mehrdimensionale Datenstruktur | Felder in Zeilen, Spalten, Werten und Filtern konfigurieren | Freude an der interaktiven Erkundung von Daten |
| Zeitliche und numerische Gruppierung | Daten gruppieren und benutzerdefinierte Bereiche erstellen | Wertschätzung der Synthese gegenüber dem Detail |
| Datenschnitte als Benutzeroberfläche | Datenschnitte einfügen und mit mehreren Tabellen verbinden | Interesse am Design interaktiver Werkzeuge |
| Benutzerdefinierte Berechnungen in Pivot-Tabellen | Berechnete Felder erstellen und Zusammenfassungsfunktionen ändern | Neugier, die Standardfunktionen zu erweitern |
| Professionelles Design und Präsentation | Tabellenformate anwenden und Werte als % der Gesamtsumme anzeigen | Sorgfalt für effektive visuelle Kommunikation |

#### Sitzungsablauf

| Phase | Zeit | Aktivität |
|-------|------|-----------|
| Rückblick | 5 Min | Hat die teilnehmende Person Pivot-Tabellen verwendet? Auf welche Einschränkungen ist er gestoßen? |
| Demonstration | 20 Min | Ausgehend von einer Rechnungsdatenbank erstellt die Lehrkraft eine Pivot-Tabelle, gruppiert nach Quartalen, fügt ein berechnetes Feld für Rentabilität hinzu, fügt einen Regions-Datenschnitt ein und erstellt ein Pivot-Chart |
| Geführte Übung | 45 Min | Die teilnehmende Person erstellt Umsatzberichte nach Region und Produkt mit zeitlicher Gruppierung, % der Gesamtsumme, Rankings und mit mehreren Tabellen verbundenen Datenschnitten |
| Festigung | 15 Min | Übung: Erstellung eines Management-Berichts mit Pivot-Tabelle, Datenschnitten und Pivot-Chart |
| Abschluss | 5 Min | Zusammenfassung. Übung auf der Plattform: Modul 5 |


### Sitzung 5: Datenanalyse, Szenarien und Solver

**Integriertes Modul**: M6 (Datenanalyse und Szenariomodelle)  
**Dauer**: 90 Minuten  
**Schwerpunkt**: Theorie-Praxis

#### Sitzungsziele

- Sparklines zur Visualisierung in Zellen einfügen und anpassen
- Trendlinien zu Diagrammen hinzufügen und den R²-Wert interpretieren
- Was-wäre-wenn-Analyse-Werkzeuge anwenden: Zielwertsuche, Szenarien und Datentabellen
- Optimierungsprobleme mit Solver lösen (Nebenbedingungen, Zielfunktion)
- Formelüberwachungswerkzeuge zur Validierung von Modellen nutzen

#### Inhalte

| Konzeptuell | Prozedural | Einstellungsbezogen |
|----------|-----------|-----------|
| Sparklines als kompakte Visualisierung | Linien-, Spalten- und Gewinn/Verlust-Sparklines einfügen | Wertschätzung der kontextbezogenen Visualisierung |
| Lineare Regression und Kurvenanpassung | Trendlinien hinzufügen und R² analysieren | Neugier auf prädiktive Modellierung |
| Grundlagen der Was-wäre-wenn-Analyse | Zielwertsuche, Szenarien und Datentabellen anwenden | Vertrauen in entscheidungsunterstützende Werkzeuge |
| Optimierung mit Nebenbedingungen | Solver konfigurieren: Zielzelle, Variablen und Nebenbedingungen | Interesse an Ressourcenoptimierung |
| Formelüberwachung | Vorgänger- und Nachfolgerspuren verfolgen und Formeln auswerten | Sorgfalt bei der Modellvalidierung |

#### Sitzungsablauf

| Phase | Zeit | Aktivität |
|-------|------|-----------|
| Rückblick | 5 Min | Gespräch über datengestützte Entscheidungen, die die teilnehmende Person regelmäßig trifft |
| Demonstration | 20 Min | Erstellung eines Rentabilitätsmodells: Sparklines für Trends, Trendlinie mit R², Zielwertsuche für Break-Even-Point, Solver zur Gewinnmaximierung mit Nebenbedingungen |
| Geführte Übung | 45 Min | Die teilnehmende Person erstellt ein vollständiges Analysemodell: Datentabelle mit zwei Variablen, drei Szenarien (optimistisch, Basis, pessimistisch), Solver zur Optimierung und Formelüberwachung zur Validierung |
| Festigung | 15 Min | Übung zur Fehlerdiagnose in einem vorgefertigten Modell |
| Abschluss | 5 Min | Zusammenfassung. Übung auf der Plattform: Modul 6 |


### Sitzung 6: Erweiterte Diagramme und Dashboards

**Integriertes Modul**: M7 (Erweiterte Diagramme und Visualisierung)  
**Dauer**: 90 Minuten  
**Schwerpunkt**: Praxis

#### Sitzungsziele

- Den optimalen Diagrammtyp für jede Datenart und Botschaft auswählen
- Kombinierte Diagramme (Säule + Linie) mit Sekundärachse erstellen
- Erweiterte Anpassung: Achsen, Beschriftungen, Fehlerindikatoren, Trendlinien
- Management-Dashboards mit Integration von Tabellen, Diagrammen, Sparklines und Datenschnitten entwerfen
- Diagramme und Dashboards für Präsentationen exportieren

#### Inhalte

| Konzeptuell | Prozedural | Einstellungsbezogen |
|----------|-----------|-----------|
| Grammatik der Datenvisualisierung | Den zur Botschaft passenden Diagrammtyp auswählen | Kritisches Bewusstsein für visuelle Kommunikation |
| Kombinierte Diagramme und Sekundärachsen | Diagramme mit zwei verschiedenen Skalen erstellen | Aufmerksamkeit für darstellerische Klarheit |
| Erweiterte Diagrammanpassung | Achsen formatieren, Fehlerindikatoren und Trendlinien hinzufügen | Sorgfalt für visuelles Detail |
| Dashboard-Design-Prinzipien | Mehrere visuelle Elemente kohärent integrieren | Ganzheitliche Sicht auf die Datenpräsentation |

#### Sitzungsablauf

| Phase | Zeit | Aktivität |
|-------|------|-----------|
| Rückblick | 5 Min | Durchsicht der vom Teilnehmer in ihrer Arbeit erstellten Diagramme |
| Demonstration | 20 Min | Erstellung eines Vertriebs-Dashboards: kombiniertes Diagramm mit monatlichen Umsätzen und Marge, Sparklines pro Produkt, Trendlinie mit Prognose, Pivot-Tabelle mit Datenschnitt |
| Geführte Übung | 45 Min | Die teilnehmende Person entwirft ihr eigenes Dashboard aus einem Rechnungsdatensatz und wendet alle bearbeiteten Visualisierungstechniken an |
| Festigung | 15 Min | Kritische Überprüfung des Dashboards: Kommuniziert es effektiv? Was könnte verbessert werden? |
| Abschluss | 5 Min | Zusammenfassung. Übung auf der Plattform: Modul 7 |


### Sitzung 7: Automatisierung mit Makros (Einführung)

**Integriertes Modul**: M8 (Makros — Einführungsniveau)  
**Dauer**: 90 Minuten  
**Schwerpunkt**: Theorie-Praxis

#### Sitzungsziele

- Verstehen, was ein Makro ist, wie es funktioniert und wann es eingesetzt wird
- Die Registerkarte Entwicklertools aktivieren und die Makrosicherheit konfigurieren
- Makros mit absoluten und relativen Bezügen aufzeichnen
- Makros über das Dialogfeld, Tastenkombinationen und Schaltflächen ausführen
- Einfache Makros im VBA-Editor bearbeiten

#### Inhalte

| Konzeptuell | Prozedural | Einstellungsbezogen |
|----------|-----------|-----------|
| Konzept von Makro und VBA | Registerkarte Entwicklertools aktivieren und Sicherheit konfigurieren | Bewusstsein für Sicherheitsrisiken |
| Aufzeichnung mit absoluten vs. relativen Bezügen | Ein Makro aufzeichnen, das einen Bericht formatiert | Wertschätzung der Zeitersparnis |
| Ausführungsmethoden | Makro einer Schaltfläche, Form und Tastenkombination zuweisen | Interesse an Produktivität |
| Grundstruktur von VBA | Aufgezeichneten Code im Editor lesen und ändern | Neugier, den generierten Code zu verstehen |

#### Sitzungsablauf

| Phase | Zeit | Aktivität |
|-------|------|-----------|
| Rückblick | 5 Min | Welche wiederkehrenden Aufgaben führt die teilnehmende Person wöchentlich in Excel aus? |
| Demonstration | 20 Min | Live-Aufzeichnung eines Makros, das einen Bericht formatiert: Fettdruck in Überschriften, Rahmen, Spaltenanpassung und Summenformeln. Zuweisung zu einer Schaltfläche und grundlegende Code-Änderung |
| Geführte Übung | 45 Min | Die teilnehmende Person zeichnet drei Makros auf: (1) Berichtsformatierung, (2) Anwendung von Filtern und Sortierung, (3) Einfügen eines Übersichtsblatts. Weist sie Schaltflächen zu und übt ihre Bearbeitung in VBA |
| Festigung | 15 Min | Übung: Ein Makro aufzeichnen, das eine reale Aufgabe der teilnehmenden Person automatisiert |
| Abschluss | 5 Min | Zusammenfassung. Übung auf der Plattform: Modul 8 |


### Sitzung 8: Angewandtes VBA, Zusammenarbeit und Kursabschluss

**Integrierte Module**: M9 (Erweitertes VBA) + M10 (Zusammenarbeit)  
**Dauer**: 90 Minuten  
**Schwerpunkt**: Theorie-Praxis

#### Sitzungsziele

- Die Grundlagen der VBA-Programmierung verstehen: Variablen, Typen, Kontrollstrukturen
- Blatt- und Arbeitsmappenereignisse kennen (Worksheet_Change, Workbook_Open)
- Einen Ausblick auf benutzerdefinierte Funktionen (UDF) geben
- Vorlagen, erweiterten Schutz und Zusammenarbeit konfigurieren
- Den Ausbildungsweg festigen und einen Plan für die zukünftige Entwicklung entwerfen

#### Inhalte

| Konzeptuell | Prozedural | Einstellungsbezogen |
|----------|-----------|-----------|
| Variablen, Typen und Kontrollstrukturen in VBA | Eine For Each-Schleife und eine If/Then-Bedingung schreiben | Neugier auf Programmierung |
| Excel-Ereignisse | Ein Worksheet_Change-Ereignis zur automatischen Validierung erstellen | Interesse an reaktiver Automatisierung |
| Benutzerdefinierte Funktionen | Das Konzept einer UDF verstehen und ein Beispiel nachvollziehen | Wertschätzung der Erweiterbarkeit von Excel |
| Vorlagen und Zusammenarbeit | Eine .xltx-Vorlage erstellen und Schutz konfigurieren | Verantwortung bei gemeinsamer Arbeit |

#### Sitzungsablauf

| Phase | Zeit | Aktivität |
|-------|------|-----------|
| Rückblick | 5 Min | Überprüfung der in der vorherigen Sitzung aufgezeichneten Makros |
| Demonstration | 20 Min | Geführtes Schreiben einer For Each-Schleife zur Verarbeitung eines Bereichs, Demonstration einer UDF als Ausblick, Konfiguration eines Worksheet_Change-Ereignisses |
| Geführte Übung | 40 Min | Die teilnehmende Person schreibt VBA-Code, um Daten zu durchlaufen und bedingt zu formatieren, und konfiguriert ein einfaches Ereignis |
| Festigung | 15 Min | Integrationsprojekt: Die teilnehmende Person automatisiert einen eigenen wiederkehrenden Bericht aus ihrem Arbeitsalltag mit den erlernten Techniken. Anschließend Kursrückschau mit Identifikation der wirkungsvollsten Werkzeuge und Vertiefungsbereiche |
| Abschluss | 10 Min | Übergabe der Bescheinigung. Entwicklungsplan: empfohlene Ressourcen, erweiterter VBA-Kurs, Excel-lenz-Community |


## 9. Kursverfolgung

### 9.1. Verfolgungsindikatoren

| Indikator | Quelle | Häufigkeit |
|-----------|--------|------------|
| Komplexität der beherrschten Techniken | Direkte Beobachtung | In jeder Sitzung |
| Selbstständigkeit bei der Problemlösung | Geführte Übung | In jeder Sitzung |
| Durchgeführte selbstständige Übungen | Plattform Excel-lenz | Wöchentlich |
| Anwendung im beruflichen Kontext | Gespräch mit der teilnehmenden Person | In jeder Sitzung |

### 9.2. Anpassung des Programms

Die Lehrkraft passt Tempo und Inhalte an nach:

- Dem tatsächlichen Ausgangsniveau der teilnehmenden Person in jedem Inhaltsblock
- Den spezifischen Anforderungen seines beruflichen Umfelds
- Der Geschwindigkeit, mit der fortgeschrittene Konzepte aufgenommen werden

### 9.3. Abschlussbericht

Am Ende des Kurses erstellt die Lehrkraft einen Bericht mit:

1. Grad der Zielerreichung
2. Angemessenheit der Inhalte für das berufliche Profil der teilnehmenden Person
3. Verbesserungsvorschläge für zukünftige Durchführungen


## Anhang: Zuordnung Sitzungen → Module → Übungen

Der Lehrplan **Excel für Fortgeschrittene** umfasst 10 Module mit insgesamt **39 Übungen**,
die in 8 Sitzungen à 90 Minuten unterrichtet werden. Alle Übungen liegen als
Excel-Dateien (`.xlsx`) werden digital zum Kurs zur Verfügung gestellt.

| Sitzung | Module | Übungen | Übungsdateien |
|---------|--------|:-------:|---------------|
| 1 | M1 | 4 | `M1_1` bis `M1_4` |
| 2 | M2 | 6 | `M2_1` bis `M2_6` |
| 3 | M3 + M4 | 8 | `M3_1`–`M3_4`, `M4_1`–`M4_4` |
| 4 | M5 | 4 | `M5_1` bis `M5_4` |
| 5 | M6 | 4 | `M6_1` bis `M6_4` |
| 6 | M7 | 3 | `M7_1` bis `M7_3` |
| 7 | M8 | 3 | `M8_1` bis `M8_3` |
| 8 | M9 + M10 | 7 | `M9_1`–`M9_4`, `M10_1`–`M10_4` |

**Hinweis:** Power Pivot (M5.5) und VBA Best Practices (M9.5) sind als Ausblick konzipiert und haben keine eigenständigen Übungsdateien.

---

## Literaturverzeichnis

Knowles, M. S. (1980). *The Modern Practice of Adult Education: From Pedagogy to
Andragogy* (Revised ed.). Cambridge Adult Education.

Mezirow, J. (1991). *Transformative Dimensions of Adult Learning*. Jossey-Bass.

Mishra, P. & Koehler, M. J. (2006). Technological Pedagogical Content Knowledge:
A Framework for Teacher Knowledge. *Teachers College Record*, 108(6), 1017–1054.

Ferrari, A. & Russo, M. (2021). *Definitive Guide to DAX: Business Intelligence for Microsoft Power BI, SQL Server Analysis Services, and Excel* (2nd ed.). Microsoft Press.

Siemens, G. (2005). Connectivism: A Learning Theory for the Digital Age.
*International Journal of Instructional Technology and Distance Learning*, 2(1), 3–10.

Vuorikari, R., Kluzer, S. & Punie, Y. (2022). *DigComp 2.2: The Digital Competence
Framework for Citizens*. Publications Office of the European Union. doi:10.2760/115376

---

*Didaktischer Leitfaden, erstellt nach den Grundsätzen der Andragogik (Knowles,
1980) und dem europäischen Rahmen für digitale Kompetenzen DigComp 2.2 (Vuorikari
et al., 2022).*
