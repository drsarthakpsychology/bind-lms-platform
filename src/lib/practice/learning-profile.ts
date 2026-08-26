import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The per-student learning profile (§10/§11/§15/§16). Aggregates the rubric
 * signals the debrief already computes (premature reassurance, risk timing,
 * idiom decoding, open:closed, reflections) across the student's real
 * sessions, and quietly recommends the next focus.
 *
 * It only ever changes recommendation / case selection / suggested difficulty —
 * NEVER the clinical truth of a case. Personalisation adapts the practice,
 * not the facts.
 */

export interface LearningProfile {
  /** Number of scored sessions the profile is built from. */
  sessions: number;
  /** Rubric dimensions → recent signal. */
  dimensions: Array<{
    key: string;
    label: string;
    score: number; // 0..1, higher = better
    weak: boolean;
  }>;
  /** The single next focus (a surface + why). Null when the profile is thin. */
  focus: { surface: string; reason: string; href: string } | null;
  /** Quiet difficulty nudge for the case picker (never changes case truth). */
  suggestedDifficulty?: "clear" | "blurred" | "holmes";
}

interface RubricShape {
  premature_reassurance?: number;
  risk_timing?: string;
  idiom_decoding?: boolean;
  open_closed_ratio?: number;
  reflective_statements?: number;
}

const WEAK_IF_LATE = ["risk_timing", "idiom_decoding"];

export async function computeLearningProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<LearningProfile> {
  const { data: scores } = await supabase
    .from("sim_scores")
    .select("rubric")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(8);

  const rows = (scores ?? []).map((s) => (s.rubric as RubricShape) ?? {});
  if (rows.length === 0) return { sessions: 0, dimensions: [], focus: null };

  // Per-dimension aggregation (higher = better).
  const dimensions: LearningProfile["dimensions"] = [];
  const premature = rows.filter((r) => (r.premature_reassurance ?? 0) > 0).length;
  const riskLate = rows.filter((r) => r.risk_timing === "late" || r.risk_timing === "absent").length;
  const idiomMissed = rows.filter((r) => r.idiom_decoding === false).length;
  const ratios = rows.map((r) => r.open_closed_ratio).filter((x): x is number => typeof x === "number");
  const avgRatio = ratios.length ? ratios.reduce((a, b) => a + b, 0) / ratios.length : 1;

  dimensions.push(
    { key: "premature_reassurance", label: "Exploring before reassuring", score: 1 - premature / rows.length, weak: premature / rows.length > 0.3 },
    { key: "risk_timing", label: "Risk assessment", score: 1 - riskLate / rows.length, weak: riskLate / rows.length > 0.3 },
    { key: "idiom_decoding", label: "Noticing the opening phrase", score: 1 - idiomMissed / rows.length, weak: idiomMissed / rows.length > 0.3 },
    { key: "open_questions", label: "Open questioning", score: Math.min(1, avgRatio / 1.5), weak: avgRatio < 0.8 },
  );

  // The single next focus — the weakest dimension, each mapping to a surface.
  const weakest = [...dimensions].sort((a, b) => a.score - b.score)[0];
  let focus: LearningProfile["focus"] = null;
  switch (weakest?.key) {
    case "risk_timing":
      focus = { surface: "Consulting Room", reason: "Risk assessment keeps slipping — run a case and ask about it early.", href: "/practice/consulting-room" };
      break;
    case "idiom_decoding":
      focus = { surface: "Presenting Complaint Decoder", reason: "The opening phrase keeps going undecoded — five minutes fixes your ears.", href: "/practice/decode" };
      break;
    case "premature_reassurance":
      focus = { surface: "Consulting Room", reason: "You reassure before exploring — a case where restraint matters.", href: "/practice/consulting-room" };
      break;
    case "open_questions":
      focus = { surface: "Presenting Complaint Decoder", reason: "Your questions lean closed — practice asking open ones.", href: "/practice/decode" };
      break;
  }

  // Quiet difficulty nudge: a student strong across the board gets harder cases.
  const strong = dimensions.filter((d) => d.score >= 0.8).length;
  let suggestedDifficulty: LearningProfile["suggestedDifficulty"];
  if (strong >= 3) suggestedDifficulty = "holmes";
  else if (strong >= 1) suggestedDifficulty = "blurred";
  else suggestedDifficulty = "clear";

  return { sessions: rows.length, dimensions, focus, suggestedDifficulty };
}

// Re-export the constant for callers that filter on late signals.
export const LEARNING_WEAK_IF_LATE = WEAK_IF_LATE;
