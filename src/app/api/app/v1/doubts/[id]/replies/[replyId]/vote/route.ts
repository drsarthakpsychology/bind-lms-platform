import { z } from "zod";
import { voteReply } from "@/app/(dashboard)/doubts/actions";
import { doubtError, doubtThread } from "@/lib/app-api/doubts";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { DoubtActionResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ on: z.boolean() });

/** POST /api/app/v1/doubts/:id/replies/:replyId/vote: "This helped" (the website's voteReply). */
export const POST = appRoute<{ id: string; replyId: string }>({ auth: "bearer", gates: GATES.doubts }, async ({ user, params, body }): Promise<DoubtActionResult> => {
  const input = await body(schema, 512);
  const r = await voteReply(params.id, params.replyId, input.on);
  if (r.error) throw doubtError(r.error);
  return { thread: await doubtThread(user.profile, params.id) };
});
