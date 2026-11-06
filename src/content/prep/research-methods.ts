import type { PrepQuestion } from "@/lib/prep/types";
import { QUESTIONS as part1 } from "./research-methods-1";
import { QUESTIONS as part2 } from "./research-methods-2";
import { QUESTIONS as part3 } from "./research-methods-3";
import { QUESTIONS as part4 } from "./research-methods-4";
import { QUESTIONS as part5 } from "./research-methods-5";
import { QUESTIONS as part6 } from "./research-methods-6";
import { QUESTIONS as part7 } from "./research-methods-7";

/** Question bank · research-methods. Parts live in research-methods-<n>.ts. */
export const QUESTIONS: PrepQuestion[] = [...part1, ...part2, ...part3, ...part4, ...part5, ...part6, ...part7];
