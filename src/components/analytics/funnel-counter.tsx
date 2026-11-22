"use client";

import * as React from "react";
import { countStep } from "@/lib/funnel/client";

/**
 * Counts, privately, that this page was seen and which Request, Register,
 * Call or WhatsApp button was pressed (see src/lib/funnel). One listener on
 * the page; a button names its spot with `data-funnel="home-hero"`, otherwise
 * the spot is `fallback`. Renders nothing.
 */
export function FunnelCounter({ path, fallback }: { path: string; fallback: string }) {
  React.useEffect(() => {
    countStep("view", undefined, path);
    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const spot = a.getAttribute("data-funnel");
      if (href.startsWith("tel:")) return countStep("cta", "call", path);
      if (href.includes("wa.me/")) return countStep("cta", "whatsapp", path);
      if (/\/login(\b|$)/.test(href)) return countStep("cta", "login", path);
      if (/\/waitlist(\b|$|\?|#)/.test(href) || spot) return countStep("cta", spot ?? fallback, path);
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [path, fallback]);
  return null;
}
