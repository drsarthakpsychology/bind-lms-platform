import { parse } from "csv-parse/sync";
import { randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Shared roster-provisioning logic. One source of truth for turning a list of
 * (name, email) into student accounts — used by both the admin server action
 * (`admin/students/bulk-import.ts`) and the CLI (`scripts/roster-import.ts`).
 *
 * Invite flow: create the auth user with a random throwaway password (never
 * emailed), set the profile's scope, mint a password-recovery link (the user
 * sets their own password by clicking it), and send THAT link — never a
 * plaintext password. If auth later moves to native invite tokens, only
 * `mintInviteLink` changes.
 */

export type RosterRow = { name: string; email: string };
export type RosterFailure = { row: number; email: string; reason: string };
export type RosterCreated = { name: string; email: string; inviteUrl: string | null };

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

/** The plain-text invite email. `url` is the set-your-password link. */
export function inviteEmailBody(name: string, email: string, url: string): string {
  return `Hi ${name},

Your VIBHA School of Psychology account is ready.

  Email: ${email}

Set your password (this link is just for you, and it expires):
${url}

Once you've set a password, sign in and your lectures will be waiting.

— The VIBHA team`;
}

/** Mint a set-your-password link for an existing auth user. */
async function mintInviteLink(
  admin: SupabaseClient,
  email: string,
  appUrl: string,
): Promise<string | null> {
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${appUrl}/today` },
  });
  if (error || !data?.properties?.action_link) return null;
  return data.properties.action_link;
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

  for (const row of rows) {
    // Throwaway password — never emailed, replaced by the recovery link at send.
    const password = randomBytes(24).toString("base64url");

    if (dryRun) {
      report.created++;
      report.createdAccounts.push({ name: row.name, email: row.email, inviteUrl: null });
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

    // Stamp the access scope on the profile (created by on_auth_user_created).
    await admin.from("profiles").update({ scope }).eq("id", userId);

    // Record the pending credential email — NOT sent yet.
    await admin.from("credential_invites").upsert(
      { email: row.email, name: row.name, status: "pending", error_reason: null, sent_at: null },
      { onConflict: "email" },
    );

    report.created++;
    report.createdAccounts.push({ name: row.name, email: row.email, inviteUrl: null });
  }

  return report;
}

export type SendResult = { ok: boolean; error?: string; id?: string };
export type SendEmailFn = (to: string, subject: string, body: string) => Promise<SendResult>;

export type SendDeps = {
  admin: SupabaseClient;
  appUrl: string;
  /** Send the invite email via the real provider; returns success + any error/id. */
  sendEmail: SendEmailFn;
};

/**
 * SEND step. For each email, mint a FRESH set-your-password link (never stored,
 * so it can't expire between import and send), send it, and update that row's
 * status to `sent` (with sent_at) or `failed` (with error_reason). Retries are
 * per-row: only the emails passed in are touched.
 */
export async function sendCredentialEmails(
  emails: string[],
  deps: SendDeps,
): Promise<{ sent: number; failed: number; results: Array<{ email: string; ok: boolean; reason?: string }> }> {
  const { admin, appUrl, sendEmail } = deps;
  const results: Array<{ email: string; ok: boolean; reason?: string }> = [];
  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    const { data: invite } = await admin
      .from("credential_invites")
      .select("name")
      .eq("email", email)
      .maybeSingle();
    const name = (invite?.name as string | undefined) ?? email;

    const url = await mintInviteLink(admin, email, appUrl);
    if (!url) {
      failed++;
      await admin
        .from("credential_invites")
        .update({ status: "failed", error_reason: "Could not mint the set-password link." })
        .eq("email", email);
      results.push({ email, ok: false, reason: "Could not mint the set-password link." });
      continue;
    }

    const res = await sendEmail(email, "Set your VIBHA password", inviteEmailBody(name, email, url));
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

/**
 * The single Resend sender — the ONLY code path that talks to Resend, so the
 * real send and the test-email control can never drift apart. Reads the key
 * from the environment (never a fallback default key). Returns the real Resend
 * API result (id on success, message on failure).
 */
export async function sendResendEmail(to: string, subject: string, body: string): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "VIBHA School of Psychology <noreply@vibhaschoolofpsychology.in>";
  if (!key) return { ok: false, error: "RESEND_API_KEY is not configured." };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text: body }),
    });
    const j = (await res.json().catch(() => null)) as { id?: string; message?: string } | null;
    if (!res.ok) return { ok: false, error: j?.message ?? `Resend returned HTTP ${res.status}` };
    return { ok: true, id: j?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error reaching Resend." };
  }
}
