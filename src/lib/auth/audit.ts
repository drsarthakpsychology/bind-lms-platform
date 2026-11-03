import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Append a row to the append-only admin_audit_log. Writes go through the
 * service-role client (RLS has no INSERT policy for this table), so only
 * server code can record an event — never the client.
 */
export async function audit(
  admin: SupabaseClient,
  entry: {
    action: string;
    targetType?: string | null;
    targetId?: string | null;
    details?: Record<string, unknown> | null;
    actor?: { id: string; email: string | null } | null;
  },
): Promise<void> {
  await admin.from("admin_audit_log").insert({
    actor_id: entry.actor?.id ?? null,
    actor_email: entry.actor?.email ?? null,
    action: entry.action,
    target_type: entry.targetType ?? null,
    target_id: entry.targetId ?? null,
    details: entry.details ?? null,
  });
}
