import "server-only";
import type { ClinicBatch, ClinicLeaveBalance, ClinicMySession, ClinicTrackerRow, ClinicVisit } from "@/lib/app-api/contract";
import { tableMissing } from "@/lib/app-api/devices";
import { ApiFail } from "@/lib/app-api/respond";
import { isOpen, myStatus, summarize } from "./attendance";
import { quotaOf, toVisit, visitTally, countsAsLeave } from "./cases";
import { approvedLeaveMap, balance, earlyLeaveMap } from "./leave";
import { localDate } from "./time";
import { batchOfKind, toSession } from "./timetable";
import {
  DEFAULT_OPD_SETTINGS,
  type AllowanceRow,
  type AssignmentRow,
  type AttendanceRow,
  type CaseLogRow,
  type ExtraRow,
  type LeaveRow,
  type OpdPrefRow,
  type OpdSettingsRow,
  type QuotaRow,
  type SessionRow,
} from "./types";

/**
 * Clinic reads shared by the student and admin operations. Every read uses the
 * service-role client handed in (the caller has already checked who is
 * asking); student reads are always filtered to the caller's own id.
 *
 * Before the database step runs every read answers 503 `unavailable`.
 */

// The Supabase client, or the in-memory one in tests.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Db = { from: (table: string) => any };

type Res<T> = { data: T | null; error: { code?: string; message?: string } | null };

export function must<T>(r: Res<T>, fallback: T): T {
  if (r.error) {
    if (tableMissing(r.error) || (/clinic_/.test(r.error.message ?? "") && /does not exist|schema cache/i.test(r.error.message ?? ""))) throw new ApiFail("unavailable");
    console.error("clinic db:", r.error.code, r.error.message);
    throw new ApiFail("server_error");
  }
  return (r.data ?? fallback) as T;
}

/** Every row of a query, 1000 at a time (the API answers at most 1000 per call). */
export async function fetchAll<T>(build: () => { range: (a: number, b: number) => PromiseLike<Res<T[]>> }): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; from < 50_000; from += 1000) {
    const page = must(await build().range(from, from + 999), [] as T[]);
    out.push(...page);
    if (page.length < 1000) break;
  }
  return out;
}

export function chunk<T>(list: readonly T[], n = 200): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += n) out.push(list.slice(i, i + n));
  return out;
}

/* ------------------------------------------------------------ people */

export type Person = { userId: string; name: string | null; roll: string | null; joinedOn: string | null };

/** The students of a cohort (role student), with the day they were added. */
export async function cohortStudents(db: Db, cohortId: string): Promise<Person[]> {
  const members = await fetchAll<{ user_id: string; added_at: string | null }>(() => db.from("cohort_members").select("user_id, added_at").eq("cohort_id", cohortId));
  if (!members.length) return [];
  const people: { id: string; name: string | null; roll_number: string | null; role: string }[] = [];
  for (const ids of chunk(members.map((m) => m.user_id))) {
    people.push(...must(await db.from("profiles").select("id, name, roll_number, role").in("id", ids), []));
  }
  const byId = new Map(people.map((p) => [p.id, p]));
  return members
    .filter((m) => byId.get(m.user_id)?.role === "student")
    .map((m) => ({ userId: m.user_id, name: byId.get(m.user_id)?.name ?? null, roll: byId.get(m.user_id)?.roll_number ?? null, joinedOn: m.added_at ? localDate(Date.parse(m.added_at)) : null }))
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "") || a.userId.localeCompare(b.userId));
}

export async function cohortList(db: Db): Promise<{ id: string; name: string }[]> {
  const rows = must(await db.from("cohorts").select("id, name, created_at").order("created_at", { ascending: false }), [] as { id: string; name: string }[]);
  return rows.map((r) => ({ id: r.id, name: r.name }));
}

/** The admin's cohort: the one asked for, or the newest. */
export async function adminCohort(db: Db, requested: string | null | undefined): Promise<{ cohorts: { id: string; name: string }[]; cohortId: string | null }> {
  const cohorts = await cohortList(db);
  if (requested) {
    if (!cohorts.some((c) => c.id === requested)) throw new ApiFail("not_found", "That cohort was not found.");
    return { cohorts, cohortId: requested };
  }
  return { cohorts, cohortId: cohorts[0]?.id ?? null };
}

