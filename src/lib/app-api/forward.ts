import "server-only";
import { ApiFail } from "./respond";
import type { ApiErrorCode } from "./contract";

/**
 * Runs one of the website's own JSON route handlers (for example
 * /api/practice/osce/attempt) for an app request, inside the app request
 * scope, so its own checks, rate limits, scoring and writes apply unchanged.
 * Its JSON answer is returned as is; an error status becomes the app's error
 * shape with the website's own words. Nothing is copied from the handler.
 */
export type JsonHandler = (req: Request) => Promise<Response>;

const CODE: Record<number, ApiErrorCode> = { 400: "bad_request", 401: "unauthenticated", 404: "not_found", 409: "conflict", 413: "too_large", 429: "rate_limited", 503: "unavailable" };
const REASON = new Set<ApiErrorCode>(["account_blocked", "scope", "access_block", "feature_locked", "feature_off"]);

export async function forwardJson(handler: JsonHandler, path: string, body: unknown): Promise<Record<string, unknown>> {
  const req = new Request(`https://app.internal${path}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body ?? {}) });
  const res = await handler(req);
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (res.ok) return json;
  const message = typeof json.error === "string" && json.error !== "unauthorized" ? json.error : undefined;
  if (res.status === 403) {
    const reason = json.reason as ApiErrorCode | undefined;
    throw new ApiFail(reason && REASON.has(reason) ? reason : "forbidden", message);
  }
  throw new ApiFail(CODE[res.status] ?? "server_error", res.status >= 500 ? undefined : message);
}
