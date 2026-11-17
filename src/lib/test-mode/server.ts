import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { getSession, type Profile } from "@/lib/auth/session";
import { requestMemo } from "@/lib/app-api/context";
import { createStatelessAuthClient } from "@/lib/app-api/supabase";
import { loadHiddenIds } from "@/lib/people/hidden-ids";
import { dropTestCohorts, recipientsFor, scopeOf, TEST_STUDENT_NAME, testCohortName, testEmailFor, type TestLink, type TestScope } from "./rules";

/**
 * Test mode on the server: the admin's test student and test cohort, the
 * switch, the reset, and "who is acting" for the current request.
 *
 * Every read here fails soft: before the database step
 * (supabase/migrations_pending/2026_11_17_test_mode.sql) nobody is ever in
 * test mode, so nothing else changes.
 */

type Db = ReturnType<typeof createAdminClient>;

type LinkRow = { admin_id: string; test_user_id: string; test_cohort_id: string | null; mirror_cohort_id: string | null; active: boolean };

const toLink = (r: LinkRow): TestLink => ({ adminId: r.admin_id, testUserId: r.test_user_id, testCohortId: r.test_cohort_id, mirrorCohortId: r.mirror_cohort_id, active: Boolean(r.active) });

/** The table is there (the database step ran). */
export async function testModeReady(given?: Db): Promise<boolean> {
  try {
    const { error } = await (given ?? createAdminClient()).from("test_mode").select("admin_id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

/** One person's link: as the admin who owns it, or as the test student. Null when none (or no table). */
export async function loadLinkFor(userId: string, given?: Db): Promise<TestLink | null> {
  try {
    const db = given ?? createAdminClient();
    const { data, error } = await db
      .from("test_mode")
      .select("admin_id, test_user_id, test_cohort_id, mirror_cohort_id, active")
      .or(`admin_id.eq.${userId},test_user_id.eq.${userId}`)
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return toLink(data as LinkRow);
  } catch {
    return null;
  }
}

export async function scopeForProfile(p: Pick<Profile, "id" | "role">): Promise<TestScope | null> {
  if (!/^[0-9a-f-]{36}$/i.test(p.id)) return null;
  return scopeOf(p.role, p.id, await loadLinkFor(p.id));
}

/**
 * Who is acting in this request, in test terms (see TestScope). Once per
 * request. Null outside a request, for real people, and before the database
 * step.
 */
export const currentTestScope = cache(
  (): Promise<TestScope | null> =>
    requestMemo("testmode:scope", async () => {
      try {
        const s = await getSession();
        return s.status === "ok" ? await scopeForProfile(s.profile) : null;
      } catch {
        return null;
      }
    }),
);

/** An admin whose test mode is on (their admin changes are sandboxed or refused). */
export async function adminInTestMode(profile: Pick<Profile, "id" | "role"> | null | undefined): Promise<boolean> {
  if (!profile || (profile.role !== "admin" && profile.role !== "view_admin")) return false;
  const scope = await currentTestScope();
  if (scope && scope.adminId === profile.id) return scope.as === "admin";
  // Not the request's own caller (rare): read it directly.
  return (await scopeForProfile(profile))?.as === "admin";
}

/** The recipients a notice may reach from this request (rules.recipientsFor). */
export async function sandboxRecipients(ids: readonly string[]): Promise<string[]> {
  if (!ids.length) return [];
  const scope = await currentTestScope();
  const hidden = scope ? new Set<string>() : await loadHiddenIds().catch(() => new Set<string>());
  return recipientsFor(ids, scope, hidden);
}

/* ------------------------------------------------------------ set-up */

export type SetupResult = { ok: true; link: TestLink } | { ok: false; error: string };

const DB_STEP = "Run the database step 2026_11_17_test_mode.sql first (Supabase, SQL Editor).";

function randomPassword(): string {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return `T${Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("")}!`;
}

/** The newest real cohort: what the test student sees by default. */
async function defaultMirror(db: Db): Promise<{ id: string; course_id: string | null } | null> {
  const { data } = await db.from("cohorts").select("*").order("created_at", { ascending: false }).limit(200);
  const real = dropTestCohorts((data ?? []) as { id: string; name: string; is_test?: boolean | null; status?: string; course_id: string | null }[]);
  const pick = real.find((c) => c.status === "active") ?? real[0];
  return pick ? { id: pick.id, course_id: pick.course_id ?? null } : null;
}

async function findTestUserId(db: Db, email: string): Promise<string | null> {
  const { data } = await db.from("profiles").select("id").eq("email", email).limit(1).maybeSingle();
  return (data?.id as string | undefined) ?? null;
}

/** Make the test student's account (or find it again). */
async function ensureUser(db: Db, adminId: string): Promise<string> {
  const email = testEmailFor(adminId);
  let id = await findTestUserId(db, email);
  if (!id) {
    const { data, error } = await db.auth.admin.createUser({ email, password: randomPassword(), email_confirm: true, user_metadata: { name: TEST_STUDENT_NAME, test_owner: adminId } });
    id = data?.user?.id ?? null;
    if (!id) {
      // Made a moment ago by another tab: the profile row may still be on its way.
      id = await findTestUserId(db, email);
      if (!id) throw new Error(error?.message ?? "Could not make the test student.");
    }
  }
  // The profile row comes from the on_auth_user_created trigger; make sure it is a hidden student.
  const { error } = await db
    .from("profiles")
    .upsert(
      { id, email, name: TEST_STUDENT_NAME, role: "student", is_test: true, scope: "full", status: "active", expires_at: null, mobile_prompt_skipped_at: new Date().toISOString() },
      { onConflict: "id" },
    );
  if (error) throw new Error(error.message);
  // No first-login form for the test student.
  await db
    .from("student_details")
    .upsert(
      { user_id: id, full_name: TEST_STUDENT_NAME, phone: "0000000000", city: "Test", state: "Test", country: "India", qualification: "Test", institution: "Test", occupation: "Test", confirmed_at: new Date().toISOString() },
      { onConflict: "user_id" },
    )
    .then(
      () => undefined,
      () => undefined,
    );
  return id;
}

/** Make the test cohort (or find it again) and put the test student in it. */
async function ensureCohort(db: Db, adminId: string, userId: string, mirror: { id: string; course_id: string | null } | null): Promise<string> {
  const name = testCohortName(adminId);
  const { data: found } = await db.from("cohorts").select("id").eq("name", name).limit(1).maybeSingle();
  let cohortId = (found?.id as string | undefined) ?? null;
  if (!cohortId) {
    const { data, error } = await db
      .from("cohorts")
      .insert({ name, status: "active", course_id: mirror?.course_id ?? null, is_test: true, test_owner: adminId, mirror_cohort_id: mirror?.id ?? null })
      .select("id")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Could not make the test cohort.");
    cohortId = data.id as string;
    if (mirror) await copyClinicSetup(db, mirror.id, cohortId);
  } else {
    await db.from("cohorts").update({ is_test: true, test_owner: adminId, mirror_cohort_id: mirror?.id ?? null }).eq("id", cohortId);
  }
  await db.from("cohort_members").upsert({ cohort_id: cohortId, user_id: userId, added_by: adminId }, { onConflict: "cohort_id,user_id", ignoreDuplicates: true });
  return cohortId;
}

/** The test cohort starts with the real cohort's clinic set-up (OPD settings and weekly timetable). */
async function copyClinicSetup(db: Db, fromCohort: string, toCohort: string): Promise<void> {
  try {
    const { data: settings } = await db.from("clinic_opd_settings").select("*").eq("cohort_id", fromCohort).maybeSingle();
    if (settings) {
      const { updated_at: _u, updated_by: _b, ...rest } = settings as Record<string, unknown>;
      await db.from("clinic_opd_settings").upsert({ ...rest, cohort_id: toCohort }, { onConflict: "cohort_id" });
    }
    const { data: slots } = await db.from("clinic_timetable_slots").select("*").contains("cohort_ids", [fromCohort]).eq("active", true).limit(200);
    if (slots?.length) {
      await db.from("clinic_timetable_slots").insert(
        slots.map((s) => {
          const { id: _i, created_at: _c, updated_at: _u, ...rest } = s as Record<string, unknown>;
          return { ...rest, cohort_ids: [toCohort] };
        }),
      );
    }
  } catch {
    // Best effort: the admin can set it up in test mode.
  }
}

/** The test cohort watches exactly the lectures the real (mirror) cohort watches. */
export async function syncLectures(db: Db, testCohortId: string, mirrorCohortId: string | null): Promise<void> {
  try {
    const want = new Set<string>();
    if (mirrorCohortId) {
      const { data } = await db.from("lesson_cohorts").select("lesson_id").eq("cohort_id", mirrorCohortId).limit(20000);
      for (const r of data ?? []) want.add(r.lesson_id as string);
    } else {
      const { data } = await db.from("lessons").select("id").limit(20000);
      for (const r of data ?? []) want.add(r.id as string);
    }
    const { data: have } = await db.from("lesson_cohorts").select("lesson_id").eq("cohort_id", testCohortId).limit(20000);
    const has = new Set((have ?? []).map((r) => r.lesson_id as string));
    const add = [...want].filter((id) => !has.has(id));
    const drop = [...has].filter((id) => !want.has(id));
    for (let i = 0; i < add.length; i += 500) await db.from("lesson_cohorts").insert(add.slice(i, i + 500).map((lesson_id) => ({ lesson_id, cohort_id: testCohortId })));
    for (let i = 0; i < drop.length; i += 200) await db.from("lesson_cohorts").delete().eq("cohort_id", testCohortId).in("lesson_id", drop.slice(i, i + 200));
  } catch {
    // Best effort.
  }
}

/**
 * Make sure this admin has a test student and test cohort, and switch test
 * mode on or off. Any admin (Super Admin or View Admin) may: it changes only
 * their own sandbox.
 */
export async function setTestMode(admin: Pick<Profile, "id" | "role">, on: boolean, opts: { mirrorCohortId?: string | null } = {}): Promise<SetupResult> {
  if (admin.role !== "admin" && admin.role !== "view_admin") return { ok: false, error: "Only admins can use test mode." };
  const db = createAdminClient();
  if (!(await testModeReady(db))) return { ok: false, error: DB_STEP };
  const existing = await loadLinkFor(admin.id, db);
  if (!on) {
    if (existing && existing.adminId === admin.id) await db.from("test_mode").update({ active: false, updated_at: new Date().toISOString() }).eq("admin_id", admin.id);
    return existing ? { ok: true, link: { ...existing, active: false } } : { ok: false, error: "Test mode is already off." };
  }
  try {
    let mirror: { id: string; course_id: string | null } | null = null;
    const wanted = opts.mirrorCohortId ?? existing?.mirrorCohortId ?? null;
    if (wanted) {
      const { data } = await db.from("cohorts").select("*").eq("id", wanted).maybeSingle();
      if (data && dropTestCohorts([data as { name: string; is_test?: boolean }]).length) mirror = { id: data.id as string, course_id: (data.course_id as string | null) ?? null };
    }
    mirror ??= await defaultMirror(db);
    const userId = await ensureUser(db, admin.id);
    const cohortId = await ensureCohort(db, admin.id, userId, mirror);
    await syncLectures(db, cohortId, mirror?.id ?? null);
    const row = { admin_id: admin.id, test_user_id: userId, test_cohort_id: cohortId, mirror_cohort_id: mirror?.id ?? null, active: true, updated_at: new Date().toISOString() };
    const { error } = await db.from("test_mode").upsert(row, { onConflict: "admin_id" });
    if (error) return { ok: false, error: /does not exist|schema cache/i.test(error.message) ? DB_STEP : "Could not switch test mode on. Try again." };
    return { ok: true, link: toLink(row) };
  } catch (e) {
    console.error("test mode set-up failed:", e instanceof Error ? e.message : e);
    return { ok: false, error: "Could not make the test student. Try again." };
  }
}

/** Tables holding the test student's own progress and posts (column user_id unless named). */
const USER_TABLES: readonly [string, string][] = [
  ["learn_progress", "user_id"],
  ["learn_events", "user_id"],
  ["progress", "user_id"],
  ["xp_ledger", "user_id"],
  ["answer_history", "user_id"],
  ["review_cards", "user_id"],
  ["skill_state", "user_id"],
  ["hint_ledger", "user_id"],
  ["notifications", "user_id"],
  ["doubt_votes", "user_id"],
  ["doubt_replies", "user_id"],
  ["doubts", "user_id"],
  ["submissions", "user_id"],
  ["certificates", "user_id"],
  ["credentials", "user_id"],
  ["achievements", "user_id"],
  ["streak_repairs", "user_id"],
  ["study_marks", "user_id"],
  ["tip_dismissals", "user_id"],
  ["prep_answers", "user_id"],
  ["prep_seen", "user_id"],
  ["prep_mock_attempts", "user_id"],
  ["prep_profile", "user_id"],
  ["blitz_results", "user_id"],
  ["daily_case_results", "user_id"],
  ["sort_results", "user_id"],
  ["match_answers", "user_id"],
  ["ratings", "user_id"],
  ["confusions", "user_id"],
  ["attention_checks", "user_id"],
  ["page_visits", "user_id"],
  ["wall_posts", "author_id"],
  ["wall_replies", "author_id"],
  ["wall_reactions", "author_id"],
  ["clinic_attendance", "user_id"],
  ["clinic_leave_requests", "user_id"],
  ["clinic_leave_allowances", "user_id"],
  ["clinic_leave_allowance_log", "user_id"],
  ["clinic_opd_prefs", "user_id"],
  ["clinic_case_quotas", "user_id"],
  ["clinic_case_extras", "user_id"],
  ["clinic_case_logs", "user_id"],
  ["clinic_opd_assignments", "user_id"],
];

/** Rows the admin made in test mode that live on the test cohort. */
const COHORT_TABLES: readonly string[] = ["clinic_day_notes", "clinic_opd_settings", "clinic_opd_assignments", "clinic_case_logs", "clinic_leave_requests", "doubts"];

/**
 * Reset test data: wipe the test student's progress and posts and every row
 * the admin made in test mode, then start the test student and cohort fresh
 * (same account, same sign-in). Test mode stays as it was.
 */
export async function resetTestData(admin: Pick<Profile, "id" | "role">): Promise<{ ok: true; cleared: number } | { ok: false; error: string }> {
  if (admin.role !== "admin" && admin.role !== "view_admin") return { ok: false, error: "Only admins can use test mode." };
  const db = createAdminClient();
  const link = await loadLinkFor(admin.id, db);
  if (!link || link.adminId !== admin.id) return { ok: false, error: "There is no test student yet. Switch test mode on first." };
  // Safety: only ever a flagged test account.
  const { data: who } = await db.from("profiles").select("id, is_test").eq("id", link.testUserId).maybeSingle();
  if (!who || who.is_test !== true) return { ok: false, error: "That account is not a test account." };
  let cleared = 0;
  const del = async (table: string, col: string, value: string) => {
    try {
      const { count, error } = await db.from(table).delete({ count: "exact" }).eq(col, value);
      if (!error) cleared += count ?? 0;
    } catch {
      // A table that isn't there yet.
    }
  };
  for (const [t, c] of USER_TABLES) await del(t, c, link.testUserId);
  if (link.testCohortId) {
    for (const t of COHORT_TABLES) await del(t, "cohort_id", link.testCohortId);
    for (const t of ["clinic_sessions", "clinic_timetable_slots"]) {
      try {
        const { count } = await db.from(t).delete({ count: "exact" }).contains("cohort_ids", [link.testCohortId]);
        cleared += count ?? 0;
      } catch {
        // Not there yet.
      }
    }
    if (link.mirrorCohortId) await copyClinicSetup(db, link.mirrorCohortId, link.testCohortId);
    await syncLectures(db, link.testCohortId, link.mirrorCohortId);
  }
  await db.from("test_mode").update({ last_reset_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("admin_id", admin.id);
  return { ok: true, cleared };
}

/* ------------------------------------------------------------ sign-in */

type SessionLike = { access_token: string; refresh_token: string; expires_in?: number; expires_at?: number; user?: { id: string } | null };

/**
 * A one-time sign-in for this admin's test student (no password: a sign-in
 * link made on the server and used at once). Only for an admin whose test
 * mode is on, and only ever for a flagged test account.
 */
export async function testStudentTokenHash(admin: Pick<Profile, "id" | "role">): Promise<{ ok: true; tokenHash: string; testUserId: string } | { ok: false; error: string }> {
  if (admin.role !== "admin" && admin.role !== "view_admin") return { ok: false, error: "Only admins can use test mode." };
  const db = createAdminClient();
  const link = await loadLinkFor(admin.id, db);
  if (!link || link.adminId !== admin.id || !link.active) return { ok: false, error: "Switch test mode on first." };
  const { data: p } = await db.from("profiles").select("email, is_test, role").eq("id", link.testUserId).maybeSingle();
  if (!p || p.is_test !== true || p.role !== "student" || !p.email) return { ok: false, error: "The test student is missing. Switch test mode off and on again." };
  const { data: made, error } = await db.auth.admin.generateLink({ type: "magiclink", email: String(p.email) });
  const tokenHash = made?.properties?.hashed_token;
  if (error || !tokenHash) return { ok: false, error: "Could not open the test student. Try again." };
  return { ok: true, tokenHash, testUserId: link.testUserId };
}

/** The same, as app tokens (the app keeps the admin's own tokens to come back). */
export async function testStudentSession(admin: Pick<Profile, "id" | "role">): Promise<{ ok: true; session: SessionLike; testUserId: string } | { ok: false; error: string }> {
  const t = await testStudentTokenHash(admin);
  if (!t.ok) return t;
  const { data, error } = await createStatelessAuthClient().auth.verifyOtp({ type: "magiclink", token_hash: t.tokenHash });
  if (error || !data.session || data.user?.id !== t.testUserId) return { ok: false, error: "Could not open the test student. Try again." };
  return { ok: true, session: data.session as SessionLike, testUserId: t.testUserId };
}

/** The test student's one-browser token (website), made once. */
export async function testStudentBrowserToken(testUserId: string): Promise<string> {
  const db = createAdminClient();
  const { data } = await db.from("profiles").select("active_session_token, is_test").eq("id", testUserId).maybeSingle();
  if (!data || data.is_test !== true) throw new Error("not a test account");
  let token = (data.active_session_token as string | null) ?? null;
  if (!token) {
    token = crypto.randomUUID();
    await db.from("profiles").update({ active_session_token: token }).eq("id", testUserId);
  }
  return token;
}

/** What the switch shows. */
export type TestModeState = { ready: boolean; as: "admin" | "student" | null; active: boolean; hasTestStudent: boolean };

export async function testModeState(p: Pick<Profile, "id" | "role">): Promise<TestModeState> {
  const db = createAdminClient();
  const ready = await testModeReady(db);
  if (!ready) return { ready: false, as: null, active: false, hasTestStudent: false };
  const link = await loadLinkFor(p.id, db);
  const scope = scopeOf(p.role, p.id, link);
  return { ready, as: scope?.as ?? null, active: Boolean(link?.active), hasTestStudent: Boolean(link) };
}
