/**
 * Schedule, attendance, leave and OPD cases: the shapes the clinic SCREENS
 * read. The server's own shapes are the `Clinic*` types in
 * src/api/contract.ts (a copy of the website's src/lib/app-api/contract.ts,
 * docs/app/API_CONTRACT_CLINIC.md); src/clinic/safe.ts turns every answer
 * into these, so a missing or extra field never breaks a screen, and
 * src/clinic/api.ts sends the server's bodies.
 *
 * Dates are "YYYY-MM-DD" in India time, clock times "HH:MM" (24 hour),
 * moments ISO 8601.
 */
import type { ClinicKind } from "@/api/contract";

export type SessionKind = ClinicKind;
export type Batch = "morning" | "evening";
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export const WEEKDAYS: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
/** The server counts weekdays from Sunday (0) to Saturday (6). */
export const weekdayNumber = (w: Weekday): number => (WEEKDAYS.indexOf(w) + 1) % 7;
export const weekdayFrom = (n: number): Weekday => WEEKDAYS[(((n % 7) + 7) % 7 + 6) % 7] ?? "mon";

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
  /** Scanned in, never out: kept as "no scan out", not invented. */
  | "no_out"
  /** Required, over, no scan and no approved leave. */
  | "missed"
  | "leave"
  | "cancelled";

export type ClinicSession = {
  id: string;
  date: string;
  start: string;
  end: string;
  kind: SessionKind;
  /** The admin's own name ("Case conference"); empty means the kind's name. */
  title: string;
  place: string | null;
  link: string | null;
  compulsory: boolean;
  status: "scheduled" | "moved" | "cancelled";
  /** The admin's note to students ("Moved to 11 because of the holiday"). */
  note: string | null;
  cohortIds: string[];
  /** OPD sessions: which batch. */
  batch: Batch | null;
  /** For a student, when it is theirs (a compulsory class or an OPD day they are assigned to): their state. */
  mine: { state: AttendState; inAt: string | null; outAt: string | null; late: boolean; leaveAt: string | null } | null;
};

/* ------------------------------------------------------------ student */

export type ClinicToday = {
  date: string;
  note: string | null;
  sessions: ClinicSession[];
  /** Today's OPD visit when this student is assigned. */
  opd: { batch: Batch; start: string; end: string; place: string | null; sessionId: string | null } | null;
  /** Past OPD days still waiting for a case log. */
  logsDue: number;
  leavesLeft: number | null;
};

export type ClinicWeek = {
  from: string;
  to: string;
  days: { date: string; note: string | null; sessions: ClinicSession[] }[];
  /** My OPD days in the range. */
  opdDays: { date: string; batch: Batch; start: string; end: string }[];
};

export type ScanResult = {
  direction: "in" | "out";
  at: string;
  session: { id: string; title: string };
  /** In after start + the late minutes. */
  late: boolean;
  /** Minutes present (an OUT scan). */
  minutes: number | null;
};

/** What a scanned code turned out to be: the session, where I stand in it, and which of IN and OUT I can mark now. */
export type ScanStep = {
  ticket: string;
  /** How long the ticket lasts from the moment the server answered. */
  ticketMs: number;
  session: { id: string; title: string; date: string; start: string; end: string; place: string | null };
  state: "none" | "in" | "out";
  inAt: string | null;
  outAt: string | null;
  in: { allowed: boolean; reason: string | null };
  out: { allowed: boolean; reason: string | null };
};
/** A mark as recorded. `already`: it was there before this press; nothing changed. */
export type MarkResult = ScanResult & { already: boolean; message: string };

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";
export type LeaveRequest = {
  id: string;
  /** leave: whole sessions (one leave each). early: leaves one session early (no leave used). missed: an OPD day missed with no leave (counted as one). */
  kind: "leave" | "early" | "missed";
  sessions: { id: string; title: string; date: string; start: string }[];
  reason: string;
  /** For "early": the clock time ("17:00"). */
  leaveAt: string | null;
  status: LeaveStatus;
  /** Asked with no leaves left: the admin decides. */
  overLimit: boolean;
  /** Leaves it uses. */
  cost: number;
  adminNote: string | null;
  createdAt: string;
  decidedAt: string | null;
};

