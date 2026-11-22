import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { G, resetGuard } from "@/lib/app-api/test-guard";
import { ADMIN_ID, DEVICE, STUDENT_ID, appReq, noParams, profileRow, read } from "@/lib/app-api/test-kit";

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
import type { Db } from "@/lib/clinic/data";
import { showCode } from "@/lib/clinic/qr";
import { choicesFor, clockAt, confirm, identify, makeTicket, parseTicket, TICKET_MS } from "@/lib/clinic/scan-flow";
import { POST as scanRoute } from "./route";
import { POST as identifyRoute } from "./identify/route";
import { POST as confirmRoute } from "./confirm/route";

const COHORT = "c0c0c0c0-0000-4000-8000-000000000001";
const OTHER_COHORT = "c0c0c0c0-0000-4000-8000-000000000002";
const TEST_COHORT = "c0c0c0c0-0000-4000-8000-0000000000aa";
const OUTSIDER = "33333333-3333-4333-8333-333333333333";
const PEER = "44444444-4444-4444-8444-444444444444";
const TESTER = "55555555-5555-4555-8555-555555555555";
const OPD = "5e5e5e5e-0000-4000-8000-000000000001"; // today 08:00 to 10:00
const TOMORROW = "5e5e5e5e-0000-4000-8000-000000000003"; // tomorrow 10:00 to 13:00
const GONE = "5e5e5e5e-0000-4000-8000-000000000005"; // today 09:00 to 10:00, cancelled
const SANDBOX = "5e5e5e5e-0000-4000-8000-000000000006"; // today 08:00 to 10:00, the test cohort
const SECRET = "a".repeat(64);

/** Monday 16 Nov 2026, 08:05 in India. */
const NOW = Date.parse("2026-11-16T02:35:00Z");
const MIN = 60_000;

const token = (name: string) => `${Buffer.from(name).toString("base64url")}xxxxxxxxxx.${Buffer.from(JSON.stringify({ exp: Math.floor(NOW / 1000) + 3 * 86400 })).toString("base64url")}.sig`;
const T = { student: token("s"), outsider: token("o"), peer: token("p"), tester: token("t") };

const session = (id: string, date: string, start: string, end: string, over: Record<string, unknown> = {}) => ({
  id, cohort_ids: [COHORT], slot_id: null, date, start_time: start, end_time: end, kind: "class", title: "Case formulation",
  place: "Room 2", online_link: null, compulsory: true, status: "scheduled", origin: "one_off", note: null, moved_from: null, ...over,
});

