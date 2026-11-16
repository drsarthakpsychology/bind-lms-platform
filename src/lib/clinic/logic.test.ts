import { describe, expect, it } from "vitest";
import { addDays, dateRange, hhmm, instant, isDate, localDate, localTime, mondayOf, weekday } from "./time";
import { batchOfKind, expandTimetable, toSession } from "./timetable";
import { CODE_RE, codeFor, newSecret, parseQr, showCode, tokenFor, verifyCode, verifyToken, WINDOW_MS, windowOf } from "./qr";
import { decideScan, isLate, isOpen, minutesPresent, myStatus, sessionTimes, summarize } from "./attendance";
import { approvedLeaveMap, balance, checkLeaveSessions, earlyLeaveMap, leaveCost, overLimit, overLimitOnApprove, sessionsTaken, toLeaveRequest } from "./leave";
import { quotaOf, toVisit, visitState, visitTally } from "./cases";
import type { LeaveRow, SessionRow, SlotRow } from "./types";

const COHORT = "c0c0c0c0-0000-4000-8000-000000000001";
const SID = "5e5e5e5e-0000-4000-8000-000000000001";

describe("clinic time (India, UTC+05:30)", () => {
  it("turns local date and time into an instant and back", () => {
    const t = instant("2026-11-16", "08:00");
    expect(new Date(t).toISOString()).toBe("2026-11-16T02:30:00.000Z");
    expect(localDate(t)).toBe("2026-11-16");
    expect(localTime(t)).toBe("08:00");
    // 23:00 UTC is already the next day in India.
    expect(localDate(Date.parse("2026-11-16T20:00:00Z"))).toBe("2026-11-17");
  });
  it("weekdays, Mondays, ranges", () => {
    expect(weekday("2026-11-16")).toBe(1); // Monday
    expect(mondayOf("2026-11-22")).toBe("2026-11-16");
    expect(mondayOf("2026-11-16")).toBe("2026-11-16");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(dateRange("2026-11-16", "2026-11-18")).toEqual(["2026-11-16", "2026-11-17", "2026-11-18"]);
    expect(hhmm("08:00:00")).toBe("08:00");
    expect(isDate("2026-02-30")).toBe(false);
    expect(isDate("2026-02-28")).toBe(true);
  });
});

const slot = (over: Partial<SlotRow> = {}): SlotRow => ({
  id: "slot-1", cohort_ids: [COHORT], weekday: 1, start_time: "08:00:00", end_time: "10:00:00", kind: "opd_morning", title: "OPD morning",
  place: "Clinic", online_link: null, compulsory: false, valid_from: null, valid_to: null, active: true, ...over,
});

describe("timetable expansion", () => {
  it("makes one session per slot per matching day, skipping ones already made", () => {
    const slots = [slot(), slot({ id: "slot-2", weekday: 6, kind: "class", title: "Class", start_time: "10:00", end_time: "13:00", compulsory: true })];
    const r = expandTimetable(slots, "2026-11-16", "2026-11-29", [{ slot_id: "slot-1", date: "2026-11-16" }]);
    expect(r.skipped).toBe(1);
    expect(r.sessions.map((s) => `${s.date} ${s.kind}`)).toEqual(["2026-11-21 class", "2026-11-23 opd_morning", "2026-11-28 class"]);
    expect(r.sessions[0]).toMatchObject({ start_time: "10:00", end_time: "13:00", origin: "timetable", status: "scheduled", slot_id: "slot-2" });
  });
  it("respects valid dates and inactive slots", () => {
    const r = expandTimetable([slot({ valid_from: "2026-11-20" }), slot({ id: "x", active: false })], "2026-11-16", "2026-11-30", []);
    expect(r.sessions.map((s) => s.date)).toEqual(["2026-11-23", "2026-11-30"]);
  });
  it("maps kinds to batches and rows to views", () => {
    expect(batchOfKind("opd_evening")).toBe("evening");
    expect(batchOfKind("class")).toBeNull();
    const s = toSession({ id: SID, cohort_ids: [COHORT], slot_id: null, date: "2026-11-16", start_time: "08:00:00", end_time: "10:00:00", kind: "opd_morning", title: "OPD", place: null, online_link: null, compulsory: false, status: "scheduled", origin: "one_off", note: null, moved_from: null });
    expect(s).toMatchObject({ start: "08:00", end: "10:00", batch: "morning" });
  });
});

