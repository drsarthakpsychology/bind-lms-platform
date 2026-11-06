import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS_1 } from "./ugc-paper1-1";
import { QUESTIONS_2 } from "./ugc-paper1-2";
import { QUESTIONS_3 } from "./ugc-paper1-3";

/** Question bank · ugc-paper1 (official 10 units). Parts live in ugc-paper1-*.ts. */
export const QUESTIONS: PrepQuestion[] = [...QUESTIONS_1, ...QUESTIONS_2, ...QUESTIONS_3];
