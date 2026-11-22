import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";
import * as Reanimated from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";
import * as React from "react";

import { ApiFailure } from "@/api/errors";
import { mock } from "@/api/mock/server";
import { api, session } from "@/auth";
import { AdminAllowancesScreen } from "@/clinic/admin/allowances";
import { ShowCodeScreen } from "@/clinic/admin/code";
import { AdminLeavesScreen } from "@/clinic/admin/leaves";
import { AdminOpdScreen } from "@/clinic/admin/opd";
import { AdminSessionScreen, filterRoster } from "@/clinic/admin/session";
import { AdminTimetableScreen, checkTimes } from "@/clinic/admin/timetable";
import { AdminClinicScreen, countsLine } from "@/clinic/admin/today";
import { AdminTrackersScreen, sortTrackers } from "@/clinic/admin/trackers";
import { adminClinicCalls, clinicCalls, cohortStore } from "@/clinic/api";
import { weekdayFrom, weekdayNumber, type ClinicStudent, type RosterRow } from "@/clinic/contract";
import * as L from "@/clinic/logic";
import { clinicMock } from "@/clinic/mock";
import { qrGrid, qrPath } from "@/clinic/qr";
import * as S from "@/clinic/safe";
import { AttendanceScreen } from "@/clinic/screens/attendance";
import { LeaveScreen } from "@/clinic/screens/leave";
import { OpdScreen } from "@/clinic/screens/opd";
import { ScanScreen } from "@/clinic/screens/scan";
import { ScheduleScreen, weekLabel } from "@/clinic/screens/schedule";
import { TodayBlock, TodayBlockView } from "@/clinic/today";
import { haptic } from "@/lib/haptics";
import { pathFromLink } from "@/nav/targets";
import { routeReads } from "@/api/prefetch";
import { render } from "./utils";

const params = useLocalSearchParams as jest.Mock;
/** The machine is shared: give screens time to load. */
const wf = (fn: () => void) => waitFor(fn, { timeout: 8000 });
jest.setTimeout(20_000);

async function signInAs(email: string) {
  if (session.store.get().phase !== "visitor" && session.store.get().phase !== "loading") await session.signOut();
  await session.signIn(email, "pw");
  await session.choosePin("2580");
}

/** Spies made by a test, undone one by one (jest.restoreAllMocks would also undo the set-up file's stand-ins). */
const spies: jest.SpyInstance[] = [];
const spy = ((...a: Parameters<typeof jest.spyOn>) => {
  const sp = (jest.spyOn as (...x: unknown[]) => jest.SpyInstance)(...a);
  spies.push(sp);
  return sp;
}) as typeof jest.spyOn;
const restoreSpies = () => spies.splice(0).forEach((x) => x.mockRestore());
afterEach(restoreSpies);

const fail = async (p: Promise<unknown>) => {
  try {
    await p;
  } catch (e) {
    return e as ApiFailure;
  }
  throw new Error("expected a refusal");
};

beforeAll(async () => {
  await session.boot();
});
beforeEach(() => {
  mock.reset();
  cohortStore.set({ id: null });
  params.mockReturnValue({});
});

const today = L.todayIST();
const classToday = () => clinicMock.todaySessions().find((x) => x.kind === "class")!;
const cohortOne = () => clinicMock.todaySessions().find((x) => x.cohortIds.includes("c1"))!;

/* ------------------------------------------------------------ plain logic */

