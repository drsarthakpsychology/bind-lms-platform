/**
 * Every clinic answer goes through one of these before a screen sees it. They
 * read the server's shapes (the `Clinic*` types in src/api/contract.ts) and
 * give the screens' shapes (./contract.ts): a missing list becomes [], a
 * missing number 0, an unknown state a quiet default, so a server that sends
 * a little more or a little less never crashes the app.
 */
import { arr, bool, num, numOr, obj, str, strOr } from "@/admin/safe";
import * as C from "./contract";
import { addDays, minutesOf, todayIST } from "./logic";

type Raw = Record<string, unknown>;
const oneOf = <T extends string>(v: unknown, list: readonly T[], d: T): T => (list.includes(v as T) ? (v as T) : d);
const oneOrNull = <T extends string>(v: unknown, list: readonly T[]): T | null => (list.includes(v as T) ? (v as T) : null);

const KINDS = ["opd_morning", "opd_evening", "class", "online_class", "early_class", "other"] as const;
const BATCHES = ["morning", "evening"] as const;
const LEAVE = ["pending", "approved", "rejected", "cancelled"] as const;
const isOpdKind = (k: string) => k === "opd_morning" || k === "opd_evening";

export const ref = (v: unknown): C.Ref => ({ id: str(obj(v).id), name: str(obj(v).name, "Cohort") });

/** The server's per-student status, as the screens' state. `open` says scanning is accepted now. */
export function stateOf(status: unknown, open: boolean, inAt: string | null, outAt: string | null): C.AttendState | null {
  switch (status) {
    case "upcoming":
      return open ? "open" : "upcoming";
    case "in":
      return "in";
    case "present":
      return "done";
    case "late":
      return outAt ? "done" : inAt ? "in" : "missed";
    case "no_scan_out":
      return "no_out";
    case "on_leave":
      return "leave";
    case "absent":
      return "missed";
    case "cancelled":
      return "cancelled";
    case "not_required":
      return inAt ? (outAt ? "done" : "in") : null;
    default:
      return null;
  }
}

/** A session (ClinicSession, or ClinicMySession with `my` for a student). */
export function session(v: unknown): C.ClinicSession {
  const r = obj(v);
  const my = r.my && typeof r.my === "object" ? obj(r.my) : null;
  const cancelled = r.status === "cancelled";
  const inAt = my ? strOr(my.inAt) : null;
  const outAt = my ? strOr(my.outAt) : null;
  const state = my ? stateOf(my.status, bool(r.open), inAt, outAt) : null;
  const kind = oneOf(r.kind, KINDS, "other");
  return {
    id: str(r.id),
    date: str(r.date),
    start: str(r.start, "00:00"),
    end: str(r.end, "00:00"),
    kind,
    title: str(r.title),
    place: strOr(r.place),
    link: strOr(r.onlineLink) ?? strOr(r.link),
    compulsory: bool(r.compulsory, !isOpdKind(kind)),
    status: cancelled ? "cancelled" : strOr(r.movedFrom) ? "moved" : "scheduled",
    note: strOr(r.note),
    cohortIds: arr<string>(r.cohortIds).map(String),
    batch: oneOrNull(r.batch, BATCHES) ?? (kind === "opd_morning" ? "morning" : kind === "opd_evening" ? "evening" : null),
    mine: my && state ? { state: cancelled ? "cancelled" : state, inAt, outAt, late: bool(my.late) || my.status === "late", leaveAt: strOr(my.earlyLeaveAt) } : null,
  };
}

/**
 * Which of a student's sessions to show: everything except OPD days they are
 * not assigned to (the server lists the cohort's OPD sessions for everyone).
 */
export function mineOnly(v: unknown): boolean {
  const r = obj(v);
  if (!isOpdKind(str(r.kind))) return true;
  return bool(r.assigned) || bool(r.required) || !!strOr(obj(r.my).inAt);
}

const sortT = <T extends { date: string; start: string }>(rows: T[]) => [...rows].sort((a, b) => (a.date === b.date ? minutesOf(a.start) - minutesOf(b.start) : a.date < b.date ? -1 : 1));

/* ------------------------------------------------------------ student */

export function today(v: unknown): C.ClinicToday {
  const r = obj(v);
  const raw = arr(r.sessions);
  const sessions = sortT(raw.filter(mineOnly).map(session));
  const o = r.opd && typeof r.opd === "object" ? obj(r.opd) : null;
  const opdSession = o ? sessions.find((s) => s.id === strOr(o.sessionId)) : undefined;
  return {
    date: str(r.date, todayIST()),
    note: strOr(r.note),
    sessions,
    opd: o ? { batch: oneOf(o.batch, BATCHES, "morning"), start: str(o.start, opdSession?.start ?? ""), end: str(o.end, opdSession?.end ?? ""), place: opdSession?.place ?? null, sessionId: strOr(o.sessionId) } : null,
    logsDue: num(r.logsDue),
    leavesLeft: numOr(r.leavesLeft),
  };
}

