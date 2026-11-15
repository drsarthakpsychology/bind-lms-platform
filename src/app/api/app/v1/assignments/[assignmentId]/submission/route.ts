import { unsubmitAssignment } from "@/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions";
import { openAssignment } from "@/lib/app-api/assignments";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { UnsubmitResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** DELETE /api/app/v1/assignments/:id/submission: take back a submission that is not graded yet (the website's unsubmitAssignment). */
export const DELETE = appRoute<{ assignmentId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params, limitWrite }): Promise<UnsubmitResult> => {
  await limitWrite(`app:submit:${user.profile.id}`, 20);
  await openAssignment(user.profile, params.assignmentId);
  const r = await unsubmitAssignment(params.assignmentId);
  if (r.error) throw new ApiFail(r.error === "No submission to unsubmit." ? "not_found" : r.error === "Not authorized." ? "forbidden" : "conflict", r.error);
  return { removed: true };
});
