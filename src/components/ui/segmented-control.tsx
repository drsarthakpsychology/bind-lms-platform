"use client";

import * as React from "react";
import { motion, useReducedMotion } from "@/lib/motion";

import { cn } from "@/lib/utils";

/**
 * Segmented control — a group of mutually exclusive options rendered as
 * equal-width segments welded together by a shared 2px ink border and a hard
 * offset shadow. Same geometry as Button; the active segment fills terracotta.
 * This is the app's only rectangular segment primitive (replaces the old
 * pill-shaped view switcher, and reused for the lesson tabs).
 *
 * The active fill slides between segments via a layout-animated indicator.
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
  const reduce = useReducedMotion();

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
              "relative inline-flex h-11 items-center justify-center gap-1.5 px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Sliding active fill — same layoutId across the group, so it
                animates to whichever segment is active. */}
            {isActive && (
              <motion.span
                layoutId={`segmented-${label}`}
                aria-hidden
                className="absolute inset-0 bg-primary"
                transition={
                  reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }
                }
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
