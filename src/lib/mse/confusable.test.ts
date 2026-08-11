import { describe, expect, it } from "vitest";
import { CONFUSABLE_PAIRS, MULTI_TERM_DRILLS, scoreConfusable, scoreMultiTerm } from "./confusable";

describe("MSE confusable pairs", () => {
  it("covers the key pairs", () => {
    const ids = CONFUSABLE_PAIRS.map((p) => p.id);
    expect(ids).toContain("mood-vs-affect");
    expect(ids).toContain("thought-form-vs-content");
    expect(ids).toContain("illusion-vs-hallucination");
    expect(ids).toContain("obsession-vs-delusion");
    expect(ids).toContain("akathisia-vs-anxiety");
  });

  it("every pair has a rule + at least 2 items with a valid correct answer", () => {
    for (const p of CONFUSABLE_PAIRS) {
      expect(p.rule.length).toBeGreaterThan(15);
      expect(p.items.length).toBeGreaterThanOrEqual(2);
      for (const i of p.items) expect(["a", "b"]).toContain(i.correct);
    }
  });

  it("scoreConfusable counts correct answers", () => {
    const items = CONFUSABLE_PAIRS[0].items;
    const allCorrect: Record<string, "a" | "b"> = {};
    items.forEach((it, i) => { allCorrect[i] = it.correct; });
    expect(scoreConfusable(items, allCorrect)).toBe(items.length);
    expect(scoreConfusable(items, {})).toBe(0);
  });

  it("akathisia-vs-anxiety is the trap pair (drug-induced restlessness)", () => {
    const pair = CONFUSABLE_PAIRS.find((p) => p.id === "akathisia-vs-anxiety")!;
    expect(pair.rule.toLowerCase()).toContain("drug");
  });
});

describe("MSE multi-term set drills (v5 §3 L3)", () => {
  it("covers the required set distinctions", () => {
    const ids = MULTI_TERM_DRILLS.map((d) => d.id);
    expect(ids).toContain("affect-qualities"); // blunted/flat/restricted/labile
    expect(ids).toContain("poverty-speech-vs-content");
    expect(ids).toContain("psychomotor-retardation-sedation-motivation");
    expect(ids).toContain("insight-graded"); // graded, not binary
    expect(ids).toContain("thought-form-set"); // flight/tangential/circumstantial/loosening
  });

  it("every drill has a rule, >= 3 items, and every correct answer is a term", () => {
    for (const d of MULTI_TERM_DRILLS) {
      expect(d.rule.length).toBeGreaterThan(15);
      expect(d.items.length).toBeGreaterThanOrEqual(3);
      for (const i of d.items) {
        expect(d.terms).toContain(i.correct);
      }
    }
  });

  it("scoreMultiTerm counts exact label matches", () => {
    const drill = MULTI_TERM_DRILLS[0];
    const allCorrect: Record<string, string> = {};
    for (const i of drill.items) allCorrect[i.prompt] = i.correct;
    expect(scoreMultiTerm(drill.items, allCorrect)).toBe(drill.items.length);
    expect(scoreMultiTerm(drill.items, {})).toBe(0);
  });
});
