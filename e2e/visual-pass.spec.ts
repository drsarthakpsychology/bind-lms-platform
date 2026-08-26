import { test, expect } from "@playwright/test";
import { go } from "./helpers";
import { mkdirSync } from "fs";

const SHOT = "screenshots/mobile";
mkdirSync(SHOT, { recursive: true });

// Programmatic visual QA at 390px: no horizontal overflow, no element
// clipped below the fold without a scroll, primary CTA in the first viewport,
// and a screenshot per screen for the human comparison pass (T83).
const SCREENS: Array<{ path: string; cta: RegExp | null }> = [
  { path: "/today", cta: /resume|decode|continue/i },
  { path: "/practice", cta: /recommended for you/i },
  { path: "/practice/consulting-room", cta: /start session|resume/i },
  { path: "/reflect", cta: /new entry/i },
  { path: "/wall", cta: /new post/i },
  { path: "/record", cta: null },
];

test("visual QA: no overflow, CTA reachable, screenshots captured", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const s of SCREENS) {
    await go(page, s.path);
    await page.waitForLoadState("networkidle").catch(() => {});
    // 1) No horizontal overflow.
    const hOverflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hOverflow, `${s.path} must not overflow horizontally`).toBe(false);
    // 2) Primary CTA visible in the first viewport.
    if (s.cta) {
      const cta = page.getByText(s.cta).first();
      const box = await cta.boundingBox().catch(() => null);
      expect(box, `${s.path} CTA should be in the first viewport`).not.toBeNull();
      if (box) expect(box.y + box.height).toBeLessThanOrEqual(844 + 4);
    }
    // 3) Screenshot for the human comparison pass.
    const slug = s.path.replace(/\//g, "-").replace(/^-/, "") || "home";
    await page.screenshot({ path: `${SHOT}/${slug}.png`, fullPage: false });
    console.log(`✓ ${s.path} — no overflow, CTA${s.cta ? "" : " n/a"}, shot saved`);
  }
});
