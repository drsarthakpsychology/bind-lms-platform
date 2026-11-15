import { loadAssignment } from "@/lib/course/assignment";
import { assignmentOut } from "@/lib/app-api/views/courses";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { Assignment } from "@/lib/app-api/contract";

export const runtime = "nodejs";

/** GET /api/app/v1/assignments/:assignmentId: the brief and the student's own submission. */
export const GET = appRoute<{ assignmentId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params }): Promise<Assignment> => {
  const a = await loadAssignment(user.profile, params.assignmentId);
  if (!a) throw new ApiFail("not_found");
  return assignmentOut(a);
});
