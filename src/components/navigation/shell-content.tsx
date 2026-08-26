"use client";

import { usePathname } from "next/navigation";
import { isImmersiveSessionPath } from "./sidebar-gate";

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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-[max(5rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-10 lg:py-8 lg:pb-8">
      {children}
    </div>
  );
}
