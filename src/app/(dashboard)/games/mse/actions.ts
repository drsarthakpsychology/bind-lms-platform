"use server";

import { z } from "zod";
import { dealMse, nextExcerpt, tagMse } from "@/lib/games-sims/mse/deal";
import type { Excerpt } from "@/lib/games-sims/mse/excerpts";
import { EXCERPT_RIGHT, type FindingReveal, type Level, type PublicExcerpt } from "@/lib/games-sims/mse/rules";
import { mseCurrent, mseMask as mask } from "@/lib/games-sims/mse/server";
import { DOMAINS, TERMS, type Domain } from "@/lib/games-sims/mse/terms";
import { loadHistory, record, requestRng } from "@/lib/history/server";
import { sign } from "@/lib/games/token";
import { currentUser, gradeAnswers, saveResult } from "@/lib/games-sims/server/results";
import { oncePerStep } from "@/lib/games-sims/server/run-steps";
import { hintedItems } from "@/lib/hints/server";
import { cappedOutcome, itemKey, POINTS_KEPT } from "@/lib/hints/rules";

/** MSE Lab on the server: a finding's answer never reaches the browser before it is tagged. */

const FAIL = "That didn't load. Try again.";

export type MseDeal = { ok: true; token: string; run: string; excerpt: PublicExcerpt } | { ok: false; error: string };

/** A new round at a level: an excerpt not seen yet first, then a missed one (answer history). */
export async function dealMseRound(level: Level): Promise<MseDeal> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const now = Date.now();
  const run = `${now.toString(36)}${Math.floor(Math.random() * 1e9).toString(36)}`;
  const history = await loadHistory(user.id, "mse-lab").catch(() => ({ ready: false, map: new Map() }));
  const d = dealMse(user.id, run, level, requestRng(user.id, now), history.map, now, mask);
  return d ? { ok: true, token: sign(d.payload), run, excerpt: d.excerpt } : { ok: false, error: FAIL };
}

export type MseTag = { ok: true; token: string; reveal: FindingReveal; excerptScore?: number; next?: PublicExcerpt | null } | { ok: false; error: string };

const tagSchema = z.object({ token: z.string().min(10).max(4000), domain: z.string().max(20), term: z.string().max(30) });

/**
 * One tag on the finding in play, checked here. The last finding of an
 * excerpt also grades the excerpt for the student model, stores it for the
 * board and deals the next excerpt (null when the round is over).
 */
export async function tagMseFinding(input: { token: string; domain: string; term: string }): Promise<MseTag> {
  const parsed = tagSchema.safeParse(input);
  const user = await currentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const cur = parsed.success ? mseCurrent(user.id, parsed.data.token) : null;
  if (!parsed.success || !cur) return { ok: false, error: FAIL };
  const t = cur.token;
  const domain = DOMAINS.some((d) => d.id === parsed.data.domain) ? (parsed.data.domain as Domain) : null;
  const res = tagMse(t, cur.excerpt, { domain, term: parsed.data.term });
  if (!res) return { ok: false, error: FAIL };
  const { result, fresh } = await oncePerStep(user.id, "mse", t.run, `${t.k.length}.${t.f}`, async (): Promise<MseTag> => {
    if (!res.excerptDone) return { ok: true, token: sign(res.next), reveal: res.reveal };
    const now = Date.now();
    const history = await loadHistory(user.id, "mse-lab").catch(() => ({ ready: false, map: new Map() }));
    const n = nextExcerpt(res.next, requestRng(user.id, now), history.map, now, mask);
    return { ok: true, token: sign(n ? n.payload : res.next), reveal: res.reveal, excerptScore: res.excerptDone.score, next: n ? n.excerpt : null };
  });
  if (fresh && res.excerptDone) await gradeExcerpt(user, t.run, res.excerptDone.excerpt, res.excerptDone.scores, res.excerptDone.chosen, res.next.b, t.lv);
  return result;
}

/** A finished excerpt, from the server's own grades: student model, board and answer history. A finding with a hint counts for less. */
async function gradeExcerpt(user: { id: string; role: string }, run: string, e: Excerpt, scores: number[], chosen: (string | null)[], streak: number, level: Level) {
  const hinted = await hintedItems(user.id, itemKey("mse", run, e.id, "")).catch(() => new Map<string, number>());
  const used = (i: number) => (hinted.has(itemKey("mse", run, e.id, i)) ? 1 : 0);
  const label = (id: string | null) => (id ? ((TERMS as Record<string, { label: string }>)[id]?.label ?? null) : null);
  await gradeAnswers(
    user,
    e.findings.map((f, i) => ({
      skill: e.skill,
      item: `mse:${e.id}:${i}`,
      outcome: cappedOutcome(scores[i] ?? 0, used(i)),
      options: 1 + f.o.filter((o) => o !== f.a).length,
      chosen: label(chosen[i] ?? null),
      correct: TERMS[f.a].label,
    })),
  );
  const right = scores.reduce((a, s, i) => a + (used(i) ? s * POINTS_KEPT[1] : s), 0);
  const score = right / Math.max(1, e.findings.length);
  await Promise.all([
    saveResult(user.id, { game: "mse", item: e.id, score, right, total: e.findings.length, meta: { streak, level } }),
    // Answer history: the excerpt, right at EXCERPT_RIGHT or above.
    record(user.id, "mse-lab", e.id, score >= EXCERPT_RIGHT),
  ]);
}
