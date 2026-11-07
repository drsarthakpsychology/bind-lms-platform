"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";

/**
 * Pacing for every step-by-step player (animations, flows, scene journeys
 * and tours). The rule: nothing moves on its own. A player opens on its
 * first step and waits; the student taps Next or Back. Play is an explicit
 * button that walks through the steps at a reading pace worked out from
 * each step's words, always offers Pause, and stops when the player leaves
 * the screen or the tab is hidden. A step's caption stays until the
 * student (or Play, after the reading time) moves on, so no text is skipped.
 */

/** Reading pace: about 250 ms a word (roughly 240 words a minute), and never less than 3 s a step. */
export const WORD_MS = 250;
export const MIN_STEP_MS = 3000;

export function wordCount(text?: string | null) {
  if (!text) return 0;
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/** How long Play holds a step whose words are `text`. `min` raises the floor (for example to let an animation finish). */
export function readingMs(text?: string | null, min = MIN_STEP_MS) {
  return Math.max(min, MIN_STEP_MS, wordCount(text) * WORD_MS);
}

export type StepPlayer = {
  i: number;
  n: number;
  playing: boolean;
  /** Go to a step (pauses Play). */
  setI: (k: number) => void;
  next: () => void;
  back: () => void;
  play: () => void;
  pause: () => void;
  /** Back to the start position (pauses Play). */
  reset: () => void;
};

/**
 * A step index from `start` to n - 1 that changes only when the student
 * acts. While playing, each step is held for its reading time; at the last
 * step Play stops and the caption stays.
 */
export function useStepPlayer(n: number, textAt: (i: number) => string | null | undefined, opts: { start?: number; min?: number } = {}): StepPlayer {
  const start = opts.start ?? 0;
  const [i, setIdx] = React.useState(start);
  const [playing, setPlaying] = React.useState(false);
  const ms = readingMs(textAt(i), opts.min);
  React.useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (i + 1 >= n) setPlaying(false);
      else setIdx(i + 1);
    }, ms);
    return () => clearTimeout(t);
  }, [playing, i, n, ms]);
  const pause = React.useCallback(() => setPlaying(false), []);
  return {
    i,
    n,
    playing,
    setI: (k) => {
      setPlaying(false);
      setIdx(Math.max(start, Math.min(n - 1, k)));
    },
    next: () => {
      setPlaying(false);
      setIdx((x) => Math.min(n - 1, x + 1));
    },
    back: () => {
      setPlaying(false);
      setIdx((x) => Math.max(start, x - 1));
    },
    play: () => {
      // from the end, start again; from "not started", show the first step and hold it for its reading time
      setIdx((x) => (x >= n - 1 || x < 0 ? 0 : x));
      setPlaying(true);
    },
    pause,
    reset: () => {
      setPlaying(false);
      setIdx(start);
    },
  };
}

/** Calls `pause` when the element scrolls off screen or the tab is hidden, while `playing`. */
export function usePauseWhenAway(ref: React.RefObject<Element | null>, playing: boolean, pause: () => void) {
  React.useEffect(() => {
    if (!playing) return;
    const onVis = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onVis);
    let io: IntersectionObserver | null = null;
    const el = ref.current;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((es) => {
        if (es.some((e) => !e.isIntersecting)) pause();
      });
      io.observe(el);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, [ref, playing, pause]);
}

const ctl = "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border-2 border-foreground px-3 font-semibold transition-transform duration-fast active:translate-x-px active:translate-y-px disabled:opacity-40";

/**
 * Back, Next and Play/Pause for a step player, with "Step k of n". Pauses by
 * itself when it leaves the screen or the tab is hidden.
 */
export function PlayBar({ st, kind, first = "Play", again = "Play again", hint = "or tap a step", nextLabel = "Next", count = true }: { st: StepPlayer; kind: string; first?: string; again?: string; hint?: string; nextLabel?: string; n?: number; count?: boolean }) {
  const box = React.useRef<HTMLDivElement>(null);
  usePauseWhenAway(box, st.playing, st.pause);
  const atEnd = st.i >= st.n - 1;
  const started = st.i >= 0;
  return (
    <div ref={box} className="mt-3 flex flex-wrap items-center gap-2">
      <button type="button" className={cn(ctl, "bg-card")} onClick={st.back} disabled={st.i <= 0}><ChevronLeft className="size-4" aria-hidden /> Back</button>
      <button type="button" className={cn(ctl, "bg-foreground text-background")} onClick={() => { if (!started) trackLearn({ type: "widget", kind }); st.next(); }} disabled={atEnd}><ChevronRight className="size-4" aria-hidden /> {nextLabel}</button>
      {st.playing ? (
        <button type="button" className={cn(ctl, "bg-card")} onClick={st.pause}><Pause className="size-4" aria-hidden /> Pause</button>
      ) : (
        <button type="button" className={cn(ctl, "bg-card")} onClick={() => { st.play(); trackLearn({ type: "widget", kind }); }} aria-label={atEnd ? `${again} at reading pace` : `${first} at reading pace`}>
          <Play className="size-4" aria-hidden /> {atEnd ? again : first}
        </button>
      )}
      {count ? <span className="text-sm text-muted-foreground">{started ? `Step ${Math.min(st.i + 1, st.n)} of ${st.n}` : `${st.n} steps`}{hint ? `, ${hint}` : ""}</span> : null}
    </div>
  );
}
