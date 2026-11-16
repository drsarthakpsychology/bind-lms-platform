import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { addDays } from "@/lib/learn/engine";
import { loadBoard, type BoardRow } from "@/lib/learn/leaderboard";
import { leagueGroups, loadStudents, pointsWindows } from "@/lib/leagues/data";
import { tierName } from "@/lib/leagues/tiers";
import { leagueWeek } from "@/lib/leagues/week";
import { loadStanding } from "./board";
import { adminPage, type AdminBoardKey, type AdminInput, type AdminPage, type AdminQuery } from "./admin-board";

/**
 * The admin board's data: every visible student (test and robot accounts
 * left out), zero scores included, real names. Only for admins; callers check
 * the role first.
 */
export async function loadAdminBoard(board: AdminBoardKey, query: AdminQuery): Promise<AdminPage> {
  const admin = createAdminClient();
  const [students, cohorts] = await Promise.all([
    loadStudents(admin),
    admin
      .from("cohorts")
      .select("id, name")
      .order("name")
      .then((r) => (r.error ? [] : ((r.data ?? []) as { id: string; name: string }[])), () => [] as { id: string; name: string }[]),
  ]);

  let items: AdminInput[];
  if (board === "league") {
    const week = leagueWeek(new Date());
    const [[weekPts], groups] = await Promise.all([pointsWindows(admin, [[week, addDays(week, 7)]]), leagueGroups(admin, week, students)]);
    const tier = new Map(groups.groups.map((g) => [g.userId, g.tier]));
    items = students.map((s) => ({ id: s.id, name: s.fullName, cohortIds: s.cohortIds, points: weekPts.get(s.id)?.total ?? 0, extra: { tier: tierName(tier.get(s.id) ?? 1) } }));
  } else if (board === "quiz") {
    const rows = await loadBoard().catch(() => [] as BoardRow[]);
    const by = new Map(rows.map((r) => [r.userId, r]));
    items = students.map((s) => {
      const r = by.get(s.id);
      return { id: s.id, name: s.fullName, cohortIds: s.cohortIds, points: r?.weekXp ?? 0, extra: { xp: r?.xp ?? 0, streak: r?.streak ?? 0 } };
    });
  } else {
    const { rows } = await loadStanding().catch(() => ({ rows: [] as Awaited<ReturnType<typeof loadStanding>>["rows"] }));
    const by = new Map(rows.map((r) => [r.userId, r]));
    items = students.map((s) => {
      const r = by.get(s.id);
      return { id: s.id, name: s.fullName, cohortIds: s.cohortIds, points: r?.points ?? 0, extra: { level: r?.level ?? 1, hours: r?.hours ?? 0, lessonsDone: r?.lessonsDone ?? 0 } };
    });
  }
  return adminPage(items, cohorts, query);
}
