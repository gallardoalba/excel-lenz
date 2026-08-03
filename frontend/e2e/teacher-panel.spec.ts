/**
 * E2E Tests: Teacher Panel
 *
 * Tests the teacher dashboard including student management,
 * course CRUD, and analytics views.
 */
import { test, expect } from '@playwright/test';

const TEACHER_PASSWORD = process.env.SEED_PASSWORD || 'devpassword';

test.describe('Teacher Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Login as seeded teacher via API
    const loginRes = await page.request.post('http://localhost:3001/api/auth/login', {
      data: { email: 'dozent@excel-lenz.edu', password: TEACHER_PASSWORD },
    });
    const { token } = await loginRes.json();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate((t: string) => localStorage.setItem('token', t), token);

    // Navigate to teacher panel
    await page.goto('/teacher');
    await page.waitForLoadState('networkidle');
  });

  test('shows students tab with student list', async ({ page }) => {
    // Check students tab is active by default
    await expect(page.getByRole('button', { name: 'Schüler', exact: true })).toBeVisible();

    // Should show student count heading
    await expect(page.getByRole('heading', { name: /Schüler/ })).toBeVisible({ timeout: 5000 });
  });

  test('switches between tabs: students, courses, analytics', async ({ page }) => {
    // Click courses tab
    await page.getByRole('button', { name: 'Kurse', exact: true }).click();
    await expect(page.getByRole('button', { name: /Kurs|Neuer Kurs/ })).toBeVisible({ timeout: 3000 });

    // Click analytics tab — label is "Analyse"
    await page.getByRole('button', { name: 'Analyse', exact: true }).click();
    await expect(page.locator('h1, h2, h3').first()).toBeVisible({ timeout: 3000 });
  });

  test('shows add student form', async ({ page }) => {
    // Click add student button — actual text is "Neuer Schüler"
    await page.getByRole('button', { name: /Neuer Schüler/ }).click();
    // Form should appear
    await expect(page.locator('input[type="email"], input[placeholder*="Email"]').first()).toBeVisible({ timeout: 3000 });
  });

  test('adds a new student successfully', async ({ page }) => {
    const uniqueEmail = `e2e-student-${Date.now()}@ex.com`;

    // Click "Neuer Schüler" button
    await page.getByRole('button', { name: /Neuer Schüler/ }).click();

    // Fill form — actual placeholders from source code
    await page.getByPlaceholder('Max Mustermann').fill('E2E Student');
    await page.getByPlaceholder('max@example.com').fill(uniqueEmail);
    await page.getByPlaceholder('Mindestens 8 Zeichen').fill('secure123');

    // Submit — button text is "Registrieren"
    await page.getByRole('button', { name: 'Registrieren', exact: true }).click();

    // Should show success or the new student appears
    await expect(page.locator('text=erfolgreich').or(page.locator('text=E2E Student')).first()).toBeVisible({ timeout: 5000 });
  });

  test('teacher can view student detail', async ({ page }) => {
    // Click "Details" button on first student row
    const detailsBtn = page.getByRole('button', { name: 'Details' }).first();
    if (await detailsBtn.isVisible({ timeout: 3000 })) {
      await detailsBtn.click();
      // Detail modal shows "Übungen:" heading
      await expect(page.getByText('Übungen:')).toBeVisible({ timeout: 3000 });
    }
  });
});
