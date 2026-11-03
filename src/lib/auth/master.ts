import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MasterSetting } from "./master-hash";

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
