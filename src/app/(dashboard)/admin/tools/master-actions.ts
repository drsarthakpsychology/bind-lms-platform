"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { hashMaster, masterProblem } from "@/lib/auth/master-hash";
import { loadMaster, saveMaster } from "@/lib/auth/master";

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
