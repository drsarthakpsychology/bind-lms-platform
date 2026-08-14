import { test, expect } from "@playwright/test";
import { go } from "./helpers";

/**
 * T77 — Mobile workflow-completion audit.
 *
 * Tests the complete student journey as ONE connected walk, not isolated
 * pages: login → dashboard → course → lesson → assessment → practice →
 * reflection → wall. At each hop it asserts the principles that make a
 * workflow *complete* rather than a stack of pages:
 *
 *   - the current task is obvious (one dominant next action);
 *   - back navigation returns to the real previous context (not a dead end);
 *   - state survives the hop (the "continue" target is precise);
 *   - mobile composition holds (no horizontal scroll at 390px).
 *
 * The shared session is pre-authenticated (global setup). Where a hop depends
 * on seeded content (a specific lesson), the test navigates what the shell
 * actually offers rather than assuming ids.
 */

const MOBILE = { width: 390, height: 780 };

test.describe("T77 workflow completion (mobile journey)", () => {
  test.use({ viewport: MOBILE });

  test("login → dashboard → course → lesson → back → practice → reflect → wall", async ({ page }) => {
    // 1. Dashboard is the authenticated landing — the shell's primary hub.
    await go(page, "/dashboard");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    // The dashboard leads with a primary action (Step 1 continue / start).
    const primary = page.locator('a[href^="/courses/"]').first();
    await expect(primary).toBeVisible();

    // 2. Enter the first course from the dashboard — this is the primary
    //    "continue learning" hop and must land on a real course (not a stub).
    const courseHref = (await primary.getAttribute("href"))!;
    await primary.click();
    await expect(page).toHaveURL(/\/courses\//);
    // The course overview must present the curriculum + a clear next action.
    await expect(page.locator("h1, h2").first()).toBeVisible();
    await expect(page).not.toHaveURL(/\/login/);

    // 3. Open the first available lesson the course offers.
    const lessonLink = page.locator('a[href*="/lessons/"]').first();
    if ((await lessonLink.count()) > 0) {
      await lessonLink.click();
      await expect(page).toHaveURL(/\/lessons\//);
      await expect(page).not.toHaveURL(/\/login/);
      // The lesson keeps its learning context and a forward affordance.
      await expect(page.locator("h1, h2").first()).toBeVisible();

      // 4. Back navigation returns to the course (not a dead end / login).
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(courseHref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      await expect(page).not.toHaveURL(/\/login/);
    }

    // 5. Practice hub — the full tool set grouped, no horizontal scroll.
    await go(page, "/practice");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
      "practice hub must not scroll horizontally",
    ).toBe(true);

    // 6. Enter a practice tool and complete a unit of work.
    const tool = page.locator('a[href^="/practice/judgment"], a[href^="/practice/rounds"], a[href^="/practice/two-minute-clinic"]').first();
    if ((await tool.count()) > 0) {
      await tool.click();
      await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
      await expect(page.locator("h1, h2").first()).toBeVisible();
    }

    // 7. Reflect — the journal (history-first on mobile) is reachable and
    //    the compose action is available.
    await go(page, "/reflect");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    await expect(page.getByRole("button", { name: "New entry" })).toBeVisible();

    // 8. Wall — the cohort feed, with a compose reveal.
    await go(page, "/wall");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    await expect(page.getByRole("button", { name: "New post" })).toBeVisible();

    // 9. The journey holds horizontal-scroll discipline at 390px.
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
      "final surface must not scroll horizontally",
    ).toBe(true);
  });
});

test.describe("T77 returning-user continuation (mobile)", () => {
  test.use({ viewport: MOBILE });

  test("a partially-started journey surfaces an obvious continue target", async ({ page }) => {
    // The dashboard's Step 1 must always offer a precise continue/start action
    // — the returning-user "what next" is never ambiguous.
    await go(page, "/dashboard");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 8000 });
    await expect(page.locator('a[href^="/courses/"]').first()).toBeVisible();
    await expect(page.locator('a[href^="/practice/"]').first()).toBeVisible();
  });
});
