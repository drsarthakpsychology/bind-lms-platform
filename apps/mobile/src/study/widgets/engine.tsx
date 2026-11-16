import { ChevronLeft, ChevronRight } from "lucide-react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import { G } from "react-native-svg";

import { Chips } from "@/ds/parts";
import { T } from "@/ds/text";
import { Swap } from "@/motion";
import { Arrow, C, E, Label, R, SketchSheet, fit, plain, wrap } from "@/sketch/ink";
import { layout, space, useTheme } from "@/theme";
import { Rich } from "../rich";
import { WidgetFrame } from "./frame";

/**
 * The engine behind the step-through explainers (the website's animated
 * scenes): a hand-drawn diagram of parts joined by arrows, a row of steps,
 * and the words for the current step. A step lights up the parts it is
 * about (lime) and the arrows it follows (blue). Tapping a part jumps to
 * the first step about it. Optional variants (a route, a model, a type)
 * swap the whole set of steps. Everything is also said in words, so the
 * drawing is never the only way to learn it.
 */

export type SceneNode = { id: string; label: string; x: number; y: number; w?: number; h?: number; round?: boolean };
export type SceneStep = { id: string; name: string; text: string; on: string[]; flow?: [string, string][] };
export type SceneDef = { w: number; h: number; nodes: SceneNode[]; links?: [string, string][]; steps: SceneStep[]; extra?: React.ReactNode };

function nodeBox(n: SceneNode) {
  const w = n.w ?? 104;
  const f = fit(plain(n.label), w - 14, 3, [14, 12]) ?? { lines: wrap(n.label, w - 14, 12), size: 12 };
  const h = n.h ?? 16 + f.lines.length * Math.round(f.size * 1.15);
  return { w, h, ...f };
}

/** Where an arrow between two boxes should start and end: on their edges, not their centres. */
export function edgePoints(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }): [[number, number], [number, number]] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const cut = (n: { w: number; h: number }) => {
    const sx = dx === 0 ? Infinity : n.w / 2 / Math.abs(dx);
    const sy = dy === 0 ? Infinity : n.h / 2 / Math.abs(dy);
    return Math.min(sx, sy) + 0.04;
  };
  const ca = cut(a);
  const cb = cut(b);
  return [
    [a.x + dx * ca, a.y + dy * ca],
    [b.x - dx * cb, b.y - dy * cb],
  ];
}

export function SceneArt({ name, def, step, onNode, label }: { name: string; def: SceneDef; step: SceneStep | null; onNode?: (id: string) => void; label: string }) {
  const boxes = new Map(def.nodes.map((n) => [n.id, { ...n, ...nodeBox(n) }]));
  const lit = new Set(step?.on ?? []);
  const flows = new Set((step?.flow ?? []).map(([a, b]) => `${a}>${b}`));
  return (
    <SketchSheet name={name} w={def.w} h={def.h} label={label}>
      {def.extra}
      {(def.links ?? []).map(([a, b]) => {
        const A = boxes.get(a);
        const B = boxes.get(b);
        if (!A || !B) return null;
        const [from, to] = edgePoints(A, B);
        const on = flows.has(`${a}>${b}`);
        return <Arrow key={`${a}-${b}`} k={`${name}-${a}-${b}`} from={from} to={to} stroke={on ? C.blue : C.soft} sw={on ? 2.4 : 1.5} />;
      })}
      {[...boxes.values()].map((n) => {
        const on = lit.has(n.id);
        return (
          <G
            key={n.id}
            onPress={
              onNode
                ? () => {
                    onNode(n.id);
                  }
                : undefined
            }
          >
            {n.round ? (
              <E k={`${name}-${n.id}`} cx={n.x} cy={n.y} w={n.w} h={n.h + 8} fill={on ? C.lime : C.paper} fillStyle="solid" sw={on ? 2.2 : 1.6} />
            ) : (
              <R k={`${name}-${n.id}`} x={n.x - n.w / 2} y={n.y - n.h / 2} w={n.w} h={n.h} fill={on ? C.lime : C.paper} fillStyle="solid" sw={on ? 2.2 : 1.6} />
            )}
            <Label x={n.x} y={n.y - ((n.lines.length - 1) * n.size * 1.15) / 2 + n.size * 0.36} lines={n.lines} size={n.size} anchor="middle" color={on ? C.onLime : C.ink} />
          </G>
        );
      })}
    </SketchSheet>
  );
}

