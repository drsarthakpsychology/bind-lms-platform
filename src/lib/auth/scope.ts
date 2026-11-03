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
 * The routes a lecture-only account may reach: the lecture list and player,
 * their cohort's Doubts board, their own journey and alerts. Everything else
 * (Notes, Games, Practice, Medicines, Wall, Journal) needs Full access, which
 * the admin sets per student on People → Access.
 */
export function lectureOnlyAllowed(pathname: string): boolean {
  if (pathname === "/dashboard") return true;
  if (pathname === "/courses" || pathname.startsWith("/courses/")) return true;
  if (pathname === "/doubts" || pathname.startsWith("/doubts/")) return true;
  if (pathname === "/journey") return true;
  if (pathname === "/notifications") return true;
  return false;
}
