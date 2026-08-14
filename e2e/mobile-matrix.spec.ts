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

    test("journal: no horizontal scroll, composer reachable via New entry", async ({ page }) => {
      await go(page, "/reflect");
      expect(await noHorizontalScroll(page), "journal must not scroll horizontally").toBe(true);
      // Feed-first: composing is a progressive reveal (T21/T35). The New entry
      // trigger is the primary mobile action; the composer opens in a sheet.
      // Scope to the dialog — the desktop inline composer (hidden lg:block) is
      // also in the DOM, so an unscoped label match would be ambiguous.
      await page.getByRole("button", { name: "New entry" }).click();
      await expect(
        page.getByRole("dialog").getByLabel("Journal entry"),
      ).toBeVisible();
    });

    test("wall: no horizontal scroll, composer reachable via New post", async ({ page }) => {
      await go(page, "/wall");
      expect(await noHorizontalScroll(page), "wall must not scroll horizontally").toBe(true);
      // Feed-first: composing is a progressive reveal. New post opens the sheet
      // with the labelled composer (scope to the dialog; the desktop inline
      // composer is also in the DOM).
      await page.getByRole("button", { name: "New post" }).click();
      await expect(
        page.getByRole("dialog").getByLabel("Post to the cohort wall"),
      ).toBeVisible();
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
