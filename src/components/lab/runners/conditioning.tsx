"use client";

import * as React from "react";
import { Bell, Moon, RotateCcw, Utensils } from "lucide-react";
import { condResponse, condStart, condStep, generalise, type CondState } from "@/lib/lab/scoring2";
import { cn } from "@/lib/utils";
import { Bars, LabButton, LineChart, Panel, type RunnerProps } from "../lab-ui";
import { Meter } from "./batch2-ui";

/* ------------------------------------------------------------------ */
/* Pavlov's bell: classical conditioning (Rescorla–Wagner teaching model) */
/* ------------------------------------------------------------------ */

const MIN_PAIRS = 6;
const EXTINCT_BELOW = 20;
const MAX_TRIALS = 60;

type Trial = { kind: "pair" | "tone"; v: number; afterRest: boolean };
type Gen = { near?: number; far?: number };
type Last = { bell: boolean; food: boolean; text: string } | null;

const pct = (v: number) => Math.round(v * 100);

export function PavlovRunner({ onDone }: RunnerProps) {
  const [s, setS] = React.useState<CondState>(condStart);
  const [trials, setTrials] = React.useState<Trial[]>([]);
  const [rests, setRests] = React.useState<number[]>([]);
  const [gen, setGen] = React.useState<Gen>({});
  const [last, setLast] = React.useState<Last>(null);

  const now = pct(condResponse(s));
  const pairs = trials.filter((t) => t.kind === "pair").length;
  const peak = Math.max(0, ...trials.map((t) => t.v));
  const extinguished = trials.some((t, i) => t.kind === "tone" && t.v < EXTINCT_BELOW && trials.slice(0, i).filter((x) => x.kind === "pair").length >= MIN_PAIRS);
  const rested = rests.length > 0;
  const testedAfterRest = trials.some((t) => t.afterRest);
  const canFinish = pairs >= MIN_PAIRS && extinguished && testedAfterRest;
  const full = trials.length >= MAX_TRIALS;

  const phase = pairs < MIN_PAIRS ? 1 : !extinguished ? 2 : !rested ? 3 : !testedAfterRest ? 4 : 5;
  const prompts: Record<number, string> = {
    1: `Ring the bell, then give food. Do this at least ${MIN_PAIRS} times and watch the response to the bell grow.`,
    2: `Now ring the bell with no food. Keep going until the response drops below ${EXTINCT_BELOW}.`,
    3: "The response has faded. Now let a day pass.",
    4: "A day later. Ring the bell alone once. What happens?",
    5: "Done. Try a similar or a different tone, pair again to see how fast it relearns, or see your result.",
  };

  function bell(withFood: boolean) {
    if (full) return;
    const v = pct(condResponse(s));
    const afterRest = rests.length > 0 && rests[rests.length - 1] === trials.length;
    setTrials((t) => [...t, { kind: withFood ? "pair" : "tone", v, afterRest }]);
    setS(condStep(s, withFood ? "pair" : "tone"));
    setLast({
      bell: true,
      food: withFood,
      text: withFood ? `Bell, then food. The bell alone produced a response of ${v}.` : `Bell, no food. Response: ${v}.${afterRest ? " It came back after the rest." : ""}`,
    });
  }

  function rest() {
    if (rests[rests.length - 1] === trials.length) return;
    setRests((r) => [...r, trials.length]);
    setS(condStep(s, "rest"));
    setLast({ bell: false, food: false, text: "A day passes. No bell, no food." });
  }

  function tryTone(which: "near" | "far") {
    // A test only: the model does not learn from it.
    const v = pct(generalise(condResponse(s), which === "near" ? 1 : 3));
    setGen((g) => ({ ...g, [which]: v }));
    setLast({ bell: true, food: false, text: `${which === "near" ? "A slightly higher bell" : "A very different, high whistle"}: response ${v} (trained bell would give ${now}).` });
  }

  function reset() {
    setS(condStart());
    setTrials([]);
    setRests([]);
    setGen({});
    setLast(null);
  }

  function finish() {
    const firstTone = trials.findIndex((t, i) => t.kind === "tone" && trials.slice(0, i).filter((x) => x.kind === "pair").length >= MIN_PAIRS);
    const lowAt = trials.findIndex((t, i) => i >= firstTone && t.kind === "tone" && t.v < EXTINCT_BELOW);
    const extTrials = trials.slice(firstTone, lowAt + 1).filter((t) => t.kind === "tone").length;
    const low = trials[lowAt]?.v ?? 0;
    const recovery = trials.find((t) => t.afterRest)?.v ?? 0;
    const numbers: Record<string, number> = { pairings: pairs, peak, extinctionTrials: extTrials, recovery };
    if (gen.near !== undefined) numbers.similarTone = gen.near;
    onDone({
      numbers,
      verdict: `The bell's response grew to ${peak} over ${pairs} pairings, fell to ${low} after ${extTrials} bells without food, then came back to ${recovery} after a rest. ${recovery > low ? "Extinction hid the learning; it did not erase it." : "Little came back this time; try a longer acquisition before extinction."}`,
      view: (
        <div className="space-y-4">
          <ConditioningChart trials={trials} rests={rests} />
          {(gen.near !== undefined || gen.far !== undefined) && (
            <Bars
              ariaLabel="Response to different tones"
              items={[
                { label: "Trained bell", value: now, highlight: true },
                ...(gen.near !== undefined ? [{ label: "Similar bell", value: gen.near }] : []),
                ...(gen.far !== undefined ? [{ label: "High whistle", value: gen.far }] : []),
              ]}
            />
          )}
          <p className="text-xs text-muted-foreground">Teaching model, not real data.</p>
        </div>
      ),
    });
  }

  return (
    <Panel className="space-y-5">
      <p className="rounded-xl border-2 border-dashed border-foreground/50 px-3 py-2 text-xs font-semibold text-muted-foreground">Teaching model: a simple learning rule with fixed settings, not a real animal.</p>

      <div className="space-y-1">
        <p className="font-mono text-xs font-bold text-link">Step {Math.min(phase, 4)} of 4</p>
        <p className="font-semibold">{prompts[phase]}</p>
      </div>

      <div className="grid grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-3 rounded-xl border-2 border-foreground bg-background p-3">
        <Cue on={!!last?.bell} label="Bell" icon={<Bell className="size-5" aria-hidden />} />
        <Cue on={!!last?.food} label="Food" icon={<Utensils className="size-5" aria-hidden />} />
        <Meter label="Response to the bell" value={now} valueText={`${now} of 100`} />
      </div>
      <p className="min-h-6 text-sm" role="status" aria-live="polite">
        {last?.text ?? "Nothing yet. The bell starts out meaning nothing."}
      </p>

      <div className="grid gap-2 sm:grid-cols-3">
        <LabButton onClick={() => bell(true)} disabled={full}>
          <Bell className="size-4" aria-hidden /> Bell + food
        </LabButton>
        <LabButton tone="plain" onClick={() => bell(false)} disabled={full || pairs === 0}>
          <Bell className="size-4" aria-hidden /> Bell alone
        </LabButton>
        <LabButton tone="plain" onClick={rest} disabled={full || !extinguished || rests[rests.length - 1] === trials.length}>
          <Moon className="size-4" aria-hidden /> Rest a day
        </LabButton>
      </div>
      {full && <p className="text-sm font-semibold">That is plenty of trials. See your result, or start over.</p>}

      {trials.length > 1 && (
        <div className="rounded-xl border-2 border-foreground bg-background p-3">
          <ConditioningChart trials={trials} rests={rests} />
        </div>
      )}

      <details className="rounded-xl border-2 border-foreground/40 p-3 text-sm">
        <summary className="cursor-pointer font-semibold">Extra: does a similar sound work too?</summary>
        <p className="mt-2 text-muted-foreground">These are test sounds. The model does not learn from them.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <LabButton tone="plain" disabled={pairs < 3} onClick={() => tryTone("near")}>
            Slightly higher bell
          </LabButton>
          <LabButton tone="plain" disabled={pairs < 3} onClick={() => tryTone("far")}>
            High whistle
          </LabButton>
        </div>
        {pairs < 3 && <p className="mt-2 text-xs text-muted-foreground">Pair the bell with food a few times first.</p>}
      </details>

      <div className="flex flex-wrap gap-2 border-t-2 border-dashed border-foreground/30 pt-4">
        <LabButton tone="ink" disabled={!canFinish} onClick={finish}>
          See my result
        </LabButton>
        <LabButton tone="plain" onClick={reset} disabled={!trials.length}>
          <RotateCcw className="size-4" aria-hidden /> Start over
        </LabButton>
      </div>
    </Panel>
  );
}

function Cue({ on, label, icon }: { on: boolean; label: string; icon: React.ReactNode }) {
  return (
    <span className={cn("flex size-14 flex-col items-center justify-center rounded-xl border-2 border-foreground text-[11px] font-bold", on ? "bg-primary text-primary-foreground hard-shadow-sm" : "bg-card text-muted-foreground")}>
      {icon}
      {label}
      <span className="sr-only">{on ? " (this trial)" : " (not this trial)"}</span>
    </span>
  );
}

function ConditioningChart({ trials, rests }: { trials: Trial[]; rests: number[] }) {
  return (
    <LineChart
      ariaLabel={`Response to the bell over ${trials.length} trials`}
      series={[{ name: "Response to the bell", values: trials.map((t) => t.v) }]}
      max={100}
      marks={rests.filter((r) => r < trials.length)}
      labels={trials.map((t, i) => (i === 0 || (i + 1) % 5 === 0 ? String(i + 1) : ""))}
      yLabel="response to the bell (model, 0 to 100)"
      xLabel={`trials${rests.length ? "; tick = a day's rest" : ""}`}
    />
  );
}
