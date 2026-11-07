import { describe, expect, it } from "vitest";
import { ALL_QUESTIONS } from "./index";
import type { PrepQuestion } from "@/lib/prep/types";

/**
 * Answer-key balance: within a subject, no question type with 12 or more
 * items may have more than 40 percent of its correct answers on one option.
 * Add subjects to BALANCED_SUBJECTS as their banks are rebalanced.
 */
const BALANCED_SUBJECTS: PrepQuestion["subject"][] = [
  "biological",
  "developmental",
  "social",
  "personality-theories",
  "history-systems",
  "learning-motivation-emotion",
  "perception-attention",
  "cognitive",
  "ugc-paper1",
  "ethics-law",
  "indian-psychology",
  "psychometrics-assessment",
  "statistics",
  "research-methods",
  "psychopathology",
  "clinical-therapies",
  "counselling",
  "health",
  "positive",
  "organisational",
];
const MIN_ITEMS = 12;
const MAX_SHARE = 0.4;

describe("answer-key balance", () => {
  for (const subject of BALANCED_SUBJECTS) {
    it(`${subject}: no type has more than 40% of answers on one option`, () => {
      const byType = new Map<string, number[]>();
      for (const q of ALL_QUESTIONS) {
        if (q.subject !== subject) continue;
        const counts = byType.get(q.type) ?? [0, 0, 0, 0];
        counts[q.answer]++;
        byType.set(q.type, counts);
      }
      expect(byType.size, subject).toBeGreaterThan(0);
      for (const [type, counts] of byType) {
        const total = counts.reduce((a, b) => a + b, 0);
        if (total < MIN_ITEMS) continue;
        const share = Math.max(...counts) / total;
        expect(share, `${subject}:${type} answer counts ${counts.join("/")}`).toBeLessThanOrEqual(MAX_SHARE);
      }
    });
  }
});

/**
 * Explanations must name options by their content, never by position, so that
 * options can be reordered without silently breaking the explanation.
 * Assertion-reason wording such as "Both A and R are true" or "A is false"
 * refers to the Assertion and Reason, not to option letters, and does not match.
 */
const POSITIONAL = [
  /\b(first|second|third|fourth|last) (two |three )?(option|code|choice|answer|distractor|alternative)s?\b/i,
  /\boptions? \(?[A-D1-4]\)?(?![a-z0-9(.-])/i,
];

describe("explanations name options by content", () => {
  it("no explanation refers to an option by its position or letter", () => {
    const offenders = ALL_QUESTIONS.filter((q) => POSITIONAL.some((re) => re.test(q.explanation))).map((q) => q.id);
    expect(offenders).toEqual([]);
  });
});
