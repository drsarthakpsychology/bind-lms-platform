import { describe, expect, it } from "vitest";
import { ALL_QUESTIONS } from "@/content/prep";
import type { Subject } from "@/lib/prep/types";

/**
 * Answer-key balance guard. A student should not be able to score well by always
 * picking the same option. For every subject:type pair with at least MIN_ITEMS
 * questions, no single option index may hold more than MAX_SHARE of the answers.
 * Add a subject here once its bank has been rebalanced.
 */
export const BALANCED_SUBJECTS: Subject[] = ["learning-motivation-emotion", "perception-attention"];

const MIN_ITEMS = 12;
const MAX_SHARE = 0.4;

describe("prep answer-key balance", () => {
  for (const subject of BALANCED_SUBJECTS) {
    it(`${subject}: no option holds more than ${MAX_SHARE * 100}% of answers in any question type`, () => {
      const byType = new Map<string, number[]>();
      for (const q of ALL_QUESTIONS) {
        if (q.subject !== subject) continue;
        const counts = byType.get(q.type) ?? [0, 0, 0, 0];
        counts[q.answer]++;
        byType.set(q.type, counts);
      }
      for (const [type, counts] of byType) {
        const total = counts.reduce((a, b) => a + b, 0);
        if (total < MIN_ITEMS) continue;
        const top = Math.max(...counts);
        expect(top / total, `${subject}:${type} answers per option ${JSON.stringify(counts)}`).toBeLessThanOrEqual(MAX_SHARE);
      }
    });
  }
});
