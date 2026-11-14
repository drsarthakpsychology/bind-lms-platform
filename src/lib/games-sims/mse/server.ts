import "server-only";
import { secretSeed, verify } from "@/lib/games/token";
import { currentExcerpt, type Mask, type MseToken } from "./deal";
import type { Excerpt } from "./excerpts";

/** The secret mask that hides each excerpt's number in the round token. */
export const mseMask: Mask = (run, round) => secretSeed("mse", run, round);

/** The excerpt and finding in play, for this student only (server only: never send the excerpt to the browser). */
export function mseCurrent(userId: string, token: unknown): { excerpt: Excerpt; idx: number; run: string; token: MseToken } | null {
  if (typeof token !== "string") return null;
  const t = verify<MseToken>(token);
  const e = currentExcerpt(t, userId, mseMask);
  return t && e ? { excerpt: e, idx: t.f, run: t.run, token: t } : null;
}
