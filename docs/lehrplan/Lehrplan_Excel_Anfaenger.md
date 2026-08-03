---
pdftitle: "Lehrplan: Excel für Anfänger"
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
{\Huge\bfseries\sffamily\color{excelblue}Lehrplan\par}
\vspace{0.3em}
{\Large\sffamily Excel für Anfänger\par}
\vspace{1.5em}
{\large\sffamily Vollständiger Lehrplan mit Theorie und praktischen Übungen\par}
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
\textbf{Niveau:} Anfänger (keine Vorkenntnisse erforderlich)\par
}
\end{center}
\vfill

\tableofcontents

## Einleitung

Dieser Lehrplan bietet eine vollständige Einführung in Microsoft Excel für Erwachsene
ohne Vorkenntnisse. Er kombiniert verständliche Theorie mit praktischen Übungen und
wurde speziell für den Einzel-Präsenzunterricht konzipiert.

## Für wen ist dieser Lehrplan?

Dieser Lehrplan richtet sich an **Erwachsene ohne Vorkenntnisse** in Excel.

## Wie ist der Lehrplan aufgebaut?

1. **Lernziel** — Was Sie nach diesem Modul können werden
2. **Theorie** — Verständliche Erklärungen für Anfänger
3. **Übungen** — Praktische Aufgaben mit Excel-Dateien

## Was Sie vorher wissen sollten

- Grundlegende Bedienung eines Computers
- Keine Excel-Vorkenntnisse erforderlich
- Microsoft Excel 2019 oder Microsoft 365 installiert


## Modul 1: Einführung in Excel und die Arbeitsumgebung

**Lernziel:** Vertrautwerden mit der Excel-Oberfläche, den Grundkonzepten und der Dateiverwaltung.

## 1.1. Was ist Excel und wozu dient es?

### Konzept: Die Tabellenkalkulation

Excel ist eine **Tabellenkalkulation**. Jedes Kästchen heißt **Zelle** und hat eine Adresse wie A1, B5 oder Z100.

| Begriff | Bedeutung | Beispiel |
|---------|-----------|----------|
| **Arbeitsmappe** | Die gesamte Excel-Datei | `Budget_2026.xlsx` |
| **Tabellenblatt** | Eine Seite innerhalb der Arbeitsmappe | `Januar` |
| **Zeile** | Horizontale Reihe (1, 2, 3...) | Zeile 5 |
| **Spalte** | Vertikale Reihe (A, B, C...) | Spalte D |
| **Zelle** | Schnittpunkt Zeile + Spalte | B5 |

### Wo wird Excel eingesetzt?

- **Buchhaltung:** Rechnungen, Budgets
- **Projektmanagement:** Zeitpläne, Ressourcen
- **Vertrieb:** Kundenlisten, Analysen
- **Privat:** Haushaltsbudget, Planung

**Übung 1.1 — Erste Schritte**

Öffnen Sie Excel, erstellen Sie eine neue Arbeitsmappe. Identifizieren Sie Registerkarten,
Namensfeld, Bearbeitungsleiste und Statusleiste. Speichern Sie als `Meine_Erste_Mappe.xlsx`.

## 1.2. Die Benutzeroberfläche

### Konzept: Das Menüband (Ribbon)

| Registerkarte | Funktionen |
|--------------|-----------|
| **Start** | Schriftart, Ausrichtung, Zahlenformat |
| **Einfügen** | Tabellen, Diagramme |
| **Seitenlayout** | Druckbereiche, Ränder |
| **Formeln** | Funktionsbibliothek |
| **Daten** | Sortieren, Filtern |

**Tipp:** Passen Sie die Schnellzugriff-Leiste mit häufig genutzten Befehlen an.

**Übung 1.2 — Die Oberfläche erkunden**

Fügen Sie „Neu", „Öffnen" und „Schnelldruck" zur Schnellzugriff-Leiste hinzu.

## 1.3. Grundlegende Navigation

### Konzept: Bewegung in der Tabelle

| Taste | Wirkung |
|-------|---------|
| Pfeiltasten | Eine Zelle weiter |
| Strg+Pfeil | Zum Rand springen |
| Strg+Pos1 | Zur Zelle A1 |
| Strg+Ende | Zur letzten Zelle |

**Tipp:** `Strg+Leertaste` = ganze Spalte, `Umschalt+Leertaste` = ganze Zeile.

**Übung 1.3 — Navigation üben**

Erstellen Sie drei Blätter: Januar, Februar, März. Üben Sie Strg+Pos1, Strg+Ende.

## 1.4. Dateiverwaltung

### Konzept: Dateiformate

| Format | Endung | Verwendung |
|--------|--------|------------|
| Standard | `.xlsx` | Seit Excel 2007 |
| Mit Makros | `.xlsm` | Für VBA |
| PDF | `.pdf` | Weitergabe |
| CSV | `.csv` | Datenaustausch |

**Wichtig:** In allen Tastenkombinationen dieses Lehrplans steht `Umschalt` für die Umschalt-Taste (Shift), die auf manchen Tastaturen auch als `Shift` beschriftet ist.

**Wichtig:** Regelmäßig speichern mit `Strg+S`!

**Übung 1.4 — Dateien verwalten**

Speichern Sie als `Inventar_2026.xlsx`, exportieren Sie als PDF.



## Modul 2: Dateneingabe und -bearbeitung

**Lernziel:** Daten verschiedener Typen effizient eingeben, bearbeiten und mit AutoAusfüllen organisieren.

## 2.1. Datentypen in Excel

###  Konzept: Warum Excel Datentypen unterscheidet

Excel ist kein einfaches Textprogramm — es erkennt automatisch, ob Sie einen Text, eine Zahl
oder ein Datum eingeben. Diese Unterscheidung ist grundlegend, denn sie bestimmt, **was Excel
mit den Daten machen kann**: Mit Zahlen kann es rechnen, mit Datumsangaben kann es Zeiträume
berechnen, und Text dient als Beschriftung. Die automatische Ausrichtung verrät Ihnen sofort,
wie Excel Ihre Eingabe interpretiert hat: Text steht linksbündig, Zahlen und Datumsangaben
stehen rechtsbündig.

| Datentyp | Ausrichtung | Beispiel | Was Excel damit machen kann |
|----------|-------------|---------|----------------------------|
| **Text** (Label) | Linksbündig | `Müller`, `Berlin`, `Produkt A` | Sortieren, Filtern, Suchen |
| **Zahl** (Wert) | Rechtsbündig | `42`, `19,99`, `-150` | Rechnen, Summieren, Durchschnitt |
| **Datum** | Rechtsbündig | `15.03.2026` | Tage berechnen, Alter ermitteln |
| **Uhrzeit** | Rechtsbündig | `14:30`, `09:15:00` | Zeitdifferenzen, Stundenabrechnung |
| **Prozent** | Rechtsbündig | `19%`, `0,05` | Prozentuale Berechnungen |
| **Währung** | Rechtsbündig | `29,99 €`, `45,00 €` | Finanzielle Berechnungen |

 **Tipp:** Wenn Excel ein Datum nicht erkennt (z.B. `2026.03.15`), versuchen Sie das
Format `TT.MM.JJJJ`. Excel orientiert sich an den Ländereinstellungen Ihres Systems.

**Übung 2.1 — Datentypen erkennen**

Die folgende Übungstabelle **Modul 2 1 Datentypen** ist bereits geladen. Geben Sie in verschiedene Zellen ein:

- Ihren Namen (Text)

- Die Zahl 1500 (Zahl)

- Das heutige Datum

- Einen Geldbetrag wie `49,99 €`

Beobachten Sie die automatische Ausrichtung. Ändern Sie dann das Zahlenformat
einer Zelle über `Start → Zahl → Format auswählen`.

## 2.2. Zellen bearbeiten

###  Konzept: Inhalte ändern ohne neu tippen

Stellen Sie sich vor, Sie haben eine lange Liste geschrieben und bemerken einen Tippfehler in
Zelle D47. Müssen Sie alles neu schreiben? Nein! Excel bietet mehrere Wege, Zellinhalte zu
bearbeiten: Doppelklick auf die Zelle, die Taste `F2`, oder direkt in der Bearbeitungsleiste
über dem Gitternetz. Die Befehle Rückgängig (`Strg+Z`) und Wiederherstellen (`Strg+Y`) sind
Ihre Sicherheitsnetze — Sie können bis zu 100 Schritte zurückgehen.

**Die drei Bearbeitungsmethoden im Vergleich:**

| Methode | Tastenkürzel | Am besten für |
|---------|-------------|---------------|
| Doppelklick in die Zelle | — | Schnelle Korrektur direkt im Blatt |
| Taste `F2` | F2 | Bearbeitung ohne Maus |
| Bearbeitungsleiste | — | Lange Formeln oder Texte überschauen |

 **Wichtig:** Wenn Sie eine Zelle auswählen und einfach losschreiben, wird der gesamte
Inhalt ersetzt — nicht ergänzt! Zum Ändern immer zuerst `F2` drücken oder doppelklicken.

**Übung 2.2 — Zellen bearbeiten**

Die folgende Übungstabelle **Modul 2 2 Bearbeiten** ist bereits geladen. Die Tabelle enthält absichtlich
Rechtschreibfehler. Korrigieren Sie jede fehlerhafte Zelle auf drei Arten:

1. Mit Doppelklick in die Zelle
2. Mit der Taste `F2`
3. Über die Bearbeitungsleiste

Machen Sie eine Korrektur mit `Strg+Z` rückgängig, dann mit `Strg+Y` wiederherstellen.

## 2.3. AutoAusfüllen und Reihen

###  Konzept: Muster erkennen und automatisch fortsetzen

Das **Ausfüllkästchen** (das kleine Quadrat rechts unten in einer markierten Zelle) ist eines
der mächtigsten Werkzeuge in Excel. Wenn Sie daran ziehen, erkennt Excel Muster und setzt sie
automatisch fort. Schreiben Sie `Montag` in eine Zelle, ziehen Sie am Ausfüllkästchen — und
Excel füllt `Dienstag`, `Mittwoch`, `Donnerstag`... aus. Das Gleiche funktioniert mit Monaten,
Quartalen, Zahlenreihen und sogar benutzerdefinierten Mustern wie `Kunde 1`, `Kunde 2`...

Excel erkennt folgende eingebaute Reihen:
- Wochentage (Montag, Dienstag...)
- Monate (Januar, Februar...)
- Quartale (Q1, Q2...)
- Zahlenfolgen (1, 2, 3... oder 2, 4, 6...)

 **Tipp:** Wenn Sie zwei Werte markieren (z.B. `1` und `3`) und dann ziehen, erkennt
Excel das Schrittmuster und setzt es fort: 1, 3, 5, 7, 9... Das funktioniert auch mit
Datumsangaben!

**Übung 2.3 — AutoAusfüllen verwenden**

Die folgende Übungstabelle **Modul 2 3 AutoAusfuellen** ist bereits geladen.

1. Schreiben Sie `Januar` in Zelle A1 und ziehen Sie am Ausfüllkästchen bis A12.
2. Schreiben Sie `1` in B1, `3` in B2, markieren Sie beide und ziehen Sie bis B10.
3. Schreiben Sie das heutige Datum in C1 und erstellen Sie eine fortlaufende

   Datumsreihe für 30 Tage.

## 2.4. Kopieren, Ausschneiden und Einfügen

###  Konzept: Die Inhalte-einfügen-Optionen

Jeder kennt `Strg+C` und `Strg+V` — aber Excel kann viel mehr als nur einfaches Kopieren.
Mit **Inhalte einfügen** (erreichbar über Rechtsklick oder `Strg+Alt+V`) können Sie gezielt
nur bestimmte Aspekte einer Zelle übertragen: nur die Werte ohne Formeln, nur die Formatierung,
oder sogar die Tabelle transponieren (Zeilen und Spalten vertauschen).

**Die wichtigsten Einfügeoptionen:**

