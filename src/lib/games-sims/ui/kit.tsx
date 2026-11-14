"use client";

/**
 * Shared pieces for the second-wave games: buttons (rounded rectangles),
 * status pills (icon + word, never colour alone), cards, meters, a keyboard
 * shortcut hook and the XP hook that pays out through the learn engine.
 */
import * as React from "react";
import { ArrowRight, Check, CircleDashed, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { emptyState, gainXp, istToday, type LearnState } from "@/lib/learn/engine";
import { getLearnState, initLearnStore, setLearnState, useLearnState } from "@/lib/learn/store";
import { haptic } from "@/lib/haptics";
import s from "./games2.module.css";

export const motionCss = s;

type BtnVariant = "primary" | "outline" | "ink" | "ghost" | "danger";

const BTN: Record<BtnVariant, string> = {
  primary: "border-foreground bg-primary text-primary-foreground hard-shadow-sm hover:-translate-y-0.5 hover:hard-shadow-md active:translate-x-px active:translate-y-px active:shadow-none",
  outline: "border-foreground bg-card text-foreground hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-x-px active:translate-y-px active:shadow-none",
  ink: "border-foreground bg-foreground text-background hover:-translate-y-0.5 hover:hard-shadow-sm active:translate-x-px active:translate-y-px active:shadow-none",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-accent",
  danger: "border-destructive bg-card text-destructive hover:bg-status-alert-bg",
};

export function Btn({
  variant = "outline",
  size = "md",
  className,
  ...props
}: React.ComponentProps<"button"> & { variant?: BtnVariant; size?: "md" | "lg" }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-md border-2 px-4 font-semibold leading-tight transition-[transform,box-shadow,background-color] duration-150 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none [&_svg]:size-4 [&_svg]:shrink-0",
        size === "lg" && "min-h-12 px-5 text-body",
        BTN[variant],
        className,
      )}
    />
  );
}

/**
 * One choice on a game's start screen (a mode, a level, a rival). Every
 * choice looks the same at rest, so none of them reads as already picked; the
 * suggested one carries a small "Start here" tag instead of a fill. The whole
 * card is the tap target (at least 64 px tall).
 */
