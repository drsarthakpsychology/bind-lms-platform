import "server-only";
import type {
  ClinicBatch,
  ClinicCaseLogBody,
  ClinicDirection,
  ClinicEarlyLeaveBody,
  ClinicLeaveBody,
  ClinicLeaveRequest,
  ClinicMyAttendance,
  ClinicMyLeave,
  ClinicMyOpd,
  ClinicScanBody,
  ClinicScanResult,
  ClinicToday,
  ClinicVisit,
  ClinicWeek,
} from "@/lib/app-api/contract";
import { ApiFail } from "@/lib/app-api/respond";
import { decideScan, isLate, isOpen, minutesPresent, summarize } from "./attendance";
import {
  balanceOf,
  batchOf,
  loadBundle,
  must,
  myVisits,
  mySessions,
  quotaFor,
  summaryOf,
  reconcileMissed,
  studentCohort,
  todayOf,
  type Bundle,
  type Db,
} from "./data";
import { checkLeaveSessions, overLimit, sessionsTaken, toLeaveRequest } from "./leave";
import { normalizeCode, parseQr, verifyCode, verifyToken } from "./qr";
import { addDays, dateRange, hhmm, instant, isDate, mondayOf } from "./time";
import { toSession } from "./timetable";
import type { AttendanceRow, DayNoteRow, LeaveRow, SecretRow, SessionRow } from "./types";

/**
 * The student's side of the clinic. Every function acts for `userId` only
 * (the verified caller); nothing here takes another student's id.
 */

type Ctx = { cohortId: string; joinedOn: string | null; memberOf: string[]; b: Bundle };

async function context(db: Db, userId: string, cohort: string | null | undefined, now: number): Promise<Ctx | null> {
  const c = await studentCohort(db, userId, cohort);
  if (!c) return null;
  const b = await loadBundle(db, c.cohortId, userId);
  await reconcileMissed(db, b, [userId], todayOf(now));
  return { ...c, b };
}

async function notesIn(db: Db, cohortId: string, from: string, to: string): Promise<Map<string, string>> {
  const rows = must(await db.from("clinic_day_notes").select("date, note").eq("cohort_id", cohortId).gte("date", from).lte("date", to), [] as Pick<DayNoteRow, "date" | "note">[]);
  return new Map(rows.map((r) => [r.date, r.note]));
}

const sessionMap = (b: Bundle) => new Map(b.sessions.map((s) => [s.id, toSession(s)]));

export async function getToday(db: Db, userId: string, cohort: string | null | undefined, now: number): Promise<ClinicToday> {
  const today = todayOf(now);
  const ctx = await context(db, userId, cohort, now);
  if (!ctx) return { v: 1, date: today, cohortId: null, note: null, sessions: [], opd: null, leavesLeft: null, logsDue: 0 };
  const { b } = ctx;
  const sessions = mySessions(b, userId, b.sessions.filter((s) => s.date === today), now);
  const notes = await notesIn(db, ctx.cohortId, today, today);
  const visits = myVisits(b, userId, today);
  const v = visits.find((x) => x.date === today);
  return {
    v: 1,
    date: today,
    cohortId: ctx.cohortId,
    note: notes.get(today) ?? null,
    sessions,
    opd: v ? { batch: v.batch, start: v.start, end: v.end, sessionId: v.sessionId, assignmentId: v.assignmentId } : null,
    leavesLeft: balanceOf(b, userId).left,
    logsDue: visits.filter((x) => x.state === "due").length,
  };
}

export async function getWeek(db: Db, userId: string, cohort: string | null | undefined, start: string | null, now: number): Promise<ClinicWeek> {
  const today = todayOf(now);
  if (start && !isDate(start)) throw new ApiFail("bad_request", "Pick a real date.");
  const from = start ?? mondayOf(today);
  const to = addDays(from, 6);
  const ctx = await context(db, userId, cohort, now);
  if (!ctx) return { v: 1, from, to, cohortId: null, days: dateRange(from, to).map((date) => ({ date, note: null, sessions: [] })) };
  const notes = await notesIn(db, ctx.cohortId, from, to);
  const all = mySessions(ctx.b, userId, ctx.b.sessions.filter((s) => s.date >= from && s.date <= to), now);
  return { v: 1, from, to, cohortId: ctx.cohortId, days: dateRange(from, to).map((date) => ({ date, note: notes.get(date) ?? null, sessions: all.filter((s) => s.date === date) })) };
}

