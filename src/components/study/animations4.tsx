"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import type { HypnogramData, ReleaseData, StrangeData, ThoughtRecordData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";
import { trackLearn } from "@/lib/learn/track";
import { PlayBar, StepList, btn, card, choiceCls, label, statusCls, useSteps } from "./animations3";

/**
 * Third wave, part two: transmitter release with a drug picker, a CBT
 * thought record, a night of sleep with live EEG, and Ainsworth's Strange
 * Situation. Transform and opacity only, stops under reduce-motion, and
 * every state is written in words.
 */

function Caption({ text }: { text?: string }) {
  return text ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={text} /></figcaption> : null;
}

/* -------------------------------------------------------------- release */
type Drug = "none" | "ssri" | "maoi" | "amph" | "botox" | "antag";
const REL_STEPS = [
  { id: "ap", name: "Signal arrives", text: (tx: string) => `An electrical signal (an action potential) runs down the axon to the nerve ending. The ${tx} sits ready, packed into tiny bubbles called vesicles.` },
  { id: "ca", name: "Calcium enters", text: () => "The change in voltage opens calcium channels. Calcium flows into the nerve ending, and this is the trigger for release." },
  { id: "fuse", name: "Release", text: (tx: string) => `Calcium makes the vesicles fuse with the wall of the nerve ending and spill their ${tx} into the gap between the cells (the synapse).` },
  { id: "bind", name: "Binding", text: (tx: string) => `The ${tx} drifts across the narrow gap and fits into receptors on the next cell, like a key in a lock. The next cell gets the message.` },
  { id: "reuptake", name: "Reuptake", text: (tx: string) => `The ${tx} lets go of the receptors. Transporter pumps pull most of it back into the first nerve ending, which ends the message.` },
  { id: "breakdown", name: "Breakdown", text: (tx: string) => `Inside the nerve ending an enzyme, monoamine oxidase (MAO), breaks some ${tx} down. The rest is packed back into vesicles to be used again.` },
];
const DRUGS: { id: Drug; name: string; steps: number[]; text: (tx: string) => string }[] = [
  { id: "none", name: "No drug", steps: [], text: () => "" },
  { id: "ssri", name: "SSRI (blocks reuptake)", steps: [4, 5], text: (tx) => `The SSRI blocks the transporter, so ${tx} cannot be pulled back in. It stays in the gap longer and keeps acting on receptors. SSRIs block the serotonin transporter; other medicines block the dopamine or noradrenaline transporters in the same way.` },
  { id: "maoi", name: "MAOI (blocks breakdown)", steps: [5], text: (tx) => `The MAOI blocks the MAO enzyme, so less ${tx} is broken down. More is packed back into vesicles, and each signal then releases more.` },
  { id: "amph", name: "Amphetamine (pushes it out)", steps: [1, 2, 3, 4, 5], text: (tx) => `Amphetamine enters the nerve ending through the transporter, makes ${tx} leak out of the vesicles, and turns the transporter round so it pumps ${tx} out into the gap, even without a signal. Amphetamine acts mainly on dopamine and noradrenaline.` },
  { id: "botox", name: "Botulinum toxin (blocks release)", steps: [2, 3, 4, 5], text: () => "The toxin cuts the proteins that vesicles need to fuse with the wall. Calcium still enters, but nothing is released, so no message crosses. It acts mainly on acetylcholine nerve endings in muscles, which is why it relaxes muscles." },
  { id: "antag", name: "Receptor blocker (antagonist)", steps: [3, 4, 5], text: (tx) => `A blocker sits in the receptors without switching them on. The ${tx} is released but has nowhere to bind, so the next cell gets little or no message. Many antipsychotics block dopamine D2 receptors this way.` },
];
const VES = [[110, 42], [160, 36], [210, 42]];
const RECEPTORS = [116, 160, 204];
const TRANSPORTER = 250;

/** Where molecule m sits, given the step and the drug. */
function molPos(m: number, step: number, drug: Drug): { x: number; y: number; o: number; s: number } {
  const [vx, vy] = VES[m % 3];
  const inVes = { x: vx + (m < 3 ? -4 : 4), y: vy + (m < 3 ? -3 : 4), o: 1, s: 1 };
  const cleft = { x: 112 + m * 18, y: 100 + (m % 2) * 6, o: 1, s: 1 };
  const bound = m < 3 ? { x: RECEPTORS[m], y: 113, o: 1, s: 1 } : cleft;
  if (drug === "botox" && step >= 2) return inVes;
  if (drug === "amph" && step >= 1) {
    if (step === 1 || step === 2) return m < 3 ? inVes : { x: TRANSPORTER - 4 - (m - 3) * 16, y: 98 + (m % 2) * 6, o: 1, s: 1 };
    return step === 3 ? bound : { ...cleft, x: cleft.x + 10 };
  }
  if (step < 2) return inVes;
  if (step === 2) return cleft;
  if (step === 3) return drug === "antag" ? { ...cleft, y: 96 } : bound;
  if (drug === "antag") return { ...cleft, y: 96 };
  if (drug === "ssri") return step === 4 ? cleft : bound;
  // reuptake through the transporter
  if (step === 4) return m < 4 ? { x: TRANSPORTER - 8 + (m % 2) * 12, y: 58 + Math.floor(m / 2) * 10, o: 1, s: 1 } : cleft;
  // breakdown: MAO breaks two, the rest go back into a vesicle
  if (drug !== "maoi" && (m === 1 || m === 4)) return { x: m === 1 ? 256 : 266, y: 50, o: 0.6, s: 0.5 };
  return inVes;
}

