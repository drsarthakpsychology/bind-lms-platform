import "server-only";
import { loadRoster, type RosterRow } from "@/lib/people/roster-data";
import { loadHiddenIds } from "@/lib/people/hidden-ids";
import { FLAG_LABEL, isBehind } from "@/lib/people/attention";
import { loadLive, type LiveRow } from "@/lib/analytics/live";
import { loadActivity } from "@/lib/analytics/activity";
import { loadAdminOverview } from "@/lib/admin/overview";
import { toAppTarget } from "./target";
import type { AdminActivity, AdminAttention, AdminHomeData, AdminStudentRow, AttentionFlag } from "./contract-practise-admin";

/**
 * Admin screens for the app, read from the website's own admin loaders:
 * loadAdminOverview (the admin Home's numbers, moved out of the page),
 * loadRoster (the Students table), loadLive (who is on now), loadActivity.
 * Test and robot accounts are left out, as on the website's admin pages.
 */
export function studentRow(r: RosterRow): AdminStudentRow {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    rollNumber: r.roll,
    mobileNumber: r.mobile,
    scope: r.scope,
    blocked: r.blocked,
    expiresAt: r.expiresAt,
    account: r.account,
    presence: r.presence,
    lastSeen: r.lastSeen,
    cohorts: r.cohorts,
    minutes7: r.min7,
    activeDays30: r.activeDays30,
    lecturesDone: r.lecturesDone,
    lecturesAvailable: r.lecturesAvailable,
    xp: r.xp,
    flags: r.flags as AttentionFlag[],
    status: r.blocked || r.account === "locked" ? "paused" : r.account === "expired" ? "ended" : "active",
    progressPct: r.lecturesAvailable ? Math.round((r.lecturesDone / r.lecturesAvailable) * 100) : 0,
    lecturesOnly: r.scope === "lectures_only",
    cohort: r.cohorts[0]?.name ?? null,
  };
}

export async function realRoster(): Promise<RosterRow[]> {
  const [roster, hidden] = await Promise.all([loadRoster(), loadHiddenIds()]);
  return roster.rows.filter((r) => !hidden.has(r.id));
}

/** "Mon, 16 Nov" in India time. */
export function istDateLine(now = new Date()): string {
  return now.toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short" }).replace(/^(\w+) /, "$1, ");
}

/** Needs a look: anything flagged, most flags first, in the website's words. */
export function attention(rows: RosterRow[], max = 20): AdminAttention[] {
  return rows
    .filter((r) => r.flags.length)
    .sort((a, b) => b.flags.length - a.flags.length)
    .slice(0, max)
    .map((r) => ({ id: r.id, studentId: r.id, name: r.name, reason: r.flags.map((f) => FLAG_LABEL[f]).join(" · "), since: r.lastSeen, flags: r.flags as AttentionFlag[] }));
}

function liveRows(overviewLive: { id: string; name: string; meta: string }[], live: LiveRow[], hidden: Set<string>): AdminHomeData["live"] {
  // The website's Home list (on now, from the roster), with where they are from loadLive.
  const where = new Map(live.map((l) => [l.userId, l]));
  return overviewLive
    .filter((r) => !hidden.has(r.id))
    .map((r) => {
      const l = where.get(r.id);
      return { userId: r.id, name: r.name, meta: r.meta, where: l?.where ?? null, lessonId: l?.lessonId ?? null, since: l?.since ?? null, watching: Boolean(l?.watching) };
    });
}

function cohortCards(rows: RosterRow[], cohorts: { id: string; name: string; status: string | null }[]): AdminHomeData["cohorts"] {
  return cohorts
    .filter((c) => c.status !== "ended")
    .map((c) => {
      const m = rows.filter((r) => r.cohorts.some((x) => x.id === c.id));
      const done = m.reduce((a, r) => a + r.lecturesDone, 0);
      const avail = m.reduce((a, r) => a + r.lecturesAvailable, 0);
      return {
        id: c.id,
        name: c.name,
        members: m.length,
        week: m.filter((r) => r.presence === "now" || r.presence === "today" || r.presence === "week").length,
        behind: m.filter((r) => r.account === "active" && isBehind(r.lecturesDone, r.lecturesAvailable)).length,
        pct: avail ? Math.round((done / avail) * 100) : 0,
      };
    });
}

