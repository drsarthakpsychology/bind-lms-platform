import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { isHiddenAccount } from "@/lib/people/hidden";
import { normalise } from "@/lib/learn/engine";
import { displayName } from "@/lib/learn/leaderboard";
import { loadCohortMap } from "@/lib/standing/cohort-map";
import { difficultyOf, firstTryCorrect, leaguePoints, type AnswerEvent, type Difficulty, type PointsBreakdown } from "./points";
import { assignGroups, clampTier, closeGroup, type Closed, type Grouped, type Tier } from "./tiers";
import { istMidnightUtc, previousWeek } from "./week";

/**
 * Reading league data with the server key. Every reader degrades: a missing
 * table (migration not run yet) gives empty data, never an error page.
 */

type Admin = ReturnType<typeof createAdminClient>;

export type Student = {
  id: string;
  /** Real name (cohort board). */
  fullName: string;
  /** Alias if set, else first name and initial (platform boards). */
  publicName: string;
  /** First name and initial. */
  shortName: string;
  alias: string | null;
  title: string | null;
  look: string | null;
  cohortIds: string[];
};

/** Every visible student (test and robot accounts are left out). */
export async function loadStudents(admin: Admin = createAdminClient()): Promise<Student[]> {
  let rows: Record<string, unknown>[] = [];
  const full = await admin.from("profiles").select("id, name, email, role, is_test, alias, title, look").eq("role", "student").limit(5000);
  if (!full.error) rows = (full.data ?? []) as Record<string, unknown>[];
  else {
    // The alias/title/look columns aren't there yet.
    const basic = await admin.from("profiles").select("id, name, email, role, is_test").eq("role", "student").limit(5000);
    rows = (basic.data ?? []) as Record<string, unknown>[];
  }
  const cohorts = await loadCohortMap().catch(() => new Map<string, string[]>());
  return rows
    .filter((p) => !isHiddenAccount(p as { email?: string | null; is_test?: boolean | null }))
    .map((p) => {
      const email = String(p.email ?? "");
      const name = (p.name as string | null) ?? null;
      const alias = typeof p.alias === "string" && p.alias.trim() ? p.alias.trim() : null;
      const short = displayName(name, email);
      return {
        id: p.id as string,
        fullName: name?.trim() || short,
        publicName: alias ?? short,
        shortName: short,
        alias,
        title: typeof p.title === "string" && p.title ? p.title : null,
        look: typeof p.look === "string" && p.look ? p.look : null,
        cohortIds: cohorts.get(p.id as string) ?? [],
      };
    });
}

/** Item difficulty from item_stats, if another part of the platform keeps it. */
async function loadDifficulty(admin: Admin): Promise<(item: string) => Difficulty> {
  try {
    const { data, error } = await admin.from("item_stats").select("*").limit(20000);
    if (error || !data) return () => 1;
    const map = new Map<string, Difficulty>();
    for (const r of data as Record<string, unknown>[]) {
      const id = String(r.item ?? r.item_id ?? r.id ?? "");
      if (!id) continue;
      const num = (k: string) => (typeof r[k] === "number" ? (r[k] as number) : null);
      map.set(id, difficultyOf({ pCorrect: num("p_correct") ?? num("correct_rate"), rating: num("rating") ?? num("elo") }));
    }
    return (item) => map.get(item) ?? 1;
  } catch {
    return () => 1;
  }
}

/**
 * League points for the IST days from `from` (inclusive) to `to` (exclusive),
 * for everyone (or only `only`).
 */
export async function pointsBetween(admin: Admin, from: string, to: string, only?: string[]): Promise<Map<string, PointsBreakdown>> {
  const [map] = await pointsWindows(admin, [[from, to]], only);
  return map;
}

/** League points for several windows at once (one read of the data). */
export async function pointsWindows(admin: Admin, windows: readonly (readonly [string, string])[], only?: string[]): Promise<Map<string, PointsBreakdown>[]> {
  if (!windows.length) return [];
  const lo = windows.reduce((a, w) => (w[0] < a ? w[0] : a), windows[0][0]);
  const hi = windows.reduce((a, w) => (w[1] > a ? w[1] : a), windows[0][1]);
  const start = istMidnightUtc(lo).toISOString();
  const end = istMidnightUtc(hi).toISOString();
  let learnQ = admin.from("learn_progress").select("user_id, state").limit(5000);
  let ledgerQ = admin.from("xp_ledger").select("user_id, source, amount, created_at").gte("created_at", start).lt("created_at", end).limit(50000);
  let eventsQ = admin.from("learn_events").select("user_id, type, item, ok, created_at").not("item", "is", null).not("ok", "is", null).gte("created_at", start).lt("created_at", end).limit(50000);
  if (only?.length) {
    learnQ = learnQ.in("user_id", only);
    ledgerQ = ledgerQ.in("user_id", only);
    eventsQ = eventsQ.in("user_id", only);
  }
  const [learn, ledger, events, difficulty] = await Promise.all([learnQ, ledgerQ, eventsQ, loadDifficulty(admin)]);

  type L = { source: string; amount: number; at: string };
  const led = new Map<string, L[]>();
  if (!ledger.error) for (const r of ledger.data ?? []) led.set(r.user_id as string, [...(led.get(r.user_id as string) ?? []), { source: String(r.source), amount: Number(r.amount) || 0, at: String(r.created_at) }]);
  const ev = new Map<string, AnswerEvent[]>();
  if (!events.error)
    for (const r of events.data ?? []) {
      const k = r.user_id as string;
      ev.set(k, [...(ev.get(k) ?? []), { item: `${r.type}:${r.item}`, ok: r.ok === true, at: String(r.created_at) }]);
    }
  const hist = new Map((learn.error ? [] : (learn.data ?? [])).map((r) => [r.user_id as string, normalise(r.state).history]));
  const ids = new Set<string>([...hist.keys(), ...led.keys(), ...ev.keys()]);
  const diff = (item: string) => difficulty(item.slice(item.indexOf(":") + 1));
  return windows.map(([from, to]) => {
    const a = istMidnightUtc(from).getTime();
    const b = istMidnightUtc(to).getTime();
    const inside = (at: string) => {
      const t = Date.parse(at);
      return t >= a && t < b;
    };
    const out = new Map<string, PointsBreakdown>();
    for (const id of ids) {
      const firstTries = firstTryCorrect((ev.get(id) ?? []).filter((e) => inside(e.at)));
      const ledgerRows = (led.get(id) ?? []).filter((r) => inside(r.at));
      out.set(id, leaguePoints({ history: hist.get(id) ?? {}, ledger: ledgerRows, firstTries, difficulty: diff }, from, to));
    }
    return out;
  });
}

