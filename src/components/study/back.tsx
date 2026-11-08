"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { backTarget } from "@/components/navigation/sections";
import { cn } from "@/lib/utils";
import { backLinkClass } from "@/components/design-system/back-link";

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

/** The labelled Back button shown at the top of every activity: says where it goes. */
export function BackPill({ fallback, className }: { fallback?: string; className?: string }) {
  const back = useBack(fallback);
  return (
    <Link href={back.href} className={cn(backLinkClass, "max-w-[60%]", className)}>
      <ArrowLeft className="size-4 shrink-0" aria-hidden />
      <span className="min-w-0 truncate">{back.label}</span>
    </Link>
  );
}
