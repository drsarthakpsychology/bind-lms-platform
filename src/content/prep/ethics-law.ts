import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./ethics-law-1";
import { QUESTIONS_2 } from "./ethics-law-2";
import { QUESTIONS_3 } from "./ethics-law-3";
import { QUESTIONS as QX2_1 } from "./ethics-law-qx2-1";
import { QUESTIONS as QX2_2 } from "./ethics-law-qx2-2";
import { QUESTIONS as QX2_3 } from "./ethics-law-qx2-3";
import { QUESTIONS as QX2_4 } from "./ethics-law-qx2-4";

/** Question bank · ethics-law. Ordered from foundation (1) to advanced (4); parts live in ethics-law-*.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3, ...QX2_1, ...QX2_2, ...QX2_3, ...QX2_4].sort((a, b) => a.difficulty - b.difficulty);
