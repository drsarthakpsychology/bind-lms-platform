"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

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
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center py-8">
      <div className="w-full max-w-md space-y-4 text-center">
        <div
          aria-hidden
          className="mx-auto flex size-12 items-center justify-center rounded-md border-2 border-border bg-accent text-foreground"
        >
          <AlertTriangle className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-h2">Something went wrong</h2>
          <p className="mx-auto max-w-sm text-small text-muted-foreground">
            This page hit an unexpected snag. Nothing you&apos;ve done is lost —
            try again, and if it keeps happening we&apos;ll get it sorted.
          </p>
        </div>
        <Button onClick={() => unstable_retry()} variant="default">
          <RotateCcw className="size-4" aria-hidden />
          Try again
        </Button>
        {error.digest ? (
          <p className="text-caption text-muted-foreground">
            Reference <span className="font-mono">{error.digest}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
