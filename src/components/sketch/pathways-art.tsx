"use client";

/**
 * The four dopamine pathways drawn on the brain cut down the middle, with the
 * flow of dopamine along each and a bar where a medicine blocks it. Shared by
 * the medicine page and the Study pathways widget.
 */
import { BRAIN, Brain } from "./brain";
import { Arrow, C, Callout, Cv, E, Head, L, Label, Sheet } from "./ink";

export type PathId = "mesolimbic" | "mesocortical" | "nigrostriatal" | "tuberoinfundibular";
const PATH_IDS: PathId[] = ["mesolimbic", "mesocortical", "nigrostriatal", "tuberoinfundibular"];


/** The brain sits 26 units down, leaving a strip at the top for labels. */
const DY = 26;
const at = (p: readonly [number, number]): [number, number] => [p[0], p[1] + DY];

/** Each pathway drawn from its source in the midbrain (or hypothalamus) to where it ends, in brain units. */
const ROUTE: Record<PathId, [number, number][]> = {
  mesolimbic: [[238, 176], [196, 160], [152, 154], [138, 152]],
  mesocortical: [[236, 182], [200, 176], [140, 174], [98, 150], [82, 112]],
  nigrostriatal: [[256, 172], [226, 158], [198, 140], [182, 132]],
  tuberoinfundibular: [[208, 178], [202, 190], [199, 202]],
};

/** Where each pathway's end is named on the drawing (sheet units). */
const NAME_AT: Record<PathId, { x: number; y: number; lines: string[]; anchor: "start" | "middle" | "end"; to: [number, number] }> = {
  mesocortical: { x: 8, y: 22, lines: ["prefrontal cortex"], anchor: "start", to: at(BRAIN.prefrontal) },
  nigrostriatal: { x: 214, y: 22, lines: ["striatum"], anchor: "middle", to: at([182, 124]) },
  mesolimbic: { x: 8, y: 248, lines: ["nucleus accumbens"], anchor: "start", to: at([132, 156]) },
  tuberoinfundibular: { x: 70, y: 304, lines: ["pituitary"], anchor: "start", to: at([194, 214]) },
};

/**
 * The drawing. `flow(id)` is how much dopamine still gets through (1 normal);
 * `block` names the blocking state ("none" draws no bars).
 */
export function PathwaysArt({ pick, flow, block, label, className }: { pick: PathId; flow: (id: PathId) => number; block: string; label: string; className?: string }) {
  return (
      <Sheet name="pathways" w={400} h={316} label={label} className={className}>
      <g transform={`translate(0 ${DY})`}>
        <Brain />
        {PATH_IDS.map((id) => {
          const p = { id };
          const f = flow(id);
          const on = p.id === pick;
          const pts = ROUTE[p.id];
          const end = pts[pts.length - 1];
          const prev = pts[pts.length - 2];
          const a = Math.atan2(end[1] - prev[1], end[0] - prev[0]);
          // The block: a short bar across the pathway just before its end.
          const bx = end[0] - Math.cos(a) * 14;
          const by = end[1] - Math.sin(a) * 14;
          const nx = -Math.sin(a) * 8;
          const ny = Math.cos(a) * 8;
          return (
            <g key={p.id} style={{ opacity: on ? 1 : 0.8 }}>
              <Cv k={`path-${p.id}`} pts={pts} stroke={on ? C.blue : C.ink} sw={on ? 4.2 : 2.6} single rough={0.5} />
              <Cv k={`flow-${p.id}`} pts={pts} stroke={C.lime} sw={2.2} dash={f >= 1 ? "3 6" : f > 0.5 ? "3 12" : "3 26"} single rough={0.3} />
              <Head k={`head-${p.id}`} x={end[0]} y={end[1]} a={a} stroke={on ? C.blue : C.ink} size={9} sw={on ? 2.8 : 2.2} />
              {block !== "none" ? <L k={`block-${p.id}-${block}`} x1={bx - nx} y1={by - ny} x2={bx + nx} y2={by + ny} stroke={f < 0.5 ? C.red : C.ink} sw={4} single rough={0.4} /> : null}
            </g>
          );
        })}
        <E k="vta-dot" cx={244} cy={178} w={18} h={12} fill={C.ink} fillStyle="solid" sw={1} />
      </g>
      {PATH_IDS.map((id) => {
        const p = { id };
        const n = NAME_AT[id];
        return <Callout key={p.id} k={`name-${p.id}`} x={n.x} y={n.y} lines={n.lines} anchor={n.anchor} to={n.to} active={p.id === pick} />;
      })}
      <Callout k="name-vta" x={282} y={292} lines={["VTA and", "substantia nigra"]} to={at([250, 184])} />
      <Callout k="name-hyp" x={24} y={276} lines={["hypothalamus"]} to={at([206, 184])} />
      <Label x={12} y={214} size={12} bold={false} color={C.soft}>front</Label>
      <Arrow k="front" from={[46, 222]} to={[12, 222]} stroke={C.soft} sw={1.2} />
      {/* key */}
      <L k="key-path" x1={300} y1={16} x2={330} y2={16} stroke={C.ink} sw={2.6} single rough={0.3} />
      <L k="key-flow" x1={300} y1={16} x2={330} y2={16} stroke={C.lime} sw={2.2} single rough={0.2} dash="3 6" />
      <Label x={336} y={21} size={13} bold={false}>dopamine</Label>
      {block !== "none" ? (
        <>
          <L k="key-block" x1={315} y1={30} x2={315} y2={44} stroke={C.red} sw={4} single rough={0.3} />
          <Label x={336} y={42} size={13} bold={false}>blocked</Label>
        </>
      ) : null}
    </Sheet>
  );
}
