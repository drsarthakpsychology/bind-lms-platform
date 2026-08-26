"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { parseRosterCsv, provisionRoster, type RosterFailure, type RosterReport } from "@/lib/auth/roster";

export type BulkImportResult = RosterReport & {
  error: string | null;
  success: boolean;
  failures: RosterFailure[];
};

/**
 * Send a welcome/invite email via Resend. Returns true if sent; false if no
 * key is configured (so bulk import still succeeds without email). Never
 * throws. The invite link is set-your-password — never a plaintext password.
 */
async function sendInviteEmail(to: string, subject: string, body: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "Welcome <welcome@plms.local>";
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text: body }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Bulk-create students from a CSV: name,email only. Idempotent — an email that
 * already exists is skipped (not re-created, no email re-sent). Each account
 * is stamped with the `scope` and gets a set-your-password invite link emailed
 * via Resend (if configured). One bad row never stops the batch.
 */
export async function bulkImportStudents(
  _prevState: BulkImportResult,
  formData: FormData,
): Promise<BulkImportResult> {
  if (!(await requireAdmin())) {
    return { error: "Not authorized.", success: false, rowsRead: 0, created: 0, duplicatesSkipped: 0, invalidSkipped: 0, emailsSent: 0, emailsFailed: 0, failures: [], createdAccounts: [], emptyNames: [] };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "Upload a CSV file.", success: false, rowsRead: 0, created: 0, duplicatesSkipped: 0, invalidSkipped: 0, emailsSent: 0, emailsFailed: 0, failures: [], createdAccounts: [], emptyNames: [] };
  }

  const text = await file.text();
  const scope = String(formData.get("scope") ?? "full").trim() || "full";
  const parsed = parseRosterCsv(text);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibhapsychology.com";

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      error: "SUPABASE_SERVICE_ROLE_KEY isn't set in this deployment yet.",
      success: false,
      rowsRead: parsed.rows.length,
      created: 0, duplicatesSkipped: parsed.duplicates.length, invalidSkipped: parsed.invalid.length,
      emailsSent: 0, emailsFailed: 0, failures: [...parsed.invalid, ...parsed.duplicates],
      createdAccounts: [], emptyNames: parsed.emptyNames,
    };
  }

  const report = await provisionRoster(parsed.rows, {
    admin,
    scope,
    appUrl,
    sendEmail: sendInviteEmail,
  });

  revalidatePath("/admin/students");
  return {
    error: null,
    success: true,
    ...report,
    // Failures the importer must surface: invalid rows + duplicate rows + any
    // create/send error, so admin has full visibility into what was skipped.
    failures: [...parsed.invalid, ...parsed.duplicates, ...report.failures],
    invalidSkipped: parsed.invalid.length,
    duplicatesSkipped: parsed.duplicates.length + report.duplicatesSkipped,
  };
}
