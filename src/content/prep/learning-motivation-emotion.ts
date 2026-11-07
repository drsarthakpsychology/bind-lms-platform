import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./learning-motivation-emotion-1";
import { QUESTIONS_2 } from "./learning-motivation-emotion-2";
import { QUESTIONS_3 } from "./learning-motivation-emotion-3";
import { QUESTIONS_4 } from "./learning-motivation-emotion-4";
import { QUESTIONS_X01 } from "./learning-motivation-emotion-x01";
import { QUESTIONS_X02 } from "./learning-motivation-emotion-x02";

/** Question bank · learning-motivation-emotion. Parts live in learning-motivation-emotion-N.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3, ...QUESTIONS_4, ...QUESTIONS_X01, ...QUESTIONS_X02];
