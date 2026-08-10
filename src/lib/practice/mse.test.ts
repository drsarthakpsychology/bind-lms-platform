import { describe, expect, it } from "vitest";
import { isDiagnosticTerm, MOOD_AFFECT_ITEMS, MSE_DOMAINS, MSE_VOCAB, SEED_MSE_STIMULI } from "./mse";

describe("MSE Trainer", () => {
  it("covers all 11 MSE domains", () => {
    expect(MSE_DOMAINS).toHaveLength(11);
  });

  it("every domain has a controlled vocabulary", () => {
    for (const d of MSE_DOMAINS) {
      expect(MSE_VOCAB[d].length).toBeGreaterThan(1);
    }
  });

  it("mood-vs-affect drill has the right answers", () => {
    // All 8 items have a valid answer.
    expect(MOOD_AFFECT_ITEMS.length).toBeGreaterThanOrEqual(8);
    for (const i of MOOD_AFFECT_ITEMS) {
      expect(["mood", "affect"]).toContain(i.answer);
      expect(i.why.length).toBeGreaterThan(10);
    }
  });

  it("the describe-don't-diagnose mode flags diagnostic terms", () => {
    expect(isDiagnosticTerm("the client has schizophrenia")).toContain("schizophren");
    expect(isDiagnosticTerm("she looks depressed")).toContain("depress");
    expect(isDiagnosticTerm("the client is unkempt and guarded")).toEqual([]);
  });

  it("seed stimuli all map to a valid domain with expert tags", () => {
    for (const s of SEED_MSE_STIMULI) {
      expect(MSE_DOMAINS).toContain(s.domain);
      expect(s.expertTags.length).toBeGreaterThan(0);
    }
  });
});
