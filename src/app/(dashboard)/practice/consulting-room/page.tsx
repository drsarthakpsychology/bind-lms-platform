import { createClient, createAdminClient } from "@/lib/supabase/server";

import { CasePicker, SafetyFirstSheet } from "./case-picker";
import { SimulationBadge } from "./simulation-badge";
import { requireFeature } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/consulting-room — pick a case and start a session.
 * The flagship tool. Lists published sim cases (hand-built seed first).
 */
export default async function ConsultingRoomPage() {
  await requireFeature("consulting_room");
  const admin = createAdminClient();
  const { data: published } = await admin
    .from("sim_cases")
    .select("id, title, difficulty, case_data, source")
    .eq("status", "published")
    .eq("approved", true)
    .order("created_at", { ascending: true });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Per-case session state for this student: any active session → in
  // progress; else the best completed debrief score.
  const mySessionsData: { id: string; case_id: string; status: string }[] | null = user
    ? await (async () => {
        const { data } = await supabase
          .from("sim_sessions")
          .select("id, case_id, status")
          .eq("user_id", user.id)
          .in("status", ["active", "complete"]);
        return (data ?? []) as { id: string; case_id: string; status: string }[];
      })()
    : null;
  const myScores = user
    ? await admin
        .from("sim_scores")
        .select("session_id, overall")
        .eq("user_id", user.id)
    : { data: null };
  const scoresBySession = new Map(
    (myScores?.data ?? []).map((s) => [String(s.session_id), Number(s.overall ?? 0)]),
  );
  const stateByCase = new Map<string, { state: "not_started" | "in_progress" | "completed"; score?: number }>();
  for (const s of mySessionsData ?? []) {
    const key = String(s.case_id);
    const existing = stateByCase.get(key);
    if (s.status === "active") {
      stateByCase.set(key, { state: "in_progress" });
    } else if (s.status === "complete" && existing?.state !== "in_progress") {
      stateByCase.set(key, { state: "completed", score: scoresBySession.get(String(s.id)) });
    }
  }

  const dbCases = published ?? [];
  // The DB is the source of truth (the authored character bank + the 8
  // clinical cases are all published/approved rows). The static SEED_CASES
  // merge is gone — it duplicated every title (once id="" from the seed,
  // once from the row). The card hook is the patient's OWN words; the
  // summary is the non-diagnostic clinical line.
  // Gamification: stars from the best score (>=7/10 = 3, >=5 = 2, >=3 = 1),
  // and difficulty-gated unlock progression driven by completed-case count.
  const completedCount = Array.from(stateByCase.values()).filter((s) => s.state === "completed").length;
  const UNLOCK_AT: Record<string, number> = { cooperative: 0, guarded: 2, resistant: 5, crisis: 8 };
  const scoreToStars = (score?: number | null): number => {
    if (typeof score !== "number") return 0;
    if (score >= 7) return 3;
    if (score >= 5) return 2;
    if (score >= 3) return 1;
    return 0;
  };

  const merged = dbCases.map((c) => {
    const data = c.case_data as { difficulty?: string; presentation?: string; chief_complaint_in_own_words?: string; identity?: { name?: string } };
    const difficulty = data.difficulty ?? "cooperative";
    const st = stateByCase.get(c.id);
    return {
      id: c.id,
      title: c.title,
      difficulty,
      summary: data.presentation ?? "",
      hook: data.chief_complaint_in_own_words ?? "",
      // `source` is the TOP-LEVEL sim_cases column, not a key inside case_data —
      // reading it from case_data always fell back to "corpus", so every card
      // footer wrongly said "Awaiting faculty review".
      source: (c.source ?? "corpus") === "hand_built" ? ("hand_built" as const) : ("corpus" as const),
      state: (st?.state ?? "not_started") as "not_started" | "in_progress" | "completed",
      score: st?.score ?? null,
      stars: st?.state === "completed" || st?.score != null ? scoreToStars(st?.score) : 0,
      unlocked: completedCount >= (UNLOCK_AT[difficulty] ?? 0) || st?.state !== "not_started",
      unlockAt: UNLOCK_AT[difficulty] ?? 0,
    };
  });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-eyebrow text-muted-foreground">Consulting Room</p>
          <h1 className="mt-1 text-h1">Choose your patient</h1>
          <p className="mt-1 max-w-prose text-small text-muted-foreground">
            Real presentations, real language. Your debrief shows you what you missed.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <SimulationBadge />
          <SafetyFirstSheet />
        </div>
      </div>

      <CasePicker cases={merged} />
    </div>
  );
}
