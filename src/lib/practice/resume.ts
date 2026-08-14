import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The shared "what should I do next" engine (T139/T140). One place decides
 * the single most useful practice action for a student, so /today, /practice
 * and any future surface show the same answer instead of each re-deriving it.
 *
 * Priority (each only when the data supports it, and always with a reason):
 *   1. An in-progress patient session — the patient is waiting.
 *   2. Risk assessment missed recently — the consulting room.
 *   3. An opening idiom undecoded recently — the decoder.
 *   4. The daily decoder habit.
 */

export interface ResumePrimary {
  href: string;
  title: string;
  reason: string;
  cta: string;
  time: string;
}

export async function computeResumePrimary(
  supabase: SupabaseClient,
  userId: string,
): Promise<ResumePrimary> {
  // 1) In-progress sim session → resume it (the patient is waiting).
  const { data: active } = await supabase
    .from("sim_sessions")
    .select("id, case_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (active) {
    return {
      href: `/practice/consulting-room/session/${active.id}`,
      title: "Resume your consultation",
      reason: "A patient is waiting mid-session — finishing it banks the debrief and your score.",
      cta: "Resume",
      time: "12 min",
    };
  }

  // 2) Risk timing missed in recent debriefs → run a case and front-load it.
  const { data: scores } = await supabase
    .from("sim_scores")
    .select("rubric")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(4);
  const riskLate = (scores ?? []).filter((s) => {
    const r = (s.rubric as Record<string, unknown> | null) ?? {};
    return r.risk_timing === "late" || r.risk_timing === "absent";
  }).length;
  if (riskLate >= 2) {
    return {
      href: "/practice/consulting-room",
      title: "Consulting Room — risk assessment",
      reason: `You've missed the risk-assessment moment in ${riskLate} of your last ${(scores ?? []).length || 4} sessions. Run a case and front-load it.`,
      cta: "Run a case",
      time: "12 min",
    };
  }

  // 3) An opening idiom went undecoded recently → the decoder.
  if ((scores ?? []).length >= 3) {
    const undecoded = (scores ?? []).filter((s) => {
      const r = (s.rubric as Record<string, unknown> | null) ?? {};
      return r.idiom_decoding === false;
    }).length;
    if (undecoded > 0) {
      return {
        href: "/practice/decode",
        title: "Presenting Complaint Decoder",
        reason: `The opening idiom went undecoded in ${undecoded} of your recent sessions. Five minutes here fixes your ears.`,
        cta: "Decode",
        time: "4 min",
      };
    }
  }

  // 4) The daily habit.
  return {
    href: "/practice/decode",
    title: "Presenting Complaint Decoder",
    reason: "The daily habit that changes how you hear patients — today's set is fresh.",
    cta: "Decode",
    time: "4 min",
  };
}
