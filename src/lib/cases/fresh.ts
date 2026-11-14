/**
 * Fresh cases: what a student sees next in every case-based tool.
 *
 * Built on the answer history (src/lib/history). A case counts as done once
 * it has a history row (finished, right or wrong). Pure: no database, no
 * browser, no clock (the caller passes `now`), so the server, the browser
 * and the tests share one rule:
 *
 * 1. a half-finished case first (it resumes where it was left);
 * 2. then cases new this week (a small set per student, see weeklyDrip);
 * 3. then every other case never done;
 * 4. done cases last. Missed ones first, then the harder ones, then the
 *    oldest. They only come back as the next case once every case is done
 *    (`recycled`), and the tool then says so (RECYCLE_LINE).
 *
 * Nothing is ever hidden: the weekly set only decides which new cases lead
 * and carry the "New this week" tag.
 */
import type { History, HistoryRow } from "@/lib/history/order";

export type CaseMark = "started" | "week" | "new" | "done";

export const RECYCLE_LINE = "You've done every case. Here they are again, hardest first.";

/** Hubs show a count of new cases only when it is at least this big. */
export const BIG_NEW = 25;

const MIN = 60_000;
const DAY = 24 * 60 * MIN;
/** India time (the cohort's clock): weeks start on Monday 00:00 IST. */
const IST = 330 * MIN;

/** Week number (Monday-based, India time). 1 Jan 1970 was a Thursday. */
export function weekIndex(now: number): number {
  const d = Math.floor((now + IST) / DAY);
  return Math.floor((d + 3) / 7);
}

/** When week `w` starts, epoch ms. */
export function weekStart(w: number): number {
  return (w * 7 - 3) * DAY - IST;
}

/** How many cases a library adds to "New this week". Small libraries get none (every case is simply New). */
export function dripSize(n: number): number {
  if (n < 12) return 0;
  return Math.min(10, Math.max(3, Math.round(n / 10)));
}

/** FNV-1a, unsigned. */
export function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * This week's new cases for one student: from the cases not done before the
 * week began, the first `dripSize` by a hash of (student, week, case). The
 * same student gets the same set all week on every device; next week brings
 * a different set. Cases done during the week stay in the set (shown Done),
 * so the set never reshuffles mid-week.
 */
export function weeklyDrip(ids: readonly string[], student: string, history: History, now: number, size = dripSize(ids.length)): Set<string> {
  if (size <= 0) return new Set();
  const w = weekIndex(now);
  const start = weekStart(w);
  const pool = [...new Set(ids)].filter((id) => {
    const r = history.get(id);
    return !r || r.seen <= 0 || r.at >= start;
  });
  const rank = (id: string) => hash32(`${student}|${w}|${id}`);
  return new Set(pool.sort((a, b) => rank(a) - rank(b) || (a < b ? -1 : 1)).slice(0, size));
}

const isDone = (r: HistoryRow | undefined) => !!r && r.seen > 0;

export type Arranged<T> = {
  /** Every case once, best next first. */
  list: { item: T; id: string; mark: CaseMark }[];
  /** Every case is done: the list is the replay order (hardest first). */
  recycled: boolean;
  /** Cases never done. */
  fresh: number;
};

export type ArrangeOpts<T> = {
  history: History;
  now: number;
  /** Who is looking (any stable string, e.g. the user id). */
  student: string;
  /** Cases with saved half-way progress. */
  started?: ReadonlySet<string>;
  /** Higher is harder (used to put harder done cases first). */
  level?: (t: T) => number;
  /** Shuffle the plain new cases (default: keep the library order). */
  rng?: () => number;
  /** Override the weekly set size. */
  drip?: number;
};

/** Every case in the order above, each with its mark. Duplicate ids keep the first copy. */
export function arrangeCases<T>(items: readonly T[], idOf: (t: T) => string, opts: ArrangeOpts<T>): Arranged<T> {
  const { history, now, student } = opts;
  const seen = new Set<string>();
  const uniq: T[] = [];
  for (const t of items) {
    const id = idOf(t);
    if (seen.has(id)) continue;
    seen.add(id);
    uniq.push(t);
  }
  const ids = uniq.map(idOf);
  const drip = weeklyDrip(ids, student, history, now, opts.drip ?? dripSize(ids.length));
  const started: T[] = [];
  const week: T[] = [];
  const plain: T[] = [];
  const done: T[] = [];
  for (const t of uniq) {
    const id = idOf(t);
    if (opts.started?.has(id)) started.push(t);
    else if (isDone(history.get(id))) done.push(t);
    else if (drip.has(id)) week.push(t);
    else plain.push(t);
  }
  const w = weekIndex(now);
  week.sort((a, b) => hash32(`${student}|${w}|${idOf(a)}`) - hash32(`${student}|${w}|${idOf(b)}`));
  if (opts.rng) {
    for (let i = plain.length - 1; i > 0; i--) {
      const j = Math.floor(opts.rng() * (i + 1));
      [plain[i], plain[j]] = [plain[j], plain[i]];
    }
  }
  const row = (t: T) => history.get(idOf(t))!;
  const lv = (t: T) => opts.level?.(t) ?? 0;
  done.sort((a, b) => {
    const ma = row(a).ok === false ? 0 : 1;
    const mb = row(b).ok === false ? 0 : 1;
    return ma - mb || lv(b) - lv(a) || row(a).at - row(b).at;
  });
  const tag = (list: T[], mark: CaseMark) => list.map((item) => ({ item, id: idOf(item), mark }));
  const list = [...tag(started, "started"), ...tag(week, "week"), ...tag(plain, "new"), ...tag(done, "done")];
  return { list, recycled: list.length > 0 && !started.length && !week.length && !plain.length, fresh: week.length + plain.length };
}

/** The case to open by default (or after `current`): never a done one while any other is left. */
export function nextCase<T>(items: readonly T[], idOf: (t: T) => string, opts: ArrangeOpts<T> & { current?: string }): { item: T; recycled: boolean } | null {
  const a = arrangeCases(items, idOf, opts);
  const rest = a.list.filter((x) => x.id !== opts.current);
  const pick = rest[0] ?? a.list[0];
  if (!pick) return null;
  return { item: pick.item, recycled: a.recycled || pick.mark === "done" };
}

/**
 * A round of up to `size` cases. While new cases are left the round holds
 * new ones only (it can be shorter than `size`); once every case is done it
 * is the hardest `size` again.
 */
export function freshRound<T>(items: readonly T[], idOf: (t: T) => string, size: number, opts: ArrangeOpts<T>): { round: T[]; recycled: boolean } {
  const a = arrangeCases(items, idOf, opts);
  if (a.recycled) return { round: a.list.slice(0, size).map((x) => x.item), recycled: true };
  return { round: a.list.filter((x) => x.mark !== "done").slice(0, size).map((x) => x.item), recycled: false };
}

/** Never-done cases in a library. */
export function newCount(ids: readonly string[], history: History): number {
  return [...new Set(ids)].filter((id) => !isDone(history.get(id))).length;
}

/** The hub line, only when the number is large ("120+ new cases"); null otherwise. */
export function hubNewLabel(n: number): string | null {
  if (n < BIG_NEW) return null;
  return `${Math.floor(n / 10) * 10}+ new cases`;
}
