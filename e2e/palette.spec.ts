import { test, expect } from "@playwright/test";

/**
 * Ask the Syllabus (⌘K) — session pre-authenticated via global setup.
 * Press ⌘K, search, navigate.
 */
test.describe("command palette", () => {
  test("opens with ⌘K, searches, and navigates", async ({ page }) => {
    await page.goto("/practice", { waitUntil: "networkidle" });

    // Press ⌘K.
    await page.keyboard.press("Meta+k");
    await expect(page.getByRole("dialog", { name: /ask the syllabus/i })).toBeVisible({ timeout: 5000 });

    // Search for the flagship tool by its full name (unambiguous).
    await page.getByRole("textbox", { name: /search/i }).fill("consulting");
    await expect(page.locator("[role='dialog']")).toContainText(/consulting room/i, { timeout: 5000 });
    console.log("✓ palette search finds tools");

    // Enter selects the top result → navigates to the consulting room.
    await page.keyboard.press("Enter");
    await page.waitForURL(/\/practice\/consulting-room/, { timeout: 8000 });
    console.log("✓ palette navigates →", page.url());
  });

  test("sidebar trigger opens the palette", async ({ page }) => {
    await page.goto("/practice", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /search \(⌘K\)|ask the syllabus/i }).first().click();
    await expect(page.getByRole("dialog", { name: /ask the syllabus/i })).toBeVisible({ timeout: 5000 });
    console.log("✓ sidebar trigger opens palette");
  });

  test("searching case library content returns case docs", async ({ page }) => {
    await page.goto("/practice", { waitUntil: "networkidle" });
    await page.keyboard.press("Meta+k");
    await page.getByRole("textbox", { name: /search/i }).fill("catatonia");
    await page.waitForTimeout(600);
    const caseHit = page.getByText(/case library|PMC/i).first();
    const count = await caseHit.count().catch(() => 0);
    console.log("case-library group shown:", count > 0);
    expect(count).toBeGreaterThan(0);
  });
});
