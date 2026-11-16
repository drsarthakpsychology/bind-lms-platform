import type { ClinicLeaveBalance, ClinicLeaveRequest, ClinicSession } from "@/lib/app-api/contract";
import { hhmm } from "./time";
import type { LeaveRow } from "./types";

/**
 * Leave accounting: one session missed = one leave. Early leave is free. A
 * missed assigned OPD day counts as one leave. Asking with no leaves left
 * still works; the request is marked over the limit and the admin decides.
 */
export function leaveCost(r: Pick<LeaveRow, "kind" | "session_ids">): number {
  if (r.kind === "early") return 0;
  if (r.kind === "missed") return 1;
  return r.session_ids.length;
}

export function balance(allowance: number, requests: readonly Pick<LeaveRow, "kind" | "session_ids" | "status">[]): ClinicLeaveBalance {
  let used = 0;
  let pending = 0;
  for (const r of requests) {
    if (r.status === "approved") used += leaveCost(r);
    else if (r.status === "pending") pending += leaveCost(r);
  }
  return { allowance, used, pending, left: Math.max(0, allowance - used) };
}

/** Would `cost` more leaves go past the allowance (counting the ones already asked for)? */
export function overLimit(b: ClinicLeaveBalance, cost: number): boolean {
  return cost > 0 && b.used + b.pending + cost > b.allowance;
}

/** Approving this request now would go past the allowance. */
export function overLimitOnApprove(b: ClinicLeaveBalance, r: Pick<LeaveRow, "kind" | "session_ids" | "status">): boolean {
  const cost = leaveCost(r);
  return cost > 0 && b.used + cost > b.allowance;
}

/** Session id to the approved leave that covers it. */
export function approvedLeaveMap(requests: readonly LeaveRow[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const r of requests) if (r.status === "approved" && r.kind === "leave") for (const s of r.session_ids) out.set(s, r.id);
  return out;
}

/** Session id to the approved early-leave time. */
export function earlyLeaveMap(requests: readonly LeaveRow[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const r of requests) if (r.status === "approved" && r.kind === "early" && r.leave_at && r.session_ids[0]) out.set(r.session_ids[0], hhmm(r.leave_at));
  return out;
}

/** Sessions already in a pending or approved request (asked twice is refused). */
export function sessionsTaken(requests: readonly LeaveRow[], kind: "leave" | "early"): Set<string> {
  const out = new Set<string>();
  for (const r of requests) if (r.kind === kind && (r.status === "pending" || r.status === "approved")) for (const s of r.session_ids) out.add(s);
  return out;
}

export type LeaveCheck = { ok: true } | { ok: false; message: string };

/** The sessions picked for leave: real, of the student's cohort, scheduled, not over yet, not asked already. */
export function checkLeaveSessions(input: {
  ids: readonly string[];
  sessions: ReadonlyMap<string, Pick<ClinicSession, "id" | "cohortIds" | "status" | "date" | "end">>;
  cohortId: string;
  taken: ReadonlySet<string>;
  now: number;
  endsAt: (s: Pick<ClinicSession, "date" | "end">) => number;
}): LeaveCheck {
  if (!input.ids.length) return { ok: false, message: "Pick at least one session." };
  if (new Set(input.ids).size !== input.ids.length) return { ok: false, message: "A session is picked twice." };
  for (const id of input.ids) {
    const s = input.sessions.get(id);
    if (!s || !s.cohortIds.includes(input.cohortId)) return { ok: false, message: "One of those sessions is not on your schedule." };
    if (s.status === "cancelled") return { ok: false, message: "One of those sessions was cancelled." };
    if (input.endsAt(s) <= input.now) return { ok: false, message: "One of those sessions is already over." };
    if (input.taken.has(id)) return { ok: false, message: "You already asked for leave for one of those sessions." };
  }
  return { ok: true };
}

export function toLeaveRequest(r: LeaveRow, sessions: ReadonlyMap<string, Pick<ClinicSession, "id" | "date" | "start" | "title">>): ClinicLeaveRequest {
  return {
    id: r.id,
    userId: r.user_id,
    cohortId: r.cohort_id,
    kind: r.kind,
    sessions: r.session_ids.map((id) => {
      const s = sessions.get(id);
      return { id, date: s?.date ?? "", start: s?.start ?? "", title: s?.title ?? "Session" };
    }),
    leaveAt: r.leave_at ? hhmm(r.leave_at) : null,
    reason: r.reason,
    status: r.status,
    overLimit: r.over_limit,
    cost: leaveCost(r),
    decidedAt: r.decided_at,
    decisionNote: r.decision_note,
    createdAt: r.created_at,
  };
}
