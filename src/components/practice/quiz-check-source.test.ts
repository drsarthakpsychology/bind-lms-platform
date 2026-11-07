import { describe, expect, it } from "vitest";
import { shownSource } from "./quiz-check";
import { QUIZ_BANK } from "@/lib/quiz/quiz-bank";
import { findReference } from "@/lib/ai/student-text";

describe("quiz check sources (no references in student text)", () => {
  it("keeps the law itself", () => {
    expect(shownSource("POCSO 2012, Section 19")).toBe("POCSO 2012, Section 19");
    expect(shownSource("Mental Healthcare Act 2017, Section 98 (restraint)")).not.toBeNull();
  });
  it("hides books, papers, author-year and guideline citations", () => {
    for (const s of ["WHO mhGAP-IG 2.0 (2016)", "Nichter (1981); DSM-5 CFI", "SPIKES protocol (Baile et al., 2000)", "Clinical interviewing literature (open questions)", "MSE standard structure", "", undefined]) {
      expect(shownSource(s)).toBeNull();
    }
  });
  it("never shows a reference-like source from the quiz bank", () => {
    for (const q of QUIZ_BANK) {
      const s = shownSource(q.source);
      if (s) expect(findReference(s)).toBeNull();
    }
  });
});
