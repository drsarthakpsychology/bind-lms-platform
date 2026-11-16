import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/server";
import { personKey } from "@/lib/crm/people";
import { queuePush, type BellRow } from "./push";
import type { AdminPushKind } from "./contract";

/**
 * Each admin's phone notices: a new doubt or concern, a new enquiry, a
 * student falling behind. One row per admin in admin_settings (key below),
 * written only by the server. Missing row: the defaults.
 */
export type AdminPushPrefs = { newDoubt: boolean; newEnquiry: boolean; fallingBehind: boolean };
export const ADMIN_PUSH_DEFAULTS: AdminPushPrefs = { newDoubt: true, newEnquiry: true, fallingBehind: false };
export const ADMIN_PUSH_PREF: Record<AdminPushKind, keyof AdminPushPrefs> = { new_doubt: "newDoubt", new_enquiry: "newEnquiry", falling_behind: "fallingBehind" };

export const adminPushKey = (userId: string) => `admin_push_prefs:${userId}`;

export function cleanAdminPushPrefs(raw: unknown): AdminPushPrefs {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const b = (k: keyof AdminPushPrefs) => (typeof o[k] === "boolean" ? (o[k] as boolean) : ADMIN_PUSH_DEFAULTS[k]);
  return { newDoubt: b("newDoubt"), newEnquiry: b("newEnquiry"), fallingBehind: b("fallingBehind") };
}

export async function loadAdminPushPrefs(admin: SupabaseClient, userId: string): Promise<AdminPushPrefs> {
  const { data, error } = await admin.from("admin_settings").select("value").eq("key", adminPushKey(userId)).maybeSingle();
  return cleanAdminPushPrefs(error ? null : data?.value);
}

export async function saveAdminPushPrefs(admin: SupabaseClient, userId: string, change: Partial<AdminPushPrefs>): Promise<{ prefs: AdminPushPrefs; error: string | null }> {
  const prefs = cleanAdminPushPrefs({ ...(await loadAdminPushPrefs(admin, userId)), ...change });
  const { error } = await admin.from("admin_settings").upsert({ key: adminPushKey(userId), value: prefs, updated_at: new Date().toISOString(), updated_by: userId }, { onConflict: "key" });
  return { prefs, error: error ? error.message : null };
}

/** Which of these admins want this notice. */
export async function adminsWanting(admin: SupabaseClient, userIds: readonly string[], kind: AdminPushKind): Promise<Set<string>> {
  if (!userIds.length) return new Set();
  const { data } = await admin.from("admin_settings").select("key, value").in("key", userIds.map(adminPushKey));
  const saved = new Map((data ?? []).map((r) => [String(r.key), r.value]));
  const pref = ADMIN_PUSH_PREF[kind];
  return new Set(userIds.filter((id) => cleanAdminPushPrefs(saved.get(adminPushKey(id)))[pref]));
}

/** Push bell rows already written for admins, only to those who want this notice, carrying the admin kind and id. Never throws. */
export async function queueAdminPush(rows: readonly BellRow[], kind: AdminPushKind, id: string | null): Promise<void> {
  try {
    const want = await adminsWanting(createAdminClient(), [...new Set(rows.map((r) => r.user_id))], kind);
    const mine = rows.filter((r) => want.has(r.user_id));
    if (mine.length) queuePush(mine, "messages", { admin: kind, id });
  } catch {
    // A missed phone notice is not worth failing the post.
  }
}

/** A new enquiry: a phone notice (no bell row, as on the website) to every admin who wants one. Never throws. */
export async function pushNewEnquiry(input: { name: string; email: string }): Promise<void> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("profiles").select("id").in("role", ["admin", "view_admin"]).neq("status", "blocked");
    const key = personKey(input.email);
    const rows: BellRow[] = (data ?? []).map((p) => ({ user_id: String(p.id), type: "enquiry", title: `New enquiry: ${input.name}`.slice(0, 140), body: "Open their record in People.", href: `/admin/people/${key}` }));
    await queueAdminPush(rows, "new_enquiry", key);
  } catch {
    // ignore
  }
}
