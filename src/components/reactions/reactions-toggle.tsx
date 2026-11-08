"use client";

import * as React from "react";
import { useReactionsOn } from "./use-reaction";

/**
 * "Funny reactions": meme stickers and a cheeky line after some answers.
 * On by default, kept on this device. Same switch look as the colour-blind one.
 */
export function ReactionsToggle() {
  const [on, setOn] = useReactionsOn();
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 py-2">
      <span className="min-w-0 flex-1">
        <span className="block text-small text-foreground">Funny reactions</span>
        <span className="block text-caption text-muted-foreground">A meme and a cheeky line after some answers. This device only.</span>
      </span>
      <input type="checkbox" role="switch" checked={on} onChange={(e) => setOn(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-6 w-10 shrink-0 rounded-full border-2 border-foreground bg-muted transition-colors duration-fast peer-checked:bg-brand peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/60 after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-card after:transition-transform after:duration-fast peer-checked:after:translate-x-4"
      />
    </label>
  );
}
