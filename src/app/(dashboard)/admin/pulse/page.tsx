import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { PulseView } from "./pulse-view";

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
  const admin = createAdminClient();

  const [{ data: activity }, { data: checkinsAgg }] = await Promise.all([
    admin.from("student_last_activity").select("user_id, email, last_active_at"),
    admin.from("checkins_aggregate").select("*").order("week_label", { ascending: false }).limit(4),
  ]);

  const now = new Date().getTime();
  const DAY = 86400000;

  // Null last_active_at = never started (no sim, no check-in, no journal).
  const rows = (activity ?? []).map((a) => {
    const ts = a.last_active_at ? new Date(String(a.last_active_at)).getTime() : null;
    const daysSilent = ts === null ? null : Math.floor((now - ts) / DAY);
    return {
      user_id: a.user_id,
      email: a.email,
      daysSilent,
    };
  });

  const drifted = rows
    .filter((r): r is { user_id: string; email: string; daysSilent: number } => r.daysSilent !== null && r.daysSilent >= 7)
    .sort((a, b) => b.daysSilent - a.daysSilent);
  const flying = rows.filter((r) => r.daysSilent !== null && r.daysSilent < 2).map((r) => r.email);

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
          weeks={weeks}
          curriculumFlag={curriculumFlag}
        />
      </div>
    </div>
  );
}