/** Transmitter release, binding, reuptake and breakdown, with a drug picker. */
export function Release({ d }: { d: ReleaseData }) {
  const tx = d.transmitter ?? "serotonin";
  const st = useSteps(REL_STEPS.length, 2600);
  const [drug, setDrug] = React.useState<Drug>("none");
  const step = Math.min(st.i, REL_STEPS.length - 1);
  const cur = REL_STEPS[step];
  const dr = DRUGS.find((x) => x.id === drug)!;
  const affected = dr.steps.includes(step);
  const signal = drug === "botox" || drug === "antag" ? 0 : drug === "amph" ? (step >= 3 ? 1 : 0) : step === 3 ? 1 : drug === "ssri" && step >= 4 ? 0.9 : 0;
  const fused = drug !== "botox" && drug !== "amph" && step >= 2 && step <= 4;
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : `How ${tx} crosses a synapse`}</p>
      <svg viewBox="0 0 320 196" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`${cur.name}. ${cur.text(tx)}${affected ? ` With ${dr.name}: ${dr.text(tx)}` : ""}`}>
        {/* axon and terminal */}
        <rect x="146" y="0" width="28" height="14" className="fill-card stroke-foreground" strokeWidth="2" />
        <path d="M60 14 H260 Q 280 14 280 34 V82 H40 V34 Q 40 14 60 14 Z" className="fill-card stroke-foreground" strokeWidth="2" />
        <text x="50" y="28" className="fill-muted-foreground text-[8px]">nerve ending</text>
        {/* action potential */}
        <circle cx="160" cy="6" r="5" className="fill-[var(--primary)] stroke-foreground" strokeWidth="1.5" style={{ opacity: step === 0 ? 1 : 0, transform: step === 0 ? "translateY(10px)" : "none", transition: "transform 900ms var(--ease-out-expo), opacity 300ms" }} />
        {/* calcium channels */}
        {[70, 190].map((x) => (
          <g key={x}>
            <rect x={x - 6} y="76" width="12" height="12" rx="2" className={cn("stroke-foreground", step >= 1 ? "fill-[var(--status-success-bg)]" : "fill-card")} strokeWidth="1.5" />
            {[0, 1].map((k) => (
              <text key={k} x={x - 3 + k * 6} y="96" className="fill-foreground text-[8px] font-bold" style={{ opacity: step === 1 ? 1 : 0, transform: step === 1 ? "translateY(-30px)" : "none", transition: `transform 900ms var(--ease-out-expo) ${k * 120}ms, opacity 400ms` }}>Ca</text>
            ))}
          </g>
        ))}
        <text x="58" y="100" className="fill-muted-foreground text-[8px]">calcium channel</text>
        {/* vesicles */}
        {VES.map(([x, y], k) => (
          <g key={k} style={{ transform: fused ? `translateY(${78 - y - 10}px) scale(0.6)` : "none", transformBox: "fill-box", transformOrigin: "center", opacity: fused ? 0.35 : 1, transition: "transform 700ms var(--ease-out-expo), opacity 500ms" }}>
            <circle cx={x} cy={y} r="13" className="fill-[var(--status-info-bg)] stroke-foreground" strokeWidth="1.5" />
          </g>
        ))}
        {drug === "botox" && step >= 2 ? <text x="160" y="66" textAnchor="middle" className="fill-[var(--destructive)] text-[8px] font-bold">vesicles cannot fuse</text> : null}
        {/* MAO enzyme */}
        <g>
          <path d="M262 36 L271 31 A10 10 0 1 0 271 41 Z" className="fill-[var(--muted)] stroke-foreground" strokeWidth="1.5" />
          <text x="262" y="56" textAnchor="middle" className="fill-foreground text-[8px] font-semibold">MAO</text>
          {drug === "maoi" ? <text x="262" y="40" textAnchor="middle" className="fill-[var(--destructive)] text-[12px] font-bold">✕</text> : null}
        </g>
        {/* transporter */}
        <rect x={TRANSPORTER - 9} y="74" width="18" height="16" rx="3" className="fill-[var(--muted)] stroke-foreground" strokeWidth="1.5" />
        <text x={TRANSPORTER} y="70" textAnchor="middle" className="fill-foreground text-[8px] font-bold">{drug === "amph" ? "↓" : "↑"}</text>
        <text x={TRANSPORTER + 12} y="98" className="fill-muted-foreground text-[8px]">transporter</text>
        {drug === "ssri" ? <text x={TRANSPORTER} y="87" textAnchor="middle" className="fill-[var(--destructive)] text-[12px] font-bold">✕</text> : null}
        {/* amphetamine molecules */}
        {drug === "amph" ? [0, 1].map((k) => (
          <rect key={k} x={TRANSPORTER - 3} y="100" width="6" height="6" className="fill-[var(--destructive)]" style={{ transform: step >= 1 ? `translate(${k * 8 - 4}px, -44px) rotate(45deg)` : "rotate(45deg)", transformBox: "fill-box", transformOrigin: "center", transition: "transform 800ms var(--ease-out-expo)" }} />
        )) : null}
        {/* gap */}
        <text x="22" y="108" className="fill-muted-foreground text-[8px]">gap</text>
        {/* next cell */}
        <path d="M40 120 H280 V196 H40 Z" className="fill-card stroke-foreground" strokeWidth="2" />
        {RECEPTORS.map((x) => (
          <g key={x}>
            <path d={`M${x - 10} 120 V112 h6 v6 h8 v-6 h6 V120`} className={cn("stroke-foreground", signal > 0 ? "fill-[var(--status-success-bg)]" : "fill-card")} strokeWidth="1.5" />
            {drug === "antag" ? <rect x={x - 4} y="111" width="8" height="7" className="fill-foreground" style={{ opacity: step >= 2 ? 1 : 0, transition: "opacity 400ms" }} /> : null}
          </g>
        ))}
        <text x="226" y="132" className="fill-muted-foreground text-[8px]">receptors</text>
        <text x="50" y="150" className="fill-foreground text-[8px] font-semibold">Message to the next cell</text>
        <rect x="50" y="158" width="220" height="12" rx="3" className="fill-background stroke-foreground" strokeWidth="1.5" />
        <rect x="52" y="160" width="216" height="8" rx="2" className="fill-[var(--brand)]" style={{ transform: `scaleX(${signal})`, transformBox: "fill-box", transformOrigin: "0 50%", transition: "transform 700ms var(--ease-out-expo)" }} />
        <text x="160" y="186" textAnchor="middle" className="fill-foreground text-[8px]">{signal >= 0.9 ? (drug === "ssri" && step >= 4 ? "still on: the message lasts longer" : drug === "amph" ? "strong, even without a signal" : "on") : "off"}</text>
        {/* molecules */}
        {Array.from({ length: 6 }, (_, m) => {
          const p = molPos(m, step, drug);
          return <circle key={m} cx="0" cy="0" r="4" className="fill-[var(--primary)] stroke-foreground" strokeWidth="1" style={{ transform: `translate(${p.x}px, ${p.y}px) scale(${p.s})`, opacity: p.o, transition: `transform 900ms var(--ease-out-expo) ${m * 50}ms, opacity 500ms` }} />;
        })}
      </svg>
      <StepList names={REL_STEPS.map((s) => s.name)} st={st} />
      <PlayBar st={st} n={REL_STEPS.length} kind="release" />
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Add a drug">
        {DRUGS.map((x) => (
          <button key={x.id} type="button" aria-pressed={drug === x.id} className={choiceCls(drug === x.id)} onClick={() => { setDrug(x.id); trackLearn({ type: "widget", kind: "release", item: x.id }); }}>{x.name}</button>
        ))}
      </div>
      <p className={statusCls} key={`${cur.id}-${drug}`} role="status" aria-live="polite">
        <span className="font-semibold">{cur.name}: </span>{cur.text(tx)}
        {drug !== "none" ? (
          <span className="mt-2 block"><span className="font-semibold">{affected ? `With ${dr.name}: ` : `${dr.name}: `}</span>{affected ? dr.text(tx) : `no change at this step. Step to ${REL_STEPS[dr.steps[0]].name.toLowerCase()} to see what it does.`}</span>
        ) : null}
      </p>
      <Caption text={d.caption} />
    </figure>
  );
}

