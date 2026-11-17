import { describe, expect, it } from "vitest";
import { isHiddenAccount } from "@/lib/people/hidden";
import {
  canSeeAuthor,
  cohortsAllowed,
  cohortsFor,
  dropTestCohorts,
  isTestCohort,
  recipientsFor,
  scopeOf,
  testCohortName,
  testEmailFor,
  type TestLink,
  type TestScope,
} from "./rules";

const ADMIN = "aaaaaaaa-0000-4000-8000-000000000001";
const TEST = "bbbbbbbb-0000-4000-8000-000000000002";
const COHORT = "cccccccc-0000-4000-8000-000000000003";
const link = (active: boolean): TestLink => ({ adminId: ADMIN, testUserId: TEST, testCohortId: COHORT, mirrorCohortId: null, active });
const asAdmin: TestScope = { as: "admin", adminId: ADMIN, testUserId: TEST, testCohortId: COHORT };
const asStudent: TestScope = { ...asAdmin, as: "student" };

describe("scopeOf", () => {
  it("admin is sandboxed only while test mode is on", () => {
    expect(scopeOf("admin", ADMIN, link(true))?.as).toBe("admin");
    expect(scopeOf("view_admin", ADMIN, link(true))?.as).toBe("admin");
    expect(scopeOf("admin", ADMIN, link(false))).toBeNull();
  });
  it("the test student is always sandboxed", () => {
    expect(scopeOf("student", TEST, link(false))?.as).toBe("student");
    expect(scopeOf("student", TEST, link(true))?.as).toBe("student");
  });
  it("nobody else is", () => {
    expect(scopeOf("student", "someone", link(true))).toBeNull();
    expect(scopeOf("admin", ADMIN, null)).toBeNull();
  });
});

describe("the test student is hidden everywhere real people look", () => {
  it("its email is a reserved test address caught by the robot rule", () => {
    expect(testEmailFor(ADMIN)).toMatch(/\.invalid$/);
    expect(isHiddenAccount({ email: testEmailFor(ADMIN), is_test: false })).toBe(true);
    expect(isHiddenAccount({ email: "x@gmail.com", is_test: true })).toBe(true);
  });
});

describe("notifications (recipientsFor)", () => {
  const hidden = new Set([TEST]);
  it("a real send never reaches a test account", () => {
    expect(recipientsFor(["s1", TEST, "s2", "s1"], null, hidden)).toEqual(["s1", "s2"]);
  });
  it("an admin in test mode reaches only the test student, even when real people were picked", () => {
    expect(recipientsFor(["s1", "s2"], asAdmin, hidden)).toEqual([TEST]);
    expect(recipientsFor([TEST, "s1"], asAdmin, hidden)).toEqual([TEST]);
    expect(recipientsFor([], asAdmin, hidden)).toEqual([]);
  });
  it("the test student's actions tell only itself and its own admin", () => {
    expect(recipientsFor(["otherAdmin", ADMIN], asStudent, hidden)).toEqual([ADMIN]);
    expect(recipientsFor(["otherAdmin"], asStudent, hidden)).toEqual([]);
  });
});

describe("clinic cohorts (cohortsFor, cohortsAllowed)", () => {
  const rows = [
    { id: "real1", name: "Cohort 1" },
    { id: COHORT, name: testCohortName(ADMIN), is_test: true },
    { id: "other-test", name: testCohortName("dddddddd-0000") },
  ];
  it("real admins never see test cohorts", () => {
    expect(cohortsFor(rows, null).map((r) => r.id)).toEqual(["real1"]);
  });
  it("in test mode only the admin's own test cohort", () => {
    expect(cohortsFor(rows, asAdmin).map((r) => r.id)).toEqual([COHORT]);
    expect(cohortsAllowed([COHORT], asAdmin)).toBe(true);
    expect(cohortsAllowed([COHORT, "real1"], asAdmin)).toBe(false);
    expect(cohortsAllowed(["real1"], asAdmin)).toBe(false);
    expect(cohortsAllowed(["real1"], null)).toBe(true);
  });
});

describe("cohort stats (dropTestCohorts)", () => {
  it("drops flagged and reserved-name cohorts, before and after the database step", () => {
    expect(isTestCohort({ name: "Test mode ABCD1234" })).toBe(true);
    expect(isTestCohort({ name: "Cohort 2", is_test: true })).toBe(true);
    expect(isTestCohort({ name: "Testing cohort" })).toBe(false);
    expect(dropTestCohorts([{ name: "Cohort 1" }, { name: "Test mode X" }]).map((c) => c.name)).toEqual(["Cohort 1"]);
  });
});

describe("posts by the test student (canSeeAuthor)", () => {
  const hidden = new Set([TEST]);
  it("real authors show to everyone", () => expect(canSeeAuthor("s1", "s2", null, hidden)).toBe(true));
  it("a test post shows to the test student and its admin in test mode only", () => {
    expect(canSeeAuthor(TEST, "s2", null, hidden)).toBe(false);
    expect(canSeeAuthor(TEST, TEST, asStudent, hidden)).toBe(true);
    expect(canSeeAuthor(TEST, ADMIN, asAdmin, hidden)).toBe(true);
    expect(canSeeAuthor(TEST, ADMIN, null, hidden)).toBe(false);
  });
});
