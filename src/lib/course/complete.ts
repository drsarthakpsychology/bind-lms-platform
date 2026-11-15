import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * May this student mark the lecture complete with the "Complete and continue"
 * button? Shared by the website (completeAndAdvance) and the mobile app
 * (POST /api/app/v1/lectures/:id/complete).
 *
 * A lecture that requires its assignment needs a submission first (any
 * status: grading is a separate admin step that must not stall the course).
 * A lecture the student cannot see (row level security) answers "not_found".
 */
export async function completionBlock(lessonId: string, userId: string): Promise<"ok" | "not_found" | "needs_submission"> {
  const supabase = await createClient();
  const { data: lesson } = await supabase.from("lessons").select("requires_assignment").eq("id", lessonId).single();
  if (!lesson) return "not_found";
  if (!lesson.requires_assignment) return "ok";

  const { data: assignment } = await supabase.from("assignments").select("id").eq("lesson_id", lessonId).maybeSingle();
  if (!assignment) return "ok";

  const { data: submission } = await supabase
    .from("submissions")
    .select("id")
    .eq("assignment_id", assignment.id)
    .eq("user_id", userId)
    .maybeSingle();
  return submission ? "ok" : "needs_submission";
}
