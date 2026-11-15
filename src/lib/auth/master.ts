import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MasterSetting } from "./master-hash";
import { parseSupportKeys, type SupportKey } from "./support-keys";

const KEY = "master_password";

export async function loadMaster(admin: SupabaseClient): Promise<{ setting: MasterSetting | null; ready: boolean }> {
  const { data, error } = await admin.from("admin_settings").select("value").eq("key", KEY).maybeSingle();
  if (error && error.code !== "PGRST116") return { setting: null, ready: false };
  return { setting: (data?.value as MasterSetting | undefined) ?? null, ready: true };
}

export async function saveMaster(admin: SupabaseClient, value: MasterSetting, by: string): Promise<string | null> {
  const { error } = await admin.from("admin_settings").upsert({ key: KEY, value, updated_at: new Date().toISOString(), updated_by: by }, { onConflict: "key" });
  return error ? error.message : null;
}

const KEYS = "support_keys";

/** Support keys (several, named, revocable): see support-keys.ts. */
export async function loadSupportKeys(admin: SupabaseClient): Promise<{ keys: SupportKey[]; ready: boolean }> {
  const { data, error } = await admin.from("admin_settings").select("value").eq("key", KEYS).maybeSingle();
  if (error && error.code !== "PGRST116") return { keys: [], ready: false };
  return { keys: parseSupportKeys(data?.value), ready: true };
}

export async function saveSupportKeys(admin: SupabaseClient, keys: SupportKey[], by: string | null): Promise<string | null> {
  const { error } = await admin.from("admin_settings").upsert({ key: KEYS, value: { keys }, updated_at: new Date().toISOString(), updated_by: by }, { onConflict: "key" });
  return error ? error.message : null;
}
