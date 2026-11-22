import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/test-mode/server", () => ({ currentTestScope: async () => null }));

import { cohortAverage, countSession, MARK_LABEL, markOf, summarize, type CountInput } from "./attendance";
import { mySessions, summaryOf, trackerRow, type Bundle } from "./data";
import { isHiddenAccount } from "@/lib/people/hidden";
import { DEFAULT_OPD_SETTINGS, type AssignmentRow, type AttendanceRow, type LeaveRow, type SessionRow } from "./types";

/**
 * The one shared count. Owner's rule: a session on APPROVED leave is not
 * counted at all (neither top nor bottom of the percentage), shows "On leave"
 * and adds to the leave count. Approved early leave never lowers the percent
 * and is never an absence. A missed assigned OPD day with no approved leave
 * counts as a leave.
 */

const C = "c0c0c0c0-0000-4000-8000-000000000001";
const U = "11111111-1111-4111-8111-111111111111";
const at = (date: string, hm: string) => new Date(Date.parse(`${date}T${hm}:00+05:30`)).toISOString();

const sess = (id: string, date: string, over: Partial<SessionRow> = {}): SessionRow => ({
  id, cohort_ids: [C], slot_id: null, date, start_time: "08:00:00", end_time: "10:00:00", kind: "class", title: `Class ${id}`,
  place: null, online_link: null, compulsory: true, status: "scheduled", origin: "one_off", note: null, moved_from: null, ...over,
});
const att = (session_id: string, inHm: string | null, outHm: string | null, date: string): AttendanceRow => ({
  id: `a-${session_id}`, session_id, user_id: U, in_at: inHm ? at(date, inHm) : null, out_at: outHm ? at(date, outHm) : null, in_method: "qr", out_method: outHm ? "qr" : null, note: null, marked_by: null,
});
const leave = (over: Partial<LeaveRow>): LeaveRow => ({
  id: `l-${Math.random().toString(36).slice(2)}`, user_id: U, cohort_id: C, kind: "leave", session_ids: [], leave_at: null, reason: "Ill", status: "approved", over_limit: false,
  assignment_id: null, decided_by: null, decided_at: null, decision_note: null, created_at: "2026-11-01T00:00:00Z", ...over,
});
const assign = (id: string, date: string): AssignmentRow => ({ id, cohort_id: C, user_id: U, date, batch: "morning", state: "published", source: "new", published_at: "2026-11-01T00:00:00Z" });

function bundle(p: { sessions: SessionRow[]; att?: AttendanceRow[]; leaves?: LeaveRow[]; assignments?: AssignmentRow[] }): Bundle {
  return {
    cohortId: C, settings: DEFAULT_OPD_SETTINGS(C), sessions: p.sessions, sessionById: new Map(p.sessions.map((s) => [s.id, s])), att: p.att ?? [], leaves: p.leaves ?? [],
    assignments: p.assignments ?? [], logs: [], allowances: [{ user_id: U, cohort_id: C, allowance: 3 }], quotas: [], extras: [], prefs: [],
  };
}

/** Sunday 22 Nov 2026, noon in India: everything before is over. */
const NOW = Date.parse("2026-11-22T12:00:00+05:30");
const run = (b: Bundle) => {
  const list = mySessions(b, U, b.sessions, NOW);
  return { list, by: (id: string) => list.find((s) => s.id === id)!, sum: summaryOf(list) };
};

describe("countSession: one session, one answer", () => {
  const c = (x: Partial<CountInput>) => countSession({ status: "present", required: true, minutes: 60, ...x });
  it("present, late, absent count in the percent", () => {
    expect(c({})).toEqual({ mark: "present", inPercent: true, came: true });
    expect(c({ status: "late", late: true })).toEqual({ mark: "late", inPercent: true, came: true });
    expect(c({ status: "absent", minutes: null })).toEqual({ mark: "absent", inPercent: true, came: false });
  });
  it("on leave is in neither number", () => {
    expect(c({ status: "on_leave", minutes: null })).toEqual({ mark: "on_leave", inPercent: false, came: false });
    expect(c({ status: "on_leave", required: false, minutes: null })).toEqual({ mark: "on_leave", inPercent: false, came: false });
  });
  it("approved early leave is came, never absent, never a missing scan out", () => {
    expect(c({ earlyLeaveAt: "09:00" })).toEqual({ mark: "left_early", inPercent: true, came: true });
    expect(c({ status: "no_scan_out", minutes: null, earlyLeaveAt: "09:00" })?.mark).toBe("left_early");
    expect(c({ status: "late", late: true, earlyLeaveAt: "09:00" })?.mark).toBe("left_early");
  });
  it("cancelled, still to come and not my day do not count", () => {
    expect(c({ status: "cancelled" })).toBeNull();
    expect(c({ status: "upcoming" })).toBeNull();
    expect(c({ status: "not_required", required: false })).toBeNull();
  });
  it("a session joined that was not required is came but not in the percent", () => {
    expect(c({ required: false })).toEqual({ mark: "present", inPercent: false, came: true });
  });
  it("the five words", () => {
    expect(Object.values(MARK_LABEL)).toEqual(["Present", "Late", "On leave", "Absent", "Left early (approved)"]);
    expect(markOf({ status: "in", required: true, minutes: null, late: true })).toBe("late");
  });
});

