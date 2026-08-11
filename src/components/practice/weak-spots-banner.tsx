import Link from "next/link";
import { Radar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { analyzeWeakSpots } from "@/lib/practice/weak-spots";

/**
 * The dismissible weak-spots banner (B2: Weak Spots leaves the grid).
 * Server-computed from the student's real debriefs: the top 3 gaps, with a
 * "Generate drill" link. Rendered on /today and /practice.
 */
export async function WeakSpotsBanner(): Promise<React.ReactElement | null> {
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
  if (!scores || scores.length < 2) return null;

  const spots = analyzeWeakSpots((scores ?? []).map((s) => (s.rubric ?? {}) as Record<string, unknown>));
  if (spots.length === 0) return null;

  const top3 = spots.slice(0, 3).map((s) => s.label.toLowerCase()).join(", ");

  return (
    <Link
      href="/practice/weak-spots"
      className="mb-6 flex items-center justify-between gap-3 rounded-md border-2 border-border bg-amber-50 p-3 text-small transition-transform active:translate-y-px"
    >
      <span className="flex items-center gap-2">
        <Radar className="size-4 shrink-0 text-amber-700" aria-hidden />
        <span>
          Your three weakest domains: <span className="font-medium">{top3}</span>
        </span>
      </span>
      <span className="shrink-0 font-medium text-primary">Generate drill →</span>
    </Link>
  );
}