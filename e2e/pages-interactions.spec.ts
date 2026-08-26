import { test, expect } from "@playwright/test";
import { go } from "./helpers";

/**
 * Interaction smoke — exercise the flows, not just the render.
 * Session is pre-authenticated via global setup.
 * AI features run on fixtures when AI_ENABLED is unset (fixture fallback).
 */

test.describe("interactive flows", () => {
  test("weekly check-in submits", async ({ page }) => {
    // The check-in moved out of the /practice drill grid to /record (casebook
    // Finding 4): admin-you-file, tabbed next to the supervision log.
    await go(page, "/record");
    await expect(page.locator("h1")).toContainText("The paper trail of your training");
    await page.getByRole("button", { name: /weekly check-in/i }).click();
    await expect(page.getByText(/thirty seconds/i)).toBeVisible();
    const sliderRows = page.locator("form .grid.grid-cols-5");
    const rowCount = await sliderRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(3);
    await sliderRows.nth(0).locator("button").nth(2).click();
    await sliderRows.nth(1).locator("button").nth(3).click();
    await sliderRows.nth(2).locator("button").nth(1).click();
    await page.getByRole("button", { name: /save check-in/i }).click();
    await expect(page.getByText(/saved|see you next week/i)).toBeVisible({ timeout: 8000 });
    console.log("✓ check-in submitted");
  });

  test("supervision log submits and shows the entry", async ({ page }) => {
    await go(page, "/record");
    await expect(page.locator("h1")).toContainText("The paper trail of your training");
    await page.fill("#sup-activity", "Case review — OCD formulation with Dr. Rao");
    await page.fill("#sup-hours", "1.5");
    await page.getByRole("button", { name: /log hours/i }).click();
    await expect(page.getByText(/OCD formulation/i)).toBeVisible({ timeout: 8000 });
    console.log("✓ supervision logged");
  });

  test("consulting room opens a session", async ({ page }) => {
    await go(page, "/practice/consulting-room");
    await expect(page.locator("h1")).toContainText(/choose your patient|consulting/i);
    const start = page.getByRole("button", { name: /start session/i }).first();
    await start.click();
    await page.waitForURL(/\/practice\/consulting-room\/session\//, { timeout: 10000 });
    console.log("✓ consulting room session started");
  });

  test("case library search works", async ({ page }) => {
    await go(page, "/practice/library");
    await expect(page.locator("h1")).toContainText("Case library");
    const input = page.locator("input[placeholder*='Search']");
    await input.fill("depression");
    await input.press("Enter");
    await page.waitForTimeout(800);
    const shown = await page.getByText(/Showing \d+ of \d+|No matches/i).count();
    expect(shown).toBeGreaterThan(0);
    console.log("✓ library search works");
  });
});
