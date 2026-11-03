import "server-only";
import { cookies } from "next/headers";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { checkMaster } from "./master-hash";
import { loadMaster } from "./master";

/**
 * Sign the admin in to a STUDENT account with the master password (set on
 * System → Admin tools). Never works for admin accounts. Every use is logged.
 * The student's own session is kept (their token is reused), so they are not
 * thrown out while you look.
 */
export async function tryMasterLogin(email: string, password: string, ip: string): Promise<boolean> {
  if (!rateLimitFast(`master:ip:${ip}`, 5)) return false;
  const admin = createAdminClient();
  const { setting } = await loadMaster(admin);
  if (!checkMaster(password, setting)) return false;

  const { data: profile } = await admin
    .from("profiles")
    .select("id, email, role, active_session_token")
    .ilike("email", email.trim())
    .maybeSingle();
  if (!profile || (profile.role !== "student" && profile.role !== "alumni")) return false;

  const { data: link, error: linkErr } = await admin.auth.admin.generateLink({ type: "magiclink", email: String(profile.email) });
  const tokenHash = link?.properties?.hashed_token;
  if (linkErr || !tokenHash) return false;
  const supabase = await createClient();
  const { error: otpErr } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: tokenHash });
  if (otpErr) return false;

  let token = (profile.active_session_token as string | null) ?? null;
  if (!token) {
    token = crypto.randomUUID();
    await admin.from("profiles").update({ active_session_token: token }).eq("id", profile.id);
  }
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  await admin.from("master_login_events").insert({ user_id: profile.id, email: String(profile.email), ip });
  return true;
}
