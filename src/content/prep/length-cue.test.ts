import { describe, expect, it } from "vitest";
import { ALL_QUESTIONS } from "./index";
import type { PrepQuestion } from "@/lib/prep/types";

/**
 * Length cue: in single-best-answer items the correct option must not be clearly
 * the longest, or students can score by picking the longest answer.
 * An mcq item is flagged when the correct option is more than 1.3 times as long
 * as the longest distractor AND more than 15 characters longer.
 * A subject fails if more than 5 percent of its mcq items are flagged.
 * Add subjects to LENGTH_CHECKED_SUBJECTS as their banks are fixed.
 */
const LENGTH_CHECKED_SUBJECTS: PrepQuestion["subject"][] = [
  "history-systems",
  "indian-psychology",
  "ethics-law",
  "ugc-paper1",
  "learning-motivation-emotion",
  "biological",
  "developmental",
  "social",
  "personality-theories",
];
const RATIO = 1.3;
const MIN_GAP = 15;
const MAX_FLAGGED_SHARE = 0.05;

function hasLengthCue(q: PrepQuestion): boolean {
  if (q.type !== "mcq") return false;
  const correct = q.options[q.answer].length;
  const longestDistractor = Math.max(...q.options.filter((_, i) => i !== q.answer).map((o) => o.length));
  return correct > RATIO * longestDistractor && correct - longestDistractor > MIN_GAP;
}

describe("length cue in single-best-answer items", () => {
  for (const subject of LENGTH_CHECKED_SUBJECTS) {
    it(`${subject}: no more than 5% of mcq items have a clearly longest correct option`, () => {
      const mcqs = ALL_QUESTIONS.filter((q) => q.subject === subject && q.type === "mcq");
      expect(mcqs.length, subject).toBeGreaterThan(0);
      const flagged = mcqs.filter(hasLengthCue).map((q) => q.id);
      expect(flagged.length / mcqs.length, `${subject} flagged: ${flagged.join(", ")}`).toBeLessThanOrEqual(MAX_FLAGGED_SHARE);
    });
  }
});
