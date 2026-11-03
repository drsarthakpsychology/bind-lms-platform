import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { openFailures, type FailRow } from "./failed-pick";

const COLS = "id, recipient, name, subject, template_id, status, error_reason, sent_at, created_at, body_text, delivered_at, opened_at, clicked_at, bounced_at";

/** True when the database has the "Clear failed" column yet. */
async function hasDismissed(admin: SupabaseClient): Promise<boolean> {
  const { error } = await admin.from("email_sends").select("dismissed_at").limit(1);
  return !error;
}

/**
 * Failed sends still worth a look (newest first): not cleared, not to a test
 * address, and not already fixed by a later good send to the same person.
 */
export async function loadOpenFailures<T extends FailRow = FailRow & Record<string, unknown>>(admin: SupabaseClient, limit = 300): Promise<T[]> {
  let q = admin.from("email_sends").select(COLS).eq("status", "failed").order("created_at", { ascending: false }).limit(1000);
  if (await hasDismissed(admin)) q = q.is("dismissed_at", null);
  const { data: failed } = await q;
  const rows = (failed ?? []) as unknown as T[];
  if (!rows.length) return [];
  const emails = [...new Set(rows.map((r) => r.recipient))];
  const { data: ok } = await admin
    .from("email_sends")
    .select("recipient, created_at")
    .in("recipient", emails.slice(0, 500))
    .in("status", ["sent", "delivered"])
    .limit(5000);
  return openFailures(rows, (ok ?? []) as { recipient: string; created_at: string }[]).slice(0, limit);
}

/** Hide every open failure. Returns how many, or an error if the DB step hasn't run. */
export async function dismissFailures(admin: SupabaseClient): Promise<{ cleared: number; error: string | null }> {
  if (!(await hasDismissed(admin))) return { cleared: 0, error: "Run the new database step (2026_11_mail_clear.sql) first, then try again." };
  const { data, error } = await admin
    .from("email_sends")
    .update({ dismissed_at: new Date().toISOString() })
    .eq("status", "failed")
    .is("dismissed_at", null)
    .select("id");
  return { cleared: data?.length ?? 0, error: error ? error.message : null };
}
