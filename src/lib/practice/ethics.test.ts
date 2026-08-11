import { describe, expect, it } from "vitest";
import { ETHICS_DILEMMAS, todaysDilemmas } from "./ethics";

describe("ethics & law dilemmas", () => {
  it("has 30 dilemmas (v5 §4 target) and every dilemma has exactly one correct option", () => {
    expect(ETHICS_DILEMMAS.length).toBeGreaterThanOrEqual(30);
    for (const d of ETHICS_DILEMMAS) {
      const correct = d.options.filter((o) => o.correct);
      expect(correct.length).toBe(1);
      expect(d.options.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("every option has a consequence and every dilemma has a law citation", () => {
    for (const d of ETHICS_DILEMMAS) {
      expect(d.law.length).toBeGreaterThan(10);
      for (const o of d.options) {
        expect(o.consequence.length).toBeGreaterThan(20);
        expect(o.label.length).toBeGreaterThan(10);
      }
    }
  });

  it("the 'right call' option is not always the first one (no answer-position bias)", () => {
    const positions = ETHICS_DILEMMAS.map((d) => d.options.findIndex((o) => o.correct));
    expect(new Set(positions).size).toBeGreaterThan(1);
  });

  it("todaysDilemmas returns a deterministic, stable daily set", () => {
    const daySeed = 1_752_000_000_000;
    const a = todaysDilemmas(daySeed, 3);
    const b = todaysDilemmas(daySeed, 3);
    expect(a.map((d) => d.id)).toEqual(b.map((d) => d.id));
    expect(a.length).toBe(3);
  });

  it("dilemmas cover the grounding domains (MHA 2017, POCSO, RCI, confidentiality)", () => {
    const tags = new Set(ETHICS_DILEMMAS.map((d) => d.tag));
    expect(tags.has("MHA 2017")).toBe(true);
    expect(tags.has("POCSO")).toBe(true);
    expect(tags.has("RCI scope")).toBe(true);
    expect(tags.has("Confidentiality")).toBe(true);
  });
});
