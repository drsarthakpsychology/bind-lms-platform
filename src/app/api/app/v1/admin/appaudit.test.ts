import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { ADMIN_TOKEN, STUDENT_ID, appReq, noParams, params, read } from "@/lib/app-api/test-kit";

const h = vi.hoisted(() => ({
  feature: vi.fn(async (_ids: string[], _f: string, _off: boolean) => ({ error: null as string | null, done: 1 })),
  scope: vi.fn(async (_ids: string[], _s: string) => ({ error: null as string | null, done: 1 })),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/app/(dashboard)/admin/access/actions", () => ({ setFeatureFor: h.feature, setScopeFor: h.scope }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { GET as getAccess, PUT as putAccess } from "./students/[id]/access/route";
import { GET as reports } from "./wall-reports/route";
import { POST as resolve } from "./wall-reports/[id]/resolve/route";

const R1 = "11111111-1111-4111-8111-111111111111";
const R2 = "22222222-2222-4222-8222-222222222222";
const P1 = "33333333-3333-4333-8333-333333333333";
const asAdmin = { token: ADMIN_TOKEN };

beforeEach(() => {
  resetGuard({
    access_blocks: [{ user_id: STUDENT_ID, feature: "games" }],
    wall_reports: [
      { id: R1, post_id: P1, reply_id: null, reason: "Rude", status: "open", created_at: "2026-11-16T10:00:00Z" },
      { id: R2, post_id: P1, reply_id: "gone", reason: null, status: "open", created_at: "2026-11-16T11:00:00Z" },
    ],
    wall_posts: [{ id: P1, content: "A post" }],
    wall_replies: [],
  });
  clearDeviceCache();
  h.feature.mockClear();
  h.scope.mockClear();
});

describe("a student's section switches in the app", () => {
  it("reads Full or Lectures only and every section, with what is off", async () => {
    const r = await read(await getAccess(appReq(`/admin/students/${STUDENT_ID}/access`, asAdmin), params({ id: STUDENT_ID })));
    expect(r.data).toMatchObject({ scope: "full", ready: true, canWrite: true });
    expect(r.data.sections.find((s: { key: string }) => s.key === "games")).toMatchObject({ label: "Games", group: "Sections", off: true });
    expect(r.data.sections.find((s: { key: string }) => s.key === "wall")).toMatchObject({ off: false });
    expect(r.data.sections.some((s: { group: string }) => s.group === "Practice tools")).toBe(true);
  });

  it("switches through the website's actions, for super admins only", async () => {
    let r = await read(await putAccess(appReq(`/admin/students/${STUDENT_ID}/access`, { ...asAdmin, method: "PUT", body: { feature: "wall", off: true } }), params({ id: STUDENT_ID })));
    expect(r.status).toBe(200);
    expect(h.feature).toHaveBeenCalledWith([STUDENT_ID], "wall", true);
    r = await read(await putAccess(appReq(`/admin/students/${STUDENT_ID}/access`, { ...asAdmin, method: "PUT", body: { scope: "lectures_only" } }), params({ id: STUDENT_ID })));
    expect(h.scope).toHaveBeenCalledWith([STUDENT_ID], "lectures_only");
    h.feature.mockResolvedValueOnce({ error: "Unknown section.", done: 0 });
    r = await read(await putAccess(appReq(`/admin/students/${STUDENT_ID}/access`, { ...asAdmin, method: "PUT", body: { feature: "nope", off: true } }), params({ id: STUDENT_ID })));
    expect(r.error?.code).toBe("bad_request");
    r = await read(await putAccess(appReq(`/admin/students/${STUDENT_ID}/access`, { method: "PUT", body: { feature: "wall", off: true } }), params({ id: STUDENT_ID })));
    expect(r.error?.code).toBe("forbidden");
    expect((await read(await getAccess(appReq(`/admin/students/${STUDENT_ID}/access`), params({ id: STUDENT_ID })))).error?.code).toBe("forbidden");
  });

  it("is not found for a bad id", async () => {
    expect((await read(await getAccess(appReq("/admin/students/x/access", asAdmin), params({ id: "x" })))).status).toBe(404);
  });
});

describe("class wall reports in the app", () => {
  it("lists open reports oldest first with the reported text", async () => {
    const r = await read(await reports(appReq("/admin/wall-reports", asAdmin), noParams));
    expect(r.data.items).toEqual([
      { id: R1, kind: "post", content: "A post", reason: "Rude", createdAt: "2026-11-16T10:00:00Z" },
      { id: R2, kind: "reply", content: "(reply removed)", reason: "No reason given", createdAt: "2026-11-16T11:00:00Z" },
    ]);
    expect((await read(await reports(appReq("/admin/wall-reports"), noParams))).error?.code).toBe("forbidden");
  });

  it("resolves one; the post stays", async () => {
    const r = await read(await resolve(appReq(`/admin/wall-reports/${R1}/resolve`, { ...asAdmin, method: "POST" }), params({ id: R1 })));
    expect(r.data).toEqual({ resolved: true });
    expect(G.db.tables.wall_reports.find((x) => x.id === R1)?.status).toBe("resolved");
    expect(G.db.tables.wall_posts).toHaveLength(1);
    expect((await read(await resolve(appReq(`/admin/wall-reports/${R2}/resolve`, { method: "POST" }), params({ id: R2 })))).error?.code).toBe("forbidden");
  });
});
