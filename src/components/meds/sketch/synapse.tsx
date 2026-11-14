"use client";

import * as React from "react";
import { Arrow, C, Callout, Choice, E, Fact, Figure, Label, P, R, Say, Sheet } from "./ink";

/** What the medicine does at the synapse. */
export type SynapseAction = "reuptake" | "gaba" | "calcium" | "enzyme" | "nmda" | "glutamate";

type State = "without" | "with";

/** Plain words for each picture, without and with the medicine. */
const SAY: Record<SynapseAction, Record<State, string>> = {
  reuptake: {
    without: "The nerve ending releases its messenger into the gap. Some reaches the receptors on the next cell; the pump soon pulls the rest back in to be reused.",
    with: "The medicine blocks the pump, so the messenger stays in the gap longer and keeps reaching the receptors on the next cell.",
  },
  gaba: {
    without: "GABA is released and opens the GABA-A receptor, a channel that lets chloride into the next cell. Chloride makes that cell less likely to fire.",
    with: "The medicine sits at the benzodiazepine site, a separate spot on the same receptor. Each GABA signal now opens the channel more, so more chloride flows in and the cell is calmer.",
  },
  calcium: {
    without: "When a signal arrives, calcium channels open and calcium rushes into the nerve ending. Calcium makes the vesicles release their glutamate.",
    with: "The medicine binds the alpha-2-delta part of the calcium channel. Less calcium enters an over-active ending, so less glutamate is released.",
  },
  enzyme: {
    without: "Acetylcholine is released into the gap. An enzyme, acetylcholinesterase, quickly splits it, so each message is short.",
    with: "The medicine slows the enzyme, so acetylcholine lasts longer in the gap and a weak signal gets through better.",
  },
  nmda: {
    without: "Too much glutamate holds the NMDA channel open for too long, and calcium floods the next cell. Over time this harms nerve cells.",
    with: "The medicine slips into the NMDA channel only while it is held open too long, and leaves quickly. Normal signals still pass; the flood is cut.",
  },
  glutamate: {
    without: "After long heavy drinking stops, the glutamate system is turned up: too much excitement, with discomfort and craving.",
    with: "The medicine is thought to calm this over-excited glutamate system. Exactly how is unclear.",
  },
};

const VESICLES: [number, number][] = [
  [138, 66], [172, 56], [206, 66], [154, 92], [190, 90],
];

/** Small messenger dots scattered in the gap. */
function dots(n: number, seed: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const t = (i * 0.618 + seed) % 1;
    out.push([124 + ((i * 37) % 120), 128 + (((i * 53 + seed * 100) % 22) | 0) + t]);
  }
  return out;
}

