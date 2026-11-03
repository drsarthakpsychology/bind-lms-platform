"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const btn =
  "inline-flex size-9 items-center justify-center rounded-full border-2 border-transparent text-foreground outline-none transition-[background-color,border-color,transform] duration-fast ease-snappy hover:border-foreground hover:bg-primary active:scale-95 focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:opacity-40 disabled:hover:border-transparent disabled:hover:bg-transparent";

/**
 * The same Back / Forward buttons on every page, like a browser — so people
 * never feel lost. Back is hidden when there's nowhere to go back to.
 */
export function BackForward({ className }: { className?: string }) {
  const router = useRouter();
  const canBack = React.useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return window.history.length > 1;
      } catch {
        return false;
      }
    },
    () => false,
  );

  if (!canBack) return null;
  return (
    <div className={cn("flex items-center", className)}>
      <button type="button" onClick={() => router.back()} aria-label="Go back" className={btn}>
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button type="button" onClick={() => router.forward()} aria-label="Go forward" className={btn}>
        <ChevronRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}
