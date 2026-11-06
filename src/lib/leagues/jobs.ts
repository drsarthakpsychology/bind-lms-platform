import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { addDays } from "@/lib/learn/engine";
import { istToday } from "@/lib/practice/streaks";
import { loadStanding } from "@/lib/standing/board";
import { sendNotifications } from "@/lib/notify/send";
import { awardEligibleBadges, ensureBadgeCatalog } from "@/lib/achievements/server";
import { issueMeritCertificate, meritAchievement } from "@/lib/achievements/merit";
import { closeRows, leagueGroups, loadStudents, loadWeekRows, pointsBetween, type Student } from "./data";
import { percentileLine, percentileOf } from "./percentile";
import { zoneNote } from "./relative";
import { buildStandingUpdate, type Snapshot } from "./standing-update";
import { clampTier, groupTier, rankGroup } from "./tiers";
import { championTitle, champions, meritWinners } from "./monthly";
import { leagueWeek, monthLabel, monthOf, nextMonth, previousMonth, previousWeek, weekdayIndex } from "./week";

/**
 * The scheduled jobs behind leagues:
 * - runStandingJob (Mon + Thu 19:00 IST): on Mondays it first closes last
 *   week and opens this week's groups; then it saves points, sends each
 *   student one short standing update, takes a snapshot for next time and
 *   awards any milestones now earned.
 * - runMonthlyJob (1st of the month): merit certificates and champion titles
 *   for the month that just ended.
 * Every step is idempotent, so a re-run never doubles anything.
 */

type Admin = ReturnType<typeof createAdminClient>;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function inChunks<T>(items: readonly T[], size: number, fn: (x: T) => Promise<unknown>) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map((x) => fn(x).catch(() => undefined)));
}

/** Close `week` (points, final place, result). Returns false if it was already closed or has no rows. */
export async function closeWeek(admin: Admin, week: string): Promise<{ closed: number; error: string | null }> {
  const { rows, ready } = await loadWeekRows(admin, week);
  if (!ready) return { closed: 0, error: "league_weeks is missing (run 2026_11_leagues.sql)." };
  if (!rows.length || rows.every((r) => r.result)) return { closed: 0, error: null };
  const pts = await pointsBetween(admin, week, addDays(week, 7));
  const done = closeRows(rows, new Map([...pts].map(([k, v]) => [k, v.total])));
  const groupOf = new Map(rows.map((r) => [r.user_id, r.group_no]));
  const now = new Date().toISOString();
  const upd = done.map((c) => ({ week, user_id: c.userId, tier: c.tier, group_no: groupOf.get(c.userId) ?? 1, points: c.points, final_rank: c.rank, result: c.result, updated_at: now }));
  for (let i = 0; i < upd.length; i += 500) {
    const { error } = await admin.from("league_weeks").upsert(upd.slice(i, i + 500), { onConflict: "week,user_id" });
    if (error) return { closed: i, error: error.message };
  }
  return { closed: upd.length, error: null };
}

/** Write this week's groups (once) and the latest points. */
async function saveWeek(admin: Admin, week: string, students: readonly Student[], points: ReadonlyMap<string, number>) {
  const g = await leagueGroups(admin, week, students);
  const now = new Date().toISOString();
  const rows = g.groups.map((x) => ({ week, user_id: x.userId, tier: x.tier, group_no: x.groupNo, points: points.get(x.userId) ?? 0, updated_at: now }));
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await admin.from("league_weeks").upsert(rows.slice(i, i + 500), { onConflict: "week,user_id" });
    if (error) return { groups: g, error: error.message };
  }
  return { groups: g, error: null as string | null };
}

type SnapRow = { user_id: string; taken_on: string; week: string; league_rank: number | null; points: number; percentile: number | null; ahead: string[] | null };

export type StandingReport = { week: string; monday: boolean; closed: number; students: number; notified: number; snapshots: number; badges: number; catalog: number; errors: string[] };

