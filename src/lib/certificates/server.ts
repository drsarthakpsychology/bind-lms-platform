import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { appUrl as liveAppUrl, cleanAppUrl } from "@/lib/app-url";
import { logEmailSend, sendResendEmail } from "@/lib/auth/roster";
import { isQuotaStop } from "@/lib/email/pace";
import { CUSTOM_SIGNATORY } from "@/lib/achievements/linkedin";
import { getObjectBufferR2 } from "@/lib/media/r2";
import { credentialDownloadUrl } from "@/lib/achievements/storage";
import { type CertKind, isCertKind, istDay, longDate } from "./kinds";
import { layoutCertificate, type CertificateDoc, type Signatory } from "./layout";
import { renderCertificatePdf } from "./pdf";
import { dailyEmailLimit, planEmails, startOfEmailDay, type EmailTarget } from "./email-plan";

/**
 * Server side of the certificate studio: reading a certificate record back
 * into the shared layout, rendering its PDF, the in-app notice and the email
 * (with the daily limit and the queue). Everything degrades quietly while
 * 2026_11_14_certificate_studio.sql is not yet pasted.
 */

export const STUDIO_DB_STEP = "Paste the database step 2026_11_14_certificate_studio.sql (Supabase, SQL Editor) to turn this on.";

export const LEGACY_COLS = "id, credential_id, user_id, type, status, reason, student_name, issued_at, revoked_at, revoke_reason, recipient_email, pdf_storage_path, created_at, achievement_id, achievements(title, description, requirements)";
export const STUDIO_COLS = `${LEGACY_COLS}, kind, title, wording, expires_at, signatories, course_label, module_label, cohort_id, batch_id, replaces, replaced_by, email_status`;

/** What the studio keeps on the certificate type so a certificate can be redrawn before the database step is pasted. */
export type StudioMeta = { kind?: string; wording?: { heading?: string; lead?: string; connector?: string }; signatories?: Array<{ name: string; role: string; signatureFrom?: string | null }>; course_label?: string; module_label?: string };
type AchievementJoin = { title?: string; description?: string | null; requirements?: { studio?: StudioMeta } | null };

export type CredentialRecord = {
  id: string;
  credential_id: string;
  user_id: string | null;
  type: string;
  status: string;
  reason: string | null;
  student_name: string;
  issued_at: string | null;
  revoked_at: string | null;
  revoke_reason: string | null;
  recipient_email: string | null;
  pdf_storage_path: string | null;
  created_at: string;
  achievement_id: string | null;
  achievements: AchievementJoin | AchievementJoin[] | null;
  kind?: string | null;
  title?: string | null;
  wording?: { heading?: string; lead?: string; connector?: string } | null;
  expires_at?: string | null;
  signatories?: Array<{ name: string; role: string; signatureFrom?: string | null }> | null;
  course_label?: string | null;
  module_label?: string | null;
  cohort_id?: string | null;
  batch_id?: string | null;
  replaces?: string | null;
  replaced_by?: string | null;
  email_status?: string | null;
};

export const siteBase = () => cleanAppUrl(process.env.NEXT_PUBLIC_SITE_URL, liveAppUrl());
export const verifyUrlFor = (id: string) => `${siteBase()}/verify/${encodeURIComponent(id)}`;

/** True once the studio columns exist. */
export async function studioReady(admin: SupabaseClient): Promise<boolean> {
  const { error } = await admin.from("credentials").select("kind, expires_at, signatories, wording").limit(1);
  return !error;
}

export async function queueReady(admin: SupabaseClient): Promise<boolean> {
  const { error } = await admin.from("certificate_email_queue").select("id").limit(1);
  return !error;
}

/** One credential by its public id, with the studio columns when they exist. */
export async function loadCredential(admin: SupabaseClient, credentialId: string): Promise<CredentialRecord | null> {
  const a = await admin.from("credentials").select(STUDIO_COLS).eq("credential_id", credentialId).maybeSingle();
  if (!a.error) return (a.data as unknown as CredentialRecord) ?? null;
  const b = await admin.from("credentials").select(LEGACY_COLS).eq("credential_id", credentialId).maybeSingle();
  return (b.data as unknown as CredentialRecord) ?? null;
}

const one = <T,>(x: T | T[] | null | undefined): T | null => (Array.isArray(x) ? (x[0] ?? null) : (x ?? null));

export function recordTitle(r: Pick<CredentialRecord, "title" | "achievements">): string {
  return r.title || one(r.achievements)?.title || "Certificate";
}