describe("clinic words and numbers", () => {
  it("says times the way people do", () => {
    expect(L.timeLabel("17:00")).toBe("5 pm");
    expect(L.timeLabel("08:30")).toBe("8:30 am");
    expect(L.timeLabel("12:00")).toBe("12 noon");
    expect(L.rangeLabel("17:00", "20:00")).toBe("5 to 8 pm");
    expect(L.rangeLabel("10:00", "13:00")).toBe("10 am to 1 pm");
    expect(L.opdLine({ batch: "evening", start: "17:00", end: "20:00" })).toBe("Today is your OPD day, evening 5 to 8");
    expect(L.hoursLine(135)).toBe("2 hours 15 minutes");
    expect(L.hoursLine(60)).toBe("1 hour");
    expect(L.leavesLine(1)).toBe("1 leave left");
    expect(L.leavesLine(0)).toBe("No leaves left");
    expect(L.casesLine(5, 8)).toBe("5 of 8 cases done");
    expect(L.visitsNeeded(8, 5, 2)).toBe(2);
    expect(L.requestTitle({ kind: "early", sessions: [1], leaveAt: "17:00" })).toBe("Leave early at 5 pm");
    expect(L.requestTitle({ kind: "missed", sessions: [1], leaveAt: null })).toBe("Missed OPD day");
  });

  it("reads typed clock times and real dates", () => {
    expect(L.parseClock("5pm")).toBe("17:00");
    expect(L.parseClock("5:30 PM")).toBe("17:30");
    expect(L.parseClock("12 am")).toBe("00:00");
    expect(L.parseClock("17")).toBe("17:00");
    expect(L.parseClock("25:00")).toBeNull();
    expect(L.parseClock("13pm")).toBeNull();
    expect(L.isDate("2026-02-30")).toBe(false);
    expect(L.isDate("2026-11-16")).toBe(true);
    expect(checkTimes("10 am", "1 pm")).toEqual({ start: "10:00", end: "13:00" });
    expect(checkTimes("2 pm", "1 pm")).toBe("The end must be after the start.");
  });

  it("works out weeks and weekdays (the server counts from Sunday)", () => {
    expect(L.weekdayOf("2026-11-16")).toBe("mon");
    expect(L.mondayOf("2026-11-22")).toBe("2026-11-16");
    expect(L.weekDates("2026-11-16")).toHaveLength(7);
    expect(weekLabel("2026-11-16", "2026-11-22")).toBe("16 to 22 Nov");
    expect(weekLabel("2026-11-30", "2026-12-06")).toBe("30 Nov to 6 Dec");
    expect(weekdayNumber("sun")).toBe(0);
    expect(weekdayNumber("mon")).toBe(1);
    expect(weekdayFrom(0)).toBe("sun");
    expect(weekdayFrom(6)).toBe("sat");
    expect(L.relDay(today, today)).toBe("Today");
    expect(L.relDay(L.addDays(today, 1), today)).toBe("Tomorrow");
  });

  it("opens clinic notices (they link to /clinic) on the schedule", () => {
    expect(pathFromLink("/clinic")).toBe("/clinic/schedule");
    expect(pathFromLink("https://vibhapsychology.com/clinic")).toBe("/clinic/schedule");
    expect(pathFromLink("/clinic/leave")).toBe("/clinic/leave");
  });

  it("a tap on a clinic screen starts its read (the prefetcher knows every clinic address)", () => {
    expect(routeReads("/clinic/leave")[0]?.queryKey).toEqual(["clinic", "leave"]);
    expect(routeReads("/clinic/opd")[0]?.queryKey).toEqual(["clinic", "opd"]);
    expect(routeReads("/clinic/schedule")[0]?.queryKey[1]).toBe("week");
    expect(routeReads("/admin/clinic")[0]?.queryKey.slice(0, 3)).toEqual(["admin", "clinic", "overview"]);
    expect(routeReads("/admin/clinic/session/s1")[0]?.queryKey).toContain("s1");
    expect(routeReads("/clinic/scan")).toEqual([]);
  });

  it("cleans the code and decides what to send", () => {
    expect(L.cleanCode(" ab-c d2 3x ")).toBe("ABCD23");
    expect(L.isCode("ABCD23")).toBe(true);
    // 0, O, 1 and I are never in a code.
    expect(L.isCode("ABCD10")).toBe(false);
    expect(L.scanBody("abcd23", true)).toEqual({ code: "ABCD23" });
    expect(L.scanBody("abc", true)).toBeNull();
    expect(L.scanBody("vibha-att:1:s1:123:abc")).toEqual({ token: "vibha-att:1:s1:123:abc" });
    expect(L.scanBody("https://example.com")).toBeNull();
    expect(L.scanBody("")).toBeNull();
  });

  it("turns every scan refusal into plain words, from the server's reason", () => {
    const why = (reason: string, msg = "The server's own line.") => L.scanError(new ApiFailure("bad_request", msg, 400, { reason }));
    expect(why("code_expired").title).toBe("That code has changed");
    expect(why("not_a_code").title).toBe("That code did not work");
    expect(why("wrong_cohort").title).toBe("Not your session");
    expect(why("not_open_yet").title).toBe("Not open yet");
    expect(why("closed").title).toBe("Marking is closed");
    expect(why("cancelled").title).toBe("Session cancelled");
    expect(why("ticket_expired").title).toBe("That took too long");
    expect(why("out_before_in").title).toBe("Mark IN first");
    expect(why("closed", "Marking for Class closed at 2:00 pm. Ask the admin to mark you.").body).toBe("Marking for Class closed at 2:00 pm. Ask the admin to mark you.");
    expect(L.scanError(new ApiFailure("forbidden", "x", 403)).title).toBe("Not your session");
    expect(L.scanError(new ApiFailure("rate_limited", "x", 429)).title).toBe("Too many tries");
    expect(L.scanError(new ApiFailure("network", "")).title).toBe("No internet");
    expect(L.isUnsent(new ApiFailure("network", ""))).toBe(true);
    expect(L.isUnsent(new ApiFailure("bad_request", "x", 400))).toBe(false);
    expect(L.newAttemptId()).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
    expect(L.newAttemptId()).not.toBe(L.newAttemptId());
    expect(L.scanStateLine({ state: "none", inAt: null, outAt: null })).toBe("You have not marked IN yet.");
  });

  it("counts down by the server's clock", () => {
    const end = new Date(100_000).toISOString();
    expect(L.secondsLeft(end, 80_000, 0)).toBe(20);
    expect(L.secondsLeft(end, 80_000, 5_000)).toBe(15);
    expect(L.secondsLeft(end, 120_000, 0)).toBe(0);
    expect(L.skewOf(end, 30_000, 60_000)).toBe(10_000);
  });

  it("draws a square QR grid as one path", () => {
    const g = qrGrid("vibha-att:1:00000000-0000-0000-0000-000000000000:123:abcdefghijklmnopqrstuv");
    expect(g.length).toBeGreaterThan(20);
    expect(g.every((r) => r.length === g.length)).toBe(true);
    expect(qrPath(g)).toMatch(/^M\d+ \d+h\d+v1h-\d+z/);
    expect(qrGrid("")).toEqual([]);
  });

  it("reads the server's states as the screens' states", () => {
    expect(S.stateOf("upcoming", true, null, null)).toBe("open");
    expect(S.stateOf("upcoming", false, null, null)).toBe("upcoming");
    expect(S.stateOf("present", false, "a", "b")).toBe("done");
    expect(S.stateOf("late", false, "a", null)).toBe("in");
    expect(S.stateOf("no_scan_out", false, "a", null)).toBe("no_out");
    expect(S.stateOf("on_leave", false, null, null)).toBe("leave");
    expect(S.stateOf("absent", false, null, null)).toBe("missed");
    expect(S.stateOf("not_required", false, null, null)).toBeNull();
    // The one shared count: approved early leave is "Left early (approved)", never "No scan out".
    expect(S.stateOf("no_scan_out", false, "a", null, "left_early")).toBe("left_early");
    expect(S.stateOf("present", false, "a", "b", "left_early")).toBe("left_early");
    expect(S.stateOf("in", true, "a", null, "left_early")).toBe("in");
    expect(L.stateWord("left_early")).toBe("Left early (approved)");
    expect(L.stateWord("missed")).toBe("Absent");
    expect(L.stateWord("done", true)).toBe("Late");
    expect(L.stateWord("leave")).toBe("On leave");
    const s = S.session({ id: "x", kind: "online_class", onlineLink: "https://meet", movedFrom: "2026-11-18 08:00", my: { status: "upcoming" }, open: true });
    expect(s.link).toBe("https://meet");
    expect(s.status).toBe("moved");
    expect(s.mine?.state).toBe("open");
    // Garbage never crashes.
    expect(S.today(null).sessions).toEqual([]);
    expect(S.plan(undefined).status).toBe("none");
    expect(S.trackers({ rows: [null, 3] }).items).toHaveLength(1);
  });

  it("my attendance reads the shared count: leave in neither number", () => {
    const d = S.attendance({
      summary: { required: 5, attended: 3, late: 1, onLeave: 2, absent: 0, noScanOut: 0, percent: 100, minutes: 300, counted: 3, countedPresent: 3, present: 1, leftEarly: 1 },
      sessions: [
        { id: "a", date: "2026-11-16", start: "08:00", end: "10:00", kind: "class", compulsory: true, my: { status: "no_scan_out", inAt: "x", outAt: null, mark: "left_early", earlyLeaveAt: "09:00" } },
        { id: "b", date: "2026-11-17", start: "08:00", end: "10:00", kind: "opd_morning", assigned: true, required: true, my: { status: "on_leave", mark: "on_leave", missedOpd: true } },
      ],
    });
    expect(d).toMatchObject({ pct: 100, came: 3, counted: 3, present: 1, leftEarly: 1, onLeave: 2, missed: 0 });
    expect(d.rows.map((r) => r.state)).toEqual(["leave", "left_early"]);
    expect(d.rows[0]!.missedOpd).toBe(true);
    // An older server without the new numbers: leave still left out.
    expect(S.attendance({ summary: { required: 4, attended: 2, late: 0, onLeave: 1, absent: 1, percent: 67 } })).toMatchObject({ counted: 3, came: 2, present: 2 });
    // The admin list: approved early leave shows as left early.
    expect(S.sessionDetail({ rows: [{ userId: "u", name: "U", status: "no_scan_out", inAt: "x", mark: "left_early" }] }).roster[0]!.state).toBe("left_early");
  });

  it("filters and sorts the admin lists", () => {
    const r = (p: Partial<RosterRow>): RosterRow => ({ studentId: "a", name: "A", state: "missing", inAt: null, outAt: null, late: false, manual: false, note: null, leaveAt: null, ...p });
    const rows = [r({ studentId: "1", state: "in", late: true }), r({ studentId: "2", state: "out" }), r({ studentId: "3", state: "no_out" }), r({ studentId: "4" })];
    expect(filterRoster(rows, "late").map((x) => x.studentId)).toEqual(["1"]);
    expect(filterRoster(rows, "out").map((x) => x.studentId)).toEqual(["2", "3"]);
    expect(filterRoster(rows, "missing").map((x) => x.studentId)).toEqual(["4"]);
    const st = (p: Partial<ClinicStudent>): ClinicStudent => ({ studentId: "x", name: "X", batch: null, leaveAllowance: 4, leavesUsed: 0, leavesLeft: 4, opdTotal: 8, extras: 0, casesDone: 0, visits: 0, absences: 0, attendancePct: null, unsubmitted: 0, ...p });
    const t = [st({ studentId: "a", name: "A", attendancePct: 90, unsubmitted: 1 }), st({ studentId: "b", name: "B", attendancePct: 60, casesDone: 8 })];
    expect(sortTrackers(t, "attendance").map((x) => x.studentId)).toEqual(["b", "a"]);
    expect(sortTrackers(t, "cases").map((x) => x.studentId)).toEqual(["a", "b"]);
    expect(sortTrackers(t, "logs").map((x) => x.studentId)).toEqual(["a"]);
    expect(countsLine({ ...S.adminSession({ id: "s" }), counts: { expected: 5, in: 2, out: 1, missing: 2, late: 1, leave: 0 } })).toBe("2 in · 1 left · 2 not here · 1 late");
  });
});

