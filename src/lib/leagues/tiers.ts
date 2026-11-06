/**
 * Weekly leagues (plan §4.4). Pure, so every rule is unit-tested.
 *
 * - Five brain-themed tiers, Neuron (1) → Mind (5). Everyone starts in Neuron.
 * - Each week, students are put into groups of about 20 by tier, both batches
 *   mixed. A tier with too few students is merged with the tier below it.
 * - At the close, the top of each group moves up and the bottom moves down
 *   (5 each in a full group). Nobody drops out of Neuron; Mind can't go higher.
 * - Ties at a line are kind: everyone level with the last promoted student
 *   also goes up, and everyone level with the first safe student stays.
 * - You can't be promoted with 0 points, and a week with 0 points drops you a
 *   tier (idle places aren't kept).
 */

export const TIERS = [
  { tier: 1, name: "Neuron" },
  { tier: 2, name: "Synapse" },
  { tier: 3, name: "Circuit" },
  { tier: 4, name: "Cortex" },
  { tier: 5, name: "Mind" },
] as const;

export const MIN_TIER = 1;
export const MAX_TIER = 5;
export const GROUP_TARGET = 20;
/** A tier band smaller than this joins the tier below it. */
export const GROUP_MIN = 10;
export const ZONE_MAX = 5;

export type Tier = 1 | 2 | 3 | 4 | 5;

export function clampTier(t: unknown): Tier {
  const n = typeof t === "number" && Number.isFinite(t) ? Math.round(t) : 1;
  return Math.min(MAX_TIER, Math.max(MIN_TIER, n)) as Tier;
}

export function tierName(t: number): string {
  return TIERS[clampTier(t) - 1].name;
}

/** How many move up (and down) in a group of `n`: 5 in a full group, fewer in a small one, never overlapping. */
export function zoneSize(n: number): number {
  return Math.max(0, Math.min(ZONE_MAX, Math.floor(n / 3)));
}

/** Stable 32-bit hash (FNV-1a) for a deterministic shuffle. */
export function hash32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export type Placement = { userId: string; tier: Tier };
export type Grouped = Placement & { groupNo: number };

/**
 * Put this week's students into groups. Deterministic for a given week, so
 * the page and the weekly job always agree on who is in which group.
 */
export function assignGroups(players: readonly Placement[], week: string, target = GROUP_TARGET, min = GROUP_MIN): Grouped[] {
  const byTier = new Map<number, Placement[]>();
  for (const p of players) {
    const t = clampTier(p.tier);
    byTier.set(t, [...(byTier.get(t) ?? []), { userId: p.userId, tier: t }]);
  }
  // Walk from the top tier down, gathering bands of at least `min` students.
  const bands: Placement[][] = [];
  let band: Placement[] = [];
  for (let t = MAX_TIER; t >= MIN_TIER; t--) {
    band = band.concat(byTier.get(t) ?? []);
    if (band.length >= min) {
      bands.push(band);
      band = [];
    }
  }
  if (band.length) {
    if (bands.length) bands[bands.length - 1] = bands[bands.length - 1].concat(band);
    else bands.push(band);
  }
  const out: Grouped[] = [];
  let groupNo = 0;
  for (const b of bands) {
    const order = [...b].sort((x, y) => hash32(`${week}:${x.userId}`) - hash32(`${week}:${y.userId}`) || x.userId.localeCompare(y.userId));
    const k = Math.max(1, Math.round(order.length / target));
    order.forEach((p, i) => out.push({ ...p, groupNo: groupNo + 1 + (i % k) }));
    groupNo += k;
  }
  return out;
}

/** The tier a group plays in: its most common tier (ties go to the higher tier). */
export function groupTier(members: readonly { tier: number }[]): Tier {
  const count = new Map<number, number>();
  for (const m of members) count.set(clampTier(m.tier), (count.get(clampTier(m.tier)) ?? 0) + 1);
  let best: Tier = 1;
  let bestN = -1;
  for (const [t, n] of count) if (n > bestN || (n === bestN && t > best)) [best, bestN] = [t as Tier, n];
  return best;
}

export type Standing = { userId: string; tier: Tier; points: number };
export type Ranked<T extends Standing = Standing> = T & { rank: number };
export type Closed = Ranked & { result: "promoted" | "stayed" | "relegated"; nextTier: Tier };

/** Rank a group: points high to low, ties share a rank (1, 2, 2, 4). Ties keep a stable order by id. */
export function rankGroup<T extends Standing>(rows: readonly T[]): Ranked<T>[] {
  const sorted = [...rows].sort((a, b) => b.points - a.points || a.userId.localeCompare(b.userId));
  let rank = 0;
  let last = Number.NaN;
  return sorted.map((r, i) => {
    if (r.points !== last) rank = i + 1;
    last = r.points;
    return { ...r, rank };
  });
}

/** The points you need to be level with the promotion line (null if nobody moves up in this group). */
export function promotionLine(ranked: readonly { points: number }[]): number | null {
  const z = zoneSize(ranked.length);
  if (!z) return null;
  return Math.max(1, ranked[z - 1].points);
}

/** The points of the first safe place (null if nobody can drop in this group). */
export function safetyLine(ranked: readonly { points: number }[]): number | null {
  const z = zoneSize(ranked.length);
  if (!z) return null;
  return ranked[ranked.length - z - 1].points;
}

/** Close one group at the end of the week. */
export function closeGroup(rows: readonly Standing[]): Closed[] {
  const ranked = rankGroup(rows);
  const up = promotionLine(ranked);
  const safe = safetyLine(ranked);
  const z = zoneSize(ranked.length);
  return ranked.map((r, i) => {
    const promote = up !== null && r.points > 0 && (i < z || r.points >= up);
    const relegate = !promote && (r.points === 0 || (safe !== null && i >= ranked.length - z && r.points < safe));
    if (promote && r.tier < MAX_TIER) return { ...r, result: "promoted", nextTier: (r.tier + 1) as Tier };
    if (relegate && r.tier > MIN_TIER) return { ...r, result: "relegated", nextTier: (r.tier - 1) as Tier };
    return { ...r, result: "stayed", nextTier: r.tier };
  });
}
