import { describe, expect, it } from "vitest";
import { addCorrectDay, masteryOf, meetsMasteryEvidence, CORRECT_DAYS_KEEP } from "./mastery";

const NOW = new Date("2026-11-06T10:00:00Z");
const daysAgo = (d: number) => new Date(NOW.getTime() - d * 86_400_000).toISOString();
const strong = 2.2; // P(b=0) ≈ 0.90

describe("masteryOf", () => {
  it("is new with no answers", () => {
    expect(masteryOf({ theta: 3, n: 0, lastAt: null, correctDays: [] }, NOW)).toBe("new");
  });
  it("needs P ≥ 0.85, 3 correct first tries and 2 distinct days", () => {
    const base = { theta: strong, n: 6, lastAt: daysAgo(0) };
    expect(masteryOf({ ...base, correctDays: ["2026-11-05", "2026-11-06", "2026-11-06"] }, NOW)).toBe("mastered");
    expect(masteryOf({ ...base, correctDays: ["2026-11-06", "2026-11-06", "2026-11-06"] }, NOW)).toBe("learning");
    expect(masteryOf({ ...base, correctDays: ["2026-11-05", "2026-11-06"] }, NOW)).toBe("learning");
    expect(masteryOf({ ...base, theta: 1.5, correctDays: ["2026-11-04", "2026-11-05", "2026-11-06"] }, NOW)).toBe("learning");
  });
  it("turns mastered into needs review when not practised", () => {
    const days = ["2026-10-01", "2026-10-02", "2026-10-03"];
    expect(masteryOf({ theta: strong, n: 6, lastAt: daysAgo(25), correctDays: days }, NOW)).toBe("decaying");
    expect(masteryOf({ theta: 3.5, n: 6, lastAt: daysAgo(10), correctDays: days }, NOW)).toBe("mastered");
  });
  it("calls a weak, practised skill shaky", () => {
    expect(masteryOf({ theta: -0.5, n: 4, lastAt: daysAgo(0), correctDays: [] }, NOW)).toBe("shaky");
    expect(masteryOf({ theta: -0.5, n: 2, lastAt: daysAgo(0), correctDays: [] }, NOW)).toBe("learning");
  });
});

describe("correct days", () => {
  it("keeps only the most recent entries", () => {
    let d: string[] = [];
    for (let i = 0; i < 15; i++) d = addCorrectDay(d, `2026-11-${String(i + 1).padStart(2, "0")}`);
    expect(d).toHaveLength(CORRECT_DAYS_KEEP);
    expect(d.at(-1)).toBe("2026-11-15");
  });
  it("checks count and distinct days", () => {
    expect(meetsMasteryEvidence(["a", "a", "b"])).toBe(true);
    expect(meetsMasteryEvidence(["a", "a", "a"])).toBe(false);
  });
});
