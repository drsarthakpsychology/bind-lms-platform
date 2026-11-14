"use client";

/**
 * Hand-drawn ink for the diagrams students see: the medicine pictures and the
 * Study widgets (also shown in Exam Prep explanations and long answers). Shapes come from rough.js's generator, which only
 * computes SVG path data, so the drawing is the same on the server and in the
 * browser: every shape gets a fixed seed from its key, so it wobbles the same
 * way on every render. Colours are CSS variables (`.sketch` in globals.css),
 * so one drawing reads in light and dark mode. Labels use the Kalam
 * handwriting font, loaded here and used nowhere else.
 */
import * as React from "react";
import { Kalam } from "next/font/google";
import { RoughGenerator } from "roughjs/bin/generator";
import type { Options } from "roughjs/bin/core";
import { cn } from "@/lib/utils";
import { kalamWidth } from "./metrics";

const kalam = Kalam({ weight: ["400", "700"], subsets: ["latin"], display: "swap" });

/** The handwriting font, for labels that sit inside a drawing built from HTML (see frame.tsx). */
export const HAND = kalam.style.fontFamily;

/** The sketch palette: brand ink, blue and lime, plus red for blood and a soft grey. */
export const C = {
  ink: "var(--sk-ink)",
  soft: "var(--sk-soft)",
  paper: "var(--sk-paper)",
  blue: "var(--sk-blue)",
  lime: "var(--sk-lime)",
  red: "var(--sk-red)",
  wash: "var(--sk-wash)",
} as const;

const gen = new RoughGenerator();

function seedOf(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return (Math.abs(h) % 2_000_000) + 1;
}

/** Ink options: rough.js options with short names for the common ones. */
export type InkOpts = {
  stroke?: string;
  sw?: number;
  fill?: string;
  /** hachure (default), solid, cross-hatch, zigzag, dots */
  fillStyle?: Options["fillStyle"];
  gap?: number;
  angle?: number;
  fw?: number;
  rough?: number;
  bow?: number;
  /** One clean stroke instead of the doubled sketch stroke. */
  single?: boolean;
  dash?: string;
  className?: string;
  style?: React.CSSProperties;
};

function toOptions(key: string, o: InkOpts): Options {
  return {
    seed: seedOf(key),
    stroke: o.stroke ?? C.ink,
    strokeWidth: o.sw ?? 1.6,
    fill: o.fill,
    fillStyle: o.fillStyle ?? "hachure",
    hachureGap: o.gap ?? 4,
    hachureAngle: o.angle ?? -41,
    fillWeight: o.fw ?? 1.4,
    roughness: o.rough ?? 0.9,
    bowing: o.bow ?? 0.8,
    disableMultiStroke: o.single ?? false,
    disableMultiStrokeFill: true,
    preserveVertices: true,
  };
}

type Shape =
  | { t: "path"; d: string }
  | { t: "ellipse"; cx: number; cy: number; w: number; h: number }
  | { t: "rect"; x: number; y: number; w: number; h: number }
  | { t: "line"; x1: number; y1: number; x2: number; y2: number }
  | { t: "curve"; pts: [number, number][] }
  | { t: "poly"; pts: [number, number][] };

function draw(shape: Shape, o: Options) {
  switch (shape.t) {
    case "path":
      return gen.path(shape.d, o);
    case "ellipse":
      return gen.ellipse(shape.cx, shape.cy, shape.w, shape.h, o);
    case "rect":
      return gen.rectangle(shape.x, shape.y, shape.w, shape.h, o);
    case "line":
      return gen.line(shape.x1, shape.y1, shape.x2, shape.y2, o);
    case "curve":
      return gen.curve(shape.pts, o);
    case "poly":
      return gen.polygon(shape.pts, o);
  }
}

/** One rough shape as SVG paths. `k` is the seed key: keep it stable. */
export function Ink({ k, shape, o = {} }: { k: string; shape: Shape; o?: InkOpts }) {
  const paths = gen.toPaths(draw(shape, toOptions(k, o)));
  return (
    <g className={o.className} style={o.style} aria-hidden>
      {paths.map((p, i) => (
        <path key={i} d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill ?? "none"} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={p.fill && p.fill !== "none" ? undefined : o.dash} />
      ))}
    </g>
  );
}

