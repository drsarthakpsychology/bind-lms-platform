/**
 * Next.js instrumentation hook — registers the Sentry SDK at startup.
 * Enabled only when a DSN is configured, so local dev without Sentry stays
 * silent.
 *
 * `onRequestError` (Next.js instrumentation API) forwards errors from Server
 * Components, route handlers, server actions and proxy to Sentry via
 * `captureRequestError` (@sentry/nextjs). Without it, server errors that never
 * reach an error.tsx boundary were not reported. The browser side lives in
 * src/instrumentation-client.ts.
 */
import type { Instrumentation } from "next";

const dsn = () => process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { init } = await import("@sentry/nextjs");
    const key = dsn();
    if (key) {
      init({
        dsn: key,
        tracesSampleRate: 0.1,
        // Attribute errors to the exact deployed commit (Vercel injects this).
        release: process.env.VERCEL_GIT_COMMIT_SHA,
        beforeSend(event) {
          const msg = event?.exception?.values?.[0]?.value ?? "";
          if (/requestFullscreen|AbortError|The operation was aborted/i.test(msg)) {
            return null;
          }
          return event;
        },
      });
    }
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge routes (if any) use the existing edge config, which is DSN-gated.
    await import("../sentry.edge.config");
  }
}

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  if (!dsn()) return;
  const { captureRequestError } = await import("@sentry/nextjs");
  captureRequestError(err, request, context);
};
