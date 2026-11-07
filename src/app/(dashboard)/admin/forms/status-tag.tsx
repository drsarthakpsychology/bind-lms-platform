import { cn } from "@/lib/utils";

/** Open or Closed, always as words (never colour alone). */
export function StatusTag({ active, className }: { active: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 px-2.5 py-0.5 text-xs font-bold",
        active ? "border-foreground bg-status-success-bg text-status-success-fg" : "border-foreground/30 bg-status-pending-bg text-status-pending-fg",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", active ? "bg-status-success-fg" : "bg-foreground/40")} />
      {active ? "Open" : "Closed"}
    </span>
  );
}
