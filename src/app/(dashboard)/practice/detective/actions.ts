"use server";

import { currentPlayer } from "@/lib/games/server";
import { sign } from "@/lib/games/token";
import { order, requestRng } from "@/lib/history/server";
import { clueOf, deal, judge, poolFor, type DealtRound, type Family } from "@/lib/learn/detective-deal";
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

export type DealResult = { ok: true; token: string; run: string; rounds: DealtRound[] } | { ok: false; error: string };

/** A new run of cases: unseen first, then missed, solved last (answer history). */
export async function dealDetective(family: Family): Promise<DealResult> {
  const me = await currentPlayer();
  if (!me) return { ok: false, error: "Please sign in again." };
  const f: Family = family === "drug" || family === "disorder" ? family : "mixed";
  const run = newRun();
  const ordered = await order(me.id, "detective", poolFor(f).map((c) => c.answer)).catch(() => poolFor(f).map((c) => c.answer));
  const { payload, rounds } = deal(me.id, run, ordered, mask, requestRng(me.id));
  if (!rounds.length) return { ok: false, error: FAIL };
  return { ok: true, token: sign(payload), run, rounds };
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
