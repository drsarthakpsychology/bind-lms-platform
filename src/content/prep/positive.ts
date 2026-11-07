import type { PrepQuestion } from "@/lib/prep/types";
import { PART as p01 } from "./positive-01";
import { PART as p02 } from "./positive-02";
import { PART as p03 } from "./positive-03";

/** Question bank · positive. Ordered from foundations (difficulty 1) to entrance-topper level (difficulty 4). Content lives in positive-NN.ts part files. */
export const QUESTIONS: PrepQuestion[] = [...p01, ...p02, ...p03].sort((a, b) => a.difficulty - b.difficulty);
