import type { PrepQuestion } from "@/lib/prep/types";
import { PART as p01 } from "./psychopathology-01";
import { PART as p02 } from "./psychopathology-02";
import { PART as p03 } from "./psychopathology-03";
import { PART as p04 } from "./psychopathology-04";
import { PART as p05 } from "./psychopathology-05";
import { PART as p06 } from "./psychopathology-06";
import { PART as p07 } from "./psychopathology-07";
import { PART as p08 } from "./psychopathology-08";
import { PART as p09 } from "./psychopathology-09";
import { PART as p10 } from "./psychopathology-10";
import { PART as p11 } from "./psychopathology-11";
import { PART as p12 } from "./psychopathology-12";
import { PART as p13 } from "./psychopathology-13";
import { PART as p14 } from "./psychopathology-14";
import { PART as p15 } from "./psychopathology-15";
import { PART as p16 } from "./psychopathology-16";
import { PART as p17 } from "./psychopathology-17";
import { PART as p18 } from "./psychopathology-18";
import { PART as x1a } from "./psychopathology-x1a";
import { PART as x1b } from "./psychopathology-x1b";

/** Question bank · psychopathology. Ordered from foundations (difficulty 1) to entrance-topper level (difficulty 4). Content lives in psychopathology-NN.ts part files. */
export const QUESTIONS: PrepQuestion[] = [...p01, ...p02, ...p03, ...p04, ...p05, ...p06, ...p07, ...p08, ...p09, ...p10, ...p11, ...p12, ...p13, ...p14, ...p15, ...p16, ...p17, ...p18, ...x1a, ...x1b].sort((a, b) => a.difficulty - b.difficulty);
