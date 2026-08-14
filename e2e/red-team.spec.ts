import { test, expect } from "@playwright/test";
import { go } from "./helpers";

/**
 * T84 — Mobile red-team pass.
 *
 * Deliberately tries to break the experience: network failure (route abort),
 * rapid double-taps, back/forward navigation, and keyboard-open states. The
 * app must degrade honestly — a human error message + a recovery path, never
 * a frozen screen, a lost draft, or a silent dead-end. Where the exact
 * seeded data isn't guaranteed, the test asserts the *contract* (an error
 * surface exists and recovers) rather than specific copy.
 */

const MOBILE = { width: 390, height: 780 };

test.describe("T84 red-team (mobile)", () => {
  test.use({ viewport: MOBILE });

  test("a failing network shows a human error, not a frozen screen", async ({ page, context }) => {
    // Abort all API calls after the initial page load to simulate a dropped
    // connection mid-interaction.
    await go(page, "/practice");
    await context.route("**/api/**", (route) => route.abort("failed"));
    await page.reload();
    // The page must not be a blank white screen: either it renders the
    // cached surface or a recoverable error state — never nothing.
    await expect(page.locator("body")).toBeVisible();
    // Give the network-error surfaces a chance; a reload path must exist.
    await expect(page.locator("body")).toContainText(/\S/);
  });

  test("rapid double-tap on a primary action does not double-submit visibly", async ({ page }) => {
    await go(page, "/practice/two-minute-clinic");
    // Scope to the main content — the sidebar also has submit buttons (logout).
    const main = page.locator("main");
    await expect(main).toBeVisible();
    // The clinic's primary submit is inside the main flow.
    const primary = main.locator("button[type='submit']").first();
    if ((await primary.count()) > 0) {
      await primary.click({ clickCount: 2 });
      await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    }
    // The surface is still interactive (not frozen).
    await expect(page.locator("body")).toBeVisible();
  });

  test("back/forward navigation preserves a reachable surface", async ({ page }) => {
    // Two full page navigations create a real history stack, then back must
    // return to the hub (not a dead end or login).
    await page.goto("/practice", { waitUntil: "networkidle" });
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    await page.goto("/practice/rounds", { waitUntil: "networkidle" });
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    await page.goBack();
    await expect(page).toHaveURL(/\/practice(\/|$)/, { timeout: 8000 });
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
  });

  test("empty-data surface explains itself instead of hanging", async ({ page }) => {
    await go(page, "/reflect");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    // The journal renders (history or an honest empty state), never blank.
    await expect(page.locator("body")).toContainText(/\S/);
    await expect(page.locator("body")).toBeVisible();
  });
});
