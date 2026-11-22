/**
 * Totals that are never cut off at the database API's 1000-row limit.
 *
 * First choice: one call to a database function that adds the numbers up
 * (supabase/migrations_pending/2026_11_22_counts.sql). Until that file runs,
 * or if the call fails, the raw rows are read 1000 at a time and added up
 * here with exactly the same rules. Either way every row counts.
 *
 * Server only: the caller passes the service-role client.
 */

/** A single visit slice counts at most 30 minutes (a tab left open is not study). */
export const MAX_VISIT_S = 30 * 60;
const IST_MS = 5.5 * 3600000;
const PAGE = 1000;
/** A hard ceiling so a runaway table can never hold a request forever. */
const MAX_ROWS = 200_000;

type Err = { code?: string; message?: string } | null;
type Res<T> = { data: T[] | null; error: Err };
type Ranged<T> = { range: (a: number, b: number) => PromiseLike<Res<T>> };
// The Supabase client, or a fake in tests.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CountsDb = { from: (table: string) => any; rpc: (fn: string, args?: Record<string, unknown>) => any };

/** Every row of a query, 1000 at a time. `null` if any page failed. */
export async function pageAll<T>(build: () => Ranged<T>, max = MAX_ROWS): Promise<T[] | null> {
  const out: T[] = [];
  for (let from = 0; from < max; from += PAGE) {
    const r = await build().range(from, from + PAGE - 1);
    if (r.error) {
      console.error("pageAll:", r.error.code, r.error.message);
      return null;
    }
    const rows = r.data ?? [];
    out.push(...rows);
    if (rows.length < PAGE) break;
  }
  return out;
}

/** Rows from a database function, paged too (a function's rows obey the same limit). */
async function rpcAll<T>(db: CountsDb, fn: string, args?: Record<string, unknown>): Promise<T[] | null> {
  return pageAll<T>(() => (args ? db.rpc(fn, args) : db.rpc(fn)));
}

const slice = (s: number | null | undefined) => Math.min(MAX_VISIT_S, Math.max(0, Number(s ?? 0)));
const istDay = (iso: string) => new Date(new Date(iso).getTime() + IST_MS).toISOString().slice(0, 10);
const endOf = (v: RawVisit) => v.left_at ?? new Date(new Date(v.entered_at).getTime() + Math.max(0, Number(v.duration_seconds ?? 0)) * 1000).toISOString();
const later = (a: string | null, b: string | null) => (!a ? b : !b ? a : Date.parse(b) > Date.parse(a) ? b : a);

export type RawVisit = { user_id: string; path?: string; entered_at: string; left_at: string | null; duration_seconds: number | null };
export type VisitTotals = { seconds: number; secondsWeek: number; activeDays: number; lastVisit: string | null };

/** Add raw visits up per student (the fallback, and the rule the SQL copies). */
export function sumVisits(rows: RawVisit[], weekIso: string): Map<string, VisitTotals> {
  const week = Date.parse(weekIso);
  const days = new Map<string, Set<string>>();
  const out = new Map<string, VisitTotals>();
  for (const v of rows) {
    const t = out.get(v.user_id) ?? { seconds: 0, secondsWeek: 0, activeDays: 0, lastVisit: null };
    const s = slice(v.duration_seconds);
    t.seconds += s;
    if (Date.parse(v.entered_at) >= week) t.secondsWeek += s;
    t.lastVisit = later(t.lastVisit, endOf(v));
    const d = days.get(v.user_id) ?? new Set<string>();
    d.add(istDay(v.entered_at));
    days.set(v.user_id, d);
    t.activeDays = d.size;
    out.set(v.user_id, t);
  }
  return out;
}

/** Time on VIBHA per student since `sinceIso`; "week" part since `weekIso`. */
export async function visitTotals(db: CountsDb, sinceIso: string, weekIso: string): Promise<Map<string, VisitTotals>> {
  type Row = { user_id: string; seconds_all: number; seconds_week: number; active_days: number; last_visit: string | null };
  const rows = await rpcAll<Row>(db, "activity_user_totals", { p_since: sinceIso, p_week: weekIso });
  if (rows) {
    return new Map(rows.map((r) => [r.user_id, { seconds: Number(r.seconds_all ?? 0), secondsWeek: Number(r.seconds_week ?? 0), activeDays: Number(r.active_days ?? 0), lastVisit: r.last_visit ?? null }]));
  }
  const raw = await pageAll<RawVisit>(() =>
    db.from("page_visits").select("user_id, entered_at, left_at, duration_seconds").gte("entered_at", sinceIso).order("id", { ascending: true }),
  );
  return sumVisits(raw ?? [], weekIso);
}

export type VisitShape = { heat: number[][]; pathSeconds: Map<string, number> };

