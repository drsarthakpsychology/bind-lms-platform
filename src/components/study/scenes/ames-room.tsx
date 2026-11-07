"use client";

import * as React from "react";
import { ArrowLeftRight } from "lucide-react";
import type { AmesRoomData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { trackLearn } from "@/lib/learn/track";
import { Missions, Scene3DSlot, SceneCard, ViewSwitch, btn, chip, statusCls, useInView, useMissions, useSceneView, useThemeColors, type V3 } from "./kit";

/**
 * The Ames room. Through the peephole it looks like an ordinary
 * rectangular room, and two people of the same height look very different
 * in size. Step aside or look from above and the real shape appears: a
 * trapezoid whose left back corner is much farther away than its right.
 *
 * The room is built by taking a rectangular room and sliding every point
 * along its line of sight from the peephole: farther on the left, nearer on
 * the right. Points that slide along a line of sight look exactly the same
 * from the peephole, so from there the distorted room and the rectangular
 * room give identical images.
 */

/** The peephole (one eye), in metres: x right, y up, z towards the viewer. */
export const EYE: V3 = [0, 1.55, 6.5];
/** How strongly the room is skewed: a point at apparent x is pushed to exp(-K x) times its distance. */
const K = 0.24;
export const ROOM = { w: 4, h: 3, d: 4 }; // apparent room: x -2..2, y 0..3, z 0 (back wall) .. 4
export const PERSON_H = 1.6;

/** Slide an apparent (rectangular-room) point along its line of sight to where it really is. */
export function real(p: V3): V3 {
  const s = Math.exp(-K * p[0]);
  return [EYE[0] + (p[0] - EYE[0]) * s, EYE[1] + (p[1] - EYE[1]) * s, EYE[2] + (p[2] - EYE[2]) * s];
}
export const scaleAt = (x: number) => Math.exp(-K * x);
/** Apparent spots where the two people stand, in the back corners. */
export const SPOT_L: V3 = [-1.45, 0, 0.55];
export const SPOT_R: V3 = [1.45, 0, 0.55];
/** Where a walker is, t from 0 (left corner) to 1 (right corner), as an apparent point. */
export const along = (t: number): V3 => [SPOT_L[0] + (SPOT_R[0] - SPOT_L[0]) * t, 0, SPOT_L[2]];

/** How much bigger the right-corner person looks than the left-corner person from the peephole. */
export const RATIO = scaleAt(SPOT_L[0]) / scaleAt(SPOT_R[0]);
const pct = (x: number) => Math.round(x * 100);

export type AmesStop = "peephole" | "side" | "above";
const STOPS: { id: AmesStop; name: string; say: string }[] = [
  { id: "peephole", name: "Peephole", say: "Through the peephole, with one eye and your head held still, you see an ordinary rectangular room: square floor tiles, straight windows, corners at the same distance." },
  { id: "side", name: "Step to the side", say: "From the side the trick shows. The back wall slants away to the left, the left corner is much farther from you than the right, and the left side of the room is taller to make up for it." },
  { id: "above", name: "From above", say: "From above the floor is a trapezoid, not a rectangle. The two people are the same height; one simply stands about twice as far from the peephole as the other." },
];

const View3D = React.lazy(() => import("./ames-room-3d"));
export type AmesViewProps = { stop: AmesStop; swapT: number; swapping: boolean; inView: boolean; colors: ReturnType<typeof useThemeColors>; onReady?: () => void };

/** 0 = Meera in the left corner and Kabir in the right; 1 = swapped. Animated on frames, instant under reduced motion. */
function useSwap(reduce: boolean) {
  const [target, setTarget] = React.useState(0);
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    let last = -1;
    let left = 3200; // the walk takes 2.6 s; stop the loop a little after
    const tick = (now: number) => {
      const dt = last < 0 ? 16 : now - last;
      last = now;
      left -= dt;
      setT((x) => {
        if (reduce) return target;
        const n = x + (dt / 2600) * (target > x ? 1 : -1);
        return target > x ? Math.min(target, n) : Math.max(target, n);
      });
      if (left > 0 && !reduce) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduce]);
  return { t, target, swapping: t !== target, swap: () => setTarget((x) => (x ? 0 : 1)) };
}

const distFromEye = (p: V3) => Math.hypot(p[0] - EYE[0], p[1] - EYE[1], p[2] - EYE[2]);

