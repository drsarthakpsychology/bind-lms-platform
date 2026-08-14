import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A small, quiet status indicator — the anti-"giant warning banner". Where the
 * desktop used a full-width amber box to say "offline/canned", mobile uses a
 * pill with a coloured dot + label. Tapping it can reveal details, but the
 * pill itself never breaks immersion.
 *
 * `tone` controls the dot + text; the pill stays a single hairline-outlined
 * chip on the surface. `onPress` makes it interactive (reveal details).
 */
export function StatusPill({
  tone = "neutral",
  label,
  className,
  onPress,
}: {
  tone?: "ai" | "scripted" | "neutral" | "warning";
  label: React.ReactNode;
  className?: string;
  onPress?: () => void;
}) {
  const dot =
    tone === "ai"
      ? "bg-primary"
      : tone === "scripted"
        ? "bg-status-pending-fg"
        : tone === "warning"
          ? "bg-status-alert-fg"
          : "bg-muted-foreground";

  const inner = (
    <>
      <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", dot)} />
      <span className="truncate">{label}</span>
    </>
  );

  if (onPress) {
    return (
      <button
        type="button"
        onClick={onPress}
        className={cn(
          "inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-caption font-medium text-muted-foreground transition-colors active:translate-y-px",
          className,
        )}
      >
        {inner}
      </button>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-caption font-medium text-muted-foreground",
        className,
      )}
    >
      {inner}
    </span>
  );
}