export async function adminHome(canWrite: boolean): Promise<AdminHomeData> {
  const [o, live, hidden] = await Promise.all([loadAdminOverview(), loadLive(), loadHiddenIds()]);
  const rows = o.roster.rows.filter((r) => !hidden.has(r.id));
  const needs = attention(rows);
  const doubtsOpen = o.actions.find((a) => a.href === "/admin/inbox")?.count ?? 0;
  return {
    v: 1,
    dateLine: istDateLine(),
    todo: o.todo.map((a, i) => ({ id: `${i}:${a.href}`, label: a.label, count: a.count, detail: a.detail, target: toAppTarget(a.href), urgent: a.urgent })),
    totalToDo: o.totalToDo,
    needsLook: rows.filter((r) => r.flags.length).sort((a, b) => b.flags.length - a.flags.length).slice(0, 20).map(studentRow),
    attention: needs,
    live: liveRows(o.live, live, hidden),
    cohorts: o.cohortCards,
    counts: {
      students: o.students,
      activeThisWeek: o.activeThisWeek,
      onNow: o.onNow,
      neverIn: o.neverIn,
      needsLook: rows.filter((r) => r.flags.length).length,
      locked: rows.filter((r) => r.blocked).length,
      openComplaints: o.complaints,
      dbPct: o.dbPct,
    },
    today: { active: o.activeThisWeek, total: o.students, lecturesWatched: null, doubtsOpen, submissionsToGrade: o.pendingSubmissions },
    canWrite,
  };
}

/** Search and filter the Students table. Pure. */
export function filterStudents(rows: AdminStudentRow[], q: { search?: string | null; cohort?: string | null; flag?: string | null }): AdminStudentRow[] {
  const s = (q.search ?? "").trim().toLowerCase();
  return rows.filter(
    (r) =>
      (!s || r.name.toLowerCase().includes(s) || r.email.toLowerCase().includes(s) || (r.rollNumber ?? "").toLowerCase().includes(s) || (r.mobileNumber ?? "").includes(s)) &&
      (!q.cohort || r.cohorts.some((c) => c.id === q.cohort)) &&
      (!q.flag || (r.flags as string[]).includes(q.flag)),
  );
}

const VIEWS = ["live", "behind", "cohorts", "all"] as const;
export const activityView = (v: string | null): AdminActivity["view"] => ((VIEWS as readonly string[]).includes(v ?? "") ? (v as AdminActivity["view"]) : "all");


/** Activity: on now, falling behind, cohorts, and the 30-day rows. */
export async function adminActivity(view: AdminActivity["view"]): Promise<AdminActivity> {
  const [roster, hidden, live, activity] = await Promise.all([loadRoster(), loadHiddenIds(), loadLive(), view === "all" ? loadActivity() : Promise.resolve(null)]);
  const rows = roster.rows.filter((r) => !hidden.has(r.id));
  const onNow = rows.filter((r) => r.presence === "now").map((r) => ({ id: r.id, name: r.name, meta: r.cohorts.length ? r.cohorts.map((c) => c.name).join(", ") : (r.roll ?? "") }));
  const liveList = liveRows(onNow, live, hidden);
  const behind = rows
    .filter((r) => r.account === "active" && isBehind(r.lecturesDone, r.lecturesAvailable))
    .sort((a, b) => String(a.lastSeen ?? "").localeCompare(String(b.lastSeen ?? "")))
    .map(studentRow);
  const names = new Map(rows.map((r) => [r.id, r.name]));
  const realRows = activity ? activity.rows.filter((r) => !hidden.has(r.id)) : [];
  return {
    v: 1,
    kind: "admin.activity",
    data: activity ? ({ ...activity, rows: realRows, live: live.filter((l) => !hidden.has(l.userId)) } as unknown as Record<string, unknown>) : null,
    view,
    live: liveList,
    behind,
    cohorts: cohortCards(rows, roster.cohorts),
    rows: realRows as unknown as Record<string, unknown>[],
    items: live
      .filter((l) => !hidden.has(l.userId) && names.has(l.userId))
      .map((l) => ({ id: `${l.userId}:${l.since}`, at: l.since, who: names.get(l.userId) ?? "", what: l.where, kind: l.watching || l.lessonId ? ("lecture" as const) : ("study" as const) })),
  };
}
