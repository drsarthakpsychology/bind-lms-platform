import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS as part1 } from "./statistics-1";
import { QUESTIONS as part2 } from "./statistics-2";
import { QUESTIONS as part3 } from "./statistics-3";
import { QUESTIONS as part4 } from "./statistics-4";

/** Question bank · statistics. Parts live in statistics-<n>.ts. */
export const QUESTIONS: PrepQuestion[] = [...part1, ...part2, ...part3, ...part4];
