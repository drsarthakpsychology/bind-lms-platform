import { defineConfig } from "@playwright/test";

/**
 * Playwright config — covers the four "would ruin a Sunday" paths:
 *  1. student can log in
 *  2. student can play a lesson video
 *  3. student can submit an assignment
 *  4. admin can create a student
 *
 * Runs against the base URL from env (defaults to the production site).
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 1,
  globalSetup: "./e2e/global-setup.ts",
  // Reuse a single logged-in session across every spec (see global-setup).
  // This avoids tripping the app's login rate limit (10/email) and its
  // single-active-session check when many specs run together.
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    storageState: ".e2e-state.json",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
