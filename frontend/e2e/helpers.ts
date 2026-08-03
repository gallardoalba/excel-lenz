/**
 * Shared E2E Test Helpers
 *
 * Exercise IDs are UUIDs. The app requires authentication to access exercises.
 * These helpers register/login and navigate to exercises.
 */
import { type Page, type BrowserContext } from '@playwright/test';

/** Get the first exercise ID from the courses API */
export async function getFirstExerciseId(): Promise<string> {
  const res = await fetch('http://localhost:3001/api/courses');
  if (!res.ok) {
    const body = await res.text().catch(() => '(unable to read body)');
    throw new Error(`GET /api/courses failed (${res.status}): ${body}`);
  }
  const courses = await res.json() as any[];
  if (!Array.isArray(courses)) {
    throw new Error(`GET /api/courses returned non-array: ${JSON.stringify(courses)}`);
  }
  for (const course of courses) {
    const detailRes = await fetch(`http://localhost:3001/api/courses/${course.id}`);
    if (!detailRes.ok) continue;
    const detail = await detailRes.json() as any;
    if (detail.exercises?.length > 0) {
      return detail.exercises[0].id;
    }
  }
  throw new Error('No exercises found in any course');
}

/** Get a spreadsheet-type exercise ID (has grid, not quiz) */
export async function getFirstSpreadsheetExerciseId(): Promise<string> {
  const res = await fetch('http://localhost:3001/api/courses');
  if (!res.ok) throw new Error(`GET /api/courses failed (${res.status})`);
  const courses = await res.json() as any[];
  for (const course of courses) {
    const detailRes = await fetch(`http://localhost:3001/api/courses/${course.id}`);
    if (!detailRes.ok) continue;
    const detail = await detailRes.json() as any;
    for (const ex of detail.exercises || []) {
      // Fetch exercise detail to check if it's a spreadsheet (has data/taskCols)
      const exRes = await fetch(`http://localhost:3001/api/exercises/${ex.id}`);
      if (!exRes.ok) continue;
      const exDetail = await exRes.json() as any;
      const td = exDetail.template_data || {};
      if (td.type !== 'quiz' && Array.isArray(td.data) && td.data.length > 0) {
        return ex.id;
      }
    }
  }
  throw new Error('No spreadsheet exercise found in any course');
}

const TEST_USER_PREFIX = 'e2e_';
let cachedToken: string | null = null;
let cachedUsername: string | null = null;

/** Register and login as a test user, returns token. Cached across tests. */
export async function ensureAuthenticated(page: Page): Promise<string> {
  if (cachedToken) {
    // Navigate to root first so localStorage is accessible
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate((t: string) => {
      localStorage.setItem('token', t);
    }, cachedToken);
    return cachedToken;
  }

  const username = `${TEST_USER_PREFIX}${Date.now()}`;
  const email = `${username}@test.local`;
  const password = 'E2eTest123!';

  // Register
  await page.request.post('http://localhost:3001/api/auth/register', {
    data: { email, password, name: username },
  });

  // Login
  const loginRes = await page.request.post('http://localhost:3001/api/auth/login', {
    data: { email, password },
  });
  const body = await loginRes.json();
  const token = body.token;

  // Navigate to a page first to access localStorage
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  await page.evaluate((t: string) => {
    localStorage.setItem('token', t);
  }, token);

  cachedToken = token;
  cachedUsername = username;
  return token;
}

/** Navigate to an exercise page (authenticated) and wait for the spreadsheet */
export async function openExercise(page: Page, exerciseId?: string): Promise<string> {
  await ensureAuthenticated(page);
  const id = exerciseId || await getFirstExerciseId();
  await page.goto(`/exercises/${id}`);
  // Wait for exercise content — could be a spreadsheet OR a quiz (Q&A) exercise
  await page.waitForSelector('.ht_master, .spreadsheet-fortune-grid, .excel-ribbon, .handsontable, table.htCore, [class*="spreadsheet"], .quiz-card, .quiz-option, .quiz-nav-strip', { timeout: 15000 });
  return id;
}
