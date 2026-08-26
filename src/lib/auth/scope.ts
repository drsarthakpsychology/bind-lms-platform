/**
 * Access-scope checks, kept pure and free of the server-only session module so
 * they stay unit-testable. `scope` is the orthogonal axis layered on top of
 * `role`: "lectures_only" locks an account to the lecture list + player.
 */

type ScopedProfile = { role?: string; scope?: "full" | "lectures_only" };

/** True when the account is restricted to lectures only. */
export function isLecturesOnly(profile: ScopedProfile | null): boolean {
  return profile?.scope === "lectures_only";
}

/** True when the account is blocked — the unconditional every-request override. */
export function isBlocked(profile: { status?: "active" | "blocked" } | null): boolean {
  return profile?.status === "blocked";
}

/**
 * The routes a lecture-only account may reach. These accounts see everything
 * the programme has made LIVE or UNLOCKED — so beyond the lecture list
 * (`/dashboard`) + player (`/courses/*`), they may reach the practice tools
 * and the other student surfaces (reflect, record, passport, wall,
 * psychopharm tools). Every one of those is itself gated server-side by
 * `requireFeature` (off tools redirect away, live tools show a locked screen),
 * so letting the route through is safe — the feature flag is the real gate.
 * Only /admin and /settings stay blocked for them.
 */
export function lectureOnlyAllowed(pathname: string): boolean {
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith("/settings")) return false;
  if (pathname === "/dashboard") return true;
  if (pathname.startsWith("/courses")) return true;
  if (pathname.startsWith("/practice")) return true;
  if (pathname === "/reflect") return true;
  if (pathname === "/record") return true;
  if (pathname === "/passport") return true;
  if (pathname === "/wall") return true;
  if (pathname === "/notifications") return true;
  if (pathname.startsWith("/tools")) return true;
  return false;
}
