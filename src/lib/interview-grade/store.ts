import "server-only";
/**
 * sim_interview_grades (supabase/migrations_pending/2026_11_ai_cases.sql).
 * Service role only. Copes with the table being missing: loads return null,
 * saves report false (the student still sees the grade).
 */
import { createAdminClient } from "@/lib/supabase/server";
import type { InterviewGrade, Submission } from "./types";

export async function loadGrade(sessionId: string, userId: string): Promise<{ grade: InterviewGrade; submission: Submission } | null> {
  try {
    const { data, error } = await createAdminClient().from("sim_interview_grades").select("grade, submission, user_id").eq("session_id", sessionId).maybeSingle();
    if (error || !data || data.user_id !== userId) return null;
    const grade = data.grade as InterviewGrade | null;
    return grade && typeof grade.overall === "number" ? { grade, submission: data.submission as Submission } : null;
  } catch {
    return null;
  }
}

export async function saveGrade(row: { sessionId: string; userId: string; caseId: string | null; topic: string; submission: Submission; grade: InterviewGrade }): Promise<boolean> {
  try {
    const { error } = await createAdminClient()
      .from("sim_interview_grades")
      .upsert(
        {
          session_id: row.sessionId,
          user_id: row.userId,
          case_id: row.caseId,
          topic: row.topic,
          submission: row.submission,
          grade: row.grade,
          overall: row.grade.overall,
          provider: row.grade.provider,
        },
        { onConflict: "session_id", ignoreDuplicates: true },
      );
    return !error;
  } catch {
    return false;
  }
}
