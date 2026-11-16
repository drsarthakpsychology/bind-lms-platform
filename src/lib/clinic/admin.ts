import "server-only";
import type {
  ClinicAdminOverview,
  ClinicAllowanceBody,
  ClinicAllowances,
  ClinicApplyResult,
  ClinicAttendanceRow,
  ClinicBatch,
  ClinicExtraBody,
  ClinicLeaveQueue,
  ClinicLeaveRequest,
  ClinicLiveAttendance,
  ClinicManualMarkBody,
  ClinicMoveBody,
  ClinicOpdSettings,
  ClinicPlan,
  ClinicPlanDay,
  ClinicPublishResult,
  ClinicQuotaRow,
  ClinicQuotas,
  ClinicSession,
  ClinicSessionBody,
  ClinicSessionPatch,
  ClinicShowCode,
  ClinicSlot,
  ClinicSlotBody,
  ClinicStudentDetail,
  ClinicTrackers,
} from "@/lib/app-api/contract";
import { ApiFail } from "@/lib/app-api/respond";
import { notifyClinic } from "@/lib/notify/clinic";
import { isOpen, myStatus, sessionTimes } from "./attendance";
import {
  adminCohort,
  balanceOf,
  batchOf,
  chunk,
  cohortStudents,
  fetchAll,
  loadBundle,
  loadSettings,
  must,
  myVisits,
  mySessions,
  namesOf,
  quotaFor,
  reconcileMissed,
  requireCohort,
  todayOf,
  trackerRow,
  type Bundle,
  type Db,
  type Person,
} from "./data";
import { approvedLeaveMap, earlyLeaveMap, overLimitOnApprove, toLeaveRequest } from "./leave";
import { generatePlan, opdDays, seatsOn, visitsNeeded } from "./opd";
import { newSecret, showCode as codeNow } from "./qr";
import { addDays, daysBetween, hhmm, instant, isDate, localTime, mondayOf, weekday } from "./time";
import { batchOfKind, bySchedule, expandTimetable, toSession, toSlot } from "./timetable";
import type { AllowanceLogRow, AssignmentRow, AttendanceRow, LeaveRow, SecretRow, SessionRow, SlotRow } from "./types";

/**
 * The admin's side of the clinic. Callers check the role first: reads for any
 * admin, writes for the Super Admin only (route `auth: "superAdmin"`,
 * server actions requireSuperAdmin). `actor` is the admin's own id.
 */

const fmtDay = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

/* ---------------------------------------------------------- overview */

export async function overview(db: Db, cohort: string | null | undefined, canWrite: boolean, now: number): Promise<ClinicAdminOverview> {
  const today = todayOf(now);
  const { cohorts, cohortId } = await adminCohort(db, cohort);
  if (!cohortId) return { v: 1, cohorts, cohortId: null, today, sessions: [], pendingLeave: 0, logsDue: 0, canWrite };
  const b = await loadBundle(db, cohortId);
  const people = await cohortStudents(db, cohortId);
  const todays = b.sessions.filter((s) => s.date === today);
  const sessions = todays.map((row) => {
    const live = liveRows(b, row, people, now);
    return { ...toSession(row), counts: { expected: live.counts.expected, in: live.counts.in, out: live.counts.out, late: live.counts.late, onLeave: live.counts.onLeave } };
  });
  const pendingLeave = b.leaves.filter((l) => l.status === "pending").length;
  const logsDue = people.reduce((n, p) => n + myVisits(b, p.userId, today).filter((v) => v.state === "due").length, 0);
  return { v: 1, cohorts, cohortId, today, sessions: bySchedule(sessions), pendingLeave, logsDue, canWrite };
}

/* --------------------------------------------------------- timetable */

export async function listSlots(db: Db, cohort: string | null | undefined): Promise<{ slots: ClinicSlot[] }> {
  const cohortId = await requireCohort(db, cohort);
  const rows = must(await db.from("clinic_timetable_slots").select("*").contains("cohort_ids", [cohortId]).order("weekday").order("start_time"), [] as SlotRow[]);
  return { slots: rows.map(toSlot) };
}

async function checkCohorts(db: Db, ids: readonly string[]): Promise<void> {
  const rows = must(await db.from("cohorts").select("id").in("id", [...ids]), [] as { id: string }[]);
  if (rows.length !== new Set(ids).size) throw new ApiFail("bad_request", "One of those cohorts was not found.", { fields: ["cohortIds"] });
}

function slotRow(body: ClinicSlotBody) {
  if (hhmm(body.end) <= hhmm(body.start)) throw new ApiFail("bad_request", "End must be after start.", { fields: ["end"] });
  if (body.validFrom && body.validTo && body.validTo < body.validFrom) throw new ApiFail("bad_request", "The end date is before the start date.", { fields: ["validTo"] });
  return {
    cohort_ids: [...new Set(body.cohortIds)],
    weekday: body.weekday,
    start_time: hhmm(body.start),
    end_time: hhmm(body.end),
    kind: body.kind,
    title: body.title.trim(),
    place: body.place?.trim() || null,
    online_link: body.onlineLink?.trim() || null,
    compulsory: body.compulsory,
    valid_from: body.validFrom ?? null,
    valid_to: body.validTo ?? null,
    active: body.active ?? true,
  };
}

export async function createSlot(db: Db, body: ClinicSlotBody, actor: string): Promise<ClinicSlot> {
  await checkCohorts(db, body.cohortIds);
  const row = must(await db.from("clinic_timetable_slots").insert({ id: crypto.randomUUID(), ...slotRow(body), created_by: actor }).select("*").single(), null as SlotRow | null);
  return toSlot(row!);
}

export async function updateSlot(db: Db, id: string, body: ClinicSlotBody, now: number): Promise<ClinicSlot> {
  await checkCohorts(db, body.cohortIds);
  const rows = must(await db.from("clinic_timetable_slots").update({ ...slotRow(body), updated_at: new Date(now).toISOString() }).eq("id", id).select("*"), [] as SlotRow[]);
  if (!rows[0]) throw new ApiFail("not_found");
  return toSlot(rows[0]);
}

