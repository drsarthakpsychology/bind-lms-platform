import type { Metadata } from "next";
import { requireSession } from "@/lib/auth/guards";
import { redirect } from "next/navigation";
import { loadMyAchievements } from "./actions";
import { AchievementsClient } from "./achievements-client";

export const metadata: Metadata = { title: "My Achievements" };

/** My Achievements: the student's badges, certificates and progress. */
export default async function AchievementsPage() {
  const me = await requireSession();
  if (!me) redirect("/login");
  const { earned, progress } = await loadMyAchievements();
  return <AchievementsClient earned={earned} progress={progress} rollNumber={me.roll_number} />;
}
