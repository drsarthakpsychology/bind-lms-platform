"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTip, type TipStore } from "@/lib/tips/store";
import { cn } from "@/lib/utils";
import { HowToBody, HowToButton } from "./how-to";

/**
 * A short how-to that shows the first time a student meets a feature.
 * "Got it" closes it for good (remembered per student, see lib/tips/store),
 * and so does starting the activity (startHowTo in ./how-to). After that only
 * a small "How to play" button is left, which opens it again as a sheet over
 * the activity (HowToButton), so a game in progress is never moved or reset.
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
  const panelId = React.useId();
  const close = React.useCallback(() => {
    dismiss();
    // Move focus to the button that replaces the panel, so keyboard users are not lost.
    requestAnimationFrame(() => document.getElementById(`${panelId}-b`)?.focus());
  }, [dismiss, panelId]);
  return { id, open: seen === false, close, panelId };
}

/**
 * The folded help button (icon only on phones). It opens the same how-to as a
 * sheet, so pass it the same words as the panel.
 */
export function TipButton({ tip, label, className, ...content }: TipContent & { tip: TipControl; label: string; className?: string }) {
  if (tip.open) return null;
  return <HowToButton id={tip.id} buttonId={`${tip.panelId}-b`} label={label} className={className} {...content} title={content.title ?? label} />;
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
      <HowToBody intro={intro} steps={steps}>
        {children}
      </HowToBody>
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
      <TipButton tip={tip} label={label ?? title} title={title} intro={intro} steps={steps}>
        {children}
      </TipButton>
    </div>
  );
}
