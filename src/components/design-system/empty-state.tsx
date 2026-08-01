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
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-border bg-card/50 px-6 text-center",
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