/* -------------------------------------------------------- thought record */
const TR_STEPS = ["Situation", "Automatic thought", "Rate the feeling", "Thinking trap", "Evidence for", "Evidence against", "Balanced thought", "Rate again"];

function EvidenceList({ items, n, setN, kind }: { items: string[]; n: number; setN: (k: number) => void; kind: "for" | "against" }) {
  return (
    <div className="mt-3">
      <ul className="space-y-2">
        {items.slice(0, n).map((e, k) => (
          <li key={k} className={cn("vibha-pop rounded-xl border-2 border-foreground p-3 text-[0.95rem]", kind === "for" ? "bg-[var(--status-alert-bg)]" : "bg-[var(--status-success-bg)]")}>
            <span className="font-semibold">{kind === "for" ? "For: " : "Against: "}</span><Rich text={e} />
          </li>
        ))}
      </ul>
      {n < items.length ? (
        <button type="button" className={cn(btn, "mt-2 bg-card")} onClick={() => setN(n + 1)}><Eye className="size-4" aria-hidden /> Reveal {n === 0 ? "the first" : "the next"} ({n + 1} of {items.length})</button>
      ) : null}
    </div>
  );
}

/** A CBT thought record, filled in step by step. */
export function ThoughtRecord({ d }: { d: ThoughtRecordData }) {
  const [step, setStep] = React.useState(0);
  const [before, setBefore] = React.useState(80);
  const [after, setAfter] = React.useState<number | null>(null);
  const [trap, setTrap] = React.useState<number | null>(null);
  const [forN, setForN] = React.useState(0);
  const [againstN, setAgainstN] = React.useState(0);
  const last = TR_STEPS.length - 1;
  const aft = after ?? before;
  const go = (k: number) => {
    setStep(k);
    if (k === last) trackLearn({ type: "widget", kind: "thoughtrecord", score: Math.max(0, before - aft) / 100 });
  };
  const t = trap === null ? null : d.traps[trap];
  const drop = before - aft;
  const status = (() => {
    switch (step) {
      case 0:
        return <><span className="font-semibold">Situation: </span>Write down only the facts: where, when, who. No opinions yet.</>;
      case 1:
        return <><span className="font-semibold">Automatic thought: </span>This is the thought that popped up on its own. It feels true because it came so fast, but a thought is a guess, not a fact.</>;
      case 2:
        return <><span className="font-semibold">Rate the feeling: </span>How {d.emotion} do you feel when you believe this thought? You chose {before} out of 100.</>;
      case 3:
        return t ? <><span className="font-semibold">{t.right ? "Yes. " : "Not the best fit. "}</span><Rich text={t.why} /></> : <><span className="font-semibold">Thinking trap: </span>Which thinking trap fits this thought best? Pick one.</>;
      case 4:
        return <><span className="font-semibold">Evidence for: </span>{forN < d.forEvidence.length ? "Facts that support the thought. Be fair: there usually are some. Reveal each one." : "These are the facts on the thought's side. Now look at the other side."}</>;
      case 5:
        return <><span className="font-semibold">Evidence against: </span>{againstN < d.againstEvidence.length ? "Facts that do not fit the thought. Ask: what would I tell a friend? Reveal each one." : "Put both lists side by side. The thought explains only part of what happened."}</>;
      case 6:
        return <><span className="font-semibold">Balanced thought: </span>A balanced thought is not just positive thinking. It takes in the evidence on both sides and is something you can actually believe.</>;
      default:
        return after === null ? (
          <><span className="font-semibold">Rate again: </span>Now hold the balanced thought in mind. How {d.emotion} do you feel? Move the slider.</>
        ) : drop > 0 ? (
          <><span className="font-semibold">From {before} to {aft}, down {drop} points. </span>The feeling rarely drops to zero, and it does not need to. A drop like this, from changing the thought and not the situation, is what CBT works on.</>
        ) : (
          <><span className="font-semibold">From {before} to {aft}. </span>The feeling has not dropped this time. That is common at first: look for more evidence against, or try a thought you believe a bit more.</>
        );
    }
  })();
  return (
    <figure className={card}>
      <p className={label}>Fill in a thought record</p>
      <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="Steps">
        {TR_STEPS.map((s, k) => (
          <li key={s}>
            <button type="button" onClick={() => go(k)} aria-current={k === step ? "step" : undefined} className={cn("min-h-11 rounded-md border-2 px-2.5 text-xs font-semibold sm:text-sm", k === step ? "border-foreground bg-foreground text-background" : k < step ? "border-foreground bg-card" : "border-foreground/25 bg-card text-muted-foreground")}>
              {k + 1}. {s}
            </button>
          </li>
        ))}
      </ol>
      <div className="mt-3 rounded-xl border-2 border-foreground bg-background p-3 sm:p-4" key={step}>
        <p className="text-xs font-bold tracking-wide uppercase">{step + 1}. {TR_STEPS[step]}</p>
        {step === 0 ? <p className="vibha-pop mt-2 text-[0.95rem]"><Rich text={d.situation} /></p> : null}
        {step >= 1 && step <= 5 ? (
          <p className={cn("vibha-pop mt-2 rounded-xl border-2 border-dashed border-foreground bg-card p-3 text-[1.05rem] font-semibold", step === 1 && "vibha-shake")}>&ldquo;<Rich text={d.thought} />&rdquo;</p>
        ) : null}
        {step === 2 ? (
          <label className="mt-3 block text-sm font-semibold">
            How {d.emotion}? {before} out of 100
            <input type="range" min={0} max={100} step={5} value={before} onChange={(e) => setBefore(Number(e.target.value))} className="mt-1 h-11 w-full accent-[var(--brand)]" aria-valuetext={`${before} out of 100`} />
          </label>
        ) : null}
        {step === 3 ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2" role="group" aria-label="Thinking traps">
            {d.traps.map((x, k) => (
              <button key={k} type="button" aria-pressed={trap === k} className={cn(choiceCls(trap === k), trap === k && x.right && "bg-[var(--status-success-bg)] text-foreground", trap === k && !x.right && "bg-[var(--status-alert-bg)] text-foreground")} onClick={() => { setTrap(k); trackLearn({ type: "widget", kind: "thoughtrecord", ok: !!x.right, item: "trap" }); }}>
                <Rich text={x.label} />{trap === k ? (x.right ? " (right)" : " (try again)") : null}
              </button>
            ))}
          </div>
        ) : null}
        {step === 4 ? <EvidenceList items={d.forEvidence} n={forN} setN={setForN} kind="for" /> : null}
        {step === 5 ? <EvidenceList items={d.againstEvidence} n={againstN} setN={setAgainstN} kind="against" /> : null}
        {step === 6 ? (
          <>
            <p className="mt-2 text-[0.95rem] line-through opacity-60">&ldquo;<Rich text={d.thought} />&rdquo;</p>
            <p className="vibha-pop mt-2 rounded-xl border-2 border-foreground bg-[var(--status-info-bg)] p-3 text-[1.05rem] font-semibold">&ldquo;<Rich text={d.balanced} />&rdquo;</p>
          </>
        ) : null}
        {step === 7 ? (
          <>
            <label className="mt-2 block text-sm font-semibold">
              How {d.emotion} now? {aft} out of 100
              <input type="range" min={0} max={100} step={5} value={aft} onChange={(e) => setAfter(Number(e.target.value))} className="mt-1 h-11 w-full accent-[var(--brand)]" aria-valuetext={`${aft} out of 100`} />
            </label>
            <svg viewBox="0 0 320 64" className="mt-2 w-full" role="img" aria-label={`Before: ${before}. After: ${aft}.`}>
              {[{ y: 8, v: before, n: "before" }, { y: 36, v: aft, n: "after" }].map((b) => (
                <g key={b.n}>
                  <text x="0" y={b.y + 13} className="fill-foreground text-[10px] font-semibold">{b.n}</text>
                  <rect x="50" y={b.y} width="240" height="18" rx="4" className="fill-card stroke-foreground" strokeWidth="1.5" />
                  <rect x="52" y={b.y + 2} width="236" height="14" rx="3" className={b.n === "before" ? "fill-[var(--destructive)]" : "fill-[var(--brand)]"} style={{ transform: `scaleX(${b.v / 100})`, transformBox: "fill-box", transformOrigin: "0 50%", transition: "transform 600ms var(--ease-out-expo)" }} />
                  <text x="296" y={b.y + 13} className="fill-foreground text-[10px] font-bold tabular-nums">{b.v}</text>
                </g>
              ))}
            </svg>
          </>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" disabled={step === 0} className={cn(btn, "bg-card disabled:opacity-40")} onClick={() => go(step - 1)}><ChevronLeft className="size-4" aria-hidden /> Back</button>
        <button type="button" disabled={step === last} className={cn(btn, "bg-foreground text-background disabled:opacity-40")} onClick={() => go(step + 1)}>Next <ChevronRight className="size-4" aria-hidden /></button>
      </div>
      <p className={statusCls} key={`${step}-${trap}-${forN}-${againstN}-${after === null}`} role="status" aria-live="polite">{status}</p>
    </figure>
  );
}

/* ------------------------------------------------------------ hypnogram */
type Stage = "W" | "REM" | "N1" | "N2" | "N3";
const LEVEL: Record<Stage, number> = { W: 0, REM: 1, N1: 2, N2: 3, N3: 4 };
const STAGE_INFO: Record<Stage, { name: string; text: string }> = {
  W: { name: "Awake", text: "Fast, small, uneven beta waves. Relaxed with the eyes shut, slower alpha waves (about 8 to 12 a second) take over." },
  N1: { name: "N1, drifting off", text: "Alpha gives way to slower theta waves (about 4 to 7 a second). Very light sleep: woken now, you may say you were not asleep at all." },
  N2: { name: "N2, light sleep", text: "Theta waves with sleep spindles (short bursts at about 12 to 14 a second) and K complexes (one big, sharp wave). About half the night is spent here." },
  N3: { name: "N3, deep sleep", text: "Big, slow delta waves (2 or fewer a second). The hardest stage to wake from, when growth hormone is released. Most N3 comes in the first third of the night." },
  REM: { name: "REM sleep", text: "Small, fast, mixed waves that look almost awake, with sawtooth waves. The eyes dart, most muscles are switched off, and vivid dreams happen. REM periods get longer towards morning." },
};
// [start minute, stage], each segment runs to the next start; the night ends at 480
const HEALTHY: [number, Stage][] = [[0, "W"], [12, "N1"], [18, "N2"], [34, "N3"], [72, "N2"], [92, "REM"], [104, "N2"], [126, "N3"], [150, "N2"], [178, "REM"], [198, "W"], [201, "N1"], [205, "N2"], [232, "N3"], [246, "N2"], [276, "REM"], [302, "N2"], [348, "REM"], [380, "W"], [383, "N1"], [388, "N2"], [424, "REM"], [464, "N1"], [470, "W"]];
const DEPRESSED: [number, Stage][] = [[0, "W"], [32, "N1"], [38, "N2"], [52, "N3"], [64, "N2"], [80, "REM"], [108, "N2"], [132, "W"], [142, "N1"], [148, "N2"], [172, "REM"], [198, "N2"], [216, "N3"], [226, "N2"], [252, "W"], [264, "N2"], [292, "REM"], [326, "W"], [338, "N2"], [364, "REM"], [394, "W"], [404, "N1"], [410, "N2"], [428, "W"]];
const END = 480;

function stageAt(segs: [number, Stage][], t: number): Stage {
  let s: Stage = segs[0][1];
  for (const [start, st] of segs) if (start <= t) s = st;
  return s;
}
function nightStats(segs: [number, Stage][]) {
  const onset = segs.find(([, s]) => s !== "W")![0];
  const firstRem = segs.find(([, s]) => s === "REM")![0];
  let n3 = 0;
  let rem = 0;
  let waso = 0;
  const lastWake = segs.at(-1)![1] === "W" ? segs.at(-1)![0] : END;
  segs.forEach(([start, s], k) => {
    const len = (segs[k + 1]?.[0] ?? END) - start;
    if (s === "N3") n3 += len;
    if (s === "REM") rem += len;
    if (s === "W" && start > onset && start < lastWake) waso += len;
  });
  return { latency: firstRem - onset, n3, rem, waso, early: END - lastWake };
}
const X0 = 44;
const XW = 266;
const tx = (t: number) => X0 + (t / END) * XW;
const ty = (s: Stage) => 18 + LEVEL[s] * 20;
function hypnoPath(segs: [number, Stage][]) {
  let p = "";
  segs.forEach(([start, s], k) => {
    const end = segs[k + 1]?.[0] ?? END;
    p += `${k ? " V" + ty(s) : `M${tx(start)} ${ty(s)}`} H${tx(end)}`;
  });
  return p;
}

// EEG traces: periodic over 320 units so the scroll loops seamlessly
const TAU = Math.PI * 2;
const g = (x: number, c: number, w: number) => Math.exp(-(((x - c) / w) ** 2));
const EEG_FN: Record<Stage, (x: number) => number> = {
  W: (x) => 3 * Math.sin((TAU * 40 * x) / 320) + 2.4 * Math.sin((TAU * 57 * x) / 320 + 1) + 1.6 * Math.sin((TAU * 23 * x) / 320 + 2),
  N1: (x) => 7 * Math.sin((TAU * 12 * x) / 320) + 2 * Math.sin((TAU * 31 * x) / 320 + 1) - 10 * g(x, 230, 5),
  N2: (x) => 5 * Math.sin((TAU * 12 * x) / 320) + 7 * Math.sin((TAU * 44 * x) / 320) * g(x, 80, 18) - 22 * g(x, 210, 6) + 14 * g(x, 228, 12),
  N3: (x) => 20 * Math.sin((TAU * 4 * x) / 320) + 4 * Math.sin((TAU * 13 * x) / 320 + 1),
  REM: (x) => 3.5 * Math.sin((TAU * 29 * x) / 320) + 2 * Math.sin((TAU * 47 * x) / 320 + 2) + 6 * (((x * 10) / 320) % 1 - 0.5) * g(x, 190, 40),
};
const EEG_PATH: Record<Stage, string> = Object.fromEntries(
  (Object.keys(EEG_FN) as Stage[]).map((s) => {
    let p = "";
    for (let x = 0; x <= 640; x += 2) p += `${x ? "L" : "M"}${x} ${(32 - EEG_FN[s](x % 320)).toFixed(1)} `;
    return [s, p];
  }),
) as Record<Stage, string>;

const clock = (t: number) => `${Math.floor(t / 60)} h ${t % 60} min`;

/** A night of sleep: hypnogram, a time slider, the live EEG, and a depression toggle. */
export function Hypnogram({ d }: { d: HypnogramData }) {
  const [t, setT] = React.useState(100);
  const [dep, setDep] = React.useState(false);
  const segs = dep ? DEPRESSED : HEALTHY;
  const s = stageAt(segs, t);
  const info = STAGE_INFO[s];
  const stats = nightStats(segs);
  const healthy = nightStats(HEALTHY);
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "One night of sleep"}</p>
      <svg viewBox="0 0 320 132" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`Hypnogram${dep ? " in depression" : ""}. At ${clock(t)} after lights out: ${info.name}.`}>
        {(Object.keys(LEVEL) as Stage[]).map((st) => (
          <g key={st}>
            <line x1={X0} x2={X0 + XW} y1={ty(st)} y2={ty(st)} className="stroke-foreground/15" strokeWidth="1" />
            <text x={X0 - 6} y={ty(st) + 3} textAnchor="end" className={cn("text-[8px] font-semibold", st === s ? "fill-[var(--link)]" : "fill-foreground")}>{st === "W" ? "Awake" : st}</text>
          </g>
        ))}
        <path d={hypnoPath(segs)} fill="none" className="stroke-foreground" strokeWidth="1.8" strokeLinejoin="round" key={String(dep)} style={{ opacity: 1 }} />
        {segs.map(([start, st], k) => (st === "REM" ? <rect key={k} x={tx(start)} y={ty("REM") - 3} width={tx(segs[k + 1]?.[0] ?? END) - tx(start)} height="6" className="fill-[var(--destructive)]" /> : null))}
        {[0, 2, 4, 6, 8].map((h) => (
          <text key={h} x={tx(h * 60)} y="124" textAnchor="middle" className="fill-muted-foreground text-[8px]">{h} h</text>
        ))}
        <g style={{ transform: `translateX(${tx(t) - X0}px)`, transition: "transform 120ms" }}>
          <line x1={X0} x2={X0} y1="8" y2="110" className="stroke-[var(--brand)]" strokeWidth="2" />
          <circle cx={X0} cy={ty(s)} r="4.5" className="fill-[var(--primary)] stroke-foreground" strokeWidth="1.5"/>
        </g>
        <text x={X0 + XW} y="9" textAnchor="end" className="fill-muted-foreground text-[8px]">red bar: REM</text>
      </svg>
      <label className="mt-3 block text-sm font-semibold">
        Time after lights out: {clock(t)}
        <input type="range" min={0} max={END - 5} step={5} value={t} onChange={(e) => setT(Number(e.target.value))} className="mt-1 h-11 w-full accent-[var(--brand)]" aria-valuetext={`${clock(t)}, ${info.name}`} />
      </label>
      <div className="mt-2 rounded-xl border-2 border-foreground bg-background p-2">
        <p className="px-1 text-xs font-bold tracking-wide uppercase">Brain waves now: {info.name}</p>
        <svg viewBox="0 0 320 64" className="mt-1 w-full overflow-hidden" role="img" aria-label={`Brain waves typical of ${info.name}`}>
          <defs>
            <clipPath id="eeg-clip"><rect x="0" y="0" width="320" height="64" /></clipPath>
          </defs>
          <g clipPath="url(#eeg-clip)">
            <path key={s} d={EEG_PATH[s]} fill="none" className="vibha-eeg stroke-foreground" strokeWidth="1.4" />
          </g>
        </svg>
      </div>
      <button type="button" aria-pressed={dep} className={cn(choiceCls(dep), "mt-3")} onClick={() => { setDep((x) => !x); trackLearn({ type: "widget", kind: "hypnogram", item: dep ? "healthy" : "depression" }); }}>
        {dep ? "In depression (tap for a typical night)" : "Typical night (tap for depression)"}
      </button>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        {[
          { k: "First REM after falling asleep", v: `${stats.latency} min` },
          { k: "Deep sleep (N3)", v: `${stats.n3} min` },
          { k: "Awake in the night", v: `${stats.waso} min` },
          { k: "Woke too early", v: stats.early >= 20 ? `${stats.early} min early` : "no" },
        ].map((x) => (
          <div key={x.k} className="rounded-md border-2 border-foreground bg-card p-2">
            <dt className="text-xs">{x.k}</dt>
            <dd className="font-bold tabular-nums">{x.v}</dd>
          </div>
        ))}
      </dl>
      <p className={statusCls} key={`${s}-${dep}`} role="status" aria-live="polite">
        <span className="font-semibold">{clock(t)}: {info.name}. </span>{info.text}
        {dep ? (
          <span className="mt-2 block">
            <span className="font-semibold">In depression: </span>REM comes early (here {stats.latency} minutes after falling asleep, against about {healthy.latency} in a typical night) and the first REM period is long. Deep N3 sleep is cut ({stats.n3} minutes against {healthy.n3}). There is more waking in the night and waking too early in the morning. Many, but not all, people with depression show this, so it is not a test for depression.
          </span>
        ) : null}
      </p>
      <Caption text={d.caption} />
    </figure>
  );
}

