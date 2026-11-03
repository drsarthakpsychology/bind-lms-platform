import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { sendResendEmail, logEmailSend } from "@/lib/auth/roster";
import { appUrl as liveAppUrl, cleanAppUrl } from "@/lib/app-url";

/**
 * Achievement + certificate notifications. In-app rows are written first (they
 * are the source of truth for the student feed); the email is best-effort and
 * logged to email_sends (status sent/failed) so a failed send never rolls back
 * a valid credential and can be retried from the admin mail log.
 */

type NotifyInput = {
  userId: string;
  email: string | null;
  name: string;
  type: "badge" | "certificate";
  title: string;
  credentialId: string;
  moduleName?: string;
};

function linkedInUrl(verifyUrl: string, text: string) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}&summary=${encodeURIComponent(text)}`;
}

export async function notifyCredential(input: NotifyInput): Promise<void> {
  const admin = createAdminClient();
  const base = cleanAppUrl(process.env.NEXT_PUBLIC_SITE_URL, liveAppUrl());
  const verifyUrl = `${base}/verify/${input.credentialId}`;

  const title = input.type === "badge" ? `You earned a badge: ${input.title}` : `Your certificate is ready: ${input.title}`;
  const body =
    input.type === "badge"
      ? `Congratulations — you've earned the "${input.title}" achievement${input.moduleName ? ` for ${input.moduleName}` : ""}. It's now on your My Achievements page.`
      : `Your certificate for "${input.title}" has been officially issued. View and share it from My Achievements.`;

  // In-app notification (source of truth; written even if email fails).
  await admin.from("notifications").insert({
    user_id: input.userId,
    type: input.type,
    credential_id: input.credentialId,
    title,
    body,
    href: "/achievements",
  });

  // Email — best-effort, logged, never blocks the credential.
  if (!input.email) return;
  // In staging/preview, restrict all email to the single approved test recipient
  // so a misconfiguration can never email a real student.
  const allowed = process.env.ALLOWED_TEST_RECIPIENT;
  if (allowed && input.email !== allowed) {
    console.warn(`notifyCredential: skipping email to ${input.email} (allowed test recipient: ${allowed})`);
    return;
  }
  const share = linkedInUrl(verifyUrl, `I'm happy to share that I completed "${input.title}" with VIBHA School of Psychology.`);
  const text = `${input.name},\n\n${title}.\n\n${body}\n\nView it here: ${base}/achievements\nVerify it here: ${verifyUrl}\n\nShare your accomplishment: ${share}\n\nWarmly,\nVIBHA School of Psychology`;
  const res = await sendResendEmail(input.email, title, text);
  await logEmailSend(admin, {
    recipient: input.email,
    name: input.name,
    subject: title,
    templateId: input.type === "badge" ? "achievement" : "certificate",
    status: res.ok ? "sent" : "failed",
    errorReason: res.ok ? null : (res.error ?? "Resend send failed."),
    sentAt: res.ok ? new Date().toISOString() : null,
    sentBy: null,
    providerId: res.id ?? null,
    bodyText: text,
  }).catch(() => {});
}
