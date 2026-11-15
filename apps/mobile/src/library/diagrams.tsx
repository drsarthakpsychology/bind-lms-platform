import * as React from "react";
import { View } from "react-native";

import { T } from "@/ds";
import { Arrow, C, E, Label, L, P, R, SketchSheet } from "@/sketch/ink";
import { canDraw, WidgetView } from "@/study/widgets";
import { WidgetFrame } from "@/study/widgets/frame";
import { fonts, space, useTheme } from "@/theme";
import type { Mechanism, MedVisual } from "./meds";

/**
 * The medicine page's diagrams, drawn natively in the hand-drawn ink (the
 * website's sketch style): the receptor action, the synapse, the dopamine
 * pathways, a firing neuron, a GABA channel, a night of sleep, the body's
 * fight-or-flight. The half-life curve and the comparison use the study
 * widgets the app already draws. Words come from the medicine data unchanged.
 */
const W = 320;
const s = (x: unknown) => (typeof x === "string" ? x : undefined);

/** Where the receptor sits between "turned off" and "fully on". */
export function ReceptorScale({ r }: { r: Mechanism["receptor"] }) {
  const c = useTheme();
  const steps = ["Inverse agonist", "Antagonist", "Partial agonist", "Full agonist"] as const;
  const at = steps.indexOf(r.pick);
  return (
    <WidgetFrame label="Diagram" title={`At ${r.name}: ${r.pick.toLowerCase()}`} caption={r.note} testID="d-receptor">
      <SketchSheet name={`receptor-${r.pick}`} w={W} h={120} label={`${r.name}: ${r.pick}. From below normal activity to fully on.`}>
        <L k="rs-axis" x1={24} y1={70} x2={296} y2={70} sw={2} />
        {steps.map((st, i) => {
          const x = 24 + i * (272 / 3);
          return (
            <React.Fragment key={st}>
              <L k={`rs-t${i}`} x1={x} y1={62} x2={x} y2={78} sw={1.6} />
              <Label x={x} y={98} size={11} anchor={i === 0 ? "start" : i === 3 ? "end" : "middle"} bold={i === at} color={i === at ? C.ink : C.soft}>
                {st}
              </Label>
            </React.Fragment>
          );
        })}
        <E k={`rs-dot-${at}`} cx={24 + Math.max(0, at) * (272 / 3)} cy={70} w={22} h={22} fill={C.lime} fillStyle="solid" sw={2} />
        <Label x={24} y={34} size={11} bold={false} color={C.soft}>
          turns it below normal
        </Label>
        <Label x={296} y={34} size={11} anchor="end" bold={false} color={C.soft}>
          turns it fully on
        </Label>
      </SketchSheet>
      <T v="small" style={{ fontFamily: fonts.semibold, color: c.link }}>
        {r.pick}
      </T>
    </WidgetFrame>
  );
}

function ReleaseSketch({ d }: { d: Record<string, unknown> }) {
  const tx = s(d.transmitter) ?? "the transmitter";
  return (
    <WidgetFrame label="Diagram" title={s(d.title)} caption={s(d.caption)} testID="d-release">
      <SketchSheet name={`release-${tx}`} w={W} h={220} label={`A synapse: the pump that takes ${tx} back is blocked, so more stays in the gap.`}>
        <P k="rl-pre" d="M40 20 L280 20 L280 72 Q160 112 40 72 Z" fill={C.wash} fillStyle="solid" sw={2} />
        <P k="rl-post" d="M40 204 L280 204 L280 162 Q160 134 40 162 Z" fill={C.wash} fillStyle="solid" sw={2} />
        {[96, 136, 176].map((x, i) => (
          <E key={x} k={`rl-v${i}`} cx={x} cy={50} w={22} h={22} fill={C.paper} fillStyle="solid" sw={1.4} />
        ))}
        {[104, 128, 150, 172, 196, 120, 162].map((x, i) => (
          <E key={i} k={`rl-m${i}`} cx={x} cy={112 + (i % 3) * 9} w={7} h={7} fill={C.blue} fillStyle="solid" sw={1} />
        ))}
        <R k="rl-pump" x={250} y={72} w={20} h={24} fill={C.red} fillStyle="solid" sw={1.4} />
        <L k="rl-x" x1={244} y1={66} x2={276} y2={102} stroke={C.ink} sw={2.4} />
        {[110, 160, 210].map((x, i) => (
          <R key={x} k={`rl-r${i}`} x={x - 8} y={146} w={16} h={12} fill={C.blue} fillStyle="solid" sw={1.2} />
        ))}
        <Arrow k="rl-arrow" from={[226, 120]} to={[248, 96]} stroke={C.soft} dash="4 4" />
        <Label x={160} y={16} size={12} anchor="middle" bold={false} color={C.soft}>
          first cell
        </Label>
        <Label x={258} y={124} size={12} bold anchor="middle">
          pump blocked
        </Label>
        <Label x={160} y={218} size={12} anchor="middle" bold={false} color={C.soft}>
          {`next cell: more ${tx} reaches it`}
        </Label>
      </SketchSheet>
    </WidgetFrame>
  );
}

