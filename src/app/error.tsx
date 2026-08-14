"use client";

import * as React from "react";
import * as Sentry from "@sentry/nextjs";

import { ErrorState } from "@/components/design-system/error-state";

/**
 * Root error boundary. Catches uncaught render errors on every public route
 * without a closer boundary — the landing page, /login, /enquire, /expired,
 * and /verify — so none of them ever show the bare Next.js fallback. Renders
 * inside the root layout (theme + fonts intact), full-viewport centered.
 * /(dashboard) has its own closer boundary.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  React.useEffect(() => {
    // Report to Sentry (no-op locally / without a DSN). This runs in the
    // boundary's effect so hydration isn't blocked — Sentry de-dupes repeats.
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      onRetry={unstable_retry}
      digest={error.digest}
      className="min-h-screen"
    />
  );
}
