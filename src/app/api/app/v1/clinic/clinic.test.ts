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
import { parseQr } from "@/lib/clinic/qr";
import { GET as today } from "./today/route";
import { GET as week } from "./week/route";
import { POST as scan } from "./scan/route";
import { GET as myAttendance } from "./attendance/route";
import { GET as myLeave, POST as askLeave } from "./leave/route";
import { POST as askEarly } from "./leave/early/route";
import { DELETE as cancelLeave } from "./leave/[id]/route";
import { GET as myOpd } from "./opd/route";
import { PUT as chooseBatch } from "./opd/batch/route";
import { POST as sendLog } from "./opd/logs/route";
import { GET as overview } from "./admin/overview/route";
import { GET as slots, POST as addSlot } from "./admin/timetable/route";
import { DELETE as delSlot, PUT as editSlot } from "./admin/timetable/[id]/route";
import { POST as apply } from "./admin/timetable/apply/route";
import { GET as sessions, POST as addSession } from "./admin/sessions/route";
import { PATCH as patchSession } from "./admin/sessions/[id]/route";
import { PUT as setNote } from "./admin/notes/route";
import { GET as showCode } from "./admin/sessions/[id]/code/route";
import { GET as live, POST as mark } from "./admin/sessions/[id]/attendance/route";
import { GET as queue } from "./admin/leave/route";
import { POST as decide } from "./admin/leave/[id]/route";
import { GET as allowances, PUT as setAllowances } from "./admin/allowances/route";
import { GET as settings, PUT as saveSettings } from "./admin/opd/settings/route";
import { GET as quotas, PUT as setQuotas } from "./admin/opd/quotas/route";
import { POST as addExtra } from "./admin/opd/extras/route";
import { PUT as adminBatch } from "./admin/opd/batch/route";
import { POST as generate } from "./admin/opd/generate/route";
import { DELETE as discard, GET as plan } from "./admin/opd/plan/route";
import { POST as move } from "./admin/opd/move/route";
import { POST as publish } from "./admin/opd/publish/route";
import { POST as remind } from "./admin/opd/remind/route";
import { GET as trackers } from "./admin/trackers/route";
import { GET as student } from "./admin/students/[id]/route";

const COHORT = "c0c0c0c0-0000-4000-8000-000000000001";
const OTHER_COHORT = "c0c0c0c0-0000-4000-8000-000000000002";
const OUTSIDER = "33333333-3333-4333-8333-333333333333";
const PEER = "44444444-4444-4444-8444-444444444444";
const VIEW_ID = "99999999-9999-4999-8999-999999999999";
const OPD = "5e5e5e5e-0000-4000-8000-000000000001"; // today 08:00 to 10:00
const CLASS = "5e5e5e5e-0000-4000-8000-000000000002"; // today 10:30 to 13:00
const TOMORROW = "5e5e5e5e-0000-4000-8000-000000000003"; // tomorrow class
const PAST_OPD = "5e5e5e5e-0000-4000-8000-000000000004"; // last Friday OPD
const ASSIGN_TODAY = "a5a5a5a5-0000-4000-8000-000000000001";
const ASSIGN_PAST = "a5a5a5a5-0000-4000-8000-000000000002";

/** Monday 16 Nov 2026, 08:05 in India. */
const NOW = Date.parse("2026-11-16T02:35:00Z");

/** A token valid for three days from NOW (the tests move the clock). */
const token = (name: string) => `${Buffer.from(name).toString("base64url")}xxxxxxxxxx.${Buffer.from(JSON.stringify({ exp: Math.floor(NOW / 1000) + 3 * 86400 })).toString("base64url")}.sig`;

let T: { student: string; admin: string; view: string; outsider: string; peer: string };

const session = (id: string, date: string, start: string, end: string, kind: string, over: Record<string, unknown> = {}) => ({
  id, cohort_ids: [COHORT], slot_id: null, date, start_time: start, end_time: end, kind, title: kind.startsWith("opd") ? "OPD" : "Class",
  place: "Clinic", online_link: null, compulsory: !kind.startsWith("opd"), status: "scheduled", origin: "one_off", note: null, moved_from: null, ...over,
});

