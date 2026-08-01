"use server";

import { revalidatePath } from "next/cache";
import { parse } from "csv-parse/sync";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";

export type BulkImportResult = {
  error: string | null;
  success: boolean;
  created: number;
  skipped: number;
  emailsSent: number;
  failures: { row: number; email: string; reason: string }[];
};

/** Default welcome email (plain text). Wording can be edited later. */
function welcomeBody(name: string, password: string): string {
  return `Welcome to the program!

Your account is ready:
  Email: ${name}
  Password: ${password}

Sign in at the link your program provides and set a new password when you log in.

— The team`;
}

/**
 * Send a welcome email via Resend. Returns true if sent; false if no key is
 * configured (so bulk import still succeeds without email). Never throws.
 */
async function sendWelcomeEmail(email: string, name: string, password: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "Welcome <welcome@plms.local>";
  if (!key) return false;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Welcome to the program",
        text: welcomeBody(email, password),
      }),
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Bulk-create students from a CSV: name,email[,phone]. Idempotent — an email
 * that already exists is skipped (not re-created, no welcome email re-sent).
 * Optionally enrolls each in a course and (future) sends a welcome email.
 */
export async function bulkImportStudents(
  _prevState: BulkImportResult,
  formData: FormData,
): Promise<BulkImportResult> {
  if (!(await requireAdmin())) {
    return { error: "Not authorized.", success: false, created: 0, skipped: 0, emailsSent: 0, failures: [] };
  }

  const file = formData.get("file");
  const defaultPassword = String(formData.get("password") ?? "").trim();
  if (!(file instanceof File)) {
    return { error: "Upload a CSV file.", success: false, created: 0, skipped: 0, emailsSent: 0, failures: [] };
  }
  if (defaultPassword.length < 8) {
    return {
      error: "Provide a default password of at least 8 characters.",
      success: false,
      created: 0,
      skipped: 0,
      emailsSent: 0,
      failures: [],
    };
  }

  const text = await file.text();
  let rows: Record<string, string>[];
  try {
    rows = parse(text, { columns: true, skip_empty_lines: true, trim: true }) as Record<string, string>[];
  } catch {
    return { error: "Could not parse the CSV. Use headers: name,email.", success: false, created: 0, skipped: 0, emailsSent: 0, failures: [] };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return {
      error: "SUPABASE_SERVICE_ROLE_KEY isn't set in this deployment yet.",
      success: false,
      created: 0,
      skipped: 0,
      emailsSent: 0,
      failures: [],
    };
  }

  const created: string[] = [];
  const skipped: string[] = [];
  let emailsSent = 0;
  const failures: BulkImportResult["failures"] = [];

  for (const [i, row] of rows.entries()) {
    const email = String(row.email ?? "").trim().toLowerCase();
    const name = String(row.name ?? "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      failures.push({ row: i + 2, email: email || "(blank)", reason: "invalid email" });
      continue;
    }

    // Idempotency: skip if the email already has an auth user.
    const { data: existing } = await admin.auth.admin.listUsers();
    const already = (existing?.users ?? []).some((u) => u.email?.toLowerCase() === email);
    if (already) {
      skipped.push(email);
      continue;
    }

    const { data: createdUser, error } = await admin.auth.admin.createUser({
      email,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: name ? { name } : undefined,
    });
    if (error || !createdUser?.user) {
      failures.push({ row: i + 2, email, reason: error?.message ?? "create failed" });
      continue;
    }
    created.push(email);

    // Welcome email (only if Resend is configured).
    const sent = await sendWelcomeEmail(email, name || email, defaultPassword);
    if (sent) emailsSent++;
  }

  revalidatePath("/admin/students");
  return {
    error: null,
    success: true,
    created: created.length,
    skipped: skipped.length,
    emailsSent,
    failures,
  };
}
