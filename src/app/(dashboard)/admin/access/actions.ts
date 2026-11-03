"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { isFeatureKey, RESETS, type ResetKey } from "@/lib/access/features";

type Result = { error: string | null; done: number };
const clean = (ids: string[]) => [...new Set(ids)].filter((x) => /^[0-9a-f-]{36}$/i.test(x)).slice(0, 2000);

function refresh() {
  revalidatePath("/admin/access");
  revalidatePath("/admin/students");
}

/** Full or Lectures only, for one or many students. Never touches admins. */
export async function setScopeFor(userIds: string[], scope: "full" | "lectures_only"): Promise<Result> {
  if (!(await requireAdmin())) return { error: "Not authorized.", done: 0 };
  if (scope !== "full" && scope !== "lectures_only") return { error: "Unknown access level.", done: 0 };
  const ids = clean(userIds);
  if (!ids.length) return { error: "Tick at least one student.", done: 0 };
  const { data, error } = await createAdminClient().from("profiles").update({ scope }).in("id", ids).eq("role", "student").select("id");
  if (error) return { error: "Could not change access.", done: 0 };
  refresh();
  return { error: null, done: data?.length ?? 0 };
}

/** Switch a section off (or back on) for one or many students. */
export async function setFeatureFor(userIds: string[], feature: string, off: boolean): Promise<Result> {
  const me = await requireAdmin();
  if (!me) return { error: "Not authorized.", done: 0 };
  if (!isFeatureKey(feature)) return { error: "Unknown section.", done: 0 };
  const ids = clean(userIds);
  if (!ids.length) return { error: "Tick at least one student.", done: 0 };
  const admin = createAdminClient();
  const { error } = off
    ? await admin.from("access_blocks").upsert(ids.map((user_id) => ({ user_id, feature, created_by: me.id })), { onConflict: "user_id,feature", ignoreDuplicates: true })
    : await admin.from("access_blocks").delete().eq("feature", feature).in("user_id", ids);
  if (error) return { error: error.code === "42P01" ? "Run the new database step (2026_11_access_doubts.sql) first." : "Could not save.", done: 0 };
  refresh();
  return { error: null, done: ids.length };
}

/** Start a student's progress again in one area (cannot be undone). */
export async function resetFor(userIds: string[], key: ResetKey): Promise<Result> {
  if (!(await requireAdmin())) return { error: "Not authorized.", done: 0 };
  const r = RESETS.find((x) => x.key === key);
  if (!r) return { error: "Unknown reset.", done: 0 };
  const ids = clean(userIds);
  if (!ids.length) return { error: "Tick at least one student.", done: 0 };
  const { error } = await createAdminClient().from(r.table).delete().in("user_id", ids);
  if (error) return { error: "Could not reset.", done: 0 };
  refresh();
  revalidatePath("/admin/activity");
  return { error: null, done: ids.length };
}
