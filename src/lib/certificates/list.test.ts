import { describe, expect, it } from "vitest";
import { filterCertificates, type ListRow } from "./list";

const row = (o: Partial<ListRow>): ListRow => ({ credentialId: "VIBHA-AAAA-AAAA-AAAA", userId: "u1", name: "Aanya Rao", title: "Foundations", kind: "completion", studio: true, status: "issued", revokedAt: null, revokeReason: null, expiresAt: null, issuedAt: "2026-11-14T06:30:00Z", emailStatus: "sent", recipientEmail: "aanya@example.com", replacedBy: null, ...o });
const rows = [
  row({}),
  row({ credentialId: "VIBHA-BBBB-BBBB-BBBB", userId: "u2", name: "Dev Shah", kind: "provisional", expiresAt: "2026-12-31T18:29:59Z" }),
  row({ credentialId: "VIBHA-CCCC-CCCC-CCCC", userId: "u3", name: "Old Prov", kind: "provisional", expiresAt: "2026-10-01T18:29:59Z" }),
  row({ credentialId: "VIBHA-DDDD-DDDD-DDDD", userId: null, name: "Guest Speaker", kind: "recognition", status: "revoked", revokedAt: "2026-11-10T00:00:00Z" }),
];
const now = new Date("2026-11-14T12:00:00Z");
const ids = (r: ListRow[]) => r.map((x) => x.credentialId.slice(6, 7));

describe("filterCertificates", () => {
  it("filters by type", () => {
    expect(ids(filterCertificates(rows, { kind: "provisional" }, now))).toEqual(["B", "C"]);
  });
  it("filters by live status, so an old provisional one counts as expired", () => {
    expect(ids(filterCertificates(rows, { status: "provisional" }, now))).toEqual(["B"]);
    expect(ids(filterCertificates(rows, { status: "expired" }, now))).toEqual(["C"]);
    expect(ids(filterCertificates(rows, { status: "revoked" }, now))).toEqual(["D"]);
    expect(ids(filterCertificates(rows, { status: "valid" }, now))).toEqual(["A"]);
  });
  it("filters by cohort membership and leaves out people without an account", () => {
    expect(ids(filterCertificates(rows, { cohortUserIds: new Set(["u1", "u3"]) }, now))).toEqual(["A", "C"]);
  });
  it("searches name, title, ID and email, and combines filters", () => {
    expect(ids(filterCertificates(rows, { q: "dev" }, now))).toEqual(["B"]);
    expect(ids(filterCertificates(rows, { q: "vibha-cccc" }, now))).toEqual(["C"]);
    expect(ids(filterCertificates(rows, { q: "foundations", kind: "provisional", status: "expired" }, now))).toEqual(["C"]);
  });
});
