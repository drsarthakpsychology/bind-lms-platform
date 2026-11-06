import type { AccountStatus } from "./account-status";
import type { Presence } from "./presence";

/**
 * "Needs attention" flags on a student — the short list of things an admin
 * can act on. Pure, so it is tested. Shown as small chips on the student
 * list and profile, and counted on Home.
 */
export type AttentionFlag = "login" | "no-mobile" | "quiet" | "never-seen" | "behind" | "email-failing" | "no-details";

export const FLAG_LABEL: Record<AttentionFlag, string> = {
  login: "Login needs a hand",
  "no-mobile": "No mobile",
  quiet: "Quiet 7+ days",
  "never-seen": "Never came in",
  behind: "Behind on lectures",
  "email-failing": "Emails failing",
  "no-details": "Details form not filled",
};

export type AttentionInput = {
  account: AccountStatus;
  needsAction: boolean;
  mobile: string | null;
  presence: Presence;
  lecturesDone: number;
  lecturesAvailable: number;
  emailFailing: boolean;
  detailsDone: boolean;
};

/** Behind = has lectures to watch and has finished less than half of them. */
export function isBehind(done: number, available: number): boolean {
  return available >= 2 && done < Math.ceil(available / 2);
}

export function attentionFlags(i: AttentionInput): AttentionFlag[] {
  const out: AttentionFlag[] = [];
  const locked = i.account === "locked" || i.account === "expired";
  if (i.needsAction) out.push("login");
  if (i.emailFailing) out.push("email-failing");
  if (!locked && i.account === "active") {
    if (i.presence === "quiet") out.push("quiet");
    if (isBehind(i.lecturesDone, i.lecturesAvailable)) out.push("behind");
    if (!i.detailsDone) out.push("no-details");
  }
  if (!locked && i.account !== "active" && i.presence === "never" && !i.needsAction) out.push("never-seen");
  if (!i.mobile) out.push("no-mobile");
  return out;
}
