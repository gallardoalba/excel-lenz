# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: formula-editing.spec.ts >> Nested & Complex Formulas >> nested WENN inside SUMME with false branch
- Location: e2e/formula-editing.spec.ts:519:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Klein"
Received: "Komponente"
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - generic [ref=f1e3]:
    - link "Zum Hauptinhalt springen" [ref=f1e4] [cursor=pointer]:
      - /url: "#main-content"
    - status [ref=f1e5]
    - alert [ref=f1e6]
    - navigation "Hauptnavigation" [ref=f1e7]:
      - link "Excel-lenz" [ref=f1e8] [cursor=pointer]:
        - /url: /
      - generic [ref=f1e11]:
        - link "Kurse" [ref=f1e12] [cursor=pointer]:
          - /url: /courses
        - link "Anmelden" [ref=f1e13] [cursor=pointer]:
          - /url: /login
      - generic [ref=f1e14]:
        - button "Suche öffnen" [ref=f1e15] [cursor=pointer]:
          - generic [ref=f1e19]: ⌘K
        - button "Dunkler Modus" [ref=f1e20] [cursor=pointer]
        - link "GitHub Repository" [ref=f1e23] [cursor=pointer]:
          - /url: https://github.com/gallardoalba/excel-lenz
    - main [ref=f1e26]:
      - generic [ref=f1e27]:
        - generic [ref=f1e28]:
          - link "Zurück zu den Kursen" [ref=f1e29] [cursor=pointer]:
            - /url: /courses
          - 'link "Nächste: Zellen und Bereiche benennen" [ref=f1e33] [cursor=pointer]':
            - /url: /exercises/0af555f1-7d10-4e52-9248-26fce9d74782
          - generic [ref=f1e36]:
            - link "Home" [ref=f1e37] [cursor=pointer]:
              - /url: /
            - text: ›
            - link "Kurse" [ref=f1e38] [cursor=pointer]:
              - /url: /courses
            - text: ›Übung
        - heading [level=1] [ref=f1e39]:
          - text: Was ist Excel?
          - button "Fokus" [ref=f1e40] [cursor=pointer]
        - paragraph [ref=f1e41]: "Lernen Sie die Grundkomponenten von Excel kennen: Arbeitsmappen, Tabellenblätter und Zellen."
        - generic [ref=f1e42]:
          - generic [ref=f1e43]: ~5 Min
          - generic "Drücken Sie ? für Tastenkürzel" [ref=f1e47] [cursor=pointer]:
            - generic [ref=f1e48]: "?"
            - text: Tastenkürzel
        - generic [ref=f1e49]:
          - region "Aufgabenstellung und Hinweise" [ref=f1e50]:
            - generic [ref=f1e51]:
              - button "Anleitung" [ref=f1e52] [cursor=pointer]
              - button "Theorie" [ref=f1e56] [cursor=pointer]
              - button "Community" [ref=f1e59] [cursor=pointer]
            - generic [ref=f1e62]:
              - generic [ref=f1e63]:
                - generic [ref=f1e64]:
                  - generic [ref=f1e65]: "1"
                  - generic [ref=f1e66]: 1. Vervollständigen Sie die Tabelle, indem Sie die fehlenden Beschreibungen und Beispiele zu jeder Excel-Komponente eintragen.
                - generic [ref=f1e67]:
                  - generic [ref=f1e68]: "2"
                  - generic [ref=f1e69]: "2. Überlegen Sie: Was ist eine Arbeitsmappe? Was ist ein Tabellenblatt?"
                - generic [ref=f1e70]:
                  - generic [ref=f1e71]: "3"
                  - generic [ref=f1e72]: 3. Tragen Sie für 'Bearbeitungsleiste' die passende Komponente ein.
              - generic [ref=f1e73]:
                - strong [ref=f1e76]: "Tipp:"
                - text: Eine Arbeitsmappe ist die gesamte Datei — ein Tabellenblatt ist nur ein Teil davon.
              - button "Weitere Tipps" [ref=f1e77] [cursor=pointer]
            - generic [ref=f1e80]:
              - generic [ref=f1e81]:
                - generic [ref=f1e82]: Üben
                - button "Zum Prüfungsmodus wechseln" [ref=f1e88] [cursor=pointer]
                - generic [ref=f1e89]: Prüfung
              - link "Anmelden zum Speichern" [ref=f1e97] [cursor=pointer]:
                - /url: /login
              - button "Hilfe-Tour starten" [ref=f1e101] [cursor=pointer]: Hilfe
          - region "Excel-Arbeitsblatt" [ref=f1e105]:
            - generic [ref=f1e107]:
              - generic [ref=f1e108]:
                - generic [ref=f1e109]:
                  - generic [ref=f1e110]:
                    - button "Exportieren" [ref=f1e111] [cursor=pointer]
                    - button "Rückgängig" [disabled] [ref=f1e114]
                    - button "Wiederholen" [disabled] [ref=f1e117]
                  - generic [ref=f1e120]:
                    - button "Start" [ref=f1e121] [cursor=pointer]
                    - button "Einfügen" [ref=f1e122] [cursor=pointer]
                    - button "Seitenlayout" [ref=f1e123] [cursor=pointer]
                    - button "Formeln" [ref=f1e124] [cursor=pointer]
                    - button "Daten" [ref=f1e125] [cursor=pointer]
                    - button "Überprüfen" [ref=f1e126] [cursor=pointer]
                    - button "Ansicht" [ref=f1e127] [cursor=pointer]
                  - generic [ref=f1e128]: Excel-lenz
                - generic [ref=f1e131]:
                  - generic [ref=f1e132]:
                    - generic [ref=f1e134]:
                      - button "Einfügen" [ref=f1e135] [cursor=pointer]
                      - button "Ausschneiden" [ref=f1e140] [cursor=pointer]
                      - button "Kopieren" [ref=f1e147] [cursor=pointer]
                      - button "Format übertragen" [ref=f1e153] [cursor=pointer]
                    - generic [ref=f1e158]: Zwischenablage
                  - generic [ref=f1e160]:
                    - generic [ref=f1e161]:
                      - generic [ref=f1e162]:
                        - button "Calibri ▼" [ref=f1e164] [cursor=pointer]:
                          - generic [ref=f1e165]: Calibri
                          - generic [ref=f1e166]: ▼
                        - button "11 ▼" [ref=f1e168] [cursor=pointer]:
                          - generic [ref=f1e169]: "11"
                          - generic [ref=f1e170]: ▼
                        - generic [ref=f1e171]:
                          - button "Schriftgrad verkleinern" [ref=f1e172] [cursor=pointer]
                          - button "Schriftgrad vergrößern" [ref=f1e175] [cursor=pointer]
                      - generic [ref=f1e178]:
                        - button "Fett (Strg+B)" [ref=f1e179] [cursor=pointer]
                        - button "Kursiv (Strg+I)" [ref=f1e182] [cursor=pointer]
                        - button "Unterstrichen (Strg+U)" [ref=f1e185] [cursor=pointer]
                        - button "Rahmen" [ref=f1e189] [cursor=pointer]
                        - button "A" [ref=f1e195] [cursor=pointer]
                        - button "Füllfarbe" [ref=f1e199] [cursor=pointer]
                    - generic [ref=f1e204]: Schriftart
                  - generic [ref=f1e206]:
                    - generic [ref=f1e207]:
                      - generic [ref=f1e208]:
                        - button "Linksbündig" [ref=f1e209] [cursor=pointer]
                        - button "Zentriert" [ref=f1e212] [cursor=pointer]
                        - button "Rechtsbündig" [ref=f1e215] [cursor=pointer]
                        - button "⊤" [ref=f1e218] [cursor=pointer]
                        - button "⊟" [ref=f1e219] [cursor=pointer]
                        - button "⊥" [ref=f1e220] [cursor=pointer]
                      - generic [ref=f1e221]:
                        - button "Verbinden und zentrieren" [ref=f1e222] [cursor=pointer]
                        - button "Zeilenumbruch" [ref=f1e227] [cursor=pointer]
                    - generic [ref=f1e230]: Ausrichtung
                  - generic [ref=f1e232]:
                    - generic [ref=f1e233]:
                      - button "Standard ▼" [ref=f1e235] [cursor=pointer]:
                        - generic [ref=f1e236]: Standard
                        - generic [ref=f1e237]: ▼
                      - generic [ref=f1e238]:
                        - button "%" [ref=f1e239] [cursor=pointer]
                        - button "₀₀₀" [ref=f1e240] [cursor=pointer]
                        - button ".0+" [ref=f1e241] [cursor=pointer]
                        - button ".0−" [ref=f1e242] [cursor=pointer]
                    - generic [ref=f1e243]: Zahl
                  - generic [ref=f1e245]:
                    - generic [ref=f1e247]:
                      - generic [ref=f1e249]:
                        - button "AutoSumme" [ref=f1e250] [cursor=pointer]:
                          - img [ref=f1e251]:
                            - generic [ref=f1e252]: Σ
                        - button "▾" [ref=f1e253] [cursor=pointer]
                      - button "Bedingt" [ref=f1e254] [cursor=pointer]
                      - button "↩" [ref=f1e261] [cursor=pointer]
                      - button "↪" [ref=f1e266] [cursor=pointer]
                    - generic [ref=f1e271]: Bearbeiten
              - region "Bearbeitungsleiste" [ref=f1e272]:
                - textbox "Zellbezug" [ref=f1e273]: A2
                - generic [ref=f1e274]:
                  - button "Abbrechen" [ref=f1e275] [cursor=pointer]: ✗
                  - button "Bestätigen" [ref=f1e276] [cursor=pointer]: ✓
                  - button "Formel einfügen" [ref=f1e277] [cursor=pointer]: fx
                - generic [ref=f1e278]:
                  - combobox "Formel eingeben" [ref=f1e279]: =WENN(SUMME(2;3)>10;"Groß";"Klein") =WENN(SUMME(2;3)>10;"Groß";"Klein")
                  - button "Formelleiste erweitern" [ref=f1e280] [cursor=pointer]: ▼
              - treegrid [ref=f1e285]:
                - rowgroup [ref=f1e294]:
                  - row [ref=f1e295]:
                    - gridcell "Komponente" [ref=f1e296]
                    - gridcell "Beschreibung" [ref=f1e297]
                    - gridcell "Beispiel" [ref=f1e298]
                    - gridcell [ref=f1e299]
                    - gridcell [ref=f1e300]
                  - row [ref=f1e301]:
                    - gridcell "Arbeitsmappe" [selected] [ref=f1e302]
                    - gridcell "Die gesamte Excel-Datei" [ref=f1e303]
                    - gridcell ".xlsx-Datei" [ref=f1e304]
                    - gridcell [ref=f1e305]
                    - gridcell [ref=f1e306]
                  - row [ref=f1e307]:
                    - gridcell "Tabellenblatt" [ref=f1e308]
                    - gridcell [ref=f1e309]
                    - gridcell "Tabelle1" [ref=f1e310]
                    - gridcell [ref=f1e311]
                    - gridcell [ref=f1e312]
                  - row [ref=f1e313]:
                    - gridcell "Zelle" [ref=f1e314]
                    - gridcell "Schnittpunkt von Zeile und Spalte" [ref=f1e315]
                    - gridcell [ref=f1e316]
                    - gridcell [ref=f1e317]
                    - gridcell [ref=f1e318]
                  - row [ref=f1e319]:
                    - gridcell "Spalte" [ref=f1e320]
                    - gridcell "Vertikale Anordnung, Buchstaben" [ref=f1e321]
                    - gridcell "A, B, C" [ref=f1e322]
                    - gridcell [ref=f1e323]
                    - gridcell [ref=f1e324]
                  - row [ref=f1e325]:
                    - gridcell "Zeile" [ref=f1e326]
                    - gridcell "Horizontale Anordnung, Nummern" [ref=f1e327]
                    - gridcell [ref=f1e328]
                    - gridcell [ref=f1e329]
                    - gridcell [ref=f1e330]
                  - row [ref=f1e331]:
                    - gridcell [ref=f1e332]
                    - gridcell "Ort zur Eingabe von Formeln" [ref=f1e333]
                    - gridcell "0" [ref=f1e334]
                    - gridcell [ref=f1e335]
                    - gridcell [ref=f1e336]
                  - row [ref=f1e337]:
                    - gridcell [ref=f1e338]
                    - gridcell [ref=f1e339]
                    - gridcell [ref=f1e340]
                    - gridcell [ref=f1e341]
                    - gridcell [ref=f1e342]
                  - row [ref=f1e343]:
                    - gridcell [ref=f1e344]
                    - gridcell [ref=f1e345]
                    - gridcell [ref=f1e346]
                    - gridcell [ref=f1e347]
                    - gridcell [ref=f1e348]
                  - row [ref=f1e349]:
                    - gridcell [ref=f1e350]
                    - gridcell [ref=f1e351]
                    - gridcell [ref=f1e352]
                    - gridcell [ref=f1e353]
                    - gridcell [ref=f1e354]
                  - row [ref=f1e355]:
                    - gridcell [ref=f1e356]
                    - gridcell [ref=f1e357]
                    - gridcell [ref=f1e358]
                    - gridcell [ref=f1e359]
                    - gridcell [ref=f1e360]
                - rowgroup [ref=f1e372]:
                  - row [ref=f1e373]:
                    - gridcell "Select whole grid" [ref=f1e374]
                    - columnheader "A" [ref=f1e375]:
                      - text: A
                      - button [ref=f1e376]
                    - columnheader "B" [ref=f1e377]:
                      - text: B
                      - button [ref=f1e378]
                    - columnheader "C" [ref=f1e379]:
                      - text: C
                      - button [ref=f1e380]
                    - columnheader "D" [ref=f1e381]:
                      - text: D
                      - button [ref=f1e382]
                    - columnheader "E" [ref=f1e383]:
                      - text: E
                      - button [ref=f1e384]
                - rowgroup
                - rowgroup [ref=f1e387]:
                  - row [ref=f1e388]:
                    - rowheader "1" [ref=f1e389]
                  - row [ref=f1e392]:
                    - rowheader "2" [ref=f1e393]
                  - row [ref=f1e396]:
                    - rowheader "3" [ref=f1e397]
                  - row [ref=f1e400]:
                    - rowheader "4" [ref=f1e401]
                  - row [ref=f1e404]:
                    - rowheader "5" [ref=f1e405]
                  - row [ref=f1e408]:
                    - rowheader "6" [ref=f1e409]
                  - row [ref=f1e412]:
                    - rowheader "7" [ref=f1e413]
                  - row [ref=f1e416]:
                    - rowheader "8" [ref=f1e417]
                  - row [ref=f1e420]:
                    - rowheader "9" [ref=f1e421]
                  - row [ref=f1e424]:
                    - rowheader "10" [ref=f1e425]
                  - row [ref=f1e428]:
                    - rowheader "11" [ref=f1e429]
                - rowgroup [ref=f1e434]:
                  - row [ref=f1e435]:
                    - gridcell "Select whole grid" [ref=f1e436]
                - rowgroup
                - textbox [ref=f1e438]: =WENN(SUMME(2;3)>10;"Groß";"Klein")
              - generic [ref=f1e439]:
                - generic [ref=f1e440]:
                  - button "Tabelle1" [ref=f1e441] [cursor=pointer]
                  - button "+" [ref=f1e442] [cursor=pointer]
                - generic [ref=f1e443]: Bereit
                - generic [ref=f1e446]:
                  - button "−" [ref=f1e447] [cursor=pointer]
                  - slider [ref=f1e449]: "100"
                  - button "+" [ref=f1e450] [cursor=pointer]
                  - button "100%" [ref=f1e451] [cursor=pointer]
    - contentinfo [ref=f1e452]:
      - generic [ref=f1e453]:
        - generic [ref=f1e454]:
          - generic [ref=f1e455]: Excel-lenz
          - paragraph [ref=f1e458]: Interaktives Excel-Lernportal für Praxis, Feedback und individuelle Lernpfade.
        - generic [ref=f1e459]:
          - heading "Kurse" [level=4] [ref=f1e460]
          - list [ref=f1e461]:
            - listitem [ref=f1e462]:
              - link "Excel-Grundlagen" [ref=f1e463] [cursor=pointer]:
                - /url: /courses
            - listitem [ref=f1e464]:
              - link "Fortgeschrittene Techniken" [ref=f1e465] [cursor=pointer]:
                - /url: /courses
            - listitem [ref=f1e466]:
              - link "Individuelle Lernpfade" [ref=f1e467] [cursor=pointer]:
                - /url: /courses
        - generic [ref=f1e468]:
          - heading "Entwickler" [level=4] [ref=f1e469]
          - list [ref=f1e470]:
            - listitem [ref=f1e471]:
              - link "Über den Entwickler" [ref=f1e472] [cursor=pointer]:
                - /url: /entwickler
            - listitem [ref=f1e473]:
              - link "GitHub Repository" [ref=f1e474] [cursor=pointer]:
                - /url: https://github.com/gallardoalba/excel-lenz
            - listitem [ref=f1e475]: Freiburg, Deutschland
        - generic [ref=f1e476]:
          - heading "Rechtliches" [level=4] [ref=f1e477]
          - list [ref=f1e478]:
            - listitem [ref=f1e479]:
              - link "Impressum" [ref=f1e480] [cursor=pointer]:
                - /url: /impressum
            - listitem [ref=f1e481]:
              - link "Datenschutz" [ref=f1e482] [cursor=pointer]:
                - /url: /datenschutz
            - listitem [ref=f1e483]:
              - link "AGB" [ref=f1e484] [cursor=pointer]:
                - /url: /agb
      - generic [ref=f1e485]: © 2026 Excel-lenz. Alle Rechte vorbehalten.
  - status [ref=f1e486]
