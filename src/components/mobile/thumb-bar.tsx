"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/** True on phones (< 768 px), in the browser only (the server renders the wide layout). */
function usePhone(): boolean {
  return React.useSyncExternalStore(
    (cb) => {
      if (typeof window.matchMedia !== "function") return () => {};
      const m = window.matchMedia("(max-width: 767px)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => typeof window.matchMedia === "function" && window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
}

/**
 * ThumbBar: the next step of a question or a game, where the thumb is.
 *
 * Phones (< 768 px): fixed to the bottom of the screen, above the bottom tab
 * bar when one is showing (`--nav-h`) and clear of the gesture bar
 * (`--free-inset`, the safe-area inset when no tab bar covers it). It is
 * rendered into <body>, so an animated card around it (a panel that pops in)
 * cannot pin it inside the card. A spacer of the same height stays in the
 * page so the last line of content can scroll above the bar.
 *
 * Tablets and up: the same buttons sit in the page, right where they were.
 *
 * Put one primary button in it (Check, Next), optionally a quiet one beside
 * it. Never a text field: the phone keyboard would cover it.
 */
export function ThumbBar({
  children,
  label,
  className,
  inlineClassName,
}: {
  children: React.ReactNode;
  /** Screen-reader name for the bar ("Answer", "Next step"). */
  label?: string;
  className?: string;
  /** Layout of the buttons from 768 px up (they sit in the page there). */
  inlineClassName?: string;
}) {
  const phone = usePhone();
  const bar = (
    <div
      role={label ? "group" : undefined}
      aria-label={label}
      // The reaction pop-up keeps clear of the bar (reactions/reaction-layer.tsx).
      data-reaction-avoid
      className={cn(
        "thumb-bar fixed inset-x-0 z-40 border-t-2 border-foreground bg-card px-4 pt-2.5 md:static md:z-auto md:border-0 md:bg-transparent md:p-0",
        className,
      )}
    >
      <div className={cn("mx-auto flex w-full max-w-xl items-stretch gap-3 md:max-w-none", inlineClassName)}>{children}</div>
    </div>
  );
  return (
    <>
      {phone ? createPortal(bar, document.body) : bar}
      {/* Room under the content for the bar (phones only). */}
      <div aria-hidden className="thumb-bar-space md:hidden" />
    </>
  );
}
