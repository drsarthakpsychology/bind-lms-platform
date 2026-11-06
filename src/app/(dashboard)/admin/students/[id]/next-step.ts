import type { AccountStatus } from "@/lib/people/account-status";
import type { AttentionFlag } from "@/lib/people/attention";

/**
 * Student 360: the ONE suggested next step (DI §C-8). The most useful thing
 * an admin can do for this person right now, in priority order. Pure so it
 * is tested and predictable.
 */
export type NextStepInput = {
  account: AccountStatus | null;
  waitingDoubts: number;
  cohorts: number;
  flags: AttentionFlag[];
  lecturesDone: number;
  lecturesAvailable: number;
  certificates: number;
};

export type NextStep = {
  /** Plain words, e.g. "Reply to their doubt". */
  label: string;
  /** Why (one short line). */
  why: string;
  /** What the button does. */
  action: "reply" | "access" | "login-link" | "add-cohort" | "message" | "certificate" | "none";
};

export function suggestNextStep(i: NextStepInput): NextStep {
  if (i.waitingDoubts > 0)
    return { label: i.waitingDoubts === 1 ? "Reply to their doubt" : `Reply to their ${i.waitingDoubts} doubts`, why: "They're waiting for an answer.", action: "reply" };
  if (i.account === "locked") return { label: "Unlock their access", why: "They can't sign in right now.", action: "access" };
  if (i.account === "expired") return { label: "Extend their access", why: "Their access has ended.", action: "access" };
  if (i.account === "not-invited" || i.account === "link-expired" || i.account === "email-failed")
    return {
      label: "Send a login link",
      why: i.account === "email-failed" ? "The last login email didn't go out." : i.account === "link-expired" ? "Their last link expired." : "They haven't been invited yet.",
      action: "login-link",
    };
  if (i.cohorts === 0) return { label: "Add them to a cohort", why: "They aren't in any cohort, so no lectures open for them.", action: "add-cohort" };
  if (i.account === "set-up" || i.account === "invited" || i.flags.includes("never-seen"))
    return { label: "Send a nudge", why: "They haven't come in yet.", action: "message" };
  if (i.flags.includes("behind") || i.flags.includes("quiet"))
    return { label: "Send a nudge", why: i.flags.includes("behind") ? "They're behind on lectures." : "They've been quiet for 7+ days.", action: "message" };
  if (i.lecturesAvailable > 0 && i.lecturesDone >= i.lecturesAvailable && i.certificates === 0)
    return { label: "Issue a certificate", why: "They've finished every lecture.", action: "certificate" };
  return { label: "Nothing needed", why: "They're on track.", action: "none" };
}

/** Lectures progress as a whole percentage (0 when nothing is open yet). */
export function progressPct(done: number, available: number): number {
  if (!available || available <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((done / available) * 100)));
}
