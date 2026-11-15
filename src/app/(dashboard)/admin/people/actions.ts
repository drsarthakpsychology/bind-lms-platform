"use server";

import { appUrl as liveAppUrl } from "@/lib/app-url";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { deriveName, generateCredential, issueSetupLink, sendCredentialEmails, sendResendEmail } from "@/lib/auth/roster";
import { STAGE_LABEL, isStage, loadPeople } from "@/lib/crm/people";
import { audit } from "@/lib/auth/audit";
import { checkCompose, PERSONAL_LIMITS } from "@/lib/email/personal-plan";
import { sendPersonalEmails, sendWaitingPersonal, type PersonalReport } from "@/lib/email/personal";

type Result = { error: string | null };
const NO_REPORT: PersonalReport = { error: null, sent: [], queued: [], failed: [], noEmail: [], duplicates: 0, remainingToday: 0, queueFailed: false };
const clean = (email: string) => email.trim().toLowerCase();
const ok = (email: string): Result => {
  revalidatePath("/admin/people");
  revalidatePath("/admin");
  void email;
  return { error: null };
};

/** Move someone to a pipeline stage (and log it on their timeline). */
export async function setStage(email: string, stage: string): Promise<Result> {
  const admin0 = await requireSuperAdmin();
  if (!admin0) return { error: "Not authorized." };
  if (!isStage(stage)) return { error: "Unknown stage." };
  const admin = createAdminClient();
  const e = clean(email);
  const { error } = await admin.from("crm_contacts").upsert({ email: e, stage, updated_at: new Date().toISOString() }, { onConflict: "email" });
  if (error) return { error: "Couldn't save the stage." };
  await admin.from("crm_activities").insert({ email: e, kind: "stage", body: `Moved to ${STAGE_LABEL[stage]}`, created_by: admin0.id });
  return ok(e);
}

/** Set (or clear, with an empty date) the next follow-up. */
export async function setFollowUp(email: string, date: string): Promise<Result> {
  if (!(await requireSuperAdmin())) return { error: "Not authorized." };
  const admin = createAdminClient();
  const at = date ? new Date(`${date}T09:00:00+05:30`).toISOString() : null;
  const { error } = await admin.from("crm_contacts").upsert({ email: clean(email), next_follow_up_at: at, updated_at: new Date().toISOString() }, { onConflict: "email" });
  if (error) return { error: "Couldn't save the follow-up." };
  return ok(email);
}

/** Log a call, WhatsApp, meeting or note. Contacting someone new moves them to "Contacted". */
export async function logActivity(email: string, kind: string, body: string): Promise<Result> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  if (!["note", "call", "whatsapp", "email", "meeting"].includes(kind)) return { error: "Unknown activity." };
  const text = body.trim().slice(0, 4000);
  const admin = createAdminClient();
  const e = clean(email);
  const { error } = await admin.from("crm_activities").insert({ email: e, kind, body: text || null, created_by: me.id });
  if (error) return { error: "Couldn't save that." };
  if (kind !== "note") {
    const { data: c } = await admin.from("crm_contacts").select("stage").eq("email", e).maybeSingle();
    if (!c || c.stage === "new") {
      await admin.from("crm_contacts").upsert({ email: e, stage: "contacted", updated_at: new Date().toISOString() }, { onConflict: "email" });
    }
  }
  return ok(e);
}

/** Turn an enquiry into a student account and return a one-time setup link. */
export async function convertToStudent(email: string, name: string): Promise<{ error: string | null; setupUrl: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized.", setupUrl: null };
  const e = clean(email);
  const admin = createAdminClient();
  const { data: existing } = await admin.from("profiles").select("id").eq("email", e).maybeSingle();
  if (!existing) {
    const { data: created, error } = await admin.auth.admin.createUser({ email: e, password: generateCredential(), email_confirm: true });
    if (error || !created.user) return { error: error?.message ?? "Couldn't create the account.", setupUrl: null };
    await admin.from("profiles").update({ scope: "full" }).eq("id", created.user.id);
  }
  await admin
    .from("credential_invites")
    .upsert({ email: e, name: name.trim() || deriveName(e), status: "pending", error_reason: null, sent_at: null }, { onConflict: "email" });
  await admin.from("crm_contacts").upsert({ email: e, stage: "joined", updated_at: new Date().toISOString() }, { onConflict: "email" });
  await admin.from("crm_activities").insert({ email: e, kind: "stage", body: "Became a student", created_by: me.id });
  const appUrl = liveAppUrl();
  const setupUrl = await issueSetupLink(admin, e, appUrl, me.id);
  revalidatePath("/admin/students");
  revalidatePath("/admin/emails");
  ok(e);
  return { error: null, setupUrl };
}

/* ------------------------------------------------------------------ */
/* Pipeline v2: paid, invite, email a filtered group                   */
/* ------------------------------------------------------------------ */

/** The email template id pipeline emails are logged under (their timeline and "Send waiting" read it). */
const PIPELINE_TEMPLATE = "pipeline";

/**
 * Mark someone paid (or not paid). Needs the database step
 * 2026_11_15_people_payment.sql; until it is pasted this says so and
 * nothing is written.
 */
