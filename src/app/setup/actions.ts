"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { rateLimit } from "@/lib/rate-limit";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { finishSetup } from "@/lib/auth/setup";
import { checkNewPassword } from "@/lib/auth/password-policy";

export type SetupState = { error: string | null };

/**
 * Finish account setup from a one-time link. The link itself does nothing on
 * open (email scanners that "click" links can't use it up); only this POST
 * consumes it: the token hash must match an unused, unexpired, unrevoked row.
 * The password is set on the auth user, the token is spent, and the student
 * is sent to sign in with their email filled in.
 */
export async function completeSetup(_prev: SetupState, formData: FormData): Promise<SetupState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token || token.length > 200) return { error: "This setup link isn't valid. Ask us for a new one." };
  // Throttle guessing of setup links per network (each try also costs a
  // password hash and a database read).
  const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  if (!rateLimitFast(`setup:ip:${ip}`, 20) || !(await rateLimit(`setup:ip:${ip}`, 20))) {
    return { error: "Too many tries. Wait a minute and try again." };
  }
  // Same order of messages as before: password rule, then the two boxes, then the link.
  const policy = checkNewPassword(password);
  if (policy) return { error: policy };
  if (password !== confirm) return { error: "The two passwords don't match." };

  const done = await finishSetup(token, password);
  if (!done.ok) return { error: done.error };

  redirect(`/login?setup=done&email=${encodeURIComponent(done.email)}`);
}
