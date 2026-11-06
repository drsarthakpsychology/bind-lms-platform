/**
 * The exact, private percentile every student sees (owner decision 35).
 * Pure, so it is unit-tested.
 *
 * - `percentile`: the share of other students you are ahead of, 0–99.
 * - `topPct`: the smallest "top X%" that includes you, 1–100.
 * Near the top we say "You're in the top 7%"; elsewhere "You're at the 38th
 * percentile". Both are exact, never rounded up to flatter.
 */

export type Percentile = { percentile: number; topPct: number; rank: number; total: number };

export function percentileOf(mine: number, everyone: readonly number[]): Percentile {
  const total = Math.max(1, everyone.length);
  let above = 0;
  let below = 0;
  for (const v of everyone) {
    if (v > mine) above++;
    else if (v < mine) below++;
  }
  const others = Math.max(1, total - 1);
  const percentile = total === 1 ? 0 : Math.min(99, Math.floor((below * 100) / others));
  const topPct = Math.min(100, Math.max(1, Math.ceil(((above + 1) * 100) / total)));
  return { percentile, topPct, rank: above + 1, total };
}

export function ordinal(n: number): string {
  const s = n % 100;
  if (s >= 11 && s <= 13) return `${n}th`;
  return `${n}${n % 10 === 1 ? "st" : n % 10 === 2 ? "nd" : n % 10 === 3 ? "rd" : "th"}`;
}

/** Where "top X%" reads better than a percentile. */
export const TOP_WORDING_UNTIL = 25;

/** "You're in the top 7%" / "You're at the 38th percentile — up 6 this month". */
export function percentileLine(p: Percentile, monthDelta: number | null = null): string {
  if (p.total <= 1) return "You're the only one on the board so far";
  const base = p.topPct <= TOP_WORDING_UNTIL ? `You're in the top ${p.topPct}%` : `You're at the ${ordinal(p.percentile)} percentile`;
  if (monthDelta === null) return base;
  if (monthDelta > 0) return `${base} — up ${monthDelta} this month`;
  if (monthDelta < 0) return `${base} — down ${-monthDelta} this month`;
  return `${base} — same as the start of the month`;
}
