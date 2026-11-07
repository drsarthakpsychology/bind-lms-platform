import type { PrepQuestion } from "@/lib/prep/types";
import { PART as x01 } from "./psychopharmacology-x01";
import { PART as x02 } from "./psychopharmacology-x02";
import { PART as x03 } from "./psychopharmacology-x03";
import { PART as x04 } from "./psychopharmacology-x04";

/** Psychopharmacology: written in part files and spread in here. Ordered from foundations (difficulty 1) to entrance-topper level (difficulty 4). */
export const QUESTIONS: PrepQuestion[] = [...x01, ...x02, ...x03, ...x04].sort((a, b) => a.difficulty - b.difficulty);
