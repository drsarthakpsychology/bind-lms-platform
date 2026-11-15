import * as React from "react";
import Link from "next/link";

import { PageFrame } from "@/components/ds";
import { cn } from "@/lib/utils";
import "./admin-v2.css";

/**
 * Admin v2 kit: local wrappers over the design system parts (src/components/ds)
 * for the admin area only. Dense and calm: plain type on the page, real tables
 * on desktop with a sticky header, one filter bar, one action bar, hairlines
 * instead of boxes. No hooks here, so server and client screens both use it.
 */

/* ---------------------------------------------------------------- */
/* Class names                                                       */
/* ---------------------------------------------------------------- */

/** A text field or dropdown in a filter bar. 44px on touch, 36px with a mouse. */
export const control =
  "h-11 min-w-0 rounded-md border border-[var(--ds-card-line)] bg-background px-3 type-small text-foreground outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:border-foreground/50 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring lg:h-9";

const btnBase =
  "inline-flex h-11 min-w-0 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 type-small font-semibold whitespace-nowrap outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-45 lg:h-9 [&_svg]:size-4 [&_svg]:shrink-0";

/** Buttons. `primary` is the one lime action of a screen; the rest stay quiet. */
export const btn = {
  quiet: cn(btnBase, "border border-[var(--ds-card-line)] bg-background hover:border-foreground/60 hover:bg-[var(--ds-tint)]"),
  ghost: cn(btnBase, "hover:bg-[var(--ds-tint)]"),
  primary: cn(btnBase, "border-[1.5px] border-foreground bg-primary font-bold text-primary-foreground hover:brightness-95"),
  ink: cn(btnBase, "border border-foreground bg-foreground text-background hover:opacity-90"),
  danger: cn(btnBase, "border border-[var(--ds-card-line)] bg-background text-status-alert-fg hover:border-status-alert-fg"),
} as const;

/** A text link inside admin copy. */
export const link = "font-semibold text-link underline-offset-4 outline-none hover:underline focus-visible:underline";

/** Table parts. The table is for 768px and wider; phones get rows. */
export const table = {
  root: "w-full border-separate border-spacing-0 type-small",
  th: "sticky top-[var(--top-h)] z-[2] border-b border-[var(--ds-card-line)] bg-background px-3 py-2 text-left align-bottom type-caption font-semibold text-muted-foreground first:pl-0 last:pr-0",
  td: "border-b border-[var(--ds-hairline)] px-3 py-2.5 align-middle first:pl-0 last:pr-0",
  tr: "group/tr transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] aria-selected:bg-[color-mix(in_oklab,var(--link)_9%,transparent)]",
  num: "text-right whitespace-nowrap type-num",
} as const;

/* ---------------------------------------------------------------- */
/* Page                                                              */
/* ---------------------------------------------------------------- */

