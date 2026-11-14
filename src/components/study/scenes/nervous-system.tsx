"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import type { NervousSystemData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { QuickChallenge, type ChallengeQ } from "./challenge";
import { sfx } from "./sfx";
import { C, Cv, E, Label, P, R, Sheet } from "@/components/sketch/ink";

const NS_CHALLENGE: ChallengeQ[] = [
  { q: "You touch a hot cup. Which happens first?", options: ["You feel the pain", "You pull your hand away", "Both at exactly the same moment"], answer: 1, why: "The reflex loops through the spinal cord only, so the hand starts to pull away before the pain message has reached the brain and been felt." },
  { q: "Which division speeds up the heart and widens the pupils?", options: ["Parasympathetic", "Somatic", "Sympathetic"], answer: 2, why: "The sympathetic division readies the body for fight or flight: faster heart, wider pupils, airways open, digestion slowed. The parasympathetic does the opposite." },
  { q: "Which nerve carries most of the rest-and-digest outflow to the heart and gut?", options: ["The vagus nerve", "The sciatic nerve", "The optic nerve"], answer: 0, why: "The vagus nerve (cranial nerve X) carries parasympathetic fibres to the heart, lungs and gut: it slows the heart and speeds digestion." },
  { q: "The brain and the spinal cord together are the...", options: ["Peripheral nervous system", "Central nervous system", "Autonomic nervous system"], answer: 1, why: "Brain and spinal cord form the central nervous system. Everything outside them, the somatic and autonomic nerves, is the peripheral nervous system." },
];
import { JourneySteps, ModeTabs, Scene3DSlot, SceneCard, ViewSwitch, along, btn, chip, flatD, statusCls, useInView, useJourney, useLegProgress, useSceneView, useThemeColors, type Journey } from "./kit";
import { AUTO, BODY, LEVELS, LIMBS, PARA, PARTS, PART_NAME, PATHS, SOMATIC, SYMP, levelShows, routeLegs, type Auto, type Level, type Part, type Route } from "./nervous-system-data";

/**
 * The nervous system as a body the student plays with: tap a part and watch
 * the signal travel to the brain and back (or take the reflex shortcut),
 * switch the body between fight or flight and rest and digest, and zoom from
 * the whole system down to its divisions. 3D when the device can draw it,
 * a flat animated drawing otherwise; every state is written below.
 */

export type NsMode = "signal" | "auto" | "map";
export type NsViewProps = { mode: NsMode; journey: Journey; auto: Auto; level: Level; onPart: (p: Part) => void; inView: boolean; colors: ReturnType<typeof useThemeColors>; onReady?: () => void };

