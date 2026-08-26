"use client";

import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * AsyncErrorCard — one error language for the whole app.
 *
 * The mobile principle (T50): every failure should explain what happened in
 * human language, preserve user state when possible, and offer an obvious
 * recovery action. This is the same contract the material viewer shipped
 * (T9): a human title, a plain-English explanation, an optional selectable
 * correlation id for support, and a Retry.
 *
 * `reference` is an optional correlation id the student can copy ("Reference:
 * 7K2M9") — the server-side log uses the same id, so support can trace it.
 */
export function AsyncErrorCard({
  title = "Something went wrong",
  message,
  reference,
  onRetry,
  retryLabel = "Try again",
  className,
}: {
  title?: string;
  message?: React.ReactNode;
  reference?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "animate-enter flex flex-col items-center gap-3 rounded-md border-2 border-border bg-card px-6 py-8 text-center hard-shadow-sm",
        className,
      )}
    >
      <div
        aria-hidden
        className="flex size-12 items-center justify-center rounded-md border-2 border-border bg-status-alert/15 text-status-alert-fg"
      >
        <AlertTriangle className="size-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-h3">{title}</h3>
        {message ? (
          <p className="mx-auto max-w-[40ch] text-small leading-relaxed text-muted-foreground">
            {message}
          </p>
        ) : null}
      </div>
      {reference ? (
        <p className="text-caption text-muted-foreground">
          Reference:{" "}
          <code className="select-all rounded-sm border border-border bg-accent px-1.5 py-0.5 font-mono">
            {reference}
          </code>
        </p>
      ) : null}
      {onRetry ? (
        <Button variant="default" size="lg" onClick={onRetry} className="mt-1">
          <RotateCcw className="size-4" aria-hidden />
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
