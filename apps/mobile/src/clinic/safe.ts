/**
 * Every clinic answer goes through one of these before a screen sees it: a
 * missing list becomes [], a missing number 0, an unknown state a quiet
 * default. A server that sends a little more or a little less never crashes
 * the app.
 */
import { arr, bool, num, numOr, obj, str, strOr } from "@/admin/safe";
import * as C from "./contract";

const oneOf = <T extends string>(v: unknown, list: readonly T[], d: T): T => (list.includes(v as T) ? (v as T) : d);
const oneOrNull = <T extends string>(v: unknown, list: readonly T[]): T | null => (list.includes(v as T) ? (v as T) : null);

const KINDS = ["opd_morning", "opd_evening", "class", "online", "early", "other"] as const;
const BATCHES = ["morning", "evening"] as const;
const STATES = ["upcoming", "open", "in", "done", "no_out", "missed", "leave", "cancelled"] as const;
const ROSTER = ["in", "out", "missing", "leave", "no_out"] as const;
const LEAVE = ["pending", "approved", "rejected", "cancelled"] as const;
const VISIT = ["upcoming", "today", "to_log", "logged", "absent", "leave"] as const;

export const ref = (v: unknown): C.Ref => ({ id: str(obj(v).id), name: str(obj(v).name, "Cohort") });

export function session(v: unknown): C.ClinicSession {
  const r = obj(v);
  const mine = r.mine && typeof r.mine === "object" ? obj(r.mine) : null;
  return {
    id: str(r.id),
    date: str(r.date),
    start: str(r.start, "00:00"),
    end: str(r.end, "00:00"),
    kind: oneOf(r.kind, KINDS, "other"),
    title: str(r.title),
    place: strOr(r.place),
    link: strOr(r.link),
    compulsory: bool(r.compulsory, true),
    status: oneOf(r.status, ["scheduled", "moved", "cancelled"] as const, "scheduled"),
    note: strOr(r.note),
    mine: mine ? { state: oneOf(mine.state, STATES, "upcoming"), inAt: strOr(mine.inAt), outAt: strOr(mine.outAt), late: bool(mine.late), leaveAt: strOr(mine.leaveAt) } : null,
  };
}

const counts = (v: unknown): C.SessionCounts => {
  const r = obj(v);
  return { expected: num(r.expected), in: num(r.in), out: num(r.out), missing: num(r.missing), late: num(r.late), leave: num(r.leave) };
};

export function adminSession(v: unknown): C.AdminSession {
  const r = obj(v);
  return { ...session(v), cohorts: arr(r.cohorts).map(ref), counts: counts(r.counts) };
}

export function visit(v: unknown): C.OpdVisit {
  const r = obj(v);
  return { id: str(r.id), date: str(r.date), batch: oneOf(r.batch, BATCHES, "morning"), start: str(r.start, "00:00"), end: str(r.end, "00:00"), status: oneOf(r.status, VISIT, "upcoming"), cases: numOr(r.cases), note: strOr(r.note) };
}

export function today(v: unknown): C.ClinicToday {
  const r = obj(v);
  const o = r.opd && typeof r.opd === "object" ? obj(r.opd) : null;
  return {
    date: str(r.date),
    dateLine: str(r.dateLine),
    note: strOr(r.note),
    sessions: arr(r.sessions).map(session),
    opd: o ? { batch: oneOf(o.batch, BATCHES, "morning"), start: str(o.start, "00:00"), end: str(o.end, "00:00"), place: strOr(o.place), sessionId: strOr(o.sessionId) } : null,
    toLog: arr(r.toLog).map(visit),
    batch: oneOrNull(r.batch, BATCHES),
    leavesLeft: numOr(r.leavesLeft),
  };
}

export function week(v: unknown): C.ClinicWeek {
  const r = obj(v);
  return {
    from: str(r.from),
    to: str(r.to),
    days: arr(r.days).map((d) => ({ date: str(obj(d).date), note: strOr(obj(d).note), sessions: arr(obj(d).sessions).map(session) })),
    opdDays: arr(r.opdDays).map((d) => ({ date: str(obj(d).date), batch: oneOf(obj(d).batch, BATCHES, "morning"), start: str(obj(d).start, "00:00"), end: str(obj(d).end, "00:00") })),
  };
}

