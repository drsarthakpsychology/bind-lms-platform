"use client";

import * as React from "react";
import { ROUTE_STAGES } from "@/components/study/animations";
import type { Route } from "@/lib/meds/mechanisms";
import { cn } from "@/lib/utils";
import { Body, SPOT, type Organ } from "@/components/sketch/body";
import { C, Callout, Choice, E, Figure, P, Say, Sheet } from "@/components/sketch/ink";

const ROUTE_NAME: Record<Route, string> = { oral: "Tablet", iv: "Into a vein", nasal: "Nasal spray", depot: "Depot injection" };

/** Which organ each stage of the journey lights up. */
const STAGE_ORGAN: Record<string, Organ> = { mouth: "mouth", gut: "gut", liver: "liver", blood: "vessel", bbb: "bbb", target: "brain", out: "kidney", vein: "vein", nose: "nose", muscle: "muscle", slow: "muscle" };
const STAGE_SPOT: Record<string, readonly [number, number]> = { mouth: SPOT.mouth, gut: SPOT.gut, liver: SPOT.liver, blood: SPOT.heart, bbb: SPOT.bbb, target: SPOT.brain, out: SPOT.kidney, vein: SPOT.vein, nose: SPOT.nose, muscle: SPOT.muscle, slow: SPOT.slow };

/** Labels outside the body, with leader lines in. Left side ends at x 98, right side starts at x 304. */
const LABELS: { organ: Organ; lines: string[]; x: number; y: number; anchor: "start" | "end"; to: readonly [number, number] }[] = [
  { organ: "brain", lines: ["brain"], x: 98, y: 40, anchor: "end", to: [176, 44] },
  { organ: "nose", lines: ["nose"], x: 98, y: 80, anchor: "end", to: [196, 76] },
  { organ: "liver", lines: ["liver"], x: 98, y: 214, anchor: "end", to: [166, 222] },
  { organ: "kidney", lines: ["kidneys"], x: 98, y: 262, anchor: "end", to: [164, 266] },
  { organ: "vein", lines: ["arm vein"], x: 98, y: 312, anchor: "end", to: [120, 296] },
  { organ: "bbb", lines: ["blood-brain", "barrier"], x: 304, y: 24, anchor: "start", to: [232, 46] },
  { organ: "mouth", lines: ["mouth"], x: 304, y: 92, anchor: "start", to: [208, 92] },
  { organ: "muscle", lines: ["shoulder", "muscle"], x: 304, y: 128, anchor: "start", to: [272, 150] },
  { organ: "heart", lines: ["heart"], x: 304, y: 180, anchor: "start", to: [224, 172] },
  { organ: "stomach", lines: ["stomach"], x: 304, y: 222, anchor: "start", to: [244, 230] },
  { organ: "vessel", lines: ["bloodstream"], x: 304, y: 262, anchor: "start", to: [207, 256] },
  { organ: "gut", lines: ["small", "intestine"], x: 304, y: 296, anchor: "start", to: [224, 300] },
];

export function JourneySketch({ medName, target, routes, notes }: { medName: string; target: string; routes: Route[]; notes?: Record<string, string> }) {
  const [route, setRoute] = React.useState<Route>(routes[0] ?? "oral");
  const [i, setI] = React.useState(0);
  const stages = ROUTE_STAGES[route].map((s) => ({ ...s, text: notes?.[s.id] ?? (s.id === "target" ? `At last it reaches its target: ${target}. There it acts on receptors, and this is where the effect (and many side effects) begins.` : s.text) }));
  const cur = stages[Math.min(i, stages.length - 1)];
  const hot = STAGE_ORGAN[cur.id] ?? null;
  const trail = stages.slice(0, i + 1).map((s) => STAGE_SPOT[s.id]).filter(Boolean);
  const at = STAGE_SPOT[cur.id] ?? SPOT.brain;
  return (
    <Figure title={`${medName} through the body`}>
      {routes.length > 1 ? (
        <Choice
          label="Route"
          value={route}
          onChange={(r) => {
            setRoute(r);
            setI(0);
          }}
          options={routes.map((r) => ({ id: r, name: ROUTE_NAME[r] }))}
        />
      ) : null}
      <Sheet name="journey" w={400} h={410} label={`${medName}: ${cur.name}`}>
        <Body hot={hot} />
        {LABELS.map((l) => (
          <Callout key={l.organ} k={`lab-${l.organ}`} x={l.x} y={l.y} lines={l.lines} anchor={l.anchor} to={[l.to[0], l.to[1]]} active={l.organ === hot} size={16} />
        ))}
        {trail.length > 1 ? <P k={`trail-${route}-${i}`} d={`M${trail.map((p) => `${p[0]} ${p[1]}`).join(" L")}`} stroke={C.blue} sw={2.2} dash="6 5" single rough={0.5} /> : null}
        <g style={{ transform: `translate(${at[0]}px, ${at[1]}px)`, transition: "transform 700ms var(--ease-out-expo)" }}>
          <E k="pill" cx={0} cy={0} w={16} h={16} fill={C.lime} fillStyle="solid" sw={2} />
        </g>
      </Sheet>
      <ol className="flex flex-wrap gap-1.5" aria-label="Stages">
        {stages.map((s, k) => (
          <li key={s.id}>
            <button
              type="button"
              aria-pressed={k === i}
              onClick={() => setI(k)}
              className={cn("inline-flex min-h-10 items-center gap-1.5 rounded-md border-2 px-2.5 text-sm font-semibold", k === i ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card hover:border-foreground")}
            >
              <span className="tabular-nums opacity-70">{k + 1}</span> {s.name}
            </button>
          </li>
        ))}
      </ol>
      <Say live>
        <p>
          <span className="font-semibold">
            {i + 1}. {cur.name}:{" "}
          </span>
          {cur.text}
        </p>
      </Say>
    </Figure>
  );
}
