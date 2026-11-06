/**
 * Doubt answered → notify the student (owner decision 2026-11-06):
 * an in-app notice straight away; ONE email only if that notice is still
 * unopened 48 hours later. Pure rules here (unit-tested); the database work
 * is in followup.ts.
 */

export const EMAIL_AFTER_MS = 48 * 3600_000;
/** How far back the sweep looks for answers that never got a notice. */
export const CATCH_UP_MS = 48 * 3600_000;

export type AnswerRow = { id: string; doubt_id: string; user_id: string; hidden?: boolean | null; created_at: string };
export type DoubtRef = { id: string; user_id: string; status: string | null };
export type FollowupRow = {
  reply_id: string;
  doubt_id: string;
  user_id: string;
  notification_id: string | null;
  notified_at: string;
  email_claimed_at: string | null;
  emailed_at: string | null;
  email_status: string | null;
};

/**
 * Admin answers that still need a notice: by an admin, not by the asker, not
 * hidden, on a doubt that isn't hidden, and not already recorded. When the
 * student already has an unopened notice for the same doubt, the new answer
 * is folded into it (so several quick replies never mean several emails).
 */
export function answersNeedingNotice(
  answers: AnswerRow[],
  doubts: Map<string, DoubtRef>,
  adminIds: Set<string>,
  recorded: Set<string>,
  doubtsWithOpenNotice: Set<string>,
): { notify: AnswerRow[]; merge: AnswerRow[] } {
  const notify: AnswerRow[] = [];
  const merge: AnswerRow[] = [];
  const seenDoubt = new Set(doubtsWithOpenNotice);
  const sorted = [...answers].sort((a, b) => a.created_at.localeCompare(b.created_at));
  for (const a of sorted) {
    if (a.hidden || recorded.has(a.id) || !adminIds.has(a.user_id)) continue;
    const d = doubts.get(a.doubt_id);
    if (!d || d.status === "hidden" || d.user_id === a.user_id) continue;
    if (seenDoubt.has(a.doubt_id)) merge.push(a);
    else {
      notify.push(a);
      seenDoubt.add(a.doubt_id);
    }
  }
  return { notify, merge };
}

export type EmailDecision = "wait" | "email" | "opened" | "done";

/** What to do with one recorded notice right now. */
export function emailDecision(f: FollowupRow, openedAt: string | null, now: number): EmailDecision {
  if (f.emailed_at || f.email_claimed_at || f.email_status) return "done";
  if (!f.notification_id) return "done"; // a merged answer: the first notice carries the email
  if (openedAt) return "opened";
  const sent = new Date(f.notified_at).getTime();
  if (!Number.isFinite(sent)) return "done";
  return now - sent >= EMAIL_AFTER_MS ? "email" : "wait";
}

/** Short, plain answer preview for the notice and the email. */
export function answerPreview(body: string, max = 280): string {
  const t = body.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** Escape text before it goes into the notice HTML. */
export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Per-instance throttle for the opportunistic check on admin page loads, so a
 * busy admin session runs the sweep at most once every `gapMs`.
 */
export function makeThrottle(gapMs: number) {
  let last = 0;
  return (now: number): boolean => {
    if (now - last < gapMs) return false;
    last = now;
    return true;
  };
}
