import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDb, type FakeDb } from "./fake-db";
import { testCohortName, testEmailFor } from "./rules";

/**
 * Test mode, end to end through the real loaders with an in-memory database:
 * the test student never shows or counts for real people (leaderboard, cohort
 * stats, clinic, notifications), and an admin in test mode reaches only the
 * test student.
 */

vi.mock("server-only", () => ({}));

let db: FakeDb;
let session: { status: "ok"; profile: { id: string; role: string } } | { status: "unauthenticated" } = { status: "unauthenticated" };

vi.mock("@/lib/supabase/server", () => ({
  createAdminClient: () => db,
  createClient: async () => db,
}));
vi.mock("@/lib/auth/session", () => ({
  SESSION_COOKIE: "plms_session",
  getSession: async () => session,
}));
vi.mock("@/lib/app-api/push", () => ({ queuePush: vi.fn() }));
vi.mock("@/lib/auth/roster", () => ({ sendResendEmail: vi.fn(async () => ({ ok: true })), logEmailSend: vi.fn(async () => {}) }));

const ADMIN = "aaaaaaaa-0000-4000-8000-000000000001";
const TEST = "bbbbbbbb-0000-4000-8000-000000000002";
const REAL1 = "11111111-0000-4000-8000-000000000011";
const REAL2 = "22222222-0000-4000-8000-000000000022";
const C_REAL = "cccccccc-0000-4000-8000-0000000000c1";
const C_TEST = "cccccccc-0000-4000-8000-0000000000c2";

function seed(active: boolean): FakeDb {
  return fakeDb({
    profiles: [
      { id: ADMIN, name: "Owner", email: "owner@gmail.com", role: "admin", is_test: false, status: "active" },
      { id: REAL1, name: "Asha Rao", email: "asha@gmail.com", role: "student", is_test: false, status: "active" },
      { id: REAL2, name: "Bala K", email: "bala@gmail.com", role: "student", is_test: false, status: "active" },
      { id: TEST, name: "Test student", email: testEmailFor(ADMIN), role: "student", is_test: true, status: "active" },
    ],
    test_mode: [{ admin_id: ADMIN, test_user_id: TEST, test_cohort_id: C_TEST, mirror_cohort_id: C_REAL, active }],
    cohorts: [
      { id: C_REAL, name: "Cohort 1", status: "active", course_id: null, created_at: "2026-01-01" },
      { id: C_TEST, name: testCohortName(ADMIN), status: "active", course_id: null, is_test: true, created_at: "2026-11-17" },
    ],
    cohort_members: [
      { cohort_id: C_REAL, user_id: REAL1, added_at: "2026-01-02" },
      { cohort_id: C_REAL, user_id: REAL2, added_at: "2026-01-02" },
      // An old test account wrongly left in a real cohort (before the database guard).
      { cohort_id: C_REAL, user_id: TEST, added_at: "2026-01-02" },
      { cohort_id: C_TEST, user_id: TEST, added_at: "2026-11-17" },
    ],
    learn_progress: [
      { user_id: REAL1, xp: 50, state: { xp: 50 } },
      { user_id: REAL2, xp: 20, state: { xp: 20 } },
      { user_id: TEST, xp: 9999, state: { xp: 9999 } },
    ],
    lesson_cohorts: [],
    student_details: [],
    notifications: [],
  });
}

const asAdmin = () => (session = { status: "ok", profile: { id: ADMIN, role: "admin" } });
const asReal = () => (session = { status: "ok", profile: { id: REAL1, role: "student" } });
const asTestStudent = () => (session = { status: "ok", profile: { id: TEST, role: "student" } });

beforeEach(() => {
  db = seed(false);
  session = { status: "unauthenticated" };
});

describe("leaderboard", () => {
  it("never ranks the test student", async () => {
    const { loadBoard } = await import("@/lib/learn/leaderboard");
    const board = await loadBoard();
    expect(board.map((r) => r.userId)).toEqual([REAL1, REAL2]);
  });
  it("league students leave it out", async () => {
    const { loadStudents } = await import("@/lib/leagues/data");
    const students = await loadStudents(db as never);
    expect(students.map((s) => s.id).sort()).toEqual([REAL1, REAL2].sort());
  });
});

describe("cohort stats", () => {
  it("the test cohort and the test student are not counted", async () => {
    const { loadCohortSummaries } = await import("@/lib/cohorts/admin-data");
    const r = await loadCohortSummaries();
    const names = r.cohorts.map((c) => c.name);
    expect(names).toEqual(["Cohort 1"]);
    expect(JSON.stringify(r.cohorts[0])).not.toContain(TEST);
  });
});

