---
pdftitle: "Lehrplan: Excel für Fortgeschrittene"
author: "Cristbal Gallardo"
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
{\Huge\bfseries\sffamily\color{excelblue}Lehrplan\par}
\vspace{0.3em}
{\Large\sffamily Excel für Fortgeschrittene\par}
\vspace{0.3em}
{\large\sffamily für professionelle Anwender\par}
\vspace{1.5em}
{\large\sffamily Vollständiger Lehrplan mit Theorie und praktischen Übungen\par}
\vspace{2.5em}
{\normalsize\sffamily\color{excelgray}
\textbf{Autor:} Cristbal Gallardo\par
\vspace{0.2em}
\textbf{Datum:} August 2026\par
\vspace{0.2em}
\textbf{Ort:} Freiburg im Breisgau\par
\vspace{0.2em}
\textbf{Dauer:} 12 Stunden (8 Sitzungen $\times$ 90 Minuten)\par
\vspace{0.2em}
\textbf{Niveau:} Fortgeschrittene (Excel-Grundkenntnisse erforderlich)\par
}
\end{center}
\vfill

\tableofcontents

## Einleitung

Dieser Lehrplan bietet eine vollständige Vertiefung in Microsoft Excel für
professionelle Anwender, die bereits über operative Excel-Kenntnisse verfügen.
Er kombiniert fortgeschrittene Theorie mit praxisnahen Übungen und wurde für den
Einzel-Präsenzunterricht konzipiert.

**Vorausgesetzte Kenntnisse:**
- Sicherer Umgang mit Formeln und Bezügen (relativ, absolut, gemischt)
- Grundfunktionen: SUMME, MITTELWERT, WENN, SVERWEIS
- Grundlegende Formatierung und Diagrammerstellung
- Erfahrung mit einfachen Pivot-Tabellen

## Für wen ist dieser Lehrplan?

Dieser Lehrplan richtet sich an **Fachleute mit Excel-Vorkenntnissen**, die
Aufgaben automatisieren, komplexe Szenarien modellieren und aus großen
Datenmengen Erkenntnisse gewinnen möchten.

## Wie ist der Lehrplan aufgebaut?

1. **Lernziel**  Was Sie nach diesem Modul können werden
2. **Theorie**  Verständliche Erklärungen auf fortgeschrittenem Niveau
3. **Übungen**  Praktische Aufgaben zur Vertiefung


## Modul 1: Erweiterte Formate, bedingte Formatierung und Datenüberprüfung

**Lernziel:** Benutzerdefinierte Zahlenformate entwerfen, formelbasierte bedingte
Formatierung anwenden und erweiterte Datenvalidierung mit Schutz kombinieren.

## 1.1. Pädagogische Grundlagen

Dieser Lehrplan folgt denselben andragogischen Prinzipien wie der
Einsteigerkurs. Die didaktischen Entscheidungen stützen sich auf:

1. **Andragogik** (Knowles, 1980): Erwachsene lernen problemorientiert und
   bringen umfangreiche Vorerfahrung ein.
2. **Konnektivismus** (Siemens, 2005): Die ergänzende Webplattform Excel-lenz
   dient als kontinuierliche Lernressource zwischen den Präsenzsitzungen.
3. **Transformatives Lernen** (Mezirow, 1991): Fortgeschrittene Techniken
   verändern grundlegend, wie der Teilnehmer Excel-Aufgaben angeht.
4. **TPACK-Modell** (Mishra & Koehler, 2006): Technisches Excel-Wissen wird
   mit pädagogischen Strategien kombiniert, die an das individuelle Lerntempo
   angepasst sind.

Die detaillierte didaktische Begründung findet sich im **Didaktischen Leitfaden:
Excel für Fortgeschrittene**.

## 1.2. Benutzerdefinierte Zahlenformate

### Konzept: Formatcodes als Sprache

Ein benutzerdefiniertes Zahlenformat besteht aus bis zu vier Abschnitten, getrennt
durch Semikolon: `positiv;negativ;null;text`. Jeder Abschnitt definiert, wie ein
Wert in der jeweiligen Kategorie dargestellt wird.

| Abschnitt | Bedeutung | Beispiel |
|-----------|-----------|----------|
| 1. Abschnitt | Positive Zahlen | `#.##0,00` |
| 2. Abschnitt | Negative Zahlen | `[Rot]-#.##0,00` |
| 3. Abschnitt | Null | `"-"` |
| 4. Abschnitt | Text | `@" (Text)"` |

**Die wichtigsten Formatzeichen:**

| Zeichen | Bedeutung | Beispiel (Eingabe) | Anzeige |
|---------|-----------|-------------------|---------|
| `0` | Ziffer oder Null | `000` (5) | `005` |
| `#` | Ziffer (keine führende Null) | `###` (5) | `5` |
| `?` | Platzhalter für Ausrichtung | `???.??` (5.1) | `5.1 ` |
| `@` | Textplatzhalter | `"Artikel: "@` (Buch) | `Artikel: Buch` |
| `[Farbe]` | Bedingte Farbe | `[Rot]#.##0;[Blau]-#.##0` | Rot/Blau |

**Tipp:** Das Prozentzeichen im Format multipliziert mit 100: `0%` zeigt 0,19 als
19% an. Um 19 als 19% anzuzeigen: `0"%"`.

**Übung 1.1  Benutzerdefinierte Formate**

Die folgende Übungstabelle **Modul 1 1 Zahlenformate** ist bereits geladen.

> 1. Erstellen Sie ein Format, das positive Zahlen in Schwarz (`#.##0,00 `),
>    negative in Rot (`[Rot]-#.##0,00 `) und Null als `-` anzeigt.
> 2. Erstellen Sie ein Format, das Zahlen unter 1000 normal und über 1000
>    in Tausend anzeigt: `[<1000]#.##0;[>999]#.##0." T"`.

## 1.3. Bedingte Formatierung mit Formeln
### Konzept: Regeln, die mitdenken

Formelbasierte bedingte Formatierung geht weit über die vordefinierten Regeln
hinaus. Sie können jede Excel-Formel als Bedingung verwenden  und die
Formatierung passt sich in Echtzeit an.

| Anwendungsfall | Formel | Effekt |
|---------------|--------|--------|
| Ganze Zeile hervorheben | `=$F5="TX"` | Zeile wird markiert, wenn Spalte F "TX" enthält |
| Fällige Daten warnen | `=UND(B4>HEUTE();B4<=HEUTE()+30)` | Daten in den nächsten 30 Tagen |
| Abweichungen erkennen | `=$B4<>$C4` | Unterschiede zwischen Spalten B und C |
| Doppelte Werte | `=ZÄHLENWENN($A:$A;$A1)>1` | Duplikate in Spalte A |

**Wichtig:** Bei formelbasierten Regeln beziehen Sie sich immer auf die
**aktive Zelle** der Markierung. Wenn Sie A1:D100 markieren und A1 die aktive
Zelle ist, muss die Formel `=$F1="TX"` lauten (nicht `=$F5`).

**Übung 1.2  Formelbasierte bedingte Formatierung**

Die folgende Übungstabelle **Modul 1 2 Bedingte_Formatierung** ist bereits geladen.

> 1. Heben Sie alle Zeilen hervor, deren Betrag > 10.000  ist (Formel: `=$C2>10000`).
> 2. Markieren Sie Zeilen, deren Status "Offen" ist, mit gelbem Hintergrund.
> 3. Erstellen Sie eine Regel, die das Fälligkeitsdatum rot markiert, wenn es
>    weniger als 7 Tage in der Zukunft liegt: `=UND($D2>HEUTE();$D2<=HEUTE()+7)`.

## 1.4. Erweiterte Datenüberprüfung
### Konzept: Datenqualität schon bei der Eingabe sichern

Die Datenüberprüfung verhindert fehlerhafte Eingaben, bevor sie in der Tabelle
landen. Für fortgeschrittene Anwender sind besonders nützlich:

