import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./psychometrics-assessment-1";
import { QUESTIONS_2 } from "./psychometrics-assessment-2";

/** Question bank · psychometrics-assessment. Parts live in psychometrics-assessment-N.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2];
