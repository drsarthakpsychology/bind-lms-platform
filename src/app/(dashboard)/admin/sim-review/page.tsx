import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/design-system/page-header";
import { SimReviewList } from "./sim-review-list";

export const dynamic = "force-dynamic";

/**
 * /admin/sim-review — review simulated-patient sessions (v3 Part 6.1).
 * Each row: the transcript + AI score, labelled "AI-generated — reviewed by
 * faculty" / "pending faculty review". Faculty comment sits on top of the AI
 * score (never replaces it silently).
 */
export default async function SimReviewPage() {
  const admin = createAdminClient();

  const { data: scores } = await admin
    .from("sim_scores")
    .select("id, session_id, user_id, overall, rubric, quotes, missed_disclosures, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  // Load student emails for display.
  const studentIds = [...new Set((scores ?? []).map((s) => s.user_id))];
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email")
    .in("id", studentIds);

  const emailBy = new Map((profiles ?? []).map((p) => [p.id, p.email]));

  // Load transcripts for each session (limited to recent).
  const sessionIds = [...new Set((scores ?? []).map((s) => s.session_id))];
  const { data: turns } = await admin
    .from("sim_turns")
    .select("session_id, role, content, created_at")
    .in("session_id", sessionIds)
    .order("created_at", { ascending: true });

  const turnsBySession = new Map<string, Array<{ role: string; content: string }>>();
  for (const t of turns ?? []) {
    const list = turnsBySession.get(t.session_id) ?? [];
    list.push({ role: String(t.role), content: String(t.content) });
    turnsBySession.set(t.session_id, list);
  }

  // Existing faculty corrections — pre-fill comments + corrected scores so
  // re-edits accumulate instead of clobbering (feedback loop, Part 3.4).
  const { data: corrections } = await admin
    .from("scoring_corrections")
    .select("session_id, note, corrected")
    .in("session_id", sessionIds)
    .order("created_at", { ascending: true });

  const noteBySession = new Map<string, string>();
  const correctedBySession = new Map<string, number | null>();
  for (const c of corrections ?? []) {
    const corrected = c.corrected;
    const value = typeof corrected === "number" ? corrected : null;
    // Later corrections win; a note-only row ({} corrected) shows the note
    // without touching an earlier score correction.
    if (typeof corrected === "number" && correctedBySession.get(c.session_id) == null) {
      correctedBySession.set(c.session_id, value);
    }
    if (c.note) noteBySession.set(c.session_id, String(c.note));
  }

  const rows = (scores ?? []).map((s) => ({
    id: s.id,
    sessionId: s.session_id,
    studentEmail: emailBy.get(s.user_id) ?? "student",
    overall: s.overall,
    rubric: (s.rubric as Record<string, unknown> | null) ?? {},
    transcript: turnsBySession.get(s.session_id) ?? [],
    createdAt: s.created_at,
    note: noteBySession.get(s.session_id),
    correctedOverall: correctedBySession.get(s.session_id) ?? null,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Practice sessions"
        description="AI-generated scores, always labelled. Faculty comment sits on top."
      />
      <div className="mt-6">
        <SimReviewList rows={rows} />
      </div>
    </div>
  );
}