function PathwaysSketch({ d }: { d: Record<string, unknown> }) {
  const ways: [string, string, number][] = [
    ["Mesolimbic", "psychosis eases", 46],
    ["Mesocortical", "flatness can follow", 96],
    ["Nigrostriatal", "stiffness, tremor", 146],
    ["Tuberoinfundibular", "prolactin rises", 196],
  ];
  return (
    <WidgetFrame label="Diagram" title={s(d.title)} caption={s(d.caption)} testID="d-pathways">
      <SketchSheet name="pathways-dopamine" w={W} h={232} label="The four dopamine pathways and what blocking D2 does in each.">
        <E k="pw-src" cx={52} cy={120} w={60} h={44} fill={C.wash} fillStyle="solid" sw={2} />
        <Label x={52} y={124} size={12} anchor="middle">
          dopamine
        </Label>
        {ways.map(([name, what, y], i) => (
          <React.Fragment key={name}>
            <Arrow k={`pw-a${i}`} from={[84, 120]} to={[150, y]} bend={0.08} stroke={i === 0 ? C.blue : C.ink} />
            <Label x={156} y={y - 2} size={12}>
              {name}
            </Label>
            <Label x={156} y={y + 14} size={11} bold={false} color={i === 0 ? C.blue : C.soft}>
              {what}
            </Label>
          </React.Fragment>
        ))}
      </SketchSheet>
    </WidgetFrame>
  );
}

function NeuronSketch({ d }: { d: Record<string, unknown> }) {
  return (
    <WidgetFrame label="Diagram" title={s(d.title)} caption={s(d.caption)} testID="d-neuron">
      <SketchSheet name="neuron" w={W} h={150} label="A nerve cell firing: sodium channels open along the axon; the medicine calms cells that fire too fast.">
        <E k="nr-body" cx={54} cy={76} w={64} h={54} fill={C.wash} fillStyle="solid" sw={2} />
        <P k="nr-axon" d="M86 76 L296 76" sw={2.4} />
        {[120, 160, 200, 240].map((x, i) => (
          <R key={x} k={`nr-c${i}`} x={x - 7} y={64} w={14} h={24} fill={i < 2 ? C.lime : C.paper} fillStyle="solid" sw={1.4} />
        ))}
        <P k="nr-spike" d="M110 40 L130 40 L138 16 L146 52 L154 40 L196 40" stroke={C.blue} sw={2} />
        <Label x={160} y={120} size={12} anchor="middle" bold={false} color={C.soft}>
          sodium channels along the axon
        </Label>
      </SketchSheet>
    </WidgetFrame>
  );
}

function ChannelSketch({ d }: { d: Record<string, unknown> }) {
  const tx = s(d.transmitter) ?? "GABA";
  return (
    <WidgetFrame label="Diagram" title={s(d.title)} caption={s(d.caption)} testID="d-channel">
      <SketchSheet name={`channel-${tx}`} w={W} h={200} label={`A ${tx} receptor channel in the cell wall: when it opens, chloride flows in and the cell calms.`}>
        <R k="ch-wall-l" x={20} y={80} w={110} h={34} fill={C.wash} fillStyle="hachure" sw={1.4} />
        <R k="ch-wall-r" x={190} y={80} w={110} h={34} fill={C.wash} fillStyle="hachure" sw={1.4} />
        <R k="ch-l" x={130} y={66} w={22} h={62} fill={C.blue} fillStyle="solid" sw={1.6} />
        <R k="ch-r" x={168} y={66} w={22} h={62} fill={C.blue} fillStyle="solid" sw={1.6} />
        <E k="ch-gaba" cx={110} cy={52} w={18} h={18} fill={C.lime} fillStyle="solid" sw={1.4} />
        <E k="ch-drug" cx={212} cy={52} w={18} h={18} fill={C.red} fillStyle="solid" sw={1.4} />
        {[0, 1, 2].map((i) => (
          <Arrow key={i} k={`ch-cl${i}`} from={[160, 40 + i * 6]} to={[160, 150 + i * 6]} stroke={C.soft} sw={1.4} />
        ))}
        <Label x={96} y={30} size={12} anchor="middle">
          {tx}
        </Label>
        <Label x={226} y={30} size={12} anchor="middle">
          the medicine
        </Label>
        <Label x={160} y={188} size={12} anchor="middle" bold={false} color={C.soft}>
          chloride flows in: the cell calms
        </Label>
      </SketchSheet>
    </WidgetFrame>
  );
}

