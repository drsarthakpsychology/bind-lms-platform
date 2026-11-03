import { describe, expect, it } from "vitest";
import { seeded } from "./scoring";
import {
  attributionSummary,
  COND_PARAMS,
  condResponse,
  condStart,
  condStep,
  correlatedPoints,
  countRight,
  designComplete,
  designScore,
  EMPTY_DESIGN,
  flukePoints,
  generalise,
  normal,
  openThreats,
  partialR,
  pearson,
  rescorlaWagner,
  restrictedRangePoints,
  rOf,
  runConditioning,
  rWords,
  thirdVariablePoints,
  THREATS,
  type CondState,
  type CondTrial,
  type DesignChoices,
} from "./scoring2";
import { EXPERIMENTS, experimentById } from "./experiments";
import { ATTRIBUTION_CASES, CONS_ITEMS, CONS_REASONS, CONS_STAGES, CONS_TASK_TEXT, CORR_READINGS, CORR_SCENARIOS, EXPERIMENTS_2 } from "./experiments2";

const times = <T,>(n: number, x: T): T[] => Array.from({ length: n }, () => x);

describe("Rescorla–Wagner conditioning model", () => {
  it("moves strength a fixed fraction of the way to the target", () => {
    expect(rescorlaWagner(0, 1, 0.3)).toBeCloseTo(0.3);
    expect(rescorlaWagner(0.5, 1, 0.3)).toBeCloseTo(0.65);
    expect(rescorlaWagner(0.8, 0, 0.25)).toBeCloseTo(0.6);
  });

  it("acquisition rises, levels off, and gains shrink each trial", () => {
    const { states } = runConditioning(times(12, "pair"));
    const v = states.map(condResponse);
    for (let i = 1; i < v.length; i++) {
      expect(v[i]).toBeGreaterThan(v[i - 1]);
      if (i > 1) expect(v[i] - v[i - 1]).toBeLessThan(v[i - 1] - v[i - 2]);
    }
    expect(v[v.length - 1]).toBeGreaterThan(0.95);
    expect(v[v.length - 1]).toBeLessThanOrEqual(1);
  });

  it("extinction lowers the response but keeps the original learning", () => {
    let s: CondState = condStart();
    for (let i = 0; i < 10; i++) s = condStep(s, "pair");
    const peak = condResponse(s);
    for (let i = 0; i < 10; i++) s = condStep(s, "tone");
    expect(condResponse(s)).toBeLessThan(0.1);
    expect(s.excite).toBeCloseTo(peak, 5);
  });

  it("a rest brings partial spontaneous recovery", () => {
    let s: CondState = condStart();
    for (let i = 0; i < 10; i++) s = condStep(s, "pair");
    const peak = condResponse(s);
    for (let i = 0; i < 10; i++) s = condStep(s, "tone");
    const low = condResponse(s);
    s = condStep(s, "rest");
    const back = condResponse(s);
    expect(back).toBeGreaterThan(low + 0.2);
    expect(back).toBeLessThan(peak);
  });

  it("relearning after extinction is faster than first learning (savings)", () => {
    let s: CondState = condStart();
    const first = condResponse(condStep(s, "pair"));
    for (let i = 0; i < 10; i++) s = condStep(s, "pair");
    for (let i = 0; i < 12; i++) s = condStep(s, "tone");
    const before = condResponse(s);
    const after = condResponse(condStep(s, "pair"));
    expect(after - before).toBeGreaterThan(first);
  });

  it("records the response before learning on each trial", () => {
    const trials: CondTrial[] = ["pair", "pair", "tone"];
    const { responses } = runConditioning(trials);
    expect(responses[0]).toBe(0);
    expect(responses[1]).toBeCloseTo(COND_PARAMS.pair);
  });

  it("generalisation shrinks with distance from the trained tone", () => {
    expect(generalise(0.9, 0)).toBeCloseTo(0.9);
    expect(generalise(0.9, 1)).toBeLessThan(0.9);
    expect(generalise(0.9, 3)).toBeLessThan(generalise(0.9, 1));
    expect(generalise(0.9, 3)).toBeLessThan(0.1);
  });
});

describe("design the study", () => {
  const best: DesignChoices = { sample: "random", size: "large", control: "active", assign: "random", blind: "masked", measure: "prepost" };

  it("an empty design has every threat open", () => {
    expect(openThreats(EMPTY_DESIGN).size).toBe(THREATS.length);
    expect(designComplete(EMPTY_DESIGN)).toBe(false);
  });

  it("the strongest design closes every threat", () => {
    expect(designScore(best)).toEqual({ closed: 8, of: 8, percent: 100 });
    expect(designComplete(best)).toBe(true);
  });

  it("an extreme sample is fine only when randomised against a control", () => {
    expect(openThreats({ ...best, sample: "extreme" }).has("regression")).toBe(false);
    expect(openThreats({ ...best, sample: "extreme", assign: "choose" }).has("regression")).toBe(true);
    expect(openThreats({ ...best, sample: "extreme", control: "none", assign: null }).has("regression")).toBe(true);
  });

  it("a waiting list controls for time but not for placebo", () => {
    const o = openThreats({ ...best, control: "waitlist" });
    expect(o.has("time")).toBe(false);
    expect(o.has("placebo")).toBe(true);
  });

  it("no comparison group leaves time and confounds open, and needs no assignment choice", () => {
    const c: DesignChoices = { ...best, control: "none", assign: null };
    const o = openThreats(c);
    expect(o.has("time")).toBe(true);
    expect(o.has("confound")).toBe(true);
    expect(designComplete(c)).toBe(true);
  });

  it("a leading question reopens demand even when masked", () => {
    expect(openThreats({ ...best, measure: "ask" }).has("demand")).toBe(true);
    expect(openThreats({ ...best, measure: "ask" }).has("measure")).toBe(true);
  });

  it("threat ids are unique", () => {
    expect(new Set(THREATS.map((t) => t.id)).size).toBe(THREATS.length);
  });
});

