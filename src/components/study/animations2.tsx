"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import type { CompareData, ConditioningData, MemoryFlowData, StressData, TimelineData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";
import { trackLearn } from "@/lib/learn/track";
import { StepPicker } from "./pacing";

/**
 * Animated explainers for core psychology processes: classical and operant
 * conditioning, the memory stores and the stress response (every step is
 * listed with its words; tapping one moves the picture), an order-the-events
 * task, and a side-by-side compare. Transform and opacity only, stops under
 * reduce-motion, and every state is written in words.
 */

const card = "rounded-2xl border-2 border-foreground bg-card p-4 sm:p-5 shadow-[var(--shadow-hard-sm)]";
const label = "text-xs font-semibold tracking-wide uppercase text-link";
const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-foreground px-4 font-semibold";

/* --------------------------------------------------------- conditioning */
const CLASSICAL = [
  { id: "before", name: "Before learning", text: "Food (an unconditioned stimulus) makes the dog salivate on its own. The bell means nothing yet: the dog just looks at it." },
  { id: "pair1", name: "Pairing", text: "The bell rings, and right after it the food arrives. Bell, then food. Bell, then food. The brain starts to link them." },
  { id: "pair2", name: "More pairings", text: "After several pairings, salivation begins a little earlier each time, starting when the bell rings rather than when the food arrives." },
  { id: "after", name: "After learning", text: "Now the bell alone brings salivation. The bell has become a conditioned stimulus, and the salivation to it is a conditioned response." },
  { id: "extinction", name: "Extinction", text: "Ring the bell many times with no food, and the response fades. It is not erased: it is held back by new learning, which is why it can return later (spontaneous recovery)." },
];

const OPERANT = [
  { id: "explore", name: "Trying things", text: "The rat moves around the box, sniffing and pressing things by accident. Nothing happens yet." },
  { id: "press", name: "A lucky press", text: "It presses the lever and a food pellet drops. Something good followed the action." },
  { id: "repeat", name: "Pressing more", text: "Presses that are followed by food become more frequent. This is positive reinforcement: adding something pleasant strengthens the behaviour." },
  { id: "schedule", name: "Not every time", text: "Food now arrives only after some presses, at unpredictable moments (a variable ratio). The rat presses faster and harder than before. This is the slot-machine pattern." },
  { id: "extinct", name: "Food stops", text: "No more food. Pressing bursts briefly (an extinction burst), then slowly fades. Behaviour learned on an unpredictable schedule fades the slowest." },
];

