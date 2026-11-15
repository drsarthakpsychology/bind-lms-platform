import * as React from "react";
import { ActivityFrame } from "@/components/study/activity-frame";
import { ActivityTip } from "@/components/help/activity-tip";
import { GameFrame } from "./game-frame";

/**
 * A game or practice tool's page frame, behind the ui_v2 switch: the new
 * GameFrame when the new design is on, the old ActivityFrame (unchanged)
 * otherwise. The activity inside is the same either way.
 */
export function PlayFrame({
  v2,
  title,
  fallback,
  tip,
  titleAs,
  width,
  before,
  children,
}: {
  /** `await playV2()` from the page. */
  v2: boolean;
  title: string;
  fallback?: string;
  tip?: { id: string; label?: string; intro?: string; steps: readonly string[] };
  /** "p" when the activity draws its own page heading. */
  titleAs?: "h1" | "p";
  width?: "reading" | "play" | "wide";
  /** Sits above the how-to (a mode switch). */
  before?: React.ReactNode;
  children: React.ReactNode;
}) {
  if (v2) {
    return (
      <GameFrame title={title} fallback={fallback} tip={tip} titleAs={titleAs} width={width}>
        {before}
        {children}
      </GameFrame>
    );
  }
  return (
    <ActivityFrame title={title} fallback={fallback}>
      {before}
      {tip ? <ActivityTip id={tip.id} label={tip.label} intro={tip.intro} steps={tip.steps} /> : null}
      {children}
    </ActivityFrame>
  );
}
