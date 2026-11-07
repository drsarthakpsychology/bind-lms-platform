import type { LongQA } from "@/lib/prep/long-types";
import { PSYCHOPATHOLOGY_L01 } from "./psychopathology-l01";
import { PSYCHOPATHOLOGY_L02 } from "./psychopathology-l02";
import { PSYCHOPATHOLOGY_L03 } from "./psychopathology-l03";
import { PSYCHOPATHOLOGY_L04 } from "./psychopathology-l04";
import { PSYCHOPATHOLOGY_L05 } from "./psychopathology-l05";
import { PSYCHOPATHOLOGY_L06 } from "./psychopathology-l06";
import { PSYCHOPATHOLOGY_L07 } from "./psychopathology-l07";
import { PSYCHOPATHOLOGY_L08 } from "./psychopathology-l08";

/** Every hand-written long answer. Writers add part files and spread them in here. */
export const LONG_QA: LongQA[] = [
  ...PSYCHOPATHOLOGY_L01,
  ...PSYCHOPATHOLOGY_L02,
  ...PSYCHOPATHOLOGY_L03,
  ...PSYCHOPATHOLOGY_L04,
  ...PSYCHOPATHOLOGY_L05,
  ...PSYCHOPATHOLOGY_L06,
  ...PSYCHOPATHOLOGY_L07,
  ...PSYCHOPATHOLOGY_L08,
];
