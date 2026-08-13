import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Headline-number tile (not a chart): mono value, label, optional icon,
 * optional link. Used consistently for admin totals.
 */
export function StatCard({
  label,
  value,
  icon,
  href,
  accent = false,
  className,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  href?: string;
  accent?: boolean;
  className?: string;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "text-eyebrow",
            accent ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
        {icon ? (
          <span
            aria-hidden
            className={accent ? "text-primary-foreground" : "text-foreground"}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <span
        className={cn(
          "text-numeric text-3xl font-bold tracking-tight",
          accent ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {value}
      </span>
      {href ? (
        <span
          aria-hidden
          className="absolute top-2 right-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        >
          <ArrowUpRight className="size-4" />
        </span>
      ) : null}
    </>
  );

  const classes = cn(
    "group relative flex min-h-[6.5rem] flex-col gap-2 rounded-md border-2 border-border p-4 transition-[transform,box-shadow]",
    accent
      ? "border-foreground bg-primary text-primary-foreground hard-shadow-sm hover:hard-shadow-md hover:-translate-y-0.5"
      : "bg-card hard-shadow-flat hover:hard-shadow-sm hover:-translate-y-0.5",
    href && "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return <div className={classes}>{inner}</div>;
}
