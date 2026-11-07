"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { backTarget } from "@/components/navigation/sections";
import { cn } from "@/lib/utils";

/**
 * Where "Back" goes from an activity: to `?from=` (a Study module, a note,
 * Home, another tool) when present, else to `fallback`, else to the top of
 * the section that owns the page (Practice tools go to Practice, games to
 * Games, Smart practice tools to Smart practice). Rules: navigation/sections.ts.
 */
export function useBack(fallback?: string): { href: string; label: string } {
  const pathname = usePathname() ?? "";
  const from = useSearchParams()?.get("from");
  return backTarget(pathname, from, fallback);
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
    <Link href={back.href} className={cn("inline-flex h-11 shrink-0 items-center gap-1 rounded-md border-2 border-foreground bg-card px-3 text-sm font-semibold", className)}>
      <ArrowLeft className="size-4" aria-hidden />
      <span>Back</span>
      <span className="sr-only"> ({back.label})</span>
    </Link>
  );
}
