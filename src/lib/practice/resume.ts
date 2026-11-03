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
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("page_visits")
      .select("path")
      .eq("user_id", userId)
      .like("path", "/practice/%")
      .order("entered_at", { ascending: false })
      .limit(40);
    return pickResume((data ?? []) as { path: string }[], openTools);
  } catch {
    return null;
  }
}