- **Benutzerdefinierte Formeln** als Validierungskriterium
- **Eingabemeldungen**, die dem Benutzer Hinweise geben
- **Fehlermeldungen** mit individuellen Texten und Stopp-/Warnstufen

| Validierungstyp | Beispiel | Verhindert |
|----------------|---------|------------|
| Liste | `=Abteilungen` (benannter Bereich) | Tippfehler, freie Eingabe |
| Benutzerdefiniert | `=UND(A1>=18;A1<=65)` | Werte außerhalb des Altersbereichs |
| Benutzerdefiniert | `=LÄNGE(B1)=5` | IDs mit falscher Länge |
| Datum | zwischen HEUTE() und HEUTE()+90 | Vergangene oder zu weit entfernte Daten |

**Tipp:** Verwenden Sie **Namen** für Validierungslisten statt direkter
Zellbezüge  das macht die Arbeitsmappe wartbarer und verständlicher.

**Übung 1.3  Datenüberprüfung einrichten**

Die folgende Übungstabelle **Modul 1 3 Validierung** ist bereits geladen.

> 1. Erstellen Sie eine Dropdown-Liste für Abteilungen aus dem benannten Bereich
>    `Abteilungen` (IT, Vertrieb, HR, Finanzen, Marketing).
> 2. Begrenzen Sie das Gehalt auf 30.000120.000 mit benutzerdefinierter Formel.
> 3. Fügen Sie eine Eingabemeldung Bitte Abteilung aus Liste wählen" hinzu.
> 4. Erstellen Sie eine Stopp-Fehlermeldung Ungültiges Gehalt (30.000120.000)".

## 1.5. Gezielter Schutz
### Konzept: Nur das schützen, was geschützt werden muss

Alle Zellen sind standardmäßig **gesperrt**  aber die Sperre wirkt erst, wenn der
Blattschutz aktiviert wird. Der Arbeitsablauf ist daher:

1. **Zellen entsperren**, die bearbeitbar bleiben sollen (`Strg+1`  Schutz  Gesperrt)
2. **Blattschutz aktivieren** (Überprüfen  Blatt schützen)

| Schutzebene | Was sie schützt | Typischer Einsatz |
|------------|-----------------|-------------------|
| Zellsperre | Einzelne Zellen vor Änderung | Formelzellen, Referenzwerte |
| Blattschutz | Gesamtes Tabellenblatt | Eingabeformulare |
| Arbeitsmappenschutz | Struktur (Blätter löschen/einfügen) | Vorlagen |
| Formeln ausblenden | Formel nicht in Bearbeitungsleiste | Proprietäre Berechnungen |

**Übung 1.4  Schutz einrichten**

Die folgende Übungstabelle **Modul 1 4 Schutz** ist bereits geladen.

> 1. Entsperren Sie die Eingabezellen (B2:B10), lassen Sie Formelzellen gesperrt.
> 2. Aktivieren Sie den Blattschutz (ohne Passwort).
> 3. Blenden Sie die Formeln in Spalte D aus (Zellen formatieren  Schutz).
> 4. Testen Sie: Eingabezellen sind bearbeitbar, Formelzellen nicht.


## Modul 2: Erweiterte Funktionen und komplexe Formeln

**Lernziel:** Mehrdimensionale Suchfunktionen, verschachtelte Logik,
Finanzfunktionen und Matrixformeln beherrschen.

## 2.1. INDEX + VERGLEICH: Die flexible Alternative zu SVERWEIS

### Konzept: In jede Richtung suchen

SVERWEIS kann nur von links nach rechts suchen. INDEX+VERGLEICH hebt diese
Einschränkung auf und ist zudem robuster bei Tabellenänderungen.

```
=INDEX(Bereich; Zeilennummer; [Spaltennummer])
=VERGLEICH(Suchkriterium; Suchbereich; [Vergleichstyp])
```

**Zweidimensionale Suche:** `=INDEX(B3:E9; VERGLEICH(B13; B3:B9; 0); VERGLEICH(B14; B3:E3; 0))`

| Vergleichstyp | Bedeutung |
|--------------|-----------|
| `0` | Exakte Übereinstimmung (unsortiert) |
| `1` | Größter Wert &lt;= Suchkriterium (aufsteigend sortiert) |
| `-1` | Kleinster Wert &gt;= Suchkriterium (absteigend sortiert) |

**Tipp:** INDEX+VERGLEICH ist auch schneller als SVERWEIS bei großen Tabellen
**Tipp:** In Excel 365/2021 ersetzt `XVERWEIS` (XLOOKUP) sowohl SVERWEIS als
auch INDEX+VERGLEICH mit einer einfacheren Syntax:
`=XVERWEIS(Suchwert; Suchspalte; Rückgabespalte; [Wenn_nicht_gefunden]; [Vergleichsmodus])`.
XVERWEIS sucht in beide Richtungen und benötigt keinen Spaltenindex mehr.
und bricht nicht, wenn Spalten eingefügt werden.

**Übung 2.1  INDEX + VERGLEICH anwenden**

Die folgende Übungstabelle **Modul 2 1 INDEX_VERGLEICH** ist bereits geladen.

> 1. Finden Sie den Preis eines Produkts mit INDEX+VERGLEICH, wobei die
>    Produktspalte **rechts** vom Preis steht (SVERWEIS kann das nicht).
> 2. Erstellen Sie eine bidirektionale Suche: Produkt (Zeile)  Monat (Spalte).
> 3. Vergleichen Sie die Formel mit einer SVERWEIS-Variante. Welche ist flexibler?

## 2.2. Dynamische Bezüge mit BEREICH.VERSCHIEBEN

### Konzept: Bereiche, die atmen

BEREICH.VERSCHIEBEN (OFFSET) gibt einen Bezug zurück, der um eine bestimmte
Anzahl Zeilen/Spalten von einer Startzelle verschoben ist  mit variabler Höhe
und Breite.

**Syntax:** `=BEREICH.VERSCHIEBEN(Bezug; Zeilen; Spalten; [Höhe]; [Breite])`

```
=SUMME(BEREICH.VERSCHIEBEN(A1;0;0;E2;1))
 Summiert von A1 bis A[E2] (dynamische Bereichsgröße)
```

| Anwendung | Formel |
|-----------|--------|
| Dynamische Summe | `=SUMME(BEREICH.VERSCHIEBEN(B1;0;0;ANZAHL2(B:B);1))` |
| Letzte 3 Monate | `=MITTELWERT(BEREICH.VERSCHIEBEN(B1;ANZAHL(B:B)-3;0;3))` |
| Rollierender Durchschnitt | In Kombination mit ZÄHLENWENN für gleitende Fenster |

**Wichtig:** BEREICH.VERSCHIEBEN ist eine **flüchtige Funktion**  sie wird
bei jeder Arbeitsmappenänderung neu berechnet. Bei vielen BEREICH.VERSCHIEBEN-
Formeln kann die Performance leiden.

**Übung 2.2  Dynamische Bezüge**

Die folgende Übungstabelle **Modul 2 2 BEREICH_VERSCHIEBEN** ist bereits geladen.

> 1. Erstellen Sie eine dynamische Summenformel, die automatisch neue Zeilen
>    berücksichtigt (mit ANZAHL2 für die Zeilenanzahl).
> 2. Erstellen Sie eine Formel für den Durchschnitt der letzten 6 Monate, die
>    sich automatisch anpasst, wenn neue Daten hinzukommen.

## 2.3. Verschachtelte Logik und Fehlerbehandlung

### Konzept: Mehrere Bedingungen elegant verketten

Statt tiefer WENN-Schachtelungen bietet Excel mehrere Alternativen:

| Funktion | Syntax | Anwendung |
|----------|--------|-----------|
| WENNS (Excel 2019+) | `=WENNS(B2>=90;"A";B2>=80;"B";B2>=70;"C";WAHR;"F")` | Mehrere Bedingungen ohne Schachtelung |
| WENNFEHLER | `=WENNFEHLER(SVERWEIS(A2;Liste;2;0);"Nicht gefunden")` | #NV und andere Fehler abfangen |
| WAHL | `=WAHL(B2;"Klein";"Mittel";"Groß")` | Wert aus Liste basierend auf Index |

