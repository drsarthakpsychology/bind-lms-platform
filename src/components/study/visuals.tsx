"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import type { BrainMapData, CurveData, FlowData, LayersData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";
import { Arrow, C, Callout, Cv, E, HAND, L, Label, P, Pg, R, Sheet, labelWidth, plain, wrap } from "@/components/sketch/ink";
import { BOX, SketchFrame, type Link } from "@/components/sketch/frame";

/**
 * Visual teaching pieces: flowcharts and cycles and layered models (shown
 * whole, like a textbook figure), curves to explore with a slider, and a
 * brain map. Motion is transform/opacity and stops under
 * reduce-motion; every state is also written in words below the picture.
 */

const card = "rounded-2xl border-2 border-foreground bg-card p-4 sm:p-5 shadow-[var(--shadow-hard-sm)]";
const label = "text-xs font-semibold tracking-wide uppercase text-link";
const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-foreground px-4 font-semibold";

/* ------------------------------------------------------------------ flow */
/**
 * A plain diagram: every step and what it means is on screen at once, so a
 * student reads it like a textbook figure. No buttons, no stepping. The
 * boxes, number dots and arrows are hand-drawn round the real text.
 */
export function Flow({ d }: { d: FlowData }) {
  const ids = d.nodes.map((n, k) => `${k}-${n.id}`);
  const step = (k: number) => {
    const n = d.nodes[k];
    return (
      <div data-sk="box" data-sk-id={ids[k]} className={cn(BOX, "min-w-0 px-3 py-2.5")}>
        <p className="flex items-baseline gap-2.5 leading-snug">
          <span data-sk="dot" data-sk-id={`dot-${ids[k]}`} className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--sk-lime)] text-sm font-bold text-[var(--sk-on-lime)] group-data-drawn:bg-transparent" style={{ fontFamily: HAND }} aria-hidden>
            {k + 1}
          </span>
          <span data-sk-label="" className="min-w-0 text-[1.05rem] font-bold [overflow-wrap:anywhere]" style={{ fontFamily: HAND }}><Rich text={n.label} /></span>
        </p>
        {n.detail ? <p className="mt-1 pl-[2.125rem] text-[0.92rem] leading-relaxed text-foreground/80 [overflow-wrap:anywhere]"><Rich text={n.detail} /></p> : null}
      </div>
    );
  };

  const links: Link[] = [];
  let body: React.ReactNode;
  if (d.layout === "tree") {
    const kids = (pid?: string) => d.nodes.map((x, k) => ({ x, k })).filter(({ x }) => x.parent === pid);
    const branch = (pid?: string, depth = 0, pk?: number): React.ReactNode => {
      const list = kids(pid);
      if (!list.length) return null;
      list.forEach(({ k }, j) => {
        if (pk !== undefined) links.push({ from: ids[pk], to: ids[k], kind: "elbow", after: j ? ids[list[j - 1].k] : undefined });
      });
      return (
        <ul className={cn("flex flex-col gap-2.5", depth > 0 && "mt-2.5 pl-8")}>
          {list.map(({ x, k }) => (
            <li key={x.id}>
              {step(k)}
              {branch(x.id, depth + 1, k)}
            </li>
          ))}
        </ul>
      );
    };
    body = branch(undefined);
  } else {
    const cycle = d.layout === "cycle";
    d.nodes.forEach((_, k) => {
      if (k < d.nodes.length - 1) links.push({ from: ids[k], to: ids[k + 1] });
    });
    if (cycle && d.nodes.length > 1) links.push({ from: ids[d.nodes.length - 1], to: ids[0], kind: "loop" });
    const gap = (k: number) => {
      const next = d.nodes[k + 1] ?? (cycle ? d.nodes[0] : undefined);
      const el = next ? d.edgeLabels?.[`${d.nodes[k].id}>${next.id}`] : undefined;
      if (k === d.nodes.length - 1) return el ? <p className="py-1 pl-11 text-sm font-bold text-[var(--sk-blue)]" style={{ fontFamily: HAND }}><Rich text={el} /></p> : null;
      return (
        <div aria-hidden className="flex min-h-8 items-center py-1 pl-11 text-sm font-bold text-[var(--sk-blue)]" style={{ fontFamily: HAND }}>
          {el ? <span data-sk-label=""><Rich text={el} /></span> : null}
        </div>
      );
    };
    body = (
      <ol className={cn("flex flex-col", cycle && "pr-7")}>
        {d.nodes.map((nd, k) => (
          <li key={nd.id}>
            {step(k)}
            {gap(k)}
          </li>
        ))}
        {cycle ? <li className="pt-1 pl-11 text-sm font-bold text-[var(--sk-soft)]" style={{ fontFamily: HAND }}>then back to 1</li> : null}
      </ol>
    );
  }

  return (
    <figure className={card}>
      {d.title ? <p className={label}><Rich text={d.title} /></p> : null}
      <SketchFrame links={links} salt={`flow-${d.nodes[0]?.id ?? ""}`} className={d.title ? "mt-3" : undefined}>{body}</SketchFrame>
      {d.caption ? <figcaption className="mt-3 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* ---------------------------------------------------------------- curves */
const erf = (x: number) => {
  // Abramowitz-Stegun 7.1.26
  const s = Math.sign(x);
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-a * a);
  return s * y;
};
export const phi = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));
const pdf = (x: number, m = 0, s = 1) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));

