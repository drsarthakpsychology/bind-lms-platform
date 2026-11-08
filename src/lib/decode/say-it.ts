/** The "Say it clinically" phrase bank: everyday and Indian-language phrases into case-sheet language. */
import { SAY_1 } from "./say-it-1";
import { SAY_2 } from "./say-it-2";
import { SAY_3 } from "./say-it-3";
import { SAY_4 } from "./say-it-4";
import { SAY_5 } from "./say-it-5";
import { SAY_6 } from "./say-it-6";
import type { SayIt } from "./say-it-helpers";

export type { SayIt } from "./say-it-helpers";

export const SAY_IT: SayIt[] = [...SAY_1, ...SAY_2, ...SAY_3, ...SAY_4, ...SAY_5, ...SAY_6];