export async function runStandingJob(now: Date = new Date(), opts: { notify?: boolean } = {}): Promise<StandingReport> {
  const admin = createAdminClient();
  const today = istToday(now);
  const week = leagueWeek(now);
  const monday = weekdayIndex(today) === 0;
  const errors: string[] = [];
  const report: StandingReport = { week, monday, closed: 0, students: 0, notified: 0, snapshots: 0, badges: 0, catalog: 0, errors };

  const cat = await ensureBadgeCatalog(admin).catch((e) => ({ added: 0, error: String(e) }));
  report.catalog = cat.added;
  if (cat.error) errors.push(`badges: ${cat.error}`);

  // 1. Monday: close last week before anything reads this week's tiers.
  if (monday) {
    const c = await closeWeek(admin, previousWeek(week));
    report.closed = c.closed;
    if (c.error) errors.push(c.error);
  }

  // 2. Points now, and this week's groups.
  const students = await loadStudents(admin);
  report.students = students.length;
  const pts = await pointsBetween(admin, week, addDays(week, 7));
  const wp = new Map([...pts].map(([k, v]) => [k, v.total]));
  const { groups, error } = await saveWeek(admin, week, students, wp);
  if (error) errors.push(`league_weeks: ${error}`);

  // 3. Percentiles (private) on all-time overall points.
  const by = new Map(students.map((s) => [s.id, s]));
  const standing = await loadStanding().catch(() => ({ rows: [] as { userId: string; points: number }[] }));
  const overall = new Map(standing.rows.filter((r) => by.has(r.userId)).map((r) => [r.userId, r.points]));
  const allOverall = [...overall.values()];

  // 4. Earlier snapshots (for "passed you" and the month's percentile change).
  const month = monthOf(today);
  const snaps = await admin
    .from("standing_snapshots")
    .select("user_id, taken_on, week, league_rank, points, percentile, ahead")
    .gte("taken_on", addDays(month, -45))
    .lt("taken_on", today)
    .order("taken_on", { ascending: true })
    .limit(50000);
  const snapReady = !snaps.error;
  if (snaps.error) errors.push(`standing_snapshots: ${snaps.error.message}`);
  const past = new Map<string, SnapRow[]>();
  for (const s of (snaps.data ?? []) as SnapRow[]) past.set(s.user_id, [...(past.get(s.user_id) ?? []), s]);

  const names = new Map(students.map((s) => [s.id, s.publicName]));
  const byGroup = new Map<number, string[]>();
  for (const g of groups.groups) byGroup.set(g.groupNo, [...(byGroup.get(g.groupNo) ?? []), g.userId]);
  const tierOf = new Map(groups.groups.map((g) => [g.userId, g.tier]));

  const snapshots: SnapRow[] = [];
  const messages: { userId: string; title: string; body: string }[] = [];
  for (const [, ids] of byGroup) {
    const ranked = rankGroup(ids.map((id) => ({ userId: id, tier: clampTier(tierOf.get(id)), points: wp.get(id) ?? 0 })));
    const tier = groupTier(ranked);
    const pointsList = ranked.map((r) => r.points);
    ranked.forEach((r, i) => {
      const ahead = ranked.filter((o) => o.points > r.points).map((o) => o.userId);
      const pct = percentileOf(overall.get(r.userId) ?? 0, allOverall.length ? allOverall : [0]);
      const mine = past.get(r.userId) ?? [];
      const baseline = [...mine].reverse().find((s) => s.taken_on < month) ?? mine.find((s) => s.taken_on >= month);
      const delta = baseline?.percentile == null ? null : pct.percentile - baseline.percentile;
      snapshots.push({ user_id: r.userId, taken_on: today, week, league_rank: r.rank, points: r.points, percentile: pct.percentile, ahead });
      const last = [...mine].reverse().find((s) => s.week === week);
      const closed = monday ? groups.closed.get(r.userId) ?? null : null;
      const active = r.points > 0 || (closed && closed.points > 0) || (last && last.points > 0);
      if (!active) return;
      const before: Snapshot | null = !monday && last && last.league_rank ? { rank: last.league_rank, points: last.points, ahead: last.ahead ?? [] } : null;
      const zone = zoneNote(pointsList, i, clampTier(tierOf.get(r.userId) ?? tier));
      const u = buildStandingUpdate({
        before,
        now: { rank: r.rank, points: r.points, ahead },
        groupPoints: pointsList,
        names,
        closed: closed ? { rank: closed.rank, tier: closed.tier, result: closed.result, nextTier: closed.nextTier } : null,
        zone: zone.kind === "none" ? null : zone.text,
        percentile: percentileLine(pct, delta),
      });
      messages.push({ userId: r.userId, ...u });
    });
  }

  // 5. One short in-app note each (no email).
  if (opts.notify !== false) {
    await inChunks(messages, 8, async (m) => {
      const res = await sendNotifications({ userIds: [m.userId], title: m.title, html: `<p>${esc(m.body)}</p><p><a href="/leaderboard">See your league</a></p>`, type: "message", sentBy: null, alsoEmail: false });
      if (!res.error) report.notified++;
      else if (!errors.includes(res.error)) errors.push(res.error);
    });
  }

  // 6. Snapshots for next time.
  if (snapReady) {
    for (let i = 0; i < snapshots.length; i += 500) {
      const { error: e } = await admin.from("standing_snapshots").upsert(snapshots.slice(i, i + 500), { onConflict: "user_id,taken_on" });
      if (e) errors.push(`snapshots: ${e.message}`);
      else report.snapshots += Math.min(500, snapshots.length - i);
    }
  }

  // 7. Milestones now earned (streaks, XP, leagues, duels, cases).
  const activeIds = [...new Set(messages.map((m) => m.userId))];
  await inChunks(activeIds, 5, async (id) => {
    const r = await awardEligibleBadges(admin, id, null);
    report.badges += r.awarded;
  });

  return report;
}

