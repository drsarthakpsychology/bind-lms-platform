/**
 * Schedule, attendance, leave and OPD cases: the shapes the app reads and
 * sends (routes under /api/app/v1/clinic and /api/app/v1/admin/clinic).
 * The server's own file is src/lib/app-api/contract.ts on the website side
 * (docs/app/API_CONTRACT_CLINIC.md). Every answer is read through
 * src/clinic/safe.ts, so a missing or extra field never breaks a screen.
 *
 * Dates are "YYYY-MM-DD" in India time, clock times "HH:MM" (24 hour),
 * moments ISO 8601.
 */

export type SessionKind = "opd_morning" | "opd_evening" | "class" | "online" | "early" | "other";
export type Batch = "morning" | "evening";
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export const WEEKDAYS: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/** Where one student stands for one session. */
export type AttendState =
  /** Not open yet. */
  | "upcoming"
  /** Open now for scanning (30 min before start to 60 min after end), not scanned. */
  | "open"
  /** Scanned in, not out yet. */
  | "in"
  /** Scanned in and out. */
  | "done"
  /** Scanned in, never out: the session's end is kept as "no scan out". */
  | "no_out"
  /** No scan and no approved leave. */
  | "missed"
  | "leave"
  | "cancelled";

export type ClinicSession = {
  id: string;
  date: string;
  start: string;
  end: string;
  kind: SessionKind;
  /** The admin's own name for "other" kinds ("Case conference"); otherwise a plain title. */
  title: string;
  place: string | null;
  link: string | null;
  compulsory: boolean;
  status: "scheduled" | "moved" | "cancelled";
  /** The admin's note to students ("Moved to 11 because of the holiday"). */
  note: string | null;
  /** For a student: their own state, scan times and an early leave approved for it. */
  mine: { state: AttendState; inAt: string | null; outAt: string | null; late: boolean; leaveAt: string | null } | null;
};

/* ------------------------------------------------------------ student */

/** GET /clinic/today */
export type ClinicToday = {
  date: string;
  /** "Monday 16 November" */
  dateLine: string;
  /** The admin's note on today's schedule ("Bring your case sheets"). */
  note: string | null;
  sessions: ClinicSession[];
  /** Today's OPD visit when this student is assigned. */
  opd: { batch: Batch; start: string; end: string; place: string | null; sessionId: string | null } | null;
  /** Past OPD visits still waiting for a case log. */
  toLog: OpdVisit[];
  batch: Batch | null;
  leavesLeft: number | null;
};

/** GET /clinic/schedule?from=YYYY-MM-DD (seven days from `from`) */
export type ClinicWeek = {
  from: string;
  to: string;
  days: { date: string; note: string | null; sessions: ClinicSession[] }[];
  /** My OPD days in the range. */
  opdDays: { date: string; batch: Batch; start: string; end: string }[];
};

/** POST /clinic/scan: what the camera read (`qr`) or the 6 characters typed (`code`). */
export type ScanBody = { qr?: string; code?: string };
/**
 * Refusals come as errors with these codes: code_expired, not_your_session,
 * already_scanned, session_closed, bad_code.
 */
export type ScanResult = {
  direction: "in" | "out";
  at: string;
  session: { id: string; title: string; start: string; end: string };
  /** In after start + the late setting (10 minutes). */
  late: boolean;
  /** Hours between in and out (for an OUT scan). */
  hours: number | null;
};

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
export type LeaveRequest = {
  id: string;
  /** leave: misses whole sessions (one leave each). early: leaves one session early (no leave used). */
  kind: "leave" | "early";
  sessions: { id: string; title: string; date: string; start: string; end: string }[];
  reason: string;
  /** For "early": the clock time ("17:00"). */
  leaveAt: string | null;
  status: LeaveStatus;
  /** Asked with no leaves left: the admin decides. */
  overLimit: boolean;
  adminNote: string | null;
  createdAt: string;
  decidedAt: string | null;
};