/* ------------------------------------------------------- against the mock */

describe("student clinic calls (mock server, server shapes)", () => {
  beforeEach(async () => {
    await signInAs("ananya@example.com");
  });

  it("identify saves nothing and says which of IN and OUT makes sense; confirm saves once", async () => {
    const c = classToday();
    const step = await clinicCalls.identify({ token: clinicMock.qrFor(c.id) });
    expect(step.session.id).toBe(c.id);
    expect(step).toMatchObject({ state: "none", in: { allowed: true, reason: null }, out: { allowed: false, reason: "Mark IN first." } });
    expect(step.ticketMs).toBe(120_000);
    // Looking is not marking.
    expect((await clinicCalls.identify({ token: clinicMock.qrFor(c.id) })).state).toBe("none");

    const out = await fail(clinicCalls.confirmMark({ ticket: step.ticket, direction: "out", attemptId: "attempt-0001" }));
    expect(out.details.reason).toBe("out_before_in");
    expect(L.scanError(out).title).toBe("Mark IN first");

    const first = await clinicCalls.confirmMark({ ticket: step.ticket, direction: "in", attemptId: "attempt-0002" });
    expect(first).toMatchObject({ direction: "in", already: false });
    // The same press again (a retry): the same answer. Another press: "already", the first time kept.
    const retry = await clinicCalls.confirmMark({ ticket: step.ticket, direction: "in", attemptId: "attempt-0002" });
    expect(retry).toMatchObject({ already: false, at: first.at });
    const again = await clinicCalls.confirmMark({ ticket: step.ticket, direction: "in", attemptId: "attempt-0003" });
    expect(again).toMatchObject({ already: true, at: first.at });
    expect(again.message).toMatch(/^Already marked IN at .+\. Nothing was changed\.$/);

    const now = await clinicCalls.identify({ code: clinicMock.codeFor(c.id) });
    expect(now).toMatchObject({ state: "in", in: { allowed: false }, out: { allowed: true } });
    expect(now.in.reason).toMatch(/^You are already IN since /);
    const left = await clinicCalls.confirmMark({ ticket: now.ticket, direction: "out", attemptId: "attempt-0004" });
    expect(left).toMatchObject({ direction: "out", already: false });
    expect((await clinicCalls.identify({ code: clinicMock.codeFor(c.id) })).state).toBe("out");
  });

  it("refuses someone else's session, an old QR, a wrong typed code and a ticket that ran out", async () => {
    const c = classToday();
    const other = await fail(clinicCalls.identify({ token: clinicMock.qrFor(cohortOne().id) }));
    expect(other.code).toBe("forbidden");
    expect(L.scanError(other).title).toBe("Not your session");
    // A typed code is matched to my own open sessions only.
    expect((await fail(clinicCalls.identify({ code: clinicMock.codeFor(cohortOne().id) }))).details.reason).toBe("not_a_code");
    const forged = clinicMock.qrFor(c.id).replace(/:(\d+):[A-Za-z0-9_-]{22}$/, (_m, w) => `:${Number(w) - 5}:${"A".repeat(22)}`);
    expect(L.scanError(await fail(clinicCalls.identify({ token: forged }))).title).toBe("That code did not work");
    expect((await fail(clinicCalls.identify({ code: "ZZZZZZ" }))).code).toBe("bad_request");

    const old = clinicMock.qrFor(c.id);
    const step = await clinicCalls.identify({ token: old });
    const clock = spy(Date, "now").mockReturnValue(Date.now() + 121_000);
    try {
      expect(L.scanError(await fail(clinicCalls.identify({ token: old }))).title).toBe("That code has changed");
      const late = await fail(clinicCalls.confirmMark({ ticket: step.ticket, direction: "in", attemptId: "attempt-0001" }));
      expect(late.details.reason).toBe("ticket_expired");
      expect(L.scanError(late)).toEqual({ title: "That took too long", body: "That took too long. Scan the code again." });
    } finally {
      clock.mockRestore();
    }
  });

  it("asks for leave, marks it over the limit when none are left, and cancels it", async () => {
    const page = S.leavePage(await api.get("/clinic/leave"), []);
    expect(page.left).toBeGreaterThanOrEqual(0);
    const short = await fail(clinicCalls.askLeave({ sessionIds: [], reason: "x" }));
    expect(short.code).toBe("bad_request");
    const future = clinicMock.state().sessions.find((x) => x.date > today && x.kind === "class" && !x.cancelled)!;
    const r = await clinicCalls.askLeave({ sessionIds: [future.id], reason: "Family function" });
    expect(r.status).toBe("pending");
    await clinicCalls.cancelLeave(r.id);
    const early = await fail(clinicCalls.askEarly({ sessionId: classToday().id, leaveAt: "23:00", reason: "Doctor" }));
    expect(early.code).toBe("bad_request");
    const ok = await clinicCalls.askEarly({ sessionId: classToday().id, leaveAt: "12:00", reason: "Doctor" });
    expect(ok.kind).toBe("early");
    expect(ok.cost).toBe(0);
  });

  it("logs cases for a visit that is due; the batch is set once", async () => {
    const opd = S.opdPage(await api.get("/clinic/opd"));
    const due = opd.visits.find((v) => v.status === "to_log")!;
    expect(due).toBeTruthy();
    const v = await clinicCalls.logCases({ assignmentId: due.id, cases: 3, absent: false });
    expect(v.status).toBe("logged");
    expect(v.cases).toBe(3);
    const again = await fail(clinicCalls.setBatch("morning"));
    expect(again.code).toBe("conflict");
  });
});

