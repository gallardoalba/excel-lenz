# Alle Übungen — Anfaenger

**Gesamt:** 54 Übungen

---

## Modul 1: Einführung in Excel und die Arbeitsumgebung

## Übung 1.1: Erste Schritte


Öffnen Sie Excel, erstellen Sie eine neue Arbeitsmappe. Identifizieren Sie Registerkarten,
Namensfeld, Bearbeitungsleiste und Statusleiste. Speichern Sie als `Meine_Erste_Mappe.xlsx`.


---

### Lösung

**Lösung:**
1. **Excel öffnen:** Doppelklick auf das Excel-Symbol oder Startmenü → Excel.
2. **Neue Arbeitsmappe:** `Datei → Neu → Leere Arbeitsmappe` oder `Strg+N`.
3. **Oberfläche identifizieren:**
   - **Registerkarten** (Start, Einfügen, Seitenlayout…) befinden sich oben im Menüband.
   - **Namensfeld** steht links neben der Bearbeitungsleiste (zeigt die aktive Zelle, z.B. A1).
   - **Bearbeitungsleiste** ist das lange Eingabefeld rechts vom Namensfeld (zeigt Formeln/Inhalte).
   - **Statusleiste** ist die unterste Zeile (zeigt Bereit, Summe, Zoom).
4. **Speichern:** `Datei → Speichern unter → Durchsuchen`, Dateiname `Meine_Erste_Mappe.xlsx`, Speichern klicken. Oder `Strg+S` → Namen eingeben → Speichern.
   - **Ergebnis:** Die Datei wird im gewählten Ordner als `.xlsx` gespeichert.

---

## Übung 1.2: Die Oberfläche erkunden


Fügen Sie „Neu", „Öffnen" und „Schnelldruck" zur Schnellzugriff-Leiste hinzu.


---

### Lösung

**Lösung:**
1. Klicken Sie auf den kleinen Pfeil (▾) rechts in der **Schnellzugriff-Leiste** (ganz oben links).
2. Wählen Sie `Weitere Befehle…`.
3. Im Dropdown `Befehle auswählen` → `Datei` oder `Alle Befehle`.
4. Fügen Sie nacheinander hinzu:
   - **„Neu"** → `Hinzufügen >`
   - **„Öffnen"** → `Hinzufügen >`
   - **„Schnelldruck"** → `Hinzufügen >`
5. Klicken Sie `OK`.
   - **Ergebnis:** Die drei Symbole erscheinen nun dauerhaft in der Schnellzugriff-Leiste, unabhängig von der aktiven Registerkarte.

---

## Übung 1.3: Navigation üben


Erstellen Sie drei Blätter: Januar, Februar, März. Üben Sie Strg+Pos1, Strg+Ende.


---

### Lösung

**Lösung:**
1. **Drei neue Blätter erstellen:** Klicken Sie auf das `+`-Symbol unten links (neben den Blattreitern), dreimal. Benennen Sie die Blätter per Doppelklick um: `Januar`, `Februar`, `März`.
2. **Navigation üben:**
   - Schreiben Sie zuerst in einige Zellen Werte (z.B. in B5 und D10), damit das Blatt nicht leer ist.
   - Klicken Sie dann in Zelle A1.
   - `Strg+Ende` → Springt zur **letzten verwendeten Zelle** des Blattes (z.B. D10).
   - `Strg+Pos1` → Springt zurück zur Zelle **A1**.
   - Wiederholen Sie dies in allen drei Blättern.
   - **Ergebnis:** Sie beherrschen die Schnellnavigation zwischen Anfang und Ende eines Tabellenblattes.

---

## Übung 1.4: Dateien verwalten


Speichern Sie als `Inventar_2026.xlsx`, exportieren Sie als PDF.


---

### Lösung

**Lösung:**
1. **Als .xlsx speichern:** `Datei → Speichern unter → Durchsuchen`. Dateiname: `Inventar_2026.xlsx`. `Speichern`.
2. **Als PDF exportieren:** `Datei → Exportieren → PDF/XPS-Dokument erstellen`. Ordner wählen, Dateiname `Inventar_2026.pdf`. `Veröffentlichen`.
   - **Ergebnis:** Es existieren nun zwei Dateien im Zielordner: die bearbeitbare `.xlsx` und die schreibgeschützte `.pdf` zur Weitergabe.

---

## Modul 2: Dateneingabe und -bearbeitung

## Übung 2.1: Datentypen erkennen


Die folgende Übungstabelle **Modul 2 1 Datentypen** ist bereits geladen. Geben Sie in verschiedene Zellen ein:

- Ihren Namen (Text)

- Die Zahl 1500 (Zahl)

- Das heutige Datum

- Einen Geldbetrag wie `49,99 €`

Beobachten Sie die automatische Ausrichtung. Ändern Sie dann das Zahlenformat
einer Zelle über `Start → Zahl → Format auswählen`.


---

### Lösung

**Lösung:**
1. **Name eingeben (Text):** Zelle anklicken, z.B. A1. `Max Mustermann` tippen → `Enter`.
   - Beobachtung: Der Text steht **linksbündig**. Excel erkennt Buchstaben automatisch als Text.
2. **Zahl eingeben:** Zelle A2 anklicken, `1500` tippen → `Enter`.
   - Beobachtung: Die Zahl steht **rechtsbündig**. Excel erkennt rein numerische Eingaben als Zahlen und richtet sie rechts aus.
3. **Datum eingeben:** Zelle A3 anklicken, z.B. `04.08.2026` tippen → `Enter`.
   - Beobachtung: Das Datum steht **rechtsbündig**. Excel hat es als Datum erkannt.
4. **Geldbetrag eingeben:** Zelle A4 anklicken, `49,99 €` tippen → `Enter`.
   - Beobachtung: Steht **rechtsbündig**. Excel erkennt das €-Symbol als Währungsformat.
5. **Zahlenformat ändern:** Zelle A2 markieren. `Start → Zahl → Dropdown (Standard) → Währung` wählen.
   - **Ergebnis:** `1500` wird als `1.500,00 €` angezeigt. Der tatsächliche Wert bleibt 1500, nur die Anzeige ändert sich.

---

## Übung 2.2: Zellen bearbeiten


Die folgende Übungstabelle **Modul 2 2 Bearbeiten** ist bereits geladen. Die Tabelle enthält absichtlich
Rechtschreibfehler. Korrigieren Sie jede fehlerhafte Zelle auf drei Arten:

1. Mit Doppelklick in die Zelle
2. Mit der Taste `F2`
3. Über die Bearbeitungsleiste

Machen Sie eine Korrektur mit `Strg+Z` rückgängig, dann mit `Strg+Y` wiederherstellen.


---

### Lösung

**Lösung:**
1. **Doppelklick in die Zelle:** Auf fehlerhafte Zelle doppelklicken → der Cursor erscheint im Zellinhalt. Fehler korrigieren → `Enter`.
2. **Taste F2:** Fehlerhafte Zelle auswählen → `F2` drücken → Bearbeitungsmodus aktiv → korrigieren → `Enter`.
3. **Über Bearbeitungsleiste:** Fehlerhafte Zelle anklicken → in der Bearbeitungsleiste (oberhalb des Gitters) den Text korrigieren → `Enter`.
4. **Rückgängig/Wiederherstellen:** Nach einer Korrektur `Strg+Z` drücken → Änderung wird rückgängig gemacht. Dann `Strg+Y` → Änderung wird wiederhergestellt.
   - **Ergebnis:** Sie kennen drei verschiedene Wege, Zellinhalte zu bearbeiten, und wissen, wie Sie Änderungen rückgängig machen können.

---

## Übung 2.3: AutoAusfüllen verwenden


Die folgende Übungstabelle **Modul 2 3 AutoAusfuellen** ist bereits geladen.

1. Schreiben Sie `Januar` in Zelle A1 und ziehen Sie am Ausfüllkästchen bis A12.
2. Schreiben Sie `1` in B1, `3` in B2, markieren Sie beide und ziehen Sie bis B10.
3. Schreiben Sie das heutige Datum in C1 und erstellen Sie eine fortlaufende

   Datumsreihe für 30 Tage.


---

### Lösung

**Lösung:**
1. **Monatsreihe:** `Januar` in A1 schreiben. Zelle A1 markieren → das kleine Quadrat rechts unten (Ausfüllkästchen) anklicken und bei gedrückter Maustaste bis A12 ziehen.
   - Ergebnis: A1:A12 zeigt `Januar, Februar, März … Dezember`.
2. **Zahlenfolge (Schritt 2):** `1` in B1, `3` in B2. Beide Zellen (B1:B2) markieren → Ausfüllkästchen bis B10 ziehen.
   - Ergebnis: B1:B10 zeigt `1, 3, 5, 7, 9, 11, 13, 15, 17, 19` (Excel erkennt den Schritt +2).
3. **Datumsreihe:** Heutiges Datum (z.B. `04.08.2026`) in C1. C1 markieren → Ausfüllkästchen bis C30 ziehen.
   - Ergebnis: C1:C30 zeigt 30 aufeinanderfolgende Tage ab dem Startdatum.

---

## Übung 2.4: Kopieren und Einfügen


Die folgende Übungstabelle **Modul 2 4 Kopieren** ist bereits geladen.

1. Kopieren Sie die Tabelle `A1:D10` und fügen Sie sie ab `F1` ein.
2. Kopieren Sie dieselbe Tabelle und fügen Sie sie mit „Transponieren" ab `F15` ein.
3. Kopieren Sie eine Zelle mit Formel und fügen Sie mit „Werte" ein — beobachten

   Sie den Unterschied.


---

### Lösung

**Lösung:**
1. **Tabelle kopieren:** Bereich `A1:D10` markieren → `Strg+C`. Zelle `F1` anklicken → `Strg+V`.
   - Ergebnis: Die Tabelle erscheint ein zweites Mal ab Spalte F.
2. **Transponieren:** `A1:D10` markieren → `Strg+C`. Zelle `F15` anklicken → `Strg+Alt+V` → `T` für Transponieren → `Enter`. (Alternativ per Maus: Rechtsklick → `Inhalte einfügen…` → `Transponieren` → `OK`.)
   - Ergebnis: Zeilen und Spalten sind vertauscht (aus 10 Zeilen × 4 Spalten wird 4 Zeilen × 10 Spalten).
