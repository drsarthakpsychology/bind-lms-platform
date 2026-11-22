import type { ClinicAttendanceSummary, ClinicDirection, ClinicMyStatus, ClinicSession } from "@/lib/app-api/contract";
import { instant } from "./time";
import type { AttendanceRow } from "./types";

/** Scanning opens 30 minutes before start and closes 60 minutes after end. */
export const OPEN_BEFORE_MIN = 30;
export const CLOSE_AFTER_MIN = 60;

export function sessionTimes(s: Pick<ClinicSession, "date" | "start" | "end">) {
  const startsAt = instant(s.date, s.start);
  const endsAt = instant(s.date, s.end);
  return { startsAt, endsAt, opensAt: startsAt - OPEN_BEFORE_MIN * 60_000, closesAt: endsAt + CLOSE_AFTER_MIN * 60_000 };
}

export function isOpen(s: Pick<ClinicSession, "date" | "start" | "end" | "status">, now: number): boolean {
  if (s.status === "cancelled") return false;
  const t = sessionTimes(s);
  return now >= t.opensAt && now <= t.closesAt;
}

export function isLate(inAt: string | null, s: Pick<ClinicSession, "date" | "start">, lateMinutes: number): boolean {
  if (!inAt) return false;
  return Date.parse(inAt) > instant(s.date, s.start) + lateMinutes * 60_000;
}

/** Minutes between in and out; null without both. */
export function minutesPresent(inAt: string | null, outAt: string | null): number | null {
  if (!inAt || !outAt) return null;
  return Math.max(0, Math.round((Date.parse(outAt) - Date.parse(inAt)) / 60_000));
}

export type ScanDecision = { ok: true; direction: ClinicDirection } | { ok: false; code: "bad_request" | "forbidden" | "conflict"; message: string };

/**
 * May this student scan this session now? One scan per direction; out only
 * after in; only while the session is open; only for its cohorts.
 */
export function decideScan(input: {
  session: Pick<ClinicSession, "date" | "start" | "end" | "status" | "cohortIds">;
  now: number;
  memberOf: readonly string[];
  existing: Pick<AttendanceRow, "in_at" | "out_at"> | null;
  direction?: ClinicDirection;
}): ScanDecision {
  const { session, now, existing } = input;
  if (!session.cohortIds.some((c) => input.memberOf.includes(c))) return { ok: false, code: "forbidden", message: "This session is not for your cohort." };
  if (session.status === "cancelled") return { ok: false, code: "conflict", message: "This session was cancelled." };
  if (!isOpen(session, now)) return { ok: false, code: "conflict", message: "Scanning is closed for this session." };
  const direction: ClinicDirection = input.direction ?? (existing?.in_at ? "out" : "in");
  if (direction === "in" && existing?.in_at) return { ok: false, code: "bad_request", message: "You already scanned in." };
  if (direction === "out") {
    if (!existing?.in_at) return { ok: false, code: "bad_request", message: "Scan in first." };
    if (existing.out_at) return { ok: false, code: "bad_request", message: "You already scanned out." };
  }
  return { ok: true, direction };
}

export type MyStatusInput = {
  session: Pick<ClinicSession, "date" | "start" | "end" | "status">;
  now: number;
  required: boolean;
  att: Pick<AttendanceRow, "in_at" | "out_at"> | null;
  /** An APPROVED leave covers this session (pending or rejected ones do not). */
  onLeave: boolean;
  /**
   * An assigned OPD day that was missed with no approved leave (or logged
   * "I was absent"): it is counted as one leave, so here it is "on leave", not absent.
   */
  missedOpdLeave?: boolean;
  lateMinutes: number;
};

/**
 * One student's place in one session. In order: cancelled; approved leave
 * (always "on leave", even with a scan, so it is never counted); scanned;
 * a missed OPD day counted as a leave; not required; absent or still to come.
 */
export function myStatus(i: MyStatusInput): { status: ClinicMyStatus; late: boolean; minutes: number | null } {
  if (i.session.status === "cancelled") return { status: "cancelled", late: false, minutes: null };
  if (i.onLeave) return { status: "on_leave", late: false, minutes: null };
  const late = isLate(i.att?.in_at ?? null, i.session, i.lateMinutes);
  const minutes = minutesPresent(i.att?.in_at ?? null, i.att?.out_at ?? null);
  const { endsAt, closesAt } = sessionTimes(i.session);
  if (i.att?.in_at) {
    if (i.att.out_at) return { status: late ? "late" : "present", late, minutes };
    // No scan out: flagged once scanning has closed (never an invented out time).
    return { status: i.now > closesAt ? "no_scan_out" : "in", late, minutes: null };
  }
  if (i.missedOpdLeave && i.required) return { status: "on_leave", late: false, minutes: null };
  if (!i.required) return { status: "not_required", late: false, minutes: null };
  return { status: i.now > endsAt ? "absent" : "upcoming", late: false, minutes: null };
}

