import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./ethics-law-1";
import { QUESTIONS_2 } from "./ethics-law-2";

/** Question bank · ethics-law. Parts live in ethics-law-*.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2];