/** GET /clinic/leave */
export type LeavePage = { allowance: number; used: number; left: number; requests: LeaveRequest[]; /** Sessions a leave can be asked for. */ upcoming: ClinicSession[] };
/** POST /clinic/leave */
export type LeaveBody = { sessionIds: string[]; reason: string };
/** POST /clinic/leave/early */
export type LeaveEarlyBody = { sessionId: string; leaveAt: string; reason: string };
export type LeaveResult = { request: LeaveRequest };
/** POST /clinic/leave/:id/cancel (a pending request) */
export type CancelLeaveResult = { cancelled: true };

export type OpdVisitStatus =
  | "upcoming"
  | "today"
  /** Over, no log yet. */
  | "to_log"
  | "logged"
  /** The student said "I was absent", or missed it with no leave. */
  | "absent"
  | "leave";
export type OpdVisit = { id: string; date: string; batch: Batch; start: string; end: string; status: OpdVisitStatus; cases: number | null; note: string | null };

/** GET /clinic/opd */
export type OpdPage = {
  batch: Batch | null;
  /** Chosen once; after that only the admin changes it. */
  batchLocked: boolean;
  /** Cases to do, extras included. */
  total: number;
  /** Paid extra cases inside `total`. */
  extras: number;
  done: number;
  casesPerVisit: number;
  /** The admin has published the OPD timetable. */
  published: boolean;
  visits: OpdVisit[];
};
/** PUT /clinic/batch */
export type BatchBody = { batch: Batch };
export type BatchResult = { batch: Batch; batchLocked: true };
/** POST /clinic/opd/visits/:id/log: a count (0 allowed) or absent. */
export type CaseLogBody = { cases: number | null; absent: boolean; note: string | null };
export type CaseLogResult = { visit: OpdVisit; done: number; total: number };

/** GET /clinic/attendance */
export type MyAttendance = {
  /** Present (in time or late) of compulsory sessions so far; null before the first. */
  pct: number | null;
  present: number;
  late: number;
  missed: number;
  onLeave: number;
  total: number;
  hours: number;
  rows: { sessionId: string; date: string; title: string; kind: SessionKind; state: AttendState; inAt: string | null; outAt: string | null; late: boolean }[];
};

/* -------------------------------------------------------------- admin */

export type Ref = { id: string; name: string };
export type SessionCounts = { expected: number; in: number; out: number; missing: number; late: number; leave: number };
export type AdminSession = ClinicSession & { cohorts: Ref[]; counts: SessionCounts };

/** GET /admin/clinic/today */
export type AdminClinicToday = { date: string; dateLine: string; note: string | null; sessions: AdminSession[]; pendingLeaves: number; unsubmittedLogs: number };

export type RosterState = "in" | "out" | "missing" | "leave" | "no_out";
export type RosterRow = { studentId: string; name: string; state: RosterState; inAt: string | null; outAt: string | null; late: boolean; manual: boolean; note: string | null; leaveAt: string | null };
/** GET /admin/clinic/sessions/:id */
export type AdminSessionDetail = { session: AdminSession; roster: RosterRow[]; /** Scanning is open now. */ open: boolean; opensAt: string; closesAt: string };
/** POST /admin/clinic/sessions/:id/mark */
export type MarkBody = { studentId: string; state: "in" | "out" | "missing"; note: string };

/**
 * GET /admin/clinic/sessions/:id/code: the code for this 30 second window
 * (the server makes the session's secret the first time). `qr` goes in the
 * picture, `code` (6 characters) under it.
 */
export type ShowCode = { qr: string; code: string; windowEndsAt: string; periodSeconds: number; serverNow: string; open: boolean };

export type AdminLeave = LeaveRequest & { studentId: string; name: string; cohort: string | null; left: number; allowance: number };
/** GET /admin/clinic/leaves?status=pending|all */
export type AdminLeaves = { items: AdminLeave[] };
/** POST /admin/clinic/leaves/:id/decide */
export type DecideBody = { decision: "approve" | "reject"; note: string | null };

