import { test, expect, type Page } from "@playwright/test";

/**
 * UI_RULES public-site checks (docs/UI_RULES.md §15). The public routes (/
 * landing, /enquire) must pass the layout + heading contract at every key
 * width: no horizontal overflow, exactly one h1, no skipped heading levels.
 * The LMS routes are noindexed and not part of this spec.
 */

const WIDTHS = [320, 375, 390, 430, 768, 1024, 1280, 1440];
const ROUTES = ["/", "/enquire"];

async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow, "document should not scroll horizontally").toBe(false);
}

async function assertSingleH1NoSkips(page: Page) {
  const headings = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((els) =>
    els.map((el) => Number(el.tagName[1])),
  );
  const h1s = headings.filter((l) => l === 1).length;
  expect(h1s, "exactly one h1").toBe(1);
  // No skipped levels: the set of levels present must be contiguous from 1.
  const present = [...new Set(headings)].sort((a, b) => a - b);
  for (let i = 1; i < present.length; i++) {
    expect(present[i] - present[i - 1], "no skipped heading levels").toBeLessThanOrEqual(1);
  }
}

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`${route} has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await assertNoHorizontalOverflow(page);
    });
  }
}

for (const route of ROUTES) {
  test(`${route} has one h1 and no skipped headings at 375px`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(route);
    await assertSingleH1NoSkips(page);
  });
}
