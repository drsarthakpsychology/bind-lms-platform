"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Segmented control — a group of mutually exclusive options rendered as
 * equal-width segments welded together by a shared 2px ink border and a hard
 * offset shadow. Same geometry as Button; the active segment fills terracotta.
 * This is the app's only rectangular segment primitive (replaces the old
 * pill-shaped view switcher, and reused for the lesson tabs).
 *
 * Accessible as a group of toggle buttons (role="group" + aria-pressed per
 * segment) rather than tabs.
 */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  label,
  className,
}: {
  value: T;
  onValueChange: (value: T) => void;
  options: readonly { value: T; label: React.ReactNode }[];
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-md border-2 border-foreground bg-background hard-shadow-sm",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onValueChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-1.5 px-3 text-sm font-semibold transition-[background-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
              // Active segment reads as a filled button pressed against its own
              // inset border; inactive segments stay transparent so the shared
              // ink border reads as one welded control.
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
