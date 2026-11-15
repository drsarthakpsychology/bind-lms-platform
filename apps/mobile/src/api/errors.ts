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