describe("clinic", () => {
  it("a real admin sees real cohorts and real students only", async () => {
    asAdmin();
    const data = await import("@/lib/clinic/data");
    expect((await data.cohortList(db as never)).map((c) => c.id)).toEqual([C_REAL]);
    expect((await data.cohortStudents(db as never, C_REAL)).map((p) => p.userId).sort()).toEqual([REAL1, REAL2].sort());
  });
  it("an admin in test mode sees and changes only the test cohort", async () => {
    db = seed(true);
    asAdmin();
    const data = await import("@/lib/clinic/data");
    expect((await data.cohortList(db as never)).map((c) => c.id)).toEqual([C_TEST]);
    expect((await data.cohortStudents(db as never, C_TEST)).map((p) => p.userId)).toEqual([TEST]);
    await expect(data.assertSandbox([C_REAL])).rejects.toThrow(/Test mode is on/);
    await expect(data.assertSandbox([C_TEST])).resolves.toBeUndefined();
    await expect(data.requireCohort(db as never, C_REAL)).rejects.toThrow();
  });
  it("a new session in test mode cannot be put on a real cohort", async () => {
    db = seed(true);
    asAdmin();
    const admin = await import("@/lib/clinic/admin");
    const body = { cohortIds: [C_REAL], date: "2099-01-05", start: "09:00", end: "10:00", kind: "class", title: "Class", notify: false } as never;
    await expect(admin.createSession(db as never, body, ADMIN, Date.parse("2099-01-01T00:00:00Z"))).rejects.toThrow(/Test mode is on/);
    expect(db.inserted.clinic_sessions ?? []).toHaveLength(0);
  });
});

describe("notifications", () => {
  it("a real send never reaches the test student", async () => {
    asAdmin();
    const { sendNotifications } = await import("@/lib/notify/send");
    const r = await sendNotifications({ userIds: [REAL1, TEST], title: "Hi", html: "<p>Hello</p>", sentBy: ADMIN });
    expect(r.created).toBe(1);
    expect(db.inserted.notifications!.map((n) => n.user_id)).toEqual([REAL1]);
  });
  it("an announcement in test mode reaches only the test student", async () => {
    db = seed(true);
    asAdmin();
    const { sendNotifications } = await import("@/lib/notify/send");
    const r = await sendNotifications({ userIds: [REAL1, REAL2], title: "Hi", html: "<p>Hello</p>", sentBy: ADMIN });
    expect(r.created).toBe(1);
    expect(db.inserted.notifications!.map((n) => n.user_id)).toEqual([TEST]);
  });
  it("clinic notices follow the same rule", async () => {
    db = seed(true);
    asAdmin();
    const { notifyClinic } = await import("@/lib/notify/clinic");
    expect(await notifyClinic({ userIds: [REAL1, REAL2], title: "Moved", text: "Moved", sentBy: ADMIN })).toBe(1);
    expect(db.inserted.notifications!.map((n) => n.user_id)).toEqual([TEST]);
  });
  it("the test student's actions tell only its own admin", async () => {
    asTestStudent();
    const { notifyClinic } = await import("@/lib/notify/clinic");
    expect(await notifyClinic({ userIds: [ADMIN, "eeeeeeee-0000-4000-8000-0000000000ee"], title: "Leave", text: "Leave", sentBy: TEST })).toBe(1);
    expect(db.inserted.notifications!.map((n) => n.user_id)).toEqual([ADMIN]);
  });
  it("a real student's request is not sandboxed", async () => {
    asReal();
    const { notifyClinic } = await import("@/lib/notify/clinic");
    expect(await notifyClinic({ userIds: [ADMIN], title: "Leave", text: "Leave", sentBy: REAL1 })).toBe(1);
  });
});

describe("admin changes in test mode", () => {
  it("requireSuperAdmin refuses; the sandbox guard allows", async () => {
    db = seed(true);
    asAdmin();
    const guards = await import("@/lib/auth/guards");
    expect(await guards.requireSuperAdmin()).toBeNull();
    expect((await guards.requireSuperAdminSandbox())?.id).toBe(ADMIN);
  });
  it("with test mode off nothing changes", async () => {
    asAdmin();
    const guards = await import("@/lib/auth/guards");
    expect((await guards.requireSuperAdmin())?.id).toBe(ADMIN);
  });
});
