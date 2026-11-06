import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { sendResendEmail, logEmailSend } from "@/lib/auth/roster";
import { appUrl as liveAppUrl, cleanAppUrl } from "@/lib/app-url";
import { CUSTOM_SIGNATORY, linkedInAddToProfileUrl } from "./linkedin";

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
  // In preview/staging, gate email to the single approved test recipient and
  // FAIL CLOSED if it's unset — a misconfigured preview must never email a
  // real student. Production (VERCEL_ENV=production) sends normally.
  const isPreview = process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development";
  if (isPreview) {
    const allowed = process.env.ALLOWED_TEST_RECIPIENT;
    if (!allowed || input.email !== allowed) {
      console.warn(`notifyCredential: preview email gated (allowed=${allowed ?? "unset"}, to=${input.email})`);
      return;
    }
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

type CustomCertEmail = {
  /** Linked student (gets an in-app notice too), or null for someone without an account. */
  userId: string | null;
  email: string | null;
  name: string;
  title: string;
  credentialId: string;
  /** yyyy-mm-dd */
  issuedOn: string;
  paragraph: string | null;
  pdf: Buffer;
  sentBy: string | null;
};

/**
 * Custom certificate ("for anyone"): the PDF goes to the recipient as an
 * attachment with the verify link and a LinkedIn "Add to profile" link. A
 * linked student also gets the usual in-app notice. Sends only through
 * sendResendEmail, which applies the preview-site gate; logged to email_sends.
 */
export async function emailCustomCertificate(input: CustomCertEmail): Promise<{ sent: boolean; error: string | null }> {
  const admin = createAdminClient();
  const base = cleanAppUrl(process.env.NEXT_PUBLIC_SITE_URL, liveAppUrl());
  const verifyUrl = `${base}/verify/${input.credentialId}`;
  const subject = `Your certificate from VIBHA School of Psychology: ${input.title}`;

  if (input.userId) {
    await admin.from("notifications").insert({
      user_id: input.userId,
      type: "certificate",
      credential_id: input.credentialId,
      title: `Your certificate is ready: ${input.title}`,
      body: `You have been given a certificate: "${input.title}". View and share it from My Achievements.`,
      href: "/achievements",
    });
  }
  if (!input.email) return { sent: false, error: null };

  const addToLinkedIn = linkedInAddToProfileUrl({ title: input.title, issuedOn: input.issuedOn, verifyUrl, credentialId: input.credentialId });
  const text = [
    `Dear ${input.name},`,
    "",
    `Thank you. VIBHA School of Psychology has given you a certificate: "${input.title}".`,
    ...(input.paragraph ? ["", input.paragraph] : []),
    "",
    "Your certificate is attached to this email as a PDF.",
    `Anyone can check it is real here: ${verifyUrl}`,
    "",
    `Add it to your LinkedIn profile: ${addToLinkedIn}`,
    "",
    "Warmly,",
    `${CUSTOM_SIGNATORY.name}, ${CUSTOM_SIGNATORY.role}`,
    "VIBHA School of Psychology",
  ].join("\n");
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a;max-width:560px">
<p>Dear ${esc(input.name)},</p>
<p>Thank you. VIBHA School of Psychology has given you a certificate: <strong>${esc(input.title)}</strong>.</p>
${input.paragraph ? `<p>${esc(input.paragraph)}</p>` : ""}
<p>Your certificate is attached to this email as a PDF.</p>
<p><a href="${esc(addToLinkedIn)}" style="display:inline-block;padding:12px 18px;border:2px solid #1a1a1a;border-radius:6px;background:#f4a261;color:#1a1a1a;font-weight:bold;text-decoration:none">Add to LinkedIn profile</a></p>
<p>Anyone can check it is real here: <a href="${esc(verifyUrl)}">${esc(verifyUrl)}</a></p>
<p>Warmly,<br>${esc(CUSTOM_SIGNATORY.name)}, ${esc(CUSTOM_SIGNATORY.role)}<br>VIBHA School of Psychology</p>
</div>`;
  const filename = `VIBHA-certificate-${input.credentialId.slice(0, 8)}.pdf`;
  const res = await sendResendEmail(input.email, subject, text, html, [{ filename, content: input.pdf.toString("base64") }]);
  await logEmailSend(admin, {
    recipient: input.email,
    name: input.name,
    subject,
    templateId: "certificate",
    status: res.ok ? "sent" : "failed",
    errorReason: res.ok ? null : (res.error ?? "Resend send failed."),
    sentAt: res.ok ? new Date().toISOString() : null,
    sentBy: input.sentBy,
    providerId: res.id ?? null,
    bodyText: text,
  }).catch(() => {});
  return { sent: res.ok, error: res.ok ? null : (res.error ?? "Email failed.") };
}
