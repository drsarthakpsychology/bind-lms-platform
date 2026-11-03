import { describe, expect, it } from "vitest";
import {
  DEFAULT_QUIET_DAYS,
  inactiveDaysOf,
  isNudgeable,
  parseQuietDays,
  personalise,
  selectQuietStudents,
  type NudgeStudent,
} from "./select";

const today = new Date("2026-11-03T12:00:00Z");
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000).toISOString();

const s = (over: Partial<NudgeStudent> & { id: string }): NudgeStudent => ({
  name: over.id,
  email: `${over.id}@gmail.com`,
  cohortIds: ["c1"],
  lastActiveAt: null,
  hours: 0,
  ...over,
});

describe("selectQuietStudents", () => {
  const students = [
    s({ id: "active", lastActiveAt: daysAgo(1), hours: 12 }),
    s({ id: "quiet12", lastActiveAt: daysAgo(12), hours: 3 }),
    s({ id: "never" }),
    s({ id: "quiet7", lastActiveAt: daysAgo(7) }),
    s({ id: "quiet6", lastActiveAt: daysAgo(6.5) }),
    s({ id: "otherCohort", cohortIds: ["c2"], lastActiveAt: daysAgo(40) }),
    s({ id: "blocked", status: "blocked" }),
    s({ id: "tester", isTest: true }),
    s({ id: "robot", email: "e2e-bot@gmail.com" }),
    s({ id: "boss", role: "admin" }),
  ];

  it("orders never started first, then most quiet", () => {
    const rows = selectQuietStudents(students, { cohort: "all", days: 7, today });
    expect(rows.map((r) => r.id)).toEqual(["never", "otherCohort", "quiet12", "quiet7", "quiet6", "active"]);
  });

  it("pre-ticks never started and quiet for the threshold or more", () => {
    const rows = selectQuietStudents(students, { cohort: "all", days: 7, today });
    const ticked = rows.filter((r) => r.preselected).map((r) => r.id);
    expect(ticked).toEqual(["never", "otherCohort", "quiet12", "quiet7"]);
    expect(rows.find((r) => r.id === "quiet12")).toMatchObject({ inactiveDays: 12, neverStarted: false });
    expect(rows.find((r) => r.id === "never")).toMatchObject({ inactiveDays: null, neverStarted: true });
  });

  it("moves with the days threshold", () => {
    const ticked3 = selectQuietStudents(students, { cohort: "all", days: 3, today }).filter((r) => r.preselected).map((r) => r.id);
    expect(ticked3).toContain("quiet6");
    const ticked30 = selectQuietStudents(students, { cohort: "all", days: 30, today }).filter((r) => r.preselected).map((r) => r.id);
    expect(ticked30).toEqual(["never", "otherCohort"]);
  });

  it("filters to one cohort", () => {
    const rows = selectQuietStudents(students, { cohort: "c2", days: 7, today });
    expect(rows.map((r) => r.id)).toEqual(["otherCohort"]);
  });

  it("never lists blocked, test, robot or admin accounts", () => {
    const ids = selectQuietStudents(students, { cohort: "all", days: 7, today }).map((r) => r.id);
    for (const bad of ["blocked", "tester", "robot", "boss"]) expect(ids).not.toContain(bad);
  });

  it("returns nothing for an empty list", () => {
    expect(selectQuietStudents([], { cohort: "all", days: 7, today })).toEqual([]);
  });
});

describe("helpers", () => {
  it("inactiveDaysOf floors and clamps", () => {
    expect(inactiveDaysOf(null, today)).toBeNull();
    expect(inactiveDaysOf("not a date", today)).toBeNull();
    expect(inactiveDaysOf(daysAgo(2.9), today)).toBe(2);
    expect(inactiveDaysOf(daysAgo(-1), today)).toBe(0);
  });

  it("parseQuietDays only accepts the offered options", () => {
    expect(parseQuietDays("14")).toBe(14);
    expect(parseQuietDays("5")).toBe(DEFAULT_QUIET_DAYS);
    expect(parseQuietDays(undefined)).toBe(DEFAULT_QUIET_DAYS);
  });

  it("personalise uses the first name", () => {
    expect(personalise("Hi {name}, {name}!", "Asha Rao")).toBe("Hi Asha, Asha!");
    expect(personalise("Hi {name}", "  ")).toBe("Hi there");
  });

  it("isNudgeable needs a real email", () => {
    expect(isNudgeable({ email: "" })).toBe(false);
    expect(isNudgeable({ email: "a@gmail.com", status: "active", role: "student" })).toBe(true);
  });
});
