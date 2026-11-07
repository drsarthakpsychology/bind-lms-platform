import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS as part1 } from "./biological-part1";
import { QUESTIONS as part2 } from "./biological-part2";
import { QUESTIONS as part3 } from "./biological-part3";
import { QUESTIONS as part4 } from "./biological-part4";
import { QUESTIONS as part5 } from "./biological-part5";
import { QUESTIONS as part6 } from "./biological-part6";
import { QUESTIONS as part7 } from "./biological-part7";
import { QUESTIONS as x1a } from "./biological-x1a";
import { QUESTIONS as x1b } from "./biological-x1b";
import { QUESTIONS as x1c } from "./biological-x1c";
import { QUESTIONS as x1d } from "./biological-x1d";

/**
 * Foundations first: topics keep their order, and within each topic easier
 * questions come before harder ones (easy, medium, hard, very hard).
 */
function byLevel(qs: PrepQuestion[]): PrepQuestion[] {
  const order = new Map<string, number>();
  for (const q of qs) if (!order.has(q.topic)) order.set(q.topic, order.size);
  return [...qs].sort((a, b) => order.get(a.topic)! - order.get(b.topic)! || a.difficulty - b.difficulty);
}

/** Question bank · biological. Parts are split by topic; ids are stable. */
export const QUESTIONS: PrepQuestion[] = byLevel([...part1, ...part2, ...part3, ...part4, ...part5, ...part6, ...part7, ...x1a, ...x1b, ...x1c, ...x1d]);