describe("admin clinic calls", () => {
  it("a view admin reads but cannot write", async () => {
    await signInAs("viewadmin@example.com");
    const e = await fail(adminClinicCalls.generate("c2"));
    expect(e.code).toBe("forbidden");
  });

  it("generates a draft, moves a student, and publishes", async () => {
    await signInAs("admin@example.com");
    const draft = await adminClinicCalls.generate("c2");
    expect(draft.status).toBe("draft");
    const day = draft.days.find((d) => d.date > L.addDays(today, 2) && d.evening.length && d.evening.length < 2) ?? draft.days.find((d) => d.date > L.addDays(today, 2) && d.evening.length)!;
    const free = draft.days.find((d) => d.date > day.date && d.evening.length < d.seats.evening && !d.evening.concat(d.morning).some((x) => x.studentId === day.evening[0]!.studentId));
    if (free) {
      const moved = await adminClinicCalls.moveSeat({ assignmentId: day.evening[0]!.assignmentId, date: free.date, batch: "evening" });
      expect(moved.days.find((d) => d.date === free.date)!.evening.some((x) => x.studentId === day.evening[0]!.studentId)).toBe(true);
    }
    const full = draft.days.find((d) => d.date > today && d.evening.length >= d.seats.evening && d.seats.evening > 0);
    if (full) {
      const other = draft.days.find((d) => d.date > today && d.date !== full.date && d.evening.length)!;
      const e = await fail(adminClinicCalls.moveSeat({ assignmentId: other.evening[0]!.assignmentId, date: full.date, batch: "evening" }));
      expect(e.code).toBe("conflict");
    }
    const p = await adminClinicCalls.publish("c2");
    expect(p.notified).toBeGreaterThan(0);
  });

  it("refuses Show code for a session that is not open (409)", async () => {
    await signInAs("admin@example.com");
    const later = clinicMock.state().sessions.find((x) => x.date > today && !x.cancelled)!;
    const e = await fail(adminClinicCalls.code(later.id));
    expect(e.code).toBe("conflict");
    const ok = await adminClinicCalls.code(classToday().id);
    expect(L.isCode(ok.code)).toBe(true);
    expect(ok.qr.startsWith(L.QR_PREFIX)).toBe(true);
  });
});