export function Conditioning({ d }: { d: ConditioningData }) {
  const classical = d.kind === "classical";
  const steps = classical ? CLASSICAL : OPERANT;
  const [i, setI] = React.useState(0);
  const cur = steps[i];
  const drool = classical ? [0, 0.15, 0.5, 1, 0.2][i] : 0;
  const pressRate = classical ? 0 : [0.1, 0.3, 0.7, 1, 0.25][i];
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : classical ? "Classical conditioning" : "Operant conditioning"}</p>
      <svg viewBox="0 0 320 170" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`${cur.name}: ${cur.text}`}>
        {classical ? (
          <>
            {/* bell */}
            <g key={i} style={{ transformOrigin: "60px 30px", animationIterationCount: 2 }} className={cn(i >= 1 && i <= 4 ? "vibha-swing" : "")}>
              <path d="M48 52 Q 60 10 72 52 Z" className={cn("stroke-foreground", i >= 1 ? "fill-[var(--primary)]" : "fill-card")} strokeWidth="2" />
              <circle cx="60" cy="54" r="4" className="fill-foreground" />
            </g>
            <text x="60" y="72" textAnchor="middle" className="fill-foreground text-[8px] font-semibold">bell</text>
            {/* food */}
            <g style={{ transform: `translateY(${i >= 1 && i <= 3 ? 0 : -40}px)`, opacity: i >= 1 && i <= 3 ? 1 : 0, transition: "transform 700ms var(--ease-out-expo), opacity 500ms" }}>
              <ellipse cx="150" cy="54" rx="22" ry="9" className="fill-[var(--status-alert-bg)] stroke-foreground" strokeWidth="2" />
              <text x="150" y="72" textAnchor="middle" className="fill-foreground text-[8px] font-semibold">food</text>
            </g>
            {/* dog */}
            <ellipse cx="245" cy="110" rx="48" ry="30" className="fill-[var(--muted)] stroke-foreground" strokeWidth="2" />
            <circle cx="210" cy="90" r="20" className="fill-[var(--muted)] stroke-foreground" strokeWidth="2" />
            <circle cx="204" cy="86" r="2.5" className="fill-foreground" />
            <path d="M196 72 l-8 -14 l14 6 Z" className="fill-[var(--muted)] stroke-foreground" strokeWidth="2" />
            {/* drool drops */}
            {[0, 1, 2].map((k) => (
              <circle key={k} cx={200 + k * 6} cy={112 + k * 14} r={3} className="fill-[var(--status-info-fg)] transition-all duration-slow" style={{ opacity: drool > k / 3 ? 0.9 : 0, transform: `translateY(${drool > k / 3 ? 0 : -8}px)` }} />
            ))}
            <text x="245" y="156" textAnchor="middle" className="fill-foreground text-[8px]">salivation: {Math.round(drool * 100)}%</text>
          </>
        ) : (
          <>
            {/* box */}
            <rect x="40" y="30" width="240" height="120" rx="8" className="fill-[var(--muted)] stroke-foreground" strokeWidth="2" />
            <rect x="60" y="80" width="30" height="8" className="fill-foreground" style={{ transform: `rotate(${pressRate > 0.2 ? -8 : 0}deg)`, transformOrigin: "60px 84px", transition: "transform 300ms" }} />
            <text x="75" y="104" textAnchor="middle" className="fill-foreground text-[8px]">lever</text>
            <rect x="60" y="120" width="30" height="18" className="fill-card stroke-foreground" strokeWidth="1.5" />
            <circle cx="75" cy="129" r="4" className="fill-[var(--status-alert-fg)]" style={{ opacity: i >= 1 && i <= 3 ? 1 : 0, transition: "opacity 400ms" }} />
            <text x="75" y="148" textAnchor="middle" className="fill-foreground text-[7px]">food tray</text>
            {/* rat */}
            <g style={{ transform: `translateX(${i === 0 ? 100 : 20}px)`, transition: "transform 900ms var(--ease-out-expo)" }}>
              <ellipse cx="110" cy="100" rx="22" ry="12" className="fill-card stroke-foreground" strokeWidth="2" />
              <circle cx="92" cy="96" r="8" className="fill-card stroke-foreground" strokeWidth="2" />
              <circle cx="89" cy="94" r="1.5" className="fill-foreground" />
              <path d="M132 100 q 20 -10 30 4" fill="none" className="stroke-foreground" strokeWidth="2" />
            </g>
            {/* rate bars */}
            {Array.from({ length: 10 }, (_, k) => (
              <rect key={k} x={180 + k * 9} y={70 - Math.min(1, pressRate * (1 + (k % 3) * 0.15)) * 30} width="6" height={Math.min(1, pressRate * (1 + (k % 3) * 0.15)) * 30} className="fill-[var(--brand)] transition-all duration-slow" style={{ opacity: k < pressRate * 10 + 1 ? 1 : 0.15 }} />
            ))}
            <text x="225" y="84" textAnchor="middle" className="fill-foreground text-[8px]">presses per minute</text>
          </>
        )}
      </svg>
      <StepPicker steps={steps} i={i} onPick={setI} kind="conditioning" />
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* ------------------------------------------------------------- memory */
const MEM_STEPS = [
  { id: "input", name: "Something happens", text: "A phone number is said aloud. Everything you sense enters the sensory register for a moment: a fraction of a second for sights, a few seconds for sounds." },
  { id: "attend", name: "Attention", text: "You attend to it, so it moves into short-term (working) memory. Anything you did not attend to simply fades from the sensory register." },
  { id: "hold", name: "Holding it", text: "Working memory keeps about four chunks for around 15 to 30 seconds unless you keep repeating it. Say the number in your head and it stays; get distracted and it goes." },
  { id: "encode", name: "Making it stick", text: "Repeating alone is weak. Linking it to meaning (a date you know, a pattern) encodes it into long-term memory, which has no known limit." },
  { id: "retrieve", name: "Recalling later", text: "Tomorrow you bring it back from long-term memory into working memory to dial it. Each recall strengthens the trace, which is why testing yourself beats rereading." },
];

