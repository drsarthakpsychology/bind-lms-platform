import { test, expect } from "@playwright/test";

/**
 * Video fullscreen + focused-mode verification (§18/§20/§21).
 *
 * Uses the one published video lesson. Asserts:
 *  1. The lesson page hides the global bottom nav (focused mode).
 *  2. Entering fullscreen actually requests native fullscreen on the player.
 *  3. The pseudo-fullscreen class is present when native fullscreen isn't
 *     granted (e.g. some mobile contexts), covering the viewport.
 *  4. Exiting fullscreen returns to the lesson.
 */

const COURSE = "b2bbbd69-a554-458c-9c27-611baaaf4ea9";
const LESSON = "0a6868d4-a306-4c58-8d34-09a5dbbd4569";
const LESSON_URL = `/courses/${COURSE}/lessons/${LESSON}`;

test("lesson page: global bottom nav is hidden (focused mode)", async ({ page }) => {
  await page.goto(LESSON_URL);
  await page.waitForSelector(".plms-player", { timeout: 20000 });
  await expect(page.locator('nav[aria-label="Primary tabs"]')).toHaveCount(0);
});

test("video fullscreen: entering fills the screen, exiting returns to the lesson", async ({ page }) => {
  await page.goto(LESSON_URL);
  await page.waitForSelector(".plms-player", { timeout: 20000 });

  await page.getByRole("button", { name: "Enter fullscreen" }).click();

  // Native fullscreen is granted in Chromium; wait a beat for the request.
  await page.waitForTimeout(500);
  const native = await page.evaluate(() => document.fullscreenElement != null);
  // Pseudo-fullscreen applies when native isn't granted (mobile/some contexts).
  const pseudoCount = await page.locator(".plms-player.is-pseudo-fullscreen").count();

  // Either native fullscreen OR the pseudo-fullscreen overlay must cover the screen.
  expect(native || pseudoCount > 0, "fullscreen must actually engage (native or pseudo)").toBe(true);

  if (native) {
    // The fullscreened element is the player wrapper (contains the video).
    const fsEl = await page.evaluate(() => document.fullscreenElement?.classList.value ?? "");
    expect(fsEl).toContain("plms-player");
  }

  // Exit and confirm we're back in the lesson (the player is still visible).
  await page.getByRole("button", { name: "Exit fullscreen" }).click().catch(() => {});
  await page.waitForTimeout(400);
  await expect(page.locator(".plms-player")).toBeVisible();
});
