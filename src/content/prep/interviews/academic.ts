import type { InterviewQuestion } from "@/lib/prep/types";
import { ACADEMIC_1 } from "./academic-1";
import { ACADEMIC_2 } from "./academic-2";

/** Mock interview bank · academic. Ordered from foundation (1) to advanced (4). */
export const INTERVIEWS: InterviewQuestion[] = [...ACADEMIC_1, ...ACADEMIC_2].sort((a, b) => a.difficulty - b.difficulty);
