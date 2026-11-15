import { describe, expect, it } from "vitest";
import { countByType, filterIssued, issuedStatus, issuedStatusLine, type IssuedRow } from "./issued";
import { cleanDefaultSignatories, startingSignatories } from "./defaults";

const row = (over: Partial<IssuedRow>): IssuedRow => ({
  credentialId: "VIBHA-AAAA-BBBB-CCCC",
  userId: "u1",
  type: "certificate",
  kind: "completion",
  name: "Aanya Rao",
  title: "Foundations",
  status: "issued",
  revokedAt: null,
  revokeReason: null,
  expiresAt: null,
  issuedAt: "2026-11-01T06:30:00Z",
  createdAt: "2026-11-01T06:30:00Z",
  emailStatus: "sent",
  email: "aanya@example.com",
  roll: "VIBHA-000042",
  cohortIds: ["c1"],
  studio: true,
  hasPdf: true,
  ...over,
});
const now = new Date("2026-11-15T12:00:00Z");
const rows = [
  row({}),
  row({ credentialId: "b1", type: "badge", kind: "badge", title: "First lecture", emailStatus: null, hasPdf: false }),
  row({ credentialId: "p1", kind: "provisional", expiresAt: "2026-12-31T18:29:59Z", name: "Dev Shah", userId: "u2", cohortIds: ["c2"], roll: "VIBHA-000043" }),
  row({ credentialId: "x1", kind: "provisional", expiresAt: "2026-11-10T18:29:59Z", name: "Old One", userId: "u3", cohortIds: [] }),
  row({ credentialId: "r1", status: "revoked", revokedAt: "2026-11-12T05:00:00Z", name: "Gone", userId: "u4" }),
  row({ credentialId: "d1", status: "draft", issuedAt: null, name: "Waiting", userId: "u5" }),
];

describe("Issued: one list of certificates and badges", () => {
  it("works out each status, drafts included", () => {
    expect(rows.map((r) => issuedStatus(r, now))).toEqual(["valid", "valid", "provisional", "expired", "revoked", "draft"]);
    expect(issuedStatusLine(rows[2], now)).toBe("Provisional until 31 Dec 2026");
    expect(issuedStatusLine(rows[5], now)).toBe("Draft");
  });

  it("filters by type family or one kind", () => {
    expect(filterIssued(rows, { type: "badge" }, now).map((r) => r.credentialId)).toEqual(["b1"]);
    expect(filterIssued(rows, { type: "certificate" }, now)).toHaveLength(5);
    expect(filterIssued(rows, { type: "provisional" }, now).map((r) => r.credentialId)).toEqual(["p1", "x1"]);
    expect(filterIssued(rows, { type: "nonsense" }, now)).toHaveLength(6);
  });

  it("filters by status, cohort, person and search (name, roll, id)", () => {
    expect(filterIssued(rows, { status: "expired" }, now).map((r) => r.credentialId)).toEqual(["x1"]);
    expect(filterIssued(rows, { status: "draft" }, now).map((r) => r.credentialId)).toEqual(["d1"]);
    expect(filterIssued(rows, { cohortId: "c2" }, now).map((r) => r.credentialId)).toEqual(["p1"]);
    expect(filterIssued(rows, { userId: "u1" }, now).map((r) => r.credentialId)).toEqual(["VIBHA-AAAA-BBBB-CCCC", "b1"]);
    expect(filterIssued(rows, { q: "000043" }, now).map((r) => r.credentialId)).toEqual(["p1"]);
    expect(filterIssued(rows, { q: "first lecture" }, now).map((r) => r.credentialId)).toEqual(["b1"]);
    expect(filterIssued(rows, { q: "dev", type: "badge" }, now)).toHaveLength(0);
  });

  it("counts each type for the filter", () => {
    const c = countByType(rows);
    expect(c.badge).toBe(1);
    expect(c.certificate).toBe(5);
    expect(c.provisional).toBe(2);
    expect(c.completion).toBe(3);
  });
});

describe("Default signatories", () => {
  it("keeps up to three named rows, trimmed", () => {
    const out = cleanDefaultSignatories([{ name: "  Kavya  Bothra ", role: "COO", signatureFrom: "a1" }, { name: "", role: "x" }, { name: "B", role: "" }, { name: "C" }, { name: "D" }, "junk"]);
    expect(out).toEqual([
      { name: "Kavya Bothra", role: "COO", signatureFrom: "a1" },
      { name: "B", role: "", signatureFrom: null },
      { name: "C", role: "", signatureFrom: null },
    ]);
  });
  it("falls back to the owner's default when nothing is saved", () => {
    expect(startingSignatories(null).map((s) => s.name)).toEqual(["Kavya Bothra", "Dr. Sarthak Dave"]);
    expect(startingSignatories([{ name: "Only One", role: "Head" }])).toEqual([{ name: "Only One", role: "Head", signatureFrom: null }]);
  });
});
