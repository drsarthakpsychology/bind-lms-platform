"use client";

/**
 * The body a medicine travels through, with each organ named outside it and
 * the medicine (a lime pill) at its current stop. Shared by the medicine
 * page and the Study journey widget; stage ids come from ROUTE_STAGES.
 */
import { Body, SPOT, type Organ } from "./body";
import { C, Callout, E, P, Sheet } from "./ink";

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

/** The drawing: `stops` are the stage ids of the route in order, `i` the one the medicine is at. */
export function JourneyArt({ stops, i, label, route, className }: { stops: string[]; i: number; label: string; route: string; className?: string }) {
  const cur = stops[Math.min(i, stops.length - 1)];
  const hot = STAGE_ORGAN[cur] ?? null;
  const trail = stops.slice(0, i + 1).map((s) => STAGE_SPOT[s]).filter(Boolean);
  const at = STAGE_SPOT[cur] ?? SPOT.brain;
  return (
    <Sheet name="journey" w={400} h={410} label={label} className={className}>
      <Body hot={hot} />
      {LABELS.map((l) => (
        <Callout key={l.organ} k={`lab-${l.organ}`} x={l.x} y={l.y} lines={l.lines} anchor={l.anchor} to={[l.to[0], l.to[1]]} active={l.organ === hot} size={16} />
      ))}
      {trail.length > 1 ? <P k={`trail-${route}-${i}`} d={`M${trail.map((p) => `${p[0]} ${p[1]}`).join(" L")}`} stroke={C.blue} sw={2.2} dash="6 5" single rough={0.5} /> : null}
      <g style={{ transform: `translate(${at[0]}px, ${at[1]}px)`, transition: "transform 700ms var(--ease-out-expo)" }}>
        <E k="pill" cx={0} cy={0} w={16} h={16} fill={C.lime} fillStyle="solid" sw={2} />
      </g>
    </Sheet>
  );
}
