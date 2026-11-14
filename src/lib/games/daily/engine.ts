/**
 * Daily Case rules. Pure (no I/O, no clock, no randomness) so the server can
 * replay a stored move log and get the same answer every time, and so every
 * rule is unit-tested.
 *
 * - The case opens on clue 1. Each wrong guess shows WHY it is wrong (a
 *   criterion-level reason) and then reveals the next clue.
 * - The player may reveal the next clue, or order an investigation; each
 *   costs one clue point. From clue 4 on, a guess must come first (a wrong
 *   guess opens the next clue), so clue spam turns into practice.
 * - A wrong guess with all 6 clues showing ends the case.
 * - Score: 100 on clue 1 with nothing ordered, minus 15 per clue point used,
 *   at least 10 when solved, then minus 10 per hint (never below 0). Unsolved
 *   but a guess hit the right DSM chapter (before using the chapter hint): 15.
 * - Hints are counted and charged by src/lib/hints (3 free a day, then spare
 *   or bought ones); this file only knows how many this case used.
 */

import { CHAPTERS, diagnosisById, normaliseName } from "../diagnoses";
import { CASE_SCORE_PER_HINT, clueOpens } from "@/lib/hints/rules";
import type { DailyCase } from "./types";
import { orderByHistory, tierOf, type HistoryRow } from "@/lib/history/order";

export const MAX_CLUES = 6;
export const MAX_HINTS = 2;
export const MAX_LOG = 40;

export type Action = { t: "clue" } | { t: "inv"; i: number } | { t: "guess"; dx: string } | { t: "hint" } | { t: "giveup" };

export type GuessResult = { dx: string; ok: boolean; sameChapter: boolean; reason: string };
export type Status = "playing" | "solved" | "lost";

/** One square of the share grid, in the order things happened. */
export type Mark = "clue" | "inv" | "hint" | "near" | "miss" | "hit";

export type Progress = {
  clues: number;
  invs: number[];
  guesses: GuessResult[];
  hints: number;
  status: Status;
  /** A wrong guess in the right chapter, made before the chapter hint. */
  chapterHit: boolean;
  marks: Mark[];
};

export function pointsUsed(p: Pick<Progress, "clues" | "invs">): number {
  return p.clues - 1 + p.invs.length;
}

export function scoreOf(p: Progress): number {
  if (p.status === "solved") return Math.max(0, Math.max(10, 100 - 15 * pointsUsed(p)) - CASE_SCORE_PER_HINT * p.hints);
  if (p.status === "lost") return p.chapterHit ? 15 : 0;
  return 0;
}

export function isCorrect(c: DailyCase, dx: string): boolean {
  if (dx === c.answer) return true;
  const g = diagnosisById(dx);
  if (!g) return false;
  const names = new Set(c.synonyms.map(normaliseName));
  return c.synonyms.includes(dx) || names.has(normaliseName(g.name)) || g.aka.some((a) => names.has(normaliseName(a)));
}

/** Why a guess is wrong: the case's own reason for a look-alike, else the criterion the guess needs. */
export function wrongReason(c: DailyCase, dx: string): { reason: string; sameChapter: boolean } {
  const g = diagnosisById(dx);
  const sameChapter = g?.chapter === c.chapter;
  const own = c.differentials.find((x) => x.dx === dx);
  if (own) return { reason: own.whyNot, sameChapter };
  if (!g) return { reason: "That isn't on the list.", sameChapter: false };
  const lead = sameChapter ? `Right chapter (${CHAPTERS[c.chapter].name}), wrong disorder. ` : "";
  return { reason: `${lead}${g.name} needs ${g.needs} The clues so far don't show that.`, sameChapter };
}

export function start(): Progress {
  return { clues: 1, invs: [], guesses: [], hints: 0, status: "playing", chapterHit: false, marks: [] };
}

/**
 * Can "Next clue" open the next clue now? From clue 4 on, a guess is needed
 * first. A wrong guess itself opens the next clue, so from clue 3 on the way
 * forward is always a guess.
 */
export function canOpenClue(p: Pick<Progress, "clues" | "status">): boolean {
  return p.status === "playing" && p.clues < MAX_CLUES && clueOpens(p.clues + 1, false);
}

