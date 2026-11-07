"use client";

/**
 * The one small hint chip, shown wherever hints are offered: hints left,
 * with the detail on hover and for screen readers. When none are left and
 * the student can afford it, one small "3 for 30 XP" button (once a day).
 * Never a big panel.
 */
import * as React from "react";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { buyHintsAction, getHintStatus, type HintAnswer } from "@/lib/hints/actions";
import type { HintStatus } from "@/lib/hints/engine";
import type { HintGive } from "@/lib/hints/resolve";
import { BUY_COST, BUY_COUNT, statusLine } from "@/lib/hints/rules";

/** Hints left, loaded once from the server (or given by the page). */
export function useHintStatus(initial?: HintStatus | null): [HintStatus | null, (s: HintStatus | null) => void] {
  const [status, setStatus] = React.useState<HintStatus | null>(initial ?? null);
  const given = initial !== undefined;
  React.useEffect(() => {
    if (given) return;
    let alive = true;
    getHintStatus()
      .then((s) => {
        if (alive) setStatus(s);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [given]);
  return [status, setStatus];
}

const small = "inline-flex min-h-9 items-center gap-1.5 rounded-md border-2 border-foreground bg-card px-2.5 text-caption font-bold transition-[transform,box-shadow] duration-150 outline-none hover:-translate-y-0.5 hover:hard-shadow-xs focus-visible:ring-[3px] focus-visible:ring-ring/60 active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none";

export function HintChip({ status, onStatus, className }: { status: HintStatus | null; onStatus?: (s: HintStatus) => void; className?: string }) {
  const [pending, start] = React.useTransition();
  const [note, setNote] = React.useState<string | null>(null);
  if (!status) return null;
  const detail = status.mode === "off" ? "Hints are paused right now." : statusLine(status);
  function buy() {
    start(async () => {
      const r = await buyHintsAction().catch(() => null);
      if (!r) return setNote("Couldn't buy. Try again.");
      if (r.status) onStatus?.(r.status);
      setNote(r.ok ? null : r.error);
    });
  }
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1.5", className)}>
      <span title={detail} className="inline-flex items-center gap-1 rounded-full border-2 border-foreground bg-card px-2.5 py-0.5 text-caption font-bold tabular-nums">
        <Lightbulb className="size-3.5" aria-hidden />
        {status.left} hint{status.left === 1 ? "" : "s"}
        <span className="sr-only">: {detail}</span>
      </span>
      {status.left === 0 && status.canBuy ? (
        <button type="button" className={small} disabled={pending} onClick={buy}>
          {BUY_COUNT} for {BUY_COST} XP
        </button>
      ) : null}
      {note ? (
        <span role="status" className="text-caption text-muted-foreground">
          {note}
        </span>
      ) : null}
    </span>
  );
}

/**
 * Chip plus one "Hint" button for a single question. `used` is true once
 * this question's hint is open (it then says so and can't be asked again).
 */
export function HintBar({
  status,
  onStatus,
  ask,
  onGive,
  used,
  disabled,
  label = "Rule out two",
  className,
}: {
  status: HintStatus | null;
  onStatus: (s: HintStatus) => void;
  ask: () => Promise<HintAnswer>;
  onGive: (g: HintGive) => void;
  used: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
}) {
  const [pending, start] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  if (!status) return null;
  function go() {
    setError(null);
    start(async () => {
      const r = await ask().catch(() => null);
      if (!r) return setError("Couldn't get a hint. Try again.");
      if (r.status) onStatus(r.status);
      if (r.ok) onGive(r.give);
      else setError(r.error);
    });
  }
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <HintChip status={status} onStatus={onStatus} />
      <button type="button" className={small} disabled={disabled || used || pending || status.left === 0} onClick={go}>
        <Lightbulb className="size-3.5" aria-hidden /> {used ? "Hint used" : label}
      </button>
      {error ? (
        <span role="status" className="text-caption text-muted-foreground">
          {error}
        </span>
      ) : null}
    </div>
  );
}
