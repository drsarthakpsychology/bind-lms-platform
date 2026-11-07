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
