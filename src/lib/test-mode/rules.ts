/**
 * Test mode: the pure rules (no database, no request), so every filter is
 * unit-tested (rules.test.ts).
 *
 * Each admin has one hidden test student and one test cohort holding only
 * that student. With test mode on:
 *   - the admin's sends reach only their test student;
 *   - the admin's cohort screens (clinic) show only the test cohort;
 *   - every other admin change is refused by the server.
 * The test student itself is hidden from real people everywhere (is_test,
 * and an email on the reserved ".invalid" domain).
 */

/** The server's view of one admin's test set-up (table public.test_mode). */
export type TestLink = {
  adminId: string;
  testUserId: string;
  testCohortId: string | null;
  mirrorCohortId: string | null;
  active: boolean;
};

/**
 * Who is acting, in test terms:
 *   admin    an admin with test mode on (their sends and cohort screens are sandboxed);
 *   student  the test student itself (always sandboxed, test mode on or off).
 * null: a real person, no sandbox.
 */
export type TestScope = { as: "admin" | "student"; adminId: string; testUserId: string; testCohortId: string | null };

export function scopeOf(role: string | null | undefined, userId: string, link: TestLink | null): TestScope | null {
  if (!link) return null;
  const base = { adminId: link.adminId, testUserId: link.testUserId, testCohortId: link.testCohortId };
  if ((role === "admin" || role === "view_admin") && link.adminId === userId) return link.active ? { as: "admin", ...base } : null;
  if (link.testUserId === userId) return { as: "student", ...base };
  return null;
}

/** The reserved domain: ".invalid" is also caught by the robot-email rule (src/lib/people/hidden.ts). */
export const TEST_EMAIL_DOMAIN = "test.vibha.invalid";

/** The test student's sign-in email for one admin. */
export function testEmailFor(adminId: string): string {
  return `test-student-${adminId.toLowerCase().replace(/[^a-z0-9]/g, "")}@${TEST_EMAIL_DOMAIN}`;
}

export const TEST_STUDENT_NAME = "Test student";

/** Test cohort names start with this; admins can't name a real cohort this way. */
export const TEST_COHORT_PREFIX = "Test mode ";

export function testCohortName(adminId: string): string {
  return `${TEST_COHORT_PREFIX}${adminId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

/** A test cohort row: flagged, or named with the reserved prefix (works before the database step too). */
export function isTestCohort(row: { is_test?: boolean | null; name?: string | null } | null | undefined): boolean {
  if (!row) return false;
  return row.is_test === true || (typeof row.name === "string" && row.name.startsWith(TEST_COHORT_PREFIX));
}

/** Real cohort lists: test cohorts never show. */
export function dropTestCohorts<T extends { is_test?: boolean | null; name?: string | null }>(rows: readonly T[]): T[] {
  return rows.filter((r) => !isTestCohort(r));
}

/**
 * The cohorts an admin's cohort screens may use. In test mode: only their
 * own test cohort. Otherwise: every real cohort, no test cohorts.
 */
export function cohortsFor<T extends { id: string; is_test?: boolean | null; name?: string | null }>(rows: readonly T[], scope: TestScope | null): T[] {
  if (scope?.as === "admin") return rows.filter((r) => r.id === scope.testCohortId);
  return dropTestCohorts(rows);
}

/** True when every cohort id is allowed for this caller (test mode: the test cohort only). */
export function cohortsAllowed(ids: readonly string[], scope: TestScope | null): boolean {
  if (scope?.as !== "admin") return true;
  return ids.length > 0 && ids.every((id) => id === scope.testCohortId);
}

/**
 * Who a notice (bell row, push, email) may reach.
 *   - Admin in test mode: only their test student (and themselves). A send
 *     meant for real people goes to the test student instead.
 *   - The test student acting: only itself and its own admin.
 *   - Everyone else: never a hidden (test or robot) account.
 */
export function recipientsFor(ids: readonly string[], scope: TestScope | null, hidden: ReadonlySet<string>): string[] {
  const unique = [...new Set(ids)];
  if (scope) {
    const own = unique.filter((id) => id === scope.testUserId || id === scope.adminId);
    if (scope.as === "admin" && unique.length > 0 && own.length === 0) return [scope.testUserId];
    return own;
  }
  return unique.filter((id) => !hidden.has(id));
}

/**
 * Who may see a post by a hidden (test) author: the author, and their own
 * admin while in test mode. Real authors are visible as before.
 */
export function canSeeAuthor(authorId: string, viewerId: string | null, scope: TestScope | null, hidden: ReadonlySet<string>): boolean {
  if (!hidden.has(authorId)) return true;
  if (authorId === viewerId) return true;
  return scope?.as === "admin" && scope.testUserId === authorId;
}

/** Shown when an admin change is refused in test mode. */
export const TEST_MODE_REFUSED = "Test mode is on. Turn it off to change real data.";