describe("summarize: the percentage", () => {
  it("leave is left out of top and bottom", () => {
    const s = summarize([
      { status: "present", required: true, minutes: 120 },
      { status: "absent", required: true, minutes: null },
      { status: "on_leave", required: true, minutes: null },
      { status: "on_leave", required: true, minutes: null },
    ]);
    expect(s).toMatchObject({ counted: 2, countedPresent: 1, percent: 50, onLeave: 2, absent: 1, present: 1 });
  });
  it("leave on a session that was not required never takes from the percent (the old bug)", () => {
    // Before: due = required (2) - onLeave (1) = 1, so 2 attended of 2 required showed as 100% of 1, and 1 of 2 showed as 100%.
    const s = summarize([
      { status: "present", required: true, minutes: 60 },
      { status: "absent", required: true, minutes: null },
      { status: "on_leave", required: false, minutes: null },
    ]);
    expect(s.percent).toBe(50);
    expect(s.onLeave).toBe(1);
  });
  it("all on leave is no percent yet, not 0 and not 100", () => {
    expect(summarize([{ status: "on_leave", required: true, minutes: null }]).percent).toBeNull();
  });
  it("approved early leave keeps 100%", () => {
    const s = summarize([
      { status: "present", required: true, minutes: 120 },
      { status: "no_scan_out", required: true, minutes: null, earlyLeaveAt: "09:00" },
    ]);
    expect(s).toMatchObject({ percent: 100, leftEarly: 1, noScanOut: 0, absent: 0 });
  });
  it("a missing scan out without permission is still came, and flagged", () => {
    expect(summarize([{ status: "no_scan_out", required: true, minutes: null }])).toMatchObject({ percent: 100, noScanOut: 1 });
  });
  it("cancelled and upcoming change nothing", () => {
    const s = summarize([
      { status: "present", required: true, minutes: 60 },
      { status: "cancelled", required: true, minutes: null },
      { status: "upcoming", required: true, minutes: null },
    ]);
    expect(s).toMatchObject({ percent: 100, counted: 1, required: 1 });
  });
});

