import type { PrepVisual, Subject } from "@/lib/prep/types";
import type { CompareData, ExperimentData, FlowData, LayersData, TimelineData, WidgetKind, WorkedData } from "@/lib/study/types";

/**
 * Exam Prep diagrams: one shared picture per idea ("concept"), attached to the
 * questions whose answer it explains. A concept carries its picture and the
 * rule that finds its questions (used by scripts/prep-visuals-assign.ts to
 * write assigned.ts). Student text rules: plain English, no em or en dashes,
 * no citations.
 */

/** Which questions a concept can explain: subject, an optional topic pattern, and a pattern the stem, statements, lists or key must contain. */
export type Rule = { s: readonly Subject[]; re: RegExp; t?: RegExp; not?: RegExp };
export type Concept = { id: string; r: Rule; v: PrepVisual };

export const R = (s: readonly Subject[], re: RegExp, t?: RegExp, not?: RegExp): Rule => ({ s, re, ...(t ? { t } : {}), ...(not ? { not } : {}) });

export const concept = (id: string, r: Rule, kind: WidgetKind, data: unknown): Concept => ({ id, r, v: { kind, data } });

type Node = [label: string, detail?: string];

const nodes = (list: Node[]) => list.map(([label, detail], k) => ({ id: `n${k + 1}`, label, ...(detail ? { detail } : {}) }));

/** A process in order. */
export const chain = (title: string, list: Node[], caption?: string): FlowData => ({ title, layout: "chain", nodes: nodes(list), ...(caption ? { caption } : {}) });
/** A loop that keeps itself going (keep to 6 boxes or fewer, short labels). */
export const cycle = (title: string, list: Node[], caption?: string): FlowData => ({ title, layout: "cycle", nodes: nodes(list), ...(caption ? { caption } : {}) });
/** A classification: [id, label, detail, parent id]. The first row is the root. */
export const tree = (title: string, list: [id: string, label: string, detail?: string, parent?: string][], caption?: string): FlowData => ({
  title,
  layout: "tree",
  nodes: list.map(([id, label, detail, parent]) => ({ id, label, ...(detail ? { detail } : {}), ...(parent ? { parent } : {}) })),
  ...(caption ? { caption } : {}),
});
export const cmp = (title: string, a: [label: string, points: string[], summary: string], b: [label: string, points: string[], summary: string], caption?: string): CompareData => ({
  title,
  a: { label: a[0], points: a[1], summary: a[2] },
  b: { label: b[0], points: b[1], summary: b[2] },
  ...(caption ? { caption } : {}),
});
/** Events in the correct order (the widget shuffles them). */
export const tl = (prompt: string, events: [label: string, when?: string][], why?: string): TimelineData => ({ prompt, events: events.map(([label, when]) => ({ label, ...(when ? { when } : {}) })), ...(why ? { why } : {}) });
/** A classic study replayed: real results only. */
export const xp = (title: string, question: string, unit: string, conditions: [label: string, value: number, note?: string][], why?: string, max?: number): ExperimentData => ({
  title,
  question,
  unit,
  conditions: conditions.map(([label, value, note]) => ({ label, value, ...(note ? { note } : {}) })),
  ...(why ? { why } : {}),
  ...(max ? { max } : {}),
});
export const wk = (title: string, steps: [q: string, a: string][], yourTurn?: [q: string, a: string][]): WorkedData => ({ title, steps: steps.map(([q, a]) => ({ q, a })), ...(yourTurn ? { yourTurn: yourTurn.map(([q, a]) => ({ q, a })) } : {}) });
export const ly = (title: string, shape: LayersData["shape"], layers: [label: string, detail: string][], caption?: string): LayersData => ({ title, shape, layers: layers.map(([label, detail]) => ({ label, detail })), ...(caption ? { caption } : {}) });
export const bm = (title: string, notes: Record<string, string>, caption?: string) => ({ title, focus: Object.keys(notes), notes, ...(caption ? { caption } : {}) });
