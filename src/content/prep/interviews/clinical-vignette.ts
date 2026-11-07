import type { InterviewQuestion } from "@/lib/prep/types";
import { VIGNETTE_1 } from "./clinical-vignette-1";
import { VIGNETTE_2 } from "./clinical-vignette-2";

/** Mock interview bank · clinical-vignette. Ordered from foundation (1) to advanced (4). */
export const INTERVIEWS: InterviewQuestion[] = [...VIGNETTE_1, ...VIGNETTE_2].sort((a, b) => a.difficulty - b.difficulty);