describe("QR token and code", () => {
  const secret = newSecret();
  const now = Date.parse("2026-11-16T03:00:10Z");
  it("is stable within a window and changes every 30 seconds", () => {
    const w = windowOf(now);
    expect(tokenFor(secret, SID, w)).toBe(tokenFor(secret, SID, w));
    expect(tokenFor(secret, SID, w)).not.toBe(tokenFor(secret, SID, w + 1));
    expect(tokenFor(secret, SID, w)).toHaveLength(22);
    expect(codeFor(secret, SID, w)).toMatch(CODE_RE);
  });
  it("accepts the current and the previous window only", () => {
    const shown = showCode(secret, SID, now);
    const p = parseQr(shown.qr)!;
    expect(p.sessionId).toBe(SID);
    expect(verifyToken(secret, SID, p.token, now)).toBe(shown.window);
    expect(verifyToken(secret, SID, p.token, now + WINDOW_MS)).toBe(shown.window); // previous window
    expect(verifyToken(secret, SID, p.token, now + 2 * WINDOW_MS)).toBeNull(); // a photo, a minute later
    expect(verifyCode(secret, SID, shown.code.toLowerCase(), now)).toBe(shown.window);
    expect(verifyCode(secret, SID, shown.code, now + 2 * WINDOW_MS)).toBeNull();
    expect(shown.refreshInMs).toBeGreaterThan(0);
    expect(shown.refreshInMs).toBeLessThanOrEqual(WINDOW_MS);
  });
  it("only works for its own session and secret", () => {
    const shown = showCode(secret, SID, now);
    const p = parseQr(shown.qr)!;
    expect(verifyToken(secret, "5e5e5e5e-0000-4000-8000-000000000002", p.token, now)).toBeNull();
    expect(verifyToken(newSecret(), SID, p.token, now)).toBeNull();
  });
  it("rejects text that is not ours", () => {
    expect(parseQr("https://example.com")).toBeNull();
    expect(parseQr(`vibha-att:1:${SID}:12:short`)).toBeNull();
    expect(parseQr(`vibha-att:1:not-a-uuid:12:${"a".repeat(22)}`)).toBeNull();
  });
});

const sess = { date: "2026-11-16", start: "08:00", end: "10:00", status: "scheduled" as const, cohortIds: [COHORT] };
const at = (hm: string) => instant("2026-11-16", hm);

describe("attendance rules", () => {
  it("opens 30 minutes before and closes 60 minutes after", () => {
    expect(isOpen(sess, at("07:29"))).toBe(false);
    expect(isOpen(sess, at("07:30"))).toBe(true);
    expect(isOpen(sess, at("11:00"))).toBe(true);
    expect(isOpen(sess, at("11:01"))).toBe(false);
    expect(isOpen({ ...sess, status: "cancelled" }, at("08:00"))).toBe(false);
    expect(sessionTimes(sess).endsAt - sessionTimes(sess).startsAt).toBe(2 * 3600_000);
  });
  it("checks cohort, open window and one scan per direction", () => {
    const base = { session: sess, now: at("08:00"), memberOf: [COHORT] };
    expect(decideScan({ ...base, existing: null })).toEqual({ ok: true, direction: "in" });
    expect(decideScan({ ...base, memberOf: ["other"], existing: null })).toMatchObject({ ok: false, code: "forbidden" });
    expect(decideScan({ ...base, now: at("12:00"), existing: null })).toMatchObject({ ok: false, code: "conflict" });
    expect(decideScan({ ...base, existing: { in_at: "x", out_at: null } })).toEqual({ ok: true, direction: "out" });
    expect(decideScan({ ...base, existing: { in_at: "x", out_at: null }, direction: "in" })).toMatchObject({ ok: false, message: "You already scanned in." });
    expect(decideScan({ ...base, existing: null, direction: "out" })).toMatchObject({ ok: false, message: "Scan in first." });
    expect(decideScan({ ...base, existing: { in_at: "x", out_at: "y" } })).toMatchObject({ ok: false, message: "You already scanned out." });
  });
  it("late after start + late minutes; minutes from in to out", () => {
    expect(isLate(new Date(at("08:10")).toISOString(), sess, 10)).toBe(false);
    expect(isLate(new Date(at("08:11")).toISOString(), sess, 10)).toBe(true);
    expect(minutesPresent(new Date(at("08:00")).toISOString(), new Date(at("09:30")).toISOString())).toBe(90);
    expect(minutesPresent("2026-11-16T02:30:00Z", null)).toBeNull();
  });
  it("gives each student a status, flagging a missing scan out without inventing one", () => {
    const iso = (hm: string) => new Date(at(hm)).toISOString();
    const base = { session: sess, required: true, onLeave: false, lateMinutes: 10 };
    expect(myStatus({ ...base, now: at("07:00"), att: null }).status).toBe("upcoming");
    expect(myStatus({ ...base, now: at("10:30"), att: null }).status).toBe("absent");
    expect(myStatus({ ...base, now: at("10:30"), att: null, onLeave: true }).status).toBe("on_leave");
    expect(myStatus({ ...base, now: at("10:30"), att: null, required: false }).status).toBe("not_required");
    expect(myStatus({ ...base, now: at("09:00"), att: { in_at: iso("08:00"), out_at: null } }).status).toBe("in");
    expect(myStatus({ ...base, now: at("12:00"), att: { in_at: iso("08:00"), out_at: null } })).toEqual({ status: "no_scan_out", late: false, minutes: null });
    expect(myStatus({ ...base, now: at("12:00"), att: { in_at: iso("08:20"), out_at: iso("10:00") } })).toEqual({ status: "late", late: true, minutes: 100 });
    expect(myStatus({ ...base, now: at("12:00"), att: null, session: { ...sess, status: "cancelled" } }).status).toBe("cancelled");
  });
  it("summarizes with leave left out of the percentage", () => {
    const s = summarize([
      { status: "present", required: true, minutes: 120 },
      { status: "late", required: true, minutes: 60 },
      { status: "absent", required: true, minutes: null },
      { status: "on_leave", required: true, minutes: null },
      { status: "upcoming", required: true, minutes: null },
      { status: "not_required", required: false, minutes: null },
      { status: "present", required: false, minutes: 30 }, // came to an OPD day not assigned
    ]);
    expect(s).toEqual({ required: 4, attended: 3, late: 1, onLeave: 1, absent: 1, noScanOut: 0, percent: 67, minutes: 210 });
    expect(summarize([]).percent).toBeNull();
    expect(summarize([{ status: "present", required: true, minutes: 1 }, { status: "absent", required: true, minutes: null }]).percent).toBe(50);
  });
});