3. **Werte einfügen:** Zelle mit Formel (z.B. `=B2*C2`) kopieren → `Strg+C`. Zielzelle anklicken → `Strg+Alt+V` → `W` → `Enter`.
   - Ergebnis: Nur das **Ergebnis** der Formel erscheint (z.B. 42), nicht die Formel selbst. Nützlich, wenn Sie Ergebnisse ohne Formelbezüge übertragen wollen.

---

## Modul 3: Format und Zellstil

## Übung 3.1: Grundformatierung anwenden


Die folgende Übungstabelle **Modul 3 1 Grundformatierung** ist bereits geladen. Formatieren Sie die Tabelle so:

1. Überschriftenzeile: fett, dunkelblauer Hintergrund, weiße Schrift
2. Datenzellen: dünne graue Rahmen, wechselnde Zeilenfarbe (weiß/hellgrau)
3. Titel: über die gesamte Tabellenbreite verbinden und zentrieren
4. Lange Textzellen: Zeilenumbruch aktivieren


---

### Lösung

**Lösung:**
1. **Überschriftenzeile formatieren:** Zeile 1 markieren → `Start → Fett (Strg+F)` → `Füllfarbe → Dunkelblau` → `Schriftfarbe → Weiß`.
2. **Datenzellen formatieren:** Datenbereich markieren und in eine Tabelle umwandeln: `Start → Als Tabelle formatieren (Strg+T)` → Design mit wechselnden Zeilenfarben wählen. Rahmen anpassen: `Tabellenentwurf → Rahmen → Alle Rahmen`.
3. **Titel verbinden und zentrieren:** Den Bereich des Titels (z.B. A1:F1) markieren → `Start → Verbinden und zentrieren`. Der Titel steht nun mittig über allen Spalten.
4. **Zeilenumbruch:** Lange Textzellen markieren → `Start → Zeilenumbruch`. Der Text fließt innerhalb der Zelle in mehreren Zeilen.
   - **Ergebnis:** Professionell formatierte Tabelle mit deutlichen Überschriften, klaren Rahmen und gut lesbarem Layout.

---

## Übung 3.2: Zahlen formatieren


Die folgende Übungstabelle **Modul 3 2 Zahlenformat** ist bereits geladen.

1. Formatieren Sie Spalte B als „Währung" mit €-Symbol und 2 Dezimalstellen.
2. Formatieren Sie Spalte C als „Prozent" mit 1 Dezimalstelle.
3. Formatieren Sie Spalte D als „Zahl" mit Tausendertrennzeichen.
4. Experimentieren Sie mit der Schaltfläche „Dezimalstelle hinzufügen/entfernen".


---

### Lösung

**Lösung:**
1. **Währungsformat:** Spalte B markieren → `Start → Zahl → Dropdown → Währung` oder `Strg+1 → Zahlen → Währung`. Symbol: €, Dezimalstellen: 2.
2. **Prozentformat:** Spalte C markieren → `Start → Zahl → Prozent`. Dezimalstellen über `Dezimalstelle hinzufügen/entfernen` auf 1 einstellen. Hinweis: Der Wert 0,19 wird als 19,0% angezeigt.
3. **Zahlenformat:** Spalte D markieren → `Strg+1 → Zahlen → Zahl`. Tausendertrennzeichen aktivieren (Häkchen setzen).
4. **Dezimalstellen anpassen:** Zahl markieren → im Start-Menü `Dezimalstelle hinzufügen` (→ mehr Nachkommastellen) oder `Dezimalstelle entfernen` je nach Bedarf klicken.
   - **Ergebnis:** Alle drei Spalten sind korrekt und einheitlich formatiert.

---

## Übung 3.3: Layout anpassen


Die folgende Übungstabelle **Modul 3 3 Layout** ist bereits geladen.

1. Passen Sie alle Spalten mit Doppelklick automatisch an den Inhalt an.
2. Blenden Sie Spalte C („Interne Notiz") aus und wieder ein.
3. Fügen Sie zwischen Zeile 3 und 4 eine neue leere Zeile ein.
4. Ändern Sie die Höhe von Zeile 1 (Titelzeile) manuell auf 30.


---

### Lösung

**Lösung:**
1. **Spalten automatisch anpassen:** Auf die Trennlinie zwischen den Spaltenköpfen (z.B. zwischen A und B) doppelklicken. Alternativ: Alle Spalten markieren → `Start → Format → Spaltenbreite automatisch anpassen`.
2. **Spalte C ausblenden:** Spaltenkopf C anklicken (ganze Spalte markieren) → Rechtsklick → `Ausblenden`. Zum Einblenden: Spalten B und D markieren → Rechtsklick → `Einblenden`.
3. **Leere Zeile einfügen:** Zeilenkopf 4 anklicken → Rechtsklick → `Zellen einfügen`. Es entsteht eine neue leere Zeile 4, die alten Daten rutschen nach unten.
4. **Zeilenhöhe ändern:** Zeilenkopf 1 anklicken → Rechtsklick → `Zeilenhöhe…` → `30` eingeben → `OK`.
   - **Ergebnis:** Gut strukturiertes Layout mit optimalen Spaltenbreiten und hervorgehobener Titelzeile.

---

## Übung 3.4: Bedingte Formatierung anwenden


Die folgende Übungstabelle **Modul 3 4 Bedingte Formatierung** ist bereits geladen.

1. Markieren Sie die Umsatzzahlen und wenden Sie „Datenbalken" an (Start → Bedingte

   Formatierung → Datenbalken).
2. Heben Sie alle Werte über 10.000 € mit roter Füllung hervor.
3. Wenden Sie eine Farbskala (grün-weiß-rot) auf die Rabattspalte an.
4. Ändern Sie einen Wert auf 15.000 € und beobachten Sie die automatische Anpassung.


---

### Lösung

**Lösung:**
1. **Datenbalken:** Umsatzzahlen markieren (z.B. B2:B20). `Start → Bedingte Formatierung → Datenbalken → Einfarbige Füllung (blau)`. Es erscheinen farbige Balken innerhalb der Zellen proportional zum Wert.
2. **Werte über 10.000 € hervorheben:** Gleichen Bereich markieren → `Start → Bedingte Formatierung → Regeln zum Hervorheben → Größer als…`. `10000` eingeben, Format `Rote Füllung` wählen → `OK`.
3. **Farbskala auf Rabattspalte:** Rabattspalte (z.B. D2:D20) markieren → `Bedingte Formatierung → Farbskalen → Rot-Weiß-Grün` wählen. Nun: Grün = hohe Werte (gut), Rot = niedrige Werte.
4. **Wert ändern:** Einen Umsatzwert auf `15.000` ändern. Beobachtung: Der Datenbalken wird länger, und falls bereits über 10.000, erscheint die rote Füllung automatisch.
   - **Ergebnis:** Sie haben drei Arten der bedingten Formatierung eingesetzt, die sich dynamisch an Datenänderungen anpassen.

---

## Modul 4: Formeln und Grundfunktionen

## Übung 4.1: Erste Formeln schreiben


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


---

### Lösung

**Lösung:**
1. **Summe:** In Zelle D2 eingeben: `=B2+C2` → `Enter`. Ergebnis: Wert aus B2 + Wert aus C2.
2. **Produkt:** In Zelle D3: `=B3*C3` → `Enter`. Ergebnis: Multiplikation.
3. **Durchschnitt:** In Zelle D4: `=(B4+C4)/2` → `Enter`. Die Klammern sind wichtig: erst Addition, dann Division.
4. **Quadrat:** In Zelle D5: `=B5^2` → `Enter`. Ergebnis: B5 hoch 2.
5. **Punkt-vor-Strich-Test:** In eine leere Zelle: `=10+5*2` → Ergebnis: `20` (5×2=10, 10+10=20). In nächste Zelle: `=(10+5)*2` → Ergebnis: `30` (Klammer zuerst: 10+5=15, 15×2=30).
   - **Lernziel:** Sie verstehen die mathematischen Operatoren und die Regel "Punkt vor Strich".

---

## Übung 4.2: Zellbezüge verstehen


Die folgende Übungstabelle **Modul 4 2 Zellbezuege** ist bereits geladen.

1. Berechnen Sie in C2 den Bruttopreis mit `=B2*(1+$F$1)`, wobei F1 den MwSt-Satz

   (19%) enthält. Kopieren Sie die Formel nach unten. Der Bezug auf F1 muss absolut sein!
2. Erstellen Sie eine kleine Einmaleins-Tabelle (1×1 bis 10×10) mit gemischten Bezügen.
3. Testen Sie mit F4, wie sich der Bezugstyp ändert.


---

### Lösung

**Lösung:**
1. **Bruttopreis mit absolutem Bezug:**
   - Zelle F1 enthält `19%` (0,19).
   - In C2: `=B2*(1+$F$1)` → `Enter`. Ergebnis: Nettopreis × 1,19.
   - C2 nach unten kopieren (Ausfüllkästchen doppelklicken). Der Bezug auf $F$1 bleibt fixiert; B2 wird zu B3, B4 usw.
2. **Einmaleins-Tabelle mit gemischten Bezügen:**
   - In B2: `=$A2*B$1` (Zeile 1 hat 1 bis 10, Spalte A hat 1 bis 10).
   - Formel nach rechts und unten kopieren. $A fixiert Spalte A, $1 fixiert Zeile 1.
   - Ergebnis: Vollständiges 10×10-Einmaleins.
3. **F4-Taste testen:** In einer Formel auf einen Zellbezug klicken (z.B. A1) → `F4` drücken. Der Bezug wechselt: A1 → $A$1 → A$1 → $A1 → A1.
   - **Merkhilfe:** Das `$`-Zeichen ist wie ein Anker. `$A` fixiert die Spalte, `$1` fixiert die Zeile.
   - **Lernziel:** Sie unterscheiden relative, absolute und gemischte Bezüge sicher.

---

## Übung 4.3: Namen definieren


Die folgende Übungstabelle **Modul 4 3 Namen** ist bereits geladen.