| Option | Tastenkürzel (nach Strg+Alt+V) | Wirkung |
|--------|-------------------------------|---------|
| Alles | — | Standard: Formeln + Formatierung |
| Werte | `W` | Nur das sichtbare Ergebnis, keine Formel |
| Formeln | `F` | Nur die Formel, ohne Formatierung |
| Formatierung | `R` | Nur das Aussehen, nicht den Inhalt |
| Transponieren | (Haken setzen) | Zeilen  Spalten vertauschen |

 **Tipp:** Wenn Sie Formelergebnisse kopieren möchten, ohne dass sich die Bezüge
verschieben, nutzen Sie „Inhalte einfügen → Werte". Das ist besonders nützlich, wenn
Sie Berechnungen in eine andere Tabelle übertragen.

**Übung 2.4 — Kopieren und Einfügen**

Die folgende Übungstabelle **Modul 2 4 Kopieren** ist bereits geladen.

1. Kopieren Sie die Tabelle `A1:D10` und fügen Sie sie ab `F1` ein.
2. Kopieren Sie dieselbe Tabelle und fügen Sie sie mit „Transponieren" ab `F15` ein.
3. Kopieren Sie eine Zelle mit Formel und fügen Sie mit „Werte" ein — beobachten

   Sie den Unterschied.



## Modul 3: Format und Zellstil

**Lernziel:** Tabellen professionell formatieren, Zahlen korrekt darstellen und bedingte
Formatierung einsetzen.

## 3.1. Grundlegende Formatierung

###  Konzept: Warum Formatierung über Ästhetik hinausgeht

Eine gut formatierte Tabelle ist nicht nur schöner — sie ist **verständlicher**. Studien zeigen,
dass formatierte Daten schneller erfasst und korrekter interpretiert werden. Die drei
Grundprinzipien professioneller Formatierung sind:

1. **Kontrast**: Überschriften heben sich deutlich von Daten ab (fett, größer, farbig)
2. **Ausrichtung**: Gleichartige Daten stehen einheitlich (Zahlen rechts, Text links)
3. **Zurückhaltung**: Weniger ist mehr — maximal 2-3 Farben, keine grellen Kombinationen

**Die Formatierungswerkzeuge in der Gruppe „Schriftart" und „Ausrichtung":**

| Werkzeug | Tastenkürzel | Wirkung |
|----------|-------------|---------|
| Fett | `Strg+Umschalt+F` (Schriftart-Dialog) | Text hervorheben (Überschriften) |
| Kursiv | `Strg+Umschalt+K` (Schriftart-Dialog) | Hervorhebung im Fließtext |
| Unterstrichen | `Strg+Umschalt+U` (Schriftart-Dialog) | Besonders wichtige Werte |
| Rahmen | — | Zellen visuell voneinander trennen |
| Füllfarbe | — | Hintergrundfarbe für Zellen |
| Schriftfarbe | — | Textfarbe ändern |
| Verbinden und zentrieren | — | Mehrere Zellen zu einer kombinieren |
| Zeilenumbruch | — | Langer Text in einer Zelle umbrechen |

 **Tipp:** Das Dialogfeld „Zellen formatieren" (`Strg+1`) ist die Kommandozentrale
für alle Formatierungsoptionen. Hier finden Sie alles an einem Ort — von Rahmen über
Ausrichtung bis zu Schriftart.

**Übung 3.1 — Grundformatierung anwenden**

Die folgende Übungstabelle **Modul 3 1 Grundformatierung** ist bereits geladen. Formatieren Sie die Tabelle so:

1. Überschriftenzeile: fett, dunkelblauer Hintergrund, weiße Schrift
2. Datenzellen: dünne graue Rahmen, wechselnde Zeilenfarbe (weiß/hellgrau)
3. Titel: über die gesamte Tabellenbreite verbinden und zentrieren
4. Lange Textzellen: Zeilenumbruch aktivieren

## 3.2. Zahlenformate

###  Konzept: Die Bedeutung der korrekten Zahlenformatierung

Die Zahl `0,25` kann vieles bedeuten: 25 Cent, 25%, oder einfach eine kleine Zahl. Das
**Zahlenformat** legt fest, wie Excel den Wert *darstellt*, ohne den tatsächlichen Wert
in der Zelle zu ändern. Das ist ein wichtiger Unterschied: Die Anzeige ist nur die
Präsentation, der gespeicherte Wert bleibt für Berechnungen erhalten.

**Die wichtigsten Zahlenformate:**

| Format | Beispiel (eingegeben) | Beispiel (angezeigt) | Verwendung |
|--------|----------------------|---------------------|------------|
| Standard | `1500,5` | `1500,5` | Keine spezielle Formatierung |
| Zahl | `1500,5` | `1.500,50` | Tausendertrennzeichen, Dezimalstellen |
| Währung | `1500,5` | `1.500,50 €` | Finanzielle Beträge |
| Prozent | `0,19` | `19%` | Anteile, Steuersätze |
| Datum | `45300` | `15.03.2026` | Kalenderdaten |
| Benutzerdefiniert | — | `KG 42` | Eigene Formate wie `"KG "0` |

 **Wichtig:** Prozentwerte sind in Excel Dezimalzahlen: `19%` wird als `0,19`
gespeichert. Wenn Sie `19` eingeben und dann % formatieren, zeigt Excel `1900%` an!

**Übung 3.2 — Zahlen formatieren**

Die folgende Übungstabelle **Modul 3 2 Zahlenformat** ist bereits geladen.

1. Formatieren Sie Spalte B als „Währung" mit €-Symbol und 2 Dezimalstellen.
2. Formatieren Sie Spalte C als „Prozent" mit 1 Dezimalstelle.
3. Formatieren Sie Spalte D als „Zahl" mit Tausendertrennzeichen.
4. Experimentieren Sie mit der Schaltfläche „Dezimalstelle hinzufügen/entfernen".

## 3.3. Zeilen und Spalten anpassen

###  Konzept: Struktur in die Tabelle bringen

Standardmäßig sind alle Spalten gleich breit (ca. 64 Pixel) und alle Zeilen gleich hoch.
Das passt selten zu Ihren Daten: Ein Nachname braucht mehr Platz als eine Altersangabe,
und eine Adresse mehr als eine Postleitzahl. Sie können Spaltenbreite und Zeilenhöhe
manuell per Drag & Drop oder automatisch per Doppelklick anpassen.

**Methoden zum Anpassen:**

| Aktion | Wie | Wann verwenden |
|--------|-----|----------------|
| Automatisch anpassen | Doppelklick auf Spaltenrand | Spalte soll genau zum längsten Inhalt passen |
| Manuell ziehen | Spaltenrand per Drag | Bestimmte Breite vorgeben |
| Mehrere gleichzeitig | Spalten markieren, dann Rand ziehen | Einheitliche Breite für mehrere Spalten |
| Zeilen/Spalten ausblenden | Rechtsklick → Ausblenden | Temporär nicht benötigte Daten verstecken |
| Einfügen/Löschen | Rechtsklick → Zellen einfügen/löschen | Nachträglich Platz schaffen |

 **Tipp:** Mit `Strg+Leertaste` markieren Sie die gesamte Spalte, mit
`Umschalt+Leertaste` die gesamte Zeile. Dann können Sie mit Rechtsklick schnell
einfügen, löschen oder ausblenden.

**Übung 3.3 — Layout anpassen**

Die folgende Übungstabelle **Modul 3 3 Layout** ist bereits geladen.

