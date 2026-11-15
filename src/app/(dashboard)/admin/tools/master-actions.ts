"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { hashMaster, masterProblem } from "@/lib/auth/master-hash";
import { loadMaster, loadSupportKeys, saveMaster, saveSupportKeys } from "@/lib/auth/master";
import { labelProblem, makeSupportKey } from "@/lib/auth/support-keys";

/** Set or change the support key (typed twice). */
export async function setMasterPassword(pw: string, again: string): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  if (pw !== again) return { error: "The two entries don't match." };
  const problem = masterProblem(pw);
  if (problem) return { error: problem };
  const err = await saveMaster(createAdminClient(), hashMaster(pw), me.id);
  if (err) return { error: /admin_settings/.test(err) ? "Run the new database step (2026_11_access_doubts.sql) first." : "Could not save it." };
  revalidatePath("/admin/tools");
  return { error: null };
}

/** Switch the support key off (or back on) without changing it. */
export async function setMasterEnabled(on: boolean): Promise<{ error: string | null }> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const admin = createAdminClient();
  const { setting } = await loadMaster(admin);
  if (!setting) return { error: "Set a support key first." };
  const err = await saveMaster(admin, { ...setting, enabled: on }, me.id);
  revalidatePath("/admin/tools");
  return { error: err ? "Could not save it." : null };
}

type KeyResult = { error: string | null; plain?: string; last4?: string };
const NOT_READY = "Run the new database step (2026_11_access_doubts.sql) first.";

/** Make a new named support key. The full key is returned once, here, and never stored or shown again. */
export async function createSupportKey(label: string): Promise<KeyResult> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const problem = labelProblem(label);
  if (problem) return { error: problem };
  const admin = createAdminClient();
  const { keys, ready } = await loadSupportKeys(admin);
  if (!ready) return { error: NOT_READY };
  if (keys.filter((k) => !k.revokedAt).length >= 10) return { error: "There are already 10 live keys. Revoke one first." };
  const { plain, record } = makeSupportKey(label, { id: me.id, email: me.email ?? null });
  const err = await saveSupportKeys(admin, [...keys, record], me.id);
  if (err) return { error: "Could not save the key. Nothing changed." };
  revalidatePath("/admin/tools");
  return { error: null, plain, last4: record.last4 };
}

/** Revoke a key: it stops working at once. Kept in the list (greyed) for the record. */
export async function revokeSupportKey(id: string): Promise<KeyResult> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const admin = createAdminClient();
  const { keys, ready } = await loadSupportKeys(admin);
  if (!ready) return { error: NOT_READY };
  const k = keys.find((x) => x.id === id);
  if (!k) return { error: "That key is not there any more." };
  if (k.revokedAt) return { error: null };
  const now = new Date().toISOString();
  const err = await saveSupportKeys(admin, keys.map((x) => (x.id === id ? { ...x, revokedAt: now, revokedByEmail: me.email ?? null } : x)), me.id);
  if (err) return { error: "Could not revoke it. Try again." };
  revalidatePath("/admin/tools");
  return { error: null };
}

/** Rotate: revoke the key and make a new one with the same name, in one save. The new key is returned once. */
export async function rotateSupportKey(id: string): Promise<KeyResult> {
  const me = await requireSuperAdmin();
  if (!me) return { error: "Not authorized." };
  const admin = createAdminClient();
  const { keys, ready } = await loadSupportKeys(admin);
  if (!ready) return { error: NOT_READY };
  const old = keys.find((x) => x.id === id);
  if (!old || old.revokedAt) return { error: "Only a live key can be rotated." };
  const now = new Date().toISOString();
  const { plain, record } = makeSupportKey(old.label, { id: me.id, email: me.email ?? null });
  const err = await saveSupportKeys(admin, [...keys.map((x) => (x.id === id ? { ...x, revokedAt: now, revokedByEmail: me.email ?? null } : x)), record], me.id);
  if (err) return { error: "Could not rotate it. The old key still works." };
  revalidatePath("/admin/tools");
  return { error: null, plain, last4: record.last4 };
}

/** Turn off the older single support key for good (named keys replace it). */
export async function revokeLegacyKey(): Promise<KeyResult> {
  return setMasterEnabled(false);
}