export function AmesRoom({ d }: { d: AmesRoomData }) {
  const v = useSceneView();
  const box = React.useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const colors = useThemeColors(box);
  const [stop, setStop] = React.useState<AmesStop>("peephole");
  const sw = useSwap(v.reduce);
  const ms = useMissions(["peep", "swap", "side", "above"] as const);
  React.useEffect(() => {
    if (sw.t !== 1) return;
    const t = setTimeout(() => ms.mark("swap"), 0);
    return () => clearTimeout(t);
  }, [sw.t, ms]);
  const go = (s: AmesStop) => {
    setStop(s);
    ms.mark(s === "peephole" ? "peep" : s);
    trackLearn({ type: "widget", kind: "amesroom", item: s });
  };
  const leftName = sw.target ? "Kabir" : "Meera";
  const rightName = sw.target ? "Meera" : "Kabir";
  const st = STOPS.find((x) => x.id === stop)!;
  const flat = <AmesFlat stop={stop} swapT={sw.t} />;
  return (
    <SceneCard title={d.title ?? "The Ames room"} goal="Look through the peephole, swap the two people, then step aside and find out why your eyes were fooled." caption={d.caption} tools={<ViewSwitch v={v} />}>
      <div ref={box} className="relative mt-3 h-[17rem] overflow-hidden rounded-xl border-2 border-foreground bg-background sm:h-[22rem]">
        {v.use3D ? <Scene3DSlot flat={flat} render={(onReady) => <View3D stop={stop} swapT={sw.t} swapping={sw.swapping} inView={inView} colors={colors} onReady={onReady} />} /> : flat}
        {v.use3D && stop !== "peephole" ? <p className="pointer-events-none absolute bottom-1.5 left-2 rounded bg-background/80 px-1.5 text-xs text-muted-foreground">Drag to walk round the room, pinch to zoom</p> : null}
        {stop === "peephole" ? <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_0_9999px_rgba(0,0,0,0)]" style={{ background: "radial-gradient(circle at 50% 50%, transparent 58%, rgba(0,0,0,0.55) 72%)" }} aria-hidden /> : null}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5" role="group" aria-label="Where to look from">
        {STOPS.map((s) => (
          <button key={s.id} type="button" aria-pressed={stop === s.id} className={chip(stop === s.id, "px-2 text-center text-xs sm:text-sm")} onClick={() => go(s.id)}>{s.name}</button>
        ))}
      </div>
      <div className="mt-2">
        <button type="button" className={cn(btn, "min-h-12 bg-primary px-5 text-primary-foreground hover:-translate-y-0.5")} onClick={() => {
            sw.swap();
            if (stop === "peephole") ms.mark("peep");
            trackLearn({ type: "widget", kind: "amesroom", item: "swap" });
          }}>
          <ArrowLeftRight className="size-4" aria-hidden /> {sw.swapping ? "Walking..." : "Swap places"}
        </button>
      </div>
      <div className={statusCls} role="status" aria-live="polite">
        <p><span className="font-semibold">{st.name}: </span>{st.say}</p>
        <p className="mt-1">
          {sw.swapping
            ? `They are walking across the back of the room. Through the peephole, the one walking left seems to shrink and the one walking right seems to grow, though neither changes at all.`
            : stop === "peephole"
              ? `${leftName}, in the left corner, looks only about ${pct(1 / RATIO)} percent as tall as ${rightName} in the right corner. Both are ${PERSON_H} metres tall.`
              : `${leftName} stands about ${distFromEye(real(SPOT_L)).toFixed(1)} metres from the peephole and ${rightName} about ${distFromEye(real(SPOT_R)).toFixed(1)} metres. Same height, about ${RATIO.toFixed(1)} times the distance.`}
        </p>
        <p className="mt-2"><span className="font-semibold">Why it works: </span>Size constancy normally corrects for distance: a person twice as far away casts an image half the size, and you still see them as normal size because you judge the distance. Here the distance cues lie. The floor tiles, windows and corners are drawn so that, from the peephole, linear perspective and texture say both corners are equally far. One eye through a fixed hole removes the cues that would expose the trick: no binocular disparity and no motion parallax. So the brain keeps the assumption that rooms are rectangular, and has to conclude that the people are different sizes.</p>
        <p className="mt-1 text-sm text-muted-foreground">The room was designed by Adelbert Ames Jr. in 1946. The assumption is so strong that familiar size loses: we would rather believe a person has shrunk than that a room is crooked.</p>
      </div>
      <Missions
        doneText="All missions done: you have seen size constancy fooled, and found the distance cue that fooled it."
        items={[
          { id: "peep", label: "Look through the peephole", done: ms.done("peep") },
          { id: "swap", label: "Swap places and watch them change size", done: ms.done("swap") },
          { id: "side", label: "Step to the side", done: ms.done("side") },
          { id: "above", label: "See the real shape from above", done: ms.done("above") },
        ]}
      />
    </SceneCard>
  );
}

/* ------------------------------------------------------------ flat twin */

