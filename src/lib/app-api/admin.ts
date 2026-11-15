import "server-only";
import { loadRoster, type RosterRow } from "@/lib/people/roster-data";
import { loadHiddenIds } from "@/lib/people/hidden-ids";
import { loadLive } from "@/lib/analytics/live";
import { openComplaintCount } from "@/lib/doubts/data";
import type { AdminHome, AdminStudentRow } from "./contract";

/**
 * Admin screens for the app, read from the website's own admin loaders
 * (loadRoster for the Students table, loadLive for who is on now,
 * openComplaintCount). Test and robot accounts are left out, as on the
 * website's admin Home.
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
    flags: r.flags,
  };
}

export async function realRoster(): Promise<RosterRow[]> {
  const [roster, hidden] = await Promise.all([loadRoster(), loadHiddenIds()]);
  return roster.rows.filter((r) => !hidden.has(r.id));
}

export async function adminHome(): Promise<AdminHome> {
  const [rows, live, complaints] = await Promise.all([realRoster(), loadLive(), openComplaintCount().catch(() => 0)]);
  // Needs a look first: anything flagged, most flags first.
  const needs = rows.filter((r) => r.flags.length).sort((a, b) => b.flags.length - a.flags.length);
  return {
    v: 1,
    counts: {
      students: rows.length,
      activeThisWeek: rows.filter((r) => r.presence === "now" || r.presence === "today" || r.presence === "week").length,
      onNow: live.filter((l) => rows.some((r) => r.id === l.userId)).length,
      needsLook: needs.length,
      locked: rows.filter((r) => r.blocked).length,
      openComplaints: complaints,
    },
    needsLook: needs.slice(0, 20).map(studentRow),
    live: live.map((l) => ({ userId: l.userId, name: rows.find((r) => r.id === l.userId)?.name ?? null, where: l.where, lessonId: l.lessonId, since: l.since, watching: l.watching })),
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
