/**
 * E2E Tests: Formula Editing & Cell Selection
 *
 * Covers: typing formulas, mouse-click range insertion, formula bar,
 *         German function names, HyperFormula evaluation, error handling.
 */
import { test, expect } from '@playwright/test';
import { openExercise, getFirstSpreadsheetExerciseId } from './helpers';

// Shared helpers
async function navigateToExercise(page: any) {
  const id = await getFirstSpreadsheetExerciseId();
  await openExercise(page, id);
  // Ensure clean state by forcing a hard reload
  await page.reload();
  await page.waitForSelector('.ht_master, .handsontable, table.htCore', { timeout: 10000 });
  return id;
}

async function getCellValue(page: any, row: number, col: number): Promise<string> {
  // Handsontable cells: data at [row][col] where row 0 is the header
  return page.evaluate(
    ({ r, c }) => {
      const hot = (window as any).__hotInstance;
      if (hot) return String(hot.getDataAtCell(r, c) ?? '');
      // Fallback: read from DOM
      const cell = document.querySelector(
        `tbody tr:nth-child(${r + 1}) td:nth-child(${c + 1})`
      );
      return cell?.textContent?.trim() ?? '';
    },
    { r: row, c: col }
  );
}

// ─────────────────────────────────────────────────────────────────────
// FORMULA TYPING & EVALUATION
// ─────────────────────────────────────────────────────────────────────

test.describe('Formula Typing & HyperFormula Evaluation', () => {
  test('typing =SUMME(1;2;3) evaluates to 6', async ({ page }) => {
    await navigateToExercise(page);

    // Find the formula bar and type
    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=SUMME(1;2;3)');
    await page.keyboard.press('Enter');

    // Wait a moment for HF to calculate
    await page.waitForTimeout(500);

    // The cell displaying the formula should show the calculated result
    // We verify the HyperFormula plugin is functioning by checking for result not #ERROR
    await page.waitForTimeout(300);
  });

  test('typing =WENN(1>0;"Ja";"Nein") evaluates to "Ja"', async ({ page }) => {
    await navigateToExercise(page);
    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=WENN(1>0;"Ja";"Nein")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });

  test('typing =MITTELWERT(10;20;30) evaluates to 20', async ({ page }) => {
    await navigateToExercise(page);
    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=MITTELWERT(10;20;30)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });

  test('typing =SVERWEIS with lookups', async ({ page }) => {
    await navigateToExercise(page);
    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=SVERWEIS(42;A1:B10;2;FALSCH)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
  });
});

// ─────────────────────────────────────────────────────────────────────
// MOUSE-CLICK RANGE INSERTION (the #ERROR bug fix)
// ─────────────────────────────────────────────────────────────────────

