import type { ClinicBatch, ClinicLeaveBalance, ClinicMySession, ClinicVisit, ReminderPrefs } from "@/lib/app-api/contract";
import { instant, localDate } from "@/lib/clinic/time";

/**
 * Smart reminders: who gets what, and when. Pure (no database, no clock of
 * its own), so every rule is tested in src/lib/reminders/rules.test.ts.
 * Times are clinic local time (India, UTC+05:30).
 *
 *   opd_day       07:00 on an assigned OPD day (earlier if the OPD starts
 *                 before 08:00: one hour before start), until it starts.
 *   session_soon  30 minutes before a session the student must attend
 *                 (compulsory classes, their own OPD days), until it starts.
 *                 Not when on leave or already scanned in.
 *   scan_out      10 minutes after the session ends (or after the approved
 *                 early-leave time), while scanning is still open (60 min).
 *   case_log      20:30, or 30 minutes after the OPD ends if later, until
 *                 23:30, on an OPD day with no case log yet.
 *   leave_low     when leaves left drop to 1 (some used), between 08:00 and
 *                 21:30. Once per allowance (if the admin raises it and it
 *                 drops to 1 again, once more).
 *
 * Each reminder has a `ref`; the runner sends a (user, kind, ref) once.
 */
export type ReminderKind = keyof ReminderPrefs;

export const REMINDER_KINDS: readonly ReminderKind[] = ["opdDay", "sessionSoon", "scanOut", "caseLog", "leaveLow"];

/** The column / log name of each kind. */
export const KIND_DB: Record<ReminderKind, string> = {
  opdDay: "opd_day",
  sessionSoon: "session_soon",
  scanOut: "scan_out",
  caseLog: "case_log",
  leaveLow: "leave_low",
};

export const DEFAULT_REMINDERS: ReminderPrefs = { opdDay: true, sessionSoon: true, scanOut: true, caseLog: true, leaveLow: true };

export type Reminder = { userId: string; kind: ReminderKind; ref: string; title: string; text: string; link: string };

export type StudentFacts = {
  userId: string;
  cohortId: string;
  /** The student's sessions of today (and yesterday is not needed). */
  sessions: readonly ClinicMySession[];
  /** The student's published OPD visits (today's is enough). */
  visits: readonly ClinicVisit[];
  balance: ClinicLeaveBalance;
  /**
   * Sessions that belong to a test account's practice space: they remind only
   * that account (session id to its owner). Real students never get them.
   */
  sandboxOwner?: ReadonlyMap<string, string>;
};

const MIN = 60_000;
export const OPD_DAY_AT = "07:00";
export const SOON_MIN = 30;
export const SCAN_OUT_AFTER_MIN = 10;
export const SCAN_OUT_UNTIL_MIN = 60;
export const CASE_LOG_AT = "20:30";
export const CASE_LOG_UNTIL = "23:30";
export const LEAVE_LOW_FROM = "08:00";
export const LEAVE_LOW_UNTIL = "21:30";

export const SCHEDULE_LINK = "/clinic";
export const OPD_LINK = "/opd";
export const LEAVE_LINK = "/leave";

/** "17:00" to "5", "17:30" to "5:30", "08:00" to "8". */
export function clock(t: string): string {
  const [h, m] = t.slice(0, 5).split(":").map(Number);
  const h12 = (h ?? 0) % 12 === 0 ? 12 : (h ?? 0) % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")}` : String(h12);
}

/** "8 am", "5:30 pm". */
export function clockAmPm(t: string): string {
  const h = Number(t.slice(0, 2));
  return `${clock(t)} ${h < 12 ? "am" : "pm"}`;
}

const batchWord = (b: ClinicBatch) => (b === "morning" ? "morning" : "evening");

/** Is `now` inside [from, until)? */
const within = (now: number, from: number, until: number) => now >= from && now < until;

function visible(s: { id: string }, f: StudentFacts): boolean {
  const owner = f.sandboxOwner?.get(s.id);
  return owner === undefined || owner === f.userId;
}

