import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { DEVICE, STUDENT_ID, appReq, noParams, profileRow, read } from "@/lib/app-api/test-kit";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: () => undefined, unstable_cache: (fn: unknown) => fn }));
vi.mock("next/server", async (orig) => ({ ...(await orig<typeof import("next/server")>()), after: (fn: () => unknown) => void fn() }));
vi.mock("@/lib/supabase/server", async () => (await import("@/lib/app-api/test-guard")).supabaseMock());
vi.mock("@/lib/app-api/supabase", async () => (await import("@/lib/app-api/test-guard")).statelessMock());
vi.mock("@/lib/flags", async () => (await import("@/lib/app-api/test-guard")).flagsMock());
vi.mock("@/lib/access/blocks", async () => (await import("@/lib/app-api/test-guard")).blocksMock());
vi.mock("@/lib/rate-limit", async () => (await import("@/lib/app-api/test-guard")).rateMock());
vi.mock("@/lib/app-api/push", () => ({ queuePush: () => undefined }));

import { clearDeviceCache } from "@/lib/app-api/devices";
import { GET as getLink } from "./route";
import { POST as reset } from "./reset/route";
import { GET as feed } from "../../../../calendar/[file]/route";

const COHORT = "c0c0c0c0-0000-4000-8000-000000000001";
const PEER = "44444444-4444-4444-8444-444444444444";
const OPD = "5e5e5e5e-0000-4000-8000-000000000001";
const PEER_OPD = "5e5e5e5e-0000-4000-8000-000000000002";
const CLASS = "5e5e5e5e-0000-4000-8000-000000000003";
const CANCELLED = "5e5e5e5e-0000-4000-8000-000000000004";
const MOVED = "5e5e5e5e-0000-4000-8000-000000000005";
const LEAVE = "5e5e5e5e-0000-4000-8000-000000000006";
const FAR = "5e5e5e5e-0000-4000-8000-000000000007";
const NO_SESSION_ASSIGN = "a5a5a5a5-0000-4000-8000-000000000009";

/** Monday 16 Nov 2026, 08:05 in India. */
const NOW = Date.parse("2026-11-16T02:35:00Z");
const token = (name: string) => `${Buffer.from(name).toString("base64url")}xxxxxxxxxx.${Buffer.from(JSON.stringify({ exp: Math.floor(NOW / 1000) + 3 * 86400 })).toString("base64url")}.sig`;

const session = (id: string, date: string, start: string, end: string, kind: string, over: Record<string, unknown> = {}) => ({
  id, cohort_ids: [COHORT], slot_id: null, date, start_time: start, end_time: end, kind, title: kind.startsWith("opd") ? "OPD" : "Class",
  place: "Clinic", online_link: null, compulsory: !kind.startsWith("opd"), status: "scheduled", origin: "one_off", note: null, moved_from: null, updated_at: "2026-11-10T00:00:00Z", ...over,
});

let T: { student: string; peer: string };

