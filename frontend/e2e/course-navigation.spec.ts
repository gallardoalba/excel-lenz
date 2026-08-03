/**
 * E2E Tests: Course Navigation
 *
 * Tests browsing courses, viewing course details,
 * and navigating between exercises.
 */
import { test, expect } from '@playwright/test';

const STUDENT_EMAIL = 'student@excel-lenz.edu';
const STUDENT_PASSWORD = 'devpassword';

test.describe('Course Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login as student
    await page.goto('/login');
    await page.fill('input[type="email"]', STUDENT_EMAIL);
    await page.fill('input[type="password"]', STUDENT_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('dashboard shows available courses', async ({ page }) => {
    await expect(page.locator('text=Kurse').or(page.locator('text=Courses'))).toBeVisible({ timeout: 5000 });

    // Should show course cards
    const courseCards = page.locator('[class*="course"] a, [class*="Course"] a, a:has([class*="course"])');
    await expect(courseCards.first()).toBeVisible({ timeout: 3000 });
  });

  test('clicking a course navigates to course detail', async ({ page }) => {
    // Click the first course
    const courseLinks = page.locator('[class*="course"] a, [class*="Course"] a, a:has([class*="course"])');
    if (await courseLinks.count() > 0) {
      await courseLinks.first().click();
      await page.waitForLoadState('networkidle');

      // Should show course detail with exercises
      await expect(page.locator('text=Übungen').or(page.locator('text=Exercises'))).toBeVisible({ timeout: 5000 });
    }
  });

  test('course detail shows exercise list grouped by modules', async ({ page }) => {
    // Navigate to first course
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');

    const courseLinks = page.locator('[class*="course"] a, [class*="Course"] a, a:has([class*="course"])');
    if (await courseLinks.count() > 0) {
      await courseLinks.first().click();
      await page.waitForLoadState('networkidle');

      // Should show module sections or exercise list
      await expect(
        page.locator('[class*="module"], [class*="exercise"], [class*="Module"]').first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('exercise can be opened from course detail', async ({ page }) => {
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');

    const courseLinks = page.locator('[class*="course"] a, [class*="Course"] a, a:has([class*="course"])');
    if (await courseLinks.count() > 0) {
      await courseLinks.first().click();
      await page.waitForLoadState('networkidle');

      // Click first exercise
      const exerciseLinks = page.locator('a[href*="/exercise/"]').first();
      if (await exerciseLinks.isVisible({ timeout: 3000 })) {
        await exerciseLinks.click();
        await page.waitForURL('**/exercise/**');
        await page.waitForLoadState('networkidle');

        // Spreadsheet should be visible
        await expect(
          page.locator('[class*="spreadsheet"], [class*="handsontable"], .htCore, table.htCore').first()
        ).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('navigation shows breadcrumb or back button', async ({ page }) => {
    await page.goto('/courses');
    await page.waitForLoadState('networkidle');

    // Should have some navigation element
    await expect(
      page.locator('nav, [class*="breadcrumb"], [class*="Breadcrumb"], a:has-text("Zurück"), button:has-text("Zurück")').first()
    ).toBeVisible({ timeout: 3000 });
  });
});
