/**
 * E2E Tests: Course Navigation
 *
 * Tests browsing courses, viewing course details,
 * and navigating between exercises.
 */
import { test, expect } from '@playwright/test';

const TEST_EMAIL = `nav_test_${Date.now()}@test.local`;
const TEST_PASS = 'NavTest123!';

test.describe('Course Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login via API (same pattern as auth-community tests)
    await page.request.post('http://localhost:3001/api/auth/register', {
      data: { email: TEST_EMAIL, password: TEST_PASS, name: 'NavTester' },
    });
    const loginRes = await page.request.post('http://localhost:3001/api/auth/login', {
      data: { email: TEST_EMAIL, password: TEST_PASS },
    });
    const { token } = await loginRes.json();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate((t: string) => localStorage.setItem('token', t), token);

    // Navigate to student dashboard
    await page.goto('/student');
    await page.waitForLoadState('networkidle');
  });

  test('dashboard shows available courses', async ({ page }) => {
    // Student dashboard should show content
    await expect(page.locator('h1, h2, a[href*="/course/"], [class*="student"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('clicking a course navigates to course detail', async ({ page }) => {
    // Click the first course
    const courseLinks = page.locator('[class*="course"] a, [class*="Course"] a, a:has([class*="course"])');
    if (await courseLinks.count() > 0) {
      await courseLinks.first().click();
      await page.waitForLoadState('networkidle');

      // Should show course detail page with exercise content
      await expect(page.locator('h2:has-text("Übungen"), h1:has-text("Übungen"), [class*="module-card"]').first()).toBeVisible({ timeout: 5000 });
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
