import { isAdminLike } from "@/lib/auth/guards";
import type { TestModeResetResult } from "@/lib/app-api/contract";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { resetTestData } from "@/lib/test-mode/server";

export const runtime = "nodejs";

/** POST /api/app/v1/test-mode/reset: wipe the test student's progress and every row made in test mode. Any admin, own sandbox only. */
export const POST = appRoute({ auth: "bearer" }, async ({ user, limitWrite }): Promise<TestModeResetResult> => {
  if (!isAdminLike(user.profile)) throw new ApiFail("forbidden");
  await limitWrite(`app:test-mode-reset:${user.profile.id}`, 6);
  const r = await resetTestData(user.profile);
  if (!r.ok) throw new ApiFail("bad_request", r.error);
  return { reset: true, cleared: r.cleared };
});
