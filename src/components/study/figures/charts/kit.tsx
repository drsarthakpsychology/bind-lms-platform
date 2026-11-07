import type { ReactNode } from "react";

/**
 * Small drawing kit for the charts library. Everything uses the design tokens
 * (tinted fills at low opacity, ink strokes) so a figure reads in light and
 * dark themes. Text in the art is scaffolding (axes, numbers, ages); the names
 * a student should learn go in the figure's labels so quiz mode can hide them.
 */
export type Tone = "a" | "b" | "c" | "d" | "n" | "e";

/** a: blue wash, b: lime wash, c: red wash, d: grey, n: card, e: stronger blue wash. */
export const FILL: Record<Tone, string> = {
  a: "fill-brand/20",
  b: "fill-primary/40",
  c: "fill-destructive/20",
  d: "fill-muted",
  n: "fill-card",
  e: "fill-brand/35",
};

/** Line colours: ink, accent (blue in light, lime in dark), red, grey. */
export const LINE = { ink: "stroke-foreground", acc: "stroke-chart-1", red: "stroke-chart-5", grey: "stroke-chart-4" } as const;
export type LineTone = keyof typeof LINE;

const DOT = { ink: "fill-foreground", acc: "fill-chart-1", red: "fill-chart-5", grey: "fill-chart-4" } as const;

/** Scaffolding text; never smaller than 8 units so it stays legible on a phone. */
export function T({ x, y, children, size = 10, anchor = "middle", muted, bold, italic }: { x: number; y: number; children: ReactNode; size?: number; anchor?: "start" | "middle" | "end"; muted?: boolean; bold?: boolean; italic?: boolean }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={Math.max(size, 8)} fontWeight={bold ? 700 : undefined} fontStyle={italic ? "italic" : undefined} className={muted ? "fill-muted-foreground" : "fill-foreground"}>
      {children}
    </text>
  );
}

/** A rounded box with an optional line or two of centred scaffolding text. */
export function Box({ x, y, w, h, tone = "n", r = 6, text, size = 10, dash, thin }: { x: number; y: number; w: number; h: number; tone?: Tone; r?: number; text?: string | string[]; size?: number; dash?: boolean; thin?: boolean }) {
  const lines = text === undefined ? [] : Array.isArray(text) ? text : [text];
  const lh = size * 1.2;
  const top = y + h / 2 - ((lines.length - 1) * lh) / 2 + size * 0.35;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} className={`${FILL[tone]} stroke-foreground`} strokeWidth={thin ? 1 : 1.5} strokeDasharray={dash ? "4 3" : undefined} />
      {lines.map((l, i) => (
        <T key={i} x={x + w / 2} y={top + i * lh} size={size}>
          {l}
        </T>
      ))}
    </g>
  );
}

function head(x: number, y: number, ang: number, s: number) {
  const a1 = ang + Math.PI * 0.85;
  const a2 = ang - Math.PI * 0.85;
  return `M${x},${y} L${(x + s * Math.cos(a1)).toFixed(1)},${(y + s * Math.sin(a1)).toFixed(1)} L${(x + s * Math.cos(a2)).toFixed(1)},${(y + s * Math.sin(a2)).toFixed(1)} Z`;
}

/** A straight arrow, or a curved one through a control point (quadratic). */
export function Arrow({ x1, y1, x2, y2, cx, cy, tone = "ink", dash, w = 1.5, both, size = 7 }: { x1: number; y1: number; x2: number; y2: number; cx?: number; cy?: number; tone?: LineTone; dash?: boolean; w?: number; both?: boolean; size?: number }) {
  const curved = cx !== undefined && cy !== undefined;
  const d = curved ? `M${x1},${y1} Q${cx},${cy} ${x2},${y2}` : `M${x1},${y1} L${x2},${y2}`;
  const end = curved ? Math.atan2(y2 - cy!, x2 - cx!) : Math.atan2(y2 - y1, x2 - x1);
  const start = curved ? Math.atan2(y1 - cy!, x1 - cx!) : Math.atan2(y1 - y2, x1 - x2);
  return (
    <g>
      <path d={d} fill="none" className={LINE[tone]} strokeWidth={w} strokeDasharray={dash ? "4 3" : undefined} />
      <path d={head(x2, y2, end, size)} className={`${DOT[tone]} ${LINE[tone]}`} strokeWidth={1} />
      {both ? <path d={head(x1, y1, start, size)} className={`${DOT[tone]} ${LINE[tone]}`} strokeWidth={1} /> : null}
    </g>
  );
}

