import { test, expect } from "@playwright/test";
import { go } from "./helpers";

/**
 * Smoke test — every page the student nav + practice hub advertises resolves
 * and renders its core UI. Session is pre-authenticated via global setup.
 */

test.describe("lumen page coverage", () => {
  test("all advertised pages render after login", async ({ page }) => {
    const pages: Array<{ path: string; heading: RegExp }> = [
      { path: "/practice", heading: /Walk into your first real intake ready/ },
      { path: "/practice/ethics", heading: /consequence comes first/i },
      { path: "/practice/check-in", heading: /How's the week, really|How.s the week/i },
      { path: "/practice/supervision", heading: /supervision log/i },
      { path: "/practice/library", heading: /browse the corpus/i },
      { path: "/practice/passport", heading: /competencies, evidenced|passport/i },
      { path: "/practice/judgment", heading: /5 Judgment Calls/i },
      { path: "/practice/mse", heading: /MSE|Mental status/i },
      { path: "/practice/rounds", heading: /Rounds|cards/i },
      { path: "/practice/two-minute-clinic", heading: /Two-Minute|2-Minute|clinic/i },
      { path: "/practice/consulting-room", heading: /Consulting Room|consulting|choose your patient/i },
      { path: "/reflect", heading: /journal/i },
      { path: "/wall", heading: /wall/i },
    ];

    for (const p of pages) {
      await go(page, p.path);
      const h1 = await page.locator("h1").first().textContent().catch(() => null);
      expect(h1, `${p.path} should render an h1`).not.toBeNull();
      expect(h1).toMatch(p.heading);
      console.log(`✓ ${p.path} → h1="${h1?.trim()}"`);
    }
  });
});
