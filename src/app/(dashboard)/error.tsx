"use client";

import * as React from "react";
import * as Sentry from "@sentry/nextjs";

import { ErrorState } from "@/components/design-system/error-state";

/**
 * Dashboard-segment error boundary. Catches uncaught render errors in any page
 * under /(dashboard) and shows a calm, on-brand fallback INSIDE the app shell
 * (the (dashboard)/layout.tsx AppShell is not wrapped by this boundary, so the
 * sidebar and top bar survive). Production error.message is generic by design;
 * we surface only the digest as a support reference.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  React.useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      onRetry={unstable_retry}
      digest={error.digest}
      className="min-h-[50vh]"
    />
  );
}
