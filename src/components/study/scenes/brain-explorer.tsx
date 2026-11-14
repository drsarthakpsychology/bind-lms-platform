"use client";

import * as React from "react";
import { RotateCcw, Zap } from "lucide-react";
import type { BrainExplorerData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { sfx } from "./sfx";
import { SliceCanvas } from "./slice-canvas";
import { C, E, L, Label, P, Pg, Sheet } from "@/components/sketch/ink";
import { JourneySteps, ModeTabs, Scene3DSlot, SceneCard, ViewSwitch, along, btn, chip, flatD, statusCls, useInView, useJourney, useLegProgress, useSceneView, useThemeColors, type Journey, type V3 } from "./kit";
import { ALWAYS, BLOBS, BPATHS_FLAT, CEREBELLUM, CORTEX, DEEP, EAR, EYES, GUIDE, HEMI, LAYERS, NIGRA, PITUITARY, PONS, REGION, REGIONS, REGION_COLOR, TUBES, type GuideView, type RegionId } from "./brain-explorer-data";

/**
 * A brain to take apart: spin it, peel the left hemisphere away to reach the
 * deep structures, tap a region to watch what it does as a signal trip, and
 * switch on damage to see what an injury there does, with a real case.
 * A challenge round asks the student to find the damage from a symptom.
 */

export type BrainViewProps = { view: GuideView; layer: number; sel: RegionId | null; damage: boolean; journey: Journey; onPick: (r: RegionId) => void; inView: boolean; colors: ReturnType<typeof useThemeColors>; onReady?: () => void };

/** Loaded only when the device can draw 3D: three.js lives in this lazy chunk. */
const View3D = React.lazy(() => import("./brain-explorer-3d"));

/** "the frontal lobe", but "Broca's area". */
const called = (r: RegionId) => (REGION[r].name.includes("'s") ? REGION[r].name : `the ${REGION[r].name.charAt(0).toLowerCase()}${REGION[r].name.slice(1)}`);

const CHALLENGE: RegionId[] = ["broca", "hippocampus", "amygdala", "occipital", "cerebellum", "frontal", "basal-ganglia", "parietal"];

export function BrainExplorer({ d }: { d: BrainExplorerData }) {
  const v = useSceneView();
  const box = React.useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const colors = useThemeColors(box);
  const [mode, setMode] = React.useState<"explore" | "challenge">("explore");
  const [layer, setLayer] = React.useState(0);
  const [view, setView] = React.useState<GuideView>("free");
  const [sel, setSel] = React.useState<RegionId | null>(null);
  const [damage, setDamage] = React.useState(false);
  const [seen, setSeen] = React.useState<RegionId[]>([]);
  const [round, setRound] = React.useState(0);
  const [tries, setTries] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [feedback, setFeedback] = React.useState<{ ok: boolean; text: string } | null>(null);
  const journey = useJourney();
  const focus = d.focus?.length && mode === "explore" ? REGIONS.filter((r) => (d.focus as string[]).includes(r.id)) : REGIONS;

  const play = (r: RegionId, hurt: boolean) => journey.start(`${r}-${hurt ? "hurt" : "ok"}`, hurt ? REGION[r].hurtAct : REGION[r].act);
  const show = (r: RegionId, hurt = damage) => {
    setSel(r);
    if (CORTEX.includes(r) && layer !== 0) {
      setLayer(0);
      setView("free");
    }
    if (DEEP.includes(r) && layer === 0 && view !== "coronal") {
      setView("free");
      setLayer(1);
    }
    play(r, hurt);
    const nextSeen = seen.includes(r) ? seen : [...seen, r];
    setSeen(nextSeen);
  };
  const pick = (r: RegionId) => {
    if (mode === "explore") {
      sfx("tap");
      show(r);
      trackLearn({ type: "widget", kind: "brainexplorer", item: r });
      return;
    }
    if (round >= CHALLENGE.length) return;
    const want = CHALLENGE[round];
    if (r === want) {
      const first = tries === 0;
      const nextScore = score + (first ? 1 : 0);
      setScore(nextScore);
      setFeedback({ ok: true, text: `Yes: ${called(want)}. Watch what the injury does below.` });
      sfx("good");
      setSel(r);
      setDamage(true);
      if (CORTEX.includes(r)) setLayer(0);
      else if (DEEP.includes(r)) setLayer(Math.max(1, layer));
      play(r, true);
      setRound(round + 1);
      setTries(0);
      trackLearn({ type: "widget", kind: "brainexplorer", ok: first, item: want });
    } else {
      setTries(tries + 1);
      sfx("bad");
      setFeedback({ ok: false, text: `Not quite. You picked ${called(r)}: ${REGION[r].does} Read the clue again.` });
    }
  };
  const goView = (g: Exclude<GuideView, "free">) => {
    setView(g);
    setLayer(GUIDE.find((x) => x.id === g)!.layer);
    trackLearn({ type: "widget", kind: "brainexplorer", item: `view-${g}` });
  };
  const peel = (k: number) => {
    setLayer(k);
    setView("free");
    if (sel && CORTEX.includes(sel) && k > 0) {
      setSel(null);
      journey.clear();
    }
  };
  const toggleDamage = () => {
    const nd = !damage;
    setDamage(nd);
    if (sel) {
      play(sel, nd);
    }
  };
  const restart = () => {
    setRound(0);
    setScore(0);
    setTries(0);
    setFeedback(null);
    setSel(null);
    journey.clear();
  };

  const r = sel ? REGION[sel] : null;
  const bubble = r?.bubble && (journey.done || journey.cur?.path === "bro-mouth") ? (damage ? r.bubble.hurt : r.bubble.ok) : null;

  return (
    <SceneCard title={d.title ?? "Inside the brain"} caption={d.caption} tools={<ViewSwitch v={v} />} sound>
      <ModeTabs name="Mode" value={mode} onChange={(m) => { setMode(m); setFeedback(null); journey.clear(); if (m === "challenge") { setDamage(true); setSel(null); } }} modes={[{ id: "explore", label: "Explore" }, { id: "challenge", label: "Where is the damage?" }]} />
      <div ref={box} className="relative mt-3 h-[20rem] overflow-hidden rounded-xl border-2 border-foreground bg-background sm:h-[26rem]">
        {v.use3D ? (
          <Scene3DSlot
            flat={<GuidedFlat view={view} layer={layer} sel={sel} damage={damage} journey={journey} onPick={pick} reduce={v.reduce} />}
            render={(onReady) => <View3D view={view} layer={layer} sel={sel} damage={damage} journey={journey} onPick={pick} inView={inView} colors={colors} onReady={onReady} />}
          />
        ) : <GuidedFlat view={view} layer={layer} sel={sel} damage={damage} journey={journey} onPick={pick} reduce={v.reduce} />}
        {bubble ? (
          <p className="vibha-pop absolute right-2 top-2 max-w-[70%] rounded-xl border-2 border-foreground bg-card px-3 py-2 text-sm font-semibold shadow-[var(--shadow-hard-sm)]" aria-hidden>
            “{bubble}”
          </p>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4" role="group" aria-label="Views">
        {GUIDE.map((g) => (
          <button key={g.id} type="button" aria-pressed={view === g.id} className={chip(view === g.id, "px-2 text-center text-xs sm:text-sm")} onClick={() => goView(g.id)}>{g.name}</button>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5" role="group" aria-label="Peel the layers">
        {LAYERS.map((l, k) => (
          <button key={l.name} type="button" aria-pressed={layer === k} className={chip(layer === k, "px-2 text-center text-xs sm:text-sm")} onClick={() => peel(k)}>{l.name}</button>
        ))}
      </div>

      {mode === "challenge" ? (
        <div className="mt-3 rounded-xl border-2 border-foreground bg-[var(--status-pending-bg)] p-3">
          {round < CHALLENGE.length ? (
            <>
              <p className="text-sm font-bold">Case {round + 1} · score {score}</p>
              <p className="mt-1 text-[0.95rem]">{REGION[CHALLENGE[round]].clue}</p>
              <p className="mt-1 text-sm font-semibold">Which part is damaged?</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold">Done: {score} right first time.</p>
              <button type="button" className={cn(btn, "mt-2 bg-card text-sm")} onClick={restart}><RotateCcw className="size-4" aria-hidden /> Play again</button>
            </>
          )}
        </div>
      ) : null}

      <div className="mt-3 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Outer brain</p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3" role="group" aria-label="Outer brain parts">
          {[...CORTEX, ...ALWAYS].filter((id) => focus.some((f) => f.id === id)).map((id) => <RegionButton key={id} id={id} sel={sel} onPick={pick} seen={seen.includes(id)} />)}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deep inside</p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3" role="group" aria-label="Deep parts">
          {DEEP.filter((id) => focus.some((f) => f.id === id)).map((id) => <RegionButton key={id} id={id} sel={sel} onPick={pick} seen={seen.includes(id)} />)}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {mode === "explore" ? (
          <button type="button" aria-pressed={damage} className={cn(btn, damage ? "bg-[var(--destructive)] text-white" : "bg-card")} onClick={toggleDamage}>
            <Zap className="size-4" aria-hidden /> {damage ? "Damage on" : "Damage off"}
          </button>
        ) : null}
        {sel && journey.done ? <button type="button" className={cn(btn, "bg-card text-sm")} onClick={() => play(sel, damage)}><RotateCcw className="size-4" aria-hidden /> Replay</button> : null}
      </div>

      <div className={statusCls} role="status" aria-live="polite">
        {view !== "free" ? <p className="mb-2">{GUIDE.find((g) => g.id === view)!.say}</p> : null}
        {feedback ? <p className={cn("mb-2 font-semibold", feedback.ok ? "" : "text-[var(--status-alert-fg)]")}>{feedback.ok ? "Right. " : ""}{feedback.text}</p> : null}
        {r ? (
          <>
            <span className="font-semibold">{r.name}: </span>{r.does}
            <JourneySteps journey={journey} />
            {bubble ? <span className="mt-2 block"><span className="font-semibold">What comes out: </span>“{bubble}”</span> : null}
            {damage ? (
              <span className="mt-2 block rounded-lg border-2 border-[var(--status-alert-fg)] bg-[var(--status-alert-bg)] p-2">
                <span className="font-semibold">If it is damaged: </span>{r.damage}
                <span className="mt-1 block"><span className="font-semibold">A real case: </span>{r.example}</span>
              </span>
            ) : null}
          </>
        ) : (
          view === "free" ? <>{LAYERS[layer].say}</> : null
        )}
      </div>
    </SceneCard>
  );
}

function RegionButton({ id, sel, onPick, seen }: { id: RegionId; sel: RegionId | null; onPick: (r: RegionId) => void; seen: boolean }) {
  return (
    <button type="button" aria-pressed={sel === id} className={chip(sel === id, "flex items-center gap-2 px-2.5")} onClick={() => onPick(id)}>
      <span className="size-3 shrink-0 rounded-sm border-2 border-foreground" style={{ background: REGION_COLOR[id] }} aria-hidden />
      <span className="min-w-0 flex-1">{REGION[id].short}</span>
      {seen ? <span className="sr-only">(seen)</span> : null}
    </button>
  );
}

/* ------------------------------------------------------------- flat view */

const S = 92, OX = 180, OY = 118;
const sx = (a: number) => OX - a * S;
const sy = (y: number) => OY - y * S;

type P2 = [number, number];
/** Keep the part of a convex polygon where f(a, y) > 0 (f is linear). */
function clip(poly: P2[], f: (a: number, y: number) => number): P2[] {
  const out: P2[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const fp = f(p[0], p[1]), fq = f(q[0], q[1]);
    if (fp >= 0) out.push(p);
    if (fp >= 0 !== fq >= 0) {
      const t = fp / (fp - fq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  }
  return out;
}
const OUTLINE: P2[] = Array.from({ length: 72 }, (_, i) => {
  const th = (i / 72) * Math.PI * 2;
  const a = Math.cos(th) * HEMI.a;
  const up = Math.sin(th) >= 0;
  const shape = a < -0.9 ? 0.62 : a > 0.95 ? 0.6 : 1;
  return [a, Math.sin(th) * (up ? HEMI.up : HEMI.down * shape)];
});
const syl = (a: number, y: number) => y - (-0.05 + (0.55 - a) * 0.286);
const cen = (a: number, y: number) => a - (0.3 - (y - 0.05) * 0.37);
const occ = (a: number, y: number) => -1.05 + 0.1 * y - a;
const FLAT_REGIONS: { id: RegionId; poly: P2[] }[] = (() => {
  const frontal = clip(clip(OUTLINE, cen), (a, y) => -occ(a, y));
  const temporal = clip(clip(clip(OUTLINE, (a, y) => -syl(a, y)), (a) => 0.95 - a), (a, y) => -occ(a, y));
  return [
    { id: "parietal", poly: OUTLINE },
    { id: "frontal", poly: frontal },
    { id: "motor", poly: clip(frontal, (a, y) => 0.2 - cen(a, y)) },
    { id: "broca", poly: clip(clip(clip(frontal, (a) => a - 0.42), (a) => 0.95 - a), (a, y) => 0.32 - syl(a, y)) },
    { id: "temporal", poly: temporal },
    { id: "wernicke", poly: clip(clip(clip(temporal, (a) => a + 0.78), (a) => -0.18 - a), (a, y) => syl(a, y) + 0.32) },
    { id: "occipital", poly: clip(OUTLINE, occ) },
  ];
})();
const poly = (p: P2[]) => p.map(([a, y], i) => `${i ? "L" : "M"}${sx(a).toFixed(1)} ${sy(y).toFixed(1)}`).join(" ") + " Z";
const FD = (k: string) => flatD(BPATHS_FLAT[k].map((p) => [-p[0], p[1], p[2]] as V3), S, S, OX, OY);

/** The flat twin of the guided views: the side drawing, a coronal scan slice, or the brain from below. */
function GuidedFlat(p: { view: GuideView; layer: number; sel: RegionId | null; damage: boolean; journey: Journey; onPick: (r: RegionId) => void; reduce: boolean }) {
  if (p.view === "coronal") {
    return (
      <div className="flex h-full items-center justify-center bg-black p-2">
        <SliceCanvas plane="coronal" u={0.05} tint />
      </div>
    );
  }
  if (p.view === "inferior") return <InferiorFlat onPick={p.onPick} sel={p.sel} />;
  return <BrainFlat {...p} layer={p.view === "medial" ? 1 : p.layer} />;
}

/** The brain seen from below: frontal lobes at the top, temporal lobes at the sides, brainstem and cerebellum at the bottom. */
function InferiorFlat({ onPick, sel }: { onPick: (r: RegionId) => void; sel: RegionId | null }) {
  const ring = (id: RegionId) => (sel === id ? C.ink : C.soft);
  const lobe = (m: number) => `M${160 + m * 6} 22 C ${160 + m * 70} 20 ${160 + m * 112} 70 ${160 + m * 110} 150 C ${160 + m * 108} 220 ${160 + m * 70} 262 ${160 + m * 8} 262 Z`;
  const temp = (m: number) => `M${160 + m * 40} 118 C ${160 + m * 104} 110 ${160 + m * 112} 170 ${160 + m * 96} 214 C ${160 + m * 80} 236 ${160 + m * 46} 214 ${160 + m * 38} 170 Z`;
  return (
    <Sheet bare name="brain-below" w={320} h={290} label="The brain from below. The written description says what you see." className="mx-auto h-full w-full">
      {[-1, 1].map((m) => (
        <g key={m}>
          <g className="cursor-pointer" onClick={() => onPick("frontal")}><P k={`bb-f${m}-${sel === "frontal"}`} d={lobe(m)} fill={REGION_COLOR.frontal} fillStyle="solid" stroke={ring("frontal")} sw={sel === "frontal" ? 2.4 : 1.5} /></g>
          <g className="cursor-pointer" onClick={() => onPick("temporal")}><P k={`bb-t${m}-${sel === "temporal"}`} d={temp(m)} fill={REGION_COLOR.temporal} fillStyle="solid" stroke={ring("temporal")} sw={sel === "temporal" ? 2.4 : 1.5} /></g>
          <E k={`bb-olf${m}`} cx={160 + m * 6} cy={60} w={10} h={44} fill={C.wash} fillStyle="solid" stroke={C.soft} sw={1.2} />
        </g>
      ))}
      <L k="bb-mid" x1={160} y1={22} x2={160} y2={262} stroke={C.soft} sw={1.4} single />
      <g className="cursor-pointer" onClick={() => onPick("cerebellum")}><E k={`bb-cb-${sel === "cerebellum"}`} cx={160} cy={236} w={148} h={68} fill={REGION_COLOR.cerebellum} fillStyle="solid" stroke={ring("cerebellum")} sw={sel === "cerebellum" ? 2.4 : 1.5} /></g>
      <g className="cursor-pointer" onClick={() => onPick("brainstem")}><E k={`bb-bs-${sel === "brainstem"}`} cx={160} cy={176} w={48} h={48} fill={REGION_COLOR.brainstem} fillStyle="solid" stroke={ring("brainstem")} sw={sel === "brainstem" ? 2.4 : 1.5} /></g>
      <P k="bb-chiasm" d="M136 128 L 184 128 M148 120 L 172 136 M172 120 L 148 136" sw={2} single />
      <g className="cursor-pointer" onClick={() => onPick("hypothalamus")}><E k="bb-hyp" cx={160} cy={146} w={12} h={12} fill={C.lime} fillStyle="solid" sw={1.2} /></g>
      <Label x={160} y={14} size={13} anchor="middle" bold={false} color={C.soft}>front</Label>
      <Label x={160} y={286} size={13} anchor="middle" bold={false} color={C.soft}>back</Label>
      <Label x={124} y={132} size={12} anchor="end">optic chiasm</Label>
    </Sheet>
  );
}

/** The drawing of the side view: re-inked only when the layer, the picked part or the damage switch changes, not every frame of a signal. */
const BrainSide = React.memo(function BrainSide({ layer, sel, damage }: { layer: number; sel: RegionId | null; damage: boolean }) {
  const cortexOp = layer === 0 ? 1 : 0.16;
  const deepOp = layer === 0 ? 0 : 1;
  const fill = (id: RegionId) => (sel === id && damage ? C.soft : REGION_COLOR[id]);
  const ring = (id: RegionId) => (sel === id ? (damage ? C.red : C.ink) : C.soft);
  const sw = (id: RegionId) => (sel === id ? 2.6 : 1.2);
  const tag = (id: RegionId) => `${sel === id}-${damage}`;
  return (
    <g className="pointer-events-none">
      {/* eye and ear */}
      <E k="bs-eye" cx={sx(EYES[0][0])} cy={sy(EYES[0][1])} w={18} h={18} fill={C.paper} fillStyle="solid" sw={1.4} />
      <circle cx={sx(EYES[0][0]) - 3} cy={sy(EYES[0][1])} r="3.5" fill={C.ink} />
      <E k="bs-ear" cx={sx(EAR[0])} cy={sy(EAR[1]) + 6} w={12} h={20} stroke={C.soft} sw={1.6} dash="3 3" />
      {/* brainstem and cerebellum */}
      <path d={flatD((TUBES.brainstem![0].pts).map((p) => [-p[0], p[1], 0] as V3), S, S, OX, OY)} fill="none" stroke={REGION_COLOR.brainstem} strokeWidth="26" strokeLinecap="round" />
      <E k={`bs-pons-${tag("brainstem")}`} cx={sx(PONS[0])} cy={sy(PONS[1])} w={32} h={32} fill={fill("brainstem")} fillStyle="solid" stroke={ring("brainstem")} sw={sw("brainstem")} />
      <E k={`bs-cb-${tag("cerebellum")}`} cx={sx(CEREBELLUM.c[0])} cy={sy(CEREBELLUM.c[1])} w={CEREBELLUM.r[0] * S * 2} h={CEREBELLUM.r[1] * S * 2} fill={fill("cerebellum")} fillStyle="solid" stroke={ring("cerebellum")} sw={sw("cerebellum")} />
      <P k="bs-folia" d={[0, 1, 2, 3].map((k) => `M${sx(CEREBELLUM.c[0]) - 36} ${sy(CEREBELLUM.c[1]) - 16 + k * 10} q 36 ${8 + k} 72 0`).join(" ")} stroke={C.soft} sw={1} single rough={0.6} />
      {/* deep structures */}
      <g style={{ opacity: deepOp, transition: "opacity 500ms" }}>
        {(Object.keys(TUBES) as RegionId[]).filter((id) => id !== "brainstem").map((id) => TUBES[id]!.map((tb, k) => (
          <path key={`${id}-${k}`} d={flatD(tb.pts.map((p) => [-p[0], p[1], 0] as V3), S, S, OX, OY)} fill="none" stroke={fill(id)} strokeWidth={tb.r * S * 2} strokeLinecap="round" />
        )))}
        {(Object.keys(BLOBS) as RegionId[]).map((id) => BLOBS[id]!.map((b, k) => (
          <E key={`${id}-${k}`} k={`bs-blob-${id}-${k}-${tag(id)}`} cx={sx(b.c[0])} cy={sy(b.c[1])} w={b.r[0] * S * 2} h={b.r[1] * S * 2} fill={fill(id)} fillStyle="solid" stroke={ring(id)} sw={sw(id)} />
        )))}
        <E k="bs-pit" cx={sx(PITUITARY[0])} cy={sy(PITUITARY[1])} w={10} h={10} fill={C.lime} fillStyle="solid" sw={1.2} />
        <circle cx={sx(NIGRA[0])} cy={sy(NIGRA[1])} r="5" fill={C.ink} />
      </g>
      {/* the cortex */}
      <g style={{ opacity: cortexOp, transition: "opacity 500ms" }}>
        {FLAT_REGIONS.map((r) => (
          <Pg key={r.id} k={`bs-cx-${r.id}-${tag(r.id)}`} pts={r.poly.map(([a, y]) => [sx(a), sy(y)] as [number, number])} fill={fill(r.id)} fillStyle="solid" stroke={ring(r.id)} sw={sw(r.id)} />
        ))}
        <P k="bs-gyri" d={[0, 1, 2, 3, 4, 5].map((k) => `M${sx(1.2 - k * 0.45)} ${sy(0.85)} q 12 18 -6 40`).join(" ")} stroke={C.ink} sw={1.1} single rough={0.7} style={{ opacity: 0.3 }} />
      </g>
      <Label x={8} y={284} size={13} bold={false} color={C.soft}>front</Label>
      <Label x={352} y={284} size={13} anchor="end" bold={false} color={C.soft}>back</Label>
    </g>
  );
});

export function BrainFlat({ layer, sel, damage, journey, onPick, reduce }: { layer: number; sel: RegionId | null; damage: boolean; journey: Journey; onPick: (r: RegionId) => void; reduce: boolean }) {
  const t = useLegProgress(journey, reduce);
  const cur = journey.cur;
  const head = cur ? along(BPATHS_FLAT[cur.path], t) : null;
  return (
    <Sheet bare name="brain-side" w={360} h={290} label="A side view of the brain, front to the left. The written description below says what is happening." className="mx-auto h-full w-full">
      <style>{`@keyframes be-pulse { 0%,100% { opacity: 0.2 } 50% { opacity: 0.6 } } .be-hot { animation: be-pulse 1.2s ease-in-out infinite; }`}</style>
      <BrainSide layer={layer} sel={sel} damage={damage} />
      {/* tap targets, invisible, over the drawing */}
      <g fill="transparent" className="cursor-pointer">
        <circle cx={sx(PONS[0])} cy={sy(PONS[1])} r="16" onClick={() => onPick("brainstem")} />
        <ellipse cx={sx(CEREBELLUM.c[0])} cy={sy(CEREBELLUM.c[1])} rx={CEREBELLUM.r[0] * S} ry={CEREBELLUM.r[1] * S} onClick={() => onPick("cerebellum")} />
        {layer === 0
          ? FLAT_REGIONS.map((r) => <path key={r.id} d={poly(r.poly)} onClick={() => onPick(r.id)} />)
          : (Object.keys(BLOBS) as RegionId[]).map((id) => BLOBS[id]!.map((b, k) => <ellipse key={`${id}-${k}`} cx={sx(b.c[0])} cy={sy(b.c[1])} rx={b.r[0] * S} ry={b.r[1] * S} onClick={() => onPick(id)} />))}
        {layer > 0
          ? (Object.keys(TUBES) as RegionId[]).filter((id) => id !== "brainstem").map((id) => TUBES[id]!.map((tb, k) => (
              <path key={`${id}-${k}`} d={flatD(tb.pts.map((p) => [-p[0], p[1], 0] as V3), S, S, OX, OY)} fill="none" stroke="transparent" strokeWidth={tb.r * S * 2} onClick={() => onPick(id)} />
            )))
          : null}
      </g>
      {sel ? <path d={FLAT_REGIONS.find((r) => r.id === sel) ? poly(FLAT_REGIONS.find((r) => r.id === sel)!.poly) : ""} fill={damage ? C.red : C.paper} className={cn("pointer-events-none", !reduce && "be-hot")} style={{ opacity: layer === 0 ? 0.3 : 0 }} /> : null}
      {/* the signal */}
      {journey.legs.map((l, i) => (i < journey.leg || i === journey.leg ? (
        <path key={`${l.path}-${i}`} d={FD(l.path)} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={i === journey.leg ? 1 - t : 0} stroke={l.tone === "motor" ? C.red : C.blue} strokeWidth={3.5} strokeLinecap="round" />
      ) : null))}
      {head && cur ? (cur.tone === "motor"
        ? <rect x={sx(head[0]) - 6} y={sy(head[1]) - 6} width="12" height="12" transform={`rotate(45 ${sx(head[0])} ${sy(head[1])})`} fill={C.red} stroke={C.paper} strokeWidth={1.5} />
        : <circle cx={sx(head[0])} cy={sy(head[1])} r="6.5" fill={C.lime} stroke={C.ink} strokeWidth={1.5} />) : null}
    </Sheet>
  );
}