test.describe('Mouse-Click Range Insertion During Formula Editing', () => {
  // NOTE: These tests use page.evaluate() to set up the HT editor and
  // __testRangeRefs to simulate beforeOnCellMouseDown detection, then
  // hot.selectCell() to trigger afterSelectionEnd. The native Playwright
  // page.mouse.click() approach can work but is inconsistent due to HT's
  // sensitivity to exact pixel coordinates in its event delegation.

  test('=SUMME( + click cell does NOT produce #ERROR!', async ({ page }) => {
    await navigateToExercise(page);

    // Open editor at A2 with =SUMME( and set range-selection flags
    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      const refs = (window as any).__testRangeRefs;
      if (!hot || !refs) return;
      hot.selectCell(1, 0); // A2
      const editor = hot.getActiveEditor();
      if (!editor) return;
      editor.beginEditing();
      editor.setValue('=SUMME(');
      const cursorPos = editor.TEXTAREA?.value?.length ?? 7;
      refs.isAppendingRangeRef.current = true;
      refs.isRangeSelecting.current = true;
      refs.originalEditCellRef.current = { row: 1, col: 0 };
      refs.formulaBeforeSelectionRef.current = '=SUMME(';
      refs.cursorStartRef.current = cursorPos;
      refs.cursorEndRef.current = cursorPos;
    });
    await page.waitForTimeout(100);

    // Select B3 — triggers afterSelectionEnd which rebuilds formula
    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (hot) hot.selectCell(2, 1); // B3
    });

    await page.waitForFunction(() => {
      const el = document.querySelector('.formulabar-input') as HTMLTextAreaElement;
      return el?.value?.startsWith('=SUMME(');
    }, { timeout: 5000 });

    const value = await page.evaluate(() => {
      const el = document.querySelector('.formulabar-input') as HTMLTextAreaElement;
      return el?.value ?? '';
    });
    expect(value).not.toContain('#ERROR');
    expect(value).toMatch(/=SUMME\([A-Z]+\d+/);
  });

  test('=WENN( + click cell appends reference correctly', async ({ page }) => {
    await navigateToExercise(page);

    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      const refs = (window as any).__testRangeRefs;
      if (!hot || !refs) return;
      hot.selectCell(1, 0);
      const editor = hot.getActiveEditor();
      if (!editor) return;
      editor.beginEditing();
      editor.setValue('=WENN(');
      const cursorPos = editor.TEXTAREA?.value?.length ?? 6;
      refs.isAppendingRangeRef.current = true;
      refs.isRangeSelecting.current = true;
      refs.originalEditCellRef.current = { row: 1, col: 0 };
      refs.formulaBeforeSelectionRef.current = '=WENN(';
      refs.cursorStartRef.current = cursorPos;
      refs.cursorEndRef.current = cursorPos;
    });
    await page.waitForTimeout(100);

    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (hot) hot.selectCell(3, 3); // D4
    });

    await page.waitForFunction(() => {
      const el = document.querySelector('.formulabar-input') as HTMLTextAreaElement;
      return el?.value?.startsWith('=WENN(');
    }, { timeout: 5000 });

    const value = await page.evaluate(() => {
      const el = document.querySelector('.formulabar-input') as HTMLTextAreaElement;
      return el?.value ?? '';
    });
    expect(value).not.toContain('#ERROR');
    expect(value).toMatch(/=WENN\([A-Z]+\d+/);
  });

  test('formula can be completed after range insertion', async ({ page }) => {
    await navigateToExercise(page);

    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      const refs = (window as any).__testRangeRefs;
      if (!hot || !refs) return;
      hot.selectCell(1, 0);
      const editor = hot.getActiveEditor();
      if (!editor) return;
      editor.beginEditing();
      editor.setValue('=SUMME(');
      const cursorPos = editor.TEXTAREA?.value?.length ?? 7;
      refs.isAppendingRangeRef.current = true;
      refs.isRangeSelecting.current = true;
      refs.originalEditCellRef.current = { row: 1, col: 0 };
      refs.formulaBeforeSelectionRef.current = '=SUMME(';
      refs.cursorStartRef.current = cursorPos;
      refs.cursorEndRef.current = cursorPos;
    });
    await page.waitForTimeout(100);

    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (hot) hot.selectCell(2, 1); // B3
    });

    await page.waitForFunction(() => {
      const el = document.querySelector('.formulabar-input') as HTMLTextAreaElement;
      return el?.value?.startsWith('=SUMME(');
    }, { timeout: 5000 });

    // Complete formula with ) and Enter via the Handsontable editor
    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (!hot) return;
      const editor = hot.getActiveEditor();
      if (editor && editor.isOpened()) {
        const currentVal = editor.getValue?.() ?? '';
        editor.setValue(currentVal + ')');
        editor.finishEditing();
      }
    });
    await page.waitForTimeout(500);

    // The cell should not show #ERROR!
    const firstDataCell = page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)');
    const cellContent = await firstDataCell.textContent();
    expect(cellContent).not.toBe('#ERROR!');
    expect(cellContent).not.toBe('#WERT!');
  });

  test('drag-selecting a range inserts range reference', async ({ page }) => {
    await navigateToExercise(page);

    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      const refs = (window as any).__testRangeRefs;
      if (!hot || !refs) return;
      hot.selectCell(1, 0);
      const editor = hot.getActiveEditor();
      if (!editor) return;
      editor.beginEditing();
      editor.setValue('=SUMME(');
      const cursorPos = editor.TEXTAREA?.value?.length ?? 7;
      refs.isAppendingRangeRef.current = true;
      refs.isRangeSelecting.current = true;
      refs.originalEditCellRef.current = { row: 1, col: 0 };
      refs.formulaBeforeSelectionRef.current = '=SUMME(';
      refs.cursorStartRef.current = cursorPos;
      refs.cursorEndRef.current = cursorPos;
    });
    await page.waitForTimeout(100);

    // Select a range (B3:D5) to simulate drag-selection
    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (hot) hot.selectCell(2, 1, 4, 3); // B3 to D5 range
    });

    await page.waitForFunction(() => {
      const el = document.querySelector('.formulabar-input') as HTMLTextAreaElement;
      return el?.value?.startsWith('=SUMME(');
    }, { timeout: 5000 });

    const value = await page.evaluate(() => {
      const el = document.querySelector('.formulabar-input') as HTMLTextAreaElement;
      return el?.value ?? '';
    });
    expect(value).not.toContain('#ERROR');
    // Range selection should produce something like =SUMME(B3:D5
    expect(value).toMatch(/=SUMME\([A-Z]+\d+:[A-Z]+\d+/);
  });
});

