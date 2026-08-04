# Alle Übungen — Fortgeschrittene

**Gesamt:** 39 Übungen

---

## ## Modul 1: Erweiterte Formate, bedingte Formatierung und Datenüberprüfung

## Übung 1.1: Benutzerdefinierte Formate


Die folgende Übungstabelle **Modul 1 1 Zahlenformate** ist bereits geladen.

1. Erstellen Sie ein Format, das positive Zahlen in Schwarz (`#.##0,00 `),
   negative in Rot (`[Rot]-#.##0,00 `) und Null als `-` anzeigt.
2. Erstellen Sie ein Format, das Zahlen unter 1000 normal und über 1000
   in Tausend anzeigt: `[<1000]#.##0;#.##0" T"`.

---

### Lösung

**Lösung:**
1. **Dreiteiliges Zahlenformat:**
   - `Strg+1 → Zahlen → Benutzerdefiniert`.
   - Format: `#.##0,00 ;[Rot]-#.##0,00 ;"-"`
   - Die drei Abschnitte (getrennt durch `;`): (1) positiv, (2) negativ, (3) Null. Ergebnis: 1500 → `1.500,00`, -500 → `-500,00` in rot, 0 → `-`.
2. **Format mit Tausend-Abkürzung:**
   - Format: `[<1000]#.##0;#.##0" T"`
   - `[<1000]` = Bedingung für Werte unter 1000. Zweiter Abschnitt = alles andere mit " T"-Suffix. Ergebnis: 500 → `500`, 15000 → `15 T`.
   - **Lernziel:** Benutzerdefinierte Formate mit Bedingungen und Text-Suffix erstellen.

---
## Übung 1.2: Formelbasierte bedingte Formatierung


Die folgende Übungstabelle **Modul 1 2 Bedingte_Formatierung** ist bereits geladen.

1. Heben Sie alle Zeilen hervor, deren Betrag > 10.000  ist (Formel: `=$C2>10000`).
2. Markieren Sie Zeilen, deren Status "Offen" ist, mit gelbem Hintergrund.
3. Erstellen Sie eine Regel, die das Fälligkeitsdatum rot markiert, wenn es
   weniger als 7 Tage in der Zukunft liegt: `=UND($D2>HEUTE();$D2<HEUTE()+7)`.

---

### Lösung

**Lösung:**
1. **Ganze Zeile bei Betrag > 10.000 hervorheben:**
   - Bereich A2:D100 markieren (A2 = aktive Zelle).
   - `Start → Bedingte Formatierung → Neue Regel → Formel zur Ermittlung…`.
   - Formel: `=$C2>10000`, Format: z.B. hellrote Füllung → `OK`.
   - `$C` fixiert die Spalte (Betrag), die Zeile `2` ist relativ → Regel prüft jede Zeile einzeln.
2. **Zeilen mit Status "Offen" markieren:**
   - Neue Regel mit Formel: `=$B2="Offen"`, Format: gelbe Füllung.
3. **Fälligkeitsdatum < 7 Tage:**
   - Neue Regel mit Formel: `=UND($D2>HEUTE();$D2<HEUTE()+7)`, Format: rote Schrift.
   - `UND` stellt sicher: Datum liegt in der Zukunft UND innerhalb der nächsten 7 Tage. `<` statt `<=` = streng weniger als 7 Tage.
   - **Lernziel:** Formelbasierte bedingte Formatierung mit UND und korrekten absoluten/relativen Bezügen.

---
## Übung 1.3: Datenüberprüfung einrichten


Die folgende Übungstabelle **Modul 1 3 Validierung** ist bereits geladen.

1. Erstellen Sie eine Dropdown-Liste für Abteilungen aus dem benannten Bereich
   `Abteilungen` (IT, Vertrieb, HR, Finanzen, Marketing).
2. Begrenzen Sie das Gehalt auf 30.000 - 120.000 mit benutzerdefinierter Formel.
3. Fügen Sie eine Eingabemeldung „Bitte Abteilung aus Liste wählen" hinzu.
4. Erstellen Sie eine Stopp-Fehlermeldung „Ungültiges Gehalt (30.000 - 120.000)".

---

### Lösung

**Lösung:**
1. **Dropdown-Liste aus benanntem Bereich:**
   - Zuerst Bereichsnamen definieren: `Abteilungen` = Zellen mit IT, Vertrieb, HR, Finanzen, Marketing.
   - Spalte markieren → `Daten → Datenüberprüfung`.
   - Zulassen: `Liste`, Quelle: `=Abteilungen` → `OK`.
2. **Gehalt auf 30.000–120.000 begrenzen:**
   - Spalte markieren → `Daten → Datenüberprüfung`.
   - Zulassen: `Benutzerdefiniert`, Formel: `=UND(A1>=30000;A1<=120000)`.
3. **Eingabemeldung:** Register `Eingabemeldung` → Titel: `Abteilung`, Text: `Bitte Abteilung aus Liste wählen`.
4. **Stopp-Fehlermeldung:** Register `Fehlermeldung` → Typ: `Stopp`, Text: `Ungültiges Gehalt (30.000 - 120.000)`.
   - **Lernziel:** Fortgeschrittene Datenüberprüfung mit benannten Bereichen und benutzerdefinierten Formeln.

---
## Übung 1.4: Schutz einrichten


Die folgende Übungstabelle **Modul 1 4 Schutz** ist bereits geladen.

1. Entsperren Sie die Eingabezellen (B2:B10), lassen Sie Formelzellen gesperrt.
2. Aktivieren Sie den Blattschutz (ohne Passwort).
3. Blenden Sie die Formeln in Spalte D aus (Zellen formatieren  Schutz).
4. Testen Sie: Eingabezellen sind bearbeitbar, Formelzellen nicht.

---

### Lösung

**Lösung:**
1. **Eingabezellen entsperren:** B2:B10 markieren → `Strg+1 → Schutz → Gesperrt`-Häkchen entfernen. Formelzellen (Spalte D) bleiben gesperrt (Standard).
2. **Blattschutz aktivieren:** `Überprüfen → Blatt schützen`. Kein Passwort → `OK`.
3. **Formeln ausblenden:** Spalte D markieren → `Strg+1 → Schutz → Ausgeblendet`-Häkchen setzen. Blattschutz erneut aktivieren. Formeln sind nun in der Bearbeitungsleiste unsichtbar.
4. **Test:** Eingabezellen bearbeitbar, Formelzellen geschützt und ausgeblendet.
   - **Lernziel:** Mehrstufiger Schutz mit entsperrten Eingaben, gesperrten Formeln und ausgeblendeten Formeln.

