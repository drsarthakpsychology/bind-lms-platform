/**
 * One account status for a student, in one set of words, used on every admin
 * screen (Students, Cohorts, Pipeline, Messages, Home). Before this, each
 * screen worked it out on its own ("Signed in", "Set up", "Not signed in",
 * "Pending", "Locked") and they disagreed. Pure, so it is tested.
 *
 * Order matters: a locked account is "Locked" whatever else is true; an
 * expired one is "Expired"; then how far the person got with logging in.
 */
export type AccountStatus =
  | "locked"
  | "expired"
  | "active"
  | "set-up"
  | "invited"
  | "link-expired"
  | "email-failed"
  | "not-invited";

export type AccountFacts = {
  /** profiles.status === "blocked" */
  blocked?: boolean;
  /** profiles.expires_at (ISO) */
  expiresAt?: string | null;
  role?: string | null;
  /** profiles.active_session_token is set = has signed in at least once. */
  hasSignedIn?: boolean;
  /** Last time seen anywhere on VIBHA (page visit or lecture progress). */
  lastSeen?: string | null;
  /** credential_invites.setup_completed_at or a used setup token. */
  setupDoneAt?: string | null;
  /** Latest setup link: when it expires and whether it was used. */
  linkExpiresAt?: string | null;
  linkUsed?: boolean;
  /** Latest login email: sent / failed / not sent. */
  inviteState?: "sent" | "failed" | "pending" | null;
};

export const ACCOUNT_LABEL: Record<AccountStatus, string> = {
  locked: "Locked",
  expired: "Access ended",
  active: "Active",
  "set-up": "Password set, not signed in",
  invited: "Invited",
  "link-expired": "Link expired",
  "email-failed": "Login email failed",
  "not-invited": "Not invited yet",
};

/** What the admin should do next, in plain words (null = nothing). */
export const ACCOUNT_NEXT: Record<AccountStatus, string | null> = {
  locked: "Unlock when they should get back in.",
  expired: "Extend access if they should continue.",
  active: null,
  "set-up": "They set a password but never came in. Send a nudge.",
  invited: "Waiting for them to set a password.",
  "link-expired": "Send a new login link.",
  "email-failed": "The login email didn't go out. Retry it or copy the link.",
  "not-invited": "Send their login link.",
};

/** Chip tone per status (maps to Badge variants in the design system). */
export const ACCOUNT_TONE: Record<AccountStatus, "published" | "destructive" | "pending" | "outline"> = {
  locked: "destructive",
  expired: "destructive",
  active: "published",
  "set-up": "pending",
  invited: "pending",
  "link-expired": "pending",
  "email-failed": "destructive",
  "not-invited": "outline",
};

export function accountStatus(f: AccountFacts, now = Date.now()): AccountStatus {
  if (f.blocked) return "locked";
  if (f.expiresAt && f.role !== "alumni" && new Date(f.expiresAt).getTime() <= now) return "expired";
  if (f.hasSignedIn || f.lastSeen) return "active";
  if (f.setupDoneAt || f.linkUsed) return "set-up";
  if (f.inviteState === "failed") return "email-failed";
  if (f.linkExpiresAt && new Date(f.linkExpiresAt).getTime() <= now) return "link-expired";
  if (f.inviteState === "sent" || f.linkExpiresAt) return "invited";
  return "not-invited";
}

/** Statuses that need the admin to do something. */
export const NEEDS_ACTION: AccountStatus[] = ["link-expired", "email-failed", "not-invited", "set-up"];