1. Definieren Sie für die Zelle mit dem MwSt-Satz den Namen `MwSt`.
2. Ersetzen Sie in der Bruttopreis-Formel `$F$1` durch `MwSt`.
3. Definieren Sie für die gesamte Preistabelle den Namen `Preisliste`.
4. Verwenden Sie den Namen in einer einfachen Formel, z.B. `=SUMME(Preisliste)`
   oder `=MITTELWERT(Preisliste)`.


---

### Lösung

**Lösung:**
1. **Namen definieren:** Zelle mit MwSt-Satz (z.B. F1) markieren → In das **Namensfeld** (links neben Bearbeitungsleiste) klicken → `MwSt` eingeben → `Enter`.
   - **Hinweis:** Namen dürfen keine Leerzeichen enthalten, nicht mit einer Zahl beginnen und keine Sonderzeichen (außer `_`) nutzen.
2. **Namen in Formel einsetzen:** In der Bruttopreis-Formel `$F$1` durch `MwSt` ersetzen: Aus `=B2*(1+$F$1)` wird `=B2*(1+MwSt)`.
3. **Bereichsnamen definieren:** Gesamte Preistabelle (z.B. A1:D20) markieren → Namensfeld → `Preisliste` → `Enter`.
4. **Namen verwenden:** In einer leeren Zelle: `=SUMME(Preisliste)` → summiert alle Zahlenwerte in Preisliste. Oder: `=MITTELWERT(Preisliste)` → zeigt den Durchschnitt.
   - **Lernziel:** Namen machen Formeln lesbarer und die Arbeitsmappe wartbarer.

---

## Übung 4.4: Statistische Funktionen anwenden


Die folgende Übungstabelle **Modul 4 4 Statistik** ist bereits geladen.

1. Berechnen Sie mit `SUMME` die Gesamtsumme der Verkäufe.
2. Ermitteln Sie den `MITTELWERT`, die kleinste (`MIN`) und größte (`MAX`) Bestellung.
3. Zählen Sie mit `ANZAHL` die Anzahl der Verkaufseinträge.
4. Zählen Sie mit `ANZAHL2` alle nicht-leeren Zellen in Spalte A (Kundennamen).
5. Testen Sie die AutoSumme-Schaltfläche: Klicken Sie unter eine Zahlenspalte und

   dann auf Summe.


---

### Lösung

**Lösung:**
1. **SUMME:** `=SUMME(C2:C50)` (oder den passenden Bereich wählen) → zeigt die Gesamtsumme aller Verkäufe.
2. **Statistische Kennzahlen:**
   - `=MITTELWERT(C2:C50)` → Durchschnittlicher Bestellwert.
   - `=MIN(C2:C50)` → Kleinste Bestellung.
   - `=MAX(C2:C50)` → Größte Bestellung.
3. **ANZAHL:** `=ANZAHL(C2:C50)` → zählt nur Zellen mit Zahlen in Spalte C.
4. **ANZAHL2:** `=ANZAHL2(A2:A50)` → zählt alle nicht-leeren Zellen in Spalte A (Kundennamen, auch wenn Text).
5. **AutoSumme testen:** Unter eine Zahlenspalte klicken (z.B. C51) → `Start → AutoSumme (Σ)` oder `Alt+=` → Excel schlägt automatisch `=SUMME(C2:C50)` vor → `Enter`.
   - **Ergebnis:** Sie beherrschen die fünf wichtigsten statistischen Grundfunktionen.

---

## Übung 4.5: Die WENN-Funktion einsetzen


Die folgende Übungstabelle **Modul 4 5 WENN** ist bereits geladen.

1. Schreiben Sie in D2: `=WENN(C2>1000; "Großauftrag"; "Standard")` und kopieren

   Sie die Formel nach unten.
2. In E2: `=WENN(C2>5000; C2*0,1; 0)` für 10% Bonus ab 5.000 €.
3. In F2: `=WENN(UND(B2="Nord"; C2>2000); "Priorität"; "")` — kombinieren Sie

   WENN mit UND für zwei Bedingungen.


---

### Lösung

**Lösung:**
1. **WENN für Kategorisierung:** In D2: `=WENN(C2>1000; "Großauftrag"; "Standard")` → Formel mit Ausfüllkästchen nach unten kopieren.
   - Zeilen mit C > 1000 zeigen "Großauftrag", alle anderen "Standard".
2. **WENN mit Berechnung:** In E2: `=WENN(C2>5000; C2*0,1; 0)` → kopieren.
   - Bei Umsatz > 5000 wird 10% Bonus berechnet, sonst 0.
3. **WENN mit UND:** In F2: `=WENN(UND(B2="Nord"; C2>2000); "Priorität"; "")` → kopieren.
   - Nur wenn BEIDE Bedingungen wahr sind (Region=Nord UND Umsatz>2000), erscheint "Priorität"; sonst leere Zelle.
   - **Lernziel:** Sie können die WENN-Funktion für einfache und kombinierte (UND) Bedingungen einsetzen.

---

## Modul 5: Datenbereinigung und Validierung

## Übung 5.1: Datenvalidierung einrichten


Die folgende Übungstabelle **Modul 5 1 Validierung** ist bereits geladen.

