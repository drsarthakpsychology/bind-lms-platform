// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { ClinicAttendanceRow, ClinicLeaveQueue, ClinicPlan, ClinicSlot, ClinicTrackerRow } from "@/lib/clinic/types";
import { bulkBody } from "./allowances";
import { LeaveQueue } from "./leave-queue";
import { filterRows, sortRows } from "./live-attendance";
import { OpdPlan } from "./opd";
import { holidaysFrom, planRows, planSummary, seatsFrom } from "./opd-logic";
import { nextDelay, spaced } from "./show-code";
import { defaultCompulsory, slotsByDay } from "./timetable";
import { cohortTotals } from "./trackers";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: () => undefined }) }));

const row = (o: Partial<ClinicAttendanceRow>): ClinicAttendanceRow => ({ userId: "u", name: "A", roll: null, status: "upcoming", inAt: null, outAt: null, late: false, minutes: null, manual: false, note: null, earlyLeaveAt: null, ...o });

describe("live attendance", () => {
  const rows = [
    row({ userId: "1", name: "Zoya", status: "present", inAt: "x", outAt: "y" }),
    row({ userId: "2", name: "Aarav", status: "in", inAt: "x" }),
    row({ userId: "3", name: "Meera", status: "upcoming" }),
    row({ userId: "4", name: "Kabir", status: "on_leave" }),
    row({ userId: "5", name: "Dev", status: "late", inAt: "x", late: true }),
  ];
  it("missing means no scan in and not on leave", () => {
    expect(filterRows(rows, "missing").map((r) => r.userId)).toEqual(["3"]);
    expect(filterRows(rows, "in").map((r) => r.userId)).toEqual(["2", "5"]);
    expect(filterRows(rows, "late").map((r) => r.userId)).toEqual(["5"]);
    expect(filterRows(rows, "out").map((r) => r.userId)).toEqual(["1"]);
  });
  it("puts the missing first, then those in, then those who left", () => {
    expect(sortRows(rows).map((r) => r.name)).toEqual(["Meera", "Aarav", "Dev", "Zoya", "Kabir"]);
  });
});

describe("show code", () => {
  it("splits the code for reading aloud and asks again just after the window ends", () => {
    expect(spaced("K7M4QX")).toBe("K7M 4QX");
    expect(nextDelay(12_000)).toBe(12_150);
    expect(nextDelay(0)).toBe(1000);
    expect(nextDelay(90_000)).toBe(30_000);
  });
});

describe("leaves allowed", () => {
  it("no ticks means the whole cohort", () => {
    expect(bulkBody("c1", [], "set", 5, "")).toEqual({ cohortId: "c1", set: 5 });
    expect(bulkBody("c1", ["u1"], "add", 1, " illness ")).toEqual({ cohortId: "c1", userIds: ["u1"], add: 1, note: "illness" });
  });
});

