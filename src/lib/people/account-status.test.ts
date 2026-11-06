import { describe, expect, it } from "vitest";
import { accountStatus, ACCOUNT_LABEL } from "./account-status";

const NOW = Date.parse("2026-11-06T10:00:00Z");
const past = "2026-11-01T00:00:00Z";
const future = "2026-12-01T00:00:00Z";

describe("accountStatus", () => {
  it("locked wins over everything", () => {
    expect(accountStatus({ blocked: true, hasSignedIn: true, expiresAt: past }, NOW)).toBe("locked");
  });
  it("expired access, but never for alumni", () => {
    expect(accountStatus({ expiresAt: past, hasSignedIn: true }, NOW)).toBe("expired");
    expect(accountStatus({ expiresAt: past, hasSignedIn: true, role: "alumni" }, NOW)).toBe("active");
  });
  it("signed in or seen = active", () => {
    expect(accountStatus({ hasSignedIn: true }, NOW)).toBe("active");
    expect(accountStatus({ lastSeen: past }, NOW)).toBe("active");
  });
  it("password set but never in", () => {
    expect(accountStatus({ setupDoneAt: past }, NOW)).toBe("set-up");
    expect(accountStatus({ linkUsed: true }, NOW)).toBe("set-up");
  });
  it("invite states", () => {
    expect(accountStatus({ inviteState: "failed", linkExpiresAt: future }, NOW)).toBe("email-failed");
    expect(accountStatus({ linkExpiresAt: past }, NOW)).toBe("link-expired");
    expect(accountStatus({ inviteState: "sent", linkExpiresAt: future }, NOW)).toBe("invited");
    expect(accountStatus({}, NOW)).toBe("not-invited");
  });
  it("every status has a label", () => {
    for (const k of ["locked", "expired", "active", "set-up", "invited", "link-expired", "email-failed", "not-invited"] as const) expect(ACCOUNT_LABEL[k]).toBeTruthy();
  });
});
