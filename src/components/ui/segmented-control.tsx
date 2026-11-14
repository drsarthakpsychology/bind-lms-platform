"use client";

import * as React from "react";
import { motion, useReducedMotion } from "@/lib/motion";

import { cn } from "@/lib/utils";
import { segmentGroup, segmentItem } from "@/components/design-system/segment";

/**
 * Segmented control: a group of mutually exclusive options in one bordered
 * 10px box; the active segment fills ink. Same look as every other tab or
 * either-or switch in the app (segmentGroup / segmentItem in
 * design-system/segment.ts).
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
      className={cn(segmentGroup, className)}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onValueChange(option.value)}
            aria-pressed={isActive}
            className={segmentItem(false, isActive ? "text-background hover:bg-transparent" : undefined)}
          >
            {/* Sliding active fill: same layoutId across the group, so it
                animates to whichever segment is active. */}
            {isActive && (
              <motion.span
                layoutId={`segmented-${label}`}
                aria-hidden
                className="absolute inset-0 rounded-sm bg-foreground"
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
