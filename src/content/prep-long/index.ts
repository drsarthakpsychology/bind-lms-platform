import type { LongQA } from "@/lib/prep/long-types";
import { RESEARCH_METHODS_L01 } from "./research-methods-l01";
import { RESEARCH_METHODS_L02 } from "./research-methods-l02";
import { RESEARCH_METHODS_L03 } from "./research-methods-l03";
import { RESEARCH_METHODS_L04 } from "./research-methods-l04";
import { RESEARCH_METHODS_L05 } from "./research-methods-l05";

/** Every hand-written long answer. Writers add part files and spread them in here. */
export const LONG_QA: LongQA[] = [
  ...RESEARCH_METHODS_L01,
  ...RESEARCH_METHODS_L02,
  ...RESEARCH_METHODS_L03,
  ...RESEARCH_METHODS_L04,
  ...RESEARCH_METHODS_L05,
];