export function scanResult(v: unknown): C.ScanResult {
  const r = obj(v);
  const s = obj(r.session);
  return { direction: r.direction === "out" ? "out" : "in", at: str(r.at), session: { id: str(s.id), title: str(s.title, "Session"), start: str(s.start), end: str(s.end) }, late: bool(r.late), hours: numOr(r.hours) };
}

export function leave(v: unknown): C.LeaveRequest {
  const r = obj(v);
  return {
    id: str(r.id),
    kind: r.kind === "early" ? "early" : "leave",
    sessions: arr(r.sessions).map((x) => ({ id: str(obj(x).id), title: str(obj(x).title, "Session"), date: str(obj(x).date), start: str(obj(x).start), end: str(obj(x).end) })),
    reason: str(r.reason),
    leaveAt: strOr(r.leaveAt),
    status: oneOf(r.status, LEAVE, "pending"),
    overLimit: bool(r.overLimit),
    adminNote: strOr(r.adminNote),
    createdAt: str(r.createdAt),
    decidedAt: strOr(r.decidedAt),
  };
}

export function leavePage(v: unknown): C.LeavePage {
  const r = obj(v);
  return { allowance: num(r.allowance), used: num(r.used), left: num(r.left), requests: arr(r.requests).map(leave), upcoming: arr(r.upcoming).map(session) };
}

export function opdPage(v: unknown): C.OpdPage {
  const r = obj(v);
  return { batch: oneOrNull(r.batch, BATCHES), batchLocked: bool(r.batchLocked), total: num(r.total), extras: num(r.extras), done: num(r.done), casesPerVisit: num(r.casesPerVisit, 2), published: bool(r.published), visits: arr(r.visits).map(visit) };
}

export function attendance(v: unknown): C.MyAttendance {
  const r = obj(v);
  return {
    pct: numOr(r.pct),
    present: num(r.present),
    late: num(r.late),
    missed: num(r.missed),
    onLeave: num(r.onLeave),
    total: num(r.total),
    hours: num(r.hours),
    rows: arr(r.rows).map((x) => {
      const o = obj(x);
      return { sessionId: str(o.sessionId), date: str(o.date), title: str(o.title, "Session"), kind: oneOf(o.kind, KINDS, "other"), state: oneOf(o.state, STATES, "missed"), inAt: strOr(o.inAt), outAt: strOr(o.outAt), late: bool(o.late) };
    }),
  };
}

/* --------------------------------------------------------------- admin */

export function adminToday(v: unknown): C.AdminClinicToday {
  const r = obj(v);
  return { date: str(r.date), dateLine: str(r.dateLine), note: strOr(r.note), sessions: arr(r.sessions).map(adminSession), pendingLeaves: num(r.pendingLeaves), unsubmittedLogs: num(r.unsubmittedLogs) };
}

export function sessionDetail(v: unknown): C.AdminSessionDetail {
  const r = obj(v);
  return {
    session: adminSession(r.session),
    roster: arr(r.roster).map((x) => {
      const o = obj(x);
      return { studentId: str(o.studentId), name: str(o.name, "Student"), state: oneOf(o.state, ROSTER, "missing"), inAt: strOr(o.inAt), outAt: strOr(o.outAt), late: bool(o.late), manual: bool(o.manual), note: strOr(o.note), leaveAt: strOr(o.leaveAt) };
    }),
    open: bool(r.open),
    opensAt: str(r.opensAt),
    closesAt: str(r.closesAt),
  };
}

export function showCode(v: unknown): C.ShowCode {
  const r = obj(v);
  return { qr: str(r.qr), code: str(r.code), windowEndsAt: str(r.windowEndsAt), periodSeconds: num(r.periodSeconds, 30), serverNow: str(r.serverNow), open: bool(r.open, true) };
}

