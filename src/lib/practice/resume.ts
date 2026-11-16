import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * "Resume where you left off" on /practice: the last practice tool this
 * person opened, if it is still open to them. No recommendations, no
 * guessing; just one button back to where they were.
 */
import { pickResume, type ResumeTarget } from "./resume-pick";

export async function lastPracticePlace(userId: string, openTools: { href: string; title: string }[]): Promise<ResumeTarget | null> {
  if (!openTools.length) return null;
  return pickResume(await recentPracticeVisits(userId), openTools);
}

/** The newest practice pages this person opened (for pickResume), read on its own so it can run alongside other reads. */
export async function recentPracticeVisits(userId: string): Promise<{ path: string }[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("page_visits")
      .select("path")
      .eq("user_id", userId)
      .like("path", "/practice/%")
      .order("entered_at", { ascending: false })
      .limit(40);
    return (data ?? []) as { path: string }[];
  } catch {
    return [];
  }
}
