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
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "https://bind-lms-platform.vercel.app",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
