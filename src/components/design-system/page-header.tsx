import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Standard page header: eyebrow/breadcrumb, title, description, optional
 * status badge, right-aligned actions. Server Component unless given an
 * interactive child through composition.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-1.5">
        {eyebrow ? (
          <div className="text-eyebrow text-muted-foreground">{eyebrow}</div>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="break-words text-h1">{title}</h1>
          {badge ? <div className="shrink-0">{badge}</div> : null}
        </div>
        {description ? (
          <p className="max-w-2xl text-small text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
