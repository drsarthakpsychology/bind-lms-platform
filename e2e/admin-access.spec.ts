import { test, expect } from "@playwright/test";

/**
 * Admin access boundary — the storageState session is a STUDENT, so hitting
 * an admin route must redirect away (the admin layout enforces role via
 * redirect("/dashboard")). Assert the FINAL URL.
 */
test.describe("admin access boundary", () => {
  test("student is redirected away from admin routes", async ({ page }) => {
    for (const path of [
      "/admin",
      "/admin/checkins",
      "/admin/sim-review",
      "/admin/infra",
      "/admin/students",
      "/admin/courses",
      "/admin/submissions",
    ]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      // The server redirect (admin layout → /dashboard) settles after the
      // initial shell; give it the full round-trip.
      await page.waitForTimeout(1500);
      const finalUrl = page.url();
      expect(finalUrl, `${path} must redirect away for a student`).not.toMatch(/\/admin(\/|$)/);
      console.log(`✓ student redirected ${path} → ${finalUrl}`);
    }
  });
});