export async function deleteSlot(db: Db, id: string): Promise<{ deleted: true }> {
  const rows = must(await db.from("clinic_timetable_slots").select("id").eq("id", id), [] as { id: string }[]);
  if (!rows.length) throw new ApiFail("not_found");
  must(await db.from("clinic_timetable_slots").delete().eq("id", id), null);
  return { deleted: true };
}

export async function applyTimetable(db: Db, body: { cohortId: string; from: string; to: string }, actor: string): Promise<ClinicApplyResult> {
  if (body.to < body.from) throw new ApiFail("bad_request", "The end date is before the start date.", { fields: ["to"] });
  if (daysBetween(body.from, body.to) > 120) throw new ApiFail("bad_request", "Make at most 120 days at a time.", { fields: ["to"] });
  const cohortId = await requireCohort(db, body.cohortId);
  const slots = must(await db.from("clinic_timetable_slots").select("*").contains("cohort_ids", [cohortId]), [] as SlotRow[]);
  if (!slots.length) return { created: 0, skipped: 0 };
  const existing: { slot_id: string | null; date: string }[] = [];
  for (const ids of chunk(slots.map((s) => s.id))) {
    existing.push(...must(await db.from("clinic_sessions").select("slot_id, date").in("slot_id", ids).gte("date", body.from).lte("date", body.to), [] as { slot_id: string | null; date: string }[]));
  }
  const { sessions, skipped } = expandTimetable(slots, body.from, body.to, existing);
  for (const part of chunk(sessions, 500)) {
    const r = await db.from("clinic_sessions").upsert(part.map((s) => ({ ...s, created_by: actor })), { onConflict: "slot_id,date", ignoreDuplicates: true });
    must(r, null);
  }
  return { created: sessions.length, skipped };
}

/* ---------------------------------------------------------- sessions */

export async function listSessions(db: Db, cohort: string | null | undefined, from: string | null, to: string | null, now: number): Promise<{ sessions: ClinicSession[]; notes: { date: string; note: string }[] }> {
  const cohortId = await requireCohort(db, cohort);
  const f = from && isDate(from) ? from : mondayOf(todayOf(now));
  const t = to && isDate(to) ? to : addDays(f, 6);
  if (t < f || daysBetween(f, t) > 400) throw new ApiFail("bad_request", "Pick a shorter date range.");
  const rows = must(await db.from("clinic_sessions").select("*").contains("cohort_ids", [cohortId]).gte("date", f).lte("date", t).order("date").order("start_time"), [] as SessionRow[]);
  const notes = must(await db.from("clinic_day_notes").select("date, note").eq("cohort_id", cohortId).gte("date", f).lte("date", t).order("date"), [] as { date: string; note: string }[]);
  return { sessions: bySchedule(rows.map(toSession)), notes: notes.map((n) => ({ date: n.date, note: n.note })) };
}

async function studentsOfCohorts(db: Db, cohortIds: readonly string[]): Promise<Person[]> {
  const seen = new Map<string, Person>();
  for (const c of cohortIds) for (const p of await cohortStudents(db, c)) seen.set(p.userId, p);
  return [...seen.values()];
}

/** Notices for a changed session: classes to the whole cohort, OPD to the students assigned that day. */
async function notifySession(db: Db, s: SessionRow, title: string, text: string, actor: string): Promise<number> {
  const batch = batchOfKind(s.kind);
  let ids: string[];
  if (batch) {
    const rows = must(await db.from("clinic_opd_assignments").select("user_id, cohort_id").eq("date", s.date).eq("batch", batch).eq("state", "published"), [] as { user_id: string; cohort_id: string }[]);
    ids = rows.filter((r) => s.cohort_ids.includes(r.cohort_id)).map((r) => r.user_id);
  } else {
    ids = (await studentsOfCohorts(db, s.cohort_ids)).map((p) => p.userId);
  }
  return notifyClinic({ userIds: ids, title, text, sentBy: actor });
}

const when = (s: { date: string; start_time: string; end_time: string }) => `${fmtDay(s.date)}, ${hhmm(s.start_time)} to ${hhmm(s.end_time)}`;

export async function createSession(db: Db, body: ClinicSessionBody, actor: string, now: number): Promise<ClinicSession> {
  if (hhmm(body.end) <= hhmm(body.start)) throw new ApiFail("bad_request", "End must be after start.", { fields: ["end"] });
  await checkCohorts(db, body.cohortIds);
  const row = must(
    await db
      .from("clinic_sessions")
      .insert({
        id: crypto.randomUUID(),
        cohort_ids: [...new Set(body.cohortIds)],
        slot_id: null,
        date: body.date,
        start_time: hhmm(body.start),
        end_time: hhmm(body.end),
        kind: body.kind,
        title: body.title.trim(),
        place: body.place?.trim() || null,
        online_link: body.onlineLink?.trim() || null,
        compulsory: body.compulsory ?? !batchOfKind(body.kind),
        status: "scheduled",
        origin: "one_off",
        note: body.note?.trim() || null,
        moved_from: null,
        created_by: actor,
      })
      .select("*")
      .single(),
    null as SessionRow | null,
  )!;
  if (body.notify !== false && row.date >= todayOf(now)) await notifySession(db, row, `New session: ${row.title}`, `${row.title} added on ${when(row)}${row.place ? `, ${row.place}` : ""}.`, actor);
  return toSession(row);
}

