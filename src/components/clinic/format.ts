import { localTime } from "@/lib/clinic/time";
import type { ClinicBatch, ClinicKind, ClinicLeaveRequest, ClinicMyStatus, ClinicLeaveStatus } from "@/lib/clinic/types";

/**
 * Plain words for the clinic screens (website, student and admin). Pure, so
 * the wording is tested in one place. Owner text rules: no dashes as
 * punctuation, short words, no meta text.
 */

export const KIND_LABEL: Record<ClinicKind, string> = {
  opd_morning: "OPD morning",
  opd_evening: "OPD evening",
  class: "Class",
  online_class: "Online class",
  early_class: "Early class",
  other: "Other",
};

export const BATCH_LABEL: Record<ClinicBatch, string> = { morning: "Morning", evening: "Evening" };

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/** "08:00" -> "8 am", "17:30" -> "5:30 pm", "12:00" -> "12 pm". */
export function clock(hhmm: string | null | undefined): string {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map((x) => Number(x));
  if (!Number.isFinite(h)) return hhmm;
  const ap = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")} ${ap}` : `${h12} ${ap}`;
}

/** "8 to 10 am", "11 am to 1 pm", "5 to 8 pm". */
export function timeRange(start: string | null | undefined, end: string | null | undefined): string {
  if (!start) return "";
  if (!end) return clock(start);
  const a = clock(start);
  const b = clock(end);
  const ap = (s: string) => s.slice(-2);
  if (ap(a) === ap(b)) return `${a.slice(0, -3)} to ${b}`;
  return `${a} to ${b}`;
}

function parts(date: string): { y: number; m: number; d: number; wd: number } {
  const [y, m, d] = date.split("-").map(Number);
  // Noon UTC: the weekday of a calendar date, whatever the browser's zone.
  const wd = new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
  return { y, m, d, wd };
}

/** "2026-11-18" -> "Wed 18 Nov". */
export function dayShort(date: string): string {
  const { m, d, wd } = parts(date);
  return `${WEEKDAYS_SHORT[wd]} ${d} ${MONTHS[m - 1]}`;
}

/** "2026-11-18" -> "Wednesday 18 Nov". */
export function dayLong(date: string): string {
  const { m, d, wd } = parts(date);
  return `${WEEKDAYS[wd]} ${d} ${MONTHS[m - 1]}`;
}

export function weekdayOf(date: string): number {
  return parts(date).wd;
}

/** Add days to a YYYY-MM-DD date (the server's own date maths). */
export { addDays } from "@/lib/clinic/time";

/** The time of an ISO instant in India time: "8:07 am". */
export function instantClock(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  // Clinic time is India, the same for every viewer.
  return Number.isNaN(t) ? "" : clock(localTime(t));
}

/** "2 h 5 min", "45 min". */
export function duration(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export const STATUS_LABEL: Record<ClinicMyStatus, string> = {
  upcoming: "Not yet",
  in: "In",
  present: "Present",
  late: "Late",
  no_scan_out: "No scan out",
  on_leave: "On leave",
  absent: "Absent",
  cancelled: "Cancelled",
  not_required: "Not your day",
};

export type StatusTone = "ok" | "warn" | "alert" | "info" | "quiet";
export const STATUS_TONE: Record<ClinicMyStatus, StatusTone> = {
  upcoming: "quiet",
  in: "info",
  present: "ok",
  late: "warn",
  no_scan_out: "warn",
  on_leave: "info",
  absent: "alert",
  cancelled: "quiet",
  not_required: "quiet",
};

export const LEAVE_STATUS_LABEL: Record<ClinicLeaveStatus, string> = {
  pending: "Waiting",
  approved: "Approved",
  rejected: "Not approved",
  cancelled: "Withdrawn",
};

/** Letters and digits the code uses (no 0, O, 1, I). */
const CODE_RE = /^[A-HJ-NP-Z2-9]{6}$/;

/** What a student typed, cleaned: capitals, no spaces or dashes; null if it cannot be a code. */
export function cleanCode(input: string): string | null {
  const c = input.toUpperCase().replace(/[\s-]/g, "");
  return CODE_RE.test(c) ? c : null;
}

/** What the camera read: the QR text (vibha-att:1:...), or null for any other QR code. */
export function scanText(raw: string): string | null {
  const t = raw.trim();
  return /^vibha-att:1:[^:\s]+:\d+:[^:\s]+$/.test(t) ? t : null;
}

/** "1 leave", "3 leaves". */
export function leaves(n: number): string {
  return `${n} ${n === 1 ? "leave" : "leaves"}`;
}

/** "1 case", "2 cases". */
export function cases(n: number): string {
  return `${n} ${n === 1 ? "case" : "cases"}`;
}

/** What a request asks for, in a few words. */
export function askLine(r: Pick<ClinicLeaveRequest, "kind" | "cost" | "leaveAt">): string {
  if (r.kind === "early") return `Leave early${r.leaveAt ? ` at ${r.leaveAt.includes("T") ? instantClock(r.leaveAt) : clock(r.leaveAt)}` : ""}`;
  if (r.kind === "missed") return "Missed OPD day";
  return r.cost === 1 ? "1 session" : `${r.cost} sessions`;
}

/** A scan refusal as the screen shows it: a short title, the reason, and whether trying the same press again can help. */
export type ScanFailure = { title: string; body: string };

const SCAN_TITLE: Record<string, string> = {
  not_a_code: "That code did not work",
  code_expired: "That code has changed",
  wrong_cohort: "Not your session",
  not_open_yet: "Not open yet",
  closed: "Marking is closed",
  cancelled: "Session cancelled",
  ticket_expired: "That took too long",
  out_before_in: "Mark IN first",
};

/** Plain words for every way a scan step can be refused (the server's reason and message, never guessed from the text). */
export function scanFailure(r: { error: string; code?: string; reason?: string }): ScanFailure {
  if (r.reason && SCAN_TITLE[r.reason]) return { title: SCAN_TITLE[r.reason]!, body: r.error };
  if (r.code === "rate_limited") return { title: "Too many tries", body: "Wait a minute, then scan again." };
  if (r.code === "unauthenticated") return { title: "Sign in again", body: "You were signed out. Sign in, then scan again." };
  if (r.code === "unavailable") return { title: "Not switched on yet", body: "Attendance is not switched on yet. Ask the admin to mark you." };
  return { title: "That did not work", body: r.error || "Scan the code again." };
}

/** Where the student stands in the session, in one line. */
export function scanStateLine(s: { state: "none" | "in" | "out"; inAt: string | null; outAt: string | null }): string {
  if (s.state === "none") return "You have not marked IN yet.";
  if (s.state === "in") return `You are IN since ${instantClock(s.inAt)}.`;
  return `You marked IN at ${instantClock(s.inAt)} and OUT at ${instantClock(s.outAt)}. Nothing more to do.`;
}