export async function requireCohort(db: Db, cohortId: string | null | undefined): Promise<string> {
  const { cohortId: id } = await adminCohort(db, cohortId);
  if (!id) throw new ApiFail("not_found", "Make a cohort first.");
  return id;
}

/**
 * The student's clinic cohort: the one asked for (must be their own), else the
 * newest one with OPD settings, else their newest cohort. Null when they are in none.
 */
export async function studentCohort(db: Db, userId: string, requested?: string | null): Promise<{ cohortId: string; joinedOn: string | null; memberOf: string[] } | null> {
  const rows = must(await db.from("cohort_members").select("cohort_id, added_at").eq("user_id", userId), [] as { cohort_id: string; added_at: string | null }[]);
  if (!rows.length) {
    if (requested) throw new ApiFail("forbidden", "That is not your cohort.");
    return null;
  }
  const memberOf = rows.map((r) => r.cohort_id);
  const joined = (id: string) => {
    const r = rows.find((x) => x.cohort_id === id);
    return r?.added_at ? localDate(Date.parse(r.added_at)) : null;
  };
  if (requested) {
    if (!memberOf.includes(requested)) throw new ApiFail("forbidden", "That is not your cohort.");
    return { cohortId: requested, joinedOn: joined(requested), memberOf };
  }
  const sorted = [...rows].sort((a, b) => String(b.added_at ?? "").localeCompare(String(a.added_at ?? "")));
  const set = must(await db.from("clinic_opd_settings").select("cohort_id").in("cohort_id", memberOf), [] as { cohort_id: string }[]);
  const withClinic = sorted.find((r) => set.some((s) => s.cohort_id === r.cohort_id));
  const pick = (withClinic ?? sorted[0]!).cohort_id;
  return { cohortId: pick, joinedOn: joined(pick), memberOf };
}

export async function namesOf(db: Db, ids: readonly string[]): Promise<Map<string, { name: string | null; roll: string | null }>> {
  const out = new Map<string, { name: string | null; roll: string | null }>();
  for (const part of chunk([...new Set(ids)])) {
    const rows = must(await db.from("profiles").select("id, name, roll_number").in("id", part), [] as { id: string; name: string | null; roll_number: string | null }[]);
    for (const r of rows) out.set(r.id, { name: r.name ?? null, roll: r.roll_number ?? null });
  }
  return out;
}

/* ---------------------------------------------------------- settings */

export async function loadSettings(db: Db, cohortId: string): Promise<OpdSettingsRow> {
  const row = must(await db.from("clinic_opd_settings").select("*").eq("cohort_id", cohortId).maybeSingle(), null as OpdSettingsRow | null);
  if (!row) return DEFAULT_OPD_SETTINGS(cohortId);
  return { ...DEFAULT_OPD_SETTINGS(cohortId), ...row, seats: (row.seats ?? {}) as OpdSettingsRow["seats"], holidays: row.holidays ?? [] };
}

/* ------------------------------------------------------------ bundle */

/** Everything about one cohort (or one student in it) that the views are made from. */
export type Bundle = {
  cohortId: string;
  settings: OpdSettingsRow;
  sessions: SessionRow[];
  sessionById: Map<string, SessionRow>;
  att: AttendanceRow[];
  leaves: LeaveRow[];
  assignments: AssignmentRow[];
  logs: CaseLogRow[];
  allowances: AllowanceRow[];
  quotas: QuotaRow[];
  extras: ExtraRow[];
  prefs: OpdPrefRow[];
};