export function SynapseSketch({ medName, action, transmitter, title, caption }: { medName: string; action: SynapseAction; transmitter: string; title: string; caption?: string }) {
  const [state, setState] = React.useState<State>("with");
  const w = state === "with";
  const name = medName.toLowerCase();
  const many = action === "reuptake" || action === "enzyme" ? (w ? 11 : 4) : action === "calcium" || action === "glutamate" ? (w ? 4 : 10) : 6;
  const cleft = dots(many, action.length / 10);
  const word = action === "gaba" ? "GABA" : action === "nmda" || action === "calcium" || action === "glutamate" ? "glutamate" : action === "enzyme" ? "acetylcholine" : transmitter;
  const channel = action === "gaba" || action === "nmda";
  return (
    <Figure title={title}>
      <Sheet name={`synapse-${action}`} w={380} h={270} label={`${title}: ${w ? "with" : "without"} ${name}`}>
        {/* the nerve ending, full of vesicles */}
        <P k="pre" d="M160 0 C160 24 96 26 92 64 C88 104 128 114 182 114 C236 114 276 104 272 64 C268 26 204 24 204 0" sw={2.2} fill={C.wash} fillStyle="solid" />
        {VESICLES.map(([x, y], i) => (
          <g key={i}>
            <E k={`ves${i}`} cx={x} cy={y} w={24} h={24} sw={1.5} />
            <E k={`vesd${i}`} cx={x} cy={y} w={8} h={8} stroke="none" fill={C.blue} fillStyle="solid" />
          </g>
        ))}
        {/* the next cell, with receptors on its surface */}
        <P k="post" d="M60 270 L60 172 C60 160 72 158 88 158 L292 158 C308 158 318 160 318 172 L318 270" sw={2.2} fill={C.wash} fillStyle="solid" />
        {[130, 236].map((x) => (
          <P key={x} k={`rec${x}`} d={`M${x - 12} 146 L${x - 12} 162 L${x + 12} 162 L${x + 12} 146 L${x + 6} 146 L${x + 6} 154 L${x - 6} 154 L${x - 6} 146 Z`} sw={1.6} fill={w && (action === "reuptake" || action === "enzyme") ? C.lime : C.blue} gap={4} />
        ))}
        {/* the centre receptor: a channel for GABA-A and NMDA, an ordinary receptor otherwise */}
        {channel ? (
          <>
            <R k="ch-l" x={168} y={140} w={14} h={36} sw={1.8} fill={C.blue} gap={5} />
            <R k="ch-r" x={196} y={140} w={14} h={36} sw={1.8} fill={C.blue} gap={5} />
            {action === "gaba" ? <P k="bz-site" d="M210 150 q10 0 10 8 q0 8 -10 8" sw={1.6} fill={w ? C.lime : undefined} fillStyle="solid" /> : null}
            {action === "nmda" && w ? <E k="plug" cx={189} cy={158} w={12} h={18} fill={C.lime} fillStyle="solid" sw={1.6} /> : null}
            {[0, 1, 2].slice(0, action === "gaba" ? (w ? 3 : 1) : w ? 1 : 3).map((k) => (
              <Arrow key={k} k={`ion${k}`} from={[180 + k * 10 - 10, 182]} to={[176 + k * 14 - 14, 220]} stroke={action === "gaba" ? C.blue : C.red} sw={2.2} />
            ))}
          </>
        ) : (
          <P k="rec-mid" d="M171 146 L171 162 L195 162 L195 146 L189 146 L189 154 L177 154 L177 146 Z" sw={1.6} fill={action === "glutamate" && !w ? C.red : w && (action === "reuptake" || action === "enzyme") ? C.lime : C.blue} gap={4} />
        )}
        {/* messenger in the gap */}
        {cleft.map(([x, y], i) => (
          <E key={i} k={`dot${i}`} cx={x} cy={y} w={7} h={7} stroke="none" fill={C.blue} fillStyle="solid" />
        ))}
        {/* the pump that recycles it */}
        {action === "reuptake" ? (
          <>
            <R k="pump" x={248} y={98} w={20} h={18} sw={1.8} fill={w ? C.lime : undefined} fillStyle="solid" />
            {w ? <P k="pump-x" d="M250 100 l16 14 M266 100 l-16 14" stroke={C.ink} sw={1.8} single /> : <Arrow k="recycle" from={[262, 132]} to={[256, 84]} stroke={C.blue} sw={2} />}
          </>
        ) : null}
        {/* the calcium channel on the nerve ending */}
        {action === "calcium" ? (
          <>
            <R k="ca-ch" x={110} y={100} w={18} h={18} sw={1.8} fill={w ? C.lime : undefined} fillStyle="solid" />
            {[0, 1, 2].slice(0, w ? 1 : 3).map((k) => (
              <Arrow key={k} k={`ca${k}`} from={[104 + k * 12, 140]} to={[112 + k * 6, 92]} stroke={C.red} sw={2} />
            ))}
          </>
        ) : null}
        {/* the enzyme that splits acetylcholine */}
        {action === "enzyme" ? (
          <>
            <P k="enzyme" d="M268 124 a14 14 0 1 0 0 22 l-12 -11 Z" sw={1.8} fill={w ? C.soft : C.red} gap={4} />
            {w ? <R k="enz-block" x={262} y={128} w={12} h={14} fill={C.lime} fillStyle="solid" sw={1.4} /> : null}
          </>
        ) : null}
        {/* labels */}
        <Label x={12} y={24}>nerve ending</Label>
        <Callout k="l-ves" x={12} y={70} lines={["vesicles"]} to={[124, 68]} />
        <Callout k="l-word" x={12} y={138} lines={[word]} to={[cleft[0][0] - 4, cleft[0][1]]} />
        <Label x={72} y={256}>next cell</Label>
        {action === "reuptake" ? <Callout k="l-pump" x={292} y={92} lines={["pump"]} to={[268, 104]} active={w} /> : null}
        {action === "gaba" ? (
          <>
            <Callout k="l-rec" x={238} y={196} lines={["GABA-A", "receptor"]} to={[208, 172]} />
            <Callout k="l-bz" x={292} y={132} size={13} lines={["benzo-", "diazepine", "site"]} to={[220, 158]} active={w} />
            <Label x={158} y={212} size={14} anchor="end">chloride in</Label>
          </>
        ) : null}
        {action === "nmda" ? (
          <>
            <Callout k="l-nmda" x={238} y={196} lines={["NMDA", "channel"]} to={[208, 166]} active={w} />
            <Label x={158} y={212} size={14} anchor="end">calcium in</Label>
          </>
        ) : null}
        {action === "calcium" ? <Callout k="l-ca" x={292} y={92} size={13} lines={["calcium", "channel"]} to={[128, 106]} active={w} /> : null}
        {action === "enzyme" ? <Callout k="l-enz" x={292} y={92} size={13} lines={["enzyme"]} to={[278, 128]} active={w} /> : null}
        {action === "glutamate" ? <Label x={226} y={204} size={13}>{w ? "calmer" : "over-excited"}</Label> : null}
        {action === "reuptake" || action === "enzyme" || action === "calcium" ? <Callout k="l-rec2" x={238} y={204} size={13} lines={["receptors"]} to={[236, 164]} /> : null}
      </Sheet>
      <Choice
        label="Medicine"
        value={state}
        onChange={setState}
        options={[
          { id: "without", name: action === "glutamate" || action === "nmda" ? "Without (over-excited)" : "Without the medicine" },
          { id: "with", name: `With ${name}` },
        ]}
      />
      <Say live>
        <p>{SAY[action][state]}</p>
      </Say>
      {caption ? <Fact>{caption}</Fact> : null}
    </Figure>
  );
}
