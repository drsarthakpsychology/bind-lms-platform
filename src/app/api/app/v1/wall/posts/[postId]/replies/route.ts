import { z } from "zod";
import { appRoute, GATES } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { addWallReply } from "@/lib/wall/data";
import type { WallWriteResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ content: z.string().trim().min(1).max(2000), isAnonymous: z.boolean().default(false) });
const id = z.string().uuid();

/** POST /api/app/v1/wall/posts/:postId/replies: reply to a post (the website's /api/practice/wall/reply, same limit). */
export const POST = appRoute<{ postId: string }>({ auth: "bearer", gates: GATES.wall }, async ({ user, params, body, limitStrict }): Promise<WallWriteResult> => {
  if (!id.safeParse(params.postId).success) throw new ApiFail("not_found");
  const input = await body(schema, 12_000);
  await limitStrict(`wall:reply:${user.profile.id}`, 20);
  const r = await addWallReply(user.profile.id, { postId: params.postId, ...input });
  if (!r.ok) throw new ApiFail("server_error", "Couldn't send the reply. Try again.");
  return r.value;
});
