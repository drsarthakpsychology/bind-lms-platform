import "server-only";
import { isHiddenAccount } from "@/lib/people/hidden";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/learn/leaderboard";
import { normalise, addDays } from "@/lib/learn/engine";
import { istToday } from "@/lib/practice/streaks";
import { hoursOf, rankRows, standingFor } from "./score";
import { sameGroup } from "./boards";
import { loadCohortMap } from "./cohort-map";


export type StandingRow = {
  userId: string;
  name: string;
  cohortIds: string[];
  points: number;
  level: number;
  title: string;
  nextTitle: string | null;
  toNext: number;
  pct: number;
  hours: number;
  lectureHours: number;
  lessonsDone: number;
  weekXp: number;
  rank: number;
};

/**
 * Every student's level, points and hours, ranked. Read with the server key;
 * students only ever see first names and initials (see the board page).
 */
export const loadStanding = cache(async (): Promise<{ rows: StandingRow[] }> => {
  const admin = createAdminClient();
  const [{ data: profiles }, { data: learn }, totalsRes, cohorts] = await Promise.all([
    admin.from("profiles").select("id, name, email, role, is_test").eq("role", "student").limit(5000),
    admin.from("learn_progress").select("user_id, xp, state").limit(5000),
    admin.rpc("standing_totals"),
    loadCohortMap(),
  ]);
  const totals = new Map<string, { platform_seconds: number; watched_seconds: number; lessons_done: number }>();
  const totalRows = !totalsRes.error && Array.isArray(totalsRes.data) ? (totalsRes.data as { user_id: string; platform_seconds: number; watched_seconds: number; lessons_done: number }[]) : [];
  for (const t of totalRows) {
    totals.set(t.user_id, t);
  }
  const weekStart = addDays(istToday(), -6);
  const xp = new Map<string, number>();
  const weekXp = new Map<string, number>();
  for (const l of learn ?? []) {
    const st = normalise(l.state);
    xp.set(l.user_id as string, st.xp || Number(l.xp) || 0);
    weekXp.set(l.user_id as string, Object.entries(st.history).reduce((a, [d, x]) => (d >= weekStart ? a + Number(x) : a), 0));
  }
  const rows = (profiles ?? [])
    .filter((p) => !isHiddenAccount(p))
    .map((p) => {
      const id = p.id as string;
      const t = totals.get(id);
      const tot = {
        learnXp: xp.get(id) ?? 0,
        platformSeconds: Number(t?.platform_seconds ?? 0),
        watchedSeconds: Number(t?.watched_seconds ?? 0),
        lessonsDone: Number(t?.lessons_done ?? 0),
      };
      const s = standingFor(tot);
      return {
        userId: id,
        name: displayName(p.name as string | null, String(p.email ?? "")),
        cohortIds: cohorts.get(id) ?? [],
        ...s,
        hours: hoursOf(tot.platformSeconds),
        lectureHours: hoursOf(tot.watchedSeconds),
        lessonsDone: tot.lessonsDone,
        weekXp: weekXp.get(id) ?? 0,
      };
    });
  return { rows: rankRows(rows) };
});

/**
 * The overall board a student sees: people who share a cohort with them.
 * Someone in no cohort sees only others in no cohort (see sameGroup).
 */
export async function loadMyBoard(userId: string): Promise<{ rows: StandingRow[]; me: StandingRow | null }> {
  const { rows } = await loadStanding();
  const me = rows.find((r) => r.userId === userId) ?? null;
  const mine = me?.cohortIds ?? [];
  const peers = rows.filter((r) => r.userId === userId || sameGroup(mine, r.cohortIds));
  const ranked = rankRows(peers);
  return { rows: ranked, me: ranked.find((r) => r.userId === userId) ?? me };
}
