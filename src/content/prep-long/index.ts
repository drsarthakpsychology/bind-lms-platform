import type { LongQA } from "@/lib/prep/long-types";
import { PSYCHOPATHOLOGY_L01 } from "./psychopathology-l01";
import { PSYCHOPATHOLOGY_L02 } from "./psychopathology-l02";
import { PSYCHOPATHOLOGY_L03 } from "./psychopathology-l03";
import { PSYCHOPATHOLOGY_L04 } from "./psychopathology-l04";

/** Every hand-written long answer. Writers add part files and spread them in here. */
export const LONG_QA: LongQA[] = [
  ...PSYCHOPATHOLOGY_L01,
  ...PSYCHOPATHOLOGY_L02,
  ...PSYCHOPATHOLOGY_L03,
  ...PSYCHOPATHOLOGY_L04,
];
