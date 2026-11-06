import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS as part1 } from "./research-methods-1";
import { QUESTIONS as part2 } from "./research-methods-2";

/** Question bank · research-methods. Parts live in research-methods-<n>.ts. */
export const QUESTIONS: PrepQuestion[] = [...part1, ...part2];
