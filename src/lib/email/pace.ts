/**
 * Email sending safety: pacing (stay under Resend's 10 requests/second),
 * plain-words failure reasons, and picking which failed emails can be retried
 * without sending anyone the same email twice. Pure (no database), so tested.
 */

export type FailureKind = "quota" | "rate" | "domain" | "address" | "config" | "network" | "other";

export type Explained = { kind: FailureKind; words: string; retryNow: boolean };

/** Turn a provider error into words an admin understands, and say if retrying now can work. */
export function explainFailure(reason: string | null | undefined): Explained {
  const r = String(reason ?? "").toLowerCase();
  if (/daily .*quota|daily email sending quota|quota/.test(r))
    return { kind: "quota", words: "Daily sending limit reached. Retry tomorrow, or after the plan limit resets.", retryNow: true };
  if (/too many requests|rate limit|429/.test(r))
    return { kind: "rate", words: "Sent too fast (more than 10 a second). Safe to retry — retries go out slowly.", retryNow: true };
  if (/domain is not verified|verify your domain/.test(r))
    return { kind: "domain", words: "The sending domain isn't verified with the email provider. Fix that first, then retry.", retryNow: true };
  if (/invalid .*(to|email|recipient)|not a valid|does not exist|bounce/.test(r))
    return { kind: "address", words: "The email address looks wrong or doesn't exist. Correct it before retrying.", retryNow: false };
  if (/not configured|api key|unauthori[sz]ed|401|403/.test(r))
    return { kind: "config", words: "Email isn't set up on the server (missing or wrong key).", retryNow: false };
  if (/network|fetch failed|timed? ?out|econn/.test(r))
    return { kind: "network", words: "Couldn't reach the email provider. Safe to retry.", retryNow: true };
  return { kind: "other", words: reason ? String(reason) : "Unknown reason.", retryNow: true };
}

/** A send that stopped because the daily quota is used up — stop the whole batch. */
export const isQuotaStop = (reason: string | null | undefined) => explainFailure(reason).kind === "quota";

export type FailedRow = {
  id: string;
  recipient: string;
  subject: string;
  template_id: string | null;
  created_at: string;
  html?: string | null;
  body_text?: string | null;
  error_reason?: string | null;
};
export type GoodRow = { recipient: string; subject: string; created_at: string };

export type RetryPlan = {
  /** Rows to send again, one per (recipient, subject). */
  send: FailedRow[];
  /** Already received the same email later — just mark as handled. */
  alreadyDelivered: FailedRow[];
  /** Same person + subject failed more than once — only the newest is sent. */
  duplicates: FailedRow[];
  /** No copy of the email was kept (and it isn't a login email). */
  noCopy: FailedRow[];
  /** Address problems etc. that a retry can't fix. */
  notRetryable: FailedRow[];
};

const key = (recipient: string, subject: string) => `${recipient.trim().toLowerCase()}\u0000${subject.trim()}`;

/**
 * Decide what a retry will do. Never sends twice to the same person for the
 * same subject, and never re-sends something they already received later.
 */
export function planRetry(failed: FailedRow[], good: GoodRow[]): RetryPlan {
  const latestGood = new Map<string, string>();
  for (const g of good) {
    const k = key(g.recipient, g.subject);
    if (!latestGood.has(k) || g.created_at > latestGood.get(k)!) latestGood.set(k, g.created_at);
  }
  const plan: RetryPlan = { send: [], alreadyDelivered: [], duplicates: [], noCopy: [], notRetryable: [] };
  const seen = new Set<string>();
  const newestFirst = [...failed].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  for (const f of newestFirst) {
    const k = key(f.recipient, f.subject);
    const okAt = latestGood.get(k);
    if (okAt && okAt > f.created_at) {
      plan.alreadyDelivered.push(f);
      continue;
    }
    if (seen.has(k)) {
      plan.duplicates.push(f);
      continue;
    }
    seen.add(k);
    if (!explainFailure(f.error_reason).retryNow) {
      plan.notRetryable.push(f);
      continue;
    }
    const isLogin = f.template_id === "credential";
    if (!isLogin && !f.html && !f.body_text) {
      plan.noCopy.push(f);
      continue;
    }
    plan.send.push(f);
  }
  return plan;
}

/**
 * Keeps sends at least `gapMs` apart across the whole server instance. With
 * 250 ms that is 4 a second — well under the provider's 10 a second, even if
 * two instances run at once.
 */
export function createPacer(gapMs: number, now: () => number = Date.now, sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))) {
  let next = 0;
  return async function wait() {
    const t = now();
    const at = Math.max(t, next);
    next = at + gapMs;
    if (at > t) await sleep(at - t);
  };
}
