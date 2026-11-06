"use client";

import * as React from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { BrainMapData, CurveData, FlowData, LayersData } from "@/lib/study/types";
import { cn } from "@/lib/utils";
import { Rich } from "./rich";
import { trackLearn } from "@/lib/learn/track";

/**
 * Visual teaching pieces: flowcharts and cycles, interactive curves, layered
 * models and a brain map. Each one is something to explore (tap, play, drag a
 * slider), never a decoration. Motion is transform/opacity and stops under
 * reduce-motion; every state is also written in words below the picture.
 */

const card = "rounded-2xl border-2 border-foreground bg-card p-4 sm:p-5 shadow-[var(--shadow-hard-sm)]";
const label = "text-xs font-semibold tracking-wide uppercase text-link";
const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border-2 border-foreground px-4 font-semibold";

function useReducedMotion(): boolean {
  return React.useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** Steps through 0..n-1 on Play; timer state lives in the callback, not the effect body. */
function useStepper(n: number, ms = 1400) {
  const [i, setI] = React.useState(-1);
  const [playing, setPlaying] = React.useState(false);
  React.useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setI((x) => {
        if (x + 1 >= n) {
          setPlaying(false);
          return x;
        }
        return x + 1;
      });
    }, ms);
    return () => clearTimeout(t);
  }, [playing, i, n, ms]);
  return {
    i,
    playing,
    play: () => {
      setI((x) => (x + 1 >= n ? 0 : x < 0 ? 0 : x));
      setPlaying(true);
    },
    pause: () => setPlaying(false),
    reset: () => {
      setPlaying(false);
      setI(-1);
    },
    pick: (k: number) => {
      setPlaying(false);
      setI(k);
    },
  };
}

