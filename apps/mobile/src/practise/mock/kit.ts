/**
 * Helpers for the mock play server (mock builds only). The mock plays the
 * server's part: it keeps every answer key here, in its own memory, and
 * answers each move with the same shapes the website's actions answer.
 */
import raw from "./content.json";

// The website's own content, sampled (scratchpad dump.ts). Loosely typed on purpose.
export const CONTENT = raw as any;

export class PlayError extends Error {
  constructor(
    public status: number,
    public code: "not_found" | "bad_request" | "forbidden",
    message: string,
  ) {
    super(message);
  }
}
export const FAIL = () => new PlayError(400, "bad_request", "That didn't load. Try again.");

let n = 0;
const runs = new Map<string, unknown>();
/** A run's server state behind an opaque token. */
export function keep<T>(state: T): string {
  const t = `mock.run.${(++n).toString(36)}.${Math.floor(Math.random() * 1e6).toString(36)}`;
  runs.set(t, state);
  return t;
}
export function held<T>(token: unknown): T {
  const s = typeof token === "string" ? runs.get(token) : undefined;
  if (!s) throw FAIL();
  return s as T;
}
export function swap<T>(token: unknown, next: T): string {
  held(token);
  runs.delete(String(token));
  return keep(next);
}

/** Seeded random (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function perm(len: number, r: () => number): number[] {
  const a = Array.from({ length: len }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
export const shuffled = <T,>(xs: readonly T[], r: () => number): T[] => perm(xs.length, r).map((i) => xs[i]!);
let seedN = 7;
/** Same order on every run in tests and screenshots; still shuffled. */
export const nextSeed = () => (seedN = (seedN * 48271) % 2147483647);
export function resetSeeds() {
  seedN = 7;
  runs.clear();
}
