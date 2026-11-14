"use client";

import * as React from "react";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { dismissTip, type TipStore } from "@/lib/tips/store";
import { cn } from "@/lib/utils";

/**
 * The how-to of a game or practice tool, during play.
 *
 * - The first time, the how-to shows as a panel (components/help/first-time-tip).
 * - Pressing Start, Play or any first move calls `startHowTo(id)` (or
 *   `useHowTo(id).start`, or wraps the tool in <HowToStart>): the panel closes
 *   and counts as seen.
 * - A small "How to play" button (<HowToButton>) stays in the activity's
 *   header and opens the same how-to as a sheet on phones and a box on wide
 *   screens. Escape or a tap outside closes it, focus stays inside while it is
 *   open and goes back to the button after. Nothing in the game changes.
 * - Timed games: `useHowTo(id).open` is true while the sheet is open (pause the
 *   clock); `useHowTo(id, { hideWhile })` hides the button while a clock that
 *   cannot pause is running.
 */

export type HowToContent = {
  title?: string;
  /** One plain line before the steps. */
  intro?: string;
  steps?: readonly string[];
  children?: React.ReactNode;
};

/* ------------------------------------------------------------ the store */

/** Which buttons have their sheet open, per activity id. */
const openBy = new Map<string, ReadonlySet<string>>();
/** How many running clocks hide the button, per activity id. */
const hiddenBy = new Map<string, number>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function setOpen(id: string, who: string, on: boolean) {
  const cur = openBy.get(id) ?? new Set<string>();
  if (cur.has(who) === on) return;
  const next = new Set(cur);
  if (on) next.add(who);
  else next.delete(who);
  if (next.size) openBy.set(id, next);
  else openBy.delete(id);
  emit();
}

function hide(id: string, by: 1 | -1) {
  const n = (hiddenBy.get(id) ?? 0) + by;
  if (n > 0) hiddenBy.set(id, n);
  else hiddenBy.delete(id);
  // A clock that starts while the sheet is open closes it.
  if (n > 0) openBy.delete(id);
  emit();
}

const isOpen = (id: string, who?: string) => (who ? (openBy.get(id)?.has(who) ?? false) : (openBy.get(id)?.size ?? 0) > 0);
const isHidden = (id: string) => (hiddenBy.get(id) ?? 0) > 0;
const never = () => false;

/** Tests only: forget every open sheet and hidden button. */
export function resetHowTo() {
  openBy.clear();
  hiddenBy.clear();
  emit();
}

/* ------------------------------------------------------------ the calls */

/**
 * The student pressed Start (or made a first move): the how-to panel for this
 * activity closes and counts as seen, so it does not come back by itself.
 */
export function startHowTo(id: string, store?: TipStore) {
  dismissTip(id, store);
}

export function useHowTo(id: string, { hideWhile = false, store }: { hideWhile?: boolean; store?: TipStore } = {}) {
  const open = React.useSyncExternalStore(subscribe, () => isOpen(id), never);
  React.useEffect(() => {
    if (!hideWhile) return;
    hide(id, 1);
    return () => hide(id, -1);
  }, [id, hideWhile]);
  const start = React.useCallback(() => startHowTo(id, store), [id, store]);
  return { open, start };
}

/**
 * For a tool with no Start button: its first tap, or first typing, counts as
 * Start. Renders no box of its own.
 */
export function HowToStart({ id, children, store }: { id: string; children: React.ReactNode; store?: TipStore }) {
  const fired = React.useRef(false);
  const go = (e: React.SyntheticEvent) => {
    if (fired.current) return;
    const el = e.target instanceof Element ? e.target : null;
    if (!el?.closest("button, a, input, textarea, select, [role=button], [role=radio], [role=checkbox], [role=option]")) return;
    fired.current = true;
    startHowTo(id, store);
  };
  return (
    <div className="contents" onClickCapture={go} onInputCapture={go}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ the view */

/** The how-to's words: the intro line, the numbered steps, anything else. */
export function HowToBody({ intro, steps, children, introAs: Intro = "p" }: HowToContent & { introAs?: React.ElementType }) {
  return (
    <>
      {intro ? <Intro className="mt-1 text-sm leading-snug text-muted-foreground">{intro}</Intro> : null}
      {steps?.length ? (
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-snug">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      ) : null}
      {children ? <div className="mt-2 space-y-1 text-sm leading-snug">{children}</div> : null}
    </>
  );
}

/**
 * The small "How to play" button: a circled "?" with its name beside it on
 * wide screens, the "?" alone on phones (44px either way). It opens the
 * how-to over the game without touching the game.
 */
export function HowToButton({
  id,
  label = "How to play",
  title,
  intro,
  steps,
  children,
  className,
  buttonId,
}: HowToContent & {
  /** The activity, for example "blitz". Start, pausing and hiding use it. */
  id: string;
  /** The button's name. Short: "How to play", "How it works", "Keys". */
  label?: string;
  className?: string;
  /** An id for the button itself, so a closing panel can hand focus to it. */
  buttonId?: string;
}) {
  const who = React.useId();
  const open = React.useSyncExternalStore(subscribe, () => isOpen(id, who), never);
  const hidden = React.useSyncExternalStore(subscribe, () => isHidden(id), never);
  // Leaving the page with the sheet open must not leave the game paused.
  React.useEffect(() => () => setOpen(id, who, false), [id, who]);
  if (hidden) return null;
  return (
    <Dialog open={open} onOpenChange={(on) => setOpen(id, who, on)}>
      <DialogTrigger asChild>
        <Button
          id={buttonId}
          type="button"
          variant="ghost"
          aria-label={label}
          className={cn("h-11 min-w-11 px-0 text-sm sm:px-3", className)}
          data-tip={id}
          data-tip-state="folded"
        >
          <CircleHelp aria-hidden className="size-5 sm:size-4" />
          <span aria-hidden className="hidden sm:inline">
            {label}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        {...(intro ? {} : { "aria-describedby": undefined })}
        data-tip={id}
        data-tip-state="sheet"
        // Game keys (Enter starts, 1 to 4 answer) stay with the sheet while it is open.
        onKeyDown={(e) => e.stopPropagation()}
        className={cn(
          "max-h-[85dvh] gap-0 overflow-y-auto rounded-[10px] p-5 pr-12",
          // Phones: a sheet from the bottom edge.
          "max-sm:top-auto max-sm:bottom-0 max-sm:max-w-full max-sm:translate-y-0 max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0 max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]",
        )}
      >
        <DialogTitle className="font-bold">{title ?? label}</DialogTitle>
        <HowToBody intro={intro} steps={steps} introAs={DialogDescription}>
          {children}
        </HowToBody>
        <DialogClose asChild>
          <Button type="button" className="mt-4 h-11 justify-self-start">
            Got it
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
