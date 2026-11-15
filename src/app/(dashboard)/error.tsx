"use client";

import * as React from "react";
import * as Sentry from "@sentry/nextjs";

import { ErrorState } from "@/components/design-system/error-state";
import { ErrorV2 } from "@/components/v2me/states";
import { useUiV2 } from "@/components/v2me/ui-v2";

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

  const v2 = useUiV2();
  if (v2) return <ErrorV2 onRetry={unstable_retry} digest={error.digest} homeHref="/go/home" />;

  return (
    <ErrorState
      onRetry={unstable_retry}
      digest={error.digest}
      homeHref="/go/home"
      className="min-h-[50vh]"
    />
  );
}
