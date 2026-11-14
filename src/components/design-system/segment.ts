import { cn } from "@/lib/utils";

/**
 * The one segmented control: tabs and either-or switches (Questions / Long
 * answers, League / Quiz / Overall, Student / Clinician). A bordered 10px
 * box; segments 36px tall (44px on touch screens), the chosen one filled ink.
 * Plain module, so server-rendered tab links share it with client toggles.
 */
export const segmentGroup = "inline-flex max-w-full items-stretch gap-1 rounded-md border-2 border-foreground bg-card p-1";

export function segmentItem(active: boolean, className?: string): string {
  return cn(
    "relative inline-flex min-h-9 min-w-0 items-center justify-center gap-1.5 rounded-sm px-3 text-sm font-bold transition-colors duration-fast ease-snappy pointer-coarse:min-h-11 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
    active ? "bg-foreground text-background" : "text-foreground hover:bg-secondary",
    className,
  );
}
