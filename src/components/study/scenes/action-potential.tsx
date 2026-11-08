"use client";

import * as React from "react";
import { ChevronRight, Lock, RotateCcw, Timer, Zap } from "lucide-react";
import type { ActionPotentialData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { sfx } from "./sfx";
import { Missions, Scene3DSlot, SceneCard, ViewSwitch, btn, chip, statusCls, useInView, useSceneView, useThemeColors } from "./kit";

/**
 * A playable neuron. Each tap of Stimulate nudges the membrane voltage up;
 * small nudges fade unless they add up. At threshold an action potential
 * fires: sodium channels open, potassium channels follow, the voltage trace
 * draws live and the impulse races down the axon (jumping between nodes when
 * the axon has myelin). A stimulus during the refractory period is blocked.
 * Time is slowed down about a thousand times so it can be seen.
 */

export const REST = -70, THRESH = -55, PEAK = 30, UNDER = -80;
const RISE = 260, FALL = 320, RECOVER = 650; // ms of display time
const ABS = RISE + FALL; // absolute refractory: sodium channels are locked
const CYCLE = ABS + RECOVER;
const TAU = 700; // leak back to rest
const WINDOW = 6000; // ms of trace shown
export const NODES = 6;
export const travelMs = (myelin: boolean) => (myelin ? 640 : 2600);

export type Phase = "rest" | "rising" | "falling" | "under";
export type Sim = {
  t: number;
  v: number;
  ap: number | null; // when the current action potential began
  fired: { at: number; myelin: boolean }[];
  taps: number[]; // recent sub-threshold taps
  samples: [number, number][];
  event: { kind: "sub" | "fire" | "blocked" | "relative" | "sum"; at: number; v: number } | null;
  summed: boolean;
  blocked: boolean;
  challenge: { start: number; base: number } | null;
  best: number | null;
};

const initial = (): Sim => ({ t: 0, v: REST, ap: null, fired: [], taps: [], samples: [[0, REST]], event: null, summed: false, blocked: false, challenge: null, best: null });

export function phaseOf(s: Sim): Phase {
  if (s.ap === null) return "rest";
  const k = s.t - s.ap;
  if (k < RISE) return "rising";
  if (k < ABS) return "falling";
  if (k < CYCLE) return "under";
  return "rest";
}
/** Threshold right now: raised during the relative refractory period. */
export function thresholdOf(s: Sim) {
  if (phaseOf(s) !== "under") return THRESH;
  const k = (s.t - s.ap! - ABS) / RECOVER;
  return THRESH + 22 * (1 - k);
}

function apVoltage(k: number, from: number) {
  if (k < RISE) {
    const f = k / RISE;
    return from + (PEAK - from) * f * f * (3 - 2 * f);
  }
  if (k < ABS) {
    const f = (k - RISE) / FALL;
    return PEAK + (UNDER - PEAK) * (1 - Math.pow(1 - f, 1.6));
  }
  const f = (k - ABS) / RECOVER;
  return UNDER + (REST - UNDER) * (1 - Math.exp(-4 * f)) / (1 - Math.exp(-4));
}

/** Advance the neuron by dt ms. */
export function step(s: Sim, dt: number): Sim {
  const t = s.t + dt;
  let v = s.v;
  let ap = s.ap;
  if (ap !== null && t - ap < CYCLE) v = apVoltage(t - ap, THRESH);
  else {
    if (ap !== null) ap = null;
    v = REST + (v - REST) * Math.exp(-dt / TAU);
  }
  const last = s.samples[s.samples.length - 1];
  const samples = t - last[0] >= 25 ? [...s.samples.filter((p) => p[0] > t - WINDOW), [t, v] as [number, number]] : s.samples;
  let challenge = s.challenge;
  let best = s.best;
  if (challenge && t - challenge.start >= 10000) {
    const n = s.fired.slice(challenge.base).filter((f) => f.at <= challenge!.start + 10000).length;
    best = Math.max(best ?? 0, n);
    challenge = null;
  }
  return { ...s, t, v, ap, samples, challenge, best, taps: s.taps.filter((x) => t - x < 1200) };
}

/** A stimulus of `mv` millivolts arrives. */
export function stimulate(s: Sim, mv: number, myelin: boolean): Sim {
  const ph = phaseOf(s);
  if (ph === "rising" || ph === "falling") return { ...s, blocked: true, event: { kind: "blocked", at: s.t, v: s.v } };
  const v = s.v + mv;
  const th = thresholdOf(s);
  const samples = [...s.samples, [s.t, v] as [number, number]];
  if (v >= th) {
    const summed = s.summed || s.taps.length > 0;
    return { ...s, v: THRESH, ap: s.t, samples, fired: [...s.fired, { at: s.t, myelin }], taps: [], summed, event: { kind: s.taps.length > 0 ? "sum" : "fire", at: s.t, v } };
  }
  return { ...s, v, samples, taps: [...s.taps, s.t], event: { kind: ph === "under" ? "relative" : "sub", at: s.t, v } };
}

/** Loaded only when the device can draw 3D: three.js lives in this lazy chunk. */
const View3D = React.lazy(() => import("./action-potential-3d"));
/**
 * The 3D view reads the simulation from a ref inside its frame loop, so the
 * 3D tree does not re-render on every simulation step; it re-renders only
 * when myelin or "active" changes.
 */
export type ApViewProps = { simRef: React.RefObject<Sim>; myelin: boolean; active: boolean; inView: boolean; colors: ReturnType<typeof useThemeColors>; onStim: () => void; onReady?: () => void };

/** Nothing is happening: no spike, voltage at rest, no impulse travelling, no challenge. */
export function isIdle(s: Sim) {
  const last = s.fired[s.fired.length - 1];
  return s.ap === null && Math.abs(s.v - REST) < 0.02 && !s.challenge && (!last || s.t - last.at > 4000) && (!s.event || s.t - s.event.at > 1500);
}

export function ActionPotential({ d }: { d: ActionPotentialData }) {
  const v = useSceneView();
  const box = React.useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const colors = useThemeColors(box);
  const [sim, setSim] = React.useState<Sim>(initial);
  const [myelin, setMyelin] = React.useState(d.myelinated ?? true);
  const [mv, setMv] = React.useState(12);
  const simRef = React.useRef<Sim>(sim);
  React.useLayoutEffect(() => {
    simRef.current = sim;
  });
  const idle = isIdle(sim);

  // time flows on animation frames (not under reduced motion: then the student steps)
  React.useEffect(() => {
    if (v.reduce || !inView) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      // when the neuron is idle, keep the same state so nothing re-renders
      setSim((s) => (isIdle(s) ? s : step(s, dt)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v.reduce, inView]);

  const stim = React.useCallback(() => {
    // work out the result from the latest state, so the sound matches what happens
    const out = stimulate(simRef.current, mv, myelin);
    setSim(out);
    const kind = out.event?.kind;
    sfx(kind === "fire" || kind === "sum" ? "zap" : kind === "blocked" ? "bad" : "tap");
    trackLearn({ type: "widget", kind: "actionpotential", item: "stimulate" });
  }, [mv, myelin]);
  const stepBy = (ms: number) => setSim((s) => {
    let x = s;
    for (let k = 0; k < ms; k += 25) x = step(x, 25);
    return x;
  });
  const startChallenge = () => {
    setSim((s) => ({ ...s, challenge: { start: s.t, base: s.fired.length } }));
    trackLearn({ type: "widget", kind: "actionpotential", item: "challenge" });
  };

  const ph = phaseOf(sim);
  const th = thresholdOf(sim);
  const chLeft = sim.challenge ? Math.max(0, 10000 - (sim.t - sim.challenge.start)) : 0;
  const chCount = sim.challenge ? sim.fired.length - sim.challenge.base : 0;
  const won = (sim.best ?? 0) >= 3;
  const lastFire = sim.fired[sim.fired.length - 1];
  const travel = lastFire ? (sim.t - lastFire.at) / travelMs(lastFire.myelin) : 2;

  const PHASE_NAME: Record<Phase, string> = { rest: "back at rest", rising: "rising phase", falling: "falling phase", under: "undershoot" };
  const phaseText: Record<Phase, string> = {
    rest: "Resting at about minus 70 millivolts. The inside of the cell is negative. Sodium and potassium channels are closed; pumps keep sodium outside and potassium inside.",
    rising: "Rising phase: threshold reached, so voltage-gated sodium channels snap open. Sodium rushes in and the inside swings positive, up to about plus 30 millivolts. All or none: it always rises this far.",
    falling: "Falling phase: the sodium channels close and lock (inactivate) and potassium channels open. Potassium flows out and the voltage drops back down. Locked sodium channels mean no new action potential can start now.",
    under: "Undershoot: potassium channels are slow to close, so the voltage dips below resting before settling. The sodium channels have unlocked, but a stronger push than usual is needed (relative refractory period).",
  };
  const ev = sim.event;
  const evText = !ev
    ? "Press Stimulate to nudge the voltage up."
    : ev.kind === "blocked"
      ? "Blocked: that stimulus arrived during the absolute refractory period. The sodium channels are locked shut, so nothing can fire yet. This is why impulses travel one way and cannot run together."
      : ev.kind === "relative"
        ? `Too soon: during the undershoot the threshold is raised (about ${Math.round(thresholdOf(sim))} millivolts now), and your push reached only ${Math.round(ev.v)}. Wait a moment, or push harder.`
        : ev.kind === "sub"
          ? `Below threshold: the voltage rose to ${Math.round(ev.v)} millivolts, short of minus 55, and it is fading back. Tap again quickly so the pushes add up (summation).`
          : ev.kind === "sum"
            ? "Summation: your pushes added up past threshold, and it fired."
            : "Threshold reached: it fired.";
  // the travel note stays until the next stimulus, so it can be read
  const travelText = lastFire
    ? travel < 1
      ? lastFire.myelin
        ? "The impulse jumps from node to node along the myelinated axon (saltatory conduction): fast."
        : "The impulse creeps along every bit of the bare axon: slow."
      : "The impulse has reached the axon terminals, which release their transmitter into the synapse."
    : "";

  const missions = [
    { id: "fire", label: "Fire your first action potential", done: sim.fired.length > 0 },
    { id: "sum", label: "Add up small pushes to reach threshold", done: sim.summed },
    { id: "wall", label: "Hit the refractory wall", done: sim.blocked },
    { id: "race", label: "Fire with myelin on and with it off", done: sim.fired.some((f) => f.myelin) && sim.fired.some((f) => !f.myelin) },
    { id: "challenge", label: "Fire 3 in 10 seconds", done: won },
  ];

  return (
    <SceneCard title={d.title ?? "Make a neuron fire"} goal="Push the neuron past threshold, watch the impulse race down the axon, and fire 3 times in 10 seconds." caption={d.caption} tools={<ViewSwitch v={v} />} sound>
      <div ref={box} className="relative mt-3 h-[13rem] overflow-hidden rounded-xl border-2 border-foreground bg-background sm:h-[16rem]">
        {v.use3D ? (
          <Scene3DSlot flat={<NeuronFlat sim={sim} myelin={myelin} />} render={(onReady) => <View3D simRef={simRef} myelin={myelin} active={!idle} inView={inView} colors={colors} onStim={stim} onReady={onReady} />} />
        ) : <NeuronFlat sim={sim} myelin={myelin} />}
        {v.use3D ? <p className="pointer-events-none absolute bottom-1.5 left-2 rounded bg-background/80 px-1.5 text-xs text-muted-foreground">Drag to turn, pinch to zoom, tap the cell body to stimulate</p> : null}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Trace sim={sim} th={th} />
        <Channels phase={ph} />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr] sm:items-end">
        <button type="button" className={cn(btn, "min-h-14 bg-primary px-6 text-lg text-primary-foreground hover:-translate-y-0.5")} onClick={stim}>
          <Zap className="size-5" aria-hidden /> Stimulate
        </button>
        <label className="flex flex-col gap-1 text-sm font-semibold">
          <span className="flex justify-between"><span>Push size</span><span className="tabular-nums">{mv} millivolts</span></span>
          <input type="range" min={3} max={20} value={mv} onChange={(e) => setMv(Number(e.target.value))} className="h-11 w-full accent-[var(--brand)]" aria-label="Push size in millivolts" />
        </label>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" aria-pressed={myelin} className={chip(myelin)} onClick={() => setMyelin(!myelin)}>{myelin ? "Myelin on" : "Myelin off"}</button>
        {v.reduce ? (
          <button type="button" className={cn(btn, "bg-foreground text-background")} onClick={() => stepBy(150)}><ChevronRight className="size-4" aria-hidden /> Let time pass</button>
        ) : null}
        <button type="button" className={cn(btn, "bg-card")} onClick={startChallenge} disabled={!!sim.challenge}>
          <Timer className="size-4" aria-hidden /> {sim.challenge ? `${(chLeft / 1000).toFixed(1)} s left: ${chCount} of 3` : won ? "Challenge again" : "Challenge: 3 in 10 s"}
        </button>
        <button type="button" className={cn(btn, "bg-card text-sm")} onClick={() => setSim((s) => ({ ...initial(), fired: s.fired, summed: s.summed, blocked: s.blocked, best: s.best }))}><RotateCcw className="size-4" aria-hidden /> Reset voltage</button>
      </div>
      <div className={statusCls} role="status" aria-live="polite">
        <p><span className="font-semibold">Voltage: {Math.round(sim.v)} millivolts. </span>{sim.fired.length ? `Now: ${PHASE_NAME[ph]}.` : phaseText.rest}</p>
        {sim.fired.length ? (
          // a spike is over in about a second, so its three phases stay written out here to read at your own pace
          <ol className="mt-2 space-y-1" aria-label="The phases of an action potential">
            {(["rising", "falling", "under"] as Phase[]).map((k) => (
              <li key={k} aria-current={ph === k ? "step" : undefined} className={cn("rounded-md border-l-4 pl-2", ph === k ? "border-[var(--brand)] font-semibold" : "border-transparent")}>{phaseText[k]}</li>
            ))}
          </ol>
        ) : null}
        <p className="mt-1">{evText}{travelText ? ` ${travelText}` : ""}</p>
        {sim.best !== null && !sim.challenge ? <p className="mt-1 font-semibold">{won ? `Challenge won: ${sim.best} action potentials in 10 seconds.` : `Challenge: ${sim.best} of 3. Tip: make each push big enough, and wait for the spike to finish before pushing again.`}</p> : null}
        <p className="mt-1 text-sm text-muted-foreground">Fired so far: {sim.fired.length}. Shown about a thousand times slower than real life: a real spike lasts about a millisecond. {myelin ? "Myelinated axons conduct at up to about 120 metres a second." : "Thin bare axons conduct at about 1 metre a second."}</p>
      </div>
      <Missions items={missions} doneText="All missions done: threshold, summation, all or none, refractory period and myelin, in one neuron." />
    </SceneCard>
  );
}

/* --------------------------------------------------------- voltage trace */

function Trace({ sim, th }: { sim: Sim; th: number }) {
  const W = 300, H = 150;
  const X = (t: number) => 34 + ((t - (sim.t - WINDOW)) / WINDOW) * (W - 40);
  const Y = (mv: number) => 10 + ((40 - mv) / 130) * (H - 24);
  const pts = sim.samples.filter((p) => p[0] >= sim.t - WINDOW).map(([t, mv]) => `${X(t).toFixed(1)},${Y(mv).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`Voltage trace. Now ${Math.round(sim.v)} millivolts; threshold ${Math.round(th)}.`}>
      {[30, 0, -55, -70].map((mv) => (
        <g key={mv}>
          <line x1="34" x2={W - 4} y1={Y(mv)} y2={Y(mv)} className={mv === -55 ? "stroke-[var(--destructive)]" : "stroke-foreground/15"} strokeDasharray={mv === -55 ? "4 3" : undefined} />
          <text x="30" y={Y(mv) + 4} textAnchor="end" className="fill-muted-foreground text-[10px] tabular-nums">{mv}</text>
        </g>
      ))}
      <line x1="34" x2={W - 4} y1={Y(th)} y2={Y(th)} className="stroke-[var(--destructive)]" strokeWidth="1.5" style={{ opacity: th > THRESH + 0.5 ? 1 : 0 }} />
      <text x={W - 6} y={Y(-55) - 4} textAnchor="end" className="fill-[var(--destructive)] text-[10px] font-semibold">threshold</text>
      <polyline points={pts} fill="none" className="stroke-[var(--brand)]" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx={X(sim.t)} cy={Y(sim.v)} r="4" className="fill-[var(--brand)] stroke-background" strokeWidth="1.5" />
      <text x="34" y={H - 3} className="fill-muted-foreground text-[10px]">millivolts over the last 6 seconds (slowed)</text>
    </svg>
  );
}

/* ------------------------------------------------------- channel close-up */

function Channels({ phase }: { phase: Phase }) {
  const naOpen = phase === "rising";
  const naLocked = phase === "falling";
  const kOpen = phase === "falling" || phase === "under";
  return (
    <svg viewBox="0 0 200 150" className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`Close-up of the membrane. Sodium channels ${naOpen ? "open, sodium flowing in" : naLocked ? "locked shut" : "closed"}. Potassium channels ${kOpen ? "open, potassium flowing out" : "closed"}.`}>
      <style>{`
        @keyframes ap-in { from { transform: translateY(-22px); opacity: 0 } 30% { opacity: 1 } to { transform: translateY(34px); opacity: 0 } }
        @keyframes ap-out { from { transform: translateY(22px); opacity: 0 } 30% { opacity: 1 } to { transform: translateY(-34px); opacity: 0 } }
      `}</style>
      <text x="6" y="14" className="fill-muted-foreground text-[10px]">outside</text>
      <text x="6" y="144" className="fill-muted-foreground text-[10px]">inside</text>
      <text x="194" y="144" textAnchor="end" className="fill-foreground text-[10px] font-semibold">{naOpen ? "Na open: sodium in" : naLocked ? "Na locked, K open" : kOpen ? "K still open" : "all closed"}</text>
      <rect x="0" y="62" width="200" height="26" className="fill-[#f6e7a6]" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <text key={`na${k}`} x={14 + k * 24} y={k % 2 ? 36 : 48} className="fill-foreground text-[9px] font-bold">Na+</text>)}
      {[0, 1, 2, 3, 4, 5].map((k) => <text key={`k${k}`} x={18 + k * 30} y={k % 2 ? 112 : 124} className="fill-[var(--brand)] text-[9px] font-bold">K+</text>)}
      {/* sodium channels */}
      {[36, 96].map((x) => (
        <g key={x}>
          <rect x={x - 12} y="58" width="8" height="34" rx="2" className="fill-[var(--destructive)] stroke-foreground" />
          <rect x={x + 4} y="58" width="8" height="34" rx="2" className="fill-[var(--destructive)] stroke-foreground" />
          <rect x={x - 4} y="60" width="8" height="5" className="fill-foreground" style={{ transformBox: "fill-box", transformOrigin: "0 50%", transform: naOpen || naLocked ? "rotate(-80deg)" : "none", transition: "transform 160ms" }} />
          <circle cx={x} cy={naLocked ? 88 : 104} r="4" className="fill-foreground" style={{ transition: "cy 200ms" }} />
          {naOpen ? [0, 1, 2].map((k) => <text key={k} x={x - 7} y="50" className="fill-foreground text-[8px] font-bold" style={{ animation: `ap-in 520ms ${k * 150}ms linear infinite` }}>Na+</text>) : null}
          <text x={x} y="100" textAnchor="middle" className="fill-foreground text-[8px] font-semibold">Na</text>
        </g>
      ))}
      {/* potassium channel */}
      {[170].map((x) => (
        <g key={x}>
          <rect x={x - 12} y="58" width="8" height="34" rx="2" className="fill-[var(--brand)] stroke-foreground" />
          <rect x={x + 4} y="58" width="8" height="34" rx="2" className="fill-[var(--brand)] stroke-foreground" />
          <rect x={x - 4} y="85" width="8" height="5" className="fill-foreground" style={{ transformBox: "fill-box", transformOrigin: "0 50%", transform: kOpen ? "rotate(80deg)" : "none", transition: "transform 240ms" }} />
          {kOpen ? [0, 1].map((k) => <text key={k} x={x - 5} y="104" className="fill-[var(--brand)] text-[8px] font-bold" style={{ animation: `ap-out 640ms ${k * 220}ms linear infinite` }}>K+</text>) : null}
          <text x={x} y="56" textAnchor="middle" className="fill-foreground text-[8px] font-semibold">K</text>
        </g>
      ))}
      {naLocked ? <g transform="translate(120 40)"><Lock width={14} height={14} /></g> : null}
    </svg>
  );
}

/* ----------------------------------------------------- flat neuron view */

export function NeuronFlat({ sim, myelin }: { sim: Sim; myelin: boolean }) {
  const last = sim.fired[sim.fired.length - 1];
  const k = last ? (sim.t - last.at) / travelMs(last.myelin) : 2;
  const A0 = 74, A1 = 296;
  let x = A0 + (A1 - A0) * Math.min(1, k);
  if (last?.myelin && k < 1) x = A0 + ((A1 - A0) * Math.floor(k * NODES + 0.5)) / NODES;
  const glow = Math.max(0, Math.min(1, (sim.v - REST) / 15));
  return (
    <svg viewBox="0 0 330 150" className="block h-full w-full" role="img" aria-label="A neuron: dendrites, cell body, axon and terminals.">
      <path d="M14 40 L 44 66 M10 110 L 44 86 M24 22 L 50 60 M30 130 L 52 92" className="stroke-foreground" strokeWidth="3" strokeLinecap="round" />
      <circle cx="58" cy="76" r="24" className="stroke-foreground" strokeWidth="2.5" fill={`color-mix(in oklab, var(--brand) ${Math.round(glow * 70)}%, var(--status-info-bg))`} />
      <text x="58" y="80" textAnchor="middle" className="fill-foreground text-[10px] font-semibold">cell body</text>
      <line x1={A0} y1="76" x2={A1} y2="76" className="stroke-foreground" strokeWidth="4" />
      {myelin ? Array.from({ length: NODES }, (_, i) => <rect key={i} x={A0 + 4 + (i * (A1 - A0)) / NODES} y="66" width={(A1 - A0) / NODES - 8} height="20" rx="9" className="fill-card stroke-foreground" strokeWidth="1.5" />) : null}
      <path d={`M${A1} 76 L ${A1 + 20} 56 M${A1} 76 L ${A1 + 24} 76 M${A1} 76 L ${A1 + 20} 96`} className="stroke-foreground" strokeWidth="3" />
      {[56, 76, 96].map((y) => <circle key={y} cx={A1 + 24} cy={y} r="6" className={k >= 1 && k < 1.4 ? "fill-[var(--primary)] stroke-foreground" : "fill-card stroke-foreground"} strokeWidth="1.5" />)}
      {last && k < 1 ? <circle cx={x} cy="76" r="9" className="fill-[var(--destructive)] stroke-background" strokeWidth="2" /> : null}
      <text x={A0} y="128" className="fill-muted-foreground text-[11px]">{myelin ? "myelin: the impulse jumps between the gaps (nodes of Ranvier)" : "no myelin: the impulse creeps along"}</text>
    </svg>
  );
}