export async function patchSession(db: Db, id: string, patch: ClinicSessionPatch, actor: string, now: number): Promise<ClinicSession> {
  const found = must(await db.from("clinic_sessions").select("*").eq("id", id).maybeSingle(), null as SessionRow | null);
  if (!found) throw new ApiFail("not_found");
  const old = { ...found };
  const next: Partial<SessionRow> & { updated_at: string } = { updated_at: new Date(now).toISOString() };
  if (patch.date !== undefined) next.date = patch.date;
  if (patch.start !== undefined) next.start_time = hhmm(patch.start);
  if (patch.end !== undefined) next.end_time = hhmm(patch.end);
  if (patch.kind !== undefined) next.kind = patch.kind;
  if (patch.title !== undefined) next.title = patch.title.trim();
  if (patch.place !== undefined) next.place = patch.place?.trim() || null;
  if (patch.onlineLink !== undefined) next.online_link = patch.onlineLink?.trim() || null;
  if (patch.compulsory !== undefined) next.compulsory = patch.compulsory;
  if (patch.note !== undefined) next.note = patch.note?.trim() || null;
  if (patch.status !== undefined) next.status = patch.status;
  const merged = { ...old, ...next } as SessionRow;
  if (hhmm(merged.end_time) <= hhmm(merged.start_time)) throw new ApiFail("bad_request", "End must be after start.", { fields: ["end"] });
  const moved = merged.date !== old.date || hhmm(merged.start_time) !== hhmm(old.start_time) || hhmm(merged.end_time) !== hhmm(old.end_time);
  if (moved) next.moved_from = `${old.date} ${hhmm(old.start_time)}`;
  const rows = must(await db.from("clinic_sessions").update(next).eq("id", id).select("*"), [] as SessionRow[]);
  const row = rows[0] ?? merged;
  const upcoming = Math.max(instant(old.date, old.end_time), instant(row.date, row.end_time)) > now;
  if (patch.notify !== false && upcoming) {
    if (old.status !== "cancelled" && row.status === "cancelled") await notifySession(db, old, `Cancelled: ${old.title}`, `${old.title} on ${when(old)} is cancelled.`, actor);
    else if (old.status === "cancelled" && row.status === "scheduled") await notifySession(db, row, `Back on: ${row.title}`, `${row.title} on ${when(row)} is on again.`, actor);
    else if (moved && row.status === "scheduled") await notifySession(db, row, `Moved: ${row.title}`, `${row.title} moved from ${when(old)} to ${when(row)}.`, actor);
  }
  return toSession(row);
}

export async function setDayNote(db: Db, body: { cohortId: string; date: string; note: string }, actor: string, now: number): Promise<{ date: string; note: string | null }> {
  const cohortId = await requireCohort(db, body.cohortId);
  const note = body.note.trim();
  if (!note) {
    must(await db.from("clinic_day_notes").delete().eq("cohort_id", cohortId).eq("date", body.date), null);
    return { date: body.date, note: null };
  }
  must(await db.from("clinic_day_notes").upsert({ cohort_id: cohortId, date: body.date, note, created_by: actor, updated_at: new Date(now).toISOString() }, { onConflict: "cohort_id,date" }), null);
  return { date: body.date, note };
}

/* ------------------------------------------------------------ the code */

/**
 * The QR and 6-character code for now. The Super Admin's first Show code
 * makes the session's secret; a View Admin can show it once it exists.
 */
export async function showSessionCode(db: Db, sessionId: string, actor: string, canWrite: boolean, now: number): Promise<ClinicShowCode> {
  const row = must(await db.from("clinic_sessions").select("*").eq("id", sessionId).maybeSingle(), null as SessionRow | null);
  if (!row) throw new ApiFail("not_found");
  const s = toSession(row);
  if (s.status === "cancelled") throw new ApiFail("conflict", "This session was cancelled.");
  if (!isOpen(s, now)) throw new ApiFail("conflict", `The code opens 30 minutes before the session and closes an hour after it ends.`);
  let secret = must(await db.from("clinic_session_secrets").select("*").eq("session_id", sessionId).maybeSingle(), null as SecretRow | null);
  if (!secret) {
    if (!canWrite) throw new ApiFail("forbidden", "The owner opens the code first.");
    const r = await db.from("clinic_session_secrets").insert({ session_id: sessionId, secret: newSecret(), opened_by: actor });
    if (r.error && r.error.code !== "23505") must(r, null);
    secret = must(await db.from("clinic_session_secrets").select("*").eq("session_id", sessionId).maybeSingle(), null as SecretRow | null);
    if (!secret) throw new ApiFail("server_error");
  }
  return { sessionId, ...codeNow(secret.secret, sessionId, now) };
}

/* -------------------------------------------------------- attendance */

function liveRows(b: Bundle, row: SessionRow, people: readonly Person[], now: number): { rows: ClinicAttendanceRow[]; counts: ClinicLiveAttendance["counts"] } {
  const s = toSession(row);
  const batch = s.batch;
  const assigned = new Set(b.assignments.filter((a) => batch && a.date === s.date && a.batch === batch).map((a) => a.user_id));
  const attBy = new Map(b.att.filter((a) => a.session_id === s.id).map((a) => [a.user_id, a]));
  const early = new Map<string, string>();
  const onLeave = new Set<string>();
  for (const l of b.leaves) {
    if (!l.session_ids.includes(s.id)) continue;
    if (approvedLeaveMap([l]).has(s.id)) onLeave.add(l.user_id);
    const at = earlyLeaveMap([l]).get(s.id);
    if (at) early.set(l.user_id, at);
  }
  const rows: ClinicAttendanceRow[] = [];
  const counts = { expected: 0, in: 0, out: 0, late: 0, onLeave: 0, missing: 0 };
  for (const p of people) {
    const required = batch ? assigned.has(p.userId) : s.compulsory;
    const att = attBy.get(p.userId) ?? null;
    if (!required && !att && !onLeave.has(p.userId) && batch) continue; // OPD: only the assigned and anyone who came
    const st = myStatus({ session: s, now, required, att, onLeave: onLeave.has(p.userId), lateMinutes: b.settings.late_minutes });
    if (required) counts.expected++;
    if (att?.in_at) counts.in++;
    if (att?.out_at) counts.out++;
    if (st.late) counts.late++;
    if (st.status === "on_leave") counts.onLeave++;
    if (required && !att?.in_at && st.status !== "on_leave") counts.missing++;
    rows.push({
      userId: p.userId,
      name: p.name,
      roll: p.roll,
      status: st.status,
      inAt: att?.in_at ?? null,
      outAt: att?.out_at ?? null,
      late: st.late,
      minutes: st.minutes,
      manual: att?.in_method === "manual" || att?.out_method === "manual",
      note: att?.note ?? null,
      earlyLeaveAt: early.get(p.userId) ?? null,
    });
  }
  const order = (r: ClinicAttendanceRow) => (r.inAt ? 1 : r.status === "on_leave" ? 2 : 0);
  rows.sort((a, b2) => order(a) - order(b2) || (a.name ?? "").localeCompare(b2.name ?? ""));
  return { rows, counts };
}

