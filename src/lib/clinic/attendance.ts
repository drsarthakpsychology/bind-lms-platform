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
  onLeave: boolean;
  lateMinutes: number;
};

/** One student's place in one session. */
export function myStatus(i: MyStatusInput): { status: ClinicMyStatus; late: boolean; minutes: number | null } {
  const late = isLate(i.att?.in_at ?? null, i.session, i.lateMinutes);
  const minutes = minutesPresent(i.att?.in_at ?? null, i.att?.out_at ?? null);
  if (i.session.status === "cancelled") return { status: "cancelled", late: false, minutes: null };
  const { endsAt, closesAt } = sessionTimes(i.session);
  if (i.att?.in_at) {
    if (i.att.out_at) return { status: late ? "late" : "present", late, minutes };
    // No scan out: flagged once scanning has closed (never an invented out time).
    return { status: i.now > closesAt ? "no_scan_out" : "in", late, minutes: null };
  }
  if (i.onLeave) return { status: "on_leave", late: false, minutes: null };
  if (!i.required) return { status: "not_required", late: false, minutes: null };
  return { status: i.now > endsAt ? "absent" : "upcoming", late: false, minutes: null };
}

const ATTENDED: ClinicMyStatus[] = ["present", "late", "in", "no_scan_out"];

/** Counts over the sessions that are required (or were attended), up to now. The percentage is over required sessions only. */
export function summarize(list: readonly { status: ClinicMyStatus; required: boolean; minutes: number | null }[]): ClinicAttendanceSummary {
  let required = 0;
  let attended = 0;
  let late = 0;
  let onLeave = 0;
  let absent = 0;
  let noScanOut = 0;
  let minutes = 0;
  let requiredAttended = 0;
  for (const x of list) {
    if (x.status === "cancelled" || x.status === "upcoming") continue;
    const went = ATTENDED.includes(x.status);
    if (!x.required && !went && x.status !== "on_leave") continue;
    if (x.required) required++;
    if (went) attended++;
    if (went && x.required) requiredAttended++;
    if (x.status === "late") late++;
    if (x.status === "on_leave") onLeave++;
    if (x.status === "absent") absent++;
    if (x.status === "no_scan_out") noScanOut++;
    minutes += x.minutes ?? 0;
  }
  const due = required - onLeave;
  const percent = due > 0 ? Math.min(100, Math.round((Math.min(requiredAttended, due) / due) * 100)) : null;
  return { required, attended, late, onLeave, absent, noScanOut, percent, minutes };
}