export const P = ({ k, d, ...o }: { k: string; d: string } & InkOpts) => <Ink k={k} shape={{ t: "path", d }} o={o} />;
export const E = ({ k, cx, cy, w, h, ...o }: { k: string; cx: number; cy: number; w: number; h: number } & InkOpts) => <Ink k={k} shape={{ t: "ellipse", cx, cy, w, h }} o={o} />;
export const R = ({ k, x, y, w, h, ...o }: { k: string; x: number; y: number; w: number; h: number } & InkOpts) => <Ink k={k} shape={{ t: "rect", x, y, w, h }} o={o} />;
export const L = ({ k, x1, y1, x2, y2, ...o }: { k: string; x1: number; y1: number; x2: number; y2: number } & InkOpts) => <Ink k={k} shape={{ t: "line", x1, y1, x2, y2 }} o={o} />;
export const Cv = ({ k, pts, ...o }: { k: string; pts: [number, number][] } & InkOpts) => <Ink k={k} shape={{ t: "curve", pts }} o={o} />;
export const Pg = ({ k, pts, ...o }: { k: string; pts: [number, number][] } & InkOpts) => <Ink k={k} shape={{ t: "poly", pts }} o={o} />;

/** A small hand-drawn arrow head at (x, y) pointing along angle `a` (radians). */
export function Head({ k, x, y, a, size = 8, stroke = C.ink, sw = 1.8 }: { k: string; x: number; y: number; a: number; size?: number; stroke?: string; sw?: number }) {
  const p = (da: number) => [x - size * Math.cos(a + da), y - size * Math.sin(a + da)];
  const [l, r] = [p(0.45), p(-0.45)];
  return <P k={k} d={`M${l[0]} ${l[1]} L${x} ${y} L${r[0]} ${r[1]}`} stroke={stroke} sw={sw} rough={0.5} single />;
}

/** A hand-drawn arrow from one point to another, gently bent by `bend`. */
export function Arrow({ k, from, to, bend = 0, stroke = C.ink, sw = 1.8, dash }: { k: string; from: [number, number]; to: [number, number]; bend?: number; stroke?: string; sw?: number; dash?: string }) {
  const mx = (from[0] + to[0]) / 2 - (to[1] - from[1]) * bend;
  const my = (from[1] + to[1]) / 2 + (to[0] - from[0]) * bend;
  const a = Math.atan2(to[1] - my, to[0] - mx);
  return (
    <g aria-hidden>
      <P k={`${k}-s`} d={`M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`} stroke={stroke} sw={sw} single rough={0.6} dash={dash} />
      <Head k={`${k}-h`} x={to[0]} y={to[1]} a={a} stroke={stroke} sw={sw} />
    </g>
  );
}

/* ----------------------------------------------------------------- labels */

export const LABEL = 15;

/** Width of a label in viewBox units. */
export function labelWidth(text: string, size = LABEL, bold = true): number {
  return kalamWidth(text, bold) * size;
}

/**
 * A handwritten label. Every label is a `<text data-label>` with its size and
 * anchor as attributes, so the overlap tests can measure it. `lines` stacks
 * text downwards from `y`.
 */
export function Label({ x, y, children, size = LABEL, anchor = "start", color = C.ink, bold = true, lines, mark = false }: { x: number; y: number; children?: string; size?: number; anchor?: "start" | "middle" | "end"; color?: string; bold?: boolean; lines?: string[]; mark?: boolean }) {
  const rows = lines ?? [children ?? ""];
  const lead = Math.round(size * 1.15);
  return (
    <>
      {mark
        ? rows.map((r, i) => {
            const w = labelWidth(r, size, bold);
            const left = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
            return <Ink key={`m${i}`} k={`mark-${r}`} shape={{ t: "rect", x: left - 3, y: y + i * lead - size * 0.78, w: w + 6, h: size * 1.02 }} o={{ stroke: "none", fill: C.lime, fillStyle: "solid", rough: 1.4 }} />;
          })
        : null}
      {rows.map((r, i) => (
        <text key={i} data-label="" x={x} y={y + i * lead} fontSize={size} textAnchor={anchor} fontWeight={bold ? 700 : 400} fill={mark ? "var(--sk-on-lime)" : color}>
          {r}
        </text>
      ))}
    </>
  );
}

