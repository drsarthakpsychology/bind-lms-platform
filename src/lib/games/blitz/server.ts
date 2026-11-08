import "server-only";
import { istToday } from "@/lib/learn/engine";
import { awardXp, XP_SOURCES } from "@/lib/leagues/xp";
import { admin, cohortPeers, isMissing, namesFor } from "../server";
import { sign, secretSeed, verify } from "../token";
import { BLITZ_MS, blitzXp, emptyRun, plausible, step, timing, type RunState } from "./engine";
import { blitzDeck, promptOf, questionAt, type BlitzPrompt } from "./questions";
import { loadHistory, record } from "@/lib/history/server";
import { mulberry32 } from "../rng";
import { after } from "next/server";
import { referenceHref } from "@/lib/reference/href";

/**
 * Blitz server. The run lives in a signed token the browser holds, so no
 * read is needed per answer; when blitz_results exists, every answer is also
 * a conditional update on `answered`, so an old token can't be replayed to
 * retry a question. Every time and score is the server's.
 */

const TABLE = "blitz_results";

/** `deck`: bank indexes in answer-history order (absent on old tokens and when there is no history yet). */
type Token = { v: 1; run: string; uid: string; seed: number; start: number; last: number; s: RunState; stored: boolean; deck?: number[] };

/** Run after the response when possible (never delays an answer), else in the background. */
function later(task: () => Promise<unknown>) {
  try {
    after(task);
  } catch {
    void task().catch(() => {});
  }
}

export type Bests = {
  /** Your best score before this moment (0 if none). */
  mine: number;
  /** Best in your batch (or everyone, if you're in no batch). */
  cohort: { score: number; name: string; you: boolean; scope: "batch" | "everyone" } | null;
  stored: boolean;
};

export type StartResult = { ok: true; token: string; question: BlitzPrompt; msLeft: number } | { ok: false; error: string };

export type AnswerResult =
  | {
      ok: true;
      token: string;
      right: boolean;
      /** The right option's index in the question just answered. */
      answer: number;
      why: string;
      learn: { label: string; href: string };
      gained: number;
      levelUp: boolean;
      state: RunState;
      next: BlitzPrompt | null;
      msLeft: number;
    }
  | { ok: false; error: string; over?: boolean };

export type FinishResult =
  | { ok: true; state: RunState; xp: number; xpSaved: boolean; newBest: boolean; bests: Bests }
  | { ok: false; error: string };

function readToken(raw: unknown, uid: string): Token | null {
  const t = verify<Token>(String(raw ?? ""));
  if (!t || t.v !== 1 || t.uid !== uid || typeof t.start !== "number" || !t.s) return null;
  return t;
}

export async function startRun(uid: string): Promise<StartResult> {
  const run = crypto.randomUUID();
  const seed = secretSeed("blitz", run);
  const now = Date.now();
  let stored = false;
  try {
    const { error } = await admin()
      .from(TABLE)
      .insert({ user_id: uid, day: istToday(), score: 0, correct: 0, answered: 0, best_combo: 0, run_id: run, started_at: new Date(now).toISOString() });
    stored = !error;
    if (error && !isMissing(error)) console.warn("blitz start: save failed:", error.message);
  } catch {
    stored = false;
  }
  // Answer history: never-seen questions first, then missed ones, right ones last.
  const history = await loadHistory(uid, "blitz");
  const deck = history.ready && history.map.size ? blitzDeck(history.map, now, mulberry32(seed)) : undefined;
  const token: Token = { v: 1, run, uid, seed, start: now, last: now, s: emptyRun(), stored, ...(deck ? { deck } : {}) };
  return { ok: true, token: sign(token), question: promptOf(questionAt(seed, 0, undefined, deck), 0), msLeft: BLITZ_MS };
}