---
## ## Modul 2: Erweiterte Funktionen und komplexe Formeln

## Übung 2.1: INDEX + VERGLEICH anwenden


Die folgende Übungstabelle **Modul 2 1 INDEX_VERGLEICH** ist bereits geladen.

1. Finden Sie den Preis eines Produkts mit INDEX+VERGLEICH, wobei die
   Produktspalte **rechts** vom Preis steht (SVERWEIS kann das nicht).
2. Erstellen Sie eine bidirektionale Suche: Produkt (Zeile)  Monat (Spalte).
3. Vergleichen Sie die Formel mit einer SVERWEIS-Variante. Welche ist flexibler?

---

### Lösung

**Lösung:**
1. **INDEX+VERGLEICH (rechts→links):**
   - Angenommen: Preis in Spalte A, Produktname in Spalte C, Suchbegriff in E2.
   - `=INDEX(A:A; VERGLEICH(E2; C:C; 0))`
   - VERGLEICH findet die Zeilennummer des Produkts in C, INDEX holt den Preis aus A (links!). SVERWEIS kann das nicht.
2. **Bidirektionale Suche:**
   - `=INDEX(B2:M13; VERGLEICH(Produkt; A2:A13; 0); VERGLEICH(Monat; B1:M1; 0))`
   - Erster VERGLEICH = Zeile, zweiter = Spalte. INDEX holt den Wert am Schnittpunkt.
3. **Vergleich:** INDEX+VERGLEICH ist flexibler (jede Richtung), schneller und robuster bei Strukturänderungen als SVERWEIS.
   - **Lernziel:** INDEX+VERGLEICH als flexible Alternative zu SVERWEIS.

---
## Übung 2.2: Dynamische Bezüge


Die folgende Übungstabelle **Modul 2 2 BEREICH_VERSCHIEBEN** ist bereits geladen.

1. Erstellen Sie eine dynamische Summenformel, die automatisch neue Zeilen
   berücksichtigt (mit ANZAHL2 für die Zeilenanzahl).
2. Erstellen Sie eine Formel für den Durchschnitt der letzten 6 Monate, die
   sich automatisch anpasst, wenn neue Daten hinzukommen.

---

### Lösung

**Lösung:**
1. **Dynamische Summe mit ANZAHL2:**
   - Daten in Spalte B ab B2 (B1 = Überschrift).
   - `=SUMME(BEREICH.VERSCHIEBEN(B1;1;0;ANZAHL2(B:B)-1;1))`
   - Start B1, 1 Zeile runter zu B2, Höhe = ANZAHL2(B:B)-1 (minus Überschrift).
2. **Durchschnitt der letzten 6 Monate:**
   - `=MITTELWERT(BEREICH.VERSCHIEBEN(B1;ANZAHL2(B:B)-6;0;6;1))`
   - Springt zu den letzten 6 Einträgen, nimmt 6 Zeilen.
   - **Achtung:** BEREICH.VERSCHIEBEN ist flüchtig (volatile) — Performance bei vielen Formeln beachten.
   - **Lernziel:** Dynamische Bereiche, die automatisch mit Daten wachsen.

---
## Übung 2.3: Verschachtelte Funktionen


Die folgende Übungstabelle **Modul 2 3 Logik** ist bereits geladen.

1. Erstellen Sie eine Provisionsberechnung mit verschachteltem WENN:
   - Umsatz < 10.000: 5%
   - Umsatz 10.000 - 50.000: 8%
   - Umsatz > 50.000: 12%
2. Verwenden Sie WENNFEHLER für eine SVERWEIS-Formel, die bei fehlendem
   Suchbegriff "Nicht im Katalog" anzeigt.
3. Optional: Schreiben Sie die Provisionsformel mit WENNS (Excel 2019+) um.

---

### Lösung

**Lösung:**
1. **Verschachteltes WENN für Provision:**
   - `=WENN(C2<10000; C2*5%; WENN(C2<=50000; C2*8%; C2*12%))`
   - < 10k → 5%; 10k–50k → 8%; > 50k → 12%.
2. **WENNFEHLER mit SVERWEIS:**
   - `=WENNFEHLER(SVERWEIS(A2;Katalog!A:B;2;0); "Nicht im Katalog")`
   - Zeigt "Nicht im Katalog" statt #NV, wenn die ID nicht existiert.
3. **WENNS (Excel 2019+):**
   - `=WENNS(C2<10000; C2*5%; C2<=50000; C2*8%; C2>50000; C2*12%)`
   - Keine Verschachtelung nötig — erste wahre Bedingung gewinnt.
   - **Lernziel:** Komplexe Logik mit verschachtelten Funktionen und Fehlerbehandlung.

---
## Übung 2.4: Finanzfunktionen anwenden


Die folgende Übungstabelle **Modul 2 4 Finanzfunktionen** ist bereits geladen.

1. Berechnen Sie die monatliche Rate für einen Kredit über 250.000  bei
   4,5% Zins und 30 Jahren Laufzeit mit RMZ.
2. Berechnen Sie den Kapitalwert (NBW) einer Investition: Anfangsinvestition
   100.000 , jährliche Rückflüsse 25.000  über 6 Jahre, Zinssatz 8%.
3. Berechnen Sie mit ZW das Endkapital einer monatlichen Sparrate von 200 
   über 20 Jahre bei 3% Jahreszins (Startkapital: 0 ).

---

### Lösung

**Lösung:**
1. **Monatliche Kreditrate (RMZ):** `=RMZ(4,5%/12; 30*12; -250000)`
   - Zins: 4,5%/12 = 0,375%/Monat. Perioden: 360. Barwert: -250.000. Ergebnis: ≈ 1.266,71 €.
2. **Kapitalwert (NBW):**
   - B1 = -100.000 (Investition), B2:B7 = 25.000 (Rückflüsse je Jahr).
   - `=NBW(8%; B2:B7) + B1` → ≈ 15.573 €. NBW > 0 → Investition lohnt sich.
   - **Wichtig:** B1 steht außerhalb der NBW-Funktion (Zeitpunkt 0 wird nicht abgezinst).
3. **Endkapital (ZW):** `=ZW(3%/12; 20*12; -200; 0)`
   - Zins: 3%/12, Perioden: 240, Rate: -200, Startkapital: 0. Ergebnis: ≈ 65.600 €.
   - **Lernziel:** RMZ, NBW und ZW sicher für finanzielle Szenarien einsetzen.

---
## Übung 2.5: Matrixformeln


Die folgende Übungstabelle **Modul 2 5 Matrixformeln** ist bereits geladen.

