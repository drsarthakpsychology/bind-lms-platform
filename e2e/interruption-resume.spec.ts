import { test, expect } from "@playwright/test";
import { go } from "./helpers";

test("interruption: journal draft survives reload (T46/T80)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await go(page, "/reflect");
  await page.getByRole("button", { name: "New entry" }).click();
  await page.getByLabel("Journal entry").locator("visible=true").fill("mid-reflection interruption test");
  await page.waitForTimeout(1400); // 800ms debounce
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "New entry" }).click();
  const restored = await page.getByLabel("Journal entry").locator("visible=true").inputValue();
  console.log("✓ journal draft survived reload:", JSON.stringify(restored.slice(0, 40)));
  expect(restored).toContain("mid-reflection interruption test");
});
