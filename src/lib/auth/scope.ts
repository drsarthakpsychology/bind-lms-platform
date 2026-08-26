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

/**
 * The only routes a lecture-only account may reach: the lecture list
 * (`/dashboard`) and the player surface (`/courses/*`). Everything else
 * (practice, journal, wall, tools, today, passport, settings, admin) is
 * blocked server-side — never just hidden in the nav.
 */
export function lectureOnlyAllowed(pathname: string): boolean {
  if (pathname === "/dashboard") return true;
  if (pathname.startsWith("/courses")) return true;
  return false;
}