export type WeekRow = { week: string; user_id: string; tier: number; group_no: number; points: number; final_rank: number | null; result: string | null };

export async function loadWeekRows(admin: Admin, week: string): Promise<{ rows: WeekRow[]; ready: boolean }> {
  try {
    const { data, error } = await admin.from("league_weeks").select("week, user_id, tier, group_no, points, final_rank, result").eq("week", week).limit(10000);
    if (error) return { rows: [], ready: false };
    return { rows: (data ?? []) as WeekRow[], ready: true };
  } catch {
    return { rows: [], ready: false };
  }
}

/** The most recent week before `week` that has league rows. */
async function lastWeekWithRows(admin: Admin, week: string): Promise<string | null> {
  try {
    const { data, error } = await admin.from("league_weeks").select("week").lt("week", week).order("week", { ascending: false }).limit(1);
    if (error || !data?.length) return null;
    return String(data[0].week);
  } catch {
    return null;
  }
}

/** Close a set of week rows: group them, rank on `points`, decide who moves. */
export function closeRows(rows: readonly WeekRow[], points: ReadonlyMap<string, number>): Closed[] {
  const groups = new Map<number, WeekRow[]>();
  for (const r of rows) groups.set(r.group_no, [...(groups.get(r.group_no) ?? []), r]);
  const out: Closed[] = [];
  for (const g of groups.values()) out.push(...closeGroup(g.map((r) => ({ userId: r.user_id, tier: clampTier(r.tier), points: points.get(r.user_id) ?? r.points }))));
  return out;
}

/**
 * Each student's tier going into `week`: from last week's result if it was
 * closed, otherwise by closing last week on the fly (the Monday job may not
 * have run yet). New students start in Neuron.
 */
export async function tiersFor(admin: Admin, week: string): Promise<{ tiers: Map<string, Tier>; closed: Map<string, Closed>; from: string | null }> {
  const tiers = new Map<string, Tier>();
  const closed = new Map<string, Closed>();
  const prev = await lastWeekWithRows(admin, week);
  if (!prev) return { tiers, closed, from: null };
  const { rows } = await loadWeekRows(admin, prev);
  if (!rows.length) return { tiers, closed, from: null };
  const done = rows.every((r) => r.result);
  if (done || prev !== previousWeek(week)) {
    for (const r of rows) {
      const t = clampTier(r.tier);
      const next = r.result === "promoted" ? Math.min(5, t + 1) : r.result === "relegated" ? Math.max(1, t - 1) : t;
      tiers.set(r.user_id, next as Tier);
      if (r.result && r.final_rank) closed.set(r.user_id, { userId: r.user_id, tier: t, points: r.points, rank: r.final_rank, result: r.result as Closed["result"], nextTier: next as Tier });
    }
    return { tiers, closed, from: prev };
  }
  const pts = await pointsBetween(admin, prev, week);
  for (const c of closeRows(rows, new Map([...pts].map(([k, v]) => [k, v.total])))) {
    tiers.set(c.userId, c.nextTier);
    closed.set(c.userId, c);
  }
  return { tiers, closed, from: prev };
}

export type LeagueWeekState = {
  week: string;
  groups: Grouped[];
  /** True when the groups come from league_weeks (the weekly job has run). */
  persisted: boolean;
  /** Last week's results (Monday's news). */
  closed: Map<string, Closed>;
};

/** Who is in which group this week, for everyone in `students`. */
export async function leagueGroups(admin: Admin, week: string, students: readonly Student[]): Promise<LeagueWeekState> {
  const { rows, ready } = await loadWeekRows(admin, week);
  const prior = await tiersFor(admin, week).catch(() => ({ tiers: new Map<string, Tier>(), closed: new Map<string, Closed>(), from: null }));
  if (ready && rows.length) {
    const known = new Set(rows.map((r) => r.user_id));
    const groups: Grouped[] = rows.map((r) => ({ userId: r.user_id, tier: clampTier(r.tier), groupNo: r.group_no }));
    // Students who joined after Monday play in the smallest Neuron group.
    const late = students.filter((s) => !known.has(s.id));
    if (late.length) {
      const sizes = new Map<number, number>();
      for (const g of groups) if (g.tier === 1) sizes.set(g.groupNo, (sizes.get(g.groupNo) ?? 0) + 1);
      const target = [...sizes].sort((a, b) => a[1] - b[1])[0]?.[0] ?? Math.max(0, ...groups.map((g) => g.groupNo)) + 1;
      for (const s of late) groups.push({ userId: s.id, tier: 1, groupNo: target });
    }
    return { week, groups, persisted: true, closed: prior.closed };
  }
  const placements = students.map((s) => ({ userId: s.id, tier: prior.tiers.get(s.id) ?? (1 as Tier) }));
  return { week, groups: assignGroups(placements, week), persisted: false, closed: prior.closed };
}