/* ------------------------------------------------------ strange situation */
type Style = "secure" | "avoidant" | "ambivalent" | "disorganised";
const SS_STEPS = [
  { id: "together", name: "With caregiver" },
  { id: "stranger", name: "Stranger comes in" },
  { id: "leaves", name: "Caregiver leaves" },
  { id: "reunion", name: "Reunion" },
];
const STYLES: { id: Style; name: string; rate: string; why: string; x: number[]; upset: number[]; acts: string[] }[] = [
  {
    id: "secure",
    name: "Secure",
    rate: "About 6 in 10 infants in many samples.",
    why: "Linked with a caregiver who notices and responds to the baby's signals warmly and reliably.",
    x: [160, 128, 238, 92],
    upset: [0.1, 0.3, 0.8, 0.15],
    acts: [
      "Plays happily and explores the toys, looking back at the caregiver now and then: the caregiver is a safe base.",
      "A little wary and moves closer to the caregiver, but warms to the stranger with the caregiver there.",
      "Upset: cries, goes to the door, stops playing. The stranger can comfort a little, but not fully.",
      "Goes straight to the caregiver for a hug, calms quickly, then goes back to playing.",
    ],
  },
  {
    id: "avoidant",
    name: "Avoidant",
    rate: "About 2 in 10 infants in many samples.",
    why: "Linked with a caregiver who tends to discourage closeness or turn away when the baby is upset.",
    x: [170, 170, 170, 196],
    upset: [0.1, 0.1, 0.2, 0.1],
    acts: [
      "Plays with the toys and pays little attention to the caregiver.",
      "Treats the stranger much like the caregiver; carries on playing.",
      "Shows little visible upset and keeps playing, although the heart rate shows the baby is stressed inside.",
      "Ignores the caregiver or turns away; does not seek comfort.",
    ],
  },
  {
    id: "ambivalent",
    name: "Ambivalent (resistant)",
    rate: "About 1 in 10 infants in many samples.",
    why: "Linked with a caregiver who responds sometimes and not others, so the baby cannot rely on comfort.",
    x: [100, 88, 150, 96],
    upset: [0.4, 0.7, 1, 0.8],
    acts: [
      "Stays close to the caregiver and explores little.",
      "Very wary of the stranger and clings to the caregiver.",
      "Extremely upset, cries hard and cannot be calmed by the stranger.",
      "Wants to be held but also pushes away, arches or hits; is not easily soothed and goes back to playing slowly.",
    ],
  },
  {
    id: "disorganised",
    name: "Disorganised",
    rate: "About 1 in 7 infants in everyday samples, and far more where there is maltreatment.",
    why: "Linked with a caregiver who is frightened or frightening, so the person who should comfort is also a source of fear.",
    x: [150, 132, 200, 136],
    upset: [0.3, 0.5, 0.8, 0.6],
    acts: [
      "Plays, but in a hesitant way.",
      "Behaviour is hard to read: may freeze or look dazed.",
      "Upset, but in odd ways: rocking, freezing, or crying while moving away from the door.",
      "Mixed signals: walks towards the caregiver with the head turned away, then freezes or backs off. There is no clear plan for getting comfort.",
    ],
  },
];

