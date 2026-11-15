import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSuperAdmin, requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { moduleFacets } from "@/lib/achievements/rules";
import { listAchievements } from "../../achievements/actions";
import { AdminPage, Empty } from "../../_v2/kit";
import { TypesAdmin } from "./types-ui";

export const metadata: Metadata = { title: "Types" };
export const dynamic = "force-dynamic";

/**
 * Certificates, Types: the badge and certificate types and their rules (what
 * earns a badge, the course certificate's rule, signature images). Super
 * Admin only, as before.
 */
export default async function TypesPage() {
  const me = await requireAdmin();
  if (!me) redirect("/dashboard");
  if (!isSuperAdmin(me)) {
    return (
      <AdminPage title="Types">
        <Empty>Only the Super Admin can change badge and certificate types.</Empty>
      </AdminPage>
    );
  }
  const admin = createAdminClient();
  const [types, { data: courses }] = await Promise.all([listAchievements(), admin.from("courses").select("id, title").order("title", { ascending: true })]);
  return (
    <AdminPage title="Types">
      <TypesAdmin types={types} courses={(courses ?? []) as { id: string; title: string }[]} modules={moduleFacets()} />
    </AdminPage>
  );
}
