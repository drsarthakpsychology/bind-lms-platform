import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { logEmailSend, sendResendEmail } from "@/lib/auth/roster";
import { htmlToPlain, richToEmailHtml, sanitizeRich } from "@/lib/email/rich-html";
import { isQuotaStop } from "@/lib/email/pace";
import { appUrl } from "@/lib/app-url";

export type NotifyInput = {
  userIds: string[];
  title: string;
  /** Formatted message (cleaned again here). */
  html: string;
  type?: "message" | "nudge";
  sentBy: string | null;
  /** Also send it as an email (the owner's choice each time). */
  alsoEmail?: boolean;
};

export type NotifyReport = {
  error: string | null;
  created: number;
  emailed: number;
  emailFailed: number;
  batchId: string | null;
  /** The database step hasn't been run yet. */
  needsDbStep?: boolean;
};

export const NOTIFY_DB_STEP = "Run the database step 2026_11_admin_redesign.sql first (Supabase → SQL Editor). Until then students can't receive typed notifications.";

/**
 * In-app notifications from the admin (and nudges). One row per student; the
 * student sees a bell count, opens it at /notifications/<id>, and it is
 * marked read when opened. Optional email copy goes through the one paced
 * email sender and shows in Messages → Sent.
 */
export async function sendNotifications(input: NotifyInput): Promise<NotifyReport> {
  const admin = createAdminClient();
  const title = input.title.trim().slice(0, 140);
  const clean = sanitizeRich(input.html);
  const text = htmlToPlain(clean);
  if (!title) return { error: "Add a title.", created: 0, emailed: 0, emailFailed: 0, batchId: null };
  if (!text) return { error: "Write the message.", created: 0, emailed: 0, emailFailed: 0, batchId: null };

  const { data: people } = await admin.from("profiles").select("id, email, name, status, is_test, role").in("id", [...new Set(input.userIds)].slice(0, 5000));
  const targets = (people ?? []).filter((p) => p.status !== "blocked");
  if (!targets.length) return { error: "Pick at least one student.", created: 0, emailed: 0, emailFailed: 0, batchId: null };

  const batchId = crypto.randomUUID();
  const rows = targets.map((p) => {
    const id = crypto.randomUUID();
    return {
      id,
      user_id: p.id as string,
      type: input.type ?? "message",
      credential_id: null,
      title,
      body: text.slice(0, 500),
      body_html: clean,
      href: `/notifications/${id}`,
      sent_by: input.sentBy,
      batch_id: batchId,
    };
  });
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await admin.from("notifications").insert(rows.slice(i, i + 500));
    if (error) {
      const dbStep = /violates check constraint|null value in column "credential_id"|column .* does not exist|body_html|batch_id|sent_by/i.test(error.message);
      return { error: dbStep ? NOTIFY_DB_STEP : error.message, created: i, emailed: 0, emailFailed: 0, batchId, needsDbStep: dbStep };
    }
  }

  let emailed = 0;
  let emailFailed = 0;
  if (input.alsoEmail && process.env.RESEND_API_KEY) {
    const site = appUrl();
    let stop = false;
    for (const p of targets) {
      const email = String(p.email ?? "");
      if (!email) continue;
      if (stop) {
        emailFailed++;
        continue;
      }
      const row = rows.find((r) => r.user_id === p.id)!;
      const link = `${site}${row.href}`;
      const html = richToEmailHtml(`<h2>${title.replace(/</g, "&lt;")}</h2>${clean}<p><a href="${link}">Open it on VIBHA</a></p>`, { preheader: text.slice(0, 120) });
      const res = await sendResendEmail(email, title, `${text}\n\nOpen it on VIBHA: ${link}`, html);
      await logEmailSend(admin, {
        recipient: email,
        name: (p.name as string | null) ?? null,
        subject: title,
        templateId: input.type === "nudge" ? "nudge" : "notification",
        status: res.ok ? "sent" : "failed",
        errorReason: res.ok ? null : (res.error ?? "Send failed."),
        sentAt: res.ok ? new Date().toISOString() : null,
        sentBy: input.sentBy,
        providerId: res.id ?? null,
        bodyText: text,
        html,
      });
      if (res.ok) emailed++;
      else {
        emailFailed++;
        if (isQuotaStop(res.error)) stop = true;
      }
    }
  }
  return { error: null, created: rows.length, emailed, emailFailed, batchId };
}

export type NotifyBatch = { batchId: string; title: string; sentAt: string; total: number; opened: number; type: string };

/** Recent notification sends with how many students opened them. */
export async function loadNotifyBatches(limit = 30): Promise<{ batches: NotifyBatch[]; ready: boolean }> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("notifications")
    .select("batch_id, title, type, created_at, read_at, opened_at")
    .not("batch_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(5000);
  if (error) return { batches: [], ready: false };
  const by = new Map<string, NotifyBatch>();
  for (const r of data ?? []) {
    const id = r.batch_id as string;
    const b = by.get(id) ?? { batchId: id, title: r.title as string, sentAt: r.created_at as string, total: 0, opened: 0, type: r.type as string };
    b.total++;
    if (r.opened_at || r.read_at) b.opened++;
    by.set(id, b);
  }
  return { batches: [...by.values()].slice(0, limit), ready: true };
}