export function MemoryFlow({ d }: { d: MemoryFlowData }) {
  const [i, setI] = React.useState(0);
  const cur = MEM_STEPS[i];
  const pos = [20, 118, 118, 230, 118][i];
  const boxes = [
    { x: 8, w: 72, name: "Sensory register", sub: "under 1 to 4 s", on: i === 0 },
    { x: 100, w: 90, name: "Working memory", sub: "about 4 chunks, 15 to 30 s", on: i === 1 || i === 2 || i === 4 },
    { x: 210, w: 102, name: "Long-term memory", sub: "no known limit", on: i === 3 },
  ];
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "How a memory is stored"}</p>
      <svg viewBox="0 0 320 130" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`${cur.name}: ${cur.text}`}>
        {boxes.map((b) => (
          <g key={b.name}>
            <rect x={b.x} y="30" width={b.w} height="60" rx="8" className={cn("stroke-foreground transition-colors duration-slow", b.on ? "fill-[var(--status-info-bg)]" : "fill-card")} strokeWidth="2" />
            <text x={b.x + b.w / 2} y="52" textAnchor="middle" className="fill-foreground text-[8px] font-semibold">{b.name}</text>
            <text x={b.x + b.w / 2} y="66" textAnchor="middle" className="fill-muted-foreground text-[7px]">{b.sub}</text>
          </g>
        ))}
        <path d="M80 60 L 100 60" className="stroke-foreground" strokeWidth="2" markerEnd="url(#mem-arrow)" />
        <text x="90" y="54" textAnchor="middle" className="fill-foreground text-[6px]">attention</text>
        <path d="M190 54 L 210 54" className="stroke-foreground" strokeWidth="2" markerEnd="url(#mem-arrow)" />
        <text x="200" y="48" textAnchor="middle" className="fill-foreground text-[6px]">encoding</text>
        <path d="M210 70 L 190 70" className="stroke-foreground" strokeWidth="2" markerEnd="url(#mem-arrow)" />
        <text x="200" y="82" textAnchor="middle" className="fill-foreground text-[6px]">retrieval</text>
        <path d="M120 90 q 25 20 50 0" fill="none" className={cn("stroke-foreground", i === 2 ? "vibha-dash" : "")} strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="145" y="112" textAnchor="middle" className="fill-foreground text-[6px]">rehearsal keeps it alive</text>
        {/* fading items in the sensory register */}
        {[0, 1, 2].map((k) => (
          <circle key={k} cx={22 + k * 18} cy={100 + k * 6} r="3" className="fill-foreground/40" style={{ opacity: i === 0 ? 1 - k * 0.3 : 0, transition: "opacity 700ms" }} />
        ))}
        <text x="44" y="122" textAnchor="middle" className="fill-muted-foreground text-[6px]" style={{ opacity: i === 0 ? 1 : 0 }}>unattended items fade</text>
        {/* the memory */}
        <g style={{ transform: `translate(${pos}px, 20px)`, transition: "transform 900ms var(--ease-out-expo)" }}>
          <rect x="14" y="-14" width="36" height="16" rx="4" className="fill-[var(--primary)] stroke-foreground" strokeWidth="2" />
          <text x="32" y="-3" textAnchor="middle" className="fill-foreground text-[7px] font-bold">98210…</text>
        </g>
        <defs>
          <marker id="mem-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="fill-foreground" />
          </marker>
        </defs>
      </svg>
      <StepPicker steps={MEM_STEPS} i={i} onPick={setI} kind="memoryflow" />
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* -------------------------------------------------------------- stress */
const STRESS_STEPS = [
  { id: "threat", name: "A threat appears", text: "You see a snake, or a difficult exam paper. The amygdala tags it as a threat within a fraction of a second, before you have consciously thought about it." },
  { id: "fast", name: "The fast route", text: "The amygdala signals the hypothalamus, which fires the sympathetic nervous system. The adrenal glands release adrenaline: heart races, breathing quickens, pupils widen, digestion pauses. All within seconds." },
  { id: "slow", name: "The slow route", text: "The hypothalamus also releases CRH. This tells the pituitary to release ACTH into the blood, which tells the adrenal cortex to release cortisol. This takes minutes, and cortisol keeps energy high for longer." },
  { id: "feedback", name: "Switching off", text: "Cortisol feeds back to the hippocampus and hypothalamus, which lower CRH. The system brakes itself. The threat passes, and the parasympathetic system restores calm." },
  { id: "chronic", name: "When it never switches off", text: "Under lasting stress the brake wears out. Cortisol stays high, the hippocampus can shrink, sleep and immunity suffer, and the stage is set for depression and anxiety. This is the link between life stress and biology." },
];

