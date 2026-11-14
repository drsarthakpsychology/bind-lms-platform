import "server-only";
import { secretSeed, verify } from "@/lib/games/token";
import { current, type CaseRef, type Mask, type RxToken } from "./deal";

/** The secret mask that hides each case's number in the run token. */
export const rxMask: Mask = (run, round) => secretSeed("rx", run, round);

/** The case in play and its step, for this student only (server only: never send `id` to the browser). */
export function rxCurrent(userId: string, token: unknown): { ref: CaseRef; step: number; run: string; token: RxToken } | null {
  if (typeof token !== "string") return null;
  const t = verify<RxToken>(token);
  const ref = current(t, userId, rxMask);
  return t && ref ? { ref, step: t.p.length, run: t.run, token: t } : null;
}
