import type { ClinicPrompt } from "../clinic";
import { PART_1 } from "./part-1";
import { PART_2 } from "./part-2";
import { PART_3 } from "./part-3";

/** Authored Clinic detective cases, appended after the core set. */
export const CLINIC_BANK: ClinicPrompt[] = [...PART_1, ...PART_2, ...PART_3];
