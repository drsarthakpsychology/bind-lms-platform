import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { listAchievements, listCredentials } from "./actions";
import { moduleFacets } from "@/lib/achievements/rules";
import { AchievementsAdmin } from "./achievements-admin";

export const metadata = { title: "Achievements & Credentials" };

/** Super Admin only — achievements, badges and official certificates. */
export default async function AchievementsAdminPage() {
  const me = await requireSuperAdmin();
  if (!me) redirect("/admin");

  const admin = createAdminClient();
  const [achievements, { rows: credentials, total }, { data: courses }] = await Promise.all([
    listAchievements(),
    listCredentials({}),
    admin.from("courses").select("id, title").order("title", { ascending: true }),
  ]);

  return (
    <AchievementsAdmin
      achievements={achievements}
      credentials={credentials}
      total={total}
      courses={(courses ?? []) as { id: string; title: string }[]}
      modules={moduleFacets()}
    />
  );
}