/** Back, the step name with "2 of 5", Next; and a row of dots to jump. */
export function StepPicker({ steps, i, onPick }: { steps: { name: string }[]; i: number; onPick: (i: number) => void }) {
  const c = useTheme();
  const go = (n: number) => {
    if (n < 0 || n >= steps.length) return;
    onPick(n);
  };
  const btn = (dir: -1 | 1) => (
    <Pressable accessibilityRole="button" accessibilityLabel={dir < 0 ? "Previous step" : "Next step"} accessibilityState={{ disabled: dir < 0 ? i === 0 : i === steps.length - 1 }} onPress={() => go(i + dir)} style={{ width: layout.target, height: layout.target, borderRadius: layout.target / 2, borderWidth: 1.5, borderColor: c.cardLine, alignItems: "center", justifyContent: "center", opacity: (dir < 0 ? i === 0 : i === steps.length - 1) ? 0.35 : 1 }} testID={dir < 0 ? "step-prev" : "step-next"}>
      {dir < 0 ? <ChevronLeft size={22} color={c.ink} /> : <ChevronRight size={22} color={c.ink} />}
    </Pressable>
  );
  return (
    <View style={{ gap: space[2] }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
        {btn(-1)}
        <View style={{ flex: 1, alignItems: "center" }}>
          <T v="bodyStrong" center>
            {steps[i]?.name}
          </T>
          <T v="caption" tone="muted" num>
            {i + 1} of {steps.length}
          </T>
        </View>
        {btn(1)}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: space[1] }} accessibilityRole="tablist">
        {steps.map((s, n) => (
          <Pressable key={n} accessibilityRole="tab" accessibilityLabel={s.name} accessibilityState={{ selected: n === i }} onPress={() => go(n)} hitSlop={10} style={{ width: 22, height: 24, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: n === i ? 18 : 8, height: 8, borderRadius: 4, backgroundColor: n === i ? (c.dark ? c.primary : c.ink) : c.cardLine }} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/** The words for the current step: fades in on change, read out by screen readers. */
export function StepText({ text, k }: { text: string; k: string }) {
  return (
    <Swap k={k} accessibilityLiveRegion="polite">
      <Rich text={text} v="reading" />
    </Swap>
  );
}

export type Variant = { id: string; name: string; def: SceneDef };

/** A whole step-through explainer, with optional variants. */
export function StepScene({ name, label = "Step through it", title, caption, variants, start, testID }: { name: string; label?: string; title?: string; caption?: string; variants: Variant[]; start?: string; testID?: string }) {
  const [vid, setVid] = React.useState(start && variants.some((v) => v.id === start) ? start : variants[0]!.id);
  const [i, setI] = React.useState(0);
  const v = variants.find((x) => x.id === vid) ?? variants[0]!;
  const step = v.def.steps[Math.min(i, v.def.steps.length - 1)]!;
  return (
    <WidgetFrame label={label} title={title} caption={caption} testID={testID ?? `w-${name}`}>
      {variants.length > 1 ? (
        <Chips
          scroll
          label="Show"
          options={variants.map((x) => ({ id: x.id, name: x.name }))}
          value={vid}
          onChange={(id) => {
            setVid(id);
            setI(0);
          }}
        />
      ) : null}
      <SceneArt
        name={`${name}-${v.id}`}
        def={v.def}
        step={step}
        label={`${title ? plain(title) + ". " : ""}${step.name}`}
        onNode={(id) => {
          const n = v.def.steps.findIndex((s) => s.on.includes(id));
          if (n >= 0) setI(n);
        }}
      />
      <StepPicker steps={v.def.steps} i={Math.min(i, v.def.steps.length - 1)} onPick={setI} />
      <StepText text={step.text} k={`${v.id}-${step.id}`} />
    </WidgetFrame>
  );
}

/** A choice explainer: pick one option, the drawing and the words change. */
export function ChoiceScene({ name, label = "Try it", title, caption, options, art, testID, start }: { name: string; label?: string; title?: string; caption?: string; options: { id: string; name: string; text: string }[]; art: (id: string) => React.ReactNode; testID?: string; start?: string }) {
  const [pick, setPick] = React.useState(start ?? options[0]!.id);
  const o = options.find((x) => x.id === pick) ?? options[0]!;
  return (
    <WidgetFrame label={label} title={title} caption={caption} testID={testID ?? `w-${name}`}>
      {art(o.id)}
      <Chips label="Choose" options={options.map((x) => ({ id: x.id, name: x.name }))} value={o.id} onChange={setPick} />
      <StepText text={`**${o.name}.** ${o.text}`} k={o.id} />
    </WidgetFrame>
  );
}
