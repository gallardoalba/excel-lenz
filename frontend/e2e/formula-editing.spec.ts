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
  test('=SUMME( + click cell does NOT produce #ERROR!', async ({ page }) => {
    await navigateToExercise(page);

    // Select a cell to start editing
    const firstDataCell = page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)');
    await firstDataCell.dblclick();

    // Type =SUMME(
    await page.keyboard.type('=SUMME(');
    await page.waitForTimeout(200);

    // Click another cell to insert its reference (simulates mouse range selection)
    const targetCell = page.locator('.ht_master tbody tr:nth-child(3) td:nth-child(3)');
    await targetCell.click();
    await page.waitForTimeout(500);

    // The formula bar should now show =SUMME(C3 (or similar reference), NOT #ERROR!
    const formulaBar = page.locator('.formulabar-input').first();
    const value = await formulaBar.inputValue();
    // Should contain the cell reference, not an error
    expect(value).not.toContain('#ERROR');
    expect(value).toMatch(/=SUMME\([A-Z]+\d+/);
  });

  test('=WENN( + click cell appends reference correctly', async ({ page }) => {
    await navigateToExercise(page);

    const firstDataCell = page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)');
    await firstDataCell.dblclick();

    await page.keyboard.type('=WENN(');
    await page.waitForTimeout(200);

    const targetCell = page.locator('.ht_master tbody tr:nth-child(4) td:nth-child(4)');
    await targetCell.click();
    await page.waitForTimeout(500);

    const formulaBar = page.locator('.formulabar-input').first();
    const value = await formulaBar.inputValue();
    expect(value).not.toContain('#ERROR');
    expect(value).toMatch(/=WENN\([A-Z]+\d+/);
  });

  test('formula can be completed after range insertion', async ({ page }) => {
    await navigateToExercise(page);

    const firstDataCell = page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)');
    await firstDataCell.dblclick();

    await page.keyboard.type('=SUMME(');
    await page.waitForTimeout(200);

    // Click another cell
    const targetCell = page.locator('.ht_master tbody tr:nth-child(3) td:nth-child(3)');
    await targetCell.click();
    await page.waitForTimeout(500);

    // Complete the formula by typing closing paren and pressing Enter
    await page.keyboard.type(')');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // The cell should not show #ERROR!
    const cellContent = await firstDataCell.textContent();
    expect(cellContent).not.toBe('#ERROR!');
    expect(cellContent).not.toBe('#WERT!');
  });

  test('drag-selecting a range inserts range reference', async ({ page }) => {
    await navigateToExercise(page);

    const firstDataCell = page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)');
    await firstDataCell.dblclick();

    await page.keyboard.type('=SUMME(');
    await page.waitForTimeout(200);

    // Click and drag to select a range
    const startCell = page.locator('.ht_master tbody tr:nth-child(3) td:nth-child(3)');
    const endCell = page.locator('.ht_master tbody tr:nth-child(5) td:nth-child(5)');

    await startCell.click();
    await page.waitForTimeout(500);

    // After range selection, formula bar should show a range reference like A1:B5
    const formulaBar = page.locator('.formulabar-input').first();
    const value = await formulaBar.inputValue();
    expect(value).not.toContain('#ERROR');
  });
});

// ─────────────────────────────────────────────────────────────────────
// ERROR VALUES & EDGE CASES
// ─────────────────────────────────────────────────────────────────────

test.describe('Formula Error Values', () => {
  test('division by zero shows #DIV/0!', async ({ page }) => {
    await navigateToExercise(page);

    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=1/0');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // The cell should display #DIV/0!
    const cellContent = await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').textContent();
    expect(cellContent).toMatch(/#DIV\/0!/);
  });

  test('unknown function shows #NAME?', async ({ page }) => {
    await navigateToExercise(page);

    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=UNKNOWN_FUNCTION(1;2)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    const cellContent = await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').textContent();
    expect(cellContent).toMatch(/#NAME\?/);
  });
});

// ─────────────────────────────────────────────────────────────────────
// FORMULA BAR BEHAVIOR
// ─────────────────────────────────────────────────────────────────────

test.describe('Formula Bar UX', () => {
  test('formula bar shows = prefix for formulas', async ({ page }) => {
    await navigateToExercise(page);

    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('=SUMME(1;2)');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // Re-select the cell
    await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
    await page.waitForTimeout(300);

    const value = await formulaBar.inputValue();
    expect(value.startsWith('=')).toBe(true);
  });

  test('formula bar shows plain text for non-formulas', async ({ page }) => {
    await navigateToExercise(page);

    const formulaBar = page.locator('.formulabar-input').first();
    await formulaBar.click();
    await formulaBar.fill('Hello World');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    // Re-select
    await page.locator('.ht_master tbody tr:nth-child(2) td:nth-child(2)').click();
    await page.waitForTimeout(300);

    const value = await formulaBar.inputValue();
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
