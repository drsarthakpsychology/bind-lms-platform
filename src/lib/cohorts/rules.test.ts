import { describe, expect, it } from "vitest";
import { canWatch, filterLessons, NO_ACCESS_DATA, parseEmails, type StudentAccess } from "./rules";

const c1: StudentAccess = { cohortIds: ["c1"], cohortLessonIds: new Set(["a", "b"]), grantedLessonIds: new Set() };
const lessons = [{ id: "a" }, { id: "b" }, { id: "c" }];

describe("lecture access by cohort", () => {
  it("a cohort member sees only their cohort's lectures", () => {
    expect(filterLessons(c1, lessons, true).map((l) => l.id)).toEqual(["a", "b"]);
    expect(canWatch(c1, "c", true)).toBe(false);
  });
  it("a lecture given to one person is visible to them", () => {
    const g = { ...c1, grantedLessonIds: new Set(["c"]) };
    expect(filterLessons(g, lessons, true).map((l) => l.id)).toEqual(["a", "b", "c"]);
  });
  it("someone in no cohort keeps the old rule", () => {
    expect(filterLessons(NO_ACCESS_DATA, lessons, true)).toHaveLength(3);
    expect(filterLessons(NO_ACCESS_DATA, lessons, false)).toHaveLength(0);
    const g = { ...NO_ACCESS_DATA, grantedLessonIds: new Set(["c"]) };
    expect(filterLessons(g, lessons, false).map((l) => l.id)).toEqual(["c"]);
  });
  it("a new cohort with no lectures shared sees none, even with old enrolment", () => {
    const c2: StudentAccess = { cohortIds: ["c2"], cohortLessonIds: new Set(), grantedLessonIds: new Set() };
    expect(filterLessons(c2, lessons, true)).toHaveLength(0);
  });
  it("admins see everything", () => {
    expect(filterLessons({ ...c1, cohortLessonIds: new Set() }, lessons, false, true)).toHaveLength(3);
  });
});

describe("pasted emails", () => {
  it("splits on commas, spaces and lines, removes repeats and flags bad ones", () => {
    const r = parseEmails("a@x.com, B@x.com\nb@x.com; not-an-email <c@y.in>");
    expect(r.valid).toEqual(["a@x.com", "b@x.com", "c@y.in"]);
    expect(r.invalid).toEqual(["not-an-email"]);
  });
});
