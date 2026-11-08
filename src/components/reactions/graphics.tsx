"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Flame, X } from "lucide-react";
import { pickReaction, type Reaction } from "@/lib/reactions/pick";
import { GOOD_MOODS, moodForScore, stickerById, stickerSrc, type Mood } from "@/lib/reactions/stickers";
import { cn } from "@/lib/utils";
import { useReactionsOn } from "./use-reaction";
import s from "./reactions.module.css";

/*
 * The quiz graphics: end-screen sticker + line, score dial, right/wrong
 * stamp, streak meter, halftone corner, empty-state sticker and the Study
 * section motif. All decoration is aria-hidden; anything that carries meaning
 * says it in words too.
 */

const OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";

function reducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

/* ------------------------------------------------------------ end pick */
// One pick per end screen, made once in the browser and kept (so a re-render
// never swaps the joke). Server and first paint have none.
const endPicks = new Map<string, Reaction>();
const noop = () => () => {};
function endPick(key: string, mood: Mood): Reaction {
  let r = endPicks.get(key);
  if (!r) {
    r = pickReaction(mood);
    endPicks.set(key, r);
    if (endPicks.size > 60) endPicks.delete(endPicks.keys().next().value as string);
  }
  return r;
}

/** Tilt-and-stamp entrance (fade only for reduced motion), once on mount. */
function useStampIn<T extends HTMLElement>(ready: boolean) {
  const ref = React.useRef<T>(null);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!ready || !el || typeof el.animate !== "function") return;
    if (reducedMotion()) el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
    else
      el.animate(
        [
          { opacity: 0, transform: "translateY(-8px) rotate(-16deg) scale(1.25)" },
          { opacity: 1, transform: "rotate(-4deg) scale(1)" },
        ],
        { duration: 420, delay: 160, easing: OUT_EXPO, fill: "backwards" },
      );
  }, [ready]);
  return ref;
}

/**
 * A sticker and one line for an end screen. Give `mood`, or `right`/`total`
 * to pick the mood from the score. Renders nothing when funny reactions are
 * off. `seed` makes a fresh pick for a new round on the same screen.
 */
export function EndReaction({
  mood: given,
  right,
  total,
  seed = "",
  tone = "light",
  className,
}: {
  mood?: Mood;
  right?: number;
  total?: number;
  seed?: string | number;
  /** "dark" for an ink panel. */
  tone?: "light" | "dark";
  className?: string;
}) {
  const [on] = useReactionsOn();
  const id = React.useId();
  const mood = given ?? moodForScore(right ?? 0, total ?? 0);
  const key = `${id}|${mood}|${seed}`;
  const r = React.useSyncExternalStore(
    noop,
    () => (on ? endPick(key, mood) : null),
    () => null,
  );
  const art = useStampIn<HTMLDivElement>(Boolean(r));
  if (!r) return null;
  const good = GOOD_MOODS.has(mood);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div ref={art} className="shrink-0" style={{ transform: "rotate(-4deg)" }}>
        <Image src={stickerSrc(r.sticker.id)} alt={r.sticker.alt} width={r.sticker.w} height={r.sticker.h} unoptimized loading="lazy" draggable={false} className="h-24 w-auto select-none sm:h-28" />
      </div>
      <p
        className={cn(
          "relative min-w-0 rounded-lg border-2 border-foreground px-3 py-2 text-left text-small leading-snug font-semibold text-foreground hard-shadow-sm sm:text-body",
          good ? "bg-status-success-bg" : "bg-card",
          tone === "dark" && "border-background",
        )}
      >
        {r.line}
        <span aria-hidden className={cn("absolute top-1/2 -left-[7px] size-3 -translate-y-1/2 rotate-45 border-b-2 border-l-2 bg-inherit", tone === "dark" ? "border-background" : "border-foreground")} />
      </p>
    </div>
  );
}

/* ----------------------------------------------------------- score dial */
const R = 42;
const C = 2 * Math.PI * R;

