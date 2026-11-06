import { describe, expect, it } from "vitest";
import { diagnosisById } from "../diagnoses";
import { hash32, permutation } from "../rng";
import { BOARDS } from "./boards";
import { check, cleanPicks, cleanPlacement, groupOf, sortScore } from "./engine";

describe("boards", () => {
  it("are well formed", () => {
    expect(BOARDS.length).toBeGreaterThanOrEqual(10);
    expect(new Set(BOARDS.map((b) => b.id)).size).toBe(BOARDS.length);
    const allTileIds = new Set<string>();
    for (const b of BOARDS) {
      expect(b.groups).toHaveLength(4);
      const dxs = new Set(b.groups.map((g) => g.dx));
      expect(dxs.size, b.id).toBe(4);
      for (const g of b.groups) {
        expect(diagnosisById(g.dx), `${b.id} ${g.dx}`).toBeTruthy();
        expect(g.items).toHaveLength(4);
        for (const i of g.items) {
          expect(allTileIds.has(i.id)).toBe(false);
          allTileIds.add(i.id);
          expect(i.text.length).toBeLessThan(70);
        }
        if (b.thresholds) expect(b.thresholds, `${b.id} ${g.dx}`).toContain(g.threshold);
        else expect(g.threshold).toBeNull();
      }
      const texts = b.groups.flatMap((g) => g.items.map((i) => i.text.toLowerCase()));
      expect(new Set(texts).size).toBe(16);
    }
    expect(BOARDS.filter((b) => b.thresholds).length).toBeGreaterThanOrEqual(8);
  });
});

describe("check", () => {
  const perm = permutation(hash32("seed"), 16);
  const answers = ["2 weeks", "2 years", "1 week", null];
  const right = perm.map((item) => groupOf(item));

  it("is a permutation", () => {
    expect([...perm].sort((a, b) => a - b)).toEqual(Array.from({ length: 16 }, (_, i) => i));
  });

  it("all right solves basic", () => {
    const c = check(perm, right, "basic", answers, [null, null, null, null]);
    expect(c.solved).toBe(true);
    expect(c.oneAway).toEqual([]);
  });

  it("one swap leaves two groups one away", () => {
    const p = [...right];
    const a = p.findIndex((g) => g === 0);
    const b = p.findIndex((g) => g === 1);
    [p[a], p[b]] = [p[b], p[a]];
    const c = check(perm, p, "basic", answers, [null, null, null, null]);
    expect(c.solved).toBe(false);
    expect(c.groupsDone).toEqual([false, false, true, true]);
    expect(c.oneAway).toEqual([0, 1]);
  });

  it("advanced needs the thresholds too (null answer = no threshold)", () => {
    const wrong = check(perm, right, "advanced", answers, ["2 weeks", "2 weeks", "1 week", null]);
    expect(wrong.groupsDone).toEqual([true, false, true, true]);
    expect(wrong.thresholds).toEqual([true, false, true, null]);
    expect(check(perm, right, "advanced", answers, ["2 weeks", "2 years", "1 week", null]).solved).toBe(true);
  });

  it("cleans input", () => {
    expect(cleanPlacement([0, 5, "x", 3.5, 2])).toEqual([0, null, null, null, 2, ...Array(11).fill(null)]);
    expect(cleanPicks(["a", 3])).toEqual(["a", null, null, null]);
  });

  it("scores", () => {
    expect(sortScore(1, { solved: true, groupsDone: [true, true, true, true] }, "basic")).toBe(100);
    expect(sortScore(3, { solved: true, groupsDone: [true, true, true, true] }, "basic")).toBe(60);
    expect(sortScore(4, { solved: false, groupsDone: [true, false, true, false] }, "basic")).toBe(20);
    expect(sortScore(1, { solved: true, groupsDone: [true, true, true, true] }, "advanced")).toBe(150);
  });
});
