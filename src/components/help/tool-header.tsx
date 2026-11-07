"use client";

import * as React from "react";
import { TipButton, TipPanel, useFirstTimeTip, type TipContent } from "./first-time-tip";
import { cn } from "@/lib/utils";

/**
 * A page title with a small help button beside it. The how-to opens under the
 * title the first time a student visits, and folds into the button after
 * "Got it". Use it in place of an eyebrow, title and long subtitle.
 */
export function ToolHeader({
  title,
  tip,
  className,
  children,
}: {
  title: React.ReactNode;
  tip: TipContent & { id: string };
  className?: string;
  /** Anything else for the title row, after the help button (rare). */
  children?: React.ReactNode;
}) {
  const t = useFirstTimeTip(tip.id);
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <h1 className="min-w-0 flex-1 text-h1 text-balance">{title}</h1>
        <TipButton tip={t} label={tip.label ?? "How it works"} className="shrink-0" />
        {children}
      </div>
      <TipPanel tip={t} title={tip.title ?? tip.label ?? "How it works"} intro={tip.intro} steps={tip.steps}>
        {tip.children}
      </TipPanel>
    </div>
  );
}
