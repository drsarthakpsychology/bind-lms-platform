/**
 * Plain helpers for the schedule, attendance, leave and OPD screens: words for
 * times and kinds, India-time dates, the scanned code, the code window, and
 * the lines students read. No React here, so it is all tested directly.
 */
import { ApiFailure } from "@/api/errors";
import type { AttendState, Batch, ClinicSession, LeaveStatus, OpdVisitStatus, RosterState, SessionKind, Weekday } from "./contract";
import { WEEKDAYS } from "./contract";

const IST_MS = 5.5 * 3600_000;

/** Today in India time, "YYYY-MM-DD". */
export function todayIST(now = Date.now()): string {
  return new Date(now + IST_MS).toISOString().slice(0, 10);
}

/** A date moved by whole days ("2026-11-16" + 1 = "2026-11-17"). */
export function addDays(date: string, days: number): string {
  const t = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(t)) return date;
  return new Date(t + days * 86400_000).toISOString().slice(0, 10);
}

/** The weekday of a date. */
export function weekdayOf(date: string): Weekday {
  const d = new Date(`${date}T00:00:00Z`).getUTCDay();
  return WEEKDAYS[(d + 6) % 7] ?? "mon";
}

/** Monday of the week the date is in. */
export function mondayOf(date: string): string {
  return addDays(date, -WEEKDAYS.indexOf(weekdayOf(date)));
}

/** The seven dates of the week starting `monday`. */
export function weekDates(monday: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

const DAY_SHORT: Record<Weekday, string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
const DAY_LONG: Record<Weekday, string> = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const dayShort = (w: Weekday) => DAY_SHORT[w];
export const dayLong = (w: Weekday) => DAY_LONG[w];

/** "Mon 16 Nov", or "Monday 16 November" when long. */
export function dateLabel(date: string, long = false): string {
  const [, m, d] = date.split("-").map(Number);
  if (!m || !d) return date;
  const month = MONTHS[m - 1] ?? "";
  const w = weekdayOf(date);
  return long ? `${DAY_LONG[w]} ${d} ${month}` : `${DAY_SHORT[w]} ${d} ${month.slice(0, 3)}`;
}

/** "Today", "Tomorrow", "Yesterday" or the short date. */
export function relDay(date: string, today: string): string {
  if (date === today) return "Today";
  if (date === addDays(today, 1)) return "Tomorrow";
  if (date === addDays(today, -1)) return "Yesterday";
  return dateLabel(date);
}

function parts(t: string): { h: number; m: number } | null {
  const x = /^(\d{1,2}):(\d{2})/.exec(t ?? "");
  if (!x) return null;
  return { h: Number(x[1]), m: Number(x[2]) };
}

/** Minutes after midnight, or NaN. */
export function minutesOf(t: string): number {
  const p = parts(t);
  return p ? p.h * 60 + p.m : NaN;
}

/** "17:00" is "5 pm", "08:30" is "8:30 am", "12:00" is "12 noon". */
export function timeLabel(t: string, withHalf = true): string {
  const p = parts(t);
  if (!p) return t;
  if (p.h === 12 && p.m === 0) return "12 noon";
  const h12 = p.h % 12 === 0 ? 12 : p.h % 12;
  const half = p.h < 12 ? "am" : "pm";
  const mm = p.m ? `:${String(p.m).padStart(2, "0")}` : "";
  return withHalf ? `${h12}${mm} ${half}` : `${h12}${mm}`;
}

/** "5 to 8 pm" when both are in the same half of the day, else "10 am to 1 pm". */
export function rangeLabel(start: string, end: string): string {
  const a = parts(start);
  const b = parts(end);
  if (!a || !b) return `${start} to ${end}`;
  const sameHalf = a.h < 12 === b.h < 12 && !(a.h === 12 && a.m === 0) && !(b.h === 12 && b.m === 0);
  return sameHalf ? `${timeLabel(start, false)} to ${timeLabel(end)}` : `${timeLabel(start)} to ${timeLabel(end)}`;
}

export const BATCH_NAME: Record<Batch, string> = { morning: "Morning", evening: "Evening" };

/** "Today is your OPD day, evening 5 to 8". */
export function opdLine(opd: { batch: Batch; start: string; end: string }): string {
  return `Today is your OPD day, ${opd.batch} ${rangeLabel(opd.start, opd.end).replace(/ (am|pm)$/, "")}`;
}

export const KIND_NAME: Record<SessionKind, string> = {
  opd_morning: "OPD morning",
  opd_evening: "OPD evening",
  class: "Class",
  online: "Online class",
  early: "Early class",
  other: "Session",
};
export const KINDS: SessionKind[] = ["class", "online", "early", "opd_morning", "opd_evening", "other"];
export const isOpd = (k: SessionKind) => k === "opd_morning" || k === "opd_evening";

/** What a session shows as its title: the admin's title, or the kind. */
export function sessionTitle(s: Pick<ClinicSession, "title" | "kind">): string {
  return s.title?.trim() || KIND_NAME[s.kind] || "Session";
}

/** One line under a session's title: time and place, or "Online". */
export function sessionMeta(s: Pick<ClinicSession, "start" | "end" | "place" | "link" | "kind">): string {
  const where = s.place || (s.link || s.kind === "online" ? "Online" : "");
  return where ? `${rangeLabel(s.start, s.end)} · ${where}` : rangeLabel(s.start, s.end);
}

/** A clock time from an ISO moment, in India time ("5:04 pm"). */
export function clockOf(iso: string | null | undefined): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const d = new Date(t + IST_MS);
  return timeLabel(`${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`);
}

