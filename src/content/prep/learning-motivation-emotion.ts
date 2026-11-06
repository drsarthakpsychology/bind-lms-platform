import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./learning-motivation-emotion-1";
import { QUESTIONS_2 } from "./learning-motivation-emotion-2";

/** Question bank · learning-motivation-emotion. Parts live in learning-motivation-emotion-N.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2];
