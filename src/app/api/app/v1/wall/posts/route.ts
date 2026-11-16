import { z } from "zod";
import { appRoute, GATES } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { addWallPost } from "@/lib/wall/data";
import type { WallWriteResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ content: z.string().trim().min(1).max(2000), isAnonymous: z.boolean().default(false) });

/** POST /api/app/v1/wall/posts: a new post (the website's /api/practice/wall, same limit). */
export const POST = appRoute({ auth: "bearer", gates: GATES.wall }, async ({ user, body, limitStrict }): Promise<WallWriteResult> => {
  const input = await body(schema, 12_000);
  await limitStrict(`wall:${user.profile.id}`, 15);
  const r = await addWallPost(user.profile.id, input);
  if (!r.ok) throw new ApiFail("server_error", "Couldn't post it. Try again.");
  return r.value;
});
