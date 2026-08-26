"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import {
  parseRosterCsv,
  importRoster,
  sendCredentialEmails,
  sendResendEmail,
  credentialsEmailBody,
  generateCredential,
  resetCredential,
  type RosterFailure,
  type RosterReport,
} from "@/lib/auth/roster";

export type BulkImportResult = RosterReport & {
  error: string | null;
  success: boolean;
  failures: RosterFailure[];
};

const emptyImport = (error: string): BulkImportResult => ({
  error,
  success: false,
  rowsRead: 0,
  created: 0,
  duplicatesSkipped: 0,
  invalidSkipped: 0,
  emailsSent: 0,
  emailsFailed: 0,
  failures: [],
  createdAccounts: [],
  emptyNames: [],
});

/**
 * IMPORT step (no email). Parses a name,email CSV and creates the accounts with
 * the given scope, recording each as a `pending` credential email. Nothing is
 * emailed here — the admin reviews the batch and sends explicitly.
 */
export async function bulkImportStudents(
  _prevState: BulkImportResult,
  formData: FormData,
): Promise<BulkImportResult> {
  if (!(await requireAdmin())) return emptyImport("Not authorized.");

  const file = formData.get("file");
  if (!(file instanceof File)) return emptyImport("Upload a CSV file.");

  const text = await file.text();
  const scope = String(formData.get("scope") ?? "full").trim() || "full";
  const parsed = parseRosterCsv(text);

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      ...emptyImport("SUPABASE_SERVICE_ROLE_KEY isn't set in this deployment yet."),
      rowsRead: parsed.rows.length,
      failures: [...parsed.invalid, ...parsed.duplicates],
      invalidSkipped: parsed.invalid.length,
      duplicatesSkipped: parsed.duplicates.length,
      emptyNames: parsed.emptyNames,
    };
  }

  const report = await importRoster(parsed.rows, { admin, scope });

  revalidatePath("/admin/students");
  revalidatePath("/admin/roster");
  return {
    error: null,
    success: true,
    ...report,
    failures: [...parsed.invalid, ...parsed.duplicates, ...report.failures],
    invalidSkipped: parsed.invalid.length,
    duplicatesSkipped: parsed.duplicates.length + report.duplicatesSkipped,
  };
}

export type SendEmailsResult = {
  error: string | null;
  sent: number;
  failed: number;
  results: Array<{ email: string; ok: boolean; reason?: string }>;
};

/**
 * SEND step. Explicitly sends credential emails for the given addresses (a
 * subset or all pending). Each row's status is updated to sent/failed with the
 * reason, so retries are per-row. Uses the real Resend path.
 */
export async function sendCredentialEmailsAction(emails: string[]): Promise<SendEmailsResult> {
  if (!(await requireAdmin())) return { error: "Not authorized.", sent: 0, failed: 0, results: [] };

  const admin = createAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";
  const report = await sendCredentialEmails(emails, { admin, appUrl, sendEmail: sendResendEmail });

  revalidatePath("/admin/roster");
  return { error: null, ...report };
}

export type TestEmailResult = { error: string | null; ok: boolean; detail: string };

/**
 * SEND TEST EMAIL. Sends the real credential template (populated with a real
 * 8-char password) through the exact same Resend code path, with a "[TEST]"
 * subject prefix. Returns the actual Resend API result so a bad key or template
 * surfaces here first. Zero risk of reaching a real student (the recipient is
 * whatever the admin types, defaulting to their own address).
 */
export async function sendTestEmailAction(email: string): Promise<TestEmailResult> {
  if (!(await requireAdmin())) return { error: "Not authorized.", ok: false, detail: "" };

  const to = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return { error: "Enter a valid email address.", ok: false, detail: "" };
  }

  const admin = createAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";

  // 1. Create (or reuse) a dedicated test account for this address — same scope
  //    as a real roster account, so the test genuinely mirrors reality. Reuse
  //    the existing profile so repeated clicks don't pollute the accounts table.
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("email", to)
    .maybeSingle();

  let userId = existing?.id as string | null;
  if (!userId) {
    const password = randomBytes(24).toString("base64url");
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: to,
      password,
      email_confirm: true,
      user_metadata: { name: "Test Student" },
    });
    if (createErr || !created?.user) {
      return { error: createErr?.message ?? "Could not create the test account.", ok: false, detail: "" };
    }
    userId = created.user.id;
  }

  // 2. Mark it unmistakably as a test account, scoped like a real student.
  await admin.from("profiles").update({ is_test: true, scope: "lectures_only" }).eq("id", userId);

  // 3. A real 8-char password through the SAME generator as the real send —
  //    set on the auth user + returned so the test email contains it verbatim.
  const password = generateCredential();
  const { error: pwErr } = await admin.auth.admin.updateUserById(userId, { password });
  if (pwErr) {
    return { error: pwErr.message ?? "Could not set the test password.", ok: false, detail: "" };
  }

  // 4. Send the real credential email, clearly [TEST]-marked.
  const res = await sendResendEmail(
    to,
    "[TEST] Your VIBHA School of Psychology password",
    credentialsEmailBody("Test Student", to, password, appUrl),
  );

  return {
    error: null,
    ok: res.ok,
    detail: res.ok ? `Sent — Resend id ${res.id ?? "(none)"}. Password: ${password}` : res.error ?? "Send failed.",
  };
}

export type ResetCredentialResult = { error: string | null; ok: boolean; password: string | null; detail: string };

/** RESET PASSWORD. Regenerates one student's 8-char password and returns it so
 * Kavya can share the new value. The auth user's password is updated to match. */
export async function resetCredentialAction(email: string): Promise<ResetCredentialResult> {
  if (!(await requireAdmin())) return { error: "Not authorized.", ok: false, password: null, detail: "" };

  const admin = createAdminClient();
  const password = await resetCredential(admin, email.trim().toLowerCase());
  revalidatePath("/admin/roster");
  if (!password) {
    return { error: "Could not reset the password.", ok: false, password: null, detail: "" };
  }
  return { error: null, ok: true, password, detail: "Password reset." };
}
