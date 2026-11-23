import { describe, expect, it } from "vitest";
import { enrolledEmails, isEnrolFilter, isEnrolled, keepEnrol } from "./enrolment";

describe("enrolment", () => {
  it("enrolled means a student in a cohort, or marked paid", () => {
    expect(isEnrolled({ isStudent: true, cohorts: [{ id: "c2" }], paidAt: null })).toBe(true);
    expect(isEnrolled({ isStudent: false, cohorts: [], paidAt: "2026-11-01" })).toBe(true);
    expect(isEnrolled({ isStudent: true, cohorts: [], paidAt: null })).toBe(false);
    expect(isEnrolled({ isStudent: false, cohorts: [], paidAt: null })).toBe(false);
  });
  it("the filter keeps the right side", () => {
    expect([keepEnrol(true, "not_enrolled"), keepEnrol(false, "not_enrolled")]).toEqual([false, true]);
    expect([keepEnrol(true, "enrolled"), keepEnrol(false, "enrolled")]).toEqual([true, false]);
    expect([keepEnrol(true, ""), keepEnrol(false, undefined)]).toEqual([true, true]);
    expect([isEnrolFilter("enrolled"), isEnrolFilter("x")]).toEqual([true, false]);
  });
  it("reads cohort students and paid contacts from the database", async () => {
    const rows: Record<string, Array<Record<string, unknown>>> = {
      cohort_members: [{ user_id: "u1" }, { user_id: "u2" }, { user_id: "u1" }],
      profiles: [
        { id: "u1", email: "Dev@Example.com", role: "student" },
        { id: "u2", email: "admin@example.com", role: "admin" },
        { id: "u3", email: "solo@example.com", role: "student" },
      ],
      crm_contacts: [{ email: "meera@example.com", paid_at: "2026-11-01" }],
    };
    const q = (table: string) => {
      let list = rows[table];
      const b = {
        select: () => b,
        order: () => b,
        not: () => b,
        in: (_c: string, ids: string[]) => ((list = list.filter((r) => ids.includes(String(r.id)))), b),
        range: async (a: number, z: number) => ({ data: list.slice(a, z + 1), error: null }),
        then: (ok: (v: unknown) => unknown) => Promise.resolve({ data: list, error: null }).then(ok),
      };
      return b;
    };
    const set = await enrolledEmails({ from: q } as never);
    expect([...set].sort()).toEqual(["dev@example.com", "meera@example.com"]);
  });
});
