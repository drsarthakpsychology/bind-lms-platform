import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/server";
import { addDays } from "@/lib/learn/engine";
import { istToday } from "@/lib/practice/streaks";
import { boardWindow } from "@/lib/standing/boards";
import { loadStanding } from "@/lib/standing/board";
import { batchWar, type WarEntry } from "./batch-war";
import { leagueGroups, loadStudents, pointsWindows, type Student } from "./data";
import { percentileLine, percentileOf } from "./percentile";
import { relativeView, zoneNote, type ViewItem, type ZoneNote } from "./relative";
import { groupTier, promotionLine, rankGroup, tierName, zoneSize, type Closed, type Tier } from "./tiers";
import { daysLeftInWeek, leagueWeek, monthLabel, monthOf, nextMonth } from "./week";

/**
 * Everything the /leaderboard page shows one student. Only names, points and
 * the student's own private numbers leave the server (no ids, no emails).
 */

export type BoardEntry = { key: string; rank: number; name: string; title: string | null; look: string | null; points: number; me: boolean; gapBefore?: boolean };

export type MyLeague = {
  week: string;
  daysLeft: number;
  tier: Tier;
  tierName: string;
  groupSize: number;
  league: { view: (ViewItem & { entry?: BoardEntry })[]; cut: number; zone: ZoneNote; promotionAt: number | null; myRank: number | null };
  cohort: { name: string; entries: BoardEntry[]; myRank: number | null; total: number } | null;
  platform: { entries: BoardEntry[]; myRank: number | null; total: number };
  percentile: { line: string; value: number; topPct: number };
  war: { month: string; entries: (WarEntry & { mine: boolean })[] };
  lastWeek: Closed | null;
  me: { points: number; alias: string | null; publicName: string; shortName: string; title: string | null; look: string | null };
};

function entry(s: Student | undefined, rank: number, points: number, me: boolean, real: boolean, key: string): BoardEntry {
  return { key, rank, name: s ? (real ? s.fullName : s.publicName) : "Student", title: s?.title ?? null, look: s?.look ?? null, points, me };
}

/** Rank `ids` on points (ties share a place) and keep the top 10 plus me ±1. */
function windowed(ids: readonly string[], pts: ReadonlyMap<string, number>, me: string, by: ReadonlyMap<string, Student>, real: boolean, prefix: string) {
  const ranked = rankGroup(ids.map((id) => ({ userId: id, tier: 1 as Tier, points: pts.get(id) ?? 0 })));
  const idx = ranked.findIndex((r) => r.userId === me);
  const keep = boardWindow(ranked.length, idx, 10);
  const entries = keep.map((k, j) => ({ ...entry(by.get(ranked[k].userId), ranked[k].rank, ranked[k].points, k === idx, real, `${prefix}${k}`), gapBefore: j > 0 && k - keep[j - 1] > 1 }));
  return { entries, myRank: idx >= 0 ? ranked[idx].rank : null, total: ranked.length };
}

/** The month's percentile delta: now vs the last snapshot before the month began (or the first one this month). */
async function monthDelta(admin: ReturnType<typeof createAdminClient>, userId: string, month: string, now: number): Promise<number | null> {
  try {
    const before = await admin.from("standing_snapshots").select("percentile, taken_on").eq("user_id", userId).lt("taken_on", month).order("taken_on", { ascending: false }).limit(1);
    if (before.error) return null;
    let base = before.data?.[0]?.percentile as number | null | undefined;
    if (base == null) {
      const first = await admin.from("standing_snapshots").select("percentile, taken_on").eq("user_id", userId).gte("taken_on", month).order("taken_on", { ascending: true }).limit(1);
      base = first.data?.[0]?.percentile as number | null | undefined;
    }
    return base == null ? null : now - base;
  } catch {
    return null;
  }
}