function seed(missing: string[] = []) {
  resetGuard(
    {
      profiles: [
        profileRow(),
        profileRow({ id: ADMIN_ID, email: "owner@example.com", name: "Owner", role: "admin", roll_number: null }),
        profileRow({ id: VIEW_ID, email: "view@example.com", name: "Viewer", role: "view_admin", roll_number: null }),
        profileRow({ id: OUTSIDER, email: "out@example.com", name: "Out Sider", roll_number: "R9" }),
        profileRow({ id: PEER, email: "peer@example.com", name: "Peer Two", roll_number: "R2" }),
      ],
      app_devices: [STUDENT_ID, ADMIN_ID, VIEW_ID, OUTSIDER, PEER].map((u, i) => ({ id: `d${i}`, user_id: u, device_id: DEVICE, name: "Phone", platform: "android", push_token: null, active: true, activated_at: "2026-11-01T00:00:00.000Z", last_seen_at: null })),
      cohorts: [
        { id: COHORT, name: "Cohort 2", created_at: "2026-10-01T00:00:00Z" },
        { id: OTHER_COHORT, name: "Cohort 1", created_at: "2026-01-01T00:00:00Z" },
      ],
      cohort_members: [
        { cohort_id: COHORT, user_id: STUDENT_ID, added_at: "2026-11-01T00:00:00Z" },
        { cohort_id: COHORT, user_id: PEER, added_at: "2026-11-01T00:00:00Z" },
        { cohort_id: OTHER_COHORT, user_id: OUTSIDER, added_at: "2026-11-01T00:00:00Z" },
      ],
      clinic_sessions: [
        session(OPD, "2026-11-16", "08:00:00", "10:00:00", "opd_morning"),
        session(CLASS, "2026-11-16", "10:30:00", "13:00:00", "class"),
        session(TOMORROW, "2026-11-17", "10:00:00", "13:00:00", "class"),
        session(PAST_OPD, "2026-11-13", "08:00:00", "10:00:00", "opd_morning"),
      ],
      clinic_timetable_slots: [],
      clinic_day_notes: [{ id: "n1", cohort_id: COHORT, date: "2026-11-16", note: "Bring your case sheets" }],
      clinic_session_secrets: [],
      clinic_attendance: [],
      clinic_leave_allowances: [],
      clinic_leave_allowance_log: [],
      clinic_leave_requests: [],
      clinic_opd_settings: [
        {
          cohort_id: COHORT,
          seats: { "1": { morning: 3, evening: 3 }, "2": { morning: 3, evening: 3 }, "3": { morning: 3, evening: 3 }, "4": { morning: 3, evening: 3 }, "5": { morning: 3, evening: 3 } },
          cases_per_visit: 2, start_date: "2026-11-09", end_date: "2026-12-11", late_minutes: 10, holidays: [], freeze_days: 7,
        },
      ],
      clinic_opd_prefs: [],
      clinic_case_quotas: [],
      clinic_case_extras: [],
      clinic_opd_assignments: [
        { id: ASSIGN_TODAY, cohort_id: COHORT, user_id: STUDENT_ID, date: "2026-11-16", batch: "morning", state: "published", source: "new", published_at: "2026-11-10T00:00:00Z" },
        { id: ASSIGN_PAST, cohort_id: COHORT, user_id: STUDENT_ID, date: "2026-11-13", batch: "morning", state: "published", source: "new", published_at: "2026-11-10T00:00:00Z" },
      ],
      clinic_case_logs: [],
    },
    missing,
  );
  T = { student: token("s"), admin: token("a"), view: token("v"), outsider: token("o"), peer: token("p") };
  G.users[T.student] = { id: STUDENT_ID, email: "asha@example.com" };
  G.users[T.admin] = { id: ADMIN_ID, email: "owner@example.com" };
  G.users[T.view] = { id: VIEW_ID, email: "view@example.com" };
  G.users[T.outsider] = { id: OUTSIDER, email: "out@example.com" };
  G.users[T.peer] = { id: PEER, email: "peer@example.com" };
}

const at = (ms: number) => vi.setSystemTime(ms);
const get = (fn: (r: Request, c: never) => Promise<Response>, path: string, tok: string, p?: Record<string, string>) => fn(appReq(path, { token: tok }), (p ? params(p) : noParams) as never).then(read);
const send = (fn: (r: Request, c: never) => Promise<Response>, path: string, tok: string, body: unknown, method = "POST", p?: Record<string, string>) =>
  fn(appReq(path, { token: tok, body, method }), (p ? params(p) : noParams) as never).then(read);

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  at(NOW);
  clearDeviceCache();
  seed();
});
afterEach(() => vi.useRealTimers());

describe("clinic: student schedule", () => {
  it("today: sessions, my OPD day, the day's note, leaves left", async () => {
    const r = await get(today, "/clinic/today", T.student);
    expect(r.status).toBe(200);
    expect(r.data.date).toBe("2026-11-16");
    expect(r.data.cohortId).toBe(COHORT);
    expect(r.data.note).toBe("Bring your case sheets");
    expect(r.data.sessions.map((s: { id: string }) => s.id)).toEqual([OPD, CLASS]);
    expect(r.data.sessions[0]).toMatchObject({ assigned: true, required: true, open: true, batch: "morning" });
    expect(r.data.opd).toMatchObject({ batch: "morning", start: "08:00", end: "10:00", sessionId: OPD, assignmentId: ASSIGN_TODAY });
    expect(r.data.leavesLeft).toBe(0);
  });

  it("a peer not assigned to today's OPD sees it as not required", async () => {
    const r = await get(today, "/clinic/today", T.peer);
    expect(r.data.sessions[0]).toMatchObject({ assigned: false, required: false });
    expect(r.data.opd).toBeNull();
  });

  it("a student in no clinic cohort gets an empty day; another cohort's id is refused", async () => {
    const r = await get(today, "/clinic/today", T.outsider);
    expect(r.data.sessions).toEqual([]);
    const bad = await get(today, `/clinic/today?cohort=${COHORT}`, T.outsider);
    expect(bad.status).toBe(403);
  });

  it("week: seven days from Monday", async () => {
    const r = await get(week, "/clinic/week", T.student);
    expect(r.data.from).toBe("2026-11-16");
    expect(r.data.to).toBe("2026-11-22");
    expect(r.data.days).toHaveLength(7);
    expect(r.data.days[1].sessions.map((s: { id: string }) => s.id)).toEqual([TOMORROW]);
    expect((await get(week, "/clinic/week?start=2026-13-01", T.student)).status).toBe(400);
  });

  it("answers 503 before the database step", async () => {
    seed(["clinic_opd_settings", "clinic_sessions", "clinic_leave_requests"]);
    const r = await get(today, "/clinic/today", T.student);
    expect(r.status).toBe(503);
    expect(r.error!.code).toBe("unavailable");
  });
});

