import { describe, expect, it } from "vitest";
import { ASRS, GAD7, INSTRUMENTS, MINI_IPIP, PHQ9, RSES, WHO5, itemScore, scoreInstrument } from "./tests";

describe("free self-check instruments", () => {
  it("has the published number of items and options", () => {
    expect(PHQ9.items).toHaveLength(9);
    expect(GAD7.items).toHaveLength(7);
    expect(WHO5.items).toHaveLength(5);
    expect(RSES.items).toHaveLength(10);
    expect(ASRS.items).toHaveLength(6);
    expect(MINI_IPIP.items).toHaveLength(20);
    expect(PHQ9.options.map((o) => o.value)).toEqual([0, 1, 2, 3]);
    expect(WHO5.options.map((o) => o.value)).toEqual([5, 4, 3, 2, 1, 0]);
  });

  it("bands cover every possible score with no gaps", () => {
    for (const inst of INSTRUMENTS) {
      if (!inst.bands) continue;
      const max = inst.maxScore ?? 0;
      for (let s = 0; s <= max; s++) {
        expect(inst.bands.filter((b) => s >= b.min && s <= b.max)).toHaveLength(1);
      }
    }
  });

  it("scores PHQ-9 with the standard cut-offs and flags item 9", () => {
    const r = scoreInstrument(PHQ9, [1, 1, 1, 1, 1, 1, 1, 1, 1]);
    expect(r.kind === "total" && r.score).toBe(9);
    expect(r.kind === "total" && r.band.label).toBe("Mild");
    expect(r.flags).toContain("self-harm");
    const none = scoreInstrument(PHQ9, [3, 3, 2, 2, 0, 0, 0, 0, 0]);
    expect(none.kind === "total" && none.band.label).toBe("Moderate");
    expect(none.flags).toHaveLength(0);
    const top = scoreInstrument(PHQ9, Array(9).fill(3));
    expect(top.kind === "total" && top.band.label).toBe("Severe");
  });

  it("scores GAD-7 (10 = moderate)", () => {
    const r = scoreInstrument(GAD7, [2, 2, 2, 1, 1, 1, 1]);
    expect(r.kind === "total" && r.score).toBe(10);
    expect(r.kind === "total" && r.band.label).toBe("Moderate");
  });

  it("scores WHO-5 as a 0–100 percentage", () => {
    const r = scoreInstrument(WHO5, [3, 3, 2, 2, 3]);
    expect(r.kind === "who5" && r.raw).toBe(13);
    expect(r.kind === "who5" && r.score).toBe(52);
    expect(r.kind === "who5" && r.band.label).toBe("Good");
    const low = scoreInstrument(WHO5, [1, 1, 1, 1, 3]);
    expect(low.kind === "who5" && low.score).toBe(28);
    expect(low.kind === "who5" && low.band.label).toBe("Low wellbeing");
  });

  it("reverse-scores the negative Rosenberg items", () => {
    // "Strongly agree" (3) to "At times I think I am no good at all" scores 0.
    expect(itemScore(RSES, 1, 3)).toBe(0);
    expect(itemScore(RSES, 0, 3)).toBe(3);
    const allStronglyAgree = scoreInstrument(RSES, Array(10).fill(3));
    expect(allStronglyAgree.kind === "total" && allStronglyAgree.score).toBe(15);
  });

  it("uses the ASRS Part A thresholds (items 1–3 from Sometimes, 4–6 from Often)", () => {
    const sometimes = scoreInstrument(ASRS, [2, 2, 2, 2, 2, 2]);
    expect(sometimes.kind === "asrs" && sometimes.positives).toBe(3);
    expect(sometimes.kind === "asrs" && sometimes.positive).toBe(false);
    const often = scoreInstrument(ASRS, [2, 2, 2, 3, 0, 0]);
    expect(often.kind === "asrs" && often.positive).toBe(true);
  });

  it("scores each Big Five trait from 4 to 20", () => {
    const neutral = scoreInstrument(MINI_IPIP, Array(20).fill(3));
    expect(neutral.kind === "bigfive" && neutral.traits.every((t) => t.score === 12 && t.level === "middle")).toBe(true);
    // Agree with every item: reverse-keyed items cancel out each trait.
    const agree = scoreInstrument(MINI_IPIP, Array(20).fill(5));
    expect(agree.kind === "bigfive" && agree.traits.find((t) => t.key === "O")?.score).toBe(8);
    expect(agree.kind === "bigfive" && agree.traits.find((t) => t.key === "E")?.score).toBe(12);
  });

  it("refuses an incomplete set of answers", () => {
    expect(() => scoreInstrument(GAD7, [1, 1])).toThrow();
  });
});
