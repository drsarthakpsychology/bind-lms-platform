import { APP_RULES } from "./config";

/**
 * The phone-change rule, as pure functions (no database).
 *
 * A "change" is a sign-in on a phone other than the one used last. A student
 * gets APP_RULES.deviceChangesPerMonth of them in any deviceWindowDays. An
 * admin can clear the count ("admin_reset"): only changes after the latest
 * reset count.
 */
export type ChangeRow = { kind: "switch" | "admin_reset" | string; created_at: string };

export const DEVICE_ID_RE = /^[A-Za-z0-9._-]{16,80}$/;

export function isExempt(role: string): boolean {
  return APP_RULES.deviceExemptRoles.includes(role);
}

/**
 * The store reviewer's account (Google Play, later Apple): set on the server
 * as APP_REVIEW_EMAILS, a comma list of emails. Those accounts may sign in on
 * any number of phones (reviewers use several test devices); one phone at a
 * time still applies. Not set, or empty: nobody is exempt.
 */
export function isReviewAccount(email: string | null | undefined, env: string | undefined = process.env.APP_REVIEW_EMAILS): boolean {
  if (!email || !env) return false;
  const want = email.trim().toLowerCase();
  if (!want) return false;
  return env
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .some((e) => e.length > 0 && e === want);
}

function counted(changes: readonly ChangeRow[], now: number): number[] {
  const windowStart = now - APP_RULES.deviceWindowDays * 86_400_000;
  let resetAt = -Infinity;
  for (const c of changes) if (c.kind === "admin_reset") resetAt = Math.max(resetAt, Date.parse(c.created_at));
  return changes
    .filter((c) => c.kind === "switch")
    .map((c) => Date.parse(c.created_at))
    .filter((t) => Number.isFinite(t) && t > windowStart && t > resetAt && t <= now)
    .sort((a, b) => a - b);
}

/** Phone changes that count right now. */
export function countRecentChanges(changes: readonly ChangeRow[], now: number): number {
  return counted(changes, now).length;
}

/** When the next change frees up (ISO), or null if one is free now. */
export function nextChangeAt(changes: readonly ChangeRow[], now: number): string | null {
  const times = counted(changes, now);
  const limit = APP_RULES.deviceChangesPerMonth;
  if (times.length < limit) return null;
  // The change that must age out for one slot to open.
  const blocking = times[times.length - limit];
  return new Date(blocking + APP_RULES.deviceWindowDays * 86_400_000).toISOString();
}
