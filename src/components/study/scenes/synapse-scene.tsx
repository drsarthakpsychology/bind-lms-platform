"use client";

import * as React from "react";
import { RotateCcw, Zap } from "lucide-react";
import type { Synapse3dData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { QuickChallenge, type ChallengeQ } from "./challenge";
import { sfx } from "./sfx";

const SYN_CHALLENGE: ChallengeQ[] = [
  { q: "What makes the vesicles fuse and release their transmitter?", options: ["Sodium leaving the cell", "Calcium flowing into the nerve ending", "The transmitter binding to receptors"], answer: 1, why: "When the impulse arrives, voltage-gated calcium channels open. Calcium flowing in triggers the vesicles to fuse with the membrane and empty into the gap." },
  { q: "An SSRI blocks the serotonin transporter. What happens to the message?", options: ["It lasts longer", "It never starts", "It is blocked at the receptor"], answer: 0, why: "With reuptake blocked, serotonin stays in the gap longer and keeps reaching receptors, so the message lasts." },
  { q: "An antagonist at the receptor...", options: ["binds and switches the receptor on", "speeds up reuptake", "binds but does not switch it on, and keeps the transmitter out"], answer: 2, why: "An antagonist fits the receptor without activating it. Antipsychotics work partly this way, blocking dopamine D2 receptors." },
  { q: "Botulinum toxin stops which step?", options: ["Release from the vesicles", "Binding to receptors", "Breakdown in the gap"], answer: 0, why: "It cuts the proteins that let vesicles fuse, so no acetylcholine is released and the muscle is never told to contract." },
];
import { Scene3DSlot, SceneCard, ViewSwitch, btn, chip, statusCls, useInView, useJourney, useSceneView, useThemeColors, type V3 } from "./kit";

/**
 * A synapse in 3D: fire the nerve ending and watch calcium flood in,
 * vesicles dock and burst, transmitter cross the gap and bind receptors,
 * then get pumped back. Add a drug to see which step it changes.
 */

export type SynDrug = "none" | "reuptake" | "blocker" | "botox";
export const STAGES = [
  { id: "arrive", ms: 900, name: "Signal arrives" },
  { id: "calcium", ms: 900, name: "Calcium enters" },
  { id: "fuse", ms: 1000, name: "Vesicles fuse" },
  { id: "bind", ms: 1800, name: "Binding" },
  { id: "clear", ms: 2200, name: "Clearing up" },
] as const;
export const T = { ca: 900, fuse: 1800, dock: 2300, bind: 2800, clear: 4600, end: 6800 };

export const N_VES = 10, N_DOCK = 4, N_MOL = 48, N_REC = 7;
export const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};
export const VESICLES: V3[] = Array.from({ length: N_VES }, (_, k) => (k < N_DOCK ? [-0.9 + k * 0.6, 0.95, (rnd(k, 1) - 0.5) * 0.6] : [-0.9 + rnd(k, 2) * 1.8, 1.4 + rnd(k, 3) * 0.9, (rnd(k, 4) - 0.5) * 1.2]) as V3);
export const DOCK: V3[] = Array.from({ length: N_DOCK }, (_, k) => [-0.9 + k * 0.6, 0.48, (rnd(k, 1) - 0.5) * 0.6] as V3);
export const RECEPTORS: V3[] = Array.from({ length: N_REC }, (_, k) => [-1.35 + k * 0.45, -0.32, (k % 2 ? 0.35 : -0.25)] as V3);
export const TRANSPORTER: V3 = [1.45, 0.35, 0];
export const CA_CH: V3[] = [[-1.35, 0.5, 0.3], [0.85, 0.42, -0.3]];

const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

export function vesiclePos(k: number, e: number, drug: SynDrug): { p: V3; s: number } {
  if (k >= N_DOCK) return { p: [VESICLES[k][0], VESICLES[k][1] + Math.sin(e / 400 + k) * 0.02, VESICLES[k][2]], s: 1 };
  const d = ease((e - T.fuse) / (T.dock - T.fuse));
  const p = lerp3(VESICLES[k], DOCK[k], d);
  if (drug === "botox") return { p, s: 1 };
  const f = ease((e - T.dock) / 500);
  return { p, s: 1 - f };
}

