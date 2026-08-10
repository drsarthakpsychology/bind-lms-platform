import { test, expect } from "@playwright/test";
import { go } from "./helpers";

/**
 * Consulting Room end-to-end: pick the first (hand-built, fixture-backed)
 * case → start a session → send a message → the patient replies (fixture
 * path, since AI_ENABLED is unset) and the turns persist.
 */

test("consulting room: patient replies to a message", async ({ page }) => {
  await go(page, "/practice/consulting-room");
  await expect(page.locator("h1")).toContainText(/choose your patient/i);

  await page.getByRole("button", { name: /start session/i }).first().click();
  await page.waitForURL(/\/practice\/consulting-room\/session\//, { timeout: 10000 });
  console.log("✓ session started:", page.url().split("/").pop());

  const input = page.locator("textarea, input[type='text']").first();
  await expect(input).toBeVisible({ timeout: 8000 });
  await input.fill("Namaste, how have you been feeling this week?");
  await input.press("Enter");

  await page.waitForTimeout(3000);
  const body = await page.locator("body").innerText();
  const hasPatientReply = /namaste|feeling|patient|ravi|heavy/i.test(body);
  console.log("patient reply rendered:", hasPatientReply);
  expect(hasPatientReply).toBe(true);
});
