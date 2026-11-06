"use client";

import * as React from "react";
import { Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SLOW_AFTER_MS = 3000;
export const STUCK_AFTER_MS = 15000;

/**
 * Honest waiting (DI §C-10, §F "Waiting"): nothing for the first ~3 s, then
 * words instead of a silent skeleton; after ~15 s, a way out (Try again).
 * Timers start in an effect and set state only from their callbacks.
 */
export function SlowState({
  after = SLOW_AFTER_MS,
  stuckAfter = STUCK_AFTER_MS,
  message = "Still loading — this is slower than usual",
  className,
}: {
  after?: number;
  stuckAfter?: number;
  message?: string;
  className?: string;
}) {
  const [stage, setStage] = React.useState<"quiet" | "slow" | "stuck">("quiet");

  React.useEffect(() => {
    const slow = setTimeout(() => setStage((s) => (s === "quiet" ? "slow" : s)), after);
    const stuck = setTimeout(() => setStage("stuck"), stuckAfter);
    return () => {
      clearTimeout(slow);
      clearTimeout(stuck);
    };
  }, [after, stuckAfter]);

  return (
    <div role="status" aria-live="polite" className={cn(stage === "quiet" ? "sr-only" : "flex flex-wrap items-center gap-3 rounded-lg border-2 border-foreground bg-card px-4 py-3", className)}>
      {stage === "quiet" ? (
        <span>Loading</span>
      ) : (
        <>
          <Clock className="size-4 shrink-0 text-link" aria-hidden />
          <span className="text-small font-medium">{message}</span>
          {stage === "stuck" ? (
            <Button type="button" variant="outline" size="sm" className="pointer-coarse:min-h-11" onClick={() => window.location.reload()}>
              <RotateCcw aria-hidden /> Try again
            </Button>
          ) : null}
        </>
      )}
    </div>
  );
}

/**
 * Wrap a loading.tsx skeleton: the skeleton stays, and the SlowState line
 * appears above it once loading runs long. `aria-busy` tells screen readers
 * the region is still loading.
 */
export function LoadingFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div aria-busy="true" className={cn("space-y-4", className)}>
      <SlowState />
      {children}
    </div>
  );
}
