import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./cognitive-1";
import { QUESTIONS_2 } from "./cognitive-2";
import { QUESTIONS_3 } from "./cognitive-3";
import { QUESTIONS_4 } from "./cognitive-4";
import { QUESTIONS_5 } from "./cognitive-5";
import { QUESTIONS_X01 } from "./cognitive-x01";
import { QUESTIONS_X02 } from "./cognitive-x02";

/** Question bank · cognitive. Parts live in cognitive-N.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3, ...QUESTIONS_4, ...QUESTIONS_5, ...QUESTIONS_X01, ...QUESTIONS_X02];
