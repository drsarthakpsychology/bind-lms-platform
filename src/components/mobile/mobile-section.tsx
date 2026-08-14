import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MobileSection — a vertical content grouping with an optional header row.
 *
 * The workhorse for breaking a long mobile screen into scannable chunks:
 * a title (h3), an optional muted description line, an optional trailing
 * action, then the children stacked beneath with one rhythm. Server Component.
 */
export function MobileSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  const hasHeader = Boolean(title || description || action);

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      {hasHeader ? (
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            {title ? <h2 className="text-h3 text-foreground">{title}</h2> : null}
            {description ? (
              <p className="text-small text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