describe("clinic: QR attendance", () => {
  it("a View Admin cannot open the code first; the owner can, then both see it", async () => {
    expect((await get(showCode, `/clinic/admin/sessions/${OPD}/code`, T.view, { id: OPD })).status).toBe(403);
    const r = await get(showCode, `/clinic/admin/sessions/${OPD}/code`, T.admin, { id: OPD });
    expect(r.status).toBe(200);
    expect(r.data.code).toMatch(/^[A-HJ-NP-Z2-9]{6}$/);
    expect(G.db.tables.clinic_session_secrets).toHaveLength(1);
    const v = await get(showCode, `/clinic/admin/sessions/${OPD}/code`, T.view, { id: OPD });
    expect(v.data.qr).toBe(r.data.qr);
  });

  it("the code is only shown while the session is open", async () => {
    const r = await get(showCode, `/clinic/admin/sessions/${TOMORROW}/code`, T.admin, { id: TOMORROW });
    expect(r.status).toBe(409);
  });

  it("scan in, scan out, once each; late flag; minutes", async () => {
    at(NOW + 10 * 60_000); // 08:15, late
    const code = await get(showCode, `/clinic/admin/sessions/${OPD}/code`, T.admin, { id: OPD });
    const first = await send(scan, "/clinic/scan", T.student, { token: code.data.qr });
    expect(first.status).toBe(200);
    expect(first.data).toMatchObject({ sessionId: OPD, direction: "in", late: true });
    const again = await send(scan, "/clinic/scan", T.student, { token: code.data.qr, direction: "in" });
    expect(again.status).toBe(400);
    expect(again.error!.message).toBe("You already scanned in.");

    at(NOW + 100 * 60_000); // 09:45
    const later = await get(showCode, `/clinic/admin/sessions/${OPD}/code`, T.admin, { id: OPD });
    const out = await send(scan, "/clinic/scan", T.student, { token: later.data.qr });
    expect(out.data).toMatchObject({ direction: "out", minutes: 90 });
    expect((await send(scan, "/clinic/scan", T.student, { token: later.data.qr })).status).toBe(400);
    expect(G.limits).toContain(`app:clinic-scan:${STUDENT_ID}`);
  });

  it("a photo of the QR stops working after the next window", async () => {
    const code = await get(showCode, `/clinic/admin/sessions/${OPD}/code`, T.admin, { id: OPD });
    at(NOW + 61_000);
    const r = await send(scan, "/clinic/scan", T.student, { token: code.data.qr });
    expect(r.status).toBe(400);
  });

  it("typing the 6-character code works for an open session of my cohort", async () => {
    const code = await get(showCode, `/clinic/admin/sessions/${OPD}/code`, T.admin, { id: OPD });
    const r = await send(scan, "/clinic/scan", T.peer, { code: code.data.code.toLowerCase() });
    expect(r.status).toBe(200);
    expect(r.data.sessionId).toBe(OPD);
    expect(G.db.tables.clinic_attendance![0]).toMatchObject({ user_id: PEER, in_method: "code" });
    expect((await send(scan, "/clinic/scan", T.peer, { code: "ZZZZZZ" })).status).toBe(400);
  });

  it("refuses a student of another cohort, and a forged token", async () => {
    const code = await get(showCode, `/clinic/admin/sessions/${OPD}/code`, T.admin, { id: OPD });
    expect((await send(scan, "/clinic/scan", T.outsider, { token: code.data.qr })).status).toBe(403);
    const p = parseQr(code.data.qr)!;
    const forged = `vibha-att:1:${p.sessionId}:${p.window}:${"A".repeat(22)}`;
    expect((await send(scan, "/clinic/scan", T.student, { token: forged })).status).toBe(400);
    expect((await send(scan, "/clinic/scan", T.student, {})).status).toBe(400);
    expect((await send(scan, "/clinic/scan", T.student, { token: code.data.qr, code: "ABCDEF" })).status).toBe(400);
  });

  it("live attendance and a manual mark with a note (owner only)", async () => {
    const before = await get(live, `/clinic/admin/sessions/${CLASS}/attendance`, T.view, { id: CLASS });
    expect(before.status).toBe(200);
    expect(before.data.counts).toMatchObject({ expected: 2, in: 0, missing: 2 });
    expect((await send(mark, `/clinic/admin/sessions/${CLASS}/attendance`, T.view, { userId: STUDENT_ID, direction: "in" }, "POST", { id: CLASS })).status).toBe(403);
    at(Date.parse("2026-11-16T05:10:00Z")); // 10:40
    const r = await send(mark, `/clinic/admin/sessions/${CLASS}/attendance`, T.admin, { userId: STUDENT_ID, direction: "in", note: "Phone dead" }, "POST", { id: CLASS });
    expect(r.status).toBe(200);
    const row = r.data.rows.find((x: { userId: string }) => x.userId === STUDENT_ID);
    expect(row).toMatchObject({ manual: true, note: "Phone dead", late: false });
    expect(r.data.counts).toMatchObject({ in: 1, missing: 1 });
    const out = await send(mark, `/clinic/admin/sessions/${CLASS}/attendance`, T.admin, { userId: PEER, direction: "out" }, "POST", { id: CLASS });
    expect(out.status).toBe(400);
    const outsider = await send(mark, `/clinic/admin/sessions/${CLASS}/attendance`, T.admin, { userId: OUTSIDER, direction: "in" }, "POST", { id: CLASS });
    expect(outsider.status).toBe(400);
  });

  it("my attendance: history and percentage", async () => {
    at(Date.parse("2026-11-16T09:00:00Z")); // 14:30, everything today is over
    G.db.tables.clinic_attendance!.push({ id: "x", session_id: CLASS, user_id: STUDENT_ID, in_at: "2026-11-16T05:00:00Z", out_at: "2026-11-16T07:30:00Z", in_method: "qr", out_method: "qr", note: null, marked_by: null });
    const r = await get(myAttendance, "/clinic/attendance", T.student);
    // The missed assigned OPD day counts as a leave (not an absence) and is left out of the percent.
    expect(r.data.summary).toMatchObject({ required: 3, attended: 1, absent: 1, onLeave: 1, counted: 2, countedPresent: 1, percent: 50, minutes: 150 });
  });
});

