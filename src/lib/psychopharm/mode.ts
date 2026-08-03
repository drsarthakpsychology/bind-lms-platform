/**
 * Environment mode for the psychopharm tool.
 *
 * test-mode (default unless explicitly turned off for production):
 *   Students may browse every medication — draft and in_review content is
 *   visible with an "awaiting review" badge, so the tool is usable before
 *   Dr. Sarthak has verified everything. This is a training/test environment.
 *
 * production:
 *   Set NEXT_PUBLIC_PSYCH_MODE=production. Only `published` rows are exposed
 *   to students (RLS + store filter), matching the launch-gate rule.
 *
 * The student store currently reads the generated JSON (all verbose content),
 * gated by this flag only for the production experience.
 */
export function isTestMode(): boolean {
  return process.env.NEXT_PUBLIC_PSYCH_MODE !== "production";
}

export const TEST_MODE_DEFAULT = true;