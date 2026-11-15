import { appRefresh } from "@/lib/app-api/auth";
import { deviceIdOf, platformOf } from "@/lib/app-api/guard";
import { appRoute } from "@/lib/app-api/route";
import { refreshSchema } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** POST /api/app/v1/auth/refresh: a refresh token for new tokens, after the account and phone checks. */
export const POST = appRoute({ auth: "public" }, async ({ req, body, ip, limitFast }) => {
  limitFast(`app:refresh:ip:${ip}`, 120);
  const deviceId = deviceIdOf(req);
  const { refreshToken } = await body(refreshSchema);
  return appRefresh({ refreshToken, deviceId, platform: platformOf(req) });
});