/* The hand-drawn chart every curve uses: 380 x 250, plot from GX0 to GX1 and GTOP to GY0. */
const GX0 = 34;
const GX1 = 366;
const GY0 = 204;
const GTOP = 36;
function path(pts: [number, number][]) {
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

function Chart({ name, label: aria, children }: { name: string; label: string; children: React.ReactNode }) {
  return (
    <Sheet name={`curve-${name}`} w={380} h={250} label={aria} className="mx-auto max-w-[32rem]">
      <L k={`${name}-x`} x1={GX0 - 4} y1={GY0} x2={GX1 + 4} y2={GY0} sw={2} />
      {children}
    </Sheet>
  );
}

/** A filled area under a curve, as a hatched polygon. */
function Area({ k, pts, fill, base = GY0 }: { k: string; pts: [number, number][]; fill: string; base?: number }) {
  if (pts.length < 2) return null;
  return <Pg k={k} pts={[[pts[0][0], base], ...pts, [pts[pts.length - 1][0], base]]} stroke="none" fill={fill} gap={5} fw={1.4} />;
}

function Slider({ label: l, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt?: (v: number) => string }) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex justify-between text-sm font-semibold">
        <span>{l}</span>
        <span className="tabular-nums">{fmt ? fmt(value) : value}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-8 w-full accent-[var(--brand)]" />
    </div>
  );
}

function NormalCurve() {
  const [z, setZ] = React.useState(1);
  const [tails, setTails] = React.useState(false);
  const X = (v: number) => GX0 + ((v + 3.5) / 7) * (GX1 - GX0);
  const Y = (p: number) => GY0 - (p / 0.4) * (GY0 - GTOP - 6);
  const pts: [number, number][] = Array.from({ length: 141 }, (_, i) => -3.5 + i * 0.05).map((v) => [X(v), Y(pdf(v))]);
  const fill = (from: number, to: number) => pts.filter(([x]) => x >= X(from) - 0.01 && x <= X(to) + 0.01);
  const left = phi(z);
  const twoTail = 2 * (1 - phi(Math.abs(z)));
  return (
    <>
      <Chart name="normal" label={tails ? `Area beyond ±${Math.abs(z).toFixed(2)}: ${(twoTail * 100).toFixed(1)}%` : `Area below z = ${z.toFixed(2)}: ${(left * 100).toFixed(1)}%`}>
        {tails ? (
          <>
            <Area k={`nl-${z}`} pts={fill(-3.5, -Math.abs(z))} fill={C.red} />
            <Area k={`nr-${z}`} pts={fill(Math.abs(z), 3.5)} fill={C.red} />
          </>
        ) : (
          <Area k={`na-${z}`} pts={fill(-3.5, z)} fill={C.blue} />
        )}
        <Cv k="normal" pts={pts.filter((_, i) => i % 4 === 0)} sw={2.4} single rough={0.4} />
        <L k={`nz-${z}`} x1={X(z)} x2={X(z)} y1={GTOP - 4} y2={GY0} stroke={C.blue} sw={2.4} single rough={0.3} />
        <Label x={Math.min(GX1 - 40, Math.max(GX0 + 40, X(z)))} y={GTOP - 12} size={16} anchor="middle" color={C.blue}>{`z = ${z.toFixed(2)}`}</Label>
        {[-3, -2, -1, 0, 1, 2, 3].map((v) => (
          <Label key={v} x={X(v)} y={GY0 + 24} size={14} anchor="middle" bold={false}>{String(v)}</Label>
        ))}
      </Chart>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider label="z-score" value={z} min={-3} max={3} step={0.05} onChange={setZ} fmt={(v) => v.toFixed(2)} />
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={tails} onChange={(e) => setTails(e.target.checked)} className="size-4 accent-[var(--brand)]" /> Show both tails (two-tailed p)
        </label>
      </div>
      <p className="mt-2 text-[0.95rem]" role="status">
        {tails ? (
          <>Area beyond ±{Math.abs(z).toFixed(2)} = <strong className="tabular-nums">{(twoTail * 100).toFixed(2)}%</strong> → two-tailed p ≈ {twoTail.toFixed(3)}{twoTail < 0.05 ? " (below .05)" : ""}.</>
        ) : (
          <>Area below z = {z.toFixed(2)} is <strong className="tabular-nums">{(left * 100).toFixed(1)}%</strong>: a score here beats about {(left * 100).toFixed(0)}% of people. As an IQ (mean 100, SD 15): <strong className="tabular-nums">{Math.round(100 + 15 * z)}</strong>.</>
        )}
      </p>
    </>
  );
}

