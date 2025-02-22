import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Do not run tests in parallel in this hackathon */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Do not use more than 1 worker in this hackathon */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"], // List reporter is better for local debugging.
    ["json", { outputFile: "test-results/test-results.json" }],
    ["html", { open: process.env.GRADESCOPE ? "never" : "on-failure" }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:5173",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    /* Configure the timeout for each action */
    actionTimeout: 1500,
  },

  expect: {
    /* Expect every timeout to be 800ms */
    timeout: 1500,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  ...(process.env.GRADESCOPE && {
    webServer: [
      {
        command: 'echo "Waiting for all services to start" && sleep infinity',
        port: 6969,
        reuseExistingServer: !process.env.CI,
        stdout: "pipe",
      },
    ],
  }),
});
