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
        "mx-auto w-full max-w-7xl px-4 pb-[calc(var(--nav-h)+2rem)] sm:px-6 md:pb-12 lg:px-10",
        focus ? "pt-3 sm:pt-4 lg:pt-5" : "py-6 lg:py-8 short:lg:py-6",
      )}
    >
      {children}
    </div>
  );
}
