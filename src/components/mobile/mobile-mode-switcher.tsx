"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MobileModeSwitcher — one task at a time, on the same surface.
 *
 * The mobile principle (T20/T30): where a screen stacks several equal-weight
 * tasks (five drills, two forms), a segmented switcher reveals ONE at a time
 * instead of forcing every option onto the viewport. This is the
 * one-cognitive-task-at-a-time version of a page — all modes stay reachable,
 * but only the active mode is shown.
 *
 * `modes` declares the labelled tasks in order; the parent owns `active` +
 * `onActiveChange`. `eyebrow` is an optional "Mode n of m" orientation line
 * rendered above the switcher so the user always knows where they are.
 *
 * The switcher itself uses the existing SegmentedControl for the active fill,
 * wrapped so it can scroll if many modes exist on a 320px screen.
 */
import { SegmentedControl } from "@/components/ui/segmented-control";

export function MobileModeSwitcher<T extends string>({
  modes,
  active,
  onActiveChange,
  label,
  eyebrow,
  className,
}: {
  modes: readonly { value: T; label: React.ReactNode }[];
  active: T;
  onActiveChange: (value: T) => void;
  label: string;
  /** "Mode 2 of 5" orientation line. */
  eyebrow?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {eyebrow ? (
        <p className="text-eyebrow text-link" role="status">
          {eyebrow}
        </p>
      ) : null}
      <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <SegmentedControl
          value={active}
          onValueChange={onActiveChange}
          options={modes}
          label={label}
        />
      </div>
    </div>
  );
}