function SdtCurve() {
  const [dp, setDp] = React.useState(1.5);
  const [c, setC] = React.useState(0);
  const lo = -3.5;
  const hi = 5.5;
  const X = (v: number) => GX0 + ((v - lo) / (hi - lo)) * (GX1 - GX0);
  const Y = (p: number) => GY0 - (p / 0.4) * (GY0 - GTOP - 6);
  const xs = Array.from({ length: 181 }, (_, i) => lo + i * 0.05);
  const xc = dp / 2 + c;
  const hit = 1 - phi(xc - dp);
  const fa = 1 - phi(xc);
  return (
    <>
      <Chart name="sdt" label={`Hit rate ${(hit * 100).toFixed(0)}%, false alarms ${(fa * 100).toFixed(0)}%`}>
        <Cv k="noise" pts={xs.filter((_, i) => i % 4 === 0).map((v) => [X(v), Y(pdf(v))])} sw={2.2} single rough={0.4} dash="7 5" />
        <Cv k={`signal-${dp}`} pts={xs.filter((_, i) => i % 4 === 0).map((v) => [X(v), Y(pdf(v, dp))])} stroke={C.blue} sw={2.6} single rough={0.4} />
        <L k={`crit-${xc}`} x1={X(xc)} x2={X(xc)} y1={GTOP - 6} y2={GY0} stroke={C.red} sw={2.4} single rough={0.3} />
        <Label x={X(0) - 6} y={GTOP - 12} size={16} anchor="end">noise only</Label>
        <Label x={X(dp) + 6 + labelWidth("signal + noise", 16) > GX1 ? GX1 : X(dp) + 6} y={GTOP - 12} size={16} anchor={X(dp) + 6 + labelWidth("signal + noise", 16) > GX1 ? "end" : "start"} color={C.blue}>signal + noise</Label>
        <Label x={Math.min(X(xc) + 6, GX1 - labelWidth("say \u201cyes\u201d \u2192", 16))} y={GY0 + 24} size={16} color={C.red}>{"say \u201cyes\u201d \u2192"}</Label>
      </Chart>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider label="Sensitivity d′ (how far apart)" value={dp} min={0} max={3.5} step={0.05} onChange={setDp} fmt={(v) => v.toFixed(2)} />
        <Slider label="Criterion c (how cautious)" value={c} min={-1.5} max={1.5} step={0.05} onChange={setC} fmt={(v) => (v > 0 ? "+" : "") + v.toFixed(2)} />
      </div>
      <p className="mt-2 text-[0.95rem]" role="status">
        Hits <strong className="tabular-nums">{(hit * 100).toFixed(0)}%</strong> · misses {(100 - hit * 100).toFixed(0)}% · false alarms <strong className="tabular-nums">{(fa * 100).toFixed(0)}%</strong> · correct rejections {(100 - fa * 100).toFixed(0)}%.{" "}
        {c > 0.3 ? "A cautious observer: fewer false alarms, but more misses." : c < -0.3 ? "A liberal observer: more hits, but more false alarms." : "A neutral criterion."} Moving the criterion trades errors; only a bigger d′ improves both.
      </p>
    </>
  );
}

function ForgettingCurve() {
  const [reviews, setReviews] = React.useState<number[]>([]);
  const days = 30;
  const X = (t: number) => GX0 + (t / days) * (GX1 - GX0);
  const Y = (r: number) => GTOP + (1 - r) * (GY0 - GTOP);
  // Each review resets recall to 100% and makes memory more stable (slower decay).
  const seg: [number, number][] = [];
  const stops = [0, ...reviews, days];
  let S = 1.6;
  for (let k = 0; k < stops.length - 1; k++) {
    for (let t = stops[k]; t <= stops[k + 1]; t += 0.25) seg.push([X(t), Y(Math.exp(-(t - stops[k]) / S))]);
    S *= 2.6;
  }
  const lastStart = stops[stops.length - 2];
  const endRecall = Math.exp(-(days - lastStart) / (S / 2.6));
  const next = reviews.length ? Math.min(days - 1, reviews.at(-1)! + [2, 5, 10, 18][Math.min(reviews.length, 3)]) : 1;
  return (
    <>
      <Chart name="forgetting" label={`Recall after 30 days ≈ ${(endRecall * 100).toFixed(0)}% with ${reviews.length} reviews`}>
        <L k="fy" x1={GX0} y1={GY0 + 4} x2={GX0} y2={GTOP - 6} sw={2} />
        {reviews.map((r) => (
          <L key={r} k={`rev-${r}`} x1={X(r)} x2={X(r)} y1={GTOP} y2={GY0} stroke={C.soft} sw={1.2} single dash="4 4" />
        ))}
        <P k={`forget-${reviews.join("-")}`} d={path(seg.filter((_, i) => i % 2 === 0))} stroke={C.blue} sw={2.6} single rough={0.4} />
        <Label x={GX0 + 8} y={GTOP - 12} size={16}>100% recall</Label>
        <Label x={GX0} y={GY0 + 24} size={14} bold={false}>day 0</Label>
        <Label x={GX1} y={GY0 + 24} size={14} anchor="end" bold={false}>{`day ${days}`}</Label>
      </Chart>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={cn(btn, "bg-primary text-primary-foreground")} disabled={reviews.length >= 4 || next >= days} onClick={() => setReviews((r) => [...r, next])}>
          Review on day {next}
        </button>
        <button type="button" className={cn(btn, "bg-card")} onClick={() => setReviews([])}><RotateCcw className="size-4" aria-hidden /> Reset</button>
      </div>
      <p className="mt-2 text-[0.95rem]" role="status">
        With {reviews.length} spaced review{reviews.length === 1 ? "" : "s"}, recall on day {days} is about <strong className="tabular-nums">{(endRecall * 100).toFixed(0)}%</strong>. Each well-timed review flattens the curve: the memory gets more stable, so the gaps can grow.
      </p>
    </>
  );
}

