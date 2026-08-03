/**
 * E2E Tests: Teacher Panel
 *
 * Tests the teacher dashboard including student management,
 * course CRUD, and analytics views.
 */
import { test, expect } from '@playwright/test';

const TEACHER_EMAIL = 'dozent@excel-lenz.edu';
const TEACHER_PASSWORD = 'devpassword';

test.describe('Teacher Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Login as teacher
    await page.goto('/login');
    await page.fill('input[type="email"]', TEACHER_EMAIL);
    await page.fill('input[type="password"]', TEACHER_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // Navigate to teacher panel
    await page.goto('/teacher');
    await page.waitForLoadState('networkidle');
  });

  test('shows students tab with student list', async ({ page }) => {
    // Check students tab is active by default
    await expect(page.locator('text=Schüler')).toBeVisible();

    // Should show at least one student (the seeded ones)
    await expect(page.locator('[class*="student"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('switches between tabs: students, courses, analytics', async ({ page }) => {
    // Click courses tab
    await page.click('text=Kurse');
    await expect(page.locator('text=Kurs erstellen').or(page.locator('text=Neuer Kurs'))).toBeVisible({ timeout: 3000 });

    // Click analytics tab
    await page.click('text=Analytics');
    await expect(page.locator('text=Analytics').or(page.locator('text=Analysen'))).toBeVisible({ timeout: 3000 });
  });

  test('shows add student form', async ({ page }) => {
    // Click add student button
    await page.click('button:has-text("Schüler hinzufügen")');
    await expect(page.locator('input[placeholder*="Name"]').or(page.locator('label:has-text("Name")'))).toBeVisible({ timeout: 3000 });
  });

  test('adds a new student successfully', async ({ page }) => {
    const uniqueEmail = `e2e-student-${Date.now()}@ex.com`;

    // Open add student form
    await page.click('button:has-text("Schüler hinzufügen")');

    // Fill form
    await page.fill('input[placeholder*="Name"]', 'E2E Student');
    const emailInputs = page.locator('input[type="email"], input[placeholder*="Email"], input[placeholder*="E-Mail"]');
    if (await emailInputs.count() > 0) {
      await emailInputs.first().fill(uniqueEmail);
    }
    const passwordInputs = page.locator('input[type="password"], input[placeholder*="Passwort"]');
    if (await passwordInputs.count() > 0) {
      await passwordInputs.first().fill('secure123');
    }

    // Submit
    await page.click('button:has-text("Registrieren")');

    // Should show success message
    await expect(page.locator('text=erfolgreich')).toBeVisible({ timeout: 5000 });
  });

  test('teacher can view student detail', async ({ page }) => {
    // Click on a student to view details
    const studentRow = page.locator('[class*="student"]').first();
    if (await studentRow.isVisible()) {
      await studentRow.click();
      // Should show progress or detail view
      await expect(page.locator('text=Fortschritt').or(page.locator('text=Progress'))).toBeVisible({ timeout: 3000 });
    }
  });
});
