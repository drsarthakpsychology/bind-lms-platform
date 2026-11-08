"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Horizontal week chips (the YouTube filter-chip row). Tapping one opens that
 * week (it may be folded) and scrolls to it.
 */
export function WeekChips({
  weeks,
}: {
  weeks: { num: number; isCurrent: boolean; complete: boolean; future: boolean }[];
}) {
  if (weeks.length < 2) return null;
  const go = (e: React.MouseEvent<HTMLAnchorElement>, num: number) => {
    const el = document.getElementById(`week-${num}`);
    if (!el) return;
    e.preventDefault();
    if (el instanceof HTMLDetailsElement) el.open = true;
    el.scrollIntoView({ block: "start" });
    history.replaceState(null, "", `#week-${num}`);
  };
  return (
    <nav
      aria-label="Jump to a week"
      className="sticky top-0 z-20 -mx-4 border-b-2 border-transparent bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 md:top-[var(--top-h)] lg:-mx-10 lg:px-10"
    >
      <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {weeks.map((w) => (
          <li key={w.num} className="shrink-0">
            <a
              href={`#week-${w.num}`}
              onClick={(e) => go(e, w.num)}
              aria-current={w.isCurrent ? "true" : undefined}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full border-2 px-3.5 text-sm font-bold whitespace-nowrap transition-[transform,box-shadow,background-color] duration-fast ease-snappy hover:-translate-y-px hover:hard-shadow-xs active:translate-y-px active:shadow-none",
                w.isCurrent
                  ? "border-foreground bg-brand text-brand-foreground"
                  : w.future
                    ? "border-dashed border-foreground/50 bg-card text-muted-foreground"
                    : "border-foreground bg-card text-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              {w.complete ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : null}
              Week {w.num}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
