import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A single strong tappable row — the workhorse for courses, practice lists,
 * journal entries, and wall posts. One row, not a card: a light surface, a
 * leading glyph/number, a 1–2 line title, a metadata line, and a trailing
 * state/chevron. `href` renders a link; omit it for a button.
 *
 * Designed for mobile first (min 48px tap height) and looks identical on
 * desktop rows, so there's one list language everywhere.
 *
 * `active` marks the row as the current destination (sets `aria-current`).
 * `emphasis` is a softer highlight for "start here" / "continue" rows that
 * should stand out visually without claiming they are the current page.
 */
export function MobileListItem({
  href,
  onClick,
  leading,
  title,
  subtitle,
  trailing,
  active,
  emphasis,
  disabled,
  className,
}: {
  href?: string;
  onClick?: () => void;
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  active?: boolean;
  emphasis?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const inner = (
    <>
      {leading ? <span className="flex size-9 shrink-0 items-center justify-center">{leading}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block text-small font-semibold leading-snug text-foreground [overflow-wrap:anywhere] line-clamp-2">
          {title}
        </span>
        {subtitle ? (
          <span className="mt-0.5 block truncate text-caption text-muted-foreground">{subtitle}</span>
        ) : null}
      </span>
      {trailing ? (
        <span className="flex shrink-0 items-center gap-1">{trailing}</span>
      ) : (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      )}
    </>
  );

  const surface = active || emphasis ? "bg-accent" : "bg-card hover:bg-accent";
  const base =
    "flex w-full min-h-[48px] items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-fast ease-snappy active:translate-y-px";

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={cn(
          base,
          surface,
          disabled && "pointer-events-none opacity-50",
          className,
        )}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      className={cn(
        base,
        surface,
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      {inner}
    </button>
  );
}
