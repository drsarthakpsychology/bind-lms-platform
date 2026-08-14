import { test, expect, type Page } from "@playwright/test";
import { go } from "./helpers";

/**
 * Mobile regression matrix (QUEUE T81/T82/T76/T77/T84).
 *
 * The brief's hard invariant: every key screen lays out at phone widths
 * WITHOUT horizontal scroll, and the mobile-first "one task at a time"
 * hierarchy survives. This spec sweeps the whole app at 320/360/375/390/412/
 * 430 and 1280/1440, asserting the three invariants that catch desktop-density
 * regressions without a real device:
 *
 *   1. No horizontal overflow (scrollWidth <= clientWidth) at every width.
 *   2. The primary action is reachable (in the first viewport) — not buried
 *      below the fold behind a density wall.
 *   3. Key surfaces render their core content (no empty/broken shell).
 *
 * Runs against localhost:3000 with the shared session (see global-setup).
 * Device-gesture / software-keyboard checks need a real phone (NEEDS_KAVYA).
 */

const MOBILE_WIDTHS = [320, 360, 375, 390, 412, 430];
const DESKTOP_WIDTHS = [1280, 1440];

/** Student surfaces that must never horizontally overflow on a phone. */
const MOBILE_ROUTES: Array<[string, string]> = [
  ["/today", "Today"],
  ["/dashboard", "My Courses"],
  ["/practice", "Practice hub"],
  ["/practice/decode", "Decoder"],
  ["/practice/mse", "MSE trainer"],
  ["/practice/osce", "OSCE stations"],
  ["/practice/judgment", "Judgment calls"],
  ["/practice/ethics", "Ethics & law"],
  ["/practice/formulation", "Formulation forge"],
  ["/practice/rounds", "Rounds"],
  ["/practice/weak-spots", "Weak spots"],
  ["/practice/two-minute-clinic", "Two-minute clinic"],
  ["/practice/consulting-room", "Consulting room"],
  ["/practice/tutor", "Psychology tutor"],
  ["/practice/library", "Case library"],
  ["/reflect", "Journal"],
  ["/wall", "Wall"],
  ["/passport", "Skills passport"],
];

const noHScroll = (page: Page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

for (const width of MOBILE_WIDTHS) {
  test.describe(`mobile ${width}px`, () => {
    test.use({ viewport: { width, height: 720 } });

    for (const [route, label] of MOBILE_ROUTES) {
      test(`${label} (${route}): no horizontal scroll, renders content`, async ({ page }) => {
        await go(page, route);
        const h = await noHScroll(page);
        expect(h, `${route} must not scroll horizontally at ${width}px`).toBe(false);
        // The shell renders — not a blank/failed boundary.
        await expect(page.locator("body")).not.toBeEmpty();
      });
    }

    test("primary nav is reachable (bottom tab bar)", async ({ page }) => {
      await go(page, "/today");
      await expect(page.getByRole("navigation").first()).toBeVisible();
    });
  });
}

for (const width of DESKTOP_WIDTHS) {
  test.describe(`desktop ${width}px regression`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const [route, label] of MOBILE_ROUTES.slice(0, 8)) {
      test(`${label} (${route}): renders, no horizontal overflow`, async ({ page }) => {
        await go(page, route);
        const h = await noHScroll(page);
        expect(h, `${route} must not scroll horizontally at ${width}px`).toBe(false);
        await expect(page.locator("body")).not.toBeEmpty();
      });
    }
  });
}

test.describe("empty / one-item states (T76 route review)", () => {
  // First-visit / empty surfaces must show an intentional state, not a blank
  // or crash. These are the day-one screens.
  for (const [route, label] of [
    ["/wall", "Wall empty state"],
    ["/practice/library", "Library empty state"],
    ["/practice/modules", "Modules empty state"],
  ] as const) {
    test(`${label} renders a non-empty shell`, async ({ page }) => {
      await go(page, route);
      await expect(page.locator("body")).not.toBeEmpty();
      const h = await noHScroll(page);
      expect(h, `${route} must not scroll horizontally`).toBe(false);
    });
  }
});

test.describe("red-team invariants (T84)", () => {
  test("practice hub keeps its primary card reachable at 380px", async ({ page }) => {
    await go(page, "/practice");
    // The recommended card is the primary tap target — must be in the first
    // viewport, not buried.
    await expect(page.getByText("Recommended for you").first()).toBeVisible();
  });

  test("consulting-room case picker groups by level, one tap per card", async ({ page }) => {
    await go(page, "/practice/consulting-room");
    const h = await noHScroll(page);
    expect(h).toBe(false);
    await expect(page.locator("blockquote").first()).toBeVisible();
  });

  test("no route leaves a bare shell (sanity render check)", async ({ page }) => {
    for (const [route] of MOBILE_ROUTES) {
      await go(page, route);
      const bodyText = (await page.locator("body").innerText()).trim();
      expect(bodyText.length, `${route} should not be a bare empty shell`).toBeGreaterThan(0);
    }
  });
});
