import { parse } from "csv-parse/sync";
import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Shared roster-provisioning logic. One source of truth for turning a list of
 * (name, email) into student accounts — used by both the admin server action
 * (`admin/students/bulk-import.ts`) and the CLI (`scripts/roster-import.ts`).
 *
 * Credential flow (2026-08-26, per Kavya): each student gets a simple 8-char
 * password (letters + digits only) generated at account creation. The password
 * is set on the auth user AND stored in plaintext on the `credential_invites`
 * row so the admin roster screen can show Kavya the whole list — she shares
 * each password with the student individually. Email (when used) carries the
 * password, never a link — the old password-recovery-link flow died because
 * Supabase Auth's redirect allowlist rejected our redirect target and every
 * invite landed on `redirect_to=localhost`.
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

  // `bom: true` strips a UTF-8 BOM — a leading BOM on the first header
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
 * Letters + digits only (no symbols — Kavya has to read these over the phone /
 * WhatsApp), excluding look-alike characters (0/O, 1/I/l) so nobody mistypes.
 */
const CREDENTIAL_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

/** Generate an 8-char student password (text + digits only). */
export function generateCredential(length = 8): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CREDENTIAL_ALPHABET[bytes[i] % CREDENTIAL_ALPHABET.length];
  }
  return out;
}

/** The plain-text credential email. `password` is the student's real password. */
export function credentialsEmailBody(name: string, email: string, password: string, appUrl: string): string {
  return `Hi ${name},

Your VIBHA School of Psychology account is ready.

  Email: ${email}
  Password: ${password}

Sign in at ${appUrl}/login

This password is yours alone — please don't share it. If you ever need it again, contact the programme.

— The VIBHA team`;
}

/**
 * The credential email as a ready-made HTML email (the "clean email format"
 * Kavya asked for in the email control center). Inline styles only — email
 * clients strip <style> blocks. Same facts as the text body; carries the
 * password, never a link.
 */
export function credentialsEmailHtml(name: string, email: string, password: string, appUrl: string): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const n = esc(name);
  const e = esc(email);
  const p = esc(password);
  const u = esc(appUrl);
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FFF9F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF9F0;"><tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td style="background:#ffffff;border:2px solid #1a1a1a;border-radius:10px;padding:32px;">
      <h1 style="margin:0 0 8px;font-size:20px;line-height:1.3;color:#1a1a1a;">Hi ${n},</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.5;color:#1a1a1a;">Your VIBHA School of Psychology account is ready. Sign in with the details below.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #1a1a1a;border-radius:6px;margin:0 0 20px;">
        <tr><td style="padding:12px 16px;font-size:12px;font-weight:700;letter-spacing:0.04em;color:#5c554a;text-transform:uppercase;">Email</td></tr>
        <tr><td style="padding:0 16px 14px;font-size:15px;color:#1a1a1a;">${e}</td></tr>
        <tr><td style="padding:12px 16px;border-top:2px solid #1a1a1a;font-size:12px;font-weight:700;letter-spacing:0.04em;color:#5c554a;text-transform:uppercase;">Password</td></tr>
        <tr><td style="padding:0 16px 14px;font-size:15px;font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700;color:#b83a00;">${p}</td></tr>
      </table>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.5;color:#1a1a1a;"><a href="${u}/login" style="color:#b83a00;font-weight:700;text-decoration:underline;">Sign in here</a></p>
      <p style="margin:0;font-size:13px;line-height:1.5;color:#5c554a;">This password is yours alone — please don't share it. If you ever need it again, contact the programme.</p>
      <p style="margin:16px 0 0;font-size:13px;color:#5c554a;">— The VIBHA team</p>
    </td></tr>
  </table>
