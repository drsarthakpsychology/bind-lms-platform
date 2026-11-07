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
 *
 * Rank cue: even a small margin is a tell if the key is usually the longest
 * (or usually the shortest). For subjects in RANK_CHECKED_SUBJECTS, the correct
 * option may be the single longest in no more than 35 percent of mcq items, and
 * the single shortest in no more than 35 percent. Ties do not count. Chance is
 * 25 percent. Add a subject here once it is in LENGTH_CHECKED_SUBJECTS and meets this.
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
  "research-methods",
  "statistics",
  "psychometrics-assessment",
  "cognitive",
  "perception-attention",
  "psychopathology",
  "clinical-therapies",
  "counselling",
  "health",
  "positive",
  "organisational",
];
const RANK_CHECKED_SUBJECTS: PrepQuestion["subject"][] = [
  "history-systems",
  "indian-psychology",
  "ethics-law",
  "ugc-paper1",
  "learning-motivation-emotion",
  "biological",
  "developmental",
  "social",
  "personality-theories",
  "research-methods",
  "statistics",
  "psychometrics-assessment",
  "cognitive",
  "perception-attention",
  "psychopathology",
  "clinical-therapies",
  "counselling",
  "health",
  "positive",
  "organisational",
];
const MAX_RANK_SHARE = 0.35;
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

describe("correct option is not usually the longest or the shortest", () => {
  for (const subject of RANK_CHECKED_SUBJECTS) {
    it(`${subject}: key is the single longest, and the single shortest, option in no more than 35% of mcq items`, () => {
      const mcqs = ALL_QUESTIONS.filter((q) => q.subject === subject && q.type === "mcq");
      expect(mcqs.length, subject).toBeGreaterThan(0);
      let longest = 0;
      let shortest = 0;
      for (const q of mcqs) {
        const correct = q.options[q.answer].length;
        const others = q.options.filter((_, i) => i !== q.answer).map((o) => o.length);
        if (correct > Math.max(...others)) longest++;
        if (correct < Math.min(...others)) shortest++;
      }
      expect(longest / mcqs.length, `${subject}: key longest in ${longest}/${mcqs.length}`).toBeLessThanOrEqual(MAX_RANK_SHARE);
      expect(shortest / mcqs.length, `${subject}: key shortest in ${shortest}/${mcqs.length}`).toBeLessThanOrEqual(MAX_RANK_SHARE);
    });
  }
});
