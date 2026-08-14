import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MobileCompletionState — a consistent "you finished this" moment.
 *
 * The mobile principle: completion is a useful beat, not clutter. A compact
 * check-in-kettlemark + one line of honest copy + an obvious next action.
 * Used across lessons, sections, assessments, drills, cases, and courses so
 * the product has ONE completion language instead of a per-screen shrug.
 *
 * `title` is what was finished ("Lesson complete", "Scenario scored").
 * `description` is the useful feedback ("You scored 3 of 5 — the missed cue
 * was the pressured-speech trigger.").
 * `action` is the single next step (a `Button`/link). `secondary` is an
 * optional quiet alternative (review again, see details).
 */
export function MobileCompletionState({
  title,
  description,
  action,
  secondary,
  icon,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  secondary?: React.ReactNode;
  /** Override the default check mark (e.g. a score, a flag, a stamp). */
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-enter flex flex-col items-center gap-4 px-6 py-10 text-center",
        className,
      )}
    >
      <div
        aria-hidden
        className="flex size-14 items-center justify-center rounded-md border-2 border-foreground bg-primary text-primary-foreground hard-shadow-sm"
      >
        {icon ?? <Check className="size-7" strokeWidth={3} />}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-h3 text-foreground">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-[36ch] text-small leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
      {secondary ? (
        <div className="text-caption text-muted-foreground">{secondary}</div>
      ) : null}
    </div>
  );
}