/** Peephole: the rectangular-looking room drawn in perspective. Side or above: the floor plan with sight lines. */
export function AmesFlat({ stop, swapT }: { stop: AmesStop; swapT: number }) {
  const meera = along(swapT); // Meera walks from left to right as swapT goes 0 to 1
  const kabir = along(1 - swapT);
  if (stop === "peephole") {
    // a simple one-point perspective drawing of the apparent rectangular room
    const F = 300; // focal length in drawing units
    const pr = (p: V3): [number, number] => {
      const z = EYE[2] - p[2];
      return [160 + (F * (p[0] - EYE[0])) / z, 150 - (F * (p[1] - EYE[1])) / z];
    };
    const quad = (a: V3, b: V3, c: V3, dd: V3) => [a, b, c, dd].map((p) => pr(p).join(",")).join(" ");
    const tiles: React.ReactNode[] = [];
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      const x0 = -2 + i * 0.5, z0 = j * 0.5;
      tiles.push(<polygon key={`${i}-${j}`} points={quad([x0, 0, z0], [x0 + 0.5, 0, z0], [x0 + 0.5, 0, z0 + 0.5], [x0, 0, z0 + 0.5])} className={(i + j) % 2 ? "fill-foreground/70" : "fill-card"} />);
    }
    const person = (p: V3, label: string, tone: string) => {
      // apparent height = real height divided by how far the spot was really pushed
      const h = PERSON_H / scaleAt(p[0]);
      const [fx, fy] = pr(p);
      const [, hy] = pr([p[0], h, p[2]]);
      const hh = fy - hy;
      return (
        <g key={label}>
          <rect x={fx - hh * 0.13} y={hy + hh * 0.2} width={hh * 0.26} height={hh * 0.8} rx={hh * 0.08} className={tone} />
          <circle cx={fx} cy={hy + hh * 0.1} r={hh * 0.1} className="fill-[#e2b48f] stroke-foreground" strokeWidth="1" />
          <text x={fx} y={fy + 14} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">{label}</text>
        </g>
      );
    };
    return (
      <svg viewBox="0 0 320 270" className="block h-full w-full" role="img" aria-label="Through the peephole: a rectangular-looking room with two people of very different apparent size.">
        <polygon points={quad([-2, 0, 0], [2, 0, 0], [2, 3, 0], [-2, 3, 0])} className="fill-[#f3e6d0] stroke-foreground" />
        <polygon points={quad([-2, 0, 0], [-2, 0, 4], [-2, 3, 4], [-2, 3, 0])} className="fill-[#ead7bb] stroke-foreground" />
        <polygon points={quad([2, 0, 0], [2, 0, 4], [2, 3, 4], [2, 3, 0])} className="fill-[#ead7bb] stroke-foreground" />
        {tiles}
        {[-1.2, 1.2].map((x) => <polygon key={x} points={quad([x - 0.45, 1.3, 0], [x + 0.45, 1.3, 0], [x + 0.45, 2.3, 0], [x - 0.45, 2.3, 0])} className="fill-[#b9d3ef] stroke-foreground" />)}
        {person(meera, "Meera", "fill-[var(--brand)] stroke-foreground")}
        {person(kabir, "Kabir", "fill-[var(--destructive)] stroke-foreground")}
      </svg>
    );
  }
  // floor plan from above: the eye at the bottom, the trapezoid room above it
  const S = 32;
  const P = (p: V3): [number, number] => [160 + p[0] * S, 250 - (p[2] - (EYE[2] - 7)) * S];
  const corners = [real([-2, 0, 0]), real([2, 0, 0]), real([2, 0, 4]), real([-2, 0, 4])].map(P);
  const e = P(EYE);
  const dot = (p: V3, label: string, cls: string) => {
    const [x, y] = P(real(p));
    return (
      <g key={label}>
        <line x1={e[0]} y1={e[1]} x2={x} y2={y} className="stroke-foreground/40" strokeDasharray="4 3" />
        <circle cx={x} cy={y} r="9" className={cls} />
        <text x={x} y={y - 13} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">{label}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 320 270" className="block h-full w-full" role="img" aria-label="The room from above: a trapezoid. The left corner is much farther from the peephole than the right.">
      <polygon points={corners.map((c) => c.join(",")).join(" ")} className="fill-[#f3e6d0] stroke-foreground" strokeWidth="2" />
      {dot(meera, "Meera", "fill-[var(--brand)] stroke-foreground")}
      {dot(kabir, "Kabir", "fill-[var(--destructive)] stroke-foreground")}
      <circle cx={e[0]} cy={e[1]} r="6" className="fill-foreground" />
      <text x={e[0]} y={e[1] + 16} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">peephole</text>
      <text x="12" y="16" className="fill-muted-foreground text-[11px]">seen from above</text>
    </svg>
  );
}