1. Passen Sie alle Spalten mit Doppelklick automatisch an den Inhalt an.
2. Blenden Sie Spalte C („Interne Notiz") aus und wieder ein.
3. Fügen Sie zwischen Zeile 3 und 4 eine neue leere Zeile ein.
4. Ändern Sie die Höhe von Zeile 1 (Titelzeile) manuell auf 30.

## 3.4. Bedingte Formatierung

###  Konzept: Werte automatisch hervorheben

Die bedingte Formatierung ist wie ein automatischer Textmarker: Sie definieren Regeln
(z.B. „alle Werte über 1000"), und Excel formatiert die entsprechenden Zellen automatisch.
Das Besondere: Wenn sich die Werte ändern, passt sich die Formatierung sofort an — ohne
dass Sie erneut formatieren müssen.

**Die wichtigsten Arten der bedingten Formatierung:**

| Art | Beispiel | Einsatz |
|-----|---------|---------|
| Regeln zum Hervorheben | „Größer als 1000" → rot | Ausreißer identifizieren |
| Oben/unten-Regeln | „Obere 10%" → grün | Beste/schlechteste Werte |
| Datenbalken | Farbiger Balken innerhalb der Zelle | Größenverhältnisse visualisieren |
| Farbskalen | Verlauf von rot über gelb zu grün | Temperaturdiagramm-Effekt |
| Symbolsätze | Ampeln, Pfeile, Häkchen | Status sofort erkennen |

 **Tipp:** Beginnen Sie mit einer einfachen Regel wie „Größer als" und erkunden Sie
dann die Datenbalken. Diese Mini-Balkendiagramme in den Zellen sind eine der
eindrucksvollsten Funktionen für Anfänger!

**Übung 3.4 — Bedingte Formatierung anwenden**

Die folgende Übungstabelle **Modul 3 4 Bedingte Formatierung** ist bereits geladen.

1. Markieren Sie die Umsatzzahlen und wenden Sie „Datenbalken" an (Start → Bedingte

   Formatierung → Datenbalken).
2. Heben Sie alle Werte über 10.000 € mit roter Füllung hervor.
3. Wenden Sie eine Farbskala (grün-weiß-rot) auf die Rabattspalte an.
4. Ändern Sie einen Wert auf 15.000 € und beobachten Sie die automatische Anpassung.



## Modul 4: Formeln und Grundfunktionen

**Lernziel:** Berechnungen mit Formeln durchführen, Zellbezüge verstehen und grundlegende
Funktionen wie SUMME und WENN einsetzen.

## 4.1. Grundlagen der Formeln

###  Konzept: Eine Formel ist wie ein Kochrezept

Eine Excel-Formel ist eine Anweisung, die Excel sagt: „Nimm diese Zutaten (Zellwerte),
führe diese Operationen aus und zeige mir das Ergebnis." Jede Formel beginnt mit einem
Gleichheitszeichen `=` — das ist das Signal an Excel: „Jetzt kommt eine Berechnung!"

Die mathematischen Operatoren folgen der aus der Schule bekannten Regel
**„Punkt vor Strich"**:

| Operator | Bedeutung | Beispiel | Ergebnis |
|----------|-----------|----------|----------|
| `+` | Addition | `=5+3` | `8` |
| `-` | Subtraktion | `=10-4` | `6` |
| `*` | Multiplikation | `=6*7` | `42` |
| `/` | Division | `=100/4` | `25` |
| `^` | Potenz | `=2^10` | `1024` |
| `()` | Klammern | `=(2+3)*4` | `20` (nicht 14!) |

 **Wichtig:** Ohne Klammern gilt Punkt vor Strich: `=2+3*4` ergibt `14`, denn
`3*4=12` wird zuerst berechnet. Mit Klammern: `=(2+3)*4` ergibt `20`.

**Übung 4.1 — Erste Formeln schreiben**

Die folgende Übungstabelle **Modul 4 1 Erste Formeln** ist bereits geladen.

1. Berechnen Sie in Zelle D2 die Summe von B2 und C2 mit `=B2+C2`.
2. Berechnen Sie in D3 das Produkt: `=B3*C3`.
3. In D4: `=(B4+C4)/2` für den Durchschnitt.
4. In D5: `=B5^2` für das Quadrat.
5. Testen Sie den Unterschied zwischen `=10+5*2` und `=(10+5)*2`.


**Häufige Formelfehler und ihre Bedeutung:**

| Fehler | Bedeutung | Typische Ursache |
|--------|-----------|-----------------|
| `#DIV/0!` | Division durch Null | Formel teilt durch eine leere Zelle oder 0 |
| `#WERT!` | Falscher Wertetyp | Text statt Zahl in einer Berechnung |
| `#BEZUG!` | Ungültiger Bezug | Formel verweist auf gelöschte Zelle |
| `#NAME?` | Name nicht erkannt | Tippfehler im Funktionsnamen (z.B. `SUME` statt `SUMME`) |
| `#NV` | Nicht verfügbar | SVERWEIS findet den Suchbegriff nicht |
| `#NULL!` | Falscher Bereichsoperator | Leerzeichen statt Doppelpunkt im Bereich |

**Tipp:** Wenn ein Fehler auftritt, klicken Sie auf das kleine
Ausrufezeichen-Symbol neben der Zelle. Excel schlägt mögliche Korrekturen vor.

## 4.2. Zellbezüge: Relativ, Absolut und Gemischt

###  Konzept: Der Unterschied zwischen A1, $A$1 und $A1

Wenn Sie eine Formel kopieren, passt Excel die Bezüge automatisch an. Aus `=A1+B1` in
Zeile 1 wird beim Kopieren nach unten `=A2+B2` in Zeile 2. Das nennt man **relative
Bezüge** — sie sind standardmäßig aktiv und in den meisten Fällen genau das, was Sie
wollen.

Manchmal soll ein Bezug aber *fest* bleiben — zum Beispiel ein Mehrwertsteuersatz in
Zelle `B1`, der für alle Berechnungen gleich ist. Dafür setzen Sie Dollarzeichen:
`$B$1` bleibt immer `$B$1`, egal wohin Sie die Formel kopieren. Das ist ein
**absoluter Bezug**.

| Bezugstyp | Schreibweise | Beim Kopieren | Merkhilfe |
|-----------|-------------|---------------|-----------|
| Relativ | `A1` | Passt sich an | Kein $ = flexibel |
| Absolut | `$A$1` | Bleibt fixiert | $ wie „festgeschraubt" |
| Gemischt (Spalte fix) | `$A1` | Spalte A bleibt, Zeile verschiebt | $ vor dem Buchstaben |
| Gemischt (Zeile fix) | `A$1` | Zeile 1 bleibt, Spalte verschiebt | $ vor der Zahl |

 **Tipp:** Die Taste `F4` schaltet beim Bearbeiten einer Formel zwischen den vier
Bezugstypen durch: `A1` → `$A$1` → `A$1` → `$A1` → `A1`. Ein unverzichtbarer Shortcut!

**Übung 4.2 — Zellbezüge verstehen**

Die folgende Übungstabelle **Modul 4 2 Zellbezuege** ist bereits geladen.

1. Berechnen Sie in C2 den Bruttopreis mit `=B2*(1+$F$1)`, wobei F1 den MwSt-Satz

   (19%) enthält. Kopieren Sie die Formel nach unten. Der Bezug auf F1 muss absolut sein!
2. Erstellen Sie eine kleine Einmaleins-Tabelle (1×1 bis 10×10) mit gemischten Bezügen.
3. Testen Sie mit F4, wie sich der Bezugstyp ändert.

## 4.3. Namen definieren und verwenden

### Konzept: Zellen beim Namen nennen statt bei der Adresse

Statt `=B2*$F$1` (MwSt-Satz in F1) können Sie der Zelle F1 einen Namen wie
`MwSt` geben und schreiben: `=B2*MwSt`. Das macht Formeln sofort verständlich —
auch Wochen später wissen Sie noch, was berechnet wird.

**Einen Namen definieren:**
1. Markieren Sie die Zelle oder den Bereich
2. Klicken Sie in das **Namensfeld** (links neben der Bearbeitungsleiste)
3. Geben Sie den Namen ein (z.B. `MwSt`, `Preisliste`, `Daten`)
4. Drücken Sie Enter

**Regeln für Namen:**
- Keine Leerzeichen (verwenden Sie `_` oder Großbuchstaben: `MwSt_Satz`)
- Muss mit Buchstaben oder Unterstrich beginnen
- Keine Zelladressen als Namen (z.B. nicht `A1`)
- Groß-/Kleinschreibung wird ignoriert

**Den Namens-Manager** finden Sie unter `Formeln → Namens-Manager`.
Dort können Sie alle definierten Namen sehen, bearbeiten und löschen.

**Tipp:** Namen gelten für die gesamte Arbeitsmappe, nicht nur für ein
Tabellenblatt. Wenn Sie `=SUMME(Umsatz)` schreiben, müssen Sie nicht wissen,
in welchem Blatt die Umsatzdaten stehen.

**Übung 4.3 — Namen definieren**

Die folgende Übungstabelle **Modul 4 3 Namen** ist bereits geladen.

1. Definieren Sie für die Zelle mit dem MwSt-Satz den Namen `MwSt`.
2. Ersetzen Sie in der Bruttopreis-Formel `$F$1` durch `MwSt`.
3. Definieren Sie für die gesamte Preistabelle den Namen `Preisliste`.
4. Verwenden Sie den Namen in einer Formel: `=SVERWEIS(A2;Preisliste;2;0)`.

## 4.4. Statistische Grundfunktionen

###  Konzept: Vordefinierte Berechnungsbausteine

Funktionen sind fertige Formeln, die Excel mitbringt. Statt `=A1+A2+A3+...+A100` zu
schreiben, nutzen Sie einfach `=SUMME(A1:A100)`. Jede Funktion hat einen Namen, gefolgt
von Klammern mit den Argumenten. Die fünf wichtigsten statistischen Funktionen decken
90% aller Anfängerbedürfnisse ab:

| Funktion | Englisch | Was sie macht | Beispiel |
|----------|----------|---------------|----------|
| `SUMME()` | `SUM()` | Alle Werte addieren | `=SUMME(B2:B50)` |
| `MITTELWERT()` | `AVERAGE()` | Durchschnitt berechnen | `=MITTELWERT(C2:C50)` |
| `MIN()` | `MIN()` | Kleinsten Wert finden | `=MIN(D2:D50)` |
| `MAX()` | `MAX()` | Größten Wert finden | `=MAX(D2:D50)` |
| `ANZAHL()` | `COUNT()` | Wie viele Zahlen? | `=ANZAHL(E2:E50)` |
| `ANZAHL2()` | `COUNTA()` | Wie viele nicht-leere Zellen? | `=ANZAHL2(A2:A50)` |

 **Tipp:** Die AutoSumme-Schaltfläche (`Alt+=`) auf der Registerkarte „Start" fügt
automatisch `=SUMME()` für den markierten Bereich ein. Sie erkennt sogar Ihre Datenbereiche!

**Übung 4.4 — Statistische Funktionen anwenden**

Die folgende Übungstabelle **Modul 4 4 Statistik** ist bereits geladen.

1. Berechnen Sie mit `SUMME` die Gesamtsumme der Verkäufe.
2. Ermitteln Sie den `MITTELWERT`, die kleinste (`MIN`) und größte (`MAX`) Bestellung.
3. Zählen Sie mit `ANZAHL` die Anzahl der Verkaufseinträge.
4. Zählen Sie mit `ANZAHL2` alle nicht-leeren Zellen in Spalte A (Kundennamen).
5. Testen Sie die AutoSumme-Schaltfläche: Klicken Sie unter eine Zahlenspalte und

   dann auf Summe.

## 4.5. Die WENN-Funktion

###  Konzept: Entscheidungen automatisieren

Die WENN-Funktion ist die grundlegendste aller logischen Funktionen. Sie erlaubt Excel,
Entscheidungen zu treffen: „WENN diese Bedingung wahr ist, DANN tue dies, SONST tue das."
Das ist wie eine computergestützte Wenn-Dann-Regel und die Basis für jede intelligente
Automatisierung.

**Syntax:** `=WENN(Bedingung; Dann_Wert; Sonst_Wert)`

| Vergleichsoperator | Bedeutung | Beispiel |
|-------------------|-----------|----------|
| `>` | Größer als | `A1>100` |
| `<` | Kleiner als | `B2<0` |
| `>=` | Größer oder gleich | `C3>=50` |
| `<=` | Kleiner oder gleich | `D4<=18` |
| `=` | Gleich | `E5="Ja"` |
| `<>` | Ungleich | `F6<>0` |

 **Tipp:** In einer WENN-Funktion kann der „Sonst"-Teil selbst wieder eine
WENN-Funktion sein — das nennt man „verschachtelte WENN". Ab Excel 2019 gibt es
dafür die einfachere `WENNS()`-Funktion.

**Übung 4.5 — Die WENN-Funktion einsetzen**

Die folgende Übungstabelle **Modul 4 5 WENN** ist bereits geladen.

1. Schreiben Sie in D2: `=WENN(C2>1000; "Großauftrag"; "Standard")` und kopieren

   Sie die Formel nach unten.
2. In E2: `=WENN(C2>5000; C2*0,1; 0)` für 10% Bonus ab 5.000 €.
3. In F2: `=WENN(UND(B2="Nord"; C2>2000); "Priorität"; "")` — kombinieren Sie

   WENN mit UND für zwei Bedingungen.



## Modul 5: Datenbereinigung und Validierung

**Lernziel:** Datenqualität durch Validierung sichern und importierte Daten professionell
bereinigen.

## 5.1. Datenvalidierung

###  Konzept: Das GIGO-Prinzip — Garbage In, Garbage Out

In der Datenverarbeitung gilt ein eisernes Gesetz: **Schlechte Eingabe führt zu schlechten
Ergebnissen**, egal wie perfekt Ihre Formeln sind. Wenn jemand `abcd` in ein Zahlenfeld
schreibt oder `999` statt `9,99` als Preis, werden alle darauf aufbauenden Berechnungen
falsch. Die **Datenvalidierung** ist Ihr Schutzschild: Sie legt schon vor der Eingabe fest,
welche Werte erlaubt sind — und blockiert alles andere.

**Die wichtigsten Validierungsarten:**

| Validierungstyp | Beispiel | Verhindert |
|----------------|---------|------------|
| Dropdown-Liste | `=Kategorien!A1:A10` | Freie Texteingabe, nur Auswahl |
| Ganze Zahl | zwischen 1 und 100 | Kommazahlen, Text, zu große Werte |
| Dezimalzahl | zwischen 0 und 1 | Negative Werte, Werte > 1 |
| Datum | zwischen 01.01.2026 und 31.12.2026 | Ungültige Datumsangaben |
| Textlänge | maximal 50 Zeichen | Zu lange Eingaben |
| Benutzerdefiniert | `=UND(A1>0; A1<1000)` | Alles außerhalb der Formel-Logik |

 **Tipp:** Nutzen Sie die „Eingabemeldung" und „Fehlermeldung" in den
Validierungseinstellungen. Die Eingabemeldung erscheint als freundlicher Hinweis beim
Anklicken der Zelle, die Fehlermeldung als Stoppschild bei falscher Eingabe.

**Übung 5.1 — Datenvalidierung einrichten**

Die folgende Übungstabelle **Modul 5 1 Validierung** ist bereits geladen.

1. Erstellen Sie eine Dropdown-Liste in Spalte B („Abteilung") mit den Optionen:

   „Vertrieb", „Marketing", „IT", „Personal", „Finanzen".
2. Begrenzen Sie Spalte C („Gehalt") auf ganze Zahlen zwischen 30.000 und 120.000.
3. Fügen Sie eine Eingabemeldung hinzu: „Bitte wählen Sie eine Abteilung aus."
4. Fügen Sie eine Fehlermeldung bei ungültigem Gehalt hinzu.

## 5.2. Werkzeuge zur Datenbereinigung

###  Konzept: Aufräumen wie nach einer Party

Daten kommen selten perfekt an — besonders wenn sie aus anderen Systemen stammen. Namen
stehen mal in Groß-, mal in Kleinbuchstaben, Datumsangaben folgen unterschiedlichen
Formaten, und Duplikate verfälschen jede Statistik. Excel bietet drei mächtige Werkzeuge,
um solches Datenchaos zu bändigen:

| Werkzeug | Was es tut | Typischer Einsatz |
|----------|-----------|-------------------|
| **Duplikate entfernen** | Identische Zeilen finden und löschen | Doppelte Bestellungen, Kunden, Einträge |
| **Text in Spalten** | Eine Textspalte anhand Trennzeichen aufteilen | „Müller, Berlin" → Spalte A, Spalte B |
| **Blitzschnelles Ausfüllen** (Flash Fill) | Muster erkennen und automatisch fortsetzen | Aus „Max Müller" → Vorname + Nachname extrahieren |

 **Tipp:** Blitzschnelles Ausfüllen (`Strg+E`) ist Magie für Anfänger: Tippen Sie
in die Nachbarzelle das gewünschte Muster (z.B. nur den Vornamen), drücken Sie
`Strg+E` — und Excel erledigt den Rest!

**Übung 5.2 — Daten bereinigen**

Die folgende Übungstabelle **Modul 5 2 Bereinigen** ist bereits geladen.

1. Entfernen Sie alle doppelten Einträge mit „Daten → Duplikate entfernen".
2. Trennen Sie die Spalte „Name, Vorname" mit „Text in Spalten" in zwei Spalten.
3. Testen Sie das Blitzschnelle Ausfüllen: Extrahieren Sie die Initialen aus

   einer Namensliste.

## 5.3. Datenkonsolidierung

###  Konzept: Aus vielen Quellen eine Wahrheit

Wenn Daten über mehrere Tabellenblätter (z.B. `Januar`, `Februar`, `März`) verstreut
sind, möchten Sie oft eine Zusammenfassung auf einem Blatt sehen — einen Jahresüberblick.
Die **Konsolidierung** vereint Daten aus mehreren Bereichen nach Kategorien und wendet
eine Funktion (meist SUMME) darauf an.

 **Tipp:** Bevor Sie konsolidieren, stellen Sie sicher, dass alle Quellbereiche
dieselbe Struktur haben — gleiche Kategorienamen in derselben Reihenfolge.

**Übung 5.3 — Daten konsolidieren**

Die folgende Übungstabelle **Modul 5 3 Konsolidierung** ist bereits geladen.

1. Nutzen Sie „Daten → Konsolidieren", um die drei Monatsblätter zu einem

   Jahresüberblick zusammenzufassen.
2. Verlinken Sie die konsolidierten Werte mit den Quelldaten, sodass Änderungen

   automatisch übernommen werden.

## 5.4. Datenimport aus externen Quellen

###  Konzept: Die Brücke zur Außenwelt

Nicht alle Daten entstehen in Excel. Oft erhalten Sie `.csv`- oder `.txt`-Dateien aus
anderen Programmen (Buchhaltung, Warenwirtschaft, Webshops). Excel kann diese direkt
öffnen oder importieren — mit dem Vorteil, dass Sie schon beim Import Trennzeichen,
Datumsformat und Kodierung festlegen können.

| Importformat | Typische Quelle | Besonderheit |
|-------------|-----------------|--------------|
| `.csv` (Comma-Separated) | Webshops, Datenbank-Export | Einfachster Austausch |
| `.txt` (Text mit Trennzeichen) | Altsysteme, Logdateien | Flexibles Trennzeichen |
| Aus dem Web | Webseiten mit Tabellen | Daten bleiben aktuell (aktualisierbar) |

 **Wichtig:** Achten Sie beim CSV-Import auf das richtige Trennzeichen (Komma oder
Semikolon — je nach Ländereinstellung) und die korrekte Kodierung (UTF-8 für Umlaute).

**Übung 5.4 — Daten importieren**

Die folgende Übungstabelle **Modul 5 4 Import** ist bereits geladen.

1. Importieren Sie eine bereitgestellte `.csv`-Datei über „Daten → Aus Text/CSV".
2. Prüfen Sie die Vorschau und passen Sie Trennzeichen und Kodierung an.
3. Laden Sie die Daten in ein neues Tabellenblatt und aktualisieren Sie die Verbindung.



## Modul 6: Tabellen und Filter

**Lernziel:** Daten sortieren, filtern und in Excel-Tabellen professionell organisieren.

## 6.1. Suchen und Ersetzen

### Konzept: Nicht manuell durch Zeilen scrollen

Bei großen Tabellen ist es mühsam, einen bestimmten Wert zu finden —
oder gar alle Vorkommen eines Begriffs zu ändern. Die Suchfunktion
erledigt das in Sekunden.

| Aktion | Tastenkürzel | Verwendung |
|--------|-------------|------------|
| **Suchen** | `Strg+F` | Einen Begriff in der Tabelle finden |
| **Ersetzen** | `Strg+H` | Begriff finden und durch anderen ersetzen |
| **Weitersuchen** | `Shift+F4` | Nächsten Treffer ohne Dialog finden |

**Tipp:** Im Ersetzen-Dialog können Sie über „Optionen" die Suche
einschränken: nur im aktuellen Blatt, nur ganze Zellen, oder mit
Berücksichtigung der Groß-/Kleinschreibung.

**Übung 6.1 — Suchen und Ersetzen**

Die folgende Übungstabelle **Modul 6 1 Suchen Ersetzen** ist bereits geladen.

1. Suchen Sie mit `Strg+F` alle Vorkommen von „München".
2. Ersetzen Sie mit `Strg+H` alle „München" durch „München (Zentrale)".
3. Suchen Sie mit Option „Ganze Zellinhalte" nach „500" und beobachten
   Sie den Unterschied zur Suche ohne diese Option.

## 6.2. Fenster einfrieren

### Konzept: Überschriften immer im Blick behalten

Wenn Sie in einer großen Tabelle nach unten scrollen, verschwindet die
Kopfzeile aus dem Bild — Sie sehen nur noch Zahlen, ohne zu wissen, was
sie bedeuten. **Fenster einfrieren** fixiert Zeilen oder Spalten, sodass
sie beim Scrollen sichtbar bleiben.

| Aktion | Menüpfad | Effekt |
|--------|----------|--------|
| **Oberste Zeile fixieren** | Ansicht → Fenster einfrieren → Oberste Zeile fixieren | Zeile 1 bleibt immer sichtbar |
| **Erste Spalte fixieren** | Ansicht → Fenster einfrieren → Erste Spalte fixieren | Spalte A bleibt immer sichtbar |
| **Beliebigen Bereich fixieren** | Zelle unter/rechts des zu fixierenden Bereichs markieren → Fenster einfrieren | Zeilen + Spalten fixiert |

**Tipp:** Bei Tabellen mit Kopfzeile UND linker Beschriftungsspalte:
Markieren Sie die Zelle B2 und wählen Sie „Fenster einfrieren".
So bleiben sowohl Zeile 1 als auch Spalte A fixiert.

**Übung 6.2 — Fenster einfrieren**

Die folgende Übungstabelle **Modul 6 2 Fenster fixieren** ist bereits geladen.

1. Fixieren Sie die oberste Zeile und scrollen Sie nach unten.
2. Heben Sie die Fixierung auf (Ansicht → Fenster einfrieren → Fixierung aufheben).
3. Fixieren Sie Zeile 1 UND Spalte A gleichzeitig.
4. Scrollen Sie diagonal und beobachten Sie, was fixiert bleibt.

## 6.3. Daten sortieren

###  Konzept: Ordnung als Grundlage der Analyse

Sortieren ist mehr als alphabetische Ordnung — es ist der erste Schritt jeder Datenanalyse.
Eine sortierte Liste zeigt sofort die höchsten Umsätze, die neuesten Bestellungen oder die
produktivsten Mitarbeiter. Excel kann **mehrstufig** sortieren: zuerst nach Region, dann
innerhalb jeder Region nach Umsatz — und das mit einem Klick.

**Sortieroptionen im Überblick:**

| Sortierart | Beispiel | Einsatz |
|-----------|---------|---------|
| Einfach (A→Z) | Namen alphabetisch | Adresslisten, Produktkataloge |
| Einfach (Z→A) | Höchster Umsatz zuerst | Ranglisten, Top-10 |
| Mehrstufig | 1. Region, 2. Umsatz | Gruppierte Vergleichsanalyse |
| Nach Farbe | Zellen mit roter Formatierung oben | Ausreißer priorisieren |

 **Tipp:** Markieren Sie **eine** Zelle innerhalb Ihrer Datentabelle — Excel erkennt
automatisch den gesamten zusammenhängenden Bereich zum Sortieren. Sie müssen nicht alles
manuell auswählen!

**Übung 6.3 — Sortieren üben**

Die folgende Übungstabelle **Modul 6 3 Sortieren** ist bereits geladen.

1. Sortieren Sie die Kundentabelle alphabetisch nach Nachname (A→Z).
2. Sortieren Sie nach Bestellwert absteigend (höchster zuerst).
3. Führen Sie eine mehrstufige Sortierung durch: zuerst nach Land, dann nach

   Bestellwert innerhalb jedes Landes.

## 6.4. Daten filtern

###  Konzept: Den Scheinwerfer auf relevante Daten richten

Ein Filter blendet alle Zeilen aus, die ein bestimmtes Kriterium *nicht* erfüllen — wie
eine Suchmaschine innerhalb Ihrer Tabelle. Anders als beim Sortieren bleiben die Daten
in ihrer ursprünglichen Reihenfolge, und ausgeblendete Zeilen sind nicht gelöscht,
sondern nur temporär unsichtbar.

| Filtertyp | Was Sie filtern können |
|-----------|----------------------|
| Textfilter | Enthält, beginnt mit, endet mit... |
| Zahlenfilter | Größer als, zwischen, Top 10... |
| Datumsfilter | Heute, diese Woche, dieses Quartal... |
| Nach Farbe | Alle Zellen mit gelber Füllung |

 **Tipp:** Das Filtersymbol (Trichter) in der Spaltenüberschrift zeigt an, dass
ein Filter aktiv ist. Mehrere Filter gleichzeitig sind möglich — und grundlegend
für die Arbeit mit großen Datenmengen.

**Übung 6.4 — Filtern anwenden**

Die folgende Übungstabelle **Modul 6 4 Filtern** ist bereits geladen.

1. Aktivieren Sie den Autofilter (`Strg+Umschalt+L`).
2. Filtern Sie nur Bestellungen aus „Berlin".
3. Filtern Sie Bestellwerte über 500 €.
4. Kombinieren Sie beide Filter und zählen Sie die sichtbaren Zeilen.

## 6.5. Excel-Tabellen (Strg+T)

###  Konzept: Vom einfachen Bereich zur intelligenten Tabelle

Ein normaler Zellbereich (`A1:D100`) ist eine lose Sammlung von Zellen. Eine **Excel-Tabelle**
(`Strg+T`) hingegen ist eine intelligente Datenstruktur mit klaren Vorteilen:

| Eigenschaft | Normaler Bereich | Excel-Tabelle (Strg+T) |
|------------|-----------------|----------------------|
| Formatierung | Manuell, statisch | Automatisch, wechselnde Zeilenfarben |
| Neue Zeilen | Manuell formatiert | Formatierung wird automatisch übernommen |
| Formeln | Werden einzeln kopiert | Werden automatisch auf alle Zeilen angewendet |
| Filter | Müssen manuell gesetzt werden | Sind automatisch in der Kopfzeile |
| Bezüge | `=B2*C2` | `=[@Preis]*[@Menge]` (strukturierte Verweise) |
| Diagramme/Pivots | Manuell anpassen bei neuen Daten | Erweitern sich automatisch |

 **Tipp:** Strukturierte Verweise wie `=[@Umsatz]` statt `=D2` machen Formeln
lesbarer und robuster. Sie sehen sofort, was berechnet wird — auch Wochen später.

**Übung 6.5 — Excel-Tabellen verwenden**

Die folgende Übungstabelle **Modul 6 5 Tabellen** ist bereits geladen.

1. Wandeln Sie den Datenbereich mit `Strg+T` in eine Excel-Tabelle um.
2. Wählen Sie ein Tabellenformat mit wechselnden Zeilenfarben.
3. Fügen Sie eine neue Zeile hinzu und beobachten Sie die automatische Formatierung.
4. Nutzen Sie einen strukturierten Verweis: `=[@Menge]*[@Preis]` in der Spalte „Summe".

## 6.6. Teilergebnisse und Gliederung

###  Konzept: Zusammenfassungen auf Knopfdruck

Stellen Sie sich eine Vertriebstabelle mit 5.000 Zeilen vor, sortiert nach Region und
Produkt. Die **Teilergebnis**-Funktion fügt automatisch Summen-, Mittelwert- oder
Anzahl-Zeilen nach jedem Gruppenwechsel ein — und erstellt eine Gliederung, mit der
Sie zwischen Detail- und Übersichtsansicht umschalten können.

 **Tipp:** Bevor Sie Teilergebnisse einsetzen, **müssen** die Daten nach dem
Gruppierungsmerkmal sortiert sein — sonst erhalten Sie sinnlose Zwischensummen.

**Übung 6.6 — Teilergebnisse berechnen**

Die folgende Übungstabelle **Modul 6 6 Teilergebnisse** ist bereits geladen.

1. Sortieren Sie die Tabelle zuerst nach „Region".
2. Fügen Sie über „Daten → Teilergebnis" automatische Summen für jede Region ein.
3. Nutzen Sie die Gliederungssymbole (1, 2, 3 am linken Rand), um zwischen

   Detail- und Übersichtsansicht zu wechseln.



## Modul 7: Erweiterte Funktionen

**Lernziel:** Bedingte Berechnungen, Suchfunktionen und Textverarbeitung beherrschen.

## 7.1. Bedingte mathematische Funktionen

###  Konzept: Rechnen nur unter bestimmten Bedingungen

Während `SUMME()` alles addiert, summiert `SUMMEWENN()` nur die Werte, die eine Bedingung
erfüllen. Das Konzept ist einfach: „Addiere alle Umsätze, ABER NUR für die Region Nord."
Das ist die Anatomie fast aller Funktionen: `=NAME(Argument1; Argument2; ...)` mit
Semikolon als Trennzeichen.

**Die Familie der Bedingungsfunktionen:**

| Funktion | Aufbau | Beispiel |
|----------|--------|----------|
| `SUMMEWENN()` | Bereich, Kriterium, [Summe-Bereich] | `=SUMMEWENN(A:A;"Nord";C:C)` |
| `SUMMEWENNS()` | Summe-Bereich, Bereich1, Kriterium1, ... | `=SUMMEWENNS(C:C;A:A;"Nord";B:B;"Q1")` |
| `ZÄHLENWENN()` | Bereich, Kriterium | `=ZÄHLENWENN(C:C;">1000")` |
| `ZÄHLENWENNS()` | Bereich1, Kriterium1, Bereich2, Kriterium2... | `=ZÄHLENWENNS(A:A;"Nord";C:C;">1000")` |
| `MITTELWERTWENN()` | Bereich, Kriterium, [Mittelwert-Bereich] | `=MITTELWERTWENN(A:A;"Süd";C:C)` |

 **Tipp:** `SUMMEWENN` für EINE Bedingung, `SUMMEWENNS` für MEHRERE Bedingungen.
Beachten Sie die unterschiedliche Reihenfolge der Argumente — bei `WENNS` steht der
Summenbereich zuerst!

**Übung 7.1 — Bedingte Summen und Zählungen**

Die folgende Übungstabelle **Modul 7 1 Bedingte Summen** ist bereits geladen.

1. Berechnen Sie mit `SUMMEWENN` den Gesamtumsatz für die Region „Nord".
2. Berechnen Sie mit `SUMMEWENNS` den Umsatz für „Nord" UND Produkt „Laptop".
3. Zählen Sie mit `ZÄHLENWENN` alle Bestellungen über 1.000 €.
4. Zählen Sie mit `ZÄHLENWENNS` Großbestellungen (> 1.000 €) in der Region „Süd".

## 7.2. Die SVERWEIS-Funktion

###  Konzept: Wie ein Telefonbuch — suchen und finden

SVERWEIS (senkrechter Verweis) sucht einen Wert in der linken Spalte einer Tabelle und
gibt den Wert aus einer anderen Spalte derselben Zeile zurück. Wie ein Telefonbuch:
Sie schlagen einen Namen nach (linke Spalte) und lesen die Telefonnummer (rechte Spalte).
Das „S" steht für „senkrecht" — es wird von oben nach unten gesucht.

**Syntax:** `=SVERWEIS(Suchkriterium; Suchmatrix; Spaltenindex; Bereich_Verweis)`

| Argument | Bedeutung | Beispiel |
|----------|-----------|----------|
| Suchkriterium | Was suchen Sie? | `"Laptop"` oder `A2` |
| Suchmatrix | Wo suchen Sie? | `Produkte!A:D` |
| Spaltenindex | Welche Spalte soll zurückgegeben werden? | `2` (für Spalte B) |
| Bereich_Verweis | Exakte (0) oder ungefähre (1) Übereinstimmung? | `0` = exakt |

 **Wichtig:** SVERWEIS sucht **immer in der ersten Spalte** der Suchmatrix — nie
in der Mitte oder am Ende. Wenn Ihr Suchbegriff rechts steht, brauchen Sie
INDEX+VERGLEICH oder XVERWEIS.

**Wichtig:** Bei `Bereich_Verweis=1` (ungefähre Übereinstimmung) **muss** die
Suchspalte **aufsteigend sortiert** sein — sonst liefert SVERWEIS falsche
Ergebnisse. Bei `Bereich_Verweis=0` (exakte Übereinstimmung) ist keine
Sortierung erforderlich.

**Übung 7.2 — SVERWEIS anwenden**

Die folgende Übungstabelle **Modul 7 2 SVERWEIS** ist bereits geladen.

1. Nutzen Sie SVERWEIS, um zu einer Produkt-ID den passenden Produktnamen aus

   einer Preisliste zu finden (exakte Übereinstimmung).
2. Finden Sie zu einer Punktzahl die passende Note („sehr gut", „gut"...) mit

   ungefährer Übereinstimmung.
3. Testen Sie, was passiert, wenn der Suchbegriff nicht existiert (#NV-Fehler).

###  Konzept: WVERWEIS — die horizontale Variante

WVERWEIS (waagerechter Verweis) funktioniert genau wie SVERWEIS, aber statt von oben nach
unten sucht er von **links nach rechts** in der **ersten Zeile** einer Tabelle.
Nützlich, wenn Ihre Daten horizontal angeordnet sind — z.B. Monatsnamen in Zeile 1
und Umsatzzahlen darunter.

**Syntax:** `=WVERWEIS(Suchkriterium; Suchmatrix; Zeilenindex; Bereich_Verweis)`

| Argument | Bedeutung | Beispiel |
|----------|-----------|----------|
| Suchkriterium | Was suchen Sie? | `"März"` oder `B1` |
| Suchmatrix | Wo suchen Sie? | `A1:M5` (Daten horizontal) |
| Zeilenindex | Welche Zeile soll zurückgegeben werden? | `2` (für Zeile 2) |
| Bereich_Verweis | Exakte (0) oder ungefähre (1) Übereinstimmung? | `0` = exakt |

**Tipp:** In der Praxis wird WVERWEIS seltener verwendet als SVERWEIS, da
Tabellen meist vertikal (mit Überschriften in Spalten) organisiert sind.
Für horizontale Daten ist es jedoch die richtige Wahl.

## 7.3. INDEX und VERGLEICH

###  Konzept: Die flexible Alternative zu SVERWEIS

INDEX+VERGLEICH ist die mächtigere Kombination: INDEX liefert den Wert an einer bestimmten
Position in einem Bereich, VERGLEICH findet die Position eines Suchbegriffs. Zusammen
können sie in jede Richtung suchen — nicht nur von links nach rechts wie SVERWEIS.

```
=INDEX(Bereich; Zeilennummer; [Spaltennummer])
=VERGLEICH(Suchkriterium; Suchbereich; [Vergleichstyp])
     → liefert die POSITION (Zeilennummer), nicht den Wert

Kombiniert: =INDEX(Ergebnisspalte; VERGLEICH(Suchbegriff; Suchspalte; 0))
```

 **Tipp:** INDEX+VERGLEICH sucht in jede Richtung (auch rechts→links), ist
schneller bei großen Tabellen und bricht nicht, wenn Spalten eingefügt werden.
Für Excel 365-Nutzer ist XVERWEIS (`XLOOKUP`) die einfachste Alternative.

**Übung 7.3 — INDEX und VERGLEICH kombinieren**

Die folgende Übungstabelle **Modul 7 3 INDEX VERGLEICH** ist bereits geladen.

1. Finden Sie mit INDEX+VERGLEICH den Preis eines Produkts, wobei die

   Produktspalte rechts vom Preis steht (was SVERWEIS nicht kann).
2. Erstellen Sie eine bidirektionale Suche: Produkt (Zeile) × Monat (Spalte).
3. Vergleichen Sie die Formel mit der SVERWEIS-Variante aus der vorherigen Übung.

## 7.4. Text- und Datumsfunktionen

###  Konzept: Texte nicht nur anzeigen, sondern bearbeiten

Excel kann mehr als nur Texte speichern — es kann Texte zerlegen, zusammensetzen,
bereinigen und transformieren. Das ist besonders wertvoll, wenn Daten aus Fremdsystemen
kommen und „Herr Dr. Max Müller, MBA" zu „Müller, Max" werden soll.

**Die wichtigsten Textfunktionen:**

| Funktion | Wirkung | Beispiel | Ergebnis |
|----------|---------|----------|----------|
| `LINKS(Text; n)` | Erste n Zeichen | `=LINKS("Excel";2)` | `Ex` |
| `RECHTS(Text; n)` | Letzte n Zeichen | `=RECHTS("Excel";2)` | `el` |
| `TEIL(Text; Start; n)` | n Zeichen ab Position | `=TEIL("Excel";2;3)` | `xce` |
| `LÄNGE(Text)` | Anzahl Zeichen | `=LÄNGE("Excel")` | `5` |
| `GLÄTTEN(Text)` | Überflüssige Leerzeichen entfernen | `=GLÄTTEN("  Hallo  ")` | `Hallo` |
| `GROSS2(Text)` | Erster Buchstabe jedes Wortes groß | `=GROSS2("max mustermann")` | `Max Mustermann` |
| `GROSS(Text)` | Alles in Großbuchstaben | `=GROSS("excel")` | `EXCEL` |
| `KLEIN(Text)` | Alles in Kleinbuchstaben | `=KLEIN("EXCEL")` | `excel` |
| `VERKETTEN()` / `&` | Texte verbinden | `=A2&" "&B2` | `Max Müller` |

 **Tipp:** Mit `HEUTE()` erhalten Sie immer das aktuelle Datum — ideal für
Altersberechnungen oder Fristenüberwachung: `=JAHR(HEUTE())-JAHR(Geburtsdatum)`.

**Übung 7.4 — Text- und Datumsfunktionen anwenden**

Die folgende Übungstabelle **Modul 7 4 Text Datum** ist bereits geladen.

1. Extrahieren Sie aus einer Spalte „Nachname, Vorname" den Nachnamen mit

   `LINKS()` und `FINDEN()`.
2. Bereinigen Sie importierte Texte mit `GLÄTTEN()` von überflüssigen Leerzeichen.
3. Verbinden Sie Vor- und Nachname aus zwei Spalten mit `&` zu einer Spalte.
4. Berechnen Sie das Alter von Personen aus dem Geburtsdatum mit `HEUTE()`.



## Modul 8: Diagramme und Visualisierung

**Lernziel:** Den richtigen Diagrammtyp wählen, professionelle Diagramme erstellen und
formatieren.

## 8.1. Welches Diagramm für welche Daten?

###  Konzept: Visuelle Kommunikation als Sprache

Ein Diagramm übersetzt Zahlen in Bilder — und das menschliche Gehirn verarbeitet Bilder
60.000-mal schneller als Text. Aber nicht jedes Diagramm passt zu jedem Datentyp. Die
Kunst liegt in der **richtigen Wahl**: Ein Tortendiagramm für 50 Datenpunkte ist Unsinn,
ein Liniendiagramm für Produktnamen ebenso. Hier ist Ihr Auswahlleitfaden:

| Datentyp | Empfohlenes Diagramm | Beispiel |
|----------|---------------------|----------|
| Vergleich von Werten | **Säulendiagramm** | Umsatz pro Region |
| Zeitliche Entwicklung | **Liniendiagramm** | Aktienkurs über 12 Monate |
| Anteile eines Ganzen | **Kreisdiagramm** | Marktanteile (max. 5-7 Segmente!) |
| Rangfolge | **Balkendiagramm** | Top-10 Produkte |
| Beziehung zweier Variablen | **Punktdiagramm (XY)** | Werbeausgaben vs. Umsatz |
| Häufigkeitsverteilung | **Histogramm** | Altersverteilung der Kunden |

 **Wichtig:** Ein Kreisdiagramm sollte nie mehr als 5-7 Segmente haben — sonst wird
es unleserlich. Fassen Sie kleine Anteile zu „Sonstige" zusammen.

**Übung 8.1 — Ihr erstes Diagramm**

Die folgende Übungstabelle **Modul 8 1 Erste Diagramme** ist bereits geladen.

1. Markieren Sie die Umsatztabelle (Produkte + Werte) und erstellen Sie ein

   Säulendiagramm über „Einfügen → Säulendiagramm".
2. Erstellen Sie ein Kreisdiagramm aus denselben Daten. Welches ist

   aussagekräftiger und warum?
3. Erstellen Sie ein Liniendiagramm aus den monatlichen Umsatzzahlen.

## 8.2. Diagrammelemente formatieren

###  Konzept: Vom Standard-Diagramm zum professionellen Bericht

Das Standard-Diagramm von Excel ist funktional, aber selten präsentationsreif. Erst durch
gezielte Anpassung wird ein Diagramm zum Kommunikationswerkzeug: aussagekräftiger Titel,
korrekte Achsenbeschriftung, passende Datenbeschriftungen und eine Legende, die erklärt,
ohne zu verwirren.

**Die Elemente eines Diagramms:**

| Element | Zweck | Empfehlung |
|---------|-------|------------|
| Diagrammtitel | Was zeigt das Diagramm? | Immer setzen, präzise beschreiben |
| Achsentitel | Was bedeuten X- und Y-Achse? | Bei unbekannten Einheiten angeben |
| Legende | Welche Farbe = welche Datenreihe? | Bei mehreren Datenreihen erforderlich |
| Datenbeschriftungen | Konkrete Zahlen direkt am Punkt | Bei Präsentationen hilfreich |
| Gitternetzlinien | Orientierung auf der Y-Achse | Dezente Farbe, nicht zu viele |

 **Tipp:** Mit dem Plus-Symbol (+) rechts neben einem markierten Diagramm können
Sie alle Diagrammelemente mit einem Klick ein- und ausblenden. Das ist der schnellste
Weg zur Anpassung.

**Übung 8.2 — Diagramm formatieren**

Die folgende Übungstabelle **Modul 8 2 Diagrammformat** ist bereits geladen.

1. Fügen Sie einen aussagekräftigen Diagrammtitel hinzu („Quartalsumsatz 2026").
2. Beschriften Sie die Achsen („Quartal" und „Umsatz in €").
3. Fügen Sie Datenbeschriftungen zu den Säulen hinzu.
4. Ändern Sie die Farben der Säulen mit einer professionellen Farbpalette.

## 8.3. Verbund- und Spezialdiagramme

###  Konzept: Zwei Datenskalen in einem Diagramm

Manchmal wollen Sie Umsatz (in Tausend Euro) und Wachstumsrate (in Prozent) in einem
Diagramm zeigen — aber die Wertebereiche sind extrem unterschiedlich. Ein
**Verbunddiagramm** (Kombi-Diagramm) mit **Sekundärachse** löst dieses Problem:
Säulen für den Umsatz auf der linken Achse, eine Linie für die Wachstumsrate auf
der rechten.

 **Tipp:** Ein Verbunddiagramm eignet sich hervorragend für Soll-Ist-Vergleiche,
Budget vs. tatsächliche Ausgaben oder Umsatz vs. Gewinnmarge.

**Übung 8.3 — Verbunddiagramm erstellen**

Die folgende Übungstabelle **Modul 8 3 Verbunddiagramm** ist bereits geladen.

1. Erstellen Sie ein Kombi-Diagramm: Umsatz als Säulen, Wachstumsrate als Linie.
2. Fügen Sie eine Sekundärachse für die Wachstumsrate ein.
3. Formatieren Sie beide Achsen mit passenden Einheiten (€ und %).

## 8.4. Dashboard-Grundlagen

###  Konzept: Alle wichtigen Kennzahlen auf einen Blick

Ein Dashboard ist eine Übersichtsseite, die mehrere Diagramme, Kennzahlen und Tabellen
auf einem Bildschirm vereint — wie das Armaturenbrett eines Autos. Alle wichtigen
Informationen sind auf einen Blick erfassbar, ohne dass der Betrachter zwischen
Tabellenblättern wechseln muss.

**Die Bestandteile eines einfachen Dashboards:**

| Element | Funktion | Beispiel |
|---------|----------|----------|
| KPI-Karten | Einzelne Kennzahl groß darstellen | „Gesamtumsatz: 1,2 Mio. €" |
| Trenddiagramm | Entwicklung über Zeit zeigen | Liniendiagramm letzte 12 Monate |
| Vergleichsdiagramm | Kategorien vergleichen | Säulendiagramm nach Region |
| Anteilsdiagramm | Zusammensetzung zeigen | Kreisdiagramm nach Produktgruppe |

**Übung 8.4 — Einfaches Dashboard erstellen**

Die folgende Übungstabelle **Modul 8 4 Dashboard** ist bereits geladen.

1. Erstellen Sie auf einem neuen Blatt drei Diagramme aus den Quelldaten:

   ein Säulendiagramm (nach Region), ein Liniendiagramm (nach Monat) und

   ein Kreisdiagramm (nach Produktkategorie).
2. Ordnen Sie die Diagramme übersichtlich auf dem Blatt an.
3. Fügen Sie über jedem Diagramm einen erklärenden Text ein.



## Modul 9: Pivot-Tabellen

**Lernziel:** Große Datenmengen mit Pivot-Tabellen gruppieren, zusammenfassen und

**Hinweis zur Excel-lenz-Plattform:** Die Erstellung von Pivot-Tabellen ist
im Web-Simulator nicht verfügbar. Die folgenden Übungen erfordern Microsoft
Excel. Auf der Plattform stehen Quiz-Fragen zu Pivot-Tabellen-Konzepten zur
Verfügung.

analysieren.

## 9.1. Was ist eine Pivot-Tabelle?

###  Konzept: Daten drehen und wenden wie einen Zauberwürfel

Eine Pivot-Tabelle ist eines der revolutionärsten Werkzeuge in Excel. Stellen Sie sich
vor, Sie haben 10.000 Verkaufsdatensätze und möchten wissen: „Wie hoch war der Umsatz pro
Region und pro Quartal?" Eine Pivot-Tabelle beantwortet diese Frage in Sekunden — und Sie
können die Perspektive jederzeit ändern („pivotieren"), ohne eine einzige Formel zu
schreiben.

Das Grundprinzip ist einfach: **Gruppieren und Zusammenfassen**. Sie ziehen Felder in
vier Bereiche und Excel erledigt den Rest — keine Formeln, keine manuelle Sortierung.

**Die vier Bereiche einer Pivot-Tabelle:**

| Bereich | Funktion | Beispiel |
|---------|----------|----------|
| **Zeilen** | Was steht links in der Tabelle? | Region, Produkt, Monat |
| **Spalten** | Was steht oben in der Tabelle? | Quartal, Jahr, Kategorie |
| **Werte** | Was soll berechnet werden? | Summe Umsatz, Anzahl Bestellungen |
| **Filter** | Welche Daten sollen ausgeschlossen werden? | Nur Jahr 2026, nur Region Nord |

 **Tipp:** Sie können jederzeit Felder zwischen den Bereichen verschieben — die
Tabelle aktualisiert sich sofort. Experimentieren Sie! Es gibt kein „Falsch" beim
Erkunden von Daten mit Pivot-Tabellen.

**Übung 9.1 — Erste Pivot-Tabelle**

Die folgende Übungstabelle **Modul 9 1 Pivot** ist bereits geladen.

1. Markieren Sie eine Zelle in der Datentabelle und wählen Sie

   „Einfügen → PivotTable".
2. Ziehen Sie „Region" in den Zeilenbereich und „Umsatz" in den Wertebereich.
3. Beobachten Sie, wie Excel automatisch die Summe pro Region berechnet.

## 9.2. Pivot-Tabelle anpassen

###  Konzept: Nicht nur SUMME — vielfältige Zusammenfassungen

Standardmäßig zeigt eine Pivot-Tabelle die **Summe** numerischer Werte. Aber Sie können
die Zusammenfassungsfunktion jederzeit ändern: Mittelwert, Anzahl, Maximum, Minimum,
Prozentanteil... und sogar „Differenz zum Vorjahr" oder „% des Gesamtergebnisses".
Das macht die Pivot-Tabelle zu einem flexiblen Analysewerkzeug.

**Verfügbare Zusammenfassungsfunktionen:**

| Funktion | Frage, die sie beantwortet |
|----------|---------------------------|
| Summe | Wie viel insgesamt? |
| Anzahl | Wie viele Einträge? |
| Mittelwert | Was ist der Durchschnitt? |
| Maximum / Minimum | Höchster / niedrigster Wert? |
| % des Gesamtergebnisses | Welchen Anteil hat dieser Wert? |
| Differenz zum Vormonat | Wie hat sich der Wert verändert? |

**Übung 9.2 — Pivot-Tabelle anpassen**

Die folgende Übungstabelle **Modul 9 2 Pivot Anpassung** ist bereits geladen.

1. Ändern Sie die Zusammenfassung von „Summe" auf „Mittelwert".
2. Gruppieren Sie die Datumsangaben nach Monaten und Quartalen

   (Rechtsklick → Gruppieren).
3. Zeigen Sie die Werte als „% des Gesamtergebnisses" an.
4. Fügen Sie ein berechnetes Feld hinzu: „Bonus" = Umsatz × 5%.

## 9.3. Mit Slicern filtern

###  Konzept: Visuelle Filter für Pivot-Tabellen

Slicer sind interaktive Schaltflächen, mit denen Sie Pivot-Tabellen filtern — aber
viel eleganter als herkömmliche Dropdown-Filter. Ein Klick auf „Nord" im Slicer,
und alle verbundenen Pivot-Tabellen und Diagramme zeigen nur die Daten dieser Region.
Das macht Slicer zum perfekten Werkzeug für Dashboards und Präsentationen.

 **Tipp:** Ein Slicer kann mit mehreren Pivot-Tabellen gleichzeitig verbunden
werden (Rechtsklick → Berichtsverbindungen). So steuern Sie ein ganzes Dashboard
mit einem Klick.

**Übung 9.3 — Slicer einsetzen**

Die folgende Übungstabelle **Modul 9 3 Slicer** ist bereits geladen.

1. Fügen Sie einen Slicer für das Feld „Region" ein

   (PivotTable-Analyse → Slicer einfügen).
2. Filtern Sie mit dem Slicer auf eine bestimmte Region.
3. Fügen Sie einen zweiten Slicer für „Produktkategorie" hinzu und kombinieren

   Sie beide Filter.

## 9.4. PivotCharts

###  Konzept: Diagramme, die mit der Pivot-Tabelle leben

Ein PivotChart ist ein Diagramm, das direkt mit einer Pivot-Tabelle verbunden ist.
Wenn Sie die Pivot-Tabelle verändern (andere Gruppierung, anderer Filter), passt
sich das Diagramm automatisch an. Das ist die perfekte Kombination aus Analyse
(Pivot) und Präsentation (Chart).

**Übung 9.4 — PivotChart erstellen**

Die folgende Übungstabelle **Modul 9 4 PivotChart** ist bereits geladen.

1. Erstellen Sie aus Ihrer Pivot-Tabelle ein PivotChart

   (PivotTable-Analyse → PivotChart).
2. Wählen Sie einen passenden Diagrammtyp.
3. Testen Sie die Interaktivität: Ändern Sie die Pivot-Tabelle und beobachten

   Sie, wie das Diagramm folgt.



## Modul 10: Analyse und Finanzfunktionen

**Lernziel:** Was-wäre-wenn-Analysen durchführen und grundlegende Finanzfunktionen
einsetzen.

## 10.1. Zielwertsuche (Goal Seek)

###  Konzept: Vom Ergebnis zur Ursache zurückrechnen

Normalerweise geben Sie Werte ein und Excel berechnet das Ergebnis (z.B. Menge × Preis =
Umsatz). Die **Zielwertsuche** macht das Gegenteil: Sie sagen „Ich will 100.000 €
Umsatz erreichen", und Excel findet den notwendigen Preis oder die Menge. Das ist
besonders nützlich für Planung und Budgetierung.

 **Tipp:** Die Zielwertsuche finden Sie unter „Daten → Was-wäre-wenn-Analyse →
Zielwertsuche". Sie benötigen drei Angaben: Zielzelle (mit Formel), Zielwert und
veränderbare Zelle.

**Übung 10.1 — Zielwertsuche anwenden**

Die folgende Übungstabelle **Modul 10 1 Zielwertsuche** ist bereits geladen.

1. Sie möchten einen Gesamtumsatz von 100.000 € erreichen. Nutzen Sie die

   Zielwertsuche, um den erforderlichen Stückpreis zu ermitteln.
2. Ein Kredit über 200.000 € soll eine monatliche Rate von 1.500 € haben.

   Welcher Zinssatz ist dafür maximal zulässig?

## 10.2. Finanzfunktionen

###  Konzept: Der Zeitwert des Geldes — vereinfacht

Geld heute ist mehr wert als Geld morgen. Warum? Weil Sie Geld heute anlegen können und
es durch Zinsen wächst (Opportunitätsprinzip). Excel bildet dieses Grundprinzip der
Finanzmathematik mit speziellen Funktionen ab — Sie müssen nur die Parameter kennen.

**Die wichtigsten Finanzfunktionen für Anfänger:**

| Funktion | Was sie berechnet | Beispiel |
|----------|------------------|----------|
| `RMZ()` (Rate) | Monatliche Rate eines Kredits | `=RMZ(Zins/12; Monate; -Kreditbetrag)` |
| `ZW()` (Zukunftswert) | Endkapital einer Sparanlage | `=ZW(Zins; Jahre; -Rate; -Startkapital)` |
| `NBW()` (Kapitalwert) | Heutiger Wert zukünftiger Zahlungen | `=NBW(Zins; Zahlung1; Zahlung2...)` |
| `IKV()` (Interner Zinsfuß) | Rendite einer Investition | `=IKV(Wertebereich)` |

 **Tipp:** Bei RMZ und ZW sind Zahlungen, die Sie leisten (Kreditrate, Sparrate),
als negative Zahlen anzugeben. Der Kreditbetrag ist positiv aus Sicht der Bank.

**Übung 10.2 — Finanzfunktionen anwenden**

Die folgende Übungstabelle **Modul 10 2 Finanzfunktionen** ist bereits geladen.

1. Berechnen Sie mit `RMZ()` die monatliche Rate für einen Kredit über 250.000 €

   bei 4,5% Zins und 30 Jahren Laufzeit.
2. Berechnen Sie mit `ZW()` das Endkapital nach 20 Jahren, wenn Sie monatlich

   200 € bei 3% Zins ansparen.
3. Vergleichen Sie zwei Investitionen mit `NBW()` und entscheiden Sie, welche

   vorteilhafter ist.



## 10.3. Datentabellen

###  Konzept: Viele Szenarien auf einmal berechnen

Eine Datentabelle (Daten → Was-wäre-wenn-Analyse → Datentabelle) berechnet
automatisch mehrere Ergebnisse für verschiedene Eingabewerte.

**Eindimensionale Datentabelle:** Eine Eingabevariable variieren (z.B. Zinssatz).
**Zweidimensionale Datentabelle:** Zwei Variablen variieren (z.B. Zinssatz × Laufzeit).

**Tipp:** Die Datentabelle verwendet die Matrixformel `{=TABELLE(;)}` — Sie
können einzelne Zellen der Tabelle nicht bearbeiten oder löschen.

**Übung 10.3 — Datentabelle erstellen**

Die folgende Übungstabelle **Modul 10 3 Datentabelle** ist bereits geladen.

> 1. Erstellen Sie eine eindimensionale Datentabelle: RMZ-Rate für Zinssätze
>    von 2% bis 8% (in 0,5%-Schritten) bei 250.000 € und 30 Jahren.
> 2. Erstellen Sie eine zweidimensionale Datentabelle: RMZ-Rate für Zinssätze
>    (3%–7%) × Laufzeiten (10–30 Jahre).
> 3. Interpretieren Sie: Bei welchem Zinssatz übersteigt die Rate 1.500 €?

## 10.4. Integrierte Finanzanalyse

###  Konzept: Alle Werkzeuge kombiniert einsetzen

In der Praxis werden Zielwertsuche, Finanzfunktionen und Datentabellen
kombiniert, um fundierte finanzielle Entscheidungen zu treffen.

**Übung 10.4 — Integrierte Finanzanalyse**

Die folgende Übungstabelle **Modul 10 4 Finanzanalyse** ist bereits geladen.

> Ein Unternehmen plant eine Investition von 500.000 € mit erwarteten jährlichen
> Rückflüssen von 80.000 € über 10 Jahre.
>
> 1. Berechnen Sie den Kapitalwert (NBW) bei 6% Zinssatz. Ist die Investition
>    vorteilhaft?
> 2. Nutzen Sie die Zielwertsuche: Welcher Zinssatz ergibt NBW = 0 (IKV)?
> 3. Erstellen Sie eine Datentabelle: NBW für Zinssätze 2%–12%.
> 4. Ab welchem Zinssatz wird die Investition unvorteilhaft (NBW < 0)?




## Modul 11: Druck und Zusammenarbeit

**Lernziel:** Tabellen professionell für den Druck aufbereiten und mit anderen

**Hinweis zur Excel-lenz-Plattform:** Die Druckfunktionen sind im
Web-Simulator nicht verfügbar. Die folgenden Übungen erfordern Microsoft
Excel. Auf der Plattform stehen Quiz-Fragen zu Druckkonzepten zur Verfügung.

zusammenarbeiten.

## 11.1. Seitenlayout konfigurieren

###  Konzept: Vom Bildschirm zum Papier — die andere Denkweise

Eine Tabelle, die am Bildschirm perfekt aussieht, kann gedruckt ein Desaster sein:
abgeschnittene Spalten, fehlende Überschriften, kein Seitenrand. Der Druck erfordert
eine andere Denkweise — Sie müssen Excel sagen, was auf eine Seite passt, wie die
Ränder sein sollen und ob Hoch- oder Querformat besser ist.

**Die wichtigsten Druckeinstellungen:**

| Einstellung | Optionen | Empfehlung |
|-------------|----------|------------|
| Ausrichtung | Hochformat / Querformat | Breite Tabellen → Querformat |
| Skalierung | An Seite anpassen / % | „Alle Spalten auf eine Seite" |
| Seitenränder | Normal / Schmal / Benutzerdefiniert | Bei vielen Spalten: „Schmal" |
| Papierformat | A4, Letter... | Mittel-/Nordeuropa: A4 |

 **Tipp:** Rufen Sie vor jedem Druck die **Seitenumbruchvorschau** auf
(Ansicht → Seitenumbruchvorschau). Sie sehen sofort, wo die Seitenumbrüche
liegen und können sie per Drag & Drop verschieben.

**Übung 11.1 — Seitenlayout einrichten**

Die folgende Übungstabelle **Modul 11 1 Drucklayout** ist bereits geladen.

1. Ändern Sie die Ausrichtung auf Querformat.
2. Skalieren Sie die Tabelle so, dass alle Spalten auf eine Seite passen.
3. Setzen Sie die Seitenränder auf „Schmal".
4. Zentrieren Sie die Tabelle horizontal und vertikal auf der Seite.

## 11.2. Druckbereich und Seitenumbrüche

###  Konzept: Nicht alles muss gedruckt werden

Oft enthält ein Tabellenblatt Hilfsberechnungen, Zwischenergebnisse oder Notizen,
die nicht gedruckt werden sollen. Mit dem **Druckbereich** legen Sie exakt fest,
welcher Teil des Blattes gedruckt wird — der Rest wird ignoriert. Mit manuellen
**Seitenumbrüchen** steuern Sie, wo eine neue Seite beginnt.

**Übung 11.2 — Druckbereich festlegen**

Die folgende Übungstabelle **Modul 11 2 Druckbereich** ist bereits geladen.

1. Definieren Sie einen Druckbereich, der nur die Haupttabelle (ohne Hilfsspalten)

   umfasst.
2. Fügen Sie einen manuellen Seitenumbruch nach Zeile 30 ein.
3. Nutzen Sie die Seitenumbruchvorschau, um die Umbrüche zu kontrollieren.

## 11.3. Kopf- und Fußzeilen

###  Konzept: Professionelle Dokumente brauchen Metadaten

Eine gedruckte Excel-Tabelle ohne Kopfzeile wirkt unprofessionell. Kopf- und Fußzeilen
enthalten Seitennummern, Datum, Dateinamen oder Firmenlogos — Informationen, die dem
Leser Orientierung geben. Einmal eingerichtet, erscheinen sie automatisch auf jeder
Seite.

 **Tipp:** Nutzen Sie die vordefinierten Elemente (Seitenzahl, Anzahl der Seiten,
aktuelles Datum, Dateipfad) über die Schaltflächen im Kopf-/Fußzeilen-Dialog.
Das spart Tipparbeit und bleibt automatisch aktuell.

**Übung 11.3 — Kopf- und Fußzeilen erstellen**

Die folgende Übungstabelle **Modul 11 3 Kopfzeilen** ist bereits geladen.

1. Fügen Sie eine Kopfzeile mit dem Firmennamen (links) und dem Datum (rechts) ein.
2. Fügen Sie eine Fußzeile mit „Seite X von Y" (mittig) ein.
3. Aktivieren Sie „Wiederholungszeilen oben", damit die Tabellenüberschrift auf

   jeder gedruckten Seite erscheint.

## 11.4. Zusammenarbeit und Export

###  Konzept: Excel-Dateien weitergeben wie ein Profi

Bevor Sie eine Excel-Datei per E-Mail versenden, stellen Sie sicher, dass der Empfänger
sie öffnen und lesen kann. Nicht jeder hat Excel — eine PDF-Version als Alternative ist
professioneller Standard. Kommentare erlauben Rückfragen direkt in der Tabelle, ohne
die Daten zu verändern.

| Exportformat | Wann verwenden? |
|-------------|-----------------|
| `.xlsx` | Empfänger soll weiterarbeiten können |
| `.pdf` | Endgültige Version, nicht bearbeitbar |
| `.csv` | Rohdaten für andere Programme |

**Übung 11.4 — Für die Weitergabe vorbereiten**

Die folgende Übungstabelle **Modul 11 4 Zusammenarbeit** ist bereits geladen.

1. Exportieren Sie die Tabelle als PDF.
2. Fügen Sie einen Kommentar in eine Zelle ein (Überprüfen → Neuer Kommentar).
3. Speichern Sie die Datei sowohl als `.xlsx` als auch als `.pdf`.



## Modul 12: Schutz und Sicherheit

**Lernziel:** Arbeitsmappen und Zellen schützen sowie die Produktivität durch
Tastenkombinationen steigern.

## 12.1. Zellen und Blätter schützen

###  Konzept: Nicht jeder soll alles ändern dürfen

Stellen Sie sich eine Budgettabelle vor, die an mehrere Abteilungsleiter geht. Die
Formeln sollen geschützt sein, aber jeder soll seine eigenen Zahlen eintragen können.
Der **Blattschutz** in Excel macht genau das: Sie legen fest, welche Zellen bearbeitbar
sind und welche gesperrt. Optional mit Passwort — für vertrauliche Daten.

**Die Schutzebenen in Excel:**

| Ebene | Was sie schützt | Typischer Einsatz |
|-------|----------------|-------------------|
| Zellsperre | Einzelne Zellen vor Änderung | Formeln, Referenzwerte |
| Blattschutz | Gesamtes Tabellenblatt | Vor versehentlichem Löschen |
| Arbeitsmappenschutz | Struktur (Blätter löschen/einfügen) | Verhindert Umstrukturierung |
| Passwort zum Öffnen | Gesamte Datei | Vertrauliche Daten |

 **Wichtig:** Alle Zellen sind standardmäßig gesperrt — aber die Sperre wirkt
erst, wenn Sie den Blattschutz aktivieren! Entsperren Sie zuerst die Zellen, die
bearbeitbar bleiben sollen (Strg+1 → Schutz → Gesperrt abwählen).

**Übung 12.1 — Schutz einrichten**

Die folgende Übungstabelle **Modul 12 1 Schutz** ist bereits geladen.

1. Entsperren Sie die Eingabezellen (B2:B10), lassen Sie die Formelzellen gesperrt.
2. Aktivieren Sie den Blattschutz und testen Sie: Eingabezellen sind bearbeitbar,

   andere Zellen nicht.
3. Schützen Sie die Arbeitsmappenstruktur, sodass keine Blätter gelöscht werden

   können.

## 12.2. Die wichtigsten Tastenkombinationen

###  Konzept: Maus spart Zeit — Tastatur spart mehr

Jedes Mal, wenn Ihre Hand die Tastatur verlässt, verlieren Sie rund 2 Sekunden. Bei
hunderten Aktionen pro Stunde summiert sich das dramatisch. Die wichtigsten
Tastenkombinationen zu beherrschen, macht Sie nicht nur schneller, sondern auch
präziser — denn Muscle Memory ist fehlerresistenter als Mausklicks.

**Die unverzichtbaren Top-10-Shortcuts:**

| Tastenkombination | Aktion | Merkhilfe |
|-------------------|--------|-----------|
| `Strg+C` / `Strg+V` / `Strg+X` | Kopieren / Einfügen / Ausschneiden | Wie überall |
| `Strg+Z` / `Strg+Y` | Rückgängig / Wiederherstellen | Ihr Sicherheitsnetz |
| `Strg+S` | Speichern | Alle 5 Minuten! |
| `Strg+1` | Zellen formatieren (Dialog) | Alles an einem Ort |
| `Strg+Umschalt+L` | Autofilter an/aus | L wie „Liste" |
| `Strg+Pos1` / `Strg+Ende` | Zum Anfang / Ende springen | Navigation |
| `Strg+Pfeiltasten` | Zum Rand des Datenbereichs | Große Tabellen |
| `F4` | Letzte Aktion wiederholen / Bezugstyp wechseln | Zwei Funktionen, eine Taste |
| `Alt+=` | AutoSumme | Schnelle Summierung |
| `Strg+T` | Als Tabelle formatieren | T wie Tabelle |

**Übung 12.2 — Tastenkombinationen üben**

Die folgende Übungstabelle **Modul 12 2 Tastenkombinationen** ist bereits geladen. Bearbeiten Sie sie
ausschließlich mit Tastenkombinationen:

1. `Strg+Umschalt+L` für Filter, dann mit Pfeiltasten navigieren.
2. `F4` zum Wiederholen einer Formatierung.
3. `Strg+1` zum Öffnen des Formatierungsdialogs.
4. `Alt+=` für automatische Summierung.

## 12.3. Dokumentinspektion

###  Konzept: Was Ihre Excel-Datei über Sie verrät

Excel-Dateien enthalten oft versteckte Informationen: den Namen des Autors,
Kommentare, ausgeblendete Zeilen oder Spalten und sogar frühere Versionen von
Daten. Bevor Sie eine Datei extern weitergeben, sollten Sie diese Metadaten
entfernen — genau wie Sie Ihren Namen von einem Geschenk abziehen, bevor Sie
es weiterverschenken.

**Die Dokumentinspektion prüft auf:**

- Kommentare und Anmerkungen
- Dokumenteigenschaften (Autor, Firma, Erstelldatum)
- Ausgeblendete Zeilen, Spalten und Tabellenblätter
- Kopf- und Fußzeilen
- Externe Verknüpfungen zu anderen Dateien

**Übung 12.3 — Dokument inspizieren**

Die folgende Übungstabelle **Modul 12 3 Inspektion** ist bereits geladen.

1. Führen Sie die Dokumentinspektion durch (Datei → Informationen → Auf Probleme

   überprüfen → Dokument prüfen).
2. Entfernen Sie alle gefundenen persönlichen Informationen.
3. Speichern Sie die bereinigte Version.



## Modul 13: Automatisierung mit Makros

**Lernziel:** Das Konzept der Makros verstehen und einfache Automatisierungen aufzeichnen.

**Hinweis zur Excel-lenz-Plattform:** Makros und VBA sind im Web-Simulator
nicht verfügbar. Die folgenden Übungen erfordern Microsoft Excel (Desktop-Version
mit `.xlsm`-Dateien). Auf der Plattform stehen Quiz-Fragen zu Makro-Konzepten
zur Verfügung.


## 13.1. Was sind Makros?

###  Konzept: Wiederkehrende Aufgaben nur einmal erledigen

Ein Makro ist ein **aufgezeichneter Arbeitsschritt**, den Excel auf Knopfdruck
wiederholen kann. Stellen Sie sich vor, Sie müssten jeden Morgen dieselben fünf
Formatierungsschritte an einem Tagesbericht ausführen. Mit einem Makro erledigen
Sie alle fünf Schritte mit einem Klick — nachdem Sie sie einmal aufgezeichnet haben.

Makros werden in der Programmiersprache **VBA** (Visual Basic for Applications)
gespeichert. Die gute Nachricht: Zum Aufzeichnen müssen Sie kein VBA können —
Excel schreibt den Code automatisch.

 **Wichtig:** Makros funktionieren nur in `.xlsm`-Dateien (Excel-Arbeitsmappe
mit Makros), nicht in normalen `.xlsx`-Dateien. Speichern Sie Makro-Arbeitsmappen
immer im `.xlsm`-Format.

**Übung 13.1 — Entwicklertools aktivieren**

Die folgende Übungstabelle **Modul 13 1 Entwicklertools** ist bereits geladen.

1. Aktivieren Sie die Registerkarte „Entwicklertools"

   (Datei → Optionen → Menüband anpassen → Entwicklertools).
2. Speichern Sie die Datei als `.xlsm` (Excel-Arbeitsmappe mit Makros).
3. Erkunden Sie die neue Registerkarte und identifizieren Sie die

   Schaltfläche „Makro aufzeichnen".

## 13.2. Makros aufzeichnen

###  Konzept: Excel schaut Ihnen zu und merkt sich jeden Schritt

Das Aufzeichnen eines Makros ist denkbar einfach: Sie klicken auf „Aufzeichnen",
führen Ihre Arbeitsschritte normal aus und klicken auf „Aufzeichnung beenden".
Excel hat jeden Mausklick und jede Tastatureingabe in VBA-Code übersetzt und
gespeichert.

Wichtig ist die Unterscheidung zwischen **absoluten** und **relativen** Bezügen
bei der Aufzeichnung:
- **Absolute Aufzeichnung**: Das Makro arbeitet immer in denselben Zellen (z.B. A1)
- **Relative Aufzeichnung**: Das Makro arbeitet relativ zur aktuellen Position

 **Tipp:** Für formatierende Makros, die Sie auf verschiedene Tabellen anwenden
wollen, nutzen Sie **relative Bezüge** bei der Aufzeichnung.

**Übung 13.2 — Makro aufzeichnen**

Die folgende Übungstabelle **Modul 13 2 Makro Aufzeichnen** ist bereits geladen.

1. Zeichnen Sie ein Makro auf, das die Überschriftenzeile fett formatiert,

   einen grauen Hintergrund gibt und Rahmen um den Datenbereich zieht.
2. Speichern Sie das Makro mit dem Namen „FormatBericht".
3. Führen Sie das Makro auf einem zweiten Tabellenblatt aus.
4. Weisen Sie das Makro einer Schaltfläche oder Form zu.

## 13.3. Der VBA-Editor

###  Konzept: Einen Blick unter die Motorhaube werfen

Nach der Aufzeichnung können Sie den erzeugten VBA-Code im **VBA-Editor** (`Alt+F11`)
ansehen und verstehen lernen. Der Editor zeigt den Code, den Excel automatisch
generiert hat — oft ausführlicher, als ein Programmierer ihn schreiben würde, aber
eine hervorragende Lernquelle.

**Die wichtigsten Bereiche des VBA-Editors:**

| Bereich | Funktion |
|---------|----------|
| Projekt-Explorer | Alle geöffneten Arbeitsmappen und ihre Bestandteile |
| Code-Fenster | Der eigentliche VBA-Code |
| Eigenschaften-Fenster | Eigenschaften von Blättern und Steuerelementen |
| Direktbereich | Befehle direkt testen (Strg+G zum Anzeigen) |

**Übung 13.3 — VBA-Editor erkunden**

Die folgende Übungstabelle **Modul 13 3 VBA Editor** ist bereits geladen.

1. Öffnen Sie den VBA-Editor mit `Alt+F11`.
2. Finden Sie im Projekt-Explorer das aufgezeichnete Makro aus der

   vorherigen Übung.
3. Lesen Sie den Code und identifizieren Sie Zeilen, die Formatierungen

   (`.Font.Bold = True`, `.Interior.Color`) vornehmen.

## 13.4. Grundbegriffe der VBA-Programmierung

###  Konzept: Vom Aufzeichnen zum Programmieren

Aufgezeichnete Makros arbeiten stur nach Schema — sie können keine Entscheidungen
treffen. Echte Automatisierung beginnt mit einfachen Programmierkonzepten:

| Konzept | Bedeutung | Beispiel |
|---------|-----------|----------|
| **Variable** | Ein benannter Speicherplatz für Werte | `Dim anzahl As Integer` |
| **Bedingung** | Code nur unter bestimmten Umständen ausführen | `If wert > 100 Then...` |
| **Schleife** | Code mehrmals wiederholen | `For i = 1 To 10... Next i` |
| **Sub** | Ein benanntes Makro (Unterprogramm) | `Sub MeinMakro()... End Sub` |

 **Tipp:** Auch wenn Sie nicht vorhaben, VBA-Programmierer zu werden — das
Verständnis dieser Grundbegriffe hilft Ihnen, aufgezeichnete Makros zu lesen,
anzupassen und Fehler zu beheben.

**Übung 13.4 — Einfaches VBA programmieren**

Die folgende Übungstabelle **Modul 13 4 VBA Programmieren** ist bereits geladen.

1. Schreiben Sie im VBA-Editor (`Alt+F11`) ein Makro, das mit einer `For`-Schleife

   die Zahlen 1 bis 10 in die Zellen A1 bis A10 schreibt.
2. Erweitern Sie das Makro um eine `If`-Bedingung: Zahlen über 5 sollen fett

   formatiert werden.
3. Führen Sie das Makro aus und prüfen Sie das Ergebnis.
