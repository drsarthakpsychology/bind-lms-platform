import { describe, expect, it } from "vitest";
import { diagnosisById, normaliseName } from "../diagnoses";
import { CASES } from "./cases";
import { apply, start } from "./engine";
import { OPENING_IDS } from "./openings";
import { buildView, guideOf } from "./view";

const DASH = /[\u2013\u2014]/;

describe("every daily case opens with a fair, free starting picture", () => {
  it("each written case has an opening and three hints", () => {
    for (const c of CASES) {
      expect(c.opening, c.id).toBeTruthy();
      expect(c.guide, c.id).toHaveLength(3);
    }
    expect(new Set(OPENING_IDS)).toEqual(new Set(CASES.map((c) => c.id)));
  });

  it("the opening has who, their words, how long and 2 or 3 observations", () => {
    for (const c of CASES) {
      const o = c.opening!;
      expect(o.who.length, c.id).toBeGreaterThan(3);
      expect(o.says.length, c.id).toBeGreaterThan(8);
      expect(o.since.length, c.id).toBeGreaterThan(2);
      expect(o.seen.length, c.id).toBeGreaterThanOrEqual(2);
      expect(o.seen.length, c.id).toBeLessThanOrEqual(3);
    }
  });

  it("hints 1 and 2 never name the answer; hint 3 names at least two choices", () => {
    for (const c of CASES) {
      const dx = diagnosisById(c.answer)!;
      const names = [dx.name, ...dx.aka].map(normaliseName).filter((n) => n.length > 4);
      for (const h of c.guide!.slice(0, 2)) {
        const t = normaliseName(h);
        for (const n of names) expect(t.includes(n), `${c.id}: "${h}" names ${n}`).toBe(false);
      }
      expect((c.guide![2].match(/,| and | or /g) ?? []).length, c.id).toBeGreaterThanOrEqual(1);
    }
  });

  it("the opening never names the answer", () => {
    for (const c of CASES) {
      const dx = diagnosisById(c.answer)!;
      const o = c.opening!;
      const text = normaliseName([o.who, o.says, o.since, ...o.seen].join(" "));
      expect(text.includes(normaliseName(dx.name)), c.id).toBe(false);
    }
  });

  it("no dashes in student text", () => {
    for (const c of CASES) {
      const o = c.opening!;
      for (const t of [o.who, o.says, o.since, ...o.seen, ...c.guide!]) expect(DASH.test(t), `${c.id}: ${t}`).toBe(false);
    }
  });
});

describe("the case view", () => {
  const c = CASES[0];

  it("shows the opening from the start and no hint until one is asked for", () => {
    const v = buildView(c, start(), "daily", false);
    expect(v.opening).toEqual(c.opening);
    expect(v.hints.steps).toEqual([]);
    expect(v.hints.next).toEqual({ n: 1, points: 0, usesHint: false });
  });

  it("opens the hints in order with their costs", () => {
    let p = apply(c, start(), { t: "hint" });
    let v = buildView(c, p, "daily", false);
    expect(v.hints.steps).toEqual([c.guide![0]]);
    expect(v.hints.next).toEqual({ n: 2, points: 5, usesHint: true });
    p = apply(c, apply(c, p, { t: "hint" }), { t: "hint" });
    v = buildView(c, p, "daily", false);
    expect(v.hints.steps).toEqual(c.guide);
    expect(v.hints.next).toBeNull();
    // Older phones read `pointer`.
    expect(v.hints.pointer).toContain(c.guide![2]);
  });

  it("shows every hint once the case is over", () => {
    const p = apply(c, start(), { t: "giveup" });
    expect(buildView(c, p, "daily", false).hints.steps).toEqual(c.guide);
  });

  it("builds three hints for a case written without them (AI cases)", () => {
    const bare = { ...c, guide: undefined, opening: undefined };
    const g = guideOf(bare);
    expect(g).toHaveLength(3);
    expect(g[1]).toBe(c.pointer);
    expect(buildView(bare, start(), "practice", false).opening).toBeNull();
  });
});
