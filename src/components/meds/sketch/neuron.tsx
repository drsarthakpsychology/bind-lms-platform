"use client";

import * as React from "react";
import { C, Callout, Choice, E, Fact, Figure, L, Label, P, R, Say, Sheet } from "@/components/sketch/ink";

type State = "without" | "with";

/** A voltage trace: spike times (0 to 1 across the strip). */
const FAST = [0.04, 0.1, 0.16, 0.22, 0.28, 0.34, 0.4, 0.46, 0.52, 0.58, 0.64, 0.7, 0.76, 0.82, 0.88];
const DAMPED = [0.04, 0.1, 0.16, 0.34, 0.58, 0.82];

function trace(spikes: number[]): string {
  const x = (t: number) => 44 + t * 316;
  const base = 222;
  let d = `M${x(0)} ${base}`;
  for (const t of spikes) d += ` L${x(t)} ${base} L${x(t) + 3} ${base - 54} L${x(t) + 7} ${base + 8} L${x(t) + 12} ${base}`;
  return d + ` L${x(1)} ${base}`;
}

export function NeuronSketch({ medName, title, caption }: { medName: string; title: string; caption?: string }) {
  const [state, setState] = React.useState<State>("with");
  const w = state === "with";
  return (
    <Figure title={title}>
      <Sheet name="neuron" w={380} h={250} label={`A neuron and its firing, ${w ? `with ${medName.toLowerCase()}` : "firing fast and repeatedly"}`}>
        {/* dendrites and cell body */}
        <P k="dend" d="M58 56 L30 34 M30 34 L14 38 M30 34 L26 18 M54 84 L24 98 M24 98 L12 92 M24 98 L22 112 M48 50 L44 24" sw={1.8} single />
        <E k="soma" cx={66} cy={70} w={50} h={44} sw={2.2} fill={C.wash} fillStyle="solid" />
        <E k="nucleus" cx={64} cy={70} w={16} h={14} sw={1.4} fill={C.blue} gap={3} />
        {/* axon with myelin and the gaps between */}
        <L k="axon" x1={90} y1={70} x2={302} y2={70} sw={2.4} />
        {[112, 160, 208, 256].map((x) => (
          <R key={x} k={`my${x}`} x={x} y={61} w={36} h={18} sw={1.6} fill={C.paper} fillStyle="solid" />
        ))}
        {/* sodium channels in the gaps */}
        {[154, 202, 250].map((x) => (
          <g key={x}>
            <R k={`na${x}`} x={x - 4} y={64} w={8} h={12} sw={1.3} fill={C.blue} fillStyle="solid" />
            {w ? <E k={`drug${x}`} cx={x} cy={58} w={9} h={9} sw={1.2} fill={C.lime} fillStyle="solid" /> : null}
          </g>
        ))}
        {/* nerve endings */}
        <P k="term" d="M302 70 L330 50 M302 70 L336 70 M302 70 L330 92" sw={1.8} single />
        {[[334, 48], [340, 70], [334, 94]].map(([x, y]) => (
          <E key={y} k={`bout${y}`} cx={x} cy={y} w={11} h={11} sw={1.4} fill={C.lime} fillStyle="solid" />
        ))}
        <Label x={8} y={130} size={14}>dendrites</Label>
        <Callout k="l-soma" x={86} y={22} lines={["cell body"]} to={[78, 52]} size={14} />
        <Callout k="l-my" x={170} y={22} lines={["myelin"]} to={[178, 60]} size={14} />
        <Callout k="l-na" x={208} y={110} lines={["sodium channels"]} to={[202, 78]} size={14} active={w} />
        <Callout k="l-end" x={372} y={124} anchor="end" lines={["endings"]} to={[336, 100]} size={14} />
        {/* the voltage trace */}
        <L k="base" x1={40} y1={222} x2={364} y2={222} stroke={C.soft} sw={1} single dash="3 4" />
        <P k={`trace-${state}`} d={trace(w ? DAMPED : FAST)} stroke={w ? C.blue : C.red} sw={2} single rough={0.4} />
        <Label x={364} y={152} size={14} anchor="end" color={w ? C.blue : C.red}>{w ? "damped: ordinary firing goes on" : "fast, repeated firing"}</Label>
        <Label x={364} y={244} size={13} anchor="end" bold={false} color={C.soft}>time</Label>
      </Sheet>
      <Choice
        label="Medicine"
        value={state}
        onChange={setState}
        options={[
          { id: "without", name: "Over-firing, no medicine" },
          { id: "with", name: `With ${medName.toLowerCase()}` },
        ]}
      />
      <Say live>
        <p>{w ? "Sodium channels in fast-firing neurons are held shut for longer, so the burst is damped while ordinary firing carries on." : "In a seizure or in mania, neurons fire fast, again and again. Each spike needs sodium channels to open."}</p>
      </Say>
      {caption ? <Fact>{caption}</Fact> : null}
    </Figure>
  );
}