function HypnogramSketch({ d }: { d: Record<string, unknown> }) {
  // Awake, REM, light, deep: a typical night with the tablet's few hours shaded.
  const lv = [0, 2, 3, 3, 2, 1, 2, 3, 2, 1, 2, 2, 1, 2, 1, 0];
  const y = (n: number) => 30 + n * 32;
  const pts = lv.map((n, i) => `${i ? "L" : "M"}${40 + i * 17} ${y(n)} L${57 + i * 17} ${y(n)}`).join(" ");
  return (
    <WidgetFrame label="Diagram" title={s(d.title)} caption={s(d.caption)} testID="d-hypnogram">
      <SketchSheet name="hypnogram" w={W} h={180} label="A night of sleep stages; the tablet acts in the first hours of the night.">
        <R k="hy-drug" x={40} y={18} w={70} h={118} fill={C.lime} fillStyle="hachure" stroke="none" />
        <P k="hy-line" d={pts} stroke={C.blue} sw={2} single />
        {["Awake", "REM", "Light", "Deep"].map((t, i) => (
          <Label key={t} x={34} y={y(i) + 4} size={11} anchor="end" bold={false} color={C.soft}>
            {t}
          </Label>
        ))}
        <Label x={75} y={160} size={11} anchor="middle">
          the tablet
        </Label>
        <Label x={300} y={160} size={11} anchor="end" bold={false} color={C.soft}>
          morning
        </Label>
      </SketchSheet>
    </WidgetFrame>
  );
}

function NervousSketch({ d }: { d: Record<string, unknown> }) {
  return (
    <WidgetFrame label="Diagram" title={s(d.title)} caption={s(d.caption)} testID="d-nervous">
      <SketchSheet name="nervous" w={W} h={170} label="Adrenaline reaches beta receptors on the heart and muscles; the medicine blocks them.">
        <E k="nv-brain" cx={56} cy={52} w={70} h={48} fill={C.wash} fillStyle="solid" sw={2} />
        <Label x={56} y={56} size={11} anchor="middle">
          fight or flight
        </Label>
        <P k="nv-heart" d="M232 52 C218 30 192 42 200 64 L232 96 L264 64 C272 42 246 30 232 52 Z" fill={C.red} fillStyle="hachure" sw={2} />
        <R k="nv-hand" x={204} y={120} w={56} h={28} fill={C.paper} fillStyle="solid" sw={1.8} />
        <Arrow k="nv-a1" from={[92, 58]} to={[192, 62]} bend={-0.08} />
        <Arrow k="nv-a2" from={[92, 64]} to={[198, 130]} bend={0.08} />
        <L k="nv-x1" x1={160} y1={44} x2={176} y2={70} stroke={C.ink} sw={2.6} />
        <L k="nv-x2" x1={164} y1={100} x2={180} y2={124} stroke={C.ink} sw={2.6} />
        <Label x={232} y={114} size={11} anchor="middle" bold={false} color={C.soft}>
          pulse
        </Label>
        <Label x={232} y={164} size={11} anchor="middle" bold={false} color={C.soft}>
          tremor
        </Label>
      </SketchSheet>
    </WidgetFrame>
  );
}

/** One of the website's medicine pictures, native. Unknown kinds are skipped. */
export function MedDiagram({ v, i }: { v: MedVisual; i: number }) {
  switch (v.kind) {
    case "release":
      return <ReleaseSketch d={v.data} />;
    case "pathways":
      return <PathwaysSketch d={v.data} />;
    case "neuron":
      return <NeuronSketch d={v.data} />;
    case "synapse3d":
      return <ChannelSketch d={v.data} />;
    case "hypnogram":
      return <HypnogramSketch d={v.data} />;
    case "nervoussystem":
      return <NervousSketch d={v.data} />;
    default: {
      const block = { t: "widget", kind: v.kind, v: 1, data: v.data } as never;
      if (!canDraw({ kind: v.kind, v: 1 })) return null;
      return (
        <View key={i}>
          <WidgetView block={block} ctx={{ moduleId: "medicines", sectionId: "how-it-works" }} />
        </View>
      );
    }
  }
}

export function Diagrams({ visuals, mech }: { visuals: MedVisual[]; mech: Mechanism | null }) {
  return (
    <View style={{ gap: space[4] }}>
      {mech ? <ReceptorScale r={mech.receptor} /> : null}
      {visuals.map((v, i) => (
        <MedDiagram key={`${v.kind}-${i}`} v={v} i={i} />
      ))}
    </View>
  );
}