1. Erstellen Sie eine Matrixformel, die alle Umsätze > 1.000  summiert:
   `{=SUMME(WENN(C2:C20>1000; C2:C20; 0))}`
2. Erstellen Sie eine Matrixformel, die den größten Umsatz pro Region findet.
3. Testen Sie (Excel 365): `=SORTIEREN(EINDEUTIG(A2:A50))` für eindeutige Werte.

---

### Lösung

**Lösung:**
1. **Matrixformel (klassisch CSE):**
   - `{=SUMME(WENN(C2:C20>1000; C2:C20; 0))}`
   - Eingabe mit `Strg+Umschalt+Enter` (CSE). In Excel 365 ohne CSE möglich (dynamische Arrays).
2. **Größten Umsatz pro Region:**
   - `{=MAX(WENN(A2:A20="Nord"; C2:C20))}` → größter Umsatz der Region "Nord".
3. **Dynamische Arrays (Excel 365):**
   - `=SORTIEREN(EINDEUTIG(A2:A50))` → eindeutige Werte alphabetisch, automatisch überlaufend.
   - **Lernziel:** Klassische CSE-Matrixformeln und moderne dynamische Arrays.

---
## Übung 2.6: Datums- und Zeitfunktionen


Die folgende Übungstabelle **Modul 2 6 Datum_Zeit** ist bereits geladen.

1. Berechnen Sie das Alter von Personen aus dem Geburtsdatum mit
   `=DATEDIF(B2;HEUTE();"Y")`.
2. Ermitteln Sie mit `MONATSENDE` den letzten Tag des aktuellen Monats.
3. Berechnen Sie das Fälligkeitsdatum 30 Arbeitstage nach Bestelldatum mit
   `ARBEITSTAG`.
4. Berechnen Sie die Anzahl Arbeitstage zwischen zwei Daten mit
   `NETTOARBEITSTAGE`.

---

### Lösung

**Lösung:**
1. **Alter mit DATEDIF:** `=DATEDIF(B2; HEUTE(); "Y")`
   - Exaktes Alter in ganzen Jahren, berücksichtigt ob Geburtstag schon war.
2. **MONATSENDE:** `=MONATSENDE(HEUTE(); 0)` → letzter Tag des aktuellen Monats.
3. **Fälligkeit nach 30 Arbeitstagen:** `=ARBEITSTAG(B2; 30)` → 30 Arbeitstage nach Bestelldatum.
4. **NETTOARBEITSTAGE:** `=NETTOARBEITSTAGE(B2; C2)` → Anzahl Arbeitstage zwischen zwei Daten.
   - **Lernziel:** Datumsfunktionen für praxisrelevante Berechnungen (Alter, Fristen, Arbeitstage).

---
## ## Modul 3: Referenzen 3D, Namen und externe Verknüpfungen

## Übung 3.1: Namen definieren und verwalten


Die folgende Übungstabelle **Modul 3 1 Namen** ist bereits geladen.

1. Definieren Sie Namen für: MwSt_Satz (19%), Einkommensteuer (25%),
   Sozialabgaben (15%).
2. Erstellen Sie einen dynamischen Namen `AlleDaten` mit BEREICH.VERSCHIEBEN,
   der automatisch neue Zeilen einschließt.
3. Verwenden Sie die Namen in einer Gehaltsabrechnungs-Formel.

---

### Lösung

**Lösung:**
1. **Konstanten-Namen:** `Strg+F3 → Neu`. Name: `MwSt_Satz`, Bezieht sich auf: `=0,19`. Ebenso: `Einkommensteuer = 0,25`, `Sozialabgaben = 0,15`.
2. **Dynamischen Namen:** `AlleDaten = BEREICH.VERSCHIEBEN(Tabelle1!$A$1;0;0;ANZAHL2(Tabelle1!$A:$A);5)`.
3. **In Gehaltsabrechnung verwenden:** `=B2*(1-Einkommensteuer-Sozialabgaben)` → Nettogehalt.
   - **Lernziel:** Namen für Konstanten und dynamische Bereiche professionell einsetzen.

---
## Übung 3.2: 3D-Bezüge erstellen


Die folgende Übungstabelle **Modul 3 2 3D_Bezuege** ist bereits geladen.

1. Erstellen Sie eine Jahresübersicht, die mit `=SUMME(Januar:Dezember!B2)`
   die Gesamtsumme über alle Monatsblätter berechnet.
2. Fügen Sie ein neues Blatt zwischen Januar und Februar ein  prüfen Sie,
   ob der 3D-Bezug das neue Blatt automatisch einschließt.

---

### Lösung

**Lösung:**
1. **Jahresübersicht mit 3D-Bezug:** `=SUMME(Januar:Dezember!B2)` → summiert B2 aus allen Blättern zwischen Januar und Dezember.
2. **Neues Blatt einfügen und prüfen:** Blatt zwischen Januar und Februar einfügen → 3D-Bezug schließt es automatisch ein (weil zwischen den Grenzblättern). Blatt VOR Januar oder NACH Dezember bleibt ausgeschlossen.
   - **Lernziel:** 3D-Bezüge für blattübergreifende Berechnungen und deren automatische Erweiterung.

---
## Übung 3.3: Externe Verknüpfungen


Die folgende Übungstabelle **Modul 3 3 Verknuepfungen** ist bereits geladen.

1. Erstellen Sie eine Verknüpfung zu einer externen Arbeitsmappe
   `Budgetdaten.xlsx`, Blatt `Q1`, Zelle `B5`.
2. Testen Sie: Ändern Sie den Wert in der Quelldatei und aktualisieren
   Sie die Verknüpfung (Daten  Alle aktualisieren).
3. Lösen Sie die Verknüpfung und prüfen Sie, ob die Werte erhalten bleiben.

---

### Lösung

**Lösung:**
1. **Externe Verknüpfung:** `=` tippen, zur Quelldatei wechseln, Zelle anklicken → `Enter`. Syntax: `=[Budgetdaten.xlsx]Q1!B5`.
2. **Verknüpfung aktualisieren:** Quelldatei ändern → `Daten → Verknüpfungen bearbeiten → Werte aktualisieren`.
3. **Verknüpfung lösen:** `Daten → Verknüpfungen bearbeiten → Verknüpfung lösen`. Werte bleiben als statische Zahlen erhalten.
   - **Lernziel:** Externe Verknüpfungen erstellen, aktualisieren und bei Bedarf lösen.

---
## Übung 3.4: Daten konsolidieren


Die folgende Übungstabelle **Modul 3 4 Konsolidierung** ist bereits geladen.

1. Sie haben drei Blätter (Q1, Q2, Q3) mit Umsätzen pro Produkt. Konsolidieren
   Sie die Daten auf einem Jahresübersichtsblatt (Daten → Konsolidieren).
