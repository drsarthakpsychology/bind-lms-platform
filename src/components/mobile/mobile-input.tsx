"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MobileInput — a touch-comfortable input/textarea for phone surfaces.
 *
 * The mobile principle (T53): every input must be comfortable for touch and
 * survive the software keyboard. This wraps the design tokens at ≥44px height
 * (the WCAG 2.2 primary-action target) with a 2px ink border and a clear
 * focus ring, and reads the native `inputMode`/`enterKeyHint` props so the
 * keyboard matches the field (tel for phone numbers, numeric for scores,
 * enter for chat lines).
 *
 * Migrate raw `ui/Input` (h-9) and hand-rolled `py-2` inputs on mobile
 * surfaces onto this. Desktop keeps `ui/Input`; this is the mobile-height
 * variant, not a replacement for every input in the app.
 */
export const MobileInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { textarea?: false }
>(function MobileInput({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "min-h-11 w-full rounded-md border-2 border-border bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
    />
  );
});

export const MobileTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { textarea?: true }
>(function MobileTextarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className={cn(
        "min-h-11 w-full rounded-md border-2 border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
    />
  );
});
