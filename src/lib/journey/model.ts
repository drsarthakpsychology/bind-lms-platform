import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { loadMyBoard } from "@/lib/standing/board";
import { normalise, levelFor, liveStreak } from "@/lib/learn/engine";
import { istToday } from "@/lib/practice/streaks";
import { hoursOf } from "@/lib/standing/score";

/**
 * My journey: the student's own numbers in one place (hours on VIBHA, time in
 * lectures, lectures finished, level and rank, quiz points, practice done).
 * Moved out of the /journey page so the page and the app route
 * (GET /api/app/v1/journey) read the same numbers.
 */

export type JourneyStatKey = "online" | "lectures" | "finished" | "streak" | "points" | "practice";
export type JourneyStat = { key: JourneyStatKey; label: string; value: string; sub?: string };
export type JourneyModel = {
  level: number;
  title: string;
  /** 0 to 1 of the way to the next level. */
  levelPct: number;
  /** Leaderboard points, null when the student is not on the board. */
  points: number | null;
  rank: number | null;
  /** Days in a row, 0 when none. */
  streak: number;
  stats: JourneyStat[];
};

export async function loadJourney(userId: string): Promise<JourneyModel> {
  const admin = createAdminClient();
  const [board, { data: learnRow }, { data: lessons }, practice] = await Promise.all([
    loadMyBoard(userId).catch(() => ({ rows: [], me: null })),
    admin.from("learn_progress").select("state").eq("user_id", userId).maybeSingle(),
    admin.from("progress").select("watched_seconds, is_completed").eq("user_id", userId).limit(2000),
    Promise.all([
      admin.from("sim_sessions").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("sct_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("mse_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("osce_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId),
      admin.from("formulation_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId),
    ]),
  ]);

  const me = board.me;
  const st = learnRow?.state ? normalise(learnRow.state) : null;
  const lv = st ? levelFor(st.xp) : null;
  const level = me?.level ?? lv?.level ?? 1;
  const title = me?.title ?? lv?.title ?? "Curious Mind";
  const levelPct = me?.pct ?? lv?.pct ?? 0;
  const streak = st ? liveStreak(st.streak, istToday()) : 0;
  const accuracy = st && st.answered ? Math.round((st.correct / st.answered) * 100) : null;

  const rows = (lessons ?? []) as { watched_seconds: number | null; is_completed: boolean | null }[];
  const watchedSeconds = rows.reduce((a, l) => a + (l.watched_seconds ?? 0), 0);
  const lecturesDone = rows.filter((l) => l.is_completed).length;
  const lecturesStarted = rows.filter((l) => (l.watched_seconds ?? 0) > 0).length;
  const practiceCount = practice.reduce((a, r) => a + (r.count ?? 0), 0);

  const hoursOnline = me?.hours ?? 0;
  const lectureHours = me?.lectureHours ?? hoursOf(watchedSeconds);

  return {
    level,
    title,
    levelPct,
    points: me ? me.points : null,
    rank: me?.rank ?? null,
    streak,
    stats: [
      { key: "online", label: "Time on VIBHA", value: `${hoursOnline} h`, sub: "all your time here" },
      { key: "lectures", label: "In lectures", value: `${lectureHours} h`, sub: `${lecturesStarted} started` },
      { key: "finished", label: "Lectures finished", value: String(lecturesDone) },
      { key: "streak", label: "Day streak", value: streak ? `${streak} 🔥` : "None yet", sub: "days in a row" },
      { key: "points", label: "Quiz points", value: st ? String(st.xp) : "0", ...(accuracy !== null ? { sub: `${accuracy}% right` } : {}) },
      { key: "practice", label: "Practice done", value: String(practiceCount), sub: "sessions and drills" },
    ],
  };
}
