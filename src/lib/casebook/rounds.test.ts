import { describe, expect, it } from "vitest";
import { seeded } from "@/lib/lab/scoring";
import { buildRound, diffOf, nextTier } from "./rounds";

const bank = [
  ...Array.from({ length: 10 }, (_, i) => ({ id: `e${i}`, difficulty: 1 })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `m${i}`, difficulty: 2 })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `h${i}`, difficulty: 3 })),
];

describe("tiers", () => {
  it("first play is a warm-up; strong scores move up, weak move down", () => {
    expect(nextTier(null)).toBe(1);
    expect(nextTier({ right: 10, total: 12, tier: 1 })).toBe(2);
    expect(nextTier({ right: 11, total: 12, tier: 3 })).toBe(3);
    expect(nextTier({ right: 4, total: 12, tier: 3 })).toBe(2);
    expect(nextTier({ right: 7, total: 12, tier: 2 })).toBe(2);
    expect(nextTier({ right: 2, total: 12 })).toBe(1);
  });
  it("items without a difficulty count as medium", () => {
    expect(diffOf({})).toBe(2);
    expect(diffOf({ difficulty: 7 })).toBe(2);
  });
});

describe("rounds", () => {
  it("always run easy to hard", () => {
    for (const tier of [1, 2, 3] as const) {
      const r = buildRound(bank, tier, 12, seeded(tier));
      expect(r).toHaveLength(12);
      for (let i = 1; i < r.length; i++) expect(diffOf(r[i])).toBeGreaterThanOrEqual(diffOf(r[i - 1]));
      expect(new Set(r.map((x) => x.id)).size).toBe(12);
    }
  });
  it("lean easy at tier 1 and hard at tier 3, but keep a mix", () => {
    const hard = (t: 1 | 3) => buildRound(bank, t, 10, seeded(5)).filter((x) => x.difficulty === 3).length;
    expect(hard(1)).toBeLessThan(hard(3));
    expect(hard(1)).toBeGreaterThan(0);
    expect(buildRound(bank, 3, 10, seeded(5)).some((x) => x.difficulty === 1)).toBe(true);
  });
  it("fills from neighbouring bands when a band is short, and handles small banks", () => {
    const onlyEasy = Array.from({ length: 8 }, (_, i) => ({ id: `e${i}`, difficulty: 1 }));
    expect(buildRound(onlyEasy, 3, 6, seeded(1))).toHaveLength(6);
    expect(buildRound(bank.slice(0, 3), 2, 12, seeded(1))).toHaveLength(3);
    expect(buildRound([], 1, 12, seeded(1))).toEqual([]);
  });
});