/** Raw visits into the heatmap (India weekday Monday = 0, hour) and seconds per path. */
export function shapeVisits(rows: RawVisit[]): VisitShape {
  const heat: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  const pathSeconds = new Map<string, number>();
  for (const v of rows) {
    const t = new Date(new Date(v.entered_at).getTime() + IST_MS);
    heat[(t.getUTCDay() + 6) % 7][t.getUTCHours()] += slice(v.duration_seconds);
    const p = String(v.path ?? "").split("?")[0];
    pathSeconds.set(p, (pathSeconds.get(p) ?? 0) + slice(v.duration_seconds));
  }
  return { heat, pathSeconds };
}

/** Heatmap and per-path seconds since `sinceIso`, in seconds. */
export async function visitShape(db: CountsDb, sinceIso: string): Promise<VisitShape> {
  const [heatRows, pathRows] = await Promise.all([
    rpcAll<{ dow: number; hour: number; seconds: number }>(db, "activity_heat", { p_since: sinceIso }),
    rpcAll<{ path: string; seconds: number }>(db, "activity_paths", { p_since: sinceIso }),
  ]);
  if (heatRows && pathRows) {
    const heat: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    for (const r of heatRows) if (r.dow >= 0 && r.dow < 7 && r.hour >= 0 && r.hour < 24) heat[r.dow][r.hour] += Number(r.seconds ?? 0);
    return { heat, pathSeconds: new Map(pathRows.map((r) => [r.path, Number(r.seconds ?? 0)])) };
  }
  const raw = await pageAll<RawVisit>(() =>
    db.from("page_visits").select("user_id, path, entered_at, left_at, duration_seconds").gte("entered_at", sinceIso).order("id", { ascending: true }),
  );
  return shapeVisits(raw ?? []);
}

export type RawProgress = { user_id: string; watched_seconds: number | null; is_completed: boolean | null; updated_at: string | null };
export type ProgressTotals = { lessonsDone: number; lessonsStarted: number; watchedSeconds: number; lastUpdate: string | null };

export function sumProgress(rows: RawProgress[]): Map<string, ProgressTotals> {
  const out = new Map<string, ProgressTotals>();
  for (const p of rows) {
    const t = out.get(p.user_id) ?? { lessonsDone: 0, lessonsStarted: 0, watchedSeconds: 0, lastUpdate: null };
    if (p.is_completed) t.lessonsDone++;
    const w = Math.max(0, Number(p.watched_seconds ?? 0));
    if (w > 0) t.lessonsStarted++;
    t.watchedSeconds += w;
    t.lastUpdate = later(t.lastUpdate, p.updated_at ?? null);
    out.set(p.user_id, t);
  }
  return out;
}

/** Lectures per student: finished, started, seconds, last save. */
export async function progressTotals(db: CountsDb): Promise<Map<string, ProgressTotals>> {
  type Row = { user_id: string; lessons_done: number; lessons_started: number; watched_seconds: number; last_update: string | null };
  const rows = await rpcAll<Row>(db, "progress_user_totals");
  if (rows) {
    return new Map(rows.map((r) => [r.user_id, { lessonsDone: Number(r.lessons_done ?? 0), lessonsStarted: Number(r.lessons_started ?? 0), watchedSeconds: Number(r.watched_seconds ?? 0), lastUpdate: r.last_update ?? null }]));
  }
  const raw = await pageAll<RawProgress>(() =>
    db.from("progress").select("user_id, watched_seconds, is_completed, updated_at").order("user_id", { ascending: true }).order("lesson_id", { ascending: true }),
  );
  return sumProgress(raw ?? []);
}

export type RawSend = { recipient: string; sent_at: string | null; opened_at: string | null };
export type EmailTotals = { sent: number; lastSent: string | null; opened: boolean };

export function sumSends(rows: RawSend[]): Map<string, EmailTotals> {
  const out = new Map<string, EmailTotals>();
  for (const s of rows) {
    const k = String(s.recipient ?? "").toLowerCase();
    const t = out.get(k) ?? { sent: 0, lastSent: null, opened: false };
    t.sent++;
    t.opened = t.opened || Boolean(s.opened_at);
    t.lastSent = later(t.lastSent, s.sent_at ?? null);
    out.set(k, t);
  }
  return out;
}

/** Sent emails per recipient (lower case). */
export async function emailTotals(db: CountsDb): Promise<Map<string, EmailTotals>> {
  type Row = { recipient: string; sent: number; last_sent: string | null; opened: boolean };
  const rows = await rpcAll<Row>(db, "email_send_totals");
  if (rows) return new Map(rows.map((r) => [String(r.recipient).toLowerCase(), { sent: Number(r.sent ?? 0), lastSent: r.last_sent ?? null, opened: Boolean(r.opened) }]));
  const raw = await pageAll<RawSend>(() => db.from("email_sends").select("recipient, sent_at, opened_at").eq("status", "sent").order("id", { ascending: true }));
  return sumSends(raw ?? []);
}
