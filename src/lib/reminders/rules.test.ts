import { describe, expect, it } from "vitest";
import type { ClinicLeaveBalance, ClinicMySession, ClinicVisit } from "@/lib/app-api/contract";
import { instant } from "@/lib/clinic/time";
import { allowed, clock, clockAmPm, DEFAULT_REMINDERS, dueFor, keyOf, type StudentFacts } from "./rules";

const DAY = "2026-11-18"; // a Wednesday
/** An instant at India time on DAY. */
const at = (t: string, date = DAY) => instant(date, t);

const ANU = "u-anu";
const RAVI = "u-ravi";

function session(over: Partial<ClinicMySession> & { my?: Partial<ClinicMySession["my"]> } = {}): ClinicMySession {
  const { my, ...rest } = over;
  return {
    id: "s-class",
    cohortIds: ["c1"],
    date: DAY,
    start: "10:00",
    end: "13:00",
    kind: "class",
    title: "Class",
    place: "Room 2",
    onlineLink: null,
    compulsory: true,
    status: "scheduled",
    origin: "timetable",
    note: null,
    movedFrom: null,
    batch: null,
    required: true,
    assigned: false,
    open: false,
    ...rest,
    my: { status: "upcoming", inAt: null, outAt: null, late: false, minutes: null, leaveId: null, earlyLeaveAt: null, ...my },
  };
}

const opdSession = (over: Partial<ClinicMySession> & { my?: Partial<ClinicMySession["my"]> } = {}) =>
  session({ id: "s-opd", kind: "opd_evening", title: "OPD evening", start: "17:00", end: "20:00", place: "Clinic, Navrangpura", batch: "evening", assigned: true, ...over });

const visit = (over: Partial<ClinicVisit> = {}): ClinicVisit => ({
  assignmentId: "a-1",
  date: DAY,
  batch: "evening",
  start: "17:00",
  end: "20:00",
  sessionId: "s-opd",
  state: "today",
  log: null,
  ...over,
});

const bal = (over: Partial<ClinicLeaveBalance> = {}): ClinicLeaveBalance => ({ allowance: 4, used: 0, pending: 0, left: 4, ...over });

const facts = (over: Partial<StudentFacts> = {}): StudentFacts => ({ userId: ANU, cohortId: "c1", sessions: [], visits: [], balance: bal(), ...over });

const kinds = (f: StudentFacts, now: number) => dueFor(f, now).map((r) => r.kind);

describe("time words", () => {
  it("speaks clock times plainly", () => {
    expect(clock("17:00")).toBe("5");
    expect(clock("17:30:00")).toBe("5:30");
    expect(clock("08:00")).toBe("8");
    expect(clock("12:15")).toBe("12:15");
    expect(clockAmPm("08:00")).toBe("8 am");
    expect(clockAmPm("18:30")).toBe("6:30 pm");
    expect(clockAmPm("12:00")).toBe("12 pm");
  });
});

describe("OPD today (morning of an OPD day)", () => {
  const f = facts({ sessions: [opdSession()], visits: [visit()] });

  it("goes at 7 am India time with the batch and times", () => {
    expect(kinds(f, at("06:59"))).toEqual([]);
    const r = dueFor(f, at("07:00"));
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ userId: ANU, kind: "opdDay", ref: "a-1", title: "OPD today, evening 5 to 8", text: "At Clinic, Navrangpura. Scan in when you arrive." });
    // 7:00 IST is 01:30 UTC.
    expect(new Date(at("07:00")).toISOString()).toBe("2026-11-18T01:30:00.000Z");
  });

  it("stays due until the OPD starts, then stops", () => {
    expect(kinds(f, at("16:59"))).toContain("opdDay");
    expect(kinds(f, at("17:00"))).not.toContain("opdDay");
  });

  it("an early morning OPD is reminded one hour before it starts", () => {
    const early = facts({ sessions: [opdSession({ start: "06:30", end: "08:30", kind: "opd_morning", batch: "morning" })], visits: [visit({ batch: "morning", start: "06:30", end: "08:30" })] });
    expect(kinds(early, at("05:29"))).toEqual([]);
    expect(dueFor(early, at("05:30"))[0]).toMatchObject({ kind: "opdDay", title: "OPD today, morning 6:30 to 8:30" });
  });

  it("not on another day, not when on leave or already logged, not when cancelled", () => {
    expect(kinds(facts({ sessions: [opdSession({ date: "2026-11-19" })], visits: [visit({ date: "2026-11-19" })] }), at("07:10"))).toEqual([]);
    expect(kinds(facts({ sessions: [opdSession()], visits: [visit({ state: "on_leave" })] }), at("07:10"))).toEqual([]);
    expect(kinds(facts({ sessions: [opdSession()], visits: [visit({ state: "done", log: { cases: 2, absent: false, note: null } })] }), at("07:10"))).toEqual([]);
    expect(kinds(facts({ sessions: [opdSession({ status: "cancelled" })], visits: [visit()] }), at("07:10"))).toEqual([]);
  });

  it("an OPD day with no session made yet still gets the batch, without times", () => {
    const r = dueFor(facts({ visits: [visit({ sessionId: null, start: null, end: null })] }), at("07:05"));
    expect(r[0]).toMatchObject({ kind: "opdDay", title: "OPD today, evening", text: "Scan in when you arrive." });
  });

  it("India time decides the day: 1 am UTC on the 18th is 6:30 am on the 18th", () => {
    expect(kinds(f, Date.parse("2026-11-18T01:45:00Z"))).toContain("opdDay"); // 07:15 IST
    expect(kinds(f, Date.parse("2026-11-17T23:00:00Z"))).toEqual([]); // 04:30 IST
  });
});

