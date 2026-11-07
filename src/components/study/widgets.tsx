"use client";

import * as React from "react";
import { Check, ChevronRight, Eye, RotateCcw, Sparkles, TriangleAlert, X } from "lucide-react";
import type {
  BuildData,
  DecideData,
  GuessData,
  MoodlineData,
  RevealData,
  SortData,
  SynapseData,
  WidgetData,
  WidgetKind,
  WorkedData,
} from "@/lib/study/types";
import { useExplainView } from "@/components/learn/view-toggle";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";
import { trackLearn } from "@/lib/learn/track";
import { BrainMap, Curve, Flow, Layers } from "./visuals";
import { Journey, Neuron, Pathways, Receptor } from "./animations";
import { Compare, Conditioning, MemoryFlow, StressResponse, Timeline } from "./animations2";
import { Attention, Conservation, Dissonance, Experiment, Illusion } from "./animations3";
import { Hypnogram, Release, Strange, ThoughtRecord } from "./animations4";
import { NervousSystem } from "./scenes/nervous-system";
import { BrainExplorer } from "./scenes/brain-explorer";
import { ActionPotential } from "./scenes/action-potential";
import { SynapseScene } from "./scenes/synapse-scene";
import type { Synapse3dData, ActionPotentialData, BrainExplorerData, NervousSystemData } from "@/lib/study/types";
import type { AttentionData, ConservationData, DissonanceData, ExperimentData, HypnogramData, IllusionData, ReleaseData, StrangeData, ThoughtRecordData } from "@/lib/study/types";
import type { CompareData, ConditioningData, MemoryFlowData, StressData, TimelineData } from "@/lib/study/types";
import type { JourneyData, NeuronData, PathwaysData, ReceptorData } from "@/lib/study/types";
import type { BrainMapData, CurveData, FlowData, LayersData } from "@/lib/study/types";

/**
 * Interactive pieces inside module text. Every one makes the student commit
 * first (guess, choose, tick, sort) and only then shows why. That's
 * retrieval practice with explained feedback, not decoration. Colour is never
 * the only cue: every verdict has an icon and a word.
 */

const card = "rounded-2xl border-2 border-foreground bg-card p-4 sm:p-5 shadow-[var(--shadow-hard-sm)]";
const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-foreground px-4 font-semibold transition-[transform,background-color] duration-fast active:translate-x-px active:translate-y-px";
const label = "flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-link";

function Verdict({ kind, children }: { kind: "good" | "ok" | "bad"; children: React.ReactNode }) {
  const map = {
    good: { cls: "bg-status-success-bg text-status-success-fg border-status-success-fg", Icon: Check, word: "Good call" },
    ok: { cls: "bg-status-pending-bg text-status-pending-fg border-foreground/40", Icon: ChevronRight, word: "Not wrong, but not best" },
    bad: { cls: "bg-status-alert-bg text-status-alert-fg border-status-alert-fg", Icon: TriangleAlert, word: "This causes harm" },
  }[kind];
  return (
    <div className={cn("vibha-pop mt-3 rounded-xl border-2 p-3 text-[0.95rem] leading-snug", map.cls)} role="status">
      <p className="flex items-center gap-1.5 font-bold">
        <map.Icon className="size-4" aria-hidden /> {map.word}
      </p>
      <div className="mt-1 text-foreground">{children}</div>
    </div>
  );
}

/** Stable order that isn't the authored order (no Math.random during render). */
function scramble<T>(arr: T[], seed: string): number[] {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return arr
    .map((_, i) => i)
    .sort((a, b) => (((a + 1) * (h | 1)) % 97) - (((b + 1) * (h | 1)) % 97));
}