export type LeavePage = { allowance: number; used: number; pending: number; left: number; requests: LeaveRequest[]; /** My sessions from today on that a leave can be asked for. */ upcoming: ClinicSession[] };

export type OpdVisitStatus =
  | "upcoming"
  | "today"
  /** Over, no log yet. */
  | "to_log"
  | "logged"
  /** "I was absent", or missed with no leave (counts as a leave). */
  | "absent"
  | "leave";
export type OpdVisit = { id: string; date: string; batch: Batch; start: string; end: string; status: OpdVisitStatus; cases: number | null; note: string | null };

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
  visits: OpdVisit[];
};

export type MyAttendance = {
  /** Required sessions attended of those due (leave left out); null before the first. */
  pct: number | null;
  present: number;
  late: number;
  missed: number;
  onLeave: number;
  noOut: number;
  total: number;
  minutes: number;
  rows: { sessionId: string; date: string; title: string; kind: SessionKind; state: AttendState; inAt: string | null; outAt: string | null; late: boolean }[];
};

/* -------------------------------------------------------------- admin */

export type Ref = { id: string; name: string };
export type SessionCounts = { expected: number; in: number; out: number; missing: number; late: number; leave: number };
export type AdminSession = ClinicSession & { counts: SessionCounts };

export type AdminClinicToday = { cohorts: Ref[]; cohortId: string | null; date: string; note: string | null; sessions: AdminSession[]; pendingLeaves: number; logsDue: number; canWrite: boolean };

export type RosterState = "in" | "out" | "missing" | "leave" | "no_out";
export type RosterRow = { studentId: string; name: string; state: RosterState; inAt: string | null; outAt: string | null; late: boolean; manual: boolean; note: string | null; leaveAt: string | null };
export type AdminSessionDetail = { session: AdminSession; roster: RosterRow[]; /** Scanning is open now. */ open: boolean; lateMinutes: number };
/** Mark by hand: present (in), left (out), or clear the scans. */
export type MarkState = "in" | "out" | "missing";

/** The code for this 30 second window: `qr` in the picture, `code` (6 characters) under it. */
export type ShowCode = { qr: string; code: string; validUntil: string; /** When to ask again, by the server's clock. */ refreshInMs: number };

export type AdminLeave = LeaveRequest & { studentId: string; name: string; left: number; allowance: number };

/** One student's clinic numbers: allowances, OPD quota and the trackers. */
export type ClinicStudent = {
  studentId: string;
  name: string;
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
export type ClinicStudents = { cohortId: string | null; items: ClinicStudent[] };

export type Slot = { id: string; weekday: Weekday; kind: SessionKind; title: string; start: string; end: string; place: string | null; link: string | null; cohortIds: string[]; compulsory: boolean };
export type SlotDraft = Omit<Slot, "id">;
export type Timetable = { slots: Slot[]; upcoming: AdminSession[] };
export type OneOffDraft = { date: string; start: string; end: string; kind: SessionKind; title: string; place: string | null; link: string | null; cohortIds: string[]; compulsory: boolean; note: string | null };

export type OpdSettings = {
  from: string;
  to: string;
  casesPerVisit: number;
  seats: Record<Weekday, Record<Batch, number>>;
  /** Kept as the server sent them. */
  lateMinutes: number;
  holidays: string[];
  freezeDays: number;
};
export type PlanSeat = { assignmentId: string; studentId: string; name: string; /** A past day: it never changes. */ fixed: boolean; source: "kept" | "new" | "moved" };
export type PlanDay = { date: string; morning: PlanSeat[]; evening: PlanSeat[]; seats: Record<Batch, number> };
export type OpdPlan = {
  status: "none" | "draft" | "published";
  days: PlanDay[];
  /** Students the seats could not cover, with the visits still needed. */
  short: { studentId: string; name: string; visits: number }[];
  /** Students with no batch yet (left out). */
  noBatch: { studentId: string; name: string }[];
};
export type OpdAdmin = { cohortId: string | null; settings: OpdSettings; plan: OpdPlan };