/** Apply one move. Invalid moves return the same object (so callers can detect a no-op). */
export function apply(c: DailyCase, p: Progress, a: Action): Progress {
  if (p.status !== "playing") return p;
  switch (a.t) {
    case "clue":
      if (p.clues >= MAX_CLUES || !canOpenClue(p)) return p;
      return { ...p, clues: p.clues + 1, marks: [...p.marks, "clue"] };
    case "inv":
      if (!Number.isInteger(a.i) || a.i < 0 || a.i >= c.investigations.length || p.invs.includes(a.i)) return p;
      return { ...p, invs: [...p.invs, a.i], marks: [...p.marks, "inv"] };
    case "hint":
      if (p.hints >= MAX_HINTS) return p;
      return { ...p, hints: p.hints + 1, marks: [...p.marks, "hint"] };
    case "giveup":
      return { ...p, status: "lost" };
    case "guess": {
      if (!diagnosisById(a.dx) || p.guesses.some((g) => g.dx === a.dx)) return p;
      if (isCorrect(c, a.dx)) {
        return { ...p, status: "solved", guesses: [...p.guesses, { dx: a.dx, ok: true, sameChapter: true, reason: "" }], marks: [...p.marks, "hit"] };
      }
      const { reason, sameChapter } = wrongReason(c, a.dx);
      const guesses = [...p.guesses, { dx: a.dx, ok: false, sameChapter, reason }];
      const chapterHit = p.chapterHit || (sameChapter && p.hints === 0);
      const marks: Mark[] = [...p.marks, sameChapter ? "near" : "miss"];
      if (p.clues >= MAX_CLUES) return { ...p, guesses, chapterHit, marks, status: "lost" };
      return { ...p, guesses, chapterHit, marks, clues: p.clues + 1 };
    }
  }
}

/** Keep only well-formed moves (the log may come from the browser). */
export function cleanLog(raw: unknown): Action[] {
  if (!Array.isArray(raw)) return [];
  const out: Action[] = [];
  for (const x of raw.slice(0, MAX_LOG)) {
    if (!x || typeof x !== "object") continue;
    const r = x as Record<string, unknown>;
    if (r.t === "clue" || r.t === "hint" || r.t === "giveup") out.push({ t: r.t });
    else if (r.t === "inv" && typeof r.i === "number") out.push({ t: "inv", i: r.i });
    else if (r.t === "guess" && typeof r.dx === "string" && r.dx.length < 60) out.push({ t: "guess", dx: r.dx });
  }
  return out;
}

/** Replay a log from the start, dropping moves that change nothing. */
export function replay(c: DailyCase, log: Action[]): { progress: Progress; log: Action[] } {
  let p = start();
  const kept: Action[] = [];
  for (const a of log) {
    const next = apply(c, p, a);
    if (next !== p) {
      kept.push(a);
      p = next;
    }
  }
  return { progress: p, log: kept };
}

/** XP for a finished case. Daily pays a little more (it's the shared one). */
export function xpFor(mode: "daily" | "practice", score: number): number {
  return mode === "daily" ? 5 + Math.round(score / 10) : Math.round(score / 10);
}

const SQUARE: Record<Mark, string> = { clue: "⬜", inv: "🔎", hint: "💡", near: "🟨", miss: "🟥", hit: "🟩" };

/** Spoiler-free result: squares in order, no diagnosis, no clue text. */
export function shareGrid(p: Progress): string {
  return p.marks.map((m) => SQUARE[m]).join("") + (p.status === "lost" ? "⬛" : "");
}

export function shareText(opts: { grid: string; solved: boolean; clue: number; score: number; dayLabel: string; streak: number; url?: string; channel: "whatsapp" | "instagram" }): string {
  const { grid, solved, clue, score, dayLabel, streak, url, channel } = opts;
  const lines = [`VIBHA Daily Case · ${dayLabel}`, grid || "🟩", solved ? `Solved on clue ${clue}/6 · ${score} pts` : `Not solved · ${score} pts`];
  if (streak > 1) lines.push(`🔥 ${streak}-day streak`);
  if (channel === "whatsapp" && url) lines.push(`Can you beat me? ${url}`);
  if (channel === "instagram") lines.push("#VIBHADailyCase #psychology");
  return lines.join("\n");
}

