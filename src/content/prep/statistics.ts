import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS as part1 } from "./statistics-1";
import { QUESTIONS as part2 } from "./statistics-2";

/** Question bank · statistics. Parts live in statistics-<n>.ts. */
export const QUESTIONS: PrepQuestion[] = [...part1, ...part2];