/** Where transmitter molecule i is, e ms after the signal arrived. s = scale (0 hides it). */
export function moleculePos(i: number, e: number, drug: SynDrug): { p: V3; s: number; bound: boolean } {
  const k = i % N_DOCK;
  const ves = vesiclePos(k, e, drug).p;
  const jit: V3 = [(rnd(i, 5) - 0.5) * 0.14, (rnd(i, 6) - 0.5) * 0.14, (rnd(i, 7) - 0.5) * 0.14];
  const inVes: V3 = [ves[0] + jit[0], ves[1] + jit[1], ves[2] + jit[2]];
  if (e < T.dock || drug === "botox") return { p: inVes, s: e < 0 ? 1 : 1, bound: false };
  const binder = i % 3 === 0;
  const r = RECEPTORS[(i / 3) % N_REC | 0];
  const free: V3 = [-1.5 + rnd(i, 8) * 3, -0.18 + rnd(i, 9) * 0.5, (rnd(i, 10) - 0.5) * 1.6];
  const canBind = binder && drug !== "blocker";
  const target: V3 = canBind ? [r[0], r[1] + 0.12, r[2]] : free;
  const out = ease((e - T.dock) / (T.bind - T.dock + 300));
  let p = lerp3([DOCK[k][0] + jit[0], 0.35, DOCK[k][2] + jit[2]], target, out);
  // a little wandering in the gap
  const w = Math.min(1, out) * (canBind && e > T.bind ? 0 : 1);
  p = [p[0] + Math.sin(e / 300 + i) * 0.05 * w, p[1] + Math.cos(e / 260 + i * 1.3) * 0.03 * w, p[2] + Math.sin(e / 340 + i * 0.7) * 0.05 * w];
  if (e < T.clear || drug === "reuptake") {
    const bound = canBind && e >= T.bind && (drug !== "reuptake" || Math.sin(e / 500 + i) > -0.3);
    return { p, s: 1, bound };
  }
  // reuptake: back through the transporter into the ending; a few are broken down
  const c = ease((e - T.clear - (i % 6) * 120) / 1400);
  if (i % 5 === 0) return { p, s: 1 - c, bound: false };
  const q = c < 0.6 ? lerp3(p, TRANSPORTER, c / 0.6) : lerp3(TRANSPORTER, [TRANSPORTER[0] - 0.4, 1.0, 0], (c - 0.6) / 0.4);
  return { p: q, s: c >= 1 ? 0 : 1, bound: false };
}

/** How strongly the receiving cell is being signalled (0 to 1) at time e. */
export function response(e: number, drug: SynDrug) {
  if (e < 0 || drug === "botox" || drug === "blocker") return 0;
  if (e < T.bind) return Math.max(0, (e - T.dock) / (T.bind - T.dock)) * 0.6;
  if (e < T.clear) return 1;
  if (drug === "reuptake") return 0.85;
  return Math.max(0, 1 - (e - T.clear) / 1600);
}

const DRUGS: { id: SynDrug; name: string; text: string }[] = [
  { id: "none", name: "No drug", text: "" },
  { id: "reuptake", name: "Reuptake blocker (like an SSRI)", text: "The transporter is blocked, so the transmitter stays in the gap and keeps binding. The message lasts much longer. SSRIs do this at serotonin synapses; cocaine does it at dopamine synapses." },
  { id: "blocker", name: "Receptor blocker (antagonist)", text: "Blocker molecules sit in the receptors without switching them on. The transmitter is released but has nowhere to bind, so the receiving cell hears nothing. Most antipsychotics block dopamine D2 receptors this way." },
  { id: "botox", name: "Botulinum toxin", text: "The toxin cuts the proteins vesicles need to fuse. Calcium still enters and the vesicles dock, but nothing is released. At nerve-muscle synapses this paralyses the muscle, which is how it smooths wrinkles and, in food poisoning, can stop breathing." },
];

