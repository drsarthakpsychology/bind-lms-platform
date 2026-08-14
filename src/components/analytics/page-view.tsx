"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/**
 * Fires a $pageview event on every client-side route change (App Router
 * transitions don't trigger full page loads, so this is the only way a SPA
 * navigation is measured). Renders nothing. No-op without a PostHog key.
 *
 * Rendered once in the root layout. `useSearchParams` needs a Suspense
 * boundary in the layout, which the app already has via its route segments.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    trackEvent("$pageview", {
      path: pathname ?? null,
      route: pathname ?? null,
      search: searchParams?.toString() || undefined,
    });
  }, [pathname, searchParams]);

  return null;
}
