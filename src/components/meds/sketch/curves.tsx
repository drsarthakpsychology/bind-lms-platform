"use client";

import * as React from "react";
import { Arrow, C, Choice, Cv, Fact, Figure, L, Label, P, R, Say, Sheet } from "./ink";

/* -------------------------------------------------------------- shared axes */

const X0 = 54;
const X1 = 360;
const Y0 = 200;
const TOP = 40;

function Axes({ k, yTitle }: { k: string; yTitle: string }) {
  return (
    <>
      <L k={`${k}-x`} x1={X0 - 4} y1={Y0} x2={X1 + 4} y2={Y0} sw={2} />
      <L k={`${k}-y`} x1={X0} y1={Y0 + 4} x2={X0} y2={TOP - 14} sw={2} />
      <Label x={X0 + 8} y={TOP - 18} size={14}>{yTitle}</Label>
    </>
  );
}

/* ---------------------------------------------------------------- half-life */

type HalfView = "one" | "regular";

/** Level after a single dose (100 at the start), sampled across six half-lives. */
function oneDose(): [number, number][] {
  const pts: [number, number][] = [[X0, Y0], [X0 + 5, Y0 - 150]];
  for (let t = 0.2; t <= 6.001; t += 0.2) pts.push([X0 + 5 + t * 50, Y0 - 150 * Math.pow(0.5, t)]);
  return pts;
}

/** A dose every half-life: each adds half the steady-state peak, then the level halves. */
function regular(): string {
  let level = 0;
  let d = `M${X0} ${Y0}`;
  for (let n = 0; n < 6; n++) {
    const x = X0 + n * 50;
    level += 50;
    d += ` L${x + 3} ${Y0 - level * 1.5}`;
    for (let t = 0.2; t <= 1.001; t += 0.2) d += ` L${x + 3 + t * 47} ${Y0 - level * Math.pow(0.5, t) * 1.5}`;
    level *= 0.5;
  }
  return d;
}

export function HalfLifeSketch({ title, hl, meaning }: { title: string; hl: string; meaning: string }) {
  const [view, setView] = React.useState<HalfView>("regular");
  const one = view === "one";
  return (
    <Figure title={title}>
      <Sheet name="half-life" w={380} h={250} label={one ? "One dose halving with each half-life" : "Regular doses building up to a steady level"}>
        <Axes k="hl" yTitle="level in the blood" />
        {[0, 1, 2, 3, 4, 5, 6].map((t) => (
          <Label key={t} x={X0 + t * 50} y={Y0 + 18} size={13} anchor="middle" bold={false}>{String(t)}</Label>
        ))}
        {one ? (
          <>
            <Cv k="one" pts={oneDose()} stroke={C.blue} sw={2.6} single rough={0.5} />
            {[1, 2, 3].map((t) => {
              const x = X0 + 5 + t * 50;
              const y = Y0 - 150 * Math.pow(0.5, t);
              return (
                <g key={t}>
                  <L k={`drop${t}`} x1={x} y1={y} x2={x} y2={Y0} stroke={C.soft} sw={1} single dash="3 4" />
                  <Label x={x + 6} y={y - 8} size={14}>{`${Math.round(100 * Math.pow(0.5, t))}%`}</Label>
                </g>
              );
            })}
            <Label x={X0 + 12} y={TOP + 8} size={14}>100%</Label>
            <Label x={(X0 + X1) / 2} y={244} size={14} anchor="middle">half-lives after one dose</Label>
          </>
        ) : (
          <>
            <L k="steady" x1={X0} y1={Y0 - 150} x2={X1} y2={Y0 - 150} stroke={C.ink} sw={1.4} single dash="6 5" />
            <Label x={X1} y={Y0 - 158} size={14} anchor="end">steady state</Label>
            <R k="settle" x={X0 + 200} y={TOP} w={50} h={Y0 - TOP} stroke="none" fill={C.lime} gap={6} fw={1.4} />
            <P k="regular" d={regular()} stroke={C.blue} sw={2.6} single rough={0.4} />
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <Arrow key={n} k={`dose${n}`} from={[X0 + n * 50 + 3, Y0 + 2]} to={[X0 + n * 50 + 3, Y0 - 12]} stroke={C.ink} sw={1.2} />
            ))}
            <Label x={(X0 + X1) / 2} y={244} size={14} anchor="middle">half-lives, one dose each</Label>
          </>
        )}
      </Sheet>
      <Choice
        label="Doses"
        value={view}
        onChange={setView}
        options={[
          { id: "one", name: "One dose" },
          { id: "regular", name: "Regular doses" },
        ]}
      />
      <Say live>
        <p>
          {one
            ? "After a dose, the level halves once every half-life: half after one, a quarter after two. After 4 to 5 half-lives almost none is left."
            : "Each dose adds to what is left of the last. Levels build up and settle (steady state) after about 4 to 5 half-lives: the shaded band."}
        </p>
      </Say>
      <Fact>
        Half-life: {hl}. {meaning}
      </Fact>
    </Figure>
  );
}