export async function getMyAttendance(db: Db, userId: string, cohort: string | null | undefined, now: number): Promise<ClinicMyAttendance> {
  const ctx = await context(db, userId, cohort, now);
  const empty = summarize([]);
  if (!ctx) return { v: 1, cohortId: null, summary: empty, sessions: [] };
  const today = todayOf(now);
  const list = mySessions(ctx.b, userId, ctx.b.sessions.filter((s) => s.date <= today), now)
    .filter((s) => s.required || s.my.inAt || s.my.status === "on_leave")
    .reverse();
  return { v: 1, cohortId: ctx.cohortId, summary: summaryOf(list), sessions: list };
}

/* -------------------------------------------------------------- scan */

/** One step scan (app versions before the two step screens; see ./scan-flow.ts for the current way). */
const QUICK_REPEAT_MS = 120_000;

async function secretOf(db: Db, sessionId: string): Promise<SecretRow | null> {
  return must(await db.from("clinic_session_secrets").select("*").eq("session_id", sessionId).maybeSingle(), null as SecretRow | null);
}

/**
 * Scan in or out with the QR text or the 6-character code. The code is
 * matched against the student's own open sessions today.
 */
export async function scan(db: Db, userId: string, body: ClinicScanBody, now: number): Promise<ClinicScanResult> {
  const memberRows = must(await db.from("cohort_members").select("cohort_id").eq("user_id", userId), [] as { cohort_id: string }[]);
  const memberOf = memberRows.map((r) => r.cohort_id);
  let session: SessionRow | null = null;
  let method: "qr" | "code";
  const wrong = "That code is not right or has changed. Scan the new one.";

  if (body.token) {
    method = "qr";
    const p = parseQr(body.token);
    if (!p) throw new ApiFail("bad_request", "That is not a VIBHA attendance code.");
    session = must(await db.from("clinic_sessions").select("*").eq("id", p.sessionId).maybeSingle(), null as SessionRow | null);
    if (!session) throw new ApiFail("bad_request", wrong);
    const secret = await secretOf(db, session.id);
    if (!secret || verifyToken(secret.secret, session.id, p.token, now) === null) throw new ApiFail("bad_request", wrong);
  } else if (body.code) {
    method = "code";
    const code = normalizeCode(body.code);
    if (!memberOf.length) throw new ApiFail("forbidden", "This session is not for your cohort.");
    const today = todayOf(now);
    const day = must(await db.from("clinic_sessions").select("*").in("date", [addDays(today, -1), today, addDays(today, 1)]), [] as SessionRow[]);
    const candidates = day.filter((s) => s.cohort_ids.some((c) => memberOf.includes(c)) && isOpen(toSession(s), now));
    for (const s of candidates) {
      const secret = await secretOf(db, s.id);
      if (secret && verifyCode(secret.secret, s.id, code, now) !== null) {
        session = s;
        break;
      }
    }
    if (!session) throw new ApiFail("bad_request", wrong);
  } else {
    throw new ApiFail("bad_request", "Scan the code or type it.");
  }

  const s = toSession(session);
  const existing = must(await db.from("clinic_attendance").select("*").eq("session_id", s.id).eq("user_id", userId).maybeSingle(), null as AttendanceRow | null);
  const d = decideScan({ session: s, now, memberOf, existing, direction: body.direction });
  if (!d.ok) throw new ApiFail(d.code, d.message);
  // Older app versions send no direction. A second scan right after IN is a repeat, not a goodbye: it never marks OUT.
  if (!body.direction && d.direction === "out" && existing?.in_at && now - Date.parse(existing.in_at) < QUICK_REPEAT_MS) throw new ApiFail("bad_request", "You already scanned in. Scan again when you leave.");

  const at = new Date(now).toISOString();
  const patch: Partial<AttendanceRow> & { updated_at: string } = d.direction === "in" ? { in_at: at, in_method: method, updated_at: at } : { out_at: at, out_method: method, updated_at: at };
  if (existing) {
    // Only write when that direction is still empty (two phones racing never move a time).
    const q = db.from("clinic_attendance").update(patch).eq("id", existing.id);
    must(await (d.direction === "in" ? q.is("in_at", null) : q.is("out_at", null)), null);
  } else {
    const r = await db.from("clinic_attendance").insert({ session_id: s.id, user_id: userId, ...patch });
    if (r.error?.code === "23505") throw new ApiFail("bad_request", "You already scanned in.");
    must(r, null);
  }
  const cohortId = s.cohortIds.find((c) => memberOf.includes(c))!;
  const settings = must(await db.from("clinic_opd_settings").select("late_minutes").eq("cohort_id", cohortId).maybeSingle(), null as { late_minutes: number } | null);
  const inAt = d.direction === "in" ? at : existing!.in_at;
  return {
    sessionId: s.id,
    title: s.title,
    direction: d.direction as ClinicDirection,
    at,
    late: isLate(inAt, s, settings?.late_minutes ?? 10),
    minutes: d.direction === "out" ? minutesPresent(inAt, at) : null,
  };
}