/** Studio details kept on the certificate type (the fallback before the database step). */
export function studioMeta(r: Pick<CredentialRecord, "achievements">): StudioMeta | null {
  return one(r.achievements)?.requirements?.studio ?? null;
}

export function recordKind(r: Pick<CredentialRecord, "kind" | "achievements">): CertKind {
  if (isCertKind(r.kind)) return r.kind;
  const k = studioMeta(r)?.kind;
  return isCertKind(k) ? k : "completion";
}

/** True for certificates made in the studio (drawn in the new design from the record). */
export function isStudioRecord(r: Pick<CredentialRecord, "kind" | "achievements">): boolean {
  return isCertKind(r.kind) || isCertKind(studioMeta(r)?.kind);
}

export function recordSignatories(r: Pick<CredentialRecord, "signatories" | "achievements">): Array<{ name: string; role: string; signatureFrom?: string | null }> {
  if (r.signatories?.length) return r.signatories;
  const m = studioMeta(r)?.signatories;
  return m?.length ? m : [CUSTOM_SIGNATORY];
}

/** A stored certificate as the layout engine's input. Older rows get the default wording. */
export function docFromRecord(r: CredentialRecord): CertificateDoc {
  const kind = recordKind(r);
  const meta = studioMeta(r);
  const w = { ...(meta?.wording ?? {}), ...(r.wording ?? {}) };
  const sigs: Signatory[] = recordSignatories(r).map((s, i) => ({ name: s.name, role: s.role, signature: s.signatureFrom ? `sig${i}` : null }));
  return {
    kind,
    heading: w.heading || null,
    lead: w.lead || null,
    connector: w.connector || null,
    recipientName: r.student_name,
    title: recordTitle(r),
    citation: r.reason,
    course: r.course_label ?? meta?.course_label ?? null,
    module: r.module_label ?? meta?.module_label ?? null,
    issuedOn: istDay(r.issued_at ?? r.created_at),
    expiresOn: r.expires_at ? istDay(r.expires_at) : null,
    signatories: sigs,
    credentialId: r.credential_id,
    verifyUrl: verifyUrlFor(r.credential_id),
  };
}

/** Saved signature images (PNG bytes), keyed sig0..sig2 to match docFromRecord. */
export async function signatureBytes(admin: SupabaseClient, signatories: Array<{ signatureFrom?: string | null }>): Promise<Record<string, Buffer | null>> {
  const out: Record<string, Buffer | null> = {};
  const ids = signatories.map((s) => s.signatureFrom).filter((x): x is string => Boolean(x));
  if (!ids.length) return out;
  const { data } = await admin.from("achievements").select("id, signature_asset_path").in("id", ids);
  const paths = new Map((data ?? []).map((a) => [a.id as string, a.signature_asset_path as string | null]));
  await Promise.all(
    signatories.map(async (s, i) => {
      const p = s.signatureFrom ? paths.get(s.signatureFrom) : null;
      out[`sig${i}`] = p ? await getObjectBufferR2(process.env.R2_BUCKET_NAME ?? "", p).catch(() => null) : null;
    }),
  );
  return out;
}

/** Signed links to saved signatures for the on-screen preview, keyed by achievement id. */
export async function signatureOptions(admin: SupabaseClient): Promise<Array<{ id: string; label: string; url: string | null }>> {
  const { data, error } = await admin.from("achievements").select("id, title, signature_label, signature_asset_path").not("signature_asset_path", "is", null).limit(30);
  if (error || !data) return [];
  return Promise.all(
    data.map(async (s) => ({
      id: s.id as string,
      label: (s.signature_label as string | null) || `Signature saved on "${s.title}"`,
      url: await credentialDownloadUrl(s.signature_asset_path as string, 60 * 60).catch(() => null),
    })),
  );
}

/** Signed links to the signature images of one certificate, keyed sig0..sig2 (for the on-screen drawing). */
export async function signatureUrls(admin: SupabaseClient, signatories: Array<{ signatureFrom?: string | null }>): Promise<Record<string, string | null>> {
  const out: Record<string, string | null> = {};
  const ids = signatories.map((s) => s.signatureFrom).filter((x): x is string => Boolean(x));
  if (!ids.length) return out;
  const { data } = await admin.from("achievements").select("id, signature_asset_path").in("id", ids);
  const paths = new Map((data ?? []).map((a) => [a.id as string, a.signature_asset_path as string | null]));
  await Promise.all(
    signatories.map(async (s, i) => {
      const p = s.signatureFrom ? paths.get(s.signatureFrom) : null;
      out[`sig${i}`] = p ? await credentialDownloadUrl(p, 60 * 60).catch(() => null) : null;
    }),
  );
  return out;
}

