"use client";

import * as React from "react";
import { useReducedMotion } from "@/lib/motion";
import { BIAS_CASES, BIASES } from "@/lib/lab/experiments";
import { simulateSchedule, type Schedule } from "@/lib/lab/scoring";
import { cn } from "@/lib/utils";
import { Bars, LabButton, LineChart, Panel, RoundBar, type RunnerProps } from "../lab-ui";

/* ------------------------------------------------------------------ */
/* Reinforcement schedules                                             */
/* ------------------------------------------------------------------ */

const OPTIONS: { id: string; label: string; plain: string; schedule: Schedule; value: number }[] = [
  { id: "crf", label: "Every time", plain: "A reward for every press", schedule: "FR", value: 1 },
  { id: "fr", label: "Fixed ratio 10", plain: "A reward every 10th press", schedule: "FR", value: 10 },
  { id: "vr", label: "Variable ratio 10", plain: "A reward after about 10 presses, never the same", schedule: "VR", value: 10 },
  { id: "fi", label: "Fixed interval 15s", plain: "The first press after 15 seconds", schedule: "FI", value: 15 },
  { id: "vi", label: "Variable interval 15s", plain: "The first press after about 15 seconds, never the same", schedule: "VI", value: 15 },
];

const SECONDS = 90;
const EXT_SECONDS = 60;

type Run = { id: string; total: number; rewards: number; ext: number | null };