/* ---------------------------------------------------------------- guess */
function Guess({ d }: { d: GuessData }) {
  const view = useExplainView();
  const mid = Math.round((d.min + d.max) / 2);
  const [v, setV] = React.useState(mid);
  const [locked, setLocked] = React.useState(false);
  const inRange = v >= d.answer[0] && v <= d.answer[1];
  const span = d.max - d.min || 1;
  const pct = (n: number) => ((n - d.min) / span) * 100;
  return (
    <div className={card}>
      <p className={label}><Sparkles className="size-3.5" aria-hidden /> Guess first</p>
      <p className="mt-2 text-lg font-semibold leading-snug"><Rich text={d.prompt} /></p>
      <div className="relative mt-6 pb-2">
        {locked ? (
          <span
            className="absolute top-[-0.4rem] h-6 rounded-md bg-brand/25 ring-2 ring-brand"
            style={{ left: `${pct(d.answer[0])}%`, width: `${Math.max(2, pct(d.answer[1]) - pct(d.answer[0]))}%` }}
            aria-hidden
          />
        ) : null}
        <input
          type="range"
          min={d.min}
          max={d.max}
          step={d.step ?? 1}
          value={v}
          disabled={locked}
          onChange={(e) => setV(Number(e.target.value))}
          aria-label="Your guess"
          className="relative w-full accent-[var(--brand)]"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>{d.min} {d.unit}</span>
          <span>{d.max} {d.unit}</span>
        </div>
      </div>
      <p className="mt-1 text-center text-2xl font-black tabular-nums">
        {v} <span className="text-base font-semibold">{d.unit}</span>
      </p>
      {!locked ? (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            className={cn(btn, "bg-primary text-primary-foreground")}
            onClick={() => {
              setLocked(true);
              trackLearn({ type: "widget", kind: "guess", ok: inRange, prompt: d.prompt });
            }}
          >
            Lock in my guess
          </button>
        </div>
      ) : (
        <Verdict kind={inRange ? "good" : "ok"}>
          <p className="font-semibold">
            {inRange ? "Right in the zone." : "Outside the usual range."} The highlighted band shows it: about {d.answer[0]} to {d.answer[1]} {d.unit}.
          </p>
          <p className="mt-1"><Rich text={view === "clinician" && d.clinician ? d.clinician : d.reveal} /></p>
        </Verdict>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- decide */
function Decide({ d }: { d: DecideData }) {
  const [pick, setPick] = React.useState<number | null>(null);
  const [tried, setTried] = React.useState<number[]>([]);
  const c = pick === null ? null : d.choices[pick];
  return (
    <div className={card}>
      <p className={label}>Your call</p>
      <div className="mt-2 rounded-xl bg-muted p-3 text-[0.98rem] leading-relaxed"><Rich text={d.scene} /></div>
      <p className="mt-3 font-semibold"><Rich text={d.ask} /></p>
      <div className="mt-3 grid gap-2">
        {d.choices.map((ch, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={pick === i}
            onClick={() => {
              if (!tried.length) trackLearn({ type: "widget", kind: "decide", ok: ch.verdict === "best", prompt: d.ask });
              setPick(i);
              setTried((t) => (t.includes(i) ? t : [...t, i]));
            }}
            className={cn(
              "flex min-h-11 items-start gap-2 rounded-md border-2 px-3 py-2.5 text-left transition-colors",
              pick === i ? "border-foreground bg-brand text-brand-foreground" : "border-foreground/30 hover:border-foreground",
            )}
          >
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 border-current text-[0.65rem] font-bold">
              {tried.includes(i) ? (ch.verdict === "best" ? <Check className="size-3" /> : ch.verdict === "harm" ? <X className="size-3" /> : "~") : String.fromCharCode(65 + i)}
            </span>
            <span><Rich text={ch.label} /></span>
          </button>
        ))}
      </div>
      {c ? (
        <Verdict kind={c.verdict === "best" ? "good" : c.verdict === "ok" ? "ok" : "bad"}>
          <p><span className="font-semibold">What happens: </span><Rich text={c.outcome} /></p>
          <p className="mt-1"><span className="font-semibold">Why: </span><Rich text={c.why} /></p>
          {c.verdict !== "best" ? <p className="mt-1.5 text-sm text-muted-foreground">Try another option to see what changes.</p> : null}
        </Verdict>
      ) : null}
    </div>
  );
}

/* ----------------------------------------------------------------- sort */
function Sort({ d }: { d: SortData }) {
  const order = React.useMemo(() => scramble(d.items, d.prompt), [d.items, d.prompt]);
  const [placed, setPlaced] = React.useState<Record<number, number>>({});
  const [held, setHeld] = React.useState<number | null>(null);
  const [checked, setChecked] = React.useState(false);
  const allPlaced = Object.keys(placed).length === d.items.length;
  const right = d.items.filter((it, i) => placed[i] === it.bucket).length;

  const place = (b: number) => {
    if (held === null || checked) return;
    setPlaced((p) => ({ ...p, [held]: b }));
    setHeld(null);
  };

  return (
    <div className={card}>
      <p className={label}>Sort it</p>
      <p className="mt-2 font-semibold"><Rich text={d.prompt} /></p>
      <p className="mt-1 text-sm text-muted-foreground">Tap a card, then tap where it belongs.</p>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Cards to sort">
        {order.filter((i) => placed[i] === undefined).map((i) => (
          <button
            key={i}
            type="button"
            aria-pressed={held === i}
            onClick={() => setHeld(held === i ? null : i)}
            className={cn("min-h-11 rounded-md border-2 px-3 py-2 text-left text-[0.95rem] transition-transform duration-fast", held === i ? "-translate-y-0.5 border-foreground bg-primary text-primary-foreground shadow-[var(--shadow-hard-xs)]" : "border-foreground bg-card")}
          >
            <Rich text={d.items[i].text} />
          </button>
        ))}
        {allPlaced ? <p className="text-sm text-muted-foreground">All cards placed.</p> : null}
      </div>
      <div className={cn("mt-4 grid gap-3", d.buckets.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
        {d.buckets.map((b, bi) => (
          <div
            key={bi}
            role="button"
            tabIndex={0}
            onClick={() => place(bi)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && place(bi)}
            className={cn("min-h-28 rounded-xl border-2 border-dashed p-3 transition-colors", held !== null ? "border-foreground bg-muted" : "border-foreground/40")}
            aria-label={`Put in ${b}`}
          >
            <p className="text-sm font-bold"><Rich text={b} /></p>
            <ul className="mt-2 space-y-1.5">
              {d.items.map((it, i) =>
                placed[i] === bi ? (
                  <li key={i}>
                    <button
                      type="button"
                      disabled={checked}
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlaced((p) => {
                          const n = { ...p };
                          delete n[i];
                          return n;
                        });
                      }}
                      className={cn(
                        "flex w-full items-start gap-1.5 rounded-md border-2 px-2 py-1.5 text-left text-sm",
                        !checked ? "border-foreground/30 bg-card" : it.bucket === bi ? "border-status-success-fg bg-status-success-bg" : "border-status-alert-fg bg-status-alert-bg",
                      )}
                    >
                      {checked ? it.bucket === bi ? <Check className="mt-0.5 size-3.5 shrink-0" aria-label="right" /> : <X className="mt-0.5 size-3.5 shrink-0" aria-label="wrong" /> : null}
                      <span>
                        <Rich text={it.text} />
                        {checked && it.bucket !== bi ? <span className="block text-xs">Belongs in: <Rich text={d.buckets[it.bucket]} />{it.why ? <> · <Rich text={it.why} /></> : null}</span> : null}
                      </span>
                    </button>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!checked ? (
          <button
            type="button"
            disabled={!allPlaced}
            onClick={() => {
              setChecked(true);
              trackLearn({ type: "widget", kind: "sort", ok: right === d.items.length, score: right / d.items.length, prompt: d.prompt });
            }}
            className={cn(btn, "bg-foreground text-background disabled:opacity-40")}
          >
            Check
          </button>
        ) : (
          <>
            <p className="font-bold tabular-nums" role="status">{right} of {d.items.length} right</p>
            <button type="button" onClick={() => { setPlaced({}); setChecked(false); }} className={cn(btn, "bg-card")}>
              <RotateCcw className="size-4" aria-hidden /> Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- build */
function Build({ d }: { d: BuildData }) {
  const [ticks, setTicks] = React.useState<Record<number, boolean>>({});
  const [checked, setChecked] = React.useState(false);
  const chosen = d.symptoms.map((_, i) => Boolean(ticks[i]));
  const count = chosen.filter(Boolean).length;
  const hasCore = d.symptoms.some((s, i) => chosen[i] && s.core);
  const meets = count >= d.need && (!d.needCore || hasCore);
  const wrongTicks = d.symptoms.filter((s, i) => chosen[i] !== s.present).length;

  return (
    <div className={card}>
      <p className={label}>Build the diagnosis</p>
      <div className="mt-2 rounded-xl bg-muted p-3 text-[0.98rem] leading-relaxed"><Rich text={d.vignette} /></div>
      <p className="mt-3 text-sm"><span className="font-semibold">Rule: </span><Rich text={d.rule} /></p>
      <div className="top-2 z-10 mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border-2 border-foreground bg-card px-3 py-2 tall:sticky md:top-[calc(var(--top-h)+0.5rem)]">
        <div className="flex gap-1" aria-hidden>
          {Array.from({ length: Math.max(d.need, count) }, (_, i) => (
            <span key={i} className={cn("size-3.5 rounded-full border-2 border-foreground transition-colors duration-base", i < count ? "bg-brand" : "bg-card")} />
          ))}
        </div>
        <span className="min-w-0 text-sm font-semibold tabular-nums">{count} ticked · need {d.need}{d.needCore ? " incl. a core symptom" : ""}</span>
        <span className={cn("ml-auto text-sm font-bold", meets ? "text-foreground" : "text-muted-foreground")}>{meets ? "Threshold met" : "Not yet"}</span>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {d.symptoms.map((s, i) => {
          const wrong = checked && chosen[i] !== s.present;
          return (
            <li key={i}>
              <label className={cn("flex min-h-11 cursor-pointer items-start gap-2 rounded-md border-2 px-3 py-2", wrong ? "border-status-alert-fg bg-status-alert-bg" : checked && s.present ? "border-status-success-fg bg-status-success-bg" : chosen[i] ? "border-foreground bg-primary/30" : "border-foreground/30")}>
                <input type="checkbox" className="mt-1 size-4 accent-[var(--brand)]" checked={chosen[i]} disabled={checked} onChange={(e) => setTicks((t) => ({ ...t, [i]: e.target.checked }))} />
                <span className="text-[0.95rem] leading-snug">
                  <Rich text={s.label} />
                  {s.core ? <span className="ml-1.5 rounded-full border border-foreground px-1.5 text-[0.65rem] font-bold uppercase">core</span> : null}
                  {checked && (wrong || s.why) ? (
                    <span className="mt-0.5 block text-xs">
                      {wrong ? (s.present ? "It's in the story: " : "Not in the story: ") : ""}
                      {s.why ? <Rich text={s.why} /> : null}
                    </span>
                  ) : null}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!checked ? (
          <button type="button" onClick={() => { setChecked(true); trackLearn({ type: "widget", kind: "build", ok: wrongTicks === 0, score: 1 - wrongTicks / d.symptoms.length, prompt: d.rule }); }} className={cn(btn, "bg-foreground text-background")}>
            Check my picks
          </button>
        ) : (
          <button type="button" onClick={() => { setTicks({}); setChecked(false); }} className={cn(btn, "bg-card")}>
            <RotateCcw className="size-4" aria-hidden /> Again
          </button>
        )}
      </div>
      {checked ? (
        <Verdict kind={wrongTicks === 0 ? "good" : "ok"}>
          <p className="font-semibold">{wrongTicks === 0 ? "Every pick right." : `${wrongTicks} pick${wrongTicks === 1 ? "" : "s"} to fix (marked).`}</p>
          <p className="mt-1"><Rich text={d.verdict} /></p>
        </Verdict>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------- moodline */
function Moodline({ d }: { d: MoodlineData }) {
  const [pick, setPick] = React.useState<number | null>(null);
  const w = 320;
  const h = 150;
  const n = d.series.length;
  const x = (i: number) => 16 + (i * (w - 32)) / Math.max(1, n - 1);
  const y = (v: number) => h / 2 - (v * (h / 2 - 12)) / 3;
  const pts = d.series.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <div className={card}>
      <p className={label}>Read the mood line</p>
      <p className="mt-2 font-semibold"><Rich text={d.prompt} /></p>
      <figure className="mt-3">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`Mood over time: ${d.series.join(", ")} (−3 very low to +3 very high)`}>
          <rect x="0" y={y(3)} width={w} height={y(2) - y(3)} className="fill-[var(--status-alert-bg)]" />
          <rect x="0" y={y(2)} width={w} height={y(1) - y(2)} className="fill-[var(--muted)]" />
          <rect x="0" y={y(-2)} width={w} height={y(-3) - y(-2)} className="fill-[var(--status-info-bg)]" />
          <line x1="0" x2={w} y1={y(0)} y2={y(0)} className="stroke-foreground/30" strokeDasharray="4 4" />
          <text x="4" y={y(2.55)} className="fill-foreground text-[9px] font-semibold">mania zone</text>
          <text x="4" y={y(1.55)} className="fill-foreground text-[9px]">hypomania</text>
          <text x="4" y={y(0) - 3} className="fill-muted-foreground text-[9px]">usual self</text>
          <text x="4" y={y(-2.6)} className="fill-foreground text-[9px] font-semibold">major depression</text>
          <polyline points={pts} fill="none" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" className="vibha-draw stroke-[var(--brand)]" pathLength={1} />
          {d.series.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r="3" className="fill-foreground" />
          ))}
        </svg>
        {d.labels ? <figcaption className="mt-1 flex justify-between text-[0.7rem] text-muted-foreground">{d.labels.map((l) => <span key={l}>{l}</span>)}</figcaption> : null}
      </figure>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {d.options.map((o, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={pick === i}
            onClick={() => { if (pick === null) trackLearn({ type: "widget", kind: "moodline", ok: i === d.answer, prompt: d.prompt }); setPick(i); }}
            className={cn("min-h-11 rounded-md border-2 px-3 py-2 text-left", pick === null ? "border-foreground/30 hover:border-foreground" : i === d.answer ? "border-status-success-fg bg-status-success-bg" : pick === i ? "border-status-alert-fg bg-status-alert-bg" : "border-foreground/20 opacity-60")}
          >
            {pick !== null && i === d.answer ? <Check className="mr-1 inline size-4" aria-label="answer" /> : pick === i ? <X className="mr-1 inline size-4" aria-label="your pick" /> : null}
            <Rich text={o} />
          </button>
        ))}
      </div>
      {pick !== null ? <Verdict kind={pick === d.answer ? "good" : "ok"}><Rich text={d.why} /></Verdict> : null}
    </div>
  );
}

/* --------------------------------------------------------------- worked */
function Worked({ d }: { d: WorkedData }) {
  const [shown, setShown] = React.useState(0);
  const [mine, setMine] = React.useState<Record<number, string>>({});
  const [open, setOpen] = React.useState<Record<number, boolean>>({});
  return (
    <div className={card}>
      <p className={label}>Worked example → your turn</p>
      <p className="mt-2 text-lg font-semibold"><Rich text={d.title} /></p>
      <ol className="mt-3 space-y-2">
        {d.steps.map((s, i) => (
          <li key={i} className="rounded-xl border-2 border-foreground/20 p-3">
            <p className="font-semibold"><span className="mr-1.5 text-link tabular-nums">{i + 1}.</span><Rich text={s.q} /></p>
            {i < shown ? <p className="vibha-pop mt-1.5 text-[0.95rem]"><Rich text={s.a} /></p> : null}
            {i === shown ? (
              <button type="button" onClick={() => setShown(shown + 1)} className={cn(btn, "mt-2 min-h-10 bg-card text-sm")}>
                <Eye className="size-4" aria-hidden /> Think, then show
              </button>
            ) : null}
          </li>
        ))}
      </ol>
      {shown >= d.steps.length && d.yourTurn?.length ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-bold">Your turn: same steps, no help</p>
          {d.yourTurn.map((t, i) => (
            <div key={i} className="rounded-xl border-2 border-foreground p-3">
              <p className="font-semibold"><Rich text={t.q} /></p>
              <textarea value={mine[i] ?? ""} onChange={(e) => setMine({ ...mine, [i]: e.target.value })} rows={2} className="mt-2 w-full rounded-md border-2 border-foreground/40 bg-background p-2 text-[0.95rem]" placeholder="Write your answer…" />
              {open[i] ? (
                <p className="vibha-pop mt-2 rounded-md bg-muted p-2 text-[0.95rem]"><span className="font-semibold">Model answer: </span><Rich text={t.a} /></p>
              ) : (
                <button type="button" disabled={!mine[i]?.trim()} onClick={() => { setOpen({ ...open, [i]: true }); trackLearn({ type: "widget", kind: "worked", ok: true, prompt: t.q }); }} className={cn(btn, "mt-2 min-h-10 bg-foreground text-sm text-background disabled:opacity-40")}>
                  Compare with model answer
                </button>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------- synapse */
const DRUG_TEXT: Record<SynapseData["drug"], { name: string; blocks: string }> = {
  ssri: { name: "SSRI", blocks: "blocks the serotonin recycling pump" },
  snri: { name: "SNRI", blocks: "blocks the serotonin and noradrenaline pumps" },
  maoi: { name: "MAOI", blocks: "stops the enzyme that breaks serotonin down" },
  none: { name: "No medicine", blocks: "" },
};

function Synapse({ d }: { d: SynapseData }) {
  const [on, setOn] = React.useState(false);
  const [stage, setStage] = React.useState(0); // 0 = start, 1 = later: receptors adapt, 2 = later still: rewiring
  const drug = DRUG_TEXT[d.drug];
  const inGap = on ? 9 : 4;
  const receptors = on && stage >= 1 ? 3 : 5;
  const dots = Array.from({ length: inGap }, (_, i) => i);
  return (
    <div className={card}>
      <p className={label}>See it move</p>
      <svg viewBox="0 0 320 190" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`Synapse: ${inGap} serotonin molecules in the gap, ${receptors} receptors on the receiving neuron${on ? `, ${drug.name} on` : ""}`}>
        <path d="M40 0 h240 v40 q-120 40 -240 0 z" className="fill-[var(--status-info-bg)] stroke-foreground" strokeWidth="2" />
        <text x="160" y="22" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">sending neuron</text>
        <rect x="236" y="34" width="26" height="16" rx="4" className={cn("stroke-foreground", on && d.drug !== "maoi" ? "fill-[var(--status-alert-bg)]" : "fill-card")} strokeWidth="2" />
        <text x="249" y="60" textAnchor="middle" className="fill-foreground text-[8px]">{on && d.drug !== "maoi" ? "pump blocked" : "recycling pump"}</text>
        {on && d.drug !== "maoi" ? <line x1="232" y1="32" x2="266" y2="52" className="stroke-foreground" strokeWidth="3" /> : null}
        <path d="M20 190 v-50 q140 -30 280 0 v50 z" className="fill-[var(--muted)] stroke-foreground" strokeWidth="2" />
        <text x="160" y="180" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">receiving neuron</text>
        {Array.from({ length: receptors }, (_, i) => (
          <rect key={i} x={70 + i * (180 / Math.max(1, receptors - 1 || 1))} y={136 - (i % 2) * 2} width="14" height="10" rx="3" className="fill-[var(--brand)] stroke-foreground transition-all duration-slow" strokeWidth="1.5" />
        ))}
        {dots.map((i) => (
          <circle key={i} r="4.5" className="vibha-float-dot fill-foreground" style={{ ["--dx" as string]: `${60 + ((i * 37) % 200)}px`, ["--dl" as string]: `${(i * 0.37) % 2.4}s` }} cx="0" cy="0" />
        ))}
        {!on || d.drug === "maoi" ? <path d="M150 95 q60 -30 95 -50" fill="none" className="vibha-dash stroke-foreground/60" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arr)" /> : null}
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-foreground" />
          </marker>
        </defs>
      </svg>
      <div className="mt-3 flex flex-wrap gap-2">
        {d.drug !== "none" ? (
          <button type="button" onClick={() => { setOn(!on); setStage(0); }} aria-pressed={on} className={cn(btn, on ? "bg-foreground text-background" : "bg-primary text-primary-foreground")}>
            {on ? `Remove ${drug.name}` : `Add ${drug.name}`}
          </button>
        ) : null}
        {on ? (
          <button type="button" onClick={() => setStage(Math.min(2, stage + 1))} disabled={stage >= 2} className={cn(btn, "bg-card disabled:opacity-40")}>
            Let time pass →
          </button>
        ) : null}
      </div>
      <p className="mt-3 text-[0.95rem] leading-snug" role="status">
        {!on
          ? "Serotonin is released into the gap, some reaches receptors, and the pump recycles the rest."
          : stage === 0
            ? `The ${drug.name} ${drug.blocks}. Within hours, more serotonin sits in the gap. But mood hasn't changed yet. Side effects like nausea can already appear. Why the delay?`
            : stage === 1
              ? "The receiving neuron adapts: it slowly reduces some receptors (downregulation). Side effects often fade around now."
              : "Later still, the brain rebuilds connections (neuroplasticity, helped by BDNF). This is when mood usually starts to lift, which is why the dose must be given time before judging it."}
      </p>
      <p className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></p>
    </div>
  );
}

/* --------------------------------------------------------------- reveal */
function Reveal({ d }: { d: RevealData }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="rounded-2xl border-2 border-dashed border-foreground bg-card p-4">
      <p className="font-semibold"><Rich text={d.prompt} /></p>
      {open ? (
        <p className="vibha-pop mt-2 text-[0.95rem]"><Rich text={d.answer} /></p>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={cn(btn, "mt-2 min-h-10 bg-card text-sm")}>
          <Eye className="size-4" aria-hidden /> Think first, then reveal
        </button>
      )}
    </div>
  );
}

export function Widget({ kind, data }: { kind: WidgetKind; data: WidgetData }) {
  switch (kind) {
    case "guess":
      return <Guess d={data as GuessData} />;
    case "decide":
      return <Decide d={data as DecideData} />;
    case "sort":
      return <Sort d={data as SortData} />;
    case "build":
      return <Build d={data as BuildData} />;
    case "moodline":
      return <Moodline d={data as MoodlineData} />;
    case "worked":
      return <Worked d={data as WorkedData} />;
    case "synapse":
      return <Synapse d={data as SynapseData} />;
    case "reveal":
      return <Reveal d={data as RevealData} />;
    case "flow":
      return <Flow d={data as FlowData} />;
    case "curve":
      return <Curve d={data as CurveData} />;
    case "layers":
      return <Layers d={data as LayersData} />;
    case "brainmap":
      return <BrainMap d={data as BrainMapData} />;
    case "journey":
      return <Journey d={data as JourneyData} />;
    case "neuron":
      return <Neuron d={data as NeuronData} />;
    case "pathways":
      return <Pathways d={data as PathwaysData} />;
    case "receptor":
      return <Receptor d={data as ReceptorData} />;
    case "conditioning":
      return <Conditioning d={data as ConditioningData} />;
    case "memoryflow":
      return <MemoryFlow d={data as MemoryFlowData} />;
    case "stress":
      return <StressResponse d={data as StressData} />;
    case "timeline":
      return <Timeline d={data as TimelineData} />;
    case "compare":
      return <Compare d={data as CompareData} />;
    case "attention":
      return <Attention d={data as AttentionData} />;
    case "dissonance":
      return <Dissonance d={data as DissonanceData} />;
    case "conservation":
      return <Conservation d={data as ConservationData} />;
    case "experiment":
      return <Experiment d={data as ExperimentData} />;
    case "release":
      return <Release d={data as ReleaseData} />;
    case "thoughtrecord":
      return <ThoughtRecord d={data as ThoughtRecordData} />;
    case "hypnogram":
      return <Hypnogram d={data as HypnogramData} />;
    case "strange":
      return <Strange d={data as StrangeData} />;
    case "illusion":
      return <Illusion d={data as IllusionData} />;
    case "nervoussystem":
      return <NervousSystem d={data as NervousSystemData} />;
    case "brainexplorer":
      return <BrainExplorer d={data as BrainExplorerData} />;
    case "actionpotential":
      return <ActionPotential d={data as ActionPotentialData} />;
    case "synapse3d":
      return <SynapseScene d={data as Synapse3dData} />;
  }
}

/** Content that shows only in one reading view. */
export function ViewOnly({ view, children }: { view: "student" | "clinician"; children: React.ReactNode }) {
  const v = useExplainView();
  if (v !== view) return null;
  return (
    <div className={cn("rounded-2xl border-2 p-4", view === "clinician" ? "border-foreground bg-foreground text-background [&_a]:text-primary" : "border-foreground/30 bg-card")}>
      <p className={cn("mb-2 text-xs font-semibold tracking-wide uppercase", view === "clinician" ? "text-primary" : "text-link")}>{view === "clinician" ? "Clinician view" : "In plain words"}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
