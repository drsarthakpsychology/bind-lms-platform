/**
 * The medicine page's dose picture, ported from the website's
 * src/components/meds/sketch/curves.tsx (DoseSketch, same drawing and numbers):
 * lithium's narrow window of blood levels, trazodone's two sets of targets,
 * buprenorphine's ceiling. Before this the phone drew lithium as an
 * "arousal and performance" curve.
 *
 * Lithium numbers: usual target 0.6 to 0.8 mmol/L, 0.8 to 1.0 for some people
 * (NICE CG185; NICE QS95), toxicity likely from about 1.5 mmol/L (NHS Specialist
 * Pharmacy Service, lithium monitoring).
 */
import * as React from "react";

import { T } from "@/ds";
import { C, Cv, L, Label, R, SketchSheet } from "@/sketch/ink";
import { WidgetFrame } from "@/study/widgets/frame";

export type DoseShape = "window" | "targets" | "ceiling";

const X0 = 54;
const X1 = 360;
const Y0 = 200;
const TOP = 40;

/** An S-shaped rise from x = a to x = b, reaching `top` (0 to 1). */
function sCurve(a: number, b: number, top: number, from = X0, to = X1): [number, number][] {
  const pts: [number, number][] = [];
  for (let x = from; x <= to + 0.1; x += 8) {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    const s = t * t * (3 - 2 * t);
    pts.push([x, Y0 - s * top * 150]);
  }
  return pts;
}

export const SAY_DOSE: Record<DoseShape, string> = {
  window: "Benefit and harm sit close together on the same scale of blood level, so the level is measured, not guessed. Check the target with the prescriber and the local lab.",
  targets: "Each target has its own dose-response curve: a low dose already reaches the sleep targets; mood needs a higher dose.",
  ceiling: "A full agonist keeps adding effect as the dose rises. A partial agonist levels off: a ceiling.",
};

function Axes({ k, yTitle }: { k: string; yTitle: string }) {
  return (
    <>
      <L k={`${k}-x`} x1={X0 - 4} y1={Y0} x2={X1 + 4} y2={Y0} sw={2} />
      <L k={`${k}-y`} x1={X0} y1={Y0 + 4} x2={X0} y2={TOP - 14} sw={2} />
      <Label x={X0 + 8} y={TOP - 18} size={14}>
        {yTitle}
      </Label>
    </>
  );
}

export function DoseSketch({ title, shape, caption }: { title: string; shape: DoseShape; caption?: string }) {
  const lv = (v: number) => X0 + v * 150;
  return (
    <WidgetFrame label="Diagram" title={title} caption={caption} testID={`d-dose-${shape}`}>
      <SketchSheet name={`dose-${shape}`} w={380} h={250} label={title}>
        {shape === "window" ? (
          <>
            <R k="band" x={lv(0.6)} y={TOP} w={lv(0.8) - lv(0.6)} h={Y0 - TOP} stroke="none" fill={C.lime} gap={4} fw={1.8} />
            <R k="band-some" x={lv(0.8)} y={TOP} w={lv(1) - lv(0.8)} h={Y0 - TOP} stroke="none" fill={C.lime} gap={10} fw={1} />
            <R k="toxic" x={lv(1.5)} y={TOP} w={lv(2) - lv(1.5)} h={Y0 - TOP} stroke="none" fill={C.red} gap={6} fw={1} />
            <Axes k="li" yTitle="effect" />
            <Cv k="benefit" pts={sCurve(lv(0.3), lv(0.9), 0.85)} stroke={C.blue} sw={2.6} single rough={0.5} />
            <Cv k="harm" pts={sCurve(lv(1.0), lv(1.8), 1, lv(0.8))} stroke={C.red} sw={2.6} single rough={0.5} />
            {[0.6, 0.8, 1, 1.5, 2].map((v) => (
              <Label key={v} x={lv(v)} y={Y0 + 18} size={13} anchor="middle" bold={false}>
                {v.toFixed(1)}
              </Label>
            ))}
            <Label x={(lv(0.6) + lv(0.8)) / 2} y={TOP - 8} size={14} anchor="middle">
              usual
            </Label>
            <Label x={lv(1) + 6} y={TOP + 14} size={13} bold={false}>
              some people
            </Label>
            <Label x={(lv(1.5) + lv(2)) / 2} y={TOP - 8} size={14} anchor="middle" color={C.red}>
              toxic
            </Label>
            <Label x={lv(0.18)} y={84} size={14} color={C.blue}>
              benefit
            </Label>
            <Label x={lv(1.12)} y={190} size={14} color={C.red}>
              harm
            </Label>
            <Label x={X1} y={244} size={14} anchor="end">
              lithium blood level, mmol/L
            </Label>
          </>
        ) : null}
        {shape === "targets" ? (
          <>
            <Axes k="tz" yTitle="effect" />
            <Cv k="sleep" pts={sCurve(X0 + 10, 170, 0.9)} stroke={C.blue} sw={2.6} single rough={0.5} />
            <Cv k="mood" pts={sCurve(210, 340, 0.75)} stroke={C.ink} sw={2.6} single rough={0.5} />
            {(
              [
                [25, 80],
                [50, 125],
                [100, 180],
                [150, 222],
                [300, 330],
              ] as const
            ).map(([mg, x]) => (
              <Label key={mg} x={x} y={Y0 + 18} size={13} anchor="middle" bold={false}>
                {String(mg)}
              </Label>
            ))}
            <Label x={X1} y={50} size={13} anchor="end" color={C.blue}>
              sleep: histamine, alpha-1, 5-HT2A block
            </Label>
            <Label x={118} y={160} size={14} lines={["mood: serotonin", "pump block"]} />
            <Label x={X1} y={244} size={14} anchor="end">
              dose, mg
            </Label>
          </>
        ) : null}
        {shape === "ceiling" ? (
          <>
            <Axes k="bp" yTitle="effect, with slowed breathing" />
            <Cv k="full" pts={sCurve(90, 330, 1)} stroke={C.red} sw={2.6} single rough={0.5} />
            <Cv k="part" pts={sCurve(80, 230, 0.42)} stroke={C.blue} sw={2.6} single rough={0.5} />
            <L k="ceil" x1={X0} y1={Y0 - 0.42 * 150} x2={X1} y2={Y0 - 0.42 * 150} stroke={C.blue} sw={1.2} single dash="6 5" />
            <Label x={X1} y={Y0 - 0.42 * 150 - 8} size={14} anchor="end" color={C.blue}>
              ceiling
            </Label>
            <Label x={X0 + 8} y={64} size={14} color={C.red} lines={["full agonist", "(methadone)"]} />
            <Label x={250} y={Y0 - 0.42 * 150 + 22} size={14} color={C.blue}>
              buprenorphine
            </Label>
            <Label x={X1} y={244} size={14} anchor="end">
              dose
            </Label>
          </>
        ) : null}
      </SketchSheet>
      <T v="reading">{SAY_DOSE[shape]}</T>
    </WidgetFrame>
  );
}
