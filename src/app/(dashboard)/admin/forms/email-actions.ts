"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/auth/audit";
import { loadForm, loadSubmissions } from "@/lib/forms/load";
import { checkCompose, PERSONAL_LIMITS } from "@/lib/email/personal-plan";
import { sendPersonalEmails, sendWaitingPersonal, type PersonalReport } from "@/lib/email/personal";
import { formTemplateId } from "@/lib/forms/emailed";

/**
 * Email the people who filled one form: one, several, or all of them. Super
 * Admin only (it sends mail). The addresses come from the saved answers on
 * the server, never from the page, so only real respondents can be emailed.
 * Goes through the shared sender and daily allowance; the rest wait.
 */
const NO: PersonalReport = { error: "Only the Super Admin can send emails.", sent: [], queued: [], failed: [], noEmail: [], duplicates: 0, remainingToday: 0, queueFailed: false };

export async function emailFormRespondents(input: { formId: string; submissionIds: string[] | "all"; subject: string; body: string }): Promise<PersonalReport> {
  const me = await requireSuperAdmin();
  if (!me) return NO;
  const bad = checkCompose(input.subject, input.body);
  if (bad) return { ...NO, error: bad };
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
    { subject: input.subject, body: input.body, templateId: formTemplateId(form.id), sentBy: me.id },
  );
  await audit(admin, {
    action: "form.respondents_emailed",
    targetType: "link_form",
    targetId: form.id,
    details: { picked: picked.length, sent: report.sent.length, queued: report.queued.length, failed: report.failed.length, subject: input.subject.trim().slice(0, 160) },
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
