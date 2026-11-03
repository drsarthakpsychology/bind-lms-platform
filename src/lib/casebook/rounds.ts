/**
 * Casebook rounds that start easy and get harder.
 *
 * - Items may carry `difficulty` 1 (easy), 2 (medium) or 3 (hard). Items
 *   without one count as medium.
 * - A round is built for the student's current "tier", worked out from their
 *   last score on this activity: a strong score moves them up a tier, a weak
 *   one moves them down. First play starts at tier 1.
 * - Inside a round, questions always run easy → hard, so each round ramps up.
 * - Tier 1 rounds lean easy, tier 3 rounds lean hard, but every round keeps
 *   a mix so nobody gets a wall of only-hard questions on a bad day.
 * Pure functions: the randomness is passed in.
 */

export type Tier = 1 | 2 | 3;
export type HasDifficulty = { difficulty?: number };

export const diffOf = (x: HasDifficulty): 1 | 2 | 3 => (x.difficulty === 1 || x.difficulty === 3 ? x.difficulty : 2);

/** Next tier from the last result on this activity (null = never played). */
export function nextTier(last: { right: number; total: number; tier?: number } | null): Tier {
  if (!last || last.total <= 0) return 1;
  const cur = (last.tier === 2 || last.tier === 3 ? last.tier : 1) as Tier;
  const pct = last.right / last.total;
  if (pct >= 0.8) return Math.min(3, cur + 1) as Tier;
  if (pct < 0.5) return Math.max(1, cur - 1) as Tier;
  return cur;
}

/** Share of each difficulty in a round, per tier. */
const MIX: Record<Tier, [number, number, number]> = {
  1: [0.6, 0.3, 0.1],
  2: [0.25, 0.5, 0.25],
  3: [0.1, 0.3, 0.6],
};

function shuffled<T>(xs: readonly T[], rand: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick up to `size` items for a round at this tier, then order them easy →
 * hard. If a difficulty band runs short, the gap is filled from the nearest
 * band, so the round is always full when the bank allows.
 */
export function buildRound<T extends HasDifficulty>(items: readonly T[], tier: Tier, size: number, rand: () => number): T[] {
  const n = Math.min(size, items.length);
  const bands: T[][] = [1, 2, 3].map((d) => shuffled(items.filter((x) => diffOf(x) === d), rand));
  const want = MIX[tier].map((share) => Math.round(share * n));
  // Fix rounding so the wants add up to n.
  while (want.reduce((a, b) => a + b, 0) > n) want[want.indexOf(Math.max(...want))]--;
  while (want.reduce((a, b) => a + b, 0) < n) want[tier - 1]++;
  const picked: T[] = [];
  const take = (band: number, k: number) => {
    const got = bands[band].splice(0, k);
    picked.push(...got);
    return k - got.length;
  };
  let short = 0;
  for (let b = 0; b < 3; b++) short += take(b, want[b]);
  // Fill shortfalls from the band nearest the tier first.
  const order = [tier - 1, tier - 2, tier, tier - 3, tier + 1].filter((b) => b >= 0 && b <= 2);
  for (const b of order) if (short > 0) short = take(b, short);
  // Stable easy → hard; random within the same difficulty.
  return picked.sort((a, b) => diffOf(a) - diffOf(b));
}

export const TIER_LABEL: Record<Tier, string> = { 1: "Warm-up", 2: "Standard", 3: "Hard" };