/* ---------------------------------------------------------------- screens */

describe("student clinic screens", () => {
  beforeEach(async () => {
    await signInAs("ananya@example.com");
  });

  it("Home's block says it is my OPD day, shows the admin's note and today's sessions", async () => {
    await render(<TodayBlockView d={{ date: today, note: "Bring your case sheets", sessions: [S.session({ id: "s1", date: today, start: "10:00", end: "13:00", kind: "class", title: "Case formulation", my: { status: "upcoming" }, open: true })], opd: { batch: "evening", start: "17:00", end: "20:00", place: "OPD 2", sessionId: null }, logsDue: 1, leavesLeft: 3 }} />);
    expect(screen.getByText("Today is your OPD day, evening 5 to 8")).toBeTruthy();
    expect(screen.getByText("Bring your case sheets")).toBeTruthy();
    expect(screen.getByText("Case formulation")).toBeTruthy();
    expect(screen.getByText("Scan in")).toBeTruthy();
    expect(screen.getByTestId("today-to-log")).toBeTruthy();
    expect(screen.getByTestId("today-scan")).toBeTruthy();
  });

  /** Type the code and wait for the two choices. */
  async function toChoices() {
    await render(<ScanScreen />);
    await wf(() => expect(screen.getByTestId("camera-view")).toBeTruthy());
    await fireEvent.changeText(screen.getByTestId("scan-code"), clinicMock.codeFor(classToday().id).toLowerCase());
    await fireEvent.press(screen.getByTestId("scan-send"));
    await wf(() => expect(screen.getByTestId("scan-choose")).toBeTruthy());
  }
  const disabled = (id: string) => screen.getByTestId(id).props.accessibilityState?.disabled === true;

  /** One tap confirms when a screen reader is on (and under Reduce Motion): the tests use that, except the one about holding. */
  const readerOn = () => spy(AccessibilityInfo, "isScreenReaderEnabled").mockResolvedValue(true);

  it("Scan: a code only shows the session and two choices; nothing is chosen, sent or buzzed", async () => {
    const confirm = spy(clinicCalls, "confirmMark");
    const h = { ok: spy(haptic, "success"), bad: spy(haptic, "warn"), pick: spy(haptic, "select") };
    await toChoices();
    expect(screen.getByTestId("scan-session").props.children).toBe(classToday().title);
    expect(screen.getByTestId("scan-when")).toBeTruthy();
    expect(screen.getByTestId("scan-state").props.children).toBe("You have not marked IN yet.");
    expect(screen.getByLabelText("Mark IN")).toBeTruthy();
    expect(screen.getByLabelText("Mark OUT")).toBeTruthy();
    expect(disabled("scan-choose-in")).toBe(false);
    expect(disabled("scan-choose-out")).toBe(true);
    expect(screen.getByTestId("scan-why-out").props.children).toBe("Mark IN first.");
    expect(screen.getByTestId("scan-choose-out").props.accessibilityHint).toBe("Mark IN first.");
    expect(screen.queryByTestId("scan-why-in")).toBeNull();
    // Nothing is picked yet, so there is nothing to confirm.
    expect(disabled("scan-confirm")).toBe(true);
    expect(screen.getByTestId("scan-choose-in").props.accessibilityState.selected).toBe(false);
    // The one that is off does nothing.
    await fireEvent.press(screen.getByTestId("scan-choose-out"));
    expect(screen.queryByTestId("scan-confirm-title")).toBeNull();
    expect(confirm).not.toHaveBeenCalled();
    for (const m of Object.values(h)) expect(m).not.toHaveBeenCalled();
    restoreSpies();
  });

  it("Scan: picking IN saves nothing, picking it again lets go, the confirm sends once and shows what was recorded", async () => {
    readerOn();
    const confirm = spy(clinicCalls, "confirmMark");
    const ok = spy(haptic, "success");
    await toChoices();
    await fireEvent.press(screen.getByTestId("scan-choose-in"));
    await wf(() => expect(screen.getByTestId("scan-confirm-title")).toBeTruthy());
    expect(screen.getByText(`You are marking IN for ${classToday().title}`)).toBeTruthy();
    expect(screen.getByTestId("scan-choose-in").props.accessibilityState.selected).toBe(true);
    expect(confirm).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByTestId("scan-choose-in"));
    await wf(() => expect(screen.queryByTestId("scan-confirm-title")).toBeNull());
    expect(confirm).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByTestId("scan-choose-in"));
    await wf(() => expect(screen.getByLabelText("Confirm IN")).toBeTruthy());
    const go = screen.getByTestId("scan-confirm");
    await fireEvent.press(go);
    // A second tap, if the button is still there (the next test holds the answer back to press it mid-send).
    const still = screen.queryByTestId("scan-confirm");
    if (still) await fireEvent.press(still);
    await wf(() => expect(screen.getByTestId("scan-direction")).toBeTruthy());
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(confirm.mock.calls[0]![0]).toMatchObject({ direction: "in", attemptId: expect.stringMatching(/^[A-Za-z0-9_-]{8,64}$/) });
    expect(screen.getByTestId("scan-direction").props.children).toBe("IN");
    expect(String([screen.getByTestId("scan-done-title").props.children].flat().join(""))).toMatch(/^Marked IN at /);
    expect(screen.getByTestId("scan-close")).toBeTruthy();
    expect(ok).toHaveBeenCalledTimes(1);
    restoreSpies();
  });

  it("Scan: without Reduce Motion or a screen reader a tap does nothing; holding for a second sends, letting go early does not", async () => {
    // The test set-up runs with Reduce Motion on (taps confirm); turn it off here to hold.
    spy(Reanimated, "useReducedMotion").mockReturnValue(false);
    const confirm = spy(clinicCalls, "confirmMark");
    await toChoices();
    await fireEvent.press(screen.getByTestId("scan-choose-in"));
    await wf(() => expect(screen.getByLabelText("Hold to mark IN")).toBeTruthy());
    const hold = screen.getByTestId("scan-confirm");
    await fireEvent.press(hold);
    expect(confirm).not.toHaveBeenCalled();
    const touch = { nativeEvent: { locationX: 40, pageX: 60, pageY: 500 } };
    await fireEvent(hold, "pressIn", touch);
    await new Promise((r) => setTimeout(r, 300));
    await fireEvent(hold, "pressOut", touch);
    await new Promise((r) => setTimeout(r, 900));
    expect(confirm).not.toHaveBeenCalled();
    await fireEvent(hold, "pressIn", touch);
    await wf(() => expect(screen.getByTestId("scan-direction")).toBeTruthy());
    expect(confirm).toHaveBeenCalledTimes(1);
    restoreSpies();
  });

  it("Scan: while it sends, the confirm is locked and shows progress", async () => {
    readerOn();
    let answer: (v: Awaited<ReturnType<typeof clinicCalls.confirmMark>>) => void = () => undefined;
    const confirm = spy(clinicCalls, "confirmMark").mockImplementation(() => new Promise((r) => (answer = r)));
    const ok = spy(haptic, "success");
    await toChoices();
    await fireEvent.press(screen.getByTestId("scan-choose-in"));
    await wf(() => expect(screen.getByLabelText("Confirm IN")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("scan-confirm"));
    await wf(() => expect(screen.getByLabelText("Sending")).toBeTruthy());
    expect(screen.getByTestId("scan-confirm").props.accessibilityState).toMatchObject({ disabled: true, busy: true });
    expect(disabled("scan-cancel")).toBe(true);
    expect(disabled("scan-choose-in")).toBe(true);
    await fireEvent.press(screen.getByTestId("scan-confirm"));
    expect(confirm).toHaveBeenCalledTimes(1);
    await act(async () => {
      answer({ direction: "in", at: new Date().toISOString(), session: { id: classToday().id, title: classToday().title }, late: false, minutes: null, already: true, message: "" });
    });
    // A repeat: "Already marked IN at ...", nothing changed, and no success buzz.
    await wf(() => expect(screen.getByTestId("scan-already")).toBeTruthy());
    expect(String([screen.getByTestId("scan-done-title").props.children].flat().join(""))).toMatch(/^Already marked IN at /);
    expect(ok).not.toHaveBeenCalled();
    restoreSpies();
  });

  it("Scan: already in, so Mark IN is off with the reason and OUT is what gets sent", async () => {
    readerOn();
    const c = classToday();
    const step = await clinicCalls.identify({ code: clinicMock.codeFor(c.id) });
    await clinicCalls.confirmMark({ ticket: step.ticket, direction: "in", attemptId: "attempt-0001" });
    const confirm = spy(clinicCalls, "confirmMark");
    await toChoices();
    expect(disabled("scan-choose-in")).toBe(true);
    expect(String(screen.getByTestId("scan-why-in").props.children)).toMatch(/^You are already IN since /);
    expect(disabled("scan-choose-out")).toBe(false);
    await fireEvent.press(screen.getByTestId("scan-choose-out"));
    await wf(() => expect(screen.getByText(`You are marking OUT for ${c.title}`)).toBeTruthy());
    await fireEvent.press(screen.getByTestId("scan-confirm"));
    await wf(() => expect(screen.getByTestId("scan-direction")).toBeTruthy());
    expect(screen.getByTestId("scan-direction").props.children).toBe("OUT");
    expect(confirm.mock.calls[0]![0]).toMatchObject({ direction: "out" });
    restoreSpies();
  });

  it("Scan: no internet says it did not go through, keeps nothing for later, and Try again sends the same press", async () => {
    readerOn();
    const real = clinicCalls.confirmMark;
    const confirm = spy(clinicCalls, "confirmMark").mockRejectedValueOnce(new ApiFailure("network", "No internet."));
    const warn = spy(haptic, "warn");
    await toChoices();
    await fireEvent.press(screen.getByTestId("scan-choose-in"));
    await wf(() => expect(screen.getByLabelText("Confirm IN")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("scan-confirm"));
    await wf(() => expect(screen.getByTestId("scan-unsent")).toBeTruthy());
    expect(screen.getByText("Not marked yet")).toBeTruthy();
    expect(String([screen.getByTestId("scan-unsent-body").props.children].flat().join(""))).toContain("did not go through");
    expect(warn).toHaveBeenCalledTimes(1);
    // Nothing reached the server, and nothing waits in a queue.
    expect((await clinicCalls.identify({ code: clinicMock.codeFor(classToday().id) })).state).toBe("none");
    confirm.mockImplementation(real);
    await fireEvent.press(screen.getByTestId("scan-send-again"));
    await wf(() => expect(screen.getByTestId("scan-direction")).toBeTruthy());
    expect(confirm).toHaveBeenCalledTimes(2);
    expect(confirm.mock.calls[1]![0]).toEqual(confirm.mock.calls[0]![0]);
    restoreSpies();
  });

  it("Scan: after the ticket's 2 minutes nothing is sent, the screen asks to scan again", async () => {
    readerOn();
    const confirm = spy(clinicCalls, "confirmMark");
    await toChoices();
    await fireEvent.press(screen.getByTestId("scan-choose-in"));
    await wf(() => expect(screen.getByLabelText("Confirm IN")).toBeTruthy());
    const clock = spy(Date, "now").mockReturnValue(Date.now() + 121_000);
    await fireEvent.press(screen.getByTestId("scan-confirm"));
    clock.mockRestore();
    await wf(() => expect(screen.getByTestId("scan-error-title")).toBeTruthy());
    expect(screen.getByText("That took too long")).toBeTruthy();
    expect(confirm).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByTestId("scan-retry"));
    await wf(() => expect(screen.getByTestId("scan-code")).toBeTruthy());
    restoreSpies();
  });

  it("Scan: the camera reading someone else's code says so plainly", async () => {
    await render(<ScanScreen />);
    const g = globalThis as unknown as { __camera?: { onBarcodeScanned?: (r: { data: string }) => void } };
    await act(async () => {
      g.__camera?.onBarcodeScanned?.({ data: clinicMock.qrFor(cohortOne().id) });
    });
    await wf(() => expect(screen.getByTestId("scan-error-title")).toBeTruthy());
    expect(screen.getByText("Not your session")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("scan-retry"));
    await wf(() => expect(screen.getByTestId("scan-code")).toBeTruthy());
  });

  it("Scan: the camera reading my code never marks on its own", async () => {
    const confirm = spy(clinicCalls, "confirmMark");
    await render(<ScanScreen />);
    const g = globalThis as unknown as { __camera?: { onBarcodeScanned?: (r: { data: string }) => void } };
    await act(async () => {
      g.__camera?.onBarcodeScanned?.({ data: clinicMock.qrFor(classToday().id) });
    });
    await wf(() => expect(screen.getByTestId("scan-choose")).toBeTruthy());
    expect(confirm).not.toHaveBeenCalled();
    expect((await clinicCalls.identify({ code: clinicMock.codeFor(classToday().id) })).state).toBe("none");
    restoreSpies();
  });

  it("Schedule shows the week with my OPD days", async () => {
    await render(<ScheduleScreen />);
    await wf(() => expect(screen.getByTestId(`day-${today}`)).toBeTruthy());
    expect(screen.getByText("My OPD days this week")).toBeTruthy();
    expect(screen.getByTestId("day-opd")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("week-next"));
    await wf(() => expect(screen.getByTestId("week-now")).toBeTruthy());
  });

  it("Leave shows leaves left and my requests; asking without a reason is stopped", async () => {
    await render(<LeaveScreen />);
    await wf(() => expect(screen.getByText("Leaves left")).toBeTruthy());
    expect(screen.getByText("Family wedding out of town")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("leave-ask"));
    await wf(() => expect(screen.getByTestId("leave-send")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("leave-send"));
    await wf(() => expect(screen.getByTestId("leave-error")).toBeTruthy());
  });

  it("OPD shows cases done of total and a visit to log", async () => {
    await render(<OpdScreen />);
    await wf(() => expect(screen.getByTestId("opd-cases-line")).toBeTruthy());
    expect(screen.getByText("Log your cases")).toBeTruthy();
  });

  it("Before the clinic is set up (503) the screens say so calmly, and Home shows nothing", async () => {
    clinicMock.setOff(true);
    const v = await render(<LeaveScreen />);
    await wf(() => expect(screen.getByTestId("clinic-off")).toBeTruthy());
    expect(screen.getByText("Not switched on yet")).toBeTruthy();
    await v.unmount();
    await render(<TodayBlock />);
    await new Promise((r) => setTimeout(r, 300));
    expect(screen.queryByTestId("clinic-today")).toBeNull();
  });

  it("My attendance shows the percent", async () => {
    await render(<AttendanceScreen />);
    await wf(() => expect(screen.getByTestId("att-pct")).toBeTruthy());
  });
});

