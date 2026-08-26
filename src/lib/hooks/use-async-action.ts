"use client";

import * as React from "react";

/**
 * useAsyncAction — a uniform loading / error contract for async interactions.
 *
 * The mobile principle (T49/T50): never make the user stare at an unexplained
 * blank screen, and every failure must have a recovery. This hook wraps a
 * fire-and-forget action with a `pending` flag (for spinner + aria-busy) and
 * an `error` string (rendered inline as a human message with the action's
 * error context). The action itself is responsible for preserving input state
 * on failure (do not clear the draft/composer on error).
 *
 *   const { run, pending, error, clearError } = useAsyncAction(async () => {
 *     const res = await fetch("/api/...", { method: "POST", ... });
 *     if (!res.ok) throw new Error("Couldn't save. Try again.");
 *   });
 *
 * `run` rethrows nothing to the caller — the error is captured into `error`.
 * Callers render the error inline (MobileErrorLine / AsyncErrorCard) and
 * offer the retry via `run` again.
 */
export function useAsyncAction<TArgs extends unknown[] = []>(
  action: (...args: TArgs) => Promise<void>,
) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const mounted = React.useRef(true);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const clearError = React.useCallback(() => setError(null), []);

  const run = React.useCallback(
    async (...args: TArgs) => {
      setPending(true);
      setError(null);
      try {
        await action(...args);
      } catch (e) {
        if (mounted.current) {
          setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
        }
      } finally {
        if (mounted.current) setPending(false);
      }
    },
    [action],
  );

  return { run, pending, error, clearError } as const;
}
