import { z } from "zod";
import { isAdminLike } from "@/lib/auth/guards";
import { appTestStudentSignIn } from "@/lib/app-api/auth";
import type { TestModeSessionResult } from "@/lib/app-api/contract";
import { ApiFail } from "@/lib/app-api/respond";
import { appRoute } from "@/lib/app-api/route";
import { deviceSchema } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

const body = z.object({ device: deviceSchema });

/**
 * POST /api/app/v1/test-mode/session: tokens for this admin's test student
 * (test mode must be on). The app keeps the admin's own tokens to come back.
 */
export const POST = appRoute({ auth: "bearer" }, async ({ user, body: read, limitWrite }): Promise<TestModeSessionResult> => {
  if (!isAdminLike(user.profile)) throw new ApiFail("forbidden");
  const input = await read(body, 4096);
  await limitWrite(`app:test-mode-session:${user.profile.id}`, 20);
  if (input.device.id !== user.deviceId) throw new ApiFail("bad_request", "Use this phone's own id.", { fields: ["device.id"] });
  return appTestStudentSignIn(user.profile, input.device);
});
