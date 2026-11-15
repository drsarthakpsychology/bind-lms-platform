import { beforeEach, describe, expect, it, vi } from "vitest";

const { send, requireSuperAdmin, loadForm, loadSubmissions } = vi.hoisted(() => ({
  send: vi.fn<(to: string, subject: string, text: string, html?: string) => Promise<{ ok: boolean; id?: string; error?: string }>>(async () => ({ ok: true, id: "re_1" })),
  requireSuperAdmin: vi.fn(),
  loadForm: vi.fn(),
  loadSubmissions: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/guards", () => ({ requireSuperAdmin: () => requireSuperAdmin() }));
vi.mock("@/lib/forms/load", () => ({ loadForm: (...a: unknown[]) => loadForm(...a), loadSubmissions: (...a: unknown[]) => loadSubmissions(...a) }));
vi.mock("@/lib/auth/roster", () => ({
  sendResendEmail: send,
  logEmailSend: vi.fn(async (admin: { from: (t: string) => { insert: (r: unknown) => unknown } }, log: Record<string, unknown>) => {
    await admin.from("email_sends").insert({ recipient: log.recipient, status: log.status, template_id: log.templateId, subject: log.subject, body_text: log.bodyText, sent_by: log.sentBy });
  }),
}));
vi.mock("@/lib/certificates/server", () => ({
  emailConfigured: () => true,
  emailsSentToday: async (admin: { tables: Record<string, Array<Record<string, unknown>>> }) => (admin.tables.email_sends ?? []).filter((r) => r.status === "sent" || r.status === "delivered").length,
}));

import { fakeDb, type FakeDb } from "@/lib/certificates/fake-db";
let db: FakeDb;
vi.mock("@/lib/supabase/server", () => ({ createAdminClient: () => db }));

import { emailFormRespondents, sendWaitingFormEmails } from "./email-actions";

const subs = [
  { id: "s1", created_at: "2026-11-14", name: "Aanya Rao", email: "aanya@example.com", phone: null, contact_id: null, responses: {} },
  { id: "s2", created_at: "2026-11-13", name: "Dev Shah", email: "DEV@example.com", phone: null, contact_id: null, responses: {} },
  { id: "s3", created_at: "2026-11-12", name: "Aanya R", email: "aanya@example.com", phone: null, contact_id: null, responses: {} },
  { id: "s4", created_at: "2026-11-11", name: "No Mail", email: null, phone: null, contact_id: null, responses: {} },
  { id: "s5", created_at: "2026-11-10", name: "Meera Iyer", email: "meera@example.com", phone: null, contact_id: null, responses: {} },
];

beforeEach(() => {
  db = fakeDb({ email_sends: [] });
  send.mockReset();
  send.mockResolvedValue({ ok: true, id: "re_1" });
  requireSuperAdmin.mockResolvedValue({ id: "admin-1", email: "owner@example.com", role: "admin" });
  loadForm.mockResolvedValue({ id: "f1", title: "Cohort 2 interest", fields: [], isActive: true });
  loadSubmissions.mockResolvedValue(subs);
  vi.stubEnv("RESEND_DAILY_LIMIT", "100");
});

describe("Email the people who filled a form", () => {
  it("emails everyone once per address, merged, and records it against the form", async () => {
    const r = await emailFormRespondents({ formId: "f1", submissionIds: "all", subject: "About {form}", body: "Hi {first_name}," });
    expect(r.error).toBeNull();
    expect(r.sent).toEqual(["Aanya Rao", "Dev Shah", "Meera Iyer"]);
    expect(r.noEmail).toEqual(["No Mail"]);
    expect(r.duplicates).toBe(1);
    expect(send).toHaveBeenCalledTimes(3);
    expect(send.mock.calls[0][0]).toBe("aanya@example.com");
    expect(send.mock.calls[0][1]).toBe("About Cohort 2 interest");
    expect(send.mock.calls[1][2]).toBe("Hi Dev,");
    const log = db.tables.email_sends;
    expect(log.map((l) => [l.recipient, l.status, l.template_id])).toEqual([
      ["aanya@example.com", "sent", "form:f1"],
      ["dev@example.com", "sent", "form:f1"],
      ["meera@example.com", "sent", "form:f1"],
    ]);
    expect(db.tables.admin_audit_log[0].action).toBe("form.respondents_emailed");
  });

  it("emails only the people picked", async () => {
    const r = await emailFormRespondents({ formId: "f1", submissionIds: ["s2"], subject: "Hello", body: "Hi {name}" });
    expect(r.sent).toEqual(["Dev Shah"]);
    expect(send.mock.calls[0][2]).toBe("Hi Dev Shah");
  });

  it("queues what is over today's allowance, then sends it later", async () => {
    vi.stubEnv("RESEND_DAILY_LIMIT", "2");
    const r = await emailFormRespondents({ formId: "f1", submissionIds: "all", subject: "Hello", body: "Hi {first_name}" });
    expect(r.sent).toEqual(["Aanya Rao", "Dev Shah"]);
    expect(r.queued).toEqual(["Meera Iyer"]);
    const waiting = db.tables.email_sends.filter((l) => l.status === "pending");
    expect(waiting.map((w) => [w.recipient, w.template_id, w.body_text])).toEqual([["meera@example.com", "form:f1", "Hi Meera"]]);

    // Next day: the allowance is back.
    for (const l of db.tables.email_sends) if (l.status === "sent") l.status = "delivered-yesterday";
    const d = await sendWaitingFormEmails("f1");
    expect(d).toEqual({ error: null, sent: 1, failed: 0, left: 0 });
    expect(db.tables.email_sends.find((l) => l.recipient === "meera@example.com")?.status).toBe("sent");
  });

  it("moves the rest to the queue when the provider says the day is used up", async () => {
    send.mockResolvedValueOnce({ ok: true, id: "re_1" }).mockResolvedValueOnce({ ok: false, error: "You have reached your daily email quota" });
    const r = await emailFormRespondents({ formId: "f1", submissionIds: "all", subject: "Hello", body: "Hi" });
    expect(r.sent).toEqual(["Aanya Rao"]);
    expect(r.queued).toEqual(["Dev Shah", "Meera Iyer"]);
  });

  it("refuses a view-only admin and an empty email, and sends nothing", async () => {
    requireSuperAdmin.mockResolvedValueOnce(null);
    expect((await emailFormRespondents({ formId: "f1", submissionIds: "all", subject: "Hi", body: "x" })).error).toMatch(/Super Admin/);
    expect((await emailFormRespondents({ formId: "f1", submissionIds: "all", subject: "", body: "x" })).error).toBe("Add a subject line.");
    expect((await emailFormRespondents({ formId: "f1", submissionIds: ["nope"], subject: "Hi", body: "x" })).error).toBe("Pick at least one person.");
    expect(send).not.toHaveBeenCalled();
  });
});
