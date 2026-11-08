import type { ClinicPrompt } from "../clinic";
import { PART_1 } from "./part-1";
import { PART_2 } from "./part-2";
import { PART_3 } from "./part-3";
import { PART_4 } from "./part-4";
import { PART_5 } from "./part-5";
import { PART_6 } from "./part-6";

/** Authored Clinic detective cases, appended after the core set. */
export const CLINIC_BANK: ClinicPrompt[] = [...PART_1, ...PART_2, ...PART_3, ...PART_4, ...PART_5, ...PART_6];
