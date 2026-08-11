import { describe, expect, it } from "vitest";
import { IDIOMS, scoreDecode } from "./idioms";

describe("idiom bank", () => {
  it("has the expanded idiom bank (60+ entries)", () => {
    expect(IDIOMS.length).toBeGreaterThanOrEqual(120);
  });

  it("every idiom id is unique and kebab-case", () => {
    const ids = IDIOMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^idiom-[a-z0-9-]+$/);
  });

  it("every entry has a phrase, meanings, questions, trap and sources", () => {
    for (const i of IDIOMS) {
      expect(i.phrase.trim().length).toBeGreaterThan(2);
      expect(i.possible_meanings.length).toBeGreaterThanOrEqual(2);
      expect(i.disambiguating_questions.length).toBeGreaterThanOrEqual(2);
      expect(i.trap.length).toBeGreaterThan(10);
      expect(i.sources.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("covers the compulsory somatic idioms", () => {
    const phrases = IDIOMS.map((i) => i.phrase.toLowerCase());
    const required = ["ghabrahat", "kamzori", "gas", "sar bhari", "fresh", "dhat", "possession", "tension", "nazar", "bp high"];
    for (const r of required) {
      expect(phrases.some((p) => p.includes(r)), `missing idiom: ${r}`).toBe(true);
    }
  });

  it("every entry maps at least one Kirmayer reading", () => {
    for (const i of IDIOMS) expect(i.readings.length).toBeGreaterThanOrEqual(1);
  });

  it("scoreDecode rewards catching physical readings and penalises misses", () => {
    const fresh = IDIOMS.find((i) => i.id === "idiom-fresh")!;
    // Picking only the emotional reading scores less than picking the physical ones.
    const emotionalOnly = scoreDecode(fresh, ["Anhedonia / depressive fatigue"]);
    const withPhysical = scoreDecode(fresh, [
      "Incomplete bowel evacuation / constipation",
      "Non-restorative sleep",
      "Anhedonia / depressive fatigue",
    ]);
    expect(withPhysical.score).toBeGreaterThan(emotionalOnly.score);
    // Missing ANY physical reading is flagged — the over-psychologising habit is
    // the thing this module exists to break.
    expect(emotionalOnly.missedPhysical.length).toBeGreaterThan(withPhysical.missedPhysical.length);
    // Selecting a reading not in the bank reduces the score (no credit for guessing).
    const withWrong = scoreDecode(fresh, ["Incomplete bowel evacuation / constipation", "A panic disorder"]);
    expect(withWrong.score).toBeLessThan(withPhysical.score);
  });
});
