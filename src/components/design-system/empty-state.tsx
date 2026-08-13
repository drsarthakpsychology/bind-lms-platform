import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Empty state with icon, title, supporting copy, and an optional action.
 * `compact` for inline table/panel empties, default for full-page empties.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
  row = false,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
  /** Row layout — left-aligned, matches the height of a filled list row. */
  row?: boolean;
  className?: string;
}) {
  if (row) {
    return (
      <div
        className={cn(
          "animate-enter flex items-center gap-3 rounded-lg border-2 border-dashed border-border bg-card/50 px-4 py-3",
          className
        )}
      >
        <div
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-border bg-accent text-foreground"
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-small font-semibold text-foreground">{title}</h3>
          {description ? (
            <p className="text-caption text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "animate-enter flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-border bg-card/50 px-6 text-center",
        compact ? "py-8" : "py-16",
        className
      )}
    >
      <div
        aria-hidden
        className="flex size-12 items-center justify-center rounded-md border-2 border-border bg-accent text-foreground"
      >
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-h3">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-sm text-small text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