export async function loadBundle(db: Db, cohortId: string, userId?: string): Promise<Bundle> {
  const own = <Q extends { eq: (c: string, v: string) => Q }>(q: Q): Q => (userId ? q.eq("user_id", userId) : q);
  const [settings, sessions, leaves, assignments, logs, allowances, quotas, extras, prefs] = await Promise.all([
    loadSettings(db, cohortId),
    fetchAll<SessionRow>(() => db.from("clinic_sessions").select("*").contains("cohort_ids", [cohortId]).order("date").order("start_time")),
    fetchAll<LeaveRow>(() => own(db.from("clinic_leave_requests").select("*").eq("cohort_id", cohortId)).order("created_at", { ascending: false })),
    fetchAll<AssignmentRow>(() => own(db.from("clinic_opd_assignments").select("*").eq("cohort_id", cohortId).eq("state", "published")).order("date")),
    fetchAll<CaseLogRow>(() => own(db.from("clinic_case_logs").select("*").eq("cohort_id", cohortId))),
    fetchAll<AllowanceRow>(() => own(db.from("clinic_leave_allowances").select("*").eq("cohort_id", cohortId))),
    fetchAll<QuotaRow>(() => own(db.from("clinic_case_quotas").select("*").eq("cohort_id", cohortId))),
    fetchAll<ExtraRow>(() => own(db.from("clinic_case_extras").select("*").eq("cohort_id", cohortId)).order("created_at")),
    fetchAll<OpdPrefRow>(() => own(db.from("clinic_opd_prefs").select("*").eq("cohort_id", cohortId))),
  ]);
  const sessionById = new Map(sessions.map((s) => [s.id, s]));
  let att: AttendanceRow[] = [];
  if (userId) {
    att = (await fetchAll<AttendanceRow>(() => db.from("clinic_attendance").select("*").eq("user_id", userId))).filter((a) => sessionById.has(a.session_id));
  } else {
    for (const ids of chunk(sessions.map((s) => s.id))) att.push(...(await fetchAll<AttendanceRow>(() => db.from("clinic_attendance").select("*").in("session_id", ids))));
  }
  return { cohortId, settings, sessions, sessionById, att, leaves, assignments, logs, allowances, quotas, extras, prefs };
}

/* ------------------------------------------------------------- views */

export function allowanceOf(b: Bundle, userId: string): number {
  return b.allowances.find((a) => a.user_id === userId)?.allowance ?? 0;
}

export function balanceOf(b: Bundle, userId: string): ClinicLeaveBalance {
  return balance(allowanceOf(b, userId), b.leaves.filter((l) => l.user_id === userId));
}

export function batchOf(b: Bundle, userId: string): ClinicBatch | null {
  return b.prefs.find((p) => p.user_id === userId)?.batch ?? null;
}

/** The OPD session of a day and batch (a scheduled one first). */
export function opdSessionOf(b: Bundle, date: string, batch: ClinicBatch): SessionRow | null {
  const list = b.sessions.filter((s) => s.date === date && batchOfKind(s.kind) === batch);
  return list.find((s) => s.status === "scheduled") ?? list[0] ?? null;
}

/** One student's sessions as they see them. */
export function mySessions(b: Bundle, userId: string, sessions: readonly SessionRow[], now: number): ClinicMySession[] {
  const mine = b.leaves.filter((l) => l.user_id === userId);
  const leaveMap = approvedLeaveMap(mine);
  const early = earlyLeaveMap(mine);
  const assigned = new Set(b.assignments.filter((a) => a.user_id === userId).map((a) => `${a.date}|${a.batch}`));
  const attBy = new Map(b.att.filter((a) => a.user_id === userId).map((a) => [a.session_id, a]));
  return sessions.map((row) => {
    const s = toSession(row);
    const isAssigned = s.batch ? assigned.has(`${s.date}|${s.batch}`) : false;
    const required = s.batch ? isAssigned : s.compulsory;
    const att = attBy.get(s.id) ?? null;
    const st = myStatus({ session: s, now, required, att, onLeave: leaveMap.has(s.id), lateMinutes: b.settings.late_minutes });
    return {
      ...s,
      required,
      assigned: isAssigned,
      open: isOpen(s, now),
      my: { status: st.status, inAt: att?.in_at ?? null, outAt: att?.out_at ?? null, late: st.late, minutes: st.minutes, leaveId: leaveMap.get(s.id) ?? null, earlyLeaveAt: early.get(s.id) ?? null },
    };
  });
}

