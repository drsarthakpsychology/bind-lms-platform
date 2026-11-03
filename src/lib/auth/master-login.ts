import "server-only";
import { cookies } from "next/headers";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { rateLimitFast } from "@/lib/rate-limit-fast";
import { rateLimit } from "@/lib/rate-limit";
import { checkMaster } from "./master-hash";
import { loadMaster } from "./master";

/**
 * Sign the admin in to a STUDENT account with the master password (set on
 * System → Admin tools). Never works for admin accounts. Every use is logged.
 * The student's own session is kept (their token is reused), so they are not
 * thrown out while you look.
 */
/** Escape LIKE wildcards so user input matches literally (backslash is Postgres' default escape). */
export function escapeLike(s: string): string {
  return s.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/** Per-minute caps on master-password attempts, held in Postgres (all instances). */
const MASTER_LIMITS = { perEmail: 3, perIp: 5, global: 30 } as const;

export async function tryMasterLogin(email: string, password: string, ip: string): Promise<boolean> {
  const target = email.trim().toLowerCase();
  // PostgREST also treats `*` as a wildcard in like/ilike; no real student
  // email contains `*` or `%`, so refuse them outright.
  if (!target || target.length > 320 || /[*%\\]/.test(target)) return false;
  if (!rateLimitFast(`master:ip:${ip}`, 5)) return false;
  // Durable limits: the in-memory one above is per serverless instance only.
  const [byEmail, byIp, global] = await Promise.all([
    rateLimit(`master:email:${target}`, MASTER_LIMITS.perEmail),
    rateLimit(`master:ip:${ip}`, MASTER_LIMITS.perIp),
    rateLimit("master:all", MASTER_LIMITS.global),
  ]);
  if (!byEmail || !byIp || !global) {
    console.warn(`master login throttled (email ${target}, ip ${ip})`);
    return false;
  }
  const admin = createAdminClient();
  const { setting } = await loadMaster(admin);
  if (!checkMaster(password, setting)) return false;

  // Case-insensitive but literal match (wildcards escaped), then an exact
  // lower-case comparison so nothing but the typed address can match.
  const { data: rows } = await admin
    .from("profiles")
    .select("id, email, role, active_session_token")
    .ilike("email", escapeLike(target))
    .limit(5);
  const matches = (rows ?? []).filter((r) => String(r.email ?? "").trim().toLowerCase() === target);
  const profile = matches.length === 1 ? matches[0] : null;
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
  const { error: logErr } = await admin.from("master_login_events").insert({ user_id: profile.id, email: String(profile.email), ip });
  // Audit trail even if the events table is missing (never logs the password).
  console.warn(`master login used for ${String(profile.email)} (user ${profile.id}) from ip ${ip}${logErr ? `; event row not saved: ${logErr.message}` : ""}`);
  return true;
}
