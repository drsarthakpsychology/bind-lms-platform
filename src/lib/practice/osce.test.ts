import { describe, expect, it } from "vitest";
import { SEED_OSCE_STATIONS, scoreOsce, seededRotate } from "./osce";

describe("OSCE stations", () => {
  it("has more than one station (randomisation is meaningful)", () => {
    expect(SEED_OSCE_STATIONS.length).toBeGreaterThan(1);
  });

  it("seededRotate keeps all items and changes the start", () => {
    const ids = SEED_OSCE_STATIONS.map((s) => s.id);
    for (const seed of [0, 0.1, 0.5, 0.9, 1]) {
      const rotated = seededRotate(ids, seed);
      expect(rotated.length).toBe(ids.length);
      expect([...rotated].sort()).toEqual([...ids].sort());
    }
    // Different seeds give different rotations (not all identical).
    const starts = new Set([0, 0.25, 0.5, 0.75].map((s) => seededRotate(ids, s)[0]));
    expect(starts.size).toBeGreaterThan(1);
  });

  it("seededRotate is deterministic for the same seed", () => {
    const ids = SEED_OSCE_STATIONS.map((s) => s.id);
    expect(seededRotate(ids, 0.37)).toEqual(seededRotate(ids, 0.37));
  });

  it("scoreOsce returns the fraction of checked items", () => {
    const checked = SEED_OSCE_STATIONS[0].checklist.map((c, i) => ({ item: c.item, done: i < 3 }));
    expect(scoreOsce(checked)).toBeCloseTo(3 / SEED_OSCE_STATIONS[0].checklist.length);
  });
});