export function Line({ x1, y1, x2, y2, tone = "ink", dash, w = 1.5 }: { x1: number; y1: number; x2: number; y2: number; tone?: LineTone; dash?: boolean; w?: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={LINE[tone]} strokeWidth={w} strokeDasharray={dash ? "4 3" : undefined} />;
}

export function P({ d, tone = "ink", w = 2, dash, fill }: { d: string; tone?: LineTone; w?: number; dash?: boolean; fill?: Tone }) {
  return <path d={d} className={`${fill ? FILL[fill] : "fill-none"} ${LINE[tone]}`} strokeWidth={w} strokeDasharray={dash ? "4 3" : undefined} strokeLinejoin="round" strokeLinecap="round" />;
}

export function Dot({ x, y, r = 3, tone = "ink" }: { x: number; y: number; r?: number; tone?: LineTone }) {
  return <circle cx={x} cy={y} r={r} className={DOT[tone]} />;
}

/** Axes with arrowheads and optional titles. (x, y) is the origin; the y axis runs up by h. */
export function Axes({ x, y, w, h, xl, yl }: { x: number; y: number; w: number; h: number; xl?: string; yl?: string }) {
  return (
    <g>
      <Arrow x1={x} y1={y} x2={x + w} y2={y} size={6} />
      <Arrow x1={x} y1={y} x2={x} y2={y - h} size={6} />
      {xl ? <T x={x + w / 2} y={y + 24} size={10} muted>{xl}</T> : null}
      {yl ? (
        <text x={x - 14} y={y - h / 2} textAnchor="middle" fontSize={10} className="fill-muted-foreground" transform={`rotate(-90 ${x - 14} ${y - h / 2})`}>
          {yl}
        </text>
      ) : null}
    </g>
  );
}

/** Sample a function into an SVG path, from x0 to x1 in data units, mapped by sx and sy. */
export function plot(fn: (t: number) => number, t0: number, t1: number, sx: (t: number) => number, sy: (v: number) => number, n = 80): string {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n;
    d += `${i ? "L" : "M"}${sx(t).toFixed(1)},${sy(fn(t)).toFixed(1)}`;
  }
  return d;
}

export const gauss = (mu: number, sd: number) => (t: number) => Math.exp(-0.5 * ((t - mu) / sd) ** 2);

/** A wavy EEG-like trace: sum of sines plus a little deterministic jitter. */
export function wave(x0: number, x1: number, y: number, amp: number, cycles: number, opts: { jitter?: number; seed?: number; step?: number } = {}): string {
  const { jitter = 0.15, seed = 1, step = 1.2 } = opts;
  let d = "";
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280 - 0.5;
  };
  const len = x1 - x0;
  for (let x = 0; x <= len; x += step) {
    const ph = (x / len) * cycles * 2 * Math.PI;
    const v = Math.sin(ph) + jitter * rnd() * 2 + 0.25 * Math.sin(ph * 2.3 + 1);
    d += `${x ? "L" : "M"}${(x0 + x).toFixed(1)},${(y - amp * v).toFixed(1)}`;
  }
  return d;
}

/** Segment of a ring (for wheels), angles in degrees clockwise from 12 o'clock. */
export function arc(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const p = (r: number, a: number) => {
    const t = ((a - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`;
  };
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M${p(r1, a0)} A${r1},${r1} 0 ${large} 1 ${p(r1, a1)} L${p(r0, a1)} A${r0},${r0} 0 ${large} 0 ${p(r0, a0)} Z`;
}

/** Point on a circle, degrees clockwise from 12 o'clock. */
export function polar(cx: number, cy: number, r: number, a: number): [number, number] {
  const t = ((a - 90) * Math.PI) / 180;
  return [Math.round(cx + r * Math.cos(t)), Math.round(cy + r * Math.sin(t))];
}

export type Label = { id: string; name: string; x: number; y: number; about: string };
export const L = (id: string, name: string, x: number, y: number, about: string): Label => ({ id, name, x, y, about });

/** A callout: a thin leader from a part of the art to a label in a side lane. */
export type Callout = { id: string; name: string; about: string; at: [number, number] };

/** Labels stacked in a lane at x = lx from y0 every dy, each joined to its part by a leader line. */
export function callouts(list: Callout[], lx: number, y0: number, dy: number): { art: ReactNode; labels: Label[] } {
  const labels = list.map((c, i) => L(c.id, c.name, lx, y0 + i * dy, c.about));
  const art = (
    <g>
      {list.map((c, i) => (
        <g key={c.id}>
          <line x1={c.at[0]} y1={c.at[1]} x2={lx - 9} y2={y0 + i * dy} className="stroke-muted-foreground" strokeWidth={0.8} />
          <circle cx={c.at[0]} cy={c.at[1]} r={2.2} className="fill-foreground" />
        </g>
      ))}
    </g>
  );
  return { art, labels };
}

/** The red diamond used for a drug molecule in every pharmacology figure. */
export function Drug({ x, y, s = 7 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x},${y - s} L${x + s},${y} L${x},${y + s} L${x - s},${y} Z`} className="fill-chart-5 stroke-foreground" strokeWidth={1} />;
}
