import { describe, expect, it } from "vitest";
import { ALL_QUESTIONS } from "./index";
import type { PrepQuestion } from "@/lib/prep/types";

/**
 * Length cue: in a single-best-answer item, the correct option should not stand
 * out as clearly the longest. An mcq item is flagged when its correct option is
 * more than 1.3 times as long as the longest distractor AND more than 15
 * characters longer. No subject may have more than 5 percent of its mcq items
 * flagged. Add subjects to LENGTH_CHECKED_SUBJECTS as their banks are cleaned.
 */
const LENGTH_CHECKED_SUBJECTS: PrepQuestion["subject"][] = [
  "research-methods",
  "psychopathology",
  "clinical-therapies",
  "counselling",
  "health",
  "positive",
  "organisational",
];
const RATIO = 1.3;
const MIN_GAP = 15;
const MAX_SHARE = 0.05;

export function hasLengthCue(q: PrepQuestion): boolean {
  if (q.type !== "mcq") return false;
  const correct = q.options[q.answer].length;
  const longestDistractor = Math.max(...q.options.filter((_, i) => i !== q.answer).map((o) => o.length));
  return correct > RATIO * longestDistractor && correct - longestDistractor > MIN_GAP;
}

describe("correct option is not given away by its length", () => {
  for (const subject of LENGTH_CHECKED_SUBJECTS) {
    it(`${subject}: at most 5% of mcq items have a much longer correct option`, () => {
      const mcq = ALL_QUESTIONS.filter((q) => q.subject === subject && q.type === "mcq");
      expect(mcq.length, subject).toBeGreaterThan(0);
      const flagged = mcq.filter(hasLengthCue).map((q) => q.id);
      expect(flagged.length / mcq.length, `${subject} flagged: ${flagged.join(", ")}`).toBeLessThanOrEqual(MAX_SHARE);
    });
  }
});
