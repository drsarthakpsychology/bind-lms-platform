import type { DuelItem } from "./items";
import { DUEL_D1 } from "./items-d1";
import { DUEL_D2 } from "./items-d2";
import { DUEL_D3 } from "./items-d3";
import { DUEL_D4 } from "./items-d4";
import { DUEL_D5 } from "./items-d5";
import { DUEL_D6 } from "./items-d6";
import { DUEL_D7 } from "./items-d7";
import { DUEL_D8 } from "./items-d8";

/** Every newer Duel round file, in id order. */
export const DUEL_MORE: DuelItem[] = [...DUEL_D1, ...DUEL_D2, ...DUEL_D3, ...DUEL_D4, ...DUEL_D5, ...DUEL_D6, ...DUEL_D7, ...DUEL_D8];
