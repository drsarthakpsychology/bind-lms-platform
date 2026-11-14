import { describe, expect, it } from "vitest";
import { decideApiAccess, gateFailure, gatesNeedFlags, isCrossSiteRequest, type ApiGate, type GateProfile } from "./api-gate";

const student = (over: Partial<GateProfile> = {}): GateProfile => ({ role: "student", scope: "full", status: "active", ...over });
const MSE: ApiGate = { path: "/practice/mse", flag: "mse" };
const OSCE: ApiGate = { path: "/practice/osce", flag: "osce" };
const unlocked = { mse: "unlocked", osce: "unlocked" } as const;

const decide = (over: Partial<Parameters<typeof decideApiAccess>[0]> = {}) =>
  decideApiAccess({ session: "ok", profile: student(), gates: [MSE], blocks: [], flags: unlocked, ...over });

describe("decideApiAccess", () => {
  it("allows an active full-scope student on an unlocked, unblocked feature", () => {
    expect(decide()).toEqual({ ok: true });
  });

  it("401s every non-ok session except blocked", () => {
    for (const session of ["unauthenticated", "expired", "session_replaced"] as const) {
      expect(decide({ session, profile: null })).toEqual({ ok: false, status: 401, reason: "unauthenticated" });
    }
    expect(decide({ profile: null })).toMatchObject({ status: 401 });
  });

  it("403s a blocked account, whether by session status or profile status", () => {
    expect(decide({ session: "blocked" })).toEqual({ ok: false, status: 403, reason: "account_blocked" });
    expect(decide({ profile: student({ status: "blocked" }) })).toMatchObject({ status: 403, reason: "account_blocked" });
    // Blocked wins even with no gates and even for an admin.
    expect(decide({ gates: [], profile: student({ role: "admin", status: "blocked" }) })).toMatchObject({ reason: "account_blocked" });
  });

  it("403s a lectures-only account on a non-lecture feature", () => {
    expect(decide({ profile: student({ scope: "lectures_only" }) })).toEqual({ ok: false, status: 403, reason: "scope" });
    // ...but lets it through on a lecture-side path.
    expect(decide({ profile: student({ scope: "lectures_only" }), gates: [{ path: "/courses" }] })).toEqual({ ok: true });
  });

  it("403s when the admin switched the section or the tool off for this student", () => {
    expect(decide({ blocks: ["practice"] })).toMatchObject({ status: 403, reason: "access_block" });
    expect(decide({ blocks: ["tool:mse"] })).toMatchObject({ reason: "access_block" });
    expect(decide({ gates: [{ path: "/reflect", flag: "journal" }], flags: { journal: "unlocked" }, blocks: ["journal"] })).toMatchObject({ reason: "access_block" });
    // An unrelated block does not apply.
    expect(decide({ blocks: ["wall", "tool:osce"] })).toEqual({ ok: true });
  });

  it("403s unless the feature flag is unlocked (live, off and missing all deny)", () => {
    expect(decide({ flags: { mse: "live" } })).toMatchObject({ status: 403, reason: "feature_locked" });
    expect(decide({ flags: { mse: "off" } })).toMatchObject({ reason: "feature_off" });
    expect(decide({ flags: {} })).toMatchObject({ reason: "feature_off" });
  });

  it("ignores flags for a gate with no flag", () => {
    expect(decide({ gates: [{ path: "/wall" }], flags: {} })).toEqual({ ok: true });
    expect(decide({ gates: [{ path: "/wall" }], blocks: ["wall"] })).toMatchObject({ reason: "access_block" });
  });

  it("with no gates checks only sign-in and block status", () => {
    expect(decide({ gates: [], profile: student({ scope: "lectures_only" }), flags: {}, blocks: ["practice"] })).toEqual({ ok: true });
  });

  it("lets admins bypass scope, blocks and flags", () => {
    expect(decide({ profile: student({ role: "admin", scope: "lectures_only" }), flags: {}, blocks: ["practice"] })).toEqual({ ok: true });
  });

  it("applies every check to alumni like a student", () => {
    expect(decide({ profile: student({ role: "alumni" }), flags: { mse: "off" } })).toMatchObject({ reason: "feature_off" });
  });

  it("allows a shared endpoint when ANY of its gates passes, else reports the first failure", () => {
    expect(decide({ gates: [MSE, OSCE], flags: { mse: "off", osce: "unlocked" } })).toEqual({ ok: true });
    expect(decide({ gates: [MSE, OSCE], flags: { mse: "live", osce: "off" } })).toMatchObject({ reason: "feature_locked" });
  });
});

describe("gateFailure / gatesNeedFlags", () => {
  it("checks scope before blocks before flags", () => {
    expect(gateFailure(student({ scope: "lectures_only" }), MSE, ["practice"], {})).toBe("scope");
    expect(gateFailure(student(), MSE, ["practice"], {})).toBe("access_block");
    expect(gateFailure(student(), MSE, [], {})).toBe("feature_off");
  });

  it("knows when the flag table is needed", () => {
    expect(gatesNeedFlags([{ path: "/wall" }])).toBe(false);
    expect(gatesNeedFlags([{ path: "/wall" }, MSE])).toBe(true);
  });
});

describe("isCrossSiteRequest (CSRF on route handlers)", () => {
  it("refuses requests made by another site's page", () => {
    expect(isCrossSiteRequest("cross-site")).toBe(true);
    expect(isCrossSiteRequest("Cross-Site")).toBe(true);
  });
  it("allows the app itself, typed URLs and non-browser clients", () => {
    for (const v of ["same-origin", "same-site", "none", null, undefined, ""]) expect(isCrossSiteRequest(v)).toBe(false);
  });
});