/** One student's clinic numbers: allowances, OPD quota and the trackers. */
export type ClinicStudent = {
  studentId: string;
  name: string;
  cohortId: string | null;
  cohort: string | null;
  batch: Batch | null;
  leaveAllowance: number;
  leavesUsed: number;
  leavesLeft: number;
  /** Cases to do, extras included. */
  opdTotal: number;
  extras: number;
  casesDone: number;
  visits: number;
  absences: number;
  attendancePct: number | null;
  /** OPD visits over with no case log. */
  unsubmitted: number;
};
/** GET /admin/clinic/students */
export type ClinicStudents = { cohorts: Ref[]; items: ClinicStudent[] };
/** POST /admin/clinic/allowances: the same numbers for a whole cohort or the students picked. */
export type BulkAllowanceBody = { cohortId?: string; studentIds?: string[]; leaves?: number; opdTotal?: number; note: string };
export type BulkAllowanceResult = { updated: number };
/** PATCH /admin/clinic/students/:id */
export type StudentClinicBody = { leaveAllowance?: number; opdTotal?: number; batch?: Batch; note: string };
/** POST /admin/clinic/students/:id/extra-cases: paid extra cases ("paid 12 Nov"). */
export type ExtraCasesBody = { cases: number; note: string };
/** POST /admin/clinic/logs/remind */
export type RemindBody = { studentIds: string[] };
export type RemindResult = { sent: number };

export type Slot = { id: string; weekday: Weekday; kind: SessionKind; title: string; start: string; end: string; place: string | null; link: string | null; cohortIds: string[]; compulsory: boolean };
export type SlotBody = Omit<Slot, "id">;
/** GET /admin/clinic/timetable: the weekly slots and the next 14 days of sessions. */
export type Timetable = { cohorts: Ref[]; slots: Slot[]; upcoming: AdminSession[] };
/** POST /admin/clinic/sessions (a one-off) */
export type OneOffBody = { date: string; start: string; end: string; kind: SessionKind; title: string; place: string | null; link: string | null; cohortIds: string[]; compulsory: boolean; note: string | null };
/** PATCH /admin/clinic/sessions/:id (move) */
export type MoveSessionBody = { date: string; start: string; end: string; note: string | null };
/** POST /admin/clinic/sessions/:id/cancel */
export type CancelSessionBody = { note: string | null };
/** PUT /admin/clinic/days/:date/note */
export type DayNoteBody = { note: string };

export type OpdSettings = {
  from: string;
  to: string;
  casesPerVisit: number;
  seats: Record<Weekday, Record<Batch, number>>;
  times: Record<Batch, { start: string; end: string }>;
};
export type PlanSeat = { studentId: string; name: string; /** Past or within the next two days: kept as it is when generating again. */ fixed: boolean };
export type PlanDay = { date: string; morning: PlanSeat[]; evening: PlanSeat[]; seats: Record<Batch, number> };
export type OpdPlan = {
  status: "none" | "draft" | "published";
  generatedAt: string | null;
  publishedAt: string | null;
  days: PlanDay[];
  /** Students the seats could not cover. */
  short: { studentId: string; name: string; needed: number; placed: number }[];
};
/** GET /admin/clinic/opd */
export type OpdAdmin = { settings: OpdSettings; plan: OpdPlan; students: number };
/** PUT /admin/clinic/opd/settings */
export type OpdSettingsBody = OpdSettings;
/** POST /admin/clinic/opd/generate: fills gaps from today on (published days stay). */
export type GenerateResult = { plan: OpdPlan };
/** POST /admin/clinic/opd/move */
export type MoveSeatBody = { studentId: string; fromDate: string; toDate: string; batch: Batch };
/** POST /admin/clinic/opd/publish */
export type PublishResult = { plan: OpdPlan; notified: number };