export async function markPaid(email: string, paid: boolean, amount?: number | null, note?: string | null): Promise<Result & { missingStep?: boolean }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const e = clean(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return { error: "No email for this person." };
  const amt = paid && amount != null && Number.isFinite(amount) && amount >= 0 ? Math.round(amount * 100) / 100 : null;
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const { error } = await admin
    .from("crm_contacts")
    .upsert(
      { email: e, paid_at: paid ? now : null, paid_amount: amt, paid_note: paid ? (note ?? "").trim().slice(0, 300) || null : null, paid_by: paid ? me.id : null, updated_at: now },
      { onConflict: "email" },
    );
  if (error) {
    if (/paid_at|paid_amount|paid_note|paid_by|column/i.test(error.message)) return { error: "Paste 2026_11_15_people_payment.sql in Supabase first, then Mark paid will save.", missingStep: true };
    return { error: "Couldn't save that." };
  }
  const body = paid ? `Marked paid${amt != null ? `: ₹${amt.toLocaleString("en-IN")}` : ""}${note?.trim() ? `. ${note.trim().slice(0, 300)}` : ""}` : "Marked not paid";
  // The "payment" kind comes with the same database step; a note keeps the history if it is refused.
  const act = await admin.from("crm_activities").insert({ email: e, kind: "payment", body, created_by: me.id });
  if (act.error) await admin.from("crm_activities").insert({ email: e, kind: "note", body, created_by: me.id });
  return ok(e);
}

/**
 * Send the login link (invite). Someone without an account gets one first,
 * exactly as "Make a student" does. Goes through the shared credential sender.
 */
export async function sendInvite(email: string, name: string): Promise<{ error: string | null; sent: boolean; reason?: string }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized.", sent: false };
  const e = clean(email);
  const admin = createAdminClient();
  const { data: existing } = await admin.from("profiles").select("id").eq("email", e).maybeSingle();
  if (!existing) {
    const made = await convertToStudent(e, name);
    if (made.error) return { error: made.error, sent: false };
  } else {
    await admin.from("credential_invites").upsert({ email: e, name: name.trim() || deriveName(e), status: "pending" }, { onConflict: "email", ignoreDuplicates: true });
  }
  const report = await sendCredentialEmails([e], { admin, appUrl: liveAppUrl(), sendEmail: sendResendEmail, sentBy: me.id });
  await admin.from("crm_activities").insert({ email: e, kind: "email", body: report.sent ? "Login link sent" : `Login link failed: ${report.results[0]?.reason ?? "unknown"}`, created_by: me.id });
  revalidatePath("/admin/students");
  revalidatePath("/admin/emails");
  ok(e);
  return { error: null, sent: report.sent > 0, reason: report.results[0]?.reason };
}

/**
 * Email a group from the pipeline (one person or a filtered view). Only
 * addresses that are in the pipeline are emailed, whatever the page sends.
 * Shared sender and daily allowance; the rest wait in the queue.
 */
export async function emailPeople(input: { emails: string[]; subject: string; body: string }): Promise<PersonalReport> {
  const me = await requireSuperAdmin();
  if (!me) return { ...NO_REPORT, error: "Only the Super Admin can send emails." };
  const bad = checkCompose(input.subject, input.body);
  if (bad) return { ...NO_REPORT, error: bad };
  const want = new Set(input.emails.map(clean));
  if (!want.size) return { ...NO_REPORT, error: "Pick at least one person." };
  if (want.size > PERSONAL_LIMITS.recipients) return { ...NO_REPORT, error: `${PERSONAL_LIMITS.recipients} people at a time at most.` };
  const admin = createAdminClient();
  const people = (await loadPeople(admin)).filter((p) => want.has(p.email));
  if (!people.length) return { ...NO_REPORT, error: "None of these people are in the pipeline." };
  const report = await sendPersonalEmails(
    admin,
    people.map((p) => ({ email: p.email, name: p.name })),
    { subject: input.subject, body: input.body, templateId: PIPELINE_TEMPLATE, sentBy: me.id },
  );
  await audit(admin, {
    action: "pipeline.emailed",
    targetType: "crm",
    targetId: null,
    details: { picked: people.length, sent: report.sent.length, queued: report.queued.length, failed: report.failed.length, subject: input.subject.trim().slice(0, 160) },
    actor: me,
  }).catch(() => {});
  revalidatePath("/admin/people");
  revalidatePath("/admin/emails");
  return report;
}

/** Send the pipeline emails that are waiting, up to today's allowance. */
export async function sendWaitingPeopleEmails(): Promise<{ error: string | null; sent: number; failed: number; left: number }> {
  if (!(await requireSuperAdmin())) return { error: "Only the Super Admin can send emails.", sent: 0, failed: 0, left: 0 };
  const r = await sendWaitingPersonal(createAdminClient(), [PIPELINE_TEMPLATE]);
  revalidatePath("/admin/people");
  return r;
}

/** Log that WhatsApp messages were opened for these people (so "last contact" moves). */
export async function logWhatsApp(emails: string[], text: string): Promise<Result> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const list = [...new Set(emails.map(clean))].filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)).slice(0, 500);
  if (!list.length) return { error: null };
  const admin = createAdminClient();
  const body = text.trim().slice(0, 1000) || null;
  const { error } = await admin.from("crm_activities").insert(list.map((email) => ({ email, kind: "whatsapp", body, created_by: me.id })));
  if (error) return { error: "Couldn't save that." };
  revalidatePath("/admin/people");
  return { error: null };
}