2. Konsolidieren Sie nach Kategorie: Die Produkte stehen in unterschiedlicher
   Reihenfolge auf den Quartalsblättern.
3. Aktivieren Sie die Verknüpfung mit den Quelldaten und ändern Sie einen Wert
   in Q1 — aktualisiert sich die Konsolidierung?

---

### Lösung

**Lösung:**
1. **Daten konsolidieren (nach Position):** Neues Blatt → `Daten → Konsolidieren`. Funktion: `Summe`. Verweis: Q1, Q2, Q3 nacheinander hinzufügen → `OK`.
2. **Nach Kategorie:** Häkchen bei `Oberste Zeile` und `Linke Spalte`. Produkte können in unterschiedlicher Reihenfolge stehen.
3. **Verknüpfung aktivieren:** Häkchen bei `Verknüpfung mit den Quelldaten` → Änderungen in Q1 werden automatisch übernommen.
   - **Lernziel:** Datenkonsolidierung nach Position und Kategorie mit automatischer Aktualisierung.

---
## ## Modul 4: Datenbanken in Excel  Spezialfilter und Datenbankfunktionen

## Übung 4.1: Spezialfilter anwenden


Die folgende Übungstabelle **Modul 4 1 Spezialfilter** ist bereits geladen.

1. Erstellen Sie einen Kriterienbereich für: Region "Nord" UND Umsatz > 10.000.
2. Erweitern Sie: Region "Nord" ODER Region "Süd" (jeweils Umsatz > 10.000).
   **Achtung:** Bei ODER mit UND-Bedingung muss die Bedingung >10.000 in
   JEDER Zeile des Kriterienbereichs wiederholt werden.
3. Extrahieren Sie eindeutige Datensätze in einen neuen Bereich.

---

### Lösung

**Lösung:**
1. **UND-Bedingung (Nord & >10.000):** Kriterienbereich E1:F2: E1=`Region`, F1=`Umsatz`, E2=`Nord`, F2=`>10000`. `Daten → Erweitert` → Kriterienbereich: E1:F2.
2. **ODER mit UND (Nord/Süd je >10.000):** Kriterien E1:F3: Zeile 2 = `Nord | >10000`, Zeile 3 = `Süd | >10000`. Bedingung `>10000` muss in JEDER Zeile wiederholt werden.
3. **Eindeutige Datensätze:** Im Erweitert-Dialog: `An eine andere Stelle kopieren` + `Nur eindeutige Datensätze` → Duplikate werden eliminiert.
   - **Lernziel:** Komplexe Filterlogik mit UND/ODER im Spezialfilter.

---
## Übung 4.2: Datenbankfunktionen


Die folgende Übungstabelle **Modul 4 2 Datenbankfunktionen** ist bereits geladen.

1. Berechnen Sie mit DBSUMME den Gesamtumsatz für die Region "West".
2. Berechnen Sie mit DBMITTELWERT das Durchschnittsalter der Kunden aus "Berlin".
3. Extrahieren Sie mit DBAUSZUG den Namen des Kunden mit ID 1042.

---

### Lösung

**Lösung:**
1. **DBSUMME:** `=DBSUMME(A1:D100; "Umsatz"; F1:G2)` → Gesamtumsatz Region "West".
2. **DBMITTELWERT:** `=DBMITTELWERT(A1:D100; "Alter"; F1:G2)` → Durchschnittsalter "Berlin".
3. **DBAUSZUG:** `=DBAUSZUG(A1:D100; "Name"; F1:G2)` → Kunde mit ID 1042.
   - **Achtung:** `#ZAHL!` bei mehreren Treffern, `#WERT!` bei keinem. Für Zählung: `DBANZAHL2`.
   - **Lernziel:** Datenbankfunktionen als flexible Alternative zu SUMMEWENNS.

---
## Übung 4.3: Teilergebnisse berechnen


Die folgende Übungstabelle **Modul 4 3 Teilergebnisse** ist bereits geladen.

1. Sortieren Sie die Tabelle nach Region, dann nach Produkt.
2. Fügen Sie Teilergebnisse für die Summe des Umsatzes pro Region ein.
3. Fügen Sie eine zweite Teilergebnis-Ebene für die Anzahl pro Produkt ein.
   **Wichtig:** Entfernen Sie das Häkchen bei „Aktuelle Teilergebnisse ersetzen".

---

### Lösung

**Lösung:**
1. **Sortieren:** `Daten → Sortieren`. 1. Ebene: `Region`, 2. Ebene: `Produkt` → OK.
2. **Teilergebnisse (1. Ebene):** `Daten → Teilergebnis`. Gruppieren: `Region`, Funktion: `Summe`, Werte: `Umsatz`.
3. **Zweite Ebene:** Erneut `Teilergebnis`, Gruppieren: `Produkt`, Funktion: `Anzahl`. **Wichtig:** Häkchen bei `Aktuelle Teilergebnisse ersetzen` entfernen!
   - **Lernziel:** Mehrstufige Teilergebnisse mit korrekter Behandlung bestehender Gliederungen.

---
## Übung 4.4: Excel-Tabellen verwenden


Die folgende Übungstabelle **Modul 4 4 Tabellen** ist bereits geladen.

1. Wandeln Sie den Datenbereich mit `Strg+T` in eine Excel-Tabelle um.
2. Berechnen Sie eine neue Spalte mit strukturiertem Verweis: `=[@Menge]*[@Preis]`.
3. Fügen Sie eine Ergebniszeile hinzu (Tabellenentwurf → Ergebniszeile).
4. Fügen Sie neue Datenzeilen hinzu — werden Formatierung und Formeln
   automatisch übernommen?

---

### Lösung

**Lösung:**
1. **In Excel-Tabelle:** `Strg+T` → `OK`.
2. **Strukturierter Verweis:** `=[@Menge]*[@Preis]` in neuer Spalte. Formel wird automatisch auf alle Zeilen übertragen.
3. **Ergebniszeile:** `Tabellenentwurf → Ergebniszeile` aktivieren → Dropdown für SUMME, MITTELWERT etc.
4. **Neue Zeilen testen:** Daten in erste Leerzeile unter der Tabelle eingeben → Formatierung und Formeln werden automatisch übernommen.
   - **Lernziel:** Excel-Tabellen als intelligente Datenstruktur mit automatischen Erweiterungen.

---
## ## Modul 5: Erweiterte Pivot-Tabellen

## Übung 5.1: Pivot-Tabelle erstellen


Die folgende Übungstabelle **Modul 5 1 Pivot** ist bereits geladen.

