import type { PrepQuestion } from "@/lib/prep/types";
import { PART as x01 } from "./psychopharmacology-x01";
import { PART as x02 } from "./psychopharmacology-x02";
import { PART as x03 } from "./psychopharmacology-x03";
import { PART as x04 } from "./psychopharmacology-x04";
import { PART as x05 } from "./psychopharmacology-x05";
import { PART as x06 } from "./psychopharmacology-x06";
import { PART as x07 } from "./psychopharmacology-x07";
import { PART as x08 } from "./psychopharmacology-x08";
import { PART as x09 } from "./psychopharmacology-x09";
import { PART as x10 } from "./psychopharmacology-x10";
import { PART as x11 } from "./psychopharmacology-x11";
import { PART as x12 } from "./psychopharmacology-x12";

/** Psychopharmacology: written in part files and spread in here. Ordered from foundations (difficulty 1) to entrance-topper level (difficulty 4). */
export const QUESTIONS: PrepQuestion[] = [...x01, ...x02, ...x03, ...x04, ...x05, ...x06, ...x07, ...x08, ...x09, ...x10, ...x11, ...x12].sort((a, b) => a.difficulty - b.difficulty);