function seed() {
  const people = [STUDENT_ID, ADMIN_ID, OUTSIDER, PEER, TESTER];
  resetGuard({
    profiles: [
      profileRow(),
      profileRow({ id: ADMIN_ID, email: "owner@example.com", name: "Owner", role: "admin", roll_number: null }),
      profileRow({ id: OUTSIDER, email: "out@example.com", name: "Out Sider", roll_number: "R9" }),
      profileRow({ id: PEER, email: "peer@example.com", name: "Peer Two", roll_number: "R2" }),
      profileRow({ id: TESTER, email: "test-student-x@test.vibha.invalid", name: "Test student", roll_number: null, is_test: true }),
    ],
    app_devices: people.map((u, i) => ({ id: `d${i}`, user_id: u, device_id: DEVICE, name: "Phone", platform: "android", push_token: null, active: true, activated_at: "2026-11-01T00:00:00.000Z", last_seen_at: null })),
    cohorts: [
      { id: COHORT, name: "Cohort 2", created_at: "2026-10-01T00:00:00Z" },
      { id: OTHER_COHORT, name: "Cohort 1", created_at: "2026-01-01T00:00:00Z" },
      { id: TEST_COHORT, name: "Test mode 22222222", is_test: true, created_at: "2026-11-01T00:00:00Z" },
    ],
    cohort_members: [
      { cohort_id: COHORT, user_id: STUDENT_ID, added_at: "2026-11-01T00:00:00Z" },
      { cohort_id: COHORT, user_id: PEER, added_at: "2026-11-01T00:00:00Z" },
      { cohort_id: OTHER_COHORT, user_id: OUTSIDER, added_at: "2026-11-01T00:00:00Z" },
      { cohort_id: TEST_COHORT, user_id: TESTER, added_at: "2026-11-01T00:00:00Z" },
      // Even if a test student were ever put in a real cohort by mistake, it still may not mark there.
      { cohort_id: COHORT, user_id: TESTER, added_at: "2026-11-01T00:00:00Z" },
    ],
    test_mode: [{ admin_id: ADMIN_ID, test_user_id: TESTER, test_cohort_id: TEST_COHORT, mirror_cohort_id: COHORT, active: true }],
    clinic_sessions: [
      session(OPD, "2026-11-16", "08:00:00", "10:00:00"),
      session(TOMORROW, "2026-11-17", "10:00:00", "13:00:00"),
      session(GONE, "2026-11-16", "09:00:00", "10:00:00", { status: "cancelled", title: "Ward round" }),
      session(SANDBOX, "2026-11-16", "08:00:00", "10:00:00", { cohort_ids: [TEST_COHORT], title: "Practice session" }),
    ],
    clinic_session_secrets: [OPD, TOMORROW, GONE, SANDBOX].map((id) => ({ session_id: id, secret: SECRET, opened_by: ADMIN_ID, opened_at: "2026-11-16T02:00:00Z" })),
    clinic_attendance: [],
    clinic_opd_settings: [{ cohort_id: COHORT, seats: {}, cases_per_visit: 2, start_date: "2026-11-09", end_date: "2026-12-11", late_minutes: 10, holidays: [], freeze_days: 7 }],
  });
  G.users[T.student] = { id: STUDENT_ID, email: "asha@example.com" };
  G.users[T.outsider] = { id: OUTSIDER, email: "out@example.com" };
  G.users[T.peer] = { id: PEER, email: "peer@example.com" };
  G.users[T.tester] = { id: TESTER, email: "test-student-x@test.vibha.invalid" };
}

const at = (ms: number) => vi.setSystemTime(ms);
const send = (fn: (r: Request, c: never) => Promise<Response>, path: string, tok: string, body: unknown) => fn(appReq(path, { token: tok, body, method: "POST" }), noParams as never).then(read);
/** What the admin's screen shows for a session at this moment. */
const shown = (id: string) => showCode(SECRET, id, Date.now());
const ident = (tok: string, id = OPD) => send(identifyRoute, "/clinic/scan/identify", tok, { token: shown(id).qr });
const conf = (tok: string, ticket: string, direction: string | undefined, attemptId = "attempt-0001") => send(confirmRoute, "/clinic/scan/confirm", tok, { ticket, direction, attemptId });
const rows = () => G.db.tables.clinic_attendance!;
const db = () => G.db as unknown as Db;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  at(NOW);
  clearDeviceCache();
  seed();
});
afterEach(() => vi.useRealTimers());

