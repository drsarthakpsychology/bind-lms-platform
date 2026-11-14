import type { Metadata } from "next";
import { requireSession } from "@/lib/auth/guards";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import { appUrl, cleanAppUrl } from "@/lib/app-url";
import { RefreshShell } from "@/components/navigation/refresh-shell";
import { loadMyAchievements } from "./actions";
import { AchievementsClient } from "./achievements-client";

export const metadata: Metadata = { title: "My Achievements" };

/** My Achievements: the student's badges, certificates and progress. */
export default async function AchievementsPage() {
  const me = await requireSession();
  if (!me) redirect("/login");
  const [{ earned, progress }, seen] = await Promise.all([loadMyAchievements(), markAchievementNoticesRead(me.id)]);
  // The same address the certificate emails use for the verify link.
  const siteUrl = cleanAppUrl(process.env.NEXT_PUBLIC_SITE_URL, appUrl());
  return (
    <>
      <RefreshShell when={seen > 0} />
      <AchievementsClient earned={earned} progress={progress} rollNumber={me.roll_number} siteUrl={siteUrl} />
    </>
  );
}

/**
 * A badge or certificate notice opens this page (its link is /achievements,
 * not /notifications/<id>), so seeing the page is reading the notice.
 * Without this the bell kept counting every badge until "Mark all read".
 */
async function markAchievementNoticesRead(userId: string): Promise<number> {
  try {
    const { data } = await createAdminClient()
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .in("type", ["badge", "certificate"])
      .is("read_at", null)
      .select("id");
    return data?.length ?? 0;
  } catch {
    return 0;
  }
}