export async function liveAttendance(db: Db, sessionId: string, now: number): Promise<ClinicLiveAttendance> {
  const row = must(await db.from("clinic_sessions").select("*").eq("id", sessionId).maybeSingle(), null as SessionRow | null);
  if (!row) throw new ApiFail("not_found");
  const cohortId = row.cohort_ids[0]!;
  const b = await loadBundle(db, cohortId);
  // A session shared by more than one cohort: everyone's rows.
  if (row.cohort_ids.length > 1) {
    for (const c of row.cohort_ids.slice(1)) {
      const o = await loadBundle(db, c);
      b.assignments.push(...o.assignments);
      b.leaves.push(...o.leaves);
    }
  }
  if (!b.sessionById.has(row.id)) b.sessions.push(row);
  b.att = must(await db.from("clinic_attendance").select("*").eq("session_id", sessionId), [] as AttendanceRow[]);
  const people = await studentsOfCohorts(db, row.cohort_ids);
  const { rows, counts } = liveRows(b, row, people, now);
  return { v: 1, session: toSession(row), open: isOpen(toSession(row), now), lateMinutes: b.settings.late_minutes, rows, counts };
}

export async function manualMark(db: Db, sessionId: string, body: ClinicManualMarkBody, actor: string, now: number): Promise<ClinicLiveAttendance> {
  const row = must(await db.from("clinic_sessions").select("*").eq("id", sessionId).maybeSingle(), null as SessionRow | null);
  if (!row) throw new ApiFail("not_found");
  const people = await studentsOfCohorts(db, row.cohort_ids);
  if (!people.some((p) => p.userId === body.userId)) throw new ApiFail("bad_request", "That student is not in this session's cohort.", { fields: ["userId"] });
  const s = toSession(row);
  const t = sessionTimes(s);
  const existing = must(await db.from("clinic_attendance").select("*").eq("session_id", sessionId).eq("user_id", body.userId).maybeSingle(), null as AttendanceRow | null);
  if (body.direction === "clear") {
    if (existing) must(await db.from("clinic_attendance").delete().eq("id", existing.id), null);
    return liveAttendance(db, sessionId, now);
  }
  let at = body.at ? Date.parse(body.at) : body.direction === "in" ? Math.min(Math.max(now, t.startsAt), t.endsAt) : Math.min(Math.max(now, t.startsAt), t.endsAt);
  if (Number.isNaN(at)) throw new ApiFail("bad_request", "That time is not right.", { fields: ["at"] });
  at = Math.round(at / 1000) * 1000;
  if (at < t.opensAt || at > t.closesAt) throw new ApiFail("bad_request", "Pick a time during the session.", { fields: ["at"] });
  const iso = new Date(at).toISOString();
  const note = body.note?.trim() || existing?.note || null;
  const stamp = new Date(now).toISOString();
  if (body.direction === "in") {
    if (existing?.out_at && Date.parse(existing.out_at) < at) throw new ApiFail("bad_request", "In must be before out.", { fields: ["at"] });
    if (existing) must(await db.from("clinic_attendance").update({ in_at: iso, in_method: "manual", note, marked_by: actor, updated_at: stamp }).eq("id", existing.id), null);
    else must(await db.from("clinic_attendance").insert({ session_id: sessionId, user_id: body.userId, in_at: iso, in_method: "manual", note, marked_by: actor, updated_at: stamp }), null);
  } else {
    if (!existing?.in_at) throw new ApiFail("bad_request", "Mark them in first.");
    if (Date.parse(existing.in_at) > at) throw new ApiFail("bad_request", "Out must be after in.", { fields: ["at"] });
    must(await db.from("clinic_attendance").update({ out_at: iso, out_method: "manual", note, marked_by: actor, updated_at: stamp }).eq("id", existing.id), null);
  }
  return liveAttendance(db, sessionId, now);
}

/* ------------------------------------------------------------- leave */

export async function leaveQueue(db: Db, cohort: string | null | undefined, status: string | null, now: number): Promise<ClinicLeaveQueue> {
  const cohortId = await requireCohort(db, cohort);
  const b = await loadBundle(db, cohortId);
  const people = await cohortStudents(db, cohortId);
  await reconcileMissed(db, b, people.map((p) => p.userId), todayOf(now));
  const want = status === "all" ? null : status && ["pending", "approved", "rejected", "cancelled"].includes(status) ? status : "pending";
  const list = b.leaves.filter((l) => (want ? l.status === want : true) && (want === "pending" ? l.kind !== "missed" : true));
  const names = await namesOf(db, list.map((l) => l.user_id));
  const map = new Map(b.sessions.map((s) => [s.id, toSession(s)]));
  const requests = list
    .sort((x, y) => (want === "pending" ? x.created_at.localeCompare(y.created_at) : y.created_at.localeCompare(x.created_at)))
    .map((l) => {
      const bal = balanceOf(b, l.user_id);
      return { ...toLeaveRequest(l, map), name: names.get(l.user_id)?.name ?? null, roll: names.get(l.user_id)?.roll ?? null, balance: bal, overLimitNow: l.status === "pending" ? overLimitOnApprove(bal, l) : l.over_limit };
    });
  return { v: 1, requests };
}

