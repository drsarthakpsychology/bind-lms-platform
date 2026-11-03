import { describe, expect, it } from "vitest";
import {
  ALL_COHORTS,
  canWatch,
  checkMembershipChange,
  defaultRecordingChoice,
  filterByCohort,
  filterLessons,
  myCohortsFor,
  NO_ACCESS_DATA,
  parseEmails,
  resolveRecordingShare,
  shareLabel,
  type CourseCohortLite,
  type StudentAccess,
} from "./rules";

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

/* A course with two running cohorts and one that has ended. */
const C1: CourseCohortLite = { id: "c1", name: "Cohort 1", status: "active" };
const C2: CourseCohortLite = { id: "c2", name: "Psychology Cohort 2", status: "upcoming" };
const OLD: CourseCohortLite = { id: "c0", name: "Pilot", status: "ended" };
const course = [OLD, C1, C2];

/** Build a student's access from lecture -> cohorts links (as the loader does). */
function accessFor(cohortIds: string[], links: Record<string, string[]>, granted: string[] = []): StudentAccess {
  const mine = new Set(cohortIds);
  const byLesson = new Map<string, string[]>();
  for (const [lesson, cs] of Object.entries(links)) {
    const own = cs.filter((c) => mine.has(c));
    if (own.length) byLesson.set(lesson, own);
  }
  return { cohortIds, cohortLessonIds: new Set(byLesson.keys()), grantedLessonIds: new Set(granted), cohortsByLesson: byLesson };
}

describe("recordings by cohort", () => {
  // rec1: Cohort 1's class; rec2: Cohort 2's class; intro: all cohorts; draft: shared with none.
  const links = { rec1: ["c1"], rec2: ["c2"], intro: ["c1", "c2"] };
  const all = [{ id: "rec1" }, { id: "rec2" }, { id: "intro" }, { id: "draft" }];
  const ids = (a: StudentAccess, legacy = true) => filterLessons(a, all, legacy).map((l) => l.id);

  it("a cohort-only recording is visible to that cohort's members only", () => {
    expect(ids(accessFor(["c1"], links))).toEqual(["rec1", "intro"]);
    expect(ids(accessFor(["c2"], links))).toEqual(["rec2", "intro"]);
    expect(canWatch(accessFor(["c1"], links), "rec2", true)).toBe(false);
    expect(canWatch(accessFor(["c2"], links), "rec1", true)).toBe(false);
  });
  it("an 'all cohorts' video is visible to every cohort", () => {
    for (const c of ["c1", "c2"]) expect(canWatch(accessFor([c], links), "intro", true)).toBe(true);
  });
  it("a student in two cohorts sees both cohorts' recordings", () => {
    expect(ids(accessFor(["c1", "c2"], links))).toEqual(["rec1", "rec2", "intro"]);
  });
  it("a member of another cohort never sees it, even when enrolled in the course", () => {
    const c3 = accessFor(["c3"], links);
    expect(ids(c3, true)).toEqual([]);
    expect(canWatch(c3, "rec1", true)).toBe(false);
  });
  it("a lecture shared with no cohort is hidden from every cohort member", () => {
    expect(canWatch(accessFor(["c1", "c2"], links), "draft", true)).toBe(false);
  });
  it("students in no cohort keep the old rules", () => {
    expect(ids(NO_ACCESS_DATA, true)).toEqual(["rec1", "rec2", "intro", "draft"]);
    expect(ids(NO_ACCESS_DATA, false)).toEqual([]);
  });
  it("a lecture given to one person stays visible on top of their cohort", () => {
    expect(ids(accessFor(["c1"], links, ["rec2"]))).toEqual(["rec1", "rec2", "intro"]);
  });
  it("names only the student's own cohorts on each lecture", () => {
    const a = accessFor(["c1", "c2"], links);
    const mine = [C1, C2].map(({ id, name }) => ({ id, name }));
    expect(myCohortsFor("intro", a.cohortsByLesson, mine).map((c) => c.name)).toEqual(["Cohort 1", "Psychology Cohort 2"]);
    expect(myCohortsFor("rec2", a.cohortsByLesson, mine).map((c) => c.name)).toEqual(["Psychology Cohort 2"]);
    // A single-cohort student's links never mention the other cohort.
    const one = accessFor(["c1"], links);
    expect([...one.cohortsByLesson!.values()].flat()).not.toContain("c2");
    expect(myCohortsFor("intro", one.cohortsByLesson, [{ id: "c1", name: "Cohort 1" }]).map((c) => c.id)).toEqual(["c1"]);
  });
});

