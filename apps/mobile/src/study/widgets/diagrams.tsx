import * as React from "react";
import { View } from "react-native";
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";
import { Circle, G, SvgXml } from "react-native-svg";

import type { CurveData, FigureData, FlowData, LayersData, SynapseData } from "@/api/contract";
import { useFigure } from "@/api/queries";
import { Button } from "@/ds/button";
import { Row, RowList, Skeleton } from "@/ds/parts";
import { Slider } from "@/ds/slider";
import { T } from "@/ds/text";
import { haptic } from "@/lib/haptics";
import { Arrow, C, Cv, E, L, Label, P, R, SketchSheet, fit, plain, wrap } from "@/sketch/ink";
import { useTheme } from "@/theme";
import { Rich } from "../rich";
import { WidgetFrame } from "./frame";

/**
 * The hand-drawn study diagrams, drawn natively with the sketch kit
 * (src/sketch/ink.tsx: the website's rough.js generator, options and seeds),
 * so a diagram wobbles exactly as it does on the website.
 */

const W = 320;

/* --------------------------------------------------------------- moodline */

export function Moodline({ series, labels }: { series: number[]; labels?: string[] }) {
  const h = 150;
  const max = Math.max(...series, 1);
  const min = Math.min(...series, 0);
  const x = (i: number) => 28 + (i * (W - 48)) / Math.max(1, series.length - 1);
  const y = (v: number) => 20 + ((max - v) / Math.max(1, max - min)) * (h - 50);
  const pts = series.map((v, i) => [x(i), y(v)] as [number, number]);
  return (
    <SketchSheet name="moodline" w={W} h={h} label={`A mood chart over ${series.length} points`}>
      <L k="ml-axis" x1={20} y1={h - 26} x2={W - 12} y2={h - 26} stroke={C.soft} sw={1.2} />
      <L k="ml-y" x1={20} y1={14} x2={20} y2={h - 26} stroke={C.soft} sw={1.2} />
      <Cv k="ml-line" pts={pts} stroke={C.blue} sw={2.2} />
      {pts.map(([px, py], i) => (
        <E key={i} k={`ml-p${i}`} cx={px} cy={py} w={6} h={6} fill={C.blue} fillStyle="solid" stroke={C.blue} sw={1} />
      ))}
      {(labels ?? []).map((l, i) => (i < series.length ? <Label key={l + i} x={x(i)} y={h - 8} size={11} anchor="middle" bold={false} color={C.soft}>{l}</Label> : null))}
    </SketchSheet>
  );
}

/* ------------------------------------------------------------------- flow */

type Placed = { id: string; label: string; detail?: string; x: number; y: number; w: number; h: number; lines: string[]; size: number };

function box(label: string, maxW: number): { lines: string[]; size: number; w: number; h: number } {
  const f = fit(label, maxW - 20, 3, [15, 13]) ?? { lines: wrap(label, maxW - 20, 13), size: 13 };
  return { ...f, w: maxW, h: 20 + f.lines.length * Math.round(f.size * 1.15) };
}

export function layoutFlow(d: FlowData): { nodes: Placed[]; h: number; edges: [string, string][] } {
  if (d.layout === "cycle") {
    const n = d.nodes.length;
    const cx = W / 2;
    const r = 96;
    const cy = r + 50;
    const nodes = d.nodes.map((nd, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const b = box(plain(nd.label), 112);
      return { id: nd.id, label: nd.label, detail: nd.detail, x: cx + r * Math.cos(a) - b.w / 2, y: cy + r * Math.sin(a) - b.h / 2, ...b };
    });
    return { nodes, h: cy + r + 56, edges: d.nodes.map((nd, i) => [nd.id, d.nodes[(i + 1) % n]!.id]) };
  }
  if (d.layout === "tree") {
    const depth = new Map<string, number>();
    const of = (id: string): number => {
      if (depth.has(id)) return depth.get(id)!;
      const nd = d.nodes.find((x) => x.id === id);
      const v = nd?.parent ? of(nd.parent) + 1 : 0;
      depth.set(id, v);
      return v;
    };
    d.nodes.forEach((n) => of(n.id));
    const levels: string[][] = [];
    d.nodes.forEach((n) => (levels[depth.get(n.id)!] ??= []).push(n.id));
    const nodes: Placed[] = [];
    let y = 12;
    levels.forEach((ids) => {
      const each = (W - 16) / ids.length;
      const placed = ids.map((id, i) => {
        const nd = d.nodes.find((x) => x.id === id)!;
        const b = box(plain(nd.label), Math.min(150, each - 8));
        return { id, label: nd.label, detail: nd.detail, x: 8 + each * i + (each - b.w) / 2, y, ...b };
      });
      nodes.push(...placed);
      y += Math.max(...placed.map((p) => p.h)) + 40;
    });
    return { nodes, h: y - 24, edges: d.nodes.filter((n) => n.parent).map((n) => [n.parent!, n.id]) };
  }
  // chain: one column, top to bottom (a phone is narrow).
  let y = 12;
  const nodes = d.nodes.map((nd) => {
    const b = box(plain(nd.label), 240);
    const p = { id: nd.id, label: nd.label, detail: nd.detail, x: (W - b.w) / 2, y, ...b };
    y += b.h + 34;
    return p;
  });
  return { nodes, h: y - 20, edges: d.nodes.slice(1).map((nd, i) => [d.nodes[i]!.id, nd.id]) };
}

