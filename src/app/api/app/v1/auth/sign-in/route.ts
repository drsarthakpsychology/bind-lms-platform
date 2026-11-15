import { appSignIn } from "@/lib/app-api/auth";
import { appRoute } from "@/lib/app-api/route";
import { signInSchema } from "@/lib/app-api/schemas";

export const runtime = "nodejs";

/** POST /api/app/v1/auth/sign-in: email and password for tokens, the account and this phone. */
export const POST = appRoute({ auth: "public" }, async ({ body, ip, limitStrict, limitFast }) => {
  const input = await body(signInSchema);
  // The same counters as the website login: 10 tries a minute per email
  // (lower-cased, shared by all servers) and 60 a minute per network.
  await limitStrict(`login:${input.email.toLowerCase()}`, 10);
  limitFast(`login:ip:${ip}`, 60);
  return appSignIn(input);
});
