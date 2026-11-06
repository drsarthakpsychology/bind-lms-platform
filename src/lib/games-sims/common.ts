/** Small pure helpers shared by the second-wave games. */
import { makeRng } from "@/lib/learn/model/picker";

export { makeRng };

export type Rng = () => number;

/** A shuffled copy (Fisher–Yates) using the given random source. */
export function shuffle<T>(list: readonly T[], rng: Rng): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A 32-bit hash of a string (stable seeds from ids). */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

/** 0..1 → whole percent. */
export const pct = (x: number) => Math.round(clamp(x, 0, 1) * 100);

/** mm:ss from milliseconds. */
export function clock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * Majority vote. Returns the choice with the most votes once one has a strict
 * majority of `size`, or once everyone has voted (ties go to the earliest vote
 * among the tied choices). Null while undecided.
 */
export function majority(votes: { choice: string; at: string }[], size: number): string | null {
  if (!votes.length) return null;
  const sorted = [...votes].sort((a, b) => a.at.localeCompare(b.at));
  const count = new Map<string, number>();
  for (const v of sorted) count.set(v.choice, (count.get(v.choice) ?? 0) + 1);
  const need = Math.floor(size / 2) + 1;
  for (const [c, n] of count) if (n >= need) return c;
  if (sorted.length < size) return null;
  const top = Math.max(...count.values());
  return sorted.find((v) => count.get(v.choice) === top)!.choice;
}

/** Plain-English label for an educational dose line. */
export const DOSE_NOTE = "For learning; check current guidelines.";
