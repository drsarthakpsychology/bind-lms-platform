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

/**
 * The user id a token names (its `sub` claim), read without checking the
 * signature. Only used to start the profile and phone reads while Supabase
 * verifies the token; nothing read with it is used or written unless the
 * verified user has this same id. Null when the token has no readable id.
 */
export function jwtSubject(token: string): string | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const payload = JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as { sub?: unknown };
    return typeof payload.sub === "string" && /^[0-9a-f-]{36}$/i.test(payload.sub) ? payload.sub : null;
  } catch {
    return null;
  }
}

/**
 * What a refusal from Supabase Auth means for the app. Only a real refusal
 * (a bad or revoked token) is "unauthenticated", which signs the phone out.
 * Auth being slow, down or busy is not the student's fault: it answers
 * server_error or rate_limited, so the app keeps the sign-in and tries again.
 * (Every Auth hiccup used to sign students out.)
 */
export function authFailureCode(error: { name?: string; status?: number; message?: string } | null | undefined): "token_expired" | "unauthenticated" | "server_error" | "rate_limited" {
  if (!error) return "unauthenticated";
  const status = typeof error.status === "number" ? error.status : 0;
  const name = typeof error.name === "string" ? error.name : "";
  if (status === 429) return "rate_limited";
  if (name === "AuthRetryableFetchError" || name === "AuthUnknownError" || status >= 500) return "server_error";
  if (/expired/i.test(error.message ?? "")) return "token_expired";
  return "unauthenticated";
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
