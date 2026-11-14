import { beforeEach, describe, expect, it, vi } from "vitest";

const { who, db, send } = vi.hoisted(() => ({
  who: { profile: null as null | { id: string; email: string; role: string } },
  db: { current: null as unknown },
  send: vi.fn(async () => ({ ok: true, id: "re_1" })),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/session", () => ({ getSession: vi.fn(async () => (who.profile ? { status: "ok", profile: who.profile } : { status: "none" })) }));
vi.mock("@/lib/supabase/server", () => ({ createAdminClient: () => db.current }));
vi.mock("@/lib/achievements/storage", () => ({ putCredentialAsset: vi.fn(async (k: string) => k), credentialDownloadUrl: vi.fn(async () => "https://files.example/x") }));
vi.mock("@/lib/media/r2", () => ({ getObjectBufferR2: vi.fn(async () => null) }));
vi.mock("@/lib/auth/roster", () => ({ sendResendEmail: send, logEmailSend: vi.fn(async () => {}) }));

import { fakeDb, type FakeDb } from "@/lib/certificates/fake-db";
import type { StudioIssueInput } from "@/lib/certificates/issue-input";
import { issueStudioCertificates, resendStudioCertificate, revokeStudioCertificate, sendWaitingCertificateEmails } from "./actions";

const input: StudioIssueInput = {
  kind: "completion",
  title: "Foundations of Clinical Psychology",
  issuedOn: "2026-11-14",
  signatories: [{ name: "Kavya Bothra", role: "COO" }],
  recipients: [{ userId: "u1", name: "Aanya Rao" }],
  email: true,
};
const written = (d: FakeDb) => ["credentials", "notifications", "admin_audit_log", "achievements", "certificate_email_queue"].reduce((n, t) => n + (d.tables[t]?.length ?? 0), 0);

beforeEach(() => {
  send.mockClear();
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.useFakeTimers({ now: new Date("2026-11-14T10:00:00+05:30"), toFake: ["Date"] });
  db.current = fakeDb({ profiles: [{ id: "u1", email: "aanya@example.com", name: "Aanya Rao", status: "active" }] });
});

describe("who may use the studio", () => {
  for (const [label, profile] of [
    ["a student", { id: "u1", email: "aanya@example.com", role: "student" }],
    ["a view-only admin", { id: "va", email: "viewer@example.com", role: "view_admin" }],
    ["someone signed out", null],
  ] as const) {
    it(`${label} cannot issue, revoke, resend or send the queue, and nothing is written`, async () => {
      who.profile = profile as never;
      const d = db.current as FakeDb;
      d.tables.credentials = [{ credential_id: "VIBHA-AAAA-BBBB-CCCC", type: "certificate", status: "issued", user_id: "u1", student_name: "Aanya Rao" }];
      expect((await issueStudioCertificates(input)).error).toMatch(/Super Admin/);
      expect((await revokeStudioCertificate("VIBHA-AAAA-BBBB-CCCC", "No reason")).error).toMatch(/Super Admin/);
      expect((await resendStudioCertificate("VIBHA-AAAA-BBBB-CCCC", true)).error).toMatch(/Super Admin/);
      expect((await sendWaitingCertificateEmails()).error).toMatch(/Super Admin/);
      expect(written(d)).toBe(1);
      expect(d.tables.credentials[0].status).toBe("issued");
      expect(send).not.toHaveBeenCalled();
    });
  }

  it("the Super Admin can issue, and the record carries their ID", async () => {
    who.profile = { id: "owner", email: "owner@example.com", role: "admin" };
    const r = await issueStudioCertificates(input);
    expect(r.error).toBeNull();
    const d = db.current as FakeDb;
    expect(d.tables.credentials[0]).toMatchObject({ issued_by: "owner", status: "issued" });
    expect(d.tables.admin_audit_log[0]).toMatchObject({ actor_id: "owner", actor_email: "owner@example.com" });
    expect(d.tables.notifications).toHaveLength(1);
    const rv = await revokeStudioCertificate(r.issued[0].credentialId, "Wrong course");
    expect(rv.error).toBeNull();
    expect(d.tables.credentials[0]).toMatchObject({ status: "revoked", revoked_by: "owner" });
  });
});