describe("identify: which session, and where I stand", () => {
  it("answers the session, my state, the two choices and a ticket, and saves nothing", async () => {
    const r = await ident(T.student);
    expect(r.status).toBe(200);
    expect(r.data).toMatchObject({
      session: { id: OPD, title: "Case formulation", date: "2026-11-16", start: "08:00", end: "10:00", place: "Room 2" },
      state: "none",
      inAt: null,
      outAt: null,
      in: { allowed: true, reason: null },
      out: { allowed: false, reason: "Mark IN first." },
    });
    expect(Date.parse(r.data.ticketExpiresAt) - Date.parse(r.data.now)).toBe(TICKET_MS);
    expect(rows()).toHaveLength(0);
    expect(G.db.log.filter((l) => l.table === "clinic_attendance")).toHaveLength(0);
    expect(G.limits).toContain(`app:clinic-scan:${STUDENT_ID}`);
  });

  it("the typed 6 characters find my open session", async () => {
    const r = await send(identifyRoute, "/clinic/scan/identify", T.peer, { code: shown(OPD).code.toLowerCase() });
    expect(r.status).toBe(200);
    expect(r.data.session.id).toBe(OPD);
    expect(rows()).toHaveLength(0);
  });

  it("the choices follow the marks: none, in, in and out", () => {
    expect(choicesFor(null)).toMatchObject({ state: "none", in: { allowed: true }, out: { allowed: false } });
    const afterIn = choicesFor({ in_at: "2026-11-16T03:32:00Z", out_at: null });
    expect(afterIn).toMatchObject({ state: "in", in: { allowed: false, reason: "You are already IN since 9:02 am." }, out: { allowed: true, reason: null } });
    const done = choicesFor({ in_at: "2026-11-16T03:32:00Z", out_at: "2026-11-16T06:30:00Z" });
    expect(done).toMatchObject({ state: "out", in: { allowed: false, reason: "You marked IN at 9:02 am." }, out: { allowed: false, reason: "You marked OUT at 12:00 pm." } });
    expect(clockAt("2026-11-15T18:35:00Z")).toBe("12:05 am");
  });

  it("an old code is told apart from a wrong one, kindly", async () => {
    const old = shown(OPD).qr;
    at(NOW + 61_000);
    const r = await send(identifyRoute, "/clinic/scan/identify", T.student, { token: old });
    expect(r.status).toBe(400);
    expect(r.error!.details!.reason).toBe("code_expired");
    expect(r.error!.message).toBe("That code has changed. Scan the one on the screen now.");
    const forged = shown(OPD).qr.replace(/[A-Za-z0-9_-]{22}$/, "A".repeat(22));
    const f = await send(identifyRoute, "/clinic/scan/identify", T.student, { token: forged });
    expect(f.error!.details!.reason).toBe("not_a_code");
    const oldCode = showCode(SECRET, OPD, NOW - 3 * MIN).code;
    const c = await send(identifyRoute, "/clinic/scan/identify", T.student, { code: oldCode });
    expect(c.error!.details!.reason).toBe("code_expired");
    expect((await send(identifyRoute, "/clinic/scan/identify", T.student, { token: "https://example.com/abc" })).error!.details!.reason).toBe("not_a_code");
    expect((await send(identifyRoute, "/clinic/scan/identify", T.student, {})).status).toBe(400);
  });

  it("wrong cohort, not open yet, closed and cancelled each say so", async () => {
    const wrong = await ident(T.outsider);
    expect(wrong.status).toBe(403);
    expect(wrong.error!.details!.reason).toBe("wrong_cohort");
    expect(wrong.error!.message).toMatch(/another group/);

    const early = await ident(T.student, TOMORROW);
    expect(early.status).toBe(409);
    expect(early.error!.details!.reason).toBe("not_open_yet");
    expect(early.error!.message).toBe("Case formulation is not open yet. Marking opens at 9:30 am. Scan again then.");

    const cancelled = await ident(T.student, GONE);
    expect(cancelled.status).toBe(409);
    expect(cancelled.error!.details!.reason).toBe("cancelled");
    expect(cancelled.error!.message).toBe("Ward round was cancelled. There is nothing to mark.");

    at(NOW + 4 * 60 * MIN); // 12:05, the session closed at 11:00
    const late = await ident(T.student);
    expect(late.status).toBe(409);
    expect(late.error!.details!.reason).toBe("closed");
    expect(late.error!.message).toBe("Marking for Case formulation closed at 11:00 am. Ask the admin to mark you.");
    expect(rows()).toHaveLength(0);
  });
});