function InvertedU() {
  const [a, setA] = React.useState(50);
  const X = (v: number) => GX0 + (v / 100) * (GX1 - GX0);
  const Y = (p: number) => GY0 - p * (GY0 - GTOP - 4);
  const perf = (v: number, peak: number, width: number) => Math.exp(-(((v - peak) / width) ** 2));
  const xs = Array.from({ length: 101 }, (_, i) => i);
  const simple = perf(a, 68, 38);
  const complex = perf(a, 38, 26);
  return (
    <>
      <Chart name="inverted-u" label={`At arousal ${a}: simple task ${(simple * 100).toFixed(0)}%, complex task ${(complex * 100).toFixed(0)}%`}>
        <Cv k="simple" pts={xs.filter((v) => v % 4 === 0).map((v) => [X(v), Y(perf(v, 68, 38))])} sw={2.2} single rough={0.4} dash="7 5" />
        <Cv k="complex" pts={xs.filter((v) => v % 4 === 0).map((v) => [X(v), Y(perf(v, 38, 26))])} stroke={C.blue} sw={2.6} single rough={0.4} />
        <L k={`ar-${a}`} x1={X(a)} x2={X(a)} y1={GTOP - 6} y2={GY0} stroke={C.red} sw={2.4} single rough={0.3} />
        <Label x={X(68) + 4} y={GTOP - 12} size={16}>simple task</Label>
        <Label x={X(38) - 4} y={GTOP - 12} size={16} anchor="end" color={C.blue}>complex task</Label>
        <Label x={GX0} y={GY0 + 24} size={14} bold={false}>calm</Label>
        <Label x={GX1} y={GY0 + 24} size={14} anchor="end" bold={false}>very aroused</Label>
      </Chart>
      <div className="mt-3"><Slider label="Arousal" value={a} min={0} max={100} step={1} onChange={setA} /></div>
      <p className="mt-2 text-[0.95rem]" role="status">
        Simple task: <strong className="tabular-nums">{(simple * 100).toFixed(0)}%</strong> of best · complex task: <strong className="tabular-nums">{(complex * 100).toFixed(0)}%</strong> of best. Complex tasks peak at lower arousal. This is an idealised picture; the real relationship varies by person and task.
      </p>
    </>
  );
}

function DoseResponse() {
  const [ec, setEc] = React.useState(0);
  const [partial, setPartial] = React.useState(false);
  const lo = -3;
  const hi = 3;
  const X = (v: number) => GX0 + ((v - lo) / (hi - lo)) * (GX1 - GX0);
  const Y = (r: number) => GY0 - r * (GY0 - GTOP - 10);
  const resp = (logd: number, e50: number, emax: number) => emax / (1 + Math.exp(-2.2 * (logd - e50)));
  const xs = Array.from({ length: 121 }, (_, i) => lo + i * 0.05);
  return (
    <>
      <Chart name="dose-response" label="Dose-response curves">
        <L k="dy" x1={GX0} y1={GY0 + 4} x2={GX0} y2={GTOP - 6} sw={2} />
        <L k="full" x1={GX0} x2={GX1} y1={Y(1)} y2={Y(1)} stroke={C.soft} sw={1} single dash="3 5" />
        <Cv k="ref" pts={xs.filter((_, i) => i % 4 === 0).map((v) => [X(v), Y(resp(v, 0, 1))])} sw={2.2} single rough={0.4} dash="7 5" />
        <Cv k={`yours-${ec}-${partial}`} pts={xs.filter((_, i) => i % 4 === 0).map((v) => [X(v), Y(resp(v, ec, partial ? 0.45 : 1))])} stroke={C.blue} sw={2.6} single rough={0.4} />
        <Label x={GX0 + 8} y={Y(1) - 8} size={16}>100% effect</Label>
        <Label x={GX0} y={GY0 + 24} size={14} bold={false}>{"low dose (log scale) \u2192"}</Label>
      </Chart>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Slider label="Potency (shift the curve)" value={ec} min={-1.5} max={1.5} step={0.05} onChange={setEc} fmt={(v) => (v < -0.1 ? "more potent" : v > 0.1 ? "less potent" : "same")} />
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={partial} onChange={(e) => setPartial(e.target.checked)} className="size-4 accent-[var(--brand)]" /> Make it a partial agonist
        </label>
      </div>
      <p className="mt-2 text-[0.95rem]" role="status">
        Dashed = a full agonist reference. {ec < -0.1 ? "Yours reaches the same effect at a lower dose: more potent." : ec > 0.1 ? "Yours needs a higher dose for the same effect: less potent." : "Same potency."}{" "}
        {partial ? "As a partial agonist its ceiling is lower: no dose reaches the full effect (lower efficacy). Potency and efficacy are different things." : "Full efficacy: enough dose reaches the maximum effect."}
      </p>
    </>
  );
}

