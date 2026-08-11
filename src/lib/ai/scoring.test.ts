import { describe, expect, it } from "vitest";
import { debriefSchema } from "./schemas";
import { FIXTURE_DEBRIEF } from "./fixtures";
import { buildScoringPrompt, type ScoringInput } from "./prompts/scoring";
import { shouldInjectCorrection } from "@/lib/practice/sim-review";

/**
 * Scoring-logic coverage (brief §11.2): the functions that GRADE STUDENTS
 * cannot be flaky. These tests pin the schema, the fixture contract, the
 * few-shot correction injection, and the prompt's edge behaviour.
 */

function validDebrief() {
  return {
    score: 3,
    open_closed_ratio: 0.6,
    leading_questions: 1,
    double_barrelled: 0,
    reflective_statements: 2,
    premature_reassurance: 1,
    domain_coverage: 0.7,
    risk_timing: "late",
    disclosure_unlock_rate: 0.5,
    idiom_decoding: true,
    quotes: [
      { quote: "student: I'm fine.", better: "What's it been like since we last spoke?" },
      { quote: "student: You're not going to hurt yourself, right?", better: "Have you had thoughts of ending your life?" },
      { quote: "student: Don't worry, you'll be fine.", better: "That sounds frightening — tell me more." },
    ],
    missed_disclosures: ["the patient would have told you about the debt if you'd asked openly about home"],
  };
}

describe("debrief schema (the product — must be deterministic)", () => {
  it("accepts a valid debrief", () => {
    expect(debriefSchema.safeParse(validDebrief()).success).toBe(true);
  });

  it("rejects out-of-range scores", () => {
    const bad = { ...validDebrief(), score: 6 };
    expect(debriefSchema.safeParse(bad).success).toBe(false);
    const neg = { ...validDebrief(), domain_coverage: -0.1 };
    expect(debriefSchema.safeParse(neg).success).toBe(false);
  });

  it("rejects a bad risk_timing enum", () => {
    const bad = { ...validDebrief(), risk_timing: "sometimes" };
    expect(debriefSchema.safeParse(bad).success).toBe(false);
  });

  it("requires at least 3 quotes (the debrief must name three moments)", () => {
    const few = { ...validDebrief(), quotes: [{ quote: "a", better: "b" }] };
    expect(debriefSchema.safeParse(few).success).toBe(false);
  });

  it("rejects non-integer counts", () => {
    const bad = { ...validDebrief(), leading_questions: 1.5 };
    expect(debriefSchema.safeParse(bad).success).toBe(false);
  });

  it("idiom_decoding defaults to false when absent (a missed idiom must not silently pass)", () => {
    const { idiom_decoding: _drop, ...without } = validDebrief();
    const parsed = debriefSchema.safeParse(without);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.idiom_decoding).toBe(false);
  });
});

describe("fixture debrief (AI_ENABLED=false contract)", () => {
  it("FIXTURE_DEBRIEF parses against the schema (the offline product works)", () => {
    const parsed = debriefSchema.safeParse(FIXTURE_DEBRIEF);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.quotes.length).toBeGreaterThanOrEqual(3);
      expect(parsed.data.missed_disclosures.length).toBeGreaterThan(0);
    }
  });
});

describe("few-shot correction injection", () => {
  const input: ScoringInput = {
    caseTitle: "Ravi, 34 — 'the heaviness'",
    caseDifficulty: "cooperative",
    rubricTargets: ["risk assessment", "validation"],
    transcript: [
      { role: "student", content: "How are you feeling?" },
      { role: "patient", content: "Heavy." },
    ],
  };

  it("score-changing corrections are injected into the prompt", () => {
    const prompt = buildScoringPrompt({
      ...input,
      priorCorrections: [
        { original: "2.0", corrected: "4.0", note: "Missed the somatic-first depression" },
      ],
    });
    expect(prompt).toMatch(/LESSONS FROM PAST FACULTY CORRECTIONS/);
    expect(prompt).toMatch(/"2\.0" should be scored as: 4\.0/);
  });

  it("note-only corrections are NOT injected (shouldInjectCorrection filters)", () => {
    expect(shouldInjectCorrection({ original: "2.0", corrected: {} })).toBe(false);
    expect(shouldInjectCorrection({ original: "2.0", corrected: 4 })).toBe(true);
    // The debrief route stores note-only rows as the object {} (buildCorrectionRow);
    // a string "{}" is a JSON-serialised leftover and still counts as content.
    const prompt = buildScoringPrompt({
      ...input,
      priorCorrections: [{ original: "2.0", corrected: "{}", note: "just a note" }],
    });
    expect(prompt).toMatch(/LESSONS FROM PAST FACULTY CORRECTIONS/);
  });

  it("empty transcripts still produce a valid scoring prompt (no crash)", () => {
    const prompt = buildScoringPrompt({ ...input, transcript: [] });
    expect(prompt).toContain("THE TRANSCRIPT");
    expect(prompt).toMatch(/Return ONLY a JSON object/);
  });

  it("an all-closed-questions transcript is scored as a normal input (no special casing needed — the model sees the lines)", () => {
    const closed: ScoringInput = {
      ...input,
      transcript: [
        { role: "student", content: "Are you sad? Yes or no." },
        { role: "patient", content: "Yes." },
        { role: "student", content: "Do you sleep? Yes or no." },
        { role: "patient", content: "No." },
      ],
    };
    const prompt = buildScoringPrompt(closed);
    expect(prompt).toContain("Are you sad? Yes or no.");
  });
});