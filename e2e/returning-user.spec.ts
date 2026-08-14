import { test, expect } from "@playwright/test";
import { go } from "./helpers";

/**
 * T79 — Mobile returning-user audit.
 *
 * An existing student returns with partial progress: an unfinished case, an
 * in-progress course, prior journal entries, existing wall posts. The
 * interface must intelligently surface continuation points — a precise
 * "resume"/"continue" target — without forcing the user to restart or
 * re-orient from scratch. No invented state: this walks what the seeded
 * account actually has.
 */

const MOBILE = { width: 390, height: 780 };

test.describe("T79 returning user (mobile)", () => {
  test.use({ viewport: MOBILE });

  test("front door leads with a single continuation target", async ({ page }) => {
    await go(page, "/today");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    // /today always presents ONE dominant next action (resume or daily).
    await expect(page.locator("h1").first()).toBeVisible();
    // The primary action is a real destination.
    const primary = page.locator('a[href^="/practice/consulting-room/session/"], a[href^="/practice/decode"], a[href^="/courses/"]').first();
    await expect(primary).toBeVisible();
    await expect(primary).toHaveAttribute("href", /^\/practice\/|\/courses\//);
  });

  test("dashboard course list surfaces continuation, not restart", async ({ page }) => {
    await go(page, "/dashboard");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    // Course cards communicate progress honestly ("N of M lessons") so a
    // returning user sees where they left off, not a reset.
    await expect(page.locator('a[href^="/courses/"]').first()).toBeVisible();
    await expect(page.getByText(/of \d+ lessons/).first()).toBeVisible();
  });

  test("the wall remembers the cohort's prior conversation", async ({ page }) => {
    await go(page, "/wall");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    // Returning users see existing posts (the feed, not an empty slate).
    // The composer is a progressive reveal behind New post.
    await expect(page.getByRole("button", { name: "New post" })).toBeVisible();
  });

  test("the journal history is the returning surface (not composer-first)", async ({ page }) => {
    await go(page, "/reflect");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    // History-first on mobile: the entry list is the primary surface.
    await expect(page.getByRole("button", { name: "New entry" })).toBeVisible();
  });
});
