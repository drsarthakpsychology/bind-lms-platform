import { describe, expect, it } from "vitest";
import { allStylePatterns, isClinicalQuery, styleBankSize, stylePatternsFor } from "./style-bank";

describe("style bank (fiction → conversational texture)", () => {
  it("has a usable bank of conversational patterns", () => {
    expect(styleBankSize()).toBeGreaterThan(100);
  });

  it("every pattern is tagged style_pattern='style'", () => {
    for (const p of allStylePatterns()) {
      expect(p.style_pattern).toBe("style");
    }
  });

  it("NO pattern contains clinical content", () => {
    const clinical = /(symptom|diagnos|depress|anxi|hallucin|suicid|therap|prescri|medication|withdraw|relapse|dose|treatment)/i;
    for (const p of allStylePatterns()) {
      expect(p.pattern).not.toMatch(clinical);
    }
  });

  it("style patterns are NEVER returned for a clinical query", () => {
    const clinicalQueries = [
      "what are the symptoms of depression",
      "is this medication safe",
      "tell me about suicidal thoughts",
      "what dose should I take",
      "treatment for anxiety",
    ];
    for (const q of clinicalQueries) {
      expect(stylePatternsFor(q, 5), `clinical query "${q}" must return no style`).toEqual([]);
    }
  });

  it("style patterns ARE returned for a conversational query", () => {
    const results = stylePatternsFor("how do people hesitate when embarrassed", 5);
    expect(results.length).toBeGreaterThan(0);
    expect(isClinicalQuery("how do people hesitate when embarrassed")).toBe(false);
  });
});
