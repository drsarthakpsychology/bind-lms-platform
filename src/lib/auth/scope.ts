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

/** True when the account is blocked: the unconditional every-request override. */
export function isBlocked(profile: { status?: "active" | "blocked" } | null): boolean {
  return profile?.status === "blocked";
}

/**
 * The routes a lecture-only account may reach: the lecture list and player,
 * their cohort's Doubts board, their own journey, their alerts (the list and
 * each message, which opens at /notifications/<id>) and their own
 * certificates (a certificate notice links to /achievements). Everything else
 * (Notes, Games, Practice, Medicines, Wall, Journal) needs Full access, which
 * the admin sets per student on People → Access.
 */
export function lectureOnlyAllowed(pathname: string): boolean {
  if (pathname === "/dashboard") return true;
  if (pathname === "/courses" || pathname.startsWith("/courses/")) return true;
  if (pathname === "/doubts" || pathname.startsWith("/doubts/")) return true;
  if (pathname === "/journey") return true;
  if (pathname === "/notifications" || pathname.startsWith("/notifications/")) return true;
  if (pathname === "/achievements") return true;
  return false;
}

/**
 * Games, practice games and the duel are Full-access features. Their server
 * actions and routes are reachable without the page, so they check this too.
 * Admins and alumni are never lectures-only.
 */
export function gamesAllowed(profile: ScopedProfile | null): boolean {
  return Boolean(profile) && !isLecturesOnly(profile);
}
