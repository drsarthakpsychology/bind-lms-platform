import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { AddPeoplePanel } from "./add-people-panel";

/** Server half of the Add people panel: one small read (cohort names), streamed behind Suspense. */
export async function AddPeopleHost() {
  const me = await requireAdmin();
  if (!me) return null;
  const { data } = await createAdminClient().from("cohorts").select("id, name, status").order("created_at", { ascending: true });
  // Open cohorts first; ended ones stay pickable at the end.
  const rows = (data ?? []).map((c) => ({ id: c.id as string, name: String(c.name), ended: c.status === "ended" }));
  const cohorts = [...rows.filter((c) => !c.ended), ...rows.filter((c) => c.ended)].map(({ id, name }) => ({ id, name }));
  return <AddPeoplePanel cohorts={cohorts} canWrite={isSuperAdmin(me)} />;
}
