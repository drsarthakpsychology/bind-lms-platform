import type { PrepQuestion } from "@/lib/prep/types";
import { PART as x01 } from "./clinical-psychiatry-x01";
import { PART as x02 } from "./clinical-psychiatry-x02";
import { PART as x03 } from "./clinical-psychiatry-x03";
import { PART as x04 } from "./clinical-psychiatry-x04";
import { PART as x05 } from "./clinical-psychiatry-x05";
import { PART as x06 } from "./clinical-psychiatry-x06";
import { PART as x07 } from "./clinical-psychiatry-x07";
import { PART as x08 } from "./clinical-psychiatry-x08";

/** Clinical psychiatry: written in part files and spread in here. */
export const QUESTIONS: PrepQuestion[] = [...x01, ...x02, ...x03, ...x04, ...x05, ...x06, ...x07, ...x08];