1. Erstellen Sie eine Dropdown-Liste in Spalte B („Abteilung") mit den Optionen:

   „Vertrieb", „Marketing", „IT", „Personal", „Finanzen".
2. Begrenzen Sie Spalte C („Gehalt") auf ganze Zahlen zwischen 30.000 und 120.000.
3. Fügen Sie eine Eingabemeldung hinzu: „Bitte wählen Sie eine Abteilung aus."
4. Fügen Sie eine Fehlermeldung bei ungültigem Gehalt hinzu.


---

### Lösung

**Lösung:**
1. **Dropdown-Liste erstellen:**
   - Spalte B (Abteilung) markieren (z.B. B2:B50).
   - `Daten → Datenüberprüfung (Datentools-Gruppe)`.
   - Register `Einstellungen`: Zulassen: `Liste`.
   - Quelle: `Vertrieb;Marketing;IT;Personal;Finanzen` (Semikolon-getrennt) → `OK`.
2. **Ganze Zahlen begrenzen:**
   - Spalte C (Gehalt) markieren.
   - `Daten → Datenüberprüfung` → Einstellungen: Zulassen: `Ganze Zahl`.
   - Minimum: `30000`, Maximum: `120000` → `OK`.
3. **Eingabemeldung:** In den Datenüberprüfungs-Einstellungen → Register `Eingabemeldung`.
   - Titel: `Abteilung`, Eingabemeldung: `Bitte wählen Sie eine Abteilung aus.`
4. **Fehlermeldung:** Register `Fehlermeldung` → Typ: `Stopp`.
   - Titel: `Ungültiges Gehalt`, Fehlermeldung: `Bitte geben Sie ein Gehalt zwischen 30.000 und 120.000 ein.`
   - **Ergebnis:** Eingabefehler werden bereits bei der Eingabe verhindert.

---

## Übung 5.2: Daten bereinigen


Die folgende Übungstabelle **Modul 5 2 Bereinigen** ist bereits geladen.

1. Entfernen Sie alle doppelten Einträge mit „Daten → Duplikate entfernen".
2. Trennen Sie die Spalte „Name, Vorname" mit „Text in Spalten" in zwei Spalten.
   Achten Sie darauf, das führende Leerzeichen nach dem Komma zu entfernen
   (z.B. mit der Funktion `GLÄTTEN()` oder im Text-in-Spalten-Assistent).
3. Testen Sie das Blitzschnelle Ausfüllen: Extrahieren Sie die Initialen aus

   einer Namensliste.


---

### Lösung

**Lösung:**
1. **Duplikate entfernen:** Gesamte Tabelle markieren → `Daten → Duplikate entfernen` (Datentools). Spalten auswählen, die auf Duplikate geprüft werden sollen → `OK`.
2. **Text in Spalten:** Spalte "Name, Vorname" markieren → `Daten → Text in Spalten`. `Getrennt` → `Weiter`. Trennzeichen: `Komma` → `Weiter`. Ziel: B1 → `Fertig stellen`. Die Vornamen stehen nun in Spalte B (z.B. " Max" mit führendem Leerzeichen). In C1: `=GLÄTTEN(B1)`, nach unten kopieren. Spalte C kopieren → auf B1 klicken → `Strg+Alt+V` → `W` (Werte). Hilfsspalte C löschen.
3. **Blitzschnelles Ausfüllen (Strg+E):** In die Nachbarzelle die gewünschten Initialen manuell eintippen (z.B. aus "Max Müller" → "MM"). `Strg+E` drücken → Excel füllt den Rest automatisch.
   - **Ergebnis:** Saubere, von Duplikaten und Formatierungsfehlern befreite Daten.

---

## Übung 5.3: Daten konsolidieren


Die folgende Übungstabelle **Modul 5 3 Konsolidierung** ist bereits geladen.

1. Nutzen Sie „Daten → Konsolidieren", um die drei Monatsblätter zu einem

   Jahresüberblick zusammenzufassen.
2. Verlinken Sie die konsolidierten Werte mit den Quelldaten, sodass Änderungen

   automatisch übernommen werden.


---

### Lösung

**Lösung:**
1. **Daten konsolidieren:**
   - Neues Blatt `Jahresüberblick` erstellen. Zelle A1 anklicken.
   - `Daten → Konsolidieren` (Datentools).
   - Funktion: `Summe`.
   - Verweis: Blatt `Januar` auswählen, Datenbereich markieren → `Hinzufügen`. Wiederholen für `Februar` und `März`.
   - `OK` klicken.
2. **Verknüpfung aktivieren:**
   - Im Konsolidieren-Dialog: Häkchen bei `Verknüpfung mit den Quelldaten` setzen.
   - `OK` → Excel erstellt eine Gliederung, die sich bei Änderungen in den Monatsblättern automatisch aktualisiert.
   - **Ergebnis:** Ein Jahresüberblick, der alle drei Monate zusammenfasst und aktualisierbar bleibt.

---

## Übung 5.4: Daten importieren


Die folgende Übungstabelle **Modul 5 4 Import** ist bereits geladen.

1. Importieren Sie eine bereitgestellte `.csv`-Datei über „Daten → Aus Text/CSV".
2. Prüfen Sie die Vorschau und passen Sie Trennzeichen und Kodierung an.
3. Laden Sie die Daten in ein neues Tabellenblatt und aktualisieren Sie die Verbindung.


---

### Lösung

**Lösung:**
1. **CSV importieren:** `Daten → Aus Text/CSV` (in aktuellen Versionen: `Daten → Daten abrufen → Aus Text/CSV`). Die bereitgestellte `.csv`-Datei auswählen → `Importieren`.
2. **Vorschau prüfen:**
   - Trennzeichen: Meistens `Semikolon` oder `Komma` (im Dropdown anpassen, bis die Daten korrekt in Spalten erscheinen).
   - Kodierung: `UTF-8` für Umlaute (ä, ö, ü, ß) wählen.
   - `Laden` klicken.
3. **Daten laden und aktualisieren:**
   - Im Dialog `Daten laden in…` → `Neues Tabellenblatt` → `OK`.
   - Bei Änderungen in der Quell-CSV: `Daten → Alle aktualisieren` → die Tabelle wird aktualisiert.
   - **Ergebnis:** Externe CSV-Daten sind in Excel importiert und bleiben mit der Quelle verbunden.

---

## Modul 6: Tabellen und Filter

## Übung 6.1: Suchen und Ersetzen


Die folgende Übungstabelle **Modul 6 1 Suchen Ersetzen** ist bereits geladen.

1. Suchen Sie mit `Strg+F` alle Vorkommen von „München".
2. Ersetzen Sie mit `Strg+H` alle „München" durch „München (Zentrale)".
3. Suchen Sie mit der Option „Gesamten Zellinhalt vergleichen" nach „500" und
   beobachten Sie den Unterschied zur Suche ohne diese Option.


---

### Lösung

**Lösung:**
1. **Suchen:** `Strg+F` → Suchfeld: `München` → `Alle suchen` oder `Weitersuchen`. Excel markiert nacheinander jede Zelle mit "München".
2. **Ersetzen:** `Strg+H` → Suchfeld: `München`, Ersetzen durch: `München (Zentrale)` → `Alle ersetzen`. Alle Vorkommen werden auf einmal aktualisiert.
3. **Gesamten Zellinhalt vergleichen:**
   - `Strg+F` → Suchfeld: `500` → `Optionen >>` erweitern.
   - Häkchen bei `Gesamten Zellinhalt vergleichen` setzen.
   - **Ohne Haken:** Findet auch "1500", "5000" usw. (500 ist enthalten).
   - **Mit Haken:** Findet NUR Zellen, die exakt "500" enthalten.
   - **Ergebnis:** Sie können gezielt suchen und ersetzen — mit und ohne exakte Übereinstimmung.

---

## Übung 6.2: Fenster einfrieren


Die folgende Übungstabelle **Modul 6 2 Fenster fixieren** ist bereits geladen.

1. Fixieren Sie die oberste Zeile und scrollen Sie nach unten.
2. Heben Sie die Fixierung auf (Ansicht → Fenster einfrieren → Fixierung aufheben).
3. Fixieren Sie Zeile 1 UND Spalte A gleichzeitig.
4. Scrollen Sie diagonal und beobachten Sie, was fixiert bleibt.


---

### Lösung

**Lösung:**
1. **Oberste Zeile fixieren:** `Ansicht → Fenster einfrieren → Oberste Zeile fixieren`. Nach unten scrollen → Zeile 1 bleibt sichtbar.
2. **Fixierung aufheben:** `Ansicht → Fenster einfrieren → Fixierung aufheben`.
3. **Zeile 1 UND Spalte A fixieren:** Zelle `B2` anklicken (die Zelle UNTER und RECHTS des zu fixierenden Bereichs). `Ansicht → Fenster einfrieren → Fenster einfrieren`. Jetzt bleiben Zeile 1 und Spalte A beim Scrollen sichtbar.
4. **Diagonal scrollen:** Sowohl vertikal als auch horizontal scrollen. Zeile 1 (oben) und Spalte A (links) bleiben fixiert, der Rest bewegt sich.
   - **Ergebnis:** Überschriften und Beschriftungen sind immer sichtbar.

---

## Übung 6.3: Sortieren üben


Die folgende Übungstabelle **Modul 6 3 Sortieren** ist bereits geladen.

1. Sortieren Sie die Kundentabelle alphabetisch nach Nachname (A→Z).
2. Sortieren Sie nach Bestellwert absteigend (höchster zuerst).
3. Führen Sie eine mehrstufige Sortierung durch: zuerst nach Land, dann nach

   Bestellwert innerhalb jedes Landes.


---

### Lösung

**Lösung:**
1. **Alphabetisch sortieren (A→Z):** In die Spalte "Nachname" klicken → `Daten → Sortieren (A→Z)`. Die gesamte Tabelle wird nach Nachnamen alphabetisch sortiert.
2. **Absteigend sortieren (Z→A):** In die Spalte "Bestellwert" klicken → `Daten → Sortieren (Z→A)`. Höchster Wert zuerst.
3. **Mehrstufige Sortierung:**
   - In die Tabelle klicken → `Daten → Sortieren`.
   - 1. Ebene: Spalte `Land`, Sortierung `A bis Z`.
   - `Ebene hinzufügen`: Spalte `Bestellwert`, Sortierung `Absteigend`.
   - `OK` → Daten sind erst nach Land gruppiert, innerhalb jedes Landes nach Bestellwert geordnet.
   - **Ergebnis:** Sie können einfache und komplexe Sortierungen durchführen.

---

## Übung 6.4: Filtern anwenden


Die folgende Übungstabelle **Modul 6 4 Filtern** ist bereits geladen.

1. Aktivieren Sie den Autofilter (`Strg+Umschalt+L`).
2. Filtern Sie nur Bestellungen aus „Berlin".
3. Filtern Sie Bestellwerte über 500 €.
4. Kombinieren Sie beide Filter und zählen Sie die sichtbaren Zeilen.


---

### Lösung

**Lösung:**
1. **Autofilter aktivieren:** In die Tabelle klicken → `Strg+Umschalt+L` oder `Daten → Filtern`. Pfeilsymbole erscheinen in der Kopfzeile.
2. **Nach Berlin filtern:** Pfeil in Spalte "Stadt" → Suchfeld: `Berlin` → Häkchen nur bei Berlin → `OK`.
   - Nur Berlin-Bestellungen sind sichtbar; andere Zeilen sind ausgeblendet (nicht gelöscht).
3. **Werte über 500 filtern:** Pfeil in Spalte "Bestellwert" → `Zahlenfilter → Größer als…` → `500` → `OK`.
4. **Kombinierte Filter zählen:** In der Statusleiste erscheint `ANZAHL: X von Y Datensätzen gefunden`. Oder: `=TEILERGEBNIS(3; A2:A100)` (3 = ANZAHL2, zählt sichtbare Text- und Zahleneinträge) oder `=TEILERGEBNIS(2; C2:C100)` (2 = ANZAHL, zählt nur sichtbare Zahlen).
   - **Ergebnis:** Sie beherrschen das Filtern mit mehreren Kriterien gleichzeitig.

---

## Übung 6.5: Excel-Tabellen verwenden


Die folgende Übungstabelle **Modul 6 5 Tabellen** ist bereits geladen.

1. Wandeln Sie den Datenbereich mit `Strg+T` in eine Excel-Tabelle um.
2. Wählen Sie ein Tabellenformat mit wechselnden Zeilenfarben.
3. Fügen Sie eine neue Zeile hinzu und beobachten Sie die automatische Formatierung.
4. Nutzen Sie einen strukturierten Verweis: `=[@Menge]*[@Preis]` in der Spalte „Summe".


---

### Lösung

**Lösung:**
1. **In Excel-Tabelle umwandeln:** In den Datenbereich klicken → `Strg+T` oder `Start → Als Tabelle formatieren`. Bereich bestätigen → `OK`.
2. **Tabellenformat wählen:** In der Registerkarte `Tabellenentwurf` ein Format mit wechselnden Zeilenfarben wählen.
3. **Neue Zeile hinzufügen:** In die erste leere Zeile unter der Tabelle einen Wert eingeben → Excel erweitert die Tabelle automatisch. Formatierung und Formeln werden übernommen.
4. **Strukturierter Verweis:** In der Spalte "Summe" eingeben: `=[@Menge]*[@Preis]` → `Enter`.
   - `[@Menge]` verweist auf die Zelle in der Spalte "Menge" derselben Zeile.
   - Die Formel wird automatisch auf alle Zeilen der Tabelle angewendet.
   - **Ergebnis:** Sie nutzen intelligente Excel-Tabellen mit selbsterklärenden strukturierten Verweisen.

---

## Übung 6.6: Teilergebnisse berechnen


Die folgende Übungstabelle **Modul 6 6 Teilergebnisse** ist bereits geladen.

1. Sortieren Sie die Tabelle zuerst nach „Region".
2. Fügen Sie über „Daten → Teilergebnis" automatische Summen für jede Region ein.
3. Nutzen Sie die Gliederungssymbole (1, 2, 3 am linken Rand), um zwischen

   Detail- und Übersichtsansicht zu wechseln.


---

### Lösung

**Lösung:**
1. **Nach Region sortieren:** In die Spalte "Region" klicken → `Daten → Sortieren (A→Z)`. (Vorraussetzung für Teilergebnisse!)
2. **Teilergebnisse einfügen:**
   - `Daten → Teilergebnis` (Gliederung-Gruppe).
   - Gruppieren nach: `Region`.
   - Funktion: `Summe`.
   - Werte: `Umsatz` (Häkchen setzen) → `OK`.
3. **Gliederungssymbole nutzen:**
   - Links erscheinen Gliederungsebenen 1, 2, 3.
   - `1` klicken → nur die Gesamtsumme.
   - `2` klicken → Summen pro Region.
   - `3` klicken → alle Detailzeilen.
   - **Ergebnis:** Automatische Zwischensummen mit flexibler Gliederung.

---

## Modul 7: Erweiterte Funktionen

## Übung 7.1: Bedingte Summen und Zählungen


Die folgende Übungstabelle **Modul 7 1 Bedingte Summen** ist bereits geladen.

1. Berechnen Sie mit `SUMMEWENN` den Gesamtumsatz für die Region „Nord".
2. Berechnen Sie mit `SUMMEWENNS` den Umsatz für „Nord" UND Produkt „Laptop".
3. Zählen Sie mit `ZÄHLENWENN` alle Bestellungen über 1.000 €.
4. Zählen Sie mit `ZÄHLENWENNS` Großbestellungen (> 1.000 €) in der Region „Süd".


---

### Lösung

**Lösung:**
1. **SUMMEWENN:** `=SUMMEWENN(A2:A100; "Nord"; C2:C100)`
   - A2:A100 = Regionsspalte, "Nord" = Kriterium, C2:C100 = Summenspalte (Umsatz).
2. **SUMMEWENNS:** `=SUMMEWENNS(C2:C100; A2:A100; "Nord"; B2:B100; "Laptop")`
   - C2:C100 = Summenbereich (Umsatz), A2:A100 = Kriterienbereich1 (Region), "Nord", B2:B100 = Kriterienbereich2 (Produkt), "Laptop".
3. **ZÄHLENWENN:** `=ZÄHLENWENN(C2:C100; ">1000")` → zählt alle Bestellungen mit Wert > 1.000.
4. **ZÄHLENWENNS:** `=ZÄHLENWENNS(C2:C100; ">1000"; A2:A100; "Süd")` → zählt Bestellungen > 1.000 in der Region "Süd".
   - **Ergebnis:** Bedingte Funktionen meistern — ein mächtiges Werkzeug für Datenanalyse.
   - **Hinweis:** Textkriterien (wie "Nord") und mathematische Operatoren (wie ">1000") müssen in Anführungszeichen stehen. Exakte Zahlen können ohne Anführungszeichen geschrieben werden.

---

## Übung 7.2: SVERWEIS anwenden


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


---

### Lösung

**Lösung:**
1. **SVERWEIS exakt:** `=SVERWEIS(E2; Preisliste!A:C; 2; 0)`
   - Sucht den Wert aus E2 (Produkt-ID) in der ersten Spalte von Preisliste!A:C. Gibt den Wert aus Spalte 2 (Produktname) zurück. `0` = exakte Übereinstimmung.
2. **SVERWEIS ungefähr für Noten:**
   - Hilfstabelle: 0=ungenügend, 50=mangelhaft, 60=ausreichend, 70=befriedigend, 80=gut, 90=sehr gut.
   - `=SVERWEIS(Punktzahl; Notentabelle!A:B; 2; 1)` → `1` = ungefähre Übereinstimmung (Suchspalte muss aufsteigend sortiert sein).
3. **#NV-Fehler testen:** Eine Produkt-ID eingeben, die nicht existiert → `#NV` erscheint. Lösung: `=WENNFEHLER(SVERWEIS(…); "Nicht gefunden")`.
   - **Ergebnis:** Sie beherrschen SVERWEIS für exakte und ungefähre Suche sowie Fehlerbehandlung.

---

## Übung 7.3: INDEX und VERGLEICH kombinieren


Die folgende Übungstabelle **Modul 7 3 INDEX VERGLEICH** ist bereits geladen.

1. Finden Sie mit INDEX+VERGLEICH den Preis eines Produkts, wobei die

   Produktspalte rechts vom Preis steht (was SVERWEIS nicht kann).
2. Erstellen Sie eine bidirektionale Suche: Produkt (Zeile) × Monat (Spalte).
3. Vergleichen Sie die Formel mit der SVERWEIS-Variante aus der vorherigen Übung.


---

### Lösung

**Lösung:**
1. **INDEX+VERGLEICH (rechts→links):** `=INDEX(A:A; VERGLEICH(E2; C:C; 0))`
   - VERGLEICH findet die Zeilennummer der Produkt-ID in Spalte C. INDEX holt den Preis aus Spalte A (links davon!). SVERWEIS kann das nicht, weil die Suchspalte rechts steht.
2. **Bidirektionale Suche:** `=INDEX(B2:M10; VERGLEICH(Produkt; A2:A10; 0); VERGLEICH(Monat; B1:M1; 0))`
   - Erster VERGLEICH = Zeilennummer (Produkt), zweiter VERGLEICH = Spaltennummer (Monat). INDEX holt den Wert am Schnittpunkt.
3. **Vergleich mit SVERWEIS:** INDEX+VERGLEICH ist flexibler (sucht in jede Richtung) und robuster (bricht nicht beim Einfügen von Spalten).
   - **Ergebnis:** Sie können die flexible INDEX+VERGLEICH-Kombination einsetzen.

---

## Übung 7.4: Text- und Datumsfunktionen anwenden


Die folgende Übungstabelle **Modul 7 4 Text Datum** ist bereits geladen.

1. Extrahieren Sie aus einer Spalte „Nachname, Vorname" den Nachnamen mit

   `LINKS()` und `FINDEN()`.
2. Bereinigen Sie importierte Texte mit `GLÄTTEN()` von überflüssigen Leerzeichen.
3. Verbinden Sie Vor- und Nachname aus zwei Spalten mit `&` zu einer Spalte.
4. Berechnen Sie das Alter von Personen aus dem Geburtsdatum mit `HEUTE()`.


---

### Lösung

**Lösung:**
1. **Nachname extrahieren:** Wenn in A2 "Müller, Max" steht:
   - `=LINKS(A2; FINDEN(","; A2)-1)` → `FINDEN` findet das Komma an Position 7. Wir ziehen 1 ab (`-1`), um das Komma selbst nicht mitzunehmen. `LINKS` nimmt die ersten 6 Zeichen → "Müller".
2. **GLÄTTEN:** Bei Text in B2 mit überflüssigen Leerzeichen: `=GLÄTTEN(B2)` → entfernt führende, nachfolgende und doppelte Leerzeichen.
3. **Vor- und Nachname verbinden:** `=A2&" "&B2` → verbindet Vorname + Leerzeichen + Nachname.
4. **Alter berechnen:** `=DATEDIF(B2; HEUTE(); "Y")` → exaktes Alter in Jahren. B2 = Geburtsdatum.
   - **Hinweis:** `DATEDIF` ist eine versteckte Funktion — sie erscheint nicht in der AutoVervollständigung, funktioniert aber in allen Excel-Versionen. Einfach eintippen und mit Enter bestätigen.
   - **Ergebnis:** Sie beherrschen grundlegende Text- und Datumsfunktionen.

---

## Modul 8: Diagramme und Visualisierung

## Übung 8.1: Ihr erstes Diagramm


Die folgende Übungstabelle **Modul 8 1 Erste Diagramme** ist bereits geladen.

1. Markieren Sie die Umsatztabelle (Produkte + Werte) und erstellen Sie ein

   Säulendiagramm über „Einfügen → Säulendiagramm".
2. Erstellen Sie ein Kreisdiagramm aus denselben Daten. Welches ist

   aussagekräftiger und warum?
3. Erstellen Sie ein Liniendiagramm aus den monatlichen Umsatzzahlen.


---

### Lösung

**Lösung:**
1. **Säulendiagramm:** Umsatztabelle (Produktnamen + Umsatzwerte) markieren → `Einfügen → Säulendiagramm → Gruppierte Säulen`.
2. **Kreisdiagramm:** Gleiche Daten markieren → `Einfügen → Kreisdiagramm → Kreis`. Vergleich: Das Kreisdiagramm zeigt Anteile am Ganzen (gut bei max. 5–7 Kategorien); das Säulendiagramm eignet sich besser für exakte Vergleiche der absoluten Werte.
3. **Liniendiagramm:** Monatliche Umsatzzahlen (z.B. Monate in Zeile 1, Werte in Zeile 2) markieren → `Einfügen → Linie → Linie`. Ideal für zeitliche Entwicklungen.
   - **Ergebnis:** Drei Diagrammtypen erstellt — Sie wissen, welcher Typ für welche Daten geeignet ist.

---

## Übung 8.2: Diagramm formatieren


Die folgende Übungstabelle **Modul 8 2 Diagrammformat** ist bereits geladen.

1. Fügen Sie einen aussagekräftigen Diagrammtitel hinzu („Quartalsumsatz 2026").
2. Beschriften Sie die Achsen („Quartal" und „Umsatz in €").
3. Fügen Sie Datenbeschriftungen zu den Säulen hinzu.
4. Ändern Sie die Farben der Säulen mit einer professionellen Farbpalette.


---

### Lösung

**Lösung:**
1. **Diagrammtitel:** Diagramm anklicken → `Diagrammtitel` (über das `+`-Symbol rechts am Diagramm) → In das Textfeld "Quartalsumsatz 2026" eingeben.
2. **Achsentitel:** `+`-Symbol → `Achsentitel` aktivieren. Horizontal: "Quartal", Vertikal: "Umsatz in €".
3. **Datenbeschriftungen:** `+`-Symbol → `Datenbeschriftungen` aktivieren. Die konkreten Werte erscheinen an den Säulen.
4. **Farben ändern:** Säulen anklicken → `Start → Füllfarbe` oder `Diagrammformat → Farbpalette`. Eine konsistente, dezente Farbpalette wählen (nicht zu grell).
   - **Ergebnis:** Professionell formatiertes Diagramm mit allen wichtigen Elementen.

---

## Übung 8.3: Verbunddiagramm erstellen


Die folgende Übungstabelle **Modul 8 3 Verbunddiagramm** ist bereits geladen.

1. Erstellen Sie ein Kombi-Diagramm: Umsatz als Säulen, Wachstumsrate als Linie.
2. Fügen Sie eine Sekundärachse für die Wachstumsrate ein.
3. Formatieren Sie beide Achsen mit passenden Einheiten (€ und %).


---

### Lösung

**Lösung:**
1. **Kombi-Diagramm:** Beide Datenreihen (Umsatz + Wachstumsrate) markieren → `Einfügen → Kombi-Diagramm → Benutzerdefiniertes Kombi-Diagramm`.
2. **Sekundärachse:** Im Dialog für die Wachstumsrate `Sekundärachse` aktivieren. Diagrammtyp: Umsatz = `Gruppierte Säulen`, Wachstumsrate = `Linie`.
3. **Achsen formatieren:** Rechte Achse (Wachstumsrate) anklicken → `Achse formatieren` → Zahl: `Prozent`. Linke Achse: Zahl: `Währung` oder `Zahl` mit €.
   - **Ergebnis:** Ein aussagekräftiges Kombi-Diagramm mit zwei unterschiedlichen Skalen.

---

## Übung 8.4: Einfaches Dashboard erstellen


Die folgende Übungstabelle **Modul 8 4 Dashboard** ist bereits geladen.

1. Erstellen Sie auf einem neuen Blatt drei Diagramme aus den Quelldaten:

   ein Säulendiagramm (nach Region), ein Liniendiagramm (nach Monat) und

   ein Kreisdiagramm (nach Produktkategorie).
2. Ordnen Sie die Diagramme übersichtlich auf dem Blatt an.
3. Fügen Sie über jedem Diagramm einen erklärenden Text ein.


---

### Lösung

**Lösung:**
1. **Drei Diagramme auf neuem Blatt:**
   - Neues Blatt einfügen (`+`-Symbol).
   - Säulendiagramm: Daten nach Region markieren → `Einfügen → Säulendiagramm`. Auf dem neuen Blatt positionieren.
   - Liniendiagramm: Monatsdaten markieren → `Einfügen → Linie`. Positionieren.
   - Kreisdiagramm: Produktkategorie-Daten → `Einfügen → Kreis`. Positionieren.
2. **Anordnung:** Diagramme nebeneinander oder untereinander so verteilen, dass sie nicht überlappen. Bei gedrückter `Alt`-Taste werden Diagramme am Raster ausgerichtet.
3. **Erklärenden Text einfügen:** Über jedes Diagramm eine Textbox einfügen (`Einfügen → Textfeld`) mit kurzem Titel, z.B. "Umsatz nach Region", "Monatsverlauf", "Anteile nach Kategorie".
   - **Ergebnis:** Ein einfaches, aber vollständiges Dashboard auf einem Blatt.

---

## Modul 9: Pivot-Tabellen

## Übung 9.1: Erste Pivot-Tabelle


Die folgende Übungstabelle **Modul 9 1 Pivot** ist bereits geladen.

1. Markieren Sie eine Zelle in der Datentabelle und wählen Sie

   „Einfügen → PivotTable".
2. Ziehen Sie „Region" in den Zeilenbereich und „Umsatz" in den Wertebereich.
3. Beobachten Sie, wie Excel automatisch die Summe pro Region berechnet.


---

### Lösung

**Lösung:**
1. **PivotTable erstellen:** In die Datentabelle klicken → `Einfügen → PivotTable`. Bereich wird automatisch erkannt → `OK` (neues Blatt).
2. **Felder zuweisen:** In der PivotTable-Feldliste:
   - `Region` in das Feld `Zeilen` ziehen.
   - `Umsatz` in das Feld `Werte` ziehen.
3. **Ergebnis beobachten:** Die Pivot-Tabelle zeigt jede Region einmal und summiert automatisch die Umsätze. Keine einzige Formel wurde manuell geschrieben.
   - **Ergebnis:** Erste Pivot-Tabelle erfolgreich erstellt.

---

## Übung 9.2: Pivot-Tabelle anpassen


Die folgende Übungstabelle **Modul 9 2 Pivot Anpassung** ist bereits geladen.

1. Ändern Sie die Zusammenfassung von „Summe" auf „Mittelwert".
2. Gruppieren Sie die Datumsangaben nach Monaten und Quartalen

   (Rechtsklick → Gruppieren).
3. Zeigen Sie die Werte als „% des Gesamtergebnisses" an.
4. Fügen Sie ein berechnetes Feld hinzu: „Bonus" = Umsatz × 5%.


---

### Lösung

**Lösung:**
1. **Zusammenfassung ändern:** Im Wertebereich auf `Summe von Umsatz` klicken → `Wertfeldeinstellungen` → Funktion: `Mittelwert` → `OK`.
2. **Datum gruppieren:** (In Microsoft 365 gruppiert Excel Datumsangaben oft automatisch in Jahre/Quartale/Monate.) Auf ein Datum in der Pivot-Tabelle rechtsklicken → `Gruppieren`. `Monate` und `Quartale` auswählen → `OK`.
3. **% des Gesamtergebnisses:** Wertfeld anklicken → `Werte anzeigen als` → `% des Gesamtergebnisses`.
4. **Berechnetes Feld:** `PivotTable-Analyse → Feldelemente und Gruppen → Berechnetes Feld`. Name: `Bonus`, Formel: `=Umsatz * 0,05` → `OK`.
   - **Ergebnis:** Sie können Pivot-Tabellen flexibel anpassen und eigene Berechnungen hinzufügen.

---

## Übung 9.3: Slicer einsetzen


Die folgende Übungstabelle **Modul 9 3 Slicer** ist bereits geladen.

1. Fügen Sie einen Slicer für das Feld „Region" ein

   (PivotTable-Analyse → Slicer einfügen).
2. Filtern Sie mit dem Slicer auf eine bestimmte Region.
3. Fügen Sie einen zweiten Slicer für „Produktkategorie" hinzu und kombinieren

   Sie beide Filter.


---

### Lösung

**Lösung:**
1. **Slicer einfügen:** Pivot-Tabelle anklicken → `PivotTable-Analyse → Slicer einfügen` → `Region` auswählen → `OK`. Ein Slicer mit allen Regionen erscheint.
2. **Mit Slicer filtern:** Auf eine Region im Slicer klicken (z.B. "Nord") → die Pivot-Tabelle zeigt nur noch Daten dieser Region.
3. **Zweiter Slicer:** `Slicer einfügen` → `Produktkategorie` auswählen. Beide Slicer sind aktiv: Klicken Sie z.B. "Nord" und "Laptops" — nur noch diese Kombination wird angezeigt.
   - **Ergebnis:** Interaktive, visuelle Filterung mit mehreren Slicern.

---

## Übung 9.4: PivotChart erstellen


Die folgende Übungstabelle **Modul 9 4 PivotChart** ist bereits geladen.

1. Erstellen Sie aus Ihrer Pivot-Tabelle ein PivotChart

   (PivotTable-Analyse → PivotChart).
2. Wählen Sie einen passenden Diagrammtyp.
3. Testen Sie die Interaktivität: Ändern Sie die Pivot-Tabelle und beobachten

   Sie, wie das Diagramm folgt.


---

### Lösung

**Lösung:**
1. **PivotChart erstellen:** Pivot-Tabelle anklicken → `PivotTable-Analyse → PivotChart`. Wählen Sie z.B. `Gruppierte Säulen` → `OK`.
2. **Diagrammtyp wählen:** Diagramm anklicken → `Entwurf → Diagrammtyp ändern` → z.B. `Gestapelte Säulen`.
3. **Interaktivität testen:** Einen Filter oder Slicer in der Pivot-Tabelle ändern → das PivotChart passt sich automatisch an.
   - **Ergebnis:** Ein PivotChart, das dynamisch mit der Pivot-Tabelle verbunden ist.

---

## Modul 10: Analyse und Finanzfunktionen

## Übung 10.1: Zielwertsuche anwenden


Die folgende Übungstabelle **Modul 10 1 Zielwertsuche** ist bereits geladen.

1. Sie möchten einen Gesamtumsatz von 100.000 € erreichen. Nutzen Sie die

   Zielwertsuche, um den erforderlichen Stückpreis zu ermitteln.
2. Ein Kredit über 200.000 € soll eine monatliche Rate von 1.500 € haben.

   Welcher Zinssatz ist dafür maximal zulässig?


---

### Lösung

**Lösung:**
1. **Zielwertsuche für Stückpreis:**
   - Formel für Gesamtumsatz: z.B. `=B2*B3` (Stückpreis × Menge).
   - `Daten → Was-wäre-wenn-Analyse → Zielwertsuche`.
   - Zielzelle: Zelle mit Gesamtumsatz-Formel (z.B. B4).
   - Zielwert: `100000`.
   - Veränderbare Zelle: Zelle mit Stückpreis (z.B. B2) → `OK`.
   - Excel berechnet den erforderlichen Stückpreis.
2. **Zielwertsuche für Zinssatz:**
   - Formel für Rate: `=RMZ(B1/12; 30*12; -200000)` (B1 enthält den Zinssatz).
   - Zielwertsuche: Zielzelle = Raten-Zelle, Zielwert = 1500, veränderbare Zelle = B1 (Zinssatz).
   - Ergebnis: Der maximal zulässige Zinssatz.
   - **Lernziel:** Sie können "rückwärts" rechnen — vom gewünschten Ergebnis zur benötigten Eingabe.

---

## Übung 10.2: Finanzfunktionen anwenden


Die folgende Übungstabelle **Modul 10 2 Finanzfunktionen** ist bereits geladen.

1. Berechnen Sie mit `RMZ()` die monatliche Rate für einen Kredit über 250.000 €

   bei 4,5% Zins und 30 Jahren Laufzeit.
2. Berechnen Sie mit `ZW()` das Endkapital nach 20 Jahren, wenn Sie monatlich

   200 € bei 3% Zins ansparen.
   Hinweis: Passen Sie Zins und Laufzeit auf Monate an:
   `=ZW(3%/12; 20*12; -200)`.
3. Vergleichen Sie zwei Investitionen mit `NBW()` und entscheiden Sie, welche

   vorteilhafter ist.


---

### Lösung

**Lösung:**
1. **Kreditrate (RMZ):** `=RMZ(4,5%/12; 30*12; -250000)`.
   - Zins: 4,5% / 12 = 0,375% pro Monat.
   - Perioden: 30 × 12 = 360 Monate.
   - Barwert: -250.000 (negativ = erhaltenes Geld).
   - Ergebnis: ca. 1.266,71 € monatliche Rate.
2. **Endkapital (ZW):** `=ZW(3%/12; 20*12; -200)`.
   - Zins: 3% / 12 = 0,25% pro Monat.
   - Perioden: 20 × 12 = 240 Monate.
   - Rate: -200 (negativ = Zahlung).
   - Ergebnis: ca. 65.600 € Endkapital.
3. **Kapitalwert (NBW) vergleichen:**
   - Investition A: `=NBW(Zinssatz; Rückflüsse_A) + Investition_A` (Investition negativ einsetzen).
   - Investition B: analog.
   - Die Investition mit dem höheren NBW ist vorteilhafter. NBW > 0 bedeutet: Die Investition lohnt sich.
   - **Ergebnis:** Sie können grundlegende Finanzberechnungen durchführen und Investitionen vergleichen.

---

## Übung 10.3: Datentabelle erstellen


Die folgende Übungstabelle **Modul 10 3 Datentabelle** ist bereits geladen.

1. Erstellen Sie eine eindimensionale Datentabelle: RMZ-Rate für Zinssätze
   von 2% bis 8% (in 0,5%-Schritten) bei 250.000 € und 30 Jahren.
2. Erstellen Sie eine zweidimensionale Datentabelle: RMZ-Rate für Zinssätze
   (3%–7%) × Laufzeiten (10–30 Jahre).
3. Interpretieren Sie: Bei welchem Zinssatz übersteigt die Rate 1.500 €?


---

### Lösung

**Lösung:**
1. **Eindimensionale Datentabelle:**
   - Formel für RMZ in Zelle B1: `=RMZ(B2/12; 30*12; -250000)`.
   - Zinssätze in A2:A14: 2,0%, 2,5%, 3,0% … 8,0%.
   - Bereich A1:B14 markieren → `Daten → Was-wäre-wenn-Analyse → Datentabelle`.
   - Da die Zinssätze in **Spalte A untereinander** stehen, nutzen wir das Feld `Spalten-Eingabezelle`. Dort auf die Zelle klicken, die in der Formel den Zinssatz enthält (B2) → `OK`. Excel setzt nun für jede Zeile den entsprechenden Zinssatz aus Spalte A ein.
2. **Zweidimensionale Datentabelle:**
   - RMZ-Formel in A1: `=RMZ(Zinssatz/12; Jahre*12; -250000)`.
   - Zinssätze in A2:A10 (3%–7%).
   - Laufzeiten in B1:K1 (10–30 Jahre).
   - Bereich A1:K10 markieren → `Datentabelle`.
   - `Eingabezelle Zeile`: Zelle mit den Jahren (da Jahre in Zeile 1 stehen).
   - `Eingabezelle Spalte`: Zelle mit dem Zinssatz (da Zinssätze in Spalte A stehen) → `OK`.
3. **Interpretation:** In der Tabelle ablesen: Ab ca. 5,3% Zinssatz übersteigt die Rate 1.500 € (bei 30 Jahren).
   - **Ergebnis:** Sie können ein- und zweidimensionale Datentabellen für Szenario-Analysen erstellen.

---

## Übung 10.4: Integrierte Finanzanalyse


Die folgende Übungstabelle **Modul 10 4 Finanzanalyse** ist bereits geladen.

Ein Unternehmen plant eine Investition von 500.000 € mit erwarteten jährlichen
Rückflüssen von 80.000 € über 10 Jahre.

1. Berechnen Sie den Kapitalwert (NBW) bei 6% Zinssatz. Ist die Investition
   vorteilhaft?
2. Nutzen Sie die Zielwertsuche: Welcher Zinssatz ergibt NBW = 0 (IKV)?
3. Erstellen Sie eine Datentabelle: NBW für Zinssätze 2%–12%.
4. Ab welchem Zinssatz wird die Investition unvorteilhaft (NBW < 0)?


---

### Lösung

**Lösung:**
1. **NBW bei 6%:** `=NBW(6%; B2:B11) - 500000` (Rückflüsse 80.000 in B2:B11, Investition 500.000 abziehen).
   - Ergebnis: ca. 88.800 € > 0 → Investition ist vorteilhaft.
2. **Zielwertsuche für NBW=0 (IKV):**
   - Zielwertsuche: Zielzelle = NBW, Zielwert = 0, veränderbare Zelle = Zinssatz-Zelle.
   - Oder direkt: `=IKV(B1:B11)` (B1 = -500.000, B2:B11 = 80.000). Ergebnis: ca. 9,6%.
3. **Datentabelle NBW für 2%–12%:** NBW-Formel oben, Zinssätze 2%–12% darunter, Datentabelle erstellen.
4. **Interpretation:** Bei Zinssätzen über ca. 9,6% wird NBW negativ → Investition unvorteilhaft.
   - **Ergebnis:** Vollständige Investitionsanalyse mit drei Methoden kombiniert.

---

## Modul 11: Druck und Zusammenarbeit

## Übung 11.1: Seitenlayout einrichten


Die folgende Übungstabelle **Modul 11 1 Drucklayout** ist bereits geladen.

1. Ändern Sie die Ausrichtung auf Querformat.
2. Skalieren Sie die Tabelle so, dass alle Spalten auf eine Seite passen.
3. Setzen Sie die Seitenränder auf „Schmal".
4. Zentrieren Sie die Tabelle horizontal und vertikal auf der Seite.


---

### Lösung

**Lösung:**
1. **Querformat:** `Seitenlayout → Ausrichtung → Querformat`.
2. **Skalierung:** `Seitenlayout → Skalierung` → Breite: `1 Seite`, Höhe: `Automatisch`. Oder: `Datei → Drucken → Skalierung: Alle Spalten auf einer Seite`.
3. **Schmale Seitenränder:** `Seitenlayout → Seitenränder → Schmal`.
4. **Zentrieren:** `Seitenlayout → Seite einrichten (kleiner Pfeil unten rechts)` → Register `Seitenränder` → `Horizontal` und `Vertikal` zentrieren → `OK`.
   - **Ergebnis:** Optimiert für den Druck — alle Spalten auf einer Seite im Querformat.

---

## Übung 11.2: Druckbereich festlegen


Die folgende Übungstabelle **Modul 11 2 Druckbereich** ist bereits geladen.

1. Definieren Sie einen Druckbereich, der nur die Haupttabelle (ohne Hilfsspalten)

   umfasst.
2. Fügen Sie einen manuellen Seitenumbruch nach Zeile 30 ein.
3. Nutzen Sie die Seitenumbruchvorschau, um die Umbrüche zu kontrollieren.


---

### Lösung

**Lösung:**
1. **Druckbereich definieren:** Haupttabelle (ohne Hilfsspalten) markieren → `Seitenlayout → Druckbereich → Druckbereich festlegen`. Nur dieser Bereich wird gedruckt.
2. **Manueller Seitenumbruch:** Zeile 31 anklicken → `Seitenlayout → Umbrüche → Seitenumbruch einfügen`. Alles ab Zeile 31 kommt auf die nächste Seite.
3. **Seitenumbruchvorschau:** `Ansicht → Seitenumbruchvorschau`. Blaue gestrichelte Linien zeigen automatische Umbrüche; durchgezogene Linien manuelle Umbrüche. Per Drag verschiebbar.
   - **Ergebnis:** Exakte Kontrolle darüber, was und wie gedruckt wird.

---

## Übung 11.3: Kopf- und Fußzeilen erstellen


Die folgende Übungstabelle **Modul 11 3 Kopfzeilen** ist bereits geladen.

1. Fügen Sie eine Kopfzeile mit dem Firmennamen (links) und dem Datum (rechts) ein.
2. Fügen Sie eine Fußzeile mit „Seite X von Y" (mittig) ein.
3. Aktivieren Sie über „Seitenlayout → Drucktitel" die Wiederholungszeilen,
   damit die Tabellenüberschrift auf jeder gedruckten Seite erscheint.


---

### Lösung

**Lösung:**
1. **Kopfzeile:** `Einfügen → Kopf- und Fußzeile` oder `Seitenlayout → Drucktitel → Kopfzeile/Fußzeile`.
   - Linker Bereich: Firmennamen eingeben (z.B. `Excel-lenz GmbH`).
   - Rechter Bereich: `Datum`-Schaltfläche klicken (fügt `&[Datum]` automatisch ein).
2. **Fußzeile:** Mittleren Bereich anklicken → `Seitenzahl`-Button → ` von ` → `Anzahl Seiten`-Button.
   - Code: `&[Seite] von &[Seiten]`.
3. **Wiederholungszeilen (Drucktitel):** `Seitenlayout → Drucktitel`. Feld: `Wiederholungszeilen oben` → Zeile mit den Überschriften anklicken (z.B. $1:$1) → `OK`.
   - **Ergebnis:** Professionell eingerichtetes Drucklayout mit Kopf-/Fußzeile und wiederholten Überschriften.

---

## Übung 11.4: Für die Weitergabe vorbereiten


Die folgende Übungstabelle **Modul 11 4 Zusammenarbeit** ist bereits geladen.

1. Exportieren Sie die Tabelle als PDF.
2. Fügen Sie einen Kommentar in eine Zelle ein (Überprüfen → Neuer Kommentar).
3. Speichern Sie die Datei sowohl als `.xlsx` als auch als `.pdf`.


---

### Lösung

**Lösung:**
1. **Als PDF exportieren:** `Datei → Exportieren → PDF/XPS-Dokument erstellen` → Speicherort wählen → `Veröffentlichen`. Oder: `Datei → Speichern unter → PDF` als Dateityp.
2. **Kommentar einfügen:** Zelle anklicken → `Überprüfen → Neuer Kommentar` (moderner Thread-Kommentar in M365) oder `Überprüfen → Notiz` (klassischer Kommentar). Text eingeben → außerhalb klicken. Ein roter Indikator erscheint an der Zelle.
3. **Beide Formate speichern:** `Datei → Speichern unter → .xlsx` (Excel-Arbeitsmappe). Dann erneut: `Datei → Speichern unter → .pdf` (PDF).
   - **Ergebnis:** Die Arbeitsmappe liegt sowohl als bearbeitbare .xlsx als auch als schreibgeschützte .pdf vor.

---

## Modul 12: Schutz und Sicherheit

## Übung 12.1: Schutz einrichten


Die folgende Übungstabelle **Modul 12 1 Schutz** ist bereits geladen.

1. Markieren Sie die Eingabezellen (B2:B10) und entfernen Sie den Haken bei
   „Gesperrt" (`Strg+1` → Schutz → Gesperrt abwählen). Lassen Sie die
   Formelzellen gesperrt.
2. Aktivieren Sie den Blattschutz und testen Sie: Eingabezellen sind bearbeitbar,

   andere Zellen nicht.
3. Schützen Sie die Arbeitsmappenstruktur, sodass keine Blätter gelöscht werden

   können.


---

### Lösung

**Lösung:**
1. **Eingabezellen entsperren:**
   - Zellen B2:B10 markieren → `Strg+1 → Schutz → Gesperrt`-Häkchen **entfernen** → `OK`.
   - Alle anderen Zellen (Formeln, Überschriften) bleiben standardmäßig gesperrt.
2. **Blattschutz aktivieren:** `Überprüfen → Blatt schützen`. Optional ein Passwort vergeben → `OK`. Test: Eingabezellen sind bearbeitbar, Formelzellen zeigen beim Versuch: "Die Zelle ist geschützt".
3. **Arbeitsmappenstruktur schützen:** `Überprüfen → Arbeitsmappe schützen`. Struktur schützen (verhindert Löschen/Einfügen von Blättern) → optional Passwort → `OK`.
   - **Ergebnis:** Mehrstufiger Schutz: Blattschutz + Arbeitsmappenschutz.

---

## Übung 12.2: Tastenkombinationen üben


Die folgende Übungstabelle **Modul 12 2 Tastenkombinationen** ist bereits geladen. Bearbeiten Sie sie
ausschließlich mit Tastenkombinationen:

1. `Strg+Umschalt+L` für Filter, dann mit Pfeiltasten navigieren.
2. `F4` zum Wiederholen einer Formatierung.
3. `Strg+1` zum Öffnen des Formatierungsdialogs.
4. `Alt+=` für automatische Summierung.


---

### Lösung

**Lösung:**
1. **Strg+Umschalt+L (Filter):** In die Tabelle klicken → `Strg+Umschalt+L` → Filterpfeile erscheinen. Mit `↓` und `↑` in der Filterliste navigieren, mit `Leertaste` Häkchen setzen/löschen.
2. **F4 (Wiederholen):** Beliebig formatieren (z.B. Zelle fett). Nächste Zelle auswählen → `F4` drücken → gleiche Formatierung wird wiederholt.
3. **Strg+1 (Zellen formatieren):** Zelle markieren → `Strg+1` → Dialog mit allen Formatierungsoptionen öffnet sich.
4. **Alt+= (AutoSumme):** Unter eine Zahlenspalte klicken → `Alt+=` → `=SUMME(…)` wird automatisch eingefügt → `Enter`.
   - **Ergebnis:** Sie arbeiten effizienter mit Tastenkombinationen.

---

## Übung 12.3: Dokument inspizieren


Die folgende Übungstabelle **Modul 12 3 Inspektion** ist bereits geladen.

1. Führen Sie die Dokumentinspektion durch (Datei → Informationen → Auf Probleme

   überprüfen → Dokument prüfen).
2. Entfernen Sie alle gefundenen persönlichen Informationen.
3. Speichern Sie die bereinigte Version.


---

### Lösung

**Lösung:**
1. **Dokumentinspektion starten:** `Datei → Informationen → Auf Probleme überprüfen → Dokument prüfen`.
2. **Prüfen und entfernen:** Der Inspektor listet Kategorien auf: Dokumenteigenschaften, Kommentare, ausgeblendete Zeilen/Spalten, Kopf-/Fußzeilen. Klicken Sie `Alle entfernen` bei jeder Kategorie mit Funden.
3. **Bereinigt speichern:** `Datei → Speichern unter` → z.B. `Bereinigt_Version.xlsx`.
   - **Ergebnis:** Persönliche Metadaten, Kommentare und versteckte Daten wurden entfernt — die Datei ist sicher zur Weitergabe.

---

## Modul 13: Automatisierung mit Makros

## Übung 13.1: Entwicklertools aktivieren


Die folgende Übungstabelle **Modul 13 1 Entwicklertools** ist bereits geladen.

1. Aktivieren Sie die Registerkarte „Entwicklertools"
   (Datei → Optionen → Menüband anpassen → Entwicklertools).
2. Speichern Sie die Datei als `.xlsm` (Excel-Arbeitsmappe mit Makros).
3. Erkunden Sie die neue Registerkarte und identifizieren Sie die

   Schaltfläche „Makro aufzeichnen".


---

### Lösung

**Lösung:**
1. **Entwicklertools aktivieren:**
   - `Datei → Optionen → Menüband anpassen`.
   - Rechte Liste: Häkchen bei `Entwicklertools` setzen → `OK`.
   - Die neue Registerkarte erscheint im Menüband.
2. **Als .xlsm speichern:** `Datei → Speichern unter → Dateityp: Excel-Arbeitsmappe mit Makros (*.xlsm)` → `Speichern`.
3. **Erkunden:** Auf der Registerkarte `Entwicklertools` finden Sie:
   - `Makro aufzeichnen` (roter Kreis-Symbol).
   - `Visual Basic` (öffnet den VBA-Editor, Alt+F11).
   - `Makros` (Liste aller Makros).
   - **Ergebnis:** Die Entwicklertools sind bereit für die Makro-Aufzeichnung.

---

## Übung 13.2: Makro aufzeichnen


Die folgende Übungstabelle **Modul 13 2 Makro Aufzeichnen** ist bereits geladen.

1. Zeichnen Sie ein Makro auf, das die Überschriftenzeile fett formatiert,

   einen grauen Hintergrund gibt und Rahmen um den Datenbereich zieht.
2. Speichern Sie das Makro mit dem Namen „FormatBericht".
3. Führen Sie das Makro auf einem zweiten Tabellenblatt aus.
4. Weisen Sie das Makro einer Schaltfläche oder Form zu.


---

### Lösung

**Lösung:**
1. **Makro aufzeichnen:**
   - `Entwicklertools → Makro aufzeichnen`. Name: `FormatBericht`, Tastenkombination: `Strg+Umschalt+F` → `OK`.
   - Führen Sie die Aktionen aus: Überschriftenzeile markieren → `Strg+F` (Fett) → `Füllfarbe → Grau` → Gesamten Datenbereich markieren → `Rahmen → Alle Rahmen`.
   - `Entwicklertools → Aufzeichnung beenden`.
2. **Makro speichern:** Das Makro wird automatisch in der .xlsm-Datei gespeichert.
3. **Makro auf anderem Blatt ausführen:** Anderes Blatt wählen → `Entwicklertools → Makros → FormatBericht → Ausführen`. Die gespeicherten Formatierungsschritte werden wiederholt.
4. **Makro zuweisen:** `Einfügen → Formen` → Rechteck zeichnen → Rechtsklick → `Makro zuweisen…` → `FormatBericht` → `OK`. Klick auf die Schaltfläche führt das Makro aus.
   - **Ergebnis:** Ein funktionierendes Makro mit Schaltfläche.

---

## Übung 13.3: VBA-Editor erkunden


Die folgende Übungstabelle **Modul 13 3 VBA Editor** ist bereits geladen.

1. Öffnen Sie den VBA-Editor mit `Alt+F11`.
2. Finden Sie im Projekt-Explorer das aufgezeichnete Makro aus der

   vorherigen Übung.
3. Lesen Sie den Code und identifizieren Sie Zeilen, die Formatierungen

   (`.Font.Bold = True`, `.Interior.Color`) vornehmen.


---

### Lösung

**Lösung:**
1. **VBA-Editor öffnen:** `Alt+F11` oder `Entwicklertools → Visual Basic`.
2. **Makro finden:** Im Projekt-Explorer (links, wenn nicht sichtbar: `Ansicht → Projekt-Explorer`) → `Module → Modul1` doppelklicken. Das Makro `FormatBericht` wird im Code-Fenster angezeigt.
3. **Code analysieren:**
   - `.Font.Bold = True` → macht Schrift fett.
   - `.Interior.Color = RGB(…)` oder `.Interior.ColorIndex` → setzt die Hintergrundfarbe.
   - `.Borders.LineStyle` → fügt Rahmen hinzu.
   - Der VBA-Editor zeigt jeden aufgezeichneten Schritt als VBA-Code.
   - **Ergebnis:** Sie verstehen die Struktur aufgezeichneter Makros im VBA-Editor.

---

## Übung 13.4: Einfaches VBA programmieren


Die folgende Übungstabelle **Modul 13 4 VBA Programmieren** ist bereits geladen.

1. Schreiben Sie im VBA-Editor (`Alt+F11`) ein Makro, das mit einer `For`-Schleife

   die Zahlen 1 bis 10 in die Zellen A1 bis A10 schreibt.
2. Erweitern Sie das Makro um eine `If`-Bedingung: Zahlen über 5 sollen fett

   formatiert werden.
3. Führen Sie das Makro aus und prüfen Sie das Ergebnis.


---

### Lösung

**Lösung:**
1. **For-Schleife (Zahlen 1–10):**
   ```vba
   Sub ZahlenSchreiben()
       Dim i As Long
       For i = 1 To 10
           Range("A" & i).Value = i
       Next i
   End Sub
   ```
   `Alt+F11` → `Einfügen → Modul` → Code einfügen → `F5` zum Ausführen. A1:A10 zeigen 1–10.
2. **Erweitert mit If-Bedingung:**
   ```vba
   Sub ZahlenMitFett()
       Dim i As Long
       For i = 1 To 10
           Range("A" & i).Value = i
           If i > 5 Then
               Range("A" & i).Font.Bold = True
           End If
       Next i
   End Sub
   ```
   Zahlen 6–10 werden fett formatiert.
3. **Ausführen und prüfen:** `F5` im VBA-Editor oder `Entwicklertools → Makros → ZahlenMitFett → Ausführen`. Wechseln Sie zurück zu Excel (`Alt+F11`) und prüfen Sie das Ergebnis in A1:A10.
   - **Ergebnis:** Erstes eigenes VBA-Programm mit Schleife und Bedingung geschrieben.
   - **Tipp:** `Range("A" & i)` ist dasselbe wie `Cells(i, 1)`. Letzteres wird oft bevorzugt, da es mit Zahlen arbeitet und flexibler ist.

---

