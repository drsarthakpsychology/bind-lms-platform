"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Contextual mobile header — a compact sticky bar with a back affordance, a
 * truncated title, and right-aligned actions. This is the "native app" header
 * the brief asks for: one back control, one title, nothing else crammed in.
 *
 * Safe-area top is handled by the shell's top bar; when this header is used on
 * an inner page (where the shell top bar is hidden), it owns its own inset.
 * `inset` adds safe-area-top padding; `sticky` keeps it pinned.
 */
export function MobileHeader({
  title,
  subtitle,
  backHref,
  onBack,
  actions,
  className,
  sticky = true,
  inset = true,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Prefer a real route; falls back to router.back() when omitted. */
  backHref?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
  sticky?: boolean;
  inset?: boolean;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) onBack();
    else if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <header
      className={cn(
        "z-30 flex min-h-14 items-center gap-2 border-b border-border bg-card",
        sticky && "sticky top-0",
        className,
      )}
      style={inset ? { paddingTop: "env(safe-area-inset-top)" } : undefined}
    >
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="ml-2 flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground transition-transform duration-fast ease-snappy active:translate-y-px"
      >
        <ArrowLeft className="size-5" aria-hidden />
      </button>
      <div className="min-w-0 flex-1 py-2 pr-3">
        <div className="truncate text-base font-semibold text-foreground">{title}</div>
        {subtitle ? (
          <div className="truncate text-caption text-muted-foreground">{subtitle}</div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-1 pr-3">{actions}</div> : null}
    </header>
  );
}
