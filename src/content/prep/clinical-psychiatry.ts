import type { PrepQuestion } from "@/lib/prep/types";
import { PART as x01 } from "./clinical-psychiatry-x01";
import { PART as x02 } from "./clinical-psychiatry-x02";
import { PART as x03 } from "./clinical-psychiatry-x03";
import { PART as x04 } from "./clinical-psychiatry-x04";
import { PART as x05 } from "./clinical-psychiatry-x05";
import { PART as x06 } from "./clinical-psychiatry-x06";
import { PART as x07 } from "./clinical-psychiatry-x07";
import { PART as x08 } from "./clinical-psychiatry-x08";
import { PART as x09 } from "./clinical-psychiatry-x09";
import { PART as x10 } from "./clinical-psychiatry-x10";
import { PART as x11 } from "./clinical-psychiatry-x11";
import { PART as x12 } from "./clinical-psychiatry-x12";
import { PART as x13 } from "./clinical-psychiatry-x13";
import { PART as x14 } from "./clinical-psychiatry-x14";

/** Clinical psychiatry: written in part files and spread in here. */
export const QUESTIONS: PrepQuestion[] = [...x01, ...x02, ...x03, ...x04, ...x05, ...x06, ...x07, ...x08, ...x09, ...x10, ...x11, ...x12, ...x13, ...x14];
