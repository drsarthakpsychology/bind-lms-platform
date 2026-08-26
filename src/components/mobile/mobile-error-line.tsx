import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MobileErrorLine — the inline, inline-block error message.
 *
 * The mobile principle (T50): a failure inline should explain itself in a
 * line and never wipe the user's typed state. Where AsyncErrorCard is the
 * full-block failure surface, this is the quiet companion for in-form /
 * in-composer errors ("Couldn't post — check your connection.") rendered
 * directly above the action with a recovery link or the retry affordance the
 * parent wires up. It is `role="alert"` so screen readers announce it.
 */
export function MobileErrorLine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      role="alert"
      className={cn(
        "animate-enter flex items-start gap-1.5 rounded-md border border-status-alert-fg/40 bg-status-alert-bg px-2.5 py-1.5 text-caption font-medium text-status-alert-fg",
        className,
      )}
    >
      <span aria-hidden className="mt-px inline-block size-1.5 shrink-0 rounded-full bg-status-alert-fg" />
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  );
}