function stageText(id: (typeof STAGES)[number]["id"], drug: SynDrug, tx: string) {
  switch (id) {
    case "arrive":
      return "An action potential arrives at the nerve ending. Inside, the transmitter waits packed in tiny bubbles (vesicles).";
    case "calcium":
      return "The change in voltage opens calcium channels in the ending's wall. Calcium floods in: this is the trigger for release.";
    case "fuse":
      return drug === "botox" ? "Calcium is in and the vesicles move to the wall and dock, but botulinum toxin has cut their fusion proteins. They cannot open." : `Calcium makes the docked vesicles fuse with the wall and burst open, spilling ${tx} into the gap (the synaptic cleft, about 20 millionths of a millimetre wide).`;
    case "bind":
      return drug === "botox" ? "No transmitter was released, so the receptors stay empty and the receiving cell gets no message." : drug === "blocker" ? `The ${tx} crosses the gap, but blocker molecules already fill the receptors. Nothing switches on.` : `The ${tx} drifts across the gap and fits into receptors on the receiving cell, like a key in a lock. Ion channels open and the receiving cell is signalled.`;
    case "clear":
      return drug === "reuptake" ? `Normally transporter pumps would now pull the ${tx} back in. They are blocked, so it lingers and keeps binding.` : drug === "botox" ? "Nothing to clear: the vesicles are still full." : `The ${tx} lets go of the receptors. Transporter pumps pull most of it back into the ending to be reused; enzymes break a little down. The message ends.`;
  }
}

/** Loaded only when the device can draw 3D: three.js lives in this lazy chunk. */
const View3D = React.lazy(() => import("./synapse-scene-3d"));
export type SynViewProps = { fireAt: number | null; stage: number; running: boolean; reduce: boolean; drug: SynDrug; inView: boolean; colors: ReturnType<typeof useThemeColors>; onReady?: () => void };

/** When a stage starts, in ms after the signal arrived. */
export const stageStart = (stage: number) => STAGES.slice(0, Math.max(0, stage)).reduce((a, s) => a + s.ms, 0);
/**
 * Where the animation is within a stage that was entered `since` ms ago: it
 * plays the stage once and then holds on its last frame until the student
 * moves on (no running ahead of the words).
 */
export const stageElapsed = (stage: number, since: number, reduce: boolean) => {
  const st = Math.max(0, stage);
  const len = STAGES[Math.min(st, STAGES.length - 1)].ms - 1;
  return stageStart(st) + (reduce ? len : Math.min(len, Math.max(0, since)));
};

/** Elapsed ms in the message's timeline for the current stage, driven by frames only while the stage plays. */
export function useElapsed(fireAt: number | null, stage: number, reduce: boolean) {
  const [e, setE] = React.useState(-1);
  React.useEffect(() => {
    if (fireAt === null) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      const since = performance.now() - t0;
      setE(stageElapsed(stage, since, reduce));
      if (!reduce && since < STAGES[Math.min(Math.max(0, stage), STAGES.length - 1)].ms) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fireAt, stage, reduce]);
  return fireAt === null ? -1 : e;
}