describe("clinic: leave", () => {
  it("asks for leave over the limit; the admin sets allowances, approves; the student is told", async () => {
    const asked = await send(askLeave, "/clinic/leave", T.student, { sessionIds: [TOMORROW], reason: "Family function" });
    expect(asked.status).toBe(200);
    expect(asked.data).toMatchObject({ status: "pending", overLimit: true, cost: 1 });
    expect((await send(askLeave, "/clinic/leave", T.student, { sessionIds: [TOMORROW], reason: "Again" })).status).toBe(400);
    expect((await send(askLeave, "/clinic/leave", T.student, { sessionIds: [PAST_OPD], reason: "Past" })).status).toBe(400);

    const bulk = await send(setAllowances, "/clinic/admin/allowances", T.admin, { cohortId: COHORT, set: 3, note: "Term start" }, "PUT");
    expect(bulk.data.changed).toBe(2);
    at(NOW + 1000);
    const one = await send(setAllowances, "/clinic/admin/allowances", T.admin, { cohortId: COHORT, userIds: [PEER], add: 1 }, "PUT");
    expect(one.data.changed).toBe(1);
    expect((await send(setAllowances, "/clinic/admin/allowances", T.admin, { cohortId: COHORT, set: 1, add: 1 }, "PUT")).status).toBe(400);
    expect((await send(setAllowances, "/clinic/admin/allowances", T.view, { cohortId: COHORT, set: 1 }, "PUT")).status).toBe(403);
    const list = await get(allowances, `/clinic/admin/allowances?cohort=${COHORT}`, T.view);
    const peer = list.data.rows.find((r: { userId: string }) => r.userId === PEER);
    expect(peer.balance.allowance).toBe(4);
    expect(peer.log.map((l: { old: number | null; new: number }) => [l.old, l.new])).toEqual([[3, 4], [null, 3]]);

    const q = await get(queue, `/clinic/admin/leave?cohort=${COHORT}`, T.view);
    expect(q.data.requests).toHaveLength(1);
    expect(q.data.requests[0]).toMatchObject({ name: "Asha Rao", overLimitNow: false });
    expect((await send(decide, `/clinic/admin/leave/${asked.data.id}`, T.view, { decision: "approve" }, "POST", { id: asked.data.id })).status).toBe(403);
    const ok = await send(decide, `/clinic/admin/leave/${asked.data.id}`, T.admin, { decision: "approve", note: "Take care" }, "POST", { id: asked.data.id });
    expect(ok.data.status).toBe("approved");
    expect((await send(decide, `/clinic/admin/leave/${asked.data.id}`, T.admin, { decision: "reject" }, "POST", { id: asked.data.id })).status).toBe(409);
    const bell = G.db.tables.notifications!.filter((n) => n.user_id === STUDENT_ID);
    expect(bell.map((n) => n.title)).toEqual(["Leave approved"]);
    expect(String(bell[0]!.body)).toContain("Take care");

    // The session shows "on leave"; the balance counts it.
    at(Date.parse("2026-11-17T09:00:00Z"));
    const w = await get(week, "/clinic/week", T.student);
    expect(w.data.days[1].sessions[0].my.status).toBe("on_leave");
    const mine = await get(myLeave, "/clinic/leave", T.student);
    expect(mine.data.balance).toMatchObject({ allowance: 3, used: 3, left: 0 }); // the approved leave + two missed OPD days (13th and 16th)
  });

  it("early leave: free, inside the session's time, once", async () => {
    const bad = await send(askEarly, "/clinic/leave/early", T.student, { sessionId: CLASS, leaveAt: "14:00", reason: "Doctor" });
    expect(bad.status).toBe(400);
    const r = await send(askEarly, "/clinic/leave/early", T.student, { sessionId: CLASS, leaveAt: "12:00", reason: "Doctor" });
    expect(r.data).toMatchObject({ kind: "early", leaveAt: "12:00", cost: 0, overLimit: false });
    expect((await send(askEarly, "/clinic/leave/early", T.student, { sessionId: CLASS, leaveAt: "12:15", reason: "Again" })).status).toBe(400);
  });

  it("cancels only my own waiting request", async () => {
    const asked = await send(askLeave, "/clinic/leave", T.student, { sessionIds: [TOMORROW], reason: "Unwell" });
    const id = asked.data.id;
    expect((await cancelLeave(appReq(`/clinic/leave/${id}`, { token: T.peer, method: "DELETE" }), params({ id })).then(read)).status).toBe(404);
    const r = await cancelLeave(appReq(`/clinic/leave/${id}`, { token: T.student, method: "DELETE" }), params({ id })).then(read);
    expect(r.data).toEqual({ cancelled: true });
    expect((await cancelLeave(appReq(`/clinic/leave/${id}`, { token: T.student, method: "DELETE" }), params({ id })).then(read)).status).toBe(409);
  });

  it("a missed assigned OPD day becomes a used leave, and a late case log takes it back", async () => {
    const r = await get(myLeave, "/clinic/leave", T.student);
    const missed = r.data.requests.filter((x: { kind: string }) => x.kind === "missed");
    expect(missed).toHaveLength(1);
    expect(missed[0]).toMatchObject({ status: "approved", overLimit: true, cost: 1 });
    expect(r.data.balance.used).toBe(1);
    // Reading again adds nothing.
    await get(myLeave, "/clinic/leave", T.student);
    expect(G.db.tables.clinic_leave_requests!.filter((x) => x.kind === "missed")).toHaveLength(1);
    // The admin marks the day in by hand later... or the student sends the log: no longer missed.
    const log = await send(sendLog, "/clinic/opd/logs", T.student, { assignmentId: ASSIGN_PAST, cases: 2 });
    expect(log.data).toMatchObject({ state: "done", log: { cases: 2, absent: false } });
    expect(G.db.tables.clinic_leave_requests!.filter((x) => x.kind === "missed")).toHaveLength(0);
  });
});

