import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/unit',
  fullyParallel: true,
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  use: {
    headless: true
  },
  reporter: [['list']]
});
