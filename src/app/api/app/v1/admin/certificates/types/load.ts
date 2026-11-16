import { createAdminClient } from "@/lib/supabase/server";
import { moduleFacets } from "@/lib/achievements/rules";
import { listAchievements } from "@/app/(dashboard)/admin/achievements/actions";
import { typesOut } from "@/lib/app-api/admin-round2";
import type { AdminCertTypes } from "@/lib/app-api/contract-practise-admin";

/** Certificates, Types: listAchievements, the courses and the module facets (the website's Types page). */
export async function loadTypes(canWrite: boolean): Promise<AdminCertTypes> {
  const [types, { data: courses }] = await Promise.all([listAchievements(), createAdminClient().from("courses").select("id, title").order("title", { ascending: true })]);
  return typesOut(types, moduleFacets().map((m) => ({ id: m.id, title: m.title })), (courses ?? []).map((c) => ({ id: String(c.id), title: String(c.title) })), canWrite);
}
