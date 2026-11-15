import { z } from "zod";
import { pingProgress } from "@/app/(dashboard)/courses/[courseId]/lessons/[lessonId]/actions";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { ProgressPingResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const seconds = z.number().finite().min(0).max(24 * 60 * 60);
const schema = z.object({ watchedSeconds: seconds, durationSeconds: seconds });

/**
 * POST /api/app/v1/lectures/:lessonId/progress: the website's pingProgress.
 * The numbers are not trusted: they are clamped on the server to the lecture
 * length and to the time since the last ping.
 */
export const POST = appRoute<{ lessonId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params, body, limitFast }): Promise<ProgressPingResult> => {
  const input = await body(schema, 4096);
  limitFast(`app:progress:${user.profile.id}`, 240);
  const r = await pingProgress(params.lessonId, input.watchedSeconds, input.durationSeconds);
  if (!r.ok) throw new ApiFail(r.retry === false ? "not_found" : "server_error", r.retry === false ? undefined : "Couldn't save. It will be sent again.");
  return { saved: true, completed: Boolean(r.completed) };
});
