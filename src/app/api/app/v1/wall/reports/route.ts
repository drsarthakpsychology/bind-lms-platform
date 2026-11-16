import { z } from "zod";
import { appRoute, GATES } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { reportWall } from "@/lib/wall/data";

export const runtime = "nodejs";

const schema = z
  .object({ postId: z.string().uuid().optional(), replyId: z.string().uuid().optional(), reason: z.string().trim().min(1).max(500).default("flagged by a cohort member") })
  .refine((v) => Boolean(v.postId) !== Boolean(v.replyId), { message: "exactly one of postId or replyId", path: ["postId"] });

/** POST /api/app/v1/wall/reports: flag a post or reply for faculty (the website's /api/practice/wall/report, same limit). */
export const POST = appRoute({ auth: "bearer", gates: GATES.wall }, async ({ user, body, limitStrict }): Promise<{ reported: true }> => {
  const input = await body(schema, 2_000);
  await limitStrict(`wall:report:${user.profile.id}`, 10);
  const r = await reportWall(user.profile.id, input);
  if (!r.ok) throw new ApiFail("server_error", "Couldn't flag it. Try again.");
  return { reported: true };
});
