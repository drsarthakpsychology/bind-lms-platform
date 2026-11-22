import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ after: (fn: () => unknown) => void fn() }));
vi.mock("@/lib/supabase/server", () => ({ createAdminClient: () => ({}) }));

import { makeTestDb, type TestDb } from "@/lib/app-api/test-db";
import type { ReminderPrefs } from "@/lib/app-api/contract";
import type { BellRow } from "@/lib/app-api/push";
import { instant } from "@/lib/clinic/time";
import { DEFAULT_REMINDERS } from "./rules";
import { runReminders } from "./run";

const DAY = "2026-11-18";
const C1 = "c1";
const ANU = "u-anu";
const RAVI = "u-ravi";
const MEERA = "u-meera"; // blocked
const ADMIN = "u-admin";
const TEST = "u-test";
const OLD = "u-old"; // access ended
const C2 = "c-test"; // the admin's test cohort

const sess = (over: Record<string, unknown>) => ({
  cohort_ids: [C1],
  slot_id: null,
  date: DAY,
  place: "Clinic",
  online_link: null,
  compulsory: true,
  status: "scheduled",
  origin: "timetable",
  note: null,
  moved_from: null,
  ...over,
});

function seed(): TestDb {
  return makeTestDb({
    cohorts: [
      { id: C1, name: "Cohort 2", created_at: "2026-10-01" },
      { id: C2, name: "Test mode ABCD1234", is_test: true, created_at: "2026-11-01" },
    ],
    cohort_members: [
      ...[ANU, RAVI, MEERA, ADMIN, TEST, OLD].map((user_id) => ({ cohort_id: C1, user_id, added_at: "2026-10-02T00:00:00Z" })),
      { cohort_id: C2, user_id: TEST, added_at: "2026-11-01T00:00:00Z" },
    ],
    test_mode: [{ admin_id: ADMIN, test_user_id: TEST, test_cohort_id: C2, mirror_cohort_id: C1, active: true }],
    profiles: [
      { id: ANU, name: "Anu", roll_number: "1", role: "student", status: "active" },
      { id: RAVI, name: "Ravi", roll_number: "2", role: "student", status: "active" },
      { id: MEERA, name: "Meera", roll_number: "3", role: "student", status: "blocked" },
      { id: ADMIN, name: "Admin", roll_number: null, role: "admin", status: "active" },
      { id: TEST, name: "Test", roll_number: null, role: "student", status: "active", is_test: true },
      { id: OLD, name: "Old", roll_number: "4", role: "student", status: "active", expires_at: "2026-11-01T00:00:00Z" },
    ],
    clinic_sessions: [
      sess({ id: "s-class", start_time: "10:00:00", end_time: "13:00:00", kind: "class", title: "Class" }),
      sess({ id: "s-opd", start_time: "17:00:00", end_time: "20:00:00", kind: "opd_evening", title: "OPD evening" }),
      sess({ id: "s-practice", cohort_ids: [C2], start_time: "10:00:00", end_time: "11:00:00", kind: "class", title: "Practice class" }),
    ],
    clinic_opd_assignments: [
      { id: "a-anu", cohort_id: C1, user_id: ANU, date: DAY, batch: "evening", state: "published", source: "new", published_at: "x" },
      { id: "a-ravi-draft", cohort_id: C1, user_id: RAVI, date: DAY, batch: "evening", state: "draft", source: "new", published_at: null },
    ],
    clinic_attendance: [],
    clinic_leave_requests: [],
    clinic_leave_allowances: [
      { user_id: ANU, cohort_id: C1, allowance: 3 },
      { user_id: RAVI, cohort_id: C1, allowance: 3 },
    ],
    clinic_case_logs: [],
    clinic_case_quotas: [],
    clinic_case_extras: [],
    clinic_opd_prefs: [],
    clinic_opd_settings: [],
    notifications: [],
    app_reminder_log: [],
  });
}

let db: TestDb;
let pushed: BellRow[][];
let prefs: Map<string, ReminderPrefs>;

const run = (time: string) =>
  runReminders({
    db,
    now: instant(DAY, time),
    prefs: async () => prefs,
    push: async (rows) => {
      pushed.push(rows);
      return rows.length;
    },
  });

const bell = () => (db.tables.notifications as { user_id: string; title: string }[]).map((n) => `${n.user_id}: ${n.title}`).sort();

beforeEach(() => {
  db = seed();
  pushed = [];
  prefs = new Map();
});

