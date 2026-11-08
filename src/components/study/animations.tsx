"use client";

import * as React from "react";
import { RotateCcw, Zap } from "lucide-react";
import type { JourneyData, NeuronData, PathwaysData, ReceptorData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";
import { trackLearn } from "@/lib/learn/track";
import { StepPicker } from "./pacing";

/**
 * Animated explainers: how a medicine travels from the mouth to a brain
 * receptor, how a neuron fires, what blocking dopamine does in each pathway,
 * and how agonists, antagonists and inverse agonists differ at a receptor.
 * Everything animates with transform/opacity (smooth on low-end phones),
 * stops under reduce-motion, and every state is also described in words.
 */

const card = "rounded-2xl border-2 border-foreground bg-card p-4 sm:p-5 shadow-[var(--shadow-hard-sm)]";
const label = "text-xs font-semibold tracking-wide uppercase text-link";
const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-foreground px-4 font-semibold";

/* ------------------------------------------------------------- journey */
type Stage = { id: string; name: string; x: number; y: number; text: string };

export const ROUTE_STAGES: Record<NonNullable<JourneyData["route"]>, Stage[]> = {
  oral: [
    { id: "mouth", name: "Swallowed", x: 160, y: 62, text: "The tablet is swallowed. Nothing works yet: the medicine first has to reach the blood." },
    { id: "gut", name: "Gut", x: 160, y: 170, text: "The tablet dissolves and the medicine is absorbed through the wall of the small intestine. Food, gut speed and the tablet's coating change how fast this happens." },
    { id: "liver", name: "Liver (first pass)", x: 122, y: 146, text: "Blood from the gut goes to the liver first. Liver enzymes (the CYP family) break some of the medicine down before it ever reaches the body. This 'first-pass' loss is why oral doses are often higher than injected ones." },
    { id: "blood", name: "Bloodstream", x: 196, y: 126, text: "What survives travels in the blood. Much of it sticks to blood proteins; only the free part can leave the blood and act." },
    { id: "bbb", name: "Blood-brain barrier", x: 160, y: 44, text: "Brain blood vessels are tightly sealed. Only small, fat-soluble molecules (or ones carried by special transporters) get through. Medicines for the mind are designed to cross this barrier." },
    { id: "target", name: "Brain target", x: 172, y: 26, text: "" },
    { id: "out", name: "Leaves the body", x: 205, y: 165, text: "The liver changes the medicine into forms the kidneys can remove in urine. How fast this happens sets the half-life, and so how often a dose is needed." },
  ],
  iv: [
    { id: "vein", name: "Into a vein", x: 238, y: 120, text: "Given straight into a vein: no absorption step and no first-pass loss, so 100% reaches the blood at once." },
    { id: "blood", name: "Bloodstream", x: 196, y: 126, text: "It spreads round the body within a minute or two. Free (unbound) medicine can leave the blood and act." },
    { id: "bbb", name: "Blood-brain barrier", x: 160, y: 44, text: "Fat-soluble molecules cross quickly, which is why some IV medicines act within minutes." },
    { id: "target", name: "Brain target", x: 172, y: 26, text: "" },
    { id: "out", name: "Leaves the body", x: 205, y: 165, text: "Liver and kidneys clear it. The effect can be fast to start and fast to fade." },
  ],
  nasal: [
    { id: "nose", name: "Nasal spray", x: 168, y: 46, text: "Sprayed into the nose, the medicine is absorbed through the thin, blood-rich lining, skipping the gut and much of the liver's first pass." },
    { id: "blood", name: "Bloodstream", x: 196, y: 126, text: "It reaches the blood within minutes, so effects start quickly. This is why patients are observed for a while after a dose of nasal esketamine." },
    { id: "bbb", name: "Blood-brain barrier", x: 160, y: 44, text: "Small fat-soluble molecules cross into the brain quickly." },
    { id: "target", name: "Brain target", x: 172, y: 26, text: "" },
    { id: "out", name: "Leaves the body", x: 205, y: 165, text: "Cleared by the liver and kidneys." },
  ],
  depot: [
    { id: "muscle", name: "Muscle injection", x: 236, y: 160, text: "A long-acting ('depot') injection sits in the muscle as a reservoir." },
    { id: "slow", name: "Slow release", x: 214, y: 140, text: "The medicine seeps out of the muscle slowly, keeping levels steady for weeks without daily tablets. Useful when remembering tablets is hard." },
    { id: "blood", name: "Bloodstream", x: 196, y: 126, text: "Steady, low-variation levels in the blood." },
    { id: "bbb", name: "Blood-brain barrier", x: 160, y: 44, text: "It crosses into the brain like the tablet form does." },
    { id: "target", name: "Brain target", x: 172, y: 26, text: "" },
    { id: "out", name: "Leaves the body", x: 205, y: 165, text: "Because release is slow, the effect also fades slowly after the last injection." },
  ],
};

export function Journey({ d }: { d: JourneyData }) {
  const [route, setRoute] = React.useState<NonNullable<JourneyData["route"]>>(d.route ?? "oral");
  const stages = ROUTE_STAGES[route].map((s) => ({ ...s, text: d.notes?.[s.id] ?? (s.id === "target" ? `At last it reaches its target: ${d.target}. There it acts on receptors, and this is where the effect (and many side effects) begins.` : s.text) }));
  const [i, setI] = React.useState(0);
  const cur = stages[Math.min(i, stages.length - 1)];
  const trail = stages.slice(0, i + 1);
  const routes = (d.routes ?? [route]) as NonNullable<JourneyData["route"]>[];
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : `${d.drug} through the body`}</p>
      {routes.length > 1 ? (
        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Route">
          {routes.map((r) => (
            <button key={r} type="button" aria-pressed={route === r} onClick={() => { setRoute(r); setI(0); }} className={cn("min-h-10 rounded-md border-2 px-3 text-sm font-semibold", route === r ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card")}>
              {{ oral: "Tablet", iv: "Into a vein", nasal: "Nasal spray", depot: "Depot injection" }[r]}
            </button>
          ))}
        </div>
      ) : null}
      <svg viewBox="0 0 320 210" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`${d.drug}: ${cur.name}`}>
        {/* body */}
        <circle cx="160" cy="38" r="30" className="fill-[var(--muted)] stroke-foreground" strokeWidth="2" />
        <path d="M140 16 C 150 8, 172 8, 182 18 C 188 26, 186 38, 178 44 C 168 48, 150 48, 142 42 C 134 34, 134 24, 140 16 Z" className={cn("stroke-foreground transition-colors duration-slow", cur.id === "target" ? "fill-[var(--primary)]" : "fill-[var(--status-info-bg)]")} strokeWidth="1.5" />
        <rect x="150" y="66" width="20" height="14" className="fill-[var(--muted)] stroke-foreground" strokeWidth="2" />
        <rect x="112" y="80" width="96" height="110" rx="24" className="fill-[var(--muted)] stroke-foreground" strokeWidth="2" />
        <path d="M108 92 L 80 150 M212 92 L 244 150" className="stroke-foreground" strokeWidth="10" strokeLinecap="round" />
        <path d="M108 92 L 80 150 M212 92 L 244 150" className="stroke-[var(--muted)]" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="122" cy="146" rx="18" ry="11" className={cn("stroke-foreground", cur.id === "liver" ? "fill-[var(--status-alert-bg)]" : "fill-card")} strokeWidth="1.5" />
        <path d="M146 160 q 14 10 28 0 q 14 -10 0 20 q -14 10 -28 0" fill="none" className={cn(cur.id === "gut" ? "stroke-[var(--brand)]" : "stroke-foreground/50")} strokeWidth="3" />
        <path d="M196 96 L 196 176" className="stroke-[var(--destructive)]/70" strokeWidth="3" strokeDasharray="4 4" />
        <text x="205" y="104" className="fill-muted-foreground text-[8px]">blood</text>
        <text x="96" y="168" className="fill-muted-foreground text-[8px]">liver</text>
        {/* trail */}
        <polyline points={trail.map((s) => `${s.x},${s.y}`).join(" ")} fill="none" className="stroke-[var(--brand)]" strokeWidth="2.5" strokeDasharray="5 4" />
        {stages.map((s, k) => (
          <circle key={s.id} cx={s.x} cy={s.y} r={k <= i ? 4 : 3} className={k <= i ? "fill-foreground" : "fill-foreground/25"} />
        ))}
        {/* the medicine */}
        <g style={{ transform: `translate(${cur.x}px, ${cur.y}px)`, transition: "transform 900ms var(--ease-out-expo)" }}>
          <circle r="8" className="fill-[var(--primary)] stroke-foreground" strokeWidth="2" />
          <circle r="13" className="vibha-ping fill-none stroke-[var(--primary)]" strokeWidth="2" />
        </g>
      </svg>
      <StepPicker steps={stages.map((s) => ({ id: s.id, name: s.name, text: <Rich text={s.text} /> }))} i={i} onPick={setI} kind="journey" label="Stages" />
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* --------------------------------------------------------------- neuron */
const AP_TRACE: [number, number][] = [[0, -70], [8, -70], [10, -55], [13, 35], [16, 30], [20, -60], [24, -82], [32, -74], [40, -70]];

export function Neuron({ d }: { d: NeuronData }) {
  const [myelin, setMyelin] = React.useState(d.myelinated ?? true);
  const [strength, setStrength] = React.useState(70);
  const [shot, setShot] = React.useState(0);
  const fires = strength >= 50;
  const X = (t: number) => 10 + (t / 40) * 140;
  const Y = (mv: number) => 10 + ((40 - mv) / 130) * 80;
  const trace = fires ? AP_TRACE : ([[0, -70], [8, -70], [10, -62], [14, -68], [40, -70]] as [number, number][]);
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "How a neuron fires"}</p>
      <svg viewBox="0 0 320 120" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={fires ? "The signal travels down the axon" : "Too weak: no signal"}>
        {/* dendrites + soma */}
        <path d="M10 40 L 34 52 M10 72 L 34 62 M18 30 L 38 50" className="stroke-foreground" strokeWidth="2" />
        <circle cx="48" cy="58" r="18" className="fill-[var(--status-info-bg)] stroke-foreground" strokeWidth="2" />
        <text x="48" y="61" textAnchor="middle" className="fill-foreground text-[7px] font-semibold">cell body</text>
        {/* axon */}
        <line x1="66" y1="58" x2="282" y2="58" className="stroke-foreground" strokeWidth="3" />
        {myelin ? [0, 1, 2, 3, 4].map((k) => <rect key={k} x={80 + k * 40} y="50" width="30" height="16" rx="7" className="fill-card stroke-foreground" strokeWidth="1.5" />) : null}
        {/* terminal */}
        <path d="M282 58 L 300 44 M282 58 L 302 58 M282 58 L 300 72" className="stroke-foreground" strokeWidth="2" />
        {[44, 58, 72].map((y) => <circle key={y} cx={304} cy={y} r="4" className="fill-[var(--primary)] stroke-foreground" strokeWidth="1" />)}
        {/* the travelling signal */}
        {fires && shot > 0 ? (
          <circle key={`${shot}-${myelin}`} cx="66" cy="58" r="6" className={cn("fill-[var(--brand)]", myelin ? "vibha-ap-jump" : "vibha-ap-slide")} />
        ) : null}
        <text x="80" y="96" className="fill-muted-foreground text-[8px]">{myelin ? "myelin sheath: the signal jumps between gaps (nodes of Ranvier)" : "no myelin: the signal creeps along every bit of membrane"}</text>
      </svg>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="flex flex-col gap-1 text-sm font-semibold">
          <span className="flex justify-between"><span>Stimulus strength</span><span className="tabular-nums">{strength < 50 ? "below threshold" : "above threshold"}</span></span>
          <input type="range" min={0} max={100} value={strength} onChange={(e) => setStrength(Number(e.target.value))} className="h-8 w-full accent-[var(--brand)]" />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={cn(btn, "bg-primary text-primary-foreground")} onClick={() => { setShot((s) => s + 1); trackLearn({ type: "widget", kind: "neuron", ok: true }); }}><Zap className="size-4" aria-hidden /> Fire</button>
          <button type="button" aria-pressed={myelin} className={cn(btn, myelin ? "bg-foreground text-background" : "bg-card")} onClick={() => setMyelin(!myelin)}>{myelin ? "Myelin on" : "Myelin off"}</button>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-center">
        <svg viewBox="0 0 160 100" className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label="Membrane voltage over time">
          <line x1="10" x2="150" y1={Y(-55)} y2={Y(-55)} className="stroke-[var(--destructive)]/60" strokeDasharray="3 3" />
          <text x="110" y={Y(-55) - 2} className="fill-muted-foreground text-[6px]">threshold</text>
          <polyline key={`${shot}-${fires}`} points={trace.map(([t, v]) => `${X(t)},${Y(v)}`).join(" ")} fill="none" className="vibha-draw stroke-foreground" strokeWidth="2" pathLength={1} />
          <text x="4" y={Y(30)} className="fill-muted-foreground text-[6px]">+30 mV</text>
          <text x="4" y={Y(-70) + 8} className="fill-muted-foreground text-[6px]">−70 mV</text>
        </svg>
        <p className="text-[0.95rem] leading-relaxed" role="status">
          {shot === 0
            ? ""
            : fires
              ? <>Threshold reached, so it is all or none: sodium rushes in (the spike up), then potassium flows out (the fall and a brief dip below resting). {myelin ? "With myelin the signal leaps from gap to gap, many times faster." : "Without myelin it travels slowly; this is part of what goes wrong in multiple sclerosis."} At the end, the terminal releases its messengers.</>
              : "Below threshold: a small blip that fades. No action potential, and nothing is released. A neuron never fires 'a little'; it fires fully or not at all."}
        </p>
      </div>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* ------------------------------------------------------------- pathways */
export const DA_PATHS = [
  { id: "mesolimbic", name: "Mesolimbic", from: [150, 112], to: [118, 92], via: [136, 96], role: "reward and motivation; overactive in psychosis (hallucinations, delusions)", blocked: "Positive symptoms ease. This is the effect you want.", rescued: "Still blocked enough: positive symptoms stay controlled." },
  { id: "mesocortical", name: "Mesocortical", from: [150, 112], to: [70, 60], via: [110, 70], role: "thinking, planning and drive; underactive in negative and cognitive symptoms", blocked: "Can worsen apathy, flat mood and slowed thinking.", rescued: "Serotonin 2A block lets more dopamine through here: less worsening of negative symptoms." },
  { id: "nigrostriatal", name: "Nigrostriatal", from: [158, 108], to: [124, 74], via: [146, 86], role: "movement control", blocked: "Movement side effects: stiffness, tremor, restlessness (akathisia), and later tardive dyskinesia.", rescued: "Less blocked in practice: fewer movement side effects." },
  { id: "tuberoinfundibular", name: "Tuberoinfundibular", from: [130, 104], to: [132, 122], via: [128, 114], role: "dopamine here keeps prolactin low", blocked: "Prolactin rises: breast changes, missed periods, sexual problems.", rescued: "Prolactin rise is usually smaller (with exceptions such as risperidone)." },
] as const;

export function Pathways({ d }: { d: PathwaysData }) {
  const [blocker, setBlocker] = React.useState(false);
  const [atypical, setAtypical] = React.useState(false);
  const [pick, setPick] = React.useState<string>(DA_PATHS[0].id);
  const sel = DA_PATHS.find((p) => p.id === pick)!;
  const flowFor = (id: string) => (!blocker ? 1 : atypical && (id === "mesocortical" || id === "nigrostriatal" || id === "tuberoinfundibular") ? 0.6 : 0.2);
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "The four dopamine pathways"}</p>
      <svg viewBox="30 30 200 110" className="mt-3 w-full rounded-xl border-2 border-foreground bg-background" role="group" aria-label="Brain seen from the side, with dopamine pathways">
        <path d="M50 92 C 40 60, 70 36, 112 38 C 160 38, 196 56, 198 86 C 200 106, 184 116, 166 114 L 160 132 L 150 132 L 148 116 C 120 120, 70 120, 50 92 Z" className="fill-[var(--muted)] stroke-foreground" strokeWidth="2" />
        <text x="62" y="54" className="fill-muted-foreground text-[6px]">front</text>
        <circle cx="152" cy="112" r="4" className="fill-foreground" />
        <text x="157" y="122" className="fill-foreground text-[6px] font-semibold">VTA / substantia nigra</text>
        {DA_PATHS.map((p) => {
          const f = flowFor(p.id);
          const dPath = `M${p.from[0]} ${p.from[1]} Q ${p.via[0]} ${p.via[1]} ${p.to[0]} ${p.to[1]}`;
          return (
            <g key={p.id} role="button" tabIndex={0} aria-label={p.name} aria-pressed={pick === p.id} onClick={() => setPick(p.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPick(p.id)} className="cursor-pointer outline-none">
              <path d={dPath} fill="none" strokeWidth={pick === p.id ? 4 : 3} strokeLinecap="round" className={cn("transition-all duration-slow", pick === p.id ? "stroke-[var(--brand)]" : "stroke-foreground/60")} style={{ opacity: 0.35 + f * 0.65 }} />
              <path d={dPath} fill="none" strokeWidth="2" strokeDasharray="2 7" className="vibha-dash stroke-[var(--primary)]" style={{ opacity: f, animationDuration: `${0.6 / Math.max(0.15, f)}s` }} />
              <circle cx={p.to[0]} cy={p.to[1]} r="3" className="fill-card stroke-foreground" strokeWidth="1.2" />
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {DA_PATHS.map((p) => (
          <button key={p.id} type="button" aria-pressed={pick === p.id} onClick={() => setPick(p.id)} className={cn("min-h-10 rounded-md border-2 px-2.5 text-sm font-semibold", pick === p.id ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card")}>{p.name}</button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" aria-pressed={blocker} className={cn(btn, blocker ? "bg-foreground text-background" : "bg-primary text-primary-foreground")} onClick={() => { setBlocker(!blocker); if (blocker) setAtypical(false); trackLearn({ type: "widget", kind: "pathways" }); }}>
          {blocker ? "Remove the D2 blocker" : "Add a D2 blocker (antipsychotic)"}
        </button>
        {blocker ? (
          <button type="button" aria-pressed={atypical} className={cn(btn, atypical ? "bg-foreground text-background" : "bg-card")} onClick={() => setAtypical(!atypical)}>
            {atypical ? "Serotonin 2A block on" : "Add serotonin 2A block (second generation)"}
          </button>
        ) : null}
      </div>
      <p className="vibha-pop mt-3 rounded-xl bg-muted p-3 text-[0.95rem] leading-relaxed" key={`${pick}-${blocker}-${atypical}`} role="status" aria-live="polite">
        <span className="font-semibold">{sel.name}: </span>{sel.role}.{" "}
        {blocker ? <span className="font-semibold">{atypical ? sel.rescued : sel.blocked}</span> : "Dopamine flows normally."}
      </p>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* ------------------------------------------------------------- receptor */
const LIGANDS = [
  { id: "none", name: "Nothing bound", signal: 0.15, shape: "", text: "Many receptors give a small background signal on their own (constitutive activity)." },
  { id: "full", name: "Full agonist", signal: 1, shape: "fill-[var(--primary)]", text: "Fits and switches the receptor fully on: maximum signal. The body's own neurotransmitter usually acts like this." },
  { id: "partial", name: "Partial agonist", signal: 0.5, shape: "fill-[var(--status-info-bg)]", text: "Fits but only half-switches the receptor on. When the natural messenger is low it raises the signal; when it is high it competes and lowers it. Aripiprazole works this way at dopamine D2 receptors." },
  { id: "antagonist", name: "Antagonist", signal: 0.15, shape: "fill-foreground/40", text: "Sits in the slot without switching anything on, and blocks the natural messenger from getting in. The signal stays at background." },
  { id: "inverse", name: "Inverse agonist", signal: 0, shape: "fill-[var(--destructive)]/60", text: "Binds and pushes the receptor below its background level: the signal falls under baseline. Some antihistamines and pimavanserin act like this." },
] as const;

export function Receptor({ d }: { d: ReceptorData }) {
  const [pick, setPick] = React.useState<(typeof LIGANDS)[number]["id"]>("none");
  const L = LIGANDS.find((x) => x.id === pick)!;
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : `What binds to the ${d.receptor ?? "receptor"}?`}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_7rem] sm:items-end">
        <svg viewBox="0 0 220 130" className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`${L.name} at the receptor: signal ${Math.round(L.signal * 100)}%`}>
          <rect x="0" y="62" width="220" height="16" className="fill-[var(--status-info-bg)]" />
          <text x="4" y="58" className="fill-muted-foreground text-[7px]">outside the cell</text>
          <text x="4" y="92" className="fill-muted-foreground text-[7px]">inside the cell</text>
          <path d="M92 40 L 92 100 L 128 100 L 128 40 L 120 40 L 120 56 L 100 56 L 100 40 Z" className={cn("stroke-foreground transition-colors duration-slow", L.signal >= 0.9 ? "fill-[var(--primary)]" : "fill-card")} strokeWidth="2" />
          <text x="110" y="114" textAnchor="middle" className="fill-foreground text-[7px] font-semibold">{d.receptor ?? "receptor"}</text>
          {pick !== "none" ? (
            <g key={pick} className="vibha-dock">
              <rect x="102" y="40" width="16" height="16" rx="4" className={cn("stroke-foreground", L.shape)} strokeWidth="1.5" />
            </g>
          ) : null}
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={110} cy={104 + k * 6} r={2 + L.signal * 2.5} className="fill-[var(--brand)] transition-all duration-slow" style={{ opacity: L.signal }} />
          ))}
        </svg>
        <div className="flex flex-col items-center gap-1" aria-hidden>
          <div className="relative h-28 w-10 overflow-hidden rounded-md border-2 border-foreground bg-card">
            <div className="absolute inset-x-0 bottom-0 bg-[var(--brand)] transition-all duration-slow" style={{ height: `${L.signal * 100}%` }} />
            <div className="absolute inset-x-0 border-t-2 border-dashed border-foreground" style={{ bottom: "15%" }} />
          </div>
          <span className="text-xs font-semibold">signal</span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {LIGANDS.map((x) => (
          <button key={x.id} type="button" aria-pressed={pick === x.id} onClick={() => { setPick(x.id); trackLearn({ type: "widget", kind: "receptor", prompt: x.id }); }} className={cn("min-h-10 rounded-md border-2 px-2.5 text-sm font-semibold", pick === x.id ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card")}>{x.name}</button>
        ))}
      </div>
      <p className="vibha-pop mt-3 rounded-xl bg-muted p-3 text-[0.95rem] leading-relaxed" key={pick} role="status" aria-live="polite">
        <span className="font-semibold">{L.name}: </span>{L.text} <span className="text-muted-foreground">Dashed line: background level.</span>
      </p>
      <button type="button" className={cn(btn, "mt-2 bg-card")} onClick={() => setPick("none")}><RotateCcw className="size-4" aria-hidden /> Empty the receptor</button>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}