/** Loaded only when the device can draw 3D: three.js lives in this lazy chunk. */
const View3D = React.lazy(() => import("./nervous-system-3d"));

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
  const journey = useJourney();

  const send = (p: Part) => {
    if (mode !== "signal") setMode("signal");
    journey.start(`${p}-${route}`, routeLegs(p, route));
    sfx("pulse");
    trackLearn({ type: "widget", kind: "nervoussystem", item: `${p}-${route}` });
  };
  const pickAuto = (a: Auto) => {
    setAuto(a);
    sfx(a === "fight" ? "zap" : "whoosh");
    trackLearn({ type: "widget", kind: "nervoussystem", item: a });
  };
  const pickLevel = (l: Level) => {
    setLevel(l);
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
    if (journey.legs.length) return <JourneySteps journey={journey} />;
    return <>A <span className="font-semibold">sensory</span> signal (round, blue) travels in; a <span className="font-semibold">motor</span> signal (square, red) travels out.</>;
  })();

  return (
    <SceneCard title={d.title ?? "The nervous system, live"} caption={d.caption} tools={<ViewSwitch v={v} />} sound>
      <ModeTabs<NsMode> name="What to explore" value={mode} onChange={changeMode} modes={[{ id: "signal", label: "Send a signal" }, { id: "auto", label: "Organs on autopilot" }, { id: "map", label: "Zoom the map" }]} />
      <div ref={box} className="relative mt-3 h-[22rem] overflow-hidden rounded-xl border-2 border-foreground bg-background sm:h-[28rem]">
        {v.use3D ? (
          <Scene3DSlot
            flat={<NervousFlat mode={mode} journey={journey} auto={auto} level={level} onPart={send} reduce={v.reduce} />}
            render={(onReady) => <View3D mode={mode} journey={journey} auto={auto} level={level} onPart={send} inView={inView} colors={colors} onReady={onReady} />}
          />
        ) : (
          <NervousFlat mode={mode} journey={journey} auto={auto} level={level} onPart={send} reduce={v.reduce} />
        )}
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
      <QuickChallenge title="Reflexes and the two divisions" kind="nervoussystem" items={NS_CHALLENGE} />
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

/** The body, brain, cord and somatic nerves: drawn once per view, not every frame. */
const NervousBody = React.memo(function NervousBody({ brain, cord, somatic }: { brain: boolean; cord: boolean; somatic: boolean }) {
  const dim = (on: boolean) => ({ opacity: on ? 1 : 0.18, transition: "opacity 400ms" });
  return (
    <>
      {LIMBS.map((l) => (
        <polyline key={l.id} points={l.pts.map((p) => `${fx(p)},${fy(p)}`).join(" ")} fill="none" stroke={C.wash} strokeWidth={l.r * S * 2} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {LIMBS.map((l) => (
        <Cv key={`${l.id}-o`} k={`ns-limb-${l.id}`} pts={l.pts.map((p) => [fx(p), fy(p)] as [number, number])} stroke={C.soft} sw={1} single rough={0.5} />
      ))}
      <E k="ns-head" cx={fx(BODY.head.c)} cy={fy(BODY.head.c)} w={BODY.head.r[0] * S * 2} h={BODY.head.r[1] * S * 2} sw={1.6} fill={C.wash} fillStyle="solid" />
      <R k="ns-neck" x={OX - 10} y={fy([0, 1.33])} w={20} h={20} sw={1.4} fill={C.wash} fillStyle="solid" />
      <P k="ns-trunk" d={`M${OX - 50} ${fy([0, 1.12])} Q ${OX} ${fy([0, 1.24])} ${OX + 50} ${fy([0, 1.12])} L ${OX + 40} ${fy([0, 0.1])} Q ${OX} ${fy([0, -0.25])} ${OX - 40} ${fy([0, 0.1])} Z`} sw={1.6} fill={C.wash} fillStyle="solid" />
      <g style={dim(brain)}>
        <E k="ns-brain" cx={fx(BODY.brain.c)} cy={fy(BODY.brain.c)} w={BODY.brain.r[0] * S * 2} h={BODY.brain.r[1] * S * 2} sw={1.6} fill={C.lime} gap={3.5} />
      </g>
      <g style={dim(cord)}>
        <P k="ns-cord" d={D("cord")} sw={4.4} single rough={0.4} />
      </g>
      <g style={dim(somatic)}>
        {SOMATIC.map((k) => <P key={k} k={`ns-som-${k}`} d={D(k)} stroke={C.ink} sw={1.4} single rough={0.5} dash={k.endsWith("out") ? "4 3" : undefined} style={{ opacity: 0.6 }} />)}
      </g>
    </>
  );
});

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
    <Sheet bare name="nervous-flat" w={220} h={410} label="A body with the brain, spinal cord, nerves and organs. The written description below says what is happening." className="mx-auto h-full w-auto max-w-full">
      <style>{`
        @keyframes ns-beat { 0%,100% { transform: scale(1) } 15% { transform: scale(1.22) } 30% { transform: scale(0.96) } }
        @keyframes ns-breathe { 0%,100% { transform: scale(1) } 50% { transform: scale(1.12) } }
        @keyframes ns-gut { to { stroke-dashoffset: -24 } }
        @keyframes ns-flow { to { stroke-dashoffset: -20 } }
        .ns-o { transform-box: fill-box; transform-origin: center; }
      `}</style>
      <NervousBody brain={show.brain} cord={show.cord} somatic={show.somatic} />
      {/* organs */}
      <g style={dim(show.organs || mode === "auto")}>
        {BODY.lungs.map((p, k) => (
          <ellipse key={k} cx={fx(p)} cy={fy(p)} rx={14 * a.airway} ry="24" className="ns-o" fill={C.wash} stroke={C.ink} strokeWidth={1.4} style={reduce ? undefined : { animation: `ns-breathe ${breath}s ease-in-out infinite` }} />
        ))}
        <g className="ns-o" style={reduce ? undefined : { animation: `ns-beat ${beat}s ease-in-out infinite` }}>
          <path d={`M${fx(BODY.heart)} ${fy(BODY.heart) + 10} l -10 -10 a 5.5 5.5 0 0 1 10 -6 a 5.5 5.5 0 0 1 10 6 z`} fill={C.red} stroke={C.ink} strokeWidth={1.4} strokeLinejoin="round" />
        </g>
        <path d={`M${fx(BODY.stomach) - 22} ${fy(BODY.stomach) + 4} q 8 -10 16 0 t 16 0 t 16 0 M${fx(BODY.stomach) - 26} ${fy(BODY.stomach) + 16} q 8 -10 16 0 t 16 0 t 16 0 t 12 0`} fill="none" stroke={C.soft} strokeWidth={4} strokeLinecap="round" strokeDasharray="6 2" style={reduce || a.gut === 0 ? undefined : { animation: `ns-gut ${2.4 - a.gut * 1.4}s linear infinite` }} />
        <circle cx={fx(BODY.bladder)} cy={fy(BODY.bladder)} r={7 + a.bladder * 4} fill={C.lime} stroke={C.ink} strokeWidth={1.4} style={{ transition: "r 600ms" }} />
        {a.adrenaline ? <circle cx={fx(BODY.adrenal)} cy={fy(BODY.adrenal)} r="5" fill={C.lime} stroke={C.ink} strokeWidth={1.2} /> : null}
      </g>
      {/* eyes and pupils */}
      {BODY.eyes.map((p, k) => (
        <g key={k}>
          <circle cx={fx(p)} cy={fy(p)} r="6" fill={C.paper} stroke={C.ink} strokeWidth={1.4} />
          <circle cx={fx(p)} cy={fy(p)} r={1.4 + (cur?.path === "eye-back" || (journey.done && journey.key === "eye-reflex") ? 0.2 : a.pupil) * 3.6} fill={C.ink} style={{ transition: "r 500ms" }} />
        </g>
      ))}
      {/* autonomic pathways */}
      <g style={{ opacity: mode === "map" ? (show.symp ? 1 : 0.1) : symOn ? 1 : 0.15, transition: "opacity 400ms" }}>
        {SYMP.map((k) => <path key={k} d={D(k)} fill="none" stroke={C.red} strokeWidth={2} strokeLinecap="round" strokeDasharray="5 3" style={reduce || !symOn ? undefined : { animation: "ns-flow 0.8s linear infinite" }} />)}
      </g>
      <g style={{ opacity: mode === "map" ? (show.para ? 1 : 0.1) : paraOn ? 1 : 0.15, transition: "opacity 400ms" }}>
        {PARA.map((k) => <path key={k} d={D(k)} fill="none" stroke={C.blue} strokeWidth={2} strokeDasharray="1 3" strokeLinecap="round" style={reduce || !paraOn ? undefined : { animation: "ns-flow 1.4s linear infinite" }} />)}
      </g>
      {/* lit route */}
      {journey.legs.map((l, i) =>
        passed.has(l.path) || i === journey.leg ? (
          <path key={`${l.path}-${i}`} d={D(l.path)} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={i === journey.leg ? 1 - t : 0} stroke={l.tone === "motor" ? C.red : C.blue} strokeWidth={3.5} strokeLinecap="round" />
        ) : null,
      )}
      {head && cur ? (
        cur.tone === "motor" ? (
          <rect x={fx(head) - 6} y={fy(head) - 6} width="12" height="12" transform={`rotate(45 ${fx(head)} ${fy(head)})`} fill={C.red} stroke={C.paper} strokeWidth={1.5} />
        ) : (
          <circle cx={fx(head)} cy={fy(head)} r="6.5" fill={C.lime} stroke={C.ink} strokeWidth={1.5} />
        )
      ) : null}
      {/* tap targets */}
      {mode === "signal"
        ? (Object.keys(PARTS) as Part[]).map((p) => (
            <circle key={p} cx={fx(PARTS[p])} cy={fy(PARTS[p])} r="16" className="cursor-pointer" fill="transparent" stroke={C.blue} strokeWidth={1.5} strokeDasharray="3 3" onClick={() => onPart(p)}>
              <title>{PART_NAME[p]}</title>
            </circle>
          ))
        : null}
      {mode === "auto" ? (
        <Label x={6} y={402} size={14}>{`${a.bpm} beats a minute`}</Label>
      ) : null}
    </Sheet>
  );
}
