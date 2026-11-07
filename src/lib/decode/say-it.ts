/** The "Say it clinically" phrase bank: everyday and Indian-language phrases into case-sheet language. */
import { SAY_1 } from "./say-it-1";
import { SAY_2 } from "./say-it-2";
import type { SayIt } from "./say-it-helpers";

export type { SayIt } from "./say-it-helpers";

export const SAY_IT: SayIt[] = [...SAY_1, ...SAY_2];
