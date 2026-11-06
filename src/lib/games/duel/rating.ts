/**
 * Ranked rating: Glicko-1. Each player has a rating and a rating deviation
 * (RD: how unsure we are). A loss always lowers the rating; a forfeit is a
 * loss. RD grows while you don't play; after 7 idle days the rating also
 * decays a little each week (never below DECAY_FLOOR).
 */

export const START_RATING = 1500;
export const START_RD = 350;
export const MIN_RD = 40;
/** RD growth per idle day (≈ back to 350 from 50 after about 100 days). */
const C2 = (START_RD * START_RD - 50 * 50) / 100;
const Q = Math.log(10) / 400;
const DAY = 86400000;
export const DECAY_FREE_DAYS = 7;
export const DECAY_PER_WEEK = 5;
export const DECAY_FLOOR = 1200;

export type Rating = { rating: number; rd: number; lastPlayed: number | null };

function g(rd: number) {
  return 1 / Math.sqrt(1 + (3 * Q * Q * rd * rd) / (Math.PI * Math.PI));
}

export function expected(a: Rating, b: Rating): number {
  return 1 / (1 + Math.pow(10, (-g(b.rd) * (a.rating - b.rating)) / 400));
}

/** RD after time away (before a new game). */
export function inflateRd(r: Rating, now: number): number {
  if (!r.lastPlayed) return Math.min(START_RD, r.rd);
  const days = Math.max(0, (now - r.lastPlayed) / DAY);
  return Math.min(START_RD, Math.sqrt(r.rd * r.rd + C2 * days));
}

/** Rating after slow decay for idle weeks beyond the first 7 days. */
export function decayed(r: Rating, now: number): number {
  if (!r.lastPlayed) return r.rating;
  const days = (now - r.lastPlayed) / DAY;
  if (days <= DECAY_FREE_DAYS || r.rating <= DECAY_FLOOR) return r.rating;
  const weeks = Math.floor((days - DECAY_FREE_DAYS) / 7) + 1;
  return Math.max(DECAY_FLOOR, r.rating - weeks * DECAY_PER_WEEK);
}

/** One game: score 1 = win, 0.5 = draw, 0 = loss. Returns the new rating and RD. */
export function update(me: Rating, opp: Rating, score: 0 | 0.5 | 1, now: number): { rating: number; rd: number } {
  const a = { ...me, rating: decayed(me, now), rd: inflateRd(me, now) };
  const b = { ...opp, rating: decayed(opp, now), rd: inflateRd(opp, now) };
  const gb = g(b.rd);
  const e = expected(a, b);
  const d2 = 1 / (Q * Q * gb * gb * e * (1 - e));
  const denom = 1 / (a.rd * a.rd) + 1 / d2;
  let rating = a.rating + (Q / denom) * gb * (score - e);
  // No forgiveness: a loss never raises your rating, a win never lowers it.
  if (score === 0) rating = Math.min(rating, a.rating - 1);
  if (score === 1) rating = Math.max(rating, a.rating + 1);
  const rd = Math.max(MIN_RD, Math.sqrt(1 / denom));
  return { rating: Math.round(rating * 10) / 10, rd: Math.round(rd * 10) / 10 };
}

/** How far apart two queued players may be, widening the longer someone waits. */
export function pairWindow(waitMs: number): number {
  return Math.min(800, 100 + 50 * Math.floor(Math.max(0, waitMs) / 2000));
}

export function canPair(a: number, b: number, waitMs: number): boolean {
  return Math.abs(a - b) <= pairWindow(waitMs);
}

/** Named tiers for the rating (shown with the number). */
export const TIERS = [
  { min: 0, name: "Neuron" },
  { min: 1350, name: "Synapse" },
  { min: 1500, name: "Cortex" },
  { min: 1650, name: "Network" },
  { min: 1800, name: "Mind" },
] as const;

export function tierFor(rating: number) {
  let t: (typeof TIERS)[number] = TIERS[0];
  for (const x of TIERS) if (rating >= x.min) t = x;
  return t.name;
}
