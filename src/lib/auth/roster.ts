import { parse } from "csv-parse/sync";
import { createHash, randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createPacer } from "@/lib/email/pace";

/**
 * Shared roster-provisioning logic. One source of truth for turning a list of
 * (name, email) into student accounts: used by both the admin server action
 * (`admin/students/bulk-import.ts`) and the CLI (`scripts/roster-import.ts`).
 *
 * Credential flow (2026-11, security rebuild): no password is ever generated
 * for a student to read, stored in plain text, shown to an admin or emailed.
 * Each account gets an unguessable throwaway password nobody knows, and the
 * student sets their own through a one-time setup link (`/setup?t=…`). The
 * link is our own token (hashed in `account_setup_tokens`, 72 h, single use),
 * not Supabase's recovery link, which died on the redirect allowlist before.
 * Admins can email the link or copy it to share on WhatsApp; making a new one
 * cancels the old one.
 */

export type RosterRow = { name: string; email: string };
export type RosterFailure = { row: number; email: string; reason: string };
export type RosterCreated = { name: string; email: string; password: string | null };

export type RosterReport = {
  rowsRead: number;
  created: number;
  duplicatesSkipped: number;
  invalidSkipped: number;
  emailsSent: number;
  emailsFailed: number;
  failures: RosterFailure[];
  createdAccounts: RosterCreated[];
  emptyNames: string[];
};

