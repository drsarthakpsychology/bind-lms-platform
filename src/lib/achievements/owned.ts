import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cleanEmail } from "./linkedin";

/**
 * A student's credentials: the ones issued to their account PLUS custom
 * certificates sent to their email address (issued "for anyone" before they
 * had an account, or under the same email). Falls back to the account-only
 * query when the database doesn't have the recipient_email column yet
 * (2026_11_custom_credentials.sql not applied).
 */
export async function selectOwnedCredentials(
  admin: SupabaseClient,
  columns: string,
  userId: string,
  email: string | null | undefined,
): Promise<{ data: Record<string, unknown>[] | null; error: { message: string } | null }> {
  const e = cleanEmail(email);
  if (e) {
    const r = await admin
      .from("credentials")
      .select(columns)
      .or(`user_id.eq.${userId},recipient_email.eq."${e}"`)
      .order("created_at", { ascending: false });
    if (!r.error) return { data: (r.data ?? []) as unknown as Record<string, unknown>[], error: null };
  }
  const r = await admin.from("credentials").select(columns).eq("user_id", userId).order("created_at", { ascending: false });
  return { data: (r.data ?? null) as unknown as Record<string, unknown>[] | null, error: r.error ? { message: r.error.message } : null };
}

/** True when this credential belongs to the student (by account or by email). */
export function ownsCredential(row: { user_id?: unknown; recipient_email?: unknown }, userId: string, email: string | null | undefined): boolean {
  if (row.user_id === userId) return true;
  const e = cleanEmail(email);
  return Boolean(e && typeof row.recipient_email === "string" && row.recipient_email.toLowerCase() === e);
}
