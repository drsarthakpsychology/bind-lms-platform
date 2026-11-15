import { z } from "zod";
import { appStreamAccess } from "@/lib/app-api/stream";
import { appRoute, GATES } from "@/lib/app-api/route";
import type { StreamAccess } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ deviceCompromised: z.boolean().optional(), bindHeader: z.boolean().optional() });

/**
 * POST /api/app/v1/lectures/:lessonId/stream: the video address for the app's
 * player. Same streams, quality and per-viewer AES-128 key as the website;
 * the token is bound to the student, the lecture and this phone.
 */
export const POST = appRoute<{ lessonId: string }>({ auth: "bearer", gates: GATES.lectures }, async ({ user, params, body, req, ip, limitStrict }): Promise<StreamAccess> => {
  const input = await body(schema, 2048);
  // The website's own limits for minting video access (per student and per network).
  await limitStrict(`media:${user.profile.id}`, 60);
  await limitStrict(`media:ip:${ip}`, 120);
  return appStreamAccess({ user, lessonId: params.lessonId, deviceCompromised: Boolean(input.deviceCompromised), bindHeader: input.bindHeader !== false, origin: new URL(req.url).origin });
});
