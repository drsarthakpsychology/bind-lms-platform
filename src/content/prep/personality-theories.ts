import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS as part1 } from "./personality-theories-part1";
import { QUESTIONS as part2 } from "./personality-theories-part2";
import { QUESTIONS as part3 } from "./personality-theories-part3";

/**
 * Foundations first: topics keep their order, and within each topic easier
 * questions come before harder ones (easy, medium, hard, very hard).
 */
function byLevel(qs: PrepQuestion[]): PrepQuestion[] {
  const order = new Map<string, number>();
  for (const q of qs) if (!order.has(q.topic)) order.set(q.topic, order.size);
  return [...qs].sort((a, b) => order.get(a.topic)! - order.get(b.topic)! || a.difficulty - b.difficulty);
}

/** Question bank · personality-theories. Parts are split by topic; ids are stable. */
export const QUESTIONS: PrepQuestion[] = byLevel([...part1, ...part2, ...part3]);
