import type { ClinicQuota, ClinicVisit } from "@/lib/app-api/contract";
import type { AssignmentRow, CaseLogRow, ExtraRow } from "./types";

/**
 * Case tallies and OPD visit states.
 *
 * A visit (published OPD day) is, in order:
 *   on_leave  approved leave covers that day's OPD session;
 *   absent    the student logged "I was absent" (counts as a leave);
 *   done      a case log was sent;
 *   missed    the day is over, no scan in and no log (counts as a leave);
 *   due       the day is over, scanned in, no log yet;
 *   today / upcoming.
 */
export type VisitFacts = {
  assignment: Pick<AssignmentRow, "id" | "date" | "batch">;
  today: string;
  log: Pick<CaseLogRow, "cases" | "absent" | "note"> | null;
  /** Scanned in on that day's OPD session. */
  attended: boolean;
  onLeave: boolean;
  /** The day's OPD session (null when none was made or it is cancelled). */
  session: { id: string; start: string; end: string; cancelled: boolean } | null;
};

export function visitState(f: VisitFacts): ClinicVisit["state"] {
  if (f.onLeave) return "on_leave";
  if (f.log?.absent) return "absent";
  if (f.log) return "done";
  if (f.assignment.date > f.today) return "upcoming";
  if (f.assignment.date === f.today) return "today";
  if (f.session?.cancelled) return "on_leave";
  if (f.attended) return "due";
  // No session made for that day: nothing to scan, so the visit waits for its log.
  return f.session ? "missed" : "due";
}

export function toVisit(f: VisitFacts): ClinicVisit {
  return {
    assignmentId: f.assignment.id,
    date: f.assignment.date,
    batch: f.assignment.batch,
    start: f.session?.start ?? null,
    end: f.session?.end ?? null,
    sessionId: f.session?.id ?? null,
    state: visitState(f),
    log: f.log ? { cases: f.log.cases, absent: f.log.absent, note: f.log.note } : null,
  };
}

/** Visits that count as a used leave (missed or logged absent, never with approved leave). */
export function countsAsLeave(state: ClinicVisit["state"]): boolean {
  return state === "missed" || state === "absent";
}

/**
 * The quota. done = cases logged, plus `casesPerVisit` for each attended past
 * visit still waiting for its log (so "Generate again" does not plan it twice).
 */
export function quotaOf(input: {
  base: number;
  extras: readonly Pick<ExtraRow, "count" | "note" | "created_at">[];
  visits: readonly ClinicVisit[];
  casesPerVisit: number;
  /** Assignment ids the student scanned in on. */
  attended: ReadonlySet<string>;
}): ClinicQuota {
  const extras = input.extras.map((e) => ({ count: e.count, note: e.note, at: e.created_at }));
  const total = Math.max(0, input.base + extras.reduce((n, e) => n + e.count, 0));
  let done = 0;
  for (const v of input.visits) {
    if (v.log && !v.log.absent) done += v.log.cases;
    else if (!v.log && v.state === "due" && input.attended.has(v.assignmentId)) done += input.casesPerVisit;
  }
  return { base: input.base, extras, total, done, pending: Math.max(0, total - done) };
}

export function visitTally(visits: readonly ClinicVisit[]): { planned: number; done: number; absent: number; missed: number; due: number } {
  const t = { planned: visits.length, done: 0, absent: 0, missed: 0, due: 0 };
  for (const v of visits) {
    if (v.state === "done") t.done++;
    else if (v.state === "absent") t.absent++;
    else if (v.state === "missed") t.missed++;
    else if (v.state === "due") t.due++;
  }
  return t;
}
