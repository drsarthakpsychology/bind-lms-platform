import type { PrepQuestion } from "@/lib/prep/types";
import { PART as p01 } from "./psychopathology-01";
import { PART as p02 } from "./psychopathology-02";
import { PART as p03 } from "./psychopathology-03";
import { PART as p04 } from "./psychopathology-04";

/** Question bank · psychopathology. Content lives in psychopathology-NN.ts part files. */
export const QUESTIONS: PrepQuestion[] = [...p01, ...p02, ...p03, ...p04];