describe("upload form: which cohort is this recording for?", () => {
  it("shares only with the picked cohort", () => {
    expect(resolveRecordingShare("c2", course)).toEqual({ ok: true, cohortIds: ["c2"], notice: "Uploaded for Psychology Cohort 2 only." });
  });
  it("'all cohorts' shares with every running cohort, never an ended one", () => {
    expect(resolveRecordingShare(ALL_COHORTS, course)).toEqual({ ok: true, cohortIds: ["c1", "c2"], notice: "Uploaded for all cohorts." });
  });
  it("a choice is required when the course has running cohorts", () => {
    expect(resolveRecordingShare("", course)).toMatchObject({ ok: false });
    expect(resolveRecordingShare(null, course)).toMatchObject({ ok: false });
  });
  it("rejects a cohort from another course, or one that has ended", () => {
    expect(resolveRecordingShare("other-course-cohort", course)).toMatchObject({ ok: false });
    expect(resolveRecordingShare("c0", course)).toMatchObject({ ok: false });
  });
  it("with no running cohort there is nothing to pick and nothing is shared", () => {
    expect(resolveRecordingShare("", [OLD])).toMatchObject({ ok: true, cohortIds: [] });
    expect(resolveRecordingShare(undefined, [])).toMatchObject({ ok: true, cohortIds: [] });
  });
  it("one running cohort reads plainly", () => {
    expect(resolveRecordingShare("c1", [OLD, C1])).toMatchObject({ ok: true, cohortIds: ["c1"], notice: "Uploaded for Cohort 1." });
  });
  it("starts on the cohort in the link, else the only running cohort, else nothing", () => {
    expect(defaultRecordingChoice(course, "c2")).toBe("c2");
    expect(defaultRecordingChoice(course, "c0")).toBe(null);
    expect(defaultRecordingChoice(course, "nope")).toBe(null);
    expect(defaultRecordingChoice(course)).toBe(null);
    expect(defaultRecordingChoice([OLD, C1])).toBe("c1");
    expect(defaultRecordingChoice([C1], "elsewhere")).toBe("c1");
  });
});

describe("admin lecture list", () => {
  it("labels each lecture with its cohorts", () => {
    expect(shareLabel([], course)).toEqual({ kind: "none" });
    expect(shareLabel(["unknown"], course)).toEqual({ kind: "none" });
    expect(shareLabel(["c2"], course)).toEqual({ kind: "some", names: ["Psychology Cohort 2"] });
    expect(shareLabel(["c1", "c2"], course)).toEqual({ kind: "all" });
    // One running cohort: name it rather than say "All cohorts".
    expect(shareLabel(["c1"], [OLD, C1])).toEqual({ kind: "some", names: ["Cohort 1"] });
  });
  it("filters by cohort, or to lectures shared with none", () => {
    const links = new Map([["a", ["c1"]], ["b", ["c1", "c2"]]]);
    const ls = [{ id: "a" }, { id: "b" }, { id: "c" }];
    expect(filterByCohort(ls, links, null).map((l) => l.id)).toEqual(["a", "b", "c"]);
    expect(filterByCohort(ls, links, "c2").map((l) => l.id)).toEqual(["b"]);
    expect(filterByCohort(ls, links, "none").map((l) => l.id)).toEqual(["c"]);
  });
});

describe("course page: one cohort at a time", () => {
  it("adds to one running cohort without touching the others", () => {
    expect(checkMembershipChange("add", "c2", ["c1"], course)).toMatchObject({ ok: true, cohort: { id: "c2" } });
    expect(checkMembershipChange("add", "c1", ["c1"], course)).toMatchObject({ ok: false });
    expect(checkMembershipChange("add", "c0", [], course)).toMatchObject({ ok: false });
  });
  it("takes out of one cohort they are in", () => {
    expect(checkMembershipChange("remove", "c1", ["c1", "c2"], course)).toMatchObject({ ok: true, cohort: { id: "c1" } });
    expect(checkMembershipChange("remove", "c2", ["c1"], course)).toMatchObject({ ok: false });
  });
  it("refuses a cohort that isn't in this course", () => {
    expect(checkMembershipChange("add", "zz", [], course)).toEqual({ ok: false, error: "That cohort isn't in this course." });
  });
});
