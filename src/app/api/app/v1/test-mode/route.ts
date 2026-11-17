import { z } from "zod";
import { isAdminLike } from "@/lib/auth/guards";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import type { TestModeState } from "@/lib/app-api/contract";
import { setTestMode, testModeState } from "@/lib/test-mode/server";

export const runtime = "nodejs";

/** GET /api/app/v1/test-mode: is test mode on, and is this the admin or their test student. */
export const GET = appRoute({ auth: "bearer" }, async ({ user }): Promise<TestModeState> => testModeState(user.profile));

const body = z.object({ on: z.boolean(), mirrorCohortId: z.string().uuid().nullable().optional() });

/** PUT /api/app/v1/test-mode: switch it on (the first time this makes the test student) or off. Any admin. */
export const PUT = appRoute({ auth: "bearer" }, async ({ user, body: read, limitWrite }): Promise<TestModeState> => {
  if (!isAdminLike(user.profile)) throw new ApiFail("forbidden");
  const input = await read(body, 2048);
  await limitWrite(`app:test-mode:${user.profile.id}`, 20);
  const r = await setTestMode(user.profile, input.on, { mirrorCohortId: input.mirrorCohortId ?? null });
  if (!r.ok && input.on) throw new ApiFail(/database step/i.test(r.error) ? "unavailable" : "server_error", r.error);
  return testModeState(user.profile);
});