export function FlowWidget({ d }: { d: FlowData }) {
  const { nodes, h, edges } = React.useMemo(() => layoutFlow(d), [d]);
  const [on, setOn] = React.useState<string | null>(null);
  const at = (id: string) => nodes.find((n) => n.id === id)!;
  const current = on ? at(on) : null;
  return (
    <WidgetFrame label="Diagram" title={d.title} caption={d.caption} testID="w-flow">
      <SketchSheet name="flow" w={W} h={h} label={`${d.title ? plain(d.title) + ". " : ""}${nodes.map((n) => plain(n.label)).join(", then ")}`}>
        {edges.map(([a, b], i) => {
          const A = at(a);
          const B = at(b);
          if (!A || !B) return null;
          const from: [number, number] = d.layout === "chain" || d.layout === "tree" ? [A.x + A.w / 2, A.y + A.h + 2] : [A.x + A.w / 2, A.y + A.h / 2];
          const to: [number, number] = d.layout === "chain" || d.layout === "tree" ? [B.x + B.w / 2, B.y - 4] : [B.x + B.w / 2, B.y + B.h / 2];
          if (d.layout === "cycle") {
            // Shorten the arrow so it starts and ends at the box edges.
            const dx = to[0] - from[0];
            const dy = to[1] - from[1];
            const len = Math.hypot(dx, dy) || 1;
            const cut = 40 / len;
            return <Arrow key={i} k={`fl-e${a}-${b}`} from={[from[0] + dx * cut, from[1] + dy * cut]} to={[to[0] - dx * cut, to[1] - dy * cut]} bend={0.18} stroke={C.soft} />;
          }
          return <Arrow key={i} k={`fl-e${a}-${b}`} from={from} to={to} stroke={C.soft} />;
        })}
        {nodes.map((n) => {
          const active = n.id === on;
          return (
            <G
              key={n.id}
              onPress={() => {
                haptic.select();
                setOn(active ? null : n.id);
              }}
            >
              <R k={`fl-${n.id}`} x={n.x} y={n.y} w={n.w} h={n.h} fill={active ? C.lime : C.paper} fillStyle="solid" sw={1.8} />
              <Label x={n.x + n.w / 2} y={n.y + 14 + n.size * 0.6} lines={n.lines} size={n.size} anchor="middle" color={active ? C.onLime : C.ink} />
            </G>
          );
        })}
      </SketchSheet>
      {current?.detail ? <Rich text={current.detail} v="reading" /> : nodes.some((n) => n.detail) ? <T v="small" tone="muted">Tap a box to read about it.</T> : null}
    </WidgetFrame>
  );
}

/* ----------------------------------------------------------------- layers */