export const loadMyLeague = cache(async (userId: string, at?: string): Promise<MyLeague> => {
  const admin = createAdminClient();
  const now = at ? new Date(at) : new Date();
  const today = istToday(now);
  const week = leagueWeek(now);
  const month = monthOf(today);
  const students = await loadStudents(admin);
  const by = new Map(students.map((s) => [s.id, s]));
  const [[weekPts, monthPts], groups, standing, cohortNames] = await Promise.all([
    pointsWindows(admin, [
      [week, addDays(week, 7)],
      [month, nextMonth(month)],
    ]),
    leagueGroups(admin, week, students),
    loadStanding().catch(() => ({ rows: [] as { userId: string; points: number }[] })),
    admin
      .from("cohorts")
      .select("id, name")
      .then((r) => (r.error ? [] : ((r.data ?? []) as { id: string; name: string }[])), () => [] as { id: string; name: string }[]),
  ]);
  const wp = new Map([...weekPts].map(([k, v]) => [k, v.total]));
  const mp = new Map([...monthPts].map(([k, v]) => [k, v.total]));
  const me = by.get(userId);

  // My league group: relative view.
  const mine = groups.groups.find((g) => g.userId === userId);
  const members = mine ? groups.groups.filter((g) => g.groupNo === mine.groupNo) : [];
  const tier = mine ? groupTier(members) : (1 as Tier);
  const ranked = rankGroup(members.map((g) => ({ userId: g.userId, tier: g.tier, points: wp.get(g.userId) ?? 0 })));
  const myIdx = ranked.findIndex((r) => r.userId === userId);
  const view = relativeView(ranked.length, myIdx).map((v) => (v.kind === "row" ? { ...v, entry: entry(by.get(ranked[v.index].userId), ranked[v.index].rank, ranked[v.index].points, v.index === myIdx, false, `l${v.index}`) } : v));
  const myTier = mine?.tier ?? 1;

  // Cohort board: real names, my first cohort.
  const cohortId = me?.cohortIds[0] ?? null;
  const cohort = cohortId
    ? { name: cohortNames.find((c) => c.id === cohortId)?.name ?? "Your cohort", ...windowed(students.filter((s) => s.cohortIds.includes(cohortId)).map((s) => s.id), wp, userId, by, true, "c") }
    : null;

  // Platform board: everyone, alias if set.
  const platform = windowed(students.map((s) => s.id), wp, userId, by, false, "p");

  // Private percentile on all-time overall points.
  const allPts = standing.rows.filter((r) => by.has(r.userId)).map((r) => r.points);
  const myPts = standing.rows.find((r) => r.userId === userId)?.points ?? 0;
  const pct = percentileOf(myPts, allPts.length ? allPts : [myPts]);
  const delta = await monthDelta(admin, userId, month, pct.percentile);

  // Batch war: this month.
  const memberIds = new Map<string, string[]>();
  for (const s of students) for (const c of s.cohortIds) memberIds.set(c, [...(memberIds.get(c) ?? []), s.id]);
  const war = batchWar(cohortNames, memberIds, mp).map((w) => ({ ...w, mine: Boolean(me?.cohortIds.includes(w.cohortId)) }));

  return {
    week,
    daysLeft: daysLeftInWeek(today),
    tier,
    tierName: tierName(tier),
    groupSize: ranked.length,
    league: {
      view,
      cut: zoneSize(ranked.length),
      zone: zoneNote(
        ranked.map((r) => r.points),
        myIdx,
        myTier,
      ),
      promotionAt: promotionLine(ranked),
      myRank: myIdx >= 0 ? ranked[myIdx].rank : null,
    },
    cohort,
    platform,
    percentile: { line: percentileLine(pct, delta), value: pct.percentile, topPct: pct.topPct },
    war: { month: monthLabel(month), entries: war },
    lastWeek: groups.closed.get(userId) ?? null,
    me: { points: wp.get(userId) ?? 0, alias: me?.alias ?? null, publicName: me?.publicName ?? "You", shortName: me?.shortName ?? "your first name", title: me?.title ?? null, look: me?.look ?? null },
  };
});