export async function decideLeave(db: Db, id: string, body: { decision: "approve" | "reject"; note?: string }, actor: string, now: number): Promise<ClinicLeaveRequest> {
  const row = must(await db.from("clinic_leave_requests").select("*").eq("id", id).maybeSingle(), null as LeaveRow | null);
  if (!row || row.kind === "missed") throw new ApiFail("not_found");
  if (row.status !== "pending") throw new ApiFail("conflict", "This request was already decided.");
  const b = await loadBundle(db, row.cohort_id, row.user_id);
  const approve = body.decision === "approve";
  const over = row.over_limit || (approve && overLimitOnApprove(balanceOf(b, row.user_id), row));
  const patch = { status: approve ? "approved" : "rejected", over_limit: over, decided_by: actor, decided_at: new Date(now).toISOString(), decision_note: body.note?.trim() || null };
  const rows = must(await db.from("clinic_leave_requests").update(patch).eq("id", id).eq("status", "pending").select("*"), [] as LeaveRow[]);
  const done = rows[0];
  if (!done) throw new ApiFail("conflict", "This request was already decided.");
  const map = new Map(b.sessions.map((s) => [s.id, toSession(s)]));
  const view = toLeaveRequest(done, map);
  const what = row.kind === "early" ? `Leaving early at ${view.leaveAt}` : view.sessions.length === 1 ? `Leave for ${view.sessions[0]!.title} on ${fmtDay(view.sessions[0]!.date)}` : `Leave for ${view.sessions.length} sessions`;
  await notifyClinic({ userIds: [row.user_id], title: approve ? "Leave approved" : "Leave not approved", text: `${what}: ${approve ? "approved" : "not approved"}.${patch.decision_note ? ` ${patch.decision_note}` : ""}`, sentBy: actor });
  return view;
}

/* -------------------------------------------------------- allowances */

export async function listAllowances(db: Db, cohort: string | null | undefined, now: number): Promise<ClinicAllowances> {
  const cohortId = await requireCohort(db, cohort);
  const b = await loadBundle(db, cohortId);
  const people = await cohortStudents(db, cohortId);
  await reconcileMissed(db, b, people.map((p) => p.userId), todayOf(now));
  const log = await fetchAll<AllowanceLogRow>(() => db.from("clinic_leave_allowance_log").select("*").eq("cohort_id", cohortId).order("created_at", { ascending: false }));
  return {
    v: 1,
    cohortId,
    rows: people.map((p) => ({
      userId: p.userId,
      name: p.name,
      roll: p.roll,
      balance: balanceOf(b, p.userId),
      log: log.filter((l) => l.user_id === p.userId).slice(0, 20).map((l) => ({ old: l.old_allowance, new: l.new_allowance, note: l.note, at: l.created_at })),
    })),
  };
}

async function targets(db: Db, cohortId: string, userIds: readonly string[] | undefined): Promise<Person[]> {
  const people = await cohortStudents(db, cohortId);
  if (!userIds) return people;
  const set = new Set(userIds);
  const picked = people.filter((p) => set.has(p.userId));
  if (picked.length !== set.size) throw new ApiFail("bad_request", "One of those students is not in this cohort.", { fields: ["userIds"] });
  return picked;
}

export async function setAllowances(db: Db, body: ClinicAllowanceBody, actor: string, now: number): Promise<{ changed: number }> {
  if ((body.set === undefined) === (body.add === undefined)) throw new ApiFail("bad_request", "Send a number to set or to add.", { fields: ["set", "add"] });
  const cohortId = await requireCohort(db, body.cohortId);
  const people = await targets(db, cohortId, body.userIds);
  if (!people.length) return { changed: 0 };
  const current = new Map<string, number>();
  for (const ids of chunk(people.map((p) => p.userId))) {
    for (const r of must(await db.from("clinic_leave_allowances").select("user_id, allowance").eq("cohort_id", cohortId).in("user_id", ids), [] as { user_id: string; allowance: number }[])) current.set(r.user_id, r.allowance);
  }
  const stamp = new Date(now).toISOString();
  const rows = people.map((p) => {
    const old = current.get(p.userId);
    const next = Math.max(0, Math.min(1000, body.set !== undefined ? body.set : (old ?? 0) + body.add!));
    return { user_id: p.userId, cohort_id: cohortId, allowance: next, old: old ?? null };
  });
  const changed = rows.filter((r) => r.old !== r.allowance);
  if (!changed.length) return { changed: 0 };
  for (const part of chunk(changed, 500)) {
    must(await db.from("clinic_leave_allowances").upsert(part.map((r) => ({ user_id: r.user_id, cohort_id: r.cohort_id, allowance: r.allowance, updated_by: actor, updated_at: stamp })), { onConflict: "user_id,cohort_id" }), null);
    must(await db.from("clinic_leave_allowance_log").insert(part.map((r) => ({ user_id: r.user_id, cohort_id: r.cohort_id, old_allowance: r.old, new_allowance: r.allowance, note: body.note?.trim() || null, changed_by: actor }))), null);
  }
  return { changed: changed.length };
}

/* ------------------------------------------------------ OPD settings */

const toSettings = (r: Awaited<ReturnType<typeof loadSettings>>): ClinicOpdSettings => ({
  cohortId: r.cohort_id,
  seats: r.seats,
  casesPerVisit: r.cases_per_visit,
  startDate: r.start_date,
  endDate: r.end_date,
  lateMinutes: r.late_minutes,
  holidays: [...r.holidays].sort(),
  freezeDays: r.freeze_days,
});

export async function getSettings(db: Db, cohort: string | null | undefined): Promise<ClinicOpdSettings> {
  return toSettings(await loadSettings(db, await requireCohort(db, cohort)));
}