export function adminLeaves(v: unknown): C.AdminLeaves {
  return {
    items: arr(obj(v).items).map((x) => {
      const o = obj(x);
      return { ...leave(x), studentId: str(o.studentId), name: str(o.name, "Student"), cohort: strOr(o.cohort), left: num(o.left), allowance: num(o.allowance) };
    }),
  };
}

export function clinicStudents(v: unknown): C.ClinicStudents {
  const r = obj(v);
  return {
    cohorts: arr(r.cohorts).map(ref).filter((c) => c.id),
    items: arr(r.items).map((x) => {
      const o = obj(x);
      return {
        studentId: str(o.studentId),
        name: str(o.name, "Student"),
        cohortId: strOr(o.cohortId),
        cohort: strOr(o.cohort),
        batch: oneOrNull(o.batch, BATCHES),
        leaveAllowance: num(o.leaveAllowance),
        leavesUsed: num(o.leavesUsed),
        leavesLeft: num(o.leavesLeft),
        opdTotal: num(o.opdTotal),
        extras: num(o.extras),
        casesDone: num(o.casesDone),
        visits: num(o.visits),
        absences: num(o.absences),
        attendancePct: numOr(o.attendancePct),
        unsubmitted: num(o.unsubmitted),
      };
    }),
  };
}

export function slot(v: unknown): C.Slot {
  const r = obj(v);
  return { id: str(r.id), weekday: oneOf(r.weekday, C.WEEKDAYS, "mon"), kind: oneOf(r.kind, KINDS, "class"), title: str(r.title), start: str(r.start, "00:00"), end: str(r.end, "00:00"), place: strOr(r.place), link: strOr(r.link), cohortIds: arr<string>(r.cohortIds).map(String), compulsory: bool(r.compulsory, true) };
}

export function timetable(v: unknown): C.Timetable {
  const r = obj(v);
  return { cohorts: arr(r.cohorts).map(ref).filter((c) => c.id), slots: arr(r.slots).map(slot), upcoming: arr(r.upcoming).map(adminSession) };
}

const seat = (v: unknown): C.PlanSeat => ({ studentId: str(obj(v).studentId), name: str(obj(v).name, "Student"), fixed: bool(obj(v).fixed) });

export function plan(v: unknown): C.OpdPlan {
  const r = obj(v);
  return {
    status: oneOf(r.status, ["none", "draft", "published"] as const, "none"),
    generatedAt: strOr(r.generatedAt),
    publishedAt: strOr(r.publishedAt),
    days: arr(r.days).map((d) => {
      const o = obj(d);
      const s = obj(o.seats);
      return { date: str(o.date), morning: arr(o.morning).map(seat), evening: arr(o.evening).map(seat), seats: { morning: num(s.morning), evening: num(s.evening) } };
    }),
    short: arr(r.short).map((x) => ({ studentId: str(obj(x).studentId), name: str(obj(x).name, "Student"), needed: num(obj(x).needed), placed: num(obj(x).placed) })),
  };
}

export function opdSettings(v: unknown): C.OpdSettings {
  const r = obj(v);
  const seats = obj(r.seats);
  const times = obj(r.times);
  const t = (b: C.Batch, s: string, e: string) => ({ start: str(obj(times[b]).start, s), end: str(obj(times[b]).end, e) });
  return {
    from: str(r.from),
    to: str(r.to),
    casesPerVisit: num(r.casesPerVisit, 2),
    seats: Object.fromEntries(C.WEEKDAYS.map((w) => [w, { morning: num(obj(seats[w]).morning), evening: num(obj(seats[w]).evening) }])) as C.OpdSettings["seats"],
    times: { morning: t("morning", "08:00", "10:00"), evening: t("evening", "17:00", "20:00") },
  };
}

export function opdAdmin(v: unknown): C.OpdAdmin {
  const r = obj(v);
  return { settings: opdSettings(r.settings), plan: plan(r.plan), students: num(r.students) };
}
