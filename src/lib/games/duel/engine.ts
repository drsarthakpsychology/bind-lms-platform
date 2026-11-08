/**
 * Differential Duel match rules (pure). Everything about a match is derived
 * from the stored match row, the stored answers (with SERVER arrival times)
 * and the current server time, so no background job is needed and the
 * browser can never decide the result.
 *
 * Timeline: countdown → round 1 → reveal → round 2 → … → round 5 → over.
 * A round ends when both players have answered or the round clock runs out.
 */

import { mulberry32, permutation } from "../rng";
import { poolFor, type History } from "@/lib/history/order";

export const ROUNDS = 5;
export const COUNTDOWN_MS = 3500;
export const ROUND_MS = 20000;
export const REVEAL_MS = 4000;
/** A player who stops polling this long during a live match has left: forfeit. */
export const LEFT_MS = 12000;
/** Queue: offer the bot after this long. */
export const BOT_AFTER_MS = 20000;
export const DX_POINTS = 100;
export const FEATURE_POINTS = 50;
/** League XP for winning a ranked duel (paid once per match into the ledger as "duel:win"). */
export const WIN_XP = 20;

export type Side = "p1" | "p2";

export type MatchRec = {
  id: string;
  p1: string;
  p2: string | null;
  bot: boolean;
  ranked: boolean;
  status: "waiting" | "active" | "done" | "cancelled";
  items: string[];
  seed: number;
  startedAt: number | null;
  p1Seen: number | null;
  p2Seen: number | null;
  forfeitBy: string | null;
};

export type AnswerRec = { userId: string; round: number; dx: number; feature: number; at: number };

/** Option and feature order for a round (answer = index 0 before shuffling). */
export function roundOrder(seed: number, round: number): { options: number[]; features: number[] } {
  return { options: permutation(seed + round * 7919, 4), features: permutation(seed + round * 104729 + 1, 4) };
}

/** Points for an answer, given the shuffled orders. Feature only counts when the diagnosis is right. */
export function scoreAnswer(seed: number, round: number, dx: number, feature: number): { dxOk: boolean; featureOk: boolean; points: number } {
  const o = roundOrder(seed, round);
  const dxOk = o.options[dx] === 0;
  const featureOk = dxOk && o.features[feature] === 0;
  return { dxOk, featureOk, points: (dxOk ? DX_POINTS : 0) + (featureOk ? FEATURE_POINTS : 0) };
}

/** The bot's answer for a round: decent but beatable, deterministic per match. */
export function botAnswer(seed: number, round: number, skill = 0.6): { dx: number; feature: number; ms: number } {
  const r = mulberry32(seed ^ (round * 2654435761));
  const o = roundOrder(seed, round);
  const rightDx = o.options.indexOf(0);
  const rightF = o.features.indexOf(0);
  const dx = r() < skill ? rightDx : (rightDx + 1 + Math.floor(r() * 3)) % 4;
  const feature = r() < skill ? rightF : (rightF + 1 + Math.floor(r() * 3)) % 4;
  const ms = 5000 + Math.floor(r() * 9000);
  return { dx, feature, ms };
}

export type RoundTiming = { start: number; deadline: number; end: number | null };

export type Phase =
  | { kind: "waiting" }
  | { kind: "countdown"; until: number }
  | { kind: "round"; round: number; until: number }
  | { kind: "reveal"; round: number; until: number }
  | { kind: "over"; at: number };

export type PlayerTotals = { points: number; ms: number; answered: number };

export type MatchState = {
  phase: Phase;
  rounds: RoundTiming[];
  /** answers per round per side (bot included), only those that count (on time). */
  answers: { p1: (AnswerRec | null)[]; p2: (AnswerRec | null)[] };
  totals: { p1: PlayerTotals; p2: PlayerTotals };
  /** Final outcome once over (or someone left). */
  outcome: null | { winner: Side | null; reason: "points" | "speed" | "draw" | "forfeit"; forfeitSide: Side | null };
};

function sideOf(m: MatchRec, userId: string): Side | null {
  return m.p1 === userId ? "p1" : m.p2 === userId ? "p2" : null;
}

export function botRec(m: MatchRec, round: number, start: number): AnswerRec | null {
  if (!m.bot) return null;
  const b = botAnswer(m.seed, round);
  return { userId: "bot", round, dx: b.dx, feature: b.feature, at: start + b.ms };
}

