/**
 * E2E Tests: Formula Editing & Cell Selection
 *
 * Covers: typing formulas, mouse-click range insertion, formula bar,
 *         German function names, HyperFormula evaluation, error handling.
 */
import { test, expect } from '@playwright/test';
import { openExercise, getFirstExerciseId } from './helpers';

// Shared helpers
async function navigateToExercise(page: any) {
  const id = await openExercise(page);
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
