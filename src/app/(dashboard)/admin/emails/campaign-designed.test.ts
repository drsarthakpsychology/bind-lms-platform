import { beforeEach, describe, expect, it, vi } from "vitest";

const { send, log, requireSuperAdmin, loadPeople } = vi.hoisted(() => ({
  send: vi.fn<(to: string, subject: string, text: string, html?: string) => Promise<{ ok: boolean; id?: string; error?: string }>>(async () => ({ ok: true, id: "re_1" })),
  log: vi.fn<(admin: unknown, row: Record<string, unknown>) => Promise<void>>(async () => {}),
  requireSuperAdmin: vi.fn(),
  loadPeople: vi.fn(),
}));
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/guards", () => ({ requireSuperAdmin: () => requireSuperAdmin(), requireAdmin: () => requireSuperAdmin() }));
vi.mock("@/lib/auth/roster", () => ({ sendResendEmail: send, logEmailSend: log, sendCredentialEmails: vi.fn() }));
vi.mock("@/lib/crm/people", () => ({ loadPeople: (...a: unknown[]) => loadPeople(...a) }));
vi.mock("@/lib/supabase/server", () => ({ createAdminClient: () => ({}) }));

import { sendCampaignEmail, sendTestCampaignEmail } from "./actions";

const html = `<html><head><style>.b{color:#1d44d8}</style></head><body><p class="b" onclick="x()">Hi {{first_name}} ({{name}})</p><img src="https://cdn.example.com/a.png" alt="Logo"><script>steal()</script><a href="javascript:alert(1)">bad</a></body></html>`;

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ ok: true, id: "re_1" });
  log.mockClear();
  requireSuperAdmin.mockResolvedValue({ id: "admin-1", email: "owner@example.com", role: "admin" });
  loadPeople.mockResolvedValue([{ email: "aanya@example.com", name: "Aanya Rao" }]);
  vi.stubEnv("RESEND_DAILY_LIMIT", "100");
});

describe("General composer: designed (HTML) email", () => {
  it("cleans again on the server, fills names per person, and logs every send", async () => {
    const r = await sendCampaignEmail({ subject: "For {{first_name}}", html: "", recipientEmails: ["Aanya@example.com", "dev.shah@example.com"], templateId: null, designed: { html } });
    expect(r).toMatchObject({ error: null, sent: 2, failed: 0 });
    const [to, subject, text, sent] = send.mock.calls[0];
    expect([to, subject]).toEqual(["aanya@example.com", "For Aanya"]);
    expect(sent).toContain('<p class="b">Hi Aanya (Aanya Rao)</p>');
    expect(sent).toContain("<style>.b{color:#1d44d8}</style>");
    expect(sent).not.toMatch(/script|onclick|javascript:/i);
    expect(text).toContain("Hi Aanya (Aanya Rao)");
    // No name on file: greeted by the first part of the address.
    expect(send.mock.calls[1][3]).toContain("Hi Dev (Dev)");
    expect(log).toHaveBeenCalledTimes(2);
    expect(log.mock.calls[0][1]).toMatchObject({ recipient: "aanya@example.com", name: "Aanya Rao", status: "sent", subject: "For Aanya" });
  });

  it("logs a failed send so it shows in Failed emails", async () => {
    send.mockResolvedValueOnce({ ok: false, error: "Mailbox does not exist" });
    const r = await sendCampaignEmail({ subject: "Hi", html: "", recipientEmails: ["aanya@example.com"], templateId: null, designed: { html } });
    expect(r).toMatchObject({ sent: 0, failed: 1 });
    expect(log.mock.calls[0][1]).toMatchObject({ status: "failed", errorReason: "Mailbox does not exist" });
  });

  it("cleans HTML sent the old way too", async () => {
    await sendCampaignEmail({ subject: "Hi", html: `<p onclick="x()">Hello</p><script>1</script>`, recipientEmails: ["a@example.com"], templateId: null });
    expect(send.mock.calls[0][3]).toContain("<p>Hello</p>");
    expect(send.mock.calls[0][3]).not.toMatch(/script|onclick/);
  });

  it("refuses a view-only admin, empty or too big HTML, and sends nothing", async () => {
    requireSuperAdmin.mockResolvedValueOnce(null);
    expect((await sendCampaignEmail({ subject: "Hi", html: "", recipientEmails: ["a@example.com"], templateId: null, designed: { html } })).error).toBe("Not authorized.");
    requireSuperAdmin.mockResolvedValueOnce(null);
    expect((await sendTestCampaignEmail({ subject: "Hi", html: "", designed: { html } })).error).toBe("Not authorized.");
    expect((await sendCampaignEmail({ subject: "Hi", html: "", recipientEmails: ["a@example.com"], templateId: null, designed: { html: "" } })).error).toMatch(/Paste the HTML/);
    expect((await sendCampaignEmail({ subject: "Hi", html: "", recipientEmails: ["a@example.com"], templateId: null, designed: { html: "x".repeat(500 * 1024) } })).error).toMatch(/400 KB/);
    expect(send).not.toHaveBeenCalled();
  });

  it("sends the test only to the signed-in Super Admin, filled in for the first person picked", async () => {
    const r = await sendTestCampaignEmail({ subject: "For {{first_name}}", html: "", designed: { html }, sampleEmail: "aanya@example.com" });
    expect(r).toEqual({ error: null, ok: true, detail: "Sent to owner@example.com." });
    expect(send).toHaveBeenCalledTimes(1);
    const [to, subject, , sent] = send.mock.calls[0];
    expect([to, subject]).toEqual(["owner@example.com", "[TEST] For Aanya"]);
    expect(sent).toContain("Hi Aanya (Aanya Rao)");
  });
});
