import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS as part1 } from "./developmental-part1";
import { QUESTIONS as part2 } from "./developmental-part2";
import { QUESTIONS as part3 } from "./developmental-part3";
import { QUESTIONS as part4 } from "./developmental-part4";

/** Question bank · developmental. Parts are split by topic; ids are stable. */
export const QUESTIONS: PrepQuestion[] = [...part1, ...part2, ...part3, ...part4];
