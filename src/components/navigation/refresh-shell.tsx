"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

/**
 * The top bar (bell count) lives in the shared layout, which a normal page
 * change does not redraw. A page that has just marked notifications read
 * renders this once so the layout is fetched again and the bell is right.
 */
export function RefreshShell({ when }: { when: boolean }) {
  const router = useRouter();
  React.useEffect(() => {
    if (when) router.refresh();
  }, [when, router]);
  return null;
}
