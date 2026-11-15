import { appSignOut } from "@/lib/app-api/auth";
import { appRoute } from "@/lib/app-api/route";

export const runtime = "nodejs";

/** POST /api/app/v1/auth/sign-out: ends this phone's session. */
export const POST = appRoute({ auth: "bearer" }, async ({ user }) => {
  await appSignOut({ userId: user.profile.id, accessToken: user.accessToken, deviceId: user.deviceId });
  return { signedOut: true as const };
});