const leave = (over: Partial<LeaveRow>): LeaveRow => ({
  id: "l1", user_id: "u1", cohort_id: COHORT, kind: "leave", session_ids: ["s1"], leave_at: null, reason: "Ill", status: "pending", over_limit: false,
  assignment_id: null, decided_by: null, decided_at: null, decision_note: null, created_at: "2026-11-16T00:00:00Z", ...over,
});

describe("leave accounting", () => {
  it("one session is one leave, early leave is free, a missed OPD day is one", () => {
    expect(leaveCost(leave({ session_ids: ["a", "b"] }))).toBe(2);
    expect(leaveCost(leave({ kind: "early", leave_at: "17:00" }))).toBe(0);
    expect(leaveCost(leave({ kind: "missed", session_ids: [] }))).toBe(1);
  });
  it("counts used, pending and left", () => {
    const b = balance(3, [leave({ status: "approved", session_ids: ["a", "b"] }), leave({ status: "pending" }), leave({ status: "rejected" }), leave({ kind: "missed", status: "approved", session_ids: [] }), leave({ kind: "early", status: "approved" })]);
    expect(b).toEqual({ allowance: 3, used: 3, pending: 1, left: 0 });
    expect(balance(1, [leave({ status: "approved", session_ids: ["a", "b"] })]).left).toBe(0);
  });
  it("flags over the limit (never blocks)", () => {
    expect(overLimit({ allowance: 2, used: 1, pending: 0, left: 1 }, 1)).toBe(false);
    expect(overLimit({ allowance: 2, used: 1, pending: 1, left: 1 }, 1)).toBe(true);
    expect(overLimit({ allowance: 0, used: 0, pending: 0, left: 0 }, 0)).toBe(false); // early leave
    expect(overLimitOnApprove({ allowance: 2, used: 1, pending: 1, left: 1 }, leave({}))).toBe(false);
    expect(overLimitOnApprove({ allowance: 2, used: 2, pending: 0, left: 0 }, leave({}))).toBe(true);
  });
  it("maps approved leave and early leave to sessions", () => {
    const rows = [leave({ id: "a", status: "approved", session_ids: ["s1", "s2"] }), leave({ id: "b", kind: "early", status: "approved", session_ids: ["s3"], leave_at: "17:00:00" }), leave({ id: "c", session_ids: ["s4"] })];
    expect([...approvedLeaveMap(rows)]).toEqual([["s1", "a"], ["s2", "a"]]);
    expect([...earlyLeaveMap(rows)]).toEqual([["s3", "17:00"]]);
    expect([...sessionsTaken(rows, "leave")].sort()).toEqual(["s1", "s2", "s4"]);
  });
  it("checks the sessions picked", () => {
    const sessions = new Map([
      ["s1", { id: "s1", cohortIds: [COHORT], status: "scheduled" as const, date: "2026-11-17", end: "10:00" }],
      ["s2", { id: "s2", cohortIds: [COHORT], status: "cancelled" as const, date: "2026-11-17", end: "10:00" }],
      ["s3", { id: "s3", cohortIds: ["other"], status: "scheduled" as const, date: "2026-11-17", end: "10:00" }],
      ["s4", { id: "s4", cohortIds: [COHORT], status: "scheduled" as const, date: "2026-11-15", end: "10:00" }],
    ]);
    const base = { sessions, cohortId: COHORT, taken: new Set<string>(), now: at("12:00"), endsAt: (s: { date: string; end: string }) => instant(s.date, s.end) };
    expect(checkLeaveSessions({ ...base, ids: ["s1"] })).toEqual({ ok: true });
    expect(checkLeaveSessions({ ...base, ids: [] }).ok).toBe(false);
    expect(checkLeaveSessions({ ...base, ids: ["s1", "s1"] }).ok).toBe(false);
    expect(checkLeaveSessions({ ...base, ids: ["s2"] }).ok).toBe(false);
    expect(checkLeaveSessions({ ...base, ids: ["s3"] }).ok).toBe(false);
    expect(checkLeaveSessions({ ...base, ids: ["s4"] }).ok).toBe(false);
    expect(checkLeaveSessions({ ...base, ids: ["nope"] }).ok).toBe(false);
    expect(checkLeaveSessions({ ...base, ids: ["s1"], taken: new Set(["s1"]) }).ok).toBe(false);
  });
  it("shows a request with its sessions", () => {
    const r = toLeaveRequest(leave({ session_ids: ["s1", "gone"] }), new Map([["s1", { id: "s1", date: "2026-11-17", start: "08:00", title: "OPD" }]]));
    expect(r.sessions).toEqual([{ id: "s1", date: "2026-11-17", start: "08:00", title: "OPD" }, { id: "gone", date: "", start: "", title: "Session" }]);
    expect(r.cost).toBe(2);
  });
});

