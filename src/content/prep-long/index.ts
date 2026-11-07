import type { LongQA } from "@/lib/prep/long-types";
import { RESEARCH_METHODS_L01 } from "./research-methods-l01";
import { RESEARCH_METHODS_L02 } from "./research-methods-l02";
import { RESEARCH_METHODS_L03 } from "./research-methods-l03";
import { RESEARCH_METHODS_L04 } from "./research-methods-l04";
import { RESEARCH_METHODS_L05 } from "./research-methods-l05";
import { STATISTICS_L01 } from "./statistics-l01";
import { STATISTICS_L02 } from "./statistics-l02";
import { STATISTICS_L03 } from "./statistics-l03";
import { STATISTICS_L04 } from "./statistics-l04";

/** Every hand-written long answer. Writers add part files and spread them in here. */
export const LONG_QA: LongQA[] = [
  ...RESEARCH_METHODS_L01,
  ...RESEARCH_METHODS_L02,
  ...RESEARCH_METHODS_L03,
  ...RESEARCH_METHODS_L04,
  ...RESEARCH_METHODS_L05,
  ...STATISTICS_L01,
  ...STATISTICS_L02,
  ...STATISTICS_L03,
  ...STATISTICS_L04,
];
