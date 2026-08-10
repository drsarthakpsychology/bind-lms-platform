import { describe, expect, it } from "vitest";
import { diffNarratives, FIVE_P, scoreSort, SEED_FORMULATION, type SortAttempt } from "./formulation";

describe("Formulation Forge — 5P", () => {
  it("has all 5 P buckets", () => {
    expect(FIVE_P).toEqual(["presenting", "predisposing", "precipitating", "perpetuating", "protective"]);
  });

  it("the seed case has distractors mixed in", () => {
    const distractors = SEED_FORMULATION.factors.filter((f) => f.bucket === "distractor");
    expect(distractors.length).toBeGreaterThan(0);
  });

  it("a perfect sort scores 1.0", () => {
    const attempt: SortAttempt[] = SEED_FORMULATION.factors.map((f) => ({ factorId: f.id, bucket: f.bucket }));
    expect(scoreSort(attempt, SEED_FORMULATION.factors)).toBe(1);
  });

  it("putting a factor in the wrong bucket scores below 1", () => {
    const attempt: SortAttempt[] = SEED_FORMULATION.factors.map((f) => ({
      factorId: f.id,
      bucket: f.bucket === "presenting" ? "precipitating" : f.bucket,
    }));
    expect(scoreSort(attempt, SEED_FORMULATION.factors)).toBeLessThan(1);
  });

  it("empty sort scores 0", () => {
    expect(scoreSort([], SEED_FORMULATION.factors)).toBe(0);
  });

  it("diff finds the key model words in a good narrative", () => {
    const good = "Ravi presents with somatic depression following a promotion that added night shifts. A family history and a core belief of failing shape his coping. A supportive wife is protective.";
    const d = diffNarratives(good, SEED_FORMULATION.modelNarrative);
    expect(d.present.length).toBeGreaterThan(3);
  });
});
