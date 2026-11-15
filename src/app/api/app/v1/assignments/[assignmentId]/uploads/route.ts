import { z } from "zod";
import { prepareSubmissionUpload } from "@/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions";
import { openAssignment, signedUploadTarget } from "@/lib/app-api/assignments";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { PrepareUploadResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ fileName: z.string().trim().min(1).max(255) });

/** POST /api/app/v1/assignments/:id/uploads: a one-time place to upload one file (the website's prepareSubmissionUpload). */
export const POST = appRoute<{ assignmentId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params, body, limitWrite }): Promise<PrepareUploadResult> => {
  const input = await body(schema, 4096);
  await limitWrite(`app:upload:${user.profile.id}`, 30);
  await openAssignment(user.profile, params.assignmentId);
  const r = await prepareSubmissionUpload(params.assignmentId, input.fileName);
  if (!r.ok) throw new ApiFail(/accepted file type/.test(r.error) ? "bad_request" : r.error === "Not authorized." ? "forbidden" : "unavailable", r.error);
  return signedUploadTarget(r.path, r.token, input.fileName);
});