describe("admin clinic screens", () => {
  beforeEach(async () => {
    await signInAs("admin@example.com");
  });

  it("Today lists the sessions with Show code and the clinic places", async () => {
    await render(<AdminClinicScreen />);
    const c = classToday();
    await wf(() => expect(screen.getByTestId(`a-s-${c.id}-code`)).toBeTruthy());
    expect(screen.getByTestId("clinic-leaves")).toBeTruthy();
    expect(screen.getByTestId("clinic-cohort-c1")).toBeTruthy();
  });

  it("The session list marks a student by hand, with a note", async () => {
    const c = classToday();
    params.mockReturnValue({ id: c.id });
    await render(<AdminSessionScreen />);
    await wf(() => expect(screen.getByTestId("roster-u-student")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("roster-u-student"));
    await wf(() => expect(screen.getByTestId("mark-save")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("mark-save"));
    await wf(() => expect(screen.getByText("Write a short note, for example: phone dead.")).toBeTruthy());
    await fireEvent.changeText(screen.getByTestId("mark-note"), "Phone dead");
    await fireEvent.press(screen.getByTestId("mark-save"));
    await wf(() => expect(clinicMock.state().scans[`${c.id}|u-student`]?.manual).toBe(true));
  });

  it("The leave queue approves with the over-limit flag shown", async () => {
    await render(<AdminLeavesScreen />);
    await wf(() => expect(screen.getByTestId("aleave-lv4")).toBeTruthy());
    expect(screen.getByText("Over the limit")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("aleave-lv1-approve"));
    await wf(() => expect(screen.getByTestId("decide-go")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("decide-go"));
    await wf(() => expect(clinicMock.state().leaves.find((l) => l.id === "lv1")?.status).toBe("approved"));
  });

  it("Allowances lists everyone with leaves and cases", async () => {
    await render(<AdminAllowancesScreen />);
    await wf(() => expect(screen.getByTestId("allow-u-student")).toBeTruthy());
  });

  it("Timetable lists the weekly slots", async () => {
    await render(<AdminTimetableScreen />);
    await wf(() => expect(screen.getByTestId("slot-sl3")).toBeTruthy());
  });

  it("OPD generates a draft to publish", async () => {
    await render(<AdminOpdScreen />);
    await wf(() => expect(screen.getByTestId("opd-generate")).toBeTruthy());
    await fireEvent.press(screen.getByTestId("opd-generate"));
    await wf(() => expect(screen.getByTestId("opd-publish")).toBeTruthy());
  });

  it("Trackers list everyone", async () => {
    await render(<AdminTrackersScreen />);
    await wf(() => expect(screen.getByTestId("trk-u-student")).toBeTruthy());
  });

  it("Show code shows the 6 letters, the QR and the seconds left", async () => {
    params.mockReturnValue({ id: classToday().id });
    await render(<ShowCodeScreen />);
    await wf(() => expect(screen.getByTestId("code-text")).toBeTruthy());
    expect(screen.getByTestId("code-text").props.children).toBe(clinicMock.codeFor(classToday().id));
    expect(screen.getByTestId("code-qr")).toBeTruthy();
    expect(screen.getByTestId("code-seconds")).toBeTruthy();
  });

  it("Show code for a session that is not open says when it opens", async () => {
    const later = clinicMock.state().sessions.find((x) => x.date > today && !x.cancelled)!;
    params.mockReturnValue({ id: later.id });
    await render(<ShowCodeScreen />);
    await wf(() => expect(screen.getByTestId("code-error")).toBeTruthy());
  });

});
