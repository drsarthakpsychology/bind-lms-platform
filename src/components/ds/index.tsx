import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ProgressLine } from "./parts";

/**
 * Design system v2 parts (docs/design/DESIGN_SYSTEM_2026_11.md).
 *
 * Quiet by default: a screen is mostly plain type on the page, grouped by
 * whitespace and hairlines. Pick the lightest part that does the job:
 *   Section  a heading and its content, no border, no background
 *   RowList  rows with hairlines between them (lists, menus, settings)
 *   Tint     a soft fill, no border, for a small group that must read as one
 *   Card     a 1.5px outline, for one object tapped as a whole (a game, a case)
 *   Hero     the one thing to do on this screen (one per screen)
 *   Stat     a number with its label, inline
 * Every part is a server component; Sheet (./sheet) is the only client part.
 */

type Children = { children?: React.ReactNode; className?: string };

/* ------------------------------------------------------------------ */
/* PageFrame                                                           */
/* ------------------------------------------------------------------ */

const WIDTH = {
  /** Reading pages: one column of text. */
  reading: "max-w-[44rem]",
  /** Most screens: a list or a home. */
  default: "max-w-5xl",
  /** Tables and wide tools. */
  wide: "max-w-7xl",
} as const;

/**
 * The page itself: side margin (20px on phones), the gap between sections
 * (32px phone, 48px from 768px), an optional title, and a 200ms cross-fade on
 * arrival. The page title is the screen's only H1.
 */
