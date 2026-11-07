import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./ethics-law-1";
import { QUESTIONS_2 } from "./ethics-law-2";
import { QUESTIONS_3 } from "./ethics-law-3";

/** Question bank · ethics-law. Ordered from foundation (1) to advanced (4); parts live in ethics-law-*.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3].sort((a, b) => a.difficulty - b.difficulty);