/* ------------------------------------------------------------- leave */

export async function getMyLeave(db: Db, userId: string, cohort: string | null | undefined, now: number): Promise<ClinicMyLeave> {
  const ctx = await context(db, userId, cohort, now);
  if (!ctx) return { v: 1, cohortId: null, balance: { allowance: 0, used: 0, pending: 0, left: 0 }, requests: [] };
  const map = sessionMap(ctx.b);
  return { v: 1, cohortId: ctx.cohortId, balance: balanceOf(ctx.b, userId), requests: ctx.b.leaves.map((l) => toLeaveRequest(l, map)) };
}

async function requireCtx(db: Db, userId: string, cohort: string | null | undefined, now: number): Promise<Ctx> {
  const ctx = await context(db, userId, cohort, now);
  if (!ctx) throw new ApiFail("forbidden", "You are not in a cohort yet.");
  return ctx;
}

export async function requestLeave(db: Db, userId: string, body: ClinicLeaveBody & { cohortId?: string }, now: number): Promise<ClinicLeaveRequest> {
  const ctx = await requireCtx(db, userId, body.cohortId, now);
  const map = sessionMap(ctx.b);
  const check = checkLeaveSessions({ ids: body.sessionIds, sessions: map, cohortId: ctx.cohortId, taken: sessionsTaken(ctx.b.leaves, "leave"), now, endsAt: (s) => instant(s.date, s.end) });
  if (!check.ok) throw new ApiFail("bad_request", check.message);
  const over = overLimit(balanceOf(ctx.b, userId), body.sessionIds.length);
  const row = must(
    await db
      .from("clinic_leave_requests")
      .insert({ id: crypto.randomUUID(), user_id: userId, cohort_id: ctx.cohortId, kind: "leave", session_ids: body.sessionIds, reason: body.reason.trim(), status: "pending", over_limit: over })
      .select("*")
      .single(),
    null as LeaveRow | null,
  );
  return toLeaveRequest(row!, map);
}

export async function requestEarlyLeave(db: Db, userId: string, body: ClinicEarlyLeaveBody & { cohortId?: string }, now: number): Promise<ClinicLeaveRequest> {
  const ctx = await requireCtx(db, userId, body.cohortId, now);
  const map = sessionMap(ctx.b);
  const check = checkLeaveSessions({ ids: [body.sessionId], sessions: map, cohortId: ctx.cohortId, taken: sessionsTaken(ctx.b.leaves, "early"), now, endsAt: (s) => instant(s.date, s.end) });
  if (!check.ok) throw new ApiFail("bad_request", check.message);
  const s = map.get(body.sessionId)!;
  const at = hhmm(body.leaveAt);
  if (at <= s.start || at >= s.end) throw new ApiFail("bad_request", `Pick a time between ${s.start} and ${s.end}.`);
  const row = must(
    await db
      .from("clinic_leave_requests")
      .insert({ id: crypto.randomUUID(), user_id: userId, cohort_id: ctx.cohortId, kind: "early", session_ids: [body.sessionId], leave_at: at, reason: body.reason.trim(), status: "pending", over_limit: false })
      .select("*")
      .single(),
    null as LeaveRow | null,
  );
  return toLeaveRequest(row!, map);
}

