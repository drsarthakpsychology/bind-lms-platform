import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { HeroButton } from "@/components/ds";
import { cn } from "@/lib/utils";

/**
 * Small parts the Learn screens share in the new design. Local wrappers
 * around the ds tokens (src/components/ds is owned by the foundation).
 */

/** The way back: a quiet line of text, 44px tall, no box. */
export function Crumb({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "-ml-2 inline-flex min-h-11 w-fit max-w-full min-w-11 items-center gap-1 rounded-lg px-2 type-small text-muted-foreground outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <ChevronLeft className="size-4 shrink-0" aria-hidden />
      <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
    </Link>
  );
}

/** A thin progress line: lime on a hairline track, fills in 600ms. */
export function ProgressLine({ pct, label, className }: { pct: number; label: string; className?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(pct)));
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} className={cn("h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-hairline)]", className)}>
      <div className="h-full origin-left rounded-full bg-primary transition-transform duration-[var(--ds-fill)] ease-[var(--ds-ease-out)] motion-reduce:transition-none" style={{ transform: `scaleX(${v / 100})` }} />
    </div>
  );
}

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

/** A quiet message where a list would be (nothing here yet, nothing left). */
export function Quiet({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="py-6">
      <p className="type-h3">{title}</p>
      {children ? <p className="mt-1 type-body text-muted-foreground">{children}</p> : null}
    </div>
  );
}

/**
 * The one thing to do next on a Learn screen: a small label, what it is, an
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
