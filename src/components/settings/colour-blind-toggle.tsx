"use client";

import * as React from "react";
import { readCvd, writeCvd } from "@/lib/a11y/colour-blind";

const CVD_EVENT = "vibha:cvd-change";
function subscribe(cb: () => void) {
  window.addEventListener(CVD_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CVD_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/**
 * Colour-blind friendly colours. Deliberately quiet: it lives inside the
 * closed "Accessibility" section at the bottom of Settings. Same design;
 * only right/wrong and alert colours change (blue/orange + stripes).
 */
export function ColourBlindToggle() {
  const on = React.useSyncExternalStore(subscribe, readCvd, () => false);

  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 py-2">
      <span className="min-w-0 flex-1">
        <span className="block text-small text-foreground">Colour-blind friendly colours</span>
        <span className="block text-caption text-muted-foreground">Right shows blue, wrong shows orange. This device only.</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={on}
        onChange={(e) => {
          writeCvd(e.target.checked);
          window.dispatchEvent(new Event(CVD_EVENT));
        }}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="relative h-6 w-10 shrink-0 rounded-full border-2 border-foreground bg-muted transition-colors duration-fast peer-checked:bg-brand peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/60 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-card after:transition-transform after:duration-fast peer-checked:after:translate-x-4"
      />
    </label>
  );
}
