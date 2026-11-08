import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { PulseView } from "./pulse-view";
import { loadActivity } from "@/lib/analytics/activity";
import { latest, presenceOf } from "@/lib/people/presence";
import { loadStanding } from "@/lib/standing/board";
import { parseQuietDays, type NudgeStudent } from "@/lib/nudge/select";
import { emailConfigured } from "@/lib/nudge/send";
import { nowMs } from "@/lib/crm/people";
import { QuietPanel } from "./quiet-panel";

export const dynamic = "force-dynamic";

/**
 * /admin/pulse (v5.1 A6): instrument the humans, not just the servers.
 * Drifting (7+ days silent), Stuck (failing a dimension repeatedly), Flying
 * (finished everything), cohort curve, one-tap nudge. Activity drop + load
 * spike = curriculum problem, not motivation.
 *
 * Last-activity is read from the student_last_activity VIEW: a per-student
 * max(timestamp) aggregate across sim sessions / check-ins / journal entries,
 * computed in the DB. The old page folded unordered .limit(500) samples in JS
 * (and its sim_sessions query referenced a column that doesn't exist), so the
 * drifting/flying/active counts were wrong. Now: one bounded row per student.
 *
 * The main thing on the page is "Email students who've gone quiet"
 * (quiet-panel.tsx): pre-ticks quiet / never-started students for the chosen
 * cohort (?cohort=) and days (?days=), and sends one email each.
 */
export default async function AdminPulsePage({ searchParams }: { searchParams: Promise<{ cohort?: string; days?: string }> }) {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
  const admin = createAdminClient();

  const sp = await searchParams;

  const [{ data: activity }, { data: checkinsAgg }, { rows: seen }, { rows: standing }, cohortsRes] = await Promise.all([
    admin.from("student_last_activity").select("user_id, email, last_active_at"),
    admin.from("checkins_aggregate").select("*").order("week_label", { ascending: false }).limit(4),
    loadActivity(),
    loadStanding(),
    admin.from("cohorts").select("id, name").order("created_at", { ascending: true }),
  ]);

  const now = nowMs();
  const DAY = 86400000;

  // Last moment on VIBHA = the latest of page time, lectures, practice
  // (from Activity) and check-ins / journal (from the view). Test and robot
  // accounts are already left out of Activity, so only real students count.
  const viewLast = new Map((activity ?? []).map((a) => [a.user_id as string, (a.last_active_at as string | null) ?? null]));
  const rows = seen.map((r) => {
    const last = latest(r.lastSeen, viewLast.get(r.id));
    const ts = last ? new Date(last).getTime() : null;
    return {
      user_id: r.id,
      email: r.email,
      name: r.name,
      last,
      daysSilent: ts === null ? null : Math.floor((now - ts) / DAY),
    };
  });

  // Quiet-student email: platform hours and cohorts come from the standing totals.
  const standingById = new Map(standing.map((s) => [s.userId, s]));
  const statusById = new Map(seen.map((r) => [r.id, r.status]));
  const cohorts = cohortsRes.error ? [] : (cohortsRes.data ?? []).map((c) => ({ id: c.id as string, name: String(c.name) }));
  const quietStudents: NudgeStudent[] = rows.map((r) => ({
    id: r.user_id,
    name: r.name,
    email: r.email,
    cohortIds: standingById.get(r.user_id)?.cohortIds ?? [],
    lastActiveAt: r.last,
    hours: standingById.get(r.user_id)?.hours ?? 0,
    status: statusById.get(r.user_id) ?? null,
    role: "student",
  }));
  const initialCohort = sp.cohort && cohorts.some((c) => c.id === sp.cohort) ? sp.cohort : "all";

  const drifted = rows
    .filter((r): r is typeof r & { daysSilent: number } => r.daysSilent !== null && r.daysSilent >= 7)
    .sort((a, b) => b.daysSilent - a.daysSilent);
  const flying = rows.filter((r) => r.daysSilent !== null && r.daysSilent < 2).map((r) => r.email);
  const activeNow = rows.filter((r) => presenceOf(r.last, now) === "now").map((r) => r.name);

  const weeks = (checkinsAgg ?? []).map((w) => ({
    week: String(w.week_label),
    n: Number(w.n_responses ?? 0),
    workload: Number(w.avg_workload ?? 0),
    energy: Number(w.avg_energy ?? 0),
    preparedness: Number(w.avg_preparedness ?? 0),
  }));
  const recentWeeks = weeks.slice(0, 2);
  const curriculumFlag =
    recentWeeks.length === 2 &&
    recentWeeks[0].workload > recentWeeks[1].workload &&
    recentWeeks[0].n < recentWeeks[1].n;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Cohort progress"
        description="Who's gone quiet, and a quick way to email them."
      />
      <div className="mt-6">
        <QuietPanel
          students={quietStudents}
          cohorts={cohorts}
          initialCohort={initialCohort}
          initialDays={parseQuietDays(sp.days)}
          todayIso={new Date(now).toISOString()}
          emailReady={emailConfigured()}
        />
      </div>
      <h2 className="mt-10 text-h3 font-bold tracking-tight">Overview</h2>
      <div className="mt-3">
        <PulseView
          drifting={drifted.map((d) => ({ email: d.email, daysSilent: d.daysSilent }))}
          flying={flying}
          total={rows.length}
          active={rows.filter((r) => r.daysSilent !== null && r.daysSilent < 7).length}
          activeNow={activeNow}
          weeks={weeks}
          curriculumFlag={curriculumFlag}
        />
      </div>
    </div>
  );
}
