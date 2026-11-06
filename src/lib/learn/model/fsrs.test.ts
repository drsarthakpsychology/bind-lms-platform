import { describe, expect, it } from "vitest";
import { gradeFor, intervalDays, isDue, retrievability, review, MAX_INTERVAL_DAYS } from "./fsrs";

const NOW = new Date("2026-11-06T10:00:00Z");
const later = (d: number) => new Date(NOW.getTime() + d * 86_400_000);

describe("forgetting curve", () => {
  it("is 90 % after `stability` days, so the interval for 90 % retention is S", () => {
    expect(retrievability(10, 10)).toBeCloseTo(0.9);
    expect(intervalDays(10)).toBe(10);
    expect(intervalDays(10, 0.8)).toBeGreaterThan(10);
  });
  it("clamps intervals to 1 … 365 days", () => {
    expect(intervalDays(0.01)).toBe(1);
    expect(intervalDays(10_000)).toBe(MAX_INTERVAL_DAYS);
  });
});

describe("gradeFor", () => {
  it("maps outcomes to grades", () => {
    expect(gradeFor(0)).toBe(1);
    expect(gradeFor(0.6)).toBe(2);
    expect(gradeFor(1)).toBe(3);
    expect(gradeFor(1, true)).toBe(4);
    expect(gradeFor(Number.NaN)).toBe(1);
  });
});

describe("review", () => {
  it("schedules a new card: wrong tomorrow, right a few days out", () => {
    const wrong = review(undefined, 1, NOW);
    expect(Date.parse(wrong.dueAt) - NOW.getTime()).toBe(86_400_000);
    expect(wrong.lapses).toBe(1);
    const right = review(undefined, 3, NOW);
    expect(Date.parse(right.dueAt)).toBeGreaterThan(Date.parse(wrong.dueAt));
    expect(right.reps).toBe(1);
  });
  it("grows stability on recall and shrinks it on a lapse", () => {
    const first = review(undefined, 3, NOW);
    const recalled = review(first, 3, later(4));
    expect(recalled.stability).toBeGreaterThan(first.stability);
    const lapsed = review(recalled, 1, later(20));
    expect(lapsed.stability).toBeLessThan(recalled.stability);
    expect(lapsed.lapses).toBe(1);
    expect(lapsed.difficulty).toBeGreaterThan(recalled.difficulty);
  });
  it("keeps difficulty inside 1 … 10", () => {
    let c = review(undefined, 1, NOW);
    for (let i = 1; i < 30; i++) c = review(c, 1, later(i));
    expect(c.difficulty).toBeLessThanOrEqual(10);
    let e = review(undefined, 4, NOW);
    for (let i = 1; i < 30; i++) e = review(e, 4, later(i * 30));
    expect(e.difficulty).toBeGreaterThanOrEqual(1);
  });
  it("knows when a card is due", () => {
    const c = review(undefined, 3, NOW);
    expect(isDue(c, NOW)).toBe(false);
    expect(isDue(c, later(60))).toBe(true);
  });
});
