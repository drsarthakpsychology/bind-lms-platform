import { chromium } from "@playwright/test";

/**
 * Global setup — log in once as the test student and save the session state
 * to a file. Every spec then reuses that session via `storageState`, so we
 * don't hammer the app's login rate limit (10/email) or trip the
 * single-active-session check by logging in repeatedly.
 */
export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const base = process.env.E2E_BASE_URL ?? "http://localhost:3000";
  await page.goto(`${base}/login`);
  await page.fill("#email", process.env.E2E_EMAIL ?? "Test@vibha.test");
  await page.fill("#password", process.env.E2E_PASSWORD ?? "K#test");
  await page.getByRole("button", { name: /sign in|log in/i }).click();
  // Post-login landing is /today for students (/admin for admins).
  await page.waitForURL(/dashboard|practice|today|admin/, { timeout: 15000 });
  await page.waitForLoadState("networkidle").catch(() => {});

  await page.context().storageState({ path: ".e2e-state.json" });
  await browser.close();
}
