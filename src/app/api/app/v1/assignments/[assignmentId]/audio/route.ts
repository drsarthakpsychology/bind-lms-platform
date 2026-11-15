import { z } from "zod";
import { submitAudioAssignment } from "@/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions";
import { afterSubmit, openAssignment } from "@/lib/app-api/assignments";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { SubmitResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ path: z.string().min(1).max(500) });

/** POST /api/app/v1/assignments/:id/audio: hand in a recording uploaded through /uploads (the website's submitAudioAssignment). */
export const POST = appRoute<{ assignmentId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params, body, limitWrite }): Promise<SubmitResult> => {
  const input = await body(schema, 4096);
  await limitWrite(`app:submit:${user.profile.id}`, 20);
  await openAssignment(user.profile, params.assignmentId);
  const r = await submitAudioAssignment(params.assignmentId, input.path);
  return afterSubmit(user.profile, params.assignmentId, r.error);
});
