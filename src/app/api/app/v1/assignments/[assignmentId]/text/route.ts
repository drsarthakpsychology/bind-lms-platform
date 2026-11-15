import { z } from "zod";
import { submitTextAssignment } from "@/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions";
import { afterSubmit, openAssignment } from "@/lib/app-api/assignments";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { SubmitResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ text: z.string().trim().min(1).max(50_000) });

/** POST /api/app/v1/assignments/:id/text: the website's submitTextAssignment. */
export const POST = appRoute<{ assignmentId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params, body, limitWrite }): Promise<SubmitResult> => {
  const input = await body(schema, 220_000);
  await limitWrite(`app:submit:${user.profile.id}`, 20);
  await openAssignment(user.profile, params.assignmentId);
  const form = new FormData();
  form.set("textContent", input.text);
  const r = await submitTextAssignment(params.assignmentId, { error: null }, form);
  return afterSubmit(user.profile, params.assignmentId, r.error);
});
