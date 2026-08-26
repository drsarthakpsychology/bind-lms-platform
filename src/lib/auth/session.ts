import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const SESSION_COOKIE = "plms_session";

export type Profile = {
  id: string;
  email: string | null;
  role: "admin" | "student" | "alumni";
  /** Access scope. "lectures_only" locks the account to the lecture list +
   *  player; every other student surface is blocked server-side. Defaults to
   *  "full" when the column is absent (pre-migration rows). */
  scope: "full" | "lectures_only";
  /** Unconditional override: "blocked" rejects the account on EVERY request,
   *  independent of credential/session validity. Defaults to "active" when the
   *  column is absent. */
  status: "active" | "blocked";
  /** Internal-only reason for a block — never shown to the student. */
  block_reason: string | null;
  active_session_token: string | null;
  expires_at: string | null;
};

export type SessionResult =
  | { status: "ok"; profile: Profile }
  | { status: "blocked"; profile: Profile }
  | { status: "unauthenticated" }
  | { status: "expired" }
  | { status: "session_replaced" };

function isExpired(expiresAt: string | null, role?: string): boolean {
  if (!expiresAt) return false; // no expiry set = doesn't expire
  // Alumni keep permanent read-only access (A10).
  if (role === "alumni") return false;
  return new Date(expiresAt).getTime() <= Date.now();
}

/**
 * The authoritative check the blueprint's Part 3.2/3.3 describes as
 * "middleware" — deliberately NOT in proxy.ts (see the note there). Wrapped
 * in React's cache() so calling it from a layout and again from a page in
 * the same request reuses one result instead of hitting the DB twice.
 *
 * Signs the Supabase session out immediately for "expired" and
 * "session_replaced" so a stale cookie can't be reused to slip back in.
 */
export const getSession = cache(async (): Promise<SessionResult> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "unauthenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, scope, status, block_reason, active_session_token, expires_at")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Auth user exists but the profiles row doesn't (shouldn't happen —
    // the on_auth_user_created trigger creates it — but fail closed).
    await supabase.auth.signOut();
    return { status: "unauthenticated" };
  }

  const built = (): Profile =>
    ({
      ...(profile as Omit<Profile, "scope" | "status">),
      // Defensive defaults for rows written before the relevant migrations.
      scope: profile.scope === "lectures_only" ? "lectures_only" : "full",
      status: profile.status === "blocked" ? "blocked" : "active",
      block_reason: (profile.block_reason as string | null) ?? null,
    }) as Profile;

  // BLOCKED is the unconditional override — checked before expiry/token, so a
  // blocked account is rejected even with a correct password and a valid
  // session. Deliberately does NOT sign out: unblocking then restores access on
  // the very next request with no re-login.
  if (profile.status === "blocked") {
    return { status: "blocked", profile: built() };
  }

  if (isExpired(profile.expires_at, profile.role)) {
    await supabase.auth.signOut();
    return { status: "expired" };
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(SESSION_COOKIE)?.value;

  // No active_session_token yet (shouldn't happen post-login, but fail
  // closed rather than treating "unset" as a free pass) OR it doesn't match
  // what this browser is carrying — someone logged in elsewhere.
  if (!profile.active_session_token || cookieToken !== profile.active_session_token) {
    await supabase.auth.signOut();
    return { status: "session_replaced" };
  }

  return { status: "ok", profile: built() };
});
