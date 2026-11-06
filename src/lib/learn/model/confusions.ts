/**
 * Mix-ups: what a student picks instead of the right answer.
 * Rows are directional (chose X when it was Y). For "Top 3 mix-ups" both
 * directions of a pair are merged, and older mix-ups count for less, so a
 * mistake fixed weeks ago drops off the list. Pure functions only.
 */
import { daysBetween } from "./elo";

export type ConfusionRow = { chosen: string; correct: string; n: number; lastAt: string; skill?: string | null };
export type ConfusionPair = { a: string; b: string; n: number; lastAt: string; skill: string | null; score: number };

/** Mix-up weight halves every this many days. */
export const CONFUSION_HALF_LIFE_DAYS = 21;
/** Stored answer texts are cut to this length. */
export const CONFUSION_TEXT_MAX = 120;

export function cleanAnswer(s: string): string {
  return s.replace(/\s+/g, " ").trim().slice(0, CONFUSION_TEXT_MAX);
}

/** Is this answer a real mix-up worth storing? */
export function isConfusion(chosen: string | null | undefined, correct: string | null | undefined): boolean {
  if (!chosen || !correct) return false;
  const a = cleanAnswer(chosen);
  const b = cleanAnswer(correct);
  return a.length > 0 && b.length > 0 && a.toLowerCase() !== b.toLowerCase();
}

/** Add one mix-up to an existing row (or start one). */
export function bumpConfusion(prev: ConfusionRow | undefined, chosen: string, correct: string, now: Date, skill?: string | null): ConfusionRow {
  return { chosen: cleanAnswer(chosen), correct: cleanAnswer(correct), n: (prev?.n ?? 0) + 1, lastAt: now.toISOString(), skill: skill ?? prev?.skill ?? null };
}

export function pairOf(x: string, y: string): [string, string] {
  return x.localeCompare(y) <= 0 ? [x, y] : [y, x];
}

/** The top `k` mix-ups, both directions merged, recent ones weighted more. */
export function topConfusions(rows: ConfusionRow[], now: Date, k = 3): ConfusionPair[] {
  const byPair = new Map<string, ConfusionPair>();
  for (const r of rows) {
    if (!isConfusion(r.chosen, r.correct) || r.n <= 0) continue;
    const [a, b] = pairOf(cleanAnswer(r.chosen), cleanAnswer(r.correct));
    const key = `${a}\u0000${b}`;
    const w = r.n * Math.pow(0.5, daysBetween(r.lastAt, now) / CONFUSION_HALF_LIFE_DAYS);
    const cur = byPair.get(key);
    if (!cur) {
      byPair.set(key, { a, b, n: r.n, lastAt: r.lastAt, skill: r.skill ?? null, score: w });
    } else {
      const newer = Date.parse(r.lastAt) > Date.parse(cur.lastAt);
      byPair.set(key, { ...cur, n: cur.n + r.n, score: cur.score + w, lastAt: newer ? r.lastAt : cur.lastAt, skill: newer ? (r.skill ?? cur.skill) : (cur.skill ?? r.skill ?? null) });
    }
  }
  return [...byPair.values()].sort((x, y) => y.score - x.score || y.n - x.n || x.a.localeCompare(y.a)).slice(0, k);
}
