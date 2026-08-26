import * as React from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LockedState — the single "yet to be live" chip for the three-state go-live
 * system (hidden / live / unlocked). A quiet, non-actionable stamp: a lock
 * icon + plain copy, 2px ink border, muted fill, ink text, hard shadow.
 *
 * Import this anywhere a surface needs to say "this exists but isn't open
 * yet" so the wording and treatment can never drift apart. Peach is
 * deliberately NOT the fill — a locked state is not an action.
 *
 * Server-safe (no hooks), so it can render from server or client components.
 */
export function LockedState({
  label = "Yet to be live",
  className,
}: {
  label?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border-2 border-border bg-muted px-2.5 py-0.5 text-caption font-medium text-foreground hard-shadow-sm",
        className,
      )}
    >
      <Lock className="size-3.5 shrink-0" aria-hidden />
      <span>{label}</span>
    </span>
  );
}
