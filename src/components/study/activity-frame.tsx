"use client";

import * as React from "react";
import { BackPill } from "./back";
import { TipButton, TipPanel, useFirstTimeTip } from "@/components/help/first-time-tip";

/**
 * Every activity (games, Coach, quizzes, Detective, clinical words) sits in
 * this frame: one top row with Back, the activity name and a small help
 * button, then the activity itself.
 *
 * The how-to (`purpose` plus `how`) shows once, the first time a student opens
 * the activity. After "Got it" it folds into the help button in the top row.
 */
export function ActivityFrame({
  title,
  purpose,
  how,
  fallback,
  tipId,
  tipLabel = "How to play",
  children,
}: {
  title: string;
  /** One line on what the activity is. Shown in the first-time tip only. */
  purpose?: string;
  how: readonly string[];
  fallback?: string;
  /** Defaults to the title, lowercased with hyphens. */
  tipId?: string;
  tipLabel?: string;
  children: React.ReactNode;
}) {
  const tip = useFirstTimeTip(tipId ?? slug(title));
  return (
    <div className="mx-auto w-full max-w-4xl lg:px-8 lg:py-4">
      <div className="flex items-center gap-2 border-b-2 border-foreground/10 px-4 py-2 lg:border-0 lg:px-0">
        <BackPill fallback={fallback} />
        <h1 className="min-w-0 flex-1 truncate font-bold">{title}</h1>
        <TipButton tip={tip} label={tipLabel} className="shrink-0" />
      </div>
      <TipPanel tip={tip} title={tipLabel} intro={purpose} steps={how} className="mx-4 mt-3 lg:mx-0 lg:mt-0 lg:mb-4" />
      <div className="min-w-0 lg:rounded-3xl lg:border-2 lg:border-foreground lg:bg-card lg:py-2">{children}</div>
    </div>
  );
}

export function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "activity"
  );
}
