/**
 * The "Goldilocks" session picker: not too easy, not too hard.
 *
 * A session of N questions is mixed as:
 * - ~60 % core:        predicted chance of a right answer 0.70–0.85
 * - ~20 % review:      spaced-review cards that are due
 * - ~10 % stretch:     0.50–0.65 (hard, but in reach)
 * - ~10 % confidence:  above 0.90 (an easy win)
 * Overall that lands near the owner's ~70 % success target (decision 44).
 * A bucket that runs short is filled with the questions closest to the core
 * band. Then look-alike topics are interleaved: the order alternates between
 * topics of the same family (depression, bipolar, depression…) instead of
 * blocking one topic, and the session opens with an easy win when there is one.
 * Pure: randomness comes only from the `rng` argument.
 */

export type Candidate = { id: string; topic: string; family: string; p: number; due: boolean };
export type Bucket = "core" | "review" | "stretch" | "confidence" | "fill";
export type Picked = Candidate & { bucket: Bucket };

export const CORE_BAND: [number, number] = [0.7, 0.85];
export const STRETCH_BAND: [number, number] = [0.5, 0.65];
export const CONFIDENCE_MIN = 0.9;
const TARGET = (CORE_BAND[0] + CORE_BAND[1]) / 2;

export function quotas(size: number): Record<Exclude<Bucket, "fill">, number> {
  const review = Math.round(size * 0.2);
  const stretch = Math.round(size * 0.1);
  const confidence = Math.round(size * 0.1);
  return { review, stretch, confidence, core: Math.max(0, size - review - stretch - confidence) };
}

export function bucketOf(p: number): Exclude<Bucket, "review" | "fill"> | null {
  if (p >= CORE_BAND[0] && p <= CORE_BAND[1]) return "core";
  if (p >= STRETCH_BAND[0] && p <= STRETCH_BAND[1]) return "stretch";
  if (p > CONFIDENCE_MIN) return "confidence";
  return null;
}

/** Seeded random numbers (mulberry32), so sessions are reproducible in tests. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(list: readonly T[], rng: () => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Order so look-alike topics alternate: topics are grouped by family, and the
 * session takes one question from each topic in turn. Two questions on the
 * same topic sit next to each other only when nothing else is left.
 */
export function interleave<T extends { topic: string; family: string }>(items: T[]): T[] {
  const byTopic = new Map<string, T[]>();
  for (const it of items) byTopic.set(it.topic, [...(byTopic.get(it.topic) ?? []), it]);
  const topics = [...byTopic.keys()].sort((a, b) => {
    const fa = byTopic.get(a)![0].family;
    const fb = byTopic.get(b)![0].family;
    return fa === fb ? 0 : fa < fb ? -1 : 1;
  });
  const out: T[] = [];
  while (out.length < items.length) {
    for (const t of topics) {
      const q = byTopic.get(t)!;
      const next = q.shift();
      if (next) out.push(next);
    }
  }
  return out;
}

export function pickSession(candidates: Candidate[], size: number, rng: () => number): Picked[] {
  const n = Math.min(size, candidates.length);
  if (n <= 0) return [];
  const q = quotas(n);
  const pool = shuffle(candidates, rng);
  const used = new Set<string>();
  const out: Picked[] = [];
  const take = (list: Candidate[], count: number, bucket: Bucket) => {
    for (const c of list) {
      if (out.length >= n || count <= 0) break;
      if (used.has(c.id)) continue;
      used.add(c.id);
      out.push({ ...c, bucket });
      count--;
    }
  };

  // Due reviews first (weakest first: those are most at risk of being forgotten).
  take(pool.filter((c) => c.due).sort((a, b) => a.p - b.p), q.review, "review");
  take(pool.filter((c) => bucketOf(c.p) === "stretch"), q.stretch, "stretch");
  take(pool.filter((c) => bucketOf(c.p) === "confidence"), q.confidence, "confidence");
  take(pool.filter((c) => bucketOf(c.p) === "core"), n - out.length, "core");
  // Short buckets: fill with what's closest to the core band.
  take([...pool].sort((a, b) => Math.abs(a.p - TARGET) - Math.abs(b.p - TARGET)), n - out.length, "fill");

  const ordered = interleave(out);
  const warm = ordered.findIndex((x) => x.bucket === "confidence");
  if (warm > 0) ordered.unshift(...ordered.splice(warm, 1));
  return ordered;
}
