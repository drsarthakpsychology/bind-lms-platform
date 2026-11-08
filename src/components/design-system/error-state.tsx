import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Shared uncaught-error fallback for error.tsx boundaries. Calm, on-brand,
 * trust-preserving: icon, title, short copy, a retry action, and an optional
 * error digest as a support reference. Boundary files pass their own wrapper
 * height: full viewport for public routes, inside-the-shell for /(dashboard).
 * `homeHref` adds a way out when trying again does not help.
 */
export function ErrorState({
  onRetry,
  digest,
  homeHref,
  className,
}: {
  onRetry: () => void;
  digest?: string;
  homeHref?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center py-8",
        className
      )}
    >
      <div className="animate-enter w-full max-w-md space-y-4 text-center">
        <div
          aria-hidden
          className="mx-auto flex size-12 items-center justify-center rounded-md border-2 border-border bg-accent text-foreground"
        >
          <AlertTriangle className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-h2">Something went wrong</h2>
          <p className="mx-auto max-w-sm text-small text-muted-foreground">
            Nothing you&apos;ve done is lost.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button onClick={onRetry} variant="default">
            <RotateCcw className="size-4" aria-hidden />
            Try again
          </Button>
          {homeHref ? (
            <Button asChild variant="outline">
              <Link href={homeHref}>
                <ArrowLeft className="size-4" aria-hidden />
                Back to Home
              </Link>
            </Button>
          ) : null}
        </div>
        {digest ? (
          <p className="text-caption text-muted-foreground">
            Reference <span className="font-mono">{digest}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
