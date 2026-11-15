import { z } from "zod";
import { replyToDoubt } from "@/app/(dashboard)/doubts/actions";
import { doubtError, doubtThread } from "@/lib/app-api/doubts";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { DoubtActionResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ body: z.string().min(1).max(10_000) });

/** POST /api/app/v1/doubts/:id/replies: the website's replyToDoubt. */
export const POST = appRoute<{ id: string }>({ auth: "bearer", gates: GATES.doubts }, async ({ user, params, body }): Promise<DoubtActionResult> => {
  const input = await body(schema, 32_000);
  const r = await replyToDoubt(params.id, input.body);
  if (r.error) throw doubtError(r.error);
  return { thread: await doubtThread(user.profile, params.id) };
});
