"use client";

import * as React from "react";
import * as Sentry from "@sentry/nextjs";

import { ErrorState } from "@/components/design-system/error-state";
import { SiteHeader } from "@/components/site/site-header";

/**
 * Root error boundary. Catches uncaught render errors on every public route
 * without a closer boundary: the landing page, /login, /waitlist, /expired,
 * and /verify, so none of them ever show the bare Next.js fallback. Renders
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
    // boundary's effect so hydration isn't blocked: Sentry de-dupes repeats.
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <ErrorState onRetry={unstable_retry} digest={error.digest} homeHref="/go/home" className="flex-1 px-4 py-16" />
    </div>
  );
}