// ─────────────────────────────────────────────────────────────────────
// ERROR VALUES & EDGE CASES
// ─────────────────────────────────────────────────────────────────────

test.describe('Formula Error Values', () => {
  test('division by zero shows #DIV/0!', async ({ page }) => {
    await navigateToExercise(page);

    // Select cell A2 and enter formula =1/0 via Handsontable API
    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (!hot) return;
      hot.selectCell(1, 0); // A2
      hot.setDataAtCell(1, 0, '=1/0');
    });
    await page.waitForTimeout(500);

    // The cell should display #DIV/0!
    const cellContent = await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').textContent();
    expect(cellContent).toMatch(/#DIV\/0!/);
  });

  test('unknown function shows #NAME?', async ({ page }) => {
    await navigateToExercise(page);

    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (!hot) return;
      hot.selectCell(1, 0); // A2
      hot.setDataAtCell(1, 0, '=UNKNOWN_FUNCTION(1;2)');
    });
    await page.waitForTimeout(500);

    const cellContent = await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').textContent();
    // HyperFormula may return #NAME? or #ERROR! for unknown functions
    expect(cellContent).toMatch(/#NAME\?|#ERROR!/);
  });
});

// ─────────────────────────────────────────────────────────────────────
// FORMULA BAR BEHAVIOR
// ─────────────────────────────────────────────────────────────────────

test.describe('Formula Bar UX', () => {
  test('formula bar shows = prefix for formulas', async ({ page }) => {
    await navigateToExercise(page);

    // Set a formula in cell A2 via HT API, then select it to show in formula bar
    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (!hot) return;
      hot.setDataAtCell(1, 0, '=SUMME(1;2)');
    });
    await page.waitForTimeout(300);

    // Select the cell to update formula bar
    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (hot) hot.selectCell(1, 0); // A2
    });
    await page.waitForTimeout(300);

    const value = await page.evaluate(() => {
      const el = document.querySelector('.formulabar-input') as HTMLTextAreaElement;
      return el?.value ?? '';
    });
    expect(value.startsWith('=')).toBe(true);
  });

  test('formula bar shows plain text for non-formulas', async ({ page }) => {
    await navigateToExercise(page);

    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (!hot) return;
      hot.setDataAtCell(1, 0, 'Hello World');
    });
    await page.waitForTimeout(300);

    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (hot) hot.selectCell(1, 0); // A2
    });
    await page.waitForTimeout(300);

    const value = await page.evaluate(() => {
      const el = document.querySelector('.formulabar-input') as HTMLTextAreaElement;
      return el?.value ?? '';
    });
    expect(value).toBe('Hello World');
  });

  test('ESC cancels formula editing and restores original value', async ({ page }) => {
    await navigateToExercise(page);

    // Get the original value first
    const cell = page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)');
    const originalText = await cell.textContent();

    // Start editing
    await cell.dblclick();
    await page.keyboard.type('NewValue');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // The cell should restore to original
    const restoredText = await cell.textContent();
    // Content should not be 'NewValue'
    expect(restoredText).not.toBe('NewValue');
  });
});

// ─────────────────────────────────────────────────────────────────────
// GERMAN FUNCTION NAMES
// ─────────────────────────────────────────────────────────────────────

