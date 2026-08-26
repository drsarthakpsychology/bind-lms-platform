import { describe, expect, it } from "vitest";
import { hashSeed, identityOrder, mulberry32, seededShuffle } from "./shuffle";

describe("mulberry32", () => {
  it("is deterministic for a seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("produces values in [0,1)", () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("seededShuffle", () => {
  it("is a permutation (no loss, no dupes)", () => {
    const out = seededShuffle([0, 1, 2, 3, 4, 5, 6, 7], 123);
    expect([...out].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("is stable for the same seed", () => {
    expect(seededShuffle([0, 1, 2, 3], 99)).toEqual(seededShuffle([0, 1, 2, 3], 99));
  });

  it("differs across seeds (not all identical)", () => {
    const a = seededShuffle([0, 1, 2, 3, 4, 5], 1);
    const b = seededShuffle([0, 1, 2, 3, 4, 5], 2);
    expect(a).not.toEqual(b);
  });

  it("distributes the first element uniformly over many seeds", () => {
    // Over 400 seeds, index 0 should land in every position a healthy number
    // of times (a positional tell would keep it near 0).
    const counts = [0, 0, 0, 0];
    for (let seed = 1; seed <= 400; seed++) {
      const order = seededShuffle([0, 1, 2, 3], seed);
      counts[order.indexOf(0)]++;
    }
    for (const c of counts) {
      expect(c).toBeGreaterThan(60); // ~25% each; 60 is a very loose floor
    }
  });
});

describe("hashSeed", () => {
  it("is deterministic and spreads", () => {
    expect(hashSeed("abc")).toBe(hashSeed("abc"));
    expect(hashSeed("abc")).not.toBe(hashSeed("abd"));
  });
});

describe("identityOrder", () => {
  it("returns 0..n-1", () => {
    expect(identityOrder(4)).toEqual([0, 1, 2, 3]);
  });
});
