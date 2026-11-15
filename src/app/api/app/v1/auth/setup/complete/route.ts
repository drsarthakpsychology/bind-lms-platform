import { appRoute } from "@/lib/app-api/route";
import { ApiFail } from "@/lib/app-api/respond";
import { setupCompleteSchema } from "@/lib/app-api/schemas";
import { finishSetup } from "@/lib/auth/setup";

export const runtime = "nodejs";

/** POST /api/app/v1/auth/setup/complete: set the first password from a setup link. */
export const POST = appRoute({ auth: "public" }, async ({ body, ip, limitStrict }) => {
  // The same counter as the website's setup form.
  await limitStrict(`setup:ip:${ip}`, 20);
  const { token, password } = await body(setupCompleteSchema);
  const done = await finishSetup(token, password);
  if (!done.ok) {
    throw new ApiFail(done.reason === "save_failed" ? "server_error" : done.reason === "policy" ? "bad_request" : "conflict", done.error, { reason: done.reason });
  }
  return { email: done.email };
});