export type RosterParse = {
  rows: RosterRow[];
  duplicates: RosterFailure[];
  invalid: RosterFailure[];
  emptyNames: string[];
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Derive a display name from an email's local part ("jane.doe" -> "Jane Doe"). */
export function deriveName(email: string): string {
  const local = email.split("@")[0] ?? "";
  const words = local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  return words.join(" ") || email;
}

/**
 * Resolve a header field by name, case-insensitively, from a set of aliases.
 * This is the fix for the roster mis-read: the source sheet put the name in a
 * shifted column (and later exports use "Full Name" vs "name" vs "Name"), so
 * positional column reads misread it. Header-based lookup (not index) means
 * the name + email are found wherever they actually live, and extra columns
 * (phone, city, payment, timestamp …) are ignored.
 */
function headerField(row: Record<string, string>, aliases: string[]): string {
  const lower = aliases.map((a) => a.toLowerCase());
  for (const key of Object.keys(row)) {
    if (lower.includes(key.toLowerCase())) {
      return row[key] ?? "";
    }
  }
  return "";
}

/**
 * Parse a name,email CSV into rows, deduplicating by email (keep the first
 * occurrence; later dupes are logged). Empty/malformed emails are skipped with
 * a row number and reason. `rowOffset` is the 1-based row number of the first
 * data row in the original sheet (2 for a header row).
 */
export function parseRosterCsv(text: string, rowOffset = 2): RosterParse {
  const rows: RosterRow[] = [];
  const duplicates: RosterFailure[] = [];
  const invalid: RosterFailure[] = [];
  const emptyNames: string[] = [];
  const seen = new Set<string>();

  // `bom: true` strips a UTF-8 BOM: a leading BOM on the first header
  // otherwise turns `name` into `﻿name`, silently dropping every name.
  const parsed = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as Record<string, string>[];

  for (const [i, row] of parsed.entries()) {
    const rowNo = i + rowOffset;
    const email = headerField(row, ["email", "email address"]).trim().toLowerCase();
    const name = headerField(row, ["name", "full name"]).trim();

    if (!email || !EMAIL_RE.test(email)) {
      invalid.push({ row: rowNo, email: email || "(blank)", reason: "invalid email" });
      continue;
    }
    if (seen.has(email)) {
      duplicates.push({ row: rowNo, email, reason: "duplicate email" });
      continue;
    }
    seen.add(email);
    if (!name) emptyNames.push(email);
    rows.push({ name: name || deriveName(email), email });
  }

  return { rows, duplicates, invalid, emptyNames };
}

/**
 * Letters + digits only (no symbols, Kavya has to read these over the phone /
 * WhatsApp), excluding look-alike characters (0/O, 1/I/l) so nobody mistypes.
 */
/**
 * An unguessable throwaway password for a brand-new account. Nobody is ever
 * told it, the student replaces it from their setup link, it only exists
 * because the auth API wants the account to have one.
 */
export function generateCredential(): string {
  return randomBytes(32).toString("base64url");
}

const SETUP_TTL_MS = 72 * 60 * 60 * 1000;

/** sha256 of a setup token, only the hash is ever stored. */
export function hashSetupToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Issue a fresh one-time setup link for a student (cancelling any earlier
 * unused link). Returns the full URL, or null if the student has no account.
 */
export async function issueSetupLink(
  admin: SupabaseClient,
  email: string,
  appUrl: string,
  createdBy: string | null = null,
): Promise<string | null> {
  const { data: profile } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
  if (!profile?.id) return null;
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  await admin
    .from("account_setup_tokens")
    .update({ revoked_at: now.toISOString() })
    .eq("user_id", profile.id)
    .is("used_at", null)
    .is("revoked_at", null);
  const { error } = await admin.from("account_setup_tokens").insert({
    user_id: profile.id,
    email,
    token_hash: hashSetupToken(token),
    expires_at: new Date(now.getTime() + SETUP_TTL_MS).toISOString(),
    created_by: createdBy,
  });
  if (error) return null;
  return `${appUrl.replace(/\/$/, "")}/setup?t=${token}`;
}

/** The plain-text setup email. Carries a one-time link, never a password. */
export function credentialsEmailBody(name: string, email: string, setupUrl: string, appUrl: string): string {
  return `Hi ${name},

Your VIBHA School of Psychology account is ready.

Set your password here (the link works once and expires in 3 days):
${setupUrl}

Then sign in at ${appUrl}/login with ${email}.

If the link has expired, reply to this email and we'll send a new one.

The VIBHA team`;
}

/**
 * The setup email as ready-made HTML (inline styles only, email clients strip
 * <style> blocks). Brand colours: blue #1d44d8, lime #cdf24b, ink #111111.
 */
export function credentialsEmailHtml(name: string, email: string, setupUrl: string, appUrl: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const n = esc(name);
  const e = esc(email);
  const l = esc(setupUrl);
  const u = esc(appUrl);
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;"><tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:#1d44d8;border:2px solid #111111;border-bottom:0;border-radius:14px 14px 0 0;padding:18px 28px;font-size:20px;font-weight:900;color:#cdf24b;">VIBHA</td></tr>
    <tr><td style="background:#ffffff;border:2px solid #111111;border-radius:0 0 14px 14px;padding:28px;">
      <h1 style="margin:0 0 8px;font-size:20px;line-height:1.3;color:#111111;">Hi ${n},</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.5;color:#111111;">Your VIBHA School of Psychology account is ready. Set your own password to get started.</p>
      <p style="margin:0 0 20px;"><a href="${l}" style="display:inline-block;background:#cdf24b;color:#111111;border:2px solid #111111;border-radius:999px;padding:12px 24px;font-size:15px;font-weight:800;text-decoration:none;">Set my password</a></p>
      <p style="margin:0 0 6px;font-size:13px;line-height:1.5;color:#4d4d4d;">The link works once and expires in 3 days. Then sign in at <a href="${u}/login" style="color:#1d44d8;font-weight:700;">${u}/login</a> with ${e}.</p>
      <p style="margin:0;font-size:13px;line-height:1.5;color:#4d4d4d;">If the button doesn't work, copy this link: ${l}</p>
      <p style="margin:16px 0 0;font-size:13px;color:#4d4d4d;">The VIBHA team</p>
    </td></tr>
  </table>
</td></tr></table>
</body>
</html>`;
}

export type ImportDeps = {
  admin: SupabaseClient;
  /** Profile scope to stamp on each created account (e.g. "lectures_only"). */
  scope: string;
  /** Report only, no account creation, no DB writes. */
  dryRun?: boolean;
};

/**
 * IMPORT step (no email). Creates the auth account, stamps the scope, and
 * records a `credential_invites` row in `pending` state. No email is sent here
 *: sending is a separate, explicit step so Kavya sees the full batch first.
 * Idempotent: an email that already has an auth user is skipped (duplicate).
 */
export async function importRoster(rows: RosterRow[], deps: ImportDeps): Promise<RosterReport> {
  const { admin, scope, dryRun } = deps;
  const report: RosterReport = {
    rowsRead: rows.length,
    created: 0,
    duplicatesSkipped: 0,
    invalidSkipped: 0,
    emailsSent: 0,
    emailsFailed: 0,
    failures: [],
    createdAccounts: [],
    emptyNames: [],
  };

  // Batch the two DB writes (Perf Pass Part 8): the GoTrue createUser loop is
  // unavoidable (no batch endpoint), but the profiles-scope + credential rows
  // are written as ONE upsert each instead of two round-trips per student.
  const pendingScopeIds: string[] = [];
  const pendingCredentials: Array<{
    email: string;
    name: string;
    status: "pending";
    error_reason: null;
    sent_at: null;
  }> = [];

  for (const row of rows) {
    // A throwaway password nobody is told; the student sets their own from
    // the setup link. Never stored.
    const password = generateCredential();

    if (dryRun) {
      report.created++;
      report.createdAccounts.push({ name: row.name, email: row.email, password: null });
      continue;
    }

    const { data: created, error } = await admin.auth.admin.createUser({
      email: row.email,
      password,
      email_confirm: true,
      user_metadata: { name: row.name },
    });

    // A duplicate email surfaces as an auth error mentioning it already exists.
    if (error) {
      if (/already|registered|exist/i.test(error.message)) {
        report.duplicatesSkipped++;
      } else {
        report.failures.push({ row: 0, email: row.email, reason: error.message });
      }
      continue;
    }

    const userId = created?.user?.id;
    if (!userId) {
      report.failures.push({ row: 0, email: row.email, reason: "create returned no user" });
      continue;
    }

    pendingScopeIds.push(userId);
    pendingCredentials.push({ email: row.email, name: row.name, status: "pending", error_reason: null, sent_at: null });
  }

  // Stamp the access scope on every created profile in one call.
  if (pendingScopeIds.length) {
    const { error: scopeErr } = await admin.from("profiles").update({ scope }).in("id", pendingScopeIds);
    if (scopeErr) {
      report.failures.push({ row: 0, email: pendingCredentials.map((c) => c.email).join(","), reason: `profile scope update failed: ${scopeErr.message}` });
    }
  }

  // Record all pending invites, NOT sent yet.
  if (pendingCredentials.length) {
    const { error: credErr } = await admin.from("credential_invites").upsert(pendingCredentials, { onConflict: "email" });
    if (credErr) {
      report.failures.push({ row: 0, email: pendingCredentials.map((c) => c.email).join(","), reason: `credential record failed: ${credErr.message}` });
    }
  }

  for (const c of pendingCredentials) {
    report.created++;
    report.createdAccounts.push({ name: c.name, email: c.email, password: null });
  }

  return report;
}

export type SendResult = { ok: boolean; error?: string; id?: string };
export type SendEmailFn = (to: string, subject: string, body: string, html?: string) => Promise<SendResult>;

export type SendDeps = {
  admin: SupabaseClient;
  appUrl: string;
  /** Send the invite email via the real provider; returns success + any error/id. */
  sendEmail: SendEmailFn;
  /** Who is sending (for the email_sends history log). Defaults to null. */
  sentBy?: string | null;
};

/**
 * SEND step. For each email, issue a fresh one-time setup link, email it, and
 * update the invite row to `sent` (with sent_at) or `failed` (with
 * error_reason). Retries are per-row: only the emails passed in are touched.
 */
export async function sendCredentialEmails(
  emails: string[],
  deps: SendDeps,
): Promise<{ sent: number; failed: number; results: Array<{ email: string; ok: boolean; reason?: string }> }> {
  const { admin, appUrl, sendEmail, sentBy = null } = deps;
  const results: Array<{ email: string; ok: boolean; reason?: string }> = [];
  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    // Preview sites: don't make a new link (it would cancel the student's
    // current one) when the email isn't going to be sent.
    if (previewBlocks(email)) {
      failed++;
      results.push({ email, ok: false, reason: PREVIEW_GATE });
      continue;
    }
    const { data: invite } = await admin
      .from("credential_invites")
      .select("name")
      .eq("email", email)
      .maybeSingle();
    const name = (invite?.name as string | undefined) ?? email;
    const setupUrl = await issueSetupLink(admin, email, appUrl, sentBy);
    if (!setupUrl) {
      failed++;
      await admin
        .from("credential_invites")
        .update({ status: "failed", error_reason: "Could not make a setup link (no account for this email)." })
        .eq("email", email);
      results.push({ email, ok: false, reason: "Could not make a setup link." });
      continue;
    }

    // The ready-made HTML credential email: the text body is the fallback for
    // clients that can't render HTML.
    const subject = "Set up your VIBHA account";
    const res = await sendEmail(
      email,
      subject,
      credentialsEmailBody(name, email, setupUrl, appUrl),
      credentialsEmailHtml(name, email, setupUrl, appUrl),
    );

    // Every credential send also logs to email_sends so the control center's
    // "Sent" history is one unified feed (credentials + campaigns).
    await logEmailSend(admin, {
      recipient: email,
      name,
      subject,
      templateId: "credential",
      status: res.ok ? "sent" : "failed",
      errorReason: res.ok ? null : (res.error ?? "Resend send failed."),
      sentAt: res.ok ? new Date().toISOString() : null,
      sentBy,
      providerId: res.id ?? null,
    });

    if (res.ok) {
      sent++;
      await admin
        .from("credential_invites")
        .update({ status: "sent", sent_at: new Date().toISOString(), error_reason: null })
        .eq("email", email);
      results.push({ email, ok: true });
    } else {
      failed++;
      const reason = res.error ?? "Resend send failed.";
      await admin
        .from("credential_invites")
        .update({ status: "failed", error_reason: reason })
        .eq("email", email);
      results.push({ email, ok: false, reason });
    }
  }

  return { sent, failed, results };
}

type EmailSendLog = {
  recipient: string;
  name: string | null;
  subject: string;
  templateId: string;
  status: "sent" | "failed";
  errorReason: string | null;
  sentAt: string | null;
  sentBy: string | null;
  /** Resend's message id: lets delivery/open/bounce webhooks find the row. */
  providerId?: string | null;
  /** Plain-text copy for the Mail reading pane (setup emails: never stored, the link is secret). */
  bodyText?: string | null;
  /** HTML copy, so a failed email can be retried exactly (never for setup emails). */
  html?: string | null;
  /** When this row is a retry: the failed row it retries. */
  retryOf?: string | null;
};

/**
 * Insert one email_sends row (the control center's unified history feed).
 * Keeps the HTML copy and the retry link when the database has those columns
 * (2026_11_admin_redesign.sql); older databases get the basic row.
 */
export async function logEmailSend(admin: SupabaseClient, log: EmailSendLog): Promise<void> {
  // A preview site's skipped send isn't a failure: don't put it in Failed.
  if (log.errorReason === PREVIEW_GATE) return;
  const base = {
    recipient: log.recipient,
    name: log.name,
    subject: log.subject,
    template_id: log.templateId,
    status: log.status,
    error_reason: log.errorReason,
    sent_at: log.sentAt,
    sent_by: log.sentBy,
    provider_id: log.providerId ?? null,
    body_text: log.bodyText ?? null,
  };
  const extra: Record<string, unknown> = {};
  if (log.html) extra.html = log.html;
  if (log.retryOf) extra.retry_of = log.retryOf;
  if (Object.keys(extra).length) {
    const { error } = await admin.from("email_sends").insert({ ...base, ...extra });
    if (!error) return;
  }
  await admin.from("email_sends").insert(base);
}

/**
 * "Reset password" for one student: issue a fresh setup link (the old one and
 * any unused earlier link stop working). Returns the link so the admin can
 * copy it to WhatsApp, or null when the student has no account.
 */
export async function resetCredential(
  admin: SupabaseClient,
  email: string,
  appUrl: string,
  createdBy: string | null = null,
): Promise<string | null> {
  return issueSetupLink(admin, email, appUrl, createdBy);
}

/**
 * The single Resend sender: the ONLY code path that talks to Resend, so the
 * real send and the test-email control can never drift apart. Reads the key
 * from the environment (never a fallback default key). Returns the real Resend
 * API result (id on success, message on failure).
 *
 * `body` is the plain-text fallback; `html` (optional) is the ready-made HTML
 * version: Resend gets both, so every client renders the right one.
 */
// One pacer for the whole server instance: at most 4 sends a second, under
// the provider's 10/second limit (the cause of 41 failed sends in Nov 2026).
const paceSends = createPacer(250);

/** A file attached to an email (content is base64). */
export type EmailAttachment = { filename: string; content: string };

export async function sendResendEmail(to: string, subject: string, body: string, html?: string, attachments?: EmailAttachment[]): Promise<SendResult> {
  const first = await sendResendOnce(to, subject, body, html, attachments);
  // "Too many requests": wait a little over a second and try once more.
  if (!first.ok && /too many requests|rate limit/i.test(first.error ?? "")) {
    await new Promise((r) => setTimeout(r, 1200));
    return sendResendOnce(to, subject, body, html, attachments);
  }
  return first;
}

/** Marks a send that a preview site deliberately didn't make (never logged as a failure). */
export const PREVIEW_GATE = "Not sent: this is a preview site, so email only goes to the approved test address.";

/**
 * Preview and development sites may point at the live database, so they must never
 * email real students by accident. They send only to ALLOWED_TEST_RECIPIENT
 * (one or more addresses, comma-separated): the same rule the achievements
 * email already follows. Production sends normally.
 */
export function previewBlocks(to: string, env: Record<string, string | undefined> = process.env): boolean {
  if (env.VERCEL_ENV !== "preview" && env.VERCEL_ENV !== "development") return false;
  const allowed = (env.ALLOWED_TEST_RECIPIENT ?? "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  return !allowed.includes(to.trim().toLowerCase());
}

async function sendResendOnce(to: string, subject: string, body: string, html?: string, attachments?: EmailAttachment[]): Promise<SendResult> {
  if (previewBlocks(to)) return { ok: false, error: PREVIEW_GATE };
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "VIBHA School of Psychology <noreply@vibhaschoolofpsychology.in>";
  // Replies land in the admin Mail inbox through Resend inbound routing.
  const replyTo = process.env.RESEND_REPLY_TO;
  if (!key) return { ok: false, error: "RESEND_API_KEY is not configured." };
  await paceSends();
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text: body, ...(html ? { html } : {}), ...(attachments?.length ? { attachments } : {}), ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    const j = (await res.json().catch(() => null)) as { id?: string; message?: string } | null;
    if (!res.ok) return { ok: false, error: j?.message ?? `Resend returned HTTP ${res.status}` };
    return { ok: true, id: j?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error reaching Resend." };
  }
}
