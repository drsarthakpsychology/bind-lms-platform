"use client";

/**
 * Three static-ish sketches: where in the brain a medicine acts (agomelatine,
 * melatonin), a night of sleep with a short-acting sleeping tablet
 * (zolpidem), and what a beta blocker quietens in the body (propranolol).
 */
import * as React from "react";
import { BRAIN, Brain } from "./brain";
import { Body } from "./body";
import { Arrow, C, Callout, Choice, Cv, Fact, Figure, Label, L, P, R, Say, Sheet } from "./ink";

/* ---------------------------------------------------------------- brain map */

const REGION: Record<string, { spot: keyof typeof BRAIN; lines: string[]; x: number; y: number; to: [number, number] }> = {
  hypothalamus: { spot: "scn", lines: ["body clock", "(hypothalamus)"], x: 12, y: 262, to: [188, 212] },
  prefrontal: { spot: "prefrontal", lines: ["frontal cortex"], x: 12, y: 22, to: [74, 118] },
};

export function BrainMapSketch({ title, focus, notes, caption }: { title: string; focus: string[]; notes: Record<string, string>; caption?: string }) {
  const shown = focus.filter((f) => REGION[f]);
  return (
    <Figure title={title}>
      <Sheet name="brainmap" w={400} h={316} label={`Brain from the side, marking ${shown.map((f) => REGION[f].lines.join(" ")).join(" and ")}`}>
        <g transform="translate(0 26)">
          <Brain shade={shown.map((f) => REGION[f].spot)} />
        </g>
        {shown.map((f, i) => (
          <Callout key={f} k={`reg-${f}`} x={REGION[f].x} y={REGION[f].y} lines={[`${i + 1}. ${REGION[f].lines[0]}`, ...REGION[f].lines.slice(1)]} to={REGION[f].to} active />
        ))}
      </Sheet>
      <Say>
        <ol className="space-y-1.5">
          {shown.map((f, i) => (
            <li key={f}>
              <span className="font-semibold">
                {i + 1}. {REGION[f].lines.join(" ")}:{" "}
              </span>
              {notes[f]}
            </li>
          ))}
        </ol>
      </Say>
      {caption ? <Fact>{caption}</Fact> : null}
    </Figure>
  );
}

/* ---------------------------------------------------------------- hypnogram */

const STAGES = ["Awake", "REM", "N1", "N2", "N3"] as const;
const ROW = (s: number) => 34 + s * 30;
const HX = (h: number) => 62 + h * 37;
/** A typical night: [hours after 11 pm, stage index]. Deep sleep early, more REM late. */
const NIGHT: [number, number][] = [
  [0, 0], [0.3, 2], [0.5, 3], [0.9, 4], [1.5, 3], [1.7, 1], [1.95, 3], [2.4, 4], [2.8, 3], [3.2, 1], [3.6, 3], [4.1, 4], [4.35, 3], [4.9, 1], [5.4, 3], [6.0, 1], [6.6, 3], [7.0, 2], [7.3, 1], [7.7, 0], [8, 0],
];

function nightPath(): string {
  let d = "";
  NIGHT.forEach(([h, s], i) => {
    const x = HX(h);
    const y = ROW(s);
    if (i === 0) d = `M${x} ${y}`;
    else d += ` L${x} ${ROW(NIGHT[i - 1][1])} L${x} ${y}`;
  });
  return d;
}

/** Zolpidem in the blood: up within the first hour, then halving about every 2.5 hours. */
function level(): [number, number][] {
  const pts: [number, number][] = [];
  for (let h = 0; h <= 8.001; h += 0.25) {
    const v = h < 0.75 ? h / 0.75 : Math.pow(0.5, (h - 0.75) / 2.5);
    pts.push([HX(h), 232 - v * 40]);
  }
  return pts;
}