function seed(missing: string[] = []) {
  resetGuard(
    {
      profiles: [profileRow(), profileRow({ id: PEER, email: "peer@example.com", name: "Peer Two", roll_number: "R2" })],
      app_devices: [STUDENT_ID, PEER].map((u, i) => ({ id: `d${i}`, user_id: u, device_id: DEVICE, name: "Phone", platform: "android", push_token: null, active: true, activated_at: "2026-11-01T00:00:00.000Z", last_seen_at: null })),
      cohorts: [{ id: COHORT, name: "Cohort 2", created_at: "2026-10-01T00:00:00Z" }],
      cohort_members: [
        { cohort_id: COHORT, user_id: STUDENT_ID, added_at: "2026-11-01T00:00:00Z" },
        { cohort_id: COHORT, user_id: PEER, added_at: "2026-11-01T00:00:00Z" },
      ],
      clinic_sessions: [
        session(OPD, "2026-11-18", "08:00:00", "10:00:00", "opd_morning"),
        session(PEER_OPD, "2026-11-19", "17:00:00", "20:00:00", "opd_evening"),
        session(CLASS, "2026-11-17", "10:30:00", "13:00:00", "class", { title: "Case conference", note: "Bring, your notes; please" }),
        session(CANCELLED, "2026-11-20", "10:00:00", "13:00:00", "class", { status: "cancelled" }),
        session(MOVED, "2026-11-21", "11:00:00", "13:00:00", "online_class", { title: "Online class", place: null, online_link: "https://meet.example.com/abc", moved_from: "2026-11-20 10:00", updated_at: "2026-11-15T12:00:00Z" }),
        session(LEAVE, "2026-11-23", "10:00:00", "13:00:00", "class"),
        session(FAR, "2027-12-01", "10:00:00", "13:00:00", "class"),
      ],
      clinic_timetable_slots: [],
      clinic_day_notes: [{ id: "n1", cohort_id: COHORT, date: "2026-11-17", note: "Bring your case sheets" }],
      clinic_session_secrets: [],
      clinic_attendance: [],
      clinic_leave_allowances: [{ user_id: STUDENT_ID, cohort_id: COHORT, allowance: 3 }],
      clinic_leave_allowance_log: [],
      clinic_leave_requests: [
        { id: "l1", user_id: STUDENT_ID, cohort_id: COHORT, kind: "leave", session_ids: [LEAVE], leave_at: null, reason: "Exam", status: "approved", over_limit: false, assignment_id: null, decided_by: null, decided_at: null, decision_note: null, created_at: "2026-11-14T00:00:00Z" },
      ],
      clinic_opd_settings: [{ cohort_id: COHORT, seats: {}, cases_per_visit: 2, start_date: "2026-11-09", end_date: "2026-12-11", late_minutes: 10, holidays: [], freeze_days: 7 }],
      clinic_opd_prefs: [],
      clinic_case_quotas: [],
      clinic_case_extras: [],
      clinic_opd_assignments: [
        { id: "a1", cohort_id: COHORT, user_id: STUDENT_ID, date: "2026-11-18", batch: "morning", state: "published", source: "new", published_at: "2026-11-10T00:00:00Z" },
        { id: NO_SESSION_ASSIGN, cohort_id: COHORT, user_id: STUDENT_ID, date: "2026-11-25", batch: "evening", state: "published", source: "new", published_at: "2026-11-10T00:00:00Z" },
        { id: "a3", cohort_id: COHORT, user_id: PEER, date: "2026-11-19", batch: "evening", state: "published", source: "new", published_at: "2026-11-10T00:00:00Z" },
      ],
      clinic_case_logs: [],
      clinic_calendar_tokens: [],
    },
    missing,
  );
  T = { student: token("s"), peer: token("p") };
  G.users[T.student] = { id: STUDENT_ID, email: "asha@example.com" };
  G.users[T.peer] = { id: PEER, email: "peer@example.com" };
}

const linkOf = (tok: string) => getLink(appReq("/clinic/calendar", { token: tok }), noParams as never).then(read);
const resetOf = (tok: string) => reset(appReq("/clinic/calendar/reset", { token: tok, method: "POST", body: {} }), noParams as never).then(read);
const fetchFeed = (file: string) => feed(new Request(`https://vibhapsychology.com/api/calendar/${file}`), { params: Promise.resolve({ file }) });
const tokenIn = (url: string) => url.match(/\/api\/calendar\/([A-Za-z0-9_-]+)\.ics$/)![1]!;
const unfold = (s: string) => s.replace(/\r\n /g, "");
const eventOf = (ics: string, uid: string) => {
  const u = unfold(ics);
  const i = u.indexOf(`UID:${uid}@`);
  if (i < 0) return null;
  return u.slice(u.lastIndexOf("BEGIN:VEVENT", i), u.indexOf("END:VEVENT", i)).split("\r\n");
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  clearDeviceCache();
  seed();
});
afterEach(() => vi.useRealTimers());

describe("calendar link", () => {
  it("is made once and kept; webcal and Google links point at the same feed", async () => {
    const a = await linkOf(T.student);
    expect(a.status).toBe(200);
    expect(a.data.https).toMatch(/^https:\/\/vibhapsychology\.com\/api\/calendar\/[A-Za-z0-9_-]{43}\.ics$/);
    expect(a.data.webcal).toBe(a.data.https.replace("https://", "webcal://"));
    expect(a.data.google).toBe(`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(a.data.webcal)}`);
    const b = await linkOf(T.student);
    expect(b.data.https).toBe(a.data.https);
    expect(G.db.tables.clinic_calendar_tokens).toHaveLength(1);
  });

  it("each student has their own link", async () => {
    const a = await linkOf(T.student);
    const b = await linkOf(T.peer);
    expect(tokenIn(a.data.https)).not.toBe(tokenIn(b.data.https));
  });

  it("a new link replaces the old one, which stops working", async () => {
    const old = await linkOf(T.student);
    const fresh = await resetOf(T.student);
    expect(fresh.status).toBe(200);
    expect(fresh.data.https).not.toBe(old.data.https);
    expect((await fetchFeed(`${tokenIn(old.data.https)}.ics`)).status).toBe(404);
    expect((await fetchFeed(`${tokenIn(fresh.data.https)}.ics`)).status).toBe(200);
  });

  it("needs sign-in", async () => {
    const r = await getLink(appReq("/clinic/calendar", {}), noParams as never).then(read);
    expect(r.status).toBe(401);
  });
});

