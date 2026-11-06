import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS as part1 } from "./biological-part1";
import { QUESTIONS as part2 } from "./biological-part2";

/** Question bank · biological. Parts are split by topic; ids are stable. */
export const QUESTIONS: PrepQuestion[] = [...part1, ...part2];