export function ChoiceCard({
  title,
  line,
  icon: Icon,
  hotkey,
  suggested = false,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "title"> & {
  title: React.ReactNode;
  line?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  hotkey?: string;
  suggested?: boolean;
}) {
  const id = React.useId();
  return (
    <button
      type="button"
      aria-labelledby={`${id}-t`}
      aria-describedby={line || suggested ? `${id}-d` : undefined}
      {...props}
      className={cn(
        "group/choice relative flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-[10px] border-2 border-foreground bg-card p-3 text-left text-foreground outline-none hard-shadow-sm",
        "transition-[transform,box-shadow] duration-fast ease-snappy hover:-translate-y-0.5 hover:hard-shadow-md active:translate-x-px active:translate-y-px active:shadow-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:hard-shadow-sm",
        className,
      )}
    >
      {Icon ? (
        <span aria-hidden className={cn("grid size-11 shrink-0 place-items-center rounded-md border-2 border-foreground", suggested ? "bg-primary text-primary-foreground" : "bg-muted")}>
          <Icon className="size-5" aria-hidden />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span id={`${id}-t`} className="text-body-strong leading-tight">
            {title}
          </span>
          {suggested ? (
            <span aria-hidden className="rounded-full border-2 border-foreground bg-primary px-2 py-px font-mono text-[0.65rem] font-bold uppercase leading-tight tracking-wider text-primary-foreground">Start here</span>
          ) : null}
        </span>
        <span id={`${id}-d`} className="mt-0.5 block text-small leading-snug text-muted-foreground empty:hidden">
          {line}
          {suggested ? <span className="sr-only">{line ? " " : ""}Suggested start.</span> : null}
        </span>
      </span>
      {hotkey ? <Kbd>{hotkey}</Kbd> : null}
      <ArrowRight aria-hidden className="size-5 shrink-0 transition-transform duration-fast ease-snappy group-hover/choice:translate-x-0.5" />
    </button>
  );
}

/** The heading over a game's start-screen choices. */
export function PickHeading({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h1 className={cn("text-h3", className)}>{children}</h1>;
}

export type Tone = "good" | "part" | "bad" | "info";
const TONE: Record<Tone, { cls: string; Icon: typeof Check }> = {
  good: { cls: "bg-status-success-bg text-status-success-fg", Icon: Check },
  part: { cls: "bg-status-pending-bg text-status-pending-fg", Icon: CircleDashed },
  bad: { cls: "bg-status-alert-bg text-status-alert-fg", Icon: X },
  info: { cls: "bg-status-info-bg text-status-info-fg", Icon: Info },
};

/** A status pill: icon + word. */
export function Pill({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  const t = TONE[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border-2 border-foreground px-2.5 py-0.5 text-caption font-semibold", t.cls, className)}>
      <t.Icon className="size-3.5" aria-hidden />
      {children}
    </span>
  );
}

export function toneFor(score: number): Tone {
  return score >= 0.999 ? "good" : score > 0 ? "part" : "bad";
}
export function verdictWord(score: number): string {
  return score >= 0.999 ? "Right" : score > 0 ? "Partly right" : "Not right";
}

export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return <div {...props} className={cn("rounded-xl border-2 border-foreground bg-card p-4", className)} />;
}

export function Eyebrow({ index, children }: { index?: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-eyebrow text-link">
      {index ? <span className="font-mono">{index}</span> : null}
      <span className="size-1.5 rounded-full bg-primary ring-1 ring-foreground" aria-hidden />
      {children}
    </p>
  );
}

/** A labelled progress bar (the number is always written too). */
export function Meter({ label, value, max, className }: { label: string; value: number; max: number; className?: string }) {
  const f = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex justify-between gap-2 text-caption font-semibold">
        <span className="truncate">{label}</span>
        <span className="tabular-nums">
          {value}/{max}
        </span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full border-2 border-foreground bg-muted" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div className="h-full origin-left bg-primary transition-transform duration-300" style={{ transform: `scaleX(${f})` }} />
      </div>
    </div>
  );
}

export function Stat({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0 rounded-md border-2 border-foreground bg-card px-3 py-1.5", className)}>
      <p className="truncate text-caption text-muted-foreground">{label}</p>
      <p className="font-pix text-h3 tabular-nums leading-tight">{value}</p>
    </div>
  );
}

/** Keyboard shortcuts (desktop). Ignored while typing in a field. */
export function useHotkeys(map: Record<string, () => void>, enabled = true) {
  const ref = React.useRef(map);
  React.useEffect(() => {
    ref.current = map;
  });
  React.useEffect(() => {
    if (!enabled) return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      const fn = ref.current[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}

/** A small keyboard hint, desktop only. */
export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="ml-1 hidden rounded border border-current px-1 font-mono text-caption opacity-70 lg:inline">{children}</kbd>;
}

const EMPTY = emptyState();

/** The learn state plus `award(xp)`, which pays XP through the learn engine (daily goal, streak, history). */
export function useGameXp(serverState: LearnState | null, save: (s: LearnState) => Promise<unknown>) {
  initLearnStore(serverState, save);
  const state = useLearnState(serverState ?? EMPTY);
  const award = React.useCallback((xp: number) => {
    const amount = Math.max(0, Math.round(xp));
    if (!amount) return;
    const cur = getLearnState() ?? serverState ?? EMPTY;
    setLearnState(gainXp(cur, amount, istToday()));
  }, [serverState]);
  return { state, award };
}

export function buzz(ok: boolean) {
  haptic(ok ? "success" : "warning");
}

/** Reads/writes a small per-browser value (best scores, remembered settings). */
export function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function writeLocal(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}