describe("30 minutes before a session they must attend", () => {
  it("goes 30 minutes before a compulsory class and stops at the start", () => {
    const f = facts({ sessions: [session()] });
    expect(kinds(f, at("09:29"))).toEqual([]);
    expect(dueFor(f, at("09:30"))[0]).toMatchObject({ kind: "sessionSoon", ref: "s-class", title: "Class in 30 minutes", text: "Starts at 10 am. At Room 2." });
    expect(dueFor(f, at("09:48"))[0]!.title).toBe("Class in 10 minutes");
    expect(kinds(f, at("10:00"))).toEqual([]);
  });

  it("online classes point to the link", () => {
    const f = facts({ sessions: [session({ kind: "online_class", title: "Online class", place: null, onlineLink: "https://meet.example/x", start: "18:00", end: "19:00" })] });
    expect(dueFor(f, at("17:30"))[0]!.text).toBe("Starts at 6 pm. Online. The link is on your schedule.");
  });

  it("OPD sessions only for the students assigned that day", () => {
    expect(kinds(facts({ sessions: [opdSession()] , visits: [visit()] }), at("16:35"))).toEqual(["opdDay", "sessionSoon"]);
    expect(kinds(facts({ sessions: [opdSession({ required: false, assigned: false, my: { status: "not_required" } })] }), at("16:35"))).toEqual([]);
  });

  it("not when on leave, not when already scanned in, not for optional or cancelled sessions", () => {
    expect(kinds(facts({ sessions: [session({ my: { status: "on_leave", leaveId: "l1" } })] }), at("09:40"))).toEqual([]);
    expect(kinds(facts({ sessions: [session({ my: { status: "in", inAt: "2026-11-18T04:05:00Z" } })] }), at("09:40"))).toEqual([]);
    expect(kinds(facts({ sessions: [session({ required: false, compulsory: false })] }), at("09:40"))).toEqual([]);
    expect(kinds(facts({ sessions: [session({ status: "cancelled", my: { status: "cancelled" } })] }), at("09:40"))).toEqual([]);
  });
});

describe("you forgot to scan out", () => {
  const inside = { status: "in" as const, inAt: "2026-11-18T04:30:00Z" };

  it("goes 10 minutes after the end while scanning is still open", () => {
    const f = facts({ sessions: [session({ my: inside })] });
    expect(kinds(f, at("13:09"))).toEqual([]);
    expect(dueFor(f, at("13:10"))[0]).toMatchObject({ kind: "scanOut", ref: "s-class", title: "You forgot to scan out", text: "Scan out of Class now, or tell the admin when you left." });
    expect(kinds(f, at("13:59"))).toEqual(["scanOut"]);
    expect(kinds(f, at("14:00"))).toEqual([]); // scanning closed
  });

  it("not when scanned out, not when never scanned in", () => {
    expect(kinds(facts({ sessions: [session({ my: { ...inside, status: "present", outAt: "2026-11-18T07:30:00Z" } })] }), at("13:20"))).toEqual([]);
    expect(kinds(facts({ sessions: [session({ my: { status: "absent" } })] }), at("13:20"))).toEqual([]);
  });

  it("with approved early leave it goes 10 minutes after the leave time", () => {
    const f = facts({ sessions: [session({ my: { ...inside, earlyLeaveAt: "11:30" } })] });
    expect(kinds(f, at("11:39"))).toEqual([]);
    expect(kinds(f, at("11:40"))).toEqual(["scanOut"]);
  });
});

