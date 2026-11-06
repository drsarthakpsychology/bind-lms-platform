"use server";

import { appUrl as liveAppUrl } from "@/lib/app-url";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { deriveName, generateCredential, sendCredentialEmails, sendResendEmail } from "@/lib/auth/roster";
import { parseEmails } from "@/lib/cohorts/rules";

type Result = { error: string | null };
const APP_URL = () => liveAppUrl();

function refresh(cohortId?: string) {
  revalidatePath("/admin/cohorts");
  if (cohortId) revalidatePath(`/admin/cohorts/${cohortId}`);
  revalidatePath("/admin/students");
}

/** Run `fn` over items, a few at a time (account creation is one call each). */
async function inBatches<T, R>(items: T[], size: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  return out;
}

/* ---------------------------------------------------------------- cohorts */

export async function createCohort(form: { name: string; startsOn?: string; status?: string; courseId?: string | null }): Promise<Result & { id?: string }> {
  if (!(await requireSuperAdmin())) return { error: "Not authorized." };
  const name = form.name.trim();
  if (!name) return { error: "Give the cohort a name." };
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cohorts")
    .insert({
      name,
      starts_on: form.startsOn || null,
      status: ["upcoming", "active", "ended"].includes(form.status ?? "") ? form.status : "upcoming",
      course_id: form.courseId || null,
    })
    .select("id")
    .single();
  if (error) return { error: /duplicate|unique/i.test(error.message) ? "A cohort with that name already exists." : error.message };
  refresh();
  return { error: null, id: data.id as string };
}

export async function updateCohort(id: string, patch: { name?: string; status?: string; startsOn?: string | null; endsOn?: string | null }): Promise<Result> {
  if (!(await requireSuperAdmin())) return { error: "Not authorized." };
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) {
    if (!patch.name.trim()) return { error: "The name can't be empty." };
    row.name = patch.name.trim();
  }
  if (patch.status !== undefined) {
    if (!["upcoming", "active", "ended"].includes(patch.status)) return { error: "Unknown status." };
    row.status = patch.status;
  }
  if (patch.startsOn !== undefined) row.starts_on = patch.startsOn || null;
  if (patch.endsOn !== undefined) row.ends_on = patch.endsOn || null;
  const { error } = await createAdminClient().from("cohorts").update(row).eq("id", id);
  if (error) return { error: error.message };
  refresh(id);
  return { error: null };
}

/* ----------------------------------------------------- adding people fast */

export type AddRow = { email: string; outcome: "created" | "added" | "already" | "failed"; mailed: boolean; reason?: string };

/**
 * Add people to a cohort by email. New emails get an account (no password is
 * ever shown or sent; they set their own from the login link). Existing
 * accounts are just added to the cohort. Optionally emails the login link to
 * everyone who hasn't set up their account yet.
 */
