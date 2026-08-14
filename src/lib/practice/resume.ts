import type { SupabaseClient } from "@supabase/supabase-js";
import { computeLearningProfile } from "./learning-profile";

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

  // 2) The learning profile → the single weakest dimension's focus. This is
  //    the quiet adaptation: it never changes the case's clinical truth, only
  //    what we recommend the student practise next.
  const profile = await computeLearningProfile(supabase, userId);
  if (profile.focus) {
    const isDecode = profile.focus.surface === "Presenting Complaint Decoder";
    return {
      href: profile.focus.href,
      title: profile.focus.surface,
      reason: profile.focus.reason,
      cta: isDecode ? "Decode" : "Run a case",
      time: isDecode ? "4 min" : "12 min",
    };
  }

  // 3) The daily habit.
  return {
    href: "/practice/decode",
    title: "Presenting Complaint Decoder",
    reason: "The daily habit that changes how you hear patients — today's set is fresh.",
    cta: "Decode",
    time: "4 min",
  };
}
