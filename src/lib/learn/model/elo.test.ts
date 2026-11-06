import { describe, expect, it } from "vitest";
import { answersToCalibrate, decayedTheta, eloUpdate, estimateTheta, isCalibrated, kFactor, prob } from "./elo";

const NOW = new Date("2026-11-06T10:00:00Z");
const daysAgo = (d: number) => new Date(NOW.getTime() - d * 86_400_000).toISOString();

describe("prob", () => {
  it("is 0.5 when ability equals difficulty and logistic otherwise", () => {
    expect(prob(0, 0)).toBe(0.5);
    expect(prob(1, 0)).toBeCloseTo(1 / (1 + Math.exp(-1)));
    expect(prob(0, 1)).toBeCloseTo(1 - prob(1, 0));
  });
});

describe("kFactor", () => {
  it("starts at 0.4 and shrinks with n", () => {
    expect(kFactor(0)).toBe(0.4);
    expect(kFactor(20)).toBeCloseTo(0.2);
    expect(kFactor(100)).toBeLessThan(kFactor(20));
  });
});

describe("eloUpdate", () => {
  it("moves learner up and item down on a right answer", () => {
    const r = eloUpdate({ theta: 0, n: 0 }, { b: 0, n: 0 }, 1);
    expect(r.p).toBe(0.5);
    expect(r.student.theta).toBeCloseTo(0.45);
    expect(r.item.b).toBeCloseTo(-0.2);
    expect(r.student.n).toBe(1);
    expect(r.item.n).toBe(1);
  });
  it("supports partial outcomes", () => {
    const r = eloUpdate({ theta: 0, n: 0 }, { b: 0, n: 0 }, 0.5);
    expect(r.student.theta).toBeCloseTo(0);
    const w = eloUpdate({ theta: 0, n: 0 }, { b: 0, n: 0 }, 0.25);
    expect(w.student.theta).toBeCloseTo(-0.225);
  });
  it("uses each side's own K", () => {
    const r = eloUpdate({ theta: 0, n: 20 }, { b: 0, n: 0 }, 1);
    expect(r.student.theta).toBeCloseTo(0.9 / 2.6 / 2);
    expect(r.item.b).toBeCloseTo(-0.2);
  });
  it("clamps bad outcomes", () => {
    expect(eloUpdate({ theta: 0, n: 0 }, { b: 0, n: 0 }, 7).student.theta).toBeCloseTo(0.45);
  });
  it("a new learner reaches the mastery threshold (P ≥ 0.85 at b = 0) in under 10 right answers", () => {
    let st = { theta: 0, n: 0 };
    let k = 0;
    while (1 / (1 + Math.exp(-st.theta)) < 0.85 && k < 50) {
      st = eloUpdate(st, { b: 0, n: 30 }, 1).student;
      k++;
    }
    expect(k).toBeLessThan(10);
  });
});

describe("decayedTheta", () => {
  it("keeps ability during the grace period", () => {
    expect(decayedTheta(2, daysAgo(2), NOW)).toBe(2);
  });
  it("halves the gain after grace + half-life", () => {
    expect(decayedTheta(2, daysAgo(48), NOW)).toBeCloseTo(1);
  });
  it("never improves a weak skill", () => {
    expect(decayedTheta(-1, daysAgo(200), NOW)).toBe(-1);
  });
  it("handles a missing date", () => {
    expect(decayedTheta(1, null, NOW)).toBe(1);
  });
});

describe("estimateTheta", () => {
  it("stays at the prior with no answers", () => {
    expect(estimateTheta([])).toBe(0);
  });
  it("goes up for right answers and down for wrong ones, symmetrically", () => {
    const up = estimateTheta([{ b: 0, outcome: 1 }, { b: 0, outcome: 1 }]);
    const down = estimateTheta([{ b: 0, outcome: 0 }, { b: 0, outcome: 0 }]);
    expect(up).toBeGreaterThan(0.5);
    expect(down).toBeCloseTo(-up);
    expect(estimateTheta([{ b: 0, outcome: 1 }, { b: 0, outcome: 0 }])).toBeCloseTo(0);
  });
  it("credits right answers on harder questions more", () => {
    expect(estimateTheta([{ b: 1, outcome: 1 }])).toBeGreaterThan(estimateTheta([{ b: -1, outcome: 1 }]));
  });
});

describe("calibration", () => {
  it("hides ratings until 30 graded answers", () => {
    expect(isCalibrated(29)).toBe(false);
    expect(isCalibrated(30)).toBe(true);
    expect(answersToCalibrate(12)).toBe(18);
    expect(answersToCalibrate(40)).toBe(0);
  });
});
