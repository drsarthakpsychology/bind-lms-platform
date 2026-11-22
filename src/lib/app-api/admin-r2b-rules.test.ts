import { describe, expect, it } from "vitest";
import { learnerRow, learnerStudy, roleChangeProblem, roleUpdate } from "./admin-r2b-rules";

const catalog = {
  modules: [
    { id: "m1", num: 1, title: "Taking a history", sections: ["s1", "s2"] },
    { id: "m2", num: 2, title: "Mental state", sections: ["s1", "s2", "s3"] },
  ],
  experiments: [],
  conceptLabel: (id: string) => ({ flat: "Flat affect", blunted: "Blunted affect" })[id],
};

const state = {
  xp: 340,
  answered: 20,
  correct: 15,
  study: { done: { "m1/s1": "2026-11-18", "m1/s2": "2026-11-19", "m2/s1": "2026-11-20", "m9/x": "2026-11-21" }, tests: { m1: { best: 9, total: 10, day: "2026-11-19" }, m2: { best: 2, total: 5, day: "2026-11-20" } }, written: {} },
  coach: { confusions: { "flat|blunted": 4, "a|b": 1 } },
};

describe("learnerStudy", () => {
  it("reads modules, scores and weak topics from the saved state", () => {
    const s = learnerStudy(state, catalog);
    expect(s.modules.map((m) => [m.id, m.sectionsDone, m.testPct])).toEqual([["m1", 2, 90], ["m2", 1, 40]]);
    expect(s.modulesDone).toBe(1);
    expect(s.sectionsDone).toBe(3);
    expect(s.avgTestPct).toBe(65);
    expect(s.rightPct).toBe(75);
    expect(s.weak.map((w) => w.label)).toEqual(["Mental state", "Flat affect or Blunted affect"]);
    expect(s.lastStudyDay).toBe("2026-11-20");
  });
  it("gives zeros for a missing or broken state", () => {
    for (const raw of [null, "nonsense", { study: 5 }]) {
      const s = learnerStudy(raw, catalog);
      expect(s.sectionsDone).toBe(0);
      expect(s.avgTestPct).toBeNull();
      expect(s.rightPct).toBeNull();
      expect(s.weak).toEqual([]);
    }
  });
});

describe("learnerRow", () => {
  const base = { id: "u1", name: "Asha", email: "a@x.org", cohorts: [], lecturesDone: 1, lecturesAvailable: 6, lastSeen: "2026-11-10T08:00:00.000Z", min7: 30, account: "active" };
  it("takes the later of the last visit and the last study day, and marks behind", () => {
    const r = learnerRow(base, learnerStudy(state, catalog));
    expect(r.lastActive?.slice(0, 10)).toBe("2026-11-20");
    expect(r.behind).toBe(true);
    expect(r.progress).toBeGreaterThan(0);
  });
  it("is not behind when the account is not active", () => {
    expect(learnerRow({ ...base, account: "locked" }, learnerStudy(null, catalog)).behind).toBe(false);
  });
});

describe("roleChangeProblem", () => {
  const two = [
    { id: "a", role: "admin" as const },
    { id: "b", role: "admin" as const },
    { id: "v", role: "view_admin" as const },
  ];
  it("never takes rights from the last Super Admin", () => {
    const one = [{ id: "a", role: "admin" as const }, { id: "v", role: "view_admin" as const }];
    expect(roleChangeProblem(one, "a", "a", "view_admin", true)?.message).toMatch(/only Super Admin/);
    expect(roleChangeProblem(one, "a", "a", "none", true)?.code).toBe("conflict");
  });
  it("asks a second confirm before changing your own rights", () => {
    expect(roleChangeProblem(two, "a", "a", "view_admin", false)).toMatchObject({ code: "conflict", needsConfirm: true });
    expect(roleChangeProblem(two, "a", "a", "view_admin", true)).toBeNull();
  });
  it("allows changing someone else, refuses no-ops and strangers", () => {
    expect(roleChangeProblem(two, "a", "v", "none", false)).toBeNull();
    expect(roleChangeProblem(two, "a", "v", "admin", false)).toBeNull();
    expect(roleChangeProblem(two, "a", "v", "view_admin", false)?.code).toBe("conflict");
    expect(roleChangeProblem(two, "a", "zzz", "student", false)?.code).toBe("not_found");
    expect(roleChangeProblem(two, "a", "v", "owner" as never, false)?.code).toBe("bad_request");
  });
  it("maps each target to the profile change", () => {
    expect(roleUpdate("none")).toEqual({ role: "student", status: "blocked", block_reason: "Admin rights removed" });
    expect(roleUpdate("student")).toEqual({ role: "student", status: "active", block_reason: null });
    expect(roleUpdate("view_admin")).toEqual({ role: "view_admin" });
  });
});
