"use server";

import { z } from "zod";
import { attemptsFor, rxItem, rxXp, type Answer } from "@/lib/games-sims/rx/game";
import { dealRx, pickRx, runTotals, type RxToken } from "@/lib/games-sims/rx/deal";
import type { Answered, Mode, PublicCase } from "@/lib/games-sims/rx/rules";
import { rxCurrent, rxMask as mask } from "@/lib/games-sims/rx/server";
import { MYSTERIES } from "@/lib/games-sims/rx/content";
import { loadHistory, record, requestRng } from "@/lib/history/server";
import { sign, verify } from "@/lib/games/token";
import { currentUser, gradeAnswers, payXp, saveResult } from "@/lib/games-sims/server/results";
import { oncePerStep } from "@/lib/games-sims/server/run-steps";
import { hintedItems } from "@/lib/hints/server";
import { cappedOutcome, itemKey, POINTS_KEPT } from "@/lib/hints/rules";

/** Rx Detective on the server: a case's answer never reaches the browser before it is picked. */

const FAIL = "That didn't load. Try again.";
const MODES: Mode[] = ["mixed", "chain", "mystery", "puzzle", "review"];

/** Was a hint used on this question in this run? (Counted on the server.) */
function hintedIn(map: Map<string, number>, run: string, id: string): boolean {
  const base = itemKey("rx", run, id);
  return [...map.keys()].some((k) => k === base || k.startsWith(`${base}.`));
}

export type RxDeal = { ok: true; token: string; run: string; cases: PublicCase[] } | { ok: false; error: string };

/** A new run: each kind's cases unseen first, then missed, right ones last (answer history). */
export async function dealRxRun(mode: Mode): Promise<RxDeal> {
  const user = await currentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const m: Mode = MODES.includes(mode) ? mode : "mixed";
  const now = Date.now();
  const run = `${now.toString(36)}${Math.floor(Math.random() * 1e9).toString(36)}`;
  const history = await loadHistory(user.id, "rx").catch(() => ({ ready: false, map: new Map() }));
  const { payload, cases } = dealRx(user.id, run, m, requestRng(user.id, now), history.map, now, mask);
  if (!cases.length) return { ok: false, error: FAIL };
  return { ok: true, token: sign(payload), run, cases };
}

export type RxPick = { ok: true; token: string; step?: { right: boolean; correct: string }; answered?: Answered } | { ok: false; error: string };

/**
 * One pick on the case in play, checked here. A chain step answers with its
 * right option; a case's last pick answers with the whole answer card, and
 * the case is graded for the student model (a hinted one counts for less).
 */
export async function pickRxAnswer(input: { token: string; value: string }): Promise<RxPick> {
  const parsed = z.object({ token: z.string().min(10).max(2000), value: z.string().max(200) }).safeParse(input);
  const user = await currentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const cur = parsed.success ? rxCurrent(user.id, parsed.data.token) : null;
  if (!parsed.success || !cur) return { ok: false, error: FAIL };
  const t = cur.token;
  const res = pickRx(t, cur.ref, parsed.data.value);
  if (!res) return { ok: false, error: FAIL };
  // An old token sent again gets its first result back, not a second try.
  const { result, fresh } = await oncePerStep(user.id, "rx", t.run, `${t.i}.${t.p.length}`, (): RxPick =>
    res.type === "step" ? { ok: true, token: sign(res.next), step: { right: res.right, correct: res.correct } } : { ok: true, token: sign(res.next), answered: res.answered },
  );
  if (fresh && res.type === "case") await gradeCase(user, t.run, res.answer, res.answered.graded.score);
  return result;
}

async function gradeCase(user: { id: string; role: string }, run: string, a: Answer, score: number) {
  // Four options a step (the mysteries carry their own), for the guessing floor.
  const options = a.kind === "mystery" ? (MYSTERIES.find((m) => m.id === a.id)?.options.length ?? 4) : 4;
  let attempts = attemptsFor(a).map((x) => ({ ...x, options }));
  const hinted = await hintedItems(user.id, itemKey("rx", run, "")).catch(() => new Map<string, number>());
  if (hintedIn(hinted, run, a.id)) attempts = attempts.map((x) => ({ ...x, outcome: cappedOutcome(x.outcome, 1) }));
  await Promise.all([gradeAnswers(user, attempts), record(user.id, "rx", rxItem(a.kind, a.id), score >= 1)]);
}

/**
 * A finished run: scored from the server's own grades in the run token
 * (lives, streak, points), stored for the cohort board and paid in XP once
 * per run. A hinted question pays half its XP.
 */
export async function finishRxRun(token: string): Promise<{ ok: boolean; xp: number }> {
  const user = await currentUser();
  if (!user || typeof token !== "string") return { ok: false, xp: 0 };
  const t = verify<RxToken>(token);
  if (!t || t.u !== user.id || !Array.isArray(t.s)) return { ok: false, xp: 0 };
  const s = runTotals(t, user.id, mask);
  // Only a run played to its end counts (every case answered, or out of lives).
  if (!s.total || (s.lives > 0 && s.done.length < t.k.length)) return { ok: false, xp: 0 };
  const { result } = await oncePerStep(user.id, "rx", t.run, "finish", async () => {
    const hinted = await hintedItems(user.id, itemKey("rx", t.run, "")).catch(() => new Map<string, number>());
    const scores = s.done.map((x) => (hintedIn(hinted, t.run, x.ref.id) ? x.score * POINTS_KEPT[1] : x.score));
    const [, xp] = await Promise.all([
      saveResult(user.id, { game: "rx", item: null, score: s.got / s.total, right: s.got, total: s.total, meta: { streak: s.best, points: s.points, lives: s.lives, hints: hinted.size } }),
      payXp(user.id, "rx", rxXp(scores), t.run),
    ]);
    return { ok: true, xp };
  });
  return result;
}
