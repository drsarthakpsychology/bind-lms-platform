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
      // The admin layout redirects away (→ /dashboard) server-side. Under
      // concurrent load the redirect can take a beat past the shell load, so
      // WAIT for it to land rather than asserting after a fixed sleep — a real
      // (genuine) access gap still fails the poll on timeout.
      await expect
        .poll(async () => page.url(), { timeout: 10000, intervals: [250, 500, 1000] })
        .not.toMatch(/\/admin(\/|$)/);
      console.log(`✓ student redirected ${path} → ${page.url()}`);
    }
  });
});