describe("calendar feed", () => {
  it("unknown or malformed tokens answer 404 with no calendar", async () => {
    expect((await fetchFeed("nope.ics")).status).toBe(404);
    const r = await fetchFeed(`${"A".repeat(43)}.ics`);
    expect(r.status).toBe(404);
    expect(r.headers.get("content-type")).toMatch(/text\/plain/);
  });

  it("serves my sessions as a private calendar file in India time", async () => {
    const link = await linkOf(T.student);
    const r = await fetchFeed(`${tokenIn(link.data.https)}.ics`);
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toBe("text/calendar; charset=utf-8");
    expect(r.headers.get("cache-control")).toMatch(/^private/);
    const ics = await r.text();
    expect(ics).toContain("TZID:Asia/Kolkata");

    // My OPD day, with the clinic and a reminder.
    const opd = eventOf(ics, OPD)!;
    expect(opd).toContain("DTSTART;TZID=Asia/Kolkata:20261118T080000");
    expect(opd).toContain("SUMMARY:Your OPD day: OPD\\, morning");
    expect(opd).toContain("TRIGGER:-PT30M");

    // Someone else's OPD day is not on my calendar; a cancelled class is left out.
    expect(eventOf(ics, PEER_OPD)).toBeNull();
    expect(eventOf(ics, CANCELLED)).toBeNull();

    // A class with its note and the admin's day note, escaped.
    const cls = eventOf(ics, CLASS)!;
    expect(cls).toContain("SUMMARY:Case conference");
    expect(cls.find((l) => l.startsWith("DESCRIPTION:"))).toContain("Bring\\, your notes\\; please\\nFrom the admin: Bring your case sheets");

    // A moved online class says so, links the meeting, and its sequence went up.
    const moved = eventOf(ics, MOVED)!;
    expect(moved).toContain("SUMMARY:Online class (moved)");
    expect(moved).toContain("DTSTART;TZID=Asia/Kolkata:20261121T110000");
    expect(moved).toContain("LOCATION:Online");
    expect(moved).toContain("URL:https://meet.example.com/abc");
    expect(moved.find((l) => l.startsWith("DESCRIPTION:"))).toContain("Moved from Fri 20 Nov\\, 10 am.");
    const seq = (e: string[]) => Number(e.find((l) => l.startsWith("SEQUENCE:"))!.slice(9));
    expect(seq(moved)).toBeGreaterThan(seq(cls));

    // Approved leave: shown as free time, no reminder.
    const leave = eventOf(ics, LEAVE)!;
    expect(leave).toContain("SUMMARY:On leave: Class");
    expect(leave).toContain("TRANSP:TRANSPARENT");
    expect(leave.some((l) => l.startsWith("BEGIN:VALARM"))).toBe(false);

    // An OPD day with no session made yet is an all-day event.
    const allDay = eventOf(ics, `opd-${NO_SESSION_ASSIGN}`)!;
    expect(allDay).toContain("DTSTART;VALUE=DATE:20261125");
    expect(allDay).toContain("SUMMARY:Your OPD day\\, evening");

    // Far future sessions are outside the window.
    expect(eventOf(ics, FAR)).toBeNull();
  });

  it("a session moved or cancelled later shows on the next fetch (same UID)", async () => {
    const file = `${tokenIn((await linkOf(T.student)).data.https)}.ics`;
    const row = (G.db.tables.clinic_sessions as { id: string; date: string; status: string; moved_from: string | null }[]).find((s) => s.id === CLASS)!;
    row.date = "2026-11-24";
    row.moved_from = "2026-11-17 10:30";
    let e = eventOf(await (await fetchFeed(file)).text(), CLASS)!;
    expect(e).toContain("DTSTART;TZID=Asia/Kolkata:20261124T103000");
    expect(e).toContain("SUMMARY:Case conference (moved)");
    row.status = "cancelled";
    e = eventOf(await (await fetchFeed(file)).text(), CLASS)!;
    expect(e).toBeNull();
  });

  it("the feed never writes (no missed-day rows made by a calendar fetch)", async () => {
    vi.setSystemTime(Date.parse("2026-11-26T12:00:00Z"));
    const file = `${tokenIn((await linkOf(T.student)).data.https)}.ics`;
    const before = (G.db.tables.clinic_leave_requests as unknown[]).length;
    expect((await fetchFeed(file)).status).toBe(200);
    expect((G.db.tables.clinic_leave_requests as unknown[]).length).toBe(before);
  });

  it("before the database step, says so", async () => {
    seed(["clinic_calendar_tokens"]);
    expect((await fetchFeed(`${"A".repeat(43)}.ics`)).status).toBe(503);
  });
});
