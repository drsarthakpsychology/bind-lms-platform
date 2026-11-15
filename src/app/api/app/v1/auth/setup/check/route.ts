import { appRoute } from "@/lib/app-api/route";
import { setupCheckSchema } from "@/lib/app-api/schemas";
import { checkSetupToken } from "@/lib/auth/setup";

export const runtime = "nodejs";

/** POST /api/app/v1/auth/setup/check: is this setup link still good? Never uses it up. */
export const POST = appRoute({ auth: "public" }, async ({ body, ip, limitStrict }) => {
  await limitStrict(`setup:ip:${ip}`, 20);
  const { token } = await body(setupCheckSchema);
  return checkSetupToken(token);
});
