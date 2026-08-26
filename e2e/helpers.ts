import { Page, expect } from "@playwright/test";

/**
 * Navigate to a path as an authenticated user, re-logging-in if the shared
 * session was rotated (the app enforces single-active-session, and two dev
 * servers share one Supabase — so a concurrent login elsewhere can bounce us
 * to /login). Re-auth keeps the mobile matrix runnable in that environment.
 */
export async function go(page: Page, path: string) {
  await page.goto(path, { waitUntil: "networkidle" });
  if (/\/login/.test(page.url())) {
    await page.fill("#email", process.env.E2E_EMAIL ?? "Test@vibha.test");
    await page.fill("#password", process.env.E2E_PASSWORD ?? "K#test");
    await page.getByRole("button", { name: /sign in|log in/i }).click();
    await page.waitForURL(/dashboard|practice|today|admin/, { timeout: 15000 });
    await page.goto(path, { waitUntil: "networkidle" });
  }
  // If we still bounced, the shared session is genuinely broken — fail loudly.
  await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
}