function HalfLife() {
  const [h, setH] = React.useState(20);
  const tau = 24;
  const hours = 24 * 8;
  const k = Math.LN2 / h;
  const X = (t: number) => GX0 + (t / hours) * (GX1 - GX0);
  const conc = (t: number) => {
    let c = 0;
    for (let d = 0; d <= t; d += tau) c += Math.exp(-k * (t - d));
    return c;
  };
  const css = 1 / (1 - Math.exp(-k * tau));
  const Y = (c: number) => GY0 - (c / (css * 1.15)) * (GY0 - GTOP);
  const pts: [number, number][] = Array.from({ length: 193 }, (_, i) => i).map((t) => [X(t), Y(conc(t))]);
  const ssHours = 4.5 * h;
  return (
    <>
      <Chart name="half-life" label={`Half-life ${h} hours; steady state after about ${Math.round(ssHours)} hours`}>
        <L k="hy" x1={GX0} y1={GY0 + 4} x2={GX0} y2={GTOP - 6} sw={2} />
        <L k="ss" x1={X(0)} x2={X(hours)} y1={Y(css)} y2={Y(css)} stroke={C.soft} sw={1.2} single dash="6 5" />
        <Label x={GX1} y={Y(css) - 8} size={16} anchor="end">steady-state peak</Label>
        <P k={`hl-${h}`} d={path(pts.filter((_, i) => i % 2 === 0))} stroke={C.blue} sw={2.4} single rough={0.3} />
        {ssHours < hours ? <L k={`ssl-${h}`} x1={X(ssHours)} x2={X(ssHours)} y1={GTOP + 30} y2={GY0} stroke={C.red} sw={2} single rough={0.3} /> : null}
        <Label x={GX0} y={GY0 + 24} size={14} bold={false}>{"one dose every 24 h \u2192"}</Label>
      </Chart>
      <div className="mt-3"><Slider label="Half-life" value={h} min={4} max={60} step={1} onChange={setH} fmt={(v) => `${v} h`} /></div>
      <p className="mt-2 text-[0.95rem]" role="status">
        Each dose stacks on what&rsquo;s left of the last. Levels settle (steady state) after about 4 to 5 half-lives: here about <strong className="tabular-nums">{Math.round(ssHours)} hours</strong> ({(ssHours / 24).toFixed(1)} days). Longer half-life → smoother levels, but a longer wait to settle and to wash out.
      </p>
    </>
  );
}

