// Sentry client config — runs in the browser.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Release/traces are sampled low for the free tier.
    tracesSampleRate: 0.1,
    // Ignore the noisy, expected errors:
    beforeSend(event) {
      const msg = event?.exception?.values?.[0]?.value ?? "";
      // Fullscreen / orientation / media-fetch rejections we already handle.
      if (
        /requestFullscreen|webkitRequestFullscreen|orientation.*lock|AbortError|The operation was aborted/i.test(
          msg,
        )
      ) {
        return null;
      }
      return event;
    },
  });
}
