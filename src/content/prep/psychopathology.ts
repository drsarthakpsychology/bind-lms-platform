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

/** Question bank · psychopathology. Content lives in psychopathology-NN.ts part files. */
export const QUESTIONS: PrepQuestion[] = [...p01, ...p02, ...p03, ...p04, ...p05, ...p06, ...p07, ...p08, ...p09, ...p10, ...p11, ...p12, ...p13, ...p14];
