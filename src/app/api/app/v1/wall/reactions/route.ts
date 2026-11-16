import { z } from "zod";
import { appRoute, GATES } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { toggleWallReaction, WALL_REACTIONS } from "@/lib/wall/data";
import type { WallReactResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z
  .object({ postId: z.string().uuid().optional(), replyId: z.string().uuid().optional(), reaction: z.enum(WALL_REACTIONS) })
  .refine((v) => Boolean(v.postId) !== Boolean(v.replyId), { message: "exactly one of postId or replyId", path: ["postId"] });

/** POST /api/app/v1/wall/reactions: toggle one reaction (the website's /api/practice/wall/reaction, same limit). */
export const POST = appRoute({ auth: "bearer", gates: GATES.wall }, async ({ user, body, limitWrite }): Promise<WallReactResult> => {
  const input = await body(schema, 1_000);
  await limitWrite(`wall:react:${user.profile.id}`, 30);
  const r = await toggleWallReaction(user.profile.id, input);
  if (!r.ok) throw new ApiFail("server_error", "Couldn't update your reaction.");
  return r.value;
});