**Tipp:** WENNFEHLER fängt ALLE Fehler ab. Für präzisere Fehlerbehandlung
gibt es WENNNV (nur #NV) in Excel 2013+.

**Übung 2.3  Verschachtelte Funktionen**

Die folgende Übungstabelle **Modul 2 3 Logik** ist bereits geladen.

> 1. Erstellen Sie eine Provisionsberechnung mit verschachteltem WENN:
>    - Umsatz < 10.000: 5%
>    - Umsatz 10.00050.000: 8%
>    - Umsatz > 50.000: 12%
> 2. Verwenden Sie WENNFEHLER für eine SVERWEIS-Formel, die bei fehlendem
>    Suchbegriff "Nicht im Katalog" anzeigt.
> 3. Optional: Schreiben Sie die Provisionsformel mit WENNS (Excel 2019+) um.

## 2.4. Finanzfunktionen für die Praxis

### Konzept: Den Zeitwert des Geldes berechnen

| Funktion | Was sie berechnet | Beispiel |
|----------|------------------|----------|
| RMZ (PMT) | Regelmäßige Zahlung (Rate) | `=RMZ(4,5%/12; 30*12; -250000)` |
| NBW (NPV) | Kapitalwert einer Investition | `=NBW(8%; B2:B6)+B1` |
| IKV (IRR) | Interner Zinsfuß (Rendite) | `=IKV(B1:B6)` |
| ZW (FV) | Zukunftswert einer Anlage | `=ZW(3%/12; 20*12; -200; -10000)` |

**Wichtig:** Bei RMZ und ZW sind Zahlungen, die Sie leisten, als **negative**
Zahlen anzugeben. Der Zinssatz muss zur Periode passen: Jahreszins durch 12
für monatliche Raten.

**Übung 2.4  Finanzfunktionen anwenden**

Die folgende Übungstabelle **Modul 2 4 Finanzfunktionen** ist bereits geladen.

> 1. Berechnen Sie die monatliche Rate für einen Kredit über 250.000  bei
>    4,5% Zins und 30 Jahren Laufzeit mit RMZ.
> 2. Berechnen Sie den Kapitalwert (NBW) einer Investition: Anfangsinvestition
>    100.000 , jährliche Rückflüsse 25.000  über 6 Jahre, Zinssatz 8%.
> 3. Berechnen Sie mit ZW das Endkapital einer monatlichen Sparrate von 200 
>    über 20 Jahre bei 3% Jahreszins.

## 2.5. Matrixformeln

### Konzept: Eine Formel, viele Ergebnisse

Matrixformeln führen mehrere Berechnungen gleichzeitig durch und können ein
ganzes Array von Ergebnissen zurückgeben.

**Klassische Matrixformel (Strg+Umschalt+Enter):**
```
{=SUMME(WENN(A1:A10>10; B1:B10; 0))}
```

**Dynamische Matrixformeln (Excel 365/2021):**
```
=SORTIEREN(FILTERN(A1:C100; C1:C100>1000))
```

**Tipp:** In Excel 365 werden Matrixformeln automatisch als dynamische Arrays
behandelt  Sie müssen kein Strg+Umschalt+Enter mehr drücken. Die Formel läuft
automatisch über alle betroffenen Zellen.

**Übung 2.5  Matrixformeln**

Die folgende Übungstabelle **Modul 2 5 Matrixformeln** ist bereits geladen.

> 1. Erstellen Sie eine Matrixformel, die alle Umsätze > 1.000  summiert:
>    `{=SUMME(WENN(C2:C20>1000; C2:C20; 0))}`
> 2. Erstellen Sie eine Matrixformel, die den größten Umsatz pro Region findet.
> 3. Testen Sie (Excel 365): `=SORTIEREN(EINDEUTIG(A2:A50))` für eindeutige Werte.


## 2.6. Datums- und Zeitfunktionen

### Konzept: Mit Daten rechnen, nicht nur anzeigen

Excel speichert Datumsangaben als fortlaufende Zahlen (1 = 01.01.1900) und
Uhrzeiten als Dezimalbruch (0,5 = 12:00). Dieses System ermöglicht präzise
Zeitberechnungen.

| Funktion | Syntax | Beispiel | Ergebnis |
|----------|--------|----------|----------|
| HEUTE | `=HEUTE()` | `=HEUTE()` | Aktuelles Datum |
| JETZT | `=JETZT()` | `=JETZT()` | Datum + Uhrzeit |
| JAHR | `=JAHR(Datum)` | `=JAHR(B2)` | Jahr extrahieren |
| MONAT | `=MONAT(Datum)` | `=MONAT(B2)` | Monat (1-12) |
| TAG | `=TAG(Datum)` | `=TAG(B2)` | Tag (1-31) |
| MONATSENDE | `=MONATSENDE(Datum; Monate)` | `=MONATSENDE(B2;0)` | Letzter Tag des Monats |
| BRTEILJAHRE | `=BRTEILJAHRE(Start; Ende)` | `=BRTEILJAHRE(B2;C2)` | Jahre zwischen Daten |
| ARBEITSTAG | `=ARBEITSTAG(Datum; Tage)` | `=ARBEITSTAG(B2;10)` | Datum nach X Arbeitstagen |
| NETTOARBEITSTAGE | `=NETTOARBEITSTAGE(Start; Ende)` | `=NETTOARBEITSTAGE(B2;C2)` | Arbeitstage zwischen Daten |

**Tipp:** `=DATEDIF(Startdatum;Enddatum;"Y")` berechnet ganze Jahre zwischen
Daten — ideal für Altersberechnungen. Die Funktion ist nicht dokumentiert, aber
in allen Excel-Versionen verfügbar.

**Übung 2.6  Datums- und Zeitfunktionen**

Die folgende Übungstabelle **Modul 2 6 Datum_Zeit** ist bereits geladen.

> 1. Berechnen Sie das Alter von Personen aus dem Geburtsdatum mit
>    `=BRTEILJAHRE(B2;HEUTE())`.
> 2. Ermitteln Sie mit `MONATSENDE` den letzten Tag des aktuellen Monats.
> 3. Berechnen Sie das Fälligkeitsdatum 30 Arbeitstage nach Bestelldatum mit
>    `ARBEITSTAG`.
> 4. Berechnen Sie die Anzahl Arbeitstage zwischen zwei Daten mit
>    `NETTOARBEITSTAGE`.

## Modul 3: Referenzen 3D, Namen und externe Verknüpfungen

**Lernziel:** Definierte Namen professionell einsetzen, Daten über mehrere Blätter
mit 3D-Bezügen konsolidieren und externe Arbeitsmappen verknüpfen.

## 3.1. Definierte Namen für Fortgeschrittene

### Konzept: Namen für Formeln, Konstanten und Bereiche

Namen machen Formeln lesbar und wartbar. Statt `=B2*$F$1` schreiben Sie
`=B2*MwSt_Satz`.

| Name-Typ | Beispiel | Verwendung |
|----------|---------|------------|
| Bereichsname | `=SUMME(Umsatz)` | Summiert den benannten Bereich |
| Formelname | `MwSt = 0,19` | Konstante in Berechnungen |
| Dynamischer Name | `Daten = BEREICH.VERSCHIEBEN(Tabelle1!$A$1;0;0;ANZAHL2(Tabelle1!$A:$A);5)` | Wächst automatisch |

**Den Namens-Manager** (`Strg+F3`) zeigt alle definierten Namen mit deren
Gültigkeitsbereich (Arbeitsmappe oder einzelnes Blatt).

**Übung 3.1  Namen definieren und verwalten**

Die folgende Übungstabelle **Modul 3 1 Namen** ist bereits geladen.

> 1. Definieren Sie Namen für: MwSt_Satz (19%), Einkommensteuer (25%),
>    Sozialabgaben (15%).
> 2. Erstellen Sie einen dynamischen Namen `AlleDaten` mit BEREICH.VERSCHIEBEN,
>    der automatisch neue Zeilen einschließt.
> 3. Verwenden Sie die Namen in einer Gehaltsabrechnungs-Formel.

## 3.2. 3D-Bezüge: Daten über Blätter hinweg

### Konzept: Gleiche Zelle, viele Blätter

Ein 3D-Bezug referenziert dieselbe Zelle oder denselben Bereich über mehrere
Tabellenblätter hinweg.

**Syntax:** `=SUMME(Januar:Dezember!B2)`

| Funktion | 3D-fähig? | Beispiel |
|----------|:---------:|----------|
| SUMME |  | `=SUMME(Q1:Q4!B5)` |
| MITTELWERT |  | `=MITTELWERT(2019:2026!C10)` |
| MAX / MIN |  | `=MAX(Region1:Region5!D20)` |
| SVERWEIS |  | Nicht in 3D-Bezügen möglich |

**Wichtig:** Alle Blätter müssen dieselbe Struktur haben (gleiche Daten an
gleichen Positionen). Blätter, die zwischen dem ersten und letzten Blatt
eingefügt werden, sind automatisch im 3D-Bezug enthalten.

**Übung 3.2  3D-Bezüge erstellen**

Die folgende Übungstabelle **Modul 3 2 3D_Bezuege** ist bereits geladen.

> 1. Erstellen Sie eine Jahresübersicht, die mit `=SUMME(Januar:Dezember!B2)`
>    die Gesamtsumme über alle Monatsblätter berechnet.
> 2. Fügen Sie ein neues Blatt zwischen Januar und Februar ein  prüfen Sie,
>    ob der 3D-Bezug das neue Blatt automatisch einschließt.

## 3.3. Verknüpfungen zwischen Arbeitsmappen

### Konzept: Daten aus anderen Dateien live einbinden

Externe Verknüpfungen ziehen Daten aus anderen Excel-Dateien. Bei Änderungen in
der Quelldatei werden die Daten in der Zieldatei aktualisiert.

**Syntax:** `='C:\Pfad\[Quelldatei.xlsx]Tabellenblatt'!Zelle`

| Aktion | Menüpfad |
|--------|----------|
| Verknüpfungen bearbeiten | Daten  Abfragen und Verbindungen  Verknüpfungen bearbeiten |
| Verknüpfung aktualisieren | Werte aktualisieren |
| Verknüpfung trennen | Verknüpfung lösen (Werte bleiben erhalten) |

**Tipp:** Vermeiden Sie zu viele externe Verknüpfungen  sie verlangsamen
das Öffnen der Datei erheblich. Für große Datenmengen ist Power Query die
bessere Alternative.

**Übung 3.3  Externe Verknüpfungen**

Die folgende Übungstabelle **Modul 3 3 Verknuepfungen** ist bereits geladen.

> 1. Erstellen Sie eine Verknüpfung zu einer externen Arbeitsmappe
>    `Budgetdaten.xlsx`, Blatt `Q1`, Zelle `B5`.
> 2. Testen Sie: Ändern Sie den Wert in der Quelldatei und aktualisieren
>    Sie die Verknüpfung (Daten  Alle aktualisieren).
> 3. Lösen Sie die Verknüpfung und prüfen Sie, ob die Werte erhalten bleiben.


## 3.4. Datenkonsolidierung

### Konzept: Aus vielen Quellen eine Wahrheit

Die Konsolidierung (Daten → Datentools → Konsolidieren) fasst Daten aus mehreren
Bereichen zusammen — auch wenn die Kategorien in unterschiedlicher Reihenfolge
stehen.

**Konsolidierung nach Position:** Alle Quellbereiche haben exakt dieselbe Struktur.
**Konsolidierung nach Kategorie:** Excel ordnet gleiche Beschriftungen automatisch zu.

| Funktion | Verwendung |
|----------|-----------|
| Summe | Standard — addiert Werte gleicher Kategorien |
| Mittelwert | Durchschnitt aus mehreren Quellen |
| Max / Min | Extremwerte über alle Quellen |
| Anzahl | Wie viele Einträge pro Kategorie? |

**Tipp:** Aktivieren Sie "Verknüpfung mit den Quelldaten", damit sich die
Konsolidierung automatisch aktualisiert, wenn sich Quelldaten ändern.

**Übung 3.4  Daten konsolidieren**

Die folgende Übungstabelle **Modul 3 4 Konsolidierung** ist bereits geladen.

> 1. Sie haben drei Blätter (Q1, Q2, Q3) mit Umsätzen pro Produkt. Konsolidieren
>    Sie die Daten auf einem Jahresübersichtsblatt (Daten → Konsolidieren).
> 2. Konsolidieren Sie nach Kategorie: Die Produkte stehen in unterschiedlicher
>    Reihenfolge auf den Quartalsblättern.
> 3. Aktivieren Sie die Verknüpfung mit den Quelldaten und ändern Sie einen Wert
>    in Q1 — aktualisiert sich die Konsolidierung?

## Modul 4: Datenbanken in Excel  Spezialfilter und Datenbankfunktionen

**Lernziel:** Spezialfilter mit komplexen Kriterien anwenden, Datenbankfunktionen
(DBSUMME, DBMITTELWERT) einsetzen und mehrstufige Teilergebnisse berechnen.

## 4.1. Spezialfilter mit Kriterienbereich

### Konzept: Filtern wie mit SQL  aber in Excel

Der Spezialfilter (Daten  Sortieren und Filtern  Erweitert) ermöglicht
komplexe Filterlogik mit UND/ODER-Verknüpfungen über einen separaten
Kriterienbereich.

**Kriterienbereich aufbauen:**
- Kriterien in derselben Zeile = **UND**-Verknüpfung
- Kriterien in verschiedenen Zeilen = **ODER**-Verknüpfung

| Produkt | Umsatz |
|---------|--------|
| Laptop | >5000 |
| Monitor | >5000 |

 Zeigt alle Laptops ODER Monitore mit Umsatz > 5000

**Tipp:** Sie können das Ergebnis an eine andere Stelle kopieren lassen
(Auswahl in anderen Bereich kopieren") und mit Nur eindeutige Datensätze"
Duplikate eliminieren.

**Übung 4.1  Spezialfilter anwenden**

Die folgende Übungstabelle **Modul 4 1 Spezialfilter** ist bereits geladen.

> 1. Erstellen Sie einen Kriterienbereich für: Region "Nord" UND Umsatz > 10.000.
> 2. Erweitern Sie: Region "Nord" ODER Region "Süd" (jeweils Umsatz > 10.000).
> 3. Extrahieren Sie eindeutige Datensätze in einen neuen Bereich.

## 4.2. Datenbankfunktionen

### Konzept: Bedingte Berechnungen auf Tabellenebene

Datenbankfunktionen arbeiten wie SUMMEWENN, aber mit einem separaten
Kriterienbereich  ideal für komplexe, mehrstufige Bedingungen.

| Funktion | Entsprechung | Syntax |
|----------|-------------|--------|
| DBSUMME | SUMME mit Kriterien | `=DBSUMME(Datenbank; "Umsatz"; Kriterien)` |
| DBMITTELWERT | MITTELWERT mit Kriterien | `=DBMITTELWERT(Datenbank; "Alter"; Kriterien)` |
| DBANZAHL | ANZAHL mit Kriterien | `=DBANZAHL(Datenbank; "ID"; Kriterien)` |
| DBAUSZUG | Einzelwert extrahieren | `=DBAUSZUG(Datenbank; "Name"; Kriterien)` |

**Vorteil gegenüber SUMMEWENNS:** Kriterien können in einem Bereich verwaltet
und schnell geändert werden, ohne Formeln anzufassen.

**Übung 4.2  Datenbankfunktionen**

Die folgende Übungstabelle **Modul 4 2 Datenbankfunktionen** ist bereits geladen.

> 1. Berechnen Sie mit DBSUMME den Gesamtumsatz für die Region "West".
> 2. Berechnen Sie mit DBMITTELWERT das Durchschnittsalter der Kunden aus "Berlin".
> 3. Extrahieren Sie mit DBAUSZUG den Namen des Kunden mit ID 1042.

## 4.3. Mehrstufige Teilergebnisse

### Konzept: Summen pro Gruppe  und Untergruppen

Teilergebnisse (Daten  Gliederung  Teilergebnis) fügen automatisch
Zusammenfassungszeilen nach jedem Gruppenwechsel ein.

**Voraussetzung:** Die Daten müssen nach dem Gruppierungsmerkmal **sortiert** sein.

| Gliederungsebene | Sichtbarkeit |
|-----------------|-------------|
| Ebene 1 | Nur Gesamtsumme |
| Ebene 2 | Summen pro Hauptgruppe |
| Ebene 3 | Alle Detailzeilen |

**Übung 4.3  Teilergebnisse berechnen**

Die folgende Übungstabelle **Modul 4 3 Teilergebnisse** ist bereits geladen.

> 1. Sortieren Sie die Tabelle nach Region, dann nach Produkt.
> 2. Fügen Sie Teilergebnisse für die Summe des Umsatzes pro Region ein.
> 3. Fügen Sie eine zweite Teilergebnis-Ebene für die Anzahl pro Produkt ein.


## 4.4. Excel-Tabellen und strukturierte Verweise

### Konzept: Intelligenz statt nur Formatierung

Eine Excel-Tabelle (`Strg+T`) ist mehr als ein formatierter Bereich — sie ist
eine intelligente Datenstruktur mit eigenen Regeln und Verweisen.

| Eigenschaft | Normaler Bereich | Excel-Tabelle |
|------------|-----------------|---------------|
| Formatierung | Manuell | Automatisch (Bänder, Kopfzeile) |
| Neue Zeilen | Manuell formatiert | Automatisch übernommen |
| Formeln | Manuell kopiert | Automatisch auf alle Zeilen |
| Filter | Manuell setzen | Automatisch in Kopfzeile |
| Bezüge | `=B2*C2` | `=[@Preis]*[@Menge]` |

**Strukturierte Verweise** verwenden Tabellen- und Spaltennamen statt Zelladressen:
```
=SUMME(Tabelle1[Umsatz])
=SVERWEIS(A2;Preisliste;2;0)
=[@Umsatz]-[@Kosten]
```

**Tipp:** Strukturierte Verweise machen Formeln selbsterklärend — auch Monate
später wissen Sie sofort, was berechnet wird. Sie passen sich automatisch an,
wenn die Tabelle wächst.

**Übung 4.4  Excel-Tabellen verwenden**

Die folgende Übungstabelle **Modul 4 4 Tabellen** ist bereits geladen.

> 1. Wandeln Sie den Datenbereich mit `Strg+T` in eine Excel-Tabelle um.
> 2. Berechnen Sie eine neue Spalte mit strukturiertem Verweis: `=[@Menge]*[@Preis]`.
> 3. Fügen Sie eine Ergebniszeile hinzu (Tabellenentwurf → Ergebniszeile).
> 4. Fügen Sie neue Datenzeilen hinzu — werden Formatierung und Formeln
>    automatisch übernommen?

## Modul 5: Erweiterte Pivot-Tabellen

**Lernziel:** Komplexe Pivot-Tabellen mit Gruppierungen, Datenschnitten,
berechneten Feldern und Pivot-Charts erstellen.

## 5.1. Pivot-Tabellen für Fortgeschrittene

### Konzept: Mehrere Felder, eine Tabelle

Eine Pivot-Tabelle gruppiert und aggregiert Daten dynamisch. Die vier Bereiche
sind:

| Bereich | Funktion | Beispiel |
|---------|----------|----------|
| **Zeilen** | Gruppierung nach Kategorie | Region, Produkt |
| **Spalten** | Kreuztabellierung | Quartal, Jahr |
| **Werte** | Aggregatfunktion | Summe Umsatz, Anzahl Bestellungen |
| **Filter** | Globale Einschränkung | Nur 2026, nur Region Nord |

**Verfügbare Zusammenfassungsfunktionen:** Summe, Anzahl, Mittelwert, Max, Min,
% des Gesamtergebnisses, Differenz zum Vormonat, laufende Summe.

**Übung 5.1  Pivot-Tabelle erstellen**

Die folgende Übungstabelle **Modul 5 1 Pivot** ist bereits geladen.

> 1. Erstellen Sie eine Pivot-Tabelle: Region & Produkt als Zeilen,
>    Quartal als Spalten, Summe Umsatz als Werte.
> 2. Ändern Sie die Zusammenfassung auf Mittelwert.
> 3. Zeigen Sie die Werte als % des Gesamtergebnisses an.

## 5.2. Gruppierungen und berechnete Felder

### Konzept: Daten in sinnvolle Kategorien zusammenfassen

**Gruppierung nach Datum:** Rechtsklick auf ein Datumsfeld  Gruppieren 
Monate, Quartale, Jahre auswählen.

**Berechnete Felder** (PivotTable-Analyse  Berechnetes Feld):
Erstellen Sie neue Felder basierend auf Formeln, z.B.:
```
Gewinnmarge = Gewinn / Umsatz
```

**Wichtig:** Berechnete Felder arbeiten mit den **aggregierten** Werten, nicht mit
den Rohdaten. `Gewinn / Umsatz` teilt die Summe der Gewinne durch die Summe der
Umsätze  nicht zeilenweise.

**Übung 5.2  Gruppieren und berechnete Felder**

Die folgende Übungstabelle **Modul 5 2 Pivot_Anpassung** ist bereits geladen.

> 1. Gruppieren Sie die Datumswerte nach Monaten und Quartalen.
> 2. Erstellen Sie ein berechnetes Feld `Bonus = Umsatz * 0,05`.
> 3. Erstellen Sie ein berechnetes Feld `Marge = (Umsatz - Kosten) / Umsatz`,
>    formatiert als Prozent.

## 5.3. Datenschnitte und Zeitachsen

### Konzept: Visuelle Filter für Dashboards

Datenschnitte (Slicer) sind interaktive Schaltflächen zur Filterung von
Pivot-Tabellen. Zeitachsen filtern speziell nach Datumsbereichen.

**Tipp:** Ein Slicer kann mit **mehreren Pivot-Tabellen** verbunden werden
(Rechtsklick  Berichtsverbindungen). Ein Klick filtert alle verbundenen
Tabellen gleichzeitig.

**Übung 5.3  Slicer einsetzen**

Die folgende Übungstabelle **Modul 5 3 Slicer** ist bereits geladen.

> 1. Fügen Sie Slicer für Region und Produktkategorie ein.
> 2. Erstellen Sie eine zweite Pivot-Tabelle (Anzahl pro Region) und verbinden
>    Sie beide Tabellen mit denselben Slicern.
> 3. Fügen Sie eine Zeitachse für das Bestelldatum hinzu.

## 5.4. Pivot-Charts

### Konzept: Diagramme, die mit der Pivot-Tabelle leben

Ein Pivot-Chart ist ein Diagramm, das direkt mit einer Pivot-Tabelle verbunden
ist. Änderungen an Feldern, Filtern oder Slicern werden sofort im Diagramm
reflektiert.

**Übung 5.4  Pivot-Chart erstellen**

Die folgende Übungstabelle **Modul 5 4 PivotChart** ist bereits geladen.

> 1. Erstellen Sie aus Ihrer Pivot-Tabelle ein Pivot-Chart (Säulendiagramm).
> 2. Fügen Sie einen zweiten Slicer hinzu und beobachten Sie, wie sich das
>    Diagramm automatisch anpasst.
> 3. Ändern Sie den Diagrammtyp zu einem gestapelten Säulendiagramm.

## 5.5. Power Pivot und das Datenmodell (Ausblick)

### Konzept: Millionen Zeilen, mehrere Tabellen

Power Pivot ist ein Add-In für Excel, das das Datenmodell erweitert:

- **Mehrere Millionen Zeilen** verarbeiten (weit über die 1-Mio-Zeilen-Grenze)
- **Mehrere Tabellen verknüpfen** (wie in einer Datenbank)
- **DAX-Formeln** (Data Analysis Expressions) für komplexe Berechnungen

**Aktivierung:** Datei → Optionen → Add-Ins → Verwalten: COM-Add-Ins → Power Pivot.

**Wichtig:** Power Pivot ist nur in Excel für Windows verfügbar (nicht in Excel
für Mac oder Excel Online). Für diesen Kurs ist es ein Ausblick — die
grundlegenden Pivot-Kenntnisse aus 5.1–5.4 sind die Basis.


## Modul 6: Datenanalyse, Szenarien und Solver

**Lernziel:** Was-wäre-wenn-Analyse mit Zielwertsuche, Szenarien und Solver
durchführen sowie Sparklines und Trendlinien einsetzen.

## 6.1. Zielwertsuche und Datentabellen

### Konzept: Vom gewünschten Ergebnis zur benötigten Eingabe

Die Zielwertsuche (Daten  Was-wäre-wenn-Analyse  Zielwertsuche) findet den
Eingabewert, der zu einem gewünschten Formelergebnis führt.

**Parameter:**
- **Zielzelle:** Die Zelle mit der Formel
- **Zielwert:** Der gewünschte Wert
- **Veränderbare Zelle:** Die Zelle, die Excel anpassen soll

**Datentabellen** berechnen mehrere Szenarien gleichzeitig:
- **Eindimensionale Datentabelle:** Eine Variable variieren
- **Zweidimensionale Datentabelle:** Zwei Variablen variieren (z.B. Zinssatz  Laufzeit)

**Übung 6.1  Zielwertsuche und Datentabellen**

Die folgende Übungstabelle **Modul 6 1 Zielwertsuche** ist bereits geladen.

> 1. Nutzen Sie die Zielwertsuche: Welcher Stückpreis ist nötig, um 100.000 
>    Gesamtumsatz zu erreichen?
> 2. Erstellen Sie eine Datentabelle, die die monatliche Rate für verschiedene
>    Zinssätze (3%8%) und Laufzeiten (1030 Jahre) zeigt.

## 6.2. Szenario-Manager

### Konzept: Mehrere Zukunftsbilder vergleichen

Der Szenario-Manager speichert verschiedene Wertekombinationen und ermöglicht
das schnelle Umschalten zwischen optimistischen, pessimistischen und neutralen
Szenarien.

**Ablauf:**
1. Daten  Was-wäre-wenn-Analyse  Szenario-Manager
2. Szenario hinzufügen: Name, veränderbare Zellen, Werte
3. Zwischen Szenarien wechseln oder einen Zusammenfassungsbericht erstellen

**Übung 6.2  Szenarien erstellen**

Die folgende Übungstabelle **Modul 6 2 Szenarien** ist bereits geladen.

> 1. Erstellen Sie drei Szenarien: Optimistisch (Wachstum 10%), Neutral (5%),
>    Pessimistisch (-2%).
> 2. Erstellen Sie einen Szenario-Zusammenfassungsbericht.
> 3. Wechseln Sie zwischen den Szenarien und beobachten Sie die Auswirkungen
>    auf den Gesamtgewinn.

## 6.3. Der Solver

### Konzept: Optimierung mit Nebenbedingungen

Der Solver ist ein Optimierungswerkzeug, das weit über die Zielwertsuche
hinausgeht. Er findet optimale Werte unter **mehreren Nebenbedingungen**.

**Solver aktivieren:** Datei  Optionen  Add-Ins  Solver

| Parameter | Bedeutung | Beispiel |
|-----------|-----------|----------|
| Zielzelle | Was soll maximiert/minimiert werden? | $B$10 (Gewinn) |
| Zielwert | Max, Min oder bestimmter Wert | Max |
| Veränderbare Zellen | Was darf Excel anpassen? | $B$2:$B$5 (Produktionsmengen) |
| Nebenbedingungen | Einschränkungen | $B$2:$B$5 <= $C$2:$C$5 (max. Kapazität) |

**Übung 6.3  Solver einsetzen**

Die folgende Übungstabelle **Modul 6 3 Solver** ist bereits geladen.

> 1. Maximieren Sie den Gewinn unter folgenden Nebenbedingungen:
>    - Produktionsmenge &gt;= 0 (keine negativen Mengen)
>    - Gesamtkosten &lt;= Budget (50.000 )
>    - Max. Produktionskapazität pro Produkt beachten
> 2. Ändern Sie die Nebenbedingungen und vergleichen Sie die Ergebnisse.

## 6.4. Sparklines und Trendlinien

### Konzept: Diagramme in Miniatur  direkt in Zellen

Sparklines sind winzige Diagramme innerhalb einer Zelle, die Trends auf einen
Blick sichtbar machen.

| Sparkline-Typ | Verwendung |
|--------------|------------|
| Linie | Zeitreihen, Trends |
| Säule | Vergleiche zwischen Kategorien |
| Gewinn/Verlust | Positive/negative Entwicklung |

**Trendlinien** in normalen Diagrammen zeigen den Trend und können mit R
die Anpassungsgüte quantifizieren.

**Übung 6.4  Sparklines und Trendlinien**

Die folgende Übungstabelle **Modul 6 4 Sparklines** ist bereits geladen.

> 1. Fügen Sie Liniensparklines für die monatlichen Umsatzzahlen ein.
> 2. Fügen Sie eine lineare Trendlinie zum Umsatzdiagramm hinzu und lassen
>    Sie R anzeigen.
> 3. Interpretieren Sie R = 0,87: Ist das ein starker Zusammenhang?


## Modul 7: Erweiterte Diagramme und Dashboards

**Lernziel:** Kombinierte Diagramme mit Sekundärachse, Wasserfalldiagramme und
professionelle Executive Dashboards erstellen.

## 7.1. Erweiterte Diagrammtypen

### Konzept: Für jede Datenart das richtige Diagramm

| Diagrammtyp | Einsatz | Beispiel |
|------------|---------|----------|
| Kombidiagramm (Säule + Linie) | Zwei verschiedene Skalen | Umsatz () + Wachstumsrate (%) |
| Wasserfall | Kumulierte Effekte | Gewinn- und Verlustrechnung |
| Histogramm | Häufigkeitsverteilung | Altersverteilung der Kunden |
| Kastendiagramm | Statistische Verteilung | Quartile, Ausreißer |

**Tipp:** Ein Kombidiagramm mit Sekundärachse eignet sich hervorragend für
Soll-Ist-Vergleiche: Säulen für Ist-Werte, Linie für Soll-Werte.

**Übung 7.1  Verbunddiagramm erstellen**

Die folgende Übungstabelle **Modul 7 1 Verbunddiagramm** ist bereits geladen.

> 1. Erstellen Sie ein Kombidiagramm: Umsatz als Säulen, Wachstumsrate als Linie
>    mit Sekundärachse.
> 2. Formatieren Sie die linke Achse in , die rechte Achse in %.
> 3. Fügen Sie Fehlerindikatoren hinzu (Standardabweichung).

## 7.2. Wasserfall- und Spezialdiagramme

### Konzept: Kumulierte Effekte visualisieren

Ein Wasserfalldiagramm zeigt, wie ein Anfangswert durch eine Reihe positiver
und negativer Veränderungen zu einem Endwert wird  ideal für Finanzanalysen.

**Übung 7.2  Wasserfalldiagramm**

Die folgende Übungstabelle **Modul 7 2 Wasserfall** ist bereits geladen.

> 1. Erstellen Sie ein Wasserfalldiagramm aus einer Gewinn- und Verlustrechnung.
> 2. Formatieren Sie: Erhöhungen grün, Verminderungen rot, Gesamtwert blau.
> 3. Fügen Sie Datenbeschriftungen zu den Säulen hinzu.

## 7.3. Dashboard-Design

### Konzept: Alle KPIs auf einen Blick

Ein Dashboard vereint mehrere Diagramme, Sparklines und Kennzahlen auf einem
übersichtlichen Blatt. Die Gestaltungsprinzipien:

1. **Oben links = wichtigste Info**: Der Blick beginnt dort
2. **Maximal 46 Elemente**: Weniger ist mehr
3. **Konsistente Farben**: Gleiche Bedeutung = gleiche Farbe
4. **Slicer für Interaktivität**: Ein Klick filtert alle Diagramme

**Übung 7.3  Dashboard erstellen**

Die folgende Übungstabelle **Modul 7 3 Dashboard** ist bereits geladen.

> 1. Erstellen Sie auf einem neuen Blatt:
>    - Ein Liniendiagramm (Umsatzverlauf 12 Monate)
>    - Ein Säulendiagramm (Umsatz nach Region)
>    - Sparklines pro Produktkategorie
>    - Slicer für Region und Jahr
> 2. Ordnen Sie die Elemente übersichtlich an (Raster verwenden).
> 3. Blenden Sie Gitternetzlinien und Überschriften aus für ein
>    professionelles Erscheinungsbild.


## Modul 8: Automatisierung mit Makros

**Lernziel:** Makros aufzeichnen, ausführen und grundlegend in VBA bearbeiten.

## 8.1. Makros verstehen und aufzeichnen

### Konzept: Wiederkehrende Arbeit nur einmal tun

Ein Makro ist eine aufgezeichnete Abfolge von Arbeitsschritten, die Excel auf
Knopfdruck wiederholen kann. Makros werden in der Programmiersprache VBA
(Visual Basic for Applications) gespeichert.

**Absolute vs. relative Aufzeichnung:**
- **Absolute Aufzeichnung**: Makro arbeitet immer in denselben Zellen (z.B. A1)
- **Relative Aufzeichnung**: Makro arbeitet relativ zur aktuellen Position

**Wichtig:** Makros funktionieren nur in `.xlsm`-Dateien, nicht in `.xlsx`.
Aktivieren Sie zuerst die Registerkarte Entwicklertools.

**Übung 8.1  Entwicklertools aktivieren und Makro aufzeichnen**

Die folgende Übungstabelle **Modul 8 1 Makro_Aufzeichnen** ist bereits geladen.

> 1. Aktivieren Sie die Registerkarte Entwicklertools und speichern Sie als `.xlsm`.
> 2. Zeichnen Sie ein Makro auf, das einen Bericht formatiert: Überschrift fett
>    und zentriert, blaue Kopfzeile, Rahmen um den Datenbereich.
> 3. Führen Sie das Makro auf einem zweiten Tabellenblatt aus.

## 8.2. Makros ausführen und zuweisen

### Konzept: Makros per Knopfdruck starten

| Ausführungsmethode | Vorteil |
|-------------------|---------|
| Makro-Dialog (Ansicht  Makros) | Übersicht über alle Makros |
| Tastenkombination (bei Aufzeichnung festgelegt) | Schnellster Zugriff |
| Schaltfläche (Formularsteuerelement) | Intuitiv für andere Benutzer |
| Form (eingefügte Grafik) | Flexibles Design |

**Übung 8.2  Makro zuweisen**

Die folgende Übungstabelle **Modul 8 2 Makro_Zuweisen** ist bereits geladen.

> 1. Weisen Sie Ihr Makro einer Schaltfläche zu (Entwicklertools  Einfügen 
>    Schaltfläche).
> 2. Richten Sie eine Tastenkombination `Strg+Umschalt+F` für das Makro ein.
> 3. Testen Sie beide Ausführungsmethoden.

## 8.3. Der VBA-Editor

### Konzept: Den aufgezeichneten Code verstehen

Der VBA-Editor (`Alt+F11`) zeigt den generierten Code. Auch ohne
Programmierkenntnisse können Sie einfache Änderungen vornehmen.

| Bereich | Funktion |
|---------|----------|
| Projekt-Explorer | Alle geöffneten Arbeitsmappen und Module |
| Code-Fenster | Der VBA-Code |
| Eigenschaften-Fenster | Blatt- und Steuerelement-Eigenschaften |
| Direktbereich (`Strg+G`) | Code live testen |

**Übung 8.3  VBA-Editor erkunden**

Die folgende Übungstabelle **Modul 8 3 VBA_Editor** ist bereits geladen.

> 1. Öffnen Sie den VBA-Editor mit `Alt+F11`.
> 2. Finden Sie Ihr aufgezeichnetes Makro im Projekt-Explorer.
> 3. Ändern Sie eine Farbe im Code (z.B. `.Color = RGB(0, 0, 255)` für Blau).


## Modul 9: VBA-Programmierung (Grundlagen)

**Lernziel:** Grundlegende VBA-Konzepte verstehen, einfache Prozeduren schreiben
und Excel-Ereignisse nutzen.

## 9.1. Variablen und Datentypen

### Konzept: Werte speichern und verarbeiten

| Datentyp | Verwendung | Beispiel |
|----------|-----------|----------|
| Integer | Ganze Zahlen | `Dim anzahl As Integer` |
| Double | Kommazahlen | `Dim preis As Double` |
| String | Text | `Dim name As String` |
| Boolean | Wahr/Falsch | `Dim gefunden As Boolean` |
| Range | Zellbereich | `Dim zelle As Range` |

```vba
Dim umsatz As Double
umsatz = Range("B2").Value * Range("C2").Value
```

**Übung 9.1  Variablen und einfache Berechnung**

Die folgende Übungstabelle **Modul 9 1 VBA_Variablen** ist bereits geladen.

> 1. Schreiben Sie ein Makro, das zwei Werte aus Zellen liest und das Produkt
>    in eine dritte Zelle schreibt.
> 2. Erweitern Sie das Makro: Geben Sie das Ergebnis mit `MsgBox` aus.
> 3. Testen Sie mit verschiedenen Eingabewerten.

## 9.2. Kontrollstrukturen: Bedingungen und Schleifen

### Konzept: Code nur unter bestimmten Umständen ausführen

**If-Then-Else:**
```vba
If Range("B2").Value > 1000 Then
    Range("C2").Value = "Großauftrag"
Else
    Range("C2").Value = "Standard"
End If
```

**For-Schleife:**
```vba
For i = 1 To 10
    Range("A" & i).Value = i
Next i
```

**Übung 9.2  Bedingungen und Schleifen**

Die folgende Übungstabelle **Modul 9 2 VBA_Kontrollstrukturen** ist bereits geladen.

> 1. Schreiben Sie ein Makro mit einer For-Schleife, das die Zahlen 110 in A1A10
>    schreibt.
> 2. Erweitern Sie das Makro um eine If-Bedingung: Zahlen > 5 werden fett
>    formatiert.
> 3. Schreiben Sie eine For-Each-Schleife, die alle Zellen mit Wert > 1000
>    gelb markiert.

## 9.3. Excel-Ereignisse

### Konzept: Code, der automatisch reagiert

Ereignisse führen VBA-Code automatisch aus, wenn etwas Bestimmtes passiert.

| Ereignis | Wann ausgelöst |
|----------|---------------|
| `Worksheet_Change` | Wenn eine Zelle geändert wird |
| `Workbook_Open` | Wenn die Arbeitsmappe geöffnet wird |
| `Worksheet_SelectionChange` | Wenn eine andere Zelle ausgewählt wird |

```vba
Private Sub Worksheet_Change(ByVal Target As Range)
    If Target.Column = 2 And Target.Value > 10000 Then
        MsgBox "Hoher Betrag: " & Target.Value
    End If
End Sub
```

**Übung 9.3  Ereignisse programmieren**

Die folgende Übungstabelle **Modul 9 3 VBA_Ereignisse** ist bereits geladen.

> 1. Erstellen Sie ein Worksheet_Change-Ereignis, das eine Meldung ausgibt,
>    wenn in Spalte B ein Wert > 10.000 eingetragen wird.
> 2. Erstellen Sie ein Workbook_Open-Ereignis, das beim Öffnen das heutige
>    Datum in Zelle A1 schreibt.

## 9.4. Benutzerdefinierte Funktionen (UDF)

### Konzept: Eigene Excel-Funktionen in VBA schreiben

```vba
Function MwSt(Betrag As Double) As Double
    MwSt = Betrag * 0.19
End Function
```

Danach können Sie in Excel `=MwSt(100)` schreiben  Ergebnis: 19.

**Übung 9.4  UDF erstellen**

Die folgende Übungstabelle **Modul 9 4 VBA_UDF** ist bereits geladen.

> 1. Schreiben Sie eine UDF `Bonus(Umsatz)`, die 5% Bonus ab 10.000 ,
>    sonst 0% berechnet.
> 2. Verwenden Sie Ihre UDF in einer Formel: `=Bonus(B2)`.
> 3. Erstellen Sie eine UDF `Kategorie(Alter)` mit If/ElseIf für die
>    Altersgruppen <30, 3050, >50.


## 9.5. Best Practices für Makros

### Konzept: Code, der morgen noch verständlich ist

| Praxis | Beispiel |
|--------|----------|
| **Sprechende Namen** | `Sub MonatsberichtFormatieren()` statt `Sub Makro1()` |
| **Kommentare** | `' Berechnung der MwSt (19%)` vor wichtigen Zeilen |
| **Fehlerbehandlung** | `On Error GoTo Fehler` mit aussagekräftigen Meldungen |
| **Option Explicit** | Am Anfang jedes Moduls: Erzwingt Variablendeklaration |
| **Konsistente Einrückung** | `Tab` für jede Verschachtelungsebene |

**Tipp:** `Option Explicit` am Anfang des VBA-Moduls schützt vor Tippfehlern in
Variablennamen — die häufigste Fehlerquelle bei Makros.

## Modul 10: Zusammenarbeit, Vorlagen und Produktivität

**Lernziel:** Arbeitsmappen für die Zusammenarbeit optimieren, professionelle
Vorlagen erstellen und Produktivitätstechniken beherrschen.

## 10.1. Professionelle Vorlagen

### Konzept: Einmal erstellen, immer wiederverwenden

Eine Excel-Vorlage (`.xltx`) enthält Layout, Formeln und Formatierung 
aber keine spezifischen Daten. Beim Öffnen wird eine neue Arbeitsmappe
basierend auf der Vorlage erstellt.

**Vorlage erstellen:** Datei  Speichern unter  Dateityp: Excel-Vorlage (`.xltx`)

| Vorlagenelement | Beispiel |
|----------------|----------|
| Geschützte Formelzellen | MwSt-Berechnung gesperrt |
| Benannte Bereiche | `Umsatz_2026`, `Kosten_2026` |
| Dropdown-Listen | Abteilungen, Produktkategorien |
| Bedingte Formatierung | Budget-Überschreitung rot |

**Übung 10.1  Vorlage erstellen**

Die folgende Übungstabelle **Modul 10 1 Vorlagen** ist bereits geladen.

> 1. Erstellen Sie eine Rechnungsvorlage mit: kopfformatiertem Firmenlogo-Bereich,
>    automatischer Rechnungsnummer, MwSt-Berechnung und geschützten Formelzellen.
> 2. Speichern Sie als `.xltx`.
> 3. Öffnen Sie die Vorlage und prüfen Sie, ob eine neue Arbeitsmappe entsteht.

## 10.2. Zusammenarbeit und Freigabe

### Konzept: Gemeinsam an einer Datei arbeiten

| Funktion | Verwendung |
|----------|-----------|
| Kommentare | Rückfragen direkt in Zellen (Überprüfen  Neuer Kommentar) |
| Änderungen nachverfolgen | Wer hat was wann geändert? (nur ältere Excel-Versionen) |
| Arbeitsmappe freigeben | Gleichzeitige Bearbeitung (Excel 365: automatisch bei OneDrive/SharePoint) |
| Blattschutz mit Berechtigungen | Nur bestimmte Benutzer dürfen bestimmte Bereiche bearbeiten |

**Exportformate:**

| Format | Wann verwenden? |
|--------|----------------|
| `.xlsx` | Empfänger soll weiterarbeiten |
| `.pdf` | Endgültige Version, plattformunabhängig |
| `.xlsb` | Große Dateien (binär, schneller) |

**Übung 10.2  Für Zusammenarbeit vorbereiten**

Die folgende Übungstabelle **Modul 10 2 Zusammenarbeit** ist bereits geladen.

> 1. Fügen Sie einen Kommentar zu einer Zelle ein (Rechtsklick  Neuer Kommentar).
> 2. Exportieren Sie das Blatt als PDF mit Seitenumbrüchen.
> 3. Konfigurieren Sie den Blattschutz so, dass nur die Eingabezellen bearbeitbar
>    sind  für externe Mitarbeiter.

## 10.3. Add-Ins und Power Query (Ausblick)

### Konzept: Excel über die Grenzen hinaus erweitern

**Add-Ins** (Datei → Optionen → Add-Ins) erweitern Excel um Spezialfunktionen:
- **Solver**: Optimierung (wird in Modul 6 behandelt)
- **Analyse-Funktionen**: Erweiterte statistische Funktionen
- **Power Pivot**: Datenmodell für große Datenmengen

**Power Query** (Daten → Abrufen und Transformieren) ist das moderne ETL-Werkzeug
in Excel. Es importiert, bereinigt und transformiert Daten aus beliebigen Quellen:
- CSV, TXT, Excel-Dateien
- SQL-Datenbanken, Webseiten, APIs
- Ganze Ordner mit gleich strukturierten Dateien

Alle Transformationsschritte werden aufgezeichnet und sind wiederholbar —
ähnlich wie ein Makro, aber für Datenquellen.

**Tipp:** Power Query ist der Nachfolger des alten Textimport-Assistenten und
sollte für alle Datenimport-Aufgaben verwendet werden.

## 10.4. Erweiterte Tastenkombinationen

### Konzept: Tastatur statt Maus  professionelle Effizienz

| Kürzel | Aktion |
|--------|--------|
| `Strg+1` | Zellen formatieren (Universal-Dialog) |
| `Strg+F3` | Namens-Manager |
| `Alt+F11` | VBA-Editor |
| `Strg+Umschalt+L` | Autofilter an/aus |
| `Strg+Umschalt+Enter` | Matrixformel abschließen |
| `F4` | Letzte Aktion wiederholen / Bezugstyp wechseln |
| `Strg+[` | Vorgängerzellen anzeigen |
| `Strg+]` | Nachfolgerzellen anzeigen |
| `Alt+=` | AutoSumme |
| `F9` | Alle Formeln neu berechnen (bei manueller Berechnung) |

**Übung 10.4  Tastenkombinationen üben**

Die folgende Übungstabelle **Modul 10 4 Tastenkombinationen** ist bereits geladen.

> 1. Verwenden Sie ausschließlich Tastenkombinationen, um eine Tabelle zu
>    formatieren, eine Summe zu bilden und einen Filter zu setzen.
> 2. Nutzen Sie `Strg+[` und `Strg+]` zur Formelanalyse.
> 3. Wechseln Sie mit F4 zwischen Bezugstypen beim Bearbeiten einer Formel.

---

*Lehrplan erstellt nach den Grundsätzen der Andragogik (Knowles, 1980) und dem
europäischen Rahmen für digitale Kompetenzen DigComp 2.2 (Vuorikari et al., 2022).*
