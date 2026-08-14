"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders `children` inline on sm+ and collapsed behind a native <details>
 * on mobile. This is the "yield" in the T19 initial-viewport discipline: a
 * secondary "do this" surface (the weak-spots banner) stays available but
 * stops competing with the primary action on the first screenful.
 *
 * `children` is a resolved server element (the banner Link, or null when the
 * banner has nothing to report), so rendering it in both the desktop and
 * mobile slots does NOT re-run the server fetch.
 */
export function WeakSpotsCollapsible({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (children == null) return null;

  return (
    <div className={cn("mb-6", className)}>
      {/* Desktop: inline, unchanged. */}
      <div className="hidden sm:block">{children}</div>

      {/* Mobile: collapsed behind a compact summary. */}
      <details className="group sm:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-md border-2 border-border bg-card px-3 py-2 text-caption font-medium text-muted-foreground transition-colors hover:text-foreground">
          <span>{label}</span>
          <ChevronDown
            className="size-4 shrink-0 transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="pt-2">{children}</div>
      </details>
    </div>
  );
}