export function week(v: unknown): C.ClinicWeek {
  const r = obj(v);
  const days = arr(r.days).map((d) => {
    const o = obj(d);
    const raw = arr(o.sessions);
    return { date: str(o.date), note: strOr(o.note), raw, sessions: sortT(raw.filter(mineOnly).map(session)) };
  });
  const opdDays = days.flatMap((d) =>
    d.raw
      .filter((x) => isOpdKind(str(obj(x).kind)) && bool(obj(x).assigned) && obj(x).status !== "cancelled")
      .map((x) => {
        const s = session(x);
        return { date: d.date, batch: s.batch ?? "morning", start: s.start, end: s.end };
      }),
  );
  return { from: str(r.from), to: str(r.to), days: days.map(({ raw: _r, ...d }) => d), opdDays };
}

export function scanResult(v: unknown): C.ScanResult {
  const r = obj(v);
  return { direction: r.direction === "out" ? "out" : "in", at: str(r.at), session: { id: str(r.sessionId), title: str(r.title, "Session") }, late: bool(r.late), minutes: numOr(r.minutes) };
}

const choice = (v: unknown, fallback: boolean): { allowed: boolean; reason: string | null } => {
  const r = obj(v);
  const reason = typeof r.reason === "string" && r.reason ? r.reason : null;
  return { allowed: typeof r.allowed === "boolean" ? r.allowed : fallback, reason };
};

/** A choice the server did not clearly allow stays off: a broken answer never opens a button. */
export function scanStep(v: unknown): C.ScanStep {
  const r = obj(v);
  const s = obj(r.session);
  const state = oneOf(r.state, ["none", "in", "out"] as const, "none");
  const ms = Date.parse(str(r.ticketExpiresAt)) - Date.parse(str(r.now));
  return {
    ticket: str(r.ticket),
    ticketMs: Number.isFinite(ms) ? Math.max(0, Math.min(ms, 10 * 60_000)) : 0,
    session: { id: str(s.id), title: str(s.title, "Session"), date: str(s.date), start: str(s.start).slice(0, 5), end: str(s.end).slice(0, 5), place: typeof s.place === "string" && s.place ? s.place : null },
    state,
    inAt: typeof r.inAt === "string" ? r.inAt : null,
    outAt: typeof r.outAt === "string" ? r.outAt : null,
    in: choice(r.in, false),
    out: choice(r.out, false),
  };
}

export function markResult(v: unknown): C.MarkResult {
  const r = obj(v);
  return { ...scanResult(v), already: bool(r.already), message: str(r.message) };
}

export function leave(v: unknown): C.LeaveRequest {
  const r = obj(v);
  return {
    id: str(r.id),
    kind: oneOf(r.kind, ["leave", "early", "missed"] as const, "leave"),
    sessions: arr(r.sessions).map((x) => ({ id: str(obj(x).id), title: str(obj(x).title, "Session"), date: str(obj(x).date), start: str(obj(x).start) })),
    reason: str(r.reason),
    leaveAt: strOr(r.leaveAt),
    status: oneOf(r.status, LEAVE, "pending"),
    overLimit: bool(r.overLimit) || bool(r.overLimitNow),
    cost: num(r.cost, r.kind === "early" ? 0 : arr(r.sessions).length),
    adminNote: strOr(r.decisionNote),
    createdAt: str(r.createdAt),
    decidedAt: strOr(r.decidedAt),
  };
}

const balance = (v: unknown) => {
  const b = obj(v);
  return { allowance: num(b.allowance), used: num(b.used), pending: num(b.pending), left: num(b.left) };
};

/** GET /clinic/leave, with the student's sessions from today on (from the week answers) to pick from. */
export function leavePage(v: unknown, weeks: unknown[]): C.LeavePage {
  const r = obj(v);
  const t = todayIST();
  const seen = new Set<string>();
  const upcoming = weeks
    .flatMap((w) => week(w).days.flatMap((d) => d.sessions))
    .filter((s) => s.date >= t && s.status !== "cancelled" && s.mine && s.mine.state !== "leave" && s.mine.state !== "done" && !seen.has(s.id) && !!seen.add(s.id));
  return { ...balance(r.balance), requests: arr(r.requests).map(leave), upcoming: sortT(upcoming) };
}

const VISIT: Record<string, C.OpdVisitStatus> = { upcoming: "upcoming", today: "today", due: "to_log", done: "logged", absent: "absent", missed: "absent", on_leave: "leave" };

