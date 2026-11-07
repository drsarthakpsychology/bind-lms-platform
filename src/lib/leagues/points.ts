/**
 * League points (plan §4.3): effort plus correct first tries weighted by
 * difficulty. Reset every week. Pure, so it is unit-tested.
 *
 * - Effort: the Learn XP earned on each IST day in the window (the
 *   `history` kept in learn_progress: lessons, notes, study, lab, games).
 * - Server XP: positive rows in xp_ledger in the window (duel wins, daily
 *   case and other server-side awards). Shop spends never count.
 * - Skill: each item answered correctly on its first try in the window earns
 *   FIRST_TRY_POINTS by difficulty (easy 2, medium 4, hard 6), capped at the
 *   effort XP of the same window (answer events are sent by the browser).
 */

export const FIRST_TRY_POINTS = { 1: 2, 2: 4, 3: 6 } as const;
export type Difficulty = keyof typeof FIRST_TRY_POINTS;

/** Ledger sources that are spends or bookkeeping, never league points. */
export function countsForLeague(source: string, amount: number): boolean {
  return amount > 0 && !source.startsWith("shop:") && !source.startsWith("refund") && !source.startsWith("hint:");
}

/** XP earned on the days from `from` (inclusive) to `to` (exclusive). */
export function effortXp(history: Record<string, number>, from: string, to: string): number {
  let sum = 0;
  for (const [d, x] of Object.entries(history)) if (d >= from && d < to && Number.isFinite(x) && x > 0) sum += x;
  return Math.round(sum);
}

/** Positive, league-counting XP from ledger rows (already filtered to the window). */
export function ledgerXp(rows: readonly { source: string; amount: number }[]): number {
  return rows.reduce((a, r) => (countsForLeague(r.source, r.amount) ? a + r.amount : a), 0);
}

/** Answers an item needs before its difficulty (b) is trusted for league points. */
export const MIN_ANSWERS_FOR_B = 5;

/**
 * Difficulty of an item from whatever is known about it:
 * - `b` (item_stats, the student model's difficulty on the logit scale, 0 =
 *   average): 0.8 and up is hard, -0.2 and up is medium. Used once the item
 *   has MIN_ANSWERS_FOR_B answers, or straight away when it was seeded from
 *   the author's difficulty (n = 0 but b set).
 * - `pCorrect` (share of students who get it right, 0 to 1): under 0.4 is hard,
 *   under 0.7 is medium.
 * - `rating` (Elo-style, 1000 = average): 1300+ is hard, 1100+ is medium.
 * Unknown items count as easy, so the bonus is never inflated by guesswork.
 */
export function difficultyOf(info: { b?: number | null; n?: number | null; pCorrect?: number | null; rating?: number | null } | null | undefined): Difficulty {
  if (info?.b != null && Number.isFinite(info.b)) {
    const n = info.n != null && Number.isFinite(info.n) ? info.n : 0;
    if (n >= MIN_ANSWERS_FOR_B || (n === 0 && info.b !== 0)) return info.b >= 0.8 ? 3 : info.b >= -0.2 ? 2 : 1;
  }
  if (info?.pCorrect != null && Number.isFinite(info.pCorrect)) return info.pCorrect < 0.4 ? 3 : info.pCorrect < 0.7 ? 2 : 1;
  if (info?.rating != null && Number.isFinite(info.rating)) return info.rating >= 1300 ? 3 : info.rating >= 1100 ? 2 : 1;
  return 1;
}

export type AnswerEvent = { item: string; ok: boolean; at: string };

/**
 * Items answered right on the first try in the window, one per item: the
 * earliest answer to each item decides it. Returns the item ids.
 */
export function firstTryCorrect(events: readonly AnswerEvent[]): string[] {
  const first = new Map<string, AnswerEvent>();
  for (const e of events) {
    if (!e.item) continue;
    const prev = first.get(e.item);
    if (!prev || e.at < prev.at) first.set(e.item, e);
  }
  return [...first.values()].filter((e) => e.ok).map((e) => e.item);
}

export function skillPoints(items: readonly string[], difficulty: (item: string) => Difficulty): number {
  return items.reduce((a, id) => a + FIRST_TRY_POINTS[difficulty(id)], 0);
}

export type PointsInput = {
  history: Record<string, number>;
  ledger: readonly { source: string; amount: number }[];
  firstTries: readonly string[];
  difficulty?: (item: string) => Difficulty;
};

export type PointsBreakdown = { effort: number; server: number; skill: number; total: number };

export function leaguePoints(input: PointsInput, from: string, to: string): PointsBreakdown {
  const effort = effortXp(input.history, from, to);
  const server = ledgerXp(input.ledger);
  // Answer events come from the browser, so the skill bonus can never be more
  // than the (server-clamped) effort XP: no XP, no bonus.
  const skill = Math.min(effort, skillPoints(input.firstTries, input.difficulty ?? (() => 1)));
  return { effort, server, skill, total: effort + server + skill };
}
