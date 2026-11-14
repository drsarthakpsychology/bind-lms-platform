"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { rateLimit } from "@/lib/rate-limit";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { createAdminClient } from "@/lib/supabase/server";
import { hashSetupToken } from "@/lib/auth/roster";
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
  const policy = checkNewPassword(password);
  if (policy) return { error: policy };
  if (password !== confirm) return { error: "The two passwords don't match." };

  const admin = createAdminClient();
  const { data: row } = await admin
    .from("account_setup_tokens")
    .select("id, user_id, email, expires_at, used_at, revoked_at")
    .eq("token_hash", hashSetupToken(token))
    .maybeSingle();

  if (!row || row.used_at || row.revoked_at) {
    return { error: "This setup link has already been used or replaced. Ask us for a new one." };
  }
  if (new Date(row.expires_at as string).getTime() < Date.now()) {
    return { error: "This setup link has expired. Ask us for a new one." };
  }

  // Spend the token first (single use even if two tabs submit at once).
  const { data: spent } = await admin
    .from("account_setup_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", row.id)
    .is("used_at", null)
    .select("id")
    .maybeSingle();
  if (!spent) return { error: "This setup link has already been used. Ask us for a new one." };

  const { error } = await admin.auth.admin.updateUserById(row.user_id as string, { password });
  if (error) {
    await admin.from("account_setup_tokens").update({ used_at: null }).eq("id", row.id);
    return { error: "We couldn't save that password. Try a different one." };
  }

  await admin
    .from("credential_invites")
    .update({ setup_completed_at: new Date().toISOString() })
    .eq("email", row.email as string);

  redirect(`/login?setup=done&email=${encodeURIComponent(row.email as string)}`);
}