/** Every reminder this student is due right now (before the once-only check and their switches). */
export function dueFor(f: StudentFacts, now: number): Reminder[] {
  const out: Reminder[] = [];
  const today = localDate(now);
  const sessions = f.sessions.filter((s) => s.date === today && s.status === "scheduled" && visible(s, f));

  // OPD today.
  for (const v of f.visits) {
    if (v.date !== today || v.state !== "today") continue;
    const s = v.sessionId ? sessions.find((x) => x.id === v.sessionId) : null;
    if (v.sessionId && !s) continue; // cancelled, or someone else's practice session
    const start = v.start ? instant(today, v.start) : null;
    const at = Math.min(instant(today, OPD_DAY_AT), start !== null ? start - 60 * MIN : Infinity);
    const until = start ?? instant(today, "12:00");
    if (within(now, at, until)) {
      const times = v.start && v.end ? ` ${clock(v.start)} to ${clock(v.end)}` : "";
      out.push({
        userId: f.userId,
        kind: "opdDay",
        ref: v.assignmentId,
        title: `OPD today, ${batchWord(v.batch)}${times}`,
        text: s?.place ? `At ${s.place}. Scan in when you arrive.` : "Scan in when you arrive.",
        link: SCHEDULE_LINK,
      });
    }
  }

  // 30 minutes before a session they must attend.
  for (const s of sessions) {
    if (!s.required || s.my.leaveId || s.my.inAt || s.my.status === "on_leave") continue;
    const start = instant(s.date, s.start);
    if (!within(now, start - SOON_MIN * MIN, start)) continue;
    const left = Math.max(5, Math.round((start - now) / (5 * MIN)) * 5);
    const where = s.onlineLink ? "Online. The link is on your schedule." : s.place ? `At ${s.place}.` : "";
    out.push({
      userId: f.userId,
      kind: "sessionSoon",
      ref: s.id,
      title: `${s.title} in ${left} minutes`,
      text: `Starts at ${clockAmPm(s.start)}.${where ? ` ${where}` : ""}`,
      link: SCHEDULE_LINK,
    });
  }

  // Scanned in, never scanned out.
  for (const s of sessions) {
    if (!s.my.inAt || s.my.outAt) continue;
    const end = instant(s.date, s.my.earlyLeaveAt && s.my.earlyLeaveAt < s.end ? s.my.earlyLeaveAt : s.end);
    const close = instant(s.date, s.end) + SCAN_OUT_UNTIL_MIN * MIN;
    if (!within(now, end + SCAN_OUT_AFTER_MIN * MIN, close)) continue;
    out.push({
      userId: f.userId,
      kind: "scanOut",
      ref: s.id,
      title: "You forgot to scan out",
      text: `Scan out of ${s.title} now, or tell the admin when you left.`,
      link: SCHEDULE_LINK,
    });
  }

  // The evening after an OPD visit, no case log yet.
  for (const v of f.visits) {
    if (v.date !== today || v.state !== "today" || v.log) continue;
    if (v.sessionId && !sessions.some((x) => x.id === v.sessionId)) continue;
    const s = v.sessionId ? sessions.find((x) => x.id === v.sessionId) : null;
    if (s?.my.status === "on_leave") continue;
    const at = Math.max(instant(today, CASE_LOG_AT), v.end ? instant(today, v.end) + 30 * MIN : 0);
    if (!within(now, at, instant(today, CASE_LOG_UNTIL))) continue;
    out.push({
      userId: f.userId,
      kind: "caseLog",
      ref: v.assignmentId,
      title: "Log your cases",
      text: "How many cases did you take at OPD today? If you could not go, mark that you were absent.",
      link: OPD_LINK,
    });
  }

  // Only 1 leave left.
  const b = f.balance;
  if (b.left === 1 && b.used >= 1 && within(now, instant(today, LEAVE_LOW_FROM), instant(today, LEAVE_LOW_UNTIL))) {
    out.push({
      userId: f.userId,
      kind: "leaveLow",
      ref: `${f.cohortId}:${b.allowance}`,
      title: "Only 1 leave left",
      text: `You have used ${b.used} of your ${b.allowance} leaves.`,
      link: LEAVE_LINK,
    });
  }
  return out;
}

/** Drops the kinds the student turned off. People with no saved choice get every kind. */
export function allowed(list: readonly Reminder[], prefs: ReadonlyMap<string, ReminderPrefs>): Reminder[] {
  return list.filter((r) => (prefs.get(r.userId) ?? DEFAULT_REMINDERS)[r.kind] !== false);
}

/** The once-only key. */
export const keyOf = (r: Pick<Reminder, "userId" | "kind" | "ref">) => `${r.userId}|${KIND_DB[r.kind]}|${r.ref}`;
