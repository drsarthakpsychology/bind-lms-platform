"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HowToBody } from "@/components/help/how-to";
import { TipButton, useFirstTimeTip, type TipContent } from "@/components/help/first-time-tip";
import { useBack } from "@/components/study/back";
import { cn } from "@/lib/utils";

/**
 * The one frame for every game and every practice tool (new design).
 *
 *   row 1   Back, the activity's name, How to play
 *   body    the play area, plain on the page (no box around it)
 *   action  the activity's own ThumbBar, pinned to the bottom on phones
 *
 * The how-to shows once, as a quiet panel under the row; "Got it" or the
 * first move (startHowTo / <HowToStart>) folds it into the button, which
 * then opens the same words as a sheet over the game. Back goes where the
 * student came from (navigation/sections.ts). The frame adds no logic.
 */

const WIDTH = {
  /** Text-first tools: a case to read, a form to write. */
  reading: "max-w-3xl",
  /** Most games. */
  play: "max-w-4xl",
  /** Boards and pickers. */
  wide: "max-w-5xl",
} as const;

export type GameFrameTip = TipContent & { id: string };

export function GameFrame({
  title,
  tip,
  fallback,
  back,
  width = "play",
  titleAs: Title = "h1",
  aside,
  className,
  children,
}: {
  title: React.ReactNode;
  /** The how-to. Its button sits at the end of the row. */
  tip?: GameFrameTip;
  /** Where Back goes when the page was opened directly. */
  fallback?: string;
  /** A fixed Back target, for a page that belongs to another tool. */
  back?: { href: string; label: string };
  width?: keyof typeof WIDTH;
  /** "p" when the activity draws its own page heading. */
  titleAs?: "h1" | "p";
  /** A small extra at the end of the row, before How to play (rare). */
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  const found = useBack(fallback);
  const to = back ?? found;
  return (
    <div data-ds="play" className={cn("ds-page play-frame mx-auto flex w-full min-w-0 flex-col gap-4", WIDTH[width], className)}>
      <header className="flex min-h-11 min-w-0 items-center gap-2">
        <Link
          href={to.href}
          aria-label={to.label}
          className="-ml-2.5 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-foreground outline-none transition-colors duration-[var(--ds-state)] ease-[var(--ds-ease)] hover:bg-[var(--ds-tint)] focus-visible:ring-2 focus-visible:ring-ring active:bg-[var(--ds-tint)]"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <Title className="min-w-0 flex-1 type-h3 [overflow-wrap:anywhere]">{title}</Title>
        {aside ? <div className="flex shrink-0 items-center gap-2">{aside}</div> : null}
        {tip ? <FrameTipButton tip={tip} /> : null}
      </header>
      {tip ? <FrameTipPanel tip={tip} /> : null}
      <div className="play-body min-w-0">{children}</div>
    </div>
  );
}

const labelOf = (tip: GameFrameTip) => tip.label ?? "How to play";

function FrameTipButton({ tip }: { tip: GameFrameTip }) {
  const t = useFirstTimeTip(tip.id);
  return (
    <TipButton tip={t} label={labelOf(tip)} title={tip.title} intro={tip.intro} steps={tip.steps} className="-mr-2 shrink-0 sm:mr-0">
      {tip.children}
    </TipButton>
  );
}

/** The how-to the first time: a soft panel, no border, no shadow. */
function FrameTipPanel({ tip }: { tip: GameFrameTip }) {
  const t = useFirstTimeTip(tip.id);
  if (!t.open) return null;
  return (
    <section id={t.panelId} aria-labelledby={`${t.panelId}-h`} data-tip={tip.id} data-tip-state="open" className="relative min-w-0 rounded-[var(--ds-radius)] bg-[var(--ds-tint)] p-4 pr-12">
      <h2 id={`${t.panelId}-h`} tabIndex={-1} className="type-small font-bold outline-none">
        {tip.title ?? labelOf(tip)}
      </h2>
      <HowToBody intro={tip.intro} steps={tip.steps}>
        {tip.children}
      </HowToBody>
      <Button type="button" variant="outline" className="mt-3 h-11" onClick={t.close}>
        Got it
      </Button>
      <button type="button" onClick={t.close} aria-label="Close" className="absolute top-1 right-1 grid size-11 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
        <X className="size-4" aria-hidden />
      </button>
    </section>
  );
}
