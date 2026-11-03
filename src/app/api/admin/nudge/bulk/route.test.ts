import { beforeEach, describe, expect, it, vi } from "vitest";

const requireSuperAdmin = vi.fn();
vi.mock("@/lib/auth/guards", () => ({ requireSuperAdmin: () => requireSuperAdmin() }));
const rateLimit = vi.fn();
vi.mock("@/lib/rate-limit", () => ({ rateLimit: (...a: unknown[]) => rateLimit(...a) }));
const configured = vi.fn();
const recipientsFor = vi.fn();
const sendNudges = vi.fn();
vi.mock("@/lib/nudge/send", () => ({
  emailConfigured: () => configured(),
  recipientsFor: (...a: unknown[]) => recipientsFor(...a),
  sendNudges: (...a: unknown[]) => sendNudges(...a),
}));

import { POST } from "./route";

const ID = "11111111-1111-4111-8111-111111111111";
const req = (body: unknown) => new Request("http://x/api/admin/nudge/bulk", { method: "POST", body: JSON.stringify(body) });
const good = { userIds: [ID], subject: "Hi", message: "Hello {name}" };

describe("POST /api/admin/nudge/bulk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireSuperAdmin.mockResolvedValue({ id: "admin1", role: "admin" });
    rateLimit.mockResolvedValue(true);
    configured.mockReturnValue(true);
    recipientsFor.mockResolvedValue({ recipients: [{ id: ID, name: "Asha", email: "asha@gmail.com" }], skipped: 0 });
    sendNudges.mockResolvedValue({ sent: 1, sentIds: [ID], failed: [], notConfigured: false });
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  it("rejects non-admins", async () => {
    requireSuperAdmin.mockResolvedValue(null);
    expect((await POST(req(good))).status).toBe(401);
    expect(sendNudges).not.toHaveBeenCalled();
  });

  it("validates the body", async () => {
    expect((await POST(req({ ...good, userIds: [] }))).status).toBe(400);
    expect((await POST(req({ ...good, userIds: ["not-a-uuid"] }))).status).toBe(400);
    expect((await POST(req({ ...good, userIds: Array(501).fill(ID) }))).status).toBe(400);
    expect((await POST(req({ ...good, subject: " " }))).status).toBe(400);
  });

  it("ignores emails from the browser and sends to the looked-up ids", async () => {
    const res = await POST(req({ ...good, emails: ["evil@x.com"] }));
    expect(res.status).toBe(200);
    expect(recipientsFor).toHaveBeenCalledWith([ID]);
    expect(await res.json()).toMatchObject({ sent: 1, skipped: 0, notConfigured: false });
  });

  it("says honestly when email isn't set up", async () => {
    configured.mockReturnValue(false);
    const j = await (await POST(req(good))).json();
    expect(j.notConfigured).toBe(true);
    expect(sendNudges).not.toHaveBeenCalled();
  });

  it("rate-limits per admin over 10 minutes", async () => {
    rateLimit.mockResolvedValue(false);
    expect((await POST(req(good))).status).toBe(429);
    expect(rateLimit).toHaveBeenCalledWith("nudge-bulk:admin1", 5, 600000);
    expect(sendNudges).not.toHaveBeenCalled();
  });
});
