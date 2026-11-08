"use client";

import * as React from "react";
import Image from "next/image";
import { MessageCircleOff } from "lucide-react";
import { writeReactionsOn } from "@/lib/reactions/prefs";
import { GOOD_MOODS, stickerSrc } from "@/lib/reactions/stickers";
import { cn } from "@/lib/utils";
import { dismissReaction, getShown, getShownServer, subscribeShown, type Shown } from "./store";

/** How long a reaction stays (entrance included). Hover or focus holds it. */
/** Kept for tests: stickers no longer leave on a timer; a tap or Escape removes them. */
export const SHOW_MS = 2800;

const OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";
const SNAPPY = "cubic-bezier(0.2, 0, 0, 1)";

/** Things a reaction must never sit on: answers, Next/Check buttons, inputs. */
const AVOID = "main button, main a[href], main [role=radio], main input, main textarea, main select, [data-reaction-avoid]";

function reducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function overlap(box: DOMRect, skip: Element): number {
  let area = 0;
  for (const el of document.querySelectorAll(AVOID)) {
    if (skip.contains(el)) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const w = Math.min(box.right, r.right) - Math.max(box.left, r.left);
    const h = Math.min(box.bottom, r.bottom) - Math.max(box.top, r.top);
    if (w > 0 && h > 0) area += w * h;
  }
  return area;
}

/**
 * Bottom corner by default (above the phone tab bar). If that would cover an
 * answer, a Next button or a field, try the top corner (under the top bar)
 * and keep whichever covers less. Styles are set directly: no re-render.
 */
function place(el: HTMLElement) {
  el.style.top = "";
  el.style.bottom = "";
  const low = overlap(el.getBoundingClientRect(), el);
  if (low === 0) return;
  el.style.top = "calc(var(--top-h, 3.5rem) + 0.75rem)";
  el.style.bottom = "auto";
  const high = overlap(el.getBoundingClientRect(), el);
  if (high >= low) {
    el.style.top = "";
    el.style.bottom = "";
  }
}

/** The app-wide reaction pop-up. Mounted once in the app shell. */
export function ReactionLayer() {
  const shown = React.useSyncExternalStore(subscribeShown, getShown, getShownServer);
  return (
    <>
      {/* Announced politely: the sticker's description and the line. */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {shown ? `${shown.sticker.alt}. ${shown.line}` : ""}
      </div>
      {shown ? <Popup key={shown.key} r={shown} /> : null}
    </>
  );
}

function Popup({ r }: { r: Shown }) {
  const box = React.useRef<HTMLDivElement>(null);
  const art = React.useRef<HTMLDivElement>(null);
  const bubble = React.useRef<HTMLButtonElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaving = React.useRef(false);
  const good = GOOD_MOODS.has(r.mood);

  const leave = React.useCallback(() => {
    if (leaving.current) return;
    leaving.current = true;
    if (timer.current) clearTimeout(timer.current);
    const el = box.current;
    if (!el || typeof el.animate !== "function") return dismissReaction(r.key);
    const frames = reducedMotion() ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(6px)" }];
    const a = el.animate(frames, { duration: 180, easing: SNAPPY, fill: "forwards" });
    a.onfinish = () => dismissReaction(r.key);
  }, [r.key]);

  // The sticker stays until the student taps it (or presses Escape); a newer one replaces it.
  const hold = React.useCallback(() => {}, []);
  const release = React.useCallback(() => {}, []);

  React.useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    place(el);
    if (typeof el.animate === "function") {
      if (reducedMotion()) {
        // Reduced motion: a fade, nothing moves.
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "linear" });
      } else {
        // Tilt in, then stamp down flat onto the page. No overshoot.
        art.current?.animate(
          [
            { opacity: 0, transform: "translateY(-10px) rotate(-18deg) scale(1.28)" },
            { opacity: 1, transform: "rotate(-4deg) scale(1)" },
          ],
          { duration: 380, easing: OUT_EXPO },
        );
        bubble.current?.animate(
          [
            { opacity: 0, transform: "translateX(10px) scale(0.96)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 260, delay: 150, easing: OUT_EXPO, fill: "backwards" },
        );
      }
    }
    let raf = 0;
    const again = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => place(el));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") leave();
    };
    window.addEventListener("scroll", again, { passive: true });
    window.addEventListener("resize", again);
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("scroll", again);
      window.removeEventListener("resize", again);
      window.removeEventListener("keydown", onKey);
    };
  }, [leave]);

  return (
    <div
      ref={box}
      data-reaction={r.mood}
      onPointerEnter={hold}
      onPointerLeave={release}
      onFocus={hold}
      onBlur={release}
      className="fixed right-3 bottom-[calc(var(--nav-h,0px)+0.75rem)] z-[45] flex max-w-[calc(100vw-1.5rem)] items-end md:right-6 md:bottom-6"
    >
      <div className="relative mb-5 min-w-0 md:mb-7">
        <button
          ref={bubble}
          type="button"
          onClick={leave}
          className={cn(
            "relative block max-w-[14rem] rounded-lg border-2 border-foreground py-2 pr-3 pl-5 text-left text-small leading-snug font-semibold text-foreground hard-shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 md:max-w-[16rem] md:text-body",
            good ? "bg-status-success-bg" : "bg-card",
          )}
        >
          <span className="sr-only">Close: </span>
          {r.line}
          {/* The tail points at the sticker. */}
          <span aria-hidden className="absolute top-1/2 -right-[7px] size-3 -translate-y-1/2 rotate-45 border-t-2 border-r-2 border-foreground bg-inherit" />
        </button>
        <button
          type="button"
          onClick={() => {
            writeReactionsOn(false);
            leave();
          }}
          aria-label="Turn off funny reactions"
          title="Turn off funny reactions"
          className="absolute -top-3.5 -left-3.5 grid size-7 place-items-center rounded-full border-2 border-foreground bg-card text-foreground hard-shadow-xs transition-transform duration-fast hover:-translate-y-0.5 active:translate-y-px focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 pointer-coarse:size-8"
        >
          <MessageCircleOff className="size-3.5" aria-hidden />
        </button>
      </div>
      {/* Tapping the sticker closes it too (the bubble is the keyboard way). */}
      <div ref={art} onClick={leave} className="ml-1 shrink-0 cursor-pointer" style={{ transform: "rotate(-4deg)" }}>
        <Image
          src={stickerSrc(r.sticker.id)}
          alt={r.sticker.alt}
          width={r.sticker.w}
          height={r.sticker.h}
          unoptimized
          loading="lazy"
          draggable={false}
          className="h-[5.5rem] w-auto select-none md:h-[7.5rem]"
        />
      </div>
    </div>
  );
}
