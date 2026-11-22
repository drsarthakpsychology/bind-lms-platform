import type { Scenario } from "./scenarios";
import { RICH_A } from "./scenario-rich/batch-a";
import { RICH_B } from "./scenario-rich/batch-b";
import { RICH_C } from "./scenario-rich/batch-c";
import { RICH_D } from "./scenario-rich/batch-d";

/**
 * The most used "What would you do?" cases, rebuilt in the rich shape
 * (practice audit 5.2): a starting picture with your role, 4 to 6 graded
 * choices each with its own reason, three hints per step, the concept, the
 * clinical point and common errors. Same ids as the cases they replace, so
 * answer history carries on.
 */
const ALL: Scenario[] = [...RICH_A, ...RICH_B, ...RICH_C, ...RICH_D];

export const RICH_SCENARIOS = new Map(ALL.map((s) => [s.id, s]));

/** Near-duplicates folded into a rich case: no longer dealt (their history stays). */
export const MERGED_AWAY = new Set<string>([
  // Same lesson as the rich wy-f057 (routine, play and family after a disaster).
  "wy-c011",
]);
