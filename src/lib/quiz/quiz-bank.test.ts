import { describe, expect, it } from "vitest";
import { QUIZ_BANK } from "./quiz-bank";
import { scoreQuiz } from "./quiz";

describe("quiz bank (brief §11.3 content volume)", () => {
  it("has at least 20 sourced items", () => {
    expect(QUIZ_BANK.length).toBeGreaterThanOrEqual(65);
  });

  it("every item carries a source citation and a rationale", () => {
    for (const q of QUIZ_BANK) {
      expect(q.source.length).toBeGreaterThan(5);
      expect(q.rationale.length).toBeGreaterThan(15);
    }
  });

  it("covers all five item types (best-response, spot-the-error, standard-vs-common, order-steps, would-you-report)", () => {
    const types = new Set(QUIZ_BANK.map((q) => q.type));
    expect(types.has("best_response")).toBe(true);
    expect(types.has("spot_the_error")).toBe(true);
    expect(types.has("standard_vs_common")).toBe(true);
    expect(types.has("order_steps")).toBe(true);
    expect(types.has("would_you_report")).toBe(true);
  });

  it("every item has 3-4 options with a valid correct index", () => {
    for (const q of QUIZ_BANK) {
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length);
    }
  });

  it("scoreQuiz works against the bank", () => {
    const answers: Record<string, number> = {};
    for (const q of QUIZ_BANK) answers[q.id] = q.correct;
    const r = scoreQuiz(QUIZ_BANK, answers);
    expect(r.correct).toBe(QUIZ_BANK.length);
  });
});