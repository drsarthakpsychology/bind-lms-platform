"use client";

import * as React from "react";
import { ATTRIBUTION_CASES } from "@/lib/lab/experiments2";
import { attributionSummary } from "@/lib/lab/scoring2";
import { Bars, LabButton, Panel, RoundBar, type RunnerProps } from "../lab-ui";
import { EndsSlider } from "./batch2-ui";

/* ------------------------------------------------------------------ */
/* Why did they do it? (attribution)                                   */
/* ------------------------------------------------------------------ */

const words = (v: number) => `${100 - v}% situation, ${v}% person`;

export function AttributionRunner({ onDone }: RunnerProps) {
  const [i, setI] = React.useState(0);
  const [before, setBefore] = React.useState(50);
  const [after, setAfter] = React.useState(50);
  const [revealed, setRevealed] = React.useState(false);
  const rows = React.useRef<{ before: number; after: number }[]>([]);
  const c = ATTRIBUTION_CASES[i];

  function reveal() {
    setRevealed(true);
    setAfter(before);
  }

  function next() {
    rows.current[i] = { before, after };
    if (i + 1 >= ATTRIBUTION_CASES.length) {
      const s = attributionSummary(rows.current);
      onDone({
        numbers: { before: s.before, after: s.after, lean: s.lean, shift: s.shift },
        verdict:
          s.lean > 5
            ? `Before you knew the situation, you put ${s.before}% of the cause on the person. Once you knew it, that fell to ${s.after}%. The first pull towards character is the fundamental attribution error.`
            : `You did not lean towards the person at first (${s.before}% person on average): you held back until you knew more. Once you knew the situation, you moved to ${s.after}%. Many people, and people in more context-focused cultures, start by asking about the situation.`,
        view: (
          <div className="space-y-4">
            <Bars
              ariaLabel="How much you put down to the person"
              unit="% person"
              items={[
                { label: "Before the facts", value: s.before, highlight: true },
                { label: "After the facts", value: s.after },
              ]}
            />
            <ul className="space-y-1.5 text-sm" aria-label="Each case">
              {ATTRIBUTION_CASES.map((a, k) => (
                <li key={a.id} className="flex items-start justify-between gap-3 border-b border-foreground/20 pb-1.5">
                  <span className="min-w-0">{a.act}</span>
                  <span className="shrink-0 font-mono text-xs font-bold tabular-nums">
                    {rows.current[k]?.before}→{rows.current[k]?.after}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ),
      });
      return;
    }
    setI(i + 1);
    setBefore(50);
    setAfter(50);
    setRevealed(false);
  }

  return (
    <Panel className="space-y-5">
      <RoundBar at={i + 1} of={ATTRIBUTION_CASES.length} label="Story" />
      <p className="rounded-xl border-2 border-foreground bg-background p-4 text-lg font-semibold leading-snug">{c.act}</p>

      <EndsSlider
        id={`before-${c.id}`}
        label="Why did this happen?"
        left="Mostly the situation"
        right="Mostly the person"
        value={before}
        onChange={setBefore}
        disabled={revealed}
        valueText={words(before)}
      />
      <p className="text-center font-mono text-sm font-bold tabular-nums" aria-hidden>
        {words(before)}
      </p>

      {!revealed ? (
        <LabButton onClick={reveal}>Lock it and see more</LabButton>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-foreground bg-card p-4" role="status">
            <p className="text-eyebrow text-link">What you could not see</p>
            <p className="mt-1">{c.reveal}</p>
          </div>
          <EndsSlider
            id={`after-${c.id}`}
            label="Now, why did this happen?"
            left="Mostly the situation"
            right="Mostly the person"
            value={after}
            onChange={setAfter}
            valueText={words(after)}
          />
          <p className="text-center font-mono text-sm font-bold tabular-nums" aria-hidden>
            {words(after)}
          </p>
          <LabButton onClick={next}>{i + 1 >= ATTRIBUTION_CASES.length ? "See my result" : "Next story"}</LabButton>
        </div>
      )}
    </Panel>
  );
}
