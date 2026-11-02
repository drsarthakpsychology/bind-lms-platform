"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Where "Back" goes from an activity. Opened from a module (…?from=/study/<module>)
 * it returns to that module; otherwise to the fallback (Daily practice).
 */
export function useBack(fallback = "/study/activities"): { href: string; label: string } {
  const from = useSearchParams()?.get("from");
  if (from && /^\/study(?:\/[a-z0-9-]+){0,2}$/.test(from)) return { href: from, label: from === "/study" ? "Back to Study" : "Back to the module" };
  return { href: fallback, label: fallback === "/study/notes" ? "Back to notes" : "Back to Daily practice" };
}

/** A Link whose destination is the Back target. */
export function BackLink({ fallback, ...props }: Omit<React.ComponentProps<typeof Link>, "href"> & { fallback?: string }) {
  const back = useBack(fallback);
  return <Link {...props} href={back.href} />;
}

/** The labelled Back button shown at the top of every activity (replaces the bare ✕). */
export function BackPill({ fallback, className }: { fallback?: string; className?: string }) {
  const back = useBack(fallback);
  return (
    <Link href={back.href} className={cn("inline-flex h-10 shrink-0 items-center gap-1 rounded-full border-2 border-foreground bg-card px-3 text-sm font-black", className)}>
      <ArrowLeft className="size-4" aria-hidden />
      <span>Back</span>
      <span className="sr-only"> ({back.label})</span>
    </Link>
  );
}
