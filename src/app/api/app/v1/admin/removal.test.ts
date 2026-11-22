import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { ADMIN_ID, ADMIN_TOKEN, STUDENT_ID, STUDENT_TOKEN, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

const VIEW_ID = "99999999-9999-4999-8999-999999999999";
const VIEW_TOKEN = "dmlld3h4eHh4eHh4eHh4.eyJleHAiOjQxMDI0NDQ4MDB9.sig";
const REQ_ID = "33333333-3333-4333-8333-333333333333";

const auth = vi.hoisted(() => ({ calls: [] as { id: string; attrs: Record<string, unknown> }[] }));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase/server", async () => {
  const base = (await import("@/lib/app-api/test-guard")).supabaseMock();
  const withAuth = () => {
    const c = base.createAdminClient() as unknown as { auth: { admin: Record<string, unknown> } };
    c.auth.admin.updateUserById = async (id: string, attrs: Record<string, unknown>) => (auth.calls.push({ id, attrs }), { error: null });
    return c;
  };
  return { createAdminClient: withAuth, createClient: async () => withAuth() };
});
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());

import { clearDeviceCache } from "@/lib/app-api/devices";
import { GET as list } from "./removal/route";
import { POST as remove } from "./removal/[id]/remove/route";
import { POST as restore } from "./removal/[id]/restore/route";
import { POST as del } from "./removal/[id]/delete/route";
import { POST as decline } from "./removal/requests/[id]/decline/route";

const asAdmin = { token: ADMIN_TOKEN };
const asView = { token: VIEW_TOKEN };
const id = (x: string) => params({ id: x });
const student = () => G.db.tables.profiles.find((p) => p.id === STUDENT_ID)!;

beforeEach(() => {
  resetGuard({ admin_audit_log: [], app_deletion_requests: [{ id: REQ_ID, user_id: STUDENT_ID, email: "asha@example.com", reason: null, status: "open", created_at: "2026-11-20T00:00:00Z", handled_at: null }] });
  G.db.tables.profiles.push(profileRow({ id: VIEW_ID, email: "view@x.org", name: "Vik", role: "view_admin" }));
  G.db.tables.app_devices.push({ id: "d9", user_id: VIEW_ID, device_id: "phone-aaaaaaaaaaaaaaaa", name: "x", platform: "android", push_token: null, active: true, activated_at: null, last_seen_at: null });
  G.users[VIEW_TOKEN] = { id: VIEW_ID, email: "view@x.org" };
  clearDeviceCache();
  auth.calls = [];
});

describe("GET /admin/removal", () => {
  it("lists students, staff and requests for any admin; only a Super Admin may write", async () => {
    const a = await read(await list(appReq("/admin/removal", asAdmin), noParams));
    expect(a.status).toBe(200);
    expect(a.data.canWrite).toBe(true);
    expect(a.data.people.map((p: { id: string }) => p.id).sort()).toEqual([STUDENT_ID, ADMIN_ID, VIEW_ID].sort());
    expect(a.data.requests[0]).toMatchObject({ id: REQ_ID, status: "open", confirmWord: "Asha Rao" });
    const v = await read(await list(appReq("/admin/removal", asView), noParams));
    expect(v.data.canWrite).toBe(false);
  });
  it("students cannot read it", async () => {
    expect((await list(appReq("/admin/removal", { token: STUDENT_TOKEN }), noParams)).status).toBe(403);
  });
});

describe("writes", () => {
  it("a view admin is refused and nothing changes", async () => {
    expect((await remove(appReq(`/admin/removal/${STUDENT_ID}/remove`, { ...asView, body: {} }), id(STUDENT_ID))).status).toBe(403);
    expect((await del(appReq(`/admin/removal/${STUDENT_ID}/delete`, { ...asView, body: { confirmName: "Asha Rao" } }), id(STUDENT_ID))).status).toBe(403);
    expect(student().status).toBe("active");
  });
  it("remove, then restore", async () => {
    const r = await read(await remove(appReq(`/admin/removal/${STUDENT_ID}/remove`, { ...asAdmin, body: { note: "left" } }), id(STUDENT_ID)));
    expect(r.data).toEqual({ removed: true });
    expect(student()).toMatchObject({ status: "blocked", block_reason: "[removed] left" });
    // The removed student is now refused on every call.
    expect((await list(appReq("/admin/removal", { token: STUDENT_TOKEN }), noParams)).status).toBe(403);
    const again = await read(await remove(appReq(`/admin/removal/${STUDENT_ID}/remove`, { ...asAdmin, body: {} }), id(STUDENT_ID)));
    expect(again.status).toBe(409);
    expect(again.error?.message).toMatch(/already removed/);
    expect((await read(await restore(appReq(`/admin/removal/${STUDENT_ID}/restore`, { ...asAdmin, body: {} }), id(STUDENT_ID)))).data).toEqual({ restored: true });
    expect(student().status).toBe("active");
    expect(auth.calls.map((c) => c.attrs.ban_duration)).toEqual(["876000h", "none"]);
  });
  it("never yourself", async () => {
    const r = await read(await remove(appReq(`/admin/removal/${ADMIN_ID}/remove`, { ...asAdmin, body: {} }), id(ADMIN_ID)));
    expect(r.status).toBe(409);
    expect(r.error?.message).toMatch(/your own account/);
  });
  it("delete needs the typed name, then closes the request", async () => {
    const bad = await read(await del(appReq(`/admin/removal/${STUDENT_ID}/delete`, { ...asAdmin, body: { confirmName: "Asha" } }), id(STUDENT_ID)));
    expect(bad.status).toBe(409);
    expect(student().email).toBe("asha@example.com");
    const ok = await read(await del(appReq(`/admin/removal/${STUDENT_ID}/delete`, { ...asAdmin, body: { confirmName: "asha rao", requestId: REQ_ID } }), id(STUDENT_ID)));
    expect(ok.data).toEqual({ deleted: true });
    expect(student()).toMatchObject({ email: null, name: "Deleted account", block_reason: "[deleted]" });
    expect(G.db.tables.app_deletion_requests[0].status).toBe("done");
    expect(G.db.tables.admin_audit_log.map((a) => a.action)).toEqual(["person.account_deleted"]);
  });
  it("delete without a name is a bad request", async () => {
    expect((await del(appReq(`/admin/removal/${STUDENT_ID}/delete`, { ...asAdmin, body: {} }), id(STUDENT_ID))).status).toBe(400);
  });
  it("a made-up id is not found", async () => {
    expect((await remove(appReq("/admin/removal/nope/remove", { ...asAdmin, body: {} }), id("nope"))).status).toBe(404);
    const missing = "44444444-4444-4444-8444-444444444444";
    expect((await remove(appReq(`/admin/removal/${missing}/remove`, { ...asAdmin, body: {} }), id(missing))).status).toBe(404);
  });
  it("declines a request once", async () => {
    expect((await read(await decline(appReq(`/admin/removal/requests/${REQ_ID}/decline`, { ...asAdmin, body: {} }), id(REQ_ID)))).data).toEqual({ declined: true });
    expect((await decline(appReq(`/admin/removal/requests/${REQ_ID}/decline`, { ...asAdmin, body: {} }), id(REQ_ID))).status).toBe(409);
  });
});