/** Derive the whole match state at `now`. */
export function matchState(m: MatchRec, all: AnswerRec[], now: number): MatchState {
  const empty: PlayerTotals = { points: 0, ms: 0, answered: 0 };
  const base: MatchState = { phase: { kind: "waiting" }, rounds: [], answers: { p1: [], p2: [] }, totals: { p1: { ...empty }, p2: { ...empty } }, outcome: null };
  if (m.status === "waiting" || m.status === "cancelled" || m.startedAt === null) return base;

  const rounds: RoundTiming[] = [];
  const ans = { p1: [] as (AnswerRec | null)[], p2: [] as (AnswerRec | null)[] };
  let start = m.startedAt + COUNTDOWN_MS;
  let phase: Phase | null = now < start ? { kind: "countdown", until: start } : null;
  let overAt = 0;

  for (let r = 0; r < m.items.length; r++) {
    const deadline = start + ROUND_MS;
    const find = (side: Side): AnswerRec | null => {
      if (side === "p2" && m.bot) {
        const b = botRec(m, r, start);
        return b && b.at <= deadline && b.at <= now ? b : null;
      }
      const uid = side === "p1" ? m.p1 : m.p2;
      const a = all.find((x) => x.userId === uid && x.round === r);
      return a && a.at >= start && a.at <= deadline && a.at <= now ? a : null;
    };
    const a1 = find("p1");
    const a2 = find("p2");
    ans.p1.push(a1);
    ans.p2.push(a2);
    let end: number | null = a1 && a2 ? Math.max(a1.at, a2.at) : deadline <= now ? deadline : null;
    if (end !== null && end > deadline) end = deadline;
    rounds.push({ start, deadline, end });
    if (!phase && end === null) phase = { kind: "round", round: r, until: deadline };
    if (end === null) break;
    const next = end + REVEAL_MS;
    if (!phase && now < next) phase = r === m.items.length - 1 ? { kind: "over", at: end } : { kind: "reveal", round: r, until: next };
    overAt = end;
    start = next;
  }
  if (!phase) phase = { kind: "over", at: overAt };

  const totals = { p1: { ...empty }, p2: { ...empty } };
  for (const side of ["p1", "p2"] as const) {
    ans[side].forEach((a, r) => {
      const t = rounds[r];
      if (!t || t.end === null) return; // round still open: hidden
      if (a) {
        const s = scoreAnswer(m.seed, r, a.dx, a.feature);
        totals[side].points += s.points;
        totals[side].ms += Math.max(0, a.at - t.start);
        totals[side].answered++;
      } else totals[side].ms += ROUND_MS;
    });
  }

  let outcome: MatchState["outcome"] = null;
  // Someone left or quit while the match was live: they lose, no matter the score.
  const leftSide = forfeitSide(m, now, phase);
  if (leftSide) {
    outcome = { winner: leftSide === "p1" ? "p2" : "p1", reason: "forfeit", forfeitSide: leftSide };
    phase = { kind: "over", at: now };
  } else if (phase.kind === "over") {
    const a = totals.p1;
    const b = totals.p2;
    if (a.points !== b.points) outcome = { winner: a.points > b.points ? "p1" : "p2", reason: "points", forfeitSide: null };
    else if (a.ms !== b.ms) outcome = { winner: a.ms < b.ms ? "p1" : "p2", reason: "speed", forfeitSide: null };
    else outcome = { winner: null, reason: "draw", forfeitSide: null };
  }
  return { phase, rounds, answers: ans, totals, outcome };
}

function forfeitSide(m: MatchRec, now: number, phase: Phase): Side | null {
  if (m.forfeitBy) return sideOf(m, m.forfeitBy);
  if (phase.kind === "over" || m.status !== "active") return null;
  if (m.p1Seen !== null && now - m.p1Seen > LEFT_MS) return "p1";
  if (!m.bot && m.p2Seen !== null && now - m.p2Seen > LEFT_MS) return "p2";
  return null;
}

/** May this player answer this round right now? */
export function canAnswer(m: MatchRec, s: MatchState, userId: string, round: number): boolean {
  const side = sideOf(m, userId);
  if (!side || m.status !== "active" || s.outcome) return false;
  if (s.phase.kind !== "round" || s.phase.round !== round) return false;
  return s.answers[side][round] === null;
}

/**
 * Choose a match's rounds: no repeats, mixed topics where possible. With an
 * answer history (src/lib/history), items never seen come first, then missed
 * ones, and right ones only when the rest run short.
 */
export function pickItems(ids: { id: string; topic: string }[], seed: number, n = ROUNDS, history?: History, now = 0): string[] {
  const base = permutation(seed, ids.length).map((i) => ids[i]);
  const order = history?.size ? poolFor(base, (x) => x.id, history, now, mulberry32((seed ^ 0x5bd1e995) >>> 0), n) : base;
  const out: string[] = [];
  const topics = new Set<string>();
  for (const it of order) {
    if (out.length >= n) break;
    if (!topics.has(it.topic)) {
      out.push(it.id);
      topics.add(it.topic);
    }
  }
  for (const it of order) if (out.length < n && !out.includes(it.id)) out.push(it.id);
  return out;
}