export async function answerRun(uid: string, raw: unknown, n: number, choice: number): Promise<AnswerResult> {
  const t = readToken(raw, uid);
  if (!t) return { ok: false, error: "This round has expired. Start a new one." };
  if (!Number.isInteger(n) || n !== t.s.answered) return { ok: false, error: "That question was already answered." };
  const now = Date.now();
  const tm = timing(t.start, t.last, now);
  if (!tm.ok) return tm.reason === "over" ? { ok: false, error: "Time's up.", over: true } : { ok: false, error: "Too fast. Read the question first." };
  const q = questionAt(t.seed, n, undefined, t.deck);
  if (!Number.isInteger(choice) || choice < 0 || choice >= q.options.length) return { ok: false, error: "Pick one of the answers." };
  const right = choice === q.answer;
  const { state, gained, levelUp } = step(t.s, right);

  if (t.stored) {
    try {
      const { data, error } = await admin()
        .from(TABLE)
        .update({ score: state.score, correct: state.correct, answered: state.answered, best_combo: state.best })
        .eq("run_id", t.run)
        .eq("user_id", uid)
        .eq("answered", t.s.answered)
        .is("finished_at", null)
        .select("id");
      if (!error && !data?.length) return { ok: false, error: "That question was already answered." };
      if (error) console.warn("blitz answer: save failed:", error.message);
    } catch (e) {
      console.warn("blitz answer: save failed:", e instanceof Error ? e.message : e);
    }
  }

  later(() => record(uid, "blitz", q.id, right));
  const next: Token = { ...t, last: now, s: state };
  const msLeft = Math.max(0, t.start + BLITZ_MS - now);
  return {
    ok: true,
    token: sign(next),
    right,
    answer: q.answer,
    why: q.why,
    learn: { label: q.learn, href: referenceHref(q.learn) },
    gained,
    levelUp,
    state,
    next: msLeft > 0 ? promptOf(questionAt(t.seed, state.answered, undefined, t.deck), state.answered) : null,
    msLeft,
  };
}

export async function finishRun(uid: string, raw: unknown): Promise<FinishResult> {
  const t = readToken(raw, uid);
  if (!t) return { ok: false, error: "This round has expired." };
  let state = t.s;
  if (t.stored) {
    try {
      const db = admin();
      // The stored row is the truth (an older token can't lower or raise it).
      const { data } = await db.from(TABLE).select("score, correct, answered, best_combo").eq("run_id", t.run).eq("user_id", uid).maybeSingle();
      if (data) state = { answered: Number(data.answered), correct: Number(data.correct), score: Number(data.score), best: Number(data.best_combo), combo: 0 };
      await db.from(TABLE).update({ finished_at: new Date().toISOString() }).eq("run_id", t.run).eq("user_id", uid).is("finished_at", null);
    } catch (e) {
      console.warn("blitz finish failed:", e instanceof Error ? e.message : e);
    }
  }
  if (!plausible({ ...state, combo: Math.min(state.combo, state.best) })) return { ok: false, error: "That round couldn't be checked." };
  const xp = blitzXp(state);
  const award = xp > 0 ? await awardXp(uid, XP_SOURCES.blitzRound, xp, t.run) : { ok: false };
  const bests = await loadBests(uid, t.run);
  return { ok: true, state, xp, xpSaved: award.ok, newBest: state.score > 0 && state.score > bests.mine, bests };
}

/** Your best and your batch's best. `exceptRun` leaves out the round just played (for "new best"). */
export async function loadBests(uid: string, exceptRun?: string): Promise<Bests> {
  try {
    const db = admin();
    let mineQ = db.from(TABLE).select("score").eq("user_id", uid).gt("answered", 0).order("score", { ascending: false }).limit(1);
    if (exceptRun) mineQ = mineQ.neq("run_id", exceptRun);
    const peers = await cohortPeers(uid);
    let topQ = db.from(TABLE).select("user_id, score").gt("score", 0).order("score", { ascending: false }).limit(1);
    if (peers) topQ = topQ.in("user_id", peers);
    const [mine, top] = await Promise.all([mineQ, topQ]);
    if (mine.error) return { mine: 0, cohort: null, stored: !isMissing(mine.error) };
    const best = (top.data ?? [])[0] as { user_id: string; score: number } | undefined;
    let cohort: Bests["cohort"] = null;
    if (best) {
      const names = await namesFor([best.user_id]);
      cohort = { score: Number(best.score), name: names.get(best.user_id) ?? "A classmate", you: best.user_id === uid, scope: peers ? "batch" : "everyone" };
    }
    return { mine: Number((mine.data ?? [])[0]?.score ?? 0), cohort, stored: true };
  } catch {
    return { mine: 0, cohort: null, stored: false };
  }
}
