import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./perception-attention-1";
import { QUESTIONS_2 } from "./perception-attention-2";
import { QUESTIONS_3 } from "./perception-attention-3";
import { QUESTIONS_X01 } from "./perception-attention-x01";
import { QUESTIONS_X02 } from "./perception-attention-x02";

/** Question bank · perception-attention. Parts live in perception-attention-N.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3, ...QUESTIONS_X01, ...QUESTIONS_X02];
