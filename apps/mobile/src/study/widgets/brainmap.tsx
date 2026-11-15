/**
 * The brain map, ported from the website's BrainMap (src/components/study/
 * visuals.tsx): the same 17 region ids, outlines, spots and numbering, so
 * the course's `focus` and `notes` land exactly where they do on the web.
 * Side view, front on the left, drawing units 412 x 304.
 */
import * as React from "react";
import { G } from "react-native-svg";

import type { BrainMapData } from "@/api/contract";
import { Chips } from "@/ds/parts";
import { T } from "@/ds/text";
import { haptic } from "@/lib/haptics";
import { C, Callout, Cv, E, Label, P, Pg, SketchSheet, labelWidth } from "@/sketch/ink";
import { WidgetFrame } from "./frame";
import { StepText } from "./engine";

type Pt = [number, number];
type Look = { fill?: string; fillStyle?: "solid" | "hachure"; stroke?: string };
const OUTLINE: Pt[] = [[82, 152], [76, 122], [88, 90], [112, 64], [150, 46], [200, 38], [250, 42], [292, 58], [322, 86], [336, 120], [334, 152], [318, 174], [292, 186], [256, 194], [216, 200], [180, 200], [150, 194], [128, 182], [116, 168], [120, 157], [100, 156]];
const FISSURE: Pt[] = [[120, 156], [160, 146], [200, 140], [234, 136], [246, 128]];
const CENTRAL: Pt[] = [[206, 39], [196, 80], [186, 112], [180, 142]];

export type Region = { id: string; name: string; spot: Pt; deep?: boolean; poly?: Pt[]; draw?: (k: string, o: Look) => React.ReactNode };
export const REGIONS: Region[] = [
  { id: "frontal", name: "Frontal lobe", spot: [146, 88], poly: [[82, 152], [76, 122], [88, 90], [112, 64], [150, 46], [206, 39], [196, 80], [186, 112], [180, 142], [160, 146], [120, 156]] },
  { id: "prefrontal", name: "Prefrontal cortex", spot: [106, 112], poly: [[82, 152], [76, 122], [88, 90], [112, 64], [140, 50], [134, 100], [128, 153], [120, 156]] },
  { id: "motor", name: "Motor cortex", spot: [183, 94], poly: [[188, 40], [206, 39], [196, 80], [186, 112], [180, 142], [166, 144], [172, 112], [180, 78]] },
  { id: "sensory", name: "Somatosensory cortex", spot: [208, 70], poly: [[206, 39], [224, 40], [214, 80], [203, 112], [196, 141], [180, 142], [186, 112], [196, 80]] },
  { id: "parietal", name: "Parietal lobe", spot: [258, 96], poly: [[206, 39], [250, 42], [292, 58], [300, 62], [302, 120], [304, 150], [290, 152], [234, 136], [200, 140], [180, 142], [186, 112], [196, 80]] },
  { id: "occipital", name: "Occipital lobe", spot: [318, 124], poly: [[300, 62], [322, 86], [336, 120], [334, 152], [318, 174], [306, 177], [304, 150], [302, 120]] },
  { id: "temporal", name: "Temporal lobe", spot: [146, 180], poly: [[120, 156], [160, 146], [200, 140], [234, 136], [290, 152], [304, 150], [306, 177], [292, 186], [256, 194], [216, 200], [180, 200], [150, 194], [128, 182], [116, 168]] },
  { id: "broca", name: "Broca's area", spot: [146, 134], draw: (k, o) => <E k={k} cx={146} cy={134} w={22} h={16} sw={1.6} {...o} /> },
  { id: "wernicke", name: "Wernicke's area", spot: [254, 156], draw: (k, o) => <E k={k} cx={254} cy={156} w={24} h={16} sw={1.6} {...o} /> },
  { id: "cerebellum", name: "Cerebellum", spot: [300, 214], draw: (k, o) => <P k={k} d="M258 196 C268 184 312 180 334 190 C352 200 350 226 332 236 C310 246 274 240 262 226 C254 216 252 204 258 196 Z" sw={2} {...o} /> },
  { id: "brainstem", name: "Brainstem", spot: [236, 242], draw: (k, o) => <P k={k} d="M222 196 C224 222 226 248 228 274 L248 274 C248 248 250 222 252 196 Z" sw={2} {...o} /> },
  { id: "corpus-callosum", name: "Corpus callosum", deep: true, spot: [214, 92], draw: (k, o) => <P k={k} d="M140 112 C150 84 200 78 236 82 C268 86 284 100 280 112 C276 120 266 114 258 106 C240 96 196 94 166 104 C154 110 150 122 140 112 Z" sw={1.4} dash="5 4" {...o} /> },
  { id: "thalamus", name: "Thalamus", deep: true, spot: [228, 124], draw: (k, o) => <E k={k} cx={228} cy={124} w={34} h={20} sw={1.4} dash="5 4" {...o} /> },
  { id: "hypothalamus", name: "Hypothalamus", deep: true, spot: [200, 144], draw: (k, o) => <E k={k} cx={200} cy={144} w={20} h={14} sw={1.4} dash="5 4" {...o} /> },
  { id: "basal-ganglia", name: "Basal ganglia", deep: true, spot: [178, 116], draw: (k, o) => <E k={k} cx={178} cy={116} w={30} h={22} sw={1.4} dash="5 4" {...o} /> },
  { id: "amygdala", name: "Amygdala", deep: true, spot: [168, 164], draw: (k, o) => <E k={k} cx={168} cy={164} w={16} h={14} sw={1.4} dash="5 4" {...o} /> },
  { id: "hippocampus", name: "Hippocampus", deep: true, spot: [214, 170], draw: (k, o) => <P k={k} d="M176 166 C194 176 222 176 246 160" sw={4} single dash="5 4" {...o} /> },
];

