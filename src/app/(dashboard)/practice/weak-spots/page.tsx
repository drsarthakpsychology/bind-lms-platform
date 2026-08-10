import { createClient } from "@/lib/supabase/server";
import { analyzeWeakSpots } from "@/lib/practice/weak-spots";
import { WeakSpotsView } from "./weak-spots-view";

export const dynamic = "force-dynamic";

/**
 * /practice/weak-spots — the student's consistent gaps across sim debriefs,
 * with a drill-down into the practice tool for each weak skill.
 */
export default async function WeakSpotsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: scores } = await supabase
    .from("sim_scores")
    .select("rubric")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const rubrics = (scores ?? []).map((s) => (s.rubric ?? {}) as Record<string, unknown>);
  const spots = analyzeWeakSpots(rubrics);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <p className="text-eyebrow text-muted-foreground">Weak spots</p>
      <h1 className="mt-1 text-h1">Where you miss, drill here</h1>
      <p className="mt-1 text-small text-muted-foreground">
        Your sim debriefs, analysed. The skills you keep missing, ranked, with the exact tool
        that fixes them.
      </p>

      <div className="mt-6">
        <WeakSpotsView spots={spots} sessions={rubrics.length} />
      </div>
    </div>
  );
}
