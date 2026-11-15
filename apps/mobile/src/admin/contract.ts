/**
 * The admin part of the server contract, copied word for word from the
 * server's src/lib/app-api/contract.ts (branch agent/appapi2, commit 9fea713d,
 * section "Admin"). The app's own src/api/contract.ts is an older copy that
 * does not have this section yet; when it is copied again from the server,
 * delete this file and import these types from "@/api/contract" instead.
 */
import type { Page, Scope } from "@/api/contract";

/**
 * POST /play/:game/:action { args } answers this. `kind` is "<game>.<action>"
 * and `data` is the website action's own answer for that kind.
 */
export type PlayResult<T = unknown> = { kind: string; v: 1; data: T };

export type AttentionFlag = "login" | "no-mobile" | "quiet" | "never-seen" | "behind" | "email-failing" | "no-details";

/** One row of the Students table (the website's roster row). */
export type AdminStudentRow = {
  id: string;
  name: string;
  email: string;
  rollNumber: string | null;
  mobileNumber: string | null;
  scope: Scope;
  blocked: boolean;
  expiresAt: string | null;
  /** "locked" | "expired" | "active" | the invite states of src/lib/people/account-status.ts */
  account: string;
  presence: "now" | "today" | "week" | "quiet" | "never";
  lastSeen: string | null;
  cohorts: { id: string; name: string }[];
  minutes7: number;
  activeDays30: number;
  lecturesDone: number;
  lecturesAvailable: number;
  xp: number;
  flags: AttentionFlag[];
};

/** GET /admin/home */
export type AdminHome = {
  v: 1;
  counts: { students: number; activeThisWeek: number; onNow: number; needsLook: number; locked: number; openComplaints: number };
  /** Students that need a look, most flags first (at most 20). */
  needsLook: AdminStudentRow[];
  live: { userId: string; name: string | null; where: string; lessonId: string | null; since: string; watching: boolean }[];
};

/** GET /admin/students?search=&cohort=&flag= (paged) */
export type AdminStudentList = Page<AdminStudentRow> & { total: number; cohorts: { id: string; name: string }[] };

/**
 * GET /admin/students/:id. `detail` is the website's loadStudentDetail answer
 * (src/lib/analytics/activity.ts): visits, lectures and study for 30 days.
 */
export type AdminStudentProfile = { row: AdminStudentRow | null; detail: Record<string, unknown> | null };

/** POST /admin/students/:id/lock */
export type LockBody = { reason?: string };
export type LockResult = { blocked: boolean };

/** POST /admin/messages: a bell notice (and push) to students, optional email. */
export type SendMessageBody = { userIds: string[]; title: string; /** Plain text; paragraphs split by blank lines. */ text: string; alsoEmail?: boolean };
export type SendMessageResult = { created: number; emailed: number; emailFailed: number; batchId: string | null };
/** GET /admin/messages: recent sends with how many opened them. */
export type MessageBatches = { batches: { batchId: string; title: string; sentAt: string; total: number; opened: number; type: string }[]; ready: boolean };

/** POST /admin/doubts/:id/hide */
export type HideBody = { hidden: boolean };

/* ------------------------------------------------------------------------ */
/* Shapes of the website loaders the contract passes through as-is.         */
/* Typed here from their source so the screens can read them.               */
/* ------------------------------------------------------------------------ */

/** `detail` of GET /admin/students/:id: loadStudentDetail (src/lib/analytics/activity.ts). */
export type StudentDetail = {
  profile: { id: string; name: string | null; email: string | null; status: string; created_at: string; mobile_number: string | null; display: string };
  /** Thirty days, oldest first, India days. */
  daily: { day: string; min: number }[];
  lectures: { id: string; title: string; week: number | null; watchedMin: number; done: boolean; at: string | null }[];
  recent: { at: string; what: string; min: number }[];
  learn: { xp: number; level: { title: string }; streak: number; best: number; accuracy: number | null; answered: number; badges: number; mastery: number; confusions: string[]; lessons: number } | null;
  sims: { id: string; status: string; started_at: string; ended_at: string | null }[];
  totals: { min30: number; activeDays: number };
};

/** One row of loadActivity (src/lib/analytics/activity.ts). */
export type StudentActivity = {
  id: string;
  name: string;
  email: string;
  status: string;
  min7: number;
  min30: number;
  activeDays30: number;
  lastSeen: string | null;
  lecturesDone: number;
  lecturesStarted: number;
  watchMin: number;
  xp: number;
  level: string;
  streak: number;
  accuracy: number | null;
  mastery: number;
  practice: number;
  score: number;
};

/** `data` of GET /admin/activity (kind "admin.activity"): loadActivity() plus `live`. */
export type ActivityData = {
  rows: StudentActivity[];
  /** Weekday (Monday first) by India hour, minutes. */
  heat: number[][];
  pages: { label: string; min: number }[];
  totals: { students: number; active7: number; activeNow: number; hours30: number; lecturesDone: number };
  live: AdminHome["live"];
};