export function PageFrame({
  title,
  kicker,
  band = false,
  art,
  lead,
  actions,
  width = "default",
  className,
  children,
}: Children & {
  title?: React.ReactNode;
  /** A tiny pixel label above the title (brand accent). */
  kicker?: React.ReactNode;
  /** A soft blue wash behind the header (hub pages, the library). */
  band?: boolean;
  /** Something small at the right of a banded header (an icon tile, the cat). */
  art?: React.ReactNode;
  /** One quiet line under the title (or in place of one). */
  lead?: React.ReactNode;
  /** Right side of the title row (a small secondary control). */
  actions?: React.ReactNode;
  width?: keyof typeof WIDTH;
}) {
  return (
    <div data-ds="page" className={cn("ds-page mx-auto flex w-full min-w-0 flex-col gap-[var(--ds-section)] px-1 sm:px-0", WIDTH[width], className)}>
      {title || lead ? (
        <header className={cn("flex min-w-0 items-start justify-between gap-4", band && "ds-band items-center")}>
          <div className="min-w-0 space-y-1">
            {kicker ? <p className="type-pix text-link">{kicker}</p> : null}
            {title ? <h1 className="type-h1 ds-stroke [overflow-wrap:anywhere]">{title}</h1> : null}
            {lead ? <p className="type-small text-muted-foreground">{lead}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
          {art ? <div aria-hidden className="shrink-0">{art}</div> : null}
        </header>
      ) : null}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

/** A heading and its content. No border, no background: whitespace groups it. */
export function Section({
  title,
  action,
  id,
  level = 2,
  n,
  className,
  children,
}: Children & {
  title?: React.ReactNode;
  /** A small link on the right of the heading ("See all"). */
  action?: React.ReactNode;
  id?: string;
  level?: 2 | 3;
  /** Brand accent: a blue pixel numeral before the heading (01, 02) where the sections run in order. */
  n?: number;
}) {
  const H = level === 2 ? "h2" : "h3";
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={cn("flex min-w-0 flex-col gap-[var(--ds-3)]", className)}>
      {title || action ? (
        <div className="flex min-w-0 items-baseline justify-between gap-4">
          {title ? (
            <H id={headingId} className={cn("min-w-0 [overflow-wrap:anywhere]", level === 2 ? "type-h3" : "type-small font-semibold text-muted-foreground", n && "flex items-baseline gap-3")}>
              {n ? <span aria-hidden className="shrink-0 type-pix text-link">{String(n).padStart(2, "0")}</span> : null}
              {n ? <span className="min-w-0">{title}</span> : title}
            </H>
          ) : (
            <span />
          )}
          {action ? <div className="shrink-0 type-small">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* RowList + Row                                                       */
/* ------------------------------------------------------------------ */

/** Rows with a 1px hairline between them. A list, a menu, a settings group. */
export function RowList({ className, children, label }: Children & { label?: string }) {
  return (
    <ul aria-label={label} className={cn("flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]", className)}>
      {children}
    </ul>
  );
}

const rowInner = "flex min-h-14 min-w-0 items-center gap-4 py-2";

/**
 * One row: an optional icon, a title (wraps, never cut), an optional quiet
 * line under it, and something on the right. With `href` the whole row is the
 * link and ends in a chevron. Rows are at least 56px tall.
 */
export function Row({
  href,
  icon,
  title,
  meta,
  trailing,
  chevron,
  external = false,
  current = false,
  className,
}: {
  href?: string;
  icon?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
  /** Right side: a value, a small status word. Not a second button. */
  trailing?: React.ReactNode;
  /** Defaults to true for links. */
  chevron?: boolean;
  external?: boolean;
  /** Marks the row as the page you are on (aria-current). */
  current?: boolean;
  className?: string;
}) {
  const body = (
    <>
      {icon ? (
        <span aria-hidden className="grid size-6 shrink-0 place-items-center text-foreground [&_svg]:size-5">
          {icon}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="type-body font-semibold [overflow-wrap:anywhere]">{title}</span>
        {meta ? <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{meta}</span> : null}
      </span>
      {trailing ? <span className="shrink-0 type-small text-muted-foreground type-num">{trailing}</span> : null}
      {href && chevron !== false ? <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] ease-[var(--ds-ease)] group-hover/row:translate-x-0.5" /> : null}
    </>
  );
  if (!href) return <li className={cn(rowInner, className)}>{body}</li>;
  const link = cn(
    rowInner,
    "group/row -mx-2 rounded-lg px-2 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]",
  );
  return (
    <li className={cn("min-w-0", className)}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={link}>
          {body}
        </a>
      ) : (
        <Link href={href} aria-current={current ? "page" : undefined} className={link}>
          {body}
        </Link>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Tint, Card                                                          */
/* ------------------------------------------------------------------ */

/** A soft fill, no border: a small group that must read as one thing. */
export function Tint({ className, children }: Children) {
  return <div className={cn("min-w-0 rounded-[var(--ds-radius)] bg-[var(--ds-tint)] p-4", className)}>{children}</div>;
}

/**
 * One object tapped as a whole (a game, a case, a certificate): a 1.5px
 * outline, 12px corners, no shadow. Not for grouping text: use Section.
 */
export function Card({ href, className, children, label }: Children & { href?: string; label?: string }) {
  const base = "flex min-w-0 flex-col gap-3 rounded-[var(--ds-radius)] border-[1.5px] border-[var(--ds-card-line)] bg-card p-4";
  if (!href) return <div className={cn(base, className)}>{children}</div>;
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        base,
        "outline-none transition-[border-color,transform] duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:-translate-y-0.5 hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0 active:scale-[0.99] motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

/**
 * The one thing to do on this screen. Large title, an optional thin progress
 * line, where they stopped, and one full-width lime button in thumb reach.
 * No box around the words: lime only on the button and the progress line.
 * One per screen.
 */
export function Hero({
  context,
  title,
  meta,
  progress,
  progressLabel,
  action,
  below,
  className,
}: {
  /** A short line above the title ("Lecture 4", "Module 2"). */
  context?: React.ReactNode;
  title: React.ReactNode;
  /** Where they stopped. */
  meta?: React.ReactNode;
  /** 0 to 100; hidden when undefined. */
  progress?: number;
  progressLabel?: string;
  action: { href: string; label: React.ReactNode; icon?: React.ReactNode };
  /** One quiet line under the button (e.g. a save note). */
  below?: React.ReactNode;
  className?: string;
}) {
  const pct = progress === undefined ? undefined : Math.max(0, Math.min(100, Math.round(progress)));
  return (
    <section aria-label="Continue" className={cn("flex min-w-0 flex-col gap-4", className)}>
      <div className="flex min-w-0 flex-col gap-2">
        {/* Brand accent: a short context ("Lecture 4") speaks in the pixel voice; a longer line stays plain. */}
        {context ? <p className={cn("[overflow-wrap:anywhere]", typeof context === "string" && context.length <= 28 ? "type-pix text-link" : "type-small text-muted-foreground")}>{context}</p> : null}
        {/* A long title steps down a size on phones so the button stays in reach. */}
        <h2 className={cn("[overflow-wrap:anywhere]", typeof title === "string" && title.length > 36 ? "type-h1 md:type-display" : "type-display")}>{title}</h2>
        {meta ? <p className="type-body text-muted-foreground [overflow-wrap:anywhere]">{meta}</p> : null}
      </div>
      {pct !== undefined ? (
        <div
          role="progressbar"
          aria-label={progressLabel ?? "Progress"}
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-hairline)]"
        >
          <div
            className="h-full origin-left rounded-full bg-primary transition-transform duration-[var(--ds-fill)] ease-[var(--ds-ease-out)] motion-reduce:transition-none dark:bg-primary"
            style={{ transform: `scaleX(${pct / 100})` }}
          />
        </div>
      ) : null}
      <HeroButton href={action.href} icon={action.icon}>
        {action.label}
      </HeroButton>
      {below ? <div className="type-small text-muted-foreground">{below}</div> : null}
    </section>
  );
}

/** The primary action: lime, 2px ink border, hard shadow, 52px tall. */
export function HeroButton({ href, icon, children, className }: { href: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "inline-flex min-h-[3.25rem] w-full min-w-0 items-center justify-center gap-2 rounded-[var(--ds-radius)] border-2 border-foreground bg-primary px-5 py-3 text-center type-body font-bold text-primary-foreground hard-shadow-sm outline-none transition-[transform,box-shadow] duration-[var(--ds-press)] ease-[var(--ds-ease)] hover:-translate-y-0.5 hover:hard-shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none motion-reduce:hover:translate-y-0 md:w-fit md:min-w-60",
        className,
      )}
    >
      <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
      {icon ? <span aria-hidden className="shrink-0 [&_svg]:size-5">{icon}</span> : null}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Stat                                                                */
/* ------------------------------------------------------------------ */

/** A number and its label, inline. Several sit in one row with gaps, no boxes. */
export function Stat({ value, label, className }: { value: React.ReactNode; label: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      <span className="type-h2 type-num">{value}</span>
      <span className="type-caption text-muted-foreground">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Next step                                                           */
/* ------------------------------------------------------------------ */

/**
 * The one thing to do next on a screen: a small label, what it is, an
 * optional thin progress line, and the screen's one lime button.
 */
export function NextStep({
  label,
  title,
  sub,
  pct,
  pctLabel,
  pctText,
  href,
  action,
  onGo,
  wide = false,
}: {
  label: string;
  title: string;
  sub?: string;
  pct?: number;
  pctLabel?: string;
  pctText?: string;
  href: string;
  action: string;
  onGo?: () => void;
  /** Keep the button full width from 768px too (narrow side columns). */
  wide?: boolean;
}) {
  return (
    <section aria-label="Continue" className="flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">{label}</p>
        <h2 className="type-h2 [overflow-wrap:anywhere]">{title}</h2>
        {sub ? <p className="type-body text-muted-foreground [overflow-wrap:anywhere]">{sub}</p> : null}
      </div>
      {pct !== undefined && pct > 0 ? (
        <div className="flex min-w-0 items-center gap-3">
          <ProgressLine pct={pct} label={pctLabel ?? "Progress"} />
          {pctText ? <span className="shrink-0 type-small text-muted-foreground type-num">{pctText}</span> : null}
        </div>
      ) : null}
      {/* onClickCapture: the link is the ds button; the click is noted on its way down. */}
      <div onClickCapture={onGo} className="min-w-0">
        <HeroButton href={href} icon={<ArrowRight />} className={wide ? "md:w-full md:min-w-0" : undefined}>
          {action}
        </HeroButton>
      </div>
    </section>
  );
}

/* The smaller shared parts (./parts). The client switch is in ./v2. */
export * from "./parts";
