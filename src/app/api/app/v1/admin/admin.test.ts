import { beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { ADMIN_ID, ADMIN_TOKEN, STUDENT_ID, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

const VIEW_ID = "99999999-9999-4999-8999-999999999999";
const VIEW_TOKEN = "dmlld3h4eHh4eHh4eHh4.eyJleHAiOjQxMDI0NDQ4MDB9.sig";

const h = vi.hoisted(() => ({
  roster: vi.fn(),
  hidden: vi.fn(async () => new Set<string>(["robot"])),
  live: vi.fn(async () => [] as unknown[]),
  complaints: vi.fn(async () => 2),
  detail: vi.fn(),
  status: vi.fn(async () => ({ error: null })),
  send: vi.fn(),
  batches: vi.fn(async () => ({ batches: [], ready: true })),
  doubts: vi.fn(async () => []),
  hide: vi.fn(async () => ({ error: null })),
  activity: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/people/roster-data", () => ({ loadRoster: h.roster }));
vi.mock("@/lib/people/hidden-ids", () => ({ loadHiddenIds: h.hidden }));
vi.mock("@/lib/analytics/live", () => ({ loadLive: h.live }));
vi.mock("@/lib/analytics/activity", () => ({ loadStudentDetail: h.detail, loadActivity: h.activity }));
vi.mock("@/lib/doubts/data", () => ({ openComplaintCount: h.complaints, loadDoubts: h.doubts, doubtsReady: async () => true }));
vi.mock("@/app/(dashboard)/admin/students/actions", () => ({ setAccountStatus: h.status }));
vi.mock("@/lib/notify/send", () => ({ sendNotifications: h.send, loadNotifyBatches: h.batches }));
vi.mock("@/app/(dashboard)/doubts/actions", () => ({ adminHideDoubt: h.hide }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { GET as home } from "./home/route";
import { GET as students } from "./students/route";
import { GET as student } from "./students/[id]/route";
import { POST as lock } from "./students/[id]/lock/route";
import { POST as unlock } from "./students/[id]/unlock/route";
import { GET as activity } from "./activity/route";
import { GET as batches, POST as send } from "./messages/route";
import { GET as doubts } from "./doubts/route";
import { POST as hide } from "./doubts/[id]/hide/route";

const rosterRow = (id: string, over: Record<string, unknown> = {}) => ({
  id, name: `Name ${id}`, email: `${id}@x.org`, roll: null, mobile: null, scope: "full", blocked: false, expiresAt: null, createdAt: null, account: "active", presence: "week", lastSeen: null,
  cohorts: [{ id: "c1", name: "Cohort 2" }], min7: 30, min30: 90, activeDays30: 4, lecturesDone: 1, lecturesStarted: 2, lecturesAvailable: 6, watchMin: 40, xp: 10, detailsDone: true, flags: [], ...over,
});

beforeEach(() => {
  resetGuard();
  G.db.tables.profiles.push(profileRow({ id: VIEW_ID, email: "view@x.org", role: "view_admin" }));
  G.db.tables.app_devices.push({ id: "d9", user_id: VIEW_ID, device_id: "phone-aaaaaaaaaaaaaaaa", name: "x", platform: "android", push_token: null, active: true, activated_at: null, last_seen_at: null });
  G.users[VIEW_TOKEN] = { id: VIEW_ID, email: "view@x.org" };
  clearDeviceCache();
  for (const f of [h.roster, h.detail, h.send, h.activity]) f.mockReset();
  h.status.mockClear();
  h.hide.mockClear();
  h.roster.mockResolvedValue({ rows: [rosterRow("s1", { flags: ["behind", "quiet"] }), rosterRow("s2", { blocked: true, name: "Meera" }), rosterRow("robot")], cohorts: [{ id: "c1", name: "Cohort 2" }], publishedLectures: 6 });
});

const asAdmin = { token: ADMIN_TOKEN };

describe("admin access", () => {
  it("students cannot open admin routes; view admins read but never write", async () => {
    expect((await read(await home(appReq("/admin/home"), noParams))).error?.code).toBe("forbidden");
    expect((await read(await home(appReq("/admin/home", { token: VIEW_TOKEN }), noParams))).status).toBe(200);
    expect((await read(await lock(appReq(`/admin/students/${STUDENT_ID}/lock`, { token: VIEW_TOKEN, body: {} }), params({ id: STUDENT_ID })))).error?.code).toBe("forbidden");
    expect(h.status).not.toHaveBeenCalled();
  });
});

describe("admin home and students", () => {
  it("home counts real students only, needs-a-look first", async () => {
    const r = await read(await home(appReq("/admin/home", asAdmin), noParams));
    expect(r.data.counts).toMatchObject({ students: 2, locked: 1, needsLook: 1, openComplaints: 2 });
    expect(r.data.needsLook[0]).toMatchObject({ id: "s1", flags: ["behind", "quiet"] });
  });

  it("students: search, filter, paging", async () => {
    let r = await read(await students(appReq("/admin/students?search=meera", asAdmin), noParams));
    expect(r.data.items.map((x: { id: string }) => x.id)).toEqual(["s2"]);
    r = await read(await students(appReq("/admin/students?flag=behind&limit=1", asAdmin), noParams));
    expect(r.data).toMatchObject({ total: 1, nextCursor: null, cohorts: [{ id: "c1", name: "Cohort 2" }] });
  });

  it("a student's profile", async () => {
    h.detail.mockResolvedValue({ profile: { id: STUDENT_ID }, daily: [] });
    h.roster.mockResolvedValue({ rows: [rosterRow(STUDENT_ID)], cohorts: [], publishedLectures: 0 });
    const r = await read(await student(appReq(`/admin/students/${STUDENT_ID}`, asAdmin), params({ id: STUDENT_ID })));
    expect(r.data.row).toMatchObject({ id: STUDENT_ID, lecturesAvailable: 6 });
    expect(r.data.detail).toMatchObject({ daily: [] });
  });

  it("lock and unlock run the website action", async () => {
    expect((await read(await lock(appReq(`/admin/students/${STUDENT_ID}/lock`, { ...asAdmin, body: { reason: "fee" } }), params({ id: STUDENT_ID })))).data).toEqual({ blocked: true });
    expect(h.status).toHaveBeenCalledWith(STUDENT_ID, "blocked", "fee");
    expect((await read(await unlock(appReq(`/admin/students/${STUDENT_ID}/unlock`, { ...asAdmin, method: "POST" }), params({ id: STUDENT_ID })))).data).toEqual({ blocked: false });
  });
});

describe("activity, messages, doubts review", () => {
  it("activity leaves test accounts out", async () => {
    h.activity.mockResolvedValue({ rows: [{ id: "s1" }, { id: "robot" }], heat: [], pages: [] });
    const r = await read(await activity(appReq("/admin/activity", asAdmin), noParams));
    expect(r.data.kind).toBe("admin.activity");
    expect(r.data.data.rows).toEqual([{ id: "s1" }]);
  });

  it("messages: send goes through sendNotifications (bell, push, email) from the super admin", async () => {
    h.send.mockResolvedValue({ error: null, created: 2, emailed: 0, emailFailed: 0, batchId: "b1" });
    const r = await read(await send(appReq("/admin/messages", { ...asAdmin, body: { userIds: [STUDENT_ID], title: "Class moved", text: "Tomorrow at 6" } }), noParams));
    expect(r.data).toEqual({ created: 2, emailed: 0, emailFailed: 0, batchId: "b1" });
    expect(h.send.mock.calls[0][0]).toMatchObject({ title: "Class moved", sentBy: ADMIN_ID, type: "message", alsoEmail: false });
    expect((await read(await batches(appReq("/admin/messages", asAdmin), noParams))).data).toEqual({ batches: [], ready: true });
  });

  it("doubts review sees everything and hides as the super admin", async () => {
    await doubts(appReq("/admin/doubts?cohort=c1", asAdmin), noParams);
    expect(h.doubts).toHaveBeenCalledWith(expect.objectContaining({ isAdmin: true, cohortFilter: "c1" }));
    const D = "dddddddd-0000-4000-8000-000000000001";
    expect((await read(await hide(appReq(`/admin/doubts/${D}/hide`, { ...asAdmin, body: { hidden: true } }), params({ id: D })))).data).toEqual({ hidden: true });
    expect(h.hide).toHaveBeenCalledWith(D, true);
  });
});
