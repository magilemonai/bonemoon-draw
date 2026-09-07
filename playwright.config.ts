import { defineConfig, devices } from '@playwright/test'

// The browser regression suite: the flows engine tests cannot see. Runs against the dev
// server at desktop and both phone heights, plus a reduced-motion pass over the tests
// that move cards. Evidence screenshots go to e2e/evidence/<project>/.
export default defineConfig({
  testDir: 'e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5178',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm dev --port 5178 --strictPort',
    url: 'http://localhost:5178',
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'phone', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: 'phone-short', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 664 }, hasTouch: true } },
    { name: 'reduced-motion', grep: /@motion/, use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' } },
  ],
})