describe("confirm: the direction is explicit and each mark is saved once", () => {
  it("needs a direction and an attempt id", async () => {
    const { ticket } = (await ident(T.student)).data;
    expect((await conf(T.student, ticket, undefined)).status).toBe(400);
    expect((await send(confirmRoute, "/clinic/scan/confirm", T.student, { ticket, direction: "in" })).status).toBe(400);
    expect((await conf(T.student, ticket, "sideways")).status).toBe(400);
    expect(rows()).toHaveLength(0);
  });

  it("OUT before any IN is refused and saves nothing", async () => {
    const { ticket } = (await ident(T.student)).data;
    const r = await conf(T.student, ticket, "out");
    expect(r.status).toBe(400);
    expect(r.error!.details!.reason).toBe("out_before_in");
    expect(r.error!.message).toBe("You have not marked IN for Case formulation. Mark IN first.");
    expect(rows()).toHaveLength(0);
  });

  it("IN is recorded with the time; a repeated IN answers the first time and changes nothing", async () => {
    const first = await conf(T.student, (await ident(T.student)).data.ticket, "in", "attempt-0001");
    expect(first.status).toBe(200);
    expect(first.data).toMatchObject({ sessionId: OPD, direction: "in", already: false, message: "Marked IN at 8:05 am.", late: false, minutes: null });
    expect(rows()).toHaveLength(1);
    const inAt = rows()[0]!.in_at;

    at(NOW + 20 * MIN);
    const id2 = await ident(T.student);
    expect(id2.data).toMatchObject({ state: "in", in: { allowed: false }, out: { allowed: true } });
    const again = await conf(T.student, id2.data.ticket, "in", "attempt-0002");
    expect(again.status).toBe(200);
    expect(again.data).toMatchObject({ already: true, at: inAt, message: "Already marked IN at 8:05 am. Nothing was changed." });
    expect(rows()).toHaveLength(1);
    expect(rows()[0]!.in_at).toBe(inAt);
    expect(rows()[0]!.out_at ?? null).toBeNull();
  });

  it("OUT after IN records the minutes; a repeated OUT never moves the time", async () => {
    await conf(T.student, (await ident(T.student)).data.ticket, "in", "attempt-0001");
    at(NOW + 90 * MIN);
    const out = await conf(T.student, (await ident(T.student)).data.ticket, "out", "attempt-0002");
    expect(out.data).toMatchObject({ direction: "out", already: false, minutes: 90, message: "Marked OUT at 9:35 am." });
    const outAt = rows()[0]!.out_at;
    at(NOW + 100 * MIN);
    const id3 = await ident(T.student);
    expect(id3.data).toMatchObject({ state: "out", in: { allowed: false }, out: { allowed: false, reason: "You marked OUT at 9:35 am." } });
    const again = await conf(T.student, id3.data.ticket, "out", "attempt-0003");
    expect(again.data).toMatchObject({ already: true, at: outAt, minutes: 90, message: "Already marked OUT at 9:35 am. Nothing was changed." });
    expect(rows()[0]!.out_at).toBe(outAt);
    expect(rows()).toHaveLength(1);
  });

  it("a late IN is flagged", async () => {
    at(NOW + 10 * MIN); // 08:15, later than start + 10
    const r = await conf(T.student, (await ident(T.student)).data.ticket, "in");
    expect(r.data.late).toBe(true);
  });

  it("the same Confirm press sent twice (double tap, retry) makes one record and the same answer", async () => {
    const { ticket } = (await ident(T.student)).data;
    const a = await conf(T.student, ticket, "in", "attempt-same");
    const b = await conf(T.student, ticket, "in", "attempt-same");
    at(NOW + 30_000);
    const c = await conf(T.student, ticket, "in", "attempt-same");
    expect(rows()).toHaveLength(1);
    for (const r of [a, b, c]) expect(r.data).toMatchObject({ already: false, at: new Date(NOW).toISOString(), message: "Marked IN at 8:05 am." });
    expect(rows()[0]).toMatchObject({ in_attempt: "attempt-same", in_method: "qr" });
    expect(G.limits).toContain(`app:clinic-scan-confirm:${STUDENT_ID}`);
  });

  it("the QR rotating between scan and Confirm does not fail the mark; after 2 minutes it asks to scan again", async () => {
    const { ticket } = (await ident(T.student)).data;
    at(NOW + 110_000); // the code on the screen has changed three times since
    const ok = await conf(T.student, ticket, "in");
    expect(ok.status).toBe(200);
    expect(ok.data.already).toBe(false);

    const second = (await ident(T.student)).data.ticket;
    at(NOW + 110_000 + TICKET_MS + 1000);
    const late = await conf(T.student, second, "out");
    expect(late.status).toBe(400);
    expect(late.error!.details!.reason).toBe("ticket_expired");
    expect(late.error!.message).toBe("That took too long. Scan the code again.");
    expect(rows()[0]!.out_at ?? null).toBeNull();
  });

  it("a ticket works only for the student and the session it was made for, and says nothing about direction", async () => {
    const { ticket } = (await ident(T.student)).data;
    const p = parseTicket(ticket)!;
    expect(p).toMatchObject({ sessionId: OPD, method: "qr", exp: NOW + TICKET_MS });
    expect(Object.keys(p).sort()).toEqual(["exp", "mac", "method", "sessionId"]);
    // Someone else's phone.
    const other = await conf(T.peer, ticket, "in");
    expect(other.status).toBe(400);
    expect(other.error!.details!.reason).toBe("ticket_expired");
    // Moved to another session, or a longer life: the signature no longer matches.
    for (const bad of [ticket.replace(OPD, TOMORROW), ticket.replace(String(p.exp), String(p.exp + 600_000)), ticket.replace(".q.", ".c."), "t1.nonsense-nonsense-nonsense", makeTicket("b".repeat(64), STUDENT_ID, OPD, "qr", NOW).ticket]) {
      const r = await conf(T.student, bad, "in");
      expect(r.status).toBe(400);
      expect(r.error!.details!.reason).toBe("ticket_expired");
    }
    expect(rows()).toHaveLength(0);
  });

  it("a session cancelled between scan and Confirm is not marked", async () => {
    const { ticket } = (await ident(T.student)).data;
    G.db.tables.clinic_sessions!.find((s) => s.id === OPD)!.status = "cancelled";
    const r = await conf(T.student, ticket, "in");
    expect(r.status).toBe(409);
    expect(r.error!.details!.reason).toBe("cancelled");
    expect(rows()).toHaveLength(0);
  });

  it("an admin's manual time is never overwritten by a scan", async () => {
    rows().push({ id: "m1", session_id: OPD, user_id: STUDENT_ID, in_at: "2026-11-16T02:31:00.000Z", out_at: null, in_method: "manual", out_method: null, note: "phone dead", marked_by: ADMIN_ID });
    const r = await conf(T.student, (await ident(T.student)).data.ticket, "in");
    expect(r.data).toMatchObject({ already: true, at: "2026-11-16T02:31:00.000Z", message: "Already marked IN at 8:01 am. Nothing was changed." });
    expect(rows()[0]).toMatchObject({ in_at: "2026-11-16T02:31:00.000Z", in_method: "manual", note: "phone dead" });
  });
});