export function LayersWidget({ d }: { d: LayersData }) {
  const [on, setOn] = React.useState<number | null>(null);
  const n = d.layers.length;
  const h = d.shape === "rings" ? 260 : 40 + n * 52;
  const shapes = d.layers.map((l, i) => {
    const label = plain(l.label);
    if (d.shape === "pyramid") {
      // Index 0 is the top (narrowest).
      const top = 20 + i * 52;
      const wTop = 40 + i * ((W - 80) / n);
      const wBot = 40 + (i + 1) * ((W - 80) / n);
      return { label, path: `M${W / 2 - wTop / 2} ${top} L${W / 2 + wTop / 2} ${top} L${W / 2 + wBot / 2} ${top + 48} L${W / 2 - wBot / 2} ${top + 48} Z`, tx: W / 2, ty: top + 30 };
    }
    if (d.shape === "rings") {
      const r = 120 - i * (100 / n);
      return { label, ellipse: { cx: W / 2, cy: 130, w: r * 2.4, h: r * 2 }, tx: W / 2, ty: 130 - r + 24 };
    }
    if (d.shape === "iceberg") {
      const top = 20 + i * 52;
      return { label, path: `M${60 + i * 6} ${top} L${W - 60 - i * 6} ${top} L${W - 50 - i * 10} ${top + 48} L${50 + i * 10} ${top + 48} Z`, tx: W / 2, ty: top + 30 };
    }
    const top = 20 + i * 52;
    return { label, path: `M24 ${top} L${W - 24} ${top} L${W - 24} ${top + 46} L24 ${top + 46} Z`, tx: W / 2, ty: top + 29 };
  });
  return (
    <WidgetFrame label="Diagram" title={d.title} caption={d.caption} testID="w-layers">
      <SketchSheet name="layers" w={W} h={h} label={`${d.title ? plain(d.title) + ": " : ""}${shapes.map((s) => s.label).join(", ")}`}>
        {d.shape === "iceberg" ? <P k="ice-water" d={`M8 ${20 + 52 - 4} Q 80 ${20 + 52 - 12} 160 ${20 + 52 - 4} T ${W - 8} ${20 + 52 - 4}`} stroke={C.blue} sw={1.6} single /> : null}
        {shapes.map((s, i) => {
          const active = on === i;
          const fill = active ? C.lime : d.shape === "iceberg" && i > 0 ? C.wash : C.paper;
          return (
            <G
              key={i}
              onPress={() => {
                haptic.select();
                setOn(active ? null : i);
              }}
            >
              {"ellipse" in s && s.ellipse ? <E k={`ly-${i}`} cx={s.ellipse.cx} cy={s.ellipse.cy} w={s.ellipse.w} h={s.ellipse.h} fill={fill} fillStyle="solid" sw={1.8} /> : <P k={`ly-${i}`} d={(s as { path: string }).path} fill={fill} fillStyle="solid" sw={1.8} />}
              <Label x={s.tx} y={s.ty} size={14} anchor="middle" color={active ? C.onLime : C.ink}>
                {s.label}
              </Label>
            </G>
          );
        })}
      </SketchSheet>
      {on !== null ? <Rich text={d.layers[on]!.detail} v="reading" /> : <T v="small" tone="muted">Tap a layer to read about it.</T>}
    </WidgetFrame>
  );
}

/* ------------------------------------------------------------------ curve */

const gauss = (x: number, m: number, s: number) => Math.exp(-((x - m) ** 2) / (2 * s * s));

export function curvePoints(kind: CurveData["kind"]): { a: [number, number][]; b?: [number, number][]; xLabel: string; yLabel: string } {
  const N = 40;
  const xs = Array.from({ length: N + 1 }, (_, i) => i / N);
  switch (kind) {
    case "normal":
      return { a: xs.map((x) => [x, gauss(x, 0.5, 0.15)]), xLabel: "score", yLabel: "how many people" };
    case "sdt":
      return { a: xs.map((x) => [x, gauss(x, 0.38, 0.12)]), b: xs.map((x) => [x, gauss(x, 0.62, 0.12)]), xLabel: "signal strength", yLabel: "how often" };
    case "forgetting":
      return { a: xs.map((x) => [x, Math.exp(-x * 4) * 0.85 + 0.1]), xLabel: "days since learning", yLabel: "remembered" };
    case "inverted-u":
      return { a: xs.map((x) => [x, gauss(x, 0.5, 0.22)]), xLabel: "arousal", yLabel: "performance" };
    case "dose-response":
      return { a: xs.map((x) => [x, 1 / (1 + Math.exp(-(x - 0.5) * 12))]), xLabel: "dose", yLabel: "effect" };
    case "half-life":
      return { a: xs.map((x) => [x, Math.pow(0.5, x * 4)]), xLabel: "half-lives", yLabel: "left in the body" };
  }
}