describe("the reminder run", () => {
  it("7 am: OPD today goes only to the student assigned (published), never to a draft", async () => {
    const r = await run("07:00");
    expect(r).toMatchObject({ ok: true, sent: 1, pushed: 1 });
    expect(bell()).toEqual([`${ANU}: OPD today, evening 5 to 8`]);
  });

  it("9:30 am: the class reminder reaches every active student; not blocked, not ended, not admins, not test accounts; the test cohort only its test student", async () => {
    await run("09:30");
    // Anu's OPD today is still due (it stays due until her OPD starts, in case 7 am was missed).
    expect(bell()).toEqual([`${ANU}: Class in 30 minutes`, `${ANU}: OPD today, evening 5 to 8`, `${RAVI}: Class in 30 minutes`, `${TEST}: Practice class in 30 minutes`]);
  });

  it("sends each reminder once, however often the clock runs", async () => {
    await run("09:30");
    const again = await run("09:40");
    expect(again.sent).toBe(0);
    expect(bell()).toHaveLength(4);
    expect(pushed).toHaveLength(1);
  });

  it("respects each student's switches", async () => {
    prefs = new Map([[RAVI, { ...DEFAULT_REMINDERS, sessionSoon: false }]]);
    await run("09:30");
    expect(bell().filter((b) => b.startsWith(RAVI))).toEqual([]);
    expect(bell().filter((b) => b.startsWith(ANU))).toEqual([`${ANU}: Class in 30 minutes`, `${ANU}: OPD today, evening 5 to 8`]);
  });

  it("a turned-off reminder is not claimed, so turning it back on later in the window still sends it", async () => {
    prefs = new Map([[RAVI, { ...DEFAULT_REMINDERS, sessionSoon: false }]]);
    await run("09:30");
    prefs = new Map();
    await run("09:45");
    expect(bell().filter((b) => b.startsWith(RAVI))).toEqual([`${RAVI}: Class in 15 minutes`]);
  });

  it("forgot to scan out, and log your cases, in the evening", async () => {
    db.tables.clinic_attendance.push({ id: "att1", session_id: "s-opd", user_id: ANU, in_at: "2026-11-18T11:30:00Z", out_at: null });
    await run("20:10");
    expect(bell()).toEqual([`${ANU}: You forgot to scan out`]);
    await run("20:30");
    expect(bell()).toEqual([`${ANU}: Log your cases`, `${ANU}: You forgot to scan out`]);
  });

  it("no case log reminder once the log is in", async () => {
    db.tables.clinic_case_logs.push({ id: "log1", assignment_id: "a-anu", user_id: ANU, cohort_id: C1, date: DAY, cases: 2, absent: false, note: null });
    await run("20:45");
    expect(bell()).toEqual([]);
  });

  it("only 1 leave left, once per allowance", async () => {
    db.tables.clinic_leave_requests.push({ id: "l1", user_id: RAVI, cohort_id: C1, kind: "leave", session_ids: ["x", "y"], status: "approved", leave_at: null, over_limit: false, created_at: "2026-11-10" });
    await run("12:00");
    expect(bell()).toEqual([`${ANU}: OPD today, evening 5 to 8`, `${RAVI}: Only 1 leave left`]);
    await run("15:00");
    expect(bell()).toHaveLength(2);
  });

  it("without the reminders database step nothing is sent", async () => {
    db.missing.add("app_reminder_log");
    const r = await run("09:30");
    expect(r).toMatchObject({ ok: false, sent: 0 });
    expect(bell()).toEqual([]);
    expect(pushed).toEqual([]);
  });

  it("a cancelled session reminds nobody", async () => {
    (db.tables.clinic_sessions[0] as { status: string }).status = "cancelled";
    await run("09:30");
    expect(bell()).toEqual([`${ANU}: OPD today, evening 5 to 8`, `${TEST}: Practice class in 30 minutes`]);
  });

  it("test cohort: nothing once its admin turns test mode off", async () => {
    (db.tables.test_mode[0] as { active: boolean }).active = false;
    await run("09:30");
    expect(bell().some((b) => b.startsWith(TEST))).toBe(false);
  });

  it("before the test mode database step a test cohort reminds nobody", async () => {
    db.missing.add("test_mode");
    await run("09:30");
    expect(bell().some((b) => b.startsWith(TEST))).toBe(false);
  });

  it("the bell notice opens the right page", async () => {
    await run("07:00");
    const n = db.tables.notifications[0] as { body_html: string; href: string; id: string };
    expect(n.body_html).toContain('href="/clinic"');
    expect(n.href).toBe(`/notifications/${n.id}`);
    expect(db.tables.app_reminder_log[0]).toMatchObject({ user_id: ANU, kind: "opd_day", ref: "a-anu", notification_id: n.id });
  });
});
