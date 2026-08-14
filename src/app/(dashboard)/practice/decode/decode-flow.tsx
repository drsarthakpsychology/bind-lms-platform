"use client";

import * as React from "react";
import { MobileModeSwitcher } from "@/components/mobile/mobile-mode-switcher";
import { DecodeArena } from "./decode-arena";
import { FunnelDrill } from "./funnel-drill";
import { SevenReadings } from "./seven-readings";
import { CfiDrill } from "./cfi-drill";
import { QuizCheck } from "@/components/practice/quiz-check";
import type { QuizItem } from "@/lib/quiz/quiz";
import type { IdiomEntry } from "@/lib/decode/idioms";

const MODES = [
  { value: "decode", label: "Decode" },
  { value: "funnel", label: "Funnel" },
  { value: "readings", label: "Seven Readings" },
  { value: "cfi", label: "CFI" },
  { value: "check", label: "Check" },
] as const;

type ModeKey = (typeof MODES)[number]["value"];

/**
 * The Presenting Complaint Decoder as a single-task flow (progressive
 * disclosure, T18/T22): one drill visible at a time behind the shared
 * MobileModeSwitcher, instead of five full drills stacked on one scroll
 * surface. The flagship DecodeArena is the default; each subsequent mode is
 * one tap away, and the "Mode n of 5" eyebrow keeps the learner oriented.
 */
export function DecodeFlow({ set, quiz }: { set: IdiomEntry[]; quiz: QuizItem[] }) {
  const [mode, setMode] = React.useState<ModeKey>("decode");
  const activeIndex = MODES.findIndex((m) => m.value === mode);

  return (
    <div className="space-y-4">
      <MobileModeSwitcher
        modes={MODES}
        active={mode}
        onActiveChange={setMode}
        label="Decoder modes"
        eyebrow={
          <>
            Mode <span className="text-numeric font-semibold">{activeIndex + 1}</span> of{" "}
            {MODES.length}
          </>
        }
      />

      {/* One drill at a time — the only content competing for attention. */}
      <div>
        {mode === "decode" ? <DecodeArena entries={set} /> : null}
        {mode === "funnel" ? <FunnelDrill entry={set[1] ?? set[0]} /> : null}
        {mode === "readings" ? <SevenReadings entry={set[2] ?? set[0]} /> : null}
        {mode === "cfi" ? <CfiDrill /> : null}
        {mode === "check" ? <QuizCheck items={quiz} /> : null}
      </div>
    </div>
  );
}
