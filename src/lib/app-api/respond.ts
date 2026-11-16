import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import type { ApiErrorCode } from "./contract";

/** HTTP status for each error code (docs/app/API_CONTRACT.md, section 1). */
export const STATUS: Record<ApiErrorCode, number> = {
  bad_request: 400,
  invalid_credentials: 401,
  unauthenticated: 401,
  token_expired: 401,
  device_replaced: 401,
  device_required: 401,
  account_blocked: 403,
  account_expired: 403,
  scope: 403,
  access_block: 403,
  feature_locked: 403,
  feature_off: 403,
  forbidden: 403,
  device_limit: 403,
  video_refused: 403,
  not_found: 404,
  conflict: 409,
  too_large: 413,
  upgrade_required: 426,
  rate_limited: 429,
  server_error: 500,
  unavailable: 503,
};

/** Plain words for each code, used when a route gives no message of its own. */
export const MESSAGE: Record<ApiErrorCode, string> = {
  bad_request: "Something in that request isn't right.",
  invalid_credentials: "Incorrect email or password.",
  unauthenticated: "Please sign in.",
  token_expired: "Your sign-in needs refreshing.",
  device_replaced: "Signed out: opened on another device.",
  device_required: "This request is missing the device id.",
  account_blocked: "Your account is paused.",
  account_expired: "This account's access has ended.",
  scope: "This isn't part of your access.",
  access_block: "This section is switched off for your account.",
  feature_locked: "This isn't live yet.",
  feature_off: "This isn't available.",
  forbidden: "You can't do that.",
  device_limit: "You've changed phones too many times this month. Ask us to allow this phone.",
  video_refused: "Video can't play on this device.",
  not_found: "Not found.",
  conflict: "That clashes with what is already saved.",
  too_large: "That is too large.",
  upgrade_required: "Update the app to continue.",
  rate_limited: "Too many requests. Wait a minute and try again.",
  server_error: "Something went wrong. Try again.",
  unavailable: "This isn't set up yet.",
};

const HEADERS = { "Cache-Control": "private, no-store" } as const;

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status, headers: HEADERS });
}

/**
 * A GET answer with an ETag. When the app sends back the ETag of the copy it
 * already has (If-None-Match) and nothing changed, the answer is an empty 304
 * instead of the whole body again. The answer stays `private, no-store`: the
 * app keeps its own copy, nothing in between keeps one.
 */
export function okTagged<T>(req: Request, data: T): Response {
  const body = JSON.stringify({ ok: true, data });
  const etag = `W/"${createHash("sha1").update(body).digest("base64url")}"`;
  const headers = { ...HEADERS, ETag: etag, Vary: "Authorization" };
  const sent = req.headers.get("if-none-match");
  if (sent && sent.split(",").some((t) => t.trim() === etag)) return new Response(null, { status: 304, headers });
  return new Response(body, { status: 200, headers: { ...headers, "Content-Type": "application/json" } });
}

export function fail(code: ApiErrorCode, message?: string, details?: Record<string, unknown>): NextResponse {
  return NextResponse.json({ ok: false, error: { code, message: message ?? MESSAGE[code], ...(details ? { details } : {}) } }, { status: STATUS[code], headers: HEADERS });
}

/** Thrown inside a handler to answer an error from anywhere. */
export class ApiFail extends Error {
  constructor(
    readonly code: ApiErrorCode,
    message?: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message ?? MESSAGE[code]);
  }
  response(): NextResponse {
    return fail(this.code, this.message, this.details);
  }
}
