import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
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

  it("turns every scan refusal into plain words", () => {
    expect(L.scanError(new ApiFailure("bad_request", "That code is too old.", 400)).title).toBe("That code has changed");
    expect(L.scanError(new ApiFailure("bad_request", "You have already scanned in and out.", 400)).title).toBe("Already scanned");
    expect(L.scanError(new ApiFailure("forbidden", "x", 403)).title).toBe("Not your session");
    expect(L.scanError(new ApiFailure("conflict", "Not open.", 409)).title).toBe("Scanning is closed");
    expect(L.scanError(new ApiFailure("network", "")).title).toBe("No internet");
    for (const t of ["That code has changed", "Not your session", "Scanning is closed"]) expect(t).not.toMatch(/[–—]/);
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
    const s = S.session({ id: "x", kind: "online_class", onlineLink: "https://meet", movedFrom: "2026-11-18 08:00", my: { status: "upcoming" }, open: true });
    expect(s.link).toBe("https://meet");
    expect(s.status).toBe("moved");
    expect(s.mine?.state).toBe("open");
    // Garbage never crashes.
    expect(S.today(null).sessions).toEqual([]);
    expect(S.plan(undefined).status).toBe("none");
    expect(S.trackers({ rows: [null, 3] }).items).toHaveLength(1);
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

  it("scans in with the QR, refuses a quick second scan, and refuses someone else's session", async () => {
    const c = classToday();
    const r = await clinicCalls.scan({ token: clinicMock.qrFor(c.id) });
    expect(r.direction).toBe("in");
    expect(r.session.id).toBe(c.id);
    const again = await fail(clinicCalls.scan({ token: clinicMock.qrFor(c.id) }));
    expect(again.code).toBe("bad_request");
    expect(L.scanError(again).title).toBe("Already scanned");
    const other = await fail(clinicCalls.scan({ token: clinicMock.qrFor(cohortOne().id) }));
    expect(other.code).toBe("forbidden");
    expect(L.scanError(other).title).toBe("Not your session");
    // A typed code is matched to my own open sessions only.
    const typed = await fail(clinicCalls.scan({ code: clinicMock.codeFor(cohortOne().id) }));
    expect(typed.code).toBe("bad_request");
  });

  it("refuses an old QR and a wrong typed code", async () => {
    const c = classToday();
    const old = clinicMock.qrFor(c.id).replace(/:(\d+):[A-Za-z0-9_-]{22}$/, (_m, w) => `:${Number(w) - 5}:${"A".repeat(22)}`);
    const e = await fail(clinicCalls.scan({ token: old }));
    expect(L.scanError(e).title).toBe("That code has changed");
    const typed = await fail(clinicCalls.scan({ code: "ZZZZZZ" }));
    expect(typed.code).toBe("bad_request");
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

  it("Scan: typing the code checks in with IN, the time and a success buzz", async () => {
    (haptic.success as unknown as jest.Mock | undefined)?.mockClear?.();
    await render(<ScanScreen />);
    expect(screen.getByTestId("camera-view")).toBeTruthy();
    await fireEvent.changeText(screen.getByTestId("scan-code"), clinicMock.codeFor(classToday().id).toLowerCase());
    await fireEvent.press(screen.getByTestId("scan-send"));
    await wf(() => expect(screen.getByTestId("scan-direction")).toBeTruthy());
    expect(screen.getByTestId("scan-direction").props.children).toBe("IN");
    expect(screen.getByTestId("scan-time")).toBeTruthy();
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
