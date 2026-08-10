import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { PulseView } from "./pulse-view";

export const dynamic = "force-dynamic";

/**
 * /admin/pulse (v5.1 A6) — instrument the humans, not just the servers.
 * Drifting (7+ days silent), Stuck (failing a dimension repeatedly), Flying
 * (finished everything), cohort curve, one-tap nudge. Activity drop + load
 * spike = curriculum problem, not motivation.
 */
export default async function AdminPulsePage() {
  const admin = createAdminClient();

  // Students + their last activity (from sim_sessions, checkins, journal).
  const [{ data: students }, { data: sessions }, { data: checkins }] = await Promise.all([
    admin.from("profiles").select("id, email").eq("role", "student"),
    admin.from("sim_sessions").select("user_id, created_at, status"),
    admin.from("checkins").select("user_id, created_at"),
  ]);

  const lastActivity = new Map<string, string>();
  for (const s of sessions ?? []) {
    const prev = lastActivity.get(s.user_id);
    if (!prev || String(s.created_at) > prev) lastActivity.set(s.user_id, String(s.created_at));
  }
  for (const c of checkins ?? []) {
    const prev = lastActivity.get(c.user_id);
    if (!prev || String(c.created_at) > prev) lastActivity.set(c.user_id, String(c.created_at));
  }

  const now = new Date().getTime();
  const DAY = 86400000;
  const rows = (students ?? []).map((s) => {
    const last = lastActivity.get(s.id);
    const daysSilent = last ? Math.floor((now - new Date(last).getTime()) / DAY) : Infinity;
    return { id: s.id, email: s.email, last, daysSilent };
  });

  const drifting = rows.filter((r) => r.daysSilent >= 7).sort((a, b) => b.daysSilent - a.daysSilent);
  const flying = rows.filter((r) => r.daysSilent < 2);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Cohort Pulse"
        description="Who's drifting, who's stuck, who's flying. The metric that determines whether Cohort One succeeds."
      />
      <div className="mt-6">
        <PulseView drifting={drifting.map((d) => ({ email: d.email, daysSilent: d.daysSilent }))} flying={flying.map((f) => f.email)} total={rows.length} active={rows.filter((r) => r.daysSilent < 7).length} />
      </div>
    </div>
  );
}
