import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./psychometrics-assessment-1";
import { QUESTIONS_2 } from "./psychometrics-assessment-2";
import { QUESTIONS_3 } from "./psychometrics-assessment-3";
import { QUESTIONS_4 } from "./psychometrics-assessment-4";
import { QUESTIONS_5 } from "./psychometrics-assessment-5";
import { QUESTIONS_6 } from "./psychometrics-assessment-6";
import { QUESTIONS_7 } from "./psychometrics-assessment-7";
import { QUESTIONS as QX2_1 } from "./psychometrics-assessment-qx2-1";
import { QUESTIONS as QX2_2 } from "./psychometrics-assessment-qx2-2";
import { QUESTIONS as QX2_3 } from "./psychometrics-assessment-qx2-3";
import { QUESTIONS as QX2_4 } from "./psychometrics-assessment-qx2-4";
import { QUESTIONS as QX2_5 } from "./psychometrics-assessment-qx2-5";
import { QUESTIONS as QX2_6 } from "./psychometrics-assessment-qx2-6";

/** Question bank · psychometrics-assessment. Parts live in psychometrics-assessment-N.ts. */
export const QUESTIONS: PrepQuestion[] = [
  ...QUESTIONS_1,
  ...QUESTIONS_2,
  ...QUESTIONS_3,
  ...QUESTIONS_4,
  ...QUESTIONS_5,
  ...QUESTIONS_6,
  ...QUESTIONS_7,
  ...QX2_1,
  ...QX2_2,
  ...QX2_3,
  ...QX2_4,
  ...QX2_5,
  ...QX2_6,
];
