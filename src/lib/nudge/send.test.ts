import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const profiles = [
  { id: "a", name: "Asha Rao", email: "asha@gmail.com", status: "active", role: "student", is_test: false },
  { id: "b", name: "", email: "bala@gmail.com", status: "active", role: "student", is_test: false },
  { id: "c", name: "Blocked", email: "c@gmail.com", status: "blocked", role: "student", is_test: false },
  { id: "d", name: "Tester", email: "d@gmail.com", status: "active", role: "student", is_test: true },
];
const inMock = vi.fn(async (_col: string, ids: string[]) => ({ data: profiles.filter((p) => ids.includes(p.id)) }));
vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => ({ from: () => ({ select: () => ({ in: inMock }) }) }),
}));

const sendMock = vi.fn();
const logMock = vi.fn(async () => {});
vi.mock("@/lib/auth/roster", () => ({
  sendResendEmail: (...a: unknown[]) => sendMock(...a),
  logEmailSend: (...a: unknown[]) => logMock(...(a as [])),
}));

import { recipientsFor, sendNudges } from "./send";

describe("recipientsFor", () => {
  it("looks up by id and drops blocked and test accounts", async () => {
    const { recipients, skipped } = await recipientsFor(["a", "b", "c", "d", "missing", "a"]);
    expect(recipients.map((r) => r.id)).toEqual(["a", "b"]);
    expect(recipients[1].name).toBe("bala");
    expect(skipped).toBe(3);
  });
});

describe("sendNudges", () => {
  const saved = process.env.RESEND_API_KEY;
  beforeEach(() => {
    sendMock.mockReset();
    logMock.mockClear();
  });
  afterEach(() => {
    process.env.RESEND_API_KEY = saved;
  });

  it("sends nothing when Resend isn't set up", async () => {
    delete process.env.RESEND_API_KEY;
    const r = await sendNudges([{ id: "a", name: "Asha", email: "asha@gmail.com" }], { subject: "s", message: "m" }, null);
    expect(r.notConfigured).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends one personal email per student and reports failures", async () => {
    process.env.RESEND_API_KEY = "k";
    let live = 0;
    let peak = 0;
    sendMock.mockImplementation(async (to: string) => {
      live++;
      peak = Math.max(peak, live);
      await new Promise((r) => setTimeout(r, 5));
      live--;
      return to.startsWith("bad") ? { ok: false, error: "bounced" } : { ok: true, id: "x" };
    });
    const people = Array.from({ length: 12 }, (_, i) => ({ id: `u${i}`, name: `Person${i} X`, email: `${i === 3 ? "bad" : "p"}${i}@gmail.com` }));
    const r = await sendNudges(people, { subject: "Hi {name}", message: "Dear {name}" }, "admin1");
    expect(sendMock).toHaveBeenCalledTimes(12);
    for (const call of sendMock.mock.calls) expect(typeof call[0]).toBe("string"); // one address per email
    expect(sendMock).toHaveBeenCalledWith("p0@gmail.com", "Hi Person0", "Dear Person0");
    expect(peak).toBeLessThanOrEqual(5);
    expect(r.sent).toBe(11);
    expect(r.failed).toEqual([{ id: "u3", name: "Person3 X", reason: "bounced" }]);
    expect(logMock).toHaveBeenCalledTimes(12);
  });
});
