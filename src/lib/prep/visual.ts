/**
 * Diagrams attached to Exam Prep explanations and model answers: which ones
 * can be drawn, and where each goes inside a long answer. Pure.
 */
import { WIDGETS } from "@/lib/study/parse";
import type { PrepVisual } from "./types";

/** A known Study widget kind with object data. Anything else is skipped, never drawn. */
export function isRenderableVisual(v: unknown): v is PrepVisual {
  if (!v || typeof v !== "object") return false;
  const x = v as { kind?: unknown; data?: unknown; caption?: unknown };
  if (typeof x.kind !== "string" || !WIDGETS.has(x.kind as PrepVisual["kind"])) return false;
  if (!x.data || typeof x.data !== "object") return false;
  return x.caption === undefined || typeof x.caption === "string";
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** The words a visual names, to find its heading: the caption, then any title in its data. */
function visualLabel(v: PrepVisual): string {
  const title = (v.data as { title?: unknown }).title;
  return norm([v.caption ?? "", typeof title === "string" ? title : ""].join(" "));
}

/**
 * Where each visual goes in a long answer with these headings: after the
 * heading its caption or title names (whole heading words found in it, or it
 * in the heading), else at the end. Returns heading index per visual, or -1
 * for the end. Each heading takes at most one visual, in order.
 */
export function placeVisuals(headings: readonly string[], visuals: readonly PrepVisual[]): number[] {
  const hs = headings.map(norm);
  const used = new Set<number>();
  return visuals.map((v) => {
    const label = visualLabel(v);
    if (!label) return -1;
    const i = hs.findIndex((h, k) => !used.has(k) && h.length > 2 && (label.includes(h) || h.includes(label)));
    if (i < 0) return -1;
    used.add(i);
    return i;
  });
}
