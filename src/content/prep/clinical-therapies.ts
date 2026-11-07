import type { PrepQuestion } from "@/lib/prep/types";
import { PART as p01 } from "./clinical-therapies-01";
import { PART as p02 } from "./clinical-therapies-02";
import { PART as p03 } from "./clinical-therapies-03";
import { PART as p04 } from "./clinical-therapies-04";
import { PART as p05 } from "./clinical-therapies-05";
import { PART as p06 } from "./clinical-therapies-06";
import { PART as p07 } from "./clinical-therapies-07";
import { PART as p08 } from "./clinical-therapies-08";
import { PART as p09 } from "./clinical-therapies-09";
import { PART as p10 } from "./clinical-therapies-10";
import { PART as p11 } from "./clinical-therapies-11";
import { PART as p12 } from "./clinical-therapies-12";
import { PART as p13 } from "./clinical-therapies-13";
import { PART as p14 } from "./clinical-therapies-14";
import { PART as p15 } from "./clinical-therapies-15";
import { PART as x1a } from "./clinical-therapies-x1a";
import { PART as x1b } from "./clinical-therapies-x1b";
import { PART as x1c } from "./clinical-therapies-x1c";
import { PART as x1d } from "./clinical-therapies-x1d";

/** Question bank · clinical-therapies. Ordered from foundations (difficulty 1) to entrance-topper level (difficulty 4). Content lives in clinical-therapies-NN.ts part files. */
export const QUESTIONS: PrepQuestion[] = [...p01, ...p02, ...p03, ...p04, ...p05, ...p06, ...p07, ...p08, ...p09, ...p10, ...p11, ...p12, ...p13, ...p14, ...p15, ...x1a, ...x1b, ...x1c, ...x1d].sort((a, b) => a.difficulty - b.difficulty);
