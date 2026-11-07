import type { PrepQuestion } from "@/lib/prep/types";
import { PART as x01 } from "./clinical-psychiatry-x01";
import { PART as x02 } from "./clinical-psychiatry-x02";
import { PART as x03 } from "./clinical-psychiatry-x03";
import { PART as x04 } from "./clinical-psychiatry-x04";

/** Clinical psychiatry: written in part files and spread in here. */
export const QUESTIONS: PrepQuestion[] = [...x01, ...x02, ...x03, ...x04];
