import * as React from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Design system v2: the smaller shared parts. One of each, used by every
 * area (Learn, Practise, Library, Me): the way back, a thin progress line,
 * underlined tabs, a row of numbers, the empty line, a fold, the next step,
 * and the button, field and chip looks for things that are not links.
 */

/* ------------------------------------------------------------------ */
/* Buttons, fields, chips (class sets)                                 */
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

/** The way back, above the page title: a quiet line of text, 44px tall, no box. */
export function BackLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      data-back
      className={cn(
        "-ml-2 inline-flex min-h-11 w-fit max-w-full min-w-11 items-center gap-1 self-start rounded-lg px-2 type-small font-semibold text-muted-foreground outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <ChevronLeft className="size-4 shrink-0" aria-hidden />
      <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
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

/** A thin progress line: lime on a hairline track, fills in 600ms. */
export function ProgressLine({ pct, label, className }: { pct: number; label: string; className?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-hairline)]", className)}>
      <div className="h-full origin-left rounded-full bg-primary transition-transform duration-[var(--ds-fill)] ease-[var(--ds-ease-out)] motion-reduce:transition-none" style={{ transform: `scaleX(${v / 100})` }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs and text choices                                               */
/* ------------------------------------------------------------------ */

/** Underlined tabs in one row. Links when `href` is given, buttons otherwise. */
export function TabRow<T extends string>({
  label,
  tabs,
  current,
  onSelect,
  className,
}: {
  label: string;
  tabs: { id: T; label: string; href?: string }[];
  current: T;
  onSelect?: (id: T) => void;
  className?: string;
}) {
  const cls = (on: boolean) =>
    cn(
      "relative inline-flex h-12 shrink-0 cursor-pointer items-center px-1 type-small font-semibold outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring",
      "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:transition-colors after:duration-[var(--ds-state)]",
      on ? "text-foreground after:bg-foreground" : "text-muted-foreground hover:text-foreground",
    );
  const links = tabs.some((t) => t.href);
  return (
    <div role={links ? "navigation" : "tablist"} aria-label={label} className={cn("flex min-w-0 gap-6 overflow-x-auto border-b border-[var(--ds-hairline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>
      {tabs.map((t) =>
        t.href ? (
          <Link key={t.id} href={t.href} aria-current={current === t.id ? "page" : undefined} className={cls(current === t.id)}>
            {t.label}
          </Link>
        ) : (
          <button key={t.id} type="button" role="tab" aria-selected={current === t.id} onClick={() => onSelect?.(t.id)} className={cls(current === t.id)}>
            {t.label}
          </button>
        ),
      )}
    </div>
  );
}

/** Text choices in one row (All / To watch / Watched). The chosen one is ink, the rest quiet. */
export function Choices<T extends string | null>({ label, options, value, onChange }: { label: string; options: { id: T; label: string }[]; value: T; onChange: (id: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex min-w-0 flex-wrap gap-x-2">
      {options.map((o) => (
        <button
          key={String(o.id)}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg px-3 type-small outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring",
            value === o.id ? "bg-[var(--ds-tint)] font-bold text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
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
export function EmptyLine({ title, children, action, art, className }: { title: React.ReactNode; children?: React.ReactNode; action?: React.ReactNode; /** A small drawing above the words (the cat). */ art?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col items-start gap-2 border-y border-[var(--ds-hairline)] py-6", className)}>
      {art ? <div aria-hidden className="pb-1">{art}</div> : null}
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

/* ------------------------------------------------------------------ */
/* Fold                                                                */
/* ------------------------------------------------------------------ */

/** Something extra under a tool, closed until asked for: a hairline row that opens in place. */
export function Fold({ title, children, className }: { title: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <details className={cn("group/fold min-w-0 border-y border-[var(--ds-hairline)]", className)}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-lg type-body font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 [overflow-wrap:anywhere]">{title}</span>
        <ChevronDown aria-hidden className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] ease-[var(--ds-ease)] group-open/fold:rotate-180" />
      </summary>
      <div className="pb-4">{children}</div>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* Brand accents                                                       */
/* ------------------------------------------------------------------ */

/** A tiny pixel label or numeral in the brand blue ("LIBRARY", "01"). Decoration with meaning: keep it to a word or two. */
export function Pix({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("type-pix text-link", className)}>{children}</span>;
}

/** The small lime icon tile from the old design: one per header at most. */
export function IconTile({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span aria-hidden className={cn("grid size-12 shrink-0 place-items-center rounded-[var(--ds-radius)] border-[1.5px] border-foreground bg-primary text-primary-foreground [&_svg]:size-6", className)}>
      {children}
    </span>
  );
}
