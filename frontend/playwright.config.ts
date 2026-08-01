import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E test configuration for Excel-lenz
 *
 * Runs against the Vite dev server (port 5173) which proxies /api to backend (port 3001).
 * Both servers must be running before tests: npm run dev (from root) or concurrently.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  timeout: 60000,
  expect: { timeout: 15000 },

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Servers are started separately via `npm run dev` from root
  // webServer: ... (commented out — use existing servers)
});