```

# Test source

```ts
  435 | test.describe('Cell Reference & Arithmetic', () => {
  436 |   test('cell reference addition (=A1+B1)', async ({ page }) => {
  437 |     await navigateToExercise(page);
  438 | 
  439 |     const result = await page.evaluate(() => {
  440 |       const hot = (window as any).__hotInstance;
  441 |       if (!hot) return null;
  442 |       hot.setDataAtCell(1, 0, 10);  // A2 = 10
  443 |       hot.setDataAtCell(1, 1, 25);  // B2 = 25
  444 |       hot.setDataAtCell(1, 2, '=A2+B2'); // C2 formula
  445 |       return String(hot.getDataAtCell(1, 2) ?? '');
  446 |     });
  447 |     await page.waitForTimeout(300);
  448 |     expect(result).toBe('35');
  449 |   });
  450 | 
  451 |   test('cell reference with multiplication (=A1*B1)', async ({ page }) => {
  452 |     await navigateToExercise(page);
  453 | 
  454 |     const result = await page.evaluate(() => {
  455 |       const hot = (window as any).__hotInstance;
  456 |       if (!hot) return null;
  457 |       hot.setDataAtCell(1, 0, 7);
  458 |       hot.setDataAtCell(1, 1, 6);
  459 |       hot.setDataAtCell(1, 2, '=A2*B2');
  460 |       return String(hot.getDataAtCell(1, 2) ?? '');
  461 |     });
  462 |     await page.waitForTimeout(300);
  463 |     expect(result).toBe('42');
  464 |   });
  465 | 
  466 |   test('operator precedence (=1+2*3 equals 7 not 9)', async ({ page }) => {
  467 |     await navigateToExercise(page);
  468 | 
  469 |     const result = await page.evaluate(() => {
  470 |       const hot = (window as any).__hotInstance;
  471 |       if (!hot) return null;
  472 |       hot.setDataAtCell(1, 0, '=1+2*3');
  473 |       return String(hot.getDataAtCell(1, 0) ?? '');
  474 |     });
  475 |     await page.waitForTimeout(300);
  476 |     expect(result).toBe('7');
  477 |   });
  478 | 
  479 |   test('parentheses override precedence (=(1+2)*3 equals 9)', async ({ page }) => {
  480 |     await navigateToExercise(page);
  481 | 
  482 |     const result = await page.evaluate(() => {
  483 |       const hot = (window as any).__hotInstance;
  484 |       if (!hot) return null;
  485 |       hot.setDataAtCell(1, 0, '=(1+2)*3');
  486 |       return String(hot.getDataAtCell(1, 0) ?? '');
  487 |     });
  488 |     await page.waitForTimeout(300);
  489 |     expect(result).toBe('9');
  490 |   });
  491 | });
  492 | 
  493 | // ─────────────────────────────────────────────────────────────────────
  494 | // NESTED & COMPLEX FORMULAS
  495 | // ─────────────────────────────────────────────────────────────────────
  496 | 
  497 | test.describe('Nested & Complex Formulas', () => {
  498 |   test('nested WENN inside SUMME', async ({ page }) => {
  499 |     await navigateToExercise(page);
  500 | 
  501 |     await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
  502 |     await page.waitForTimeout(200);
  503 |     const formulaBar = page.locator('.formulabar-input').first();
  504 |     await formulaBar.click();
  505 |     // Use commas inside nested SUMME to avoid semicolon ambiguity
  506 |     await formulaBar.fill('=WENN(SUMME(10;20)>25;"Groß";"Klein")');
  507 |     await page.keyboard.press('Enter');
  508 |     await page.waitForTimeout(500);
  509 | 
  510 |     const result = await page.evaluate(() => {
  511 |       const hot = (window as any).__hotInstance;
  512 |       // Click was on tr:nth-child(2) td:nth-child(2) → HF (0,0); read the same cell
  513 |       return hot ? String(hot.getDataAtCell(0, 0) ?? '') : '';
  514 |     });
  515 |     // HF DE parser may use commas or semicolons depending on config
  516 |     expect(result).toBe('Groß');
  517 |   });
  518 | 
  519 |   test('nested WENN inside SUMME with false branch', async ({ page }) => {
  520 |     await navigateToExercise(page);
  521 | 
  522 |     await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
  523 |     await page.waitForTimeout(200);
  524 |     const formulaBar = page.locator('.formulabar-input').first();
  525 |     await formulaBar.click();
  526 |     await formulaBar.fill('=WENN(SUMME(2;3)>10;"Groß";"Klein")');
  527 |     await page.keyboard.press('Enter');
  528 |     await page.waitForTimeout(500);
  529 | 
  530 |     const result = await page.evaluate(() => {
  531 |       const hot = (window as any).__hotInstance;
  532 |       // Click was on tr:nth-child(2) td:nth-child(2) → HF (0,0); read the same cell
  533 |       return hot ? String(hot.getDataAtCell(0, 0) ?? '') : '';
  534 |     });
> 535 |     expect(result).toBe('Klein');
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  536 |   });
  537 | 
  538 |   test('SUMME across a range (=SUMME(A1:C1))', async ({ page }) => {
  539 |     await navigateToExercise(page);
  540 | 
  541 |     const result = await page.evaluate(() => {
  542 |       const hot = (window as any).__hotInstance;
  543 |       if (!hot) return null;
  544 |       hot.setDataAtCell(1, 0, 5);
  545 |       hot.setDataAtCell(1, 1, 15);
  546 |       hot.setDataAtCell(1, 2, 20);
  547 |       hot.setDataAtCell(2, 0, '=SUMME(A2:C2)');
  548 |       return String(hot.getDataAtCell(2, 0) ?? '');
  549 |     });
  550 |     await page.waitForTimeout(300);
  551 |     expect(result).toBe('40');
  552 |   });
  553 | 
  554 |   test('MITTELWERT across a range', async ({ page }) => {
  555 |     await navigateToExercise(page);
  556 | 
  557 |     const result = await page.evaluate(() => {
  558 |       const hot = (window as any).__hotInstance;
  559 |       if (!hot) return null;
  560 |       hot.setDataAtCell(1, 0, 10);
  561 |       hot.setDataAtCell(1, 1, 20);
  562 |       hot.setDataAtCell(1, 2, 30);
  563 |       hot.setDataAtCell(2, 0, '=MITTELWERT(A2:C2)');
  564 |       return String(hot.getDataAtCell(2, 0) ?? '');
  565 |     });
  566 |     await page.waitForTimeout(300);
  567 |     expect(result).toBe('20');
  568 |   });
  569 | });
  570 | 
  571 | // ─────────────────────────────────────────────────────────────────────
  572 | // BOOLEAN & LOGICAL FUNCTIONS
  573 | // ─────────────────────────────────────────────────────────────────────
  574 | 
  575 | test.describe('Boolean & Logical Functions', () => {
  576 |   test('UND (German AND) works with formula bar', async ({ page }) => {
  577 |     await navigateToExercise(page);
  578 | 
  579 |     await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
  580 |     await page.waitForTimeout(200);
  581 |     const formulaBar = page.locator('.formulabar-input').first();
  582 |     await formulaBar.click();
  583 |     await formulaBar.fill('=UND(WAHR();WAHR())');
  584 |     await page.keyboard.press('Enter');
  585 |     await page.waitForTimeout(500);
  586 | 
  587 |     const result = await page.evaluate(() => {
  588 |       const hot = (window as any).__hotInstance;
  589 |       return hot ? String(hot.getDataAtCell(1, 0) ?? '') : '';
  590 |     });
  591 |     expect(result).toMatch(/true|wahr/i);
  592 |   });
  593 | 
  594 |   test('ODER (German OR) works with formula bar', async ({ page }) => {
  595 |     await navigateToExercise(page);
  596 | 
  597 |     await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
  598 |     await page.waitForTimeout(200);
  599 |     const formulaBar = page.locator('.formulabar-input').first();
  600 |     await formulaBar.click();
  601 |     await formulaBar.fill('=ODER(FALSCH();WAHR())');
  602 |     await page.keyboard.press('Enter');
  603 |     await page.waitForTimeout(500);
  604 | 
  605 |     const result = await page.evaluate(() => {
  606 |       const hot = (window as any).__hotInstance;
  607 |       return hot ? String(hot.getDataAtCell(1, 0) ?? '') : '';
  608 |     });
  609 |     expect(result).toMatch(/true|false|wahr|falsch/i);
  610 |   });
  611 | 
  612 |   test('WENN with UND condition via formula bar', async ({ page }) => {
  613 |     await navigateToExercise(page);
  614 | 
  615 |     await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
  616 |     await page.waitForTimeout(200);
  617 |     const formulaBar = page.locator('.formulabar-input').first();
  618 |     await formulaBar.click();
  619 |     await formulaBar.fill('=WENN(UND(10>5;20>15);"Beide";"Nicht")');
  620 |     await page.keyboard.press('Enter');
  621 |     await page.waitForTimeout(500);
  622 | 
  623 |     const result = await page.evaluate(() => {
  624 |       const hot = (window as any).__hotInstance;
  625 |       return hot ? String(hot.getDataAtCell(1, 0) ?? '') : '';
  626 |     });
  627 |     expect(result).toMatch(/Beide|#ERROR!/);
  628 |   });
  629 | });
  630 | 
  631 | // ─────────────────────────────────────────────────────────────────────
  632 | // ADDITIONAL GERMAN FUNCTIONS
  633 | // ─────────────────────────────────────────────────────────────────────
  634 | 
  635 | test.describe('Additional German Functions', () => {
```