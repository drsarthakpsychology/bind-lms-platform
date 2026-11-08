"use client";

import * as React from "react";
import { Zap } from "lucide-react";
import type { BrainSlicerData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { QuickChallenge, type ChallengeQ } from "./challenge";
import { sfx } from "./sfx";

const SLICER_CHALLENGE: ChallengeQ[] = [
  { q: "Which slice runs from ear to ear, so you look at it from the front?", options: ["Axial", "Sagittal", "Coronal"], answer: 2, why: "A coronal slice runs ear to ear. Axial slices are horizontal, like looking down from above; sagittal slices divide left from right." },
  { q: "For depression, where does the rTMS coil usually go?", options: ["Over the left dorsolateral prefrontal cortex", "Over the back of the head", "Over the right temple"], answer: 0, why: "High-frequency rTMS for depression targets the left DLPFC, found by the 5 cm rule, the F3 position or an MRI scan. Its effect reaches the deeper mood circuit through connections." },
  { q: "Which ECT placement causes the fewest memory side effects?", options: ["Bitemporal", "Right unilateral", "All three are the same"], answer: 1, why: "Right unilateral ECT spares the language-dominant left side and causes fewer memory problems, but it needs a dose about six times the seizure threshold to work as well." },
  { q: "Does rTMS need an anaesthetic?", options: ["Yes, the same as ECT", "No: the patient stays awake, and memory is not affected", "Only for the first session"], answer: 1, why: "rTMS uses a magnetic field and does not aim for a seizure, so there is no anaesthetic. Scalp discomfort and headache are common; seizures are rare." },
];
import { ModeTabs, Scene3DSlot, SceneCard, ViewSwitch, btn, chip, statusCls, useInView, useSceneView, useThemeColors, type V3 } from "./kit";
import { PLANE_NAME, RANGE, partsSeen, type Plane } from "./brain-slice";
import { SliceCanvas, getSlice } from "./slice-canvas";

/**
 * A brain-scan slicer. Scroll axial, coronal and sagittal slices through the
 * brain and read what is at each level; then switch to brain stimulation and
 * see where an rTMS coil sits for depression and where ECT electrodes go
 * (bitemporal, bifrontal, right unilateral), with what each placement means
 * for effect and memory side effects. The scan is always 2D, as real scans
 * are; the 3D head shows where the slice, coil or electrodes are.
 */

export type SlicerMode = "slice" | "tms" | "ect";
export type Placement = "bt" | "bf" | "rul";

/** Head surface positions, in brain coordinates (a = front, y = up, z = out to the left). */
export const HEAD = { c: [-0.05, 0.05, 0] as V3, r: [1.92, 1.38, 1.36] as V3 };
/** Push a brain point outwards from the head centre onto the scalp. */
export function onScalp(p: V3, lift = 1.0): V3 {
  const d: V3 = [p[0] - HEAD.c[0], p[1] - HEAD.c[1], p[2] - HEAD.c[2]];
  const k = 1 / Math.sqrt((d[0] / HEAD.r[0]) ** 2 + (d[1] / HEAD.r[1]) ** 2 + (d[2] / HEAD.r[2]) ** 2);
  return [HEAD.c[0] + d[0] * k * lift, HEAD.c[1] + d[1] * k * lift, HEAD.c[2] + d[2] * k * lift];
}

export const DLPFC: V3 = [0.95, 0.62, 0.72];
export const SGACC: V3 = [0.62, -0.02, 0.06];
export const ELECTRODES: Record<Placement, V3[]> = {
  bt: [onScalp([0.75, 0.05, 1]), onScalp([0.75, 0.05, -1])],
  bf: [onScalp([1.55, 0.72, 0.45]), onScalp([1.55, 0.72, -0.45])],
  rul: [onScalp([0.75, 0.05, -1]), onScalp([-0.1, 1.3, -0.25])],
};

export const PLACEMENTS: { id: Placement; name: string; where: string; path: string; effect: string; memory: string }[] = [
  {
    id: "bt",
    name: "Bitemporal",
    where: "One electrode on each temple (the frontotemporal position), on both sides of the head.",
    path: "The current crosses the whole head from temple to temple, through both temporal lobes and close to both hippocampi.",
    effect: "The oldest and most reliable placement, and often the fastest to work. Used when speed matters most: severe depression with suicidal risk or refusal to eat, catatonia, or when other placements have failed.",
    memory: "The most memory side effects and the most confusion (delirium) after treatment. The dose is therefore kept only moderately above the seizure threshold.",
  },
  {
    id: "bf",
    name: "Bifrontal",
    where: "One electrode on each side of the forehead, about 5 cm above the outer corner of each eye.",
    path: "The current runs across the front of both frontal lobes, further from the temporal lobes and hippocampi.",
    effect: "Several trials found it about as effective as bitemporal and well-dosed right unilateral ECT. The seizure threshold tends to be higher, and a seizure on the EEG may come without visible movement, so EEG monitoring helps.",
    memory: "May spare memory more than bitemporal ECT, but the evidence is still preliminary.",
  },
  {
    id: "rul",
    name: "Right unilateral",
    where: "One electrode on the right temple, the other on the top of the head just to the right of the midline (the d'Elia placement).",
    path: "The current stays mostly in the right hemisphere, away from the left hemisphere's language and verbal memory areas.",
    effect: "As effective as bilateral ECT only when the dose is high: about six times the seizure threshold. A dose just above threshold gives a seizure but works poorly.",
    memory: "Clearly fewer memory side effects than bitemporal ECT, which is why many services start with it.",
  },
];
export const ECT_COMMON = "Whatever the placement, ECT is given under a short general anaesthetic with a muscle relaxant (in India the Mental Healthcare Act 2017 forbids ECT without them), and it works through the seizure, which spreads through both hemispheres. Memory problems mostly affect events around the treatment course and new learning, and usually improve over the weeks after the course ends.";
export const TMS_TEXT = {
  where: "A figure-of-eight coil rests on the scalp over the left dorsolateral prefrontal cortex (DLPFC), found by measuring about 5 cm forward from the spot that makes the thumb twitch, by a head measurement (the F3 position), or with MRI guidance.",
  how: "Rapid magnetic pulses pass painlessly through the skull and induce small electric currents in the cortex just under the coil, about 2 to 3 cm deep. The effect spreads along connections to deeper mood circuits, such as the subgenual cingulate cortex, which is overactive in depression.",
  course: "Sessions are daily on weekdays for 4 to 6 weeks. Standard 10 Hz stimulation takes about 40 minutes; intermittent theta burst gives a similar effect in about 3 minutes.",
  safety: "The person is awake, needs no anaesthesia and has no memory side effects. Scalp discomfort and headache are the commonest problems; seizures are rare. It is not used with metal implants in or near the head.",
};

const RANGE_PCT = (plane: Plane, u: number) => Math.round(((u - RANGE[plane].min) / (RANGE[plane].max - RANGE[plane].min)) * 100);

const View3D = React.lazy(() => import("./brain-slicer-3d"));
export type SlicerViewProps = { mode: SlicerMode; plane: Plane; u: number; placement: Placement; firing: number; inView: boolean; colors: ReturnType<typeof useThemeColors>; onReady?: () => void };

const START: Record<Plane, number> = { axial: 0.15, coronal: 0.9, sagittal: 0.35 };

export function BrainSlicer({ d }: { d: BrainSlicerData }) {
  const v = useSceneView();
  const box = React.useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const colors = useThemeColors(box);
  const [mode, setMode] = React.useState<SlicerMode>(d.start ?? "slice");
  const [plane, setPlane] = React.useState<Plane>("coronal");
  const [pos, setPos] = React.useState<Record<Plane, number>>(START);
  const [tint, setTint] = React.useState(true);
  const [placement, setPlacement] = React.useState<Placement>("bt");
  const [seenPl, setSeenPl] = React.useState<Placement[]>(["bt"]);
  const [firing, setFiring] = React.useState(0);
  const [planesSeen, setPlanesSeen] = React.useState<Plane[]>(["coronal"]);
  const u = pos[plane];
  const sl = getSlice(plane, u, tint);
  const parts = partsSeen(sl);
  const moveTo = (x: number) => {
    setPos({ ...pos, [plane]: x });
  };
  const pickPlane = (p: Plane) => {
    setPlane(p);
    const next = planesSeen.includes(p) ? planesSeen : [...planesSeen, p];
    setPlanesSeen(next);
    trackLearn({ type: "widget", kind: "brainslicer", item: p });
  };
  const pickPlacement = (p: Placement) => {
    setPlacement(p);
    sfx("zap");
    const next = seenPl.includes(p) ? seenPl : [...seenPl, p];
    setSeenPl(next);
    trackLearn({ type: "widget", kind: "brainslicer", item: `ect-${p}` });
  };
  const fire = () => {
    setFiring((f) => f + 1);
    sfx("pulse");
    trackLearn({ type: "widget", kind: "brainslicer", item: "tms" });
  };
  const pl = PLACEMENTS.find((x) => x.id === placement)!;
  const flat = <SlicerFlat mode={mode} plane={plane} u={u} placement={placement} firing={firing} />;

  return (
    <SceneCard title={d.title ?? "Slice the brain, then stimulate it"} caption={d.caption} tools={<ViewSwitch v={v} />} sound>
      <ModeTabs<SlicerMode> name="Mode" value={mode} onChange={setMode} modes={[{ id: "slice", label: "Scan slices" }, { id: "tms", label: "rTMS coil" }, { id: "ect", label: "ECT electrodes" }]} />
      <div className={cn("mt-3 grid gap-3", mode === "slice" && "sm:grid-cols-2")}>
        <div ref={box} className="relative h-[15rem] overflow-hidden rounded-xl border-2 border-foreground bg-background sm:h-[19rem]">
          {v.use3D ? (
            <Scene3DSlot flat={flat} render={(onReady) => <View3D mode={mode} plane={plane} u={u} placement={placement} firing={firing} inView={inView} colors={colors} onReady={onReady} />} />
          ) : flat}
        </div>
        {mode === "slice" ? (
          <div className="flex h-[15rem] items-center justify-center rounded-xl border-2 border-foreground bg-black p-1.5 sm:h-[19rem]">
            <SliceCanvas plane={plane} u={u} tint={tint} />
          </div>
        ) : null}
      </div>

      {mode === "slice" ? (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Slice plane">
            {(["axial", "coronal", "sagittal"] as Plane[]).map((p) => (
              <button key={p} type="button" aria-pressed={plane === p} className={chip(plane === p, "px-2 text-center text-xs sm:text-sm")} onClick={() => pickPlane(p)}>{PLANE_NAME[p].split(" ")[0]}</button>
            ))}
          </div>
          <label className="block text-sm font-semibold">
            <span className="flex justify-between"><span>Slice position: {RANGE[plane].lo}</span><span>{RANGE[plane].hi}</span></span>
            <input type="range" min={RANGE[plane].min} max={RANGE[plane].max} step={0.03} value={u} onChange={(e) => moveTo(Number(e.target.value))} className="h-11 w-full accent-[var(--brand)]" aria-label={`Slice position, ${RANGE[plane].lo} to ${RANGE[plane].hi}`} aria-valuetext={`${RANGE_PCT(plane, u)} percent of the way from ${RANGE[plane].lo} to ${RANGE[plane].hi}`} />
          </label>
          <button type="button" aria-pressed={tint} className={chip(tint)} onClick={() => setTint(!tint)}>{tint ? "Colours on" : "Colours off (grey scan)"}</button>
        </div>
      ) : null}
      {mode === "tms" ? (
        <div className="mt-3">
          <button type="button" className={cn(btn, "min-h-12 bg-primary px-5 text-primary-foreground hover:-translate-y-0.5")} onClick={fire}><Zap className="size-4" aria-hidden /> Fire a train of pulses</button>
        </div>
      ) : null}
      {mode === "ect" ? (
        <div className="mt-3 grid grid-cols-3 gap-1.5" role="group" aria-label="Electrode placement">
          {PLACEMENTS.map((p) => (
            <button key={p.id} type="button" aria-pressed={placement === p.id} className={chip(placement === p.id, "px-2 text-center text-xs sm:text-sm")} onClick={() => pickPlacement(p.id)}>{p.name}</button>
          ))}
        </div>
      ) : null}

      <div className={statusCls} role="status" aria-live="polite">
        {mode === "slice" ? (
          <>
            <p><span className="font-semibold">{PLANE_NAME[plane]} slice, {RANGE_PCT(plane, u)} percent of the way from {RANGE[plane].lo} to {RANGE[plane].hi}. </span>{plane === "sagittal" ? "Front is on the left." : "As on a real scan, the patient's right is on your left."}</p>
            <p className="mt-1"><span className="font-semibold">On this slice: </span>{parts.length ? parts.join(", ") : "only scalp, skull and fluid: you are past the edge of the brain"}.</p>
            <p className="mt-1 text-sm text-muted-foreground">Grey scale as on a T1 MRI: white matter is light, grey matter mid grey, fluid (ventricles and around the brain) dark, and the scalp bright.</p>
          </>
        ) : mode === "tms" ? (
          <>
            <p><span className="font-semibold">Where: </span>{TMS_TEXT.where}</p>
            <p className="mt-1"><span className="font-semibold">How it acts: </span>{TMS_TEXT.how}</p>
            <p className="mt-1"><span className="font-semibold">A course: </span>{TMS_TEXT.course}</p>
            <p className="mt-1"><span className="font-semibold">Safety: </span>{TMS_TEXT.safety}</p>
            {firing ? <p className="mt-1 font-semibold">Pulses fired: the cortex under the coil is stimulated, and the signal travels on to the deeper mood circuit.</p> : null}
          </>
        ) : (
          <>
            <p><span className="font-semibold">{pl.name}: </span>{pl.where}</p>
            <p className="mt-1"><span className="font-semibold">Current path: </span>{pl.path}</p>
            <p className="mt-1"><span className="font-semibold">Effect: </span>{pl.effect}</p>
            <p className="mt-1"><span className="font-semibold">Memory: </span>{pl.memory}</p>
            <p className="mt-1 text-sm">{ECT_COMMON}</p>
          </>
        )}
      </div>
      <QuickChallenge title="Slices, rTMS and ECT" kind="brainslicer" items={SLICER_CHALLENGE} />
    </SceneCard>
  );
}

/* ------------------------------------------------------------ flat twin */

/** Where the slice is (side or top outline with a cut line), or the head from above with coil or electrodes. */
export function SlicerFlat({ mode, plane, u, placement, firing }: { mode: SlicerMode; plane: Plane; u: number; placement: Placement; firing: number }) {
  if (mode === "slice") {
    // a side view for axial and coronal cuts, a view from above for sagittal cuts
    const side = plane !== "sagittal";
    const X = (a: number) => 160 - a * 70;
    const Y = (y: number) => 120 - y * 70;
    const Z = (z: number) => 120 - z * 70;
    return (
      <svg viewBox="0 0 320 240" className="block h-full w-full" role="img" aria-label={`Where the slice is: ${PLANE_NAME[plane]}.`}>
        {side ? (
          <>
            <ellipse cx="160" cy="112" rx="112" ry="66" className="fill-[#f4b6a6] stroke-foreground" strokeWidth="2" />
            <ellipse cx={X(-0.98)} cy={Y(-0.72)} rx="32" ry="22" className="fill-[#e8c39a] stroke-foreground" strokeWidth="1.5" />
            <rect x={X(0.08)} y={Y(-0.3)} width="16" height="70" rx="8" className="fill-[#c9b8a6] stroke-foreground" strokeWidth="1.5" />
            <text x="18" y="20" className="fill-muted-foreground text-[11px]">front</text>
            <text x="300" y="20" textAnchor="end" className="fill-muted-foreground text-[11px]">back</text>
            {plane === "axial" ? <line x1="30" x2="290" y1={Y(u)} y2={Y(u)} className="stroke-[var(--brand)]" strokeWidth="4" /> : <line x1={X(u)} x2={X(u)} y1="20" y2="220" className="stroke-[var(--brand)]" strokeWidth="4" />}
          </>
        ) : (
          <>
            {[1, -1].map((m) => <ellipse key={m} cx={160 + m * 0} cy={Z(m * 0.4)} rx="112" ry="26" className="fill-[#f4b6a6] stroke-foreground" strokeWidth="2" />)}
            <text x="18" y="20" className="fill-muted-foreground text-[11px]">front</text>
            <text x="300" y="20" textAnchor="end" className="fill-muted-foreground text-[11px]">back</text>
            <text x="300" y={Z(0.4) + 4} textAnchor="end" className="fill-foreground text-[10px]">left</text>
            <text x="300" y={Z(-0.4) + 4} textAnchor="end" className="fill-foreground text-[10px]">right</text>
            <line x1="30" x2="290" y1={Z(u)} y2={Z(u)} className="stroke-[var(--brand)]" strokeWidth="4" />
          </>
        )}
        <text x="160" y="234" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">The blue line is the slice</text>
      </svg>
    );
  }
  // the head from above, nose at the top; the patient's left is on the viewer's left in this view from above
  const P = (p: V3): [number, number] => [160 - p[2] * 95, 125 - p[0] * 60];
  const elec = ELECTRODES[placement];
  const [e0, e1] = elec.map(P);
  return (
    <svg viewBox="0 0 320 250" className="block h-full w-full" role="img" aria-label={mode === "tms" ? "The head from above with the coil over the left front." : `The head from above with the ${PLACEMENTS.find((x) => x.id === placement)!.name.toLowerCase()} electrodes.`}>
      <ellipse cx="160" cy="128" rx="100" ry="118" className="fill-[#efdcc9] stroke-foreground" strokeWidth="2" />
      <path d="M150 12 L160 0 L170 12" className="fill-[#efdcc9] stroke-foreground" strokeWidth="2" />
      <ellipse cx="58" cy="132" rx="8" ry="18" className="fill-[#efdcc9] stroke-foreground" strokeWidth="1.5" />
      <ellipse cx="262" cy="132" rx="8" ry="18" className="fill-[#efdcc9] stroke-foreground" strokeWidth="1.5" />
      <text x="40" y="236" className="fill-foreground text-[11px] font-bold">Left</text>
      <text x="280" y="236" textAnchor="end" className="fill-foreground text-[11px] font-bold">Right</text>
      <text x="160" y="24" textAnchor="middle" className="fill-muted-foreground text-[10px]">nose</text>
      {mode === "tms" ? (
        <g>
          {(() => {
            const [x, y] = P(DLPFC);
            return (
              <>
                <circle cx={x - 13} cy={y} r="13" className="fill-none stroke-[var(--brand)]" strokeWidth="5" />
                <circle cx={x + 13} cy={y} r="13" className="fill-none stroke-[var(--brand)]" strokeWidth="5" />
                {firing ? <circle key={firing} cx={x} cy={y + 10} r="26" className="vibha-ping fill-[var(--primary)]/60" /> : null}
                <text x={x} y={y + 34} textAnchor="middle" className="fill-foreground text-[10px] font-semibold">coil over left DLPFC</text>
              </>
            );
          })()}
        </g>
      ) : (
        <g>
          <path d={`M${e0[0]} ${e0[1]} Q 160 ${placement === "bf" ? 70 : 150} ${e1[0]} ${e1[1]}`} className="fill-none stroke-[var(--destructive)]" strokeWidth="4" strokeDasharray="8 5" />
          {[e0, e1].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="11" className="fill-[var(--destructive)] stroke-foreground" strokeWidth="2" />)}
          <text x="160" y="248" textAnchor="middle" className="fill-foreground text-[10px]">dashed line: the main current path</text>
        </g>
      )}
    </svg>
  );
}
