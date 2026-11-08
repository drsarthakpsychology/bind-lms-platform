import { describe, expect, it } from "vitest";
import { citationOrDash, EXAMS, STUDY_MODULES } from "../tags";
import { BLITZ_FACTS, BLITZ_QUESTIONS } from "./questions";

const picks = BLITZ_FACTS.filter((q) => q.kind === "pick");
const tfs = BLITZ_FACTS.filter((q) => q.kind === "tf");

/** True when the right option is strictly the longest of the four. */
export function rightIsLongest(q: { options: string[]; answer: number }): boolean {
  const len = q.options.map((o) => o.length);
  return len.every((l, i) => i === q.answer || l < len[q.answer]);
}

describe("blitz fast-fact library", () => {
  it("has at least 500 questions in the bank, 340+ of them hand-written facts", () => {
    expect(BLITZ_QUESTIONS.length).toBeGreaterThanOrEqual(500);
    expect(BLITZ_FACTS.length).toBeGreaterThanOrEqual(340);
    expect(new Set(BLITZ_QUESTIONS.map((q) => q.id)).size).toBe(BLITZ_QUESTIONS.length);
    for (const q of BLITZ_FACTS) expect(q.id).toMatch(/^f:\d{3}$/);
  });

  it("every fact carries its tags", () => {
    for (const q of BLITZ_FACTS) {
      expect(q.topic && q.topic.length > 1, q.id).toBe(true);
      expect([1, 2, 3, 4, 5], q.id).toContain(q.level);
      expect(q.objective && q.objective.length > 10, q.id).toBe(true);
      expect(q.exams && q.exams.length > 0 && q.exams.every((e) => EXAMS.includes(e)), q.id).toBe(true);
      expect(STUDY_MODULES as readonly string[], q.id).toContain(q.module);
      expect(q.learn.length, q.id).toBeGreaterThan(1);
    }
  });

  it("is short, unambiguous and clean", () => {
    for (const q of BLITZ_FACTS) {
      expect(q.prompt.length, q.id).toBeLessThanOrEqual(160);
      for (const o of q.options) expect(o.length, `${q.id} ${o}`).toBeLessThanOrEqual(80);
      expect(new Set(q.options.map((o) => o.toLowerCase())).size, q.id).toBe(q.options.length);
      expect(q.why.length, q.id).toBeGreaterThan(30);
      expect(citationOrDash([q.prompt, ...q.options, q.why, q.learn, q.objective ?? ""].join(" ")), q.id).toBe(false);
    }
  });

  it("spreads levels, answer positions and true/false", () => {
    for (const lv of [1, 2, 3, 4, 5]) expect(BLITZ_FACTS.filter((q) => q.level === lv).length, `level ${lv}`).toBeGreaterThanOrEqual(20);
    for (const pos of [0, 1, 2, 3]) {
      const share = picks.filter((q) => q.answer === pos).length / picks.length;
      expect(share, `position ${pos}`).toBeGreaterThan(0.15);
      expect(share, `position ${pos}`).toBeLessThan(0.4);
    }
    const trueShare = tfs.filter((q) => q.answer === 0).length / tfs.length;
    expect(trueShare).toBeGreaterThan(0.35);
    expect(trueShare).toBeLessThan(0.75);
  });

  it("the right option is not the longest more than about a third of the time", () => {
    expect(picks.filter(rightIsLongest).length / picks.length).toBeLessThanOrEqual(0.34);
  });
});