describe("correlation helpers", () => {
  it("pearson r is exact on simple data", () => {
    expect(pearson([1, 2, 3, 4], [2, 4, 6, 8])).toBeCloseTo(1);
    expect(pearson([1, 2, 3, 4], [8, 6, 4, 2])).toBeCloseTo(-1);
    expect(pearson([1, 2, 3], [5, 5, 5])).toBe(0);
    expect(pearson([1, 2, 3, 4, 5], [2, 1, 4, 3, 5])).toBeCloseTo(0.8);
  });

  it("normal draws have mean near 0 and sd near 1", () => {
    const r = seeded(9);
    const xs = Array.from({ length: 4000 }, () => normal(r));
    const m = xs.reduce((a, b) => a + b, 0) / xs.length;
    const sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
    expect(Math.abs(m)).toBeLessThan(0.06);
    expect(Math.abs(sd - 1)).toBeLessThan(0.06);
  });

  it("generated data hit the target r with a large sample, and repeat with the same seed", () => {
    const pts = correlatedPoints(3000, 0.6, seeded(4));
    expect(rOf(pts)).toBeCloseTo(0.6, 1);
    expect(correlatedPoints(5, 0.3, seeded(7))).toEqual(correlatedPoints(5, 0.3, seeded(7)));
  });

  it("third-variable data correlate, but not once z is held constant", () => {
    const pts = thirdVariablePoints(400, seeded(5));
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const zs = pts.map((p) => p.z ?? 0);
    expect(pearson(xs, ys)).toBeGreaterThan(0.5);
    expect(Math.abs(partialR(xs, ys, zs))).toBeLessThan(0.15);
  });

  it("restricting the range shrinks a real correlation", () => {
    const pts = restrictedRangePoints(1000, 0.6, 0.2, seeded(6));
    const full = pearson(
      pts.map((p) => p.x),
      pts.map((p) => p.y),
    );
    const kept = pts.filter((p) => !p.hidden);
    expect(kept.length).toBe(200);
    expect(rOf(pts)).toBeLessThan(full - 0.2);
  });

  it("a fluke sample from a no-link population can look striking", () => {
    const pts = flukePoints(6, 0.7, seeded(8));
    expect(pts).toHaveLength(6);
    expect(rOf(pts)).toBeGreaterThanOrEqual(0.7);
  });

  it("describes the size of r in words", () => {
    expect(rWords(0.05)).toBe("almost none");
    expect(rWords(-0.2)).toBe("weak");
    expect(rWords(0.4)).toBe("moderate");
    expect(rWords(-0.8)).toBe("strong");
  });
});

describe("attribution and shared helpers", () => {
  it("lean is distance above the midpoint; shift is the move after the reveal", () => {
    expect(attributionSummary([])).toEqual({ before: 50, after: 50, lean: 0, shift: 0 });
    expect(
      attributionSummary([
        { before: 80, after: 30 },
        { before: 60, after: 40 },
      ]),
    ).toEqual({ before: 70, after: 35, lean: 20, shift: 35 });
  });
  it("counts right answers and ignores blanks", () => {
    expect(countRight(["a", null, "c"], ["a", "b", "x"])).toBe(1);
  });
});

describe("batch 2 catalogue", () => {
  it("is numbered 8 to 12 and resolvable", () => {
    expect(EXPERIMENTS_2.map((e) => e.num)).toEqual([8, 9, 10, 11, 12]);
    for (const e of EXPERIMENTS_2) {
      expect(experimentById(e.id)).toBe(e);
      expect(e.bookRefs).toEqual([]);
      expect(e.review.length).toBeGreaterThan(0);
      expect(e.steps.length).toBeLessThanOrEqual(3);
    }
    expect(EXPERIMENTS).toHaveLength(12);
  });
  it("content keys are valid", () => {
    for (const c of CONS_ITEMS) {
      expect(CONS_STAGES).toContain(c.stage);
      expect(CONS_REASONS).toContain(c.reason);
      expect(CONS_TASK_TEXT[c.task]).toBeDefined();
      // Pre-operational answers in this set are all centration; concrete ones never are.
      expect(c.stage === "Pre-operational").toBe(c.reason === "Centration");
    }
    for (const s of CORR_SCENARIOS) {
      expect(CORR_READINGS).toContain(s.answer);
      if (s.kind === "third") expect(s.z).toBeTruthy();
    }
    expect(new Set(ATTRIBUTION_CASES.map((a) => a.id)).size).toBe(ATTRIBUTION_CASES.length);
  });
});
