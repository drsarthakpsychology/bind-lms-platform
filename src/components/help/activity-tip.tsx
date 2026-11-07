"use client";

import { TipButton, TipPanel, useFirstTimeTip } from "./first-time-tip";

/**
 * The how-to for a game or activity, at the top of its body. It shows the
 * first time a student opens the activity; after "Got it" only a small
 * "How to play" button is left at the top right.
 */
export function ActivityTip({ id, label = "How to play", intro, steps }: { id: string; label?: string; intro?: string; steps: readonly string[] }) {
  const tip = useFirstTimeTip(id);
  return (
    <>
      <div className="flex justify-end px-2 empty:hidden">
        <TipButton tip={tip} label={label} />
      </div>
      <TipPanel tip={tip} title={label} intro={intro} steps={steps} className="mx-4 mt-3 mb-1" />
    </>
  );
}
