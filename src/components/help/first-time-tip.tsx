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
 */
export function FirstTimeTip({
  id,
  title = "How it works",
  label,
  steps,
  children,
  className,
  store,
}: {
  /** Stable id, for example "duel". Lowercase letters, digits and hyphens. */
  id: string;
  title?: string;
  /** The folded button's text. Defaults to the title. */
  label?: string;
  steps?: readonly string[];
  children?: React.ReactNode;
  className?: string;
  /** Tests only. */
  store?: TipStore;
}) {
  const { seen, dismiss } = useTip(id, store);
  const [reopened, setReopened] = React.useState(false);
  const panelId = React.useId();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const open = reopened || seen === false;

  const close = () => {
    dismiss();
    setReopened(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  };
  const reopen = () => {
    setReopened(true);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  if (!open) {
    return (
      <div className={cn("flex", className)} data-tip={id} data-tip-state="folded">
        <Button ref={buttonRef} type="button" variant="ghost" className="h-11 px-3 text-sm" aria-expanded={false} aria-controls={panelId} onClick={reopen}>
          <CircleHelp aria-hidden />
          {label ?? title}
        </Button>
      </div>
    );
  }

  return (
    <section id={panelId} aria-labelledby={`${panelId}-h`} className={cn("relative rounded-[10px] border-2 border-foreground bg-card p-4 pr-12 hard-shadow-sm", className)} data-tip={id} data-tip-state="open">
      <h2 id={`${panelId}-h`} ref={headingRef} tabIndex={-1} className="font-bold outline-none">
        {title}
      </h2>
      {steps?.length ? (
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-snug">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      ) : null}
      {children ? <div className="mt-2 text-sm leading-snug">{children}</div> : null}
      <Button type="button" className="mt-3 h-11" onClick={close}>
        Got it
      </Button>
      <button type="button" onClick={close} aria-label="Close" className="absolute top-1 right-1 grid size-11 place-items-center rounded-md text-muted-foreground hover:text-foreground">
        <X className="size-4" aria-hidden />
      </button>
    </section>
  );
}
