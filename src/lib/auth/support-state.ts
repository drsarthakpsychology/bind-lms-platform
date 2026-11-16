import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { loadMaster, loadSupportKeys } from "./master";
import { sortKeys, toView, type SupportKeyView } from "./support-keys";

/**
 * Support keys as the Support keys page shows them: the named keys (views
 * only: never the salt or hash), whether the older shared key still works,
 * and the last sign-ins with a key. Shared by /admin/tools and the app's
 * GET /admin/system.
 */
export type SupportState = { ready: boolean; legacy: { updatedAt: string | null } | null; keys: SupportKeyView[]; uses: { email: string; at: string }[] };

export const MAX_LIVE_KEYS = 10;

export async function loadSupportState(admin: SupabaseClient): Promise<SupportState> {
  const [{ setting, ready }, supportKeys] = await Promise.all([loadMaster(admin), loadSupportKeys(admin)]);
  const { data: events } = ready ? await admin.from("master_login_events").select("email, created_at").order("created_at", { ascending: false }).limit(10) : { data: [] };
  return {
    ready: ready && supportKeys.ready,
    legacy: setting?.enabled ? { updatedAt: setting.updatedAt ?? null } : null,
    keys: sortKeys(supportKeys.keys.map(toView)),
    uses: (events ?? []).map((e) => ({ email: String(e.email), at: String(e.created_at) })),
  };
}