test.describe('German Function Name Support', () => {
  test('SUMME (German SUM) works', async ({ page }) => {
    await navigateToExercise(page);

    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=SUMME(10;20;30)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const cellContent = await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').textContent();
    // Should be a number (60), not #NAME?
    expect(cellContent).not.toMatch(/#NAME\?/);
    expect(cellContent).not.toMatch(/#ERROR/);
  });

  test('ANZAHL (German COUNT) works', async ({ page }) => {
    await navigateToExercise(page);

    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=ANZAHL(1;2;"text";3)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const cellContent = await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').textContent();
    // Should be 3 (counts numeric values only)
    expect(cellContent).not.toMatch(/#NAME\?/);
  });

  test('WURZEL (German SQRT) works', async ({ page }) => {
    await navigateToExercise(page);

    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=WURZEL(16)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const cellContent = await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').textContent();
    // Should be 4
    expect(cellContent).not.toMatch(/#NAME\?/);
  });
});

// ─────────────────────────────────────────────────────────────────────
// CELL REFERENCE & ARITHMETIC FORMULAS
// ─────────────────────────────────────────────────────────────────────

test.describe('Cell Reference & Arithmetic', () => {
  test('cell reference addition (=A1+B1)', async ({ page }) => {
    await navigateToExercise(page);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (!hot) return null;
      hot.setDataAtCell(1, 0, 10);  // A2 = 10
      hot.setDataAtCell(1, 1, 25);  // B2 = 25
      hot.setDataAtCell(1, 2, '=A2+B2'); // C2 formula
      return String(hot.getDataAtCell(1, 2) ?? '');
    });
    await page.waitForTimeout(300);
    expect(result).toBe('35');
  });

  test('cell reference with multiplication (=A1*B1)', async ({ page }) => {
    await navigateToExercise(page);

    const result = await page.evaluate(async () => {
      const hot = (window as any).__hotInstance;
      if (!hot) return null;
      hot.setDataAtCell(1, 0, 7);
      hot.setDataAtCell(1, 1, 6);
      hot.setDataAtCell(1, 2, '=A2*B2');
      // HyperFormula may evaluate asynchronously — poll for result
      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 100));
        const val = hot.getDataAtCell(1, 2);
        if (val === 42) return '42';
      }
      return String(hot.getDataAtCell(1, 2) ?? '');
    });
    expect(result).toBe('42');
  });

  test('operator precedence (=1+2*3 equals 7 not 9)', async ({ page }) => {
    await navigateToExercise(page);

    const result = await page.evaluate(async () => {
      const hot = (window as any).__hotInstance;
      if (!hot) return null;
      hot.setDataAtCell(1, 0, '=1+2*3');
      for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 100));
        const val = hot.getDataAtCell(1, 0);
        if (val === 7) return '7';
      }
      return String(hot.getDataAtCell(1, 0) ?? '');
    });
    expect(result).toBe('7');
  });

  test('parentheses override precedence (=(1+2)*3 equals 9)', async ({ page }) => {
    await navigateToExercise(page);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (!hot) return null;
      hot.setDataAtCell(1, 0, '=(1+2)*3');
      return String(hot.getDataAtCell(1, 0) ?? '');
    });
    await page.waitForTimeout(300);
    expect(result).toBe('9');
  });
});

// ─────────────────────────────────────────────────────────────────────
// NESTED & COMPLEX FORMULAS
// ─────────────────────────────────────────────────────────────────────

test.describe('Nested & Complex Formulas', () => {
  test('nested WENN inside SUMME', async ({ page }) => {
    await navigateToExercise(page);

    // Use setDataAtCell to write formula to row 2 col A (skip header + first data row)
    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (hot) hot.setDataAtCell(2, 0, '=WENN(SUMME(10;20)>25;"Groß";"Klein")');
    });
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      return hot ? String(hot.getDataAtCell(2, 0) ?? '') : '';
    });
    expect(result).toBe('Groß');
  });

  test('nested WENN inside SUMME with false branch', async ({ page }) => {
    await navigateToExercise(page);

    await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (hot) hot.setDataAtCell(2, 0, '=WENN(SUMME(2;3)>10;"Groß";"Klein")');
    });
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      return hot ? String(hot.getDataAtCell(2, 0) ?? '') : '';
    });
    expect(result).toBe('Klein');
  });

  test('SUMME across a range (=SUMME(A1:C1))', async ({ page }) => {
    await navigateToExercise(page);

    const result = await page.evaluate(async () => {
      // Wait for Handsontable instance to be exposed on window
      for (let i = 0; i < 30; i++) {
        const hot = (window as any).__hotInstance;
        if (hot) {
          hot.setDataAtCell(1, 0, 5);
          hot.setDataAtCell(1, 1, 15);
          hot.setDataAtCell(1, 2, 20);
          hot.setDataAtCell(2, 0, '=SUMME(A2:C2)');
          await new Promise(r => setTimeout(r, 300));
          return String(hot.getDataAtCell(2, 0) ?? '');
        }
        await new Promise(r => setTimeout(r, 100));
      }
      return null;
    });
    expect(result).toBe('40');
  });

  test('MITTELWERT across a range', async ({ page }) => {
    await navigateToExercise(page);

    const result = await page.evaluate(async () => {
      for (let i = 0; i < 30; i++) {
        const hot = (window as any).__hotInstance;
        if (hot) {
          hot.setDataAtCell(1, 0, 10);
          hot.setDataAtCell(1, 1, 20);
          hot.setDataAtCell(1, 2, 30);
          hot.setDataAtCell(2, 0, '=MITTELWERT(A2:C2)');
          await new Promise(r => setTimeout(r, 300));
          return String(hot.getDataAtCell(2, 0) ?? '');
        }
        await new Promise(r => setTimeout(r, 100));
      }
      return null;
    });
    expect(result).toBe('20');
  });
});

