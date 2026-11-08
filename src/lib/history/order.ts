/**
 * Answer history: which items a student has answered in each tool, and how.
 * This file is pure (no database, no browser) so the server, the browser and
 * the tests share one rule for what comes next:
 *
 * 1. items never seen, in a random order;
 * 2. then items last answered wrong, once their gap is up (oldest due first);
 * 3. then items answered wrong whose gap is not up yet (soonest due first);
 * 4. then items seen without a grade (oldest first);
 * 5. last, items last answered right, oldest first (so they recycle in turn).
 *
 * A round of n takes the first n. Right answers therefore stay out until
 * everything else has been seen. Randomness only comes from the `rng` argument.
 */

/** Every tool that keeps a history. The id is what the table stores. */
export const HISTORY_TOOLS = [
  "prep",
  "coach",
  "quiz",
  "study-check",
  "module-test",
  "placement",
  "map-practice",
  "daily",
  "duel",
  "blitz",
  "sort",
  "mse-lab",
  "mse-trainer",
  "rx",
  "ward",
  "escape",
  "comorbid",
  "detective",
  "wwyd",
  "say-it",
  "osce",
  "formulation",
  "landmark",
  "two-minute",
  "weak-spots",
  "long",
  "judgment",
  "quick-check",
] as const;
export type HistoryTool = (typeof HISTORY_TOOLS)[number];

export function isHistoryTool(x: unknown): x is HistoryTool {
  return typeof x === "string" && (HISTORY_TOOLS as readonly string[]).includes(x);
}

/** One item's record. Times are epoch milliseconds. `ok` is null when seen but not graded. */
export type HistoryRow = { item: string; seen: number; ok: boolean | null; at: number; due: number | null };
export type History = ReadonlyMap<string, HistoryRow>;

export const EMPTY_HISTORY: History = new Map();

const MIN = 60_000;
const DAY = 24 * 60 * MIN;
/** A wrong answer comes back after this gap (it still comes before any right one). */
export const WRONG_GAP_MS = 10 * MIN;
/** A right answer's next review, by how often the item has been seen (1, 3, 7, 14, then 30 days). */
export const RIGHT_GAPS_DAYS = [1, 3, 7, 14, 30] as const;

/** Item ids are short strings; anything else is ignored. */
export const MAX_ITEM_LEN = 200;
export function cleanItem(x: unknown): string | null {
  return typeof x === "string" && x.length > 0 && x.length <= MAX_ITEM_LEN ? x : null;
}

/** The record after one more answer. */
export function nextRow(prev: HistoryRow | undefined, item: string, correct: boolean | null, now: number): HistoryRow {
  const seen = (prev?.seen ?? 0) + 1;
  let due: number | null = null;
  if (correct === false) due = now + WRONG_GAP_MS;
  else if (correct === true) due = now + RIGHT_GAPS_DAYS[Math.min(seen, RIGHT_GAPS_DAYS.length) - 1] * DAY;
  return { item, seen, ok: correct, at: now, due };
}

/** Group 0 (never seen) to 4 (last answered right). */
export function tierOf(row: HistoryRow | undefined, now: number): 0 | 1 | 2 | 3 | 4 {
  if (!row || row.seen <= 0) return 0;
  if (row.ok === false) return row.due === null || row.due <= now ? 1 : 2;
  if (row.ok === null) return 3;
  return 4;
}