/* ------------------------------------------------------------ dose-response */

export type DoseShape = "window" | "targets" | "ceiling";

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

const SAY_DOSE: Record<DoseShape, string> = {
  window: "Benefit and harm sit close together on the same scale of blood level, so the level is measured, not guessed.",
  targets: "Each target has its own dose-response curve: a low dose already reaches the sleep targets; mood needs a higher dose.",
  ceiling: "A full agonist keeps adding effect as the dose rises. A partial agonist levels off: a ceiling.",
};

export function DoseSketch({ title, shape, caption }: { title: string; shape: DoseShape; caption?: string }) {
  const lv = (v: number) => X0 + v * 150;
  return (
    <Figure title={title}>
      <Sheet name={`dose-${shape}`} w={380} h={250} label={title}>
        {shape === "window" ? (
          <>
            <R k="band" x={lv(0.6)} y={TOP} w={lv(1) - lv(0.6)} h={Y0 - TOP} stroke="none" fill={C.lime} gap={5} fw={1.6} />
            <R k="toxic" x={lv(1.5)} y={TOP} w={lv(2) - lv(1.5)} h={Y0 - TOP} stroke="none" fill={C.red} gap={6} fw={1} />
            <L k="tox-start" x1={lv(1.2)} y1={TOP} x2={lv(1.2)} y2={Y0} stroke={C.red} sw={1.4} single dash="5 4" />
            <Axes k="li" yTitle="effect" />
            <Cv k="benefit" pts={sCurve(lv(0.3), lv(0.9), 0.85)} stroke={C.blue} sw={2.6} single rough={0.5} />
            <Cv k="harm" pts={sCurve(lv(1.15), lv(1.9), 1, lv(1.0))} stroke={C.red} sw={2.6} single rough={0.5} />
            {[0.6, 1, 1.5, 2].map((v) => (
              <Label key={v} x={lv(v)} y={Y0 + 18} size={13} anchor="middle" bold={false}>{v.toFixed(1)}</Label>
            ))}
            <Label x={(lv(0.6) + lv(1)) / 2} y={TOP - 8} size={14} anchor="middle">useful</Label>
            <Label x={(lv(1.5) + lv(2)) / 2} y={TOP - 8} size={14} anchor="middle" color={C.red}>toxic</Label>
            <Label x={lv(0.18)} y={84} size={14} color={C.blue}>benefit</Label>
            <Label x={lv(1.24)} y={176} size={14} color={C.red}>harm</Label>
            <Label x={X1} y={244} size={14} anchor="end">lithium blood level, mmol/L</Label>
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
              <Label key={mg} x={x} y={Y0 + 18} size={13} anchor="middle" bold={false}>{String(mg)}</Label>
            ))}
            <Label x={X1} y={50} size={13} anchor="end" color={C.blue}>sleep: histamine, alpha-1, 5-HT2A block</Label>
            <Label x={118} y={160} size={14} lines={["mood: serotonin", "pump block"]} />
            <Label x={X1} y={244} size={14} anchor="end">dose, mg</Label>
          </>
        ) : null}
        {shape === "ceiling" ? (
          <>
            <Axes k="bp" yTitle="effect, with slowed breathing" />
            <Cv k="full" pts={sCurve(90, 330, 1)} stroke={C.red} sw={2.6} single rough={0.5} />
            <Cv k="part" pts={sCurve(80, 230, 0.42)} stroke={C.blue} sw={2.6} single rough={0.5} />
            <L k="ceil" x1={X0} y1={Y0 - 0.42 * 150} x2={X1} y2={Y0 - 0.42 * 150} stroke={C.blue} sw={1.2} single dash="6 5" />
            <Label x={X1} y={Y0 - 0.42 * 150 - 8} size={14} anchor="end" color={C.blue}>ceiling</Label>
            <Label x={X0 + 8} y={64} size={14} color={C.red} lines={["full agonist", "(methadone)"]} />
            <Label x={250} y={Y0 - 0.42 * 150 + 22} size={14} color={C.blue}>buprenorphine</Label>
            <Label x={X1} y={244} size={14} anchor="end">dose</Label>
          </>
        ) : null}
      </Sheet>
      <Say>
        <p>{SAY_DOSE[shape]}</p>
      </Say>
      {caption ? <Fact>{caption}</Fact> : null}
    </Figure>
  );
}