describe("clinic: OPD for students", () => {
  it("picks a batch once; then only the admin changes it", async () => {
    const first = await send(chooseBatch, "/clinic/opd/batch", T.peer, { batch: "evening" }, "PUT");
    expect(first.data).toMatchObject({ batch: "evening", canChooseBatch: false });
    expect((await send(chooseBatch, "/clinic/opd/batch", T.peer, { batch: "morning" }, "PUT")).status).toBe(409);
    expect((await send(adminBatch, "/clinic/admin/opd/batch", T.admin, { cohortId: COHORT, userId: PEER, batch: "morning" }, "PUT")).data).toEqual({ batch: "morning" });
    const o = await get(myOpd, "/clinic/opd", T.peer);
    expect(o.data.batch).toBe("morning");
  });

  it("case log: absent counts as a leave; a future day is refused; another student's day is not found", async () => {
    const a = await send(sendLog, "/clinic/opd/logs", T.student, { assignmentId: ASSIGN_PAST, cases: 3, absent: true, note: "Fever" });
    expect(a.data).toMatchObject({ state: "absent", log: { cases: 0, absent: true, note: "Fever" } });
    expect(G.db.tables.clinic_leave_requests!.filter((x) => x.kind === "missed")).toHaveLength(1);
    expect((await send(sendLog, "/clinic/opd/logs", T.peer, { assignmentId: ASSIGN_PAST, cases: 1 })).status).toBe(404);
    G.db.tables.clinic_opd_assignments!.push({ id: "a5a5a5a5-0000-4000-8000-000000000009", cohort_id: COHORT, user_id: STUDENT_ID, date: "2026-11-20", batch: "morning", state: "published", source: "new", published_at: null });
    expect((await send(sendLog, "/clinic/opd/logs", T.student, { assignmentId: "a5a5a5a5-0000-4000-8000-000000000009", cases: 1 })).status).toBe(400);
  });

  it("my OPD: quota with extras, visits with states", async () => {
    await send(setQuotas, "/clinic/admin/opd/quotas", T.admin, { cohortId: COHORT, base: 7 }, "PUT");
    await send(addExtra, "/clinic/admin/opd/extras", T.admin, { cohortId: COHORT, userId: STUDENT_ID, count: 2, note: "paid 12 Nov" });
    const r = await get(myOpd, "/clinic/opd", T.student);
    expect(r.data.quota).toMatchObject({ base: 7, total: 9, done: 0, pending: 9 });
    expect(r.data.visits.map((v: { state: string }) => v.state)).toEqual(["missed", "today"]);
    expect(r.data.casesPerVisit).toBe(2);
  });
});