export async function saveSettings(db: Db, body: ClinicOpdSettings, actor: string, now: number): Promise<ClinicOpdSettings> {
  const cohortId = await requireCohort(db, body.cohortId);
  if (body.startDate && body.endDate && body.endDate < body.startDate) throw new ApiFail("bad_request", "The end date is before the start date.", { fields: ["endDate"] });
  const seats: Record<string, { morning?: number; evening?: number }> = {};
  for (const [k, v] of Object.entries(body.seats)) {
    if (!/^[0-6]$/.test(k)) throw new ApiFail("bad_request", "Seats are set per weekday (0 Sunday to 6 Saturday).", { fields: ["seats"] });
    const m = Math.floor(v.morning ?? 0);
    const e = Math.floor(v.evening ?? 0);
    if (m || e) seats[k] = { ...(m ? { morning: m } : {}), ...(e ? { evening: e } : {}) };
  }
  must(
    await db.from("clinic_opd_settings").upsert(
      {
        cohort_id: cohortId,
        seats,
        cases_per_visit: body.casesPerVisit,
        start_date: body.startDate,
        end_date: body.endDate,
        late_minutes: body.lateMinutes,
        holidays: [...new Set(body.holidays)].sort(),
        freeze_days: body.freezeDays,
        updated_by: actor,
        updated_at: new Date(now).toISOString(),
      },
      { onConflict: "cohort_id" },
    ),
    null,
  );
  return getSettings(db, cohortId);
}

/* ------------------------------------------------------------ quotas */

function quotaRow(b: Bundle, p: Person, today: string): ClinicQuotaRow {
  const visits = myVisits(b, p.userId, today);
  return { userId: p.userId, name: p.name, roll: p.roll, batch: batchOf(b, p.userId), quota: quotaFor(b, p.userId, visits), visitsPlanned: visits.filter((v) => v.date >= today && !v.log).length };
}

export async function listQuotas(db: Db, cohort: string | null | undefined, now: number): Promise<ClinicQuotas> {
  const cohortId = await requireCohort(db, cohort);
  const b = await loadBundle(db, cohortId);
  const people = await cohortStudents(db, cohortId);
  const today = todayOf(now);
  return { v: 1, cohortId, casesPerVisit: b.settings.cases_per_visit, rows: people.map((p) => quotaRow(b, p, today)) };
}

export async function setQuotas(db: Db, body: { cohortId: string; userIds?: string[]; base: number }, actor: string, now: number): Promise<{ changed: number }> {
  const cohortId = await requireCohort(db, body.cohortId);
  const people = await targets(db, cohortId, body.userIds);
  const stamp = new Date(now).toISOString();
  for (const part of chunk(people, 500)) {
    must(await db.from("clinic_case_quotas").upsert(part.map((p) => ({ user_id: p.userId, cohort_id: cohortId, base: body.base, updated_by: actor, updated_at: stamp })), { onConflict: "user_id,cohort_id" }), null);
  }
  return { changed: people.length };
}

export async function addExtra(db: Db, body: ClinicExtraBody, actor: string, now: number): Promise<ClinicQuotaRow> {
  const cohortId = await requireCohort(db, body.cohortId);
  const [p] = await targets(db, cohortId, [body.userId]);
  must(await db.from("clinic_case_extras").insert({ user_id: body.userId, cohort_id: cohortId, count: body.count, note: body.note?.trim() || null, added_by: actor }), null);
  const b = await loadBundle(db, cohortId, body.userId);
  return quotaRow(b, p!, todayOf(now));
}

export async function setBatch(db: Db, body: { cohortId: string; userId: string; batch: ClinicBatch }, actor: string, now: number): Promise<{ batch: ClinicBatch }> {
  const cohortId = await requireCohort(db, body.cohortId);
  await targets(db, cohortId, [body.userId]);
  must(await db.from("clinic_opd_prefs").upsert({ user_id: body.userId, cohort_id: cohortId, batch: body.batch, set_by: actor, updated_at: new Date(now).toISOString() }, { onConflict: "user_id,cohort_id" }), null);
  return { batch: body.batch };
}

/* --------------------------------------------------------- generator */

function closedKeys(b: Bundle): string[] {
  const out = new Set<string>(b.settings.holidays);
  const byKey = new Map<string, SessionRow[]>();
  for (const s of b.sessions) {
    const batch = batchOfKind(s.kind);
    if (!batch) continue;
    const k = `${s.date}|${batch}`;
    byKey.set(k, [...(byKey.get(k) ?? []), s]);
  }
  for (const [k, list] of byKey) if (list.every((s) => s.status === "cancelled")) out.add(k);
  return [...out];
}

export async function generate(db: Db, cohort: string, actor: string, now: number): Promise<ClinicPlan> {
  const cohortId = await requireCohort(db, cohort);
  const today = todayOf(now);
  const b = await loadBundle(db, cohortId);
  const people = await cohortStudents(db, cohortId);
  await reconcileMissed(db, b, people.map((p) => p.userId), today);
  if (!b.settings.start_date || !b.settings.end_date) throw new ApiFail("bad_request", "Set the OPD date range first.");
  const closed = closedKeys(b);
  const days = opdDays({ seats: b.settings.seats, startDate: b.settings.start_date, endDate: b.settings.end_date, holidays: b.settings.holidays, cancelled: closed.filter((k) => k.includes("|")), from: today });
  const logged = new Set(b.logs.map((l) => l.assignment_id));
  const students = people.map((p) => {
    const visits = myVisits(b, p.userId, today);
    const leaveDates = new Set<string>();
    for (const l of b.leaves) if (l.user_id === p.userId && l.status === "approved" && l.kind === "leave") for (const id of l.session_ids) {
      const s = b.sessionById.get(id);
      if (s) leaveDates.add(s.date);
    }
    // A day already logged (today) is done: never a second visit on it.
    for (const a of b.assignments) if (a.user_id === p.userId && a.date >= today && logged.has(a.id)) leaveDates.add(a.date);
    return { userId: p.userId, batch: batchOf(b, p.userId), pendingCases: quotaFor(b, p.userId, visits).pending, joinedOn: p.joinedOn, blockedDates: [...leaveDates] };
  });
  const published = b.assignments.filter((a) => a.date >= today && !logged.has(a.id)).map((a) => ({ id: a.id, userId: a.user_id, date: a.date, batch: a.batch }));
  const result = generatePlan({ today, casesPerVisit: b.settings.cases_per_visit, freezeDays: b.settings.freeze_days, days, closed, students, published });
  must(await db.from("clinic_opd_assignments").delete().eq("cohort_id", cohortId).eq("state", "draft"), null);
  for (const part of chunk(result.entries, 500)) {
    must(await db.from("clinic_opd_assignments").insert(part.map((e) => ({ cohort_id: cohortId, user_id: e.userId, date: e.date, batch: e.batch, state: "draft", source: e.source, created_by: actor }))), null);
  }
  return getPlan(db, cohortId, "draft", now);
}

