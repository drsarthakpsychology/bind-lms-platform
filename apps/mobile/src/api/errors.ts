import type { ApiErrorCode } from "./contract";

/** A failed API call. `code` is what the app switches on; `message` can be shown as is. */
export class ApiFailure extends Error {
  readonly code: ApiErrorCode | "network";
  readonly status: number;
  readonly details: Record<string, unknown>;
  constructor(code: ApiErrorCode | "network", message: string, status = 0, details: Record<string, unknown> = {}) {
    super(message);
    this.name = "ApiFailure";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

/** A line to show the student for any thrown value. */
export function messageOf(e: unknown): string {
  if (e instanceof ApiFailure) return e.message;
  return "Something went wrong. Try again.";
}

/** Section closed for this account (hide it, do not show an error). */
export function isClosed(e: unknown): boolean {
  return e instanceof ApiFailure && (e.code === "scope" || e.code === "access_block" || e.code === "feature_off" || e.code === "feature_locked");
}

const OFFLINE_LINE = "Check your internet and try again.";

/**
 * The real reason something failed, in plain words, for error lines and
 * "could not load" states. Only a failure to reach the server blames the
 * internet. Works for API failures and for plain errors from the phone's own
 * downloads and the video player (their text is read for the usual causes).
 */
export function reasonOf(e: unknown): string {
  if (e === undefined || e === null) return OFFLINE_LINE;
  if (e instanceof ApiFailure) {
    if (e.code === "network") return OFFLINE_LINE;
    if (e.code === "server_error" || e.code === "unavailable") return "Something went wrong on our side. Try again in a minute.";
    return e.message || "Something went wrong. Try again.";
  }
  const text = e instanceof Error ? e.message : typeof e === "string" ? e : "";
  if (/network|internet|offline|timed? ?out|unable to resolve|connect|unreachable|socket/i.test(text)) return OFFLINE_LINE;
  if (/\b(401|403)\b|forbidden|unauthori[sz]ed/i.test(text)) return "This is not open for your account right now. Sign in again or ask us.";
  if (/\b(404|410)\b|not found/i.test(text)) return "This is no longer here.";
  if (/\b5\d\d\b/.test(text)) return "Something went wrong on our side. Try again in a minute.";
  return "Something went wrong. Try again.";
}
