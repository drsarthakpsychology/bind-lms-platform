"use client";

import * as React from "react";
import { BackPill } from "./back";

/**
 * Every activity (games, Practice tools, Smart practice tools) sits in this
 * frame: one slim row with Back and the activity's name, then the activity at
 * full width. Back returns to the section the student came from
 * (navigation/sections.ts). The how-to, when an activity needs one, is its
 * show-once tip (components/help), never a line in the frame.
 */
export function ActivityFrame({
  title,
  fallback,
  children,
}: {
  title: string;
  fallback?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="activity-frame mx-auto w-full max-w-4xl lg:px-4">
      {/* Phones: the shell already gives the side margin, so the row adds none. */}
      <div className="activity-head flex min-w-0 items-center gap-3 py-2">
        <BackPill fallback={fallback} />
        <p className="min-w-0 truncate font-bold">{title}</p>
      </div>
      <div className="activity-body min-w-0 lg:rounded-3xl lg:border-2 lg:border-foreground lg:bg-card lg:py-2">{children}</div>
    </div>
  );
}
