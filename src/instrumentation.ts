/**
 * Next.js instrumentation hook — registers the Sentry SDK at startup.
 * Enabled only when a DSN is configured, so local dev without Sentry stays
 * silent.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { init } = await import("@sentry/nextjs");
    const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (dsn) {
      init({
        dsn,
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
}
