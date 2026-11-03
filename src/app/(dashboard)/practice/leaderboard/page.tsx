import { redirect } from "next/navigation";
import { BOARDS } from "@/lib/standing/boards";

/** Old address of the overall leaderboard; it now lives at /leaderboard. */
export default function OldRankingsPage() {
  redirect(BOARDS.overall.href);
}