export async function getPlan(db: Db, cohort: string | null | undefined, state: "draft" | "published" | null, now: number): Promise<ClinicPlan> {
  const cohortId = await requireCohort(db, cohort);
  const today = todayOf(now);
  const b = await loadBundle(db, cohortId);
  const drafts = await fetchAll<AssignmentRow>(() => db.from("clinic_opd_assignments").select("*").eq("cohort_id", cohortId).eq("state", "draft").order("date"));
  const hasDraft = drafts.length > 0;
  const st = state ?? (hasDraft ? "draft" : "published");
  const rows = st === "draft" ? drafts : b.assignments;
  const people = await cohortStudents(db, cohortId);
  const names = new Map(people.map((p) => [p.userId, p.name]));
  const missingNames = await namesOf(db, rows.map((r) => r.user_id).filter((id) => !names.has(id)));
  for (const [id, n] of missingNames) names.set(id, n.name);
  const s = b.settings;
  const from = st === "draft" ? today : s.start_date;
  const dates = new Set<string>(rows.map((r) => r.date));
  for (const d of opdDays({ seats: s.seats, startDate: s.start_date, endDate: s.end_date, holidays: s.holidays, cancelled: closedKeys(b).filter((k) => k.includes("|")), from: from ?? today })) dates.add(d.date);
  const list = [...dates].filter((d) => (st === "draft" ? d >= today : true)).sort();
  const days: ClinicPlanDay[] = list.map((date) => {
    const entry = (batch: ClinicBatch) => ({
      seats: s.holidays.includes(date) ? 0 : seatsOn(s.seats, date, batch),
      people: rows
        .filter((r) => r.date === date && r.batch === batch)
        .map((r) => ({ assignmentId: r.id, userId: r.user_id, name: names.get(r.user_id) ?? null, source: r.source }))
        .sort((x, y) => (x.name ?? "").localeCompare(y.name ?? "")),
    });
    return { date, weekday: weekday(date), morning: entry("morning"), evening: entry("evening") };
  });
  const logged = new Set(b.logs.map((l) => l.assignment_id));
  const short: ClinicPlan["short"] = [];
  const noBatch: ClinicPlan["noBatch"] = [];
  for (const p of people) {
    if (!batchOf(b, p.userId)) {
      noBatch.push({ userId: p.userId, name: p.name });
      continue;
    }
    const pending = quotaFor(b, p.userId, myVisits(b, p.userId, today)).pending;
    const planned = rows.filter((r) => r.user_id === p.userId && r.date >= today && !logged.has(r.id)).length;
    const gap = visitsNeeded(pending, s.cases_per_visit) - planned;
    if (gap > 0) short.push({ userId: p.userId, name: p.name, visits: gap });
  }
  return { v: 1, cohortId, state: st, hasDraft, from: list[0] ?? null, to: list[list.length - 1] ?? null, days, short, noBatch };
}

export async function moveAssignment(db: Db, body: ClinicMoveBody, actor: string, now: number): Promise<ClinicPlan> {
  const today = todayOf(now);
  const found = must(await db.from("clinic_opd_assignments").select("*").eq("id", body.assignmentId).maybeSingle(), null as AssignmentRow | null);
  if (!found) throw new ApiFail("not_found");
  const a = { ...found };
  if (a.date < today) throw new ApiFail("conflict", "Past OPD days stay as they were.");
  if (body.date < today) throw new ApiFail("bad_request", "Pick today or a later day.", { fields: ["date"] });
  const settings = await loadSettings(db, a.cohort_id);
  const seats = settings.holidays.includes(body.date) ? 0 : seatsOn(settings.seats, body.date, body.batch);
  const same = must(await db.from("clinic_opd_assignments").select("id, user_id, date, batch").eq("cohort_id", a.cohort_id).eq("state", a.state).eq("date", body.date), [] as Pick<AssignmentRow, "id" | "user_id" | "date" | "batch">[]);
  if (same.some((r) => r.user_id === a.user_id && r.id !== a.id)) throw new ApiFail("conflict", "This student already has that day.");
  const used = same.filter((r) => r.batch === body.batch && r.id !== a.id).length;
  if (!body.force && used >= seats) throw new ApiFail("conflict", seats ? "That day is full." : "There is no OPD on that day.", { seats, used });
  must(await db.from("clinic_opd_assignments").update({ date: body.date, batch: body.batch, source: "moved" }).eq("id", a.id), null);
  if (a.state === "published" && (a.date !== body.date || a.batch !== body.batch)) {
    await notifyClinic({ userIds: [a.user_id], title: "Your OPD day moved", text: `Your OPD day on ${fmtDay(a.date)} (${a.batch}) moved to ${fmtDay(body.date)} (${body.batch}).`, sentBy: actor });
  }
  return getPlan(db, a.cohort_id, a.state, now);
}

