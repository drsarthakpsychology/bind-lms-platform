import { test, expect } from "@playwright/test";
import { go } from "./helpers";

/**
 * Old core pages — session pre-authenticated via global setup.
 */

test.describe("old core pages", () => {
  test("dashboard renders courses", async ({ page }) => {
    await go(page, "/dashboard");
    await expect(page.locator("h1").first()).toContainText(/dashboard|course|welcome|home/i);
    console.log("✓ dashboard:", (await page.locator("h1").first().textContent())?.trim());
  });

  test("psychopharm tools renders", async ({ page }) => {
    await go(page, "/tools/psychopharm");
    await expect(page.locator("h1").first()).toBeVisible();
    console.log("✓ psychopharm:", (await page.locator("h1").first().textContent())?.trim());
  });

  test("psychopharm drug page renders (fluoxetine)", async ({ page }) => {
    await go(page, "/tools/psychopharm/fluoxetine");
    const h1 = await page.locator("h1").first().textContent().catch(() => null);
    expect(h1).toBeTruthy();
    console.log("✓ drug page:", h1?.trim());
  });

  test("psychopharm compare renders", async ({ page }) => {
    await go(page, "/tools/psychopharm/compare");
    await expect(page.locator("h1").first()).toBeVisible();
    console.log("✓ compare:", (await page.locator("h1").first().textContent())?.trim());
  });

  test("psychopharm learn renders", async ({ page }) => {
    await go(page, "/tools/psychopharm/learn");
    await expect(page.locator("h1").first()).toBeVisible();
    console.log("✓ learn:", (await page.locator("h1").first().textContent())?.trim());
  });

  test("course detail renders", async ({ page }) => {
    await go(page, "/courses/b2bbbd69-a554-458c-9c27-611baaaf4ea9");
    await expect(page.locator("h1").first()).toContainText(/cohort|course/i, { timeout: 8000 });
    console.log("✓ course detail:", (await page.locator("h1").first().textContent())?.trim());
  });
});
