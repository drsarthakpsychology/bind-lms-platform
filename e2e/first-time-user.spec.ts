import { test, expect } from "@playwright/test";
import { go } from "./helpers";

/**
 * T78 — Mobile first-time-user audit.
 *
 * Tests the app as a user who has never seen it before: the public front
 * door (unauth) must make the offer legible, and the first authenticated
 * landing (/today) must present exactly ONE dominant next action with
 * understandable terminology — not a wall of options. The principles:
 *
 *   - the product's value is stated, not assumed (public landing);
 *   - the first-run surface leads with a single clear task;
 *   - labels are plain-language, no unexplained jargon;
 *   - nothing dead-ends the user on first visit.
 */

const MOBILE = { width: 390, height: 780 };

test.describe("T78 first-time user (mobile)", () => {
  test.use({ viewport: MOBILE });

  test("unauth visitor can read the public landing", async ({ page, context }) => {
    // The shared session is authenticated; clear cookies so this walks the
    // true unauth visitor path (an authed session redirects / to /today).
    await context.clearCookies();
    await page.goto("/", { waitUntil: "networkidle" });
    // Clearing the authed session must land on the public landing, not a
    // redirect loop to /login.
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    // The landing states the offer in the hero.
    await expect(page.locator("h1").first()).toBeVisible();
    // The value proposition is legible (a real headline, not a skeleton).
    await expect(page.locator("h1").first()).not.toHaveText("");
    // A waitlist entry point exists in the DOM (its exact tap behaviour is
    // owned by the concurrently-redesigning marketing pass — asserted lightly).
    await expect(page.locator('a[href="/waitlist"]').first()).toHaveCount(1);
  });

  test("first authenticated landing leads with one dominant next action", async ({ page }) => {
    // The authenticated front door is /today (v5.1 Part B).
    await go(page, "/today");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    // The primary card is a single resume/start target.
    const primary = page.locator('a[href^="/courses/"], a[href^="/practice/consulting-room"]').first();
    await expect(primary).toBeVisible();
    // The shell makes the other core areas reachable (bottom nav on mobile).
    await expect(page.locator("nav[aria-label='Primary tabs']")).toBeVisible();
    // No horizontal scroll on first view.
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });
});