export type MonthlyReport = { month: string; certificates: number; titles: number; errors: string[] };

/** Merit certificates and champion titles for the month before `now`. */
export async function runMonthlyJob(now: Date = new Date()): Promise<MonthlyReport> {
  const admin = createAdminClient();
  const month = previousMonth(monthOf(istToday(now)));
  const label = monthLabel(month);
  const errors: string[] = [];
  const report: MonthlyReport = { month, certificates: 0, titles: 0, errors };

  const students = await loadStudents(admin);
  const by = new Map(students.map((s) => [s.id, s]));
  const pts = await pointsBetween(admin, month, nextMonth(month));
  const mp = new Map([...pts].filter(([id]) => by.has(id)).map(([k, v]) => [k, v.total]));

  // Merit: top 3 of each cohort.
  const memberIds = new Map<string, string[]>();
  for (const s of students) for (const c of s.cohortIds) memberIds.set(c, [...(memberIds.get(c) ?? []), s.id]);
  const winners = meritWinners(memberIds, mp);
  if (winners.size) {
    const ach = await meritAchievement(admin, month, label);
    if (!ach.id) errors.push(`merit: ${ach.error}`);
    else {
      const { data: profiles } = await admin.from("profiles").select("id, name, email, roll_number").in("id", [...winners.keys()]);
      const { data: cohorts } = await admin.from("cohorts").select("id, name");
      const cohortName = new Map((cohorts ?? []).map((c) => [c.id as string, c.name as string]));
      for (const p of profiles ?? []) {
        const w = winners.get(p.id as string)!;
        const r = await issueMeritCertificate(admin, ach.id, {
          userId: p.id as string,
          name: by.get(p.id as string)?.fullName ?? String(p.name ?? "Student"),
          email: p.email ? String(p.email) : null,
          rollNumber: (p.roll_number as string | null) ?? null,
          month,
          monthLabel: label,
          detail: `Place ${w.place} in ${cohortName.get(w.cohortId) ?? "their cohort"} for ${label}, with ${w.points} league points.`,
        });
        if (r.issued) report.certificates++;
        if (r.error) errors.push(`merit ${p.id}: ${r.error}`);
      }
    }
  }

  // Champion titles: the tier each student held in the month's last league week.
  const lastWeek = leagueWeek(new Date(`${addDays(nextMonth(month), -1)}T12:00:00+05:30`));
  const { rows } = await loadWeekRows(admin, lastWeek);
  const tiers = new Map<string, number>(students.map((s) => [s.id, 1]));
  for (const r of rows) if (tiers.has(r.user_id)) tiers.set(r.user_id, clampTier(r.tier));
  for (const [id, tier] of champions(tiers, mp)) {
    const title = championTitle(tier, label);
    if (by.get(id)?.title === title) continue;
    const { error } = await admin.from("profiles").update({ title }).eq("id", id);
    if (error) {
      errors.push(`title: ${error.message}`);
      continue;
    }
    report.titles++;
    await sendNotifications({ userIds: [id], title: `You're the ${title}`, html: `<p>Most league points in ${esc(title.split(" Champion")[0])} for ${esc(label)}. The title now shows next to your name.</p><p><a href="/leaderboard">See the leaderboard</a></p>`, type: "message", sentBy: null }).catch(() => undefined);
  }
  return report;
}