/** A label with a thin leader line to the thing it names. */
export function Callout({ k, x, y, to, children, lines, anchor = "start", size = LABEL, active = false }: { k: string; x: number; y: number; to: [number, number]; children?: string; lines?: string[]; anchor?: "start" | "middle" | "end"; size?: number; active?: boolean }) {
  const rows = lines ?? [children ?? ""];
  const w = Math.max(...rows.map((r) => labelWidth(r, size)));
  const left = anchor === "start" ? x : anchor === "end" ? x - w : x - w / 2;
  const right = left + w;
  const mid = y - size * 0.3 + ((rows.length - 1) * size * 1.15) / 2;
  // The leader starts at the side of the label facing the target.
  const sx = to[0] > right ? right + 4 : to[0] < left ? left - 4 : (left + right) / 2;
  const sy = to[0] > right || to[0] < left ? mid : to[1] > y ? y + (rows.length - 1) * size * 1.15 + 5 : y - size * 0.95;
  return (
    <g>
      <P k={`${k}-lead`} d={`M${sx} ${sy} L${to[0]} ${to[1]}`} stroke={active ? C.blue : C.soft} sw={active ? 1.6 : 1.1} single rough={0.4} />
      <E k={`${k}-dot`} cx={to[0]} cy={to[1]} w={4} h={4} stroke={active ? C.blue : C.soft} fill={active ? C.blue : C.soft} fillStyle="solid" sw={1} />
      <Label x={x} y={y} lines={rows} anchor={anchor} size={size} color={active ? C.blue : C.ink} mark={active} />
    </g>
  );
}

/* ------------------------------------------------------------------ frame */

/** The drawing surface: a fixed viewBox, the handwriting font, and a name for the tests. `bare` drops the paper and border, for a drawing inside a frame of its own (the flat views of the 3D scenes). */
export function Sheet({ name, w, h, label, children, className, top = 0, left = 0, bare = false }: { name: string; w: number; h: number; label: string; children: React.ReactNode; className?: string; top?: number; left?: number; bare?: boolean }) {
  return (
    <svg data-sketch={name} viewBox={`${left} ${top} ${w} ${h}`} role="img" aria-label={label} className={cn(bare ? "sketch block" : "sketch block h-auto w-full rounded-xl border-2 border-foreground bg-[var(--sk-paper)]", className)} style={{ fontFamily: kalam.style.fontFamily }}>
      {children}
    </svg>
  );
}

/** Plain text for a label: drops the **bold** and *italic* marks of course text. */
export function plain(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(?!\s)(.+?)\*/g, "$1").replace(/`/g, "");
}

/** Breaks `text` into lines no wider than `max` viewBox units (a word longer than `max` gets a line of its own). */
export function wrap(text: string, max: number, size = LABEL, bold = true): string[] {
  const out: string[] = [];
  let line = "";
  for (const word of plain(text).split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && labelWidth(next, size, bold) > max) {
      out.push(line);
      line = word;
    } else line = next;
  }
  if (line) out.push(line);
  return out.length ? out : [""];
}

/** The biggest of `sizes` at which `text` wraps into at most `maxLines` lines no wider than `max`; null when none fits. */
export function fit(text: string, max: number, maxLines = 2, sizes = [15, 13]): { lines: string[]; size: number } | null {
  for (const size of sizes) {
    const lines = wrap(text, max, size);
    if (lines.length <= maxLines && lines.every((l) => labelWidth(l, size) <= max)) return { lines, size };
  }
  return null;
}

/** A picture card: title, drawing, choices, and the plain explanation under it. */
export function Figure({ title, children, wide = false }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <figure className={cn("min-w-0 space-y-3 rounded-2xl border-2 border-foreground bg-card p-3 shadow-[var(--shadow-hard-sm)] sm:p-5", wide && "lg:col-span-2")}>
      <figcaption className="text-xs font-semibold uppercase tracking-wide text-link">{title}</figcaption>
      {children}
    </figure>
  );
}

/** Choices that change the drawing (agonist or antagonist, a pathway, before or after the medicine). */
export function Choice<T extends string>({ label, options, value, onChange }: { label: string; options: { id: T; name: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn("min-h-10 rounded-md border-2 px-3 text-sm font-semibold transition-colors", value === o.id ? "border-foreground bg-primary text-primary-foreground" : "border-foreground/30 bg-card hover:border-foreground")}
        >
          {o.name}
        </button>
      ))}
    </div>
  );
}

/** The explanation under a drawing: facts only. */
export function Say({ children, live = false }: { children: React.ReactNode; live?: boolean }) {
  return (
    <div className="space-y-1.5 rounded-xl bg-muted p-3 text-[0.95rem] leading-relaxed" {...(live ? { role: "status", "aria-live": "polite" as const } : {})}>
      {children}
    </div>
  );
}

/** Plain fact text under a picture (the medicine-specific caption). */
export function Fact({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>;
}
