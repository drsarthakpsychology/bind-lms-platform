/**
 * The pure parts of the app guard (no database, no network), unit tested.
 */

/** The token of an `Authorization: Bearer <token>` header, or null. */
export function bearerToken(header: string | null | undefined): string | null {
  const m = /^Bearer\s+([A-Za-z0-9._~+/=-]{20,4096})$/i.exec((header ?? "").trim());
  return m ? m[1] : null;
}

/**
 * True when the token's own expiry has passed. Read without checking the
 * signature: it is only a shortcut to answer "refresh first" without a network
 * call. A token that is not expired here is still verified with Supabase.
 */
export function jwtExpired(token: string, now: number): boolean {
  try {
    const part = token.split(".")[1];
    if (!part) return false;
    const payload = JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as { exp?: unknown };
    return typeof payload.exp === "number" && payload.exp * 1000 <= now;
  } catch {
    return false;
  }
}

/** Access has ended (students only; alumni keep read access for good). Same rule as getSession. */
export function isExpired(expiresAt: string | null | undefined, role: string | undefined, now: number): boolean {
  if (!expiresAt) return false;
  if (role === "alumni") return false;
  return new Date(expiresAt).getTime() <= now;
}

/** Paused wins over ended, as on the website. */
export function accountProblem(profile: { status?: string; expires_at?: string | null; role?: string }, now: number): "account_blocked" | "account_expired" | null {
  if (profile.status === "blocked") return "account_blocked";
  if (isExpired(profile.expires_at, profile.role, now)) return "account_expired";
  return null;
}