export function HypnogramSketch({ title, caption }: { title: string; caption?: string }) {
  return (
    <Figure title={title}>
      <Sheet name="hypnogram" w={380} h={262} label="Sleep stages across a night, with the level of a short-acting sleeping tablet">
        {STAGES.map((s, i) => (
          <g key={s}>
            <L k={`row${s}`} x1={HX(0)} y1={ROW(i)} x2={HX(8)} y2={ROW(i)} stroke={C.soft} sw={0.8} single dash="2 6" />
            <Label x={54} y={ROW(i) + 5} size={14} anchor="end">{s}</Label>
          </g>
        ))}
        <P k="night" d={nightPath()} sw={2.4} single rough={0.4} />
        {/* the tablet's level in the blood */}
        <L k="lvl-base" x1={HX(0)} y1={232} x2={HX(8)} y2={232} sw={1.6} />
        <Cv k="lvl" pts={level()} stroke={C.blue} sw={2.6} single rough={0.4} />
        <Label x={HX(8)} y={206} size={14} anchor="end" color={C.blue}>zolpidem in the blood</Label>
        {(["11 pm", "1 am", "3 am", "5 am", "7 am"] as const).map((t, i) => (
          <Label key={t} x={HX(i * 2)} y={254} size={13} anchor="middle" bold={false}>{t}</Label>
        ))}
      </Sheet>
      <Say>
        <p>Deep sleep (N3) comes mostly early in the night and dream sleep (REM) mostly late. A short-acting tablet is highest in the first hours and mostly gone by morning.</p>
      </Say>
      {caption ? <Fact>{caption}</Fact> : null}
    </Figure>
  );
}

/* ------------------------------------------------------------ nervous system */

type Mode = "calm" | "alarm" | "drug";

export function NervousSketch({ medName, title, caption }: { medName: string; title: string; caption?: string }) {
  const [mode, setMode] = React.useState<Mode>("drug");
  const alarm = mode !== "calm";
  const blocked = mode === "drug";
  return (
    <Figure title={title}>
      <Sheet name="nervous" w={400} h={410} label={mode === "calm" ? "Calm body" : mode === "alarm" ? "Fight or flight: racing heart and shaking hands" : `With ${medName.toLowerCase()}: heart and hands settle; worry remains`}>
        <Body faint hot={null} />
        {/* worry stays in the brain either way */}
        {alarm ? <Cv k="worry" pts={[[234, 20], [256, 8], [280, 14], [292, 30], [276, 44], [250, 42], [234, 30], [234, 20]]} stroke={C.ink} sw={1.6} single /> : null}
        {alarm ? <P k="worry-dots" d="M232 46 a3 3 0 1 0 0.1 0 M224 56 a2 2 0 1 0 0.1 0" sw={1.4} single /> : null}
        {/* heart beats */}
        {alarm && !blocked ? <P k="beat" d="M226 166 l8 0 l4 -12 l6 24 l4 -12 l8 0" stroke={C.red} sw={2} single /> : null}
        {/* shaking hand */}
        {alarm && !blocked ? <P k="shake" d="M92 322 q-6 6 0 12 M86 318 q-8 10 0 20 M126 324 q6 6 0 12 M132 320 q8 10 0 20" stroke={C.red} sw={1.8} single /> : null}
        {/* adrenaline from the adrenal glands */}
        {alarm ? <Arrow k="adr" from={[232, 262]} to={[220, 184]} stroke={C.red} sw={1.6} dash="4 4" /> : null}
        {blocked ? (
          <>
            <R k="b-heart" x={200} y={182} w={24} h={10} fill={C.lime} fillStyle="solid" sw={1.4} />
            <R k="b-hand" x={100} y={344} w={24} h={10} fill={C.lime} fillStyle="solid" sw={1.4} />
          </>
        ) : null}
        <Callout k="l-brain" x={304} y={40} lines={["worry", alarm ? "(untouched)" : "(none)"]} to={[262, 28]} active={blocked} />
        <Callout k="l-heart" x={304} y={176} lines={[mode === "alarm" ? "racing heart" : "heart"]} to={[224, 172]} active={mode === "alarm"} />
        <Callout k="l-adr" x={304} y={262} lines={["adrenaline"]} to={[236, 262]} />
        <Callout k="l-hand" x={98} y={392} anchor="end" lines={[mode === "alarm" ? "shaking hand" : "hand"]} to={[110, 344]} active={mode === "alarm"} />
        {blocked ? <Label x={130} y={402} size={14} color={C.blue}>beta receptors blocked</Label> : null}
      </Sheet>
      <Choice
        label="State"
        value={mode}
        onChange={setMode}
        options={[
          { id: "calm", name: "Calm" },
          { id: "alarm", name: "Fight or flight" },
          { id: "drug", name: `With ${medName.toLowerCase()}` },
        ]}
      />
      <Say live>
        <p>
          {mode === "calm"
            ? "At rest the heart beats steadily and the hands are still."
            : mode === "alarm"
              ? "In fight or flight, adrenaline acts on beta receptors: the heart races and the hands shake."
              : "The beta receptors on the heart and muscles are blocked, so the pulse and tremor settle. The anxious thoughts themselves are untouched."}
        </p>
      </Say>
      {caption ? <Fact>{caption}</Fact> : null}
    </Figure>
  );
}
