import "server-only";
import { isHiddenAccount } from "@/lib/people/hidden";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/learn/leaderboard";
import { normalise } from "@/lib/learn/engine";
import { hoursOf, rankRows, standingFor } from "./score";

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
  rank: number;
};

/**
 * Every student's level, points and hours, ranked. Read with the server key;
 * students only ever see first names and initials (see the board page).
 */
export const loadStanding = cache(async (): Promise<{ rows: StandingRow[] }> => {
  const admin = createAdminClient();
  const [{ data: profiles }, { data: learn }, totalsRes, membersRes] = await Promise.all([
    admin.from("profiles").select("id, name, email, role, is_test").eq("role", "student").limit(5000),
    admin.from("learn_progress").select("user_id, xp, state").limit(5000),
    admin.rpc("standing_totals"),
    admin.from("cohort_members").select("cohort_id, user_id").limit(20000),
  ]);
  const totals = new Map<string, { platform_seconds: number; watched_seconds: number; lessons_done: number }>();
  const totalRows = !totalsRes.error && Array.isArray(totalsRes.data) ? (totalsRes.data as { user_id: string; platform_seconds: number; watched_seconds: number; lessons_done: number }[]) : [];
  for (const t of totalRows) {
    totals.set(t.user_id, t);
  }
  const xp = new Map((learn ?? []).map((l) => [l.user_id as string, normalise(l.state).xp || Number(l.xp) || 0]));
  const cohorts = new Map<string, string[]>();
  for (const m of membersRes.error ? [] : (membersRes.data ?? [])) {
    const k = m.user_id as string;
    cohorts.set(k, [...(cohorts.get(k) ?? []), m.cohort_id as string]);
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
      };
    });
  return { rows: rankRows(rows) };
});

/** The board a student sees: people in their cohort(s), or everyone if none. */
export async function loadMyBoard(userId: string): Promise<{ rows: StandingRow[]; me: StandingRow | null }> {
  const { rows } = await loadStanding();
  const me = rows.find((r) => r.userId === userId) ?? null;
  const mine = new Set(me?.cohortIds ?? []);
  const peers = mine.size ? rows.filter((r) => r.cohortIds.some((c) => mine.has(c))) : rows;
  const ranked = rankRows(peers);
  return { rows: ranked, me: ranked.find((r) => r.userId === userId) ?? me };
}
