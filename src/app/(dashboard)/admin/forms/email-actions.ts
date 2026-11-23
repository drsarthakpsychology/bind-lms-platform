"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/auth/audit";
import { loadForm, loadSubmissions } from "@/lib/forms/load";
import { PERSONAL_LIMITS } from "@/lib/email/personal-plan";
import { composeFor, sendPersonalEmails, sendWaitingPersonal, type PersonalReport } from "@/lib/email/personal";
import { checkSendBody, prepareDesigned, type DesignedInput } from "@/lib/email/designed-html";
import { formTemplateId } from "@/lib/forms/emailed";
import { logEmailSend, sendResendEmail } from "@/lib/auth/roster";
import { dailyEmailLimit } from "@/lib/certificates/email-plan";
import { emailConfigured, emailsSentToday } from "@/lib/certificates/server";

/**
 * Email the people who filled one form: one, several, or all of them. Super
 * Admin only (it sends mail). The addresses come from the saved answers on
 * the server, never from the page, so only real respondents can be emailed.
 * Goes through the shared sender and daily allowance; the rest wait.
 */
const NO: PersonalReport = { error: "Only the Super Admin can send emails.", sent: [], queued: [], failed: [], noEmail: [], duplicates: 0, remainingToday: 0, queueFailed: false };

export async function emailFormRespondents(input: { formId: string; submissionIds: string[] | "all"; subject: string; body: string; designed?: DesignedInput }): Promise<PersonalReport> {
  const me = await requireSuperAdmin();
  if (!me) return NO;
  const ready = checkSendBody(input.subject, input.body, input.designed);
  if ("error" in ready) return { ...NO, error: ready.error };
  const admin = createAdminClient();
  const form = await loadForm(admin, input.formId);
  if (!form) return { ...NO, error: "That form no longer exists." };
  const subs = await loadSubmissions(admin, input.formId);
  const want = input.submissionIds === "all" ? null : new Set(input.submissionIds);
  // Newest answer first (loadSubmissions order), so a person who answered twice gets their latest name.
  const picked = subs.filter((s) => !want || want.has(s.id));
  if (!picked.length) return { ...NO, error: "Pick at least one person." };
  if (picked.length > PERSONAL_LIMITS.recipients) return { ...NO, error: `${PERSONAL_LIMITS.recipients} people at a time at most.` };

  const report = await sendPersonalEmails(
    admin,
    picked.map((s) => ({ email: s.email, name: s.name, vars: { form: form.title } })),
    { subject: input.subject, body: input.body, templateId: formTemplateId(form.id), sentBy: me.id, designed: ready.designed },
  );
  await audit(admin, {
    action: "form.respondents_emailed",
    targetType: "link_form",
    targetId: form.id,
    details: { picked: picked.length, sent: report.sent.length, queued: report.queued.length, failed: report.failed.length, subject: input.subject.trim().slice(0, 160), designed: Boolean(ready.designed) },
    actor: me,
  }).catch(() => {});
  revalidatePath(`/admin/forms/${form.id}`);
  revalidatePath("/admin/emails");
  return report;
}

/** Send this form's waiting emails, oldest first, up to today's allowance. */
export async function sendWaitingFormEmails(formId: string): Promise<{ error: string | null; sent: number; failed: number; left: number }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: NO.error, sent: 0, failed: 0, left: 0 };
  const r = await sendWaitingPersonal(createAdminClient(), [formTemplateId(formId)]);
  revalidatePath(`/admin/forms/${formId}`);
  return r;
}

/** The template id test sends are logged under (they show in Sent and Failed, never against a form). */
const TEST_TEMPLATE = "test-email";

/**
 * "Send a test to me": the designed email, filled in for the person shown in
 * the preview, sent only to the signed-in Super Admin's own address. Same
 * sender, allowance and log as the real send.
 */
export async function sendDesignedTest(input: { subject: string; designed: DesignedInput; sample?: { name?: string | null; email?: string | null } }): Promise<{ error: string | null; to: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: NO.error, to: null };
  if (!me.email) return { error: "Your account has no email address.", to: null };
  const d = prepareDesigned(input.subject, input.designed);
  if ("error" in d) return { error: d.error, to: null };
  if (!emailConfigured()) return { error: "Email isn't set up on this site.", to: null };
  const admin = createAdminClient();
  if (dailyEmailLimit() - (await emailsSentToday(admin)) <= 0) return { error: "No emails left today. Try again tomorrow.", to: null };
  const sample = { email: input.sample?.email ?? me.email, name: String(input.sample?.name ?? "").slice(0, 120) };
  const m = composeFor(sample, input.subject, "", { html: d.html, text: d.text });
  const subject = `[Test] ${m.subject}`.slice(0, 200);
  const res = await sendResendEmail(me.email, subject, m.text, m.html);
  await logEmailSend(admin, {
    recipient: me.email,
    name: null,
    subject,
    templateId: TEST_TEMPLATE,
    status: res.ok ? "sent" : "failed",
    errorReason: res.ok ? null : (res.error ?? "Send failed."),
    sentAt: res.ok ? new Date().toISOString() : null,
    sentBy: me.id,
    providerId: res.id ?? null,
    bodyText: m.text,
    html: m.html,
  }).catch(() => {});
  revalidatePath("/admin/emails");
  return res.ok ? { error: null, to: me.email } : { error: res.error ?? "Send failed.", to: me.email };
}