export function CurveWidget({ d }: { d: CurveData }) {
  const h = 200;
  const pad = { l: 34, r: 12, t: 16, b: 34 };
  const { a, b, xLabel, yLabel } = React.useMemo(() => curvePoints(d.kind), [d.kind]);
  const [m, setM] = React.useState(50);
  const sx = (x: number) => pad.l + x * (W - pad.l - pad.r);
  const sy = (y: number) => pad.t + (1 - y) * (h - pad.t - pad.b);
  const mx = m / 100;
  const at = (pts: [number, number][]) => pts.reduce((best, p) => (Math.abs(p[0] - mx) < Math.abs(best[0] - mx) ? p : best), pts[0]!);
  const here = at(a);
  const reading =
    d.kind === "half-life" ? `After ${(mx * 4).toFixed(1)} half-lives, ${Math.round(Math.pow(0.5, mx * 4) * 100)}% is left.` : d.kind === "sdt" ? "Move the line: further right means fewer false alarms but more misses." : d.kind === "forgetting" ? `About ${Math.round(here[1] * 100)}% is remembered at this point without revision.` : `Here: ${Math.round(here[1] * 100)}% of the peak.`;
  return (
    <WidgetFrame label="Curve" title={d.title} caption={d.caption} testID="w-curve">
      <SketchSheet name={`curve-${d.kind}`} w={W} h={h} label={`${d.title ? plain(d.title) : d.kind} curve: ${yLabel} against ${xLabel}`}>
        <L k="cv-x" x1={pad.l} y1={h - pad.b} x2={W - pad.r} y2={h - pad.b} sw={1.4} />
        <L k="cv-y" x1={pad.l} y1={pad.t} x2={pad.l} y2={h - pad.b} sw={1.4} />
        <Cv k={`cv-a-${d.kind}`} pts={a.map(([x, y]) => [sx(x), sy(y)])} stroke={C.blue} sw={2.4} />
        {b ? <Cv k={`cv-b-${d.kind}`} pts={b.map(([x, y]) => [sx(x), sy(y)])} stroke={C.red} sw={2.4} /> : null}
        <L k={`cv-m`} x1={sx(mx)} y1={pad.t} x2={sx(mx)} y2={h - pad.b} stroke={C.ink} sw={1.2} dash="4 4" single />
        {d.kind !== "sdt" ? <E k="cv-dot" cx={sx(here[0])} cy={sy(here[1])} w={9} h={9} fill={C.lime} fillStyle="solid" sw={1.4} /> : null}
        <Label x={(pad.l + W - pad.r) / 2} y={h - 10} size={12} anchor="middle" bold={false} color={C.soft}>
          {xLabel}
        </Label>
        <Label x={pad.l + 6} y={pad.t + 10} size={12} bold={false} color={C.soft}>
          {yLabel}
        </Label>
      </SketchSheet>
      <Slider value={m} min={0} max={100} onChange={setM} label={`Move along ${xLabel}`} />
      <T v="small" tone="muted">
        {reading}
      </T>
    </WidgetFrame>
  );
}

/* ---------------------------------------------------------------- synapse */

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function Transmitter({ x, t, color }: { x: number; t: SharedValue<number>; color: string }) {
  const props = useAnimatedProps(() => ({ cy: 92 + t.value * 64, opacity: t.value > 0 && t.value < 1 ? 1 : 0.0001 }));
  return <AnimatedCircle cx={x} r={4} fill={color} animatedProps={props} />;
}

const DRUG: Record<SynapseData["drug"], { name: string; what: string }> = {
  none: { name: "No medicine", what: "Serotonin is released, binds, then is pumped back into the first cell and broken down." },
  ssri: { name: "SSRI", what: "The reuptake pump is blocked, so serotonin stays in the gap longer and keeps binding." },
  snri: { name: "SNRI", what: "Serotonin and noradrenaline pumps are both blocked, so both stay in the gap longer." },
  maoi: { name: "MAOI", what: "The enzyme that breaks serotonin down is blocked, so more is stored and released." },
};