export function StressResponse({ d }: { d: StressData }) {
  const [i, setI] = React.useState(0);
  const cur = STRESS_STEPS[i];
  const hr = [72, 125, 110, 80, 95][i];
  const cortisol = [0.1, 0.15, 0.8, 0.3, 0.9][i];
  const node = (x: number, y: number, name: string, on: boolean) => (
    <g key={name}>
      <circle cx={x} cy={y} r="16" className={cn("stroke-foreground transition-colors duration-slow", on ? "fill-[var(--primary)]" : "fill-card")} strokeWidth="2" />
      <text x={x} y={y + 3} textAnchor="middle" className="fill-foreground text-[6px] font-semibold">{name}</text>
    </g>
  );
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "What stress does inside you"}</p>
      <svg viewBox="0 0 320 170" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`${cur.name}: ${cur.text}`}>
        {/* chain */}
        <path d="M60 40 L 110 40" className={cn("stroke-foreground", i >= 1 ? "vibha-dash" : "")} strokeWidth="2" strokeDasharray="4 3" />
        <path d="M110 56 L 110 84" className={cn("stroke-foreground", i >= 2 ? "vibha-dash" : "")} strokeWidth="2" strokeDasharray="4 3" />
        <path d="M110 116 L 110 140" className={cn("stroke-foreground", i >= 2 ? "vibha-dash" : "")} strokeWidth="2" strokeDasharray="4 3" />
        <path d="M126 40 L 190 40" className={cn("stroke-[var(--destructive)]", i === 1 ? "vibha-dash" : "")} strokeWidth="2" strokeDasharray="4 3" />
        {/* feedback arrow */}
        <path d="M126 150 C 200 150, 200 70, 70 56" fill="none" className={cn("stroke-foreground/50", i === 3 ? "vibha-dash" : "")} strokeWidth="1.5" strokeDasharray="3 3" style={{ opacity: i >= 3 ? 1 : 0.25 }} />
        <text x="196" y="112" className="fill-muted-foreground text-[6px]">cortisol feeds back</text>
        {node(44, 40, "amygdala", i >= 0)}
        {node(110, 40, "hypothalamus", i >= 1)}
        {node(110, 100, "pituitary", i >= 2)}
        {node(110, 156, "adrenal", i >= 1)}
        <text x="56" y="30" className="fill-muted-foreground text-[6px]">CRH →</text>
        <text x="116" y="74" className="fill-muted-foreground text-[6px]">ACTH</text>
        <text x="116" y="132" className="fill-muted-foreground text-[6px]">cortisol</text>
        <text x="130" y="34" className="fill-[var(--destructive)] text-[6px]">sympathetic nerves, adrenaline</text>
        {/* heart */}
        <g key={i} style={{ transformOrigin: "250px 60px", animationIterationCount: 3 }} className={hr > 90 ? "vibha-beat" : ""}>
          <path d="M250 72 C 230 56, 236 40, 250 48 C 264 40, 270 56, 250 72 Z" className="fill-[var(--status-alert-bg)] stroke-foreground" strokeWidth="2" />
        </g>
        <text x="250" y="88" textAnchor="middle" className="fill-foreground text-[8px] font-semibold tabular-nums">{hr} beats/min</text>
        {/* cortisol gauge */}
        <rect x="236" y="104" width="28" height="50" rx="4" className="fill-card stroke-foreground" strokeWidth="1.5" />
        <rect x="238" y={152 - cortisol * 46} width="24" height={cortisol * 46} rx="3" className="fill-[var(--brand)] transition-all duration-slow" />
        <text x="250" y="164" textAnchor="middle" className="fill-foreground text-[7px]">cortisol</text>
      </svg>
      <StepPicker steps={STRESS_STEPS} i={i} onPick={setI} kind="stress" />
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* ------------------------------------------------------------- timeline */
/** A fixed shuffle of 0..n-1 that never comes out in the correct order (so there is always something to sort). */
export function shuffleOrder(n: number, seed: number): number[] {
  const out = Array.from({ length: n }, (_, i) => i).sort((a, b) => (((a + 1) * (seed | 1)) % 23) - (((b + 1) * (seed | 1)) % 23));
  if (n > 1 && out.every((v, i) => v === i)) out.push(out.shift()!);
  return out;
}
/** Place events in order (tap a card, then tap a slot), then check. Sorting is the learning, so this one stays a task. */
export function Timeline({ d }: { d: TimelineData }) {
  const seed = d.prompt.length;
  const order = React.useMemo(() => shuffleOrder(d.events.length, seed), [d.events.length, seed]);
  const [slots, setSlots] = React.useState<(number | null)[]>(() => d.events.map(() => null));
  const [held, setHeld] = React.useState<number | null>(null);
  const [checked, setChecked] = React.useState(false);
  const placed = new Set(slots.filter((x): x is number => x !== null));
  const right = slots.filter((v, i) => v === i).length;
  const place = (slot: number) => {
    if (held === null || checked) return;
    setSlots((s) => {
      const n = s.map((v) => (v === held ? null : v));
      n[slot] = held;
      return n;
    });
    setHeld(null);
  };
  return (
    <figure className={card}>
      <p className={label}>Put it in order</p>
      <p className="mt-2 font-semibold"><Rich text={d.prompt} /></p>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Cards">
        {order.filter((i) => !placed.has(i)).map((i) => (
          <button key={i} type="button" aria-pressed={held === i} onClick={() => setHeld(held === i ? null : i)} className={cn("min-h-11 rounded-md border-2 px-3 py-2 text-left text-[0.95rem] transition-transform duration-fast", held === i ? "-translate-y-0.5 border-foreground bg-primary text-primary-foreground shadow-[var(--shadow-hard-xs)]" : "border-foreground bg-card")}>
            <Rich text={d.events[i].label} />
          </button>
        ))}
      </div>
      <ol className="relative mt-5 space-y-2 border-l-4 border-foreground pl-4">
        {slots.map((v, k) => (
          <li key={k} className="relative">
            <span aria-hidden className={cn("absolute -left-[1.45rem] top-3 size-4 rounded-full border-2 border-foreground", v !== null ? "bg-brand" : "bg-card")} />
            <div
              role="button"
              tabIndex={0}
              onClick={() => place(k)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && place(k)}
              aria-label={`Slot ${k + 1}${d.events[k].when ? `, ${d.events[k].when}` : ""}`}
              className={cn("flex min-h-12 items-center gap-3 rounded-md border-2 border-dashed px-3 py-2", held !== null ? "border-foreground bg-muted" : "border-foreground/40", checked && v !== null && (v === k ? "border-solid border-status-success-fg bg-status-success-bg" : "border-solid border-status-alert-fg bg-status-alert-bg"))}
            >
              {d.events[k].when ? <span className="shrink-0 text-xs font-bold tabular-nums text-muted-foreground">{d.events[k].when}</span> : <span className="shrink-0 text-xs font-bold text-muted-foreground">{k + 1}.</span>}
              {v !== null ? (
                <button
                  type="button"
                  disabled={checked}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlots((s) => s.map((x, i) => (i === k ? null : x)));
                  }}
                  className="text-left text-[0.95rem] font-semibold"
                >
                  <Rich text={d.events[v].label} />
                  {checked && v !== k ? <span className="block text-xs font-normal">Should be: <Rich text={d.events[k].label} /></span> : null}
                </button>
              ) : (
                <span className="text-sm text-muted-foreground">empty</span>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!checked ? (
          <button type="button" disabled={placed.size !== d.events.length} onClick={() => { setChecked(true); trackLearn({ type: "widget", kind: "timeline", ok: right === d.events.length, score: right / d.events.length, prompt: d.prompt }); }} className={cn(btn, "bg-foreground text-background disabled:opacity-40")}>Check the order</button>
        ) : (
          <>
            <p className="font-bold tabular-nums" role="status">{right} of {d.events.length} in the right place</p>
            <button type="button" onClick={() => { setSlots(d.events.map(() => null)); setChecked(false); }} className={cn(btn, "bg-card")}><RotateCcw className="size-4" aria-hidden /> Again</button>
          </>
        )}
      </div>
      {checked && d.why ? <p className="vibha-pop mt-3 rounded-xl bg-muted p-3 text-[0.95rem]"><Rich text={d.why} /></p> : null}
    </figure>
  );
}

/* -------------------------------------------------------------- compare */
/** Two states side by side: healthy vs depressed brain, before vs after treatment, novice vs expert. */
export function Compare({ d }: { d: CompareData }) {
  const side = (x: CompareData["a"], extra?: string) => (
    <div className={cn("min-w-0 p-4", extra)}>
      <p className="font-bold [overflow-wrap:anywhere]"><Rich text={x.label} /></p>
      <ul className="mt-2 space-y-1 text-[0.95rem]">
        {x.points.map((p, i) => (
          <li key={i} className="flex gap-1.5"><span aria-hidden>•</span><span className="min-w-0 [overflow-wrap:anywhere]"><Rich text={p} /></span></li>
        ))}
      </ul>
      {x.summary ? <p className="mt-3 rounded-md bg-muted p-2.5 text-[0.92rem] leading-relaxed"><Rich text={x.summary} /></p> : null}
    </div>
  );
  return (
    <figure className={card}>
      {d.title ? <p className={label}><Rich text={d.title} /></p> : null}
      <div className={cn("grid overflow-hidden rounded-xl border-2 border-foreground bg-background sm:grid-cols-2", d.title && "mt-3")}>
        {side(d.a)}
        {side(d.b, "border-t-2 border-foreground/20 sm:border-t-0 sm:border-l-2")}
      </div>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}
