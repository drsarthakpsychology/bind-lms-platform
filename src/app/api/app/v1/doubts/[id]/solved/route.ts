import { z } from "zod";
import { markSolved } from "@/app/(dashboard)/doubts/actions";
import { doubtError, doubtThread } from "@/lib/app-api/doubts";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { DoubtActionResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ replyId: z.string().uuid().nullable() });

/** POST /api/app/v1/doubts/:id/solved: the asker marks the answer that solved it, or null to reopen (the website's markSolved). */
export const POST = appRoute<{ id: string }>({ auth: "bearer", gates: GATES.doubts }, async ({ user, params, body, limitWrite }): Promise<DoubtActionResult> => {
  const input = await body(schema, 512);
  await limitWrite(`app:solved:${user.profile.id}`, 30);
  const r = await markSolved(params.id, input.replyId);
  if (r.error) throw doubtError(r.error);
  return { thread: await doubtThread(user.profile, params.id) };
});
