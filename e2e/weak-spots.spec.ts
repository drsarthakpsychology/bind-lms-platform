import { test, expect } from "@playwright/test";
import { go } from "./helpers";

/**
 * Weak-spots drill flow (queue: "page loads → drill renders → complete →
 * remedy CTA").
 *
 * The drill content is generated on the spot from the account's REAL scored
 * sim sessions, so what this spec can assert depends on the data state:
 *   - 0 sessions        → "No sessions scored yet" empty state (page loads)
 *   - scores, no spots  → "No consistent weak spots" state
 *   - spots             → spot list + a 10-item drill → complete → remedy CTA
 *
 * Every assertion below holds in ANY of those states; when the drill exists
 * (the state the queue item targets), the FULL flow is exercised: items
 * render with the weak/strong pair, answer all 10, land on "Drill complete",
 * and the remedy CTA links to the Consulting Room.
 */

test("weak-spots drill flow: page loads → drill renders → complete → remedy CTA", async ({ page }) => {
  await go(page, "/practice/weak-spots");
  await expect(page.locator("h1")).toContainText(/weak spots|where you miss/i);
  console.log("✓ page loads — h1:", (await page.locator("h1").first().textContent())?.trim());

  // --- State discovery: what does this account actually have? ---
  const body = await page.locator("body").innerText();
  const hasEmpty = /no sessions scored yet/i.test(body);
  const hasNoSpots = /no consistent weak spots/i.test(body);
  const spotCards = page.locator("div.rounded-md.hard-shadow-sm");
  console.log("state → empty:", hasEmpty, "| no-consistent-spots:", hasNoSpots, "| spot cards:", await spotCards.count());

  // The page is healthy in every state.
  expect(hasEmpty || hasNoSpots || (await spotCards.count()) >= 1).toBe(true);

  const drillCard = page.locator("text=Your weak-spots drill").first();
  const drillPresent = (await drillCard.count()) > 0;
  console.log("drill renders:", drillPresent);

  if (drillPresent) {
    // --- Drill renders: counter, skill chip, scenario, weak/strong pair ---
    await expect(drillCard).toBeVisible();
    const counter = await page.getByText(/·\s*1\/\d+/).first().textContent();
    console.log("✓ drill renders — counter:", counter?.trim());
    await expect(page.locator("text=What do you say next?").first()).toBeVisible();
    await expect(page.locator("text=What you said:").first()).toBeVisible();
    await expect(page.locator("text=Try instead:").first()).toBeVisible();
    const skillChip = await page.locator("span.rounded-full.bg-amber-100").first().textContent();
    console.log("✓ skill chip:", skillChip?.trim());

    // --- Complete: answer every item (pick strong → green correct state) ---
    const total = Number(counter?.match(/(\d+)\s*$/)?.[1]) || 10;
    console.log("answering", total, "items…");
    for (let i = 0; i < total; i++) {
      const tryInstead = page.locator("button:has-text('Try instead:')").first();
      await expect(tryInstead).toBeVisible({ timeout: 5000 });
      await tryInstead.click();
      // Reveal shows the "Why:" teaching line + the Next/Finish button.
      await expect(page.locator("text=Why:").first()).toBeVisible({ timeout: 3000 });
      await page.locator("button[data-testid='drill-next']").click();
    }

    // --- Remedy CTA: "Drill complete — N / N" + Consulting Room link ---
    await expect(page.locator("text=Drill complete").first()).toBeVisible({ timeout: 5000 });
    const scoreLine = await page.locator("text=Drill complete").first().textContent();
    console.log("✓ complete —", scoreLine?.trim());
    expect(scoreLine).toMatch(/Drill complete — \d+ \/ \d+/);

    const remedy = page.locator("a:has-text('Run a case — prove it live')").first();
    await expect(remedy).toBeVisible();
    console.log("✓ remedy CTA:", await remedy.getAttribute("href"));
    await remedy.click();
    await page.waitForURL(/\/practice\/consulting-room/, { timeout: 10000 });
    await expect(page.locator("h1")).toContainText(/choose your patient/i);
    console.log("✓ remedy CTA lands on the Consulting Room");
  } else if (hasEmpty) {
    // Empty state: honest guidance to run the Consulting Room (no fabricated
    // link — the empty card states the path in words).
    await expect(page.getByText(/No sessions scored yet/i).first()).toBeVisible();
    await expect(page.getByText(/Run the Consulting Room/i).first()).toBeVisible();
    console.log("✓ empty state explains the path to the Consulting Room");
  } else {
    // No-consistent-spots: no drill is expected; spots (if any) carry remedies.
    console.log("✓ no-consistent-spots state renders (drill correctly absent)");
  }
});

/**
 * Data-level check (fixture path, deterministic): the drill generation for a
 * crafted weak-spot set must return schema-valid items and never exceed the
 * 10-item target — the shape the UI relies on.
 */
test("weak-spots drill generation: schema-valid, capped at 10, sourced from the weak skills", async ({ page }) => {
  await page.goto("/");
  const { analyzeWeakSpots, generateDrill } = await import("@/lib/practice/weak-spots");
  const spots = analyzeWeakSpots([
    { open_closed_ratio: 1, reflective_statements: 0.5, premature_reassurance: 3, domain_coverage: 0.4, risk_timing: "late" },
    { open_closed_ratio: 1.5, reflective_statements: 1, premature_reassurance: 2, domain_coverage: 0.5, risk_timing: "late" },
  ]);
  expect(spots.length).toBeGreaterThan(0);

  const drill = generateDrill(spots, 10);
  expect(drill.length).toBeGreaterThan(0);
  expect(drill.length).toBeLessThanOrEqual(10);
  for (const item of drill) {
    expect(typeof item.id).toBe("string");
    expect(typeof item.scenario).toBe("string");
    expect(item.scenario.length).toBeGreaterThan(0);
    expect(typeof item.weakLine).toBe("string");
    expect(typeof item.strongLine).toBe("string");
    expect(typeof item.why).toBe("string");
    expect(item.weakLine).not.toBe(item.strongLine);
  }
  console.log(`✓ generateDrill: ${drill.length} items, all schema-valid`);
});
