import { beforeEach, describe, expect, it, vi } from "vitest";

const { send, requireSuperAdmin, loadPeople } = vi.hoisted(() => ({
  send: vi.fn<(to: string, subject: string, text: string, html?: string) => Promise<{ ok: boolean; id?: string; error?: string }>>(async () => ({ ok: true, id: "re_1" })),
  requireSuperAdmin: vi.fn(),
  loadPeople: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/app-url", () => ({ appUrl: () => "https://vibhapsychology.com" }));
vi.mock("@/lib/auth/guards", () => ({ requireSuperAdmin: () => requireSuperAdmin() }));
vi.mock("@/lib/auth/audit", () => ({ audit: vi.fn(async () => {}) }));
vi.mock("@/lib/crm/people", async (orig) => ({ ...(await orig<typeof import("@/lib/crm/people")>()), loadPeople: (...a: unknown[]) => loadPeople(...a) }));
vi.mock("@/lib/auth/roster", () => ({
  sendResendEmail: send,
  deriveName: (e: string) => e.split("@")[0],
  generateCredential: () => "x",
  issueSetupLink: vi.fn(),
  sendCredentialEmails: vi.fn(),
  logEmailSend: vi.fn(async (admin: { from: (t: string) => { insert: (r: unknown) => unknown } }, log: Record<string, unknown>) => {
    await admin.from("email_sends").insert({ recipient: log.recipient, status: log.status, template_id: log.templateId, subject: log.subject });
  }),
}));
vi.mock("@/lib/certificates/server", () => ({
  emailConfigured: () => true,
  emailsSentToday: async (admin: { tables: Record<string, Array<Record<string, unknown>>> }) => (admin.tables.email_sends ?? []).filter((r) => r.status === "sent").length,
}));

import { fakeDb, type FakeDb } from "@/lib/certificates/fake-db";

/** The fake database, plus upsert (crm_contacts) that can refuse the payment columns like a database without the step. */
let db: FakeDb & { upserts: Array<Record<string, unknown>>; paymentStep: boolean };
function makeDb(paymentStep: boolean) {
  const base = fakeDb({ email_sends: [], crm_activities: [] }) as FakeDb & { upserts: Array<Record<string, unknown>>; paymentStep: boolean };
  base.upserts = [];
  base.paymentStep = paymentStep;
  const from = base.from.bind(base);
  base.from = ((t: string) => {
    if (t !== "crm_contacts") return from(t);
    return {
      upsert: async (row: Record<string, unknown>) => {
        if (!base.paymentStep && "paid_at" in row) return { error: { message: 'column "paid_at" of relation "crm_contacts" does not exist' } };
        base.upserts.push(row);
        return { error: null };
      },
    } as unknown as ReturnType<FakeDb["from"]>;
  }) as FakeDb["from"];
  return base;
}
vi.mock("@/lib/supabase/server", () => ({ createAdminClient: () => db }));

import { emailPeople, markPaid } from "./actions";

const person = (email: string, name: string) => ({ email, name, key: email, phone: null, isStudent: false, isEnquiry: true, stage: "new" });

beforeEach(() => {
  db = makeDb(true);
  send.mockReset();
  send.mockResolvedValue({ ok: true, id: "re_1" });
  requireSuperAdmin.mockResolvedValue({ id: "admin-1", email: "owner@example.com", role: "admin" });
  loadPeople.mockResolvedValue([person("aanya@example.com", "Aanya Rao"), person("dev@example.com", "Dev Shah")]);
  vi.stubEnv("RESEND_DAILY_LIMIT", "100");
});

describe("Pipeline: mark paid", () => {
  it("saves the date, amount and note, and logs it on the timeline", async () => {
    const r = await markPaid("Aanya@Example.com ", true, 12000, "UPI 4471");
    expect(r.error).toBeNull();
    expect(db.upserts[0]).toMatchObject({ email: "aanya@example.com", paid_amount: 12000, paid_note: "UPI 4471", paid_by: "admin-1" });
    expect(typeof db.upserts[0].paid_at).toBe("string");
    expect(db.tables.crm_activities[0]).toMatchObject({ email: "aanya@example.com", kind: "payment" });
  });
  it("says what to paste, and writes nothing, before the database step", async () => {
    db = makeDb(false);
    const r = await markPaid("aanya@example.com", true, null, null);
    expect(r.missingStep).toBe(true);
    expect(r.error).toMatch(/2026_11_15_people_payment\.sql/);
    expect(db.upserts).toEqual([]);
    expect(db.tables.crm_activities).toEqual([]);
  });
  it("is refused for anyone but the Super Admin", async () => {
    requireSuperAdmin.mockResolvedValue(null);
    expect((await markPaid("aanya@example.com", true)).error).toBe("Not authorized.");
    expect(db.upserts).toEqual([]);
  });
});

describe("Pipeline: email a filtered group", () => {
  it("emails only people who are in the pipeline, merged, under the pipeline template", async () => {
    const r = await emailPeople({ emails: ["aanya@example.com", "stranger@example.com"], subject: "Hi {first_name}", body: "Fee details, {first_name}." });
    expect(r.error).toBeNull();
    expect(r.sent).toEqual(["Aanya Rao"]);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toBe("aanya@example.com");
    expect(send.mock.calls[0][1]).toBe("Hi Aanya");
    expect(db.tables.email_sends.map((l) => [l.recipient, l.template_id])).toEqual([["aanya@example.com", "pipeline"]]);
  });
  it("queues what is over today's allowance", async () => {
    vi.stubEnv("RESEND_DAILY_LIMIT", "1");
    const r = await emailPeople({ emails: ["aanya@example.com", "dev@example.com"], subject: "Hello", body: "Hi {first_name}" });
    expect(r.sent).toEqual(["Aanya Rao"]);
    expect(r.queued).toEqual(["Dev Shah"]);
    expect(db.tables.email_sends.find((l) => l.recipient === "dev@example.com")).toMatchObject({ status: "pending", template_id: "pipeline" });
  });
  it("is refused for a view-only admin", async () => {
    requireSuperAdmin.mockResolvedValue(null);
    const r = await emailPeople({ emails: ["aanya@example.com"], subject: "x", body: "y" });
    expect(r.error).toMatch(/Super Admin/);
    expect(send).not.toHaveBeenCalled();
  });
});
