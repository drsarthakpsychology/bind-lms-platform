"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { ChevronRight, RotateCcw, Zap } from "lucide-react";
import type { BrainExplorerData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { Missions, ModeTabs, SceneCard, TONE_NAME, ViewSwitch, along, btn, chip, flatD, statusCls, useInView, useJourney, useLegProgress, useMissions, useSceneView, useThemeColors, type Journey, type V3 } from "./kit";
import { ALWAYS, BLOBS, BPATHS_FLAT, CEREBELLUM, CORTEX, DEEP, EAR, EYES, HEMI, LAYERS, NIGRA, PITUITARY, PONS, REGION, REGIONS, REGION_COLOR, TUBES, type RegionId } from "./brain-explorer-data";

/**
 * A brain to take apart: spin it, peel the left hemisphere away to reach the
 * deep structures, tap a region to watch what it does as a signal trip, and
 * switch on damage to see what an injury there does, with a real case.
 * A challenge round asks the student to find the damage from a symptom.
 */

export type BrainViewProps = { layer: number; sel: RegionId | null; damage: boolean; journey: Journey; onPick: (r: RegionId) => void; inView: boolean; colors: ReturnType<typeof useThemeColors> };

const View3D = dynamic(() => import("./brain-explorer-3d"), { ssr: false, loading: () => <div className="grid h-full place-items-center text-sm text-muted-foreground">Loading the 3D brain…</div> });

/** "the frontal lobe", but "Broca's area". */
const called = (r: RegionId) => (REGION[r].name.includes("'s") ? REGION[r].name : `the ${REGION[r].name.charAt(0).toLowerCase()}${REGION[r].name.slice(1)}`);

const CHALLENGE: RegionId[] = ["broca", "hippocampus", "amygdala", "occipital", "cerebellum", "frontal", "basal-ganglia", "parietal"];
const MISSIONS = ["peel", "speech", "damage", "explore", "challenge"] as const;

export function BrainExplorer({ d }: { d: BrainExplorerData }) {
  const v = useSceneView();
  const box = React.useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const colors = useThemeColors(box);
  const [mode, setMode] = React.useState<"explore" | "challenge">("explore");
  const [layer, setLayer] = React.useState(0);
  const [sel, setSel] = React.useState<RegionId | null>(null);
  const [damage, setDamage] = React.useState(false);
  const [seen, setSeen] = React.useState<RegionId[]>([]);
  const [round, setRound] = React.useState(0);
  const [tries, setTries] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [feedback, setFeedback] = React.useState<{ ok: boolean; text: string } | null>(null);
  const journey = useJourney(!v.reduce);
  const ms = useMissions(MISSIONS);
  const focus = d.focus?.length ? REGIONS.filter((r) => (d.focus as string[]).includes(r.id)) : REGIONS;

  const play = (r: RegionId, hurt: boolean) => journey.start(`${r}-${hurt ? "hurt" : "ok"}`, hurt ? REGION[r].hurtAct : REGION[r].act);
  const show = (r: RegionId, hurt = damage) => {
    setSel(r);
    if (CORTEX.includes(r) && layer !== 0) setLayer(0);
    if (DEEP.includes(r) && layer === 0) {
      setLayer(1);
      ms.mark("peel");
    }
    play(r, hurt);
    const nextSeen = seen.includes(r) ? seen : [...seen, r];
    setSeen(nextSeen);
    if (nextSeen.length >= 8) ms.mark("explore");
    if ((r === "broca" || r === "wernicke") && !hurt) ms.mark("speech");
    if (hurt) ms.mark("damage");
  };
  const pick = (r: RegionId) => {
    if (mode === "explore") {
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
      setSel(r);
      setDamage(true);
      if (CORTEX.includes(r)) setLayer(0);
      else if (DEEP.includes(r)) setLayer(Math.max(1, layer));
      play(r, true);
      setRound(round + 1);
      setTries(0);
      if (nextScore >= 4) ms.mark("challenge");
      trackLearn({ type: "widget", kind: "brainexplorer", ok: first, item: want });
    } else {
      setTries(tries + 1);
      setFeedback({ ok: false, text: `Not quite. You picked ${called(r)}: ${REGION[r].does} Read the clue again and try another part.` });
    }
  };
  const peel = (k: number) => {
    setLayer(k);
    if (k > 0) ms.mark("peel");
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
      if (nd) ms.mark("damage");
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
    <SceneCard title={d.title ?? "Inside the brain"} goal="Peel the brain open, tap each part to watch it work, then switch on damage to see what an injury does." caption={d.caption} tools={<ViewSwitch v={v} />}>
      <ModeTabs name="Mode" value={mode} onChange={(m) => { setMode(m); setFeedback(null); journey.clear(); if (m === "challenge") { setDamage(true); setSel(null); } }} modes={[{ id: "explore", label: "Explore" }, { id: "challenge", label: "Where is the damage?" }]} />
      <div ref={box} className="relative mt-3 h-[20rem] overflow-hidden rounded-xl border-2 border-foreground bg-background sm:h-[26rem]">
        {v.use3D ? <View3D layer={layer} sel={sel} damage={damage} journey={journey} onPick={pick} inView={inView} colors={colors} /> : <BrainFlat layer={layer} sel={sel} damage={damage} journey={journey} onPick={pick} reduce={v.reduce} />}
        {bubble ? (
          <p className="vibha-pop absolute right-2 top-2 max-w-[70%] rounded-xl border-2 border-foreground bg-card px-3 py-2 text-sm font-semibold shadow-[var(--shadow-hard-sm)]" aria-hidden>
            “{bubble}”
          </p>
        ) : null}
        {v.use3D ? <p className="pointer-events-none absolute bottom-1.5 left-2 rounded bg-background/80 px-1.5 text-xs text-muted-foreground">Drag to turn, pinch to zoom, tap a part</p> : null}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5" role="group" aria-label="Peel the layers">
        {LAYERS.map((l, k) => (
          <button key={l.name} type="button" aria-pressed={layer === k} className={chip(layer === k, "px-2 text-center text-xs sm:text-sm")} onClick={() => peel(k)}>{l.name}</button>
        ))}
      </div>

      {mode === "challenge" ? (
        <div className="mt-3 rounded-xl border-2 border-foreground bg-[var(--status-pending-bg)] p-3">
          {round < CHALLENGE.length ? (
            <>
              <p className="text-sm font-bold">Case {round + 1} of {CHALLENGE.length} · score {score}</p>
              <p className="mt-1 text-[0.95rem]">{REGION[CHALLENGE[round]].clue}</p>
              <p className="mt-1 text-sm text-muted-foreground">Which part of the brain is damaged? Tap it on the brain or below.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold">All {CHALLENGE.length} cases done: {score} right first time.</p>
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
        {v.reduce && journey.active ? <button type="button" className={cn(btn, "bg-foreground text-background")} onClick={journey.next}><ChevronRight className="size-4" aria-hidden /> Next step</button> : null}
      </div>

      <div className={statusCls} role="status" aria-live="polite">
        {feedback ? <p className={cn("mb-2 font-semibold", feedback.ok ? "" : "text-[var(--status-alert-fg)]")}>{feedback.ok ? "Right. " : ""}{feedback.text}</p> : null}
        {r ? (
          <>
            <span className="font-semibold">{r.name}: </span>{r.does}
            {journey.cur ? <span className="mt-2 block"><span className="font-semibold">Step {journey.leg + 1} of {journey.legs.length} ({TONE_NAME[journey.cur.tone]}): </span>{journey.cur.say}</span> : null}
            {journey.done ? <span className="mt-2 block"><span className="font-semibold">Result: </span>{journey.legs[journey.legs.length - 1].say}</span> : null}
            {bubble ? <span className="mt-2 block"><span className="font-semibold">What comes out: </span>“{bubble}”</span> : null}
            {damage ? (
              <span className="mt-2 block rounded-lg border-2 border-[var(--status-alert-fg)] bg-[var(--status-alert-bg)] p-2">
                <span className="font-semibold">If it is damaged: </span>{r.damage}
                <span className="mt-1 block"><span className="font-semibold">A real case: </span>{r.example}</span>
              </span>
            ) : null}
          </>
        ) : (
          <>{LAYERS[layer].say} {mode === "explore" ? "Tap any part to see it work." : ""}</>
        )}
      </div>
      <Missions
        doneText="All missions done: you have taken the brain apart, watched it work and seen what happens when parts are lost."
        items={[
          { id: "peel", label: "Peel the cortex to reach the deep parts", done: ms.done("peel") },
          { id: "speech", label: "Watch the speech loop (Broca or Wernicke)", done: ms.done("speech") },
          { id: "damage", label: "Switch on damage and read a real case", done: ms.done("damage") },
          { id: "explore", label: `Explore 8 parts (${Math.min(8, seen.length)} so far)`, done: ms.done("explore") },
          { id: "challenge", label: "Find 4 injuries first time in the challenge", done: ms.done("challenge") },
        ]}
      />
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

export function BrainFlat({ layer, sel, damage, journey, onPick, reduce }: { layer: number; sel: RegionId | null; damage: boolean; journey: Journey; onPick: (r: RegionId) => void; reduce: boolean }) {
  const t = useLegProgress(journey, reduce);
  const cortexOp = layer === 0 ? 1 : 0.16;
  const deepOp = layer === 0 ? 0 : 1;
  const fill = (id: RegionId) => (sel === id && damage ? "#8a7f7f" : REGION_COLOR[id]);
  const ring = (id: RegionId) => (sel === id ? (damage ? "stroke-[var(--destructive)]" : "stroke-foreground") : "stroke-foreground/50");
  const sw = (id: RegionId) => (sel === id ? 3 : 1);
  const cur = journey.cur;
  const head = cur ? along(BPATHS_FLAT[cur.path], t) : null;
  return (
    <svg viewBox="0 0 360 290" className="mx-auto block h-full w-full" role="img" aria-label="A side view of the brain, front to the left. The written description below says what is happening.">
      <style>{`@keyframes be-pulse { 0%,100% { opacity: 0.2 } 50% { opacity: 0.6 } } .be-hot { animation: be-pulse 1.2s ease-in-out infinite; }`}</style>
      {/* eye and ear */}
      <circle cx={sx(EYES[0][0])} cy={sy(EYES[0][1])} r="9" className="fill-white stroke-foreground" strokeWidth="1.5" />
      <circle cx={sx(EYES[0][0]) - 3} cy={sy(EYES[0][1])} r="3.5" className="fill-foreground" />
      <ellipse cx={sx(EAR[0])} cy={sy(EAR[1]) + 6} rx="6" ry="10" className="fill-none stroke-foreground/40" strokeWidth="2" strokeDasharray="3 2" />
      {/* brainstem and cerebellum */}
      <path d={flatD((TUBES.brainstem![0].pts).map((p) => [-p[0], p[1], 0] as V3), S, S, OX, OY)} fill="none" stroke={REGION_COLOR.brainstem} strokeWidth="26" strokeLinecap="round" onClick={() => onPick("brainstem")} className="cursor-pointer" />
      <circle cx={sx(PONS[0])} cy={sy(PONS[1])} r="16" fill={fill("brainstem")} className={cn("cursor-pointer", ring("brainstem"))} strokeWidth={sw("brainstem")} onClick={() => onPick("brainstem")} />
      <ellipse cx={sx(CEREBELLUM.c[0])} cy={sy(CEREBELLUM.c[1])} rx={CEREBELLUM.r[0] * S} ry={CEREBELLUM.r[1] * S} fill={fill("cerebellum")} className={cn("cursor-pointer", ring("cerebellum"))} strokeWidth={sw("cerebellum")} onClick={() => onPick("cerebellum")} />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M${sx(CEREBELLUM.c[0]) - 36} ${sy(CEREBELLUM.c[1]) - 16 + k * 10} q 36 ${8 + k} 72 0`} className="pointer-events-none fill-none stroke-foreground/30" />)}
      {/* deep structures */}
      <g style={{ opacity: deepOp, transition: "opacity 500ms" }} aria-hidden={layer === 0}>
        {(Object.keys(TUBES) as RegionId[]).filter((id) => id !== "brainstem").map((id) => TUBES[id]!.map((tb, k) => (
          <path key={`${id}-${k}`} d={flatD(tb.pts.map((p) => [-p[0], p[1], 0] as V3), S, S, OX, OY)} fill="none" stroke={fill(id)} strokeWidth={tb.r * S * 2} strokeLinecap="round" className="cursor-pointer" onClick={() => layer > 0 && onPick(id)} />
        )))}
        {(Object.keys(BLOBS) as RegionId[]).map((id) => BLOBS[id]!.map((b, k) => (
          <ellipse key={`${id}-${k}`} cx={sx(b.c[0])} cy={sy(b.c[1])} rx={b.r[0] * S} ry={b.r[1] * S} fill={fill(id)} className={cn("cursor-pointer", ring(id))} strokeWidth={sw(id)} onClick={() => layer > 0 && onPick(id)} />
        )))}
        <circle cx={sx(PITUITARY[0])} cy={sy(PITUITARY[1])} r="5" className="fill-[#f0a35e] stroke-foreground" />
        <circle cx={sx(NIGRA[0])} cy={sy(NIGRA[1])} r="5" className="fill-foreground" />
      </g>
      {/* the cortex */}
      <g style={{ opacity: cortexOp, transition: "opacity 500ms" }}>
        {FLAT_REGIONS.map((r) => (
          <path key={r.id} d={poly(r.poly)} fill={fill(r.id)} className={cn("cursor-pointer", ring(r.id))} strokeWidth={sw(r.id)} strokeLinejoin="round" onClick={() => layer === 0 && onPick(r.id)} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={`M${sx(1.2 - k * 0.45)} ${sy(0.85)} q 12 18 -6 40`} className="pointer-events-none fill-none stroke-foreground/20" strokeWidth="1.2" />)}
      </g>
      {sel ? <path d={sel && FLAT_REGIONS.find((r) => r.id === sel) ? poly(FLAT_REGIONS.find((r) => r.id === sel)!.poly) : ""} className={cn("pointer-events-none", damage ? "fill-[var(--destructive)]" : "fill-white", !reduce && "be-hot")} style={{ opacity: layer === 0 ? 0.3 : 0 }} /> : null}
      {/* the signal */}
      {journey.legs.map((l, i) => (i < journey.leg || i === journey.leg ? (
        <path key={`${l.path}-${i}`} d={FD(l.path)} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={i === journey.leg ? 1 - t : 0} className={l.tone === "motor" ? "stroke-[var(--destructive)]" : "stroke-[var(--brand)]"} strokeWidth="3.5" strokeLinecap="round" />
      ) : null))}
      {head && cur ? (cur.tone === "motor"
        ? <rect x={sx(head[0]) - 6} y={sy(head[1]) - 6} width="12" height="12" transform={`rotate(45 ${sx(head[0])} ${sy(head[1])})`} className="fill-[var(--destructive)] stroke-background" strokeWidth="1.5" />
        : <circle cx={sx(head[0])} cy={sy(head[1])} r="6.5" className="fill-[var(--brand)] stroke-background" strokeWidth="1.5" />) : null}
      <text x="8" y="284" className="fill-muted-foreground text-[11px]">front</text>
      <text x="352" y="284" textAnchor="end" className="fill-muted-foreground text-[11px]">back</text>
    </svg>
  );
}

