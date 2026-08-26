import { test, expect, type Page } from "@playwright/test";

/**
 * T151 — Video mobile QA.
 *
 * The video lesson on a mobile viewport (iPhone-ish). Covers playback,
 * fullscreen (native or pseudo), rotation/orientation, browser autoplay
 * restriction, audio controls, playback-position resume after a reload, and
 * returning from fullscreen. Everything that can be verified headless is;
 * genuine audio output + real-device Safari pseudo-fullscreen are device-only
 * and noted as such.
 */

const COURSE = "b2bbbd69-a554-458c-9c27-611baaaf4ea9";
const LESSON = "0a6868d4-a306-4c58-8d34-09a5dbbd4569";
const LESSON_URL = `/courses/${COURSE}/lessons/${LESSON}`;

const MOBILE = { width: 390, height: 844 }; // iPhone 12/13-class viewport

test.describe("video mobile QA (390×844, touch)", () => {
  test.use({ viewport: MOBILE, isMobile: true, hasTouch: true });

  async function openPlayer(page: Page) {
    await page.goto(LESSON_URL);
    await page.waitForSelector(".plms-player", { timeout: 25000 });
    // Wait until the video metadata is actually loaded — the `.plms-player`
    // element mounts before the HLS stream resolves, and tapping Play before
    // metadata would be a no-op (headless loading can take a second or two).
    await page.waitForFunction(() => {
      const v = document.querySelector("video");
      return Boolean(v && v.readyState >= 1 && v.duration > 0);
    }, undefined, { timeout: 25000 });
  }

  test("no horizontal scroll; player fits the viewport", async ({ page }) => {
    await openPlayer(page);
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow).toBe(false);
  });

  test("autoplay restriction is respected: no playback until a tap (browser policy)", async ({ page }) => {
    await openPlayer(page);
    // Metadata is loaded, but WITHOUT any tap the player must still show Play
    // (not Pause) and the position must not have advanced — mobile browsers
    // block autoplay-with-sound, and we never try to fight that policy.
    await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
    const t = Number(await page.getByRole("slider", { name: "Seek" }).getAttribute("aria-valuenow"));
    expect(t).toBe(0);
  });

  test("playback: tap Play advances time, Pause holds it", async ({ page }) => {
    await openPlayer(page);
    await page.getByRole("button", { name: "Play" }).click();
    await page.waitForTimeout(1600);
    const t1 = Number(await page.getByRole("slider", { name: "Seek" }).getAttribute("aria-valuenow"));
    await page.waitForTimeout(1600);
    const t2 = Number(await page.getByRole("slider", { name: "Seek" }).getAttribute("aria-valuenow"));
    expect(t2, "currentTime must advance while playing").toBeGreaterThan(t1);
    // Pause holds the position.
    await page.getByRole("button", { name: "Pause" }).click();
    await page.waitForTimeout(800);
    const t3 = Number(await page.getByRole("slider", { name: "Seek" }).getAttribute("aria-valuenow"));
    await page.waitForTimeout(800);
    const t4 = Number(await page.getByRole("slider", { name: "Seek" }).getAttribute("aria-valuenow"));
    expect(t4).toBe(t3);
  });

  test("audio controls: mute toggles state; volume slider present (in overflow menu)", async ({ page }) => {
    await openPlayer(page);
    // Below 400px the volume controls collapse into the "More options" menu.
    await page.getByRole("button", { name: "More options" }).click();
    await expect(page.getByRole("slider", { name: "Volume" })).toBeVisible();
    await page.getByRole("button", { name: "Mute" }).click();
    await expect(page.getByRole("button", { name: "Unmute" })).toBeVisible();
    await page.getByRole("button", { name: "Unmute" }).click();
    await expect(page.getByRole("button", { name: "Mute" })).toBeVisible();
  });

  test("fullscreen engages (native or pseudo) and exit returns to the lesson", async ({ page }) => {
    await openPlayer(page);
    await page.getByRole("button", { name: "Enter fullscreen" }).click();
    await page.waitForTimeout(500);

    const native = await page.evaluate(() => document.fullscreenElement != null);
    const pseudo = await page.locator(".plms-player.is-pseudo-fullscreen").count();
    // On mobile Chromium native fullscreen engages; on real iPhone Safari the
    // code falls back to pseudo-fullscreen (no Element.requestFullscreen there).
    expect(native || pseudo > 0, "fullscreen must engage (native or pseudo)").toBe(true);

    if (native) {
      const fsClass = await page.evaluate(() => document.fullscreenElement?.className ?? "");
      expect(String(fsClass)).toContain("plms-player");
    } else {
      // Pseudo path: body scroll must be locked while active.
      const overflow = await page.evaluate(() => document.body.style.overflow);
      expect(overflow).toBe("hidden");
    }

    // Exit → back to the lesson (player still visible).
    await page.getByRole("button", { name: "Exit fullscreen" }).click().catch(() => {});
    await page.waitForTimeout(400);
    await expect(page.locator(".plms-player")).toBeVisible();
  });

  test("rotation/orientation change: landscape keeps the player usable", async ({ page }) => {
    await openPlayer(page);
    await page.getByRole("button", { name: "Play" }).click();
    await page.waitForTimeout(800);

    // Simulate a rotation to landscape (real devices fire a resize + orientation).
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(500);

    await expect(page.locator(".plms-player")).toBeVisible();
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflow, "no horizontal scroll after rotation").toBe(false);
    // Playback survives the resize.
    const t1 = Number(await page.getByRole("slider", { name: "Seek" }).getAttribute("aria-valuenow"));
    await page.waitForTimeout(1200);
    const t2 = Number(await page.getByRole("slider", { name: "Seek" }).getAttribute("aria-valuenow"));
    expect(t2).toBeGreaterThan(t1);

    // And back to portrait.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await expect(page.locator(".plms-player")).toBeVisible();
  });

  test("network change: reload mid-play resumes near the position", async ({ page }) => {
    await openPlayer(page);
    await page.getByRole("button", { name: "Play" }).click();
    // Play past the 10s progress-ping interval so the server saves a position.
    await page.waitForTimeout(12500);
    const before = Number(await page.getByRole("slider", { name: "Seek" }).getAttribute("aria-valuenow"));
    expect(before).toBeGreaterThan(8);

    // "Connection drops" — reload the page (a real device doing the same loses
    // the socket but keeps the saved position server-side).
    await page.reload();
    await page.waitForSelector(".plms-player", { timeout: 25000 });
    // The player loads and the resume seek lands at loadedmetadata; the React
    // `currentTime` state catches up via a timeupdate a beat later, so wait for
    // the slider itself to reflect the resumed position.
    await page.waitForFunction(() => {
      const v = document.querySelector("video");
      const slider = document.querySelector('[role="slider"][aria-label="Seek"]');
      return Boolean(v && v.currentTime > 0 && slider && Number(slider.getAttribute("aria-valuenow")) > 0);
    }, undefined, { timeout: 25000 });
    const resumed = Number(await page.getByRole("slider", { name: "Seek" }).getAttribute("aria-valuenow"));
    expect(resumed).toBeGreaterThan(0);
    expect(Math.abs(resumed - before)).toBeLessThanOrEqual(12);
  });

  test("mobile control collapse: secondary controls live in the overflow menu", async ({ page }) => {
    await openPlayer(page);
    // Below 400px the speed/volume row collapses into "More options".
    const overflowBtn = page.getByRole("button", { name: "More options" });
    await expect(overflowBtn).toBeVisible();
    // Speed button must NOT be directly exposed.
    await expect(page.getByRole("button", { name: "Playback speed" })).toHaveCount(0);
    await overflowBtn.click();
    // Volume slider becomes reachable inside the menu.
    await expect(page.getByRole("slider", { name: "Volume" })).toBeVisible();
  });

  test("captions: no track for this lesson → toggle stays hidden (honest UI)", async ({ page }) => {
    await openPlayer(page);
    // The published lesson has no caption track; the player must not invent a
    // captions toggle (aria-hidden UI would be worse than none).
    await expect(page.getByRole("button", { name: "Toggle captions" })).toHaveCount(0);
  });
});
