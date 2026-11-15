import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendResendEmail, logEmailSend } from "@/lib/auth/roster";
import { dailyEmailLimit } from "@/lib/certificates/email-plan";
import { emailConfigured, emailsSentToday } from "@/lib/certificates/server";
import { isQuotaStop } from "./pace";
import { escapeHtml, richToEmailHtml, textToHtml } from "./rich-html";
import { mergeVars, planPersonal, renderMerge, type PersonalTarget } from "./personal-plan";

/**
 * Send one personal email to each person in a group, through the same Resend
 * sender and the same daily allowance as every other VIBHA email. What the
 * allowance does not cover today waits in email_sends as "pending" (subject,
 * text and HTML already merged for that person) and goes out from "Send
 * waiting" later, oldest first. Every send is logged in email_sends with the
 * template id the caller gives (e.g. "form:<id>"), which is how the screens
 * know who was emailed.
 */

export type PersonalReport = {
  error: string | null;
  sent: string[];
  queued: string[];
  failed: Array<{ name: string; reason: string }>;
  noEmail: string[];
  duplicates: number;
  /** Emails left today after this batch. */
  remainingToday: number;
  /** Queued emails could not be saved: they were not kept. */
  queueFailed: boolean;
};

export type ComposeInput = { subject: string; body: string; templateId: string; sentBy: string; replyName?: string };

const nameOf = (t: PersonalTarget, email: string) => String(t.name ?? "").trim() || email;

/** The subject, plain text and HTML for one person. */
export function composeFor(t: PersonalTarget, subject: string, body: string): { subject: string; text: string; html: string } {
  const vars = mergeVars(t);
  const s = renderMerge(subject, vars).replace(/[\r\n]+/g, " ").trim();
  const text = renderMerge(body, vars).trim();
  return { subject: s, text, html: richToEmailHtml(textToHtml(text), { preheader: text.slice(0, 120) }) };
}

export async function sendPersonalEmails(admin: SupabaseClient, targets: PersonalTarget[], input: ComposeInput): Promise<PersonalReport> {
  const empty: PersonalReport = { error: null, sent: [], queued: [], failed: [], noEmail: [], duplicates: 0, remainingToday: 0, queueFailed: false };
  if (!emailConfigured()) return { ...empty, error: "Email isn't set up on this site." };
  const sentToday = await emailsSentToday(admin);
  const plan = planPersonal(targets, { limit: dailyEmailLimit(), sentToday });
  const report: PersonalReport = { ...empty, noEmail: plan.noEmail.map((t) => String(t.name ?? "").trim() || "No name"), duplicates: plan.duplicates, remainingToday: plan.remaining };
  const wait = [...plan.queue];

  for (let i = 0; i < plan.send.length; i++) {
    const t = plan.send[i];
    const m = composeFor(t, input.subject, input.body);
    const res = await sendResendEmail(t.email, m.subject, m.text, m.html);
    if (!res.ok && isQuotaStop(res.error)) {
      // The provider says today is used up: everyone left waits.
      wait.unshift(...plan.send.slice(i));
      report.remainingToday = 0;
      break;
    }
    await logEmailSend(admin, {
      recipient: t.email,
      name: String(t.name ?? "").trim() || null,
      subject: m.subject,
      templateId: input.templateId,
      status: res.ok ? "sent" : "failed",
      errorReason: res.ok ? null : (res.error ?? "Send failed."),
      sentAt: res.ok ? new Date().toISOString() : null,
      sentBy: input.sentBy,
      providerId: res.id ?? null,
      bodyText: m.text,
      html: m.html,
    }).catch(() => {});
    if (res.ok) {
      report.sent.push(nameOf(t, t.email));
      report.remainingToday = Math.max(0, report.remainingToday - 1);
    } else {
      report.failed.push({ name: nameOf(t, t.email), reason: res.error ?? "Send failed." });
    }
  }

  if (wait.length) {
    const rows = wait.map((t) => {
      const m = composeFor(t, input.subject, input.body);
      return { recipient: t.email, name: String(t.name ?? "").trim() || null, subject: m.subject, template_id: input.templateId, status: "pending", sent_by: input.sentBy, body_text: m.text, html: m.html };
    });
    const { error } = await admin.from("email_sends").insert(rows);
    if (error) report.queueFailed = true;
    else report.queued.push(...wait.map((t) => nameOf(t, t.email)));
  }
  return report;
}

/**
 * Send what is waiting for these template ids (e.g. one form's emails, or
 * all pipeline emails), oldest first, up to what today allows.
 */
export async function sendWaitingPersonal(admin: SupabaseClient, templateIds: string[]): Promise<{ error: string | null; sent: number; failed: number; left: number }> {
  if (!emailConfigured()) return { error: "Email isn't set up on this site.", sent: 0, failed: 0, left: 0 };
  const { data, error } = await admin
    .from("email_sends")
    .select("id, recipient, subject, body_text, html")
    .eq("status", "pending")
    .in("template_id", templateIds)
    .order("created_at", { ascending: true })
    .limit(500);
  if (error) return { error: "Couldn't read the waiting emails.", sent: 0, failed: 0, left: 0 };
  let remaining = Math.max(0, dailyEmailLimit() - (await emailsSentToday(admin)));
  let sent = 0;
  let failed = 0;
  for (const row of data ?? []) {
    if (remaining <= 0) break;
    const text = String(row.body_text ?? "");
    const html = (row.html as string | null) || richToEmailHtml(`<p>${escapeHtml(text)}</p>`);
    const res = await sendResendEmail(String(row.recipient), String(row.subject ?? ""), text, html);
    if (!res.ok && isQuotaStop(res.error)) break;
    const now = new Date().toISOString();
    await admin
      .from("email_sends")
      .update(res.ok ? { status: "sent", sent_at: now, provider_id: res.id ?? null, error_reason: null } : { status: "failed", error_reason: res.error ?? "Send failed." })
      .eq("id", row.id);
    if (res.ok) {
      sent++;
      remaining--;
    } else failed++;
  }
  const { count } = await admin.from("email_sends").select("id", { count: "exact", head: true }).eq("status", "pending").in("template_id", templateIds);
  return { error: null, sent, failed, left: count ?? 0 };
}

/** Today's allowance, for the compose screen. */
export async function emailAllowance(admin: SupabaseClient): Promise<{ configured: boolean; limit: number; left: number }> {
  const configured = emailConfigured();
  const limit = dailyEmailLimit();
  const used = configured ? await emailsSentToday(admin).catch(() => 0) : 0;
  return { configured, limit, left: Math.max(0, limit - used) };
}