describe("confirm against the database's own guards", () => {
  /** A stand-in query that answers one error whatever is chained on it. */
  const failing = (error: { code: string; message: string }) => {
    const q: Record<string, unknown> = { then: (ok: (v: unknown) => unknown) => Promise.resolve({ data: null, error }).then(ok) };
    return new Proxy(q, { get: (t, k) => (k in t ? t[k as string] : () => proxy) }) as never;
  };
  let proxy: never;

  it("works before the SQL step: no attempt columns, the mark is still saved once", async () => {
    const noColumn = { code: "PGRST204", message: "Could not find the 'in_attempt' column of 'clinic_attendance' in the schema cache" };
    proxy = failing(noColumn);
    const wrapped = {
      from: (t: string) => {
        const q = G.db.from(t) as unknown as Record<string, (p: Record<string, unknown>) => unknown>;
        if (t !== "clinic_attendance") return q;
        const insert = q.insert!.bind(q);
        const update = q.update!.bind(q);
        q.insert = (p) => ("in_attempt" in p || "out_attempt" in p ? proxy : insert(p));
        q.update = (p) => ("in_attempt" in p || "out_attempt" in p ? proxy : update(p));
        return q;
      },
    } as unknown as Db;
    const { ticket } = await identify(wrapped, STUDENT_ID, { token: shown(OPD).qr }, NOW);
    const first = await confirm(wrapped, STUDENT_ID, { ticket, direction: "in", attemptId: "attempt-0001" }, NOW);
    expect(first).toMatchObject({ already: false, message: "Marked IN at 8:05 am." });
    expect(rows()).toHaveLength(1);
    expect(rows()[0]).not.toHaveProperty("in_attempt");
    // A retry of the same press: still one record, the first time kept.
    const retry = await confirm(wrapped, STUDENT_ID, { ticket, direction: "in", attemptId: "attempt-0001" }, NOW + 5000);
    expect(retry).toMatchObject({ already: true, at: new Date(NOW).toISOString() });
    expect(rows()).toHaveLength(1);
    const out = await confirm(wrapped, STUDENT_ID, { ticket, direction: "out", attemptId: "attempt-0002" }, NOW + 60_000);
    expect(out).toMatchObject({ already: false, minutes: 1 });
    expect(rows()[0]).not.toHaveProperty("out_attempt");
  });

  it("two phones at once: the row the other one made first is answered, not replaced", async () => {
    proxy = failing({ code: "23505", message: "duplicate key value violates unique constraint" });
    const theirs = "2026-11-16T02:34:58.000Z";
    const wrapped = {
      from: (t: string) => {
        const q = G.db.from(t) as unknown as Record<string, (p: Record<string, unknown>) => unknown>;
        if (t !== "clinic_attendance") return q;
        q.insert = () => {
          rows().push({ id: "other", session_id: OPD, user_id: STUDENT_ID, in_at: theirs, out_at: null, in_method: "qr", out_method: null, in_attempt: "attempt-other" });
          return proxy;
        };
        return q;
      },
    } as unknown as Db;
    const { ticket } = await identify(db(), STUDENT_ID, { token: shown(OPD).qr }, NOW);
    const r = await confirm(wrapped, STUDENT_ID, { ticket, direction: "in", attemptId: "attempt-mine" }, NOW);
    expect(r).toMatchObject({ already: true, at: theirs, message: "Already marked IN at 8:04 am. Nothing was changed." });
    expect(rows()).toHaveLength(1);
    expect(rows()[0]!.in_at).toBe(theirs);
  });

  it("an IN cleared by the admin between scan and Confirm: OUT is refused", async () => {
    rows().push({ id: "r1", session_id: OPD, user_id: STUDENT_ID, in_at: "2026-11-16T02:31:00.000Z", out_at: null, in_method: "qr", out_method: null });
    const { ticket } = await identify(db(), STUDENT_ID, { token: shown(OPD).qr }, NOW);
    G.db.tables.clinic_attendance = [];
    await expect(confirm(db(), STUDENT_ID, { ticket, direction: "out", attemptId: "attempt-0001" }, NOW + 1000)).rejects.toMatchObject({ code: "bad_request", details: { reason: "out_before_in" } });
  });
});

