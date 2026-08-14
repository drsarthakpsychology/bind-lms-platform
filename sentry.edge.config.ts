// Sentry edge config — runs on the Edge runtime (middleware, edge routes).
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    // Middleware rejects sessions/refresh tokens on the hot path; those are
    // expected control flow, not defects — keep the issue list signal-clean.
    beforeSend(event) {
      const msg = event?.exception?.values?.[0]?.value ?? "";
      if (/requestFullscreen|AbortError|The operation was aborted/i.test(msg)) {
        return null;
      }
      return event;
    },
  });
}