1. Erstellen Sie eine Pivot-Tabelle: Region & Produkt als Zeilen,
   Quartal als Spalten, Summe Umsatz als Werte.
   **Hinweis:** Falls Ihre Daten nur eine Datumsspalte haben, gruppieren
   Sie das Datumsfeld nach Quartalen (siehe Übung 5.2).
2. Ändern Sie die Zusammenfassung auf Mittelwert.
3. Zeigen Sie die Werte als % des Gesamtergebnisses an.

---

### Lösung

**Lösung:**
1. **Pivot-Tabelle mit Kreuztabelle:** `Einfügen → PivotTable`. Zeilen: `Region`, `Produkt`. Spalten: `Quartal`. Werte: `Umsatz`. Falls nur Datum: Rechtsklick → `Gruppieren → Quartale`.
2. **Zusammenfassung ändern:** Wertebereich → `Wertfeldeinstellungen → Mittelwert`.
3. **% des Gesamtergebnisses:** Rechtsklick auf Wert → `Werte anzeigen als → % des Gesamtergebnisses`.
   - **Lernziel:** Komplexe Pivot-Tabelle mit Zeilen-, Spalten- und Wertefeld.

---
## Übung 5.2: Gruppieren und berechnete Felder


Die folgende Übungstabelle **Modul 5 2 Pivot_Anpassung** ist bereits geladen.

1. Gruppieren Sie die Datumswerte nach Monaten und Quartalen.
2. Erstellen Sie ein berechnetes Feld `Bonus = Umsatz * 0,05`.
3. Erstellen Sie ein berechnetes Feld `Marge = (Umsatz - Kosten) / Umsatz`,
   formatiert als Prozent.

---

### Lösung

**Lösung:**
1. **Datum gruppieren:** Datumsfeld rechtsklicken → `Gruppieren → Monate, Quartale`.
2. **Berechnetes Feld Bonus:** `PivotTable-Analyse → Berechnetes Feld`. Name: `Bonus`, Formel: `=Umsatz * 0,05`.
3. **Berechnetes Feld Marge:** Name: `Marge`, Formel: `=(Umsatz - Kosten) / Umsatz`. Formatieren als Prozent.
   - **Achtung:** Berechnete Felder arbeiten mit aggregierten Werten, nicht zeilenweise.
   - **Lernziel:** Datumsgruppierung und berechnete Felder in Pivot-Tabellen.

---
## Übung 5.3: Slicer einsetzen


Die folgende Übungstabelle **Modul 5 3 Slicer** ist bereits geladen.

1. Fügen Sie Slicer für Region und Produktkategorie ein.
2. Erstellen Sie eine zweite Pivot-Tabelle (Anzahl pro Region) und verbinden
   Sie beide Tabellen mit denselben Slicern.
3. Fügen Sie eine Zeitachse für das Bestelldatum hinzu.

---

### Lösung

**Lösung:**
1. **Slicer einfügen:** `PivotTable-Analyse → Slicer einfügen → Region, Produktkategorie`.
2. **Zweite Pivot-Tabelle verbinden:** Zweite Pivot-Tabelle erstellen. Slicer anklicken → `Berichtsverbindungen` → beide Tabellen anhaken.
3. **Zeitachse:** `PivotTable-Analyse → Zeitachse einfügen → Bestelldatum`. Per Schieberegler Zeiträume filtern.
   - **Lernziel:** Slicer und Zeitachsen mit mehreren Pivot-Tabellen synchronisieren.

---
## Übung 5.4: Pivot-Chart erstellen


Die folgende Übungstabelle **Modul 5 4 PivotChart** ist bereits geladen.

1. Erstellen Sie aus Ihrer Pivot-Tabelle ein Pivot-Chart (Säulendiagramm).
2. Fügen Sie einen zweiten Slicer hinzu und beobachten Sie, wie sich das
   Diagramm automatisch anpasst.
3. Ändern Sie den Diagrammtyp zu einem gestapelten Säulendiagramm.

---

### Lösung

**Lösung:**
1. **PivotChart:** Pivot-Tabelle anklicken → `PivotTable-Analyse → PivotChart → Gruppierte Säulen`.
2. **Slicer testen:** Slicer für Region hinzufügen → auf Region klicken → Tabelle und Diagramm filtern sich automatisch.
3. **Diagrammtyp ändern:** `Entwurf → Diagrammtyp ändern → Gestapelte Säulen`. Zeigt Zusammensetzung der Regionen pro Quartal.
   - **Lernziel:** PivotCharts als interaktive Visualisierung mit Slicer-Steuerung.

---
## ## Modul 6: Datenanalyse, Szenarien und Solver

## Übung 6.1: Zielwertsuche und Datentabellen


Die folgende Übungstabelle **Modul 6 1 Zielwertsuche** ist bereits geladen.

1. Nutzen Sie die Zielwertsuche: Welcher Stückpreis ist nötig, um 100.000 
   Gesamtumsatz zu erreichen?
2. Erstellen Sie eine Datentabelle, die die monatliche Rate für verschiedene
   Zinssätze (3% - 8%) und Laufzeiten (10 - 30 Jahre) zeigt.
   **Tipp:** Zeilen- und Spalteneingabezelle müssen absolut referenziert
   sein ($B$1 und $B$2).

---

### Lösung

**Lösung:**
1. **Zielwertsuche:** Formel in B4: `=B2*B3` (Stückpreis × Menge). `Daten → Zielwertsuche`: Zielzelle=B4, Zielwert=100000, Veränderbare=B2 → `OK`.
2. **Zweidimensionale Datentabelle:**
   - Formel in A1: `=RMZ($B$1/12; $C$1*12; -250000)`.
   - Zinssätze in A2:A14 (3%–8%), Laufzeiten in B1:K1 (10–30).
   - Bereich A1:K14 markieren → `Datentabelle`. Zeile: B1, Spalte: C1 → `OK`.
   - **Tipp:** Eingabezellen MÜSSEN absolut referenziert sein.
   - **Lernziel:** Zielwertsuche und zweidimensionale Datentabellen.

---
## Übung 6.2: Szenarien erstellen


Die folgende Übungstabelle **Modul 6 2 Szenarien** ist bereits geladen.

1. Erstellen Sie drei Szenarien: Optimistisch (Wachstum 10%), Neutral (5%),
   Pessimistisch (-2%).
2. Erstellen Sie einen Szenario-Zusammenfassungsbericht.
3. Wechseln Sie zwischen den Szenarien und beobachten Sie die Auswirkungen
   auf den Gesamtgewinn.

---

### Lösung

