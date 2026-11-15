"use client";

import * as React from "react";
import * as Sentry from "@sentry/nextjs";

import { ErrorState } from "@/components/design-system/error-state";
import { AdminErrorV2, useAdminV2 } from "./_v2/v2-context";

/**
 * Admin error boundary: any admin page that throws lands here, inside the
 * admin layout, so the section tabs and the app shell stay on screen.
 */
export default function AdminError({ error, unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  React.useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  const v2 = useAdminV2();
  if (v2) return <AdminErrorV2 onRetry={unstable_retry} digest={error.digest} />;
  return <ErrorState onRetry={unstable_retry} digest={error.digest} homeHref="/go/home" className="min-h-[50vh]" />;
}
