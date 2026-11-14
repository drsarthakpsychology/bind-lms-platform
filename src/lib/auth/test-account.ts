/**
 * The admin "Reset test password" sets a password that is published in the
 * repo and docs. Only a marked test student account may get it.
 */
export function canResetToTestPassword(p: { is_test?: boolean | null; role?: string | null } | null | undefined): boolean {
  return Boolean(p && p.is_test === true && p.role === "student");
}
