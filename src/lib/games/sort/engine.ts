/**
 * Criteria Sort rules (pure). Tiles are shown in a secret shuffled order; the
 * browser refers to them by position only, so it can't tell which tile belongs
 * where. `perm[i]` is the board item index (group * 4 + k) of shuffled tile i.
 */

export const MAX_TRIES = 4;
export const TILES = 16;

export type Tier = "basic" | "advanced";
export type TileState = "ok" | "wrong" | "empty";

export type Check = {
  tiles: TileState[];
  /** Groups whose four tiles (and threshold, in advanced) are all right. */
  groupsDone: boolean[];
  /** Groups with exactly three right tiles: "one away". */
  oneAway: number[];
  /** Advanced only: was each group's threshold right (null = not picked or basic). */
  thresholds: (boolean | null)[];
  solved: boolean;
};

export function groupOf(itemIndex: number): number {
  return Math.floor(itemIndex / 4);
}

export function cleanPlacement(raw: unknown): (number | null)[] {
  const arr = Array.isArray(raw) ? raw : [];
  return Array.from({ length: TILES }, (_, i) => {
    const v = arr[i];
    return typeof v === "number" && Number.isInteger(v) && v >= 0 && v < 4 ? v : null;
  });
}

export function cleanPicks(raw: unknown): (string | null)[] {
  const arr = Array.isArray(raw) ? raw : [];
  return Array.from({ length: 4 }, (_, i) => (typeof arr[i] === "string" && (arr[i] as string).length < 120 ? (arr[i] as string) : null));
}

export function check(perm: number[], placement: (number | null)[], tier: Tier, answers: (string | null)[], picks: (string | null)[]): Check {
  const tiles: TileState[] = perm.map((item, i) => (placement[i] === null ? "empty" : placement[i] === groupOf(item) ? "ok" : "wrong"));
  const right = [0, 0, 0, 0];
  tiles.forEach((t, i) => {
    if (t === "ok") right[groupOf(perm[i])]++;
  });
  const thresholds = [0, 1, 2, 3].map((g) => (tier === "advanced" && answers[g] !== null ? (picks[g] === null ? null : picks[g] === answers[g]) : null));
  const groupsDone = right.map((r, g) => r === 4 && (tier === "basic" || answers[g] === null || thresholds[g] === true));
  const oneAway = right.flatMap((r, g) => (r === 3 ? [g] : []));
  return { tiles, groupsDone, oneAway, thresholds, solved: groupsDone.every(Boolean) };
}

/** 100 first try, −20 per extra try (min 20). Unsolved: 10 per finished group. Advanced pays 1.5×. */
export function sortScore(tries: number, c: Pick<Check, "solved" | "groupsDone">, tier: Tier): number {
  const base = c.solved ? Math.max(20, 100 - 20 * (Math.max(1, tries) - 1)) : 10 * c.groupsDone.filter(Boolean).length;
  return Math.round(tier === "advanced" ? base * 1.5 : base);
}

export function sortXp(score: number, mode: "daily" | "practice"): number {
  return Math.round(score / 10) + (mode === "daily" ? 5 : 0);
}
