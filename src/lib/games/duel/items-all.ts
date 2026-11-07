import type { DuelItem } from "./items";
import { DUEL_D1 } from "./items-d1";
import { DUEL_D2 } from "./items-d2";
import { DUEL_D3 } from "./items-d3";

/** Every newer Duel round file, in id order. */
export const DUEL_MORE: DuelItem[] = [...DUEL_D1, ...DUEL_D2, ...DUEL_D3];
