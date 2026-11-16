/**
 * Hand-drawn ink, the native port of the website's sketch kit
 * (src/components/sketch/ink.tsx). Same rough.js generator, same options and
 * the same seed per key, so a drawing wobbles exactly as it does on the web.
 * Output goes to react-native-svg instead of the DOM. Colours are the tokens
 * in `C`, resolved against the theme when a shape renders.
 */
import * as React from "react";
import { View } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import { RoughGenerator } from "roughjs/bin/generator";
import type { Options } from "roughjs/bin/core";

import { fonts, useTheme, type Palette } from "@/theme";
import { kalamWidth } from "./metrics";

/** The sketch palette. Tokens, turned into real colours by `useInkColor`. */
export const C = {
  ink: "@ink",
  soft: "@soft",
  paper: "@paper",
  blue: "@blue",
  lime: "@lime",
  red: "@red",
  wash: "@wash",
  /** Text on a lime highlight is always dark. */
  onLime: "#111111",
} as const;

function resolve(c: string | undefined, p: Palette): string | undefined {
  if (!c || c[0] !== "@") return c;
  return p.sk[c.slice(1) as keyof Palette["sk"]] ?? c;
}

const gen = new RoughGenerator();

export function seedOf(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
  return (Math.abs(h) % 2_000_000) + 1;
}

export type InkOpts = {
  stroke?: string;
  sw?: number;
  fill?: string;
  fillStyle?: Options["fillStyle"];
  gap?: number;
  angle?: number;
  fw?: number;
  rough?: number;
  bow?: number;
  /** One clean stroke instead of the doubled sketch stroke. */
  single?: boolean;
  dash?: string;
  opacity?: number;
};

function toOptions(key: string, o: InkOpts, p: Palette): Options {
  return {
    seed: seedOf(key),
    stroke: resolve(o.stroke ?? C.ink, p),
    strokeWidth: o.sw ?? 1.6,
    fill: resolve(o.fill, p),
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

export type Shape =
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

/** The SVG path data for one rough shape (also used by tests to compare with the web). */
export function inkPaths(k: string, shape: Shape, o: InkOpts, p: Palette) {
  return gen.toPaths(draw(shape, toOptions(k, o, p)));
}

/** One rough shape. `k` is the seed key: keep it stable. */
export function Ink({ k, shape, o = {} }: { k: string; shape: Shape; o?: InkOpts }) {
  const p = useTheme();
  const paths = React.useMemo(() => inkPaths(k, shape, o, p), [k, shape, o, p]);
  return (
    <G opacity={o.opacity}>
      {paths.map((path, i) => (
        <Path
          key={i}
          d={path.d}
          stroke={path.stroke}
          strokeWidth={path.strokeWidth}
          fill={path.fill ?? "none"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={path.fill && path.fill !== "none" ? undefined : o.dash}
        />
      ))}
    </G>
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
  const pt = (da: number): [number, number] => [x - size * Math.cos(a + da), y - size * Math.sin(a + da)];
  const [l, r] = [pt(0.45), pt(-0.45)];
  return <P k={k} d={`M${l[0]} ${l[1]} L${x} ${y} L${r[0]} ${r[1]}`} stroke={stroke} sw={sw} rough={0.5} single />;
}

/** A hand-drawn arrow from one point to another, gently bent by `bend`. */
export function Arrow({ k, from, to, bend = 0, stroke = C.ink, sw = 1.8, dash }: { k: string; from: [number, number]; to: [number, number]; bend?: number; stroke?: string; sw?: number; dash?: string }) {
  const mx = (from[0] + to[0]) / 2 - (to[1] - from[1]) * bend;
  const my = (from[1] + to[1]) / 2 + (to[0] - from[0]) * bend;
  const a = Math.atan2(to[1] - my, to[0] - mx);
  return (
    <G>
      <P k={`${k}-s`} d={`M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`} stroke={stroke} sw={sw} single rough={0.6} dash={dash} />
      <Head k={`${k}-h`} x={to[0]} y={to[1]} a={a} stroke={stroke} sw={sw} />
    </G>
  );
}

/* ----------------------------------------------------------------- labels */

export const LABEL = 15;

/** Width of a label in viewBox units. */
export function labelWidth(text: string, size = LABEL, bold = true): number {
  return kalamWidth(text, bold) * size;
}

/** A handwritten label. `lines` stacks text downwards from `y`. */
export function Label({ x, y, children, size = LABEL, anchor = "start", color = C.ink, bold = true, lines, mark = false }: { x: number; y: number; children?: string; size?: number; anchor?: "start" | "middle" | "end"; color?: string; bold?: boolean; lines?: string[]; mark?: boolean }) {
  const p = useTheme();
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
        <SvgText key={i} x={x} y={y + i * lead} fontSize={size} textAnchor={anchor} fontFamily={bold ? fonts.handBold : fonts.hand} fill={mark ? C.onLime : resolve(color, p)}>
          {r}
        </SvgText>
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
  const sx = to[0] > right ? right + 4 : to[0] < left ? left - 4 : (left + right) / 2;
  const sy = to[0] > right || to[0] < left ? mid : to[1] > y ? y + (rows.length - 1) * size * 1.15 + 5 : y - size * 0.95;
  return (
    <G>
      <P k={`${k}-lead`} d={`M${sx} ${sy} L${to[0]} ${to[1]}`} stroke={active ? C.blue : C.soft} sw={active ? 1.6 : 1.1} single rough={0.4} />
      <E k={`${k}-dot`} cx={to[0]} cy={to[1]} w={4} h={4} stroke={active ? C.blue : C.soft} fill={active ? C.blue : C.soft} fillStyle="solid" sw={1} />
      <Label x={x} y={y} lines={rows} anchor={anchor} size={size} color={active ? C.blue : C.ink} mark={active} />
    </G>
  );
}

/* ------------------------------------------------------------------ frame */

/**
 * The drawing surface: a fixed viewBox scaled to the width it is given.
 * `bare` drops the paper and the outline.
 */
export function SketchSheet({ name, w, h, label, children, top = 0, left = 0, bare = false }: { name: string; w: number; h: number; label: string; children: React.ReactNode; top?: number; left?: number; bare?: boolean }) {
  const p = useTheme();
  return (
    <View
      testID={`sketch-${name}`}
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={[{ width: "100%", aspectRatio: w / h }, bare ? null : { backgroundColor: p.sk.paper, borderRadius: 12, borderWidth: 1.5, borderColor: p.cardLine, overflow: "hidden" }]}
    >
      <Svg width="100%" height="100%" viewBox={`${left} ${top} ${w} ${h}`}>
        {children}
      </Svg>
    </View>
  );
}

/** Plain text for a label: drops the **bold** and *italic* marks of course text. */
export function plain(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(?!\s)(.+?)\*/g, "$1").replace(/`/g, "");
}

/** Breaks `text` into lines no wider than `max` viewBox units. */
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
