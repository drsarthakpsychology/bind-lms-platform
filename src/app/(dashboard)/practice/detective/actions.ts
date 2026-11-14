"use server";

import { currentPlayer } from "@/lib/games/server";
import { sign } from "@/lib/games/token";
import { loadHistory, requestRng } from "@/lib/history/server";
import { cleanItem, mergeHistory, type HistoryRow } from "@/lib/history/order";
import { freshRound, arrangeCases, type CaseMark } from "@/lib/cases/fresh";
import { ownerTag } from "@/lib/cases/progress";
import { clueOf, deal, judge, poolFor, ROUNDS, type DealtRound, type Family } from "@/lib/learn/detective-deal";
import { detectiveCase, detectiveMask as mask } from "@/lib/learn/detective-server";

/** Clinic detective on the server: the answer and the clues not yet opened never reach the browser early. */

const FAIL = "That didn't load. Try again.";

function newRun() {
  return `${Date.now().toString(36)}${Math.floor(Math.random() * 1e9).toString(36)}`;
}

async function caseFor(token: unknown, round: unknown) {
  const me = await currentPlayer();
  return me ? detectiveCase(me.id, token, round) : null;
}

export type DealResult = { ok: true; token: string; run: string; rounds: DealtRound[]; marks: CaseMark[]; recycled: boolean } | { ok: false; error: string };

/**
 * A new run of cases (src/lib/cases/fresh.ts): only cases never done while
 * any are left (new this week first), so a run can be short; once every case
 * is done, the hardest come back (`recycled`). `seen` is this browser's copy
 * of the answer history, used alongside the server's.
 */
export async function dealDetective(family: Family, seen: unknown = []): Promise<DealResult> {
  const me = await currentPlayer();
  if (!me) return { ok: false, error: "Please sign in again." };
  const f: Family = family === "drug" || family === "disorder" ? family : "mixed";
  const run = newRun();
  const ids = poolFor(f).map((c) => c.answer);
  const book = await loadHistory(me.id, "detective", ids).catch(() => ({ ready: false, map: new Map<string, HistoryRow>() }));
  const now = Date.now();
  const local = new Map<string, HistoryRow>();
  for (const x of Array.isArray(seen) ? seen.slice(0, 200) : []) {
    const item = cleanItem(x);
    if (item) local.set(item, { item, seen: 1, ok: null, at: 0, due: null });
  }
  const history = mergeHistory(local, book.map);
  const opts = { history, now, student: ownerTag(me.id), rng: requestRng(me.id) };
  const picked = freshRound(ids, (x) => x, ROUNDS, opts);
  const mark = new Map(arrangeCases(ids, (x) => x, opts).list.map((x) => [x.id, x.mark]));
  const { payload, rounds } = deal(me.id, run, picked.round, mask, requestRng(me.id));
  if (!rounds.length) return { ok: false, error: FAIL };
  return { ok: true, token: sign(payload), run, rounds, marks: picked.round.slice(0, rounds.length).map((id) => mark.get(id) ?? "new"), recycled: picked.recycled };
}

/** Open clue n (2 to 4) of a round. */
export async function detectiveClue(token: string, round: number, n: number): Promise<{ ok: true; clue: string } | { ok: false; error: string }> {
  const c = await caseFor(token, round);
  const clue = c ? clueOf(c, n) : null;
  return clue ? { ok: true, clue } : { ok: false, error: FAIL };
}

/** After a round ends: every clue, for "Show the other clues". */
export async function detectiveAllClues(token: string, round: number): Promise<{ ok: true; clues: string[] } | { ok: false; error: string }> {
  const c = await caseFor(token, round);
  return c ? { ok: true, clues: [...c.clues] } : { ok: false, error: FAIL };
}

/** Check a guess. The answer comes back only when right, or when the round is over. */
export async function detectiveGuess(token: string, round: number, guess: string, final: boolean): Promise<{ ok: true; right: boolean; answer: string | null } | { ok: false; error: string }> {
  const c = await caseFor(token, round);
  if (!c || typeof guess !== "string") return { ok: false, error: FAIL };
  return { ok: true, ...judge(c, guess, final === true) };
}
