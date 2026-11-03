import { describe, expect, it } from "vitest";
import { canParticipate, canSeeDoubt, isUuid } from "./visibility";

const me = { id: "me", isAdmin: false, cohortIds: ["c1"] };
const admin = { id: "adm", isAdmin: true, cohortIds: [] };
const doubt = (p: Partial<{ user_id: string; kind: string; status: string; cohort_id: string | null }>) => ({ user_id: "x", kind: "doubt", status: "open", cohort_id: "c1", ...p });

describe("doubt visibility", () => {
  it("cohort doubts are visible to members, shared ones to all", () => {
    expect(canSeeDoubt(doubt({}), me)).toBe(true);
    expect(canSeeDoubt(doubt({ cohort_id: "c2" }), me)).toBe(false);
    expect(canSeeDoubt(doubt({ cohort_id: null }), me)).toBe(true);
  });
  it("complaints are private to the writer and admin", () => {
    expect(canSeeDoubt(doubt({ kind: "complaint", cohort_id: null }), me)).toBe(false);
    expect(canSeeDoubt(doubt({ kind: "complaint", user_id: "me" }), me)).toBe(true);
    expect(canSeeDoubt(doubt({ kind: "complaint" }), admin)).toBe(true);
  });
  it("hidden posts take no replies from students, even the writer", () => {
    expect(canSeeDoubt(doubt({ status: "hidden" }), me)).toBe(false);
    expect(canSeeDoubt(doubt({ status: "hidden", user_id: "me" }), me)).toBe(true);
    expect(canParticipate(doubt({ status: "hidden", user_id: "me" }), me)).toBe(false);
    expect(canParticipate(doubt({ status: "hidden" }), admin)).toBe(true);
  });
  it("validates ids", () => {
    expect(isUuid("11111111-1111-1111-1111-111111111111")).toBe(true);
    expect(isUuid("1; drop")).toBe(false);
    expect(isUuid(null)).toBe(false);
  });
});
