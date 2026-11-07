import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./indian-psychology-1";
import { QUESTIONS_2 } from "./indian-psychology-2";
import { QUESTIONS_3 } from "./indian-psychology-3";
import { QUESTIONS_X01 } from "./indian-psychology-x01";
import { QUESTIONS_X02 } from "./indian-psychology-x02";

/** Question bank · indian-psychology. Ordered from foundation (1) to advanced (4); parts live in indian-psychology-*.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3, ...QUESTIONS_X01, ...QUESTIONS_X02].sort((a, b) => a.difficulty - b.difficulty);
