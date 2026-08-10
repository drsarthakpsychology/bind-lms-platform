import { Page, expect } from "@playwright/test";

/**
 * With global setup + storageState, the session is already authenticated.
 * Navigate to a path and confirm the app shell renders (not the login page).
 */
export async function go(page: Page, path: string) {
  await page.goto(path, { waitUntil: "networkidle" });
  // If we bounced to /login, the shared session expired — fail loudly.
  await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
}