describe("mySessions + summaryOf: real situations", () => {
  const d1 = "2026-11-16";
  const d2 = "2026-11-17";
  it("leave approved after the session: on leave, not absent", () => {
    const b = bundle({ sessions: [sess("s1", d1), sess("s2", d2)], att: [att("s2", "07:55", "10:00", d2)], leaves: [leave({ session_ids: ["s1"], created_at: at(d2, "12:00"), decided_at: at(d2, "15:00") })] });
    const r = run(b);
    expect(r.by("s1").my.status).toBe("on_leave");
    expect(r.by("s1").my.mark).toBe("on_leave");
    expect(r.sum).toMatchObject({ percent: 100, counted: 1, onLeave: 1, absent: 0 });
  });
  it("leave rejected: absent", () => {
    const r = run(bundle({ sessions: [sess("s1", d1), sess("s2", d2)], att: [att("s2", "07:55", "10:00", d2)], leaves: [leave({ session_ids: ["s1"], status: "rejected" })] }));
    expect(r.by("s1").my.mark).toBe("absent");
    expect(r.sum).toMatchObject({ percent: 50, absent: 1, onLeave: 0 });
  });
  it("leave still pending (at the session and now): absent until approved", () => {
    const r = run(bundle({ sessions: [sess("s1", d1)], leaves: [leave({ session_ids: ["s1"], status: "pending" })] }));
    expect(r.by("s1").my.status).toBe("absent");
    expect(r.sum.percent).toBe(0);
  });
  it("leave withdrawn: absent", () => {
    const r = run(bundle({ sessions: [sess("s1", d1)], leaves: [leave({ session_ids: ["s1"], status: "cancelled" })] }));
    expect(r.by("s1").my.mark).toBe("absent");
  });
  it("leave for part of a day: only the sessions it names", () => {
    const b = bundle({
      sessions: [sess("am", d1), sess("pm", d1, { start_time: "14:00:00", end_time: "16:00:00" })],
      att: [att("pm", "13:55", "16:00", d1)],
      leaves: [leave({ session_ids: ["am"] })],
    });
    const r = run(b);
    expect(r.by("am").my.mark).toBe("on_leave");
    expect(r.by("pm").my.mark).toBe("present");
    expect(r.sum).toMatchObject({ percent: 100, counted: 1, onLeave: 1 });
  });
  it("approved leave wins over a scan: the session is not counted", () => {
    const r = run(bundle({ sessions: [sess("s1", d1)], att: [att("s1", "08:00", "10:00", d1)], leaves: [leave({ session_ids: ["s1"] })] }));
    expect(r.by("s1").my.status).toBe("on_leave");
    expect(r.by("s1").my.inAt).not.toBeNull(); // the scan is still shown, never deleted
    expect(r.sum.percent).toBeNull();
  });
  it("cancelled session: not counted even with leave asked", () => {
    const r = run(bundle({ sessions: [sess("s1", d1, { status: "cancelled" }), sess("s2", d2)], att: [att("s2", "08:00", "10:00", d2)], leaves: [leave({ session_ids: ["s1"] })] }));
    expect(r.by("s1").my.status).toBe("cancelled");
    expect(r.by("s1").my.mark).toBeNull();
    expect(r.sum).toMatchObject({ percent: 100, counted: 1, onLeave: 0 });
  });
  it("approved early leave: Left early (approved), no absence, no scan out flag", () => {
    const r = run(bundle({ sessions: [sess("s1", d1)], att: [att("s1", "07:58", null, d1)], leaves: [leave({ kind: "early", session_ids: ["s1"], leave_at: "09:00:00" })] }));
    expect(r.by("s1").my.mark).toBe("left_early");
    expect(r.sum).toMatchObject({ percent: 100, leftEarly: 1, noScanOut: 0, absent: 0, onLeave: 0 });
  });
  it("early leave not approved yet and no scan out: came, flagged no scan out", () => {
    const r = run(bundle({ sessions: [sess("s1", d1)], att: [att("s1", "07:58", null, d1)], leaves: [leave({ kind: "early", session_ids: ["s1"], leave_at: "09:00:00", status: "pending" })] }));
    expect(r.by("s1").my.mark).toBe("present");
    expect(r.sum).toMatchObject({ percent: 100, noScanOut: 1 });
  });
  it("missed assigned OPD day with no leave: counted as a leave, not an absence", () => {
    const opd = sess("o1", d1, { kind: "opd_morning", compulsory: false, title: "OPD" });
    const b = bundle({ sessions: [opd, sess("s2", d2)], att: [att("s2", "08:00", "10:00", d2)], assignments: [assign("as1", d1)] });
    const r = run(b);
    expect(r.by("o1").my.status).toBe("on_leave");
    expect(r.by("o1").my.missedOpd).toBe(true);
    expect(r.sum).toMatchObject({ percent: 100, onLeave: 1, absent: 0 });
  });
  it("OPD day with approved leave: just on leave (not a missed day)", () => {
    const opd = sess("o1", d1, { kind: "opd_morning", compulsory: false, title: "OPD" });
    const r = run(bundle({ sessions: [opd], assignments: [assign("as1", d1)], leaves: [leave({ session_ids: ["o1"] })] }));
    expect(r.by("o1").my.status).toBe("on_leave");
    expect(r.by("o1").my.missedOpd).toBe(false);
  });
  it("OPD day not assigned to me: not counted", () => {
    const r = run(bundle({ sessions: [sess("o1", d1, { kind: "opd_morning", compulsory: false })] }));
    expect(r.by("o1").my.mark).toBeNull();
    expect(r.sum.percent).toBeNull();
  });
  it("the trackers row uses the same count", () => {
    const b = bundle({ sessions: [sess("s1", d1), sess("s2", d2)], att: [att("s2", "08:00", "10:00", d2)], leaves: [leave({ session_ids: ["s1"] })] });
    const row = trackerRow(b, { userId: U, name: "A", roll: null }, "2026-11-22", NOW);
    expect(row.attendance).toEqual(run(b).sum);
    expect(row.attendance.percent).toBe(100);
  });
});

describe("test accounts never count", () => {
  it("the cohort average leaves test accounts and students with no percent out", () => {
    expect(cohortAverage([{ percent: 100 }, { percent: 50 }, { percent: 0, isTest: true }, { percent: null }])).toBe(75);
    expect(cohortAverage([{ percent: 10, isTest: true }])).toBeNull();
  });
  it("test and robot accounts are hidden from the cohort's students", () => {
    expect(isHiddenAccount({ is_test: true })).toBe(true);
    expect(isHiddenAccount({ email: "calibration@x.com" })).toBe(true);
    expect(isHiddenAccount({ email: "real.student@gmail.com", is_test: false })).toBe(false);
  });
});
