"use server";

import { z } from "zod";
import { requireStudentApi } from "@/lib/auth/api-guard";
import { sign, verify } from "@/lib/games/token";
import { loadHistory, record, requestRng } from "@/lib/history/server";
import { buildTermsRound, checkPick, optionsFor, questionOf, type TermsQuestion, type TermsReveal } from "@/lib/learn/terms-round";

/**
 * "Say it clinically" on the server. The round lives in a signed token (ids
 * and the options shown, never the answers); each answer is checked here and
 * written to the answer history here.
 */

/** The round: who, the question ids, a seed for each question's options, when. */
type Round = { u: string; q: string[]; s: number; t: number };
const at = (r: Round, i: number) => (r.q[i] ? { id: r.q[i], options: optionsFor(r.q[i], r.s + i) } : null);
const ROUND_LIFE_MS = 6 * 3600_000;
const FAIL = "That didn't load. Try again.";

async function who(): Promise<string | null> {
  const access = await requireStudentApi({ path: "/practice/terms", flag: "learn" });
  return access.ok ? access.profile.id : null;
}

export type TermsStart = { ok: true; token: string; total: number; question: TermsQuestion } | { ok: false; error: string };

export async function startTermsRound(): Promise<TermsStart> {
  const uid = await who();
  if (!uid) return { ok: false, error: "Please sign in again." };
  const now = Date.now();
  const history = await loadHistory(uid, "say-it").catch(() => ({ ready: false, map: new Map() }));
  const rng = requestRng(uid, now);
  const round: Round = { u: uid, q: buildTermsRound(history.map, now, rng), s: Math.floor(rng() * 2 ** 31), t: now };
  const q0 = at(round, 0);
  const first = q0 ? questionOf(q0) : null;
  if (!first) return { ok: false, error: FAIL };
  return { ok: true, token: sign(round), total: round.q.length, question: first };
}

export type TermsAnswer = { ok: true; reveal: TermsReveal; next: TermsQuestion | null } | { ok: false; error: string };

const answerSchema = z.object({ token: z.string().min(10).max(2000), index: z.number().int().min(0).max(40), pick: z.string().max(300) });

export async function answerTerms(input: { token: string; index: number; pick: string }): Promise<TermsAnswer> {
  const parsed = answerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: FAIL };
  const uid = await who();
  if (!uid) return { ok: false, error: "Please sign in again." };
  const round = verify<Round>(parsed.data.token);
  if (!round || round.u !== uid || Date.now() - round.t > ROUND_LIFE_MS) return { ok: false, error: "This round has ended. Start a new one." };
  const q = at(round, parsed.data.index);
  const reveal = q ? checkPick(q, parsed.data.pick) : null;
  if (!q || !reveal) return { ok: false, error: FAIL };
  await record(uid, "say-it", q.id, reveal.correct).catch(() => false);
  const nq = at(round, parsed.data.index + 1);
  return { ok: true, reveal, next: nq ? questionOf(nq) : null };
}
