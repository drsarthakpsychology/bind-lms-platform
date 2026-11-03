import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { logEmailSend, sendResendEmail } from "@/lib/auth/roster";
import { isNudgeable, personalise } from "./select";

export type NudgeRecipient = { id: string; name: string; email: string };
export type NudgeReport = {
  sent: number;
  sentIds: string[];
  failed: Array<{ id: string; name: string; reason: string }>;
  skipped: number;
  notConfigured: boolean;
};

const CONCURRENCY = 5;

export const emailConfigured = () => Boolean(process.env.RESEND_API_KEY);

/**
 * Look the students up on the server from their ids (never trust emails from
 * the browser). Blocked, test, robot and non-student accounts are dropped.
 */
export async function recipientsFor(userIds: string[]): Promise<{ recipients: NudgeRecipient[]; skipped: number }> {
  const ids = [...new Set(userIds)];
  if (!ids.length) return { recipients: [], skipped: 0 };
  const admin = createAdminClient();
  const { data } = await admin.from("profiles").select("id, name, email, status, role, is_test").in("id", ids);
  const recipients = (data ?? [])
    .filter((p) => isNudgeable({ email: p.email as string | null ?? "", status: p.status as string | null, role: p.role as string | null, isTest: p.is_test as boolean | null }))
    .map((p) => ({ id: p.id as string, name: String(p.name ?? "").trim() || String(p.email).split("@")[0], email: String(p.email) }));
  return { recipients, skipped: ids.length - recipients.length };
}

/**
 * One email per student (never a shared To/CC), a few at a time, each logged
 * to email_sends so it shows in Mail › Sent. Sends nothing when Resend isn't
 * set up and says so.
 */
export async function sendNudges(
  recipients: NudgeRecipient[],
  draft: { subject: string; message: string },
  sentBy: string | null,
): Promise<Omit<NudgeReport, "skipped">> {
  if (!emailConfigured()) return { sent: 0, sentIds: [], failed: [], notConfigured: true };
  const admin = createAdminClient();
  const sentIds: string[] = [];
  const failed: NudgeReport["failed"] = [];
  let next = 0;

  async function worker() {
    while (next < recipients.length) {
      const r = recipients[next++];
      const subject = personalise(draft.subject, r.name);
      const text = personalise(draft.message, r.name);
      const res = await sendResendEmail(r.email, subject, text);
      await logEmailSend(admin, {
        recipient: r.email,
        name: r.name,
        subject,
        templateId: "nudge",
        status: res.ok ? "sent" : "failed",
        errorReason: res.ok ? null : (res.error ?? "Resend send failed."),
        sentAt: res.ok ? new Date().toISOString() : null,
        sentBy,
        providerId: res.id ?? null,
        bodyText: text,
      }).catch(() => {});
      if (res.ok) sentIds.push(r.id);
      else failed.push({ id: r.id, name: r.name, reason: res.error ?? "Send failed." });
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, recipients.length) }, worker));
  return { sent: sentIds.length, sentIds, failed, notConfigured: false };
}
