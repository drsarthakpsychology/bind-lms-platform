import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility check with axe-core (WCAG 2.0, 2.1 and 2.2, levels A and AA).
 * Run: npm run test:a11y (needs the app running, same as the other e2e specs).
 * Fails on "serious" or "critical" problems. Smaller ones are printed only.
 * See docs/tooling/TOOLS_INSTALLED.md.
 */

const ROUTES = ["/", "/waitlist", "/login", "/dashboard", "/study", "/games", "/prep", "/practice", "/progress", "/settings"];
const WIDTHS = [390, 1280];

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`a11y ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.waitForLoadState("networkidle").catch(() => {});
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const bad = result.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      for (const v of result.violations) {
        console.log(`${route} ${width}px ${v.impact} ${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
      }
      expect(bad.map((v) => `${v.id} (${v.nodes.length})`), "serious or critical accessibility problems").toEqual([]);
    });
  }
}
