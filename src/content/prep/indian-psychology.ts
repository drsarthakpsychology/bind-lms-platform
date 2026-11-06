import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./indian-psychology-1";
import { QUESTIONS_2 } from "./indian-psychology-2";

/** Question bank · indian-psychology. Ordered from foundation (1) to advanced (4); parts live in indian-psychology-*.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2].sort((a, b) => a.difficulty - b.difficulty);
