"use client";

import * as React from "react";
import { CircleHelp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTip, type TipStore } from "@/lib/tips/store";
import { cn } from "@/lib/utils";

/**
 * A short how-to that shows the first time a student meets a feature.
 * "Got it" closes it for good (remembered per student, see lib/tips/store).
 * After that only a small "How to play" button is left, which opens it again.
 *
 * Until we know whether the student has seen it (server render, first paint),
 * the folded button shows, so returning students never see a flash of help.
 *
 * <FirstTimeTip> puts the button and the panel in one place. When the button
 * belongs in a header and the panel below it, use useFirstTimeTip with
 * <TipButton> and <TipPanel>.
 */

export type TipContent = {
  title?: string;
  /** The folded button's text. Defaults to the title. */
  label?: string;
  /** One plain line before the steps. */
  intro?: string;
  steps?: readonly string[];
  children?: React.ReactNode;
};

export type TipControl = ReturnType<typeof useFirstTimeTip>;

export function useFirstTimeTip(id: string, store?: TipStore) {
  const { seen, dismiss } = useTip(id, store);
  const [reopened, setReopened] = React.useState(false);
  const panelId = React.useId();
  // Move focus by id after the swap, so keyboard users land on what appeared.
  const focus = (elId: string) => requestAnimationFrame(() => document.getElementById(elId)?.focus());
  const close = React.useCallback(() => {
    dismiss();
    setReopened(false);
    focus(`${panelId}-b`);
  }, [dismiss, panelId]);
  const reopen = React.useCallback(() => {
    setReopened(true);
    focus(`${panelId}-h`);
  }, [panelId]);
  return { id, open: reopened || seen === false, close, reopen, panelId };
}

/** `compact`: icon only on phones (the label stays for screen readers), so a long title keeps its room. */
export function TipButton({ tip, label, className, compact = false }: { tip: TipControl; label: string; className?: string; compact?: boolean }) {
  if (tip.open) return null;
  return (
    <Button
      id={`${tip.panelId}-b`}
      type="button"
      variant="ghost"
      className={cn("h-11 px-3 text-sm", compact && "w-11 px-0 sm:w-auto sm:px-3", className)}
      aria-expanded={false}
      aria-controls={tip.panelId}
      onClick={tip.reopen}
      data-tip={tip.id}
      data-tip-state="folded"
    >
      <CircleHelp aria-hidden className={cn(compact && "size-5 sm:size-4")} />
      {compact ? <span className="sr-only sm:not-sr-only">{label}</span> : label}
    </Button>
  );
}

export function TipPanel({ tip, title = "How it works", intro, steps, children, className }: TipContent & { tip: TipControl; className?: string }) {
  if (!tip.open) return null;
  return (
    <section
      id={tip.panelId}
      aria-labelledby={`${tip.panelId}-h`}
      className={cn("relative rounded-[10px] border-2 border-foreground bg-card p-4 pr-12 hard-shadow-sm", className)}
      data-tip={tip.id}
      data-tip-state="open"
    >
      <h2 id={`${tip.panelId}-h`} tabIndex={-1} className="font-bold outline-none">
        {title}
      </h2>
      {intro ? <p className="mt-1 text-sm leading-snug text-muted-foreground">{intro}</p> : null}
      {steps?.length ? (
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-snug">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      ) : null}
      {children ? <div className="mt-2 space-y-1 text-sm leading-snug">{children}</div> : null}
      <Button type="button" className="mt-3 h-11" onClick={tip.close}>
        Got it
      </Button>
      <button type="button" onClick={tip.close} aria-label="Close" className="absolute top-1 right-1 grid size-11 place-items-center rounded-md text-muted-foreground hover:text-foreground">
        <X className="size-4" aria-hidden />
      </button>
    </section>
  );
}

export function FirstTimeTip({
  id,
  title = "How it works",
  label,
  intro,
  steps,
  children,
  className,
  store,
}: TipContent & {
  /** Stable id, for example "duel". Lowercase letters, digits and hyphens. */
  id: string;
  className?: string;
  /** Tests only. */
  store?: TipStore;
}) {
  const tip = useFirstTimeTip(id, store);
  return tip.open ? (
    <TipPanel tip={tip} title={title} intro={intro} steps={steps} className={className}>
      {children}
    </TipPanel>
  ) : (
    <div className={cn("flex", className)}>
      <TipButton tip={tip} label={label ?? title} />
    </div>
  );
}