describe("log your cases (the evening after an OPD visit)", () => {
  it("evening OPD: 8:30 pm until 11:30 pm when no log is in", () => {
    const f = facts({ sessions: [opdSession({ my: { status: "present", inAt: "x", outAt: "y" } })], visits: [visit()] });
    expect(kinds(f, at("20:29"))).toEqual([]);
    expect(dueFor(f, at("20:30"))[0]).toMatchObject({ kind: "caseLog", ref: "a-1", title: "Log your cases", link: "/opd" });
    expect(kinds(f, at("23:29"))).toEqual(["caseLog"]);
    expect(kinds(f, at("23:30"))).toEqual([]);
  });

  it("a late OPD ending at 8:30 pm waits 30 minutes after the end", () => {
    const f = facts({ sessions: [opdSession({ end: "20:30" })], visits: [visit({ end: "20:30" })] });
    expect(kinds(f, at("20:45"))).toEqual([]);
    expect(kinds(f, at("21:00"))).toEqual(["caseLog"]);
  });

  it("morning OPD students are asked in the evening too", () => {
    const f = facts({ sessions: [opdSession({ start: "08:00", end: "10:00", kind: "opd_morning", batch: "morning" })], visits: [visit({ batch: "morning", start: "08:00", end: "10:00" })] });
    expect(kinds(f, at("12:00"))).toEqual([]);
    expect(kinds(f, at("20:30"))).toEqual(["caseLog"]);
  });

  it("not when logged, on leave, or the OPD was cancelled", () => {
    expect(kinds(facts({ sessions: [opdSession()], visits: [visit({ state: "done", log: { cases: 0, absent: false, note: null } })] }), at("21:00"))).toEqual([]);
    expect(kinds(facts({ sessions: [opdSession({ my: { status: "on_leave", leaveId: "l" } })], visits: [visit({ state: "on_leave" })] }), at("21:00"))).toEqual([]);
    expect(kinds(facts({ sessions: [opdSession({ status: "cancelled" })], visits: [visit()] }), at("21:00"))).toEqual([]);
  });
});

describe("only 1 leave left", () => {
  it("when leaves left drop to 1, in the day", () => {
    const f = facts({ balance: bal({ allowance: 4, used: 3, left: 1 }) });
    expect(kinds(f, at("07:59"))).toEqual([]);
    expect(dueFor(f, at("08:00"))[0]).toMatchObject({ kind: "leaveLow", ref: "c1:4", title: "Only 1 leave left", text: "You have used 3 of your 4 leaves.", link: "/leave" });
    expect(kinds(f, at("21:30"))).toEqual([]);
  });

  it("not with 2 or 0 left, and not for an allowance of 1 never used", () => {
    expect(kinds(facts({ balance: bal({ used: 2, left: 2 }) }), at("12:00"))).toEqual([]);
    expect(kinds(facts({ balance: bal({ used: 4, left: 0 }) }), at("12:00"))).toEqual([]);
    expect(kinds(facts({ balance: bal({ allowance: 1, used: 0, left: 1 }) }), at("12:00"))).toEqual([]);
  });

  it("a raised allowance that drops to 1 again is a new reminder", () => {
    const a = dueFor(facts({ balance: bal({ allowance: 4, used: 3, left: 1 }) }), at("12:00"))[0]!;
    const b = dueFor(facts({ balance: bal({ allowance: 6, used: 5, left: 1 }) }), at("12:00"))[0]!;
    expect(keyOf(a)).not.toBe(keyOf(b));
  });
});

describe("each student's own switches", () => {
  it("drops the kinds a student turned off; everyone else gets every kind", () => {
    const list = [
      ...dueFor(facts({ userId: ANU, sessions: [session()] }), at("09:30")),
      ...dueFor(facts({ userId: RAVI, sessions: [session()] }), at("09:30")),
    ];
    const out = allowed(list, new Map([[ANU, { ...DEFAULT_REMINDERS, sessionSoon: false }]]));
    expect(out.map((r) => r.userId)).toEqual([RAVI]);
  });
});