/** One student's published OPD visits, with their state. */
export function myVisits(b: Bundle, userId: string, today: string): ClinicVisit[] {
  const leaveMap = approvedLeaveMap(b.leaves.filter((l) => l.user_id === userId));
  const logs = new Map(b.logs.filter((l) => l.user_id === userId).map((l) => [l.assignment_id, l]));
  const attIn = new Set(b.att.filter((a) => a.user_id === userId && a.in_at).map((a) => a.session_id));
  return b.assignments
    .filter((a) => a.user_id === userId)
    .sort((x, y) => x.date.localeCompare(y.date))
    .map((a) => {
      const s = opdSessionOf(b, a.date, a.batch);
      return toVisit({
        assignment: a,
        today,
        log: logs.get(a.id) ?? null,
        attended: s ? attIn.has(s.id) : false,
        onLeave: s ? leaveMap.has(s.id) : false,
        session: s ? { id: s.id, start: s.start_time.slice(0, 5), end: s.end_time.slice(0, 5), cancelled: s.status === "cancelled" } : null,
      });
    });
}

/** Assignment ids the student scanned in on. */
export function attendedVisits(b: Bundle, userId: string): Set<string> {
  const attIn = new Set(b.att.filter((a) => a.user_id === userId && a.in_at).map((a) => a.session_id));
  const out = new Set<string>();
  for (const a of b.assignments) {
    if (a.user_id !== userId) continue;
    const s = opdSessionOf(b, a.date, a.batch);
    if (s && attIn.has(s.id)) out.add(a.id);
  }
  return out;
}

export function quotaFor(b: Bundle, userId: string, visits: readonly ClinicVisit[]) {
  return quotaOf({
    base: b.quotas.find((q) => q.user_id === userId)?.base ?? 0,
    extras: b.extras.filter((e) => e.user_id === userId),
    visits,
    casesPerVisit: b.settings.cases_per_visit,
    attended: attendedVisits(b, userId),
  });
}

export function trackerRow(b: Bundle, p: { userId: string; name: string | null; roll: string | null }, today: string, now: number): ClinicTrackerRow {
  const visits = myVisits(b, p.userId, today);
  const past = b.sessions.filter((s) => s.date <= today);
  return {
    userId: p.userId,
    name: p.name,
    roll: p.roll,
    batch: batchOf(b, p.userId),
    attendance: summarize(mySessions(b, p.userId, past, now).map((s) => ({ status: s.my.status, required: s.required, minutes: s.my.minutes }))),
    leave: balanceOf(b, p.userId),
    cases: quotaFor(b, p.userId, visits),
    visits: visitTally(visits),
  };
}

/* ------------------------------------------------------- missed days */

/**
 * Keeps the "missed" leave rows in step with the visits: a missed (or logged
 * absent) assigned OPD day is one approved leave, over the limit when none
 * are left; a visit no longer missed (a log came, a manual mark, approved
 * leave) loses its row. Idempotent. Updates `b.leaves` in place.
 */
export async function reconcileMissed(db: Db, b: Bundle, userIds: readonly string[], today: string): Promise<void> {
  const add: Omit<LeaveRow, "id" | "created_at">[] = [];
  const remove: string[] = [];
  for (const userId of userIds) {
    const visits = myVisits(b, userId, today);
    const want = new Set(visits.filter((v) => countsAsLeave(v.state)).map((v) => v.assignmentId));
    const have = b.leaves.filter((l) => l.user_id === userId && l.kind === "missed");
    for (const l of have) if (!l.assignment_id || !want.has(l.assignment_id)) remove.push(l.id);
    const haveIds = new Set(have.map((l) => l.assignment_id));
    let bal = balanceOf(b, userId);
    for (const id of want) {
      if (haveIds.has(id)) continue;
      const over = bal.used + 1 > bal.allowance;
      add.push({ user_id: userId, cohort_id: b.cohortId, kind: "missed", session_ids: [], leave_at: null, reason: "Missed an assigned OPD day", status: "approved", over_limit: over, assignment_id: id, decided_by: null, decided_at: null, decision_note: null });
      bal = { ...bal, used: bal.used + 1 };
    }
  }
  if (remove.length) {
    for (const ids of chunk(remove)) must(await db.from("clinic_leave_requests").delete().in("id", ids), null);
    b.leaves = b.leaves.filter((l) => !remove.includes(l.id));
  }
  if (add.length) {
    const r = await db.from("clinic_leave_requests").upsert(add, { onConflict: "assignment_id" }).select("*");
    b.leaves.push(...(must(r, [] as LeaveRow[]) as LeaveRow[]));
  }
}

export const todayOf = (now: number) => localDate(now);