export function SchedulesRunner({ onDone }: RunnerProps) {
  const reduce = useReducedMotion();
  const [pick, setPick] = React.useState(OPTIONS[2].id);
  const [shown, setShown] = React.useState(0);
  const [data, setData] = React.useState<{ cumulative: number[]; rewards: number[]; ext?: number[] } | null>(null);
  const [runs, setRuns] = React.useState<Run[]>([]);
  const opt = OPTIONS.find((o) => o.id === pick)!;
  const frame = React.useRef<number | null>(null);

  React.useEffect(() => () => (frame.current ? cancelAnimationFrame(frame.current) : undefined), []);

  function animate(from: number, to: number) {
    if (frame.current) cancelAnimationFrame(frame.current);
    if (reduce !== false) return setShown(to);
    const start = performance.now();
    const dur = 2500 * ((to - from) / SECONDS);
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setShown(Math.round(from + p * (to - from)));
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }

  function run() {
    const sim = simulateSchedule({ schedule: opt.schedule, value: opt.value, seconds: SECONDS, seed: runs.length + 3 });
    setData({ cumulative: sim.cumulative, rewards: sim.rewards });
    setRuns((r) => [...r.filter((x) => x.id !== opt.id), { id: opt.id, total: sim.total, rewards: sim.rewards.length, ext: null }]);
    setShown(0);
    animate(0, SECONDS);
  }

  function extinguish() {
    if (!data) return;
    const history = opt.id === "crf" ? "continuous" : "intermittent";
    const ext = simulateSchedule({ schedule: "EXT", value: 1, seconds: EXT_SECONDS, history, seed: 11 });
    const base = data.cumulative[data.cumulative.length - 1];
    setData({ ...data, ext: ext.cumulative.map((c) => c + base) });
    setRuns((r) => r.map((x) => (x.id === opt.id ? { ...x, ext: ext.total } : x)));
    setShown(SECONDS);
    animate(SECONDS, SECONDS + EXT_SECONDS);
  }

  const doneWithExt = runs.filter((r) => r.ext !== null);
  const canFinish = doneWithExt.length >= 2 && doneWithExt.some((r) => r.id === "crf");

  function finish() {
    const crf = runs.find((r) => r.id === "crf");
    const best = [...doneWithExt].sort((a, b) => (b.ext ?? 0) - (a.ext ?? 0))[0];
    const label = (id: string) => OPTIONS.find((o) => o.id === id)!.label;
    onDone({
      numbers: { tried: runs.length, crfExtinction: crf?.ext ?? 0, mostStubborn: best?.ext ?? 0 },
      verdict: `After rewards stopped, "${label(best.id)}" kept going longest (${best.ext} presses) and "Every time" stopped soonest (${crf?.ext ?? 0}). Unpredictable rewards make it hard to notice they have stopped.`,
      view: (
        <Bars
          ariaLabel="Presses after rewards stopped"
          items={doneWithExt.map((r) => ({ label: label(r.id), value: r.ext ?? 0, highlight: r.id === best.id }))}
        />
      ),
    });
  }

  const series = data
    ? [
        { name: "Presses (total)", values: [...data.cumulative, ...(data.ext ?? [])].slice(0, Math.max(2, shown)) },
      ]
    : [];

  return (
    <Panel className="space-y-5">
      <fieldset className="space-y-2">
        <legend className="font-semibold">Pick a reward rule</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {OPTIONS.map((o) => {
            const r = runs.find((x) => x.id === o.id);
            return (
              <label key={o.id} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border-2 border-foreground p-3", pick === o.id ? "bg-primary text-primary-foreground" : "bg-background")}>
                <input type="radio" name="schedule" value={o.id} checked={pick === o.id} onChange={() => setPick(o.id)} className="mt-1 accent-[var(--foreground)]" />
                <span className="min-w-0">
                  <span className="block font-bold">{o.label}</span>
                  <span className="block text-sm">{o.plain}</span>
                  {r && <span className="mt-1 block text-xs font-semibold">Tried{r.ext !== null ? " · stopped rewards" : ""}</span>}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-2">
        <LabButton onClick={run}>Run {SECONDS} seconds</LabButton>
        <LabButton tone="plain" onClick={extinguish} disabled={!data || !!data.ext}>
          Stop the rewards
        </LabButton>
      </div>

      {data && (
        <div className="rounded-xl border-2 border-foreground bg-background p-3">
          <LineChart
            ariaLabel={`Cumulative presses under ${opt.label}${data.ext ? ", then with rewards stopped" : ""}`}
            series={series}
            marks={data.rewards.map((t) => t - 1).filter((t) => t < shown)}
            yLabel="total presses so far"
            xLabel={`seconds${data.ext ? " (rewards stop at 90)" : ""}; ticks = rewards`}
          />
          <p className="mt-2 text-sm">
            A steep line means fast pressing. A flat line means a pause. {opt.schedule === "FI" && "Look for the pause after each reward and the speed-up before the next."}
          </p>
        </div>
      )}

      <div className="rounded-xl border-2 border-dashed border-foreground/50 p-3 text-sm">
        To finish: run <b>Every time</b> and at least one other rule, and press <b>Stop the rewards</b> after each.
        <div className="mt-3">
          <LabButton tone="ink" disabled={!canFinish} onClick={finish}>
            Compare what lasted
          </LabButton>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Bias spotter                                                        */
/* ------------------------------------------------------------------ */

export function BiasSpotterRunner({ onDone }: RunnerProps) {
  const [i, setI] = React.useState(0);
  const [bias, setBias] = React.useState<string | null>(null);
  const [fix, setFix] = React.useState<number | null>(null);
  const score = React.useRef({ bias: 0, fix: 0, missed: {} as Record<string, number> });
  const c = BIAS_CASES[i];

  function pickBias(b: string) {
    if (bias) return;
    setBias(b);
    if (b === c.bias) score.current.bias++;
    else score.current.missed[c.bias] = (score.current.missed[c.bias] ?? 0) + 1;
  }
  function pickFix(k: number) {
    if (fix !== null) return;
    setFix(k);
    if (k === c.fix) score.current.fix++;
  }
  function next() {
    if (i + 1 >= BIAS_CASES.length) {
      const { bias: b, fix: f, missed } = score.current;
      const worst = Object.entries(missed).sort((a, z) => z[1] - a[1])[0]?.[0];
      onDone({
        numbers: { biasRight: b, fixRight: f, of: BIAS_CASES.length },
        verdict: `You named ${b} of ${BIAS_CASES.length} traps and chose ${f} of ${BIAS_CASES.length} fixes.${worst ? ` The one to watch: ${worst.toLowerCase()}.` : " A clean round."} Naming a trap is easier in a quiz than in a busy clinic, which is why habits matter more than knowledge.`,
        view: (
          <Bars
            ariaLabel="Your score"
            items={[
              { label: "Traps named", value: b, highlight: true },
              { label: "Fixes chosen", value: f },
            ]}
          />
        ),
      });
      return;
    }
    setI(i + 1);
    setBias(null);
    setFix(null);
  }

  return (
    <Panel className="space-y-5">
      <RoundBar at={i + 1} of={BIAS_CASES.length} label="Case" />
      <blockquote className="rounded-xl border-2 border-foreground bg-background p-4 text-lg leading-relaxed">{c.text}</blockquote>

      <fieldset className="space-y-2">
        <legend className="font-semibold">1 · Which thinking trap?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {BIASES.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => pickBias(b)}
              aria-pressed={bias === b}
              disabled={!!bias && bias !== b && b !== c.bias}
              className={cn(
                "min-h-11 rounded-xl border-2 border-foreground px-3 py-2 text-left text-sm font-bold transition-transform active:translate-y-px",
                !bias && "bg-card hover:-translate-y-0.5",
                bias && b === c.bias && "bg-primary text-primary-foreground",
                bias && b === bias && b !== c.bias && "bg-foreground text-background line-through",
                bias && b !== bias && b !== c.bias && "opacity-40",
              )}
            >
              {b}
            </button>
          ))}
        </div>
        {bias && (
          <p className="text-sm" role="status">
            <b>{bias === c.bias ? "Right." : `It was ${c.bias.toLowerCase()}.`}</b> {c.why}
          </p>
        )}
      </fieldset>

      {bias && (
        <fieldset className="space-y-2">
          <legend className="font-semibold">2 · What would have prevented it?</legend>
          <div className="grid gap-2">
            {c.fixes.map((f, k) => (
              <button
                key={f}
                type="button"
                onClick={() => pickFix(k)}
                aria-pressed={fix === k}
                className={cn(
                  "min-h-11 rounded-xl border-2 border-foreground px-3 py-2 text-left text-sm font-semibold",
                  fix === null && "bg-card",
                  fix !== null && k === c.fix && "bg-primary text-primary-foreground",
                  fix === k && k !== c.fix && "bg-foreground text-background",
                  fix !== null && k !== fix && k !== c.fix && "opacity-40",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {fix !== null && (
        <LabButton onClick={next}>{i + 1 >= BIAS_CASES.length ? "See my result" : "Next case"}</LabButton>
      )}
    </Panel>
  );
}
