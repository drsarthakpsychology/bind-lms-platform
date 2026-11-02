import type { SupabaseClient } from "@supabase/supabase-js";
import { computeLearningProfile } from "./learning-profile";

/**
 * The shared "what should I do next" engine (T139/T140). One place decides
 * the single most useful practice action for a student, so /practice and any
 * future surface show the same answer instead of each re-deriving it.
 *
 * Priority (each only when the data supports it, and always with a reason):
 *   1. An in-progress patient session — the patient is waiting.
 *   2. Risk assessment missed recently — the consulting room.
 *   3. The course (Study), when it's open.
 * Only tools whose flag is "unlocked" are ever recommended.
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
  flags: Record<string, string>,
): Promise<ResumePrimary | null> {
  // Only ever point at something the student can actually open. A tool that
  // is off or still "coming soon" must never be recommended (it showed a
  // "Resume" card that led to a locked screen).
  const open = (flag: string) => flags[flag] === "unlocked";

  // 1) In-progress sim session → resume it (the patient is waiting).
  if (open("consulting_room")) {
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
        reason: "A patient is waiting mid-session. Finishing it banks the debrief and your score.",
        cta: "Resume",
        time: "12 min",
      };
    }

    // 2) The learning profile → the weakest dimension, when it maps to an open tool.
    const profile = await computeLearningProfile(supabase, userId);
    if (profile.focus && profile.focus.href.startsWith("/practice/consulting-room")) {
      return { href: profile.focus.href, title: profile.focus.surface, reason: profile.focus.reason, cta: "Run a case", time: "12 min" };
    }
  }

  // 3) Otherwise the course, when it's open.
  if (open("learn")) {
    return {
      href: "/study",
      title: "Continue your notes",
      reason: "Pick up the next step in Notes, exactly where you left off.",
      cta: "Continue",
      time: "next step",
    };
  }
  return null;
}
