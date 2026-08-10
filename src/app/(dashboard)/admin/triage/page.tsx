import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { priorityScore, needsReview } from "@/lib/review/triage";
import { TriageView } from "./triage-view";

export const dynamic = "force-dynamic";

/**
 * /admin/triage (v5.1 A5) — surface only what needs human eyes. The queue
 * shows priority-scored items; everything else auto-releases with a visible
 * "AI-generated — not yet faculty reviewed" label.
 */
export default async function AdminTriagePage() {
  const admin = createAdminClient();

  const { data: scores } = await admin
    .from("sim_scores")
    .select("id, session_id, user_id, overall, rubric, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  // Count sessions per student (first-session detection) + count per student.
  const { data: allSessions } = await admin.from("sim_sessions").select("user_id, status");

  const sessionsByStudent = new Map<string, number>();
  for (const s of allSessions ?? []) sessionsByStudent.set(s.user_id, (sessionsByStudent.get(s.user_id) ?? 0) + 1);

  const rows = (scores ?? []).map((s) => {
    const isFirst = (sessionsByStudent.get(s.user_id) ?? 1) <= 1;
    const rubric = (s.rubric as Record<string, unknown>) ?? {};
    const premature = Number(rubric.premature_reassurance ?? 0);
    const input = {
      submissionId: s.id,
      isFirstSession: isFirst,
      concerning: premature > 2,
      repeatedFailure: false,
      aiConfidence: Number(s.overall) > 0 ? 0.6 : 0.3,
    };
    return {
      id: s.id,
      sessionId: s.session_id,
      overall: Number(s.overall),
      createdAt: s.created_at,
      priority: priorityScore(input),
      review: needsReview(input),
      premature,
    };
  });

  const needs = rows.filter((r) => r.review).sort((a, b) => b.priority - a.priority);
  const auto = rows.filter((r) => !r.review);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Review triage"
        description="Only what needs your eyes. The queue never shows more than 10 — the rest auto-releases with a label."
      />
      <div className="mt-6">
        <TriageView needs={needs.slice(0, 10)} autoReleased={auto.length} />
      </div>
    </div>
  );
}