/** Render the PDF of a stored certificate (always from the record, so it is never stale). */
export async function pdfForRecord(admin: SupabaseClient, r: CredentialRecord): Promise<Buffer> {
  const doc = docFromRecord(r);
  const images = await signatureBytes(admin, recordSignatories(r));
  return renderCertificatePdf(layoutCertificate(doc), images, { subject: `Verify at ${doc.verifyUrl}` });
}

/** The notice in the student's bell, linking straight to the certificate. */
export async function notifyCertificate(admin: SupabaseClient, input: { userId: string; credentialId: string; title: string; kind: CertKind; sentBy: string | null; batchId?: string | null; again?: boolean }): Promise<boolean> {
  const label = input.kind === "provisional" ? "provisional certificate" : input.kind === "recognition" ? "special recognition" : "certificate";
  const row = {
    user_id: input.userId,
    type: "certificate",
    credential_id: input.credentialId,
    title: input.again ? `Your ${label}: ${input.title}` : `You have a new ${label}: ${input.title}`,
    body: `Open it to view, download or share. Anyone can check it at the verify link.`,
    href: `/achievements/${encodeURIComponent(input.credentialId)}`,
  };
  const withSender = await admin.from("notifications").insert({ ...row, sent_by: input.sentBy, batch_id: input.batchId ?? null });
  if (!withSender.error) return true;
  const plain = await admin.from("notifications").insert(row);
  return !plain.error;
}

/** Emails sent since the provider's day began (sent or delivered). */
export async function emailsSentToday(admin: SupabaseClient, now = new Date()): Promise<number> {
  const { count } = await admin
    .from("email_sends")
    .select("id", { count: "exact", head: true })
    .in("status", ["sent", "delivered"])
    .gte("created_at", startOfEmailDay(now));
  return count ?? 0;
}

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

type MailInfo = { title: string; kind: CertKind; expiresOn: string | null };

