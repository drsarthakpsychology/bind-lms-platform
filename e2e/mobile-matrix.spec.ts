import { test, expect } from "@playwright/test";
import { go } from "./helpers";

/**
 * Mobile viewport matrix (brief §66 / T16). The one hard invariant across the
 * whole rebuild: no screen may scroll horizontally at any supported width, and
 * each screen's primary surface must be reachable. Covers the redesigned
 * screens (practice hub, journal, wall, consulting-room picker) at the six
 * target widths. Desktop regression at 1280/1440 is the final group.
 */

const MOBILE_WIDTHS = [320, 360, 375, 390, 412, 430];

async function noHorizontalScroll(page: import("@playwright/test").Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
  );
}

for (const width of MOBILE_WIDTHS) {
  test.describe(`mobile ${width}px`, () => {
    test.use({ viewport: { width, height: 720 } });

    test("practice hub: no horizontal scroll, recommended card visible", async ({ page }) => {
      await go(page, "/practice");
      expect(await noHorizontalScroll(page), "practice hub must not scroll horizontally").toBe(true);
      await expect(page.getByText("Recommended for you").first()).toBeVisible();
    });

    test("journal: no horizontal scroll, composer visible", async ({ page }) => {
      await go(page, "/reflect");
      expect(await noHorizontalScroll(page), "journal must not scroll horizontally").toBe(true);
      await expect(page.locator("#journal-entry")).toBeVisible();
    });

    test("wall: no horizontal scroll, composer visible", async ({ page }) => {
      await go(page, "/wall");
      expect(await noHorizontalScroll(page), "wall must not scroll horizontally").toBe(true);
      await expect(page.getByLabel("Post to the cohort wall")).toBeVisible();
    });

    test("consulting room picker: no horizontal scroll", async ({ page }) => {
      await go(page, "/practice/consulting-room");
      expect(await noHorizontalScroll(page), "case picker must not scroll horizontally").toBe(true);
      await expect(page.getByText("Cooperative").first()).toBeVisible();
    });
  });
}

test.describe("desktop regression", () => {
  for (const width of [1280, 1440]) {
    test(`practice hub at ${width}px: no horizontal scroll`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await go(page, "/practice");
      expect(await noHorizontalScroll(page)).toBe(true);
      await expect(page.getByText("Recommended for you").first()).toBeVisible();
    });
  }
});