export function Curve({ d }: { d: CurveData }) {
  const body = {
    normal: <NormalCurve />,
    sdt: <SdtCurve />,
    forgetting: <ForgettingCurve />,
    "inverted-u": <InvertedU />,
    "dose-response": <DoseResponse />,
    "half-life": <HalfLife />,
  }[d.kind];
  return (
    <figure className={card}>
      {d.title ? <p className={label}><Rich text={d.title} /></p> : null}
      <div className={d.title ? "mt-3" : undefined}>{body}</div>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* ---------------------------------------------------------------- layers */
type Band = { k: number; cx: number; top: number; bottom: number; room: (yTop: number, yBot: number) => number };

/** A layer's name inside its band when it fits (one or two lines), else its number. */
function BandLabel({ b, text }: { b: Band; text: string }) {
  const mid = (b.top + b.bottom) / 2;
  for (const size of [15, 13]) {
    for (const lines of [1, 2]) {
      const words = wrap(text, 1e4, size);
      const ls = lines === 1 ? words : wrap(text, Math.max(40, b.room(mid - size * 1.2, mid + size * 1.2) - 8), size);
      if (ls.length !== lines) continue;
      const h = (lines - 1) * size * 1.15;
      const y0 = mid - h / 2 + size * 0.32;
      const yt = y0 - size * 0.8;
      const yb = y0 + h + size * 0.28;
      if (yt < b.top + 2 || yb > b.bottom - 2) continue;
      const w = Math.max(...ls.map((l) => labelWidth(l, size)));
      if (w <= b.room(yt, yb) - 8) return <Label x={b.cx} y={y0} lines={ls} size={size} anchor="middle" />;
    }
  }
  const n = String(b.k + 1);
  return (
    <>
      <E k={`band-dot-${b.k}`} cx={b.cx} cy={mid} w={22} h={22} fill={C.lime} fillStyle="solid" sw={1.4} />
      <Label x={b.cx} y={mid + 5} size={14} anchor="middle" color="var(--sk-on-lime)">{n}</Label>
    </>
  );
}

const tone = (k: number) => (k % 2 ? C.wash : C.paper);

function PyramidArt({ labels }: { labels: string[] }) {
  const n = labels.length;
  const bh = n > 5 ? 40 : 50;
  const H = 16 + n * bh;
  const half = (y: number) => ((y - 8) / (n * bh)) * 172;
  const bands: Band[] = labels.map((_, k) => ({ k, cx: 180, top: 8 + k * bh, bottom: 8 + (k + 1) * bh, room: (yt) => 2 * half(yt) }));
  return (
    <Sheet name="layers-pyramid" w={360} h={H} label={`Pyramid, top to bottom: ${labels.join(", ")}`} className="mx-auto max-w-[26rem]">
      {bands.map((b) => (
        <Pg key={b.k} k={`pyr-${b.k}`} pts={[[180 - half(b.top), b.top], [180 + half(b.top), b.top], [180 + half(b.bottom), b.bottom], [180 - half(b.bottom), b.bottom]]} fill={tone(b.k)} fillStyle="solid" sw={2} />
      ))}
      {bands.map((b) => <BandLabel key={b.k} b={b} text={labels[b.k]} />)}
    </Sheet>
  );
}

function IcebergArt({ labels }: { labels: string[] }) {
  const n = labels.length;
  const water = 74;
  const H = n > 4 ? 300 : 260;
  const below = (H - 10 - water) / Math.max(1, n - 1);
  const half = (y: number) => (y <= water ? 34 + (y - 10) * 1.55 : Math.min(172, 133 + (y - water) * 0.22));
  const bands: Band[] = labels.map((_, k) => {
    const top = k === 0 ? 10 : water + (k - 1) * below;
    const bottom = k === 0 ? water : water + k * below;
    return { k, cx: 180, top, bottom, room: (yt, yb) => 2 * Math.min(half(Math.max(yt, top)), half(Math.min(yb, bottom))) };
  });
  return (
    <Sheet name="layers-iceberg" w={360} h={H} label={`Iceberg, top to bottom: ${labels.join(", ")}`} className="mx-auto max-w-[26rem]">
      <R k="sea" x={0} y={water} w={360} h={H - water} stroke="none" fill={C.blue} gap={9} fw={1} angle={-30} style={{ opacity: 0.35 }} />
      {bands.map((b) => (
        <Pg key={b.k} k={`ice-${b.k}`} pts={[[180 - half(b.top), b.top], [180 + half(b.top), b.top], [180 + half(b.bottom - 0.01), b.bottom], [180 - half(b.bottom - 0.01), b.bottom]]} fill={b.k === 0 ? C.paper : C.wash} fillStyle="solid" sw={2} />
      ))}
      <P k="waterline" d={`M0 ${water} q15 -5 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0`} stroke={C.blue} sw={2} single rough={0.5} />
      {bands.map((b) => <BandLabel key={b.k} b={b} text={labels[b.k]} />)}
    </Sheet>
  );
}

function RingsArt({ labels }: { labels: string[] }) {
  const n = labels.length;
  const cx = 112;
  const r = (k: number) => (n === 1 ? 100 : 26 + (k * 78) / (n - 1));
  // Names sit in a column on the right, outermost ring at the top, each with a leader into its own ring.
  const rows = labels.map((t, k) => ({ k, lines: wrap(t, 120, 14).slice(0, 3) })).reverse();
  const heights = rows.map((x) => x.lines.length * 16 + 10);
  const total = heights.reduce((a, h) => a + h, 0);
  const H = Math.max(270, total + 24);
  const start = (H - total) / 2 + 14;
  const placed = rows.map((x, i) => ({ ...x, y: start + heights.slice(0, i).reduce((a, h) => a + h, 0) }));
  const cyy = H / 2;
  return (
    <Sheet name="layers-rings" w={360} h={H} label={`Rings, inside to outside: ${labels.join(", ")}`} className="mx-auto max-w-[26rem]">
      {[...labels.keys()].reverse().map((k) => (
        <E key={k} k={`ring-${k}`} cx={cx} cy={cyy} w={r(k) * 2} h={r(k) * 2} fill={tone(k)} fillStyle="solid" sw={2} />
      ))}
      {placed.map((x) => {
        const rm = x.k === 0 ? r(0) * 0.45 : (r(x.k) + r(x.k - 1)) / 2;
        const mid = x.y - 5 + ((x.lines.length - 1) * 16) / 2;
        const s = Math.max(-0.95, Math.min(0.95, (mid - cyy) / rm));
        const to: [number, number] = [cx + rm * Math.sqrt(1 - s * s), cyy + rm * s];
        return <Callout key={x.k} k={`ring-name-${x.k}`} x={228} y={x.y} lines={x.lines} size={14} to={to} />;
      })}
    </Sheet>
  );
}

/** A layered model (rings, pyramid, iceberg or stack): the hand-drawn picture, then every layer with its meaning. */
export function Layers({ d }: { d: LayersData }) {
  const n = d.layers.length;
  const labels = d.layers.map((ly) => plain(String(ly.label)));
  const art = d.shape === "rings" ? <RingsArt labels={labels} /> : d.shape === "pyramid" ? <PyramidArt labels={labels} /> : d.shape === "iceberg" ? <IcebergArt labels={labels} /> : null;
  const stack = d.shape === "stack";
  const links: Link[] = stack ? [] : [];
  return (
    <figure className={card}>
      {d.title ? <p className={label}><Rich text={d.title} /></p> : null}
      {art ? <div className={d.title ? "mt-3" : undefined}>{art}</div> : null}
      <SketchFrame links={links} salt={`layers-${labels[0] ?? ""}`} className={d.title || art ? "mt-3" : undefined}>
        <ol className={cn("flex flex-col", stack ? "gap-0" : "gap-2")} aria-label={stack ? `Layers, top to bottom` : undefined}>
          {d.layers.map((ly, k) => (
            <li
              key={k}
              data-sk="box"
              data-sk-id={`layer-${k}`}
              data-sk-tone={stack ? (k % 2 ? "wash" : "paper") : "paper"}
              className={cn(BOX, "min-w-0 px-3 py-2", stack && "-mt-0.5 first:mt-0")}
              style={stack ? { marginInline: `${(k * 6) / Math.max(1, n)}%` } : undefined}
            >
              <p className="flex items-baseline gap-2.5 leading-snug">
                <span data-sk="dot" data-sk-id={`layer-dot-${k}`} className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--sk-lime)] text-sm font-bold text-[var(--sk-on-lime)] group-data-drawn:bg-transparent" style={{ fontFamily: HAND }} aria-hidden>
                  {k + 1}
                </span>
                <span data-sk-label="" className="min-w-0 text-[1.05rem] font-bold [overflow-wrap:anywhere]" style={{ fontFamily: HAND }}><Rich text={ly.label} /></span>
              </p>
              {ly.detail ? <p className="mt-0.5 pl-[2.125rem] text-[0.92rem] leading-relaxed text-foreground/80 [overflow-wrap:anywhere]"><Rich text={ly.detail} /></p> : null}
            </li>
          ))}
        </ol>
      </SketchFrame>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* -------------------------------------------------------------- brainmap */
type Pt = [number, number];
/** The outside of the left half of the brain, front to the left, in sheet units (412 x 304). */
const OUTLINE: Pt[] = [[82, 152], [76, 122], [88, 90], [112, 64], [150, 46], [200, 38], [250, 42], [292, 58], [322, 86], [336, 120], [334, 152], [318, 174], [292, 186], [256, 194], [216, 200], [180, 200], [150, 194], [128, 182], [116, 168], [120, 157], [100, 156]];
const FISSURE: Pt[] = [[120, 156], [160, 146], [200, 140], [234, 136], [246, 128]];
const CENTRAL: Pt[] = [[206, 39], [196, 80], [186, 112], [180, 142]];

type Region = { id: string; name: string; spot: Pt; deep?: boolean; poly?: Pt[]; draw?: (k: string, o: { fill?: string; fillStyle?: "solid" | "hachure"; stroke?: string }) => React.ReactNode };
const REGIONS: Region[] = [
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

const BM_W = 412;
const BM_H = 304;

function BrainMapArt({ focus, pick, onPick }: { focus: string[]; pick: string | null; onPick: (id: string) => void }) {
  const shown = REGIONS.filter((r) => !r.deep || focus.includes(r.id));
  const sel = REGIONS.find((r) => r.id === pick);
  const look = (r: Region) => (r.id === pick ? { fill: C.lime, fillStyle: "hachure" as const } : focus.includes(r.id) ? { fill: C.wash, fillStyle: "solid" as const } : {});
  const num = (id: string) => focus.indexOf(id) + 1;
  // The picked region is named in the top margin (or the bottom one, for the low parts), with a leader to its dot.
  const callout = sel
    ? (() => {
        const low = sel.spot[1] > 160;
        const w = labelWidth(sel.name);
        const x = Math.max(8, Math.min(BM_W - w - 8, sel.spot[0] - w / 2));
        return <Callout k={`bm-name-${sel.id}`} x={x} y={low ? BM_H - 12 : 22} lines={[sel.name]} to={[sel.spot[0], sel.spot[1] + (low ? 10 : -10)]} active />;
      })()
    : null;
  return (
    <Sheet name="brainmap" w={BM_W} h={BM_H} label={`Side view of the brain, front on the left${sel ? `, ${sel.name} picked` : ""}`} className="mx-auto max-w-[30rem]">
      {/* cerebellum and brainstem sit behind the cerebrum */}
      {shown.filter((r) => r.id === "cerebellum" || r.id === "brainstem").map((r) => <g key={r.id} onClick={() => onPick(r.id)} className={focus.includes(r.id) ? "cursor-pointer" : undefined}>{r.draw!(`bm-${r.id}-${r.id === pick ? "on" : focus.includes(r.id) ? "f" : "x"}`, { ...look(r), ...(r.id === pick || focus.includes(r.id) ? {} : { fill: C.paper, fillStyle: "solid" }) })}</g>)}
      <Cv k="bm-outline" pts={[...OUTLINE, OUTLINE[0]]} sw={2.4} fill={C.paper} fillStyle="solid" />
      {shown.filter((r) => r.poly && (r.id === pick || focus.includes(r.id))).sort((a, b) => Number(a.id === pick) - Number(b.id === pick)).map((r) => (
        <g key={r.id} onClick={() => onPick(r.id)} className="cursor-pointer">
          <Pg k={`bm-${r.id}-${r.id === pick ? "on" : "f"}`} pts={r.poly!} stroke="none" {...look(r)} gap={5} />
        </g>
      ))}
      <Cv k="bm-fissure" pts={FISSURE} sw={2} single rough={0.6} />
      <Cv k="bm-central" pts={CENTRAL} sw={1.8} single rough={0.6} />
      <P k="bm-po" d="M300 62 C302 90 302 124 306 176" stroke={C.soft} sw={1.3} single dash="4 5" />
      <P k="bm-folds" d="M120 90 C130 84 140 92 150 86 M100 128 C110 122 118 130 126 124 M232 70 C240 62 252 70 262 64 M262 116 C272 108 282 116 290 110 M150 178 C166 172 184 180 200 174 M226 186 C238 180 252 188 266 182 M312 100 C318 108 314 118 322 122" stroke={C.soft} sw={1.2} single rough={0.8} />
      {shown.filter((r) => r.draw && r.id !== "cerebellum" && r.id !== "brainstem").map((r) => (
        <g key={r.id} onClick={() => onPick(r.id)} className={focus.includes(r.id) ? "cursor-pointer" : undefined}>{r.draw!(`bm-${r.id}-${r.id === pick ? "on" : focus.includes(r.id) ? "f" : "x"}`, { ...look(r), stroke: r.id === pick ? C.blue : r.deep ? C.ink : undefined })}</g>
      ))}
      {focus.map((id) => {
        const r = REGIONS.find((x) => x.id === id);
        if (!r) return null;
        const on = id === pick;
        return (
          <g key={id} onClick={() => onPick(id)} className="cursor-pointer">
            <E k={`bm-dot-${id}-${on}`} cx={r.spot[0]} cy={r.spot[1]} w={23} h={23} fill={on ? C.blue : C.lime} fillStyle="solid" sw={1.4} />
            <Label x={r.spot[0]} y={r.spot[1] + 5} size={15} anchor="middle" color={on ? C.paper : "var(--sk-on-lime)"}>{String(num(id))}</Label>
          </g>
        );
      })}
      {callout}
      <Label x={14} y={206} size={13} bold={false} color={C.soft}>front</Label>
      <Arrow k="bm-front" from={[56, 214]} to={[14, 214]} stroke={C.soft} sw={1.2} />
    </Sheet>
  );
}

export function BrainMap({ d }: { d: BrainMapData }) {
  const focus = d.focus?.length ? d.focus : REGIONS.map((r) => r.id).filter((id) => d.notes?.[id]);
  const [pick, setPick] = React.useState<string | null>(focus[0] ?? null);
  const sel = REGIONS.find((r) => r.id === pick);
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "The brain"}</p>
      <div className="mt-3">
        <BrainMapArt focus={focus.filter((id) => REGIONS.some((r) => r.id === id))} pick={pick} onPick={(id) => focus.includes(id) && setPick(id)} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Brain parts">
        {focus.map((id, k) => {
          const r = REGIONS.find((x) => x.id === id);
          return r ? (
            <button key={id} type="button" onClick={() => setPick(id)} aria-pressed={pick === id} className={cn("inline-flex min-h-10 items-center gap-1.5 rounded-md border-2 px-2.5 py-1 text-sm font-semibold", pick === id ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card")}>
              <span className="tabular-nums opacity-70" aria-hidden>{k + 1}</span> {r.name}
            </button>
          ) : null;
        })}
      </div>
      <div className="mt-3 min-h-[3.5rem] rounded-xl bg-muted p-3 text-[0.95rem] leading-relaxed" role="status" aria-live="polite">
        {sel ? (
          <p className="vibha-pop" key={sel.id}><span className="font-semibold">{sel.name}{sel.deep ? " (deep inside)" : ""}: </span>{d.notes?.[sel.id] ? <Rich text={d.notes[sel.id]} /> : null}</p>
        ) : null}
      </div>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}
