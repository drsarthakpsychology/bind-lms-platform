import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { createClient } from "@/lib/supabase/server";
import { loadQuizBoard } from "@/lib/learn/leaderboard";
import { ProgressView } from "@/components/learn/progress-view";
import { loadLearnState, saveLearnState } from "../../study/actions";

export const metadata: Metadata = { title: "My progress" };

/**
 * Student tracker: my stats, mastery, mix-ups and badges, plus my place on
 * the quiz leaderboard (the board itself is /games/leaderboard). Cohort
 * scoping lives in loadQuizBoard.
 */
export default async function ProgressPage() {
  await requireFeature("learn");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [serverState, quiz] = await Promise.all([loadLearnState(), loadQuizBoard(user?.id ?? null)]);
  return <ProgressView serverState={serverState} save={saveLearnState} myRank={quiz.myRank} total={quiz.total} />;
}
