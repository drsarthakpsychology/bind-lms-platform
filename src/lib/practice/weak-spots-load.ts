import "server-only";
import { createClient } from "@/lib/supabase/server";
import { analyzeWeakSpots, generateDrill } from "@/lib/practice/weak-spots";
import { loadHistory } from "@/lib/history/server";
import { readFlags, type FeatureKey } from "@/lib/flags";

/**
 * Weak spots for the signed-in student (moved out of
 * src/app/(dashboard)/practice/weak-spots/page.tsx so the mobile app gets
 * the same): the gaps across the last 20 practice-session debriefs, and a
 * 10-item drill made from them. Null when nobody is signed in.
 */
export async function loadWeakSpots() {
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
  // Answer history (src/lib/history): drill items not seen yet first, then missed ones.
  const history = await loadHistory(user.id, "weak-spots");
  const drill = generateDrill(spots, 10, history.map);

  return { spots, drill, sessions: rubrics.length };
}