/** The words for a student's state in a session. */
export function stateWord(s: AttendState, late = false): string {
  switch (s) {
    case "upcoming":
      return "Later";
    case "open":
      return "Scan in";
    case "in":
      return late ? "In, late" : "In";
    case "done":
      return late ? "Present, late" : "Present";
    case "no_out":
      return "No scan out";
    case "missed":
      return "Missed";
    case "leave":
      return "On leave";
    case "cancelled":
      return "Cancelled";
  }
}

export const ROSTER_WORD: Record<RosterState, string> = { in: "In", out: "Left", missing: "Not here", leave: "On leave", no_out: "No scan out" };
export const LEAVE_WORD: Record<LeaveStatus, string> = { pending: "Waiting", approved: "Approved", rejected: "Not approved", cancelled: "Cancelled" };
export const VISIT_WORD: Record<OpdVisitStatus, string> = { upcoming: "Coming up", today: "Today", to_log: "Log your cases", logged: "Logged", absent: "Absent", leave: "On leave" };

/* ------------------------------------------------------------ the code */

/** Letters and digits a person can type without mixing them up. */
export const CODE_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** What was typed, cleaned: capitals, no spaces or dashes; O read as 0 is not guessed. */
export function cleanCode(s: string): string {
  return (s ?? "").toUpperCase().replace(/[\s-]+/g, "").slice(0, 6);
}

export const isCode = (s: string) => /^[A-Z0-9]{6}$/.test(s);

/**
 * What to send for a scan. Six letters and digits (typed, or a QR that holds
 * only the code) go as `code`; anything else the camera read goes as `qr`
 * for the server to check.
 */
export function scanBody(raw: string, typed = false): { qr?: string; code?: string } | null {
  const t = (raw ?? "").trim();
  if (!t) return null;
  const c = cleanCode(t);
  if (typed) return isCode(c) ? { code: c } : null;
  if (t.length <= 8 && isCode(c)) return { code: c };
  return t.length > 512 ? null : { qr: t };
}

/** Plain words for every scan refusal. */
export function scanError(e: unknown): { title: string; body: string } {
  const code = e instanceof ApiFailure ? e.code : "";
  const msg = e instanceof ApiFailure ? e.message : "";
  switch (code as string) {
    case "code_expired":
      return { title: "That code has changed", body: "The code changes every 30 seconds. Scan the one on the screen now." };
    case "not_your_session":
      return { title: "Not your session", body: "This code is for a session you are not in. Check you are in the right room." };
    case "already_scanned":
      return { title: "Already scanned", body: msg || "You have already scanned for this session." };
    case "session_closed":
      return { title: "Scanning is closed", body: msg || "This session is not open for scanning now. Ask the admin to mark you." };
    case "bad_code":
      return { title: "That is not an attendance code", body: "Scan the code on the admin's screen, or type the 6 letters under it." };
    case "network":
      return { title: "No internet", body: "Connect and scan again. The code changes every 30 seconds." };
    default:
      return { title: "That did not work", body: msg || "Try again, or type the 6 letters under the code." };
  }
}

/** Seconds left in the code's window, by the server's clock (`skew` = server minus phone). */
export function secondsLeft(windowEndsAt: string, now: number, skew: number): number {
  const end = Date.parse(windowEndsAt);
  if (!Number.isFinite(end)) return 0;
  return Math.max(0, Math.ceil((end - (now + skew)) / 1000));
}

/** Server time minus phone time, from an answer's `serverNow`. */
export function skewOf(serverNow: string, phoneNow: number): number {
  const s = Date.parse(serverNow);
  return Number.isFinite(s) ? s - phoneNow : 0;
}

/* ------------------------------------------------------ numbers, lines */

/** Whole percent, or null when there is nothing to count yet. */
export function pct(part: number, total: number): number | null {
  if (!total || total < 0) return null;
  return Math.max(0, Math.min(100, Math.round((part / total) * 100)));
}

/** "2 leaves left", "1 leave left", "No leaves left". */
export function leavesLine(left: number): string {
  if (left <= 0) return "No leaves left";
  return `${left} leave${left === 1 ? "" : "s"} left`;
}

/** "5 of 8 cases done". */
export function casesLine(done: number, total: number): string {
  return `${done} of ${total} case${total === 1 ? "" : "s"} done`;
}

/** Visits still needed for the cases left. */
export function visitsNeeded(total: number, done: number, perVisit: number): number {
  const left = Math.max(0, total - done);
  return perVisit > 0 ? Math.ceil(left / perVisit) : 0;
}

/** A clock time typed by the admin ("5pm", "17", "5:30 pm", "17:30") as "HH:MM", or null. */
export function parseClock(s: string): string | null {
  const t = (s ?? "").trim().toLowerCase().replace(/\s+/g, "").replace(/\./g, ":");
  const x = /^(\d{1,2})(?::(\d{2}))?(am|pm)?$/.exec(t);
  if (!x) return null;
  let h = Number(x[1]);
  const m = Number(x[2] ?? 0);
  if (m > 59) return null;
  if (x[3]) {
    if (h < 1 || h > 12) return null;
    if (x[3] === "pm" && h !== 12) h += 12;
    if (x[3] === "am" && h === 12) h = 0;
  }
  if (h > 23) return null;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** "YYYY-MM-DD" that is a real date. */
export function isDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s ?? "")) return false;
  const t = Date.parse(`${s}T00:00:00Z`);
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === s;
}

/** Sessions sorted by date and start. */
export function byTime<T extends { date: string; start: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (a.date === b.date ? minutesOf(a.start) - minutesOf(b.start) : a.date < b.date ? -1 : 1));
}

/** Can a student still ask to leave this session early? Only today's or later, not cancelled. */
export function canLeaveEarly(s: Pick<ClinicSession, "date" | "status">, today: string): boolean {
  return s.status !== "cancelled" && s.date >= today;
}