describe("visits and case tallies", () => {
  const a = { id: "a1", date: "2026-11-10", batch: "morning" as const };
  const s = { id: "s", start: "08:00", end: "10:00", cancelled: false };
  const base = { assignment: a, today: "2026-11-16", log: null, attended: false, onLeave: false, session: s };
  it("works out each visit's state", () => {
    expect(visitState(base)).toBe("missed");
    expect(visitState({ ...base, attended: true })).toBe("due");
    expect(visitState({ ...base, log: { cases: 2, absent: false, note: null } })).toBe("done");
    expect(visitState({ ...base, log: { cases: 0, absent: true, note: null } })).toBe("absent");
    expect(visitState({ ...base, onLeave: true })).toBe("on_leave");
    expect(visitState({ ...base, session: null })).toBe("due");
    expect(visitState({ ...base, session: { ...s, cancelled: true } })).toBe("on_leave");
    expect(visitState({ ...base, assignment: { ...a, date: "2026-11-16" } })).toBe("today");
    expect(visitState({ ...base, assignment: { ...a, date: "2026-11-20" } })).toBe("upcoming");
  });
  it("counts done cases, extras and pending", () => {
    const visits = [
      toVisit({ ...base, log: { cases: 3, absent: false, note: null } }),
      toVisit({ ...base, assignment: { ...a, id: "a2" }, attended: true }), // attended, log not sent: counts cases per visit
      toVisit({ ...base, assignment: { ...a, id: "a3" } }), // missed: nothing
      toVisit({ ...base, assignment: { ...a, id: "a4" }, session: null }), // due but never attended: nothing
    ];
    const q = quotaOf({ base: 7, extras: [{ count: 2, note: "paid 12 Nov", created_at: "2026-11-12T00:00:00Z" }], visits, casesPerVisit: 2, attended: new Set(["a2"]) });
    expect(q).toMatchObject({ base: 7, total: 9, done: 5, pending: 4 });
    expect(q.extras).toEqual([{ count: 2, note: "paid 12 Nov", at: "2026-11-12T00:00:00Z" }]);
    expect(visitTally(visits)).toEqual({ planned: 4, done: 1, absent: 0, missed: 1, due: 2 });
  });
});