export async function cancelLeave(db: Db, userId: string, id: string): Promise<{ cancelled: true }> {
  const row = must(await db.from("clinic_leave_requests").select("*").eq("id", id).eq("user_id", userId).maybeSingle(), null as LeaveRow | null);
  if (!row || row.kind === "missed") throw new ApiFail("not_found");
  if (row.status !== "pending") throw new ApiFail("conflict", "Only a request still waiting can be cancelled.");
  must(await db.from("clinic_leave_requests").update({ status: "cancelled" }).eq("id", id).eq("user_id", userId).eq("status", "pending"), null);
  return { cancelled: true };
}

/* --------------------------------------------------------------- OPD */

export async function getMyOpd(db: Db, userId: string, cohort: string | null | undefined, now: number): Promise<ClinicMyOpd> {
  const ctx = await context(db, userId, cohort, now);
  if (!ctx) return { v: 1, cohortId: null, batch: null, canChooseBatch: false, casesPerVisit: 2, quota: { base: 0, extras: [], total: 0, done: 0, pending: 0 }, visits: [] };
  const visits = myVisits(ctx.b, userId, todayOf(now));
  const batch = batchOf(ctx.b, userId);
  return { v: 1, cohortId: ctx.cohortId, batch, canChooseBatch: batch === null, casesPerVisit: ctx.b.settings.cases_per_visit, quota: quotaFor(ctx.b, userId, visits), visits };
}

/** The student picks a batch once; after that only the admin changes it. */
export async function chooseBatch(db: Db, userId: string, batch: ClinicBatch, cohort: string | null | undefined, now: number): Promise<ClinicMyOpd> {
  const c = await studentCohort(db, userId, cohort);
  if (!c) throw new ApiFail("forbidden", "You are not in a cohort yet.");
  const existing = must(await db.from("clinic_opd_prefs").select("batch").eq("user_id", userId).eq("cohort_id", c.cohortId).maybeSingle(), null as { batch: ClinicBatch } | null);
  if (existing) throw new ApiFail("conflict", "Your batch is set. Ask the admin to change it.");
  const r = await db.from("clinic_opd_prefs").insert({ user_id: userId, cohort_id: c.cohortId, batch, set_by: userId });
  if (r.error?.code === "23505") throw new ApiFail("conflict", "Your batch is set. Ask the admin to change it.");
  must(r, null);
  return getMyOpd(db, userId, c.cohortId, now);
}

/** The case log for an assigned OPD day (today or past). Sending it again corrects it. */
export async function submitCaseLog(db: Db, userId: string, body: ClinicCaseLogBody, now: number): Promise<ClinicVisit> {
  const a = must(await db.from("clinic_opd_assignments").select("*").eq("id", body.assignmentId).eq("user_id", userId).eq("state", "published").maybeSingle(), null as { id: string; cohort_id: string; date: string } | null);
  if (!a) throw new ApiFail("not_found", "That OPD day was not found.");
  const today = todayOf(now);
  if (a.date > today) throw new ApiFail("bad_request", "Send the log on or after the day.");
  const absent = Boolean(body.absent);
  const at = new Date(now).toISOString();
  must(
    await db
      .from("clinic_case_logs")
      .upsert({ assignment_id: a.id, user_id: userId, cohort_id: a.cohort_id, date: a.date, cases: absent ? 0 : body.cases, absent, note: body.note?.trim() || null, updated_at: at }, { onConflict: "assignment_id" }),
    null,
  );
  const b = await loadBundle(db, a.cohort_id, userId);
  await reconcileMissed(db, b, [userId], today);
  return myVisits(b, userId, today).find((v) => v.assignmentId === a.id)!;
}

