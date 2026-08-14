/**
 * Deterministic, dependency-free PRNG + shuffle for quiz option order.
 *
 * Why this exists: quiz options were authored with the correct answer first,
 * and rendered in authored order — a positional tell that makes the quiz
 * measure pattern-matching, not learning (worse on suicide-risk items). We
 * shuffle options with a seeded PRNG so the order is stable within a session
 * but different between students and attempts.
 *
 * - `mulberry32` — a 32-bit seeded PRNG (~6 lines, uniform, no package).
 * - `seededShuffle` — Fisher–Yates (uniform), NOT `sort(() => Math.random()-.5)`
 *   which biases toward the original order — the very bug we are fixing.
 * - `hashSeed` — FNV-1a string→int so a per-item seed is reproducible.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** FNV-1a hash — deterministic string → unsigned 32-bit int. */
export function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Identity order [0,1,…,n-1]. */
export function identityOrder(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}
