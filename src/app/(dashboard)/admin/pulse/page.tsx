import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { PulseView } from "./pulse-view";
import { loadActivity } from "@/lib/analytics/activity";
import { latest, presenceOf } from "@/lib/people/presence";

export const dynamic = "force-dynamic";

/**
 * /admin/pulse (v5.1 A6) — instrument the humans, not just the servers.
 * Drifting (7+ days silent), Stuck (failing a dimension repeatedly), Flying
 * (finished everything), cohort curve, one-tap nudge. Activity drop + load
 * spike = curriculum problem, not motivation.
 *
 * Last-activity is read from the student_last_activity VIEW — a per-student
 * max(timestamp) aggregate across sim sessions / check-ins / journal entries,
 * computed in the DB. The old page folded unordered .limit(500) samples in JS
 * (and its sim_sessions query referenced a column that doesn't exist), so the
 * drifting/flying/active counts were wrong. Now: one bounded row per student.
 */
export default async function AdminPulsePage() {
  // Defence in depth: layouts don't re-render on every navigation, so the page
  // re-checks admin itself before reading data.
  if (!(await requireAdmin())) redirect("/dashboard");
  const admin = createAdminClient();

  const [{ data: activity }, { data: checkinsAgg }, { rows: seen }] = await Promise.all([
    admin.from("student_last_activity").select("user_id, email, last_active_at"),
    admin.from("checkins_aggregate").select("*").order("week_label", { ascending: false }).limit(4),
    loadActivity(),
  ]);

  const now = new Date().getTime();
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Cohort progress"
        description="Who's gone quiet, who's behind, and who's finished everything. The view that decides whether Cohort One succeeds."
      />
      <div className="mt-6">
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
