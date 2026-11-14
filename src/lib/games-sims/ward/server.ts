import "server-only";
import { verify } from "@/lib/games/token";
import { currentDecision } from "./engine";
import { soloState, type WardToken } from "./deal";

/** The decision in play in a solo game, for this student only (server only). */
export function wardCurrent(userId: string, token: unknown): { run: string; campaign: string; decision: string } | null {
  if (typeof token !== "string") return null;
  const t = verify<WardToken>(token);
  const s = soloState(t, userId);
  const d = s ? currentDecision(s.c, s.st) : null;
  return t && s && d ? { run: t.run, campaign: s.c.id, decision: d.id } : null;
}
