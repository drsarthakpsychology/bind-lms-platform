"use client";

import { Fragment } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Neo-brutalist ticker — a seamless horizontal marquee of the curriculum.
 * Two duplicated runs translate -50% so the loop is continuous (transform/
 * opacity only). Reduced-motion and no-JS render a static strip; hovering
 * pauses it (marquee-paused).
 *
 * The terms are the program's real curriculum (from the Method copy) — no
 * fabricated claims. Purely decorative positioning: it sits between the hero
 * and the "Why this school exists" section as the section divider band.
 */
const TERMS = [
  "Interviewing",
  "Mental status exam",
  "Formulation",
  "Ethics & the law",
  "Simulated patients",
  "Timed assessments",
  "Debrief after every session",
];

export function Marquee() {
  const reduce = useReducedMotion();

  const run = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-6 whitespace-nowrap px-6"
    >
      {TERMS.map((term) => (
        <Fragment key={term}>
          <span className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-foreground">
            {term}
          </span>
          <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
        </Fragment>
      ))}
    </div>
  );

  return (
    <div className="marquee-paused relative overflow-hidden border-y-2 border-foreground bg-card">
      <div
        className={reduce ? "flex overflow-x-auto" : "animate-marquee flex w-max"}
        style={reduce ? undefined : { animationPlayState: "running" }}
      >
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
