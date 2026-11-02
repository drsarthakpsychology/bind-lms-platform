import type { Metadata } from "next";
import { requireFeature } from "@/lib/flags";
import { createClient } from "@/lib/supabase/server";
import { loadBoard } from "@/lib/learn/leaderboard";
import { ProgressView, type PublicRow } from "@/components/learn/progress-view";
import { loadLearnState, saveLearnState } from "../actions";

export const metadata: Metadata = { title: "My progress" };

/** Student tracker: my stats + a weekly leaderboard (top 10, plus me and my neighbours). */
export default async function ProgressPage() {
  await requireFeature("learn");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [serverState, board] = await Promise.all([loadLearnState(), loadBoard().catch(() => [])]);
  const idx = board.findIndex((r) => r.userId === user?.id);
  const keep = new Set<number>(board.slice(0, 10).map((_, k) => k));
  if (idx >= 0) for (const k of [idx - 1, idx, idx + 1]) if (k >= 0 && k < board.length) keep.add(k);
  // Only first name + initial leave the server; no emails or ids.
  const rows: PublicRow[] = [...keep]
    .sort((a, b) => a - b)
    .map((k) => ({ rank: k + 1, name: board[k].name, weekXp: board[k].weekXp, xp: board[k].xp, streak: board[k].streak, level: board[k].level, me: k === idx }));
  return <ProgressView serverState={serverState} save={saveLearnState} board={rows} myRank={idx >= 0 ? idx + 1 : null} total={board.length} />;
}
