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

export type ProvisionDeps = {
  admin: SupabaseClient;
  /** Profile scope to stamp on each created account (e.g. "lectures_only"). */
  scope: string;
  appUrl: string;
  /** Send the invite email. Return true on success. Omit to skip sending. */
  sendEmail?: (to: string, subject: string, body: string) => Promise<boolean>;
  /** Report only — no account creation, no email send. */
  dryRun?: boolean;
};

/**
 * Create accounts for every row. Idempotent: an email that already has an auth
 * user is skipped (duplicate), not re-created or re-emailed. One bad row never
 * stops the batch. In dry-run mode nothing is written or sent — the report is
 * what the real run would do.
 */
export async function provisionRoster(rows: RosterRow[], deps: ProvisionDeps): Promise<RosterReport> {
  const { admin, scope, appUrl, sendEmail, dryRun } = deps;
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
    // Throwaway password — never emailed, replaced by the recovery link.
    const password = randomBytes(24).toString("base64url");

    if (dryRun) {
      report.created++;
      report.createdAccounts.push({ name: row.name, email: row.email, inviteUrl: null });
      if (sendEmail) report.emailsSent++;
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

    const inviteUrl = await mintInviteLink(admin, row.email, appUrl);

    let sent = false;
    if (sendEmail && inviteUrl) {
      sent = await sendEmail(row.email, "Set your VIBHA password", inviteEmailBody(row.name, row.email, inviteUrl));
      if (sent) report.emailsSent++;
      else report.emailsFailed++;
    } else if (sendEmail && !inviteUrl) {
      report.emailsFailed++;
    }

    report.created++;
    report.createdAccounts.push({ name: row.name, email: row.email, inviteUrl });
  }

  return report;
}