</td></tr></table>
</body>
</html>`;
}

/**
 * Make sure the student has a stored credential: return the existing one, or
 * generate a fresh 8-char password, set it on the auth user, and persist it on
 * the `credential_invites` row. `forceNew` regenerates (used by Reset password).
 */
export async function ensureCredential(
  admin: SupabaseClient,
  email: string,
  forceNew = false,
): Promise<string | null> {
  const { data: invite } = await admin
    .from("credential_invites")
    .select("password")
    .eq("email", email)
    .maybeSingle();

  if (!forceNew && invite?.password) return invite.password as string;

  const password = generateCredential();
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (profile?.id) {
    const { error } = await admin.auth.admin.updateUserById(profile.id as string, { password });
    if (error) return null;
  }
  await admin.from("credential_invites").update({ password }).eq("email", email);
  return password;
}

export type ImportDeps = {
  admin: SupabaseClient;
  /** Profile scope to stamp on each created account (e.g. "lectures_only"). */
  scope: string;
  /** Report only — no account creation, no DB writes. */
  dryRun?: boolean;
};

/**
 * IMPORT step (no email). Creates the auth account, stamps the scope, and
 * records a `credential_invites` row in `pending` state. No email is sent here
 * — sending is a separate, explicit step so Kavya sees the full batch first.
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
    password: string;
    error_reason: null;
    sent_at: null;
  }> = [];

  for (const row of rows) {
    // The student's real 8-char password — set on the account here so it's
    // immediately valid, and stored so the admin roster list can show Kavya the
    // whole batch. The password is shared by Kavya, not emailed.
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
    pendingCredentials.push({ email: row.email, name: row.name, status: "pending", password, error_reason: null, sent_at: null });
  }

  // Stamp the access scope on every created profile in one call.
  if (pendingScopeIds.length) {
    const { error: scopeErr } = await admin.from("profiles").update({ scope }).in("id", pendingScopeIds);
    if (scopeErr) {
      report.failures.push({ row: 0, email: pendingCredentials.map((c) => c.email).join(","), reason: `profile scope update failed: ${scopeErr.message}` });
    }
  }

  // Record all pending credentials — password visible to admin, NOT sent yet.
  if (pendingCredentials.length) {
    const { error: credErr } = await admin.from("credential_invites").upsert(pendingCredentials, { onConflict: "email" });
    if (credErr) {
      report.failures.push({ row: 0, email: pendingCredentials.map((c) => c.email).join(","), reason: `credential record failed: ${credErr.message}` });
    }
  }

  for (const c of pendingCredentials) {
    report.created++;
    report.createdAccounts.push({ name: c.name, email: c.email, password: c.password });
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
 * SEND step. For each email, ensure a stored 8-char password exists (generate
 * + set on the auth user if a legacy row has none), email it to the student,
 * and update that row's status to `sent` (with sent_at) or `failed` (with
 * error_reason). Retries are per-row: only the emails passed in are touched.
 * The email carries the password, never a link.
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
    const { data: invite } = await admin
      .from("credential_invites")
      .select("name, password")
      .eq("email", email)
      .maybeSingle();
    const name = (invite?.name as string | undefined) ?? email;
    let password = (invite?.password as string | undefined) ?? null;

    if (!password) {
      password = await ensureCredential(admin, email);
      if (!password) {
        failed++;
        await admin
          .from("credential_invites")
          .update({ status: "failed", error_reason: "Could not set the student password." })
          .eq("email", email);
        results.push({ email, ok: false, reason: "Could not set the student password." });
        continue;
      }
    }

    // The ready-made HTML credential email — the text body is the fallback for
    // clients that can't render HTML.
    const subject = "Your VIBHA School of Psychology password";
    const res = await sendEmail(
      email,
      subject,
      credentialsEmailBody(name, email, password, appUrl),
      credentialsEmailHtml(name, email, password, appUrl),
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
};

/** Insert one email_sends row (the control center's unified history feed). */
export async function logEmailSend(admin: SupabaseClient, log: EmailSendLog): Promise<void> {
  await admin.from("email_sends").insert({
    recipient: log.recipient,
    name: log.name,
    subject: log.subject,
    template_id: log.templateId,
    status: log.status,
    error_reason: log.errorReason,
    sent_at: log.sentAt,
    sent_by: log.sentBy,
  });
}

/**
 * Reset one student's password: generate a fresh 8-char credential, set it on
 * the auth user, persist it, and return it (so the admin can share it again).
 */
export async function resetCredential(admin: SupabaseClient, email: string): Promise<string | null> {
  return ensureCredential(admin, email, true);
}

/**
 * The single Resend sender — the ONLY code path that talks to Resend, so the
 * real send and the test-email control can never drift apart. Reads the key
 * from the environment (never a fallback default key). Returns the real Resend
 * API result (id on success, message on failure).
 *
 * `body` is the plain-text fallback; `html` (optional) is the ready-made HTML
 * version — Resend gets both, so every client renders the right one.
 */
export async function sendResendEmail(to: string, subject: string, body: string, html?: string): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "VIBHA School of Psychology <noreply@vibhaschoolofpsychology.in>";
  if (!key) return { ok: false, error: "RESEND_API_KEY is not configured." };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text: body, ...(html ? { html } : {}) }),
    });
    const j = (await res.json().catch(() => null)) as { id?: string; message?: string } | null;
    if (!res.ok) return { ok: false, error: j?.message ?? `Resend returned HTTP ${res.status}` };
    return { ok: true, id: j?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error reaching Resend." };
  }
}
