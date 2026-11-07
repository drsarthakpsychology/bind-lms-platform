import "server-only";
import { getSession, type Profile } from "./session";

/**
 * For Server Actions. Every admin action file previously rolled its own
 * "check the caller is an admin" helper that only checked role: meaning an
 * admin whose access had expired, or who'd been signed out elsewhere by the
 * concurrent-session check, could still successfully call the action
 * directly (Server Actions are independently invokable endpoints, not
 * gated by the page that renders their form). Routing through the full
 * getSession() closes that gap: expired / session_replaced accounts are
 * rejected here too, not just on page load.
 */
export async function requireSession(): Promise<Profile | null> {
  const session = await getSession();
  return session.status === "ok" ? session.profile : null;
}

/** Super Admin / Owner: the ONLY account that may create or manage users/admins. */
export function isSuperAdmin(profile: Profile | null | undefined): boolean {
  return profile?.role === "admin";
}

/** Any admin (Super Admin or View Admin): read access to admin surfaces. */
export function isAdminLike(profile: Profile | null | undefined): boolean {
  return profile?.role === "admin" || profile?.role === "view_admin";
}

/**
 * Super Admin only. Used to gate every write: creating/inviting/enrolling/
 * removing users, managing cohorts, content, settings and admins. The View
 * Admin and students are rejected here.
 */
export async function requireSuperAdmin(): Promise<Profile | null> {
  const profile = await requireSession();
  return isSuperAdmin(profile) ? profile : null;
}

/**
 * Any admin (Super Admin or View Admin) for READ access to the Admin
 * Dashboard. Every write action must use requireSuperAdmin() instead: this
 * helper never authorises a mutation on its own.
 */
export async function requireAdmin(): Promise<Profile | null> {
  const profile = await requireSession();
  return isAdminLike(profile) ? profile : null;
}

/** Alumni keep permanent read-only access to their own record (A10). */
export function isAlumni(profile: Profile | null): boolean {
  return profile?.role === "alumni";
}

// Scope checks live in a pure, server-only-free module so they stay testable.
export { isLecturesOnly, lectureOnlyAllowed } from "./scope";
