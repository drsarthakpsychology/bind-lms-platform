import { beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  profile: null as null | { id: string; role: string },
  limited: false,
  getToday: vi.fn(async () => ({ v: 1, date: "2026-11-16" })),
  generate: vi.fn(async () => ({ v: 1, state: "draft" })),
  identify: vi.fn(async () => ({ ticket: "t" })),
  confirm: vi.fn(async (): Promise<unknown> => ({ already: false })),
  overview: vi.fn(async (_db: unknown, _c: unknown, canWrite: boolean) => ({ v: 1, canWrite })),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/server", async (orig) => ({ ...(await orig<typeof import("next/server")>()) }));
vi.mock("@/lib/auth/guards", () => ({
  requireSession: async () => h.profile,
  requireAdmin: async () => (h.profile && ["admin", "view_admin"].includes(h.profile.role) ? h.profile : null),
  requireSuperAdmin: async () => (h.profile?.role === "admin" ? h.profile : null),
  requireSuperAdminSandbox: async () => (h.profile?.role === "admin" ? h.profile : null),
  isSuperAdmin: (p: { role: string } | null) => p?.role === "admin",
}));
vi.mock("@/lib/rate-limit", () => ({ rateLimitWrite: async () => !h.limited }));
vi.mock("./db", () => ({ clinicDb: () => ({}) }));
vi.mock("./student", () => ({ getToday: h.getToday, scan: vi.fn() }));
vi.mock("./scan-flow", () => ({ identify: h.identify, confirm: h.confirm }));
vi.mock("./admin", () => ({ generate: h.generate, overview: h.overview }));

import { ApiFail } from "@/lib/app-api/respond";
import { clinicAdminOverview, clinicGenerate, clinicScan, clinicScanConfirm, clinicScanIdentify, clinicToday } from "./actions";

const COHORT = "c0c0c0c0-0000-4000-8000-000000000001";

beforeEach(() => {
  h.profile = null;
  h.limited = false;
  vi.clearAllMocks();
});

describe("clinic server actions", () => {
  it("need a session", async () => {
    expect(await clinicToday()).toMatchObject({ ok: false, code: "unauthenticated" });
    h.profile = { id: "u1", role: "student" };
    expect(await clinicToday()).toEqual({ ok: true, data: { v: 1, date: "2026-11-16" } });
    expect(h.getToday).toHaveBeenCalledWith({}, "u1", null, expect.any(Number));
  });

  it("check the body and answer the bad fields", async () => {
    h.profile = { id: "u1", role: "student" };
    const r = await clinicScan({ code: "ABC1!!" });
    expect(r).toMatchObject({ ok: false, code: "bad_request" });
  });

  it("marking in two steps: the student acts for themselves, the direction is required, the reason comes through", async () => {
    expect(await clinicScanIdentify({ code: "AB2XY9" })).toMatchObject({ ok: false, code: "unauthenticated" });
    h.profile = { id: "u1", role: "student" };
    expect(await clinicScanIdentify({ code: "AB2XY9" })).toEqual({ ok: true, data: { ticket: "t" } });
    expect(h.identify).toHaveBeenCalledWith({}, "u1", { code: "AB2XY9" }, expect.any(Number));
    const ticket = "t1.5e5e5e5e-0000-4000-8000-000000000001.1790000000000.q." + "A".repeat(43);
    expect(await clinicScanConfirm({ ticket, attemptId: "attempt-0001" })).toMatchObject({ ok: false, code: "bad_request", fields: ["direction"] });
    expect(await clinicScanConfirm({ ticket, direction: "in" })).toMatchObject({ ok: false, code: "bad_request", fields: ["attemptId"] });
    expect(h.confirm).not.toHaveBeenCalled();
    expect(await clinicScanConfirm({ ticket, direction: "in", attemptId: "attempt-0001" })).toEqual({ ok: true, data: { already: false } });
    expect(h.confirm).toHaveBeenCalledWith({}, "u1", { ticket, direction: "in", attemptId: "attempt-0001" }, expect.any(Number));
    h.confirm.mockRejectedValueOnce(new ApiFail("bad_request", "That took too long. Scan the code again.", { reason: "ticket_expired" }));
    expect(await clinicScanConfirm({ ticket, direction: "out", attemptId: "attempt-0002" })).toEqual({ ok: false, code: "bad_request", error: "That took too long. Scan the code again.", reason: "ticket_expired" });
  });

  it("writes are Super Admin only; View Admin reads", async () => {
    h.profile = { id: "v", role: "view_admin" };
    expect(await clinicGenerate({ cohortId: COHORT })).toMatchObject({ ok: false, code: "forbidden" });
    expect(await clinicAdminOverview()).toEqual({ ok: true, data: { v: 1, canWrite: false } });
    h.profile = { id: "a", role: "admin" };
    expect(await clinicGenerate({ cohortId: COHORT })).toMatchObject({ ok: true });
    h.profile = { id: "s", role: "student" };
    expect(await clinicAdminOverview()).toMatchObject({ ok: false, code: "forbidden" });
  });

  it("rate limits writes", async () => {
    h.profile = { id: "a", role: "admin" };
    h.limited = true;
    expect(await clinicGenerate({ cohortId: COHORT })).toMatchObject({ ok: false, code: "rate_limited" });
  });
});
