import { describe, expect, it } from "vitest";
import { CLINICS } from "./clinic";

describe("two-minute clinic prompts (v5 §4 — the retention feature)", () => {
  it("has 60+ prompts", () => {
    expect(CLINICS.length).toBeGreaterThanOrEqual(115);
  });

  it("every prompt has a differential, next question, and lesson", () => {
    for (const c of CLINICS) {
      expect(c.expertDifferential.length).toBeGreaterThanOrEqual(2);
      expect(c.expertNext.length).toBeGreaterThan(15);
      expect(c.lesson.length).toBeGreaterThan(20);
    }
  });

  it("covers all 16 traps across the set", () => {
    const traps = new Set(CLINICS.map((c) => c.trap).filter(Boolean));
    const required = [
      "treatment_mismatch", "misattributed_diagnosis", "provenance_contradiction",
      "somatic_mask", "iatrogenic", "substance_induced", "medical_mimic",
      "informant_conflict", "cultural_idiom", "over_diagnosis", "under_diagnosis",
      "diagnostic_overshadowing", "secondary_gain", "late_risk_reveal",
      "adherence_fiction", "polypharmacy",
    ];
    for (const t of required) {
      expect(traps.has(t), `missing trap ${t}`).toBe(true);
    }
  });

  it("includes idiom variants (the v5 Part 1 wiring)", () => {
    expect(CLINICS.filter((c) => c.idiom).length).toBeGreaterThanOrEqual(10);
  });
});