function shuffled<T>(list: readonly T[], rng: () => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Every candidate, best first (see the top of this file). Duplicate ids keep
 * their first copy only. Ties inside a group are broken at random.
 */
export function orderByHistory<T>(candidates: readonly T[], idOf: (t: T) => string, history: History, now: number, rng: () => number): T[] {
  const seenIds = new Set<string>();
  const tiers: T[][] = [[], [], [], [], []];
  for (const c of shuffled(candidates, rng)) {
    const id = idOf(c);
    if (seenIds.has(id)) continue;
    seenIds.add(id);
    tiers[tierOf(history.get(id), now)].push(c);
  }
  const row = (c: T) => history.get(idOf(c))!;
  const due = (c: T) => row(c).due ?? 0;
  tiers[1].sort((a, b) => due(a) - due(b));
  tiers[2].sort((a, b) => due(a) - due(b));
  tiers[3].sort((a, b) => row(a).at - row(b).at);
  tiers[4].sort((a, b) => row(a).at - row(b).at);
  return tiers.flat();
}

/** Ids only. */
export function orderIds(ids: readonly string[], history: History, now: number, rng: () => number): string[] {
  return orderByHistory(ids, (x) => x, history, now, rng);
}

/**
 * The smallest set of whole groups (in the order above) that holds at least
 * `size` candidates, in order. For tools with their own mixing (difficulty,
 * topic spread): mix inside this pool, and right answers only join it when
 * the rest run short.
 */
export function poolFor<T>(candidates: readonly T[], idOf: (t: T) => string, history: History, now: number, rng: () => number, size: number): T[] {
  const ordered = orderByHistory(candidates, idOf, history, now, rng);
  if (ordered.length <= size) return ordered;
  let end = size;
  const t = tierOf(history.get(idOf(ordered[size - 1])), now);
  while (end < ordered.length && tierOf(history.get(idOf(ordered[end])), now) === t) end++;
  return ordered.slice(0, end);
}

/**
 * A round of `size`: the first `size` in order, then the wrong ones are spread
 * out among the new ones (never first when a new one is in the round).
 */
export function pickRound<T>(candidates: readonly T[], idOf: (t: T) => string, history: History, now: number, rng: () => number, size: number): T[] {
  const top = orderByHistory(candidates, idOf, history, now, rng).slice(0, Math.max(0, size));
  return spreadOut(top, idOf, history, now);
}

/**
 * Keep new items in front and space the comeback items (wrong, ungraded,
 * right) evenly between them, so the round opens with something new and
 * the missed ones do not bunch at the end.
 */
export function spreadOut<T>(list: readonly T[], idOf: (t: T) => string, history: History, now: number): T[] {
  const fresh = list.filter((x) => tierOf(history.get(idOf(x)), now) === 0);
  const back = list.filter((x) => tierOf(history.get(idOf(x)), now) !== 0);
  if (!fresh.length || !back.length) return [...list];
  const out: T[] = [];
  const gap = fresh.length / (back.length + 1);
  let b = 0;
  for (let i = 0; i < fresh.length; i++) {
    out.push(fresh[i]);
    while (b < back.length && i + 1 >= Math.round(gap * (b + 1))) out.push(back[b++]);
  }
  while (b < back.length) out.push(back[b++]);
  return out;
}

/** Move the first never-seen item to the front (for pickers that order rounds their own way). */
export function leadWithUnseen<T>(list: readonly T[], idOf: (t: T) => string, history: History, now: number): T[] {
  if (!list.length || tierOf(history.get(idOf(list[0])), now) === 0) return [...list];
  const i = list.findIndex((x) => tierOf(history.get(idOf(x)), now) === 0);
  if (i < 0) return [...list];
  const out = [...list];
  out.unshift(...out.splice(i, 1));
  return out;
}

/** Two copies of a history (server and browser): per item the newer answer wins, the higher count stays. */
export function mergeHistory(a: History, b: History): Map<string, HistoryRow> {
  const out = new Map(a);
  for (const [id, r] of b) {
    const had = out.get(id);
    if (!had) out.set(id, r);
    else out.set(id, { ...(r.at >= had.at ? r : had), seen: Math.max(r.seen, had.seen) });
  }
  return out;
}

/** Rows as they travel to the browser. */
export function toRows(h: History): HistoryRow[] {
  return [...h.values()];
}

export function fromRows(rows: unknown): Map<string, HistoryRow> {
  const out = new Map<string, HistoryRow>();
  if (!Array.isArray(rows)) return out;
  for (const r of rows) {
    if (!r || typeof r !== "object") continue;
    const x = r as Record<string, unknown>;
    const item = cleanItem(x.item);
    const at = typeof x.at === "number" && Number.isFinite(x.at) ? x.at : null;
    if (!item || at === null) continue;
    const seen = typeof x.seen === "number" && Number.isFinite(x.seen) ? Math.max(1, Math.floor(x.seen)) : 1;
    const ok = x.ok === true ? true : x.ok === false ? false : null;
    const due = typeof x.due === "number" && Number.isFinite(x.due) ? x.due : null;
    out.set(item, { item, seen, ok, at, due });
  }
  return out;
}

/** A seeded random source (mulberry32), for rounds picked on the server per request. */
export function seededRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
