import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Local parts for the personal screens (Me area) in the new design. Small
 * wrappers around the ds tokens for things the ds parts do not cover yet:
 * buttons that are not links, form fields, a thin progress line, filter
 * chips that wrap, a plain empty state and a back link.
 */

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

/** The screen's one main action as a button: lime, 2px ink border, hard shadow, 52px. */
export const primaryButton =
  "inline-flex min-h-[3.25rem] min-w-0 cursor-pointer items-center justify-center gap-2 rounded-[var(--ds-radius)] border-2 border-foreground bg-primary px-5 py-3 text-center type-body font-bold text-primary-foreground hard-shadow-sm outline-none transition-[transform,box-shadow] duration-[var(--ds-press)] ease-[var(--ds-ease)] hover:-translate-y-0.5 hover:hard-shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-50 motion-reduce:hover:translate-y-0 [&_svg]:size-5 [&_svg]:shrink-0";

/** A second, quieter action: thin outline, no shadow, 44px. */
export const quietButton =
  "inline-flex min-h-11 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] bg-transparent px-4 py-2 text-center type-small font-semibold text-foreground outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:border-foreground hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

/** A text action inside a sentence or under a block: link colour, 44px tall to tap. */
export const textButton =
  "inline-flex min-h-11 min-w-0 cursor-pointer items-center gap-1.5 rounded-md type-small font-semibold text-link underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

/* ------------------------------------------------------------------ */
/* Fields                                                              */
/* ------------------------------------------------------------------ */

export const fieldClass =
  "min-h-12 w-full min-w-0 rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] bg-card px-3 py-2 type-body text-foreground outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] placeholder:text-muted-foreground hover:border-foreground focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive";

export const labelClass = "type-small font-semibold text-foreground";

/* ------------------------------------------------------------------ */
/* Back link                                                           */
/* ------------------------------------------------------------------ */

/** Up one level, above the page title. */
export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="-ml-1.5 inline-flex min-h-11 w-fit items-center gap-1 rounded-md pr-2 type-small font-semibold text-muted-foreground outline-none transition-colors duration-[var(--ds-state)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ChevronLeft className="size-5 shrink-0" aria-hidden />
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Stats row                                                           */
/* ------------------------------------------------------------------ */

/** Several numbers in one quiet row (wraps on narrow phones). No boxes. */
export function StatRow({ children, className, label }: { children: React.ReactNode; className?: string; label?: string }) {
  return (
    <dl aria-label={label} className={cn("flex min-w-0 flex-wrap gap-x-10 gap-y-5", className)}>
      {children}
    </dl>
  );
}

/** One number in a StatRow: the value large, its label under it. */
export function StatItem({ value, label, sub }: { value: React.ReactNode; label: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col-reverse">
      <dt className="type-caption text-muted-foreground">{label}</dt>
      <dd className="type-h1 type-num">
        {value}
        {sub ? <span className="type-small font-semibold text-muted-foreground"> {sub}</span> : null}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Progress line                                                       */
/* ------------------------------------------------------------------ */

/** A thin progress line (lime in light, lime in dark), 0 to 100. */
export function ProgressLine({ value, label, className }: { value: number; label: string; className?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-hairline)]", className)}
    >
      <div
        className="h-full origin-left rounded-full bg-brand transition-transform duration-[var(--ds-fill)] ease-[var(--ds-ease-out)] motion-reduce:transition-none dark:bg-primary"
        style={{ transform: `scaleX(${pct / 100})` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

/**
 * Nothing here yet: a plain title, one line, and at most one way on. No box,
 * no dashed border; it sits where the list would.
 */
export function EmptyLine({ title, children, action, className }: { title: React.ReactNode; children?: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col items-start gap-2 border-y border-[var(--ds-hairline)] py-6", className)}>
      <p className="type-body font-semibold [overflow-wrap:anywhere]">{title}</p>
      {children ? <p className="max-w-[60ch] type-small text-muted-foreground [overflow-wrap:anywhere]">{children}</p> : null}
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status word                                                         */
/* ------------------------------------------------------------------ */

const TONE = {
  quiet: "text-muted-foreground",
  good: "text-status-success-fg",
  alert: "text-status-alert-fg",
  ink: "text-foreground",
} as const;

/** A small status word ("Passed", "Solved"): text only, no pill. */
export function StatusWord({ tone = "quiet", icon, children }: { tone?: keyof typeof TONE; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 type-small font-semibold [&_svg]:size-4 [&_svg]:shrink-0", TONE[tone])}>
      {icon}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Filter chips                                                        */
/* ------------------------------------------------------------------ */

/** The chip look for filters. They wrap onto a second line instead of running off the screen. */
export function chipClass(on: boolean) {
  return cn(
    "inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full border-[1.5px] px-4 type-small font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring",
    on ? "border-foreground bg-foreground text-background" : "border-[var(--ds-card-line)] text-foreground hover:border-foreground hover:bg-[var(--ds-tint)]",
  );
}
export const chipRow = "flex min-w-0 flex-wrap gap-2";
