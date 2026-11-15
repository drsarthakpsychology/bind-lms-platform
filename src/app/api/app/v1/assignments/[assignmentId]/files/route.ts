import { z } from "zod";
import { submitWithFiles } from "@/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions";
import { afterSubmit, openAssignment } from "@/lib/app-api/assignments";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { SubmitResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({
  note: z.string().max(5000).optional(),
  files: z.array(z.object({ path: z.string().min(1).max(500), name: z.string().min(1).max(255) })).max(50),
});

/** POST /api/app/v1/assignments/:id/files: hand in with uploaded files (the website's submitWithFiles; only the student's own uploads are accepted). */
export const POST = appRoute<{ assignmentId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params, body, limitWrite }): Promise<SubmitResult> => {
  const input = await body(schema, 64_000);
  await limitWrite(`app:submit:${user.profile.id}`, 20);
  await openAssignment(user.profile, params.assignmentId);
  const r = await submitWithFiles(params.assignmentId, input.note ?? "", input.files);
  return afterSubmit(user.profile, params.assignmentId, r.error);
});
