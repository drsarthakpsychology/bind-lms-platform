import { BadgeCheck, Circle, RotateCcw, Sprout, TriangleAlert, type LucideIcon } from "lucide-react";
import type { Mastery } from "@/lib/learn/model/mastery";
import { MASTERY_LABEL } from "@/lib/learn/model/mastery";
import { cn } from "@/lib/utils";

/** Rounded-rectangle buttons (rectangle = do). 44 px tall for touch. */
export const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-foreground px-4 py-2 text-sm font-bold transition-transform duration-150 hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-x-px active:translate-y-px active:shadow-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50";
export const btnPrimary = cn(btn, "bg-primary text-primary-foreground hard-shadow-xs");
export const btnPlain = cn(btn, "bg-card text-foreground");
export const btnInk = cn(btn, "bg-foreground text-background");

export const STATE_ICON: Record<Mastery, LucideIcon> = {
  new: Circle,
  learning: Sprout,
  shaky: TriangleAlert,
  mastered: BadgeCheck,
  decaying: RotateCcw,
};

const STATE_TONE: Record<Mastery, string> = {
  new: "border-dashed border-foreground/50 bg-card text-muted-foreground",
  learning: "border-foreground bg-status-info-bg text-status-info-fg",
  shaky: "border-foreground bg-status-alert-bg text-status-alert-fg",
  mastered: "border-foreground bg-status-success-bg text-status-success-fg",
  decaying: "border-foreground bg-status-pending-bg text-status-pending-fg",
};

export function stateTone(s: Mastery): string {
  return STATE_TONE[s];
}

/** A status tag (pill = is): icon + word, never colour alone. */
export function StateTag({ state, className }: { state: Mastery; className?: string }) {
  const Icon = STATE_ICON[state];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border-2 px-2 py-0.5 text-xs font-bold", STATE_TONE[state], className)}>
      <Icon className="size-3.5 shrink-0" aria-hidden />
      {MASTERY_LABEL[state]}
    </span>
  );
}
