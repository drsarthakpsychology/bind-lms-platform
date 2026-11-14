import { describe, expect, it } from "vitest";
import { certStatus, expiryInstant, istDay, longDate, statusLine } from "./kinds";

const at = (iso: string) => new Date(iso);

describe("certificate status", () => {
  it("is valid when issued with no expiry", () => {
    expect(certStatus({ status: "issued", kind: "completion" })).toBe("valid");
  });
  it("is provisional until the end of the expiry day in India", () => {
    const row = { status: "issued", kind: "provisional", expires_at: new Date(expiryInstant("2026-12-31")).toISOString() };
    expect(certStatus(row, at("2026-12-31T23:59:59+05:30"))).toBe("provisional");
    expect(certStatus(row, at("2026-12-31T12:00:00+05:30"))).toBe("provisional");
  });
  it("shows expired one second after the expiry day ends, with no job run", () => {
    const row = { status: "issued", kind: "provisional", expires_at: new Date(expiryInstant("2026-12-31")).toISOString() };
    expect(certStatus(row, at("2027-01-01T00:00:00+05:30"))).toBe("expired");
  });
  it("expires a non-provisional certificate that has an end date", () => {
    const row = { status: "issued", kind: "custom", expires_at: "2026-01-01T00:00:00Z" };
    expect(certStatus(row, at("2026-06-01T00:00:00Z"))).toBe("expired");
    expect(certStatus(row, at("2025-06-01T00:00:00Z"))).toBe("valid");
  });
  it("revoked beats everything", () => {
    expect(certStatus({ status: "revoked", kind: "provisional", expires_at: "2099-01-01T00:00:00Z" })).toBe("revoked");
    expect(certStatus({ status: "issued", revoked_at: "2026-01-01T00:00:00Z" })).toBe("revoked");
  });
  it("a draft is not issued", () => {
    expect(certStatus({ status: "draft" })).toBe("not_issued");
  });
  it("older certificates without a kind are valid", () => {
    expect(certStatus({ status: "issued", kind: null })).toBe("valid");
  });
});

describe("dates and wording", () => {
  it("formats days without time zone drift", () => {
    expect(longDate("2026-11-14")).toBe("14 November 2026");
    expect(istDay("2026-11-14T20:00:00Z")).toBe("2026-11-15");
    expect(istDay(new Date(expiryInstant("2026-12-31")).toISOString())).toBe("2026-12-31");
  });
  it("writes the status line people read", () => {
    expect(statusLine("provisional", { expiresOn: "2026-12-31" })).toBe("Provisional until 31 December 2026");
    expect(statusLine("expired", { expiresOn: "2026-12-31" })).toBe("Expired on 31 December 2026");
    expect(statusLine("revoked", { revokedOn: "2026-11-20" })).toBe("Revoked on 20 November 2026");
    expect(statusLine("valid")).toBe("Valid");
  });
});
