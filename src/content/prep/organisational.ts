import type { PrepQuestion } from "@/lib/prep/types";
import { PART as p01 } from "./organisational-01";
import { PART as p02 } from "./organisational-02";
import { PART as p03 } from "./organisational-03";
import { PART as p04 } from "./organisational-04";

/** Question bank · organisational. Ordered from foundations (difficulty 1) to entrance-topper level (difficulty 4). Content lives in organisational-NN.ts part files. */
export const QUESTIONS: PrepQuestion[] = [...p01, ...p02, ...p03, ...p04].sort((a, b) => a.difficulty - b.difficulty);