describe("clinic: admin timetable and sessions", () => {
  const slotBody = { cohortIds: [COHORT], weekday: 3, start: "17:00", end: "20:00", kind: "opd_evening", title: "OPD evening", place: "Clinic", compulsory: false };

  it("timetable CRUD and apply (adds only what is missing)", async () => {
    expect((await send(addSlot, "/clinic/admin/timetable", T.view, slotBody)).status).toBe(403);
    const made = await send(addSlot, "/clinic/admin/timetable", T.admin, slotBody);
    expect(made.data).toMatchObject({ weekday: 3, start: "17:00", kind: "opd_evening", active: true });
    expect((await send(addSlot, "/clinic/admin/timetable", T.admin, { ...slotBody, end: "16:00" })).status).toBe(400);
    expect((await send(addSlot, "/clinic/admin/timetable", T.admin, { ...slotBody, cohortIds: ["c0c0c0c0-0000-4000-8000-00000000000f"] })).status).toBe(400);
    const list = await get(slots, `/clinic/admin/timetable?cohort=${COHORT}`, T.view);
    expect(list.data.slots).toHaveLength(1);
    const first = await send(apply, "/clinic/admin/timetable/apply", T.admin, { cohortId: COHORT, from: "2026-11-16", to: "2026-11-30" });
    expect(first.data).toEqual({ created: 2, skipped: 0 });
    const again = await send(apply, "/clinic/admin/timetable/apply", T.admin, { cohortId: COHORT, from: "2026-11-16", to: "2026-11-30" });
    expect(again.data).toEqual({ created: 0, skipped: 2 });
    expect((await send(apply, "/clinic/admin/timetable/apply", T.admin, { cohortId: COHORT, from: "2026-01-01", to: "2026-12-31" })).status).toBe(400);
    const id = made.data.id;
    const edited = await send(editSlot, `/clinic/admin/timetable/${id}`, T.admin, { ...slotBody, title: "Evening OPD" }, "PUT", { id });
    expect(edited.data.title).toBe("Evening OPD");
    const gone = await delSlot(appReq(`/clinic/admin/timetable/${id}`, { token: T.admin, method: "DELETE" }), params({ id })).then(read);
    expect(gone.data).toEqual({ deleted: true });
  });

  it("a one-off session tells the cohort; cancel and move tell them too", async () => {
    const r = await send(addSession, "/clinic/admin/sessions", T.admin, { cohortIds: [COHORT], date: "2026-11-18", start: "06:30", end: "07:30", kind: "early_class", title: "Early class", onlineLink: "https://meet.example/x" });
    expect(r.data).toMatchObject({ origin: "one_off", compulsory: true, onlineLink: "https://meet.example/x" });
    expect(G.db.tables.notifications!.map((n) => n.user_id).sort()).toEqual([STUDENT_ID, PEER].sort());
    expect((await send(addSession, "/clinic/admin/sessions", T.admin, { cohortIds: [COHORT], date: "2026-11-18", start: "06:30", end: "07:30", kind: "class", title: "x", onlineLink: "javascript:alert(1)" })).status).toBe(400);

    G.db.tables.notifications = [];
    const moved = await send(patchSession, `/clinic/admin/sessions/${TOMORROW}`, T.admin, { start: "11:00", end: "14:00" }, "PATCH", { id: TOMORROW });
    expect(moved.data).toMatchObject({ start: "11:00", movedFrom: "2026-11-17 10:00" });
    expect(G.db.tables.notifications!.map((n) => n.title)).toEqual(["Moved: Class", "Moved: Class"]);

    G.db.tables.notifications = [];
    const off = await send(patchSession, `/clinic/admin/sessions/${OPD}`, T.admin, { status: "cancelled" }, "PATCH", { id: OPD });
    expect(off.data.status).toBe("cancelled");
    // OPD: only the student assigned that day hears about it.
    expect(G.db.tables.notifications!.map((n) => n.user_id)).toEqual([STUDENT_ID]);

    const quiet = await send(patchSession, `/clinic/admin/sessions/${CLASS}`, T.admin, { note: "Room 2", notify: false }, "PATCH", { id: CLASS });
    expect(quiet.data.note).toBe("Room 2");

    const list = await get(sessions, `/clinic/admin/sessions?cohort=${COHORT}&from=2026-11-16&to=2026-11-22`, T.view);
    expect(list.data.sessions.length).toBe(4);
    expect(list.data.notes).toEqual([{ date: "2026-11-16", note: "Bring your case sheets" }]);
  });

  it("day notes: set and clear", async () => {
    const r = await send(setNote, "/clinic/admin/notes", T.admin, { cohortId: COHORT, date: "2026-11-17", note: "Wear the white coat" }, "PUT");
    expect(r.data.note).toBe("Wear the white coat");
    const t = await get(week, "/clinic/week", T.student);
    expect(t.data.days[1].note).toBe("Wear the white coat");
    const c = await send(setNote, "/clinic/admin/notes", T.admin, { cohortId: COHORT, date: "2026-11-17", note: "" }, "PUT");
    expect(c.data.note).toBeNull();
  });

  it("overview: today's sessions with counts, waiting leave, write flag", async () => {
    await send(askLeave, "/clinic/leave", T.student, { sessionIds: [TOMORROW], reason: "Unwell" });
    const r = await get(overview, "/clinic/admin/overview", T.view);
    expect(r.data).toMatchObject({ cohortId: COHORT, today: "2026-11-16", pendingLeave: 1, canWrite: false });
    expect(r.data.cohorts.map((c: { id: string }) => c.id)).toEqual([COHORT, OTHER_COHORT]);
    expect(r.data.sessions.map((s: { counts: { expected: number } }) => s.counts.expected)).toEqual([1, 2]);
    expect((await get(overview, "/clinic/admin/overview", T.admin)).data.canWrite).toBe(true);
    expect((await get(overview, "/clinic/admin/overview", T.student)).status).toBe(403);
  });
});