export async function publishPlan(db: Db, body: { cohortId: string; notify?: boolean }, actor: string, now: number): Promise<ClinicPublishResult> {
  const cohortId = await requireCohort(db, body.cohortId);
  const today = todayOf(now);
  const drafts = await fetchAll<AssignmentRow>(() => db.from("clinic_opd_assignments").select("*").eq("cohort_id", cohortId).eq("state", "draft"));
  if (!drafts.length) throw new ApiFail("conflict", "Nothing to publish. Generate first.");
  const live = await fetchAll<AssignmentRow>(() => db.from("clinic_opd_assignments").select("*").eq("cohort_id", cohortId).eq("state", "published").gte("date", today));
  const logged = new Set<string>();
  for (const ids of chunk(live.map((a) => a.id))) for (const r of must(await db.from("clinic_case_logs").select("assignment_id").in("assignment_id", ids), [] as { assignment_id: string }[])) logged.add(r.assignment_id);
  const replace = live.filter((a) => !logged.has(a.id));
  // A draft day that clashes with a logged day of the same student is dropped (never two rows for one day).
  const keepDays = new Set(live.filter((a) => logged.has(a.id)).map((a) => `${a.user_id}|${a.date}`));
  const promote = drafts.filter((d) => d.date >= today && !keepDays.has(`${d.user_id}|${d.date}`));
  for (const ids of chunk(replace.map((a) => a.id))) must(await db.from("clinic_opd_assignments").delete().in("id", ids), null);
  const stamp = new Date(now).toISOString();
  for (const ids of chunk(promote.map((d) => d.id))) must(await db.from("clinic_opd_assignments").update({ state: "published", published_at: stamp }).in("id", ids), null);
  const leftover = drafts.filter((d) => !promote.includes(d));
  for (const ids of chunk(leftover.map((d) => d.id))) must(await db.from("clinic_opd_assignments").delete().in("id", ids), null);

  const before = new Map<string, Set<string>>();
  for (const a of replace) before.set(a.user_id, (before.get(a.user_id) ?? new Set()).add(`${a.date}|${a.batch}`));
  const after = new Map<string, string[]>();
  for (const d of promote) after.set(d.user_id, [...(after.get(d.user_id) ?? []), `${d.date}|${d.batch}`]);
  const changed: string[] = [];
  for (const u of new Set([...before.keys(), ...after.keys()])) {
    const x = before.get(u) ?? new Set();
    const y = new Set(after.get(u) ?? []);
    if (x.size !== y.size || [...x].some((k) => !y.has(k))) changed.push(u);
  }
  let notified = 0;
  if (body.notify !== false) {
    for (const u of changed) {
      const list = (after.get(u) ?? []).sort().map((k) => `${fmtDay(k.slice(0, 10))} ${k.slice(11)}`);
      notified += await notifyClinic({ userIds: [u], title: "Your OPD days", text: list.length ? `Your OPD days: ${list.join(", ")}.` : "You have no OPD days planned now.", sentBy: actor });
    }
  }
  const removed = [...before].reduce((n, [u, set]) => n + [...set].filter((k) => !(after.get(u) ?? []).includes(k)).length, 0);
  return { published: promote.length, removed, notified };
}

export async function discardDraft(db: Db, cohort: string | null | undefined): Promise<{ deleted: number }> {
  const cohortId = await requireCohort(db, cohort);
  const rows = must(await db.from("clinic_opd_assignments").delete().eq("cohort_id", cohortId).eq("state", "draft").select("id"), [] as { id: string }[]);
  return { deleted: rows.length };
}

export async function remindLogs(db: Db, cohort: string, actor: string, now: number): Promise<{ notified: number }> {
  const cohortId = await requireCohort(db, cohort);
  const today = todayOf(now);
  const b = await loadBundle(db, cohortId);
  const people = await cohortStudents(db, cohortId);
  const due = people.filter((p) => myVisits(b, p.userId, today).some((v) => v.state === "due" || (v.state === "today" && localTime(now) >= (v.end ?? "23:59"))));
  const notified = await notifyClinic({ userIds: due.map((p) => p.userId), title: "Send your OPD case log", text: "Add how many cases you took on your OPD day (or that you were absent).", sentBy: actor });
  return { notified };
}

/* ---------------------------------------------------------- trackers */

export async function trackers(db: Db, cohort: string | null | undefined, now: number): Promise<ClinicTrackers> {
  const cohortId = await requireCohort(db, cohort);
  const today = todayOf(now);
  const b = await loadBundle(db, cohortId);
  const people = await cohortStudents(db, cohortId);
  await reconcileMissed(db, b, people.map((p) => p.userId), today);
  return { v: 1, cohortId, rows: people.map((p) => trackerRow(b, p, today, now)) };
}

export async function studentDetail(db: Db, userId: string, cohort: string | null | undefined, now: number): Promise<ClinicStudentDetail> {
  const cohortId = await requireCohort(db, cohort);
  const people = await cohortStudents(db, cohortId);
  const p = people.find((x) => x.userId === userId);
  if (!p) throw new ApiFail("not_found", "That student is not in this cohort.");
  const today = todayOf(now);
  const b = await loadBundle(db, cohortId, userId);
  await reconcileMissed(db, b, [userId], today);
  const map = new Map(b.sessions.map((s) => [s.id, toSession(s)]));
  const log = must(await db.from("clinic_leave_allowance_log").select("*").eq("cohort_id", cohortId).eq("user_id", userId).order("created_at", { ascending: false }).limit(50), [] as AllowanceLogRow[]);
  const sessions = mySessions(b, userId, b.sessions.filter((s) => s.date <= today), now).filter((s) => s.required || s.my.inAt || s.my.status === "on_leave").reverse();
  return {
    v: 1,
    cohortId,
    row: trackerRow(b, p, today, now),
    sessions,
    leave: b.leaves.map((l) => toLeaveRequest(l, map)),
    visits: myVisits(b, userId, today),
    allowanceLog: log.map((l) => ({ old: l.old_allowance, new: l.new_allowance, note: l.note, at: l.created_at })),
  };
}