const W = 412;
const H = 304;

export function BrainMapArt({ focus, pick, onPick }: { focus: string[]; pick: string | null; onPick: (id: string) => void }) {
  const shown = REGIONS.filter((r) => !r.deep || focus.includes(r.id));
  const sel = REGIONS.find((r) => r.id === pick);
  const look = (r: Region): Look => (r.id === pick ? { fill: C.lime, fillStyle: "hachure" } : focus.includes(r.id) ? { fill: C.wash, fillStyle: "solid" } : {});
  const num = (id: string) => focus.indexOf(id) + 1;
  const tap = (id: string) => () => focus.includes(id) && onPick(id);
  const callout = sel
    ? (() => {
        const low = sel.spot[1] > 160;
        const w = labelWidth(sel.name);
        const x = Math.max(8, Math.min(W - w - 8, sel.spot[0] - w / 2));
        return <Callout k={`bm-name-${sel.id}`} x={x} y={low ? H - 12 : 22} lines={[sel.name]} to={[sel.spot[0], sel.spot[1] + (low ? 10 : -10)]} active />;
      })()
    : null;
  return (
    <SketchSheet name="brainmap" w={W} h={H} label={`Side view of the brain, front on the left${sel ? `, ${sel.name} picked` : ""}`}>
      {shown
        .filter((r) => r.id === "cerebellum" || r.id === "brainstem")
        .map((r) => (
          <G key={r.id} onPress={tap(r.id)}>
            {r.draw!(`bm-${r.id}-${r.id === pick ? "on" : focus.includes(r.id) ? "f" : "x"}`, { ...look(r), ...(r.id === pick || focus.includes(r.id) ? {} : { fill: C.paper, fillStyle: "solid" }) })}
          </G>
        ))}
      <Cv k="bm-outline" pts={[...OUTLINE, OUTLINE[0]!]} sw={2.4} fill={C.paper} fillStyle="solid" />
      {shown
        .filter((r) => r.poly && (r.id === pick || focus.includes(r.id)))
        .sort((a, b) => Number(a.id === pick) - Number(b.id === pick))
        .map((r) => (
          <G key={r.id} onPress={tap(r.id)}>
            <Pg k={`bm-${r.id}-${r.id === pick ? "on" : "f"}`} pts={r.poly!} stroke="none" {...look(r)} gap={5} />
          </G>
        ))}
      <Cv k="bm-fissure" pts={FISSURE} sw={2} single rough={0.6} />
      <Cv k="bm-central" pts={CENTRAL} sw={1.8} single rough={0.6} />
      <P k="bm-po" d="M300 62 C302 90 302 124 306 176" stroke={C.soft} sw={1.3} single dash="4 5" />
      <P k="bm-folds" d="M120 90 C130 84 140 92 150 86 M100 128 C110 122 118 130 126 124 M232 70 C240 62 252 70 262 64 M262 116 C272 108 282 116 290 110 M150 178 C166 172 184 180 200 174 M226 186 C238 180 252 188 266 182 M312 100 C318 108 314 118 322 122" stroke={C.soft} sw={1.2} single rough={0.8} />
      {shown
        .filter((r) => r.draw && r.id !== "cerebellum" && r.id !== "brainstem")
        .map((r) => (
          <G key={r.id} onPress={tap(r.id)}>
            {r.draw!(`bm-${r.id}-${r.id === pick ? "on" : focus.includes(r.id) ? "f" : "x"}`, { ...look(r), stroke: r.id === pick ? C.blue : r.deep ? C.ink : undefined })}
          </G>
        ))}
      {focus.map((id) => {
        const r = REGIONS.find((x) => x.id === id);
        if (!r) return null;
        const on = id === pick;
        return (
          <G key={id} onPress={tap(id)}>
            <E k={`bm-dot-${id}-${on}`} cx={r.spot[0]} cy={r.spot[1]} w={23} h={23} fill={on ? C.blue : C.lime} fillStyle="solid" sw={1.4} />
            <Label x={r.spot[0]} y={r.spot[1] + 5} size={15} anchor="middle" color={on ? C.paper : C.onLime}>
              {String(num(id))}
            </Label>
          </G>
        );
      })}
      {callout}
      <Label x={14} y={206} size={13} bold={false} color={C.soft}>
        front
      </Label>
    </SketchSheet>
  );
}

/** The parts to show: `focus`, or else every part the notes talk about (the website's rule). */
export function brainFocus(d: Pick<BrainMapData, "focus" | "notes">): string[] {
  const f = d.focus?.length ? d.focus : REGIONS.map((r) => r.id).filter((id) => d.notes?.[id]);
  return f.filter((id) => REGIONS.some((r) => r.id === id));
}

export function BrainMapWidget({ d }: { d: BrainMapData }) {
  const focus = brainFocus(d);
  const [pick, setPick] = React.useState<string | null>(focus[0] ?? null);
  const sel = REGIONS.find((r) => r.id === pick);
  const choose = (id: string) => {
    haptic.select();
    setPick(id);
  };
  return (
    <WidgetFrame label="The brain" title={d.title} caption={d.caption} testID="w-brainmap">
      <BrainMapArt focus={focus} pick={pick} onPick={choose} />
      {focus.length ? <Chips label="Brain parts" options={focus.map((id, k) => ({ id, name: `${k + 1} ${REGIONS.find((r) => r.id === id)!.name}` }))} value={pick ?? ""} onChange={choose} /> : null}
      {sel ? <StepText text={`**${sel.name}${sel.deep ? " (deep inside)" : ""}:** ${d.notes?.[sel.id] ?? ""}`} k={sel.id} /> : <T tone="muted">Tap a numbered part.</T>}
    </WidgetFrame>
  );
}
