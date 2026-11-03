/**
 * Server-side plausibility clamp for a Learn save.
 *
 * The client computes XP (engine.ts) and sends the whole state, so a student
 * holding their own session could send `xp: 999999`. Until XP is computed from
 * server-recorded events, every save is clamped against the stored row:
 *
 * - XP and the other lifetime counters never go down (the server copy is the
 *   floor; stale tabs cannot erase progress).
 * - Every XP gain in the engine is also written to `history[today]` (gainXp and
 *   finishLesson add the same amount to both), so XP may only rise by the
 *   accepted rise in `history`.
 * - A day's history may not exceed MAX_XP_PER_DAY, may not be in the future,
 *   and only recent days (since the last save, minus a short grace for offline
 *   tabs and clock skew) may change. Older days keep the stored value.
 *
 * Pure (no I/O) so it is unit-tested; the caller supplies the stored row and
 * today's IST day.
 */

import { addDays, chestBonus, MAX_FREEZES, XP, type LearnState } from "./engine";

/**
 * Generous ceiling on XP one student can earn in one IST day: 200 correct
 * answers at the full combo (200 x 15 = 3000) plus 20 perfect first-clear
 * lessons that each hit the jackpot chest (20 x (15 + 10 + 50) = 1500) plus the
 * daily-goal bonus (10). = 4510. A heavy real day is a few hundred XP.
 */
export const MAX_XP_PER_DAY = 200 * (XP.correct + XP.comboCap) + 20 * (XP.perfect + XP.firstClear + chestBonus(1).xp) + XP.goal;

/** Answers one student can plausibly give in a day (blitz is about 1 every 2 s). */
export const MAX_ANSWERS_PER_DAY = 2000;

/** Days before the last save that an offline tab may still add XP to. */
export const HISTORY_GRACE_DAYS = 2;

const HISTORY_DAYS = 90;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export type StoredLearnRow = { state: LearnState; updatedDay: string | null };

export type ClampResult = { state: LearnState; clamped: boolean };

function sum(h: Record<string, number>): number {
  return Object.values(h).reduce((a, b) => a + b, 0);
}

/**
 * Clamp `next` (already normalised) against the stored row. `prev` is null when
 * the student has no row yet. `today` is the IST day (YYYY-MM-DD).
 */
export function clampLearnSave(prev: StoredLearnRow | null, next: LearnState, today: string): ClampResult {
  const oldest = addDays(today, -HISTORY_DAYS);
  const newest = addDays(today, 1); // one day of clock skew
  const prevDay = prev?.updatedDay && DAY_RE.test(prev.updatedDay) && prev.updatedDay <= today ? prev.updatedDay : today;
  const editableFrom = prev ? addDays(prevDay, -HISTORY_GRACE_DAYS) : oldest;
  // Days that may have earned XP since the last save (at least today).
  const windowDays = prev ? Math.max(1, Math.round((Date.parse(today) - Date.parse(editableFrom)) / 86400000) + 1) : HISTORY_DAYS + 1;

  const prevHist = prev?.state.history ?? {};
  const history: Record<string, number> = {};
  for (const [d, v] of Object.entries(prevHist)) if (d >= oldest && d <= newest) history[d] = v;
  for (const [d, v] of Object.entries(next.history)) {
    if (!DAY_RE.test(d) || d < oldest || d > newest || d < editableFrom) continue;
    history[d] = Math.max(prevHist[d] ?? 0, Math.min(v, MAX_XP_PER_DAY));
  }
  let historyGain = 0;
  for (const [d, v] of Object.entries(history)) historyGain += Math.max(0, v - (prevHist[d] ?? 0));

  const prevXp = prev?.state.xp ?? 0;
  const xp = prev ? Math.min(Math.max(next.xp, prevXp), prevXp + historyGain) : Math.min(next.xp, sum(history));

  // Lifetime counters: never below the stored value, bounded rise.
  const mono = (n: number, p: number, maxRise: number) => Math.min(Math.max(n, p), p + maxRise);
  const ps = prev?.state;
  const answered = mono(next.answered, ps?.answered ?? 0, MAX_ANSWERS_PER_DAY * windowDays);
  const correct = Math.min(answered, mono(next.correct, ps?.correct ?? 0, MAX_ANSWERS_PER_DAY * windowDays));
  // A streak can grow by at most one per day since the last save.
  const streakCap = prev ? (ps?.streak.count ?? 0) + windowDays : Object.values(history).filter((v) => v > 0).length + MAX_FREEZES;
  const count = Math.min(next.streak.count, streakCap);
  const streak = {
    ...next.streak,
    count,
    best: Math.min(Math.max(next.streak.best, ps?.streak.best ?? 0, count), Math.max(ps?.streak.best ?? 0, streakCap)),
    lastDay: next.streak.lastDay && next.streak.lastDay <= newest ? next.streak.lastDay : (ps?.streak.lastDay ?? null),
  };
  const daily = { ...next.daily, xp: Math.min(next.daily.xp, MAX_XP_PER_DAY), day: next.daily.day && next.daily.day <= newest ? next.daily.day : null };

  const state: LearnState = {
    ...next,
    xp,
    history,
    answered,
    correct,
    streak,
    daily,
    chests: mono(next.chests, ps?.chests ?? 0, 200 * windowDays),
    bestCombo: Math.max(next.bestCombo, ps?.bestCombo ?? 0),
    blitzBest: Math.max(next.blitzBest, ps?.blitzBest ?? 0),
    detectiveBest: Math.max(next.detectiveBest, ps?.detectiveBest ?? 0),
  };

  const clamped =
    state.xp !== next.xp ||
    state.answered !== next.answered ||
    state.correct !== next.correct ||
    state.streak.count !== next.streak.count ||
    state.streak.best !== next.streak.best ||
    state.chests !== next.chests ||
    Object.keys(next.history).some((d) => state.history[d] !== next.history[d]);
  return { state, clamped };
}
