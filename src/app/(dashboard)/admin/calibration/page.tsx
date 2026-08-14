import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { CalibrationList } from "./calibration-list";
import { AgreementDashboard } from "./agreement-dashboard";
import { provisionalKeys, weightedKappa } from "@/lib/practice/rubric";

export const dynamic = "force-dynamic";

/**
 * /admin/calibration — A3. Blind scoring UI so Dr. Sarthak can score
 * transcripts with the AI score hidden, then reveal both side by side.
 * Every disagreement writes to scoring_corrections, training the scorer.
 *
 * The agreement dashboard computes per-dimension weighted kappa between the
 * AI's rubric scores and Dr. Sarthak's blind scores, and shows which
 * dimensions are still provisional (number hidden from students).
 */
export default async function AdminCalibrationPage() {
  const admin = createAdminClient();

  const [{ data: scores }, { data: dims }] = await Promise.all([
    admin
      .from("sim_scores")
      .select("id, session_id, user_id, overall, rubric, created_at")
      .order("created_at", { ascending: false })
      .limit(30),
    admin.from("rubric_dimensions").select("key, label, status, agreement, n_scored"),
  ]);

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

  // The human side of the kappa pair: Dr. Sarthak's blind scores, stored as
  // scoring_corrections with a numeric `corrected` (the sim-corrections route
  // writes them). Kappa needs real paired human-vs-AI data — until he scores,
  // the dashboard honestly reports "no pairs yet".
  const { data: corrections } = await admin
    .from("scoring_corrections")
    .select("session_id, corrected")
    .in("session_id", (scores ?? []).map((s) => s.session_id));

  const correctedSessions = new Set((corrections ?? []).map((c) => c.session_id));

  const humanBySession = new Map<string, number>();
  for (const c of corrections ?? []) {
    if (typeof c.corrected === "number") humanBySession.set(c.session_id, c.corrected);
  }

  // Paired overall scores: AI (sim_scores.overall) vs human (correction).
  const aiOverall: number[] = [];
  const humanOverall: number[] = [];
  for (const s of scores ?? []) {
    const h = humanBySession.get(s.session_id);
    if (h != null && Number.isFinite(Number(s.overall))) {
      aiOverall.push(Number(s.overall));
      humanOverall.push(h);
    }
  }
  const overallKappa =
    aiOverall.length >= 2 ? weightedKappa(aiOverall, humanOverall) : null;

  // The dimensions + their live calibration status (kappa, count, gate).
  const dimensions = (dims ?? []).map((d) => ({
    key: String(d.key),
    label: String(d.label),
    status: String(d.status) as "provisional" | "validated",
    agreement: d.agreement != null ? Number(d.agreement) : null,
    nScored: Number(d.n_scored ?? 0),
  }));

  // The canonical shape for the rubric gate helpers.
  const rubricDims = dimensions.map((d) => ({
    key: d.key,
    label: d.label,
    status: d.status,
    agreement: d.agreement,
    n_scored: d.nScored,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Marking check"
        description="Mark a transcript, then reveal how the AI marked it. When you disagree, your score is what counts going forward."
      />
      <div className="mt-6">
        <AgreementDashboard
          dimensions={dimensions}
          provisionalKeys={provisionalKeys(rubricDims)}
          overallKappa={overallKappa}
        />
      </div>
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
