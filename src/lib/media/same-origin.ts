import "server-only";

/**
 * Same-origin gate for the media-token endpoints.
 *
 * The round-8 anti-theft guarantee: a stream token minted by one origin can't
 * be replayed from another. The browser always sends `Origin` on cross-origin
 * requests and on same-origin POSTs, so we REQUIRE it to be present and to
 * match the app origin.
 *
 * Policy (fail closed):
 *   - No `Origin` and no `Referer` → reject (403). A legit browser POST from
 *     the app always carries `Origin`; its absence is the curl/script/worker
 *     case this gate exists to block.
 *   - `Origin` present but != app origin → reject.
 *   - No `Origin` but `Referer` present → derive the origin from Referer; if
 *     it differs → reject. Referer is a fallback only for clients that don't
 *     send Origin (some GET contexts); it is parsed defensively so a malformed
 *     header can't throw.
 *
 * `NEXT_PUBLIC_APP_URL` is a build-time constant in the deployed bundle, so
 * the comparison is consistent within each build. Local dev sets it to
 * `http://localhost:3000` to match the dev origin.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Build-time constant (NEXT_PUBLIC_* is inlined at build time).
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL ?? "";

  // Fail closed if the app origin isn't configured — a misconfigured deploy
  // should refuse media tokens rather than mint them for any origin.
  if (!appOrigin) return false;

  if (origin) return origin === appOrigin;

  // Fall back to Referer only when Origin is absent. Parse defensively.
  if (referer) {
    try {
      return new URL(referer).origin === appOrigin;
    } catch {
      return false; // malformed Referer → reject, never 500
    }
  }

  // Neither Origin nor Referer → reject (curl / script / no-referrer).
  return false;
}
