"use client";

import { TipButton, TipPanel, useFirstTimeTip } from "./first-time-tip";

/**
 * The how-to for a game or activity, at the top of its body. It shows the
 * first time a student opens the activity. "Got it", or pressing Start in the
 * game (startHowTo), folds it into a small "How to play" button at the top
 * right, which opens the same how-to as a sheet during play.
 */
export function ActivityTip({ id, label = "How to play", intro, steps }: { id: string; label?: string; intro?: string; steps: readonly string[] }) {
  const tip = useFirstTimeTip(id);
  return (
    <>
      {/* Below 1024 px the button rises into the frame's Back row (globals.css, .activity-help). */}
      <div className="activity-help flex justify-end px-2 empty:hidden">
        <TipButton tip={tip} label={label} intro={intro} steps={steps} />
      </div>
      <TipPanel tip={tip} title={label} intro={intro} steps={steps} className="mt-3 mb-1 lg:mx-4" />
    </>
  );
}
