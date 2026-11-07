import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./psychometrics-assessment-1";
import { QUESTIONS_2 } from "./psychometrics-assessment-2";
import { QUESTIONS_3 } from "./psychometrics-assessment-3";
import { QUESTIONS_4 } from "./psychometrics-assessment-4";
import { QUESTIONS_5 } from "./psychometrics-assessment-5";
import { QUESTIONS_6 } from "./psychometrics-assessment-6";
import { QUESTIONS_7 } from "./psychometrics-assessment-7";

/** Question bank · psychometrics-assessment. Parts live in psychometrics-assessment-N.ts. */
export const QUESTIONS: PrepQuestion[] = [
  ...QUESTIONS_1,
  ...QUESTIONS_2,
  ...QUESTIONS_3,
  ...QUESTIONS_4,
  ...QUESTIONS_5,
  ...QUESTIONS_6,
  ...QUESTIONS_7,
];