export async function addPeopleToCohort(
  cohortId: string,
  emailsText: string,
  opts: { sendEmail: boolean; scope: "full" | "lectures_only" },
): Promise<{ error: string | null; rows: AddRow[]; invalid: string[] }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized.", rows: [], invalid: [] };
  const { valid, invalid } = parseEmails(emailsText);
  if (!valid.length) return { error: invalid.length ? "None of those look like email addresses." : "Paste at least one email.", rows: [], invalid };
  if (valid.length > 300) return { error: "Add up to 300 at a time.", rows: [], invalid };

  const admin = createAdminClient();
  const { data: cohort } = await admin.from("cohorts").select("id, course_id").eq("id", cohortId).maybeSingle();
  if (!cohort) return { error: "That cohort doesn't exist.", rows: [], invalid };

  const { data: existing } = await admin.from("profiles").select("id, email").in("email", valid);
  const idByEmail = new Map((existing ?? []).map((p) => [String(p.email).toLowerCase(), p.id as string]));
  const { data: current } = await admin.from("cohort_members").select("user_id").eq("cohort_id", cohortId);
  const inCohort = new Set((current ?? []).map((m) => m.user_id as string));

  // 1. Make accounts for new emails, a few at a time.
  const created = new Set<string>();
  const failures = new Map<string, string>();
  await inBatches(
    valid.filter((e) => !idByEmail.has(e)),
    6,
    async (email) => {
      const { data, error } = await admin.auth.admin.createUser({ email, password: generateCredential(), email_confirm: true, user_metadata: { name: deriveName(email) } });
      if (error || !data.user) {
        failures.set(email, error?.message ?? "Couldn't make the account.");
        return;
      }
      idByEmail.set(email, data.user.id);
      created.add(email);
    },
  );
  const newIds = [...created].map((e) => idByEmail.get(e)!);
  if (newIds.length) {
    await admin.from("profiles").update({ scope: opts.scope }).in("id", newIds);
    await admin
      .from("credential_invites")
      .upsert([...created].map((email) => ({ email, name: deriveName(email), status: "pending", error_reason: null, sent_at: null })), { onConflict: "email" });
  }

  // 2. Put everyone in the cohort (and on its course roster, so handouts and
  //    assignments open for them too).
  const ids = valid.map((e) => idByEmail.get(e)).filter((x): x is string => Boolean(x));
  if (ids.length) {
    const { error } = await admin
      .from("cohort_members")
      .upsert(ids.map((user_id) => ({ cohort_id: cohortId, user_id, added_by: me.id })), { onConflict: "cohort_id,user_id", ignoreDuplicates: true });
    if (error) return { error: error.message, rows: [], invalid };
    if (cohort.course_id) {
      await admin
        .from("course_enrollments")
        .upsert(ids.map((user_id) => ({ user_id, course_id: cohort.course_id })), { onConflict: "user_id,course_id", ignoreDuplicates: true });
    }
  }

  // 3. Email the login link to everyone here who hasn't set up their account.
  const mailed = new Set<string>();
  if (opts.sendEmail) {
    const { data: invites } = await admin.from("credential_invites").select("email, setup_completed_at").in("email", valid);
    const done = new Set((invites ?? []).filter((i) => i.setup_completed_at).map((i) => String(i.email)));
    const toMail = valid.filter((e) => idByEmail.has(e) && !done.has(e));
    // Missing invite rows (accounts made elsewhere) get one so the send is logged.
    const known = new Set((invites ?? []).map((i) => String(i.email)));
    const missing = toMail.filter((e) => !known.has(e));
    if (missing.length) {
      await admin.from("credential_invites").upsert(missing.map((email) => ({ email, name: deriveName(email), status: "pending" })), { onConflict: "email" });
    }
    const quarter = Math.ceil(toMail.length / 4) || 1;
    const parts = [0, 1, 2, 3].map((k) => toMail.slice(k * quarter, (k + 1) * quarter)).filter((p) => p.length);
    const results = await Promise.all(
      parts.map((p) => sendCredentialEmails(p, { admin, appUrl: APP_URL(), sendEmail: sendResendEmail, sentBy: me.id })),
    );
    for (const r of results) for (const x of r.results) {
      if (x.ok) mailed.add(x.email);
      else failures.set(x.email, `Account ready, email failed: ${x.reason ?? "unknown"}`);
    }
  }

  const rows: AddRow[] = valid.map((email) => {
    const id = idByEmail.get(email);
    if (!id) return { email, outcome: "failed", mailed: false, reason: failures.get(email) };
    const outcome = created.has(email) ? "created" : inCohort.has(id) ? "already" : "added";
    return { email, outcome, mailed: mailed.has(email), reason: failures.get(email) };
  });
  refresh(cohortId);
  return { error: null, rows, invalid };
}

/** Email a fresh login link to one person. */
export async function sendLoginLink(email: string): Promise<Result> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const admin = createAdminClient();
  await admin.from("credential_invites").upsert({ email, name: deriveName(email), status: "pending" }, { onConflict: "email", ignoreDuplicates: true });
  const r = await sendCredentialEmails([email], { admin, appUrl: APP_URL(), sendEmail: sendResendEmail, sentBy: me.id });
  return { error: r.sent ? null : (r.results[0]?.reason ?? "The email didn't send.") };
}

