import { beforeEach, describe, expect, it, vi } from "vitest";

const { put, send } = vi.hoisted(() => ({
  put: vi.fn<(key: string, bytes: unknown, type: string) => Promise<string>>(async (key) => key),
  send: vi.fn<(...args: unknown[]) => Promise<{ ok: boolean; id?: string; error?: string }>>(async () => ({ ok: true, id: "re_1" })),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/achievements/storage", () => ({ putCredentialAsset: put, credentialDownloadUrl: vi.fn(async () => "https://files.example/x") }));
vi.mock("@/lib/media/r2", () => ({ getObjectBufferR2: vi.fn(async () => null) }));
vi.mock("@/lib/auth/roster", () => ({
  sendResendEmail: send,
  logEmailSend: vi.fn(async (admin: { from: (t: string) => { insert: (r: unknown) => unknown } }, log: { recipient: string; status: string }) => {
    await admin.from("email_sends").insert({ recipient: log.recipient, status: log.status });
  }),
}));

import { BEFORE_DB_STEP, fakeDb, type FakeDb } from "./fake-db";
import { issueCertificates, resendCertificate, revokeCertificate } from "./issue";
import type { StudioIssueInput } from "./issue-input";
import { STUDIO_ID_RE } from "./id";
import { docFromRecord, drainEmailQueue, loadCredential } from "./server";
import { certStatus } from "./kinds";

const actor = { id: "admin-1", email: "owner@example.com" };
const students = () => [
  { id: "u1", email: "aanya@example.com", name: "Aanya Rao", status: "active" },
  { id: "u2", email: "Dev@Example.com", name: "Dev Shah", status: "active" },
  { id: "u3", email: null, name: "No Email", status: "active" },
];
const input = (over: Partial<StudioIssueInput> = {}): StudioIssueInput => ({
  kind: "completion",
  title: "Foundations of Clinical Psychology",
  citation: "For finishing the programme.",
  issuedOn: "2026-11-14",
  signatories: [{ name: "Kavya Bothra", role: "COO" }, { name: "Dr. Sarthak Dave", role: "MBBS, MD (Psychiatry)" }],
  recipients: [{ userId: "u1", name: "Aanya Rao" }, { userId: "u2", name: "Dev Shah" }, { userId: "u3", name: "No Email" }],
  email: true,
  ...over,
});
// The fake stands in for the service-role client.
const as = (db: FakeDb) => db as never;

beforeEach(() => {
  put.mockClear();
  send.mockReset();
  send.mockResolvedValue({ ok: true, id: "re_1" });
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("RESEND_DAILY_LIMIT", "100");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://vibhapsychology.com");
  vi.useFakeTimers({ now: new Date("2026-11-14T10:00:00+05:30"), toFake: ["Date"] });
});

describe("issuing", () => {
  it("creates one record per student with a unique verifiable ID, a PDF, a notice and an audit line", async () => {
    const db = fakeDb({ profiles: students() });
    const r = await issueCertificates(as(db), actor, input({ email: false }));
    expect(r.error).toBeNull();
    expect(r.issued).toHaveLength(3);
    const creds = db.tables.credentials;
    expect(creds).toHaveLength(3);
    expect(new Set(creds.map((c) => c.credential_id)).size).toBe(3);
    for (const c of creds) {
      expect(String(c.credential_id)).toMatch(STUDIO_ID_RE);
      expect(c).toMatchObject({ type: "certificate", status: "issued", kind: "completion", title: "Foundations of Clinical Psychology", issued_by: "admin-1", batch_id: r.batchId });
      expect(c.pdf_storage_path).toBe(`certificates/${c.credential_id}.pdf`);
    }
    expect(creds[1].recipient_email).toBe("dev@example.com");
    expect(put).toHaveBeenCalledTimes(3);
    const pdf = put.mock.calls[0][1] as unknown as Buffer;
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");

    const notes = db.tables.notifications;
    expect(notes).toHaveLength(3);
    for (const n of notes) {
      expect(n.type).toBe("certificate");
      expect(n.href).toBe(`/achievements/${n.credential_id}`);
      expect(n.sent_by).toBe("admin-1");
    }
    const audit = db.tables.admin_audit_log;
    expect(audit).toHaveLength(3);
    expect(audit.every((a) => a.actor_id === "admin-1" && a.action === "certificate.studio_issued")).toBe(true);
    expect(send).not.toHaveBeenCalled();
    expect(r.delivery).toBeNull();
  });

  it("stores the expiry of a provisional certificate at the end of that day in India", async () => {
    const db = fakeDb({ profiles: students() });
    const r = await issueCertificates(as(db), actor, input({ kind: "provisional", expiresOn: "2026-12-31", recipients: [{ userId: "u1", name: "Aanya Rao" }], email: false }));
    expect(r.error).toBeNull();
    const c = db.tables.credentials[0];
    expect(c.expires_at).toBe("2026-12-31T18:29:59.000Z");
    expect(certStatus(c as never, new Date("2026-12-31T18:00:00Z"))).toBe("provisional");
    expect(certStatus(c as never, new Date("2026-12-31T18:30:00Z"))).toBe("expired");
  });

  it("refuses bad input and writes nothing", async () => {
    const db = fakeDb({ profiles: students() });
    const r = await issueCertificates(as(db), actor, input({ title: "" }));
    expect(r.error).toMatch(/title/);
    expect(db.tables.credentials ?? []).toHaveLength(0);
    expect(db.tables.notifications ?? []).toHaveLength(0);
  });

  it("skips a student with no account and still issues the rest", async () => {
    const db = fakeDb({ profiles: students() });
    const r = await issueCertificates(as(db), actor, input({ email: false, recipients: [{ userId: "u1", name: "Aanya Rao" }, { userId: "ghost", name: "Ghost" }] }));
    expect(r.issued).toHaveLength(1);
    expect(r.skipped).toEqual([{ name: "Ghost", reason: "No account found." }]);
  });

  it("still issues when the PDF copy cannot be saved", async () => {
    put.mockRejectedValueOnce(new Error("R2_BUCKET_NAME is not set."));
    const db = fakeDb({ profiles: students() });
    const r = await issueCertificates(as(db), actor, input({ email: false, recipients: [{ userId: "u1", name: "Aanya Rao" }] }));
    expect(r.error).toBeNull();
    expect(db.tables.credentials[0].status).toBe("issued");
    expect(db.tables.credentials[0].pdf_storage_path ?? null).toBeNull();
  });
});

describe("email and the daily limit", () => {
  it("emails with the link only and marks who has no address", async () => {
    const db = fakeDb({ profiles: students() });
    const r = await issueCertificates(as(db), actor, input());
    expect(r.delivery).toMatchObject({ emailed: ["Aanya Rao", "Dev Shah"], queued: [], noEmail: ["No Email"], emailOff: false });
    expect(send).toHaveBeenCalledTimes(2);
    const [to, subject, text, html, attachments] = send.mock.calls[0] as unknown as [string, string, string, string, unknown];
    expect(to).toBe("aanya@example.com");
    expect(subject).toContain("Foundations of Clinical Psychology");
    const id = db.tables.credentials[0].credential_id;
    expect(text).toContain(`https://vibhapsychology.com/achievements/${id}`);
    expect(text).toContain(`https://vibhapsychology.com/verify/${id}`);
    expect(html).toContain("View your certificate");
    expect(attachments).toBeUndefined();
    expect(db.tables.credentials.map((c) => c.email_status)).toEqual(["sent", "sent", "none"]);
  });

  it("queues the rest over the daily limit and says who was queued", async () => {
    vi.stubEnv("RESEND_DAILY_LIMIT", "1");
    const db = fakeDb({ profiles: students() });
    const r = await issueCertificates(as(db), actor, input());
    expect(r.issued).toHaveLength(3);
    expect(r.delivery).toMatchObject({ emailed: ["Aanya Rao"], queued: ["Dev Shah"], queueMissing: false, remainingToday: 0 });
    expect(send).toHaveBeenCalledTimes(1);
    const q = db.tables.certificate_email_queue;
    expect(q).toHaveLength(1);
    expect(q[0]).toMatchObject({ recipient: "Dev@Example.com", status: "queued", created_by: "admin-1" });
    expect(db.tables.credentials[1].email_status).toBe("queued");
    // Everyone still got the in-app notice.
    expect(db.tables.notifications).toHaveLength(3);
  });

  it("counts emails already sent today against the limit", async () => {
    vi.stubEnv("RESEND_DAILY_LIMIT", "2");
    const db = fakeDb({
      profiles: students(),
      email_sends: [
        { status: "sent", created_at: "2026-11-14T01:00:00.000Z" },
        { status: "delivered", created_at: "2026-11-14T02:00:00.000Z" },
        { status: "sent", created_at: "2026-11-13T20:00:00.000Z" },
        { status: "failed", created_at: "2026-11-14T03:00:00.000Z" },
      ],
    });
    const r = await issueCertificates(as(db), actor, input());
    expect(send).not.toHaveBeenCalled();
    expect(r.delivery?.queued).toEqual(["Aanya Rao", "Dev Shah"]);
  });

  it("moves everyone left to the queue when the provider says the day is used up", async () => {
    send.mockResolvedValueOnce({ ok: false, error: "You have reached your daily email sending quota" });
    const db = fakeDb({ profiles: students() });
    const r = await issueCertificates(as(db), actor, input());
    expect(r.delivery).toMatchObject({ emailed: [], queued: ["Aanya Rao", "Dev Shah"], failed: [] });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("reports an ordinary failure without stopping the batch", async () => {
    send.mockResolvedValueOnce({ ok: false, error: "Invalid `to` field" });
    const db = fakeDb({ profiles: students() });
    const r = await issueCertificates(as(db), actor, input());
    expect(r.delivery?.failed).toEqual([{ name: "Aanya Rao", reason: "Invalid `to` field" }]);
    expect(r.delivery?.emailed).toEqual(["Dev Shah"]);
  });

  it("is in-app only when email is not set up", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const db = fakeDb({ profiles: students() });
    const r = await issueCertificates(as(db), actor, input());
    expect(r.delivery).toMatchObject({ emailOff: true, emailed: [], queued: [] });
    expect(send).not.toHaveBeenCalled();
    expect(db.tables.notifications).toHaveLength(3);
  });

  it("sends waiting emails later, oldest first, up to the limit, and skips revoked ones", async () => {
    vi.stubEnv("RESEND_DAILY_LIMIT", "1");
    const db = fakeDb({ profiles: [...students(), { id: "u4", email: "d@example.com", name: "Dee", status: "active" }], email_sends: [{ status: "sent", created_at: "2026-11-14T01:00:00.000Z" }] });
    await issueCertificates(as(db), actor, input({ recipients: [{ userId: "u1", name: "Aanya Rao" }, { userId: "u2", name: "Dev Shah" }, { userId: "u4", name: "Dee" }] }));
    expect(db.tables.certificate_email_queue).toHaveLength(3);
    await revokeCertificate(as(db), actor, String(db.tables.credentials[0].credential_id), "Issued by mistake");
    expect(db.tables.certificate_email_queue[0].status).toBe("cancelled");
    vi.stubEnv("RESEND_DAILY_LIMIT", "2");
    const d = await drainEmailQueue(as(db), actor.id);
    expect(d).toMatchObject({ sent: 1, left: 1, error: null });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toBe("Dev@Example.com");
  });
});

describe("before the database step is pasted", () => {
  it("still issues completion, recognition and custom certificates", async () => {
    const db = fakeDb({ profiles: students() }, BEFORE_DB_STEP);
    const r = await issueCertificates(as(db), actor, input({ kind: "recognition", heading: "Star of the Cohort", recipients: [{ userId: "u1", name: "Aanya Rao" }] }));
    expect(r.error).toBeNull();
    const c = db.tables.credentials[0];
    expect(c).not.toHaveProperty("kind");
    expect(c.status).toBe("issued");
    expect(db.tables.notifications).toHaveLength(1);
    // The wording is kept on the certificate type, so it can be redrawn.
    const rec = await loadCredential(as(db), String(c.credential_id));
    const doc = docFromRecord(rec!);
    expect(doc).toMatchObject({ kind: "recognition", heading: "Star of the Cohort", title: "Foundations of Clinical Psychology", recipientName: "Aanya Rao" });
    expect(doc.signatories.map((s) => s.name)).toEqual(["Kavya Bothra", "Dr. Sarthak Dave"]);
  });
  it("refuses provisional certificates with a plain message", async () => {
    const db = fakeDb({ profiles: students() }, BEFORE_DB_STEP);
    const r = await issueCertificates(as(db), actor, input({ kind: "provisional", expiresOn: "2026-12-31" }));
    expect(r.error).toMatch(/2026_11_14_certificate_studio\.sql/);
    expect(db.tables.credentials ?? []).toHaveLength(0);
  });
  it("says so when over-limit emails could not be put in the queue", async () => {
    vi.stubEnv("RESEND_DAILY_LIMIT", "1");
    const db = fakeDb({ profiles: students() }, BEFORE_DB_STEP);
    const r = await issueCertificates(as(db), actor, input());
    expect(r.delivery).toMatchObject({ emailed: ["Aanya Rao"], queued: ["Dev Shah"], queueMissing: true });
  });
});

describe("revoke, reissue, resend", () => {
  async function one(db: FakeDb) {
    const r = await issueCertificates(as(db), actor, input({ email: false, recipients: [{ userId: "u1", name: "Aanya Roa" }] }));
    return r.issued[0].credentialId;
  }

  it("revokes with a reason, logs the admin, and never deletes", async () => {
    const db = fakeDb({ profiles: students() });
    const id = await one(db);
    expect((await revokeCertificate(as(db), actor, id, "  ")).error).toMatch(/reason/);
    const r = await revokeCertificate(as(db), actor, id, "Issued by mistake");
    expect(r.error).toBeNull();
    expect(db.tables.credentials).toHaveLength(1);
    expect(db.tables.credentials[0]).toMatchObject({ status: "revoked", revoke_reason: "Issued by mistake", revoked_by: "admin-1" });
    expect(certStatus(db.tables.credentials[0] as never)).toBe("revoked");
    expect(db.tables.admin_audit_log.at(-1)).toMatchObject({ action: "credential.revoked", actor_id: "admin-1", target_id: id });
    expect((await revokeCertificate(as(db), actor, id, "again")).error).toMatch(/Already/);
    expect((await revokeCertificate(as(db), actor, "VIBHA-0000-0000-0000", "x")).error).toMatch(/not found/);
  });

  it("corrects a name by issuing a new certificate that replaces the old one", async () => {
    const db = fakeDb({ profiles: students() });
    const oldId = await one(db);
    const r = await issueCertificates(as(db), actor, input({ email: false, recipients: [{ userId: "u1", name: "Aanya Rao" }] }), { replaces: oldId });
    expect(r.error).toBeNull();
    const newId = r.issued[0].credentialId;
    expect(newId).not.toBe(oldId);
    expect(r.replaced).toBe(oldId);
    const [oldRow, newRow] = db.tables.credentials;
    expect(oldRow).toMatchObject({ status: "revoked", revoke_reason: `Replaced by ${newId}`, replaced_by: newId, student_name: "Aanya Roa" });
    expect(newRow).toMatchObject({ status: "issued", replaces: oldId, student_name: "Aanya Rao" });
    expect(db.tables.admin_audit_log.some((a) => a.action === "certificate.reissued" && a.target_id === newId)).toBe(true);
  });

  it("will not replace a certificate with one for a different student, or several", async () => {
    const db = fakeDb({ profiles: students() });
    const oldId = await one(db);
    expect((await issueCertificates(as(db), actor, input({ recipients: [{ userId: "u2", name: "Dev Shah" }] }), { replaces: oldId })).error).toMatch(/same student/);
    expect((await issueCertificates(as(db), actor, input(), { replaces: oldId })).error).toMatch(/one certificate/);
    expect(db.tables.credentials).toHaveLength(1);
  });

  it("sends the notice and the email again", async () => {
    const db = fakeDb({ profiles: students() });
    const id = await one(db);
    const r = await resendCertificate(as(db), actor, id, { email: true });
    expect(r).toMatchObject({ error: null, notified: true });
    expect(r.delivery?.emailed).toEqual(["Aanya Roa"]);
    expect(db.tables.notifications).toHaveLength(2);
    expect(db.tables.notifications[1].href).toBe(`/achievements/${id}`);
    expect(db.tables.admin_audit_log.at(-1)).toMatchObject({ action: "certificate.resent", actor_id: "admin-1" });
  });

  it("will not resend a revoked certificate", async () => {
    const db = fakeDb({ profiles: students() });
    const id = await one(db);
    await revokeCertificate(as(db), actor, id, "Mistake");
    expect((await resendCertificate(as(db), actor, id, { email: true })).error).toMatch(/issued/);
    expect(send).not.toHaveBeenCalled();
  });
});
