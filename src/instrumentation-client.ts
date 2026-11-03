/**
 * Browser-side Sentry (Next.js instrumentation-client convention).
 *
 * Under Turbopack (the Next 16 default) `sentry.client.config.ts` is no longer
 * loaded; @sentry/nextjs 10 expects the client init here instead (its webpack
 * config warns: "When using Turbopack `sentry.client.config.ts` will no longer
 * work"). Enabled only when NEXT_PUBLIC_SENTRY_DSN is set. If a webpack build
 * also injects sentry.client.config.ts, the getClient() guard avoids a second
 * init.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn && !Sentry.getClient()) {
  try {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
      // Ignore the noisy, expected errors (same set as sentry.client.config.ts).
      beforeSend(event) {
        const msg = event?.exception?.values?.[0]?.value ?? "";
        if (/requestFullscreen|webkitRequestFullscreen|orientation.*lock|AbortError|The operation was aborted/i.test(msg)) {
          return null;
        }
        return event;
      },
    });
  } catch {
    /* monitoring must never break the app */
  }
}

/** App Router navigation spans (no-op when Sentry is not initialised). */
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