/* ------------------------------------------------------------------ flow */
export function Flow({ d }: { d: FlowData }) {
  const st = useStepper(d.nodes.length);
  const active = st.i >= 0 ? d.nodes[st.i] : null;
  const isOn = (k: number) => st.i === k;
  const seen = (k: number) => st.i >= k;

  const nodeBtn = (k: number, extra?: string) => {
    const n = d.nodes[k];
    return (
      <button
        key={n.id}
        type="button"
        onClick={() => st.pick(k)}
        aria-pressed={isOn(k)}
        className={cn(
          "min-h-11 rounded-md border-2 px-3 py-2 text-left text-[0.92rem] leading-snug font-semibold transition-[transform,background-color,opacity] duration-base",
          isOn(k) ? "-translate-y-0.5 border-foreground bg-primary text-primary-foreground shadow-[var(--shadow-hard-xs)]" : seen(k) ? "border-foreground bg-card" : "border-foreground/40 bg-card",
          extra,
        )}
      >
        <Rich text={n.label} />
      </button>
    );
  };

  let body: React.ReactNode;
  if (d.layout === "cycle") {
    const n = d.nodes.length;
    const R = 38; // percent radius
    body = (
      <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
          <circle cx="50" cy="50" r={R} fill="none" className="stroke-foreground/25" strokeWidth="0.8" strokeDasharray="2 2" />
          {d.nodes.map((_, k) => {
            const a1 = (k / n) * 2 * Math.PI - Math.PI / 2 + 0.32;
            const a2 = ((k + 1) / n) * 2 * Math.PI - Math.PI / 2 - 0.32;
            const p = (a: number) => [50 + R * Math.cos(a), 50 + R * Math.sin(a)];
            const [x1, y1] = p(a1);
            const [x2, y2] = p(a2);
            return (
              <path key={k} d={`M${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`} fill="none" strokeWidth={st.i === k ? 2 : 1.2} className={cn("transition-all duration-base", st.i === k ? "stroke-[var(--brand)]" : "stroke-foreground/60")} markerEnd="url(#flow-arrow)" />
            );
          })}
          <defs>
            <marker id="flow-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className="fill-foreground" />
            </marker>
          </defs>
        </svg>
        {d.nodes.map((nd, k) => {
          const a = (k / n) * 2 * Math.PI - Math.PI / 2;
          return (
            <div key={nd.id} className="absolute w-[34%] -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + R * Math.cos(a)}%`, top: `${50 + R * Math.sin(a)}%` }}>
              {nodeBtn(k, "w-full text-center text-[0.8rem] sm:text-[0.88rem]")}
            </div>
          );
        })}
      </div>
    );
  } else if (d.layout === "tree") {
    const kids = (pid?: string) => d.nodes.map((x, k) => ({ x, k })).filter(({ x }) => x.parent === pid);
    const branch = (pid?: string, depth = 0): React.ReactNode => {
      const list = kids(pid);
      if (!list.length) return null;
      return (
        <ul className={cn("flex flex-col gap-2", depth > 0 && "mt-2 border-l-2 border-foreground/30 pl-3 sm:pl-4")}>
          {list.map(({ x, k }) => (
            <li key={x.id}>
              {nodeBtn(k, "w-full")}
              {branch(x.id, depth + 1)}
            </li>
          ))}
        </ul>
      );
    };
    body = branch(undefined);
  } else {
    body = (
      <ol className="flex flex-col items-stretch gap-1 sm:flex-row sm:flex-wrap sm:items-center">
        {d.nodes.map((nd, k) => {
          const next = d.nodes[k + 1];
          const el = d.edgeLabels?.[`${nd.id}>${next?.id}`];
          return (
            <li key={nd.id} className="flex flex-col items-stretch sm:flex-row sm:items-center">
              {nodeBtn(k, "sm:max-w-[13rem]")}
              {next ? (
                <span aria-hidden className={cn("flex items-center justify-center gap-1 px-2 py-1 text-xs text-muted-foreground transition-opacity", seen(k + 1) || st.i < 0 ? "opacity-100" : "opacity-40")}>
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">→</span>
                  {el ? <Rich text={el} /> : null}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <figure className={card}>
      {d.title ? <p className={label}><Rich text={d.title} /></p> : <p className={label}>See how it works</p>}
      <div className="mt-3">{body}</div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {st.playing ? (
          <button type="button" className={cn(btn, "bg-card")} onClick={st.pause}><Pause className="size-4" aria-hidden /> Pause</button>
        ) : (
          <button type="button" className={cn(btn, "bg-foreground text-background")} onClick={() => { st.play(); trackLearn({ type: "widget", kind: "flow", prompt: String(d.title ?? d.nodes[0]?.label ?? "") }); }}>
            <Play className="size-4" aria-hidden /> {st.i < 0 ? "Play it step by step" : "Continue"}
          </button>
        )}
        {st.i >= 0 ? <button type="button" className={cn(btn, "bg-card")} onClick={st.reset}><RotateCcw className="size-4" aria-hidden /> Start over</button> : null}
        <span className="text-sm text-muted-foreground">or tap any box</span>
      </div>
      <div className="mt-3 min-h-[3.5rem] rounded-xl bg-muted p-3 text-[0.95rem] leading-relaxed" role="status" aria-live="polite">
        {active ? (
          <p className="vibha-pop" key={active.id}>
            <span className="font-semibold"><Rich text={active.label} />{active.detail ? ": " : ""}</span>
            {active.detail ? <Rich text={active.detail} /> : null}
          </p>
        ) : (
          <p className="text-muted-foreground">Press Play, or tap a box to see what happens at that step.</p>
        )}
      </div>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* ---------------------------------------------------------------- curves */
const erf = (x: number) => {
  // Abramowitz–Stegun 7.1.26
  const s = Math.sign(x);
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t) * Math.exp(-a * a);
  return s * y;
};
export const phi = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));
const pdf = (x: number, m = 0, s = 1) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));

const W = 320;
const H = 160;
function path(pts: [number, number][]) {
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
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
  const X = (v: number) => ((v + 3.5) / 7) * W;
  const Y = (p: number) => H - 10 - p * (H - 20) * 2.4;
  const pts: [number, number][] = Array.from({ length: 141 }, (_, i) => -3.5 + i * 0.05).map((v) => [X(v), Y(pdf(v))]);
  const fill = (from: number, to: number) => {
    const seg = pts.filter(([x]) => x >= X(from) && x <= X(to));
    if (!seg.length) return "";
    return `${path(seg)} L${seg.at(-1)![0]} ${H - 10} L${seg[0][0]} ${H - 10} Z`;
  };
  const left = phi(z);
  const twoTail = 2 * (1 - phi(Math.abs(z)));
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={tails ? `Area beyond ±${Math.abs(z).toFixed(2)}: ${(twoTail * 100).toFixed(1)}%` : `Area below z = ${z.toFixed(2)}: ${(left * 100).toFixed(1)}%`}>
        {tails ? (
          <>
            <path d={fill(-3.5, -Math.abs(z))} className="fill-[var(--status-alert-bg)] stroke-none" />
            <path d={fill(Math.abs(z), 3.5)} className="fill-[var(--status-alert-bg)] stroke-none" />
          </>
        ) : (
          <path d={fill(-3.5, z)} className="fill-[var(--status-info-bg)] stroke-none" />
        )}
        <path d={path(pts)} fill="none" strokeWidth="2.5" className="stroke-foreground" />
        <line x1={X(z)} x2={X(z)} y1={12} y2={H - 10} className="stroke-[var(--brand)]" strokeWidth="2" />
        {[-3, -2, -1, 0, 1, 2, 3].map((v) => (
          <text key={v} x={X(v)} y={H - 1} textAnchor="middle" className="fill-muted-foreground text-[9px]">{v}</text>
        ))}
      </svg>
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
  const X = (v: number) => ((v - lo) / (hi - lo)) * W;
  const Y = (p: number) => H - 12 - p * (H - 24) * 2.4;
  const xs = Array.from({ length: 181 }, (_, i) => lo + i * 0.05);
  const xc = dp / 2 + c;
  const hit = 1 - phi(xc - dp);
  const fa = 1 - phi(xc);
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`Hit rate ${(hit * 100).toFixed(0)}%, false alarms ${(fa * 100).toFixed(0)}%`}>
        <path d={path(xs.map((v) => [X(v), Y(pdf(v))]))} fill="none" strokeWidth="2.5" className="stroke-foreground" strokeDasharray="5 3" />
        <path d={path(xs.map((v) => [X(v), Y(pdf(v, dp))]))} fill="none" strokeWidth="2.5" className="stroke-[var(--brand)]" />
        <line x1={X(xc)} x2={X(xc)} y1={10} y2={H - 12} className="stroke-[var(--destructive)]" strokeWidth="2" />
        <text x={X(0)} y={22} textAnchor="middle" className="fill-foreground text-[9px] font-semibold">noise only</text>
        <text x={X(dp)} y={34} textAnchor="middle" className="fill-[var(--brand)] text-[9px] font-semibold">signal + noise</text>
        <text x={X(xc) + 3} y={H - 16} className="fill-foreground text-[9px]">say “yes” →</text>
      </svg>
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
  const X = (t: number) => 14 + (t / days) * (W - 24);
  const Y = (r: number) => 10 + (1 - r) * (H - 26);
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
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`Recall after 30 days ≈ ${(endRecall * 100).toFixed(0)}% with ${reviews.length} reviews`}>
        <path d={path(seg)} fill="none" strokeWidth="2.5" className="vibha-draw stroke-[var(--brand)]" pathLength={1} key={reviews.join("-")} />
        {reviews.map((r) => (
          <line key={r} x1={X(r)} x2={X(r)} y1={10} y2={H - 16} className="stroke-foreground/40" strokeDasharray="3 3" />
        ))}
        <text x={X(0)} y={H - 3} className="fill-muted-foreground text-[9px]">day 0</text>
        <text x={X(days) - 22} y={H - 3} className="fill-muted-foreground text-[9px]">day {days}</text>
        <text x={4} y={16} className="fill-muted-foreground text-[9px]">100% recall</text>
      </svg>
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
  const X = (v: number) => 12 + (v / 100) * (W - 24);
  const Y = (p: number) => H - 14 - p * (H - 28);
  const perf = (v: number, peak: number, width: number) => Math.exp(-(((v - peak) / width) ** 2));
  const xs = Array.from({ length: 101 }, (_, i) => i);
  const simple = perf(a, 68, 38);
  const complex = perf(a, 38, 26);
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`At arousal ${a}: simple task ${(simple * 100).toFixed(0)}%, complex task ${(complex * 100).toFixed(0)}%`}>
        <path d={path(xs.map((v) => [X(v), Y(perf(v, 68, 38))]))} fill="none" strokeWidth="2.5" className="stroke-foreground" strokeDasharray="5 3" />
        <path d={path(xs.map((v) => [X(v), Y(perf(v, 38, 26))]))} fill="none" strokeWidth="2.5" className="stroke-[var(--brand)]" />
        <line x1={X(a)} x2={X(a)} y1={8} y2={H - 14} className="stroke-[var(--destructive)]" strokeWidth="2" />
        <text x={X(70)} y={24} className="fill-foreground text-[9px] font-semibold">simple task</text>
        <text x={X(16)} y={24} className="fill-[var(--brand)] text-[9px] font-semibold">complex task</text>
        <text x={X(0)} y={H - 2} className="fill-muted-foreground text-[9px]">calm</text>
        <text x={X(100) - 30} y={H - 2} className="fill-muted-foreground text-[9px]">very aroused</text>
      </svg>
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
  const X = (v: number) => 14 + ((v - lo) / (hi - lo)) * (W - 24);
  const Y = (r: number) => H - 14 - r * (H - 30);
  const resp = (logd: number, e50: number, emax: number) => emax / (1 + Math.exp(-2.2 * (logd - e50)));
  const xs = Array.from({ length: 121 }, (_, i) => lo + i * 0.05);
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label="Dose-response curves">
        <path d={path(xs.map((v) => [X(v), Y(resp(v, 0, 1))]))} fill="none" strokeWidth="2.5" className="stroke-foreground" strokeDasharray="5 3" />
        <path d={path(xs.map((v) => [X(v), Y(resp(v, ec, partial ? 0.45 : 1))]))} fill="none" strokeWidth="2.5" className="stroke-[var(--brand)]" />
        <text x={X(-2.9)} y={Y(1) - 3} className="fill-muted-foreground text-[9px]">100% effect</text>
        <text x={X(-2.9)} y={H - 2} className="fill-muted-foreground text-[9px]">low dose (log scale) →</text>
      </svg>
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
  const X = (t: number) => 14 + (t / hours) * (W - 24);
  const conc = (t: number) => {
    let c = 0;
    for (let d = 0; d <= t; d += tau) c += Math.exp(-k * (t - d));
    return c;
  };
  const css = 1 / (1 - Math.exp(-k * tau));
  const Y = (c: number) => H - 14 - (c / (css * 1.15)) * (H - 28);
  const pts: [number, number][] = Array.from({ length: 193 }, (_, i) => i).map((t) => [X(t), Y(conc(t))]);
  const ssHours = 4.5 * h;
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl border-2 border-foreground bg-background" role="img" aria-label={`Half-life ${h} hours; steady state after about ${Math.round(ssHours)} hours`}>
        <line x1={X(0)} x2={X(hours)} y1={Y(css)} y2={Y(css)} className="stroke-foreground/40" strokeDasharray="4 3" />
        <text x={X(hours) - 64} y={Y(css) - 3} className="fill-muted-foreground text-[9px]">steady-state peak</text>
        <path d={path(pts)} fill="none" strokeWidth="2.5" className="stroke-[var(--brand)]" />
        {ssHours < hours ? <line x1={X(ssHours)} x2={X(ssHours)} y1={10} y2={H - 14} className="stroke-[var(--destructive)]" strokeWidth="1.5" /> : null}
        <text x={X(0)} y={H - 2} className="fill-muted-foreground text-[9px]">one dose every 24 h →</text>
      </svg>
      <div className="mt-3"><Slider label="Half-life" value={h} min={4} max={60} step={1} onChange={setH} fmt={(v) => `${v} h`} /></div>
      <p className="mt-2 text-[0.95rem]" role="status">
        Each dose stacks on what&rsquo;s left of the last. Levels settle (steady state) after about 4–5 half-lives: here about <strong className="tabular-nums">{Math.round(ssHours)} hours</strong> ({(ssHours / 24).toFixed(1)} days). Longer half-life → smoother levels, but a longer wait to settle and to wash out.
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
      <p className={label}>{d.title ? <Rich text={d.title} /> : "Explore it"}</p>
      <div className="mt-3">{body}</div>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* ---------------------------------------------------------------- layers */
export function Layers({ d }: { d: LayersData }) {
  const [pick, setPick] = React.useState<number | null>(null);
  const reduce = useReducedMotion();
  const n = d.layers.length;
  const sel = pick === null ? null : d.layers[pick];
  const toneFor = (k: number) => (pick === k ? "fill-[var(--primary)]" : k % 2 ? "fill-[var(--muted)]" : "fill-card");

  let art: React.ReactNode;
  if (d.shape === "rings") {
    art = (
      <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-[22rem]" role="group" aria-label="Rings model">
        {d.layers
          .map((ly, k) => ({ ly, k }))
          .reverse()
          .map(({ ly, k }) => {
            const r = 18 + (k * 80) / Math.max(1, n - 1);
            return (
              <g key={k} role="button" tabIndex={0} aria-label={String(ly.label)} onClick={() => setPick(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPick(k)} className="cursor-pointer outline-none">
                <circle cx="100" cy="100" r={r} className={cn(toneFor(k), "stroke-foreground transition-colors")} strokeWidth="2" />
                <text x="100" y={100 - r + 12} textAnchor="middle" className="pointer-events-none fill-foreground text-[8px] font-semibold">{String(ly.label).slice(0, 28)}</text>
              </g>
            );
          })}
      </svg>
    );
  } else if (d.shape === "pyramid") {
    art = (
      <svg viewBox="0 0 200 160" className="mx-auto w-full max-w-[22rem]" role="group" aria-label="Pyramid model">
        {d.layers.map((ly, k) => {
          const h = 150 / n;
          const y = 5 + k * h;
          const w0 = (k / n) * 180;
          const w1 = ((k + 1) / n) * 180;
          return (
            <g key={k} role="button" tabIndex={0} aria-label={String(ly.label)} onClick={() => setPick(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPick(k)} className="cursor-pointer outline-none">
              <path d={`M${100 - w0 / 2} ${y} L${100 + w0 / 2} ${y} L${100 + w1 / 2} ${y + h} L${100 - w1 / 2} ${y + h} Z`} className={cn(toneFor(k), "stroke-foreground transition-colors")} strokeWidth="2" />
              <text x="100" y={y + h / 2 + 3} textAnchor="middle" className="pointer-events-none fill-foreground text-[8px] font-semibold">{String(ly.label).slice(0, 30)}</text>
            </g>
          );
        })}
      </svg>
    );
  } else if (d.shape === "iceberg") {
    art = (
      <svg viewBox="0 0 200 170" className="mx-auto w-full max-w-[22rem]" role="group" aria-label="Iceberg model">
        <rect x="0" y="40" width="200" height="130" className="fill-[var(--status-info-bg)]" />
        <line x1="0" x2="200" y1="40" y2="40" className="stroke-foreground" strokeWidth="1.5" strokeDasharray="4 3" />
        {d.layers.map((ly, k) => {
          const y0 = k === 0 ? 8 : 40 + ((k - 1) * 125) / Math.max(1, n - 1);
          const y1 = k === 0 ? 40 : 40 + (k * 125) / Math.max(1, n - 1);
          const w = (y: number) => (y <= 40 ? 30 + (y - 8) * 1.4 : 75 + (y - 40) * 0.5);
          return (
            <g key={k} role="button" tabIndex={0} aria-label={String(ly.label)} onClick={() => setPick(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPick(k)} className="cursor-pointer outline-none">
              <path d={`M${100 - w(y0)} ${y0} L${100 + w(y0)} ${y0} L${100 + w(y1)} ${y1} L${100 - w(y1)} ${y1} Z`} className={cn(pick === k ? "fill-[var(--primary)]" : "fill-card", "stroke-foreground transition-colors")} strokeWidth="2" />
              <text x="100" y={(y0 + y1) / 2 + 3} textAnchor="middle" className="pointer-events-none fill-foreground text-[8px] font-semibold">{String(ly.label).slice(0, 28)}</text>
            </g>
          );
        })}
      </svg>
    );
  } else {
    art = (
      <div className="flex flex-col gap-1.5">
        {d.layers.map((ly, k) => (
          <button key={k} type="button" onClick={() => setPick(k)} aria-pressed={pick === k} className={cn("min-h-11 rounded-md border-2 border-foreground px-3 py-2 text-left font-semibold transition-transform", pick === k ? "bg-primary text-primary-foreground" : "bg-card", !reduce && "hover:-translate-y-0.5")} style={{ marginInline: `${(k * 6) / Math.max(1, n)}%` }}>
            <Rich text={ly.label} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "Explore the model"}</p>
      <div className="mt-3">{art}</div>
      {/* The same layers as buttons, so it works without the picture (screen readers, small screens). */}
      {d.shape !== "stack" ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {d.layers.map((ly, k) => (
            <button key={k} type="button" onClick={() => setPick(k)} aria-pressed={pick === k} className={cn("min-h-10 rounded-md border-2 px-2.5 py-1 text-sm font-semibold", pick === k ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card")}>
              <Rich text={ly.label} />
            </button>
          ))}
        </div>
      ) : null}
      <div className="mt-3 min-h-[3.5rem] rounded-xl bg-muted p-3 text-[0.95rem] leading-relaxed" role="status" aria-live="polite">
        {sel ? (
          <p className="vibha-pop" key={pick}><span className="font-semibold"><Rich text={sel.label} />: </span><Rich text={sel.detail} /></p>
        ) : (
          <p className="text-muted-foreground">Tap a layer to see what it means.</p>
        )}
      </div>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}

/* -------------------------------------------------------------- brainmap */
const REGIONS: { id: string; name: string; shape: React.ReactNode; deep?: boolean }[] = [
  { id: "frontal", name: "Frontal lobe", shape: <path d="M60 30 C 30 45, 22 80, 40 105 L 95 100 L 105 32 C 90 24, 75 24, 60 30 Z" /> },
  { id: "prefrontal", name: "Prefrontal cortex", shape: <path d="M60 30 C 30 45, 22 80, 40 105 L 62 102 L 70 30 Z" /> },
  { id: "motor", name: "Motor cortex", shape: <path d="M105 32 L 95 100 L 104 99 L 114 33 Z" /> },
  { id: "sensory", name: "Somatosensory cortex", shape: <path d="M114 33 L 104 99 L 113 98 L 123 35 Z" /> },
  { id: "parietal", name: "Parietal lobe", shape: <path d="M123 35 C 150 38, 168 52, 172 72 L 140 92 L 113 98 Z" /> },
  { id: "occipital", name: "Occipital lobe", shape: <path d="M172 72 C 182 88, 180 106, 168 118 L 140 112 L 140 92 Z" /> },
  { id: "temporal", name: "Temporal lobe", shape: <path d="M40 105 L 95 100 L 140 92 L 140 112 C 118 132, 70 134, 48 120 Z" /> },
  { id: "broca", name: "Broca's area", shape: <circle cx="62" cy="96" r="7" /> },
  { id: "wernicke", name: "Wernicke's area", shape: <circle cx="132" cy="100" r="7" /> },
  { id: "cerebellum", name: "Cerebellum", shape: <path d="M140 118 C 150 116, 172 122, 170 136 C 160 148, 138 146, 132 134 Z" /> },
  { id: "brainstem", name: "Brainstem", shape: <path d="M112 112 L 126 112 L 124 160 L 114 160 Z" /> },
  { id: "corpus-callosum", name: "Corpus callosum", deep: true, shape: <path d="M70 62 C 95 50, 130 50, 150 64" fill="none" strokeWidth="6" /> },
  { id: "thalamus", name: "Thalamus", deep: true, shape: <ellipse cx="112" cy="74" rx="9" ry="6" /> },
  { id: "hypothalamus", name: "Hypothalamus", deep: true, shape: <circle cx="100" cy="86" r="5" /> },
  { id: "basal-ganglia", name: "Basal ganglia", deep: true, shape: <ellipse cx="94" cy="70" rx="9" ry="7" /> },
  { id: "amygdala", name: "Amygdala", deep: true, shape: <circle cx="96" cy="104" r="5" /> },
  { id: "hippocampus", name: "Hippocampus", deep: true, shape: <path d="M100 108 C 112 112, 124 108, 130 100" fill="none" strokeWidth="5" /> },
];

export function BrainMap({ d }: { d: BrainMapData }) {
  const focus = d.focus?.length ? d.focus : REGIONS.map((r) => r.id).filter((id) => d.notes?.[id]);
  const [pick, setPick] = React.useState<string | null>(focus[0] ?? null);
  const shown = REGIONS.filter((r) => !r.deep || focus.includes(r.id));
  const sel = REGIONS.find((r) => r.id === pick);
  return (
    <figure className={card}>
      <p className={label}>{d.title ? <Rich text={d.title} /> : "Find it in the brain"}</p>
      <svg viewBox="15 15 175 150" className="mx-auto mt-3 w-full max-w-[26rem] rounded-xl border-2 border-foreground bg-background" role="group" aria-label="Side view of the brain, front on the left">
        {shown.map((r) => {
          const on = pick === r.id;
          const isFocus = focus.includes(r.id);
          return (
            <g
              key={r.id}
              role="button"
              tabIndex={0}
              aria-label={r.name}
              aria-pressed={on}
              onClick={() => setPick(r.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPick(r.id)}
              className={cn("cursor-pointer outline-none transition-colors", r.deep ? "stroke-foreground" : "stroke-foreground", on ? "fill-[var(--primary)] stroke-[var(--primary)]" : isFocus ? "fill-[var(--status-info-bg)]" : "fill-card")}
              strokeWidth={r.deep ? 1.5 : 1.5}
              style={r.deep ? { strokeDasharray: on ? undefined : "3 2" } : undefined}
            >
              {r.shape}
            </g>
          );
        })}
        <text x="22" y="28" className="fill-muted-foreground text-[7px]">front</text>
      </svg>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {focus.map((id) => {
          const r = REGIONS.find((x) => x.id === id);
          return r ? (
            <button key={id} type="button" onClick={() => setPick(id)} aria-pressed={pick === id} className={cn("min-h-10 rounded-md border-2 px-2.5 py-1 text-sm font-semibold", pick === id ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card")}>
              {r.name}
            </button>
          ) : null;
        })}
      </div>
      <div className="mt-3 min-h-[3.5rem] rounded-xl bg-muted p-3 text-[0.95rem] leading-relaxed" role="status" aria-live="polite">
        {sel ? (
          <p className="vibha-pop" key={sel.id}><span className="font-semibold">{sel.name}{sel.deep ? " (deep inside)" : ""}: </span>{d.notes?.[sel.id] ? <Rich text={d.notes[sel.id]} /> : "Tap a highlighted area."}</p>
        ) : (
          <p className="text-muted-foreground">Tap a highlighted area.</p>
        )}
      </div>
      {d.caption ? <figcaption className="mt-2 text-sm text-muted-foreground"><Rich text={d.caption} /></figcaption> : null}
    </figure>
  );
}