**Lösung:**
1. **Drei Szenarien:** Voraussetzung: Wachstumsrate in B1. `Daten → Szenario-Manager → Hinzufügen`. Optimistisch: B1=0,10, Neutral: 0,05, Pessimistisch: -0,02.
2. **Zusammenfassungsbericht:** `Szenario-Manager → Zusammenfassung`. Ergebniszellen auswählen → neues Blatt mit Szenarien-Tabelle.
3. **Szenarien wechseln:** `Szenario-Manager → Szenario wählen → Anzeigen`. Alle abhängigen Formeln werden sofort neu berechnet.
   - **Lernziel:** Szenario-Manager für Best-Case/Worst-Case-Analysen.

---
## Übung 6.3: Solver einsetzen


Die folgende Übungstabelle **Modul 6 3 Solver** ist bereits geladen.

1. Maximieren Sie den Gewinn unter folgenden Nebenbedingungen:
   - Produktionsmenge >= 0 (keine negativen Mengen)
   - Gesamtkosten <= Budget (50.000 )
   - Max. Produktionskapazität pro Produkt beachten
   **Tipp:** Aktivieren Sie „Nicht negative Variablen" und wählen Sie bei
   linearen Modellen die Methode „Simplex-LP".
2. Ändern Sie die Nebenbedingungen und vergleichen Sie die Ergebnisse.

---

### Lösung

**Lösung:**
1. **Solver konfigurieren:**
   - `Daten → Solver`. Ziel: Gewinn-Zelle, Max. Variablen: Produktionsmengen.
   - Nebenbedingungen: `>= 0`, `Gesamtkosten <= 50000`, `<= Kapazitäten`.
   - `Nicht negative Variablen` aktivieren. Methode: `Simplex-LP` → `Lösen`.
2. **Ergebnisse vergleichen:** `Antwortbericht` erstellen. Nebenbedingungen ändern → erneut lösen → Gewinnänderung analysieren.
   - **Lernziel:** Solver für lineare Optimierung mit korrekter Methodenauswahl.

---
## Übung 6.4: Sparklines und Trendlinien


Die folgende Übungstabelle **Modul 6 4 Sparklines** ist bereits geladen.

1. Fügen Sie Liniensparklines für die monatlichen Umsatzzahlen ein.
2. Fügen Sie eine lineare Trendlinie zum Umsatzdiagramm hinzu und lassen
   Sie R anzeigen.
3. Interpretieren Sie R² = 0,87: Ist das ein starker Zusammenhang?

---

### Lösung

**Lösung:**
1. **Sparklines:** Zielzellen markieren → `Einfügen → Sparklines → Linie`. Datenbereich: monatliche Umsätze pro Zeile.
2. **Trendlinie mit R²:** Diagramm anklicken → `+ → Trendlinie → Linear`. `Trendlinie formatieren → R² im Diagramm anzeigen`.
3. **R²=0,87 interpretieren:** 87% der Varianz werden durch das lineare Modell erklärt → starker Zusammenhang. Nahe 1,0 = sehr stark, nahe 0 = schwach.
   - **Lernziel:** Sparklines und Trendlinien mit statistischer Interpretation.

---
## ## Modul 7: Erweiterte Diagramme und Dashboards

## Übung 7.1: Verbunddiagramm erstellen


Die folgende Übungstabelle **Modul 7 1 Verbunddiagramm** ist bereits geladen.

1. Erstellen Sie ein Kombinationsdiagramm: Umsatz als Säulen, Wachstumsrate als Linie
   mit Sekundärachse.
2. Formatieren Sie die linke Achse in , die rechte Achse in %.
3. Fügen Sie Fehlerindikatoren hinzu (Standardabweichung).

---

### Lösung

**Lösung:**
1. **Kombinationsdiagramm:** Umsatz + Wachstumsrate markieren → `Einfügen → Kombi-Diagramm`. Umsatz = Säulen, Wachstumsrate = Linie mit Sekundärachse.
2. **Achsen formatieren:** Links = Währung (€), Rechts = Prozent. `Achse formatieren → Zahl`.
3. **Fehlerindikatoren:** `+ → Fehlerindikatoren → Standardabweichung`. Visuelle Darstellung der Variabilität.
   - **Lernziel:** Kombinationsdiagramm mit zwei Skalen und statistischen Fehlerindikatoren.

---
## Übung 7.2: Wasserfalldiagramm


Die folgende Übungstabelle **Modul 7 2 Wasserfall** ist bereits geladen.

1. Erstellen Sie ein Wasserfalldiagramm aus einer Gewinn- und Verlustrechnung.
2. Formatieren Sie: Erhöhungen grün, Verminderungen rot, Gesamtwert blau.
3. Fügen Sie Datenbeschriftungen zu den Säulen hinzu.

---

### Lösung

**Lösung:**
1. **Wasserfalldiagramm:** GuV-Daten markieren → `Einfügen → Wasserfall`. Excel erkennt automatisch Anfangs-/Endwerte und Zu-/Abnahmen.
2. **Farben:** Erhöhungen = Grün, Verminderungen = Rot, Gesamtwert = Blau (jeweils doppelt anklicken für Einzelauswahl).
3. **Datenbeschriftungen:** `+ → Datenbeschriftungen`. Werte direkt an den Säulen.
   - **Lernziel:** Wasserfalldiagramm für Gewinn- und Verlustrechnung professionell formatieren.

---
## Übung 7.3: Dashboard erstellen


Die folgende Übungstabelle **Modul 7 3 Dashboard** ist bereits geladen.

1. Erstellen Sie auf einem neuen Blatt:
   - Ein Liniendiagramm (Umsatzverlauf 12 Monate)
   - Ein Säulendiagramm (Umsatz nach Region)
   - Sparklines pro Produktkategorie
   - Slicer für Region und Jahr
2. Ordnen Sie die Elemente übersichtlich an (Raster verwenden).
3. Blenden Sie Gitternetzlinien und Überschriften aus für ein
   professionelles Erscheinungsbild.

---

### Lösung

**Lösung:**
1. **Dashboard-Elemente auf neuem Blatt:**
   - Liniendiagramm: 12-Monats-Umsatz mit Markern.
   - Säulendiagramm: Umsatz nach Region.
   - Sparklines: Pro Produktkategorie in Nachbarzellen.
   - Slicer: Für Region und Jahr (mit Pivot-Tabellen verbunden).
2. **Am Raster ausrichten:** `Alt` gedrückt halten beim Ziehen → Elemente rasten ein.
3. **Professionelles Erscheinungsbild:** `Ansicht → Gitternetzlinien/Überschriften` deaktivieren. Dezente Farben, keine dicken Rahmen.
   - **Lernziel:** Vollständiges Dashboard mit Diagrammen, Sparklines und Slicern.

