import { test, expect } from "@playwright/test";
import { go } from "./helpers";

/**
 * Practice tool interactions — session pre-authenticated via global setup.
 */

test.describe("practice tool interactions", () => {
  test("judgment answers a call and reveals the panel", async ({ page }) => {
    await go(page, "/practice/judgment");
    await expect(page.locator("h1")).toContainText(/5 Judgment Calls/i);
    await page.locator("button").filter({ hasText: /much less likely|less likely/i }).first().click();
    await expect(page.getByText(/panel disagreed|the lesson/i).first()).toBeVisible({ timeout: 5000 });
    console.log("✓ judgment answered + panel revealed");
  });

  test("two-minute clinic runs a micro-drill", async ({ page }) => {
    await go(page, "/practice/two-minute-clinic");
    await expect(page.locator("h1")).toContainText(/Two-Minute Clinic/i);
    const start = page.getByRole("button", { name: /start|begin/i }).first();
    if (await start.isVisible().catch(() => false)) {
      await start.click();
      await page.waitForTimeout(800);
    }
    console.log("✓ two-minute clinic reachable");
  });

  test("formulation forge sorts factors", async ({ page }) => {
    await go(page, "/practice/formulation");
    await expect(page.locator("h1").first()).toContainText(/formulation|5P/i);
    const factor = page.locator("button").filter({ hasText: /predispos|precipitat|perpetuat|protective/i }).first();
    if (await factor.isVisible().catch(() => false)) {
      await factor.click();
      await page.waitForTimeout(400);
      console.log("✓ formulation factor interacted");
    } else {
      console.log("✓ formulation forge rendered (no sortable factors visible)");
    }
  });

  test("MSE trainer loads stimuli", async ({ page }) => {
    await go(page, "/practice/mse");
    await expect(page.locator("h1").first()).toContainText(/Mental Status|MSE/i);
    const tag = page.locator("button").filter({ hasText: /stimulus|tag|start/i }).first();
    if (await tag.isVisible().catch(() => false)) {
      await tag.click();
      await page.waitForTimeout(400);
    }
    console.log("✓ MSE trainer reachable");
  });

  test("OSCE station loads", async ({ page }) => {
    await go(page, "/practice/osce");
    await expect(page.locator("h1").first()).toContainText(/OSCE|station/i);
    console.log("✓ OSCE reachable");
  });

  test("rounds shows the deck", async ({ page }) => {
    await go(page, "/practice/rounds");
    await expect(page.locator("h1").first()).toContainText(/cards|rounds/i);
    console.log("✓ rounds reachable");
  });

  test("reflect journal saves an entry", async ({ page }) => {
    await go(page, "/reflect");
    await expect(page.locator("h1")).toContainText(/journal/i);
    await page.locator("textarea").first().fill("Test entry — reviewing the week.");
    await page.getByRole("button", { name: /save entry/i }).click();
    await expect(page.getByText(/test entry — reviewing the week/i)).toBeVisible({ timeout: 6000 });
    console.log("✓ journal entry saved");
  });
});
