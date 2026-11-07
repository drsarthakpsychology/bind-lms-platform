import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { analyzeWeakSpots, generateDrill } from "@/lib/practice/weak-spots";
import { WeakSpotsView } from "./weak-spots-view";
import { WeakSpotsDrill } from "./weak-spots-drill";
import { readFlags, requireFeature, type FeatureKey } from "@/lib/flags";

export const dynamic = "force-dynamic";

/**
 * /practice/weak-spots: the student's consistent gaps across sim debriefs,
 * with a 10-item drill generated ON THE SPOT from the actual weak skills
 * (v5 §4: "Weak Spots must GENERATE a drill, not just report").
 */
export default async function WeakSpotsPage() {
  await requireFeature("weak_spots");
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
  // A remedy must never open a switched-off tool: fall back to the Consulting Room.
  const flags = await readFlags();
  const REMEDY_FLAG: Record<string, FeatureKey> = { "/practice/mse": "mse", "/practice/osce": "osce" };
  const spots = analyzeWeakSpots(rubrics).map((s) => {
    const flag = REMEDY_FLAG[s.remedyHref];
    return flag && flags[flag] !== "unlocked" ? { ...s, remedyHref: "/practice/consulting-room", remedyLabel: "Consulting Room: practise this in your next interview" } : s;
  });
  const drill = generateDrill(spots, 10);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href="/practice/consulting-room" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-link hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        Consulting Room
      </Link>
      <p className="text-eyebrow text-muted-foreground">Weak spots</p>
      <h1 className="mt-1 text-h1">Where you miss, drill here</h1>
      <p className="mt-1 text-small text-muted-foreground">
        From your AI patient interview debriefs: the skills you keep missing, ranked, and a
        10-item drill built from them.
      </p>

      <div className="mt-6">
        <WeakSpotsView spots={spots} sessions={rubrics.length} />
      </div>

      {drill.length > 0 ? (
        <div className="mt-8">
          <WeakSpotsDrill items={drill} />
        </div>
      ) : null}
    </div>
  );
}
