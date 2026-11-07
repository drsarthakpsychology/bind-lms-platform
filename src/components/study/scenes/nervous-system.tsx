"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { ChevronRight, RotateCcw } from "lucide-react";
import type { NervousSystemData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { Missions, ModeTabs, SceneCard, TONE_NAME, ViewSwitch, along, btn, chip, flatD, statusCls, useInView, useJourney, useLegProgress, useMissions, useSceneView, useThemeColors, type Journey } from "./kit";
import { AUTO, BODY, LEVELS, LIMBS, PARA, PARTS, PART_NAME, PATHS, SOMATIC, SYMP, levelShows, routeLegs, type Auto, type Level, type Part, type Route } from "./nervous-system-data";

/**
 * The nervous system as a body the student plays with: tap a part and watch
 * the signal travel to the brain and back (or take the reflex shortcut),
 * switch the body between fight or flight and rest and digest, and zoom from
 * the whole system down to its divisions. 3D when the device can draw it,
 * a flat animated drawing otherwise; every state is written below.
 */

export type NsMode = "signal" | "auto" | "map";
export type NsViewProps = { mode: NsMode; journey: Journey; auto: Auto; level: Level; onPart: (p: Part) => void; inView: boolean; colors: ReturnType<typeof useThemeColors> };

const View3D = dynamic(() => import("./nervous-system-3d"), { ssr: false, loading: () => <div className="grid h-full place-items-center text-sm text-muted-foreground">Loading the 3D body…</div> });

const MISSIONS = ["brain", "reflex", "fight", "rest", "autonomic", "somatic"] as const;
const PARTS_LIST: Part[] = ["hand", "foot", "knee", "eye"];

export function NervousSystem({ d }: { d: NervousSystemData }) {
  const v = useSceneView();
  const box = React.useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const colors = useThemeColors(box);
  const [mode, setMode] = React.useState<NsMode>(d.start ?? "signal");
  const [route, setRoute] = React.useState<Route>("brain");
  const [auto, setAuto] = React.useState<Auto>("everyday");
  const [level, setLevel] = React.useState<Level>("all");
  const journey = useJourney(!v.reduce);
  const ms = useMissions(MISSIONS);
  const lastKey = React.useRef("");

  // mark the signal missions when a trip finishes (a timer callback, not render)
  React.useEffect(() => {
    if (!journey.done || lastKey.current === `${journey.run}`) return;
    lastKey.current = `${journey.run}`;
    const t = setTimeout(() => ms.mark(journey.key.endsWith("reflex") ? "reflex" : "brain"), 0);
    return () => clearTimeout(t);
  }, [journey.done, journey.run, journey.key, ms]);

  const send = (p: Part) => {
    if (mode !== "signal") setMode("signal");
    journey.start(`${p}-${route}`, routeLegs(p, route));
    trackLearn({ type: "widget", kind: "nervoussystem", item: `${p}-${route}` });
  };
  const pickAuto = (a: Auto) => {
    setAuto(a);
    if (a === "fight") ms.mark("fight");
    if (a === "rest") ms.mark("rest");
    trackLearn({ type: "widget", kind: "nervoussystem", item: a });
  };
  const pickLevel = (l: Level) => {
    setLevel(l);
    if (l === "autonomic" || l === "sympathetic" || l === "parasympathetic") ms.mark("autonomic");
    if (l === "somatic") ms.mark("somatic");
  };
  const changeMode = (m: NsMode) => {
    setMode(m);
    journey.clear();
  };

  const status = (() => {
    if (mode === "auto") {
      const a = AUTO[auto];
      return (
        <>
          <span className="font-semibold">{a.name}: </span>{a.say}
          <span className="mt-2 block font-semibold">What the body is doing now:</span>
          <ul className="mt-1 grid gap-0.5 sm:grid-cols-2">
            {a.organs.map(([o, s]) => <li key={o}><span className="font-semibold">{o}:</span> {s}</li>)}
          </ul>
        </>
      );
    }
    if (mode === "map") {
      const l = LEVELS.find((x) => x.id === level)!;
      return <><span className="font-semibold">{l.name}: </span>{l.say}</>;
    }
    if (journey.cur) {
      return <><span className="font-semibold">Step {journey.leg + 1} of {journey.legs.length}, {TONE_NAME[journey.cur.tone]} signal: </span>{journey.cur.say}</>;
    }
    if (journey.done) {
      const last = journey.legs[journey.legs.length - 1];
      return <><span className="font-semibold">Done. </span>{last.say} Try another part, or switch to {route === "brain" ? "the reflex shortcut" : "through the brain"} and compare.</>;
    }
    return <>Pick a route, then tap a body part (on the body or with the buttons). A <span className="font-semibold">sensory</span> signal (round, blue) travels in; a <span className="font-semibold">motor</span> signal (square, red) travels out.</>;
  })();

  return (
    <SceneCard title={d.title ?? "The nervous system, live"} goal="Send signals through the body, flip it into fight or flight and back, and zoom into each division." caption={d.caption} tools={<ViewSwitch v={v} />}>
      <ModeTabs<NsMode> name="What to explore" value={mode} onChange={changeMode} modes={[{ id: "signal", label: "Send a signal" }, { id: "auto", label: "Organs on autopilot" }, { id: "map", label: "Zoom the map" }]} />
      <div ref={box} className="relative mt-3 h-[22rem] overflow-hidden rounded-xl border-2 border-foreground bg-background sm:h-[28rem]">
        {v.use3D ? (
          <View3D mode={mode} journey={journey} auto={auto} level={level} onPart={send} inView={inView} colors={colors} />
        ) : (
          <NervousFlat mode={mode} journey={journey} auto={auto} level={level} onPart={send} reduce={v.reduce} />
        )}
        {v.use3D ? <p className="pointer-events-none absolute bottom-1.5 left-2 rounded bg-background/80 px-1.5 text-xs text-muted-foreground">Drag to turn, pinch to zoom, tap a hand, foot, knee or eye</p> : null}
      </div>

      {mode === "signal" ? (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Route">
            <button type="button" aria-pressed={route === "brain"} className={chip(route === "brain", "text-center")} onClick={() => setRoute("brain")}>Through the brain</button>
            <button type="button" aria-pressed={route === "reflex"} className={chip(route === "reflex", "text-center")} onClick={() => setRoute("reflex")}>Reflex shortcut</button>
          </div>
          <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Send a signal from">
            {PARTS_LIST.map((p) => (
              <button key={p} type="button" className={cn(btn, "min-h-11 justify-start bg-card px-3 text-left text-sm hover:-translate-y-0.5")} onClick={() => send(p)}>{PART_NAME[p]}</button>
            ))}
          </div>
          {v.reduce && journey.active ? (
            <button type="button" className={cn(btn, "bg-foreground text-background")} onClick={journey.next}>
              <ChevronRight className="size-4" aria-hidden /> Next step
            </button>
          ) : null}
        </div>
      ) : null}
      {mode === "auto" ? (
        <div className="mt-3 grid gap-1.5 sm:grid-cols-3" role="group" aria-label="Body state">
          {(["everyday", "fight", "rest"] as Auto[]).map((a) => (
            <button key={a} type="button" aria-pressed={auto === a} className={chip(auto === a, "text-center")} onClick={() => pickAuto(a)}>{AUTO[a].name}</button>
          ))}
        </div>
      ) : null}
      {mode === "map" ? (
        <div className="mt-3 space-y-1.5" role="group" aria-label="Zoom to">
          <LevelRow ids={["all"]} level={level} pick={pickLevel} />
          <LevelRow ids={["cns", "pns"]} level={level} pick={pickLevel} />
          <LevelRow ids={["somatic", "autonomic"]} level={level} pick={pickLevel} indent={1} />
          <LevelRow ids={["sympathetic", "parasympathetic"]} level={level} pick={pickLevel} indent={2} />
        </div>
      ) : null}

      <div className={statusCls} role="status" aria-live="polite">{status}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {mode === "signal" && journey.done ? (
          <button type="button" className={cn(btn, "bg-card text-sm")} onClick={() => journey.start(journey.key, journey.legs)}><RotateCcw className="size-4" aria-hidden /> Replay</button>
        ) : null}
      </div>
      <Missions
        doneText="All missions done. You have seen the two big routes (brain and reflex) and both autonomic divisions at work."
        items={[
          { id: "brain", label: "Send a touch to the brain and back", done: ms.done("brain") },
          { id: "reflex", label: "Beat the brain with a reflex", done: ms.done("reflex") },
          { id: "fight", label: "Switch on fight or flight", done: ms.done("fight") },
          { id: "rest", label: "Calm the body: rest and digest", done: ms.done("rest") },
          { id: "autonomic", label: "Zoom into the autonomic system", done: ms.done("autonomic") },
          { id: "somatic", label: "Find the somatic system", done: ms.done("somatic") },
        ]}
      />
    </SceneCard>
  );
}

function LevelRow({ ids, level, pick, indent = 0 }: { ids: Level[]; level: Level; pick: (l: Level) => void; indent?: number }) {
  return (
    <div className={cn("grid gap-1.5", ids.length > 1 ? "grid-cols-2" : "grid-cols-1")} style={{ paddingLeft: `${indent * 0.75}rem` }}>
      {ids.map((id) => {
        const l = LEVELS.find((x) => x.id === id)!;
        return (
          <button key={id} type="button" aria-pressed={level === id} className={chip(level === id, "text-center")} onClick={() => pick(id)}>
            {indent ? <span aria-hidden className="mr-1 text-muted-foreground">└</span> : null}{l.name}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ flat view */

const S = 100, OX = 110, OY = 200;
const fx = (p: number[]) => OX + p[0] * S;
const fy = (p: number[]) => OY - p[1] * S;
const D = (k: string) => flatD(PATHS[k], S, S, OX, OY);

export function NervousFlat({ mode, journey, auto, level, onPart, reduce }: { mode: NsMode; journey: Journey; auto: Auto; level: Level; onPart: (p: Part) => void; reduce: boolean }) {
  const t = useLegProgress(journey, reduce);
  const a = AUTO[auto];
  const show = mode === "map" ? levelShows(level) : { brain: true, cord: true, somatic: mode === "signal", symp: mode === "auto", para: mode === "auto", organs: mode === "auto" };
  const symOn = mode === "auto" ? auto === "fight" : show.symp;
  const paraOn = mode === "auto" ? auto === "rest" : show.para;
  const passed = new Set(journey.legs.slice(0, Math.max(0, journey.leg)).map((l) => l.path));
  const cur = journey.cur;
  const head = cur ? along(PATHS[cur.path], t) : null;
  const beat = 60 / a.bpm;
  const breath = 60 / a.breaths;
  const dim = (on: boolean) => ({ opacity: on ? 1 : 0.18, transition: "opacity 400ms" });
  return (
    <svg viewBox="0 0 220 410" className="mx-auto block h-full w-auto max-w-full" role="img" aria-label="A body with the brain, spinal cord, nerves and organs. The written description below says what is happening.">
      <style>{`
        @keyframes ns-beat { 0%,100% { transform: scale(1) } 15% { transform: scale(1.22) } 30% { transform: scale(0.96) } }
        @keyframes ns-breathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.12) } }
        @keyframes ns-gut { to { stroke-dashoffset: -24 } }
        @keyframes ns-flow { to { stroke-dashoffset: -20 } }
        .ns-o { transform-box: fill-box; transform-origin: center; }
      `}</style>
      {/* body outline */}
      <g className="fill-foreground/10 stroke-foreground/40" strokeWidth="1.5">
        <ellipse cx={fx(BODY.head.c)} cy={fy(BODY.head.c)} rx={BODY.head.r[0] * S} ry={BODY.head.r[1] * S} />
        <rect x={OX - 10} y={fy([0, 1.33])} width="20" height="20" />
        <path d={`M${OX - 50} ${fy([0, 1.12])} Q ${OX} ${fy([0, 1.24])} ${OX + 50} ${fy([0, 1.12])} L ${OX + 40} ${fy([0, 0.1])} Q ${OX} ${fy([0, -0.25])} ${OX - 40} ${fy([0, 0.1])} Z`} />
      </g>
      {LIMBS.map((l) => (
        <polyline key={l.id} points={l.pts.map((p) => `${fx(p)},${fy(p)}`).join(" ")} fill="none" className="stroke-foreground/10" strokeWidth={l.r * S * 2} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {LIMBS.map((l) => (
        <polyline key={`${l.id}-o`} points={l.pts.map((p) => `${fx(p)},${fy(p)}`).join(" ")} fill="none" className="stroke-foreground/15" strokeWidth="1" />
      ))}
      {/* brain and cord */}
      <g style={dim(show.brain)}>
        <ellipse cx={fx(BODY.brain.c)} cy={fy(BODY.brain.c)} rx={BODY.brain.r[0] * S} ry={BODY.brain.r[1] * S} className="fill-[#f2c4c9] stroke-foreground" strokeWidth="1.5" />
        <path d={`M${OX} ${fy([0, 1.86])} V ${fy([0, 1.55])}`} className="stroke-foreground/40" strokeWidth="1" />
      </g>
      <path d={D("cord")} fill="none" className="stroke-foreground" strokeWidth="5" strokeLinecap="round" style={dim(show.cord)} />
      {/* somatic nerves */}
      <g style={dim(show.somatic)}>
        {SOMATIC.map((k) => <path key={k} d={D(k)} fill="none" className="stroke-foreground/45" strokeWidth="1.5" strokeDasharray={k.endsWith("out") ? "4 2" : undefined} />)}
      </g>
      {/* organs */}
      <g style={dim(show.organs || mode === "auto")}>
        {BODY.lungs.map((p, k) => (
          <ellipse key={k} cx={fx(p)} cy={fy(p)} rx={14 * a.airway} ry="24" className="ns-o fill-[#cfe3f7] stroke-foreground" strokeWidth="1.2" style={reduce ? undefined : { animation: `ns-breathe ${breath}s ease-in-out infinite` }} />
        ))}
        <g className="ns-o" style={reduce ? undefined : { animation: `ns-beat ${beat}s ease-in-out infinite` }}>
          <path d={`M${fx(BODY.heart)} ${fy(BODY.heart) + 10} l -10 -10 a 5.5 5.5 0 0 1 10 -6 a 5.5 5.5 0 0 1 10 6 z`} className="fill-[var(--destructive)] stroke-foreground" strokeWidth="1.2" />
        </g>
        <path d={`M${fx(BODY.stomach) - 22} ${fy(BODY.stomach) + 4} q 8 -10 16 0 t 16 0 t 16 0 M${fx(BODY.stomach) - 26} ${fy(BODY.stomach) + 16} q 8 -10 16 0 t 16 0 t 16 0 t 12 0`} fill="none" className="stroke-[#c98a4b]" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 2" style={reduce || a.gut === 0 ? undefined : { animation: `ns-gut ${2.4 - a.gut * 1.4}s linear infinite` }} />
        <circle cx={fx(BODY.bladder)} cy={fy(BODY.bladder)} r={7 + a.bladder * 4} className="fill-[#f6e7a6] stroke-foreground" strokeWidth="1.2" style={{ transition: "r 600ms" }} />
        {a.adrenaline ? <circle cx={fx(BODY.adrenal)} cy={fy(BODY.adrenal)} r="5" className="fill-[var(--primary)] stroke-foreground" strokeWidth="1" /> : null}
      </g>
      {/* eyes and pupils */}
      {BODY.eyes.map((p, k) => (
        <g key={k}>
          <circle cx={fx(p)} cy={fy(p)} r="6" className="fill-white stroke-foreground" strokeWidth="1.2" />
          <circle cx={fx(p)} cy={fy(p)} r={1.4 + (cur?.path === "eye-back" || (journey.done && journey.key === "eye-reflex") ? 0.2 : a.pupil) * 3.6} className="fill-foreground" style={{ transition: "r 500ms" }} />
        </g>
      ))}
      {/* autonomic pathways */}
      <g style={{ opacity: mode === "map" ? (show.symp ? 1 : 0.1) : symOn ? 1 : 0.15, transition: "opacity 400ms" }}>
        {SYMP.map((k) => <path key={k} d={D(k)} fill="none" className="stroke-[var(--destructive)]" strokeWidth="2" strokeDasharray="5 3" style={reduce || !symOn ? undefined : { animation: "ns-flow 0.8s linear infinite" }} />)}
      </g>
      <g style={{ opacity: mode === "map" ? (show.para ? 1 : 0.1) : paraOn ? 1 : 0.15, transition: "opacity 400ms" }}>
        {PARA.map((k) => <path key={k} d={D(k)} fill="none" className="stroke-[var(--brand)]" strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" style={reduce || !paraOn ? undefined : { animation: "ns-flow 1.4s linear infinite" }} />)}
      </g>
      {/* lit route */}
      {journey.legs.map((l, i) =>
        passed.has(l.path) || i === journey.leg ? (
          <path key={`${l.path}-${i}`} d={D(l.path)} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={i === journey.leg ? 1 - t : 0} className={l.tone === "motor" ? "stroke-[var(--destructive)]" : "stroke-[var(--brand)]"} strokeWidth="3.5" strokeLinecap="round" />
        ) : null,
      )}
      {head && cur ? (
        cur.tone === "motor" ? (
          <rect x={fx(head) - 6} y={fy(head) - 6} width="12" height="12" transform={`rotate(45 ${fx(head)} ${fy(head)})`} className="fill-[var(--destructive)] stroke-background" strokeWidth="1.5" />
        ) : (
          <circle cx={fx(head)} cy={fy(head)} r="6.5" className="fill-[var(--brand)] stroke-background" strokeWidth="1.5" />
        )
      ) : null}
      {/* tap targets */}
      {mode === "signal"
        ? (Object.keys(PARTS) as Part[]).map((p) => (
            <circle key={p} cx={fx(PARTS[p])} cy={fy(PARTS[p])} r="16" className="cursor-pointer fill-transparent stroke-[var(--brand)]" strokeWidth="1.5" strokeDasharray="3 3" onClick={() => onPart(p)}>
              <title>{PART_NAME[p]}</title>
            </circle>
          ))
        : null}
      {mode === "auto" ? (
        <text x="6" y="402" className="fill-foreground text-[11px] font-bold">{a.bpm} beats a minute</text>
      ) : null}
    </svg>
  );
}
