import type { PrepQuestion } from "@/lib/prep/types";
import { PART as p01 } from "./clinical-therapies-01";
import { PART as p02 } from "./clinical-therapies-02";
import { PART as p03 } from "./clinical-therapies-03";
import { PART as p04 } from "./clinical-therapies-04";
import { PART as p05 } from "./clinical-therapies-05";
import { PART as p06 } from "./clinical-therapies-06";
import { PART as p07 } from "./clinical-therapies-07";

/** Question bank · clinical-therapies. Ordered from foundations (difficulty 1) to entrance-topper level (difficulty 4). Content lives in clinical-therapies-NN.ts part files. */
export const QUESTIONS: PrepQuestion[] = [...p01, ...p02, ...p03, ...p04, ...p05, ...p06, ...p07].sort((a, b) => a.difficulty - b.difficulty);