/** Compose and send one certificate email (the link, never an attachment). */
export async function sendCertificateEmail(admin: SupabaseClient, t: EmailTarget, info: MailInfo, sentBy: string | null): Promise<{ ok: boolean; error: string | null }> {
  if (!t.email) return { ok: false, error: "No email address." };
  const base = siteBase();
  const view = `${base}/achievements/${encodeURIComponent(t.credentialId)}`;
  const verify = verifyUrlFor(t.credentialId);
  const label = info.kind === "provisional" ? "provisional certificate" : info.kind === "recognition" ? "special recognition" : "certificate";
  const subject = `Your ${label} from VIBHA School of Psychology: ${info.title}`;
  const until = info.kind === "provisional" && info.expiresOn ? ` It is provisional and valid until ${longDate(info.expiresOn)}.` : "";
  const text = [
    `Dear ${t.name},`,
    "",
    `VIBHA School of Psychology has issued you a ${label}: "${info.title}".${until}`,
    "",
    `View, download or share it: ${view}`,
    `Anyone can check it is real here: ${verify}`,
    "",
    "Warmly,",
    "VIBHA School of Psychology",
  ].join("\n");
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#111111;max-width:560px">
<p>Dear ${esc(t.name)},</p>
<p>VIBHA School of Psychology has issued you a ${label}: <strong>${esc(info.title)}</strong>.${esc(until)}</p>
<p><a href="${esc(view)}" style="display:inline-block;padding:12px 18px;border:2px solid #111111;border-radius:10px;background:#cdf24b;color:#111111;font-weight:bold;text-decoration:none">View your certificate</a></p>
<p style="color:#4d4d4d">Anyone can check it is real here: <a href="${esc(verify)}" style="color:#1d44d8">${esc(verify)}</a></p>
<p>Warmly,<br>VIBHA School of Psychology</p>
</div>`;
  const res = await sendResendEmail(t.email, subject, text, html);
  await logEmailSend(admin, {
    recipient: t.email,
    name: t.name,
    subject,
    templateId: "certificate",
    status: res.ok ? "sent" : "failed",
    errorReason: res.ok ? null : (res.error ?? "Send failed."),
    sentAt: res.ok ? new Date().toISOString() : null,
    sentBy,
    providerId: res.id ?? null,
    bodyText: text,
    html,
  }).catch(() => {});
  return { ok: res.ok, error: res.ok ? null : (res.error ?? "Send failed.") };
}

export type DeliveryReport = {
  emailed: string[];
  queued: string[];
  failed: Array<{ name: string; reason: string }>;
  noEmail: string[];
  /** Email isn't set up on this server: in-app notices only. */
  emailOff: boolean;
  /** Queued emails could not be saved (database step missing): use Resend later. */
  queueMissing: boolean;
  remainingToday: number;
};

async function setEmailStatus(admin: SupabaseClient, credentialId: string, status: "sent" | "queued" | "failed" | "none") {
  await admin.from("credentials").update({ email_status: status }).eq("credential_id", credentialId);
}

/**
 * Email a batch of certificates: as many as today's limit allows, the rest go
 * into the queue (sent later from the Issued list, oldest first).
 */
export async function deliverEmails(admin: SupabaseClient, targets: EmailTarget[], info: Map<string, MailInfo>, sentBy: string | null): Promise<DeliveryReport> {
  const configured = emailConfigured();
  const plan = planEmails(targets, { configured, limit: dailyEmailLimit(), sentToday: configured ? await emailsSentToday(admin) : 0 });
  const report: DeliveryReport = { emailed: [], queued: [], failed: [], noEmail: plan.noEmail.map((t) => t.name), emailOff: !configured, queueMissing: false, remainingToday: plan.remaining };
  const toQueue = [...plan.queue];
  for (let i = 0; i < plan.send.length; i++) {
    const t = plan.send[i];
    const res = await sendCertificateEmail(admin, t, info.get(t.credentialId)!, sentBy);
    if (res.ok) {
      report.emailed.push(t.name);
      report.remainingToday--;
      await setEmailStatus(admin, t.credentialId, "sent");
    } else if (isQuotaStop(res.error)) {
      // The provider says the day is used up: everyone left waits in the queue.
      toQueue.unshift(...plan.send.slice(i));
      report.remainingToday = 0;
      break;
    } else {
      report.failed.push({ name: t.name, reason: res.error ?? "Send failed." });
      await setEmailStatus(admin, t.credentialId, "failed");
    }
  }
  if (toQueue.length) {
    const rows = toQueue.map((t) => ({ credential_id: t.credentialId, user_id: t.userId, recipient: t.email!, name: t.name, created_by: sentBy }));
    for (const row of rows) {
      const { error } = await admin.from("certificate_email_queue").insert(row);
      // Already waiting in the queue is fine; anything else means the queue table isn't there yet.
      if (error && !/duplicate|unique/i.test(error.message)) report.queueMissing = true;
    }
    for (const t of toQueue) {
      report.queued.push(t.name);
      await setEmailStatus(admin, t.credentialId, "queued");
    }
  }
  for (const t of plan.noEmail) if (configured) await setEmailStatus(admin, t.credentialId, "none");
  return report;
}

/** Send what is waiting in the queue, oldest first, up to today's limit. */
export async function drainEmailQueue(admin: SupabaseClient, sentBy: string | null): Promise<{ sent: number; left: number; error: string | null }> {
  if (!emailConfigured()) return { sent: 0, left: 0, error: "Email isn't set up on the server." };
  const { data, error } = await admin.from("certificate_email_queue").select("id, credential_id, user_id, recipient, name, attempts").eq("status", "queued").order("created_at").limit(500);
  if (error) return { sent: 0, left: 0, error: STUDIO_DB_STEP };
  const rows = data ?? [];
  let remaining = Math.max(0, dailyEmailLimit() - (await emailsSentToday(admin)));
  let sent = 0;
  for (const q of rows) {
    if (remaining <= 0) break;
    const r = await loadCredential(admin, q.credential_id as string);
    if (!r || r.status !== "issued" || r.revoked_at) {
      await admin.from("certificate_email_queue").update({ status: "cancelled" }).eq("id", q.id);
      continue;
    }
    const res = await sendCertificateEmail(
      admin,
      { credentialId: r.credential_id, email: q.recipient as string, name: (q.name as string) || r.student_name, userId: (q.user_id as string | null) ?? null },
      { title: recordTitle(r), kind: recordKind(r), expiresOn: r.expires_at ? istDay(r.expires_at) : null },
      sentBy,
    );
    if (res.ok) {
      sent++;
      remaining--;
      await admin.from("certificate_email_queue").update({ status: "sent", sent_at: new Date().toISOString(), attempts: (q.attempts as number) + 1 }).eq("id", q.id);
      await setEmailStatus(admin, r.credential_id, "sent");
    } else if (isQuotaStop(res.error)) {
      break;
    } else {
      await admin.from("certificate_email_queue").update({ status: "failed", last_error: res.error, attempts: (q.attempts as number) + 1 }).eq("id", q.id);
      await setEmailStatus(admin, r.credential_id, "failed");
    }
  }
  const { count } = await admin.from("certificate_email_queue").select("id", { count: "exact", head: true }).eq("status", "queued");
  return { sent, left: count ?? 0, error: null };
}
