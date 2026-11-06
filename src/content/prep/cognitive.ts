import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./cognitive-1";
import { QUESTIONS_2 } from "./cognitive-2";

/** Question bank · cognitive. Parts live in cognitive-N.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2];
