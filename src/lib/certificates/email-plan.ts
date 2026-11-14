/**
 * Which certificate emails go out now and which wait in the queue, so a big
 * cohort never runs past the daily email limit. Pure, so it is tested.
 */
export type EmailTarget = { credentialId: string; email: string | null; name: string; userId: string | null };

export type EmailPlan = {
  send: EmailTarget[];
  queue: EmailTarget[];
  /** No address on file: in-app notice only. */
  noEmail: EmailTarget[];
  /** Emails left today before this batch. */
  remaining: number;
};

export function planEmails(targets: EmailTarget[], opts: { configured: boolean; limit: number; sentToday: number }): EmailPlan {
  const remaining = Math.max(0, Math.floor(opts.limit) - Math.max(0, opts.sentToday));
  const withEmail = targets.filter((t) => t.email);
  const noEmail = targets.filter((t) => !t.email);
  if (!opts.configured) return { send: [], queue: [], noEmail: targets, remaining };
  return { send: withEmail.slice(0, remaining), queue: withEmail.slice(remaining), noEmail, remaining };
}

/** The daily limit: RESEND_DAILY_LIMIT, or 100 (the free plan). */
export function dailyEmailLimit(env: Record<string, string | undefined> = process.env): number {
  const n = Number(env.RESEND_DAILY_LIMIT);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 100;
}

/** The provider's day starts at midnight UTC; count sends since then. */
export function startOfEmailDay(now: Date = new Date()): string {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
}
