"use client";

import * as React from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { QuizCheck } from "@/components/practice/quiz-check";
import type { QuizItem } from "@/lib/quiz/quiz";
import type { IdiomEntry } from "@/lib/decode/idioms";
import { DecodeArena } from "./decode-arena";
import { FunnelDrill } from "./funnel-drill";
import { SevenReadings } from "./seven-readings";
import { CfiDrill } from "./cfi-drill";

type Mode = "decode" | "funnel" | "readings" | "cfi" | "check";

const MODES: ReadonlyArray<{ value: Mode; label: string }> = [
  { value: "decode", label: "Decode" },
  { value: "funnel", label: "Funnel" },
  { value: "readings", label: "Readings" },
  { value: "cfi", label: "CFI" },
  { value: "check", label: "Check" },
];

/**
 * The Presenting Complaint Decoder, gated into one drill at a time. Every mode
 * stays mounted (hidden via `hidden`) so switching modes preserves per-mode
 * progress instead of resetting it.
 */
export function DecodeModes({ set, quiz }: { set: IdiomEntry[]; quiz: QuizItem[] }) {
  const [mode, setMode] = React.useState<Mode>("decode");

  return (
    <div className="space-y-6">
      <SegmentedControl
        value={mode}
        onValueChange={(value) => setMode(value)}
        options={MODES}
        label="Decode mode"
      />

      <section className={mode === "decode" ? "space-y-3" : "hidden"}>
        <DecodeArena entries={set} />
      </section>

      <section className={mode === "funnel" ? "space-y-3" : "hidden"}>
        <h2 className="text-base font-semibold">The Funnel — five questions to find the truth</h2>
        <p className="text-small text-muted-foreground">
          The core drill. Open → specify → instantiate → quantify → contextualise → attribute.
        </p>
        <FunnelDrill entry={set[1]} />
      </section>

      <section className={mode === "readings" ? "space-y-3" : "hidden"}>
        <h2 className="text-base font-semibold">Seven Readings — Kirmayer &amp; Young applied</h2>
        <p className="text-small text-muted-foreground">
          A somatic complaint can mean a disease, an intrapsychic conflict, psychopathology,
          a cultural idiom, a metaphor, social positioning, or protest. Assign them all.
        </p>
        <SevenReadings entry={set[2]} />
      </section>

      <section className={mode === "cfi" ? "space-y-3" : "hidden"}>
        <h2 className="text-base font-semibold">CFI Practice — the Cultural Formulation Interview</h2>
        <p className="text-small text-muted-foreground">
          Elicit the patient&apos;s explanatory model without dismissing it. The failure mode is
          correcting the belief instead of understanding it.
        </p>
        <CfiDrill />
      </section>

      <section className={mode === "check" ? "space-y-3" : "hidden"}>
        <h2 className="text-base font-semibold">Check what stuck</h2>
        <p className="text-small text-muted-foreground">
          A quick check, not a test. Each item carries its source.
        </p>
        <QuizCheck items={quiz} />
      </section>
    </div>
  );
}
