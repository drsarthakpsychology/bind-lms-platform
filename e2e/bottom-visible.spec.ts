import { test, expect, type Page } from "@playwright/test";
import { go } from "./helpers";

/**
 * Nothing hides at the bottom of a phone screen (owner report, Nov 2026:
 * "I could not see some content on the bottom side of the phone").
 *
 * At 390 x 780 (a common Android phone) each student page is scrolled to the
 * very end; the last piece of content (text or a control) must sit fully
 * above anything pinned to the bottom edge: the tab bar, a question's
 * Check/Next bar, the reader's Back/Next bar, a lecture's Previous/Next bar.
 * Content inside a closed <details> or an inner scroller is not counted.
 */

const PAGES = [
  "/dashboard",
  "/study",
  "/study/notes",
  "/study/map",
  "/courses",
  "/practice/medicines",
  "/practice",
  "/prep",
  "/prep/mock",
  "/prep/long",
  "/prep/smart",
  "/games",
  "/progress",
  "/doubts",
  "/achievements",
  "/leaderboard",
  "/reflect",
  "/settings",
  "/notifications",
];

type Result = { hidden: number; cover: number; lastBottom: number; last: string | null };

async function lastLineHidden(page: Page): Promise<Result> {
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(300);
  return page.evaluate(() => {
    const vh = window.innerHeight;
    const visible = (el: Element) => {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    // Where the bottom bars start.
    let cover = vh;
    for (const el of document.querySelectorAll("body *")) {
      const pos = getComputedStyle(el).position;
      if ((pos !== "fixed" && pos !== "sticky") || !visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom >= vh - 2 && r.height < vh * 0.6 && r.top > vh * 0.3) cover = Math.min(cover, r.top);
    }
    // The lowest piece of page content.
    const root = document.querySelector("main") ?? document.body;
    let last: Element | null = null;
    let lastBottom = -1;
    for (const el of root.querySelectorAll("*")) {
      if (!visible(el) || el.closest(".sr-only,[aria-hidden=true]")) continue;
      if (el.closest("details:not([open])") && !el.closest("summary")) continue;
      let pinned = false;
      let inner = false;
      for (let a: Element | null = el; a && a !== root; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.position === "fixed" || cs.position === "sticky") pinned = true;
        if (a !== el && (cs.overflowY === "auto" || cs.overflowY === "scroll") && a.scrollHeight > a.clientHeight + 2) inner = true;
      }
      if (pinned || inner) continue;
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim());
      if (!hasText && !el.matches("a[href],button,input,textarea,select,img,svg,video")) continue;
      const b = el.getBoundingClientRect().bottom;
      if (b > lastBottom) {
        lastBottom = b;
        last = el;
      }
    }
    return {
      hidden: Math.max(0, Math.round(lastBottom - cover)),
      cover: Math.round(cover),
      lastBottom: Math.round(lastBottom),
      last: last ? `${last.tagName.toLowerCase()} "${(last.textContent ?? "").trim().slice(0, 40)}"` : null,
    };
  });
}

test.describe("390px: the bottom of every page is reachable", () => {
  test.use({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true });

  for (const path of PAGES) {
    test(`${path}: last content clears the bottom bars`, async ({ page }) => {
      await go(page, path);
      const r = await lastLineHidden(page);
      expect(r.hidden, `${path}: ${r.last} ends at ${r.lastBottom}px, bars start at ${r.cover}px`).toBe(0);
    });
  }
});