/** Ainsworth's Strange Situation: step through the episodes, pick an attachment style. */
export function Strange({ d }: { d: StrangeData }) {
  const st = useSteps(SS_STEPS.length, 3000);
  const [style, setStyle] = React.useState<Style>("secure");
  const ep = Math.min(st.i, SS_STEPS.length - 1);
  const sty = STYLES.find((x) => x.id === style)!;
  const upset = sty.upset[ep];
  const care = ep !== 2;
  const stranger = ep === 1 || ep === 2;
  const mood = upset >= 0.6 ? "upset" : upset >= 0.3 ? "unsure" : "calm";
  const mouth = mood === "upset" ? "M-5 6 Q0 1 5 6" : mood === "unsure" ? "M-5 4 H5" : "M-5 3 Q0 8 5 3";
  const frozen = style === "disorganised" && (ep === 1 || ep === 3);
  const turned = style === "avoidant" && ep === 3;
  const person = (x: number, name: string, on: boolean, fill: string) => (
    <g style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateX(30px)", transition: "transform 700ms var(--ease-out-expo), opacity 500ms" }}>
      <circle cx={x} cy="58" r="11" className={cn(fill, "stroke-foreground")} strokeWidth="2" />
      <path d={`M${x - 14} 112 V84 Q${x} 68 ${x + 14} 84 V112 Z`} className={cn(fill, "stroke-foreground")} strokeWidth="2" />
      <text x={x} y="124" textAnchor="middle" className="fill-foreground text-[8px] font-semibold">{name}</text>
    </g>
  );
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "Ainsworth's Strange Situation"}</p>
      <svg viewBox="0 0 320 170" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`${SS_STEPS[ep].name}. ${sty.name} infant: ${sty.acts[ep]}`}>
        <rect x="6" y="20" width="308" height="112" rx="6" className="fill-card stroke-foreground" strokeWidth="2" />
        <rect x="290" y="44" width="24" height="68" className="fill-[var(--muted)] stroke-foreground" strokeWidth="2" />
        <text x="302" y="40" textAnchor="middle" className="fill-foreground text-[8px]">door</text>
        {/* toys */}
        <rect x="168" y="114" width="12" height="12" className="fill-[var(--primary)] stroke-foreground" strokeWidth="1.5" />
        <circle cx="194" cy="120" r="6" className="fill-[var(--status-info-bg)] stroke-foreground" strokeWidth="1.5" />
        <text x="182" y="14" textAnchor="middle" className="fill-muted-foreground text-[8px]">{SS_STEPS[ep].name}</text>
        {person(46, "caregiver", care, "fill-[var(--status-success-bg)]")}
        {person(260, "stranger", stranger, "fill-[var(--muted)]")}
        {/* infant */}
        <g style={{ transform: `translateX(${sty.x[ep]}px)`, transition: "transform 900ms var(--ease-out-expo)" }}>
          <g className={upset >= 0.8 && st.playing ? "vibha-beat" : ""} style={{ "--beat": "700ms" } as React.CSSProperties}>
            <g style={{ transform: turned ? "scaleX(-1)" : "none", transition: "transform 400ms" }}>
              <circle cx="0" cy="98" r="10" className="fill-[var(--primary)] stroke-foreground" strokeWidth="2" />
              <circle cx="-4" cy="95" r="1.4" className="fill-foreground" />
              <circle cx="4" cy="95" r="1.4" className="fill-foreground" />
              <path d={mouth} transform="translate(0 98)" fill="none" className="stroke-foreground" strokeWidth="1.5" />
              <path d="M-9 108 Q0 104 9 108 L7 124 H-7 Z" className="fill-[var(--primary)] stroke-foreground" strokeWidth="2" />
            </g>
          </g>
          <text x="0" y="82" textAnchor="middle" className="fill-foreground text-[8px] font-bold">{frozen ? "freezes" : turned ? "turns away" : mood}</text>
        </g>
        {/* distress meter */}
        <text x="10" y="150" className="fill-foreground text-[8px] font-semibold">How upset the infant looks</text>
        <rect x="130" y="142" width="180" height="10" rx="3" className="fill-background stroke-foreground" strokeWidth="1.5" />
        <rect x="132" y="144" width="176" height="6" rx="2" className="fill-[var(--destructive)]" style={{ transform: `scaleX(${upset})`, transformBox: "fill-box", transformOrigin: "0 50%", transition: "transform 700ms var(--ease-out-expo)" }} />
        <text x="310" y="164" textAnchor="end" className="fill-foreground text-[8px]">{mood}</text>
      </svg>
      <StepList names={SS_STEPS.map((s) => s.name)} st={st} />
      <PlayBar st={st} n={SS_STEPS.length} kind="strange" />
      <div className="mt-3 grid gap-2 sm:grid-cols-4" role="group" aria-label="Attachment style">
        {STYLES.map((x) => (
          <button key={x.id} type="button" aria-pressed={style === x.id} className={choiceCls(style === x.id)} onClick={() => { setStyle(x.id); trackLearn({ type: "widget", kind: "strange", item: x.id }); }}>{x.name}</button>
        ))}
      </div>
      <p className={statusCls} key={`${ep}-${style}`} role="status" aria-live="polite">
        <span className="font-semibold">{SS_STEPS[ep].name}, {sty.name.toLowerCase()} infant: </span>{sty.acts[ep]}
        <span className="mt-2 block text-sm">{sty.rate} {sty.why} Rates differ a lot between countries. The real procedure runs eight short episodes in about 20 minutes, with two separations and two reunions; the reunions tell the most.</span>
      </p>
      <Caption text={d.caption} />
    </figure>
  );
}
