import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { CalibrationList } from "./calibration-list";

export const dynamic = "force-dynamic";

/**
 * /admin/calibration — A3. Blind scoring UI so Dr. Sarthak can score
 * transcripts with the AI score hidden, then reveal both side by side.
 * Every disagreement writes to scoring_corrections, training the scorer.
 */
export default async function AdminCalibrationPage() {
  const admin = createAdminClient();

  const { data: scores } = await admin
    .from("sim_scores")
    .select("id, session_id, user_id, overall, rubric, created_at")
    .order("created_at", { ascending: false })
    .limit(30);

  const { data: turns } = await admin
    .from("sim_turns")
    .select("session_id, role, content")
    .in("session_id", (scores ?? []).map((s) => s.session_id))
    .order("created_at", { ascending: true });

  const turnsBySession = new Map<string, Array<{ role: string; content: string }>>();
  for (const t of turns ?? []) {
    const list = turnsBySession.get(t.session_id) ?? [];
    list.push({ role: String(t.role), content: String(t.content) });
    turnsBySession.set(t.session_id, list);
  }

  const { data: corrections } = await admin
    .from("scoring_corrections")
    .select("session_id")
    .in("session_id", (scores ?? []).map((s) => s.session_id));

  const correctedSessions = new Set((corrections ?? []).map((c) => c.session_id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Scorer calibration"
        description="Score transcripts blind, reveal the AI score side by side. Disagreements train the scorer."
      />
      <div className="mt-6">
        <CalibrationList
          rows={(scores ?? []).map((s) => ({
            id: s.id,
            sessionId: s.session_id,
            overall: Number(s.overall),
            rubric: (s.rubric as Record<string, unknown>) ?? {},
            transcript: turnsBySession.get(s.session_id) ?? [],
            createdAt: s.created_at,
            alreadyCorrected: correctedSessions.has(s.session_id),
          }))}
        />
      </div>
    </div>
  );
}
