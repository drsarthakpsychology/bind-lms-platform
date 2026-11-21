import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { ADMIN_ID, DEVICE, STUDENT_ID, appReq, noParams, params, profileRow, read } from "@/lib/app-api/test-kit";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("next/server", async (orig) => ({ ...(await orig<typeof import("next/server")>()), after: (fn: () => unknown) => void fn() }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/rate-limit-fast", async () => (await import("@/lib/app-api/test-guard")).fastRateMock());
vi.mock("@/lib/app-api/push", () => ({ queuePush: () => undefined }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { GET as mine, PUT as save } from "./reflections/route";
import { GET as list } from "./admin/reflections/route";
import { POST as reply } from "./admin/reflections/[id]/reply/route";

const COHORT = "c0c0c0c0-0000-4000-8000-000000000001";
const PEER = "44444444-4444-4444-8444-444444444444";
const VIEW_ID = "99999999-9999-4999-8999-999999999999";
const A_PAST = "a5a5a5a5-0000-4000-8000-000000000002"; // Fri 13 Nov, case count sent
const A_ABSENT = "a5a5a5a5-0000-4000-8000-000000000003"; // Thu 12 Nov, logged absent
const A_NOLOG = "a5a5a5a5-0000-4000-8000-000000000004"; // Wed 11 Nov, no log yet
const A_FUTURE = "a5a5a5a5-0000-4000-8000-000000000005"; // Fri 20 Nov
const A_PEER = "a5a5a5a5-0000-4000-8000-000000000006"; // the peer's Fri 13 Nov

/** Monday 16 Nov 2026, 18:05 in India. */
const NOW = Date.parse("2026-11-16T12:35:00Z");
const token = (name: string) => `${Buffer.from(name).toString("base64url")}xxxxxxxxxx.${Buffer.from(JSON.stringify({ exp: Math.floor(NOW / 1000) + 3 * 86400 })).toString("base64url")}.sig`;

let T: { student: string; admin: string; view: string; peer: string };

const assign = (id: string, user: string, date: string) => ({ id, cohort_id: COHORT, user_id: user, date, batch: "evening", state: "published", source: "new", published_at: "2026-11-10T00:00:00Z" });
const log = (assignment: string, user: string, date: string, over: Record<string, unknown> = {}) => ({ id: `log-${assignment}`, assignment_id: assignment, user_id: user, cohort_id: COHORT, date, cases: 2, absent: false, note: null, ...over });

function seed(missing: string[] = []) {
  resetGuard(
    {
      profiles: [
        profileRow(),
        profileRow({ id: ADMIN_ID, email: "owner@example.com", name: "Dr Owner", role: "admin", roll_number: null }),
        profileRow({ id: VIEW_ID, email: "view@example.com", name: "Viewer", role: "view_admin", roll_number: null }),
        profileRow({ id: PEER, email: "peer@example.com", name: "Peer Two", roll_number: "R2" }),
      ],
      app_devices: [STUDENT_ID, ADMIN_ID, VIEW_ID, PEER].map((u, i) => ({ id: `d${i}`, user_id: u, device_id: DEVICE, name: "Phone", platform: "android", push_token: null, active: true, activated_at: "2026-11-01T00:00:00.000Z", last_seen_at: null })),
      cohorts: [{ id: COHORT, name: "Cohort 2", created_at: "2026-10-01T00:00:00Z" }],
      cohort_members: [
        { cohort_id: COHORT, user_id: STUDENT_ID, added_at: "2026-11-01T00:00:00Z" },
        { cohort_id: COHORT, user_id: PEER, added_at: "2026-11-01T00:00:00Z" },
      ],
      clinic_opd_settings: [],
      clinic_opd_assignments: [assign(A_PAST, STUDENT_ID, "2026-11-13"), assign(A_ABSENT, STUDENT_ID, "2026-11-12"), assign(A_NOLOG, STUDENT_ID, "2026-11-11"), assign(A_FUTURE, STUDENT_ID, "2026-11-20"), assign(A_PEER, PEER, "2026-11-13")],
      clinic_case_logs: [log(A_PAST, STUDENT_ID, "2026-11-13"), log(A_ABSENT, STUDENT_ID, "2026-11-12", { cases: 0, absent: true }), log(A_PEER, PEER, "2026-11-13")],
      clinic_reflections: [],
      notifications: [],
    },
    missing,
  );
  T = { student: token("s"), admin: token("a"), view: token("v"), peer: token("p") };
  G.users[T.student] = { id: STUDENT_ID, email: "asha@example.com" };
  G.users[T.admin] = { id: ADMIN_ID, email: "owner@example.com" };
  G.users[T.view] = { id: VIEW_ID, email: "view@example.com" };
  G.users[T.peer] = { id: PEER, email: "peer@example.com" };
}

const get = (fn: (r: Request, c: never) => Promise<Response>, path: string, tok: string) => fn(appReq(path, { token: tok }), noParams as never).then(read);
const send = (fn: (r: Request, c: never) => Promise<Response>, path: string, tok: string, body: unknown, method = "PUT", p?: Record<string, string>) =>
  fn(appReq(path, { token: tok, body, method }), (p ? params(p) : noParams) as never).then(read);
const put = (tok: string, body: unknown) => send(save, "/clinic/reflections", tok, body);

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  clearDeviceCache();
  seed();
});
afterEach(() => vi.useRealTimers());

describe("clinic reflections: student", () => {
  it("writes one for a day with its case count, then changes it (one row per day)", async () => {
    const r = await put(T.student, { assignmentId: A_PAST, saw: "  A first episode of mania.  ", learned: "How the MSE is ordered.", ask: "" });
    expect(r.status).toBe(200);
    expect(r.data.removed).toBe(0);
    expect(r.data.reflection).toMatchObject({ assignmentId: A_PAST, date: "2026-11-13", batch: "evening", saw: "A first episode of mania.", learned: "How the MSE is ordered.", ask: null, reply: null });
    const again = await put(T.student, { assignmentId: A_PAST, saw: "Changed", ask: "Why lithium first?" });
    expect(again.data.reflection).toMatchObject({ saw: "Changed", learned: null, ask: "Why lithium first?" });
    expect(G.db.tables.clinic_reflections).toHaveLength(1);
    const h = await get(mine, "/clinic/reflections", T.student);
    expect(h.data.reflections.map((x: { id: string }) => x.id)).toEqual([r.data.reflection.id]);
  });

  it("takes out phone numbers and emails before saving", async () => {
    const r = await put(T.student, { assignmentId: A_PAST, saw: "Relative gave 98765 43210 and +91-98765-43210, mail a.b@example.com. Seen 16-11-2026, BP 120/80, 2 cases." });
    expect(r.data.removed).toBe(3);
    const saved = G.db.tables.clinic_reflections![0]!.saw as string;
    expect(saved).not.toMatch(/98765|example\.com/);
    expect(saved).toContain("[number removed]");
    expect(saved).toContain("[email removed]");
    expect(saved).toContain("16-11-2026, BP 120/80, 2 cases");
  });

  it("refuses: empty, no case count yet, absent day, a future day, another student's day, a bad body", async () => {
    expect((await put(T.student, { assignmentId: A_PAST, saw: "  ", learned: "" })).status).toBe(400);
    const nolog = await put(T.student, { assignmentId: A_NOLOG, saw: "x" });
    expect(nolog.status).toBe(400);
    expect(nolog.error!.message).toMatch(/case count first/);
    expect((await put(T.student, { assignmentId: A_ABSENT, saw: "x" })).status).toBe(400);
    expect((await put(T.student, { assignmentId: A_FUTURE, saw: "x" })).status).toBe(400);
    expect((await put(T.student, { assignmentId: A_PEER, saw: "x" })).status).toBe(404);
    expect((await put(T.student, { assignmentId: "nope", saw: "x" })).status).toBe(400);
    expect(G.db.tables.clinic_reflections).toHaveLength(0);
  });

  it("history shows only my own", async () => {
    await put(T.student, { assignmentId: A_PAST, saw: "mine" });
    await put(T.peer, { assignmentId: A_PEER, saw: "theirs" });
    const h = await get(mine, "/clinic/reflections", T.student);
    expect(h.data.reflections.map((x: { saw: string }) => x.saw)).toEqual(["mine"]);
  });

  it("answers 503 before the database step", async () => {
    seed(["clinic_reflections"]);
    expect((await put(T.student, { assignmentId: A_PAST, saw: "x" })).status).toBe(503);
    expect((await get(mine, "/clinic/reflections", T.student)).status).toBe(503);
  });
});

describe("clinic reflections: admin", () => {
  it("lists per student and per day; View Admin reads; students cannot", async () => {
    await put(T.student, { assignmentId: A_PAST, saw: "mine" });
    await put(T.peer, { assignmentId: A_PEER, saw: "theirs" });
    const all = await get(list, "/clinic/admin/reflections", T.view);
    expect(all.status).toBe(200);
    expect(all.data.canWrite).toBe(false);
    expect(all.data.reflections).toHaveLength(2);
    expect(all.data.days).toEqual([{ date: "2026-11-13", count: 2, waiting: 2 }]);
    expect(all.data.people.map((p: { userId: string }) => p.userId).sort()).toEqual([STUDENT_ID, PEER].sort());
    const one = await get(list, `/clinic/admin/reflections?user=${PEER}`, T.admin);
    expect(one.data.canWrite).toBe(true);
    expect(one.data.reflections.map((x: { name: string }) => x.name)).toEqual(["Peer Two"]);
    expect((await get(list, "/clinic/admin/reflections?date=2026-11-12", T.admin)).data.reflections).toHaveLength(0);
    expect((await get(list, "/clinic/admin/reflections?date=2026-13-40", T.admin)).status).toBe(400);
    expect((await get(list, "/clinic/admin/reflections", T.student)).status).toBe(403);
  });

  it("the Super Admin replies; the student is told once and sees it; View Admin and students cannot reply", async () => {
    const r = await put(T.student, { assignmentId: A_PAST, saw: "mine", ask: "Why?" });
    const id = r.data.reflection.id as string;
    const path = `/clinic/admin/reflections/${id}/reply`;
    expect((await send(reply, path, T.view, { reply: "Hi" }, "POST", { id })).status).toBe(403);
    expect((await send(reply, path, T.student, { reply: "Hi" }, "POST", { id })).status).toBe(403);
    expect((await send(reply, path, T.admin, { reply: "  " }, "POST", { id })).status).toBe(400);
    const ok = await send(reply, path, T.admin, { reply: "Good question. We talk about it Friday." }, "POST", { id });
    expect(ok.status).toBe(200);
    expect(ok.data).toMatchObject({ userId: STUDENT_ID, reply: { text: "Good question. We talk about it Friday.", by: "Dr Owner" } });
    const bell = G.db.tables.notifications!.filter((n) => n.user_id === STUDENT_ID);
    expect(bell).toHaveLength(1);
    expect(bell[0]).toMatchObject({ title: "Reply to your reflection" });
    expect(String(bell[0]!.body_html)).toContain('href="/opd/reflections"');
    // The same words again: no second notice.
    await send(reply, path, T.admin, { reply: "Good question. We talk about it Friday." }, "POST", { id });
    expect(G.db.tables.notifications!.filter((n) => n.user_id === STUDENT_ID)).toHaveLength(1);
    const h = await get(mine, "/clinic/reflections", T.student);
    expect(h.data.reflections[0].reply).toMatchObject({ text: "Good question. We talk about it Friday.", by: "Dr Owner" });
    // The student changing the words keeps the reply.
    await put(T.student, { assignmentId: A_PAST, saw: "mine, changed" });
    expect((await get(mine, "/clinic/reflections", T.student)).data.reflections[0].reply).not.toBeNull();
    const missing = "a5a5a5a5-0000-4000-8000-0000000000ff";
    expect((await send(reply, `/clinic/admin/reflections/${missing}/reply`, T.admin, { reply: "x" }, "POST", { id: missing })).status).toBe(404);
  });
});
