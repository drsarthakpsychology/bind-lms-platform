import * as React from "react";

import { T } from "@/ds";
import { C, E, Label, L, SketchSheet } from "@/sketch/ink";
import { WidgetFrame } from "@/study/widgets/frame";
import { fonts, useTheme } from "@/theme";
import type { Mechanism } from "./meds";

/** The receptor action of a medicine, drawn in the hand-drawn ink (the other pictures are in med-diagrams.tsx). */
const W = 320;

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
