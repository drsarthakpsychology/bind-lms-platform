"use client";

import { usePathname } from "next/navigation";
import { isImmersiveSessionPath } from "./sidebar-gate";
import { isFocusPath } from "./sections";
import { cn } from "@/lib/utils";

/**
 * Content wrapper that gives the dashboard its standard gutter + max-width
 * (desktop and mobile), EXCEPT on the immersive patient-session route, which
 * renders full-bleed so the conversation owns the whole viewport.
 *
 * This is a pass-through client component (children are already serialized by
 * the server); it only decides whether to apply the padded shell or render
 * the child bare.
 */
export function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isImmersiveSessionPath(pathname ?? "")) {
    return <>{children}</>;
  }

  // Focus pages (questions, reading, a game) keep the top slim: the task starts high.
  const focus = isFocusPath(pathname ?? "");
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10",
        // Top only: a `py-*` here would wipe out the bottom padding below
        // (tailwind-merge drops `pb-*` when `py-*` follows), and the last lines
        // of every page then sat under the phone tab bar.
        focus ? "pt-3 sm:pt-4 lg:pt-5" : "pt-6 lg:pt-8 short:lg:pt-6",
        // Bottom: clear the tab bar (--nav-h) and any thumb bar (--thumb-h),
        // both including the gesture-bar inset, plus breathing room.
        // A lecture's Previous/Next bar (MobileStickyAction) adds --sticky-h.
        "pb-[calc(var(--nav-h,0px)+var(--thumb-h,0px)+var(--sticky-h,0px)+2rem)] md:pb-[calc(var(--sticky-h,0px)+3rem)]",
      )}
    >
      {children}
    </div>
  );
}
