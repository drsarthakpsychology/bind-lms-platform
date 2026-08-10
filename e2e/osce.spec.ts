import { test, expect } from "@playwright/test";

/**
 * OSCE randomisation — the station list should render with the daily rotation
 * and the "random station" option.
 */
test("osce: rotated station list + random picker", async ({ page }) => {
  await page.goto("/practice/osce", { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toContainText(/timed stations/i);

  // All stations listed.
  const stationButtons = page.locator("button:has-text('Station')");
  const count = await stationButtons.count();
  expect(count).toBeGreaterThan(1);
  console.log(`✓ ${count} stations listed`);

  // "today's first" marker exists.
  await expect(page.getByText(/today's first/i)).toBeVisible({ timeout: 5000 });
  console.log("✓ daily rotation marker present");

  // Random picker.
  await expect(page.getByText(/pick a random station/i)).toBeVisible();
  console.log("✓ random picker present");
});
