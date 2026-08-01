// Sentry server config — runs in Node (server actions, API routes).
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    // Ignore the same noisy set server-side (e.g. aborted media fetches).
    beforeSend(event) {
      const msg = event?.exception?.values?.[0]?.value ?? "";
      if (/requestFullscreen|AbortError|The operation was aborted/i.test(msg)) {
        return null;
      }
      return event;
    },
  });
}