export function SynapseWidget({ d }: { d: SynapseData }) {
  const c = useTheme();
  const reduce = useReducedMotion();
  const t = useSharedValue(0);
  const [fired, setFired] = React.useState(0);
  const fire = () => {
    haptic.select();
    t.set(0);
    t.set(withTiming(1, { duration: reduce ? 0 : 1400, easing: Easing.inOut(Easing.quad) }));
    setFired((n) => n + 1);
  };
  const drug = DRUG[d.drug] ?? DRUG.none;
  const blockPump = d.drug === "ssri" || d.drug === "snri";
  return (
    <WidgetFrame label="Synapse" title={`What ${drug.name === "No medicine" ? "happens at a synapse" : `an ${drug.name} does`}`} caption={d.caption} testID="w-synapse">
      <SketchSheet name={`synapse-${d.drug}`} w={W} h={230} label={`A synapse. ${drug.what}`}>
        <P k="syn-pre" d="M40 20 L280 20 L280 70 Q160 110 40 70 Z" fill={C.wash} fillStyle="solid" sw={2} />
        <P k="syn-post" d="M40 210 L280 210 L280 168 Q160 140 40 168 Z" fill={C.wash} fillStyle="solid" sw={2} />
        {[100, 140, 180, 220].map((x, i) => (
          <E key={x} k={`syn-v${i}`} cx={x} cy={52} w={22} h={22} fill={C.paper} fillStyle="solid" sw={1.4} />
        ))}
        {[110, 160, 210].map((x, i) => (
          <R key={x} k={`syn-r${i}`} x={x - 8} y={150} w={16} h={12} fill={C.blue} fillStyle="solid" sw={1.2} />
        ))}
        <R k="syn-pump" x={262} y={70} w={18} h={22} fill={blockPump ? C.red : C.lime} fillStyle="solid" sw={1.4} />
        {blockPump ? <L k="syn-pump-x" x1={256} y1={66} x2={286} y2={96} stroke={C.ink} sw={2.4} /> : null}
        {d.drug === "maoi" ? (
          <>
            <E k="syn-mao" cx={64} cy={44} w={26} h={18} fill={C.red} fillStyle="solid" sw={1.2} />
            <L k="syn-mao-x" x1={52} y1={34} x2={76} y2={54} stroke={C.ink} sw={2.4} />
          </>
        ) : null}
        <Label x={160} y={16} size={12} anchor="middle" bold={false} color={C.soft}>
          first cell
        </Label>
        <Label x={160} y={226} size={12} anchor="middle" bold={false} color={C.soft}>
          next cell
        </Label>
        {[112, 136, 160, 184, 208].map((x) => (
          <Transmitter key={x} x={x} t={t} color={c.sk.blue} />
        ))}
      </SketchSheet>
      <T>{drug.what}</T>
      <Button kind="quiet" label={fired ? "Send another signal" : "Send a signal"} onPress={fire} testID="synapse-fire" />
    </WidgetFrame>
  );
}

/* ----------------------------------------------------------------- figure */

/** Light up one part of the server's figure SVG: shapes and lines that carry its id. */
export function highlight(svg: string, id: string | null, color: string): string {
  if (!id) return svg;
  return svg.replace(new RegExp(`data-(part|line)="${id.replace(/[^a-zA-Z0-9_-]/g, "")}"`, "g"), (m) => `${m} stroke="${color}" stroke-width="3.5"`);
}

export function FigureWidget({ d }: { d: FigureData }) {
  const c = useTheme();
  const q = useFigure(d.id);
  const [on, setOn] = React.useState<string | null>(d.focus?.[0] ?? null);
  const [shown, setShown] = React.useState<Set<string>>(new Set());
  if (!q.data) {
    return (
      <WidgetFrame label="Figure" title={d.title} testID="w-figure">
        {q.isError ? <T tone="muted">The drawing could not load. Check your internet.</T> : <Skeleton h={180} r={12} />}
      </WidgetFrame>
    );
  }
  const f = q.data;
  const [, , vw, vh] = f.viewBox.split(/\s+/).map(Number);
  const xml = highlight(c.dark ? f.svg.dark : f.svg.light, on, c.sk.blue);
  return (
    <WidgetFrame label={d.quiz ? "Name the parts" : "Figure"} title={d.title ?? f.title} caption={d.caption ?? f.summary} testID="w-figure">
      <View accessible accessibilityRole="image" accessibilityLabel={`${f.title}. ${f.labels.map((l) => l.name).join(", ")}`} style={{ width: "100%", aspectRatio: (vw || 320) / (vh || 180), backgroundColor: c.sk.paper, borderRadius: 12 }}>
        <SvgXml xml={xml} width="100%" height="100%" />
      </View>
      <RowList>
        {f.labels.map((l, i) => {
          const hidden = d.quiz && !shown.has(l.id);
          return (
            <Row
              key={l.id}
              title={hidden ? `Part ${i + 1}: tap to name it` : l.name}
              meta={hidden ? undefined : l.about}
              current={on === l.id}
              chevron={false}
              onPress={() => {
                haptic.select();
                setOn(l.id);
                if (d.quiz) setShown((s) => new Set(s).add(l.id));
              }}
            />
          );
        })}
      </RowList>
    </WidgetFrame>
  );
}