/** The admin page: wide frame, one H1, one quiet line, actions on the right (wrap under the title on phones). */
export function AdminPage({
  title,
  lead,
  actions,
  back,
  width = "wide",
  className,
  children,
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
  width?: "default" | "wide" | "reading";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <PageFrame width={width} className={cn("gap-[var(--ds-5)] md:gap-[var(--ds-6)]", className)}>
      <div data-admin-v2 className="contents">
      <header className="flex min-w-0 flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">
        <div className="min-w-0 space-y-1">
          {back ? (
            <Link href={back.href} className="-ml-1 inline-flex min-h-11 items-center gap-1 px-1 type-small font-semibold text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring lg:min-h-8">
              <span aria-hidden>←</span> {back.label}
            </Link>
          ) : null}
          <h1 className="type-h2 [overflow-wrap:anywhere] md:type-h1">{title}</h1>
          {lead ? <p className="type-small text-muted-foreground [overflow-wrap:anywhere]">{lead}</p> : null}
        </div>
        {actions ? <div className="flex min-w-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </header>
      {children}
      </div>
    </PageFrame>
  );
}

/** A section heading with a count and a quiet link on the right. No box. */
export function Block({
  title,
  count,
  action,
  id,
  className,
  children,
}: {
  title: React.ReactNode;
  count?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("flex min-w-0 scroll-mt-24 flex-col gap-2", className)}>
      <div className="flex min-h-11 min-w-0 items-center justify-between gap-4 lg:min-h-0">
        <h2 className="min-w-0 type-h3 [overflow-wrap:anywhere]">
          {title}
          {count !== undefined && count !== null ? <span className="ml-2 type-small font-medium text-muted-foreground type-num">{count}</span> : null}
        </h2>
        {action ? <div className="shrink-0 type-small [&>a]:inline-flex [&>a]:min-h-11 [&>a]:items-center lg:[&>a]:min-h-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

/** Underlined view tabs (links, so each view has an address). Scrolls sideways on phones. */
export function ViewTabs({ label, tabs, current }: { label: string; tabs: { id: string; label: React.ReactNode; href: string; count?: number | null }[]; current: string }) {
  return (
    <nav aria-label={label} className="min-w-0 border-b border-[var(--ds-hairline)]">
      <ul className="-mb-px flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => (
          <li key={t.id} className="shrink-0">
            <Link
              href={t.href}
              aria-current={current === t.id ? "page" : undefined}
              className={cn(
                "inline-flex h-11 items-center gap-1.5 border-b-2 px-3 type-small font-semibold whitespace-nowrap outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] focus-visible:ring-2 focus-visible:ring-ring",
                current === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              {t.count ? <span className="type-caption type-num text-muted-foreground">{t.count}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------------------------------------------------------------- */
/* Small parts                                                       */
/* ---------------------------------------------------------------- */

export type Tone = "ok" | "warn" | "alert" | "info" | "quiet";
const DOT: Record<Tone, string> = {
  ok: "bg-[#2f9e44] dark:bg-status-success-fg",
  warn: "bg-[#e8910c]",
  alert: "bg-status-alert-fg",
  info: "bg-link",
  quiet: "bg-foreground/25",
};

/** A status in words with a small dot. Colour is never the only signal. */
export function Status({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-1.5 type-small", tone === "alert" && "font-semibold text-status-alert-fg", className)}>
      <span aria-hidden className={cn("size-2 shrink-0 rounded-full", DOT[tone])} />
      <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
    </span>
  );
}

/** Map the old badge tones (account status) to a v2 status tone. */
export function toneOf(t: "published" | "destructive" | "pending" | "outline"): Tone {
  return t === "published" ? "ok" : t === "destructive" ? "alert" : t === "pending" ? "warn" : "quiet";
}

/** A small flat label (a cohort name, a flag). No heavy border. */
export function Tag({ children, tone = "quiet", className }: { children: React.ReactNode; tone?: "quiet" | "warn" | "alert"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded px-1.5 py-0.5 type-caption [overflow-wrap:anywhere]",
        tone === "quiet" && "bg-[var(--ds-tint)] text-foreground",
        tone === "warn" && "bg-status-pending-bg text-status-pending-fg",
        tone === "alert" && "bg-status-alert-bg text-status-alert-fg",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A thin progress line with its number. */
export function Meter({ pct, label, tone = "info", className }: { pct: number; label?: React.ReactNode; tone?: "info" | "warn"; className?: string }) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <span className={cn("flex min-w-0 items-center gap-2", className)}>
      {label ? <span className="shrink-0 type-small type-num">{label}</span> : null}
      <span aria-hidden className="h-1 min-w-8 flex-1 overflow-hidden rounded-full bg-[var(--ds-hairline)]">
        <span className={cn("block h-full rounded-full", tone === "warn" ? "bg-[#e8910c]" : "bg-link")} style={{ width: `${p}%` }} />
      </span>
    </span>
  );
}

/** Numbers in one quiet line (label under value), separated by space, never boxed. */
export function Figures({ items, className }: { items: { value: React.ReactNode; label: React.ReactNode; href?: string }[]; className?: string }) {
  return (
    <ul className={cn("grid min-w-0 grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10", className)}>
      {items.map((it, i) => {
        const body = (
          <>
            <span className="type-h2 type-num">{it.value}</span>
            <span className="type-caption text-muted-foreground [overflow-wrap:anywhere]">{it.label}</span>
          </>
        );
        return (
          <li key={i} className="min-w-0">
            {it.href ? (
              <Link href={it.href} className="group/fig flex min-w-0 flex-col rounded outline-none focus-visible:ring-2 focus-visible:ring-ring [&>span:last-child]:underline [&>span:last-child]:underline-offset-4 hover:[&>span:last-child]:text-foreground">
                {body}
              </Link>
            ) : (
              <div className="flex min-w-0 flex-col">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** The empty state of a list: one plain sentence, an optional next step. */
export function Empty({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("border-y border-[var(--ds-hairline)] py-6 type-small text-muted-foreground", className)}>{children}</p>;
}

/** A warning or failure line (storage nearly full, a loader failed). */
export function Notice({ tone = "warn", children, className }: { tone?: "warn" | "alert"; children: React.ReactNode; className?: string }) {
  return (
    <p
      role={tone === "alert" ? "alert" : "status"}
      className={cn(
        "flex min-w-0 items-start gap-2 rounded-md px-3 py-2.5 type-small [overflow-wrap:anywhere]",
        tone === "alert" ? "bg-status-alert-bg text-status-alert-fg" : "bg-status-pending-bg text-status-pending-fg",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Label and value pairs as a quiet two-column list (a person's details). */
export function Facts({ items, className }: { items: { label: React.ReactNode; value: React.ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("min-w-0 divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]", className)}>
      {items.map((it, i) => (
        <div key={i} className="grid min-w-0 grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-2.5">
          <dt className="type-small text-muted-foreground [overflow-wrap:anywhere]">{it.label}</dt>
          <dd className="min-w-0 type-small font-semibold [overflow-wrap:anywhere]">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Skeleton lines shaped like a table (the loading state of a list screen). */
export function ListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div aria-hidden className="flex flex-col">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex h-14 items-center gap-4 border-b border-[var(--ds-hairline)]">
          <span className="h-3 w-1/3 animate-pulse rounded bg-[var(--ds-tint)] motion-reduce:animate-none" />
          <span className="hidden h-3 w-1/6 animate-pulse rounded bg-[var(--ds-tint)] motion-reduce:animate-none md:block" />
          <span className="ml-auto h-3 w-16 animate-pulse rounded bg-[var(--ds-tint)] motion-reduce:animate-none" />
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Rows (phones, and any list that is not a table)                   */
/* ---------------------------------------------------------------- */

/** The class of a hairline row list. */
export const rowList = "flex min-w-0 flex-col divide-y divide-[var(--ds-hairline)] border-y border-[var(--ds-hairline)]";

/** A list of rows with hairlines between them. */
export function Rows({ label, className, children }: { label?: string; className?: string; children: React.ReactNode }) {
  return (
    <ul aria-label={label} className={cn(rowList, className)}>
      {children}
    </ul>
  );
}

/** One row that opens something: title, a quiet second line, something on the right. */
export function RowLink({
  href,
  title,
  meta,
  end,
  lead,
  className,
}: {
  href: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  end?: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("min-w-0", className)}>
      <Link
        href={href}
        className="group/row -mx-2 flex min-h-14 min-w-0 items-center gap-3 rounded-lg px-2 py-2.5 outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring"
      >
        {lead ? <span className="shrink-0">{lead}</span> : null}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="type-body font-semibold [overflow-wrap:anywhere]">{title}</span>
          {meta ? <span className="type-small text-muted-foreground [overflow-wrap:anywhere]">{meta}</span> : null}
        </span>
        {end ? <span className="flex shrink-0 flex-col items-end gap-0.5 type-small text-muted-foreground">{end}</span> : null}
        <span aria-hidden className="shrink-0 text-muted-foreground transition-transform duration-[var(--ds-state)] group-hover/row:translate-x-0.5 motion-reduce:transition-none">›</span>
      </Link>
    </li>
  );
}

/** A row that holds content and its own controls (not a link as a whole). */
export function RowItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return <li className={cn("flex min-w-0 flex-col gap-2 py-3.5", className)}>{children}</li>;
}

/** A name link inside a table cell or row. */
export const nameLink = "font-semibold text-foreground underline-offset-4 outline-none [overflow-wrap:anywhere] hover:underline focus-visible:underline";

/** A form label with its field under it. */
export function Field({ label, hint, className, children }: { label: React.ReactNode; hint?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="type-small font-semibold">{label}</span>
      {children}
      {hint ? <span className="type-caption text-muted-foreground [overflow-wrap:anywhere]">{hint}</span> : null}
    </label>
  );
}

/** A closed-by-default group for rarely used controls. One hairline, no box. */
export function More({ summary, className, children }: { summary: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <details className={cn("group min-w-0 border-t border-[var(--ds-hairline)] pt-1", className)}>
      <summary className="inline-flex min-h-11 cursor-pointer items-center type-small font-semibold text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">{summary}</summary>
      <div className="mt-2 min-w-0">{children}</div>
    </details>
  );
}

/** A loader failed: say so plainly, with one way forward. */
export function LoadError({ what = "this list", href }: { what?: string; href?: string }) {
  return (
    <Notice tone="alert">
      <span>
        Could not load {what}.{" "}
        {href ? (
          <Link href={href} className="font-bold underline underline-offset-4">
            Try again
          </Link>
        ) : (
          "Refresh the page to try again."
        )}
      </span>
    </Notice>
  );
}
