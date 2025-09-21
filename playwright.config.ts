import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 5000 },
  reporter: [['html', { open: 'never' }], ['list']],
  projects: [
    {
      name: 'UI-Chromium',
      testDir: 'tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://ultimateqa.com',
        viewport: { width: 1280, height: 800 },
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure'
      }
    },
    {
      name: 'UI-Firefox',
      testDir: 'tests/ui',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: 'https://ultimateqa.com',
        viewport: { width: 1280, height: 800 },
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure'
      }
    },
    {
      name: 'API',
      testDir: 'tests/api',
      use: {
        baseURL: 'http://localhost:3000'
      }
    }
  ]
});