/** Consecutive IST days played, ending today or yesterday. `days` is any order, may repeat. */
export function dailyStreak(days: string[], today: string): number {
  const set = new Set(days);
  const back = (d: string, n: number) => new Date(Date.parse(`${d}T00:00:00Z`) - n * 86400000).toISOString().slice(0, 10);
  let cur = set.has(today) ? today : set.has(back(today, 1)) ? back(today, 1) : null;
  let n = 0;
  while (cur && set.has(cur)) {
    n++;
    cur = back(cur, 1);
  }
  return n;
}

export type CohortRow = { status: string; clues: number; score: number };
export type CohortStats = { played: number; solved: number; within3: number; pctWithin3: number; avgScore: number };

export function summariseCohort(rows: CohortRow[]): CohortStats {
  const done = rows.filter((r) => r.status === "solved" || r.status === "lost");
  const solved = done.filter((r) => r.status === "solved");
  const within3 = solved.filter((r) => r.clues <= 3).length;
  const played = done.length;
  return {
    played,
    solved: solved.length,
    within3,
    pctWithin3: played ? Math.round((within3 / played) * 100) : 0,
    avgScore: played ? Math.round(done.reduce((a, r) => a + r.score, 0) / played) : 0,
  };
}

/** Same case for everyone on an IST day: a fixed shuffle, stepped one per day. */
export function dailyIndex(day: string, count: number): number {
  const days = Math.floor(Date.parse(`${day}T00:00:00Z`) / 86400000);
  // Step by a number coprime with the count so neighbouring days jump around the list.
  let step = 7;
  while (gcd(step, count) !== 1) step++;
  return (((days * step) % count) + count) % count;
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

export type PracticeRecord = { id: string; score: number; difficulty: number; solved?: boolean };

/**
 * Adaptive practice: aim for the level where the player solves most cases but
 * not all (about 70 to 85 %). Up a level after strong recent scores, down after
 * weak ones. Never today's daily case; unseen cases first.
 */
export function targetDifficulty(history: PracticeRecord[]): 1 | 2 | 3 {
  if (!history.length) return 1;
  const recent = history.slice(-4);
  const last = recent[recent.length - 1].difficulty;
  const avg = recent.reduce((a, r) => a + r.score, 0) / recent.length;
  const t = avg >= 70 ? last + 1 : avg <= 35 ? last - 1 : last;
  return Math.min(3, Math.max(1, t)) as 1 | 2 | 3;
}

/** `prefer`: cases to lead with among the new ones at the same level gap (this week's new cases, src/lib/cases). */
export function pickPractice(cases: Pick<DailyCase, "id" | "difficulty">[], history: PracticeRecord[], excludeId: string, roll: number, prefer?: ReadonlySet<string>): string | null {
  const target = targetDifficulty(history);
  const seen = new Set(history.map((h) => h.id));
  const pool = cases.filter((c) => c.id !== excludeId);
  if (!pool.length) return null;
  const unseen = pool.filter((c) => !seen.has(c.id));
  let from = unseen;
  if (!unseen.length) {
    // Every case played (answer history order, src/lib/history): cases not
    // solved come back first, then solved ones, the one played longest ago first.
    const rows = new Map<string, HistoryRow>();
    history.forEach((h, i) => rows.set(h.id, { item: h.id, seen: 1, ok: h.solved ?? h.score >= 50, at: i, due: null }));
    const ordered = orderByHistory(pool, (c) => c.id, rows, history.length, () => roll);
    const firstTier = tierOf(rows.get(ordered[0].id), history.length);
    const best = ordered.filter((c) => tierOf(rows.get(c.id), history.length) === firstTier);
    // Solved ones recycle strictly oldest first; missed ones keep the level aim.
    if (firstTier === 4) return best[0].id;
    from = best;
  }
  for (const gap of [0, 1, 2]) {
    const all = from.filter((c) => Math.abs(c.difficulty - target) === gap);
    const lead = unseen.length && prefer ? all.filter((c) => prefer.has(c.id)) : [];
    const tier = lead.length ? lead : all;
    if (tier.length) return tier[Math.min(tier.length - 1, Math.floor(roll * tier.length))].id;
  }
  return from[0].id;
}