export function visit(v: unknown): C.OpdVisit {
  const r = obj(v);
  const log = r.log && typeof r.log === "object" ? obj(r.log) : null;
  const batch = oneOf(r.batch, BATCHES, "morning");
  return { id: str(r.assignmentId) || str(r.id), date: str(r.date), batch, start: str(r.start), end: str(r.end), status: VISIT[str(r.state)] ?? "upcoming", cases: log && !log.absent ? num(log.cases) : null, note: log ? strOr(log.note) : null };
}

export function opdPage(v: unknown): C.OpdPage {
  const r = obj(v);
  const q = obj(r.quota);
  const extras = arr(q.extras).reduce<number>((n, x) => n + num(obj(x).count), 0);
  const visits = sortT(arr(r.visits).map(visit));
  return { batch: oneOrNull(r.batch, BATCHES), batchLocked: !bool(r.canChooseBatch), total: num(q.total, num(q.base) + extras), extras, done: num(q.done), casesPerVisit: num(r.casesPerVisit, 2), visits };
}

export function attendance(v: unknown): C.MyAttendance {
  const r = obj(v);
  const s = obj(r.summary);
  const rows = sortT(arr(r.sessions).filter(mineOnly).map(session))
    .filter((x) => x.mine && x.mine.state !== "upcoming" && x.mine.state !== "open" && x.status !== "cancelled")
    .reverse()
    .map((x) => ({ sessionId: x.id, date: x.date, title: x.title || "Session", kind: x.kind, state: x.mine!.state, inAt: x.mine!.inAt, outAt: x.mine!.outAt, late: x.mine!.late }));
  return { pct: numOr(s.percent), present: num(s.attended), late: num(s.late), missed: num(s.absent), onLeave: num(s.onLeave), noOut: num(s.noScanOut), total: num(s.required), minutes: num(s.minutes), rows };
}

/* --------------------------------------------------------------- admin */

const counts = (v: unknown): C.SessionCounts => {
  const r = obj(v);
  const expected = num(r.expected);
  const inn = num(r.in);
  const out = num(r.out);
  const leave = num(r.onLeave ?? r.leave);
  return { expected, in: inn, out, late: num(r.late), leave, missing: r.missing !== undefined ? num(r.missing) : Math.max(0, expected - inn - out - leave) };
};

export const adminSession = (v: unknown): C.AdminSession => ({ ...session(v), counts: counts(obj(v).counts) });

/** GET /clinic/admin/overview, with today's note from GET /clinic/admin/sessions. */
export function adminToday(v: unknown, sessions?: unknown): C.AdminClinicToday {
  const r = obj(v);
  const date = str(r.today, todayIST());
  const note = arr(obj(sessions).notes).map(obj).find((n) => n.date === date);
  return {
    cohorts: arr(r.cohorts).map(ref).filter((c) => c.id),
    cohortId: strOr(r.cohortId),
    date,
    note: note ? strOr(note.note) : null,
    sessions: sortT(arr(r.sessions).map(adminSession)),
    pendingLeaves: num(r.pendingLeave),
    logsDue: num(r.logsDue),
    canWrite: bool(r.canWrite),
  };
}

function rosterState(status: unknown, outAt: string | null, inAt: string | null): C.RosterState {
  switch (status) {
    case "in":
      return "in";
    case "present":
      return "out";
    case "late":
      return outAt ? "out" : inAt ? "in" : "missing";
    case "no_scan_out":
      return "no_out";
    case "on_leave":
      return "leave";
    default:
      return inAt ? (outAt ? "out" : "in") : "missing";
  }
}