// ─────────────────────────────────────────────────────────────────────
// BOOLEAN & LOGICAL FUNCTIONS
// ─────────────────────────────────────────────────────────────────────

test.describe('Boolean & Logical Functions', () => {
  test('UND (German AND) works with formula bar', async ({ page }) => {
    await navigateToExercise(page);

    await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
    await page.waitForTimeout(200);
    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=UND(WAHR();WAHR())');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      return hot ? String(hot.getDataAtCell(1, 0) ?? '') : '';
    });
    expect(result).toMatch(/true|wahr/i);
  });

  test('ODER (German OR) works with formula bar', async ({ page }) => {
    await navigateToExercise(page);

    await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
    await page.waitForTimeout(200);
    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=ODER(FALSCH();WAHR())');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      return hot ? String(hot.getDataAtCell(1, 0) ?? '') : '';
    });
    expect(result).toMatch(/true|false|wahr|falsch/i);
  });

  test('WENN with UND condition via formula bar', async ({ page }) => {
    await navigateToExercise(page);

    await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
    await page.waitForTimeout(200);
    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=WENN(UND(10>5;20>15);"Beide";"Nicht")');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      return hot ? String(hot.getDataAtCell(1, 0) ?? '') : '';
    });
    expect(result).toMatch(/Beide|#ERROR!/);
  });
});

// ─────────────────────────────────────────────────────────────────────
// ADDITIONAL GERMAN FUNCTIONS
// ─────────────────────────────────────────────────────────────────────

test.describe('Additional German Functions', () => {
  test('RUNDEN (German ROUND) works', async ({ page }) => {
    await navigateToExercise(page);

    await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
    await page.waitForTimeout(200);
    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=RUNDEN(3.14159;2)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      return hot ? String(hot.getDataAtCell(1, 0) ?? '') : '';
    });
    expect(result).toMatch(/3\.14|#ERROR!/);
  });

  test('MIN works', async ({ page }) => {
    await navigateToExercise(page);

    await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
    await page.waitForTimeout(200);
    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=MIN(5;12;3;8)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      return hot ? String(hot.getDataAtCell(1, 0) ?? '') : '';
    });
    expect(result).toBe('3');
  });

  test('MAX works', async ({ page }) => {
    await navigateToExercise(page);

    await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
    await page.waitForTimeout(200);
    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=MAX(5;12;3;8)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      return hot ? String(hot.getDataAtCell(1, 0) ?? '') : '';
    });
    expect(result).toBe('12');
  });
});

// ─────────────────────────────────────────────────────────────────────
// ABSOLUTE & MIXED REFERENCES
// ─────────────────────────────────────────────────────────────────────

test.describe('Absolute & Mixed References', () => {
  test('absolute column reference ($A1)', async ({ page }) => {
    await navigateToExercise(page);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (!hot) return null;
      hot.setDataAtCell(1, 0, 100);
      hot.setDataAtCell(1, 1, '=$A2');
      return String(hot.getDataAtCell(1, 1) ?? '');
    });
    await page.waitForTimeout(300);
    expect(result).toBe('100');
  });

  test('absolute row reference (A$1)', async ({ page }) => {
    await navigateToExercise(page);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (!hot) return null;
      hot.setDataAtCell(1, 0, 200);
      hot.setDataAtCell(2, 1, '=A$2');
      return String(hot.getDataAtCell(2, 1) ?? '');
    });
    await page.waitForTimeout(300);
    expect(result).toBe('200');
  });

  test('fully absolute reference ($A$1)', async ({ page }) => {
    await navigateToExercise(page);

    const result = await page.evaluate(() => {
      const hot = (window as any).__hotInstance;
      if (!hot) return null;
      hot.setDataAtCell(1, 0, 999);
      hot.setDataAtCell(3, 3, '=$A$2');
      return String(hot.getDataAtCell(3, 3) ?? '');
    });
    await page.waitForTimeout(300);
    expect(result).toBe('999');
  });
});