/* ------------------------------------------------- one way of counting */

/**
 * The words people see, everywhere (website, app, admin, student):
 * Present, Late, On leave, Absent, Left early (approved).
 */
export type AttendanceMark = "present" | "late" | "on_leave" | "absent" | "left_early";
export const MARK_LABEL: Record<AttendanceMark, string> = {
  present: "Present",
  late: "Late",
  on_leave: "On leave",
  absent: "Absent",
  left_early: "Left early (approved)",
};

export type CountInput = {
  status: ClinicMyStatus;
  required: boolean;
  minutes: number | null;
  late?: boolean;
  /** Approved "leave early" time for this session, if any. */
  earlyLeaveAt?: string | null;
};

export type SessionCount = {
  mark: AttendanceMark;
  /** Part of the attendance percentage (both the top and the bottom number). */
  inPercent: boolean;
  /** Counts as came (top number) when in the percentage. */
  came: boolean;
};

const CAME: readonly ClinicMyStatus[] = ["present", "late", "in", "no_scan_out"];

/**
 * THE rule for one session, used by every screen and route:
 *   - not counted at all: cancelled, still to come, not this student's day (null);
 *   - On leave (approved, or a missed OPD day counted as a leave): left out of the
 *     percentage completely, adds to the leave count, never an absence;
 *   - Present / Late / Left early (approved): came, in the percentage when required;
 *     approved early leave never lowers the percentage and is never an absence;
 *   - Absent: required, over, no scan, no approved leave (a pending or rejected
 *     leave does not help).
 */
export function countSession(x: CountInput): SessionCount | null {
  if (x.status === "cancelled" || x.status === "upcoming" || x.status === "not_required") return null;
  if (x.status === "on_leave") return { mark: "on_leave", inPercent: false, came: false };
  if (CAME.includes(x.status)) {
    const mark: AttendanceMark = x.earlyLeaveAt ? "left_early" : x.status === "late" || x.late ? "late" : "present";
    return { mark, inPercent: x.required, came: true };
  }
  // absent
  return x.required ? { mark: "absent", inPercent: true, came: false } : null;
}

/** "Present", "Late", "On leave", "Absent", "Left early (approved)", or null when it does not count. */
export function markOf(x: CountInput): AttendanceMark | null {
  return countSession(x)?.mark ?? null;
}

/**
 * The counts and the percentage, from countSession only.
 * percent = came / counted, where counted = required sessions that are over,
 * minus every session on leave. Null when nothing counted yet.
 */
export function summarize(list: readonly CountInput[]): ClinicAttendanceSummary {
  const t = { required: 0, attended: 0, late: 0, onLeave: 0, absent: 0, noScanOut: 0, minutes: 0, counted: 0, countedPresent: 0, leftEarly: 0, present: 0 };
  for (const x of list) {
    const c = countSession(x);
    if (!c) continue;
    if (x.required) t.required++;
    if (c.mark === "on_leave") {
      t.onLeave++;
      continue;
    }
    if (c.came) t.attended++;
    if (c.inPercent) {
      t.counted++;
      if (c.came) t.countedPresent++;
    }
    if (c.mark === "present") t.present++;
    if (c.mark === "late") t.late++;
    if (c.mark === "left_early") t.leftEarly++;
    if (c.mark === "absent") t.absent++;
    // An approved early leave is not a missing scan out.
    if (x.status === "no_scan_out" && c.mark !== "left_early") t.noScanOut++;
    t.minutes += x.minutes ?? 0;
  }
  const percent = t.counted > 0 ? Math.round((t.countedPresent / t.counted) * 100) : null;
  return { ...t, percent };
}

/** The cohort's average percentage: students with a percentage only, test accounts never. */
export function cohortAverage(rows: readonly { percent: number | null; isTest?: boolean | null }[]): number | null {
  const pcts = rows.filter((r) => !r.isTest).map((r) => r.percent).filter((p): p is number => p !== null);
  return pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : null;
}