export function SynapseScene({ d }: { d: Synapse3dData }) {
  const v = useSceneView();
  const box = React.useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const colors = useThemeColors(box);
  const tx = d.transmitter ?? "serotonin";
  const [drug, setDrug] = React.useState<SynDrug>("none");
  const [fireAt, setFireAt] = React.useState<number | null>(null);
  const journey = useJourney();
  const fire = () => {
    setFireAt(performance.now());
    sfx("zap");
    journey.start(`fire-${drug}`, STAGES.map((s) => ({ path: s.id, ms: s.ms, say: s.name, tone: "info" as const })));
    trackLearn({ type: "widget", kind: "synapse3d", item: drug });
  };
  const stage = journey.cur ? journey.leg : journey.done ? STAGES.length - 1 : -1;
  const e = useElapsed(fireAt, Math.max(0, stage), v.reduce);
  const resp = stage < 0 ? 0 : response(Math.max(0, e), drug);
  const dr = DRUGS.find((x) => x.id === drug)!;
  return (
    <SceneCard title={d.title ?? `A ${tx} synapse, up close`} caption={d.caption} tools={<ViewSwitch v={v} />} sound>
      <div ref={box} className="relative mt-3 h-[18rem] overflow-hidden rounded-xl border-2 border-foreground bg-background sm:h-[22rem]">
        {v.use3D ? (
          <Scene3DSlot flat={<SynapseFlat e={e} drug={drug} />} render={(onReady) => <View3D fireAt={fireAt} stage={stage} running={journey.active} reduce={v.reduce} drug={drug} inView={inView} colors={colors} onReady={onReady} />} />
        ) : <SynapseFlat e={e} drug={drug} />}
      </div>
      <ol className="mt-3 grid gap-1.5" aria-label="Steps">
        {STAGES.map((s, k) => (
          <li key={s.id} aria-current={k === stage ? "step" : undefined} className={cn("flex items-start gap-2.5 rounded-md border-2 px-3 py-2 transition-colors duration-fast", k === stage ? "border-foreground bg-muted" : "border-foreground/25 bg-card")}>
            <span aria-hidden className={cn("mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-xs font-bold", k === stage ? "bg-primary text-primary-foreground" : "bg-card")}>{k + 1}</span>
            <span className="min-w-0 [overflow-wrap:anywhere]">
              <span className="block font-semibold leading-snug">{s.name}</span>
              <span className="mt-0.5 block text-[0.92rem] leading-relaxed text-foreground/80">{stageText(s.id, drug, tx)}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className={cn(btn, "min-h-12 bg-primary px-5 text-primary-foreground hover:-translate-y-0.5")} onClick={fire}>
          {journey.done ? <RotateCcw className="size-4" aria-hidden /> : <Zap className="size-4" aria-hidden />} {journey.done ? "Fire again" : "Fire the nerve ending"}
        </button>
        <div className="flex min-w-40 flex-1 basis-full items-center gap-2 text-sm font-semibold sm:basis-auto">
          <span>Message received</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-foreground bg-background" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(resp * 100)} aria-label="Message received by the next cell">
            <div className="h-full origin-left bg-[var(--brand)] transition-transform duration-base" style={{ transform: `scaleX(${resp})` }} />
          </div>
          <span className="w-10 text-right tabular-nums">{Math.round(resp * 100)}%</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4" role="group" aria-label="Add a drug">
        {DRUGS.map((x) => (
          <button key={x.id} type="button" aria-pressed={drug === x.id} className={chip(drug === x.id, "text-xs sm:text-sm")} onClick={() => { setDrug(x.id); journey.clear(); setFireAt(null); sfx("tap"); }}>{x.name}</button>
        ))}
      </div>
      <div className={statusCls} role="status" aria-live="polite">
        {stage < 0 ? null : (
          <>
            <span className="font-semibold">{STAGES[stage].name}. </span>
            The receiving cell is getting {resp > 0.7 ? "a strong message" : resp > 0.1 ? "a weak message" : "no message"} ({Math.round(resp * 100)} percent).
          </>
        )}
        {drug !== "none" ? <span className="mt-2 block"><span className="font-semibold">{dr.name}: </span>{dr.text}</span> : null}
      </div>
      <QuickChallenge title="Drugs at the synapse" kind="synapse3d" items={SYN_CHALLENGE} />
    </SceneCard>
  );
}

/* ------------------------------------------------------------ flat view */

const S = 80, OX = 160;
const fx = (p: V3) => OX + p[0] * S;
const fy = (p: V3) => 140 - p[1] * 52;

export function SynapseFlat({ e, drug }: { e: number; drug: SynDrug }) {
  const caOn = e >= T.ca && e < T.dock + 400;
  return (
    <svg viewBox="0 0 320 220" className="block h-full w-full" role="img" aria-label="A synapse: the nerve ending above, the gap, and the receiving cell with receptors below.">
      <path d={`M${OX - 20} 0 V 16 C ${OX - 20} 40 ${OX - 140} 36 ${OX - 140} ${fy([0, 1.1, 0])} Q ${OX - 140} ${fy([0, 0.36, 0])} ${OX - 100} ${fy([0, 0.36, 0])} H ${OX + 100} Q ${OX + 140} ${fy([0, 0.36, 0])} ${OX + 140} ${fy([0, 1.1, 0])} C ${OX + 140} 36 ${OX + 20} 40 ${OX + 20} 16 V 0`} className="fill-[var(--status-info-bg)] stroke-foreground" strokeWidth="2" />
      <rect x="10" y={fy([0, -0.32, 0])} width="300" height="70" rx="12" className="fill-[var(--muted)] stroke-foreground" strokeWidth="2" />
      <text x="16" y="16" className="fill-muted-foreground text-[10px]">nerve ending</text>
      <text x="16" y="212" className="fill-muted-foreground text-[10px]">receiving cell</text>
      {e >= 0 && e < T.ca ? <circle cx={OX} cy={6 + (e / T.ca) * 30} r="7" className="fill-[var(--destructive)]" /> : null}
      {CA_CH.map((c, k) => (
        <g key={k}>
          <rect x={fx(c) - 6} y={fy([0, 0.42, 0]) - 8} width="12" height="14" rx="3" className={cn("stroke-foreground", caOn ? "fill-[var(--primary)]" : "fill-card")} strokeWidth="1.5" />
          {caOn ? [0, 1, 2].map((j) => <text key={j} x={fx(c) - 14 + j * 10} y={fy([0, 0.42, 0]) - 12 - ((e / 3 + j * 13) % 40)} className="fill-foreground text-[7px] font-bold">Ca</text>) : null}
        </g>
      ))}
      <rect x={fx(TRANSPORTER) - 7} y={fy(TRANSPORTER) - 6} width="14" height="14" rx="3" className="fill-card stroke-foreground" strokeWidth="1.5" />
      {drug === "reuptake" ? <text x={fx(TRANSPORTER)} y={fy(TRANSPORTER) + 5} textAnchor="middle" className="fill-[var(--destructive)] text-[11px] font-bold">✕</text> : null}
      <text x={fx(TRANSPORTER) + 10} y={fy(TRANSPORTER) - 8} className="fill-muted-foreground text-[9px]">pump</text>
      {Array.from({ length: N_VES }, (_, k) => {
        const vp = vesiclePos(k, Math.max(0, e), drug);
        return <circle key={k} cx={fx(vp.p)} cy={fy(vp.p)} r={11 * Math.max(0.05, vp.s)} className="fill-card stroke-foreground" strokeWidth="1.2" style={{ opacity: vp.s < 0.1 ? 0 : 1 }} />;
      })}
      {RECEPTORS.map((r, k) => {
        const on = e >= T.bind && response(e, drug) > 0.5;
        return (
          <g key={k}>
            <path d={`M${fx(r) - 9} ${fy(r) + 6} v -12 h 6 v 6 h 6 v -6 h 6 v 12`} className={cn("stroke-foreground", on ? "fill-[var(--brand)]" : "fill-card")} strokeWidth="1.5" />
            {drug === "blocker" ? <rect x={fx(r) - 3} y={fy(r) - 8} width="6" height="7" className="fill-foreground" /> : null}
          </g>
        );
      })}
      {e >= 0
        ? Array.from({ length: N_MOL }, (_, i) => {
            const m = moleculePos(i, e, drug);
            return m.s > 0.05 ? <circle key={i} cx={fx(m.p)} cy={fy(m.p)} r={3 * m.s} className={m.bound ? "fill-[var(--destructive)]" : "fill-[#f2b84b]"} /> : null;
          })
        : null}
    </svg>
  );
}
