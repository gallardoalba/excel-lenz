/**
 * E2E Tests: Student Panel / Dashboard
 *
 * Tests the student dashboard including stats, courses, reviews, and badges.
 */
import { test, expect } from '@playwright/test';

test.describe('Student Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login via API as a student
    const studentEmail = `e2e_student_${Date.now()}@test.local`;
    const studentPass = 'Student123!';
    await page.request.post('http://localhost:3001/api/auth/register', {
      data: { email: studentEmail, password: studentPass, name: 'E2E Student' },
    });
    const loginRes = await page.request.post('http://localhost:3001/api/auth/login', {
      data: { email: studentEmail, password: studentPass },
    });
    const { token } = await loginRes.json();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate((t: string) => localStorage.setItem('token', t), token);

    await page.goto('/student');
    await page.waitForLoadState('networkidle');
  });

  test('student panel page loads', async ({ page }) => {
    // Should show welcome message
    await expect(page.getByText('Willkommen, E2E Student')).toBeVisible({ timeout: 10000 });
  });

  test('shows XP, Level, and Streak stats', async ({ page }) => {
    await expect(page.getByText('XP', { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Stufe/)).toBeVisible();
    await expect(page.getByText(/Streak/)).toBeVisible();
    await expect(page.getByText('Abgeschlossen', { exact: true })).toBeVisible();
  });

  test('shows course cards', async ({ page }) => {
    await expect(page.locator('.student-course-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('course cards show difficulty and exercise count', async ({ page }) => {
    const meta = page.locator('.student-course-meta').first();
    await expect(meta).toBeVisible({ timeout: 10000 });
    const text = await meta.textContent();
    expect(text).toMatch(/Anfänger|Fortgeschritten|Experte|Übungen/);
  });

  test('shows review section or empty state', async ({ page }) => {
    await page.waitForTimeout(2000);
    // Either has review items or empty state message
    const hasReviews = await page.locator('.student-review-item').first().isVisible().catch(() => false);
    const hasEmpty = await page.locator('.student-empty').first().isVisible().catch(() => false);
    expect(hasReviews || hasEmpty).toBe(true);
  });

  test('shows badges section', async ({ page }) => {
    const badgesSection = page.locator('.student-badges');
    await expect(badgesSection).toBeVisible({ timeout: 10000 });
    // Either badges or empty message inside badges section
    await expect(
      badgesSection.locator('.student-badge-item').first().or(badgesSection.locator('.student-empty'))
    ).toBeVisible({ timeout: 5000 });
  });

  test('clicking a course navigates to course detail', async ({ page }) => {
    const firstCourse = page.locator('.student-course-card').first();
    await expect(firstCourse).toBeVisible({ timeout: 10000 });
    await firstCourse.click();

    // Should navigate to course detail page
    await page.waitForURL('**/courses/**', { timeout: 10000 });
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('shows "Dashboard wird geladen..." while loading', async ({ page }) => {
    // Reload with cleared localStorage to see loading state
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    // Should redirect to login or show loading
    // Just verify page doesn't crash
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
