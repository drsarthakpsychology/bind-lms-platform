import { z } from "zod";
import { requestDeletion } from "@/lib/app-api/deletion";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { DeletionRequestResult } from "@/lib/app-api/contract";

export const runtime = "nodejs";

const schema = z.object({ reason: z.string().max(1000).optional() });

/** POST /api/app/v1/me/deletion-request: ask the school to delete this account. A person checks it. */
export const POST = appRoute({ auth: "bearer" }, async ({ user, body, limitStrict }): Promise<DeletionRequestResult> => {
  const { reason } = await body(schema, 4096);
  await limitStrict(`app:deletion:${user.profile.id}`, 3);
  const at = new Date();
  const r = await requestDeletion(user.profile, user.name, reason ?? null, at);
  if (!r.ok) throw new ApiFail("server_error", "Couldn't send that. Try again, or write to us.");
  return { received: true, at: at.toISOString() };
});
