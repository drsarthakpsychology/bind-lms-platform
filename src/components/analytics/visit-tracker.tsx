"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const SLICE_MS = 2 * 60 * 1000;

/**
 * Reports time on each page in 2-minute slices while the tab is visible, and
 * the last slice when the student moves on or hides the tab. Renders nothing.
 */
export function VisitTracker() {
  const pathname = usePathname();

  React.useEffect(() => {
    let start = document.visibilityState === "visible" ? Date.now() : 0;

    const send = () => {
      if (!start) return;
      const seconds = Math.round((Date.now() - start) / 1000);
      const payload = JSON.stringify({ path: pathname, enteredAt: new Date(start).toISOString(), seconds: Math.min(seconds, 1800) });
      start = 0;
      if (seconds < 2) return;
      try {
        if (navigator.sendBeacon?.("/api/visit", new Blob([payload], { type: "application/json" }))) return;
      } catch {
        /* fall through */
      }
      void fetch("/api/visit", { method: "POST", body: payload, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
    };

    const tick = window.setInterval(() => {
      if (!start) return;
      send();
      start = Date.now();
    }, SLICE_MS);
    const onVis = () => {
      if (document.visibilityState === "hidden") send();
      else if (!start) start = Date.now();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", send);

    return () => {
      send();
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", send);
    };
  }, [pathname]);

  return null;
}
