"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MobileStickyAction — the single thumb-reachable primary action.
 *
 * The mobile principle: every screen answers "what is the ONE thing I do
 * next?". This bar pins that action above the safe area (and above the bottom
 * tab bar where one is present) so it is reachable at every scroll position —
 * never buried below the fold behind a video, a quiz, or a long form.
 *
 * Compose a `Button` (or buttonVariants link) as the primary `children`.
 * `meta` is an optional context line ("Lesson 3 of 8", "Draft saved.") that
 * keeps the user oriented without stealing the action's emphasis.
 *
 * Safe-area + bottom-nav: the bar sits above the shared shell inset via the
 * `--nav-h` token when `offsetForNav` is set (shell pages), or flush to the
 * bottom safe area when it is not (immersive full-screen pages like the sim).
 */
export function MobileStickyAction({
  children,
  meta,
  offsetForNav = false,
  className,
}: {
  children: React.ReactNode;
  /** Optional context line above the action (position, saved state). */
  meta?: React.ReactNode;
  /** Pad above the bottom nav when the shell tab bar is visible. */
  offsetForNav?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-background/95 backdrop-blur-sm",
        className,
      )}
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)",
        ...(offsetForNav ? { marginBottom: "var(--nav-h, 0px)" } : null),
      }}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-1.5 px-4 pt-3">
        {meta ? (
          <div className="text-caption font-medium text-muted-foreground">{meta}</div>
        ) : null}
        <div className="flex items-stretch gap-2">{children}</div>
      </div>
    </div>
  );
}
