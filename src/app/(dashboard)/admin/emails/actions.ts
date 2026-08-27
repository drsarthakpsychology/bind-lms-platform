"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { sendResendEmail, sendCredentialEmails, logEmailSend } from "@/lib/auth/roster";

export type RecipientData = {
  courses: Array<{ id: string; title: string }>;
  students: Array<{ id: string; email: string }>;
  /** courseId → enrolled student user ids (for the by-course shortcuts). */
  enrolledByCourse: Record<string, string[]>;
};

/** Load the recipient universe for the compose tab (courses + students + enrollments). */
export async function loadRecipientData(): Promise<RecipientData> {
  const profile = await requireAdmin();
  if (!profile) return { courses: [], students: [], enrolledByCourse: {} };

  const supabase = await createAdminClient();
  const [{ data: courses }, { data: students }, { data: enrollments }] = await Promise.all([
    supabase.from("courses").select("id, title").eq("is_published", true).order("title", { ascending: true }),
    supabase
      .from("profiles")
      .select("id, email")
      .eq("role", "student")
      .eq("is_test", false)
      .order("email", { ascending: true }),
    supabase.from("course_enrollments").select("course_id, user_id"),
  ]);

  const enrolledByCourse: Record<string, string[]> = {};
  for (const e of enrollments ?? []) {
    (enrolledByCourse[e.course_id] ??= []).push(e.user_id);
  }

  return {
    courses: (courses ?? []).map((c) => ({ id: c.id, title: c.title })),
    students: (students ?? []).map((s) => ({ id: s.id, email: s.email })),
    enrolledByCourse,
  };
}

/** Cheap plain-text fallback derived from an HTML body (strip tags, collapse whitespace). */
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type CampaignSendResult = {
  error: string | null;
  sent: number;
  failed: number;
  results: Array<{ email: string; ok: boolean; reason?: string }>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Send a composed email (template or custom HTML) to a list of recipients.
 * Loops the single proven Resend sender per recipient, logs every send to
 * email_sends, respects the daily send limit. Nothing is sent until the admin
 * has previewed + confirmed (the UI's Send-to-N step).
 */
export async function sendCampaignEmail(input: {
  subject: string;
  html: string;
  text?: string;
  recipientEmails: string[];
  templateId: string | null;
}): Promise<CampaignSendResult> {
  const profile = await requireAdmin();
  if (!profile) return { error: "Not authorized.", sent: 0, failed: 0, results: [] };

  const subject = input.subject.trim();
  const html = input.html.trim();
  const emails = Array.from(
    new Set(
      input.recipientEmails
        .map((e) => e.trim().toLowerCase())
        .filter((e) => EMAIL_RE.test(e)),
    ),
  );

  if (!subject) return { error: "Add a subject line.", sent: 0, failed: 0, results: [] };
  if (!html && !input.text?.trim()) return { error: "Write the email first.", sent: 0, failed: 0, results: [] };
  if (emails.length === 0) return { error: "Select at least one recipient.", sent: 0, failed: 0, results: [] };

  const dailyLimit = Number(process.env.RESEND_DAILY_LIMIT ?? 100);
  if (emails.length > dailyLimit) {
    return {
      error: `That's ${emails.length} recipients — over the ${dailyLimit} send/day limit. Split into smaller sends.`,
      sent: 0,
      failed: 0,
      results: [],
    };
  }

  const admin = createAdminClient();
  const text = (input.text ?? htmlToText(html)).trim();
  const templateId = input.templateId ?? "custom";
  const results: Array<{ email: string; ok: boolean; reason?: string }> = [];
  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    const res = await sendResendEmail(email, subject, text, html);
    await logEmailSend(admin, {
      recipient: email,
      name: null,
      subject,
      templateId,
      status: res.ok ? "sent" : "failed",
      errorReason: res.ok ? null : (res.error ?? "Resend send failed."),
      sentAt: res.ok ? new Date().toISOString() : null,
      sentBy: profile.id,
    });
    if (res.ok) {
      sent++;
      results.push({ email, ok: true });
    } else {
      failed++;
      const reason = res.error ?? "Resend send failed.";
      results.push({ email, ok: false, reason });
    }
  }

  revalidatePath("/admin/emails");
  return { error: null, sent, failed, results };
}

/** Send the current compose to the admin's own inbox for a visual check. */
export async function sendTestCampaignEmail(input: {
  subject: string;
  html: string;
}): Promise<{ error: string | null; ok: boolean; detail: string }> {
  const profile = await requireAdmin();
  if (!profile) return { error: "Not authorized.", ok: false, detail: "" };
  if (!profile.email) return { error: "Your account has no email on file.", ok: false, detail: "" };

  const subject = `[TEST] ${input.subject.trim()}` || "[TEST] no subject";
  const html = input.html.trim();
  if (!html) return { error: "Write the email first.", ok: false, detail: "" };

  const res = await sendResendEmail(profile.email, subject, htmlToText(html), html);
  return {
    error: null,
    ok: res.ok,
    detail: res.ok ? `Sent to ${profile.email} — Resend id ${res.id ?? "(none)"}` : (res.error ?? "Send failed."),
  };
}

/**
 * Retry the failed CREDENTIAL sends from the Sent history. Campaign emails
 * aren't re-sent here (their body isn't stored — re-compose to resend).
 */
export async function retryFailedCredentialSends(): Promise<{
  error: string | null;
  retried: number;
  sent: number;
  failed: number;
}> {
  const profile = await requireAdmin();
  if (!profile) return { error: "Not authorized.", retried: 0, sent: 0, failed: 0 };

  const admin = createAdminClient();
  const { data } = await admin
    .from("email_sends")
    .select("recipient")
    .eq("template_id", "credential")
    .eq("status", "failed")
    .limit(500);
  const emails = Array.from(new Set((data ?? []).map((d) => d.recipient)));
  if (emails.length === 0) return { error: null, retried: 0, sent: 0, failed: 0 };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";
  const report = await sendCredentialEmails(emails, { admin, appUrl, sendEmail: sendResendEmail, sentBy: profile.id });

  revalidatePath("/admin/emails");
  return { error: null, retried: emails.length, sent: report.sent, failed: report.failed };
}
