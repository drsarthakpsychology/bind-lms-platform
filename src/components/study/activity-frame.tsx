"use client";

import * as React from "react";
import { BackPill } from "./back";

/**
 * Every activity (games, Practice tools, Smart practice tools) sits in this
 * frame: one slim row with Back and the activity's name, then the activity at
 * full width. Back returns to the section the student came from
 * (navigation/sections.ts). `purpose` and `how` are kept for the show-once
 * tip; the frame itself no longer prints them on every visit.
 */
export function ActivityFrame({
  title,
  fallback,
  children,
}: {
  title: string;
  /** One line on what this is for (for the show-once tip; not shown here). */
  purpose?: string;
  /** How to play (for the show-once tip; not shown here). */
  how?: string[];
  fallback?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl lg:px-4">
      <div className="flex min-w-0 items-center gap-3 px-4 py-2 lg:px-0">
        <BackPill fallback={fallback} />
        <p className="min-w-0 truncate font-bold">{title}</p>
      </div>
      <div className="min-w-0 lg:rounded-3xl lg:border-2 lg:border-foreground lg:bg-card lg:py-2">{children}</div>
    </div>
  );
}