describe("test mode stays in its sandbox", () => {
  it("the test student marks only in its own test cohort", async () => {
    const real = await ident(T.tester, OPD);
    expect(real.status).toBe(403);
    expect(real.error!.details!.reason).toBe("wrong_cohort");
    // A ticket cannot get round it either.
    const forgedTicket = makeTicket(SECRET, TESTER, OPD, "qr", NOW).ticket;
    const c = await conf(T.tester, forgedTicket, "in");
    expect(c.status).toBe(403);
    expect(rows()).toHaveLength(0);

    const own = await ident(T.tester, SANDBOX);
    expect(own.status).toBe(200);
    const ok = await conf(T.tester, own.data.ticket, "in");
    expect(ok.data).toMatchObject({ sessionId: SANDBOX, direction: "in", already: false });
    expect(rows()).toHaveLength(1);
    expect(rows()[0]).toMatchObject({ session_id: SANDBOX, user_id: TESTER });
  });

  it("a real student cannot mark a test cohort's session", async () => {
    const r = await ident(T.student, SANDBOX);
    expect(r.status).toBe(403);
    expect(r.error!.details!.reason).toBe("wrong_cohort");
  });
});

describe("the one step route (older app versions)", () => {
  it("a second scan right after IN does not mark OUT", async () => {
    const first = await send(scanRoute, "/clinic/scan", T.student, { token: shown(OPD).qr });
    expect(first.data.direction).toBe("in");
    at(NOW + 20_000);
    const again = await send(scanRoute, "/clinic/scan", T.student, { token: shown(OPD).qr });
    expect(again.status).toBe(400);
    expect(again.error!.message).toBe("You already scanned in. Scan again when you leave.");
    expect(rows()[0]!.out_at ?? null).toBeNull();
    at(NOW + 30 * MIN);
    const out = await send(scanRoute, "/clinic/scan", T.student, { token: shown(OPD).qr });
    expect(out.data.direction).toBe("out");
  });
});