describe("clinic: the OPD generator end to end", () => {
  beforeEach(async () => {
    await send(setQuotas, "/clinic/admin/opd/quotas", T.admin, { cohortId: COHORT, base: 8 }, "PUT");
    await send(adminBatch, "/clinic/admin/opd/batch", T.admin, { cohortId: COHORT, userId: STUDENT_ID, batch: "morning" }, "PUT");
  });

  it("settings round trip, validated", async () => {
    const s = await get(settings, `/clinic/admin/opd/settings?cohort=${COHORT}`, T.view);
    expect(s.data).toMatchObject({ casesPerVisit: 2, lateMinutes: 10, freezeDays: 7 });
    const saved = await send(saveSettings, "/clinic/admin/opd/settings", T.admin, { ...s.data, holidays: ["2026-11-20"], seats: { ...s.data.seats, "6": { morning: 0 } } }, "PUT");
    expect(saved.data.holidays).toEqual(["2026-11-20"]);
    expect(saved.data.seats["6"]).toBeUndefined();
    expect((await send(saveSettings, "/clinic/admin/opd/settings", T.admin, { ...s.data, seats: { "7": { morning: 1 } } }, "PUT")).status).toBe(400);
    expect((await send(saveSettings, "/clinic/admin/opd/settings", T.admin, { ...s.data, startDate: "2026-12-30" }, "PUT")).status).toBe(400);
  });

  it("generate a draft, see who has no batch, publish, generate again keeps days", async () => {
    const draft = await send(generate, "/clinic/admin/opd/generate", T.admin, { cohortId: COHORT });
    expect(draft.status).toBe(200);
    expect(draft.data.state).toBe("draft");
    expect(draft.data.noBatch.map((x: { userId: string }) => x.userId)).toEqual([PEER]);
    const mine = draft.data.days.flatMap((d: { date: string; morning: { people: { userId: string; source: string }[] } }) => d.morning.people.filter((p) => p.userId === STUDENT_ID).map((p) => ({ date: d.date, source: p.source })));
    // 8 cases, last Friday missed (counts nothing): 4 visits, today's kept.
    expect(mine).toHaveLength(4);
    expect(mine[0]).toEqual({ date: "2026-11-16", source: "kept" });
    expect(draft.data.short).toEqual([]);

    // Students do not see a draft.
    expect((await get(myOpd, "/clinic/opd", T.student)).data.visits).toHaveLength(2);

    const pub = await send(publish, "/clinic/admin/opd/publish", T.admin, { cohortId: COHORT });
    expect(pub.data).toMatchObject({ published: 4, notified: 1 });
    expect(G.db.tables.notifications!.at(-1)!.title).toBe("Your OPD days");
    const visits = (await get(myOpd, "/clinic/opd", T.student)).data.visits;
    expect(visits.map((v: { date: string }) => v.date)).toEqual(["2026-11-13", ...mine.map((m: { date: string }) => m.date)]);
    expect((await send(publish, "/clinic/admin/opd/publish", T.admin, { cohortId: COHORT })).status).toBe(409);

    const again = await send(generate, "/clinic/admin/opd/generate", T.admin, { cohortId: COHORT });
    const sources = again.data.days.flatMap((d: { morning: { people: { userId: string; source: string }[] } }) => d.morning.people.filter((p) => p.userId === STUDENT_ID).map((p) => p.source));
    expect(sources).toEqual(["kept", "kept", "kept", "kept"]);
    const thrown = await discard(appReq(`/clinic/admin/opd/plan?cohort=${COHORT}`, { token: T.admin, method: "DELETE" }), noParams).then(read);
    expect(thrown.data.deleted).toBe(4);
    const pubView = await get(plan, `/clinic/admin/opd/plan?cohort=${COHORT}`, T.view);
    expect(pubView.data).toMatchObject({ state: "published", hasDraft: false });
  });

  it("move a visit: a full day is refused unless forced; a second visit on one day never", async () => {
    G.db.tables.clinic_opd_assignments!.push(
      ...["p1", "p2", "p3"].map((x, i) => ({ id: `a5a5a5a5-0000-4000-8000-00000000010${i}`, cohort_id: COHORT, user_id: `${x}-user`, date: "2026-11-18", batch: "morning", state: "published", source: "new", published_at: null })),
    );
    const full = await send(move, "/clinic/admin/opd/move", T.admin, { assignmentId: ASSIGN_TODAY, date: "2026-11-18", batch: "morning" });
    expect(full.status).toBe(409);
    expect(full.error!.message).toBe("That day is full.");
    const forced = await send(move, "/clinic/admin/opd/move", T.admin, { assignmentId: ASSIGN_TODAY, date: "2026-11-18", batch: "morning", force: true });
    expect(forced.status).toBe(200);
    expect(G.db.tables.notifications!.at(-1)!.title).toBe("Your OPD day moved");
    expect((await send(move, "/clinic/admin/opd/move", T.admin, { assignmentId: ASSIGN_PAST, date: "2026-11-19", batch: "morning" })).status).toBe(409); // past
    const weekend = await send(move, "/clinic/admin/opd/move", T.admin, { assignmentId: ASSIGN_TODAY, date: "2026-11-21", batch: "morning" });
    expect(weekend.error!.message).toBe("There is no OPD on that day.");
  });

  it("quotas list, trackers, one student's page, reminders", async () => {
    at(Date.parse("2026-11-16T09:00:00Z")); // 14:30
    G.db.tables.clinic_attendance!.push({ id: "x", session_id: OPD, user_id: STUDENT_ID, in_at: "2026-11-16T02:30:00Z", out_at: "2026-11-16T04:30:00Z", in_method: "qr", out_method: "qr", note: null, marked_by: null });
    const q = await get(quotas, `/clinic/admin/opd/quotas?cohort=${COHORT}`, T.view);
    expect(q.data.rows.find((r: { userId: string }) => r.userId === STUDENT_ID)).toMatchObject({ batch: "morning", quota: { total: 8, done: 0, pending: 8 }, visitsPlanned: 1 });
    const t = await get(trackers, `/clinic/admin/trackers?cohort=${COHORT}`, T.view);
    const row = t.data.rows.find((r: { userId: string }) => r.userId === STUDENT_ID);
    expect(row.visits).toMatchObject({ planned: 2, missed: 1 });
    expect(row.leave.used).toBe(1);
    expect(row.attendance.attended).toBe(1);
    const d = await get(student, `/clinic/admin/students/${STUDENT_ID}?cohort=${COHORT}`, T.view, { id: STUDENT_ID });
    expect(d.data.visits).toHaveLength(2);
    expect(d.data.leave.map((l: { kind: string }) => l.kind)).toEqual(["missed"]);
    expect((await get(student, `/clinic/admin/students/${OUTSIDER}?cohort=${COHORT}`, T.view, { id: OUTSIDER })).status).toBe(404);
    const rem = await send(remind, "/clinic/admin/opd/remind", T.admin, { cohortId: COHORT });
    expect(rem.data.notified).toBe(1);
    expect(G.db.tables.notifications!.at(-1)).toMatchObject({ user_id: STUDENT_ID, title: "Send your OPD case log" });
  });

  it("generation needs a date range", async () => {
    G.db.tables.clinic_opd_settings![0]!.start_date = null;
    const r = await send(generate, "/clinic/admin/opd/generate", T.admin, { cohortId: COHORT });
    expect(r.status).toBe(400);
  });
});

describe("clinic: roles", () => {
  it("students cannot reach admin routes; View Admin reads but never writes", async () => {
    expect((await get(trackers, "/clinic/admin/trackers", T.student)).status).toBe(403);
    expect((await get(trackers, "/clinic/admin/trackers", T.view)).status).toBe(200);
    for (const [fn, path, body, method] of [
      [generate, "/clinic/admin/opd/generate", { cohortId: COHORT }, "POST"],
      [publish, "/clinic/admin/opd/publish", { cohortId: COHORT }, "POST"],
      [setQuotas, "/clinic/admin/opd/quotas", { cohortId: COHORT, base: 1 }, "PUT"],
      [addExtra, "/clinic/admin/opd/extras", { cohortId: COHORT, userId: STUDENT_ID, count: 1 }, "POST"],
      [saveSettings, "/clinic/admin/opd/settings", {}, "PUT"],
      [setNote, "/clinic/admin/notes", { cohortId: COHORT, date: "2026-11-17", note: "x" }, "PUT"],
      [remind, "/clinic/admin/opd/remind", { cohortId: COHORT }, "POST"],
    ] as const) {
      const r = await send(fn as never, path, T.view, body, method);
      expect(r.status, path).toBe(403);
    }
  });
});
