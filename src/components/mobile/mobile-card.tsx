import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { cardVariants } from "@/components/ui/card";

/**
 * MobileCard — a richer tappable surface than MobileListItem, for content that
 * needs a leading glyph, a title + description, and room for body/actions.
 *
 * Builds on the shared `cardVariants` (interactive press + hard shadow), so it
 * speaks the same language as the desktop card. `href` renders a link; omit it
 * for a non-navigating surface. Server Component.
 */
export function MobileCard({
  href,
  onClick,
  leading,
  title,
  description,
  trailing,
  children,
  className,
}: {
  href?: string;
  onClick?: () => void;
  leading?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  const inner = (
    <>
      {title || description ? (
        <div className="flex items-start gap-3">
          {leading ? (
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-border bg-secondary text-link"
            >
              {leading}
            </span>
          ) : null}
          <div className="min-w-0 flex-1 space-y-0.5">
            {title ? (
              <h3 className="text-body-strong text-foreground">{title}</h3>
            ) : null}
            {description ? (
              <p className="text-small text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {trailing ? (
            <span className="shrink-0">{trailing}</span>
          ) : (
            <ArrowUpRight
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
          )}
        </div>
      ) : null}
      {children}
    </>
  );

  const base = cn(cardVariants({ variant: "interactive" }), "h-full p-4", className);

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={base}>
        {inner}
      </Link>
    );
  }

  return <div className={base}>{inner}</div>;
}
