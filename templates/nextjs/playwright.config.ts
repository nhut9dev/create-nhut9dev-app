/* eslint-disable import/no-extraneous-dependencies */
import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

// Use a distinct port on CI to avoid conflicts during concurrent tests
const PORT = process.env.CI ? 3006 : 3000;

const config: PlaywrightTestConfig = {
  retries: process.env.CI ? 1 : 0,
  testDir: './tests',
  projects: [
    {
      name: 'chromium',
      use: devices['Desktop Chrome'],
    },
  ],
  use: {
    video: 'on',
    headless: false, // Open the browser to view
    launchOptions: {
      slowMo: 1000,
    },
  },
  fullyParallel: true,
  webServer: {
    command: `PORT=${PORT} pnpm start`,
    port: PORT,
    reuseExistingServer: true,
  },
};

export default config;