/* ------------------------------------------------------------- membership */

export async function removeFromCohort(cohortId: string, userId: string): Promise<Result> {
  if (!(await requireSuperAdmin())) return { error: "Not authorized." };
  const { error } = await createAdminClient().from("cohort_members").delete().eq("cohort_id", cohortId).eq("user_id", userId);
  if (error) return { error: error.message };
  refresh(cohortId);
  revalidatePath(`/admin/students/${userId}`);
  return { error: null };
}

/** Set exactly which cohorts a person is in. */
export async function setPersonCohorts(userId: string, cohortIds: string[]): Promise<Result> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const admin = createAdminClient();
  const { data: cur } = await admin.from("cohort_members").select("cohort_id").eq("user_id", userId);
  const have = new Set((cur ?? []).map((c) => c.cohort_id as string));
  const want = new Set(cohortIds);
  const drop = [...have].filter((c) => !want.has(c));
  const add = [...want].filter((c) => !have.has(c));
  if (drop.length) await admin.from("cohort_members").delete().eq("user_id", userId).in("cohort_id", drop);
  if (add.length) {
    const { error } = await admin.from("cohort_members").insert(add.map((cohort_id) => ({ cohort_id, user_id: userId, added_by: me.id })));
    if (error) return { error: error.message };
    const { data: cs } = await admin.from("cohorts").select("course_id").in("id", add);
    const courses = [...new Set((cs ?? []).map((c) => c.course_id as string | null).filter(Boolean))] as string[];
    if (courses.length) {
      await admin.from("course_enrollments").upsert(courses.map((course_id) => ({ user_id: userId, course_id })), { onConflict: "user_id,course_id", ignoreDuplicates: true });
    }
  }
  refresh();
  revalidatePath(`/admin/students/${userId}`);
  return { error: null };
}

/** Full platform, or lectures only. */
export async function setPersonScope(userId: string, scope: "full" | "lectures_only"): Promise<Result> {
  if (!(await requireSuperAdmin())) return { error: "Not authorized." };
  const { error } = await createAdminClient().from("profiles").update({ scope }).eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/students/${userId}`);
  return { error: null };
}

/* --------------------------------------------------------------- lectures */

/** Share (or stop sharing) lectures with a cohort. */
export async function setCohortLessons(cohortId: string, lessonIds: string[], shared: boolean): Promise<Result> {
  if (!(await requireSuperAdmin())) return { error: "Not authorized." };
  if (!lessonIds.length) return { error: null };
  const admin = createAdminClient();
  const { error } = shared
    ? await admin.from("lesson_cohorts").upsert(lessonIds.map((lesson_id) => ({ lesson_id, cohort_id: cohortId })), { onConflict: "lesson_id,cohort_id", ignoreDuplicates: true })
    : await admin.from("lesson_cohorts").delete().eq("cohort_id", cohortId).in("lesson_id", lessonIds);
  if (error) return { error: error.message };
  refresh(cohortId);
  return { error: null };
}

/** Give (or take back) one lecture for one person, outside their cohort. */
export async function setPersonLesson(userId: string, lessonId: string, granted: boolean): Promise<Result> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const admin = createAdminClient();
  const { error } = granted
    ? await admin.from("lesson_grants").upsert({ lesson_id: lessonId, user_id: userId, granted_by: me.id }, { onConflict: "lesson_id,user_id", ignoreDuplicates: true })
    : await admin.from("lesson_grants").delete().eq("user_id", userId).eq("lesson_id", lessonId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/students/${userId}`);
  return { error: null };
}

/** Let a student fill the details form again (for example after a typo). */
export async function reopenDetails(userId: string): Promise<Result> {
  if (!(await requireSuperAdmin())) return { error: "Not authorized." };
  const { error } = await createAdminClient().from("student_details").update({ confirmed_at: null }).eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/students/${userId}`);
  return { error: null };
}
