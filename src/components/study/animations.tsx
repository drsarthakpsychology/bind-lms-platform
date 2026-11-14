"use client";

import * as React from "react";
import { RotateCcw, Zap } from "lucide-react";
import type { JourneyData, NeuronData, PathwaysData, ReceptorData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";
import { trackLearn } from "@/lib/learn/track";
import { StepPicker } from "./pacing";
import { C, Callout, E, L, Label, P, R, Sheet } from "@/components/sketch/ink";
import { JourneyArt } from "@/components/sketch/journey-art";
import { PathwaysArt, type PathId } from "@/components/sketch/pathways-art";
import { ReceptorArt } from "@/components/sketch/receptor-art";

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
      <div className="mt-3">
        <JourneyArt stops={stages.map((s) => s.id)} i={i} route={route} label={`${d.drug}: ${cur.name}`} className="mx-auto max-w-[28rem]" />
      </div>
      <StepPicker steps={stages.map((s) => ({ id: s.id, name: s.name, text: <Rich text={s.text} /> }))} i={i} onPick={setI} kind="journey" label="Stages" />
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* --------------------------------------------------------------- neuron */
/** The neuron: dendrites, cell body, an axon (with or without myelin) and its endings. A fired signal runs along the axon. */
function NeuronArt({ myelin, shot, label: aria }: { myelin: boolean; shot: number; label: string }) {
  return (
    <Sheet name="neuron" w={380} h={168} label={aria} className="mx-auto max-w-[32rem]">
      <P k="n-dend" d="M60 74 L30 48 M30 48 L14 52 M30 48 L26 30 M56 104 L24 118 M24 118 L12 112 M24 118 L22 134 M52 66 L48 38" sw={1.8} single />
      <E k="n-soma" cx={70} cy={88} w={52} h={46} sw={2.2} fill={C.wash} fillStyle="solid" />
      <E k="n-nuc" cx={68} cy={88} w={16} h={14} sw={1.4} fill={C.blue} gap={3} />
      <L k="n-axon" x1={94} y1={88} x2={318} y2={88} sw={2.4} />
      {myelin ? [116, 160, 204, 248, 292].map((x) => <R key={x} k={`n-my${x}`} x={x} y={79} w={30} h={18} sw={1.6} fill={C.paper} fillStyle="solid" />) : null}
      <P k="n-term" d="M318 88 L344 68 M318 88 L350 88 M318 88 L344 110" sw={1.8} single />
      {[[348, 66], [354, 88], [348, 112]].map(([x, y]) => <E key={y} k={`n-bout${y}`} cx={x} cy={y} w={11} h={11} sw={1.4} fill={C.lime} fillStyle="solid" />)}
      {shot > 0 ? <circle key={`${shot}-${myelin}`} cx={100} cy={88} r={7} fill={C.lime} stroke={C.ink} strokeWidth={1.6} className={myelin ? "vibha-ap-jump" : "vibha-ap-slide"} /> : null}
      <Callout k="n-l-soma" x={96} y={30} lines={["cell body"]} to={[84, 68]} size={14} />
      <Callout k="n-l-axon" x={200} y={30} lines={[myelin ? "myelin" : "axon"]} to={myelin ? [212, 78] : [206, 87]} size={14} />
      <Label x={10} y={158} size={14} bold={false}>{myelin ? "myelin: the signal jumps from gap to gap" : "no myelin: the signal creeps along"}</Label>
    </Sheet>
  );
}
const AP_TRACE: [number, number][] = [[0, -70], [8, -70], [10, -55], [13, 35], [16, 30], [20, -60], [24, -82], [32, -74], [40, -70]];

export function Neuron({ d }: { d: NeuronData }) {
  const [myelin, setMyelin] = React.useState(d.myelinated ?? true);
  const [strength, setStrength] = React.useState(70);
  const [shot, setShot] = React.useState(0);
  const fires = strength >= 50;
  const X = (t: number) => 56 + (t / 40) * 134;
  const Y = (mv: number) => 14 + ((40 - mv) / 130) * 86;
  const trace = fires ? AP_TRACE : ([[0, -70], [8, -70], [10, -62], [14, -68], [40, -70]] as [number, number][]);
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "How a neuron fires"}</p>
      <div className="mt-3">
        <NeuronArt myelin={myelin} shot={fires ? shot : 0} label={fires ? "The signal travels down the axon" : "Too weak: no signal"} />
      </div>
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
        <Sheet name="neuron-trace" w={200} h={124} label="Membrane voltage over time" className="mx-auto max-w-[16rem]">
          <L k="thr" x1={10} x2={190} y1={Y(-55)} y2={Y(-55)} stroke={C.red} sw={1.4} single dash="5 4" />
          <Label x={190} y={Y(-55) - 6} size={13} anchor="end" color={C.red}>threshold</Label>
          <P k={`trace-${shot}-${fires}`} d={trace.map(([t, v], k) => `${k ? "L" : "M"}${X(t)} ${Y(v)}`).join(" ")} stroke={C.blue} sw={2.2} single rough={0.4} />
          <Label x={6} y={Y(30) + 4} size={12} bold={false}>+30 mV</Label>
          <Label x={6} y={Y(-70) + 16} size={12} bold={false}>{"\u221270 mV"}</Label>
        </Sheet>
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
      <div className="mt-3">
        <PathwaysArt pick={pick as PathId} flow={flowFor} block={!blocker ? "none" : atypical ? "d2-2a" : "d2"} label={`Brain cut down the middle, front to the left, with the four dopamine pathways; ${sel.name} picked`} className="mx-auto max-w-[30rem]" />
      </div>
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
      <div className="mt-3">
        <ReceptorArt id={pick} receptor={d.receptor ?? "receptor"} label={`${L.name} at the ${d.receptor ?? "receptor"}: signal ${Math.round(L.signal * 100)}%`} className="mx-auto max-w-[28rem]" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {LIGANDS.map((x) => (
          <button key={x.id} type="button" aria-pressed={pick === x.id} onClick={() => { setPick(x.id); trackLearn({ type: "widget", kind: "receptor", prompt: x.id }); }} className={cn("min-h-10 rounded-md border-2 px-2.5 text-sm font-semibold", pick === x.id ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card")}>{x.name}</button>
        ))}
      </div>
      <p className="vibha-pop mt-3 rounded-xl bg-muted p-3 text-[0.95rem] leading-relaxed" key={pick} role="status" aria-live="polite">
        <span className="font-semibold">{L.name}: </span>{L.text} <span className="text-muted-foreground">Dashed line on the meter: background level.</span>
      </p>
      <button type="button" className={cn(btn, "mt-2 bg-card")} onClick={() => setPick("none")}><RotateCcw className="size-4" aria-hidden /> Empty the receptor</button>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}