---
## ## Modul 8: Automatisierung mit Makros

## Übung 8.1: Entwicklertools aktivieren und Makro aufzeichnen


Die folgende Übungstabelle **Modul 8 1 Makro_Aufzeichnen** ist bereits geladen.

1. Aktivieren Sie die Registerkarte Entwicklertools und speichern Sie als `.xlsm`.
2. Zeichnen Sie ein Makro auf, das einen Bericht formatiert: Überschrift fett
   und zentriert, blaue Kopfzeile, Rahmen um den Datenbereich.
3. Führen Sie das Makro auf einem zweiten Tabellenblatt aus.

---

### Lösung

**Lösung:**
1. **Entwicklertools & .xlsm:** `Datei → Optionen → Menüband anpassen → Entwicklertools`. Speichern als `*.xlsm`.
2. **Makro aufzeichnen:** `Entwicklertools → Makro aufzeichnen`. Überschrift fett + zentriert, Kopfzeile blau/weiß, Rahmen → Aufzeichnung beenden.
3. **Auf anderem Blatt ausführen:** Leeres Blatt → `Entwicklertools → Makros → Ausführen`. Alle Formatierungsschritte wiederholt.
   - **Lernziel:** Makro-Aufzeichnung und Wiederverwendung auf verschiedenen Blättern.

---
## Übung 8.2: Makro zuweisen


Die folgende Übungstabelle **Modul 8 2 Makro_Zuweisen** ist bereits geladen.

1. Weisen Sie Ihr Makro einer Schaltfläche zu (Entwicklertools  Einfügen 
   Schaltfläche).
2. Richten Sie eine Tastenkombination `Strg+Umschalt+F` für das Makro ein.
3. Testen Sie beide Ausführungsmethoden.

---

### Lösung

**Lösung:**
1. **Schaltfläche zuweisen:** `Entwicklertools → Einfügen → Schaltfläche`. Aufziehen → Makro auswählen → Text bearbeiten.
2. **Tastenkombination:** `Entwicklertools → Makros → Optionen`. Tastenkombination: `Strg+Umschalt+F`.
3. **Beide testen:** `Strg+Umschalt+F` oder Schaltfläche klicken → Makro läuft.
   - **Lernziel:** Mehrere Wege zur Makro-Ausführung (Schaltfläche + Tastenkombination).

---
## Übung 8.3: VBA-Editor erkunden


Die folgende Übungstabelle **Modul 8 3 VBA_Editor** ist bereits geladen.

1. Öffnen Sie den VBA-Editor mit `Alt+F11`.
2. Finden Sie Ihr aufgezeichnetes Makro im Projekt-Explorer.
3. Ändern Sie eine Farbe im Code (z.B. `.Color = RGB(0, 0, 255)` für Blau).

---

### Lösung

**Lösung:**
1. **VBA-Editor:** `Alt+F11` oder `Entwicklertools → Visual Basic`.
2. **Makro finden:** Projekt-Explorer → `Module → Modul1` doppelklicken. Makro-Code erscheint.
3. **Farbe im Code ändern:** `.Interior.Color = RGB(0, 0, 255)` zu `.Interior.Color = RGB(0, 100, 0)` (Dunkelgrün) ändern. `Strg+S` speichern, `Alt+F11` zurück, Makro ausführen.
   - **Lernziel:** VBA-Editor zur Code-Inspektion und -Anpassung nutzen.

---
## ## Modul 9: VBA-Programmierung (Grundlagen)

## Übung 9.1: Variablen und einfache Berechnung


Die folgende Übungstabelle **Modul 9 1 VBA_Variablen** ist bereits geladen.

1. Schreiben Sie ein Makro, das zwei Werte aus Zellen liest und das Produkt
   in eine dritte Zelle schreibt.
2. Erweitern Sie das Makro: Geben Sie das Ergebnis mit `MsgBox` aus.
3. Testen Sie mit verschiedenen Eingabewerten.

---

### Lösung

**Lösung:**
1. **Produkt aus zwei Zellen:**
   ```vba
   Sub ProduktBerechnen()
       Dim wert1 As Double, ergebnis As Double
       wert1 = Range("B2").Value * Range("C2").Value
       Range("D2").Value = wert1
   End Sub
   ```
2. **Mit MsgBox:**
   ```vba
   Sub ProduktMitMeldung()
       Dim erg As Double
       erg = Range("B2").Value * Range("C2").Value
       Range("D2").Value = erg
       MsgBox "Ergebnis: " & erg
   End Sub
   ```
3. **Test:** Werte in B2/C2 ändern → Makro ausführen (`F5` im Editor).
   - **Lernziel:** Variablen deklarieren, Zellen lesen/schreiben, Ergebnisse ausgeben.

---
## Übung 9.2: Bedingungen und Schleifen


Die folgende Übungstabelle **Modul 9 2 VBA_Kontrollstrukturen** ist bereits geladen.

1. Schreiben Sie ein Makro mit einer For-Schleife, das die Zahlen 1 - 10 in
   A1:A10 schreibt.
2. Erweitern Sie das Makro um eine If-Bedingung: Zahlen > 5 werden fett
   formatiert.
3. Schreiben Sie eine For-Each-Schleife, die alle Zellen mit Wert > 1000
   gelb markiert.

---

### Lösung

**Lösung:**
1. **For-Schleife (1–10):**
   ```vba
   Sub ZahlenSchreiben()
       Dim i As Long
       For i = 1 To 10
           Range("A" & i).Value = i
       Next i
   End Sub
   ```
2. **Mit If:**
   ```vba
   Sub ZahlenMitFett()
       Dim i As Long
       For i = 1 To 10
           Range("A" & i).Value = i
           If i > 5 Then Range("A" & i).Font.Bold = True
       Next i
   End Sub
   ```
3. **For-Each:**
   ```vba
   Sub ZellenFaerben()
       Dim zelle As Range
       For Each zelle In Range("A1:A100")
           If IsNumeric(zelle.Value) And zelle.Value > 1000 Then
               zelle.Interior.Color = vbYellow
           End If
       Next zelle
   End Sub
   ```
   - **Lernziel:** For, For-Each und If in VBA kombinieren.

---
## Übung 9.3: Ereignisse programmieren


Die folgende Übungstabelle **Modul 9 3 VBA_Ereignisse** ist bereits geladen.

1. Erstellen Sie ein Worksheet_Change-Ereignis, das eine Meldung ausgibt,
   wenn in Spalte B ein Wert > 10.000 eingetragen wird.
