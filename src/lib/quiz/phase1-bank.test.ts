import { describe, expect, it } from "vitest";
import { PHASE1_QUIZ_ITEMS } from "./phase1-bank";
import { QUIZ_BANK } from "./quiz-bank";

describe("phase 1 quiz bank", () => {
  it("every item has hook, options, rationale, source; answer in range", () => {
    for (const it of PHASE1_QUIZ_ITEMS) {
      expect(it.prompt.length).toBeGreaterThan(20);
      expect(it.options.length).toBeGreaterThanOrEqual(3);
      expect(it.correct).toBeGreaterThanOrEqual(0);
      expect(it.correct).toBeLessThan(it.options.length);
      expect(it.rationale.length).toBeGreaterThan(15);
      expect(it.source.length).toBeGreaterThan(5);
    }
  });

  it("covers all 5 new types + the restraint set", () => {
    const types = new Set(PHASE1_QUIZ_ITEMS.map((i) => i.type));
    expect(types).toEqual(new Set(["decode_idiom", "whats_missing", "predict_consequence", "confidence_mcq", "unpopular_right", "best_response"]));
    const restraint = PHASE1_QUIZ_ITEMS.filter((i) => i.id.startsWith("p1-restraint"));
    expect(restraint.length).toBeGreaterThanOrEqual(6);
  });

  it("ids are unique across the whole bank (PHASE1 is pushed into QUIZ_BANK)", () => {
    const ids = QUIZ_BANK.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    // And the phase-1 items are all present in the aggregate.
    for (const it of PHASE1_QUIZ_ITEMS) {
      expect(ids).toContain(it.id);
    }
  });
});