describe("OPD", () => {
  it("reads the seat grid and holidays", () => {
    expect(seatsFrom({ "1": { morning: "3", evening: "" }, "6": { morning: "0", evening: "" }, "5": { morning: "", evening: "2" } })).toEqual({ "1": { morning: 3 }, "5": { evening: 2 } });
    expect(holidaysFrom("2026-12-25, 2026-12-25\n2026-01-26 nonsense 2026-13-40")).toEqual(["2026-01-26", "2026-12-25"]);
  });

  const plan: ClinicPlan = {
    v: 1,
    cohortId: "c1",
    state: "draft",
    hasDraft: true,
    from: "2026-11-18",
    to: "2026-11-30",
    days: [
      { date: "2026-11-18", weekday: 3, morning: { seats: 3, people: [{ assignmentId: "a1", userId: "u1", name: "Aarav Mehta", source: "new" }] }, evening: { seats: 0, people: [] } },
      { date: "2026-11-21", weekday: 6, morning: { seats: 0, people: [] }, evening: { seats: 0, people: [] } },
    ],
    short: [],
    noBatch: [],
  };
  it("shows only days with seats or people", () => {
    expect(planRows(plan).map((d) => d.date)).toEqual(["2026-11-18"]);
    expect(planSummary(plan)).toBe("1 visit over 1 day");
  });
  it("View Admin sees the calendar without Generate, Publish or move buttons", () => {
    const a = { generate: vi.fn(), move: vi.fn(), publish: vi.fn(), discard: vi.fn() };
    render(<OpdPlan plan={plan} actions={a} canWrite={false} />);
    expect(screen.getByText("Aarav Mehta")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Publish|Generate/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /Aarav Mehta/ })).toBeNull();
  });
  it("a Super Admin can pick a name to move it", () => {
    const a = { generate: vi.fn(), move: vi.fn(), publish: vi.fn(), discard: vi.fn() };
    render(<OpdPlan plan={plan} actions={a} canWrite />);
    expect(screen.getByRole("button", { name: "Publish" })).toBeInTheDocument();
    screen.getByRole("button", { name: /Aarav Mehta/ }).click();
    expect(screen.getByRole("status")).toHaveTextContent("Moving Aarav Mehta");
  });
});

describe("timetable", () => {
  const sl = (id: string, weekday: number, start: string): ClinicSlot => ({ id, cohortIds: ["c1"], weekday, start, end: "23:00", kind: "class", title: "x", place: null, onlineLink: null, compulsory: true, validFrom: null, validTo: null, active: true });
  it("Monday first, Sunday last, by start time", () => {
    expect(slotsByDay([sl("a", 0, "09:00"), sl("b", 1, "17:00"), sl("c", 1, "08:00")]).map((d) => [d.weekday, d.slots.map((s) => s.id)])).toEqual([
      [1, ["c", "b"]],
      [0, ["a"]],
    ]);
  });
  it("OPD is not for everyone, classes are", () => {
    expect(defaultCompulsory("opd_evening")).toBe(false);
    expect(defaultCompulsory("class")).toBe(true);
  });
});

describe("leave queue", () => {
  const q: ClinicLeaveQueue = {
    v: 1,
    requests: [
      { id: "r1", userId: "u1", cohortId: "c1", kind: "leave", sessions: [{ id: "s", date: "2026-11-21", start: "10:00", title: "Saturday class" }], leaveAt: null, reason: "Family", status: "pending", overLimit: true, cost: 1, decidedAt: null, decisionNote: null, createdAt: "x", name: "Zoya Qureshi", roll: null, balance: { allowance: 5, used: 5, pending: 1, left: 0 }, overLimitNow: true },
    ],
  };
  it("marks over the limit and hides Approve for View Admin", () => {
    render(<LeaveQueue data={q} decide={vi.fn()} canWrite={false} />);
    expect(screen.getByText("Over the limit")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Approve" })).toBeNull();
  });
  it("Super Admin gets Approve and Reject", () => {
    render(<LeaveQueue data={q} decide={vi.fn()} canWrite />);
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject" })).toBeInTheDocument();
  });
});

describe("trackers", () => {
  it("averages attendance over students with any sessions due", () => {
    const r = (p: number | null, due: number): ClinicTrackerRow => ({ userId: "u", name: null, roll: null, batch: null, attendance: { required: 1, attended: 1, late: 0, onLeave: 0, absent: 0, noScanOut: 0, percent: p, minutes: 0 }, leave: { allowance: 5, used: 5, pending: 0, left: 0 }, cases: { base: 8, extras: [], total: 8, done: 2, pending: 6 }, visits: { planned: 4, done: 1, absent: 0, missed: 0, due } });
    expect(cohortTotals([r(80, 1), r(100, 0), r(null, 2)])).toEqual({ attendance: 90, casesDone: 6, casesTotal: 24, logsDue: 3, noLeaves: 3 });
  });
});