/** The big score graphic: a riso ring that fills to the score, the number in the middle. */
export function ScoreDial({ right, total, label = "right", size = "md", className }: { right: number; total: number; label?: string; size?: "md" | "lg"; className?: string }) {
  const pct = total > 0 ? Math.max(0, Math.min(1, right / total)) : 0;
  const arc = React.useRef<SVGCircleElement>(null);
  React.useLayoutEffect(() => {
    const el = arc.current;
    if (!el || typeof el.animate !== "function" || reducedMotion()) return;
    el.animate([{ strokeDashoffset: String(C) }, { strokeDashoffset: String(C * (1 - pct)) }], { duration: 900, delay: 120, easing: OUT_EXPO, fill: "backwards" });
  }, [pct]);
  const px = size === "lg" ? "size-36 sm:size-40" : "size-28 sm:size-32";
  return (
    <div role="img" aria-label={`${right} of ${total} ${label}`} className={cn("relative shrink-0", px, className)}>
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <circle cx="64" cy="64" r="54" fill="var(--hard-shadow-color)" />
        <circle cx="60" cy="60" r="54" fill="var(--card)" stroke="var(--foreground)" strokeWidth="2.5" />
        <circle cx="60" cy="60" r={R} fill="none" stroke="var(--foreground)" strokeOpacity="0.12" strokeWidth="11" />
        <circle
          ref={arc}
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="11"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span aria-hidden className={cn("absolute inset-[27%] rounded-full", s.halftoneDisc)} />
      <span aria-hidden className="absolute inset-0 grid place-content-center text-center">
        <span className={cn("font-pix leading-none tabular-nums", size === "lg" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl")}>{right}</span>
        <span className="mt-1 font-mono text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">of {total}</span>
      </span>
    </div>
  );
}

/* --------------------------------------------------------- answer stamp */
/**
 * A rubber stamp on the answered option ("Right" / "Wrong"). The option must
 * be `relative`. Decorative: the option already says right or wrong in words.
 */
export function AnswerStamp({ ok, animate = true, className }: { ok: boolean; animate?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -top-2.5 right-3 z-10 inline-flex items-center gap-1 rounded-md border-2 border-foreground px-1.5 py-0.5 font-mono text-[0.65rem] leading-none font-bold tracking-widest uppercase shadow-[inset_0_0_0_1.5px_var(--card)] hard-shadow-xs",
        ok ? "bg-primary text-primary-foreground" : "bg-foreground text-background",
        animate && s.stamp,
        className,
      )}
      style={animate ? undefined : { transform: "rotate(-7deg)" }}
    >
      {ok ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" strokeWidth={3} />}
      {ok ? "Right" : "Wrong"}
    </span>
  );
}

/* --------------------------------------------------------- streak meter */
/** Right answers in a row as five slanted bars; past five they stay full and the count keeps going. */
export function StreakMeter({ streak, className }: { streak: number; className?: string }) {
  const full = Math.min(5, streak);
  const hot = streak >= 3;
  return (
    <span
      role="img"
      aria-label={`Streak: ${streak} right in a row`}
      className={cn("inline-flex h-9 items-center gap-1.5 rounded-md border-2 border-foreground px-2 hard-shadow-xs", hot ? "bg-foreground text-background" : "bg-card text-foreground", className)}
    >
      <Flame className={cn("size-4", hot ? "text-primary" : "opacity-50")} aria-hidden />
      <span className="flex items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3, 4].map((k) => (
          <span
            key={k < full ? `on-${k}` : `off-${k}`}
            className={cn("block h-4 w-2 -skew-x-12 rounded-[2px] border-2", hot ? "border-background" : "border-foreground", k < full ? cn("bg-primary", k === full - 1 && s.fill) : "bg-transparent")}
          />
        ))}
      </span>
      <span className="min-w-[1.25ch] font-mono text-xs font-bold tabular-nums" aria-hidden>
        {streak}
      </span>
    </span>
  );
}

/* ------------------------------------------------------ halftone corner */
/** Riso dots fading from the top-right corner of a card. The card must be `relative overflow-hidden` (or clip it itself). */
export function HalftoneCorner({ className }: { className?: string }) {
  return <span aria-hidden className={cn("pointer-events-none absolute top-0 right-0 size-28 rounded-tr-[inherit] sm:size-36", s.halftone, className)} />;
}

/* ---------------------------------------------------------- empty state */
/** An empty state with a sticker (plain text when funny reactions are off). */
export function EmptySticker({ sticker, title, children, className }: { sticker: string; title: string; children?: React.ReactNode; className?: string }) {
  const [on] = useReactionsOn();
  const st = stickerById(sticker);
  return (
    <div className={cn("flex flex-col items-center gap-3 py-2 text-center sm:flex-row sm:text-left", className)}>
      {on && st ? (
        <Image src={stickerSrc(st.id)} alt={st.alt} width={st.w} height={st.h} unoptimized loading="lazy" draggable={false} className="h-24 w-auto shrink-0 -rotate-3 select-none" />
      ) : null}
      <div className="min-w-0 space-y-1">
        <p className="text-body-strong">{title}</p>
        {children ? <div className="text-small text-muted-foreground">{children}</div> : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------- section motif */
/** A small stamp for a Study section opener: the section number on halftone paper. */
export function SectionMotif({ label, className }: { label: string; className?: string }) {
  return (
    <span aria-hidden className={cn("pointer-events-none relative inline-grid size-16 shrink-0 place-items-center", className)}>
      <span className={cn("absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-lg", s.halftoneDisc)} />
      <span className="relative grid size-14 rotate-[-6deg] place-items-center rounded-lg border-2 border-foreground bg-card shadow-[inset_0_0_0_3px_var(--card),inset_0_0_0_4.5px_var(--foreground)] hard-shadow-xs">
        <span className="font-mono text-sm font-bold tracking-tight tabular-nums text-link">{label}</span>
      </span>
    </span>
  );
}
