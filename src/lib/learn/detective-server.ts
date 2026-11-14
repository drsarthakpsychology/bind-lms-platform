import "server-only";
import { secretSeed, verify } from "@/lib/games/token";
import { caseAt, type DealToken, type Mask } from "./detective-deal";
import type { Case } from "./detective";

/** The secret mask that hides each round's case number in the deal token. */
export const detectiveMask: Mask = (run, round) => secretSeed("detective", run, round);

/** The case behind a round of a signed deal, for this student only (server only: never send `answer` to the browser). */
export function detectiveCase(userId: string, token: unknown, round: unknown): Case | null {
  if (typeof token !== "string" || typeof round !== "number") return null;
  return caseAt(verify<DealToken>(token), userId, round, detectiveMask);
}
