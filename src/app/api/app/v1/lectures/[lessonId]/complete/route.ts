import { markLessonComplete } from "@/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions";
import { completionBlock } from "@/lib/course/complete";
import { loadLecture } from "@/lib/course/lecture";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { CompleteLectureResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/**
 * POST /api/app/v1/lectures/:lessonId/complete: the website's "Complete and
 * continue": the assignment rule (completionBlock), then markLessonComplete.
 */
export const POST = appRoute<{ lessonId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params, limitWrite }): Promise<CompleteLectureResult> => {
  await limitWrite(`app:complete:${user.profile.id}`, 60);
  const lecture = await loadLecture(user.profile, params.lessonId);
  if (!lecture.ok) throw new ApiFail(lecture.reason === "locked" ? "feature_locked" : lecture.reason === "forbidden" ? "forbidden" : "not_found");
  const block = await completionBlock(params.lessonId, user.profile.id);
  if (block === "not_found") throw new ApiFail("not_found");
  if (block === "needs_submission") throw new ApiFail("conflict", "Hand in this lecture's assignment first.", { reason: "needs_submission" });
  const saved = await markLessonComplete(params.lessonId);
  if (!saved.ok) throw new ApiFail(saved.retry === false ? "not_found" : "server_error", "Couldn't save. Try again.");
  return { completed: true, next: lecture.lecture.next };
});
