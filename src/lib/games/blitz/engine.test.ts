import { describe, expect, it } from "vitest";
import { BLITZ_MS, blitzXp, emptyRun, GRACE_MS, MIN_ANSWER_MS, multiplier, plausible, step, timing } from "./engine";
import { BLITZ_QUESTIONS, promptOf, questionAt } from "./questions";

describe("blitz scoring", () => {
  it("multiplier steps at 3, 6 and 10 in a row", () => {
    expect([0, 2, 3, 5, 6, 9, 10, 25].map(multiplier)).toEqual([1, 1, 2, 2, 3, 3, 4, 4]);
  });

  it("right answers build the combo and score; a wrong one resets the combo only", () => {
    let s = emptyRun();
    const gains: number[] = [];
    const ups: boolean[] = [];
    for (let i = 0; i < 6; i++) {
      const r = step(s, true);
      gains.push(r.gained);
      ups.push(r.levelUp);
      s = r.state;
    }
    expect(gains).toEqual([10, 10, 20, 20, 20, 30]);
    expect(ups).toEqual([false, false, true, false, false, true]);
    const w = step(s, false);
    expect(w.state).toMatchObject({ answered: 7, correct: 6, score: 110, combo: 0, best: 6 });
    expect(w.gained).toBe(0);
  });

  it("refuses answers after the clock and answers that come too fast", () => {
    expect(timing(0, 0, 1000)).toEqual({ ok: true });
    expect(timing(0, 900, 900 + MIN_ANSWER_MS - 1)).toEqual({ ok: false, reason: "fast" });
    expect(timing(0, 0, BLITZ_MS + GRACE_MS)).toEqual({ ok: true });
    expect(timing(0, 0, BLITZ_MS + GRACE_MS + 1)).toEqual({ ok: false, reason: "over" });
  });

  it("XP: nothing for no right answers, capped at 40", () => {
    expect(blitzXp({ correct: 0, score: 0 })).toBe(0);
    expect(blitzXp({ correct: 12, score: 240 })).toBe(14);
    expect(blitzXp({ correct: 200, score: 7000 })).toBe(40);
  });

  it("plausible() rejects impossible runs", () => {
    expect(plausible({ answered: 10, correct: 8, score: 150, combo: 3, best: 5 })).toBe(true);
    expect(plausible({ answered: 5, correct: 8, score: 80, combo: 0, best: 3 })).toBe(false);
    expect(plausible({ answered: 10, correct: 2, score: 900, combo: 0, best: 2 })).toBe(false);
    expect(plausible({ answered: 10_000, correct: 1, score: 10, combo: 0, best: 1 })).toBe(false);
  });
});

describe("blitz questions", () => {
  it("has a big bank of short, well-formed questions", () => {
    expect(BLITZ_QUESTIONS.length).toBeGreaterThan(120);
    const ids = new Set<string>();
    for (const q of BLITZ_QUESTIONS) {
      expect(ids.has(q.id), q.id).toBe(false);
      ids.add(q.id);
      expect(q.options.length, q.id).toBe(q.kind === "tf" ? 2 : 4);
      expect(new Set(q.options).size, q.id).toBe(q.options.length);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
      expect(q.why.length, q.id).toBeGreaterThan(5);
      expect(q.learn.length, q.id).toBeGreaterThan(1);
    }
  });

  it("the same seed gives the same questions; shuffling keeps the right answer", () => {
    for (let n = 0; n < 40; n++) {
      const a = questionAt(1234, n);
      const b = questionAt(1234, n);
      expect(a).toEqual(b);
      const base = BLITZ_QUESTIONS.find((x) => x.id === a.id)!;
      expect(a.options[a.answer]).toBe(base.options[base.answer]);
    }
    expect(questionAt(1, 0).id === questionAt(2, 0).id && questionAt(1, 1).id === questionAt(2, 1).id).toBe(false);
  });

  it("the browser's copy has no answer or explanation", () => {
    const p = promptOf(questionAt(9, 3), 3) as Record<string, unknown>;
    expect(Object.keys(p).sort()).toEqual(["kind", "n", "options", "prompt"]);
  });

  it("no em or en dashes in anything a student reads", () => {
    for (const q of BLITZ_QUESTIONS) expect(/[\u2013\u2014]/.test([q.prompt, ...q.options, q.why, q.learn].join(" ")), q.id).toBe(false);
  });
});