2. Erstellen Sie ein Workbook_Open-Ereignis, das beim Öffnen das heutige
   Datum in Zelle A1 schreibt.
   **Achtung:** Dieser Code muss im Objekt „DieseArbeitsmappe"
   (nicht in einem Modul) eingefügt werden.

---

### Lösung

**Lösung:**
1. **Worksheet_Change mit Validierung (in das Tabellenblatt-Modul):**
   ```vba
   Private Sub Worksheet_Change(ByVal Target As Range)
       If Target.Cells.Count > 1 Then Exit Sub
       If Target.Column = 2 And IsNumeric(Target.Value) Then
           If Target.Value > 10000 Then
               MsgBox "Hoher Betrag: " & Target.Value
           End If
       End If
   End Sub
   ```
2. **Workbook_Open (in DieseArbeitsmappe):**
   ```vba
   Private Sub Workbook_Open()
       Range("A1").Value = Date
   End Sub
   ```
   - **Achtung:** Workbook_Open MUSS in `DieseArbeitsmappe`, nicht in einem Modul.
   - **Lernziel:** Ereignisprogrammierung mit Worksheet_Change und Workbook_Open.

---
## Übung 9.4: UDF erstellen


Die folgende Übungstabelle **Modul 9 4 VBA_UDF** ist bereits geladen.

1. Schreiben Sie eine UDF `Bonus(Umsatz As Double) As Double`, die 5% Bonus ab
   10.000 , sonst 0% berechnet.
2. Verwenden Sie Ihre UDF in einer Formel: `=Bonus(B2)`.
3. Erstellen Sie eine UDF `Kategorie(Alter As Double) As String` mit If/ElseIf
   für die Altersgruppen <30, 30-50, >50.

---

### Lösung

**Lösung:**
1. **UDF Bonus (in ein Modul):**
   ```vba
   Function Bonus(Umsatz As Double) As Double
       If Umsatz >= 10000 Then Bonus = Umsatz * 0.05 Else Bonus = 0
   End Function
   ```
   In Excel: `=Bonus(B2)`.
2. **UDF Kategorie:**
   ```vba
   Function Kategorie(Alter As Double) As String
       If Alter < 30 Then Kategorie = "Junior"
       ElseIf Alter <= 50 Then Kategorie = "Mid-Career"
       Else: Kategorie = "Senior"
       End If
   End Function
   ```
   - **Wichtig:** UDFs müssen in einem Modul gespeichert werden, nicht in Tabelle oder DieseArbeitsmappe.
   - **Lernziel:** Eigene Excel-Funktionen mit korrekten Datentypen programmieren.

---
## ## Modul 10: Zusammenarbeit, Vorlagen und Produktivität

## Übung 10.1: Vorlage erstellen


Die folgende Übungstabelle **Modul 10 1 Vorlagen** ist bereits geladen.

1. Erstellen Sie eine Rechnungsvorlage mit: kopfformatiertem Firmenlogo-Bereich,
   automatischer Rechnungsnummer, MwSt-Berechnung und geschützten Formelzellen.
2. Speichern Sie als `.xltx`.
3. Öffnen Sie die Vorlage und prüfen Sie, ob eine neue Arbeitsmappe entsteht.

---

### Lösung

**Lösung:**
1. **Rechnungsvorlage:**
   - Logo-Bereich: A1:C3 verbinden, Platzhalter-Text.
   - Rechnungsnummer: `="RE-" & TEXT(HEUTE();"JJJJMMTT") & "-" & TEXT(ZEILE();"000")`.
   - MwSt: `=Zwischensumme*0,19`. Formelzellen schützen, Eingabezellen entsperren.
2. **Als .xltx speichern:** `Datei → Speichern unter → Excel-Vorlage (*.xltx)`.
3. **Testen:** Vorlage per Doppelklick öffnen → neue, unbenannte Arbeitsmappe entsteht. Original bleibt unverändert.
   - **Lernziel:** Professionelle Vorlagen mit geschützten Bereichen und automatischen Feldern.

---
## Übung 10.2: Für Zusammenarbeit vorbereiten


Die folgende Übungstabelle **Modul 10 2 Zusammenarbeit** ist bereits geladen.

1. Fügen Sie einen Kommentar zu einer Zelle ein (Rechtsklick  Neuer Kommentar).
2. Exportieren Sie das Blatt als PDF mit Seitenumbrüchen.
3. Konfigurieren Sie den Blattschutz so, dass nur die Eingabezellen bearbeitbar
   sind  für externe Mitarbeiter.

---

### Lösung

**Lösung:**
1. **Kommentar:** Rechtsklick → `Neuer Kommentar` → Text eingeben.
2. **PDF mit Seitenumbrüchen:** `Ansicht → Seitenumbruchvorschau`, Umbrüche setzen. `Datei → Exportieren → PDF`.
3. **Blattschutz für Externe:** Eingabezellen entsperren → `Blatt schützen`. Haken bei `Gesperrte Zellen auswählen` entfernen → nur Eingabe erlaubt.
   - **Lernziel:** Professionelle Weitergabe mit Kommentaren, PDF-Export und differenziertem Blattschutz.

---
## Übung 10.4: Tastenkombinationen üben


Die folgende Übungstabelle **Modul 10 4 Tastenkombinationen** ist bereits geladen.

1. Verwenden Sie ausschließlich Tastenkombinationen, um eine Tabelle zu
   formatieren, eine Summe zu bilden und einen Filter zu setzen.
2. Nutzen Sie `Strg+{` und `Strg+}` zur Formelanalyse (Vorgänger/Nachfolger
   anzeigen — auf deutschen Tastaturen: Strg+AltGr+7 bzw. Strg+AltGr+0).
3. Wechseln Sie mit F4 zwischen Bezugstypen beim Bearbeiten einer Formel.

---

### Lösung

**Lösung:**
1. **Nur mit Tastatur:** `Strg+A` (Alles) → `Strg+T` (Tabelle) → `Alt+=` (Summe) → `Strg+Umschalt+L` (Filter).
2. **Formel-Vorgänger/Nachfolger:**
   - `Strg+{` (Strg+AltGr+7) → Vorgängerzellen markieren.
   - `Strg+}` (Strg+AltGr+0) → Nachfolgerzellen markieren.
   - Alternative: `Formeln → Spur zum Vorgänger/Nachfolger`.
3. **F4 für Bezugstypen:** In Formel Zellbezug anklicken → `F4` → wechselt: A1 → $A$1 → A$1 → $A1 → A1.
   - **Lernziel:** Produktivität mit fortgeschrittenen Tastenkombinationen und QWERTZ-Anpassungen.

---
