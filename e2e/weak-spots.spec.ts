import { test, expect } from "@playwright/test";

/**
 * Weak-spots page — renders (may show spots from the real scored sim session,
 * or the empty state if no scores).
 */
test("weak-spots page renders", async ({ page }) => {
  await page.goto("/practice/weak-spots", { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toContainText(/weak spots|where you miss/i);
  // Either the empty state or the spot list renders — both healthy.
  const h1 = await page.locator("h1").first().textContent();
  console.log("✓ weak-spots h1:", h1?.trim());
  const body = await page.locator("body").innerText();
  const hasEmpty = /no sessions scored/i.test(body);
  const hasSpots = /severity|sessions/i.test(body);
  console.log("empty state:", hasEmpty, "| spot list:", hasSpots);
  expect(hasEmpty || hasSpots).toBe(true);
});