/** GET /clinic/admin/sessions/:id/attendance */
export function sessionDetail(v: unknown): C.AdminSessionDetail {
  const r = obj(v);
  const roster = arr(r.rows)
    .map(obj)
    .filter((o) => o.status !== "not_required" || !!o.inAt)
    .map((o) => {
      const inAt = strOr(o.inAt);
      const outAt = strOr(o.outAt);
      return { studentId: str(o.userId), name: str(o.name, str(o.roll, "Student")), state: rosterState(o.status, outAt, inAt), inAt, outAt, late: bool(o.late) || o.status === "late", manual: bool(o.manual), note: strOr(o.note), leaveAt: strOr(o.earlyLeaveAt) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  return { session: { ...session(r.session), counts: counts(r.counts) }, roster, open: bool(r.open), lateMinutes: num(r.lateMinutes, 10) };
}

export function showCode(v: unknown): C.ShowCode {
  const r = obj(v);
  return { qr: str(r.qr), code: str(r.code), validUntil: str(r.validUntil), refreshInMs: num(r.refreshInMs, 30_000) };
}

export function adminLeaves(v: unknown): C.AdminLeave[] {
  return arr(obj(v).requests).map((x) => {
    const o = obj(x);
    const b = balance(o.balance);
    return { ...leave(x), studentId: str(o.userId), name: str(o.name, str(o.roll, "Student")), left: b.left, allowance: b.allowance };
  });
}

/** GET /clinic/admin/trackers: everyone's leaves, cases, visits and attendance. */
export function trackers(v: unknown): C.ClinicStudents {
  const r = obj(v);
  return {
    cohortId: strOr(r.cohortId),
    items: arr(r.rows)
      .map((x) => {
        const o = obj(x);
        const a = obj(o.attendance);
        const l = balance(o.leave);
        const q = obj(o.cases);
        const vs = obj(o.visits);
        const extras = arr(q.extras).reduce<number>((n, e) => n + num(obj(e).count), 0);
        return {
          studentId: str(o.userId),
          name: str(o.name, str(o.roll, "Student")),
          batch: oneOrNull(o.batch, BATCHES),
          leaveAllowance: l.allowance,
          leavesUsed: l.used,
          leavesLeft: l.left,
          opdTotal: num(q.total),
          extras,
          casesDone: num(q.done),
          visits: num(vs.done),
          absences: num(vs.absent) + num(vs.missed),
          attendancePct: numOr(a.percent),
          unsubmitted: num(vs.due),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

export function slot(v: unknown): C.Slot {
  const r = obj(v);
  return { id: str(r.id), weekday: C.weekdayFrom(num(r.weekday, 1)), kind: oneOf(r.kind, KINDS, "class"), title: str(r.title), start: str(r.start, "00:00"), end: str(r.end, "00:00"), place: strOr(r.place), link: strOr(r.onlineLink), cohortIds: arr<string>(r.cohortIds).map(String), compulsory: bool(r.compulsory, true) };
}

/** GET /clinic/admin/timetable and GET /clinic/admin/sessions (the next two weeks). */
export function timetable(slots: unknown, sessions: unknown): C.Timetable {
  const s = arr(obj(slots).slots)
    .filter((x) => obj(x).active !== false)
    .map(slot)
    .sort((a, b) => C.WEEKDAYS.indexOf(a.weekday) - C.WEEKDAYS.indexOf(b.weekday) || minutesOf(a.start) - minutesOf(b.start));
  return { slots: s, upcoming: sortT(arr(obj(sessions).sessions).map(adminSession)) };
}

export function opdSettings(v: unknown): C.OpdSettings {
  const r = obj(v);
  const seats = obj(r.seats);
  const t = todayIST();
  return {
    from: str(r.startDate, t),
    to: str(r.endDate, addDays(t, 56)),
    casesPerVisit: num(r.casesPerVisit, 2),
    seats: Object.fromEntries(C.WEEKDAYS.map((w) => [w, { morning: num(obj(seats[String(C.weekdayNumber(w))]).morning), evening: num(obj(seats[String(C.weekdayNumber(w))]).evening) }])) as C.OpdSettings["seats"],
    lateMinutes: num(r.lateMinutes, 10),
    holidays: arr<string>(r.holidays).map(String),
    freezeDays: num(r.freezeDays, 2),
  };
}

/** The screens' settings as the server's ClinicOpdSettings body. */
export function settingsBody(cohortId: string, s: C.OpdSettings): Raw {
  return {
    cohortId,
    seats: Object.fromEntries(C.WEEKDAYS.map((w) => [String(C.weekdayNumber(w)), { morning: s.seats[w].morning, evening: s.seats[w].evening }])),
    casesPerVisit: s.casesPerVisit,
    startDate: s.from || null,
    endDate: s.to || null,
    lateMinutes: s.lateMinutes,
    holidays: s.holidays,
    freezeDays: s.freezeDays,
  };
}

export function plan(v: unknown): C.OpdPlan {
  const r = obj(v);
  const t = todayIST();
  const days = arr(r.days).map((d) => {
    const o = obj(d);
    const side = (b: unknown) => {
      const x = obj(b);
      return { seats: num(x.seats), people: arr(x.people).map((p) => ({ assignmentId: str(obj(p).assignmentId), studentId: str(obj(p).userId), name: str(obj(p).name, "Student"), fixed: str(o.date) < t, source: oneOf(obj(p).source, ["kept", "new", "moved"] as const, "kept") })) };
    };
    const m = side(o.morning);
    const e = side(o.evening);
    return { date: str(o.date), morning: m.people, evening: e.people, seats: { morning: m.seats, evening: e.seats } };
  });
  const status = bool(r.hasDraft) || r.state === "draft" ? "draft" : days.some((d) => d.morning.length || d.evening.length) ? "published" : "none";
  return {
    status,
    days,
    short: arr(r.short).map((x) => ({ studentId: str(obj(x).userId), name: str(obj(x).name, "Student"), visits: num(obj(x).visits) })),
    noBatch: arr(r.noBatch).map((x) => ({ studentId: str(obj(x).userId), name: str(obj(x).name, "Student") })),
  };
}
