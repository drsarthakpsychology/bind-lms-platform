"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { logEmailSend, PREVIEW_GATE, sendCredentialEmails, sendResendEmail } from "@/lib/auth/roster";
import { appUrl as liveAppUrl } from "@/lib/app-url";
import { loadOpenFailures } from "@/lib/email/failed";
import { isQuotaStop, planRetry, type FailedRow } from "@/lib/email/pace";
import { htmlToPlain } from "@/lib/email/rich-html";

export type RetryReport = {
  error: string | null;
  sent: number;
  failed: number;
  /** Already got the same email later — marked handled, not re-sent. */
  alreadyDelivered: number;
  /** Same person + subject listed more than once — sent once. */
  duplicates: number;
  noCopy: number;
  notRetryable: number;
  /** Stopped because the daily sending limit was reached. */
  stoppedForQuota: boolean;
  /** This is a preview site: nothing was sent and nothing was marked handled. */
  previewBlocked: boolean;
  /** Still waiting (each click sends at most BATCH, so the page never times out). */
  left: number;
};

const BATCH = 40;

/** Mark rows handled without deleting them (they leave the Failed list). */
async function markHandled(admin: ReturnType<typeof createAdminClient>, ids: string[], retried: boolean) {
  if (!ids.length) return;
  const now = new Date().toISOString();
  const withRetried = await admin.from("email_sends").update({ dismissed_at: now, ...(retried ? { retried_at: now } : {}) }).in("id", ids);
  if (withRetried.error && retried) await admin.from("email_sends").update({ dismissed_at: now }).in("id", ids);
}

/**
 * Retry failed emails — one (ids = [id]), a selection, or all (ids = null).
 * Safeguards: one send per person + subject, skip anyone who already got it,
 * login emails get a fresh link, sends are paced, and the batch stops at the
 * daily limit. Every retry is a new row linked to the email it retries.
 */
export async function retryFailedEmails(ids: string[] | null): Promise<RetryReport> {
  const empty: RetryReport = { error: null, sent: 0, failed: 0, alreadyDelivered: 0, duplicates: 0, noCopy: 0, notRetryable: 0, stoppedForQuota: false, previewBlocked: false, left: 0 };
  const me = await requireSuperAdmin();
  if (!me) return { ...empty, error: "Only the Super Admin can send email." };
  if (!process.env.RESEND_API_KEY) return { ...empty, error: "Email isn't set up on the server (no sending key)." };

  const admin = createAdminClient();
  const open = await loadOpenFailures<FailedRow & { name: string | null }>(admin, 1000);
  const want = ids ? new Set(ids) : null;
  const rows = want ? open.filter((r) => want.has(r.id)) : open;
  if (!rows.length) return empty;

  // HTML copies (the column exists once 2026_11_admin_redesign.sql has run, or on older databases that had it).
  const htmlById = new Map<string, string>();
  for (let i = 0; i < rows.length; i += 200) {
    const { data, error } = await admin.from("email_sends").select("id, html").in("id", rows.slice(i, i + 200).map((r) => r.id));
    if (error) break;
    for (const d of data ?? []) if (d.html) htmlById.set(d.id as string, d.html as string);
  }
  const withCopies = rows.map((r) => ({ ...r, html: htmlById.get(r.id) ?? null }));

  const recipients = [...new Set(withCopies.map((r) => r.recipient))];
  const good: { recipient: string; subject: string; created_at: string }[] = [];
  for (let i = 0; i < recipients.length; i += 200) {
    const { data } = await admin
      .from("email_sends")
      .select("recipient, subject, created_at")
      .in("recipient", recipients.slice(i, i + 200))
      .in("status", ["sent", "delivered"])
      .limit(5000);
    good.push(...((data ?? []) as typeof good));
  }

  const plan = planRetry(withCopies, good);
  await markHandled(admin, [...plan.alreadyDelivered, ...plan.duplicates].map((r) => r.id), false);

  const report: RetryReport = {
    ...empty,
    alreadyDelivered: plan.alreadyDelivered.length,
    duplicates: plan.duplicates.length,
    noCopy: plan.noCopy.length,
    notRetryable: plan.notRetryable.length,
  };

  const batch = plan.send.slice(0, BATCH);
  const appUrl = liveAppUrl();
  let done = 0;
  for (const r of batch) {
    if (r.template_id === "credential") {
      // Login emails: a fresh setup link (the old one may have expired).
      const res = await sendCredentialEmails([r.recipient], { admin, appUrl, sendEmail: sendResendEmail, sentBy: me.id });
      if (res.results.some((x) => x.reason === PREVIEW_GATE)) {
        report.previewBlocked = true;
        break;
      }
      done++;
      if (res.sent) report.sent++;
      else report.failed++;
      await markHandled(admin, [r.id], true);
      if (res.results.some((x) => isQuotaStop(x.reason))) {
        report.stoppedForQuota = true;
        break;
      }
      continue;
    }
    const html = r.html ?? undefined;
    const text = r.body_text?.trim() || (html ? htmlToPlain(html) : "");
    const res = await sendResendEmail(r.recipient, r.subject, text, html);
    if (!res.ok && res.error === PREVIEW_GATE) {
      report.previewBlocked = true;
      break;
    }
    done++;
    await logEmailSend(admin, {
      recipient: r.recipient,
      name: (r as { name?: string | null }).name ?? null,
      subject: r.subject,
      templateId: r.template_id ?? "custom",
      status: res.ok ? "sent" : "failed",
      errorReason: res.ok ? null : (res.error ?? "Send failed."),
      sentAt: res.ok ? new Date().toISOString() : null,
      sentBy: me.id,
      providerId: res.id ?? null,
      bodyText: text || null,
      html: html ?? null,
      retryOf: r.id,
    });
    await markHandled(admin, [r.id], true);
    if (res.ok) report.sent++;
    else {
      report.failed++;
      if (isQuotaStop(res.error)) {
        report.stoppedForQuota = true;
        break;
      }
    }
  }
  report.left = plan.send.length - done;

  revalidatePath("/admin/emails");
  revalidatePath("/admin");
  return report;
}
